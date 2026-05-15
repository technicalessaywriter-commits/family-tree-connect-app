import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { AuthedRequest, Role } from "../types.js";
import type { NextFunction, Response } from "express";
import { FamilyTree } from "../models/FamilyTree.js";

export function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    req.user = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireTreeRole(roles: Role[]) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    const treeId = req.params.treeId ?? req.params.id;
    const tree = await FamilyTree.findById(treeId);
    if (!tree) return res.status(404).json({ message: "Family tree not found" });
    const userId = req.user.id;
    const owner = tree.owner.toString() === userId;
    const role = owner ? "admin" : tree.collaborators.find((c) => c.user.toString() === userId)?.role;
    if (!role || !roles.includes(role)) return res.status(403).json({ message: "Insufficient permission" });
    res.locals.tree = tree;
    res.locals.role = role;
    next();
  };
}
