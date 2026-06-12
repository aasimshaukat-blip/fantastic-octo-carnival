"use client";

import { use, useEffect, useState } from "react";
import { useApp } from "@/components/Providers";
import { PageHeader, Badge, useFetch, fmtDate, fmtDateTime } from "@/components/ui";
import { MR_TRANSITIONS, MR_STATUS_LABELS, MR_STATUSES } from "@/lib/constants";
import { hasPermission, Role } from "@/lib/permissions";

const APPROVAL_STEPS = new Set(["UNDER_REVIEW", "APPROVED", "REJECTED"]);
const PROCUREMENT_STEPS = new Set(["UNDER_REVIEW", "PO_CREATED", "ORDERED", "IN_TRANSIT", "DELIVERED", "CLOSED", "REJECTED"]);

export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useApp();
  const { data, refetch, error } = useFetch<{ request: any }>(`/api/material-requests/${id}`);
  const [me, setMe] = useState<{ role: Role } | null>(null);
  const [note, setNote] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setMe(d.user)).catch(() => {});
  }, []);

  const r = data?.request;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!r) return <div className="p-8 text-center text-slate-400">{t("loading")}</div>;

  const allowedNext = (MR_TRANSITIONS[r.status] ?? []).filter((next: string) => {
    if (!me) return false;
    return (
      (APPROVAL_STEPS.has(next) && hasPermission(me.role, "materials.approve")) ||
      (PROCUREMENT_STEPS.has(next) && hasPermission(me.role, "materials.procure"))
    );
  });

  async function moveTo(status: string) {
    setActionError("");
    const res = await fetch(`/api/material-requests/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note: note || undefined, poNumber: poNumber || undefined }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setActionError(typeof d.error === "string" ? d.error : "Action failed");
      return;
    }
    setNote("");
    refetch();
  }

  const stageIndex = MR_STATUSES.indexOf(r.status);

  return (
    <div>
      <PageHeader
        title={r.requestNo}
        subtitle={`${r.site.name} · ${t("requestor")}: ${r.requestor.name} · ${fmtDate(r.date)}`}
        actions={
          <>
            <Badge value={r.priority} />
            <Badge value={r.status} label={MR_STATUS_LABELS[r.status]} />
          </>
        }
      />

      {/* Workflow progress */}
      <div className="card mb-4 overflow-x-auto p-4">
        <div className="flex min-w-[700px] items-center">
          {MR_STATUSES.filter((s) => s !== "REJECTED").map((s, i) => {
            const reached = r.status === "REJECTED" ? false : i <= stageIndex;
            return (
              <div key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      reached ? "bg-brand-700 text-white" : "bg-slate-200 text-slate-400 dark:bg-slate-700"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="mt-1 whitespace-nowrap text-[10px] text-slate-500">{MR_STATUS_LABELS[s]}</span>
                </div>
                {i < 7 && <div className={`mx-1 h-0.5 flex-1 ${i < stageIndex ? "bg-brand-700" : "bg-slate-200 dark:bg-slate-700"}`} />}
              </div>
            );
          })}
        </div>
        {r.status === "REJECTED" && (
          <p className="mt-3 text-sm font-semibold text-red-600">✕ This request was rejected.</p>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Items */}
        <div className="card overflow-x-auto p-4 xl:col-span-2">
          <h2 className="mb-3 font-semibold">Items</h2>
          <table className="table-base">
            <thead>
              <tr><th>#</th><th>{t("description")}</th><th>{t("materialCode")}</th><th>{t("quantity")}</th><th>{t("unit")}</th></tr>
            </thead>
            <tbody>
              {r.items.map((i: any, idx: number) => (
                <tr key={i.id}>
                  <td>{idx + 1}</td>
                  <td>{i.description}</td>
                  <td>{i.materialCode ?? "—"}</td>
                  <td>{i.quantity}</td>
                  <td>{i.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div><span className="text-slate-500">{t("requiredDate")}:</span> {fmtDate(r.requiredDate)}</div>
            <div><span className="text-slate-500">{t("drawingRef")}:</span> {r.drawingRef ?? "—"}</div>
            <div><span className="text-slate-500">PO:</span> {r.poNumber ?? "—"}</div>
            <div><span className="text-slate-500">Approved by:</span> {r.approver?.name ?? "—"}</div>
            {r.justification && (
              <div className="md:col-span-2"><span className="text-slate-500">{t("justification")}:</span> {r.justification}</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Actions */}
          {allowedNext.length > 0 && (
            <div className="card p-4">
              <h2 className="mb-3 font-semibold">{t("actions")}</h2>
              {actionError && <div className="mb-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</div>}
              <input className="input mb-2" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
              {r.status === "APPROVED" && (
                <input className="input mb-2" placeholder="PO Number" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
              )}
              <div className="flex flex-wrap gap-2">
                {allowedNext.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => moveTo(s)}
                    className={s === "REJECTED" ? "btn bg-red-600 text-white hover:bg-red-700" : "btn-primary"}
                  >
                    {s === "REJECTED" ? t("reject") : `→ ${MR_STATUS_LABELS[s]}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          <div className="card p-4">
            <h2 className="mb-3 font-semibold">History</h2>
            <ol className="space-y-2 text-sm">
              {r.statusHistory.map((h: any) => (
                <li key={h.id} className="flex gap-2">
                  <span className="text-slate-400">{fmtDateTime(h.createdAt)}</span>
                  <span>
                    {h.fromState ? `${MR_STATUS_LABELS[h.fromState]} → ` : ""}
                    <b>{MR_STATUS_LABELS[h.toState]}</b>
                    {h.note && <span className="text-slate-500"> — {h.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
