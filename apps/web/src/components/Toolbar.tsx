import { Download, FileImage, FileJson, FileText, Search, Upload } from "lucide-react";
import type { FamilyTree, Member } from "../types";
import { Button } from "./Button";
import { Input } from "./Input";
import { downloadJson, exportTreePdf, exportTreePng } from "../lib/exporters";
import { api } from "../lib/api";

export function Toolbar({
  tree,
  members,
  query,
  generation,
  onQuery,
  onGeneration,
  onImport
}: {
  tree?: FamilyTree;
  members: Member[];
  query: string;
  generation: string;
  onQuery: (value: string) => void;
  onGeneration: (value: string) => void;
  onImport: (members: Member[]) => void;
}) {
  async function importJson(file?: File) {
    if (!tree || !file) return;
    const text = await file.text();
    const imported = await api.importJson(tree._id, JSON.parse(text));
    onImport(imported);
  }

  const canvas = () => document.getElementById("tree-canvas") as HTMLElement | null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-white p-3 dark:border-white/10 dark:bg-white/10 xl:flex-row xl:items-center xl:justify-between">
      <div className="grid gap-2 sm:grid-cols-[1fr_160px] xl:w-[520px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 text-ink/40 dark:text-paper/40" size={18} />
          <Input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search members" className="pl-10" />
        </label>
        <Input value={generation} onChange={(event) => onGeneration(event.target.value)} placeholder="Generation" type="number" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => tree && downloadJson(tree, members)}><FileJson size={18} />JSON</Button>
        <Button type="button" onClick={() => canvas() && exportTreePng(canvas()!)}><FileImage size={18} />PNG</Button>
        <Button type="button" onClick={() => tree && canvas() && exportTreePdf(canvas()!, tree)}><FileText size={18} />PDF</Button>
        <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss dark:bg-paper dark:text-ink dark:hover:bg-fern">
          <Upload size={18} />Import
          <input className="hidden" type="file" accept="application/json" onChange={(event) => importJson(event.target.files?.[0])} />
        </label>
        <Button type="button" disabled={!tree}><Download size={18} />Backup</Button>
      </div>
    </div>
  );
}
