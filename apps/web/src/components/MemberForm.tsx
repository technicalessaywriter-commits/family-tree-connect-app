import { FormEvent, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { api, memberFormData } from "../lib/api";
import type { Gender, Member, RelationshipType } from "../types";
import { Button } from "./Button";
import { Input, Textarea } from "./Input";

export function MemberForm({
  treeId,
  members,
  selected,
  onSaved,
  onDeleted
}: {
  treeId: string;
  members: Member[];
  selected?: Member;
  onSaved: (memberOrMembers: Member | Member[]) => void;
  onDeleted: (id: string) => void;
}) {
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const photo = data.get("photo") instanceof File ? data.get("photo") as File : null;
    const payload = memberFormData({
      fullName: String(data.get("fullName")),
      gender: String(data.get("gender")) as Gender,
      birthDate: String(data.get("birthDate")),
      deathDate: String(data.get("deathDate") || ""),
      biography: String(data.get("biography") ?? ""),
      generation: Number(data.get("generation") ?? 0),
      photo: photo?.size ? photo : null
    });
    try {
      const member = selected ? await api.updateMember(treeId, selected._id, payload) : await api.createMember(treeId, payload);
      onSaved(member);
      if (!selected) event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save member");
    }
  }

  async function relate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const data = new FormData(event.currentTarget);
    try {
      const updated = await api.relate(treeId, selected._id, {
        targetId: String(data.get("targetId")),
        type: String(data.get("type")) as RelationshipType
      });
      onSaved(updated);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Relationship rejected");
    }
  }

  async function remove() {
    if (!selected) return;
    await api.deleteMember(treeId, selected._id);
    onDeleted(selected._id);
  }

  return (
    <section className="space-y-4 rounded-lg border border-ink/10 bg-white p-4 dark:border-white/10 dark:bg-white/10">
      <h2 className="text-lg font-semibold">{selected ? "Edit member" : "Add member"}</h2>
      <form className="space-y-3" onSubmit={submit}>
        <Input name="fullName" placeholder="Full name" defaultValue={selected?.fullName} required />
        <select name="gender" defaultValue={selected?.gender ?? "unknown"} className="min-h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#20251f]">
          <option value="unknown">Unknown</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="nonbinary">Nonbinary</option>
        </select>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="birthDate" type="date" defaultValue={selected?.birthDate?.slice(0, 10)} required />
          <Input name="deathDate" type="date" defaultValue={selected?.deathDate?.slice(0, 10)} />
        </div>
        <Input name="generation" type="number" placeholder="Generation" defaultValue={selected?.generation ?? 0} />
        <Textarea name="biography" placeholder="Biography and notes" defaultValue={selected?.biography} />
        <Input name="photo" type="file" accept="image/*" />
        {error && <p className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit"><Save size={18} />Save</Button>
          {selected && <Button type="button" className="bg-clay hover:bg-clay/80" onClick={remove}><Trash2 size={18} />Delete</Button>}
        </div>
      </form>
      {selected && (
        <form className="space-y-3 border-t border-ink/10 pt-4 dark:border-white/10" onSubmit={relate}>
          <h3 className="font-semibold">Relationship</h3>
          <select name="targetId" className="min-h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#20251f]" required>
            <option value="">Select member</option>
            {members.filter((member) => member._id !== selected._id).map((member) => <option key={member._id} value={member._id}>{member.fullName}</option>)}
          </select>
          <select name="type" className="min-h-11 w-full rounded-md border border-ink/15 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#20251f]">
            <option value="parent">Parent</option>
            <option value="child">Child</option>
            <option value="sibling">Sibling</option>
            <option value="spouse">Spouse</option>
            <option value="grandparent">Grandparent</option>
          </select>
          <Button type="submit">Connect</Button>
        </form>
      )}
    </section>
  );
}
