"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { PageHeader, Badge, Modal, useFetch, fmtDate } from "@/components/ui";
import { PRIORITIES, MR_STATUSES, MR_STATUS_LABELS, UNITS } from "@/lib/constants";

interface ItemRow {
  description: string;
  materialCode: string;
  quantity: string;
  unit: string;
}

export default function MaterialsPage() {
  const { t } = useApp();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [siteId, setSiteId] = useState("");

  const { data: sitesData } = useFetch<{ sites: any[] }>("/api/sites");
  const sites = sitesData?.sites ?? [];

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    if (priority) p.set("priority", priority);
    if (siteId) p.set("siteId", siteId);
    return p.toString();
  }, [status, priority, siteId]);

  const { data, loading, refetch } = useFetch<{ requests: any[] }>(`/api/material-requests?${query}`);

  // New request modal
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    siteId: "",
    priority: "MEDIUM",
    requiredDate: "",
    justification: "",
    drawingRef: "",
  });
  const [items, setItems] = useState<ItemRow[]>([{ description: "", materialCode: "", quantity: "1", unit: "pcs" }]);
  const [error, setError] = useState("");

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/material-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteId: form.siteId,
        priority: form.priority,
        requiredDate: form.requiredDate || null,
        justification: form.justification,
        drawingRef: form.drawingRef,
        items: items
          .filter((i) => i.description.trim())
          .map((i) => ({
            description: i.description,
            materialCode: i.materialCode || undefined,
            quantity: Number(i.quantity),
            unit: i.unit,
          })),
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(typeof d.error === "string" ? d.error : "Validation failed — check items and required fields");
      return;
    }
    setShowNew(false);
    setItems([{ description: "", materialCode: "", quantity: "1", unit: "pcs" }]);
    refetch();
  }

  return (
    <div>
      <PageHeader
        title={t("materials")}
        actions={
          <>
            <a className="btn-ghost" href="/api/reports/materials">⬇ {t("exportCsv")}</a>
            <button className="btn-accent" onClick={() => setShowNew(true)}>+ {t("newRequest")}</button>
          </>
        }
      />

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="mb-1 block text-xs font-medium">{t("status")}</label>
          <select className="input w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{t("all")}</option>
            {MR_STATUSES.map((s) => <option key={s} value={s}>{MR_STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">{t("priority")}</label>
          <select className="input w-36" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">{t("all")}</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">{t("site")}</label>
          <select className="input w-44" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
            <option value="">{t("all")}</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto p-4">
        {loading ? (
          <p className="py-8 text-center text-slate-400">{t("loading")}</p>
        ) : (
          <table className="table-base">
            <thead>
              <tr>
                <th>{t("requestNo")}</th>
                <th>{t("date")}</th>
                <th>{t("site")}</th>
                <th>{t("requestor")}</th>
                <th>Items</th>
                <th>{t("priority")}</th>
                <th>{t("status")}</th>
                <th>{t("requiredDate")}</th>
              </tr>
            </thead>
            <tbody>
              {(data?.requests ?? []).map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/materials/${r.id}`} className="font-medium text-brand-500 hover:underline">
                      {r.requestNo}
                    </Link>
                  </td>
                  <td>{fmtDate(r.date)}</td>
                  <td>{r.site.name}</td>
                  <td>{r.requestor.name}</td>
                  <td>{r._count.items}</td>
                  <td><Badge value={r.priority} /></td>
                  <td><Badge value={r.status} label={MR_STATUS_LABELS[r.status]} /></td>
                  <td>{fmtDate(r.requiredDate)}</td>
                </tr>
              ))}
              {(data?.requests ?? []).length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-slate-400">{t("noData")}</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title={t("newRequest")} wide>
        <form onSubmit={submitRequest} className="space-y-3">
          {error && <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium">{t("site")} *</label>
              <select className="input" required value={form.siteId}
                onChange={(e) => setForm({ ...form, siteId: e.target.value })}>
                <option value="">—</option>
                {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{t("priority")} *</label>
              <select className="input" value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{t("requiredDate")}</label>
              <input type="date" className="input" value={form.requiredDate}
                onChange={(e) => setForm({ ...form, requiredDate: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Material Items *</label>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <input className="input col-span-5" placeholder={t("description")} value={item.description}
                    onChange={(e) => setItems(items.map((it, j) => (j === i ? { ...it, description: e.target.value } : it)))} />
                  <input className="input col-span-3" placeholder={t("materialCode")} value={item.materialCode}
                    onChange={(e) => setItems(items.map((it, j) => (j === i ? { ...it, materialCode: e.target.value } : it)))} />
                  <input type="number" min="0.01" step="any" className="input col-span-2" placeholder={t("quantity")} value={item.quantity}
                    onChange={(e) => setItems(items.map((it, j) => (j === i ? { ...it, quantity: e.target.value } : it)))} />
                  <select className="input col-span-2" value={item.unit}
                    onChange={(e) => setItems(items.map((it, j) => (j === i ? { ...it, unit: e.target.value } : it)))}>
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button type="button" className="mt-2 text-sm text-brand-500 hover:underline"
              onClick={() => setItems([...items, { description: "", materialCode: "", quantity: "1", unit: "pcs" }])}>
              + Add item
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">{t("justification")}</label>
              <textarea className="input" rows={2} value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{t("drawingRef")}</label>
              <input className="input" value={form.drawingRef} placeholder="DWG-P-1024 Rev C"
                onChange={(e) => setForm({ ...form, drawingRef: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setShowNew(false)}>{t("cancel")}</button>
            <button type="submit" className="btn-primary">{t("submit")}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
