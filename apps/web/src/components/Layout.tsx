import { LogOut, Moon, Sun, Trees } from "lucide-react";
import type { ReactNode } from "react";
import type { User } from "../types";

export function Layout({
  user,
  dark,
  setDark,
  onLogout,
  children
}: {
  user: User;
  dark: boolean;
  setDark: (dark: boolean) => void;
  onLogout: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-[#151815] dark:text-paper">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur dark:border-white/10 dark:bg-[#151815]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-moss text-white">
              <Trees size={22} />
            </div>
            <div>
              <p className="font-bold">Familia Connect</p>
              <p className="text-xs text-ink/60 dark:text-paper/60">{user.email}</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-md border border-ink/10 dark:border-white/10" onClick={() => setDark(!dark)} title="Toggle theme">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-md border border-ink/10 dark:border-white/10" onClick={onLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
