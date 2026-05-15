import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthPanel } from "./components/AuthPanel";
import { Layout } from "./components/Layout";
import { MemberForm } from "./components/MemberForm";
import { StatsDashboard } from "./components/StatsDashboard";
import { Timeline } from "./components/Timeline";
import { Toolbar } from "./components/Toolbar";
import { TreeCanvas } from "./components/TreeCanvas";
import { TreeList } from "./components/TreeList";
import { api, memberFormData } from "./lib/api";
import type { FamilyTree, Member, User } from "./types";
import { useTheme } from "./hooks/useTheme";
import { useSocket } from "./hooks/useSocket";

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [activeTree, setActiveTree] = useState<FamilyTree>();
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Member>();
  const [query, setQuery] = useState("");
  const [generation, setGeneration] = useState("");
  const [loading, setLoading] = useState(false);
  const { dark, setDark } = useTheme();

  const loadTree = useCallback(async (id: string) => {
    setLoading(true);
    const data = await api.tree(id);
    setActiveTree(data.tree);
    setMembers(data.members);
    setLoading(false);
  }, []);

  useSocket(activeTree?._id, () => activeTree && loadTree(activeTree._id));

  useEffect(() => {
    if (!user) return;
    api.trees().then((items) => {
      setTrees(items);
      if (items[0]) loadTree(items[0]._id);
    });
  }, [user, loadTree]);

  useEffect(() => {
    if (!activeTree) return;
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (generation) search.set("generation", generation);
    api.members(activeTree._id, search.toString() ? `?${search}` : "").then(setMembers);
  }, [query, generation, activeTree]);

  const selectedMember = useMemo(() => members.find((member) => member._id === selected?._id), [members, selected]);

  if (!user) {
    return (
      <AuthPanel
        onAuth={(nextUser, token) => {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(nextUser));
          setUser(nextUser);
        }}
      />
    );
  }

  function upsertMember(memberOrMembers: Member | Member[]) {
    if (Array.isArray(memberOrMembers)) {
      setMembers(memberOrMembers);
      return;
    }
    setMembers((items) => {
      const exists = items.some((item) => item._id === memberOrMembers._id);
      return exists ? items.map((item) => item._id === memberOrMembers._id ? memberOrMembers : item) : [...items, memberOrMembers];
    });
  }

  async function moveMember(member: Member, x: number, y: number) {
    if (!activeTree) return;
    const updated = await api.updateMember(activeTree._id, member._id, memberFormData({
      fullName: member.fullName,
      gender: member.gender,
      birthDate: member.birthDate,
      deathDate: member.deathDate,
      biography: member.biography,
      generation: member.generation,
      x,
      y
    }));
    upsertMember(updated);
  }

  return (
    <Layout
      user={user}
      dark={dark}
      setDark={setDark}
      onLogout={() => {
        localStorage.clear();
        setUser(null);
      }}
    >
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[280px_1fr]">
        <TreeList
          trees={trees}
          activeId={activeTree?._id}
          onCreate={(tree) => {
            setTrees((items) => [tree, ...items]);
            loadTree(tree._id);
          }}
          onSelect={loadTree}
        />
        <section className="min-w-0 space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold">{activeTree?.name ?? "Family dashboard"}</h1>
              <p className="mt-1 max-w-2xl text-sm text-ink/70 dark:text-paper/70">{activeTree?.description ?? "Create a tree to begin documenting your family history."}</p>
            </div>
            {loading && <p className="rounded-md bg-gold/15 px-3 py-2 text-sm text-ink dark:text-paper">Loading</p>}
          </motion.div>
          <StatsDashboard tree={activeTree} members={members} />
          {activeTree && (
            <Toolbar
              tree={activeTree}
              members={members}
              query={query}
              generation={generation}
              onQuery={setQuery}
              onGeneration={setGeneration}
              onImport={setMembers}
            />
          )}
          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <TreeCanvas members={members} onMove={moveMember} onEdit={setSelected} />
              <Timeline members={members} />
            </div>
            {activeTree && (
              <MemberForm
                key={selectedMember?._id ?? "new"}
                treeId={activeTree._id}
                members={members}
                selected={selectedMember}
                onSaved={upsertMember}
                onDeleted={(id) => {
                  setMembers((items) => items.filter((item) => item._id !== id));
                  setSelected(undefined);
                }}
              />
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
