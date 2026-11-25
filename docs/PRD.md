COMMERCE GROWTH OS (CGOS)

Product Requirements Document

Version: 1.0
Status: Product specification
Product category: AI-powered Commerce Growth and Marketing Operating System
Initial implementation: NURU Electronics
Deployment target: Docker-compatible VPS / Coolify
Primary interfaces: Standalone Web Application + ChatGPT through MCP

---

1. Executive Summary

Commerce Growth OS (CGOS) is an AI-powered business intelligence and execution platform designed to help businesses identify, create and execute growth opportunities.

It connects commerce data, product catalogues, social media, search engines, competitors and marketing channels into one intelligence system.

CGOS continuously analyses the business, identifies opportunities and translates them into actionable work.

It can:

- Analyse products and sales.
- Identify products requiring marketing attention.
- Discover complementary products and potential bundles.
- Generate marketing strategies and creative briefs.
- Generate original marketing images.
- Build a reusable creative asset library.
- Write marketing copy.
- Manage a multi-platform marketing calendar.
- Schedule and publish approved content.
- Analyse SEO and search performance.
- Monitor competitors.
- Measure marketing effectiveness.
- Learn from commercial outcomes.
- Execute authorised workflows autonomously.

CGOS is not intended to be another social media scheduler or AI content generator.

Its purpose is to connect business intelligence with marketing execution.

1.1 Core proposition

Understand the business. Discover opportunities. Create the marketing. Execute the campaigns. Measure the results. Learn and improve.

1.2 Fundamental product principle

CGOS should be proactive.

It should not wait for an operator to ask what to market.

It should continuously identify what deserves attention, prepare the required work and move opportunities through an approval and execution workflow.

---

2. Product Vision and Objectives

2.1 Vision

Build an intelligent operating system that becomes the central growth engine for a business.

2.2 Objectives

1. Understand a business through its connected operational and marketing data.
2. Systematically market eligible products across its catalogue.
3. Discover commercially relevant product bundles.
4. Generate high-quality marketing assets using AI.
5. Build a reusable library of business-specific creative assets.
6. Manage marketing planning, scheduling and publishing.
7. Improve organic search visibility.
8. Analyse competitors and market opportunities.
9. Measure the relationship between marketing activity and commercial outcomes.
10. Continuously improve recommendations through accumulated business knowledge.
11. Provide conversational access through ChatGPT and MCP.
12. Support multiple independent businesses through a multi-tenant architecture.

2.3 Primary success metrics

- Active catalogue marketing coverage.
- Percentage of products with approved marketing assets.
- Number of opportunities identified.
- Number of bundle opportunities validated.
- Creative approval rate.
- Cost per usable creative asset.
- Creative asset reuse rate.
- Calendar completion rate.
- Publishing success rate.
- Organic search performance.
- Campaign-attributed website visits.
- Campaign-attributed enquiries.
- Campaign-attributed sales.
- Revenue associated with promoted products.
- Improvement in campaign performance over time.

Commercial outcomes take priority over vanity metrics.

---

3. Product Architecture and Interfaces

CGOS consists of four principal layers.

Layer 1: Standalone Web Application

The primary control centre for business owners and marketing operators.

Layer 2: Intelligence and Execution Engine

The central system responsible for data ingestion, analysis, recommendations, creative workflows, scheduling, automation and learning.

Layer 3: Integration Layer

Connects CGOS to commerce platforms, social networks, search providers, analytics services and other business systems.

Layer 4: ChatGPT and MCP Interface

Provides conversational access to the same business intelligence and authorised actions available through the web application.

Both interfaces must use the same backend, permissions, business records and source of truth.

---

4. Users and Multi-Tenant Model

4.1 Initial customer

NURU Electronics.

NURU will serve as the first live implementation and testing environment.

4.2 Future customer segments

- Electronics retailers.
- General e-commerce businesses.
- Fashion retailers.
- Beauty businesses.
- Consumer goods retailers.
- Restaurants and hospitality businesses.
- Other small and medium-sized businesses.

