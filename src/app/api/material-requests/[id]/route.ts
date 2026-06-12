import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";

export const GET = guard("materials.view", async (_req, { params, user }) => {
  const request = await db.materialRequest.findUnique({
    where: { id: params.id },
    include: {
      site: { select: { name: true, code: true, location: true } },
      requestor: { select: { name: true, designation: true } },
      approver: { select: { name: true } },
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role === "SITE_SUPERVISOR" && request.requestorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ request });
});
