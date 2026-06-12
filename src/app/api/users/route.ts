import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { guard } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { ROLES } from "@/lib/constants";

export const GET = guard(null, async (req, { user }) => {
  // Non-admins get a slim directory (for assigning PMs/supervisors in forms)
  const slim = user.role !== "ADMIN";
  const users = await db.user.findMany({
    select: slim
      ? { id: true, name: true, role: true, active: true, email: false }
      : { id: true, name: true, nameAr: true, email: true, role: true, phone: true, designation: true, active: true, createdAt: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ users });
});

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  nameAr: z.string().optional(),
  role: z.enum(ROLES),
  phone: z.string().optional(),
  designation: z.string().optional(),
  locale: z.enum(["en", "ar"]).default("en"),
});

export const POST = guard("users.manage", async (req, { user }) => {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { password, ...data } = parsed.data;
  const existing = await db.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }
  const created = await db.user.create({
    data: {
      ...data,
      email: data.email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
    },
    select: { id: true, name: true, email: true, role: true },
  });
  await audit({ userId: user.id, action: "CREATE", entity: "User", entityId: created.id, details: { email: created.email, role: created.role } });
  return NextResponse.json({ user: created }, { status: 201 });
});
