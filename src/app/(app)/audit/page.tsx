"use client";

import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PageHeader, useFetch, fmtDateTime } from "@/components/ui";

const ENTITIES = ["", "User", "Project", "Site", "Employee", "ManpowerLog", "Attendance", "MaterialRequest", "Equipment", "EquipmentBooking", "DailyReport"];

export default function AuditPage() {
  const { t } = useApp();
  const [entity, setEntity] = useState("");
  const { data } = useFetch<{ logs: any[] }>(`/api/audit-logs${entity ? `?entity=${entity}` : ""}`);

  return (
    <div>
      <PageHeader title={t("auditLogs")} subtitle="Immutable trail of all critical actions" />

      <div className="card mb-4 flex items-end gap-3 p-4">
        <div>
          <label className="mb-1 block text-xs font-medium">Module</label>
          <select className="input w-52" value={entity} onChange={(e) => setEntity(e.target.value)}>
            {ENTITIES.map((en) => <option key={en} value={en}>{en || t("all")}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="table-base">
          <thead>
            <tr><th>Time</th><th>User</th><th>Action</th><th>Module</th><th>Record</th><th>Details</th><th>IP</th></tr>
          </thead>
          <tbody>
            {(data?.logs ?? []).map((l) => (
              <tr key={l.id}>
                <td className="whitespace-nowrap">{fmtDateTime(l.createdAt)}</td>
                <td>{l.user?.name ?? "system"}</td>
                <td><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold dark:bg-slate-800">{l.action}</span></td>
                <td>{l.entity}</td>
                <td className="max-w-32 truncate text-xs text-slate-400">{l.entityId ?? "—"}</td>
                <td className="max-w-72 truncate text-xs text-slate-500" title={l.details ?? ""}>{l.details ?? "—"}</td>
                <td className="text-xs text-slate-400">{l.ipAddress ?? "—"}</td>
              </tr>
            ))}
            {(data?.logs ?? []).length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">{t("noData")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
