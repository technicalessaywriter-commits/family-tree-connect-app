import { differenceInYears, parseISO } from "date-fns";
import type { Member } from "../types";

export function getStats(members: Member[]) {
  const living = members.filter((member) => !member.deathDate).length;
  const generations = new Set(members.map((member) => member.generation)).size;
  const averageAge = members.length
    ? Math.round(
        members.reduce((sum, member) => {
          const end = member.deathDate ? parseISO(member.deathDate) : new Date();
          return sum + differenceInYears(end, parseISO(member.birthDate));
        }, 0) / members.length
      )
    : 0;
  return { living, generations, averageAge, total: members.length };
}
