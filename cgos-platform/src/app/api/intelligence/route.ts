import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runOpportunityScoring } from "@/lib/intelligence/scoring";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) {
      return NextResponse.json({
        status: "ok",
        items: [],
        recommendations: [],
        metrics: { totalScored: 0, avgScore: 0, heroCount: 0, staleCount: 0 },
      });
    }

    const [products, analyses, recommendations] = await Promise.all([
      prisma.product.findMany({
        where: { tenantId: tenant.id },
        select: {
          id: true,
          handle: true,
          title: true,
          brand: true,
          category: true,
          sellingPrice: true,
          costPrice: true,
          stockQuantity: true,
        },
      }),
      prisma.productAnalysis.findMany(),
      prisma.growthRecommendation.findMany({
        where: { tenantId: tenant.id },
        orderBy: { priority: "desc" },
      }),
    ]);

    const analysisMap = new Map(analyses.map((a) => [a.productId, a]));

    const scoredProducts = products.map((p) => {
      const analysis = analysisMap.get(p.id);
      const selling = Number(p.sellingPrice);
      const cost = p.costPrice ? Number(p.costPrice) : selling * 0.8;
      const margin = selling > 0 ? Math.round(((selling - cost) / selling) * 1000) / 10 : 20;

      return {
        ...p,
        sellingPrice: selling,
        costPrice: p.costPrice ? Number(p.costPrice) : null,
        grossMarginPercent: margin,
        opportunityScore: analysis ? Number(analysis.opportunityScore) : 0,
        bundlePotential: analysis ? Number(analysis.bundlePotential) : 70,
        lifecycleCategory: analysis?.lifecycleCategory || "volume_driver",
        marketingStatus: analysis?.marketingStatus || "pending_analysis",
      };
    });

    scoredProducts.sort((a, b) => b.opportunityScore - a.opportunityScore);

    const totalScored = scoredProducts.length;
    const avgScore =
      totalScored > 0
        ? Math.round(
            (scoredProducts.reduce((acc, p) => acc + p.opportunityScore, 0) / totalScored) * 10
          ) / 10
        : 0;
    const heroCount = scoredProducts.filter((p) => p.lifecycleCategory === "hero_product").length;
    const staleCount = scoredProducts.filter((p) => p.lifecycleCategory === "stale_inventory" || p.lifecycleCategory === "replenish_soon").length;

    return NextResponse.json({
      status: "ok",
      metrics: {
        totalScored,
        avgScore,
        heroCount,
        staleCount,
      },
      products: scoredProducts,
      recommendations: recommendations.map((r) => ({
        ...r,
        priority: Number(r.priority),
        confidence: Number(r.confidence),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch intelligence data:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to load intelligence data",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const scored = await runOpportunityScoring();
    return NextResponse.json({
      status: "ok",
      message: `Successfully evaluated and scored ${scored.length} products`,
      scoredCount: scored.length,
      topHero: scored[0]?.title || null,
    });
  } catch (error) {
    console.error("Failed to run opportunity scoring pipeline:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Scoring failed",
      },
      { status: 500 }
    );
  }
}
