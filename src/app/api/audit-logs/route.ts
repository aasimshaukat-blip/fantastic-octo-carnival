import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";

export const GET = guard("audit.view", async (req) => {
  const sp = req.nextUrl.searchParams;
  const entity = sp.get("entity") ?? undefined;
  const userId = sp.get("userId") ?? undefined;

  const logs = await db.auditLog.findMany({
    where: { ...(entity ? { entity } : {}), ...(userId ? { userId } : {}) },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ logs });
});