4.3 Multi-tenant requirements

Every business must operate within an isolated workspace.

A workspace contains:

- Business profile.
- Products and variants.
- Brand identity.
- Connected integrations.
- Social accounts.
- Commerce records.
- Campaigns.
- Creative assets.
- Marketing calendar.
- Analytics.
- Competitor records.
- Business knowledge.
- Recommendations.
- Automation policies.
- Users and permissions.

No tenant may access another tenant's private information.

The architecture must not hard-code NURU-specific functionality into the platform foundation.

---

5. Core Functional Modules

5.1 Business Intelligence Dashboard

The dashboard should answer five questions:

1. What is happening in the business?
2. What opportunities exist?
3. What requires attention?
4. What is CGOS working on?
5. What results are being generated?

Dashboard components:

- Commerce performance.
- Marketing performance.
- Catalogue coverage.
- Creative production.
- Upcoming campaigns.
- Publishing calendar.
- Growth opportunities.
- SEO performance.
- Competitor observations.
- Automation activity.
- Approval queue.
- Alerts.

Users should be able to move from a summary directly into the underlying products, campaigns, recommendations or records.

5.2 Commerce Intelligence

Connect to commerce platforms to understand actual business activity.

Required data:

- Products.
- Product variants.
- Categories.
- Product descriptions.
- Product images.
- Selling prices.
- Product costs, where available.
- Inventory.
- Orders.
- Order items.
- Sales.
- Returns and cancellations, where available.
- Customer enquiries, where authorised.
- Product URLs.

Capabilities:

- Product performance analysis.
- Category performance.
- Sales trend detection.
- Inventory-aware recommendations.
- Slow-moving product identification.
- High-demand product identification.
- Product lifecycle analysis.
- Price monitoring.
- Product availability monitoring.
- Product-level campaign attribution.

Data must retain its source and last-synchronised timestamp.

Unavailable information must not be represented as zero or fabricated.

5.3 Catalogue Growth Intelligence

This is a central CGOS capability.

CGOS must actively ensure that eligible products receive marketing attention.

Every active product should have a marketing coverage record.

Track:

- Last marketing date.
- Number of approved creative assets.
- Published campaigns.
- Platforms covered.
- Content formats used.
- Engagement history.
- Website traffic generated.
- Enquiries generated.
- Sales attributed.
- Bundle opportunities.
- Creative gaps.
- Recommended next action.

Catalogue coverage categories

Classify products as:

- Never marketed.
- Recently marketed.
- Marketing overdue.
- Insufficient creative assets.
- Insufficient platform coverage.
- Strong engagement.
- Strong commercial performance.
- Underperforming.
- Requires updated creative.
- Temporarily unavailable.
- Discontinued.

Catalogue coverage engine

The engine must:

1. Scan the active catalogue.
2. Identify marketing gaps.
3. Prioritise products.
4. Generate marketing opportunities.
5. Prepare creative briefs.
6. Request or generate suitable assets.
7. Add proposed content to the marketing calendar.
8. Track approval and publishing.
9. Measure results.
10. Update coverage records.

The system must aggressively pursue catalogue coverage without generating repetitive or commercially irrelevant content.

Priority should consider stock, commercial value, relevance, seasonality, audience demand and content fatigue.

5.4 Bundle and Cross-Sell Intelligence

CGOS must discover commercially relevant product combinations.

Example combinations:

- Smartphone + protective case + screen protector.
- Laptop + mouse + laptop bag.
- Gaming console + controller + game.
- Television + soundbar.
- Smartphone + compatible earbuds.

Bundle discovery inputs

- Product compatibility.
- Product category.
- Complementary product relationships.
- Historical co-purchases.
- Customer buying patterns, where available.
- Inventory availability.
- Selling price.
- Product costs and margin, where available.
- Seasonal relevance.
- Product demand.
- Commercial positioning.

Bundle types

- Complementary bundles.
- Promotional bundles.
- Cross-sell combinations.
- Upsell combinations.
- Gift combinations.
- Seasonal combinations.
- Accessory bundles.

