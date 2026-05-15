import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext } from "react";
import type { User } from "../types";

export interface Session {
  token: string;
  user: User;
}

interface SessionContextValue {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  session,
  setSession,
  children
}: {
  session: Session | null;
  setSession: (session: Session | null) => void;
  children: ReactNode;
}) {
  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}

export async function getStoredSession() {
  const raw = await AsyncStorage.getItem("familia-connect-session");
  return raw ? (JSON.parse(raw) as Session) : null;
}

export async function storeSession(session: Session | null) {
  if (session) {
    await AsyncStorage.setItem("familia-connect-session", JSON.stringify(session));
  } else {
    await AsyncStorage.removeItem("familia-connect-session");
  }
}
