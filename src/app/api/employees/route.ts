import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { TRADES } from "@/lib/constants";

export const GET = guard("manpower.view", async (req) => {
  const siteId = req.nextUrl.searchParams.get("siteId") ?? undefined;
  const employees = await db.employee.findMany({
    where: { ...(siteId ? { siteId } : {}), active: true },
    include: { site: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ employees });
});

const createSchema = z.object({
  empCode: z.string().min(2),
  name: z.string().min(2),
  nameAr: z.string().optional(),
  trade: z.enum(TRADES),
  company: z.string().default("ACE Contracting"),
  phone: z.string().optional(),
  siteId: z.string().optional().nullable(),
});

export const POST = guard("manpower.log", async (req, { user }) => {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const employee = await db.employee.create({ data: parsed.data });
  await audit({ userId: user.id, action: "CREATE", entity: "Employee", entityId: employee.id, details: { empCode: employee.empCode } });
  return NextResponse.json({ employee }, { status: 201 });
});
