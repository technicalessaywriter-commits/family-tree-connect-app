import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import type { FamilyTree, Member } from "../types";

export async function exportTreePng(element: HTMLElement, fileName = "family-tree.png") {
  const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

export async function exportTreePdf(element: HTMLElement, tree: FamilyTree) {
  const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
  pdf.text(tree.name, 32, 32);
  pdf.addImage(dataUrl, "PNG", 24, 48, 790, 470);
  pdf.save(`${tree.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}

export function downloadJson(tree: FamilyTree, members: Member[]) {
  const blob = new Blob([JSON.stringify({ tree, members, exportedAt: new Date().toISOString() }, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tree.name.toLowerCase().replace(/\s+/g, "-")}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
