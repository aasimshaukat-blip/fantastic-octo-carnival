"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { PageHeader, Badge, useFetch, fmtDate } from "@/components/ui";
import { TRADE_LABELS } from "@/lib/constants";

export default function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useApp();
  const today = new Date().toISOString().slice(0, 10);

  const { data: siteData } = useFetch<{ sites: any[] }>(`/api/sites`);
  const site = siteData?.sites.find((s) => s.id === id);

  const { data: manpower } = useFetch<{ logs: any[] }>(`/api/manpower?siteId=${id}&from=${today}`);
  const { data: attendance } = useFetch<{ records: any[]; summary: any }>(
    `/api/attendance?siteId=${id}&date=${today}`
  );
  const { data: materials } = useFetch<{ requests: any[] }>(`/api/material-requests?siteId=${id}`);
  const { data: reports, refetch: refetchReports } = useFetch<{ reports: any[] }>(
    `/api/daily-reports?siteId=${id}`
  );

  const [reportForm, setReportForm] = useState({ progressNotes: "", safetyNotes: "", weather: "", blockers: "" });
  const [savingReport, setSavingReport] = useState(false);

  async function saveReport(e: React.FormEvent) {
    e.preventDefault();
    setSavingReport(true);
    await fetch("/api/daily-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today, siteId: id, ...reportForm }),
    });
    setSavingReport(false);
    setReportForm({ progressNotes: "", safetyNotes: "", weather: "", blockers: "" });
    refetchReports();
  }

  if (!site) return <div className="p-8 text-center text-slate-400">{t("loading")}</div>;

  const summary = attendance?.summary;

  return (
    <div>
      <PageHeader
        title={site.name}
        subtitle={`${site.code} · ${site.project?.name} · ${t("client")}: ${site.project?.clientName}`}
        actions={<Badge value={site.status} />}
      />

      <div className="grid gap-3 md:grid-cols-4">
        <div className="card p-4">
          <div className="text-xs text-slate-500">{t("location")}</div>
          <div className="font-semibold">📍 {site.location}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Supervisor</div>
          <div className="font-semibold">{site.supervisor?.name ?? "—"}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">{t("manpower")} ({t("today")})</div>
          <div className="font-semibold">{manpower?.logs.length ?? 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">{t("attendance")} ({t("today")})</div>
          <div className="font-semibold">
            {summary ? `${summary.present} ✅ / ${summary.absent} ❌ / ${summary.leave} 🏖` : "—"}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {/* Today's manpower */}
        <div className="card overflow-x-auto p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">{t("manpower")} — {t("today")}</h2>
            <Link href="/manpower" className="text-sm text-brand-500 hover:underline">{t("add")} →</Link>
          </div>
          <table className="table-base">
            <thead>
              <tr><th>{t("employee")}</th><th>{t("trade")}</th><th>{t("company")}</th><th>{t("hours")}</th></tr>
            </thead>
            <tbody>
              {(manpower?.logs ?? []).map((l) => (
                <tr key={l.id}>
                  <td>{l.employee.name} <span className="text-xs text-slate-400">({l.employee.empCode})</span></td>
                  <td>{TRADE_LABELS[l.trade] ?? l.trade}</td>
                  <td>{l.company}</td>
                  <td>{l.hoursWorked}</td>
                </tr>
              ))}
              {(manpower?.logs ?? []).length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-slate-400">{t("noData")}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Material requests */}
        <div className="card overflow-x-auto p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">{t("materials")}</h2>
            <Link href="/materials" className="text-sm text-brand-500 hover:underline">{t("all")} →</Link>
          </div>
          <table className="table-base">
            <thead>
              <tr><th>{t("requestNo")}</th><th>{t("date")}</th><th>{t("priority")}</th><th>{t("status")}</th></tr>
            </thead>
            <tbody>
              {(materials?.requests ?? []).slice(0, 8).map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/materials/${r.id}`} className="font-medium text-brand-500 hover:underline">
                      {r.requestNo}
                    </Link>
                  </td>
                  <td>{fmtDate(r.date)}</td>
                  <td><Badge value={r.priority} /></td>
                  <td><Badge value={r.status} /></td>
                </tr>
              ))}
              {(materials?.requests ?? []).length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-slate-400">{t("noData")}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Daily report entry */}
        <div className="card p-4">
          <h2 className="mb-3 font-semibold">{t("dailyReport")} — {t("today")}</h2>
          <form onSubmit={saveReport} className="space-y-3">
            <textarea
              className="input"
              rows={3}
              required
              placeholder="Progress notes *"
              value={reportForm.progressNotes}
              onChange={(e) => setReportForm({ ...reportForm, progressNotes: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Safety notes" value={reportForm.safetyNotes}
                onChange={(e) => setReportForm({ ...reportForm, safetyNotes: e.target.value })} />
              <input className="input" placeholder="Weather" value={reportForm.weather}
                onChange={(e) => setReportForm({ ...reportForm, weather: e.target.value })} />
            </div>
            <input className="input" placeholder="Blockers / issues" value={reportForm.blockers}
              onChange={(e) => setReportForm({ ...reportForm, blockers: e.target.value })} />
            <button className="btn-primary" disabled={savingReport}>{t("save")}</button>
          </form>
        </div>

        {/* Recent daily reports */}
        <div className="card p-4">
          <h2 className="mb-3 font-semibold">{t("dailyReport")} — History</h2>
          <div className="space-y-3">
            {(reports?.reports ?? []).slice(0, 5).map((r) => (
              <div key={r.id} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
                <div className="font-semibold">{fmtDate(r.date)}</div>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{r.progressNotes}</p>
                {r.blockers && <p className="mt-1 text-xs text-red-500">⚠ {r.blockers}</p>}
              </div>
            ))}
            {(reports?.reports ?? []).length === 0 && (
              <p className="py-4 text-center text-sm text-slate-400">{t("noData")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
