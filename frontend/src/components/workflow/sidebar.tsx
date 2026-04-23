"use client";

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

import { NODE_META } from "./node-icons";
import { WorkflowNodeType } from "@/lib/types";

interface SidebarProps {
  collapsed: boolean;
  onAddNode: (type: WorkflowNodeType) => void;
  onToggle: () => void;
}

const NODE_TYPES: WorkflowNodeType[] = ["trigger", "ai", "api", "state", "output"];

export function Sidebar({ collapsed, onAddNode, onToggle }: SidebarProps) {
  function handleDragStart(event: React.DragEvent<HTMLButtonElement>, type: WorkflowNodeType) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/reactflow-nodetype", type);
  }

  return (
    <aside
      className={`glass-panel flex h-full flex-col gap-3 rounded-[30px] p-3 shadow-glow transition-all duration-300 ${
        collapsed ? "w-full" : "w-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-2 pt-1">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="header-text"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                Nodes
              </p>
              <h2 className="mt-0.5 whitespace-nowrap text-sm font-semibold text-slate-900">
                Drag to canvas
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={onToggle}
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-brand-200 hover:text-brand-600"
          aria-label={collapsed ? "Expand node library" : "Collapse node library"}
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="h-4 w-4" />
          ) : (
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Node cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {NODE_TYPES.map((type, index) => {
          const meta = NODE_META[type];
          const { Icon } = meta;

          return (
            <motion.button
              key={type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              draggable
              onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLButtonElement>, type)}
              onClick={() => onAddNode(type)}
              title={`Add ${meta.label} node — or drag onto canvas`}
              className={`group relative w-full overflow-hidden rounded-2xl border bg-white text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${
                collapsed
                  ? "flex items-center justify-center p-2.5"
                  : "flex items-center gap-3 px-3.5 py-3 border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Hover glow strip */}
              <div
                className={`absolute inset-y-0 left-0 w-0.5 rounded-full bg-gradient-to-b ${meta.gradientFrom} ${meta.gradientTo} opacity-0 transition-opacity group-hover:opacity-100`}
              />

              {/* Icon */}
              <div
                className={`flex shrink-0 items-center justify-center rounded-xl ${
                  collapsed ? "h-9 w-9" : "h-9 w-9"
                } ${meta.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${meta.iconText}`} />
              </div>

              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-slate-800">
                      {meta.label}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] ${meta.badgeBg} ${meta.badgeText}`}
                    >
                      {type}
                    </span>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer hint */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-slate-50 px-3 py-2.5 text-[11px] leading-5 text-slate-400"
          >
            💡 Click or drag nodes onto the canvas to build your workflow.
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
