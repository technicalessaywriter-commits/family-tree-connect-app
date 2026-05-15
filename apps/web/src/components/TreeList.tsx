import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/api";
import type { FamilyTree } from "../types";
import { Button } from "./Button";
import { Input, Textarea } from "./Input";

export function TreeList({ trees, activeId, onCreate, onSelect }: { trees: FamilyTree[]; activeId?: string; onCreate: (tree: FamilyTree) => void; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const tree = await api.createTree({ name: String(data.get("name")), description: String(data.get("description") ?? "") });
    onCreate(tree);
    setOpen(false);
    event.currentTarget.reset();
  }

  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Family trees</h2>
        <button className="grid h-9 w-9 place-items-center rounded-md bg-moss text-white" onClick={() => setOpen(!open)} title="Create tree">
          <Plus size={18} />
        </button>
      </div>
      {open && (
        <form className="space-y-2 rounded-lg border border-ink/10 bg-white p-3 dark:border-white/10 dark:bg-white/10" onSubmit={submit}>
          <Input name="name" placeholder="Tree name" required />
          <Textarea name="description" placeholder="Description" />
          <Button className="w-full">Create tree</Button>
        </form>
      )}
      <div className="space-y-2">
        {trees.map((tree) => (
          <button
            key={tree._id}
            className={`w-full rounded-md border px-3 py-3 text-left transition ${activeId === tree._id ? "border-moss bg-moss/10" : "border-ink/10 bg-white hover:border-moss/50 dark:border-white/10 dark:bg-white/10"}`}
            onClick={() => onSelect(tree._id)}
          >
            <p className="font-semibold">{tree.name}</p>
            <p className="line-clamp-2 text-sm text-ink/60 dark:text-paper/60">{tree.description || "No description yet"}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
