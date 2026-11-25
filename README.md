# Commerce Growth OS (CGOS)

CGOS is an AI-powered commerce intelligence and marketing execution platform. It helps businesses grow revenue from their existing products, customers, channels and market opportunities. NURU Electronics is the initial pilot tenant.

The app lives in [`cgos-platform/`](cgos-platform/). The full product spec is in [`docs/PRD.md`](docs/PRD.md).

## Vision

> Understand the business. Discover opportunities. Create the marketing. Execute the campaigns. Measure the results. Learn and improve.

CGOS is meant to be the central growth engine of a business, not another social media scheduler or AI content generator. It connects business intelligence to marketing execution, and it should be proactive: it continuously finds what deserves attention, prepares the work, and moves it through approval and execution.

Its operating cycle:

```
Business Data → Intelligence → Opportunity → Creative Generation → Asset Library
  → Marketing Calendar → Publishing → Measurement → Learning
```

Core principles from the PRD:

- **Catalogue-wide coverage:** every eligible product gets marketing attention, tracked in a coverage record.
- **Commercial outcomes over vanity metrics:** high engagement isn't treated as purchase intent.
- **Accurate data only:** never invent prices, stock, specifications or analytics. Unavailable data isn't shown as zero.
- **Human approval for consequential actions:** price changes, inventory changes, promotional pricing, ad spend and unapproved publishing.
- **Reusable creative assets:** generated images are stored, versioned and reused instead of regenerated.
- **Multi-tenant by design:** isolated workspaces, with nothing NURU-specific hard-coded into the foundation.
- **Two interfaces, one backend:** the web app and ChatGPT (through MCP) share data, permissions and the source of truth.

## Roadmap

| Phase | Scope | Deliverable |
|---|---|---|
| 1. Foundation | Multi-tenancy, auth, workspaces, database, integration framework, NURU read-only adapter, commerce sync, overview dashboard | CGOS understands the business and its catalogue |
| 2. Catalogue and Growth Intelligence | Product performance, catalogue coverage engine, bundle discovery, opportunity scoring, recommendations | CGOS identifies what to market and why |
| 3. Creative Intelligence Studio | Brand memory, creative briefs, image generation, copy, validation, media library, approvals, asset economics | CGOS generates and manages reusable marketing assets |
| 4. Marketing Calendar and Distribution | Calendar, AI calendar generation, campaigns, publishing integrations, performance collection | CGOS manages marketing from planning to measurement |
| 5. Social, SEO and Competitor Intelligence | Social and search integrations, competitor monitoring, cross-channel attribution | CGOS understands the wider market and acquisition |
| 6. Autonomous Growth | Background intelligence, configurable execution, experiments, continuous learning | CGOS becomes a proactive growth OS |
| 7. SaaS Commercialisation | Subscriptions, billing, usage limits, onboarding, administration | CGOS is ready for external businesses |

**Current status:** early Phase 1. The repo has the Next.js app shell with module pages, the Prisma data model, and the Coolify deployment with PostgreSQL. It doesn't yet have authentication, tenancy enforcement, the NURU adapter, background workers, or the MCP server. The PRD's proposed stack (NestJS backend, Redis + BullMQ, pgvector, S3 storage) isn't adopted yet.

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
npm run seed         # seed initial pilot tenant (NURU Electronics) & catalogue
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

- [`docs/PRD.md`](docs/PRD.md): Product Requirements Document v1.0
- [`docs/PHASE1_DATA_LAYER.md`](docs/PHASE1_DATA_LAYER.md): Phase 1 Data Layer, Seeding & API Documentation
- [`CGOS_SETUP_SUMMARY.md`](CGOS_SETUP_SUMMARY.md): platform overview, data model and roadmap
- [`cgos-platform/OPENSEO_INTEGRATION_GUIDE.md`](cgos-platform/OPENSEO_INTEGRATION_GUIDE.md): OpenSEO integration
