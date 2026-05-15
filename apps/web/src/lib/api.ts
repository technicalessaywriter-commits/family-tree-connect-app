import type { FamilyTree, Gender, Member, RelationshipType, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(body.message ?? "Request failed", response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  signup: (payload: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  trees: () => request<FamilyTree[]>("/trees"),
  createTree: (payload: { name: string; description?: string }) =>
    request<FamilyTree>("/trees", { method: "POST", body: JSON.stringify(payload) }),
  tree: (id: string) => request<{ tree: FamilyTree; members: Member[] }>(`/trees/${id}`),
  members: (treeId: string, params = "") => request<Member[]>(`/trees/${treeId}/members${params}`),
  createMember: (treeId: string, payload: FormData) =>
    request<Member>(`/trees/${treeId}/members`, { method: "POST", body: payload }),
  updateMember: (treeId: string, memberId: string, payload: FormData) =>
    request<Member>(`/trees/${treeId}/members/${memberId}`, { method: "PATCH", body: payload }),
  deleteMember: (treeId: string, memberId: string) =>
    request<void>(`/trees/${treeId}/members/${memberId}`, { method: "DELETE" }),
  relate: (treeId: string, memberId: string, payload: { targetId: string; type: RelationshipType }) =>
    request<Member[]>(`/trees/${treeId}/members/${memberId}/relationships`, { method: "POST", body: JSON.stringify(payload) }),
  invite: (treeId: string, payload: { email: string; role: string }) =>
    request<{ token: string }>(`/trees/${treeId}/invites`, { method: "POST", body: JSON.stringify(payload) }),
  addEvent: (treeId: string, payload: { title: string; date: string; description?: string }) =>
    request(`/trees/${treeId}/events`, { method: "POST", body: JSON.stringify(payload) }),
  exportJson: (treeId: string) => request<{ tree: FamilyTree; members: Member[] }>(`/export/${treeId}/json`),
  importJson: (treeId: string, payload: unknown) =>
    request<Member[]>(`/export/${treeId}/import`, { method: "POST", body: JSON.stringify(payload) })
};

export function memberFormData(values: {
  fullName: string;
  gender: Gender;
  birthDate: string;
  deathDate?: string;
  biography?: string;
  generation?: number;
  x?: number;
  y?: number;
  photo?: File | null;
}) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== "photo") data.append(key, String(value));
  });
  if (values.photo) data.append("photo", values.photo);
  return data;
}
