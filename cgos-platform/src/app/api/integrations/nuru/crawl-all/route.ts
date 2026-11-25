import { NextResponse } from "next/server";
import { crawlAndSyncFullNuruSitemap } from "@/lib/integrations/nuru/sitemapCrawler";
import { runOpportunityScoring } from "@/lib/intelligence/scoring";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const syncResult = await crawlAndSyncFullNuruSitemap();
    // Re-run opportunity scoring across the complete catalogue
    await runOpportunityScoring("nuru-electronics");

    return NextResponse.json({
      status: "ok",
      message: `Successfully crawled and ingested ${syncResult.totalIndexed} live NURU products`,
      syncResult,
    });
  } catch (error) {
    console.error("Full sitemap crawl error:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Crawl failed" },
      { status: 500 }
    );
  }
}
