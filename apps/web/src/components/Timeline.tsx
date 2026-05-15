import { format } from "date-fns";
import type { Member } from "../types";

export function Timeline({ members }: { members: Member[] }) {
  const events = members
    .flatMap((member) => [
      { date: member.birthDate, label: `${member.fullName} born`, type: "Birth" },
      ...(member.deathDate ? [{ date: member.deathDate, label: `${member.fullName} died`, type: "Death" }] : [])
    ])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 dark:border-white/10 dark:bg-white/10">
      <h2 className="mb-4 text-lg font-semibold">Timeline</h2>
      <div className="max-h-80 space-y-3 overflow-auto pr-2">
        {events.map((event, index) => (
          <div key={`${event.label}-${index}`} className="flex gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-gold" />
            <div>
              <p className="text-sm font-semibold">{event.label}</p>
              <p className="text-xs text-ink/60 dark:text-paper/60">{event.type} · {format(new Date(event.date), "MMM d, yyyy")}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
