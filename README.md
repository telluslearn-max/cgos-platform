# Commerce Growth OS (CGOS)

CGOS is an AI-powered commerce intelligence and marketing execution platform. It helps businesses grow revenue from their existing products, customers, channels and market opportunities. NURU Electronics is the initial pilot tenant.

The app lives in [`cgos-platform/`](cgos-platform/).

## Modules

| Route | Purpose |
|---|---|
| `/overview` | Business intelligence dashboard (`/` redirects here) |
| `/intelligence` | Growth opportunities and analysis |
| `/catalogue` | Product catalogue management |
| `/bundles` | Bundle and cross-sell recommendations |
| `/content-studio` | Content brief generation |
| `/marketing-calendar` | Marketing calendar |
| `/campaigns` | Campaign management |
| `/social-intelligence` | Social media performance |
| `/seo` | SEO intelligence via OpenSEO |
| `/competitors` | Competitor monitoring |
| `/analytics` | Performance analytics |
| `/integrations` | Service integrations |
| `/settings` | Tenant settings |
| `/api/health` | Health check (returns `{"status":"ok"}`) |

## Tech stack

- Next.js 16 (App Router, standalone output), React 19, TypeScript
- Prisma 6 with PostgreSQL ([`prisma/schema.prisma`](cgos-platform/prisma/schema.prisma))
- Tailwind CSS
- Docker multi-stage build on `node:22-alpine`

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENSEO_DEPLOYED_URL` | OpenSEO instance URL, e.g. `https://seo.nuruelectronics.com` |
| `OPENSEO_API_TOKEN` | DataForSEO API key: base64 of `login:password` |
| `OPENSEO_INTEGRATION_STATUS` | `not_connected`, `connected`, `error` or `rate_limited` |
| `OPENSEO_SYNC_FREQUENCY` | e.g. `daily` |

## Local development

```bash
cd cgos-platform
npm ci
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cgos"
npx prisma db push   # create the tables
npm run dev          # http://localhost:3000
```

Or run the app with a Postgres database in Docker:

```bash
cd cgos-platform
OPENSEO_API_TOKEN=... docker compose up --build
```

## Deployment (Coolify)

CGOS deploys to Coolify from the `master` branch. Every push to `master` triggers a deploy.

| Setting | Value |
|---|---|
| Build pack | Dockerfile |
| Base directory | `/cgos-platform` |
| Exposed port | `3000` |
| Health check | `GET /api/health` on port `3000` |
| Database | Coolify PostgreSQL 16 resource, set as `DATABASE_URL` |

On startup the container runs `prisma db push --skip-generate` before starting the server, so schema changes are applied on deploy. Changes that would drop data are refused and the new container won't start. The previous container keeps serving until the change is applied by hand.

## Further reading

- [`CGOS_SETUP_SUMMARY.md`](CGOS_SETUP_SUMMARY.md): platform overview, data model and roadmap
- [`cgos-platform/OPENSEO_INTEGRATION_GUIDE.md`](cgos-platform/OPENSEO_INTEGRATION_GUIDE.md): OpenSEO integration
