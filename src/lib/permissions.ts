// Client-safe RBAC definitions (no server-only imports) so both the API
// guards and the UI navigation can share the same permission map.

export type Role =
  | "ADMIN"
  | "PROJECT_MANAGER"
  | "SITE_SUPERVISOR"
  | "PROCUREMENT"
  | "HR";

export const PERMISSIONS = {
  "users.manage": ["ADMIN"],
  "projects.manage": ["ADMIN"],
  "projects.view": ["ADMIN", "PROJECT_MANAGER", "SITE_SUPERVISOR", "PROCUREMENT", "HR"],
  "manpower.log": ["ADMIN", "SITE_SUPERVISOR", "PROJECT_MANAGER"],
  "manpower.view": ["ADMIN", "PROJECT_MANAGER", "SITE_SUPERVISOR", "HR"],
  "attendance.mark": ["ADMIN", "SITE_SUPERVISOR", "HR"],
  "attendance.view": ["ADMIN", "PROJECT_MANAGER", "SITE_SUPERVISOR", "HR"],
  "materials.create": ["ADMIN", "SITE_SUPERVISOR"],
  "materials.view": ["ADMIN", "PROJECT_MANAGER", "SITE_SUPERVISOR", "PROCUREMENT"],
  "materials.approve": ["ADMIN", "PROJECT_MANAGER"],
  "materials.procure": ["ADMIN", "PROCUREMENT"],
  "equipment.book": ["ADMIN", "SITE_SUPERVISOR", "PROJECT_MANAGER"],
  "equipment.manage": ["ADMIN"],
  "equipment.view": ["ADMIN", "PROJECT_MANAGER", "SITE_SUPERVISOR", "PROCUREMENT", "HR"],
  "reports.view": ["ADMIN", "PROJECT_MANAGER", "HR", "PROCUREMENT"],
  "audit.view": ["ADMIN"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === "ADMIN") return true;
  return (PERMISSIONS[permission] as readonly Role[])?.includes(role) ?? false;
}
