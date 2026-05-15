import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/api";
import type { User } from "../types";
import { Button } from "./Button";
import { Input } from "./Input";

export function AuthPanel({ onAuth }: { onAuth: (user: User, token: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const payload = {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? "")
      };
      const response = mode === "login" ? await api.login(payload) : await api.signup(payload);
      onAuth(response.user, response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4 dark:bg-[#151815]">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/10"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ink dark:text-paper">Familia Connect</h1>
          <p className="mt-2 text-sm text-ink/70 dark:text-paper/70">Build, preserve, and collaborate on your family history.</p>
        </div>
        <div className="mb-4 grid grid-cols-2 rounded-md bg-ink/5 p-1 dark:bg-white/10">
          <button className={`rounded px-3 py-2 text-sm ${mode === "login" ? "bg-white shadow dark:bg-ink" : ""}`} onClick={() => setMode("login")}>Login</button>
          <button className={`rounded px-3 py-2 text-sm ${mode === "signup" ? "bg-white shadow dark:bg-ink" : ""}`} onClick={() => setMode("signup")}>Signup</button>
        </div>
        <form className="space-y-3" onSubmit={submit}>
          {mode === "signup" && <Input name="name" placeholder="Full name" minLength={2} required />}
          <Input name="email" placeholder="Email" type="email" required />
          <Input name="password" placeholder="Password" type="password" minLength={8} required />
          {error && <p className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
          <Button className="w-full" disabled={loading}>
            {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
            {loading ? "Please wait" : mode === "login" ? "Login" : "Create account"}
          </Button>
        </form>
      </motion.section>
    </main>
  );
}