Bundle evaluation

Every recommendation must contain:

- Bundle name.
- Products included.
- Product compatibility assessment.
- Target audience.
- Customer benefit.
- Combined selling price.
- Estimated margin, where data permits.
- Stock availability.
- Commercial rationale.
- Risks and assumptions.
- Suggested campaign.
- Creative brief.
- Recommended channels.

CGOS must distinguish a bundle from a discount.

It may recommend a bundle without recommending a price reduction.

It must never invent a promotional price or change product pricing autonomously.

Bundle creation, price changes and promotional claims require approval.

---

6. Creative Intelligence Studio

This is a core differentiating feature of CGOS.

It converts business intelligence into usable marketing assets.

6.1 Creative generation objectives

CGOS should be able to generate:

- Product posters.
- Product comparison creatives.
- Product bundle posters.
- Educational carousels.
- Product discovery graphics.
- Editorial content.
- Brand storytelling graphics.
- Seasonal campaigns.
- Product launch campaigns.
- Promotional creatives.
- Platform-specific adaptations.
- Supporting campaign imagery.

6.2 Insight-driven generation

Creative generation must begin with a business opportunity.

The workflow:

1. Identify a product, bundle or campaign opportunity.
2. Retrieve accurate product information.
3. Analyse relevant audience and performance data.
4. Establish campaign objective.
5. Generate creative brief.
6. Select creative format.
7. Generate original imagery.
8. Generate supporting copy.
9. Validate the output.
10. Present for approval.
11. Store the approved asset.
12. Attach it to the relevant campaign and calendar entry.

A user must also be able to initiate creative generation manually.

6.3 Image generation integration

The platform should investigate supported ChatGPT/OpenAI image-generation and app authentication capabilities.

The preferred commercial objective is to make authorised ChatGPT subscription usage available to CGOS where the applicable product, authentication and usage-sharing arrangements permit it.

However:

- A ChatGPT subscription must not be assumed to include API usage.
- MCP connectivity alone does not grant subscription image-generation access.
- Subscription-based access and direct API billing must be treated as separate integration possibilities.
- Actual access, permissions, usage limits and commercial terms must be validated before architecture is finalised.

The system must support an alternative image-generation provider if subscription-connected generation is unavailable or unsuitable.

Provider integrations should be modular.

6.4 Product-aware generation

Creative generation must use actual catalogue information.

For real products:

- Prefer real product images as visual references.
- Preserve model identity.
- Preserve colour and variant.
- Preserve proportions.
- Avoid invented specifications.
- Avoid fabricated accessories.
- Avoid misleading product representations.

Where image generation cannot reliably reproduce a product, CGOS should use the actual catalogue image within a designed composition.

Generated text, specifications and prices must be validated separately.

6.5 Brand memory

Every workspace must maintain a reusable brand profile.

It includes:

- Logos.
- Colours.
- Typography.
- Brand voice.
- Visual references.
- Photography style.
- Layout preferences.
- Approved campaign examples.
- Design restrictions.
- Platform-specific guidelines.
- Brand positioning.

The creative engine must use this profile in every relevant generation request.

6.6 Creative quality assurance

Validate:

- Product accuracy.
- Variant accuracy.
- Price accuracy.
- Spelling.
- Copy consistency.
- Brand consistency.
- Text legibility.
- Dimensions.
- Aspect ratio.
- Platform safe areas.
- Duplicate creatives.
- Promotional claims.

Creative assets must be reviewable before publishing.

6.7 Creative asset library

Every generated or uploaded asset must become a persistent business asset.

Asset records must include:

- Asset ID.
- Workspace.
- Product or bundle association.
- Campaign association.
- Creative brief.
- Generation provider.
- Model.
- Prompt and generation metadata.
- Original image.
- Derivative images.
- Dimensions.
- File format.
- Version.
- Approval state.
- Publication history.
- Performance history.
- Creation date.
- Expiration or review date, where relevant.

Asset lifecycle

