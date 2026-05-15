import type { FamilyTree, Gender, Member, RelationshipType, User } from "../types";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, token?: string, options: RequestInit = {}): Promise<T> {
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
    request<{ token: string; user: User }>("/auth/signup", undefined, { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", undefined, { method: "POST", body: JSON.stringify(payload) }),
  trees: (token: string) => request<FamilyTree[]>("/trees", token),
  createTree: (token: string, payload: { name: string; description?: string }) =>
    request<FamilyTree>("/trees", token, { method: "POST", body: JSON.stringify(payload) }),
  tree: (token: string, id: string) => request<{ tree: FamilyTree; members: Member[] }>(`/trees/${id}`, token),
  createMember: (token: string, treeId: string, payload: FormData) =>
    request<Member>(`/trees/${treeId}/members`, token, { method: "POST", body: payload }),
  relate: (token: string, treeId: string, memberId: string, payload: { targetId: string; type: RelationshipType }) =>
    request<Member[]>(`/trees/${treeId}/members/${memberId}/relationships`, token, { method: "POST", body: JSON.stringify(payload) })
};

export function memberFormData(values: {
  fullName: string;
  gender: Gender;
  birthDate: string;
  deathDate?: string;
  biography?: string;
  generation?: number;
  photo?: { uri: string; name: string; type: string } | null;
}) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== "photo") data.append(key, String(value));
  });
  if (values.photo) data.append("photo", values.photo as unknown as Blob);
  return data;
}
