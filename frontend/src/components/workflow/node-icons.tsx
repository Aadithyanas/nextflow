"use client";

import { WorkflowNodeType } from "@/lib/types";

// SVG icon components for each node type
export function TriggerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function AiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ApiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function StateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export function OutputIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export const NODE_META: Record<
  WorkflowNodeType,
  {
    Icon: React.FC<{ className?: string }>;
    label: string;
    iconBg: string;
    iconText: string;
    borderColor: string;
    gradientFrom: string;
    gradientTo: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  trigger: {
    Icon: TriggerIcon,
    label: "Trigger",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    borderColor: "border-emerald-100",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-teal-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
  },
  ai: {
    Icon: AiIcon,
    label: "AI",
    iconBg: "bg-brand-50",
    iconText: "text-brand-600",
    borderColor: "border-brand-100",
    gradientFrom: "from-sky-400",
    gradientTo: "to-brand-500",
    badgeBg: "bg-brand-50",
    badgeText: "text-brand-700",
  },
  api: {
    Icon: ApiIcon,
    label: "API",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    borderColor: "border-amber-100",
    gradientFrom: "from-orange-400",
    gradientTo: "to-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
  },
  state: {
    Icon: StateIcon,
    label: "State",
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    borderColor: "border-purple-100",
    gradientFrom: "from-fuchsia-400",
    gradientTo: "to-purple-500",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
  },
  output: {
    Icon: OutputIcon,
    label: "Output",
    iconBg: "bg-slate-50",
    iconText: "text-slate-600",
    borderColor: "border-slate-100",
    gradientFrom: "from-slate-500",
    gradientTo: "to-slate-800",
    badgeBg: "bg-slate-50",
    badgeText: "text-slate-700",
  },
};
