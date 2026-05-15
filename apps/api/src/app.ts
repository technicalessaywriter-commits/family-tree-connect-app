import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import treeRoutes from "./routes/trees.js";
import memberRoutes from "./routes/members.js";
import exportRoutes from "./routes/export.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: config.clientUrl, credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 400 }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRoutes);
  app.use("/api/trees", treeRoutes);
  app.use("/api/trees/:treeId/members", memberRoutes);
  app.use("/api/export", exportRoutes);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Unexpected server error" });
  });

  return app;
}

export function createRealtimeServer(app = createApp()) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: config.clientUrl } });

  io.on("connection", (socket) => {
    socket.on("tree:join", (treeId: string) => socket.join(treeId));
    socket.on("tree:update", ({ treeId, payload }) => socket.to(treeId).emit("tree:updated", payload));
    socket.on("cursor:move", ({ treeId, cursor }) => socket.to(treeId).emit("cursor:moved", cursor));
  });

  return { httpServer, io };
}
