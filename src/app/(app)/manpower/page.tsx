"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { PageHeader, Modal, useFetch, fmtDate } from "@/components/ui";
import { TRADES, TRADE_LABELS } from "@/lib/constants";

export default function ManpowerPage() {
  const { t } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const [filterSite, setFilterSite] = useState("");
  const [filterTrade, setFilterTrade] = useState("");
  const [from, setFrom] = useState(new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));

  const query = useMemo(() => {
    const p = new URLSearchParams({ from });
    if (filterSite) p.set("siteId", filterSite);
    if (filterTrade) p.set("trade", filterTrade);
    return p.toString();
  }, [filterSite, filterTrade, from]);

  const { data, loading, refetch } = useFetch<{ logs: any[] }>(`/api/manpower?${query}`);
  const { data: sitesData } = useFetch<{ sites: any[] }>("/api/sites");
  const sites = sitesData?.sites ?? [];

  // Bulk entry modal
  const [showEntry, setShowEntry] = useState(false);
  const [entrySite, setEntrySite] = useState("");
  const [entryDate, setEntryDate] = useState(today);
  const { data: empData } = useFetch<{ employees: any[] }>(
    entrySite ? `/api/employees?siteId=${entrySite}` : null
  );
  const [rows, setRows] = useState<Record<string, { selected: boolean; hours: number }>>({});
  const [error, setError] = useState("");

  async function submitEntry(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const entries = (empData?.employees ?? [])
      .filter((emp) => rows[emp.id]?.selected)
      .map((emp) => ({
        employeeId: emp.id,
        trade: emp.trade,
        company: emp.company,
        hoursWorked: rows[emp.id]?.hours ?? 8,
      }));
    if (entries.length === 0) {
      setError("Select at least one employee");
      return;
    }
    const res = await fetch("/api/manpower", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: entryDate, siteId: entrySite, entries }),
    });
    if (!res.ok) {
      setError("Failed to save");
      return;
    }
    setShowEntry(false);
    setRows({});
    refetch();
  }

  return (
    <div>
      <PageHeader
        title={t("manpower")}
        actions={
          <button className="btn-accent" onClick={() => setShowEntry(true)}>
            + Daily Entry
          </button>
        }
      />

      {/* Filters */}
      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="mb-1 block text-xs font-medium">{t("site")}</label>
          <select className="input w-44" value={filterSite} onChange={(e) => setFilterSite(e.target.value)}>
            <option value="">{t("all")}</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">{t("trade")}</label>
          <select className="input w-44" value={filterTrade} onChange={(e) => setFilterTrade(e.target.value)}>
            <option value="">{t("all")}</option>
            {TRADES.map((tr) => <option key={tr} value={tr}>{TRADE_LABELS[tr]}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">From</label>
          <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <a className="btn-ghost" href={`/api/reports/manpower?from=${from}${filterSite ? `&siteId=${filterSite}` : ""}`}>
          ⬇ {t("exportCsv")}
        </a>
      </div>

      <div className="card overflow-x-auto p-4">
        {loading ? (
          <p className="py-8 text-center text-slate-400">{t("loading")}</p>
        ) : (
          <table className="table-base">
            <thead>
              <tr>
                <th>{t("date")}</th>
                <th>{t("site")}</th>
                <th>{t("employee")}</th>
                <th>ID</th>
                <th>{t("trade")}</th>
                <th>{t("company")}</th>
                <th>{t("hours")}</th>
              </tr>
            </thead>
            <tbody>
              {(data?.logs ?? []).map((l) => (
                <tr key={l.id}>
                  <td>{fmtDate(l.date)}</td>
                  <td>{l.site.name}</td>
                  <td>{l.employee.name}</td>
                  <td className="text-xs text-slate-500">{l.employee.empCode}</td>
                  <td>{TRADE_LABELS[l.trade] ?? l.trade}</td>
                  <td>{l.company}</td>
                  <td>{l.hoursWorked}</td>
                </tr>
              ))}
              {(data?.logs ?? []).length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400">{t("noData")}</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showEntry} onClose={() => setShowEntry(false)} title="Daily Manpower Entry" wide>
        <form onSubmit={submitEntry} className="space-y-3">
          {error && <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">{t("date")} *</label>
              <input type="date" className="input" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{t("site")} *</label>
              <select className="input" value={entrySite} onChange={(e) => setEntrySite(e.target.value)} required>
                <option value="">—</option>
                {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {entrySite && (
            <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="table-base">
                <thead>
                  <tr><th></th><th>{t("employee")}</th><th>{t("trade")}</th><th>{t("hours")}</th></tr>
                </thead>
                <tbody>
                  {(empData?.employees ?? []).map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={rows[emp.id]?.selected ?? false}
                          onChange={(e) =>
                            setRows({ ...rows, [emp.id]: { selected: e.target.checked, hours: rows[emp.id]?.hours ?? 8 } })
                          }
                        />
                      </td>
                      <td>{emp.name} <span className="text-xs text-slate-400">({emp.empCode})</span></td>
                      <td>{TRADE_LABELS[emp.trade] ?? emp.trade}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          className="input w-20"
                          value={rows[emp.id]?.hours ?? 8}
                          onChange={(e) =>
                            setRows({ ...rows, [emp.id]: { selected: rows[emp.id]?.selected ?? false, hours: Number(e.target.value) } })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                  {(empData?.employees ?? []).length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-slate-400">No employees assigned to this site</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setShowEntry(false)}>{t("cancel")}</button>
            <button type="submit" className="btn-primary">{t("save")}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
