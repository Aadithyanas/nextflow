import {
  AiNodeConfig,
  ApiNodeConfig,
  ExecutionLog,
  ExecutionResult,
  OutputNodeConfig,
  StateNodeConfig,
  TriggerNodeConfig,
  WorkflowDefinition,
  WorkflowNode,
} from "../types/workflow";
import { generateGeminiText } from "./gemini-service";
import { interpolateTemplate, safeJsonParse } from "../utils/template";

interface ExecutionContext {
  state: Record<string, unknown>;
  results: Record<string, unknown>;
  logs: ExecutionLog[];
}

function addLog(
  logs: ExecutionLog[],
  nodeId: string,
  title: string,
  status: ExecutionLog["status"],
  message: string
) {
  logs.push({
    nodeId,
    title,
    status,
    message,
    timestamp: new Date().toISOString(),
  });
}

function getNodeMap(workflow: WorkflowDefinition) {
  return new Map(workflow.nodes.map((node) => [node.id, node]));
}

function getOutgoing(workflow: WorkflowDefinition, nodeId: string) {
  return workflow.edges.filter((edge) => edge.source === nodeId);
}

function validateWorkflow(workflow: WorkflowDefinition) {
  const triggerNodes = workflow.nodes.filter((node) => node.type === "trigger");
  if (triggerNodes.length !== 1) {
    throw new Error("Workflow must contain exactly one trigger node");
  }

  for (const edge of workflow.edges) {
    if (edge.source === edge.target) {
      throw new Error(`Invalid self-referencing edge: ${edge.id}`);
    }
  }
}

async function executeNode(
  node: WorkflowNode<Record<string, unknown>>,
  previousValue: unknown,
  context: ExecutionContext
) {
  const templateContext = {
    input: previousValue,
    state: context.state,
    results: context.results,
  };

  switch (node.type) {
    case "trigger": {
      const config = node.data as unknown as TriggerNodeConfig;
      return config.initialPayload || "Workflow started";
    }
    case "ai": {
      const config = node.data as unknown as AiNodeConfig;
      const prompt = interpolateTemplate(config.prompt, templateContext);
      const response = await generateGeminiText(prompt, config.model);
      return response;
    }
    case "api": {
      const config = node.data as unknown as ApiNodeConfig;
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body:
          config.method === "POST"
            ? JSON.stringify(
                safeJsonParse(interpolateTemplate(config.bodyTemplate, templateContext))
              )
            : undefined,
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return response.json();
      }

      return response.text();
    }
    case "state": {
      const config = node.data as unknown as StateNodeConfig;
      const value = safeJsonParse(interpolateTemplate(config.valueTemplate, templateContext));
      context.state[config.key] = value;
      return value;
    }
    case "output": {
      const config = node.data as unknown as OutputNodeConfig;
      if (config.mode === "json") {
        return {
          result: previousValue,
          state: context.state,
        };
      }

      return typeof previousValue === "string"
        ? previousValue
        : JSON.stringify(previousValue, null, 2);
    }
    default:
      throw new Error(`Unsupported node type: ${String(node.type)}`);
  }
}

async function walkGraph(
  workflow: WorkflowDefinition,
  nodeMap: Map<string, WorkflowNode<Record<string, unknown>>>,
  nodeId: string,
  inputValue: unknown,
  context: ExecutionContext,
  visited: Set<string>
): Promise<unknown> {
  if (visited.has(nodeId)) {
    throw new Error(`Cycle detected near node ${nodeId}`);
  }

  const node = nodeMap.get(nodeId);
  if (!node) {
    throw new Error(`Node ${nodeId} not found`);
  }

  visited.add(nodeId);
  addLog(context.logs, node.id, (node.data as { label?: string }).label ?? node.type, "started", "Node execution started");

  try {
    const result = await executeNode(node, inputValue, context);
    context.results[node.id] = result;
    addLog(context.logs, node.id, (node.data as { label?: string }).label ?? node.type, "completed", "Node execution completed");

    const outgoing = getOutgoing(workflow, node.id);
    if (outgoing.length === 0) {
      return result;
    }

    let lastResult = result;
    for (const edge of outgoing) {
      lastResult = await walkGraph(
        workflow,
        nodeMap,
        edge.target,
        result,
        context,
        new Set(visited)
      );
    }

    return lastResult;
  } catch (error) {
    addLog(
      context.logs,
      node.id,
      (node.data as { label?: string }).label ?? node.type,
      "failed",
      error instanceof Error ? error.message : "Unknown execution error"
    );
    throw error;
  }
}

export async function executeWorkflow(workflow: WorkflowDefinition): Promise<ExecutionResult> {
  validateWorkflow(workflow);

  const nodeMap = getNodeMap(workflow);
  const triggerNode = workflow.nodes.find((node) => node.type === "trigger");

  if (!triggerNode) {
    throw new Error("Trigger node not found");
  }

  const context: ExecutionContext = {
    state: {},
    results: {},
    logs: [],
  };

  const output = await walkGraph(
    workflow,
    nodeMap,
    triggerNode.id,
    undefined,
    context,
    new Set()
  );

  return {
    output,
    logs: context.logs,
    state: context.state,
  };
}
