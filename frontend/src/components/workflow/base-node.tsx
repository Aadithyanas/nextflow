"use client";

import { Handle, NodeProps, Position } from "@xyflow/react";
import { FlowNode, WorkflowNodeType } from "@/lib/types";
import { NODE_META } from "./node-icons";

export function BaseNode({ data, type }: NodeProps<FlowNode>) {
  const nodeType = (type ?? "trigger") as WorkflowNodeType;
  const meta = NODE_META[nodeType];

  const outputPreview =
    typeof data.latestOutput === "string" ? data.latestOutput.trim() : "";

  // Compact config summary line
  function getConfigPreview(): string {
    switch (nodeType) {
      case "trigger":
        return data.initialPayload
          ? String(data.initialPayload).substring(0, 80)
          : "No payload set";
      case "ai":
        return data.prompt
          ? String(data.prompt).substring(0, 80)
          : "No prompt set";
      case "api":
        return data.url ? `${data.method ?? "GET"} ${data.url}` : "No URL set";
      case "state":
        return data.key
          ? `${data.key} = ${String(data.valueTemplate ?? "").substring(0, 40)}`
          : "No key set";
      case "output":
        return outputPreview
          ? outputPreview.substring(0, 80)
          : `Mode: ${data.mode ?? "text"}`;
      default:
        return "";
    }
  }

  const configPreview = getConfigPreview();

  // Dynamic solid border colors mapping for the header pill
  const borderColors: Record<string, string> = {
    trigger: "border-emerald-400",
    ai: "border-blue-400",
    api: "border-amber-400",
    state: "border-purple-400",
    output: "border-slate-800",
  };

  return (
    <div className="group relative min-w-[260px] max-w-[280px] rounded-[24px] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
      {/* Handles */}
      {nodeType !== "trigger" && (
        <Handle
          type="target"
          position={Position.Left}
          className="!-left-[5px] !top-1/2 !h-2.5 !w-2.5 !rounded-full !border-2 !border-white !bg-slate-400 shadow-sm transition-transform hover:scale-125"
        />
      )}
      {nodeType !== "output" && (
        <Handle
          type="source"
          position={Position.Right}
          className="!-right-[5px] !top-1/2 !h-2.5 !w-2.5 !rounded-full !border-2 !border-white !bg-slate-400 shadow-sm transition-transform hover:scale-125"
        />
      )}

      {/* Outlined Header Box */}
      <div className={`rounded-[16px] border-[1.5px] bg-white px-4 py-3 ${borderColors[nodeType]}`}>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {nodeType}
        </div>
        <div className="mt-1 truncate text-sm font-semibold text-slate-900">
          {data.label}
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 px-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
        {data.description}
      </p>

      {/* Config / Output Preview Box */}
      <div className="mt-5 flex min-h-[36px] w-full items-center justify-center rounded-[18px] bg-slate-50/80 px-4 py-2 border border-slate-100">
        <p className="truncate text-[11px] text-slate-500">
          {nodeType === "output" && outputPreview ? (
             <span className="text-slate-700">{outputPreview}</span>
          ) : (
             configPreview
          )}
        </p>
      </div>
    </div>
  );
}
