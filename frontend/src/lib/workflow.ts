import { MarkerType } from "@xyflow/react";

import { WorkflowEdge, WorkflowNode, WorkflowNodeData, WorkflowNodeType } from "./types";

export const FIXED_GEMINI_MODEL = "gemini-2.5-flash";

export const nodeCatalog: Array<{
  type: WorkflowNodeType;
  title: string;
  accent: string;
  description: string;
}> = [
  {
    type: "trigger",
    title: "Trigger",
    accent: "from-emerald-400 to-teal-500",
    description: "Starts execution and seeds the initial payload.",
  },
  {
    type: "ai",
    title: "AI",
    accent: "from-sky-400 to-brand-500",
    description: "Sends prompts to Google Gemini and returns text output.",
  },
  {
    type: "api",
    title: "API",
    accent: "from-orange-400 to-amber-500",
    description: "Calls external HTTP endpoints and forwards the response.",
  },
  {
    type: "state",
    title: "State",
    accent: "from-fuchsia-400 to-pink-500",
    description: "Stores dynamic values that can be reused downstream.",
  },
  {
    type: "output",
    title: "Output",
    accent: "from-slate-500 to-slate-800",
    description: "Formats and displays the final result.",
  },
];

export function createNodeData(type: WorkflowNodeType): WorkflowNodeData {
  switch (type) {
    case "trigger":
      return {
        label: "Trigger",
        description: "Kick off the workflow with a manual payload.",
        initialPayload: "Draft a crisp product launch summary for today.",
      };
    case "ai":
      return {
        label: "Gemini",
        description: "Generate text with Google Gemini.",
        prompt: "Use this input and improve it:\n\n{{input}}",
        model: FIXED_GEMINI_MODEL,
      };
    case "api":
      return {
        label: "API Call",
        description: "Send the current input to an external API.",
        url: "https://api.example.com/process",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        bodyTemplate: "{\"input\":\"{{input}}\"}",
      };
    case "state":
      return {
        label: "State",
        description: "Persist structured data for later steps.",
        key: "latest",
        valueTemplate: "{{input}}",
      };
    case "output":
      return {
        label: "Output",
        description: "Display the final result in the run panel.",
        mode: "text",
      };
  }
}

export function createWorkflowNode(type: WorkflowNodeType, index: number): WorkflowNode {
  return {
    id: `${type}-${crypto.randomUUID()}`,
    type,
    position: {
      x: 180 + (index % 3) * 280,
      y: 120 + Math.floor(index / 3) * 180,
    },
    data: createNodeData(type),
  };
}

export function defaultWorkflow() {
  const trigger = createWorkflowNode("trigger", 0);
  const ai = createWorkflowNode("ai", 1);
  const output = createWorkflowNode("output", 2);

  const edges: WorkflowEdge[] = [
    {
      id: `edge-${trigger.id}-${ai.id}`,
      source: trigger.id,
      target: ai.id,
    },
    {
      id: `edge-${ai.id}-${output.id}`,
      source: ai.id,
      target: output.id,
    },
  ];

  return {
    name: "Launch Brief Generator",
    description: "Trigger -> Gemini -> Output starter flow",
    nodes: [trigger, ai, output],
    edges: decorateEdges(edges),
  };
}

export function jsonPlaceholderTestWorkflow() {
  const trigger = createWorkflowNode("trigger", 0);
  const api = createWorkflowNode("api", 1);
  const state = createWorkflowNode("state", 2);
  const output = createWorkflowNode("output", 3);

  trigger.data = {
    ...trigger.data,
    label: "Test Input",
    description: "Seeds a sample payload for JSONPlaceholder.",
    initialPayload: "Workflow test request from Nextflow.",
  };

  api.data = {
    ...api.data,
    label: "JSONPlaceholder",
    description: "Posts the workflow input to JSONPlaceholder.",
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    bodyTemplate: "{\"title\":\"Workflow API test\",\"body\":\"{{input}}\",\"userId\":1}",
  };

  state.data = {
    ...state.data,
    label: "Save API Result",
    description: "Stores the API response for inspection.",
    key: "jsonPlaceholderResponse",
    valueTemplate: "{{input}}",
  };

  output.data = {
    ...output.data,
    label: "Show Result",
    description: "Displays the JSONPlaceholder response and state.",
    mode: "json",
  };

  const edges: WorkflowEdge[] = [
    {
      id: `edge-${trigger.id}-${api.id}`,
      source: trigger.id,
      target: api.id,
    },
    {
      id: `edge-${api.id}-${state.id}`,
      source: api.id,
      target: state.id,
    },
    {
      id: `edge-${state.id}-${output.id}`,
      source: state.id,
      target: output.id,
    },
  ];

  return {
    name: "JSONPlaceholder API Test",
    description: "Trigger -> API -> State -> Output test workflow",
    nodes: [trigger, api, state, output],
    edges: decorateEdges(edges),
  };
}

export function decorateEdges(edges: WorkflowEdge[]) {
  return edges.map((edge) => ({
    ...edge,
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#2467d6",
    },
    style: { stroke: "#2467d6", strokeWidth: 2 },
  }));
}

export function canConnect(sourceType?: WorkflowNodeType, targetType?: WorkflowNodeType) {
  if (!sourceType || !targetType) {
    return false;
  }

  // Output nodes are terminal — they can never be a source
  if (sourceType === "output") {
    return false;
  }

  // Nodes cannot connect back to trigger
  const invalidTargets: Record<WorkflowNodeType, WorkflowNodeType[]> = {
    trigger: ["trigger"],
    ai: ["trigger"],
    api: ["trigger"],
    state: ["trigger"],
    output: ["trigger", "ai", "api", "state", "output"],
  };

  return !invalidTargets[sourceType].includes(targetType);
}
