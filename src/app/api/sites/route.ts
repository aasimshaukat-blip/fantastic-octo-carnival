import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";

export const GET = guard("projects.view", async (req, { user }) => {
  // Site supervisors see only their own sites by default
  const mine = req.nextUrl.searchParams.get("mine") === "1";
  const where =
    mine && user.role === "SITE_SUPERVISOR" ? { supervisorId: user.id } : {};
  const sites = await db.site.findMany({
    where,
    include: {
      project: { select: { id: true, name: true, clientName: true } },
      supervisor: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ sites });
});

const createSchema = z.object({
  projectId: z.string(),
  code: z.string().min(2),
  name: z.string().min(2),
  nameAr: z.string().optional(),
  location: z.string().min(1),
  emirate: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  supervisorId: z.string().optional().nullable(),
  status: z.string().default("ACTIVE"),
});

export const POST = guard("projects.manage", async (req, { user }) => {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const site = await db.site.create({ data: parsed.data });
  await audit({ userId: user.id, action: "CREATE", entity: "Site", entityId: site.id, details: { code: site.code } });
  return NextResponse.json({ site }, { status: 201 });
});
