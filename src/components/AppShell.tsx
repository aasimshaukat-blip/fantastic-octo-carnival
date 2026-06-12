"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "./Providers";
import { TranslationKey } from "@/lib/i18n";
import { hasPermission, Permission, Role } from "@/lib/permissions";

interface Me {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const NAV: {
  href: string;
  key: TranslationKey;
  icon: string;
  permission?: Permission;
}[] = [
  { href: "/dashboard", key: "dashboard", icon: "📊" },
  { href: "/sites", key: "sites", icon: "🏗️" },
  { href: "/manpower", key: "manpower", icon: "👷" },
  { href: "/attendance", key: "attendance", icon: "🕐" },
  { href: "/materials", key: "materials", icon: "📦" },
  { href: "/equipment", key: "equipment", icon: "🏋️" },
  { href: "/reports", key: "reports", icon: "📈", permission: "reports.view" },
  { href: "/users", key: "users", icon: "👥", permission: "users.manage" },
  { href: "/audit", key: "auditLogs", icon: "🔍", permission: "audit.view" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale, dark, toggleDark } = useApp();
  const [me, setMe] = useState<Me | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setMe(d.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const poll = () =>
      fetch("/api/notifications?unread=1")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d && setUnread(d.unreadCount))
        .catch(() => {});
    poll();
    const id = setInterval(poll, 30000); // near-real-time notification badge
    return () => clearInterval(id);
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const nav = NAV.filter(
    (item) => !item.permission || (me && hasPermission(me.role, item.permission))
  );

  const sidebar = (
    <nav className="flex h-full flex-col bg-brand-900 text-slate-200">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 text-sm font-black text-brand-900">
          ACE
        </div>
        <div>
          <div className="text-sm font-bold text-white">{t("appName")}</div>
          <div className="text-[10px] text-slate-400">{t("appTagline")}</div>
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-brand-700 font-semibold text-white"
                  : "text-slate-300 hover:bg-brand-800 hover:text-white"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {t(item.key)}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-brand-800 px-5 py-4 text-xs">
        {me && (
          <div className="mb-3">
            <div className="font-semibold text-white">{me.name}</div>
            <div className="text-slate-400">{me.role.replaceAll("_", " ")}</div>
          </div>
        )}
        <button onClick={logout} className="text-slate-400 hover:text-white">
          {t("logout")} →
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-72">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="no-print sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <button
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm lg:hidden dark:border-slate-700"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
          >
            ☰
          </button>
          <div className="flex-1" />
          <Link
            href="/notifications"
            className="relative rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm dark:border-slate-700"
            aria-label={t("notifications")}
          >
            🔔
            {unread > 0 && (
              <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </Link>
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm dark:border-slate-700"
            title={t("language")}
          >
            {locale === "en" ? "ع" : "EN"}
          </button>
          <button
            onClick={toggleDark}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm dark:border-slate-700"
            title={t("darkMode")}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
