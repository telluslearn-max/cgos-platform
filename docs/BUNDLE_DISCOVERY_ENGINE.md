# Bundle & Cross-Sell Discovery Engine (Phase 2)

This document describes the automated Bundle & Cross-Sell Discovery Engine implemented in Commerce Growth OS (CGOS) in accordance with **PRD §5 (Catalogue and Growth Intelligence)** and **PRD §6 (Bundle Discovery)**.

---

## 1. Vision & Core Principles

As outlined in **PRD §6**:
- **Distinction from Discounts:** CGOS strictly distinguishes between a bundle and a discount. It identifies high-affinity complementary items to lift average order value (AOV) and gross margin without necessarily cutting prices.
- **Human Approval Safeguard:** CGOS never autonomously alters live product pricing or launches promotional discount campaigns. Bundle creation and pricing require explicit human approval (`status: "pending_approval"` &rarr; `"approved"`).
- **Catalogue-Wide Coverage:** The engine evaluates compatible pairings across flagship devices, audio gear, and essential high-margin accessories.

---

## 2. Architecture & File Structure

```
cgos-platform/
└── src/
    ├── lib/
    │   └── intelligence/
    │       └── bundles.ts         # Discovery engine & template pairing rules
    └── app/
        ├── api/
        │   └── bundles/
        │       ├── route.ts       # GET (list with products) & POST (run discovery)
        │       └── [id]/
        │           └── route.ts   # PATCH (approve/reject) & DELETE
        └── bundles/
            └── page.tsx           # Interactive bundle cards & review UI
```

---

## 3. Discovered Bundle Types

The engine categorizes opportunities into specific commercial categories:

1. **Accessory Bundles (Margin Drivers)**
   - *Example:* **Mobile Creator Power Pack** (Apple iPhone 15 Pro + Anker 737 PowerCore 24K).
   - *Rationale:* Connects a high-demand flagship smartphone with an ultra-high-margin power accessory, lifting gross margin by +4.8%.
2. **Complementary Bundles (Basket Multipliers)**
   - *Example:* **Executive Audiophile Suite** (Samsung Galaxy S24 Ultra + Sony WH-1000XM5 ANC Headphones).
   - *Rationale:* Pairs executive mobile AI productivity with class-leading noise cancellation, capturing maximum customer lifetime value.
3. **Productivity Bundles (High AOV Bundles)**
   - *Example:* **Remote Pro Workstation** (MacBook Air 13-inch M3 + Sony WH-1000XM5).
   - *Rationale:* Lifts single-transaction order value above KES 235,000 for hybrid software developers and designers.

---

## 4. API Specification

### 1. List Bundles
```http
GET /api/bundles
GET /api/bundles?status=pending_approval
```

**Response:**
```json
{
  "status": "ok",
  "totalCount": 3,
  "bundles": [
    {
      "id": "bundle-creator-pack",
      "name": "Mobile Creator Power Pack",
      "combinedPrice": 172499,
      "marginEstimate": 21.5,
      "status": "pending_approval",
      "products": [
        { "id": "...", "title": "Apple iPhone 15 Pro (128GB, Natural Titanium)", "sellingPrice": 154999 },
        { "id": "...", "title": "Anker 737 Power Bank", "sellingPrice": 17500 }
      ]
    }
  ]
}
```

### 2. Trigger Discovery
```http
POST /api/bundles
```
Runs the discovery pipeline across all products in the tenant catalogue, recalculating margins and upserting into the `BundleRecommendation` table.

### 3. Approve or Reject a Bundle
```http
PATCH /api/bundles/:id
Content-Type: application/json

{
  "status": "approved" // or "rejected", "pending_approval"
}
```

---

## 5. UI Dashboard (`/bundles`)
The `/bundles` interface provides an executive review canvas:
- **Metrics Bar:** Total Discovered, Average Gross Margin %, Pending Review, and Approved counts.
- **Bundle Cards:** Complete product breakdown, individual pricing, stock status, and estimated margin badges.
- **Workflow Triggers:** Direct paths to plan promotional marketing campaigns.
