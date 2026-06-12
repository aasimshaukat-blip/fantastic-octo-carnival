# Database Design

Source of truth: [`prisma/schema.prisma`](../prisma/schema.prisma).
SQLite in development; switch the datasource provider to `postgresql` for
production (the schema is portable — enums are stored as strings).

## Entity-relationship diagram

```mermaid
erDiagram
    User ||--o{ Project : "manages"
    User ||--o{ Site : "supervises"
    User ||--o{ MaterialRequest : "requests/approves"
    User ||--o{ EquipmentBooking : "books"
    User ||--o{ Notification : "receives"
    User ||--o{ AuditLog : "performs"

    Project ||--|{ Site : "contains"
    Site ||--o{ Employee : "hosts"
    Site ||--o{ ManpowerLog : ""
    Site ||--o{ Attendance : ""
    Site ||--o{ MaterialRequest : ""
    Site ||--o{ EquipmentBooking : ""
    Site ||--o{ DailyReport : ""
    Site ||--o{ Equipment : "current location"

    Employee ||--o{ ManpowerLog : ""
    Employee ||--o{ Attendance : ""

    MaterialRequest ||--|{ MaterialRequestItem : "lines"
    MaterialRequest ||--o{ MaterialRequestStatusLog : "history"

    Equipment ||--o{ EquipmentBooking : ""
```

## Tables

| Table | Purpose | Notable columns / constraints |
| ----- | ------- | ----------------------------- |
| `User` | All platform accounts | `role` (5 roles), `nameAr`, `locale`, `active` (soft delete), unique `email` |
| `Project` | Contract-level container | unique `code`, `clientName`, `progressPct`, FK `managerId` |
| `Site` | Physical work location | lat/lng for map, `emirate`, FK `projectId` (cascade), `supervisorId` |
| `Employee` | Workforce roster (incl. subcontractors) | unique `empCode`, `trade` (10 categories), `company`, FK `siteId` |
| `ManpowerLog` | One row per worker per site per day | **unique (date, siteId, employeeId)**, `hoursWorked` |
| `Attendance` | Daily status per worker | **unique (date, employeeId)**, status PRESENT/ABSENT/HALF_DAY/LEAVE, `overtimeHours`, future-ready: `method` (MANUAL/QR/BIOMETRIC/GPS), `gpsLatitude/Longitude`, `deviceRef` |
| `MaterialRequest` | Request header | unique auto `requestNo` (MR-YYYY-NNNNN), `priority`, `status` (9 states), `poNumber`, `approverId`, `attachmentUrl`, `drawingRef` |
| `MaterialRequestItem` | Line items | description, `materialCode`, quantity, unit; cascade delete with header |
| `MaterialRequestStatusLog` | Workflow audit | fromState → toState, actor, note, timestamp |
| `Equipment` | Master list | unique `code`, 9 categories, `status`, `currentSiteId`, `nextMaintenance` |
| `EquipmentBooking` | Calendar slots | start/end timestamps, `purpose`, status CONFIRMED/CANCELLED/COMPLETED; overlap prevented in application layer |
| `DailyReport` | Site diary | **unique (date, siteId)**, progress/safety/weather/blockers |
| `Notification` | In-app alerts | per-user, `type` (6 kinds), `read`, deep `link` |
| `AuditLog` | Immutable trail | actor, action, entity+id, JSON `details`, `ipAddress` |

## Indexing strategy

Beyond primary keys and unique constraints:

- **Day-keyed queries** (`ManpowerLog`, `Attendance`): composite
  `(siteId, date)` plus single-column `date` — the dashboard and reports
  always filter by date range and usually by site.
- **Material requests**: `status`, `priority`, `siteId`, `date` — the
  procurement dashboard filters on all four.
- **Bookings**: `(equipmentId, startTime, endTime)` for the overlap check,
  `startTime` for calendar range scans.
- **Notifications**: `(userId, read)` for the unread badge count.
- **Audit**: `(entity, entityId)`, `userId`, `createdAt`.

## Conventions & integrity

- IDs are `cuid()` strings — safe to expose in URLs, no enumeration.
- Day-keyed dates are normalized to **midnight UTC** (`dayKey()` in
  `src/lib/constants.ts`) so uniqueness constraints behave across timezones.
- Child rows of operational documents (`MaterialRequestItem`, bookings, logs)
  cascade-delete with their parent; user references use nullable FKs so
  history survives account deactivation.
- Enum-like fields are strings (portable across SQLite/Postgres) with the
  authoritative value lists in `src/lib/constants.ts`; on PostgreSQL these can
  be tightened to native enums via a migration.

## Migrating to PostgreSQL

```bash
# 1. prisma/schema.prisma → datasource provider = "postgresql"
# 2. .env → DATABASE_URL="postgresql://user:pass@host:5432/ace_contracting"
npx prisma migrate dev --name init   # generates SQL migrations
npm run db:seed
```
