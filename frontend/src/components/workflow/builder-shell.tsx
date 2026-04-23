"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  NodeTypes,
  OnConnect,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import toast from "react-hot-toast";

import { api } from "@/lib/api";
import { clearStoredAuth, StoredUser } from "@/lib/storage";
import {
  ExecutionResponse,
  FlowNode,
  WorkflowEdge,
  WorkflowNode,
  WorkflowRecord,
  WorkflowNodeType,
} from "@/lib/types";
import {
  canConnect,
  createWorkflowNode,
  decorateEdges,
  defaultWorkflow,
  FIXED_GEMINI_MODEL,
  jsonPlaceholderTestWorkflow,
} from "@/lib/workflow";
import { BaseNode } from "./base-node";
import { ExecutionHistoryItem, ExecutionPanel } from "./execution-panel";
import { Inspector } from "./inspector";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { NODE_META } from "./node-icons";

const nodeTypes: NodeTypes = {
  trigger: BaseNode,
  ai: BaseNode,
  api: BaseNode,
  state: BaseNode,
  output: BaseNode,
};

interface BuilderShellProps {
  token: string;
  user: StoredUser;
}

/** Inner component has access to useReactFlow (must be inside ReactFlowProvider) */
function BuilderInner({ token, user }: BuilderShellProps) {
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const starter = useMemo(() => defaultWorkflow(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(starter.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(starter.edges as Edge[]);

  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState(starter.name);
  const [workflowDescription] = useState(starter.description);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    starter.nodes[0]?.id ?? null
  );
  const [executionResult, setExecutionResult] = useState<ExecutionResponse | null>(null);
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistoryItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  /* ── Load workflows on mount ─────────────────────────────────── */
  useEffect(() => {
    api
      .listWorkflows(token)
      .then(setWorkflows)
      .catch((err: Error) => toast.error(err.message));
  }, [token]);

  /* ── Derived ─────────────────────────────────────────────────── */
  const selectedNode = useMemo(
    () =>
      (nodes.find((n) => n.id === selectedNodeId) as unknown as WorkflowNode | undefined) ??
      null,
    [nodes, selectedNodeId]
  );

  /* ── Payload builder ─────────────────────────────────────────── */
  function buildPayload() {
    const safeWorkflowName = workflowName.trim() || "Untitled Workflow";
    const normalizedNodes = nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: {
        ...n.data,
        ...(n.type === "ai" ? { model: FIXED_GEMINI_MODEL } : {}),
      },
    }));
    const normalizedEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })) as WorkflowEdge[];

    return {
      name: safeWorkflowName,
      description: workflowDescription,
      nodes: normalizedNodes,
      edges: normalizedEdges,
    };
  }

  /* ── Template loader ─────────────────────────────────────────── */
  function loadTemplate(workflow: ReturnType<typeof defaultWorkflow>) {
    setCurrentWorkflowId(null);
    setWorkflowName(workflow.name);
    setNodes(workflow.nodes as FlowNode[]);
    setEdges(workflow.edges as Edge[]);
    setSelectedNodeId(workflow.nodes[0]?.id ?? null);
    setExecutionResult(null);
  }

  /* ── Handlers ────────────────────────────────────────────────── */
  function handleNewWorkflow() {
    loadTemplate(defaultWorkflow());
    toast.success("Started a new workflow");
  }

  function handleLoadTestWorkflow() {
    loadTemplate(jsonPlaceholderTestWorkflow());
    toast.success("Loaded API test workflow");
  }

  function addExecutionHistory(item: Omit<ExecutionHistoryItem, "id" | "timestamp">) {
    setExecutionHistory((cur) =>
      [
        { ...item, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
        ...cur,
      ].slice(0, 8)
    );
  }

  function handleAddNode(type: WorkflowNodeType) {
    const node = createWorkflowNode(type, nodes.length);
    setNodes((cur) => [...cur, node]);
    setSelectedNodeId(node.id);
    setIsInspectorOpen(true);
  }

  /** Drop a node dragged from sidebar onto the canvas */
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData(
        "application/reactflow-nodetype"
      ) as WorkflowNodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const node = {
        ...createWorkflowNode(type, nodes.length),
        position,
      };

      setNodes((cur) => [...cur, node]);
      setSelectedNodeId(node.id);
      setIsInspectorOpen(true);
      toast.success(`Added ${NODE_META[type].label} node`);
    },
    [screenToFlowPosition, nodes.length, setNodes]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleConnect: OnConnect = (connection: Connection) => {
    const source = nodes.find((n) => n.id === connection.source);
    const target = nodes.find((n) => n.id === connection.target);

    if (
      !connection.source ||
      !connection.target ||
      !canConnect(
        source?.type as WorkflowNodeType,
        target?.type as WorkflowNodeType
      )
    ) {
      toast.error("That connection is not allowed.");
      return;
    }

    setEdges((cur) =>
      addEdge(
        {
          ...connection,
          id: `edge-${connection.source}-${connection.target}-${crypto.randomUUID()}`,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#3f88f4" },
          style: { stroke: "#3f88f4", strokeWidth: 2 },
        },
        cur
      )
    );
  };

  function updateNodeData(id: string, patch: Partial<WorkflowNode["data"]>) {
    setNodes((cur) =>
      cur.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
      )
    );
  }

  function handleDeleteNode(id: string) {
    setNodes((cur) => cur.filter((n) => n.id !== id));
    setEdges((cur) => cur.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
    toast.success("Node removed");
  }

  function syncOutputNodes(output: unknown) {
    const outputText =
      typeof output === "string" ? output : JSON.stringify(output, null, 2);
    setNodes((cur) =>
      cur.map((n) =>
        n.type === "output"
          ? { ...n, data: { ...n.data, latestOutput: outputText } }
          : n
      )
    );
  }

  /* ── Save / Run / Delete ─────────────────────────────────────── */
  async function handleSave() {
    setIsSaving(true);
    try {
      const payload = buildPayload();
      const saved = currentWorkflowId
        ? await api.updateWorkflow(token, currentWorkflowId, payload)
        : await api.saveWorkflow(token, payload);

      setCurrentWorkflowId(saved._id);
      setWorkflows((cur) => {
        const others = cur.filter((w) => w._id !== saved._id);
        return [saved, ...others];
      });
      setWorkflowName(saved.name);
      toast.success(`Saved "${saved.name}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveAsNew() {
    setIsSaving(true);
    try {
      const payload = buildPayload();
      const saved = await api.saveWorkflow(token, payload);
      setCurrentWorkflowId(saved._id);
      setWorkflowName(saved.name);
      setWorkflows((cur) => [saved, ...cur]);
      toast.success(`Saved new workflow "${saved.name}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteWorkflow() {
    if (!currentWorkflowId) return;
    setIsDeleting(true);
    try {
      await api.deleteWorkflow(token, currentWorkflowId);
      setWorkflows((cur) => cur.filter((w) => w._id !== currentWorkflowId));
      loadTemplate(defaultWorkflow());
      toast.success("Workflow deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete workflow");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleRun() {
    setIsRunning(true);
    setExecutionResult(null);
    try {
      const payload = buildPayload();
      const result = await api.executeWorkflow(token, payload);
      setExecutionResult(result);
      syncOutputNodes(result.output);
      addExecutionHistory({
        workflowName,
        status: "completed",
        message: `Completed ${result.logs.length} execution steps.`,
      });
      toast.success("Workflow executed successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Workflow execution failed";
      addExecutionHistory({ workflowName, status: "failed", message });
      toast.error(message);
    } finally {
      setIsRunning(false);
    }
  }

  function handleLoad(workflow: WorkflowRecord) {
    setCurrentWorkflowId(workflow._id);
    setWorkflowName(workflow.name);
    setNodes(
      workflow.nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          ...(n.type === "ai" ? { model: FIXED_GEMINI_MODEL } : {}),
        },
      })) as FlowNode[]
    );
    setEdges(decorateEdges(workflow.edges) as Edge[]);
    setSelectedNodeId(workflow.nodes[0]?.id ?? null);
    setExecutionResult(null);
    toast.success(`Loaded "${workflow.name}"`);
  }

  function handleLogout() {
    clearStoredAuth();
    window.location.reload();
  }

  /* ── MiniMap node color ──────────────────────────────────────── */
  function miniMapColor(node: { type?: string }) {
    const colors: Record<string, string> = {
      trigger: "#10b981",
      ai: "#3f88f4",
      api: "#f59e0b",
      state: "#a855f7",
      output: "#64748b",
    };
    return colors[node.type ?? ""] ?? "#94a3b8";
  }

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="flex min-h-screen flex-col gap-3 px-4 py-4 md:px-5 md:py-4">
      <div className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-3">

        {/* Topbar */}
        <Topbar
          workflowName={workflowName}
          onWorkflowNameChange={setWorkflowName}
          isRunning={isRunning}
          isSaving={isSaving}
          isDeleting={isDeleting}
          workflows={workflows}
          currentWorkflowId={currentWorkflowId}
          onRun={handleRun}
          onSave={handleSave}
          onSaveAsNew={handleSaveAsNew}
          onNewWorkflow={handleNewWorkflow}
          onLoadTestWorkflow={handleLoadTestWorkflow}
          onLoad={handleLoad}
          onDeleteWorkflow={handleDeleteWorkflow}
          onLogout={handleLogout}
        />

        {/* Middle row: sidebar + canvas */}
        <div
          className={`grid min-h-0 flex-1 gap-3 ${
            isSidebarCollapsed
              ? "xl:grid-cols-[68px_minmax(0,1fr)]"
              : "xl:grid-cols-[240px_minmax(0,1fr)]"
          }`}
          style={{ minHeight: "520px" }}
        >
          {/* Sidebar */}
          <Sidebar
            collapsed={isSidebarCollapsed}
            onAddNode={handleAddNode}
            onToggle={() => setIsSidebarCollapsed((v) => !v)}
          />

          {/* Canvas */}
          <div
            ref={reactFlowWrapper}
            className="glass-panel min-h-0 overflow-hidden rounded-[28px] shadow-glow"
          >
            {/* Canvas header */}
            <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-3.5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                  Canvas
                </p>
                <h2 className="mt-0.5 text-sm font-semibold text-slate-900">
                  {workflowName || "Untitled workflow"}
                </h2>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                  {nodes.length} nodes · {edges.length} edges
                </div>
                <div className="text-xs text-slate-400 hidden sm:block">
                  Click node to edit · Drag to move · Click edge to remove
                </div>
              </div>
            </div>

            {/* Flow canvas */}
            <div
              className="h-[calc(100%-57px)]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                onEdgeClick={(_event, edge) => {
                  setEdges((cur) => cur.filter((e) => e.id !== edge.id));
                  toast.success("Connection removed");
                }}
                onNodeClick={(_event, node) => {
                  setSelectedNodeId(node.id);
                  setIsInspectorOpen(true);
                }}
                deleteKeyCode={["Backspace", "Delete"]}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                proOptions={{ hideAttribution: true }}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={24}
                  size={1.2}
                  color="rgba(148, 163, 184, 0.25)"
                />
                <Controls
                  showInteractive={false}
                  className="!shadow-none"
                />
                <MiniMap
                  nodeColor={miniMapColor}
                  nodeStrokeWidth={0}
                  className="!rounded-2xl !border !border-slate-200"
                  style={{ height: 100, width: 150 }}
                />
              </ReactFlow>
            </div>
          </div>
        </div>

        {/* Execution panel */}
        <div className="glass-panel min-h-[300px] rounded-[28px] p-5 shadow-glow">
          <ExecutionPanel
            result={executionResult}
            history={executionHistory}
            isRunning={isRunning}
          />
        </div>
      </div>

      {/* Inspector */}
      <Inspector
        isOpen={isInspectorOpen}
        node={selectedNode}
        onChange={updateNodeData}
        onDeleteNode={handleDeleteNode}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
}

/** Wrap in ReactFlowProvider so useReactFlow works inside BuilderInner */
export function BuilderShell(props: BuilderShellProps) {
  return (
    <ReactFlowProvider>
      <BuilderInner {...props} />
    </ReactFlowProvider>
  );
}
