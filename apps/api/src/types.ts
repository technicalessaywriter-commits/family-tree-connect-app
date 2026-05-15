import type { Request } from "express";

export type Role = "admin" | "editor" | "viewer";
export type Gender = "female" | "male" | "nonbinary" | "unknown";
export type RelationshipType = "parent" | "child" | "sibling" | "spouse" | "grandparent";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}
