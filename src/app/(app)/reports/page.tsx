"use client";

import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PageHeader, useFetch } from "@/components/ui";

const REPORTS = [
  { type: "daily-site", icon: "📋", title: "Daily Site Report", desc: "Progress, safety, weather and blockers per site per day." },
  { type: "manpower", icon: "👷", title: "Manpower Report", desc: "Daily logs by site, trade, company and hours worked." },
  { type: "attendance", icon: "🕐", title: "Attendance Report", desc: "Check-in/out, status, and overtime per employee." },
  { type: "materials", icon: "📦", title: "Material Request Report", desc: "All requests with items, priority, status and PO numbers." },
  { type: "equipment", icon: "🏋️", title: "Equipment Utilization Report", desc: "Bookings, hours, sites and operators per equipment." },
];

export default function ReportsPage() {
  const { t } = useApp();
  const [from, setFrom] = useState(new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [siteId, setSiteId] = useState("");
  const { data: sitesData } = useFetch<{ sites: any[] }>("/api/sites");

  const qs = (type: string) =>
    `/api/reports/${type}?from=${from}&to=${to}${siteId ? `&siteId=${siteId}` : ""}`;

  return (
    <div>
      <PageHeader title={t("reports")} subtitle="Export Excel-compatible CSV, or use the browser's Print → PDF for formatted output." />

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="mb-1 block text-xs font-medium">From</label>
          <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">To</label>
          <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">{t("site")}</label>
          <select className="input w-48" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
            <option value="">{t("all")}</option>
            {(sitesData?.sites ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <button className="btn-ghost" onClick={() => window.print()}>🖨 {t("exportPdf")}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.type} className="card flex flex-col p-5">
            <div className="text-3xl">{r.icon}</div>
            <h2 className="mt-2 font-semibold">{r.title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-500">{r.desc}</p>
            <a href={qs(r.type)} className="btn-primary mt-4 text-center">
              ⬇ {t("exportCsv")}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
