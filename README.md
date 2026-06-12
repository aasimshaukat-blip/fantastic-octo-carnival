# ACE Contracting — EPC Site Management Platform

A production-grade web platform for managing multiple Oil & Gas EPC construction
sites across the UAE: central dashboards, manpower & attendance, material
requests with a full procurement workflow, shared equipment booking with
conflict prevention, notifications, reports, and audit trails.

**English + العربية** (full RTL) · **Dark / light mode** · **Mobile-first** · **Role-based access**

---

## Quick start

```bash
npm install
cp .env.example .env          # set AUTH_SECRET for anything beyond local dev
npx prisma db push            # create the SQLite dev database
npm run db:seed               # load realistic UAE demo data
npm run dev                   # http://localhost:3000
```

### Demo logins

| Role            | Email                            | Password     |
| --------------- | -------------------------------- | ------------ |
| Admin           | admin@acecontracting.ae          | `Admin@1234` |
| Project Manager | pm.ruwais@acecontracting.ae      | `Pm@123456`  |
| Site Supervisor | sup.ruwais@acecontracting.ae     | `Sup@123456` |
| Procurement     | procurement@acecontracting.ae    | `Proc@12345` |
| HR / Admin      | hr@acecontracting.ae             | `Hr@1234567` |

---

## Modules

| Module | Highlights |
| ------ | ---------- |
| **Central Dashboard** | 8 KPI cards, interactive UAE site map, 14-day manpower trend, trade distribution, project overview table |
| **Sites & Projects** | Projects → sites hierarchy, PM/supervisor assignment, progress %, per-site dashboard with daily reports |
| **Manpower** | Bulk daily entry per site, 10 trade categories, filters, CSV export |
| **Attendance** | One-tap bulk marking (Present/Absent/Half-day/Leave), overtime, attendance-rate KPI; schema ready for QR/biometric/GPS |
| **Material Requests** | Auto request numbers (`MR-2026-00001`), multi-item lines, priorities, 8-stage workflow (Submitted → … → Closed) with enforced transitions, status history, PO tracking |
| **Equipment** | Master list, weekly booking calendar, **double-booking prevention with suggested free slots**, maintenance dates, utilization report |
| **Notifications** | In-app center with unread badge; critical requests auto-escalate to PM + Admin; email/SMS hooks ready |
| **Reports** | 5 CSV (Excel-compatible, UTF-8 BOM for Arabic) exports + print-to-PDF |
| **Users & Audit** | Admin user management (soft-delete), immutable audit log of every critical action with IP |

## Roles & permissions

Permission matrix lives in [`src/lib/permissions.ts`](src/lib/permissions.ts) and is
enforced server-side on every API route via the `guard()` wrapper
([`src/lib/rbac.ts`](src/lib/rbac.ts)) and mirrored in the UI navigation.

| Capability | Admin | PM | Supervisor | Procurement | HR |
| ---------- |:--:|:--:|:--:|:--:|:--:|
| Manage users / projects / equipment | ✅ | – | – | – | – |
| Approve material requests | ✅ | ✅ | – | – | – |
| Submit material requests | ✅ | – | ✅ | – | – |
| Drive procurement workflow (PO → Delivered) | ✅ | – | – | ✅ | – |
| Log manpower / daily reports | ✅ | ✅ | ✅ | – | – |
| Mark attendance | ✅ | – | ✅ | – | ✅ |
| Book equipment | ✅ | ✅ | ✅ | – | – |
| Export reports | ✅ | ✅ | – | ✅ | ✅ |
| View audit logs | ✅ | – | – | – | – |

## Tech stack

- **Next.js 15** (App Router) — one codebase for the responsive web app, mobile views, and REST API
- **TypeScript** end to end, **Zod** validation on every write endpoint
- **Prisma ORM** — SQLite in dev, PostgreSQL in production (one-line provider switch)
- **JWT sessions** (`jose`) in httpOnly cookies, **bcrypt** password hashing
- **Tailwind CSS v4** with dark mode + RTL, **Recharts** for analytics

## Documentation

| Doc | Contents |
| --- | -------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, user flows, deployment topology |
| [docs/DATABASE.md](docs/DATABASE.md) | Full schema reference, ERD, indexing strategy |
| [docs/API.md](docs/API.md) | REST endpoint reference with auth/permission notes |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment (Docker, Azure/AWS UAE regions), backups |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phased implementation roadmap incl. QR/biometric attendance, WhatsApp alerts |

## Scripts

| Command | Action |
| ------- | ------ |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run db:push` | Apply schema to database |
| `npm run db:seed` | Seed demo data |
| `npm run db:reset` | Drop, recreate, and reseed the dev database |
