# Implementation Roadmap

## Phase 0 — Foundation ✅ (this repository)

- Next.js 15 + TypeScript + Prisma platform, JWT auth, 5-role RBAC
- All eight core modules live: dashboard, sites, manpower, attendance,
  material workflow, equipment booking with conflict prevention,
  notifications, CSV reports
- EN/AR with RTL, dark/light mode, mobile-first UI, audit logging
- Seeded demo data for 3 UAE projects / 4 sites / 20 workers / 12 machines

## Phase 1 — Production hardening (2–3 weeks)

- PostgreSQL migration + `prisma migrate` baseline
- File uploads for material-request attachments (S3/Blob presigned URLs)
- Email delivery (SMTP) wired into `src/lib/notify.ts`
- Rate limiting + login throttling; password reset flow
- E2E test suite (Playwright) covering the procurement workflow and RBAC
- CI/CD pipeline (build, typecheck, test, deploy)

## Phase 2 — Field operations (4–6 weeks)

- **QR attendance**: per-employee QR badges; supervisor scans via mobile
  camera (schema already has `method=QR`, `deviceRef`)
- **GPS attendance**: geofenced check-in using site lat/lng
  (`gpsLatitude/Longitude` columns ready)
- PWA: offline-first daily entry with background sync for low-connectivity sites
- WhatsApp Business API alerts for critical material requests and approvals
- Push notifications (web push) replacing the 30 s polling

## Phase 3 — Procurement depth (4 weeks)

- Supplier master + RFQ/quote comparison per material request
- Budget codes and cost tracking per request / per project
- Delivery receiving with partial-quantity tracking and discrepancy notes
- Material consumption analytics (requested vs delivered vs consumed)

## Phase 4 — Workforce & equipment depth (4 weeks)

- Leave management (request → approval → balance) for HR
- Biometric device integration (ZKTeco/Suprema webhooks → `method=BIOMETRIC`)
- Equipment maintenance work orders + downtime tracking
- Operator certification tracking tied to booking eligibility

## Phase 5 — Intelligence (ongoing)

- Native mobile wrapper (React Native / Capacitor) if app-store presence is needed
- Scheduled PDF report emails (daily site report to management at 18:00)
- Predictive material lead-time alerts; manpower productivity benchmarks
- Client-facing read-only portal per project
