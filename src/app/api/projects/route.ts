import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";

export const GET = guard("projects.view", async (req, { user }) => {
  const where =
    user.role === "PROJECT_MANAGER" ? { managerId: user.id } : {};
  const projects = await db.project.findMany({
    where,
    include: {
      manager: { select: { id: true, name: true } },
      sites: {
        include: {
          supervisor: { select: { id: true, name: true } },
          _count: { select: { employees: { where: { active: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ projects });
});

const createSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  nameAr: z.string().optional(),
  clientName: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED"]).default("ACTIVE"),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  progressPct: z.number().min(0).max(100).default(0),
  managerId: z.string().optional().nullable(),
  sites: z
    .array(
      z.object({
        code: z.string().min(2),
        name: z.string().min(2),
        location: z.string().min(1),
        emirate: z.string().optional(),
        latitude: z.number().optional().nullable(),
        longitude: z.number().optional().nullable(),
        supervisorId: z.string().optional().nullable(),
      })
    )
    .default([]),
});

export const POST = guard("projects.manage", async (req, { user }) => {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { sites, ...data } = parsed.data;
  const project = await db.project.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      sites: { create: sites },
    },
    include: { sites: true },
  });
  await audit({ userId: user.id, action: "CREATE", entity: "Project", entityId: project.id, details: { code: project.code } });
  return NextResponse.json({ project }, { status: 201 });
});
