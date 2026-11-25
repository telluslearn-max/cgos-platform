# Creative Intelligence Studio (Phase 3)

This document describes the Creative Intelligence Studio implemented in Commerce Growth OS (CGOS) in accordance with **PRD §6 (Creative Intelligence Studio)** and **PRD §7 (Content Generation)**.

---

## 1. Vision & Core Principles

- **Converting Intelligence into Usable Creative Assets:** CGOS bridges business intelligence and marketing execution.
- **Brand Memory & Style Guardrails:** Strict brand consistency (genuine Kenya stock, official manufacturer warranties, verified KES pricing, same-day delivery).
- **Multi-Format Coverage:** Generates briefs for Instagram Carousels & Reels, WhatsApp VIP Direct Broadcasts, TikTok comparisons, and storefront hero banners.
- **Human Approval Safeguard:** All copy and assets remain in review status until explicitly approved by the business owner.

---

## 2. API Endpoints

### 1. List Creative Briefs
```http
GET /api/content-studio
```

### 2. Generate New Briefs for Hero Products
```http
POST /api/content-studio
```

### 3. Update Brief Approval Status
```http
PATCH /api/content-studio
Content-Type: application/json

{
  "id": "brief-id",
  "status": "approved" // or "draft", "archived"
}
```

---

## 3. UI Dashboard (`/content-studio`)
The `/content-studio` interface provides a multi-channel brief management space with target audience parameters, content angles, calls to action (CTAs), and direct scheduling into the marketing calendar.
