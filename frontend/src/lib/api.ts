import { AuthResponse, ExecutionResponse, WorkflowRecord } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload as T;
}

export const api = {
  register: (input: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listWorkflows: (token: string) => request<WorkflowRecord[]>("/workflows", {}, token),
  saveWorkflow: (
    token: string,
    input: { name: string; description: string; nodes: unknown[]; edges: unknown[] }
  ) =>
    request<WorkflowRecord>("/workflows", {
      method: "POST",
      body: JSON.stringify(input),
    }, token),
  updateWorkflow: (
    token: string,
    id: string,
    input: { name: string; description: string; nodes: unknown[]; edges: unknown[] }
  ) =>
    request<WorkflowRecord>(`/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }, token),
  executeWorkflow: (
    token: string,
    input: { name: string; description: string; nodes: unknown[]; edges: unknown[] }
  ) =>
    request<ExecutionResponse>("/workflows/execute", {
      method: "POST",
      body: JSON.stringify(input),
    }, token),
  deleteWorkflow: (token: string, id: string) =>
    request<{ message: string }>(`/workflows/${id}`, {
      method: "DELETE",
    }, token),
};

