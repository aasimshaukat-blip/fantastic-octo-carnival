import { db } from "./db";

/**
 * Record an audit trail entry. Failures are logged but never block the
 * primary operation.
 */
export async function audit(opts: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: unknown;
  ipAddress?: string | null;
}) {
  try {
    await db.auditLog.create({
      data: {
        userId: opts.userId ?? null,
        action: opts.action,
        entity: opts.entity,
        entityId: opts.entityId ?? null,
        details: opts.details ? JSON.stringify(opts.details) : null,
        ipAddress: opts.ipAddress ?? null,
      },
    });
  } catch (err) {
    console.error("audit log failed", err);
  }
}