Assets must support:

- Creation.
- Review.
- Approval.
- Reuse.
- Adaptation.
- Versioning.
- Archiving.
- Expiration.
- Replacement.

Asset economics

CGOS must treat image generation as an investment in reusable creative inventory.

It should measure:

- Cost per usable asset.
- Asset reuse rate.
- Number of campaigns supported.
- Number of platforms supported.
- Performance per asset.
- Asset lifetime.
- Commercial value attributable to the asset, where measurable.

It should avoid unnecessary regeneration.

Asset classification

Evergreen assets

Examples: product photography, educational graphics, buying guides and brand visuals.

These can remain useful over extended periods.

Campaign assets

Examples: launches, seasonal campaigns and specific marketing initiatives.

Their relevance depends on campaign context.

Dynamic assets

Examples: posters containing prices, stock levels or limited-time offers.

These must be revalidated whenever their underlying commercial information changes.

An asset containing an expired promotion must not be republished without review.

---

7. Marketing Calendar and Campaign Management

The calendar is a full operational module, not simply a scheduling interface.

7.1 Calendar views

- Monthly.
- Weekly.
- Daily.
- Campaign.
- Product coverage.
- Platform.
- Drafts.
- Approvals.
- Published content.

7.2 Calendar intelligence

CGOS should recommend:

- What to publish.
- Which product to feature.
- Which bundle to promote.
- Which platform to use.
- Content format.
- Campaign objective.
- Creative requirements.
- Caption.
- CTA.
- Publishing date.
- Publishing time.

Recommendations must consider:

- Historical performance.
- Platform-specific patterns.
- Product priorities.
- Catalogue coverage.
- Campaign objectives.
- Seasonal opportunities.
- Content fatigue.
- Audience behaviour.

7.3 Calendar generation

Users must be able to request:

- Seven-day calendar.
- Fourteen-day calendar.
- Thirty-day calendar.
- Product-specific campaign.
- Bundle campaign.
- Seasonal campaign.
- Product launch.
- Catalogue coverage plan.
- Calendar gap analysis.

The system should also generate calendars proactively.

7.4 Calendar entry schema

Every entry should contain:

- Calendar entry ID.
- Campaign ID.
- Product or products.
- Platform.
- Content category.
- Creative asset.
- Caption.
- CTA.
- Hashtags.
- Scheduled date and time.
- Approval status.
- Publishing status.
- Published URL.
- Performance data.

7.5 Publishing lifecycle

Statuses:

- Opportunity identified.
- Brief generated.
- Creative pending.
- Draft ready.
- Awaiting approval.
- Approved.
- Scheduled.
- Publishing.
- Published.
- Failed.
- Cancelled.

Publishing must use authorised platform integrations.

If a platform does not support direct publishing, provide an export or guided publishing workflow.

7.6 Calendar learning

After publication:

1. Retrieve available performance data.
2. Compare with relevant historical content.
3. Evaluate the campaign objective.
4. Identify successful elements.
5. Identify weak elements.
6. Update recommendations.
7. Adjust future calendars.

The system must detect repetitive creative patterns and content fatigue.

---

8. Social Media Intelligence

8.1 Platform integrations

Design modular adapters for:

- Instagram.
- Facebook Pages.
- TikTok.
- YouTube.
- Pinterest.
- LinkedIn.
- X.
- Threads.

Actual functionality must depend on each platform's available official APIs, permissions and account eligibility.

8.2 Analytics

Collect where available:

- Reach.
- Impressions.
- Engagement.
- Shares.
- Saves.
- Comments.
- Audience growth.
- Video views.
- Profile visits.
- Link clicks.
- Publishing frequency.
- Campaign performance.

Do not assume every platform exposes the same metrics.

8.3 Content analysis

Classify content into:

- Educational.
- Editorial.
- Product discovery.
- Comparison.
- Promotional.
- Conversion-focused.
- Brand storytelling.
- Customer education.

Analyse which content categories and formats perform best.

Separate distribution, engagement and commercial performance.

