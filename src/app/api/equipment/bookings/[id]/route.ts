import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";

/** Cancel a booking. Owner, admins, and PMs may cancel. */
export const DELETE = guard("equipment.book", async (_req, { user, params }) => {
  const booking = await db.equipmentBooking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.bookedById !== user.id && user.role !== "ADMIN" && user.role !== "PROJECT_MANAGER") {
    return NextResponse.json({ error: "Only the booking owner can cancel" }, { status: 403 });
  }
  await db.equipmentBooking.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
  await audit({ userId: user.id, action: "CANCEL", entity: "EquipmentBooking", entityId: params.id });
  return NextResponse.json({ ok: true });
});
