import { db } from "./db";

export type NotificationType =
  | "MATERIAL_CRITICAL"
  | "APPROVAL_PENDING"
  | "DELIVERY_UPDATE"
  | "BOOKING_CONFLICT"
  | "ATTENDANCE_ALERT"
  | "SYSTEM";

/** Create an in-app notification for a single user. */
export async function notifyUser(opts: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  await db.notification.create({ data: { ...opts } });
  // Email / SMS / WhatsApp delivery hooks plug in here (see docs/ARCHITECTURE.md).
}

/** Notify every active user holding one of the given roles. */
export async function notifyRoles(
  roles: string[],
  opts: { type: NotificationType; title: string; message: string; link?: string }
) {
  const users = await db.user.findMany({
    where: { role: { in: roles }, active: true },
    select: { id: true },
  });
  if (users.length === 0) return;
  await db.notification.createMany({
    data: users.map((u) => ({ userId: u.id, ...opts })),
  });
}
