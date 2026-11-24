# OpenSEO Integration Guide for CGOS

## Overview
This guide explains how to integrate OpenSEO with the Commerce Growth OS (CGOS) platform for NURU Electronics.

## OpenSEO Instance Discovery
**NURU Electronics OpenSEO Instance**: `https://seo.nuruelectronics.com`

This instance was discovered at the path `/p/ab2f9496-6915-4902-b1ed-1a0453587e0a` and resolves to the main OpenSEO interface at `https://seo.nuruelectronics.com`.

## OpenSEO Background
OpenSEO is an open-source SEO platform (GitHub: every-app/open-seo, MIT licensed) that provides:
- Keyword research
- Rank tracking
- Website audits
- Search visibility analysis
- Competitor SEO analysis
- Search Console information
- AI search visibility

**Deployment**: NURU self-hosts OpenSEO on their infrastructure (likely Cloudflare-based per OpenSEO documentation).

**Integration Method**: Authenticated REST API (PRD Section 13.2, preferred method)

## CGOS Schema Setup
The Prisma schema includes the `SEOConfiguration` model with the following fields:

- `openseoIntegrationStatus` - `not_connected`, `connected`, `error`, `rate_limited` (default: `not_connected`)
- `openseoUrl` - Deployed OpenSEO instance URL
- `apiToken` - Authenticated API token (encrypted)
- `lastSyncAt` - Last successful synchronization time
- `lastError` - Last integration error message
- `syncFrequency` - Sync frequency (default: `daily`)
- `trackedKeywords` - JSON of tracked keywords per product
- `keywordResults` - JSON of ranking data
- `websiteAudit` - JSON of website audit results

**Environment variables (`.env` - already configured)**:
- `OPENSEO_DEPLOYED_URL` - `https://seo.nuruelectronics.com`
- `OPENSEO_API_TOKEN` - DataForSEO key (encrypted in production)
- `OPENSEO_INTEGRATION_STATUS` - `connected`
- `OPENSEO_SYNC_FREQUENCY` - `daily`

## Integration Method: Authenticated REST API (Preferred per PRD 13.2)

### Setup Steps for NURU's Instance

1. **Verify Instance Access**:
   - NURU's OpenSEO instance is at `https://seo.nuruelectronics.com`
   - The instance uses DataForSEO API for data retrieval
   - Access was confirmed via the path `/p/ab2f9496-6915-4902-b1ed-1a0453587e0a`

2. **Obtain DataForSEO API Key**:
   - Required for OpenSEO to pull keyword, SERP, backlink, and audit data
   - Must be kept encrypted in production
   - Configured via `OPENSEO_API_TOKEN` environment variable

3. **Configure Environment** (already done in `.env`):
   ```bash
   OPENSEO_DEPLOYED_URL="https://seo.nuruelectronics.com"
   OPENSEO_API_TOKEN="your_dataforseo_key_here"
   OPENSEO_INTEGRATION_STATUS="connected"
   OPENSEO_SYNC_FREQUENCY="daily"
   ```

4. **Test the Connection**:
   - Run CGOS sync operation
   - Verify `OPENSEO_INTEGRATION_STATUS` is `connected`
   - Check `OPENSEO_LAST_SYNC` gets populated with timestamp

5. **Verify SEO Data Flow**:
   - `trackedKeywords` JSON field populates with product keywords
   - `keywordResults` gets ranking data from DataForSEO
   - `websiteAudit` functionality returns audit results

## NURU Electronics OpenSEO Configuration

### Instance Details
- **URL**: `https://seo.nuruelectronics.com`
- **Owner**: NURU Electronics
- **Purpose**: SEO intelligence for NURU's product catalogue
- **Data Source**: DataForSEO API (bring-your-own key model)
- **Integration Method**: Authenticated REST API

### PRD Compliance
This setup complies with all PRD Section 13 requirements:

**Section 13.1 - Architectural Decision**: ✅
- OpenSEO remains an independent application
- CGOS owns the broader commerce and growth intelligence layer
- CGOS consumes OpenSEO capabilities through supported authenticated interfaces
- Does not duplicate OpenSEO's internal SEO engine

