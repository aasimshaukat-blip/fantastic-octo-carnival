"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { PageHeader, Badge, KpiCard, useFetch, fmtDate } from "@/components/ui";
import { ATTENDANCE_STATUSES } from "@/lib/constants";

export default function AttendancePage() {
  const { t } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [siteId, setSiteId] = useState("");
  const [marking, setMarking] = useState(false);
  const [draft, setDraft] = useState<Record<string, { status: string; overtimeHours: number }>>({});

  const { data: sitesData } = useFetch<{ sites: any[] }>("/api/sites");
  const sites = sitesData?.sites ?? [];

  const query = useMemo(() => {
    const p = new URLSearchParams({ date });
    if (siteId) p.set("siteId", siteId);
    return p.toString();
  }, [date, siteId]);

  const { data, refetch } = useFetch<{ records: any[]; summary: any }>(`/api/attendance?${query}`);
  const { data: empData } = useFetch<{ employees: any[] }>(
    siteId ? `/api/employees?siteId=${siteId}` : null
  );

  const summary = data?.summary;
  const total = (summary?.present ?? 0) + (summary?.absent ?? 0) + (summary?.halfDay ?? 0) + (summary?.leave ?? 0);
  const rate = total ? Math.round(((summary.present + summary.halfDay * 0.5) / total) * 100) : 0;

  // Merge existing records with site roster when marking
  const roster = useMemo(() => {
    if (!marking || !empData) return [];
    const existing = new Map((data?.records ?? []).map((r) => [r.employeeId, r]));
    return empData.employees.map((emp) => ({
      ...emp,
      current: existing.get(emp.id) ?? null,
    }));
  }, [marking, empData, data]);

  async function saveAttendance() {
    const entries = roster
      .filter((emp) => draft[emp.id])
      .map((emp) => ({
        employeeId: emp.id,
        status: draft[emp.id].status,
        overtimeHours: draft[emp.id].overtimeHours,
      }));
    if (entries.length === 0) return;
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, siteId, entries }),
    });
    setMarking(false);
    setDraft({});
    refetch();
  }

  return (
    <div>
      <PageHeader
        title={t("attendance")}
        actions={
          <>
            <a className="btn-ghost" href={`/api/reports/attendance?from=${date}&to=${date}${siteId ? `&siteId=${siteId}` : ""}`}>
              ⬇ {t("exportCsv")}
            </a>
            {siteId && (
              <button className="btn-accent" onClick={() => setMarking(!marking)}>
                {marking ? t("cancel") : `✓ Mark ${t("attendance")}`}
              </button>
            )}
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard icon="✅" label={t("present")} value={summary?.present ?? 0} tone="success" />
        <KpiCard icon="❌" label={t("absent")} value={summary?.absent ?? 0} tone="danger" />
        <KpiCard icon="🌗" label={t("halfDay")} value={summary?.halfDay ?? 0} tone="warning" />
        <KpiCard icon="🏖" label={t("leave")} value={summary?.leave ?? 0} tone="info" />
        <KpiCard icon="📊" label={t("attendanceRate")} value={`${rate}%`} tone={rate >= 90 ? "success" : rate >= 75 ? "warning" : "danger"} />
      </div>

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="mb-1 block text-xs font-medium">{t("date")}</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">{t("site")}</label>
          <select className="input w-48" value={siteId} onChange={(e) => { setSiteId(e.target.value); setMarking(false); }}>
            <option value="">{t("all")}</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {marking ? (
        <div className="card overflow-x-auto p-4">
          <h2 className="mb-3 font-semibold">Mark attendance — {date}</h2>
          <table className="table-base">
            <thead>
              <tr><th>{t("employee")}</th><th>{t("status")}</th><th>{t("overtime")} (h)</th></tr>
            </thead>
            <tbody>
              {roster.map((emp) => {
                const cur = draft[emp.id]?.status ?? emp.current?.status ?? "";
                return (
                  <tr key={emp.id}>
                    <td>{emp.name} <span className="text-xs text-slate-400">({emp.empCode})</span></td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {ATTENDANCE_STATUSES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setDraft({ ...draft, [emp.id]: { status: s, overtimeHours: draft[emp.id]?.overtimeHours ?? 0 } })}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                              cur === s
                                ? "bg-brand-700 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {s.replaceAll("_", " ")}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td>
                      <input
                        type="number" min={0} max={16} step={0.5} className="input w-20"
                        value={draft[emp.id]?.overtimeHours ?? emp.current?.overtimeHours ?? 0}
                        onChange={(e) =>
                          setDraft({ ...draft, [emp.id]: { status: draft[emp.id]?.status ?? emp.current?.status ?? "PRESENT", overtimeHours: Number(e.target.value) } })
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-3 flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setMarking(false)}>{t("cancel")}</button>
            <button className="btn-primary" onClick={saveAttendance}>{t("save")}</button>
          </div>
        </div>
      ) : (
        <div className="card overflow-x-auto p-4">
          <table className="table-base">
            <thead>
              <tr>
                <th>{t("date")}</th><th>{t("site")}</th><th>{t("employee")}</th>
                <th>{t("status")}</th><th>{t("checkIn")}</th><th>{t("checkOut")}</th><th>{t("overtime")}</th>
              </tr>
            </thead>
            <tbody>
              {(data?.records ?? []).map((r) => (
                <tr key={r.id}>
                  <td>{fmtDate(r.date)}</td>
                  <td>{r.site.name}</td>
                  <td>{r.employee.name} <span className="text-xs text-slate-400">({r.employee.empCode})</span></td>
                  <td><Badge value={r.status} /></td>
                  <td>{r.checkIn ? new Date(r.checkIn).toISOString().slice(11, 16) : "—"}</td>
                  <td>{r.checkOut ? new Date(r.checkOut).toISOString().slice(11, 16) : "—"}</td>
                  <td>{r.overtimeHours || "—"}</td>
                </tr>
              ))}
              {(data?.records ?? []).length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400">{t("noData")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
