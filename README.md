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

## Roadmap & Architecture Documentation

All phases (Phases 1 through 7) are implemented, verified, and documented:

| Phase | Scope | Documentation | Live Routes |
|---|---|---|---|
| **Phase 1** | Foundation & Data Layer | [`docs/PHASE1_DATA_LAYER.md`](docs/PHASE1_DATA_LAYER.md)<br>[`docs/NURU_INTEGRATION_ADAPTER.md`](docs/NURU_INTEGRATION_ADAPTER.md) | `/overview`<br>`/catalogue`<br>`/integrations` |
| **Phase 2** | Bundle Engine & Opportunity Scoring | [`docs/BUNDLE_DISCOVERY_ENGINE.md`](docs/BUNDLE_DISCOVERY_ENGINE.md)<br>[`docs/OPPORTUNITY_SCORING_ENGINE.md`](docs/OPPORTUNITY_SCORING_ENGINE.md) | `/bundles`<br>`/intelligence` |
| **Phase 3** | Creative Intelligence Studio | [`docs/CREATIVE_STUDIO_ENGINE.md`](docs/CREATIVE_STUDIO_ENGINE.md) | `/content-studio` |
| **Phase 4** | Marketing Calendar & Distribution | [`docs/MARKETING_CALENDAR_ENGINE.md`](docs/MARKETING_CALENDAR_ENGINE.md) | `/campaigns`<br>`/marketing-calendar` |
| **Phase 5** | SEO, Social & Competitor Intelligence | [`docs/MARKET_INTELLIGENCE_ENGINE.md`](docs/MARKET_INTELLIGENCE_ENGINE.md) | `/seo`<br>`/competitors` |
| **Phase 6** | Autonomous Growth Framework | [`docs/AUTONOMOUS_GROWTH_FRAMEWORK.md`](docs/AUTONOMOUS_GROWTH_FRAMEWORK.md) | `/settings`<br>`/api/autonomous/cycle` |
| **Phase 7** | SaaS Multi-Tenancy & Analytics | [`docs/SAAS_COMMERCIALISATION.md`](docs/SAAS_COMMERCIALISATION.md) | `/analytics`<br>`/api/analytics` |

## Live Platform Modules

| Route | Purpose | Architecture / Engine |
|---|---|---|
| `/overview` | Pilot executive overview & catalogue pulse | Phase 1 Data Layer |
| `/catalogue` | Live product inventory & margins | Phase 1 Data Layer |
| `/integrations` | NURU commerce sync & PRD §14 read-only controls | NURU Integration Adapter |
| `/bundles` | Complementary bundle discovery & kit revenue | Phase 2 Bundle Discovery |
| `/intelligence` | Composite opportunity scoring (velocity, margin, demand) | Phase 2 Scoring Engine |
| `/content-studio` | Brand memory & high-converting creative brief studio | Phase 3 Creative Intelligence |
| `/campaigns` | Multi-product promotional campaign management | Phase 4 Marketing Distribution |
| `/marketing-calendar` | Chronological publication timeline | Phase 4 Distribution |
| `/seo` | OpenSEO rankings, keyword discovery & crawl health | Phase 5 Market Intelligence |
| `/competitors` | Competitive price benchmarking & catalog differentials | Phase 5 Market Intelligence |
| `/settings` | Autonomous growth loop controls & pipeline status | Phase 6 Autonomous Growth |
| `/analytics` | Revenue attribution, marketing ROI & multi-tenancy metrics | Phase 7 SaaS Commercialisation |

## Deployment & Verification

- **Coolify Integration**: Coolify automatically builds and runs the platform via the multi-stage `Dockerfile` on push to `master`.
- **Database Migrations**: Automatically synchronized on container start with `prisma db push --skip-generate`.
- **Pilot Tenant**: Pre-seeded for NURU Electronics (`nuru-electronics`) with complete solar and consumer electronics catalogue.
