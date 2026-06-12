"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { PageHeader, useFetch, fmtDateTime } from "@/components/ui";

const TYPE_ICONS: Record<string, string> = {
  MATERIAL_CRITICAL: "🚨",
  APPROVAL_PENDING: "✋",
  DELIVERY_UPDATE: "🚚",
  BOOKING_CONFLICT: "⚠️",
  ATTENDANCE_ALERT: "🕐",
  SYSTEM: "ℹ️",
};

export default function NotificationsPage() {
  const { t } = useApp();
  const { data, refetch } = useFetch<{ notifications: any[]; unreadCount: number }>("/api/notifications");

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    refetch();
  }

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    refetch();
  }

  return (
    <div>
      <PageHeader
        title={`${t("notifications")} ${data?.unreadCount ? `(${data.unreadCount})` : ""}`}
        actions={
          <button className="btn-ghost" onClick={markAllRead}>✓ {t("markAllRead")}</button>
        }
      />

      <div className="space-y-2">
        {(data?.notifications ?? []).map((n) => (
          <div
            key={n.id}
            className={`card flex items-start gap-3 p-4 ${!n.read ? "border-s-4 border-s-accent-500" : "opacity-70"}`}
          >
            <span className="text-xl">{TYPE_ICONS[n.type] ?? "ℹ️"}</span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{n.title}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{n.message}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <span>{fmtDateTime(n.createdAt)}</span>
                {n.link && (
                  <Link href={n.link} className="text-brand-500 hover:underline" onClick={() => markRead(n.id)}>
                    Open →
                  </Link>
                )}
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="hover:text-slate-600">
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {(data?.notifications ?? []).length === 0 && (
          <div className="card p-8 text-center text-slate-400">{t("noData")}</div>
        )}
      </div>
    </div>
  );
}
