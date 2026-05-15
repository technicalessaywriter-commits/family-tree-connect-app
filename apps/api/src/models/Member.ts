import mongoose, { Schema } from "mongoose";
import type { Gender, RelationshipType } from "../types.js";

const relationshipSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["parent", "child", "sibling", "spouse", "grandparent"],
      required: true
    },
    member: { type: Schema.Types.ObjectId, ref: "Member", required: true }
  },
  { _id: false }
);

export interface MemberDocument extends mongoose.Document {
  tree: mongoose.Types.ObjectId;
  fullName: string;
  gender: Gender;
  birthDate: Date;
  deathDate?: Date;
  biography?: string;
  photoUrl?: string;
  generation: number;
  position: { x: number; y: number };
  relationships: { type: RelationshipType; member: mongoose.Types.ObjectId }[];
}

const memberSchema = new Schema<MemberDocument>(
  {
    tree: { type: Schema.Types.ObjectId, ref: "FamilyTree", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["female", "male", "nonbinary", "unknown"], default: "unknown" },
    birthDate: { type: Date, required: true },
    deathDate: Date,
    biography: { type: String, default: "" },
    photoUrl: String,
    generation: { type: Number, default: 0 },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },
    relationships: [relationshipSchema]
  },
  { timestamps: true }
);

memberSchema.index({ fullName: "text", biography: "text" });

export const Member = mongoose.model<MemberDocument>("Member", memberSchema);
