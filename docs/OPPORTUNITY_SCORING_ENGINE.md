# Opportunity Scoring & Growth Intelligence Engine (Phase 2)

This document describes the algorithmic Opportunity Scoring and Catalogue Intelligence Engine in Commerce Growth OS (CGOS) in accordance with **PRD §5 (Catalogue and Growth Intelligence)**.

---

## 1. Principles & Objectives

As defined in **PRD §5**:
- **Commercial Outcomes over Vanity Metrics:** CGOS evaluates products based on actual profitability and stock availability rather than isolated engagement metrics.
- **Explainable Scoring:** Every score is broken down into clear, deterministic factors (gross margin %, inventory runway, and strategic category demand).
- **Proactive Marketing Triggers:** Products scoring &ge; 88.0 are ranked as **Hero Products** and automatically feed into bundle generation, creative briefs, and campaign calendars.

---

## 2. Mathematical Scoring Model

The Opportunity Score (0.0 to 100.0) is a weighted composite of three commercial pillars:

$$\text{Opportunity Score} = \text{Score}_{\text{margin}} + \text{Score}_{\text{stock}} + \text{Score}_{\text{demand}}$$

### A. Gross Margin Component (0 to 40 Points)
Rewards products that generate high net revenue per unit sold:
$$\text{Score}_{\text{margin}} = \min\left(\frac{\text{Margin \%}}{30.0} \times 40, 40\right)$$

### B. Stock Runway Component (0 to 35 Points)
Prevents stockouts from aggressive campaigns and highlights products with excess inventory needing velocity:
- $\ge 10$ units in stock: **35 points** (optimal campaign capacity)
- $5 - 9$ units in stock: **25 points** (steady capacity)
- $1 - 4$ units in stock: **15 points** (limited capacity, cautious ad spend)
- $0$ units in stock: **0 points** (out of stock, backorder only)

### C. Strategic Demand & Category Tier (0 to 25 Points)
- Flagship products (Apple, Samsung flagship lines): **25 points**
- High-attach accessories (Anker power banks, audio): **22 points**
- Standard electronics & computing: **20 points**

---

## 3. Product Lifecycle Classifications

| Segment | Criteria | Strategic Action |
|---|---|---|
| **`hero_product`** | Score $\ge 88.0$, Stock $\ge 6$ | Front-and-center storefront banner, Instagram/TikTok ad priority |
| **`high_margin`** | Margin $\ge 22.0\%$, Score $\ge 80.0$ | Pair with high-traffic flagships in bundled cross-sells |
| **`volume_driver`** | Stock $\ge 20$ units | Fast WhatsApp promotional broadcast with BNPL financing |
| **`replenish_soon`** | Stock $\le 3$ units | Inventory warning: prioritize re-order before paid ad spend |

---

## 4. API Endpoints

### 1. Retrieve Scored Products & Recommendations
```http
GET /api/intelligence
```

**Response:**
```json
{
  "status": "ok",
  "metrics": {
    "totalScored": 6,
    "avgScore": 88.7,
    "heroCount": 4,
    "staleCount": 0
  },
  "products": [
    {
      "id": "prod-s24-ultra",
      "title": "Samsung Galaxy S24 Ultra",
      "opportunityScore": 94.0,
      "grossMarginPercent": 23.7,
      "lifecycleCategory": "hero_product",
      "stockQuantity": 9
    }
  ],
  "recommendations": [
    {
      "id": "rec-1",
      "type": "campaign",
      "title": "Promote Samsung Galaxy S24 Ultra (HERO PRODUCT)",
      "priority": 94.0,
      "confidence": 90.0
    }
  ]
}
```

### 2. Run Catalogue-Wide Scoring Pipeline
```http
POST /api/intelligence
```
Executes the scoring pipeline across all products, updates `ProductAnalysis`, and creates `GrowthRecommendation` records.

---

## 5. UI Dashboard (`/intelligence`)
The `/intelligence` canvas displays:
- **KPI Row:** Total Evaluated, Average Opportunity Score, Hero Products count, and High Margin Champions.
- **Action Centre:** Priority-ranked growth recommendations with direct campaign planning triggers.
- **Product Matrix:** Interactive table with rank badges, visual score progress bars, gross margin percentages, and lifecycle segment badges.
