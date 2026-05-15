import crypto from "crypto";
import { Router } from "express";
import { z } from "zod";
import { FamilyTree } from "../models/FamilyTree.js";
import { Member } from "../models/Member.js";
import { requireAuth, requireTreeRole } from "../middleware/auth.js";
import type { AuthedRequest } from "../types.js";
import { sendInvite } from "../services/mail.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthedRequest, res) => {
  const trees = await FamilyTree.find({
    $or: [{ owner: req.user!.id }, { "collaborators.user": req.user!.id }]
  }).sort({ updatedAt: -1 });
  res.json(trees);
});

router.post("/", async (req: AuthedRequest, res) => {
  const parsed = z.object({ name: z.string().min(2), description: z.string().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid tree data", issues: parsed.error.issues });
  const tree = await FamilyTree.create({ ...parsed.data, owner: req.user!.id });
  res.status(201).json(tree);
});

router.get("/:id", requireTreeRole(["admin", "editor", "viewer"]), async (_req, res) => {
  const tree = res.locals.tree;
  const members = await Member.find({ tree: tree.id }).sort({ generation: 1, birthDate: 1 });
  res.json({ tree, members });
});

router.patch("/:id", requireTreeRole(["admin", "editor"]), async (req, res) => {
  const parsed = z.object({ name: z.string().min(2).optional(), description: z.string().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid tree data" });
  const tree = await FamilyTree.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  res.json(tree);
});

router.delete("/:id", requireTreeRole(["admin"]), async (req, res) => {
  await Promise.all([FamilyTree.findByIdAndDelete(req.params.id), Member.deleteMany({ tree: req.params.id })]);
  res.status(204).send();
});

router.post("/:id/invites", requireTreeRole(["admin"]), async (req, res) => {
  const parsed = z.object({ email: z.string().email(), role: z.enum(["admin", "editor", "viewer"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid invite" });
  const token = crypto.randomBytes(24).toString("hex");
  const tree = await FamilyTree.findByIdAndUpdate(
    req.params.id,
    { $push: { invites: { ...parsed.data, token, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) } } },
    { new: true }
  );
  await sendInvite(parsed.data.email, tree!.name, token);
  res.status(201).json({ token });
});

router.post("/:id/events", requireTreeRole(["admin", "editor"]), async (req, res) => {
  const parsed = z.object({ title: z.string().min(2), date: z.coerce.date(), description: z.string().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid event" });
  const tree = await FamilyTree.findByIdAndUpdate(req.params.id, { $push: { events: parsed.data } }, { new: true });
  res.status(201).json(tree?.events.at(-1));
});

export default router;
