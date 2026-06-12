# System Architecture

## Overview

The platform is a **modular monolith** built on Next.js 15: a single deployable
unit containing the responsive web UI, the REST API, and the data layer. This
maximizes delivery speed and operational simplicity for a company-scale system
(hundreds of users, dozens of sites) while keeping clean module boundaries so
individual modules can be extracted into services later if scale demands it.

```
┌─────────────────────────────────────────────────────────────────┐
│                          Clients                                │
│   Desktop browser · Mobile browser (site supervisors) · PWA     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│                     Next.js application                         │
│  ┌────────────────┐  ┌──────────────────────────────────────┐   │
│  │  App Router UI │  │           REST API (/api/*)          │   │
│  │  RSC + client  │  │  middleware → guard(permission) →    │   │
│  │  components    │  │  zod validation → Prisma → audit     │   │
│  └────────────────┘  └──────────────────────────────────────┘   │
│  Cross-cutting: JWT auth · RBAC · i18n (en/ar) · audit · notify │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Prisma ORM
┌──────────────────────────▼──────────────────────────────────────┐
│   PostgreSQL (production) / SQLite (development)                │
└─────────────────────────────────────────────────────────────────┘
   Side channels (pluggable): SMTP email · Twilio SMS/WhatsApp
```

## Request lifecycle

1. **Middleware** (`src/middleware.ts`) verifies the JWT session cookie on every
   request; unauthenticated page requests redirect to `/login`, API requests
   get `401`.
2. **Route guard** (`src/lib/rbac.ts → guard()`) re-verifies the session and
   checks the required permission from the central matrix in
   `src/lib/permissions.ts`. Admin bypasses; everyone else needs an explicit
   grant.
3. **Validation** — every write endpoint parses its body with a Zod schema;
   invalid input returns `400` with field-level errors.
4. **Business rules** — e.g. material-request state machine
   (`MR_TRANSITIONS`), equipment booking overlap detection
   (`startTime < existing.end && endTime > existing.start`).
5. **Persistence** via Prisma, with multi-row writes wrapped in transactions
   (`db.$transaction`) for bulk manpower/attendance entry.
6. **Side effects** — audit log entry (never blocks the main operation) and
   in-app notifications (role-fanout for critical material requests).

## Module boundaries

| Module | API | UI | Key invariants |
| ------ | --- | -- | -------------- |
| Auth | `/api/auth/*` | `/login` | bcrypt hashes, httpOnly JWT cookie, 12h expiry |
| Dashboard | `/api/dashboard` | `/dashboard` | read-only aggregation |
| Projects/Sites | `/api/projects`, `/api/sites` | `/sites`, `/sites/[id]` | PM sees only assigned projects |
| Manpower | `/api/manpower`, `/api/employees` | `/manpower` | one log per employee/site/day (unique key) |
| Attendance | `/api/attendance` | `/attendance` | one record per employee/day; method field reserves QR/biometric/GPS |
| Materials | `/api/material-requests*` | `/materials*` | enforced 8-stage workflow; supervisors see only own requests |
| Equipment | `/api/equipment*` | `/equipment` | no overlapping CONFIRMED bookings per equipment |
| Notifications | `/api/notifications` | `/notifications` | per-user; 30s badge polling |
| Reports | `/api/reports/[type]` | `/reports` | CSV with UTF-8 BOM (Arabic-safe in Excel) |
| Audit | `/api/audit-logs` | `/audit` | append-only |

## User flows

### Material request (the critical path)

```
Site Supervisor                Procurement              PM/Admin
      │ submit MR (items,            │                      │
      │ priority, drawing ref)       │                      │
      ├──── SUBMITTED ──────────────►│ notified (critical   │
      │                              │ also alerts PM/Admin)│
      │                              ├── UNDER_REVIEW       │
      │                              │                      ├─ APPROVED / REJECTED
      │ notified at every step       ├── PO_CREATED (PO#)   │
      │◄─────────────────────────────┼── ORDERED            │
      │                              ├── IN_TRANSIT         │
      │ confirm receipt              ├── DELIVERED          │
      │                              └── CLOSED             │
```

Invalid jumps (e.g. SUBMITTED → DELIVERED) are rejected server-side with `422`.
Approval steps require `materials.approve` (PM/Admin); procurement steps
require `materials.procure` (Procurement/Admin). Every transition is recorded
in `MaterialRequestStatusLog` and the audit log, and notifies the requestor.

### Daily site routine (supervisor, on mobile)

1. Open `/manpower` → **Daily Entry** → pick site & date → tick the roster,
   adjust hours → save (bulk upsert).
2. Open `/attendance` → select site → **Mark** → tap status chips per employee,
   add overtime → save.
3. Submit material requests as shortages appear.
4. Book equipment for the next day (conflicts are blocked, with the next free
   slot suggested).
5. File the daily progress report from the site page (`/sites/[id]`).

### Equipment booking conflict prevention

A booking is rejected with HTTP `409` if any CONFIRMED booking for the same
equipment overlaps the requested window. The response includes the conflicting
bookings (who/where) and a `suggestedSlot` of the same duration starting when
the latest conflict ends.

## Internationalization & theming

- Dictionary-based i18n (`src/lib/i18n.ts`) with English and Arabic; the
  document `dir` flips to `rtl` for Arabic and all layout uses logical
  CSS properties (`start`/`end`) so the UI mirrors correctly.
- Dark/light theme via a `dark` class on `<html>`, persisted in localStorage,
  defaulting to OS preference.
- Schema carries `nameAr` columns for user/project/site/equipment names.

## Real-time updates

Current implementation polls the notification endpoint every 30 s (cheap and
robust on flaky site connectivity). The architecture point for true push is a
single WebSocket/SSE gateway fed by the `notify*()` helpers — swap the
implementation in `src/lib/notify.ts` without touching callers.

## Deployment architecture

See [DEPLOYMENT.md](DEPLOYMENT.md). Summary:

```
Internet ──► CDN/WAF (Cloudflare) ──► Load balancer
                                        │
                          ┌─────────────┴─────────────┐
                          │  Next.js app containers   │  (2+ replicas,
                          │  (Docker, standalone)     │   stateless)
                          └─────────────┬─────────────┘
                                        │
                      PostgreSQL (managed, UAE region: Azure UAE North /
                      AWS me-central-1) + nightly snapshots + PITR
                      Object storage for attachments (S3/Blob)
```

The app is stateless (JWT sessions), so horizontal scaling is trivial.

## Security

- Passwords: bcrypt (cost 10). Sessions: HS256 JWT, httpOnly, SameSite=Lax,
  Secure in production, 12 h lifetime.
- Authorization enforced **server-side on every route**; UI checks are
  cosmetic only.
- All write endpoints Zod-validated; Prisma parameterizes all queries (no SQL
  injection surface).
- Audit log records actor, action, entity, JSON detail diff, and IP for every
  critical mutation including logins.
- Users are deactivated, never deleted, preserving audit integrity.
- Secrets via environment variables only; `.env` is git-ignored.