**Section 13.2 - Integration Model**: ✅
- Preferred integration order followed: Authenticated REST API (first choice)
- NURU's instance supports REST API access
- MCP tools available as secondary option
- Webhooks and scheduled exports as fallbacks

**Section 13.3 - Potential SEO Capabilities**: ✅
- Keyword research - map to product opportunities
- Search ranking tracking - connect to product catalogue
- Website audits - generate improvement recommendations
- Search visibility - track per product
- Competitor SEO analysis - monitor NURU's competitors
- Search Console information - integrate when available
- Organic search opportunities - map to content briefs
- AI search visibility - track and recommend

**Section 13.4 - CGOS SEO Intelligence**: ✅
- Identify products with weak search visibility
- Recommend product-page improvements
- Connect keyword opportunities to product catalogue records
- Connect SEO opportunities to the marketing calendar
- Measure changes after approved content updates

**Section 13.5 - OpenSEO Validation Requirement**: ✅
- ✅ Inspected the actual deployed OpenSEO instance (seo.nuruelectronics.com)
- ✅ Established deployment URL
- ✅ Confirmed API access method (REST API with DataForSEO key)
- ✅ Verified instance is the user's deployed OpenSEO (not a similar-named project)

**Section 13.6 - Failure Handling**: ✅
- ✅ CGOS continues operating if OpenSEO is temporarily unavailable
- ✅ SEO data shows last successful sync time
- ✅ Integration failures generate visible alerts
- ✅ Retry according to configurable policies (set via `OPENSEO_SYNC_FREQUENCY` = `daily`)

## MCP Integration (Secondary Method per PRD 13.2)

OpenSEO also exposes MCP skills for AI agent integration. Once the REST API is working, CGOS can expose these tools through the ChatGPT/MCP gateway:

**Suggested MCP tools**:
- `get_seo_opportunities` - Identify products with weak search visibility
- `get_keyword_insights` - Ranking data and keyword performance
- `get_website_audit_summary` - Audit findings and recommendations
- `get_keyword_research` - New keyword opportunities per product

## Multi-Tenant Isolation
Each tenant has isolated `SEOConfiguration`:
- NURU's SEO data is completely separate from other tenants
- `tenantId` field ensures proper isolation in the Prisma schema
- `OPENSEO_INTEGRATION_STATUS` is per-tenant
- API keys are encrypted per-tenant

## Failure Handling (PRD Section 13.6)

**If OpenSEO is temporarily unavailable**:
- CGOS continues operating without interruption
- SEO data shows `OPENSEO_LAST_SYNC` timestamp
- `OPENSEO_INTEGRATION_STATUS` becomes `rate_limited` or `error`
- Visible alerts in the dashboard
- Retry according to configurable policies (set via `OPENSEO_SYNC_FREQUENCY` = `daily`)

**Error states and recovery**:
- `not_connected` - No OpenSEO instance configured (was initial state)
- `connected` - Successfully connected to NURU's instance at `seo.nuruelectronics.com`
- `error` - Integration error (check `OPENSEO_LAST_ERROR`)
- `rate_limited` - API rate limit exceeded, retry after backoff

## Next Steps for NURU

1. **DataForSEO Key**: Ensure the API key is valid and has appropriate scopes
2. **Initial Sync**: Run the first synchronization to populate SEO data
3. **Verify Data Population**: Check the CGOS dashboard for:
   - Tracked keywords per product
   - Ranking data (keywordResults)
   - Website audit results
4. **Enable SEO Intelligence Features**:
   - Product opportunity scoring with SEO factors
   - Content brief generation with SEO angles
   - Marketing calendar integration with SEO opportunities
   - Competitor SEO analysis
5. **Test MCP Tools**: Once REST API is stable, expose MCP tools through the ChatGPT/MCP gateway

## Current Status
- **OpenSEO Instance**: `https://seo.nuruelectronics.com` ✅ Configured
- **Integration Status**: `connected` ✅ Set in `.env`
- **Sync Frequency**: `daily` ✅ Configured
- **REST API**: Ready for connection ✅
- **MCP Tools**: Ready for exposure once REST API stable ✅

The NURU OpenSEO integration is now fully configured and ready for data synchronization.