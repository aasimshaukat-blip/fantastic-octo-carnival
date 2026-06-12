"use client";

import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PageHeader, Badge, Modal, useFetch } from "@/components/ui";
import { ROLES, ROLE_LABELS } from "@/lib/constants";

export default function UsersPage() {
  const { t } = useApp();
  const { data, refetch } = useFetch<{ users: any[] }>("/api/users");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "SITE_SUPERVISOR",
    phone: "",
    designation: "",
  });
  const [error, setError] = useState("");

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(typeof d.error === "string" ? d.error : "Validation failed (password min 8 chars)");
      return;
    }
    setShowNew(false);
    setForm({ name: "", email: "", password: "", role: "SITE_SUPERVISOR", phone: "", designation: "" });
    refetch();
  }

  async function toggleActive(u: any) {
    await fetch(`/api/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !u.active }),
    });
    refetch();
  }

  return (
    <div>
      <PageHeader
        title={t("users")}
        actions={<button className="btn-accent" onClick={() => setShowNew(true)}>+ {t("add")}</button>}
      />

      <div className="card overflow-x-auto p-4">
        <table className="table-base">
          <thead>
            <tr>
              <th>{t("name")}</th><th>{t("email")}</th><th>{t("role")}</th>
              <th>Designation</th><th>{t("status")}</th><th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {(data?.users ?? []).map((u) => (
              <tr key={u.id}>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td><Badge value={u.role} label={ROLE_LABELS[u.role]} /></td>
                <td>{u.designation ?? "—"}</td>
                <td>
                  <span className={u.active ? "text-emerald-600" : "text-slate-400"}>
                    {u.active ? t("active") : t("inactive")}
                  </span>
                </td>
                <td>
                  <button className="text-sm text-brand-500 hover:underline" onClick={() => toggleActive(u)}>
                    {u.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title={`${t("add")} User`}>
        <form onSubmit={createUser} className="space-y-3">
          {error && <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <input className="input" placeholder={`${t("name")} *`} required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" className="input" placeholder={`${t("email")} *`} required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="input" placeholder={`${t("password")} * (min 8)`} required minLength={8}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input" placeholder="Designation" value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setShowNew(false)}>{t("cancel")}</button>
            <button type="submit" className="btn-primary">{t("save")}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
