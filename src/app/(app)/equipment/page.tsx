"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { PageHeader, Badge, Modal, useFetch, fmtDate } from "@/components/ui";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";

const DAY_MS = 86400000;

function startOfWeek(d: Date): Date {
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = (day.getUTCDay() + 6) % 7; // Monday = 0
  return new Date(day.getTime() - dow * DAY_MS);
}

export default function EquipmentPage() {
  const { t } = useApp();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * DAY_MS)),
    [weekStart]
  );
  const weekEnd = new Date(weekStart.getTime() + 7 * DAY_MS);

  const { data: eqData, refetch: refetchEq } = useFetch<{ equipment: any[] }>("/api/equipment");
  const { data: bookingsData, refetch: refetchBookings } = useFetch<{ bookings: any[] }>(
    `/api/equipment/bookings?from=${weekStart.toISOString()}&to=${weekEnd.toISOString()}`
  );
  const { data: sitesData } = useFetch<{ sites: any[] }>("/api/sites");
  const sites = sitesData?.sites ?? [];
  const equipment = eqData?.equipment ?? [];
  const bookings = bookingsData?.bookings ?? [];

  // Booking modal
  const [showBook, setShowBook] = useState(false);
  const [form, setForm] = useState({
    equipmentId: "",
    siteId: "",
    date: new Date().toISOString().slice(0, 10),
    startHour: "07:00",
    endHour: "17:00",
    purpose: "",
  });
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);

  function openBooking(equipmentId = "", date?: Date) {
    setForm({
      ...form,
      equipmentId,
      date: (date ?? new Date()).toISOString().slice(0, 10),
    });
    setError("");
    setSuggestion(null);
    setShowBook(true);
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuggestion(null);
    const res = await fetch("/api/equipment/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        equipmentId: form.equipmentId,
        siteId: form.siteId,
        startTime: `${form.date}T${form.startHour}:00.000Z`,
        endTime: `${form.date}T${form.endHour}:00.000Z`,
        purpose: form.purpose,
      }),
    });
    const d = await res.json().catch(() => ({}));
    if (res.status === 409) {
      const c = d.conflicts?.[0];
      setError(`Conflict: booked by ${c?.bookedBy} for ${c?.site}`);
      if (d.suggestedSlot) {
        setSuggestion(
          `Next free slot: ${new Date(d.suggestedSlot.startTime).toISOString().slice(0, 16).replace("T", " ")}`
        );
      }
      return;
    }
    if (!res.ok) {
      setError(typeof d.error === "string" ? d.error : "Booking failed");
      return;
    }
    setShowBook(false);
    refetchBookings();
    refetchEq();
  }

  async function cancelBooking(id: string) {
    await fetch(`/api/equipment/bookings/${id}`, { method: "DELETE" });
    refetchBookings();
  }

  return (
    <div>
      <PageHeader
        title={t("equipment")}
        actions={
          <>
            <a className="btn-ghost" href="/api/reports/equipment">⬇ {t("exportCsv")}</a>
            <button className="btn-accent" onClick={() => openBooking()}>+ {t("bookEquipment")}</button>
          </>
        }
      />

      {/* Weekly calendar */}
      <div className="card mb-4 overflow-x-auto p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">📅 Booking Calendar</h2>
          <div className="flex items-center gap-2 text-sm">
            <button className="btn-ghost px-2 py-1" onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * DAY_MS))}>←</button>
            <span className="font-medium">{fmtDate(weekStart)} – {fmtDate(new Date(weekEnd.getTime() - DAY_MS))}</span>
            <button className="btn-ghost px-2 py-1" onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * DAY_MS))}>→</button>
          </div>
        </div>
        <table className="w-full min-w-[800px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="w-44 border border-slate-200 p-2 text-start dark:border-slate-700">{t("equipment")}</th>
              {days.map((d) => (
                <th key={d.toISOString()} className="border border-slate-200 p-2 dark:border-slate-700">
                  {d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" })}
                  <div className="font-normal text-slate-400">{d.toISOString().slice(5, 10)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equipment.map((eq) => (
              <tr key={eq.id}>
                <td className="border border-slate-200 p-2 dark:border-slate-700">
                  <div className="font-semibold">{eq.name}</div>
                  <div className="text-slate-400">{eq.code}</div>
                </td>
                {days.map((d) => {
                  const dayEnd = new Date(d.getTime() + DAY_MS);
                  const cell = bookings.filter(
                    (b) => b.equipmentId === eq.id && new Date(b.startTime) < dayEnd && new Date(b.endTime) > d
                  );
                  return (
                    <td
                      key={d.toISOString()}
                      className="cursor-pointer border border-slate-200 p-1 align-top hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                      onClick={() => cell.length === 0 && openBooking(eq.id, d)}
                      title={cell.length === 0 ? "Click to book" : undefined}
                    >
                      {cell.map((b) => (
                        <div key={b.id} className="mb-1 rounded bg-brand-700/90 px-1.5 py-1 text-white">
                          <div className="truncate font-semibold">{b.site.name}</div>
                          <div className="flex items-center justify-between">
                            <span className="truncate text-[10px] opacity-80">{b.bookedBy.name}</span>
                            <button
                              onClick={(ev) => { ev.stopPropagation(); cancelBooking(b.id); }}
                              className="text-[10px] opacity-60 hover:opacity-100"
                              title="Cancel booking"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Equipment master list */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {equipment.map((eq) => (
          <div key={eq.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{eq.name}</div>
                <div className="text-xs text-slate-500">
                  {eq.code} · {EQUIPMENT_CATEGORY_LABELS[eq.category] ?? eq.category}
                </div>
              </div>
              <Badge value={eq.status} />
            </div>
            <div className="mt-2 space-y-1 text-xs text-slate-500">
              <div>📍 {eq.currentSite?.name ?? "Yard"}</div>
              {eq.nextMaintenance && <div>🔧 Maintenance: {fmtDate(eq.nextMaintenance)}</div>}
              {eq.bookings?.[0] && (
                <div>📅 Next: {fmtDate(eq.bookings[0].startTime)} — {eq.bookings[0].site.name}</div>
              )}
            </div>
            <button className="btn-ghost mt-3 w-full py-1.5 text-xs" onClick={() => openBooking(eq.id)}>
              {t("bookEquipment")}
            </button>
          </div>
        ))}
      </div>

      <Modal open={showBook} onClose={() => setShowBook(false)} title={t("bookEquipment")}>
        <form onSubmit={submitBooking} className="space-y-3">
          {error && (
            <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
              {suggestion && <div className="mt-1 font-medium">{suggestion}</div>}
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium">{t("equipment")} *</label>
            <select className="input" required value={form.equipmentId}
              onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}>
              <option value="">—</option>
              {equipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.name} ({eq.code})</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">{t("site")} *</label>
            <select className="input" required value={form.siteId}
              onChange={(e) => setForm({ ...form, siteId: e.target.value })}>
              <option value="">—</option>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">{t("date")} *</label>
              <input type="date" className="input" required value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{t("startTime")}</label>
              <input type="time" className="input" value={form.startHour}
                onChange={(e) => setForm({ ...form, startHour: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">{t("endTime")}</label>
              <input type="time" className="input" value={form.endHour}
                onChange={(e) => setForm({ ...form, endHour: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">{t("purpose")} *</label>
            <input className="input" required minLength={3} value={form.purpose}
              placeholder="Lifting pipe spools at Area 3"
              onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setShowBook(false)}>{t("cancel")}</button>
            <button type="submit" className="btn-primary">{t("submit")}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
