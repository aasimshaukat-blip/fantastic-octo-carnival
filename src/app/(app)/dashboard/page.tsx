"use client";

import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { useApp } from "@/components/Providers";
import { KpiCard, PageHeader, Badge, ProgressBar, useFetch } from "@/components/ui";
import { UAEMap, MapSite } from "@/components/UAEMap";
import { TRADE_LABELS } from "@/lib/constants";

interface DashboardData {
  kpis: {
    activeProjects: number;
    totalWorkforceToday: number;
    presentToday: number;
    absentToday: number;
    openRequests: number;
    criticalRequests: number;
    bookingsToday: number;
    equipmentUtilization: number;
  };
  sites: (MapSite & {
    code: string;
    clientName: string;
    progressPct: number;
    supervisor: string | null;
  })[];
  manpowerTrend: { date: string; count: number }[];
  tradeDistribution: { trade: string; count: number }[];
}

export default function DashboardPage() {
  const { t } = useApp();
  const { data, loading } = useFetch<DashboardData>("/api/dashboard");

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">{t("loading")}</div>;
  }

  const { kpis } = data;
  const trend = data.manpowerTrend.map((d) => ({ ...d, day: d.date.slice(5) }));
  const trades = data.tradeDistribution.map((d) => ({
    name: TRADE_LABELS[d.trade] ?? d.trade,
    count: d.count,
  }));

  return (
    <div>
      <PageHeader title={t("dashboard")} subtitle={new Date().toDateString()} />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <KpiCard icon="🏗️" label={t("activeProjects")} value={kpis.activeProjects} tone="info" />
        <KpiCard icon="👷" label={t("totalWorkforce")} value={kpis.totalWorkforceToday} />
        <KpiCard icon="✅" label={t("presentToday")} value={kpis.presentToday} tone="success" />
        <KpiCard icon="❌" label={t("absentToday")} value={kpis.absentToday} tone="danger" />
        <KpiCard icon="📦" label={t("openRequests")} value={kpis.openRequests} tone="warning" />
        <KpiCard icon="🚨" label={t("criticalShortages")} value={kpis.criticalRequests} tone="danger" />
        <KpiCard icon="📅" label={t("bookingsToday")} value={kpis.bookingsToday} />
        <KpiCard icon="⚙️" label={t("equipmentUtilization")} value={`${kpis.equipmentUtilization}%`} tone="info" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {/* UAE map */}
        <div className="card p-4">
          <h2 className="mb-3 font-semibold">{t("siteMap")}</h2>
          <UAEMap sites={data.sites} />
        </div>

        <div className="grid gap-4">
          {/* Manpower trend */}
          <div className="card p-4">
            <h2 className="mb-3 font-semibold">{t("manpower")} — 14d</h2>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="mp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2e6da3" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#2e6da3" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} width={32} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#2e6da3" fill="url(#mp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trade distribution */}
          <div className="card p-4">
            <h2 className="mb-3 font-semibold">{t("trade")}</h2>
            {trades.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">{t("noData")}</p>
            ) : (
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={trades}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" fontSize={10} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis fontSize={11} width={32} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Project overview table */}
      <div className="card mt-4 overflow-x-auto p-4">
        <h2 className="mb-3 font-semibold">{t("projectOverview")}</h2>
        <table className="table-base">
          <thead>
            <tr>
              <th>{t("site")}</th>
              <th>{t("project")}</th>
              <th>{t("client")}</th>
              <th>{t("location")}</th>
              <th>{t("status")}</th>
              <th className="min-w-36">{t("progress")}</th>
              <th>{t("workforce")}</th>
              <th>{t("pendingRequests")}</th>
            </tr>
          </thead>
          <tbody>
            {data.sites.map((s) => (
              <tr key={s.id}>
                <td>
                  <Link href={`/sites/${s.id}`} className="font-medium text-brand-500 hover:underline">
                    {s.name}
                  </Link>
                </td>
                <td>{s.projectName}</td>
                <td>{s.clientName}</td>
                <td>{s.location}</td>
                <td><Badge value={s.status} /></td>
                <td><ProgressBar pct={s.progressPct} /></td>
                <td>{s.manpowerCount}</td>
                <td>
                  {s.pendingRequests > 0 ? (
                    <span className="font-semibold text-amber-600">{s.pendingRequests}</span>
                  ) : (
                    "0"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
