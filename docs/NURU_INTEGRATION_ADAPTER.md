# NURU Electronics Commerce Integration Adapter

This guide documents the dedicated NURU Commerce Integration Adapter implemented in Commerce Growth OS (CGOS) in accordance with **PRD §14 (NURU Integration)**.

---

## 1. Overview & Principles

As defined in **PRD §14.1**:
- CGOS interacts with the NURU Electronics commerce platform through authenticated, structured APIs.
- **Strict Read-Only Enforcement:** The adapter operates in read-only mode by default. CGOS ingests catalogue, variant, image, and inventory data, but never independently alters prices, stock levels, or customer orders without explicit human approval.

---

## 2. Architecture & File Structure

```
cgos-platform/
└── src/
    ├── lib/
    │   └── integrations/
    │       └── nuru/
    │           ├── types.ts    # TypeScript definitions for payloads & sync results
    │           ├── client.ts   # NuruCommerceClient (HTTP calls, retries, auth)
    │           └── sync.ts     # Ingestion engine upserting into Prisma
    └── app/
        ├── api/
        │   └── integrations/
        │       └── nuru/
        │           └── sync/
        │               └── route.ts  # GET (health & status) & POST (trigger sync)
        └── integrations/
            └── page.tsx              # Integrations dashboard UI
```

---

## 3. Configuration & Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NURU_API_URL` | Base URL of NURU's commerce instance | `https://www.nuruelectronics.com` |
| `NURU_API_TOKEN` | Bearer token for authenticated API calls | Optional (falls back to reference catalogue if unset) |
| `NURU_TIMEOUT_MS` | Request timeout in milliseconds | `10000` |

If `NURU_API_TOKEN` is not provided (e.g. in local development or before production tokens are provisioned), the client safely falls back to NURU's reference catalogue covering flagship products (Apple iPhone 15 Pro, Samsung S24 Ultra, Sony WH-1000XM5, MacBook Air M3, Anker 737, Google Pixel 8 Pro) so local testing is never blocked.

---

## 4. API Endpoints

### 1. Check Status & Health
```http
GET /api/integrations/nuru/sync
```

**Response:**
```json
{
  "status": "ok",
  "integration": {
    "id": "cm...",
    "name": "NURU Commerce Platform",
    "status": "connected",
    "lastSyncAt": "2026-11-25T07:30:00.000Z",
    "config": {
      "mode": "read_only",
      "syncedProducts": 6,
      "syncedVariants": 6,
      "source": "fallback_catalogue"
    }
  },
  "nuruHealth": {
    "ok": true,
    "status": "healthy",
    "latencyMs": 142
  }
}
```

### 2. Trigger On-Demand Synchronization
```http
POST /api/integrations/nuru/sync
```

**Response:**
```json
{
  "status": "ok",
  "message": "NURU catalogue synchronization complete",
  "result": {
    "success": true,
    "syncedProducts": 6,
    "syncedVariants": 6,
    "syncedImages": 6,
    "errors": [],
    "timestamp": "2026-11-25T07:30:00.000Z",
    "source": "fallback_catalogue"
  }
}
```

---

## 5. Synchronization Flow

1. **Tenant Resolution**: Resolves or creates the pilot tenant (`nuru-electronics`).
2. **Integration Record**: Sets the `Integration` status to `syncing` in PostgreSQL.
3. **Product Ingestion**: Upserts `Product` records with prices, SKU, tags, categories, and inventory.
4. **Variant Ingestion**: Upserts `ProductVariant` records for each SKU.
5. **Media Attachment**: Stores media URLs and dimensions in `ProductMedia`.
6. **Opportunity Scoring**: Computes an initial `opportunityScore` (0–100) based on margin and stock availability, storing it in `ProductAnalysis`.
7. **Audit & Completion**: Marks `Integration` status as `connected` and updates `lastSyncAt`.
