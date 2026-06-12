import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard, hasPermission } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { notifyUser } from "@/lib/notify";
import { MR_TRANSITIONS, MR_STATUSES } from "@/lib/constants";

const schema = z.object({
  status: z.enum(MR_STATUSES),
  note: z.string().optional(),
  poNumber: z.string().optional(),
});

/** Which workflow steps each capability is allowed to drive. */
const APPROVAL_STEPS = new Set(["UNDER_REVIEW", "APPROVED", "REJECTED"]);
const PROCUREMENT_STEPS = new Set(["UNDER_REVIEW", "PO_CREATED", "ORDERED", "IN_TRANSIT", "DELIVERED", "CLOSED", "REJECTED"]);

export const POST = guard("materials.view", async (req, { user, params }) => {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { status, note, poNumber } = parsed.data;

  const request = await db.materialRequest.findUnique({
    where: { id: params.id },
    include: { site: { select: { name: true } } },
  });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Enforce workflow transitions
  const allowed = MR_TRANSITIONS[request.status] ?? [];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { error: `Invalid transition ${request.status} → ${status}. Allowed: ${allowed.join(", ") || "none"}` },
      { status: 422 }
    );
  }

  // Enforce who may drive which step
  const canApprove = hasPermission(user.role, "materials.approve");
  const canProcure = hasPermission(user.role, "materials.procure");
  const stepOk =
    (APPROVAL_STEPS.has(status) && canApprove) ||
    (PROCUREMENT_STEPS.has(status) && canProcure);
  if (!stepOk) {
    return NextResponse.json({ error: "Your role cannot perform this step" }, { status: 403 });
  }

  const updated = await db.materialRequest.update({
    where: { id: params.id },
    data: {
      status,
      ...(poNumber ? { poNumber } : {}),
      ...(status === "APPROVED" ? { approverId: user.id, approvedAt: new Date() } : {}),
      ...(status === "DELIVERED" ? { deliveredAt: new Date() } : {}),
      statusHistory: {
        create: { fromState: request.status, toState: status, byUserId: user.id, note },
      },
    },
  });

  await audit({
    userId: user.id,
    action: "STATUS_CHANGE",
    entity: "MaterialRequest",
    entityId: updated.id,
    details: { from: request.status, to: status, note, poNumber },
  });

  // Keep the requestor informed of every workflow move
  await notifyUser({
    userId: request.requestorId,
    type: status === "DELIVERED" || status === "IN_TRANSIT" ? "DELIVERY_UPDATE" : "SYSTEM",
    title: `${request.requestNo} → ${status.replaceAll("_", " ")}`,
    message: `Your material request for ${request.site.name} moved to ${status.replaceAll("_", " ")}${note ? `: ${note}` : ""}`,
    link: `/materials/${request.id}`,
  });

  return NextResponse.json({ request: updated });
});
