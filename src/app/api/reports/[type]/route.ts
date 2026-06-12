import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { dayKey, TRADE_LABELS, MR_STATUS_LABELS } from "@/lib/constants";

function csv(rows: (string | number | null | undefined)[][]): string {
  // Prefix BOM so Excel opens UTF-8 (incl. Arabic) correctly
  return (
    "﻿" +
    rows
      .map((r) =>
        r
          .map((c) => {
            const s = c == null ? "" : String(c);
            return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
          })
          .join(",")
      )
      .join("\n")
  );
}

function csvResponse(filename: string, rows: (string | number | null | undefined)[][]) {
  return new NextResponse(csv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

/**
 * Exportable reports (Excel-compatible CSV).
 * Types: manpower | attendance | materials | equipment | daily-site
 * Query: from, to, siteId
 */
export const GET = guard("reports.view", async (req, { params }) => {
  const sp = req.nextUrl.searchParams;
  const from = sp.get("from") ? dayKey(sp.get("from")!) : dayKey(new Date(Date.now() - 30 * 86400000));
  const to = sp.get("to") ? dayKey(sp.get("to")!) : dayKey(new Date());
  const toEnd = new Date(to.getTime() + 86400000);
  const siteId = sp.get("siteId") ?? undefined;
  const stamp = new Date().toISOString().slice(0, 10);

  switch (params.type) {
    case "manpower": {
      const logs = await db.manpowerLog.findMany({
        where: { date: { gte: from, lt: toEnd }, ...(siteId ? { siteId } : {}) },
        include: { employee: true, site: true },
        orderBy: [{ date: "asc" }, { siteId: "asc" }],
      });
      return csvResponse(`manpower-report-${stamp}.csv`, [
        ["Date", "Site", "Employee ID", "Employee Name", "Trade", "Company", "Hours Worked", "Remarks"],
        ...logs.map((l) => [
          l.date.toISOString().slice(0, 10),
          l.site.name,
          l.employee.empCode,
          l.employee.name,
          TRADE_LABELS[l.trade] ?? l.trade,
          l.company,
          l.hoursWorked,
          l.remarks,
        ]),
      ]);
    }

    case "attendance": {
      const records = await db.attendance.findMany({
        where: { date: { gte: from, lt: toEnd }, ...(siteId ? { siteId } : {}) },
        include: { employee: true, site: true },
        orderBy: [{ date: "asc" }],
      });
      return csvResponse(`attendance-report-${stamp}.csv`, [
        ["Date", "Site", "Employee ID", "Employee Name", "Status", "Check In", "Check Out", "Overtime Hours", "Method"],
        ...records.map((r) => [
          r.date.toISOString().slice(0, 10),
          r.site.name,
          r.employee.empCode,
          r.employee.name,
          r.status,
          r.checkIn?.toISOString().slice(11, 16),
          r.checkOut?.toISOString().slice(11, 16),
          r.overtimeHours,
          r.method,
        ]),
      ]);
    }

    case "materials": {
      const requests = await db.materialRequest.findMany({
        where: { date: { gte: from, lt: toEnd }, ...(siteId ? { siteId } : {}) },
        include: { site: true, requestor: true, items: true },
        orderBy: { date: "asc" },
      });
      return csvResponse(`material-requests-${stamp}.csv`, [
        ["Request No", "Date", "Site", "Requestor", "Priority", "Status", "Required Date", "PO Number", "Item", "Material Code", "Qty", "Unit"],
        ...requests.flatMap((r) =>
          r.items.map((i) => [
            r.requestNo,
            r.date.toISOString().slice(0, 10),
            r.site.name,
            r.requestor.name,
            r.priority,
            MR_STATUS_LABELS[r.status] ?? r.status,
            r.requiredDate?.toISOString().slice(0, 10),
            r.poNumber,
            i.description,
            i.materialCode,
            i.quantity,
            i.unit,
          ])
        ),
      ]);
    }

    case "equipment": {
      const bookings = await db.equipmentBooking.findMany({
        where: { startTime: { gte: from, lt: toEnd }, ...(siteId ? { siteId } : {}) },
        include: { equipment: true, site: true, bookedBy: true },
        orderBy: { startTime: "asc" },
      });
      return csvResponse(`equipment-utilization-${stamp}.csv`, [
        ["Equipment Code", "Equipment", "Category", "Site", "Booked By", "Start", "End", "Hours", "Purpose", "Status"],
        ...bookings.map((b) => [
          b.equipment.code,
          b.equipment.name,
          b.equipment.category,
          b.site.name,
          b.bookedBy.name,
          b.startTime.toISOString().replace("T", " ").slice(0, 16),
          b.endTime.toISOString().replace("T", " ").slice(0, 16),
          Math.round(((b.endTime.getTime() - b.startTime.getTime()) / 3600000) * 10) / 10,
          b.purpose,
          b.status,
        ]),
      ]);
    }

    case "daily-site": {
      const reports = await db.dailyReport.findMany({
        where: { date: { gte: from, lt: toEnd }, ...(siteId ? { siteId } : {}) },
        include: { site: true },
        orderBy: { date: "asc" },
      });
      return csvResponse(`daily-site-report-${stamp}.csv`, [
        ["Date", "Site", "Progress Notes", "Safety Notes", "Weather", "Blockers"],
        ...reports.map((r) => [
          r.date.toISOString().slice(0, 10),
          r.site.name,
          r.progressNotes,
          r.safetyNotes,
          r.weather,
          r.blockers,
        ]),
      ]);
    }

    default:
      return NextResponse.json({ error: "Unknown report type" }, { status: 404 });
  }
});
