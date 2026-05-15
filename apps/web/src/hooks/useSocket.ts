import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:4000";

export function useSocket(treeId?: string, onUpdate?: () => void) {
  useEffect(() => {
    if (!treeId) return;
    const socket = io(SOCKET_URL);
    socket.emit("tree:join", treeId);
    socket.on("tree:updated", () => onUpdate?.());
    return () => {
      socket.disconnect();
    };
  }, [treeId, onUpdate]);
}
