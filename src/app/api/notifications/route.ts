import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";

export const GET = guard(null, async (req, { user }) => {
  const unreadOnly = req.nextUrl.searchParams.get("unread") === "1";
  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: user.id, ...(unreadOnly ? { read: false } : {}) },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.notification.count({ where: { userId: user.id, read: false } }),
  ]);
  return NextResponse.json({ notifications, unreadCount });
});

/** Mark notifications read. Body: { ids: string[] } or { all: true } */
export const POST = guard(null, async (req, { user }) => {
  const body = await req.json().catch(() => ({}));
  if (body.all) {
    await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
  } else if (Array.isArray(body.ids)) {
    await db.notification.updateMany({
      where: { id: { in: body.ids }, userId: user.id },
      data: { read: true },
    });
  }
  return NextResponse.json({ ok: true });
});