High engagement must not automatically be interpreted as high purchase intent.

---

9. SEO Intelligence

The SEO connector provides search visibility and website performance data to CGOS.

9.1 Integrations

- Google Search Console.
- Google Analytics 4.
- Google Merchant Center.
- PageSpeed Insights.
- Bing Webmaster Tools.
- Approved keyword research providers.
- Approved backlink research providers.

9.2 Capabilities

- Search query analysis.
- Click-through rate analysis.
- Search visibility.
- Keyword opportunity identification.
- Product-page optimisation.
- Category-page optimisation.
- Indexation monitoring.
- Technical SEO monitoring.
- Competitor keyword analysis.
- Content gap identification.
- Website speed analysis.
- Organic traffic attribution.

9.3 SEO recommendations

CGOS should identify:

- Products receiving impressions but insufficient clicks.
- Valuable search queries not adequately targeted.
- Product pages with weak search visibility.
- Missing buying guides.
- Category content gaps.
- Technical problems.
- Indexing problems.
- Opportunities for comparison pages and educational content.

It should recommend changes and prepare drafts.

High-impact website changes, including redirects, canonical settings and indexing controls, require approval.

---

10. Competitor Intelligence

Allow users to define competitors and relevant public market sources.

Analyse publicly accessible information:

- Product assortment.
- Public prices.
- Campaign messaging.
- Creative positioning.
- Publishing frequency.
- Product launches.
- Public promotions.
- Search visibility.
- Market trends.

Generate:

- Competitor comparisons.
- Content gap reports.
- Product opportunities.
- Positioning recommendations.
- Campaign ideas.
- Market observations.

Every observation must retain its source and observation date.

Do not access private competitor accounts or claim access to private analytics.

---

11. Growth Intelligence and Learning Engine

The learning engine is the central intelligence component.

It must build an increasingly useful understanding of the business over time.

11.1 Learning cycle

1. Collect information.
2. Normalise information.
3. Establish historical baselines.
4. Detect patterns.
5. Identify opportunities.
6. Generate recommendations.
7. Execute approved actions.
8. Measure outcomes.
9. Update business knowledge.
10. Improve future recommendations.

11.2 Analytical techniques

Use suitable methods including:

- Statistical analysis.
- Trend detection.
- Anomaly detection.
- Clustering.
- Semantic search.
- Embeddings.
- Classification.
- Forecasting.
- Controlled experiments.
- Bayesian updating where appropriate.

11.3 Persistent business memory

Maintain records of:

- Brand identity.
- Product knowledge.
- Historical campaigns.
- Creative performance.
- Audience segments.
- Marketing preferences.
- Successful patterns.
- Failed experiments.
- Recommendations.
- Confirmed business rules.
- Previous outcomes.

Distinguish confirmed facts, external observations, inferred insights and unverified assumptions.

11.4 Opportunity scoring

Each opportunity should contain:

- Commercial relevance.
- Estimated impact.
- Confidence.
- Urgency.
- Effort.
- Data quality.
- Supporting evidence.
- Recommended next action.

CGOS must explain why it recommends an opportunity.

---

12. WhatsApp Intelligence

WhatsApp is an important customer acquisition and sales channel for NURU.

Potential capabilities:

- Campaign-specific links.
- Enquiry attribution.
- Click tracking.
- Enquiry categorisation.
- Product interest analysis.
- Lead source analysis.
- Conversion reporting.

Standard WhatsApp Business Platform APIs do not expose every metric available in the WhatsApp Business mobile application.

In particular, Status viewer counts must not be assumed to be accessible through the official API.

Support manual or imported reporting where appropriate, clearly distinguishing imported observations from API-provided metrics.

---

13. ChatGPT and MCP Integration

CGOS must expose an authenticated MCP server.

It must allow ChatGPT to access authorised workspace intelligence and perform permitted actions.

13.1 Workspace tools

- Retrieve workspace overview.
- Retrieve business insights.
- Retrieve business performance.
- Retrieve pending approvals.
- Retrieve integration status.

