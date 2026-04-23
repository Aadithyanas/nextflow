import type { Node } from "@xyflow/react";

export type WorkflowNodeType =
  | "trigger"
  | "ai"
  | "api"
  | "state"
  | "output";

export interface WorkflowNodeData {
  [key: string]: unknown;
  label: string;
  initialPayload?: string;
  prompt?: string;
  model?: string;
  url?: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  bodyTemplate?: string;
  key?: string;
  valueTemplate?: string;
  mode?: "text" | "json";
  latestOutput?: string;
  description: string;
}

export type FlowNode = Node<WorkflowNodeData, WorkflowNodeType>;

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowRecord {
  _id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  updatedAt: string;
}

export interface ExecutionLog {
  nodeId: string;
  title: string;
  status: "started" | "completed" | "failed";
  message: string;
  timestamp: string;
}

export interface ExecutionResponse {
  output: unknown;
  state: Record<string, unknown>;
  logs: ExecutionLog[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
