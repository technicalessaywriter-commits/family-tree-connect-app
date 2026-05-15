export type Role = "admin" | "editor" | "viewer";
export type Gender = "female" | "male" | "nonbinary" | "unknown";
export type RelationshipType = "parent" | "child" | "sibling" | "spouse" | "grandparent";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FamilyTree {
  _id: string;
  name: string;
  description?: string;
  events: FamilyEvent[];
}

export interface FamilyEvent {
  _id?: string;
  title: string;
  date: string;
  description?: string;
}

export interface Member {
  _id: string;
  fullName: string;
  gender: Gender;
  birthDate: string;
  deathDate?: string;
  biography?: string;
  photoUrl?: string;
  generation: number;
  position: { x: number; y: number };
  relationships: { type: RelationshipType; member: string }[];
}
