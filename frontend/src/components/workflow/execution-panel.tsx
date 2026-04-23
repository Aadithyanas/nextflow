"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

import { ExecutionResponse } from "@/lib/types";

export interface ExecutionHistoryItem {
  id: string;
  workflowName: string;
  status: "completed" | "failed";
  message: string;
  timestamp: string;
}

interface ExecutionPanelProps {
  result: ExecutionResponse | null;
  history: ExecutionHistoryItem[];
  isRunning?: boolean;
}

/** Lightly render Markdown-ish text from Gemini */
function renderOutput(value: unknown): string {
  const raw =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);

  return raw
    .replace(/\*\*(.*?)\*\*/g, "$1")   // bold → plain
    .replace(/^#{1,3}\s+(.*)$/gm, "$1") // headings → plain
    .replace(/`([^`]+)`/g, "$1")        // inline code → plain
    .replace(/\n{3,}/g, "\n\n")         // collapse extra blank lines
    .trim();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      title="Copy output"
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <ClipboardIcon className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

const STATUS_STYLES = {
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  started: "bg-brand-100 text-brand-700",
};

const STATUS_DOT = {
  completed: "bg-emerald-500",
  failed: "bg-rose-500",
  started: "bg-brand-400",
};

export function ExecutionPanel({ result, history, isRunning }: ExecutionPanelProps) {
  const outputText = result
    ? typeof result.output === "string"
      ? result.output
      : JSON.stringify(result.output, null, 2)
    : "";

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
            Run output
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-slate-900">
            Execution result
          </h3>
        </div>
        {isRunning && (
          <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Running…
          </div>
        )}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[1fr_320px]">
        {/* ── Left: output + timeline ─────────────────────────────── */}
        <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
          {/* Final output */}
          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">Final output</span>
              {result && <CopyButton text={outputText} />}
            </div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="max-h-[200px] overflow-auto rounded-xl bg-slate-50 px-4 py-3 text-[13px] leading-7 text-slate-800"
                >
                  <pre className="whitespace-pre-wrap font-sans">{renderOutput(result.output)}</pre>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-sm text-slate-400"
                >
                  {isRunning ? "Executing nodes…" : "Run the workflow to see output here."}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Execution timeline */}
          {result && result.logs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-0 flex-1 rounded-[20px] border border-slate-200 bg-white p-4"
            >
              <div className="mb-3 text-sm font-semibold text-slate-900">
                Execution timeline
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {result.logs.length} events
                </span>
              </div>
              <div className="relative max-h-[160px] space-y-2 overflow-auto">
                {/* Vertical connector line */}
                <div className="absolute left-[10px] top-2 bottom-2 w-px bg-slate-200" />
                {result.logs.map((log, i) => (
                  <motion.div
                    key={`${log.nodeId}-${log.timestamp}-${log.status}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="relative flex items-start gap-3 pl-6"
                  >
                    {/* Status dot */}
                    <div
                      className={`absolute left-[5px] top-2 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-white ${STATUS_DOT[log.status]}`}
                    />
                    <div className="flex-1 rounded-xl bg-slate-50 px-3 py-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{log.title}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[log.status]}`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-slate-500">{log.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Right: state + history ──────────────────────────────── */}
        <div className="flex flex-col gap-4 overflow-hidden min-h-0">
          {/* State snapshot */}
          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
            <div className="mb-2.5 text-sm font-semibold text-slate-900">State snapshot</div>
            {result ? (
              <div className="max-h-[120px] overflow-auto rounded-xl bg-slate-50 px-3 py-2.5">
                <pre className="text-xs leading-6 text-slate-700">
                  {JSON.stringify(result.state, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-400">
                State changes will appear after a run.
              </div>
            )}
          </div>

          {/* Run history */}
          <div className="min-h-0 flex-1 overflow-hidden rounded-[20px] border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Run history</span>
              <span className="text-xs text-slate-400">{history.length} recent</span>
            </div>
            {history.length > 0 ? (
              <div className="max-h-[200px] space-y-2 overflow-auto">
                {history.map((item) => (
                  <div key={item.id} className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-slate-800">{item.workflowName}</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            item.status === "completed" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        <span
                          className={`shrink-0 text-[10px] font-bold uppercase tracking-wide ${
                            item.status === "completed" ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-0.5 text-slate-400">{new Date(item.timestamp).toLocaleString()}</div>
                    <div className="mt-1 text-slate-500">{item.message}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-400">
                No runs yet. Hit Run to start.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
