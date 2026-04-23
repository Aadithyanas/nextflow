"use client";

import { useState } from "react";
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

import { WorkflowNode } from "@/lib/types";
import { FIXED_GEMINI_MODEL } from "@/lib/workflow";
import { NODE_META } from "./node-icons";

interface InspectorProps {
  isOpen: boolean;
  node: WorkflowNode | null;
  onChange: (id: string, patch: Partial<WorkflowNode["data"]>) => void;
  onDeleteNode: (id: string) => void;
  onClose: () => void;
}

export function Inspector({ isOpen, node, onChange, onDeleteNode, onClose }: InspectorProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDeleteNode() {
    if (!node) return;
    setConfirmDelete(false);
    onDeleteNode(node.id);
    onClose();
  }

  const meta = node ? NODE_META[node.type] : null;
  const { Icon } = meta ?? { Icon: null };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/15 backdrop-blur-[2px] transition duration-200 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed right-4 top-20 z-50 h-[calc(100vh-6.5rem)] w-[min(400px,calc(100vw-2rem))] transform transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"
        }`}
      >
        <div className="glass-panel flex h-full flex-col overflow-hidden rounded-[28px] shadow-glow">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 px-5 py-4">
            <div className="flex items-center gap-3">
              {meta && Icon && (
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.iconBg}`}>
                  <Icon className={`h-5 w-5 ${meta.iconText}`} />
                </div>
              )}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Node editor
                </p>
                <h3 className="mt-0.5 text-base font-semibold text-slate-900">
                  {node ? node.data.label : "Select a node"}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              aria-label="Close inspector"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          {node ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                {/* Type badge */}
                {meta && (
                  <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 ${meta.badgeBg}`}>
                    <span className={`text-xs font-semibold ${meta.badgeText}`}>
                      {meta.label} Node
                    </span>
                  </div>
                )}

                <InputField
                  label="Label"
                  value={node.data.label}
                  onChange={(v) => onChange(node.id, { label: v })}
                />
                <TextAreaField
                  label="Description"
                  rows={2}
                  value={node.data.description}
                  onChange={(v) => onChange(node.id, { description: v })}
                />

                {/* ── Trigger ── */}
                {node.type === "trigger" && (
                  <TextAreaField
                    label="Initial Payload"
                    hint="This text is passed as input to the first connected node."
                    rows={4}
                    value={node.data.initialPayload ?? ""}
                    onChange={(v) => onChange(node.id, { initialPayload: v })}
                  />
                )}

                {/* ── AI ── */}
                {node.type === "ai" && (
                  <>
                    <FixedValueField
                      label="Gemini Model"
                      value={FIXED_GEMINI_MODEL}
                      hint="Locked to Gemini 2.5 Flash for consistent execution."
                    />
                    <TextAreaField
                      label="Prompt Template"
                      hint="Use {{input}} to embed the previous node's output."
                      rows={6}
                      value={node.data.prompt ?? ""}
                      onChange={(v) => onChange(node.id, { prompt: v })}
                    />
                  </>
                )}

                {/* ── API ── */}
                {node.type === "api" && (
                  <>
                    <InputField
                      label="URL"
                      hint="The endpoint to call. Use {{input}} for dynamic values."
                      value={node.data.url ?? ""}
                      onChange={(v) => onChange(node.id, { url: v })}
                    />
                    <div className="block space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Method</label>
                      <select
                        value={node.data.method ?? "GET"}
                        onChange={(e) =>
                          onChange(node.id, { method: e.target.value as "GET" | "POST" })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                      </select>
                    </div>
                    <TextAreaField
                      label="Body Template"
                      hint='JSON body template. Use {{input}} for dynamic values. Example: {"text":"{{input}}"}'
                      rows={4}
                      value={node.data.bodyTemplate ?? ""}
                      onChange={(v) => onChange(node.id, { bodyTemplate: v })}
                    />
                    <HeadersEditor
                      headers={node.data.headers as Record<string, string> ?? {}}
                      onChange={(headers) => onChange(node.id, { headers })}
                    />
                  </>
                )}

                {/* ── State ── */}
                {node.type === "state" && (
                  <>
                    <InputField
                      label="State Key"
                      hint="A unique key to store this value under."
                      value={node.data.key ?? ""}
                      onChange={(v) => onChange(node.id, { key: v })}
                    />
                    <TextAreaField
                      label="Value Template"
                      hint="The value to store. Use {{input}} to capture the previous output."
                      rows={3}
                      value={node.data.valueTemplate ?? ""}
                      onChange={(v) => onChange(node.id, { valueTemplate: v })}
                    />
                  </>
                )}

                {/* ── Output ── */}
                {node.type === "output" && (
                  <div className="block space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Output Mode</label>
                    <select
                      value={node.data.mode ?? "text"}
                      onChange={(e) =>
                        onChange(node.id, { mode: e.target.value as "text" | "json" })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="text">Text</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <p className="text-sm text-slate-500">Click any node on the canvas to edit its settings here.</p>
            </div>
          )}

          {/* Footer — delete node */}
          {node && (
            <div className="border-t border-slate-200/80 px-5 py-3">
              <AnimatePresence mode="wait">
                {confirmDelete ? (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-1 text-xs text-rose-600">Delete this node?</span>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteNode}
                      className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="delete-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete node
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/* ── Field components ───────────────────────────────────────────── */

function FixedValueField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
        {value}
      </div>
      {hint && <p className="text-[11px] leading-5 text-slate-400">{hint}</p>}
    </div>
  );
}

function InputField({
  label,
  value,
  hint,
  onChange,
}: {
  label: string;
  value: string;
  hint?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      {hint && <p className="text-[11px] leading-5 text-slate-400">{hint}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  hint,
  rows = 4,
  onChange,
}: {
  label: string;
  value: string;
  hint?: string;
  rows?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      {hint && <p className="text-[11px] leading-5 text-slate-400">{hint}</p>}
    </div>
  );
}

function HeadersEditor({
  headers,
  onChange,
}: {
  headers: Record<string, string>;
  onChange: (h: Record<string, string>) => void;
}) {
  const pairs = Object.entries(headers);

  function updatePair(index: number, key: string, value: string) {
    const updated = { ...headers };
    const oldKey = pairs[index][0];
    if (oldKey !== key) delete updated[oldKey];
    updated[key] = value;
    onChange(updated);
  }

  function removePair(index: number) {
    const updated = { ...headers };
    delete updated[pairs[index][0]];
    onChange(updated);
  }

  function addPair() {
    onChange({ ...headers, "": "" });
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Request Headers</label>
        <button
          type="button"
          onClick={addPair}
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-200"
        >
          <PlusIcon className="h-3 w-3" />
          Add
        </button>
      </div>
      {pairs.length > 0 ? (
        <div className="space-y-2">
          {pairs.map(([key, value], i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={key}
                placeholder="Key"
                onChange={(e) => updatePair(i, e.target.value, value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-brand-400"
              />
              <input
                value={value}
                placeholder="Value"
                onChange={(e) => updatePair(i, key, e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-brand-400"
              />
              <button
                type="button"
                onClick={() => removePair(i)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-slate-400">No headers. Click Add to create one.</p>
      )}
    </div>
  );
}
