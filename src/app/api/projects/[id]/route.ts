import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";

export const GET = guard("projects.view", async (_req, { params }) => {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      manager: { select: { id: true, name: true } },
      sites: { include: { supervisor: { select: { id: true, name: true } } } },
    },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  clientName: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  progressPct: z.number().min(0).max(100).optional(),
  managerId: z.string().nullable().optional(),
});

export const PATCH = guard("projects.manage", async (req, { user, params }) => {
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const project = await db.project.update({
    where: { id: params.id },
    data: {
      ...d,
      startDate: d.startDate ? new Date(d.startDate) : undefined,
      endDate: d.endDate === null ? null : d.endDate ? new Date(d.endDate) : undefined,
    },
  });
  await audit({ userId: user.id, action: "UPDATE", entity: "Project", entityId: project.id, details: d });
  return NextResponse.json({ project });
});

export const DELETE = guard("projects.manage", async (_req, { user, params }) => {
  await db.project.delete({ where: { id: params.id } });
  await audit({ userId: user.id, action: "DELETE", entity: "Project", entityId: params.id });
  return NextResponse.json({ ok: true });
});
