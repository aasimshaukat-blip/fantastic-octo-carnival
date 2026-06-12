import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import type { Role } from "./permissions";
export type { Role };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  locale: string;
}

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-only-secret-do-not-use-in-production"
);
const SESSION_HOURS = Number(process.env.SESSION_HOURS ?? 12);
export const SESSION_COOKIE = "ace_session";

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
      locale: (payload.locale as string) ?? "en",
    };
  } catch {
    return null;
  }
}

/** Read the current session inside a Server Component / Route Handler. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Read the session from a NextRequest (middleware / route handlers). */
export async function getSessionFromRequest(
  req: NextRequest
): Promise<SessionUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
