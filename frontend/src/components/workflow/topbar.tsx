"use client";

import { useState } from "react";
import {
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  BeakerIcon,
  BoltIcon,
  CloudArrowDownIcon,
  FolderOpenIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { WorkflowRecord } from "@/lib/types";

interface TopbarProps {
  workflowName: string;
  onWorkflowNameChange: (value: string) => void;
  isRunning: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  workflows: WorkflowRecord[];
  currentWorkflowId: string | null;
  onRun: () => void;
  onSave: () => void;
  onSaveAsNew: () => void;
  onNewWorkflow: () => void;
  onLoadTestWorkflow: () => void;
  onLoad: (workflow: WorkflowRecord) => void;
  onDeleteWorkflow: () => void;
  onLogout: () => void;
}

export function Topbar({
  workflowName,
  onWorkflowNameChange,
  isRunning,
  isSaving,
  isDeleting,
  workflows,
  currentWorkflowId,
  onRun,
  onSave,
  onSaveAsNew,
  onNewWorkflow,
  onLoadTestWorkflow,
  onLoad,
  onDeleteWorkflow,
  onLogout,
}: TopbarProps) {
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleDeleteConfirm() {
    setShowDeleteConfirm(false);
    onDeleteWorkflow();
  }

  return (
    <div className="relative z-50 glass-panel flex flex-col gap-3 rounded-[26px] px-4 py-3.5 shadow-glow lg:flex-row lg:items-center lg:justify-between">

      {/* ── Left: Brand + Name ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        {/* Brand mark */}
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <span className="hidden text-sm font-bold tracking-tight text-slate-900 sm:block">
            Nextflow
          </span>
        </div>

        <div className="hidden h-6 w-px bg-slate-200 lg:block" />

        {/* Workflow name input */}
        <input
          value={workflowName}
          onChange={(e) => onWorkflowNameChange(e.target.value)}
          placeholder="Untitled workflow"
          className="w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100 lg:max-w-[240px]"
        />

        {/* Saved badge */}
        <AnimatePresence>
          {currentWorkflowId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Saved
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workflow browser */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSavedOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
          >
            <FolderOpenIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{workflows.length} saved</span>
          </button>
          {isSavedOpen && (
            <SavedWorkflowOverlay
              workflows={workflows}
              currentWorkflowId={currentWorkflowId}
              onClose={() => setIsSavedOpen(false)}
              onLoad={(w) => { onLoad(w); setIsSavedOpen(false); }}
            />
          )}
        </div>
      </div>

      {/* ── Right: Actions ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* New */}
        <ActionButton icon={<PlusIcon className="h-4 w-4" />} onClick={onNewWorkflow} title="New workflow">
          <span className="hidden sm:inline">New</span>
        </ActionButton>

        {/* Test workflow */}
        <button
          type="button"
          onClick={onLoadTestWorkflow}
          title="Load API test workflow"
          className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-800 transition hover:border-amber-300 hover:bg-amber-100"
        >
          <BeakerIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Test</span>
        </button>

        {/* Save */}
        <ActionButton
          icon={<CloudArrowDownIcon className="h-4 w-4" />}
          onClick={onSave}
          disabled={isSaving}
          title="Save workflow"
        >
          <span className="hidden sm:inline">{isSaving ? "Saving…" : "Save"}</span>
        </ActionButton>

        {/* Save as new */}
        <ActionButton
          icon={<ArrowPathIcon className="h-4 w-4" />}
          onClick={onSaveAsNew}
          disabled={isSaving}
          title="Save as new workflow"
        >
          <span className="hidden lg:inline">Save copy</span>
        </ActionButton>

        {/* Delete workflow */}
        {currentWorkflowId && (
          <>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              title="Delete this workflow"
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {showDeleteConfirm && (
                <DeleteConfirmOverlay
                  workflowName={workflowName}
                  onConfirm={handleDeleteConfirm}
                  onCancel={() => setShowDeleteConfirm(false)}
                />
              )}
            </AnimatePresence>
          </>
        )}

        {/* Run */}
        <button
          onClick={onRun}
          disabled={isRunning}
          title="Run workflow"
          className={`flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 ${
            isRunning ? "running-pulse" : ""
          }`}
        >
          {isRunning ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <BoltIcon className="h-4 w-4" />
          )}
          {isRunning ? "Running…" : "Run"}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          title="Sign out"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ── helpers ───────────────────────────────────────────────────── */

function ActionButton({
  icon,
  onClick,
  disabled,
  title,
  children,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-700 disabled:opacity-60"
    >
      {icon}
      {children}
    </button>
  );
}

function SavedWorkflowOverlay({
  workflows,
  currentWorkflowId,
  onClose,
  onLoad,
}: {
  workflows: WorkflowRecord[];
  currentWorkflowId: string | null;
  onClose: () => void;
  onLoad: (workflow: WorkflowRecord) => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Close saved workflows"
        onClick={onClose}
        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: -4, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="absolute left-0 top-[calc(100%+8px)] z-[9999] w-[320px] max-h-[400px] overflow-hidden rounded-[16px] border border-slate-200 bg-white p-3 shadow-xl"
      >
        <div className="border-b border-slate-100 px-2 pb-3">
          <div className="text-sm font-semibold text-slate-900">Saved workflows</div>
          <div className="mt-1 text-xs text-slate-400">
            Click a workflow to load it onto the canvas.
          </div>
        </div>

        {workflows.length > 0 ? (
          <div className="mt-3 max-h-[320px] space-y-1.5 overflow-auto">
            {workflows.map((workflow) => (
              <button
                key={workflow._id}
                type="button"
                onClick={() => onLoad(workflow)}
                className={`w-full rounded-xl px-3 py-3 text-left transition ${
                  workflow._id === currentWorkflowId
                    ? "bg-brand-50 ring-1 ring-brand-200"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-900">{workflow.name}</div>
                  {workflow._id === currentWorkflowId && (
                    <div className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                      Current
                    </div>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">
                  {new Date(workflow.updatedAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-400">
            No saved workflows yet. Add a name and click Save.
          </div>
        )}
      </motion.div>
    </>
  );
}

function DeleteConfirmOverlay({
  workflowName,
  onConfirm,
  onCancel,
}: {
  workflowName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="fixed inset-0 z-[9998] cursor-default bg-slate-950/30 backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed left-1/2 top-1/2 z-[9999] w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
          <TrashIcon className="h-6 w-6 text-rose-600" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">Delete workflow?</h3>
        <p className="mt-2 text-sm text-slate-500">
          <span className="font-medium text-slate-700">&quot;{workflowName}&quot;</span> will be permanently removed. This cannot be undone.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </>
  );
}
