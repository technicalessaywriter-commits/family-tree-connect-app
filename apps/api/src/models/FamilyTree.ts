import mongoose, { Schema } from "mongoose";
import type { Role } from "../types.js";

const collaboratorSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "editor", "viewer"], default: "viewer" satisfies Role }
  },
  { _id: false }
);

const inviteSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ["admin", "editor", "viewer"], default: "viewer" },
    token: { type: String, required: true },
    acceptedAt: Date,
    expiresAt: Date
  },
  { timestamps: true }
);

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: String
  },
  { timestamps: true }
);

export interface FamilyTreeDocument extends mongoose.Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  collaborators: { user: mongoose.Types.ObjectId; role: Role }[];
  invites: { email: string; role: Role; token: string; acceptedAt?: Date; expiresAt?: Date }[];
  events: { title: string; date: Date; description?: string }[];
}

const familyTreeSchema = new Schema<FamilyTreeDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [collaboratorSchema],
    invites: [inviteSchema],
    events: [eventSchema]
  },
  { timestamps: true }
);

export const FamilyTree = mongoose.model<FamilyTreeDocument>("FamilyTree", familyTreeSchema);
