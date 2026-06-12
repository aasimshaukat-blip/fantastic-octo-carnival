import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { TRADES, dayKey } from "@/lib/constants";

export const GET = guard("manpower.view", async (req) => {
  const sp = req.nextUrl.searchParams;
  const siteId = sp.get("siteId") ?? undefined;
  const from = sp.get("from");
  const to = sp.get("to");
  const trade = sp.get("trade") ?? undefined;

  const logs = await db.manpowerLog.findMany({
    where: {
      ...(siteId ? { siteId } : {}),
      ...(trade ? { trade } : {}),
      date: {
        gte: from ? dayKey(from) : dayKey(new Date(Date.now() - 30 * 86400000)),
        lte: to ? dayKey(to) : undefined,
      },
    },
    include: {
      employee: { select: { name: true, empCode: true } },
      site: { select: { name: true } },
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: 500,
  });
  return NextResponse.json({ logs });
});

const entrySchema = z.object({
  date: z.string(),
  siteId: z.string(),
  entries: z.array(
    z.object({
      employeeId: z.string(),
      trade: z.enum(TRADES),
      company: z.string().default("ACE Contracting"),
      hoursWorked: z.number().min(0).max(24).default(8),
      remarks: z.string().optional(),
    })
  ).min(1),
});

/** Bulk daily manpower entry: upserts one row per employee per site per day. */
export const POST = guard("manpower.log", async (req, { user }) => {
  const parsed = entrySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date, siteId, entries } = parsed.data;
  const day = dayKey(date);

  const results = await db.$transaction(
    entries.map((e) =>
      db.manpowerLog.upsert({
        where: { date_siteId_employeeId: { date: day, siteId, employeeId: e.employeeId } },
        update: { trade: e.trade, company: e.company, hoursWorked: e.hoursWorked, remarks: e.remarks },
        create: { date: day, siteId, ...e, createdById: user.id },
      })
    )
  );
  await audit({ userId: user.id, action: "CREATE", entity: "ManpowerLog", details: { date, siteId, count: results.length } });
  return NextResponse.json({ count: results.length }, { status: 201 });
});
