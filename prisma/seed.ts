import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function dayKey(offset = 0): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + offset));
}

async function main() {
  console.log("Seeding ACE Contracting demo data…");
  const pw = (p: string) => bcrypt.hashSync(p, 10);

  // ── Users ──
  const [admin, pm1, pm2, sup1, sup2, sup3, proc, hr] = await Promise.all([
    db.user.upsert({
      where: { email: "admin@acecontracting.ae" },
      update: {},
      create: { email: "admin@acecontracting.ae", passwordHash: pw("Admin@1234"), name: "Khalid Al Mansoori", nameAr: "خالد المنصوري", role: "ADMIN", designation: "Operations Director" },
    }),
    db.user.upsert({
      where: { email: "pm.ruwais@acecontracting.ae" },
      update: {},
      create: { email: "pm.ruwais@acecontracting.ae", passwordHash: pw("Pm@123456"), name: "Ahmed Hassan", nameAr: "أحمد حسن", role: "PROJECT_MANAGER", designation: "Senior Project Manager" },
    }),
    db.user.upsert({
      where: { email: "pm.jebelali@acecontracting.ae" },
      update: {},
      create: { email: "pm.jebelali@acecontracting.ae", passwordHash: pw("Pm@123456"), name: "Sara Al Zaabi", nameAr: "سارة الزعابي", role: "PROJECT_MANAGER", designation: "Project Manager" },
    }),
    db.user.upsert({
      where: { email: "sup.ruwais@acecontracting.ae" },
      update: {},
      create: { email: "sup.ruwais@acecontracting.ae", passwordHash: pw("Sup@123456"), name: "Ravi Kumar", role: "SITE_SUPERVISOR", designation: "Site Supervisor" },
    }),
    db.user.upsert({
      where: { email: "sup.habshan@acecontracting.ae" },
      update: {},
      create: { email: "sup.habshan@acecontracting.ae", passwordHash: pw("Sup@123456"), name: "Mohammed Irfan", role: "SITE_SUPERVISOR", designation: "Site Supervisor" },
    }),
    db.user.upsert({
      where: { email: "sup.jebelali@acecontracting.ae" },
      update: {},
      create: { email: "sup.jebelali@acecontracting.ae", passwordHash: pw("Sup@123456"), name: "Jose Fernandez", role: "SITE_SUPERVISOR", designation: "Site Supervisor" },
    }),
    db.user.upsert({
      where: { email: "procurement@acecontracting.ae" },
      update: {},
      create: { email: "procurement@acecontracting.ae", passwordHash: pw("Proc@12345"), name: "Fatima Al Shamsi", nameAr: "فاطمة الشامسي", role: "PROCUREMENT", designation: "Procurement Lead" },
    }),
    db.user.upsert({
      where: { email: "hr@acecontracting.ae" },
      update: {},
      create: { email: "hr@acecontracting.ae", passwordHash: pw("Hr@1234567"), name: "Priya Nair", role: "HR", designation: "HR Officer" },
    }),
  ]);

  // ── Projects & Sites (real UAE Oil & Gas locations) ──
  const proj1 = await db.project.upsert({
    where: { code: "ACE-2026-001" },
    update: {},
    create: {
      code: "ACE-2026-001",
      name: "Ruwais Refinery Expansion — Piping Package 4",
      nameAr: "توسعة مصفاة الرويس",
      clientName: "ADNOC Refining",
      status: "ACTIVE",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2027-03-31"),
      progressPct: 42,
      managerId: pm1.id,
      sites: {
        create: [
          { code: "SITE-RWS-01", name: "Ruwais Process Area", location: "Ruwais, Al Dhafra", emirate: "Abu Dhabi", latitude: 24.11, longitude: 52.73, supervisorId: sup1.id },
          { code: "SITE-HBS-01", name: "Habshan Tie-in Yard", location: "Habshan", emirate: "Abu Dhabi", latitude: 23.75, longitude: 53.62, supervisorId: sup2.id },
        ],
      },
    },
    include: { sites: true },
  });

  const proj2 = await db.project.upsert({
    where: { code: "ACE-2026-002" },
    update: {},
    create: {
      code: "ACE-2026-002",
      name: "Jebel Ali Tank Farm — Mechanical Works",
      nameAr: "أعمال ميكانيكية - جبل علي",
      clientName: "ENOC",
      status: "ACTIVE",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-12-20"),
      progressPct: 18,
      managerId: pm2.id,
      sites: {
        create: [
          { code: "SITE-JBA-01", name: "Jebel Ali Tank Farm", location: "Jebel Ali Free Zone", emirate: "Dubai", latitude: 24.98, longitude: 55.06, supervisorId: sup3.id },
        ],
      },
    },
    include: { sites: true },
  });

  const proj3 = await db.project.upsert({
    where: { code: "ACE-2026-003" },
    update: {},
    create: {
      code: "ACE-2026-003",
      name: "Fujairah Oil Terminal — Pipeline Upgrade",
      clientName: "Fujairah Oil Terminal FZC",
      status: "PLANNED",
      startDate: new Date("2026-09-01"),
      progressPct: 0,
      sites: {
        create: [
          { code: "SITE-FJR-01", name: "Fujairah Terminal", location: "Port of Fujairah", emirate: "Fujairah", latitude: 25.16, longitude: 56.36, status: "ACTIVE" },
        ],
      },
    },
    include: { sites: true },
  });

  const [ruwais, habshan] = proj1.sites;
  const jebelAli = proj2.sites[0];

  // ── Employees ──
  const roster: [string, string, string, string][] = [
    ["ACE-EMP-0001", "Suresh Pillai", "WELDER", ruwais.id],
    ["ACE-EMP-0002", "Anil Sharma", "WELDER", ruwais.id],
    ["ACE-EMP-0003", "Imran Khan", "PIPE_FITTER", ruwais.id],
    ["ACE-EMP-0004", "Rajan Thomas", "PIPE_FITTER", ruwais.id],
    ["ACE-EMP-0005", "Babu Rao", "FABRICATOR", ruwais.id],
    ["ACE-EMP-0006", "Naseer Ahmed", "RIGGER", ruwais.id],
    ["ACE-EMP-0007", "Vijay Singh", "ELECTRICIAN", ruwais.id],
    ["ACE-EMP-0008", "Arun Das", "HELPER", ruwais.id],
    ["ACE-EMP-0009", "Sanjay Patel", "HELPER", ruwais.id],
    ["ACE-EMP-0010", "Khalil Rahman", "OPERATOR", ruwais.id],
    ["ACE-EMP-0011", "Faisal Mehmood", "WELDER", habshan.id],
    ["ACE-EMP-0012", "Dinesh Kumar", "PIPE_FITTER", habshan.id],
    ["ACE-EMP-0013", "Ali Asghar", "RIGGER", habshan.id],
    ["ACE-EMP-0014", "Ramesh Yadav", "HELPER", habshan.id],
    ["ACE-EMP-0015", "Tariq Aziz", "DRIVER", habshan.id],
    ["ACE-EMP-0016", "John Mathew", "INSTRUMENT_TECH", jebelAli.id],
    ["ACE-EMP-0017", "Pradeep Nair", "FABRICATOR", jebelAli.id],
    ["ACE-EMP-0018", "Salman Shaikh", "WELDER", jebelAli.id],
    ["ACE-EMP-0019", "Kiran Reddy", "ELECTRICIAN", jebelAli.id],
    ["ACE-EMP-0020", "Abdul Majeed", "HELPER", jebelAli.id],
  ];
  const employees = await Promise.all(
    roster.map(([empCode, name, trade, siteId], i) =>
      db.employee.upsert({
        where: { empCode },
        update: {},
        create: {
          empCode,
          name,
          trade,
          siteId,
          company: i % 5 === 4 ? "Gulf Manpower Services LLC" : "ACE Contracting",
        },
      })
    )
  );

  // ── 14 days of manpower logs + attendance ──
  for (let offset = -13; offset <= 0; offset++) {
    const date = dayKey(offset);
    const dow = date.getUTCDay();
    if (dow === 5) continue; // Friday off

    for (const emp of employees) {
      if (!emp.siteId) continue;
      const absent = (emp.empCode.charCodeAt(9) + offset) % 17 === 0;
      const leave = (emp.empCode.charCodeAt(9) + offset) % 23 === 0;
      const status = absent ? "ABSENT" : leave ? "LEAVE" : "PRESENT";
      const ot = status === "PRESENT" && offset % 3 === 0 ? 2 : 0;

      await db.attendance.upsert({
        where: { date_employeeId: { date, employeeId: emp.id } },
        update: {},
        create: {
          date,
          employeeId: emp.id,
          siteId: emp.siteId,
          status,
          overtimeHours: ot,
          checkIn: status === "PRESENT" ? new Date(date.getTime() + 7 * 3600000) : null,
          checkOut: status === "PRESENT" ? new Date(date.getTime() + (17 + ot) * 3600000) : null,
          markedById: emp.siteId === jebelAli.id ? sup3.id : emp.siteId === habshan.id ? sup2.id : sup1.id,
        },
      });

      if (status !== "ABSENT" && status !== "LEAVE") {
        await db.manpowerLog.upsert({
          where: { date_siteId_employeeId: { date, siteId: emp.siteId, employeeId: emp.id } },
          update: {},
          create: {
            date,
            siteId: emp.siteId,
            employeeId: emp.id,
            trade: emp.trade,
            company: emp.company,
            hoursWorked: 8 + ot,
            createdById: emp.siteId === jebelAli.id ? sup3.id : emp.siteId === habshan.id ? sup2.id : sup1.id,
          },
        });
      }
    }
  }

  // ── Equipment ──
  const equipmentSpec: [string, string, string, string | null][] = [
    ["EQ-CRN-01", "Liebherr LTM 1100 Mobile Crane", "MOBILE_CRANE", ruwais.id],
    ["EQ-CRN-02", "Tadano 50T Mobile Crane", "MOBILE_CRANE", jebelAli.id],
    ["EQ-FRK-01", "Toyota 5T Forklift", "FORKLIFT", ruwais.id],
    ["EQ-FRK-02", "Hyster 7T Forklift", "FORKLIFT", habshan.id],
    ["EQ-BML-01", "JLG 660SJ Boom Lift", "BOOM_LIFT", ruwais.id],
    ["EQ-SCL-01", "Genie GS-3246 Scissor Lift", "SCISSOR_LIFT", jebelAli.id],
    ["EQ-EXC-01", "CAT 320 Excavator", "EXCAVATOR", habshan.id],
    ["EQ-GEN-01", "Cummins 500kVA Generator", "GENERATOR", ruwais.id],
    ["EQ-GEN-02", "FG Wilson 250kVA Generator", "GENERATOR", jebelAli.id],
    ["EQ-WLD-01", "Lincoln Vantage 500 Welder", "WELDING_MACHINE", ruwais.id],
    ["EQ-WLD-02", "Miller Big Blue 800 Welder", "WELDING_MACHINE", habshan.id],
    ["EQ-CMP-01", "Atlas Copco XAS 188 Compressor", "COMPRESSOR", jebelAli.id],
  ];
  const equipment = await Promise.all(
    equipmentSpec.map(([code, name, category, currentSiteId], i) =>
      db.equipment.upsert({
        where: { code },
        update: {},
        create: {
          code,
          name,
          category,
          currentSiteId,
          status: i === 6 ? "MAINTENANCE" : "AVAILABLE",
          nextMaintenance: dayKey(20 + i * 7),
        },
      })
    )
  );

  // ── Equipment bookings (this week) ──
  const existingBookings = await db.equipmentBooking.count();
  if (existingBookings === 0) {
    const slots = [
      { eq: equipment[0], site: ruwais.id, by: sup1.id, day: 0, from: 7, to: 17, purpose: "Lifting pipe spools — Area 3" },
      { eq: equipment[0], site: habshan.id, by: sup2.id, day: 1, from: 7, to: 12, purpose: "Unloading structural steel" },
      { eq: equipment[1], site: jebelAli.id, by: sup3.id, day: 0, from: 8, to: 16, purpose: "Tank shell plate erection" },
      { eq: equipment[4], site: ruwais.id, by: sup1.id, day: 2, from: 7, to: 17, purpose: "Pipe rack welding access" },
      { eq: equipment[9], site: ruwais.id, by: sup1.id, day: 0, from: 7, to: 17, purpose: "TIG welding — SS lines" },
      { eq: equipment[11], site: jebelAli.id, by: sup3.id, day: 3, from: 7, to: 15, purpose: "Blasting & painting support" },
    ];
    for (const s of slots) {
      const base = dayKey(s.day);
      await db.equipmentBooking.create({
        data: {
          equipmentId: s.eq.id,
          siteId: s.site,
          bookedById: s.by,
          startTime: new Date(base.getTime() + s.from * 3600000),
          endTime: new Date(base.getTime() + s.to * 3600000),
          purpose: s.purpose,
        },
      });
    }
  }

  // ── Material requests across the workflow ──
  const existingMRs = await db.materialRequest.count();
  if (existingMRs === 0) {
    const mrs = [
      {
        no: "MR-2026-00001", site: ruwais.id, by: sup1.id, priority: "CRITICAL", status: "UNDER_REVIEW",
        justification: "Welding consumables exhausted — Area 3 piping on hold without electrodes.",
        drawingRef: "ISO-RWS-P-3041 Rev B", requiredDate: dayKey(3),
        items: [
          { description: "E7018 Welding Electrode 3.2mm", materialCode: "WLD-E7018-32", quantity: 200, unit: "kg" },
          { description: "ER70S-2 TIG Filler Wire 2.4mm", materialCode: "WLD-ER70S-24", quantity: 50, unit: "kg" },
        ],
      },
      {
        no: "MR-2026-00002", site: ruwais.id, by: sup1.id, priority: "HIGH", status: "APPROVED",
        justification: "Flange gaskets for hydrotest reinstatement.", requiredDate: dayKey(7),
        items: [
          { description: "Spiral Wound Gasket 6\" 300#", materialCode: "GSK-SW-6-300", quantity: 40, unit: "pcs" },
          { description: "Stud Bolt B7 M20x120 c/w 2H Nuts", materialCode: "BLT-B7-M20", quantity: 320, unit: "pcs" },
        ],
      },
      {
        no: "MR-2026-00003", site: habshan.id, by: sup2.id, priority: "MEDIUM", status: "ORDERED",
        poNumber: "PO-2026-0451", requiredDate: dayKey(14),
        items: [
          { description: "Scaffolding Tube 6m Galvanized", materialCode: "SCF-TB-6M", quantity: 150, unit: "pcs" },
          { description: "Scaffolding Coupler Double", materialCode: "SCF-CP-DBL", quantity: 400, unit: "pcs" },
        ],
      },
      {
        no: "MR-2026-00004", site: jebelAli.id, by: sup3.id, priority: "HIGH", status: "IN_TRANSIT",
        poNumber: "PO-2026-0448", requiredDate: dayKey(2),
        items: [
          { description: "CS Plate 10mm A516 Gr.70 2x6m", materialCode: "PLT-CS-10", quantity: 12, unit: "pcs" },
        ],
      },
      {
        no: "MR-2026-00005", site: jebelAli.id, by: sup3.id, priority: "LOW", status: "DELIVERED",
        poNumber: "PO-2026-0432", deliveredAt: dayKey(-2),
        items: [
          { description: "Safety Harness Full Body", materialCode: "PPE-HRN-FB", quantity: 25, unit: "pcs" },
          { description: "Hard Hat White", materialCode: "PPE-HAT-W", quantity: 50, unit: "pcs" },
        ],
      },
      {
        no: "MR-2026-00006", site: habshan.id, by: sup2.id, priority: "CRITICAL", status: "SUBMITTED",
        justification: "Excavator hydraulic hose burst — machine down.", requiredDate: dayKey(1),
        items: [
          { description: "Hydraulic Hose 1\" 4SP x 2m c/w Fittings", materialCode: "HYD-HS-1-2M", quantity: 4, unit: "pcs" },
        ],
      },
    ];

    for (const m of mrs) {
      await db.materialRequest.create({
        data: {
          requestNo: m.no,
          siteId: m.site,
          requestorId: m.by,
          designation: "Site Supervisor",
          priority: m.priority,
          status: m.status,
          justification: m.justification,
          drawingRef: m.drawingRef,
          requiredDate: m.requiredDate,
          poNumber: m.poNumber,
          deliveredAt: m.deliveredAt,
          ...(["APPROVED", "PO_CREATED", "ORDERED", "IN_TRANSIT", "DELIVERED", "CLOSED"].includes(m.status)
            ? { approverId: pm1.id, approvedAt: dayKey(-3) }
            : {}),
          items: { create: m.items },
          statusHistory: { create: { toState: "SUBMITTED", byUserId: m.by } },
        },
      });
    }

    // Notifications for procurement about open criticals
    await db.notification.createMany({
      data: [
        { userId: proc.id, type: "MATERIAL_CRITICAL", title: "CRITICAL material request MR-2026-00001", message: "Ravi Kumar submitted 2 item(s) for Ruwais Process Area — priority CRITICAL", link: "/materials" },
        { userId: proc.id, type: "MATERIAL_CRITICAL", title: "CRITICAL material request MR-2026-00006", message: "Mohammed Irfan submitted 1 item(s) for Habshan Tie-in Yard — priority CRITICAL", link: "/materials" },
        { userId: admin.id, type: "ATTENDANCE_ALERT", title: "Attendance below 90% at Habshan", message: "Habshan Tie-in Yard attendance dropped to 87% this week.", link: "/attendance" },
        { userId: pm1.id, type: "APPROVAL_PENDING", title: "1 request awaiting review", message: "MR-2026-00001 (CRITICAL) is under review.", link: "/materials" },
      ],
    });
  }

  // Daily report example
  await db.dailyReport.upsert({
    where: { date_siteId: { date: dayKey(-1), siteId: ruwais.id } },
    update: {},
    create: {
      date: dayKey(-1),
      siteId: ruwais.id,
      progressNotes: "Completed 42 weld joints on Area 3 pipe rack. Hydrotest pack 7 ready for QC review.",
      safetyNotes: "Toolbox talk on heat stress. Zero incidents.",
      weather: "Sunny, 41°C",
      blockers: "Awaiting E7018 electrodes (MR-2026-00001).",
      createdById: sup1.id,
    },
  });

  console.log("Seed complete.");
  console.log("Logins (email / password):");
  console.log("  admin@acecontracting.ae / Admin@1234");
  console.log("  pm.ruwais@acecontracting.ae / Pm@123456");
  console.log("  sup.ruwais@acecontracting.ae / Sup@123456");
  console.log("  procurement@acecontracting.ae / Proc@12345");
  console.log("  hr@acecontracting.ae / Hr@1234567");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
