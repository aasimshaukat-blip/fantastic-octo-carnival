import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { notifyRoles } from "@/lib/notify";
import { PRIORITIES, UNITS } from "@/lib/constants";

export const GET = guard("materials.view", async (req, { user }) => {
  const sp = req.nextUrl.searchParams;
  const status = sp.get("status") ?? undefined;
  const priority = sp.get("priority") ?? undefined;
  const siteId = sp.get("siteId") ?? undefined;
  const from = sp.get("from");
  const to = sp.get("to");

  // Supervisors see their own requests only
  const scope =
    user.role === "SITE_SUPERVISOR" ? { requestorId: user.id } : {};

  const requests = await db.materialRequest.findMany({
    where: {
      ...scope,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(siteId ? { siteId } : {}),
      ...(from || to
        ? { date: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } }
        : {}),
    },
    include: {
      site: { select: { name: true, code: true } },
      requestor: { select: { name: true } },
      items: true,
      _count: { select: { items: true } },
    },
    orderBy: [{ date: "desc" }],
    take: 300,
  });
  return NextResponse.json({ requests });
});

const createSchema = z.object({
  siteId: z.string(),
  designation: z.string().optional(),
  priority: z.enum(PRIORITIES),
  justification: z.string().optional(),
  drawingRef: z.string().optional(),
  requiredDate: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        description: z.string().min(2),
        materialCode: z.string().optional(),
        quantity: z.number().positive(),
        unit: z.enum(UNITS),
        remarks: z.string().optional(),
      })
    )
    .min(1),
});

export const POST = guard("materials.create", async (req, { user }) => {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { items, ...data } = parsed.data;

  // Auto-generate sequential request number: MR-<year>-<seq>
  const year = new Date().getFullYear();
  const count = await db.materialRequest.count({
    where: { requestNo: { startsWith: `MR-${year}-` } },
  });
  const requestNo = `MR-${year}-${String(count + 1).padStart(5, "0")}`;

  const request = await db.materialRequest.create({
    data: {
      ...data,
      requestNo,
      requestorId: user.id,
      requiredDate: data.requiredDate ? new Date(data.requiredDate) : null,
      items: { create: items },
      statusHistory: { create: { toState: "SUBMITTED", byUserId: user.id } },
    },
    include: { items: true, site: { select: { name: true } } },
  });

  await audit({ userId: user.id, action: "CREATE", entity: "MaterialRequest", entityId: request.id, details: { requestNo, priority: data.priority } });

  // Notify procurement; escalate critical requests to PMs and admins too
  const roles = data.priority === "CRITICAL" ? ["PROCUREMENT", "PROJECT_MANAGER", "ADMIN"] : ["PROCUREMENT"];
  await notifyRoles(roles, {
    type: data.priority === "CRITICAL" ? "MATERIAL_CRITICAL" : "APPROVAL_PENDING",
    title: data.priority === "CRITICAL" ? `CRITICAL material request ${requestNo}` : `New material request ${requestNo}`,
    message: `${user.name} submitted ${items.length} item(s) for ${request.site.name} — priority ${data.priority}`,
    link: `/materials/${request.id}`,
  });

  return NextResponse.json({ request }, { status: 201 });
});
