import ReactFlow, { Background, Controls, Edge, Node, OnNodeDragStop, ReactFlowProvider } from "react-flow-renderer";
import { useMemo } from "react";
import type { Member } from "../types";
import { MemberCard } from "./MemberCard";

export function TreeCanvas({ members, onMove, onEdit }: { members: Member[]; onMove: (member: Member, x: number, y: number) => void; onEdit: (member: Member) => void }) {
  const nodes = useMemo<Node[]>(() => members.map((member) => ({
    id: member._id,
    type: "default",
    position: member.position?.x || member.position?.y ? member.position : { x: 320 + member.generation * 260, y: 120 + members.indexOf(member) * 120 },
    data: { label: <MemberCard member={member} onEdit={onEdit} /> }
  })), [members, onEdit]);

  const edges = useMemo<Edge[]>(() => members.flatMap((member) =>
    member.relationships
      .filter((relationship) => relationship.type === "parent" || relationship.type === "spouse")
      .map((relationship) => ({
        id: `${member._id}-${relationship.member}-${relationship.type}`,
        source: member._id,
        target: relationship.member,
        animated: relationship.type === "spouse",
        label: relationship.type,
        style: { stroke: relationship.type === "spouse" ? "#b66b4f" : "#3f6f52", strokeWidth: 2 }
      }))
  ), [members]);

  const handleDragStop: OnNodeDragStop = (_event, node) => {
    const member = members.find((item) => item._id === node.id);
    if (member) onMove(member, node.position.x, node.position.y);
  };

  return (
    <ReactFlowProvider>
      <div id="tree-canvas" className="h-[680px] overflow-hidden rounded-lg border border-ink/10 bg-white dark:border-white/10 dark:bg-[#20251f]">
        <ReactFlow nodes={nodes} edges={edges} onNodeDragStop={handleDragStop} fitView minZoom={0.2} maxZoom={2}>
          <Background color="#79a66f" gap={26} />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
