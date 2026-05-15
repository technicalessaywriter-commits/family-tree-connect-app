import mongoose from "mongoose";
import { Member } from "../models/Member.js";
import type { RelationshipType } from "../types.js";

const inverse: Record<RelationshipType, RelationshipType> = {
  parent: "child",
  child: "parent",
  sibling: "sibling",
  spouse: "spouse",
  grandparent: "child"
};

const generationDelta: Partial<Record<RelationshipType, number>> = {
  parent: 1,
  child: -1,
  grandparent: 2
};

export async function validateRelationship(
  sourceId: string,
  targetId: string,
  type: RelationshipType
) {
  if (sourceId === targetId) throw new Error("A member cannot be related to themselves");

  const [source, target] = await Promise.all([Member.findById(sourceId), Member.findById(targetId)]);
  if (!source || !target) throw new Error("Member not found");
  if (source.tree.toString() !== target.tree.toString()) throw new Error("Members must belong to the same tree");

  if (source.deathDate && target.birthDate && source.deathDate < target.birthDate && type === "child") {
    throw new Error("A child relationship cannot be created after the source member's death");
  }

  if (source.birthDate && target.birthDate) {
    const years = Math.abs(source.birthDate.getFullYear() - target.birthDate.getFullYear());
    if ((type === "parent" || type === "child") && years < 12) {
      throw new Error("Parent and child ages are too close to be plausible");
    }
    if (type === "grandparent" && years < 25) {
      throw new Error("Grandparent age gap is too small to be plausible");
    }
  }
}

export async function syncRelationship(sourceId: string, targetId: string, type: RelationshipType) {
  await validateRelationship(sourceId, targetId, type);
  const targetObjectId = new mongoose.Types.ObjectId(targetId);
  const sourceObjectId = new mongoose.Types.ObjectId(sourceId);

  await Member.updateOne(
    { _id: sourceId, "relationships.member": { $ne: targetObjectId } },
    { $push: { relationships: { type, member: targetObjectId } } }
  );
  await Member.updateOne(
    { _id: targetId, "relationships.member": { $ne: sourceObjectId } },
    { $push: { relationships: { type: inverse[type], member: sourceObjectId } } }
  );

  const delta = generationDelta[type];
  if (delta !== undefined) {
    const source = await Member.findById(sourceId);
    if (source) await Member.updateOne({ _id: targetId }, { $set: { generation: source.generation - delta } });
  }
}
