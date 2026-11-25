# Commerce Growth OS (CGOS) — Phase 1: Data Layer & Catalogue Foundation

This document details the architecture, data models, seeding, and API endpoints introduced in Phase 1 of the Commerce Growth OS (CGOS) foundation.

---

## 1. Architecture Overview

Phase 1 establishes the operational data layer connecting the Next.js 16 frontend directly to the PostgreSQL database via Prisma ORM:

```
PostgreSQL Database (Coolify / Local)
         ▲
         │ (Prisma ORM ^6.19)
         ▼
src/lib/prisma.ts (Global Singleton)
         ▲
         ├──► Server Components (e.g. /overview, /catalogue)
         └──► REST API Routes (e.g. /api/overview, /api/catalogue, /api/health)
```

---

## 2. Key Components Added

### A. Prisma Client Singleton (`src/lib/prisma.ts`)
- Implements the standard Next.js global singleton pattern.
- Avoids connection pool exhaustion in development hot-reloading and ensures reliable connection pooling in production.

### B. Pilot Tenant Seeding (`prisma/seed.mjs`)
- Standard Node.js ECMAScript Module (`.mjs`) for clean execution across both Docker and local dev environments without requiring `ts-node` or `tsx`.
- **Seeded Entities:**
  1. **Pilot Tenant:** NURU Electronics (`nuru-electronics`) with industry and location parameters.
  2. **Admin User:** Initial administrator (`SG Kamau`, `admin@nuruelectronics.com`).
  3. **Business Profile:** Strategy, target customers, brand positioning, and tone.
  4. **Core Catalogue Products:**
     - Apple iPhone 15 Pro (128GB, Natural Titanium)
     - Samsung Galaxy S24 Ultra (256GB, Titanium Gray)
     - Sony WH-1000XM5 Wireless Headphones
     - Apple MacBook Air 13-inch M3 (16GB / 512GB)
     - Anker 737 Power Bank (PowerCore 24K)
  5. **Product Variants & Analyses:** Pricing in KES, stock tracking, opportunity scoring (80-95), and lifecycle categorization.

### C. API Endpoints
1. **`GET /api/overview`**
   - Returns aggregated business metrics (`totalProducts`, `activeVariants`, `activeCampaigns`, `contentBriefs`, and `topOpportunities`).
   - Graceful fallback during cold start or empty database state.
2. **`GET /api/catalogue`**
   - Query params: `category`, `search`.
   - Returns paginated or filtered products with formatted pricing and stock counts.
3. **`GET /api/health`**
   - Returns `{ status: "ok" }` for Coolify health checks.

### D. Live UI Pages
- **`/overview`**: Displays real-time catalogue metrics, active campaigns count, system status, and ranked opportunity score list.
- **`/catalogue`**: Live product inventory table displaying brand, SKU, stock health pills, KES pricing, and status badges.

---

## 3. Running Seeding and Local Development

### Seed the database:
```bash
cd cgos-platform
npm run seed
```
Or via Prisma CLI:
```bash
npx prisma db seed
```

### Run local dev server:
```bash
npm run dev
```

---

## 4. Coolify Deployment Lifecycle
- On deployment push to `master`:
  1. Coolify builds the multi-stage Dockerfile.
  2. The container starts and runs `prisma db push --skip-generate` to apply schema updates.
  3. The Next.js server starts on port `3000`.
  4. The `/api/health` check confirms health.
