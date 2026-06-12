# Deployment Guide

## Recommended production topology (UAE)

For data-residency and latency, deploy in a UAE region:

- **Azure UAE North (Dubai)** — App Service / AKS + Azure Database for PostgreSQL
- **AWS me-central-1 (UAE)** — ECS Fargate + RDS PostgreSQL

```
Cloudflare (CDN + WAF + TLS)
        │
   Load balancer
        │
  Next.js containers ×2+   (stateless — scale horizontally)
        │
  Managed PostgreSQL (HA pair, PITR enabled)
  Object storage (S3 / Azure Blob) — material request attachments
  SMTP relay / Twilio — email & WhatsApp notifications
```

## Environment variables

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | ≥48 random bytes: `openssl rand -base64 48` |
| `SESSION_HOURS` | – | default 12 |
| `SMTP_*`, `TWILIO_*` | – | enable email / SMS-WhatsApp channels |

## Docker

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t ace-platform .
docker run -p 3000:3000 --env-file .env ace-platform
```

`next.config.ts` already sets `output: "standalone"`.

## Database lifecycle

```bash
# first deploy
npx prisma migrate deploy
npx tsx prisma/seed.ts        # optional demo/bootstrap data

# subsequent deploys
npx prisma migrate deploy     # run as a pre-start step / init container
```

## Backup strategy

1. **Automated daily snapshots** of PostgreSQL (managed-service native),
   retained 30 days.
2. **Point-in-time recovery** (WAL archiving) enabled — RPO ≤ 5 minutes.
3. **Weekly logical dumps** (`pg_dump`) shipped to versioned, immutable object
   storage in a second region.
4. Attachments bucket: versioning + lifecycle rules.
5. Quarterly restore drills into a staging environment.

## Operations checklist

- [ ] `AUTH_SECRET` rotated from any dev value; cookies are `Secure`
- [ ] TLS terminated at the edge; HSTS enabled
- [ ] DB user is least-privilege (no DDL at runtime after migrations)
- [ ] Health probe on `/login` (static) and container restart policy
- [ ] Log aggregation (stdout JSON) + alerting on 5xx rate
- [ ] Audit log table excluded from any data-retention purge
