import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";

export const GET = guard("equipment.view", async (req) => {
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category") ?? undefined;
  const equipment = await db.equipment.findMany({
    where: { ...(category ? { category } : {}) },
    include: {
      currentSite: { select: { name: true } },
      bookings: {
        where: { status: "CONFIRMED", endTime: { gte: new Date() } },
        orderBy: { startTime: "asc" },
        take: 5,
        include: {
          site: { select: { name: true } },
          bookedBy: { select: { name: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ equipment });
});

const createSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  nameAr: z.string().optional(),
  category: z.enum(EQUIPMENT_CATEGORIES),
  status: z.string().default("AVAILABLE"),
  currentSiteId: z.string().optional().nullable(),
  nextMaintenance: z.string().optional().nullable(),
  notes: z.string().optional(),
});

export const POST = guard("equipment.manage", async (req, { user }) => {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const equipment = await db.equipment.create({
    data: { ...d, nextMaintenance: d.nextMaintenance ? new Date(d.nextMaintenance) : null },
  });
  await audit({ userId: user.id, action: "CREATE", entity: "Equipment", entityId: equipment.id, details: { code: equipment.code } });
  return NextResponse.json({ equipment }, { status: 201 });
});
