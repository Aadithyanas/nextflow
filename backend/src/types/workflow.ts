export type WorkflowNodeType =
  | "trigger"
  | "ai"
  | "api"
  | "state"
  | "output";

export interface WorkflowPosition {
  x: number;
  y: number;
}

export interface TriggerNodeConfig {
  label: string;
  initialPayload: string;
}

export interface AiNodeConfig {
  label: string;
  prompt: string;
  model: string;
}

export interface ApiNodeConfig {
  label: string;
  url: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  bodyTemplate: string;
}

export interface StateNodeConfig {
  label: string;
  key: string;
  valueTemplate: string;
}

export interface OutputNodeConfig {
  label: string;
  mode: "text" | "json";
}

export type WorkflowNodeConfig =
  | TriggerNodeConfig
  | AiNodeConfig
  | ApiNodeConfig
  | StateNodeConfig
  | OutputNodeConfig;

export interface WorkflowNode<T = WorkflowNodeConfig> {
  id: string;
  type: WorkflowNodeType;
  position: WorkflowPosition;
  data: T;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode<Record<string, unknown>>[];
  edges: WorkflowEdge[];
}

export interface ExecutionLog {
  nodeId: string;
  title: string;
  status: "started" | "completed" | "failed";
  message: string;
  timestamp: string;
}

export interface ExecutionResult {
  output: unknown;
  logs: ExecutionLog[];
  state: Record<string, unknown>;
}
