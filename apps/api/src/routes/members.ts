import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { z } from "zod";
import { Member } from "../models/Member.js";
import { requireAuth, requireTreeRole } from "../middleware/auth.js";
import { syncRelationship } from "../services/relationships.js";
import { uploadProfilePhoto } from "../services/upload.js";

const router = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(requireAuth);
router.use(requireTreeRole(["admin", "editor", "viewer"]));

const writableRoles = ["admin", "editor"];
function requireWritable(_req: Request, res: Response, next: NextFunction) {
  if (!writableRoles.includes(res.locals.role)) return res.status(403).json({ message: "Insufficient permission" });
  next();
}

router.get("/", async (req, res) => {
  const { q, generation } = req.query;
  const query: Record<string, unknown> = { tree: req.params.treeId };
  if (q) query.$text = { $search: String(q) };
  if (generation !== undefined && generation !== "") query.generation = Number(generation);
  const members = await Member.find(query).sort({ generation: 1, birthDate: 1 });
  res.json(members);
});

router.post("/", requireWritable, upload.single("photo"), async (req, res) => {
  const parsed = z.object({
    fullName: z.string().min(2),
    gender: z.enum(["female", "male", "nonbinary", "unknown"]),
    birthDate: z.coerce.date(),
    deathDate: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
    biography: z.string().optional(),
    generation: z.coerce.number().optional(),
    x: z.coerce.number().optional(),
    y: z.coerce.number().optional()
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid member data", issues: parsed.error.issues });
  const photoUrl = await uploadProfilePhoto(req.file);
  const member = await Member.create({
    tree: req.params.treeId,
    ...parsed.data,
    photoUrl,
    position: { x: parsed.data.x ?? 0, y: parsed.data.y ?? 0 }
  });
  res.status(201).json(member);
});

router.patch("/:memberId", requireWritable, upload.single("photo"), async (req, res) => {
  const parsed = z.object({
    fullName: z.string().min(2).optional(),
    gender: z.enum(["female", "male", "nonbinary", "unknown"]).optional(),
    birthDate: z.coerce.date().optional(),
    deathDate: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
    biography: z.string().optional(),
    generation: z.coerce.number().optional(),
    x: z.coerce.number().optional(),
    y: z.coerce.number().optional()
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid member data" });
  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.x !== undefined || parsed.data.y !== undefined) update.position = { x: parsed.data.x ?? 0, y: parsed.data.y ?? 0 };
  const photoUrl = await uploadProfilePhoto(req.file);
  if (photoUrl) update.photoUrl = photoUrl;
  const member = await Member.findOneAndUpdate({ _id: req.params.memberId, tree: req.params.treeId }, update, { new: true });
  res.json(member);
});

router.delete("/:memberId", requireWritable, async (req, res) => {
  await Promise.all([
    Member.findOneAndDelete({ _id: req.params.memberId, tree: req.params.treeId }),
    Member.updateMany({ tree: req.params.treeId }, { $pull: { relationships: { member: req.params.memberId } } })
  ]);
  res.status(204).send();
});

router.post("/:memberId/relationships", requireWritable, async (req, res) => {
  const parsed = z.object({
    targetId: z.string().min(1),
    type: z.enum(["parent", "child", "sibling", "spouse", "grandparent"])
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid relationship" });
  try {
    await syncRelationship(req.params.memberId, parsed.data.targetId, parsed.data.type);
    const members = await Member.find({ tree: req.params.treeId });
    res.status(201).json(members);
  } catch (error) {
    res.status(422).json({ message: error instanceof Error ? error.message : "Invalid relationship" });
  }
});

export default router;
