import { format } from "date-fns";
import { Calendar, UserRound } from "lucide-react";
import type { Member } from "../types";

export function MemberCard({ member, onEdit }: { member: Member; onEdit?: (member: Member) => void }) {
  return (
    <button className="w-72 rounded-lg border border-ink/10 bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#20251f]" onClick={() => onEdit?.(member)}>
      <div className="flex gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md bg-fern/20">
          {member.photoUrl ? <img alt="" src={member.photoUrl} className="h-full w-full object-cover" /> : <UserRound className="text-moss" />}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{member.fullName}</h3>
          <p className="text-sm capitalize text-ink/60 dark:text-paper/60">{member.gender}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-ink/60 dark:text-paper/60">
            <Calendar size={14} />
            {format(new Date(member.birthDate), "yyyy")} {member.deathDate ? `- ${format(new Date(member.deathDate), "yyyy")}` : ""}
          </p>
        </div>
      </div>
      {member.biography && <p className="mt-3 line-clamp-3 text-sm text-ink/70 dark:text-paper/70">{member.biography}</p>}
    </button>
  );
}
