import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signSession, SESSION_COOKIE, Role } from "@/lib/auth";
import { audit } from "@/lib/audit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  const ok = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!ok || !user.active) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
    locale: user.locale,
  });

  await audit({
    userId: user.id,
    action: "LOGIN",
    entity: "User",
    entityId: user.id,
    ipAddress: req.headers.get("x-forwarded-for"),
  });

  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: Number(process.env.SESSION_HOURS ?? 12) * 3600,
    path: "/",
  });
  return res;
}
