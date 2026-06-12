# REST API Reference

All endpoints live under `/api`. Authentication is a JWT session cookie set by
`POST /api/auth/login`. Every route is wrapped by `guard(permission, handler)`
— `401` when unauthenticated, `403` when the role lacks the permission.
Write bodies are JSON and Zod-validated (`400` with field errors on failure).

## Auth

| Method | Path | Permission | Notes |
| ------ | ---- | ---------- | ----- |
| POST | `/api/auth/login` | public | `{email, password}` → sets `ace_session` cookie; audited |
| POST | `/api/auth/logout` | session | clears cookie |
| GET | `/api/auth/me` | session | current user |

## Dashboard

| GET `/api/dashboard` | session | KPIs, active sites (with map coords), 14-day manpower trend, trade distribution |

## Projects & Sites

| Method | Path | Permission |
| ------ | ---- | ---------- |
| GET | `/api/projects` | `projects.view` (PMs see only their projects) |
| POST | `/api/projects` | `projects.manage` — accepts nested `sites[]` |
| GET/PATCH/DELETE | `/api/projects/[id]` | view / manage / manage |
| GET | `/api/sites?mine=1` | `projects.view` (`mine` scopes supervisors) |
| POST | `/api/sites` | `projects.manage` |

## Workforce

| Method | Path | Permission | Notes |
| ------ | ---- | ---------- | ----- |
| GET | `/api/employees?siteId=` | `manpower.view` | active roster |
| POST | `/api/employees` | `manpower.log` | |
| GET | `/api/manpower?siteId=&trade=&from=&to=` | `manpower.view` | |
| POST | `/api/manpower` | `manpower.log` | bulk upsert `{date, siteId, entries[]}` |
| GET | `/api/attendance?siteId=&date=&from=&to=&employeeId=` | `attendance.view` | returns `records` + `summary` |
| POST | `/api/attendance` | `attendance.mark` | bulk upsert `{date, siteId, entries[]}` |

## Material Requests

| Method | Path | Permission | Notes |
| ------ | ---- | ---------- | ----- |
| GET | `/api/material-requests?status=&priority=&siteId=&from=&to=` | `materials.view` | supervisors scoped to own requests |
| POST | `/api/material-requests` | `materials.create` | auto `requestNo`; notifies procurement (critical → also PM/Admin) |
| GET | `/api/material-requests/[id]` | `materials.view` | includes items + status history |
| POST | `/api/material-requests/[id]/status` | approve/procure split | `{status, note?, poNumber?}`; invalid transition → `422`; wrong role for step → `403`; notifies requestor |

Workflow: `SUBMITTED → UNDER_REVIEW → APPROVED → PO_CREATED → ORDERED →
IN_TRANSIT → DELIVERED → CLOSED`, with `REJECTED` from the first two states.
Approval steps need `materials.approve` (PM/Admin); procurement steps need
`materials.procure` (Procurement/Admin).

## Equipment

| Method | Path | Permission | Notes |
| ------ | ---- | ---------- | ----- |
| GET | `/api/equipment?category=` | `equipment.view` | includes next 5 bookings each |
| POST | `/api/equipment` | `equipment.manage` | |
| GET | `/api/equipment/bookings?from=&to=&equipmentId=` | `equipment.view` | calendar feed |
| POST | `/api/equipment/bookings` | `equipment.book` | overlap → **`409`** with `conflicts[]` and `suggestedSlot` |
| DELETE | `/api/equipment/bookings/[id]` | `equipment.book` | owner/PM/Admin; soft cancel |

## Notifications, Reports, Audit

| Method | Path | Permission | Notes |
| ------ | ---- | ---------- | ----- |
| GET | `/api/notifications?unread=1` | session | own notifications + unread count |
| POST | `/api/notifications` | session | `{ids:[…]}` or `{all:true}` to mark read |
| GET | `/api/daily-reports?siteId=` | `projects.view` | |
| POST | `/api/daily-reports` | `manpower.log` | upsert per site per day |
| GET | `/api/reports/[type]?from=&to=&siteId=` | `reports.view` | CSV download; types: `manpower`, `attendance`, `materials`, `equipment`, `daily-site` |
| GET | `/api/audit-logs?entity=&userId=` | `audit.view` | latest 200 |
| GET/POST | `/api/users` · PATCH/DELETE `/api/users/[id]` | `users.manage` (GET: slim directory for all roles) | DELETE deactivates |
