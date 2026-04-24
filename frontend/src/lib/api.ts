import { AuthResponse, ExecutionResponse, WorkflowRecord } from "./types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== "") 
  ? process.env.NEXT_PUBLIC_API_URL 
  : "https://nextflow-k2bf.onrender.com/api";

let _token: string | null = null;

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const authToken = token ?? _token;
  const url = `${API_URL}${path}`;
  console.log(`[API Request] ${options.method ?? "GET"} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
  setSession: (token: string | null) => {
    _token = token;
  },

  // Generic methods
  get: <T>(path: string, token?: string | null) => 
    request<T>(path, { method: "GET" }, token),
  
  post: <T>(path: string, body: any, token?: string | null) => 
    request<T>(path, { 
      method: "POST", 
      body: JSON.stringify(body) 
    }, token),
  
  put: <T>(path: string, body: any, token?: string | null) => 
    request<T>(path, { 
      method: "PUT", 
      body: JSON.stringify(body) 
    }, token),
  
  patch: <T>(path: string, body: any, token?: string | null) => 
    request<T>(path, { 
      method: "PATCH", 
      body: JSON.stringify(body) 
    }, token),
  
  delete: <T>(path: string, token?: string | null) => 
    request<T>(path, { method: "DELETE" }, token),

  // Specific methods
  register: (input: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", input),
  
  login: (input: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", input),
  
  listWorkflows: (token?: string | null) => 
    api.get<WorkflowRecord[]>("/workflows", token),
  
  saveWorkflow: (
    token: string | null | undefined,
    input: { name: string; description: string; nodes: unknown[]; edges: unknown[] }
  ) =>
    api.post<WorkflowRecord>("/workflows", input, token),
  
  updateWorkflow: (
    token: string | null | undefined,
    id: string,
    input: { name: string; description: string; nodes: unknown[]; edges: unknown[] }
  ) =>
    api.put<WorkflowRecord>(`/workflows/${id}`, input, token),
  
  executeWorkflow: (
    token: string | null | undefined,
    input: { name: string; description: string; nodes: unknown[]; edges: unknown[] }
  ) =>
    api.post<ExecutionResponse>("/workflows/execute", input, token),
  
  deleteWorkflow: (token: string | null | undefined, id: string) =>
    api.delete<{ message: string }>(`/workflows/${id}`, token),
};

