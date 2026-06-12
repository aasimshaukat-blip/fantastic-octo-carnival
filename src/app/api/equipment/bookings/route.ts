import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { notifyUser } from "@/lib/notify";

export const GET = guard("equipment.view", async (req) => {
  const sp = req.nextUrl.searchParams;
  const from = sp.get("from");
  const to = sp.get("to");
  const equipmentId = sp.get("equipmentId") ?? undefined;

  const bookings = await db.equipmentBooking.findMany({
    where: {
      status: "CONFIRMED",
      ...(equipmentId ? { equipmentId } : {}),
      ...(from ? { endTime: { gte: new Date(from) } } : {}),
      ...(to ? { startTime: { lte: new Date(to) } } : {}),
    },
    include: {
      equipment: { select: { name: true, code: true, category: true } },
      site: { select: { name: true } },
      bookedBy: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
    take: 500,
  });
  return NextResponse.json({ bookings });
});

const createSchema = z.object({
  equipmentId: z.string(),
  siteId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  purpose: z.string().min(3),
});

export const POST = guard("equipment.book", async (req, { user }) => {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { equipmentId, siteId, purpose } = parsed.data;
  const startTime = new Date(parsed.data.startTime);
  const endTime = new Date(parsed.data.endTime);

  if (endTime <= startTime) {
    return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
  }

  // Conflict prevention: reject overlapping confirmed bookings and suggest
  // the next free slot after the last conflicting booking.
  const conflicts = await db.equipmentBooking.findMany({
    where: {
      equipmentId,
      status: "CONFIRMED",
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
    include: { site: { select: { name: true } }, bookedBy: { select: { name: true } } },
    orderBy: { endTime: "desc" },
  });

  if (conflicts.length > 0) {
    const latestEnd = conflicts[0].endTime;
    const durationMs = endTime.getTime() - startTime.getTime();
    return NextResponse.json(
      {
        error: "Booking conflict",
        conflicts: conflicts.map((c) => ({
          start: c.startTime,
          end: c.endTime,
          site: c.site.name,
          bookedBy: c.bookedBy.name,
        })),
        suggestedSlot: {
          startTime: latestEnd,
          endTime: new Date(latestEnd.getTime() + durationMs),
        },
      },
      { status: 409 }
    );
  }

  const booking = await db.equipmentBooking.create({
    data: { equipmentId, siteId, startTime, endTime, purpose, bookedById: user.id },
    include: { equipment: { select: { name: true } }, site: { select: { name: true } } },
  });

  await audit({ userId: user.id, action: "CREATE", entity: "EquipmentBooking", entityId: booking.id, details: { equipmentId, siteId, startTime, endTime } });
  await notifyUser({
    userId: user.id,
    type: "SYSTEM",
    title: "Booking confirmed",
    message: `${booking.equipment.name} booked for ${booking.site.name} on ${startTime.toISOString().slice(0, 16).replace("T", " ")}`,
    link: "/equipment",
  });

  return NextResponse.json({ booking }, { status: 201 });
});
