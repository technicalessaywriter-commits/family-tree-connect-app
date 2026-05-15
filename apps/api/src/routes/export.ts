import { Router } from "express";
import { FamilyTree } from "../models/FamilyTree.js";
import { Member } from "../models/Member.js";
import { requireAuth, requireTreeRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

interface ImportMember {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  deathDate?: string;
  biography?: string;
  photoUrl?: string;
  generation?: number;
  position?: { x: number; y: number };
}

router.get("/:id/json", requireTreeRole(["admin", "editor", "viewer"]), async (req, res) => {
  const [tree, members] = await Promise.all([FamilyTree.findById(req.params.id), Member.find({ tree: req.params.id })]);
  res.setHeader("Content-Disposition", `attachment; filename=family-tree-${req.params.id}.json`);
  res.json({ tree, members, exportedAt: new Date().toISOString() });
});

router.post("/:id/import", requireTreeRole(["admin"]), async (req, res) => {
  const members: ImportMember[] = Array.isArray(req.body.members) ? req.body.members : [];
  const sanitized = members.map((member) => ({
    tree: req.params.id,
    fullName: member.fullName,
    gender: member.gender ?? "unknown",
    birthDate: member.birthDate,
    deathDate: member.deathDate,
    biography: member.biography ?? "",
    photoUrl: member.photoUrl,
    generation: member.generation ?? 0,
    position: member.position ?? { x: 0, y: 0 },
    relationships: []
  }));
  await Member.deleteMany({ tree: req.params.id });
  const imported = await Member.insertMany(sanitized);
  res.status(201).json(imported);
});

export default router;
