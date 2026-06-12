import { NextResponse } from "next/server";
import { guard } from "@/lib/rbac";

export const GET = guard(null, async (_req, { user }) => {
  return NextResponse.json({ user });
});