13.2 Commerce tools

- List products.
- Retrieve product details.
- Analyse product performance.
- Identify marketing coverage gaps.
- Discover bundle opportunities.
- Retrieve inventory information.
- Analyse categories.

13.3 Creative tools

- Generate creative brief.
- Request image generation.
- Generate marketing copy.
- Retrieve creative assets.
- Create creative variations.
- Review validation results.
- Retrieve product-specific marketing materials.

13.4 Calendar tools

- Retrieve calendar.
- Generate calendar.
- Identify calendar gaps.
- Create calendar entries.
- Update draft campaigns.
- Retrieve approvals.
- Schedule approved content.
- Retrieve publishing history.

13.5 Intelligence tools

- Retrieve recommendations.
- Analyse social performance.
- Analyse SEO opportunities.
- Retrieve competitor observations.
- Retrieve campaign results.
- Compare historical campaigns.

13.6 Automation tools

- Retrieve automation status.
- Start authorised workflows.
- Pause workflows.
- Retrieve execution logs.
- Request approval.

MCP tools must enforce the same authentication, tenant isolation and permissions as the web application.

---

14. NURU Electronics Integration

NURU is the first implementation.

The current NURU commerce platform is custom-built and hosted on a VPS managed through Coolify.

CGOS must use a dedicated authenticated NURU integration adapter.

14.1 Integration principle

Use secure APIs exposed by the NURU application.

Do not depend on storefront scraping or direct production database access.

14.2 Initial data scope

- Products.
- Variants.
- Categories.
- Product images.
- Selling prices.
- Inventory.
- Orders.
- Sales.
- Product URLs.
- Relevant customer enquiries, where authorised.

14.3 Integration requirements

- Authenticated API access.
- Read-only permissions by default.
- Incremental synchronisation.
- Scheduled reconciliation.
- Webhook support where available.
- Retry handling.
- Data validation.
- Sync monitoring.
- Error reporting.

14.4 Restrictions

CGOS must not independently change:

- Product prices.
- Inventory.
- Orders.
- Customer records.
- Product availability.

Such operations require explicit permissions and approval.

---

15. Autonomous Execution Framework

CGOS should operate continuously within configured permissions.

15.1 Autonomous activities

Subject to workspace configuration:

- Data synchronisation.
- Performance analysis.
- Opportunity discovery.
- Recommendation generation.
- Creative brief generation.
- Draft content generation.
- Calendar proposals.
- Campaign monitoring.
- Reporting.
- Asset reuse recommendations.

15.2 Approval-controlled activities

- Publishing without a pre-authorised publishing policy.
- Price changes.
- Inventory changes.
- Promotional pricing.
- Paid advertising expenditure.
- Deleting content.
- Website redirects.
- High-impact SEO modifications.
- Sensitive account changes.

15.3 Controls

- Global pause.
- Workspace permissions.
- Platform permissions.
- Campaign approval.
- Spend limits.
- Generation usage limits.
- Audit logs.
- Idempotency.
- Retry handling.
- Failure notifications.
- Human override.

Every automated action must be traceable.

---

16. Standalone Web Application

The web application is a first-class product requirement.

16.1 Navigation

1. Overview.
2. Commerce.
3. Catalogue Intelligence.
4. Bundles.
5. Creative Studio.
6. Marketing Calendar.
7. Campaigns.
8. Social Intelligence.
9. SEO.
10. Competitors.
11. Growth Intelligence.
12. Automations.
13. Integrations.
14. Media Library.
15. Settings.

16.2 UX principles

- Professional business operating system.
- Clear, actionable recommendations.
- Visual campaign previews.
- Easy creative approval.
- Clear product coverage.
- Calendar visibility.
- Useful analytics.
- Minimal operational friction.

The interface must not simply reproduce a generic chat interface.

---

17. Technical Architecture

17.1 Architecture approach

Begin with a modular monolith and asynchronous workers.

Do not introduce microservices prematurely.

Use well-defined service boundaries so individual components can be separated later if required.

