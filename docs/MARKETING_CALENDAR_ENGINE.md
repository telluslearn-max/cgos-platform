# Phase 4: Marketing Calendar & Campaign Distribution Engine

## 1. Overview
The **Marketing Calendar & Campaign Distribution Engine** operationalizes the intelligence produced by Phase 2 (Bundle Discovery, Opportunity Scoring) and Phase 3 (Creative Intelligence Studio). It schedules and coordinates marketing campaigns across platforms with strict adherence to **PRD §14 Safeguards** (no autonomous discounting, price modifications, or unapproved publication).

## 2. Architecture & Data Model
Built upon Prisma models:
- `MarketingCalendar`: Tenant-scoped calendar schedule with recurrence flags.
- `CalendarEntry`: Individual scheduled publications linking creative content briefs, products, and channels (`scheduled`, `published`, `cancelled`).
- `Campaign`: Multi-product campaigns tracking budget, objective, target audience, and timeframe.
- `CampaignGoal`: Target metrics (e.g. conversions, revenue, reach).

## 3. Endpoints
- `GET /api/campaigns`: Lists tenant campaigns with hydrated product details and budget summaries.
- `POST /api/campaigns`: Creates a new campaign targeting identified opportunity products.
- `GET /api/marketing-calendar`: Retrieves ordered timeline entries with linked product and brief references.
- `POST /api/marketing-calendar`: Adds a calendar entry for cross-channel distribution.

## 4. UI Dashboard
- `/campaigns`: Live dashboard to manage active marketing campaigns and inspect allocated budgets.
- `/marketing-calendar`: Visual timeline displaying upcoming publications, product alignment, and scheduling status.

## 5. Safeguard Compliance
All marketing campaigns and calendar entries act as proposals and scheduled drafts. No customer-facing prices are mutated, and no promotional codes are deployed autonomously without human-in-the-loop signoff.
