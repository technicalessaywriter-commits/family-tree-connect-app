import { Users, Layers, HeartPulse, CalendarDays } from "lucide-react";
import type { FamilyTree, Member } from "../types";
import { getStats } from "../lib/stats";

export function StatsDashboard({ tree, members }: { tree?: FamilyTree; members: Member[] }) {
  const stats = getStats(members);
  const cards = [
    { label: "Members", value: stats.total, icon: Users },
    { label: "Living", value: stats.living, icon: HeartPulse },
    { label: "Generations", value: stats.generations, icon: Layers },
    { label: "Events", value: tree?.events?.length ?? 0, icon: CalendarDays }
  ];
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-ink/10 bg-white p-4 dark:border-white/10 dark:bg-white/10">
          <card.icon className="mb-3 text-moss" size={22} />
          <p className="text-2xl font-bold">{card.value}</p>
          <p className="text-sm text-ink/60 dark:text-paper/60">{card.label}</p>
        </div>
      ))}
    </section>
  );
}
