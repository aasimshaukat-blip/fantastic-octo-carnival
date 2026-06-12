import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { ROLES } from "@/lib/constants";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  role: z.enum(ROLES).optional(),
  phone: z.string().optional(),
  designation: z.string().optional(),
  locale: z.enum(["en", "ar"]).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

export const PATCH = guard("users.manage", async (req, { user, params }) => {
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { password, ...data } = parsed.data;
  const updated = await db.user.update({
    where: { id: params.id },
    data: {
      ...data,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  await audit({ userId: user.id, action: "UPDATE", entity: "User", entityId: updated.id, details: { ...data, password: password ? "[changed]" : undefined } });
  return NextResponse.json({ user: updated });
});

export const DELETE = guard("users.manage", async (_req, { user, params }) => {
  // Soft delete: deactivate rather than remove, to preserve audit history
  await db.user.update({ where: { id: params.id }, data: { active: false } });
  await audit({ userId: user.id, action: "DEACTIVATE", entity: "User", entityId: params.id });
  return NextResponse.json({ ok: true });
});
