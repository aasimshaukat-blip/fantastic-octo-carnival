import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { ATTENDANCE_STATUSES, dayKey } from "@/lib/constants";

export const GET = guard("attendance.view", async (req) => {
  const sp = req.nextUrl.searchParams;
  const siteId = sp.get("siteId") ?? undefined;
  const date = sp.get("date");
  const employeeId = sp.get("employeeId") ?? undefined;
  const from = sp.get("from");
  const to = sp.get("to");

  const records = await db.attendance.findMany({
    where: {
      ...(siteId ? { siteId } : {}),
      ...(employeeId ? { employeeId } : {}),
      ...(date
        ? { date: dayKey(date) }
        : { date: { gte: from ? dayKey(from) : dayKey(new Date(Date.now() - 30 * 86400000)), lte: to ? dayKey(to) : undefined } }),
    },
    include: {
      employee: { select: { name: true, empCode: true, trade: true } },
      site: { select: { name: true } },
    },
    orderBy: [{ date: "desc" }],
    take: 1000,
  });

  const summary = {
    present: records.filter((r) => r.status === "PRESENT").length,
    absent: records.filter((r) => r.status === "ABSENT").length,
    halfDay: records.filter((r) => r.status === "HALF_DAY").length,
    leave: records.filter((r) => r.status === "LEAVE").length,
    overtimeHours: records.reduce((s, r) => s + r.overtimeHours, 0),
  };

  return NextResponse.json({ records, summary });
});

const markSchema = z.object({
  date: z.string(),
  siteId: z.string(),
  entries: z.array(
    z.object({
      employeeId: z.string(),
      status: z.enum(ATTENDANCE_STATUSES),
      checkIn: z.string().optional().nullable(),
      checkOut: z.string().optional().nullable(),
      overtimeHours: z.number().min(0).max(16).default(0),
      remarks: z.string().optional(),
    })
  ).min(1),
});

/** Bulk attendance marking: upserts one record per employee per day. */
export const POST = guard("attendance.mark", async (req, { user }) => {
  const parsed = markSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date, siteId, entries } = parsed.data;
  const day = dayKey(date);

  const results = await db.$transaction(
    entries.map((e) =>
      db.attendance.upsert({
        where: { date_employeeId: { date: day, employeeId: e.employeeId } },
        update: {
          status: e.status,
          siteId,
          checkIn: e.checkIn ? new Date(e.checkIn) : null,
          checkOut: e.checkOut ? new Date(e.checkOut) : null,
          overtimeHours: e.overtimeHours,
          remarks: e.remarks,
          markedById: user.id,
        },
        create: {
          date: day,
          siteId,
          employeeId: e.employeeId,
          status: e.status,
          checkIn: e.checkIn ? new Date(e.checkIn) : null,
          checkOut: e.checkOut ? new Date(e.checkOut) : null,
          overtimeHours: e.overtimeHours,
          remarks: e.remarks,
          markedById: user.id,
        },
      })
    )
  );
  await audit({ userId: user.id, action: "MARK_ATTENDANCE", entity: "Attendance", details: { date, siteId, count: results.length } });
  return NextResponse.json({ count: results.length }, { status: 201 });
});
