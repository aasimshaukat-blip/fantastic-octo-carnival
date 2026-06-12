"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";

export function KpiCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  icon?: string;
  tone?: "default" | "success" | "danger" | "warning" | "info";
}) {
  const tones: Record<string, string> = {
    default: "text-slate-900 dark:text-white",
    success: "text-emerald-600 dark:text-emerald-400",
    danger: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    info: "text-brand-500 dark:text-blue-400",
  };
  return (
    <div className="card flex items-center gap-4 p-4">
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className={`text-2xl font-bold ${tones[tone]}`}>{value}</div>
        <div className="truncate text-xs text-slate-500 dark:text-slate-400">{label}</div>
      </div>
    </div>
  );
}

const BADGE_STYLES: Record<string, string> = {
  // priorities
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  LOW: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  // MR workflow
  SUBMITTED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  UNDER_REVIEW: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  PO_CREATED: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  ORDERED: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  IN_TRANSIT: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  CLOSED: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  // generic states
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  PLANNED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  COMPLETED: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  // attendance
  PRESENT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  ABSENT: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  HALF_DAY: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  LEAVE: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  // equipment
  AVAILABLE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  IN_USE: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  MAINTENANCE: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  OUT_OF_SERVICE: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  CONFIRMED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  CANCELLED: "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
};

export function Badge({ value, label }: { value: string; label?: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        BADGE_STYLES[value] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {label ?? value.replaceAll("_", " ")}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold lg:text-2xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full ${clamped >= 80 ? "bg-emerald-500" : clamped >= 40 ? "bg-brand-500" : "bg-accent-500"}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="w-9 text-end text-xs font-medium text-slate-500">{Math.round(clamped)}%</span>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-12">
      <div className={`card w-full ${wide ? "max-w-3xl" : "max-w-lg"} p-5`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Lightweight data-fetching hook with refetch support. */
export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!url) return;
    setLoading(true);
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.error ?? `HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function fmtDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toISOString().slice(0, 10);
}

export function fmtDateTime(d: string | Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toISOString().slice(0, 16).replace("T", " ");
}
