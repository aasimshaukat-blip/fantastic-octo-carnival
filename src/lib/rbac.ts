import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, SessionUser } from "./auth";
import { Permission, hasPermission } from "./permissions";

export { hasPermission, PERMISSIONS } from "./permissions";
export type { Permission, Role } from "./permissions";

type Handler = (
  req: NextRequest,
  ctx: { user: SessionUser; params: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap a route handler with authentication + optional permission check.
 * Usage: export const GET = guard("materials.view", async (req, { user }) => ...)
 */
export function guard(permission: Permission | null, handler: Handler) {
  // Context is typed loosely because Next 15 generates a distinct RouteContext
  // type per route; we normalize params to a plain object for handlers.
  return async (req: NextRequest, routeCtx?: any): Promise<NextResponse> => {
    const user = await getSessionFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (permission && !hasPermission(user.role, permission)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const params = routeCtx?.params ? await routeCtx.params : {};
    try {
      return await handler(req, { user, params });
    } catch (err) {
      console.error(`API error [${req.method} ${req.nextUrl.pathname}]`, err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