17.2 Proposed technology stack

Layer| Technology
Frontend| Next.js / TypeScript
Backend| NestJS / TypeScript
Database| PostgreSQL
Semantic search| pgvector
Background jobs| Redis + BullMQ
MCP| Official TypeScript MCP SDK
File storage| S3-compatible object storage
Browser automation| Playwright, where permitted
Deployment| Docker
Infrastructure| Coolify-compatible
Observability| OpenTelemetry
Error monitoring| Sentry or equivalent

These are initial architectural recommendations, subject to technical validation.

17.3 Core services

- Authentication and tenancy.
- Integration management.
- Commerce ingestion.
- Social ingestion.
- SEO ingestion.
- Competitor research.
- Data normalisation.
- Intelligence engine.
- Recommendation engine.
- Creative generation orchestration.
- Asset management.
- Calendar management.
- Publishing orchestration.
- Automation engine.
- MCP server.
- Analytics and reporting.

17.4 Background workers

Workers should process:

- Data synchronisation.
- Webhooks.
- Analytics collection.
- Catalogue analysis.
- Bundle discovery.
- Creative generation.
- Image validation.
- Calendar generation.
- Publishing.
- Performance measurement.
- Report generation.

Long-running operations must be asynchronous, observable and recoverable.

---

18. Data Model

Initial logical entities:

Identity and tenancy

- users
- organizations
- workspaces
- workspace_members
- roles
- permissions
- audit_logs

Integrations

- integrations
- connected_accounts
- integration_credentials
- sync_jobs
- webhook_events

Commerce

- products
- product_variants
- categories
- inventory_snapshots
- price_snapshots
- orders
- order_items
- customers, where authorised

Social and marketing

- social_accounts
- social_posts
- post_metrics
- campaigns
- campaign_products
- calendar_entries
- publishing_jobs
- content_experiments

Creative

- brand_profiles
- brand_assets
- creative_briefs
- creative_assets
- creative_versions
- generation_jobs
- creative_approvals

Intelligence

- recommendations
- opportunities
- bundle_candidates
- product_coverage
- insight_snapshots
- competitor_observations
- learning_records
- business_memory

Automation

- automation_rules
- automation_runs
- approval_requests
- execution_logs

All workspace-owned records must have tenant ownership enforced at database and service levels.

Use row-level security where appropriate.

Retain source references and timestamps for imported data.

---

19. Security and Reliability

Requirements:

- Secure authentication.
- OAuth where supported.
- Encrypted integration credentials.
- Tenant isolation.
- Role-based access control.
- Audit logging.
- Secure media access.
- API rate limiting.
- Webhook verification.
- SSRF protection.
- Prompt-injection protection.
- Input validation.
- No arbitrary SQL execution through AI tools.
- Backup and recovery.
- Data retention controls.

External webpages, competitor content, product descriptions and uploaded documents must be treated as untrusted data.

---

20. Implementation Roadmap

Phase 1: Foundation

- Multi-tenant architecture.
- Authentication.
- Workspace management.
- Database foundation.
- Integration framework.
- NURU read-only adapter.
- Commerce synchronisation.
- Overview dashboard.

Deliverable: CGOS understands the business and its product catalogue.

Phase 2: Catalogue and Growth Intelligence

- Product performance analysis.
- Catalogue coverage engine.
- Bundle discovery.
- Opportunity scoring.
- Historical data storage.
- Initial recommendation engine.

Deliverable: CGOS identifies what should be marketed and why.

Phase 3: Creative Intelligence Studio

- Brand memory.
- Creative briefs.
- Image-generation integration.
- Product-aware workflows.
- Copy generation.
- Creative validation.
- Media library.
- Asset versioning.
- Approval workflow.
- Generation cost and usage monitoring.
- Reusable asset economics.

Deliverable: CGOS can generate and manage reusable marketing assets.

Phase 4: Marketing Calendar and Distribution

- Calendar interface.
- AI calendar generation.
- Product coverage scheduling.
- Campaign management.
- Publishing integrations.
- Approval workflows.
- Performance collection.

