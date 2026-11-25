import { prisma } from "@/lib/prisma";

export interface ScoredProductSummary {
  productId: string;
  handle: string;
  title: string;
  brand: string | null;
  category: string | null;
  sellingPrice: number;
  costPrice: number | null;
  stockQuantity: number;
  grossMarginPercent: number;
  opportunityScore: number;
  bundlePotential: number;
  lifecycleCategory: "hero_product" | "high_margin" | "volume_driver" | "stale_inventory" | "replenish_soon";
  marketingStatus: string;
  recommendedAction: string;
}

export function calculateOpportunityScore(product: {
  sellingPrice: number;
  costPrice: number | null;
  stockQuantity: number;
  tags?: string[];
  category?: string | null;
}): {
  opportunityScore: number;
  grossMarginPercent: number;
  lifecycleCategory: ScoredProductSummary["lifecycleCategory"];
  bundlePotential: number;
  recommendedAction: string;
} {
  const selling = Number(product.sellingPrice);
  const cost = product.costPrice ? Number(product.costPrice) : selling * 0.8;
  const grossMarginPercent = selling > 0 ? Math.round(((selling - cost) / selling) * 1000) / 10 : 20.0;

  // 1. Margin Score (0 to 40)
  const marginScore = Math.min((grossMarginPercent / 30) * 40, 40);

  // 2. Stock Health Score (0 to 35)
  // Optimal stock is between 8 and 30 units
  let stockScore = 0;
  if (product.stockQuantity >= 10) {
    stockScore = 35;
  } else if (product.stockQuantity >= 5) {
    stockScore = 25;
  } else if (product.stockQuantity >= 1) {
    stockScore = 15;
  } else {
    stockScore = 0;
  }

  // 3. Strategic Demand & Category Factor (0 to 25)
  let demandScore = 20;
  const isFlagship = product.tags?.some((t) => ["Flagship", "Apple", "Samsung"].includes(t));
  if (isFlagship) {
    demandScore = 25;
  } else if (product.category === "Accessories") {
    demandScore = 22;
  }

  const rawScore = marginScore + stockScore + demandScore;
  const opportunityScore = Math.min(Math.round(rawScore * 10) / 10, 99.0);

  // Lifecycle Classification
  let lifecycleCategory: ScoredProductSummary["lifecycleCategory"] = "volume_driver";
  let recommendedAction = "Promote via regular catalogue highlights";
  let bundlePotential = 70.0;

  if (product.stockQuantity <= 3) {
    lifecycleCategory = "replenish_soon";
    recommendedAction = "Low inventory warning: prioritize backorder or re-order before paid ad spend";
    bundlePotential = 40.0;
  } else if (opportunityScore >= 88 && product.stockQuantity >= 6) {
    lifecycleCategory = "hero_product";
    recommendedAction = "Feature in storefront hero banners & launch targeted Instagram / TikTok campaign";
    bundlePotential = 92.0;
  } else if (grossMarginPercent >= 22) {
    lifecycleCategory = "high_margin";
    recommendedAction = "Pair with accessories in bundled cross-sells to maximize basket profit";
    bundlePotential = 88.0;
  } else if (product.stockQuantity >= 20) {
    lifecycleCategory = "volume_driver";
    recommendedAction = "High stock volume: run fast WhatsApp promotional broadcast with financing options";
    bundlePotential = 82.0;
  }

  return {
    opportunityScore,
    grossMarginPercent,
    lifecycleCategory,
    bundlePotential,
    recommendedAction,
  };
}

/**
 * Runs catalogue-wide opportunity scoring and persists recommendations in Prisma
 */
export async function runOpportunityScoring(tenantSlug = "nuru-electronics") {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    throw new Error(`Tenant "${tenantSlug}" not found`);
  }

  const products = await prisma.product.findMany({
    where: { tenantId: tenant.id },
  });

  const scoredSummaries: ScoredProductSummary[] = [];

  for (const product of products) {
    const analysis = calculateOpportunityScore({
      sellingPrice: Number(product.sellingPrice),
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      stockQuantity: product.stockQuantity,
      tags: product.tags,
      category: product.category,
    });

    // Update ProductAnalysis
    const existingAnalysis = await prisma.productAnalysis.findFirst({
      where: { productId: product.id },
    });

    if (existingAnalysis) {
      await prisma.productAnalysis.update({
        where: { id: existingAnalysis.id },
        data: {
          opportunityScore: analysis.opportunityScore,
          bundlePotential: analysis.bundlePotential,
          lifecycleCategory: analysis.lifecycleCategory,
          marketingStatus: "scored",
        },
      });
    } else {
      await prisma.productAnalysis.create({
        data: {
          productId: product.id,
          opportunityScore: analysis.opportunityScore,
          bundlePotential: analysis.bundlePotential,
          lifecycleCategory: analysis.lifecycleCategory,
          marketingStatus: "scored",
        },
      });
    }

    scoredSummaries.push({
      productId: product.id,
      handle: product.handle,
      title: product.title,
      brand: product.brand,
      category: product.category,
      sellingPrice: Number(product.sellingPrice),
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      stockQuantity: product.stockQuantity,
      grossMarginPercent: analysis.grossMarginPercent,
      opportunityScore: analysis.opportunityScore,
      bundlePotential: analysis.bundlePotential,
      lifecycleCategory: analysis.lifecycleCategory,
      marketingStatus: "ready_for_action",
      recommendedAction: analysis.recommendedAction,
    });
  }

  // Create GrowthRecommendation records for top opportunities
  const topHeroes = scoredSummaries
    .filter((s) => s.opportunityScore >= 85)
    .slice(0, 3);

  for (const hero of topHeroes) {
    const recTitle = `Promote ${hero.title} (${hero.lifecycleCategory.replace("_", " ").toUpperCase()})`;
    const existingRec = await prisma.growthRecommendation.findFirst({
      where: {
        tenantId: tenant.id,
        title: recTitle,
      },
    });

    const recData = {
      tenantId: tenant.id,
      type: "campaign",
      title: recTitle,
      description: `Opportunity Score ${hero.opportunityScore} | Margin ${hero.grossMarginPercent}% | Stock ${hero.stockQuantity} units. ${hero.recommendedAction}.`,
      priority: hero.opportunityScore,
      confidence: 90.0,
    };

    if (existingRec) {
      await prisma.growthRecommendation.update({
        where: { id: existingRec.id },
        data: recData,
      });
    } else {
      await prisma.growthRecommendation.create({
        data: recData,
      });
    }
  }

  return scoredSummaries.sort((a, b) => b.opportunityScore - a.opportunityScore);
}
