import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { dayKey } from "@/lib/constants";

export const GET = guard("projects.view", async (req) => {
  const sp = req.nextUrl.searchParams;
  const siteId = sp.get("siteId") ?? undefined;
  const reports = await db.dailyReport.findMany({
    where: { ...(siteId ? { siteId } : {}) },
    include: { site: { select: { name: true } } },
    orderBy: { date: "desc" },
    take: 100,
  });
  return NextResponse.json({ reports });
});

const schema = z.object({
  date: z.string(),
  siteId: z.string(),
  progressNotes: z.string().min(3),
  safetyNotes: z.string().optional(),
  weather: z.string().optional(),
  blockers: z.string().optional(),
});

export const POST = guard("manpower.log", async (req, { user }) => {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date, siteId, ...data } = parsed.data;
  const day = dayKey(date);
  const report = await db.dailyReport.upsert({
    where: { date_siteId: { date: day, siteId } },
    update: data,
    create: { date: day, siteId, ...data, createdById: user.id },
  });
  await audit({ userId: user.id, action: "UPSERT", entity: "DailyReport", entityId: report.id, details: { date, siteId } });
  return NextResponse.json({ report }, { status: 201 });
});
