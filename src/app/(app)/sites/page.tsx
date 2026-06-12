"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { PageHeader, Badge, ProgressBar, Modal, useFetch, fmtDate } from "@/components/ui";

interface Project {
  id: string;
  code: string;
  name: string;
  clientName: string;
  status: string;
  startDate: string;
  endDate: string | null;
  progressPct: number;
  manager: { id: string; name: string } | null;
  sites: {
    id: string;
    code: string;
    name: string;
    location: string;
    emirate: string | null;
    status: string;
    supervisor: { id: string; name: string } | null;
    _count: { employees: number };
  }[];
}

export default function SitesPage() {
  const { t } = useApp();
  const { data, loading, refetch } = useFetch<{ projects: Project[] }>("/api/projects");
  const { data: usersData } = useFetch<{ users: { id: string; name: string; role: string }[] }>("/api/users");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    clientName: "",
    startDate: new Date().toISOString().slice(0, 10),
    managerId: "",
    siteCode: "",
    siteName: "",
    siteLocation: "",
    emirate: "Abu Dhabi",
    supervisorId: "",
  });
  const [error, setError] = useState("");

  const pms = usersData?.users.filter((u) => u.role === "PROJECT_MANAGER") ?? [];
  const sups = usersData?.users.filter((u) => u.role === "SITE_SUPERVISOR") ?? [];

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        name: form.name,
        clientName: form.clientName,
        startDate: form.startDate,
        managerId: form.managerId || null,
        sites: form.siteName
          ? [{
              code: form.siteCode || `${form.code}-S1`,
              name: form.siteName,
              location: form.siteLocation,
              emirate: form.emirate,
              supervisorId: form.supervisorId || null,
            }]
          : [],
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(typeof d.error === "string" ? d.error : "Validation failed — check required fields");
      return;
    }
    setShowNew(false);
    refetch();
  }

  if (loading) return <div className="p-8 text-center text-slate-400">{t("loading")}</div>;

  return (
    <div>
      <PageHeader
        title={t("sites")}
        actions={
          <button className="btn-accent" onClick={() => setShowNew(true)}>
            + {t("add")}
          </button>
        }
      />

      <div className="grid gap-4">
        {data?.projects.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold">{p.name}</h2>
                  <Badge value={p.status} />
                </div>
                <p className="mt-0.5 text-sm text-slate-500">
                  {p.code} · {t("client")}: {p.clientName} · PM: {p.manager?.name ?? "—"} ·{" "}
                  {fmtDate(p.startDate)} → {fmtDate(p.endDate)}
                </p>
              </div>
              <div className="w-44">
                <ProgressBar pct={p.progressPct} />
              </div>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {p.sites.map((s) => (
                <Link
                  key={s.id}
                  href={`/sites/${s.id}`}
                  className="rounded-lg border border-slate-200 p-3 transition hover:border-brand-500 hover:shadow dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{s.name}</span>
                    <Badge value={s.status} />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    📍 {s.location} {s.emirate ? `(${s.emirate})` : ""}
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>👤 {s.supervisor?.name ?? "No supervisor"}</span>
                    <span>👷 {s._count.employees}</span>
                  </div>
                </Link>
              ))}
              {p.sites.length === 0 && (
                <p className="text-sm text-slate-400">{t("noData")}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title={`${t("add")} ${t("project")}`} wide>
        <form onSubmit={createProject} className="grid gap-3 md:grid-cols-2">
          {error && <div className="md:col-span-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div>
            <label className="mb-1 block text-xs font-medium">Project Code *</label>
            <input className="input" required value={form.code} placeholder="ACE-2026-001"
              onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">{t("project")} *</label>
            <input className="input" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">{t("client")} *</label>
            <input className="input" required value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Start Date *</label>
            <input type="date" className="input" required value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Project Manager</label>
            <select className="input" value={form.managerId}
              onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
              <option value="">—</option>
              {pms.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 mt-2 border-t border-slate-200 pt-3 text-sm font-semibold dark:border-slate-700">
            First site (optional)
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">{t("site")} {t("name")}</label>
            <input className="input" value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">{t("location")}</label>
            <input className="input" value={form.siteLocation} placeholder="Ruwais, Abu Dhabi"
              onChange={(e) => setForm({ ...form, siteLocation: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Emirate</label>
            <select className="input" value={form.emirate}
              onChange={(e) => setForm({ ...form, emirate: e.target.value })}>
              {["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"].map((e2) => (
                <option key={e2}>{e2}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Site Supervisor</label>
            <select className="input" value={form.supervisorId}
              onChange={(e) => setForm({ ...form, supervisorId: e.target.value })}>
              <option value="">—</option>
              {sups.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setShowNew(false)}>{t("cancel")}</button>
            <button type="submit" className="btn-primary">{t("save")}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
