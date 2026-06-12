import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { dayKey } from "@/lib/constants";

/** Aggregated KPIs + project overview for the central dashboard. */
export const GET = guard(null, async () => {
  const today = dayKey(new Date());
  const tomorrow = new Date(today.getTime() + 86400000);

  const [
    activeProjects,
    sites,
    manpowerToday,
    presentToday,
    absentToday,
    openRequests,
    criticalRequests,
    bookingsToday,
    equipmentTotal,
    equipmentInUse,
  ] = await Promise.all([
    db.project.count({ where: { status: "ACTIVE" } }),
    db.site.findMany({
      where: { status: "ACTIVE" },
      include: {
        project: { select: { name: true, clientName: true, status: true, progressPct: true } },
        supervisor: { select: { name: true } },
        _count: {
          select: {
            employees: { where: { active: true } },
            materialRequests: {
              where: { status: { notIn: ["CLOSED", "REJECTED", "DELIVERED"] } },
            },
          },
        },
      },
    }),
    db.manpowerLog.count({ where: { date: today } }),
    db.attendance.count({ where: { date: today, status: { in: ["PRESENT", "HALF_DAY"] } } }),
    db.attendance.count({ where: { date: today, status: "ABSENT" } }),
    db.materialRequest.count({
      where: { status: { notIn: ["CLOSED", "REJECTED", "DELIVERED"] } },
    }),
    db.materialRequest.count({
      where: { priority: "CRITICAL", status: { notIn: ["CLOSED", "REJECTED", "DELIVERED"] } },
    }),
    db.equipmentBooking.count({
      where: { status: "CONFIRMED", startTime: { lt: tomorrow }, endTime: { gt: today } },
    }),
    db.equipment.count({ where: { status: { not: "OUT_OF_SERVICE" } } }),
    db.equipment.count({ where: { status: "IN_USE" } }),
  ]);

  // 14-day manpower trend
  const since = new Date(today.getTime() - 13 * 86400000);
  const logs = await db.manpowerLog.findMany({
    where: { date: { gte: since } },
    select: { date: true },
  });
  const trendMap = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    trendMap.set(new Date(since.getTime() + i * 86400000).toISOString().slice(0, 10), 0);
  }
  for (const l of logs) {
    const k = l.date.toISOString().slice(0, 10);
    trendMap.set(k, (trendMap.get(k) ?? 0) + 1);
  }
  const manpowerTrend = [...trendMap.entries()].map(([date, count]) => ({ date, count }));

  // Trade distribution today
  const tradeLogs = await db.manpowerLog.groupBy({
    by: ["trade"],
    where: { date: today },
    _count: { _all: true },
  });

  return NextResponse.json({
    kpis: {
      activeProjects,
      totalWorkforceToday: manpowerToday,
      presentToday,
      absentToday,
      openRequests,
      criticalRequests,
      bookingsToday,
      equipmentUtilization: equipmentTotal ? Math.round((equipmentInUse / equipmentTotal) * 100) : 0,
    },
    sites: sites.map((s) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      location: s.location,
      emirate: s.emirate,
      latitude: s.latitude,
      longitude: s.longitude,
      status: s.status,
      projectName: s.project.name,
      clientName: s.project.clientName,
      progressPct: s.project.progressPct,
      supervisor: s.supervisor?.name ?? null,
      manpowerCount: s._count.employees,
      pendingRequests: s._count.materialRequests,
    })),
    manpowerTrend,
    tradeDistribution: tradeLogs.map((tl) => ({ trade: tl.trade, count: tl._count._all })),
  });
});