Deliverable: CGOS manages marketing from planning through measurement.

Phase 5: Social, SEO and Competitor Intelligence

- Social integrations.
- Search integrations.
- Competitor monitoring.
- Cross-channel analytics.
- Campaign attribution.

Deliverable: CGOS understands broader market and customer acquisition performance.

Phase 6: Autonomous Growth

- Background intelligence.
- Automated recommendations.
- Configurable execution.
- Calendar optimisation.
- Experiment management.
- Continuous learning.

Deliverable: CGOS becomes a proactive growth operating system.

Phase 7: SaaS Commercialisation

- Subscription management.
- Usage limits.
- Billing.
- Customer onboarding.
- Multi-customer integrations.
- Administration.
- Support.
- Usage analytics.

Deliverable: CGOS is ready for external businesses.

---

21. Acceptance Criteria

The initial NURU pilot must demonstrate:

1. Reliable synchronisation of the NURU catalogue.
2. A marketing coverage record for every active product.
3. Identification of products requiring marketing attention.
4. Discovery and explanation of bundle opportunities.
5. Creative briefs generated from actual product information.
6. Original image generation or an integrated image-generation workflow.
7. Persistent storage of generated assets.
8. Reuse and adaptation of approved assets.
9. Product and price validation.
10. Calendar generation based on catalogue and performance insights.
11. Editable calendar entries.
12. Approval management.
13. Publishing through supported integrations.
14. Performance records linked to published campaigns.
15. Performance-informed future recommendations.
16. Authorised ChatGPT access through MCP.
17. Shared data and permissions between the web app and MCP.
18. Tenant isolation.
19. Auditable automated actions.
20. Configurable generation and operational usage limits.

---

22. Technical Validation Items

These must be investigated before finalising implementation decisions.

A. ChatGPT subscription integration

Determine whether eligible ChatGPT subscription authentication and usage-sharing mechanisms can support external CGOS creative workflows.

Verify:

- Eligibility.
- Authentication.
- Supported image-generation capabilities.
- Usage limits.
- Terms.
- Commercial restrictions.
- Cost implications.

Do not assume ChatGPT subscription usage is equivalent to API access.

B. Social publishing

Verify the publishing capabilities and approval requirements of every target platform.

C. NURU API

Inspect the current NURU application and establish:

- Existing API endpoints.
- Authentication.
- Data model.
- Webhook availability.
- Synchronisation capabilities.

D. Infrastructure

Assess existing VPS capacity, storage, backups and network configuration before provisioning additional resources.

E. Creative storage

Select a durable object storage solution with backup, access control and asset versioning.

F. Attribution

Establish how website sessions, WhatsApp enquiries and completed orders can be connected to marketing campaigns without inventing attribution.

---

23. Non-Goals

CGOS is not intended to:

- Replace the commerce application.
- Become a general-purpose ERP.
- Replace accounting software.
- Become a marketplace.
- Depend on Shopify.
- Depend on Vercel.
- Fabricate unavailable analytics.
- Use unsupported social platform APIs.
- Automatically change prices or inventory.
- Publish unreviewed high-risk claims.
- Optimise solely for engagement.
- Generate disposable creatives without retaining reusable assets.

---

24. Final Product Definition

Commerce Growth OS is an intelligent business growth platform that connects commerce, marketing, search and customer acquisition data to continuously identify opportunities and execute approved growth activities.

Its defining operating cycle is:

Business Data → Intelligence → Opportunity → Creative Generation → Asset Library → Marketing Calendar → Publishing → Measurement → Learning.

For NURU, the initial objective is to build a marketing operation where every eligible product receives appropriate attention, complementary products are intelligently bundled, marketing creatives are generated and retained, and campaigns are managed through one calendar.

Over time, the platform should become more useful because it accumulates business knowledge, reusable creative assets and evidence about what actually generates commercial results.

CGOS should not merely help a business create more marketing content. It should help the business make better marketing decisions and turn those decisions into measurable growth.
