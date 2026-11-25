import { prisma } from "@/lib/prisma";

export interface ChannelAllocation {
  channel: "WhatsApp Broadcast" | "Instagram Reels & Stories" | "Google Search (OpenSEO)" | "TikTok Tech Review";
  sharePct: number;
  allocatedBudgetKes: number;
  projectedImpressions: number;
  projectedClicks: number;
  costPerClickKes: number;
  targetAovKes: number;
  conversionRatePct: number;
  projectedOrders: number;
  projectedRevenueKes: number;
  grossMarginPct: number;
  grossProfitKes: number;
  netRoasMultiplier: number;
}

export interface DetailedCampaignEconomics {
  campaignId: string;
  name: string;
  objective: string;
  targetAudience: string;
  totalBudgetKes: number;
  startDate: string;
  endDate: string;
  featuredProducts: Array<{
    title: string;
    sellingPriceKes: number;
    costPriceKes: number;
    stock: number;
    marginPct: number;
  }>;
  channels: ChannelAllocation[];
  totals: {
    totalProjectedRevenueKes: number;
    totalGrossProfitKes: number;
    blendedRoas: number;
    netProfitAfterAdSpendKes: number;
    breakEvenOrdersNeeded: number;
    expectedOrders: number;
  };
}

export async function getCampaignsWithDetailedEconomics(tenantSlug = "nuru-electronics"): Promise<DetailedCampaignEconomics[]> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) return [];

  const rawCampaigns = await prisma.campaign.findMany({
    where: { tenantId: tenant.id },
    orderBy: { startDate: "desc" },
  });

  const allProductIds = Array.from(new Set(rawCampaigns.flatMap((c) => c.productIds)));
  const products = await prisma.product.findMany({
    where: { id: { in: allProductIds } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  return rawCampaigns.map((camp) => {
    const budget = Number(camp.budget) || 45000;
    const campProducts = camp.productIds
      .map((id) => productMap.get(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .map((p) => {
        const selling = Number(p.sellingPrice);
        const cost = p.costPrice ? Number(p.costPrice) : selling * 0.78;
        const marginPct = selling > 0 ? ((selling - cost) / selling) * 100 : 22;
        return {
          title: `${p.brand ? p.brand + " " : ""}${p.title}`,
          sellingPriceKes: selling,
          costPriceKes: cost,
          stock: p.stockQuantity,
          marginPct: Math.round(marginPct * 10) / 10,
        };
      });

    const avgBasketKes = campProducts.length > 0
      ? campProducts.reduce((acc, p) => acc + p.sellingPriceKes, 0) / campProducts.length
      : 35000;

    const avgMarginPct = campProducts.length > 0
      ? campProducts.reduce((acc, p) => acc + p.marginPct, 0) / campProducts.length
      : 22.5;

    // Mathematical breakdown of multi-channel allocation
    // 1. WhatsApp: High conversion (warm/repeat buyers), low CPC
    // 2. Instagram: High engagement & branding for flagship devices
    // 3. Google/OpenSEO: High purchase intent commercial capture
    // 4. TikTok: Viral discovery for accessories & mobile audio
    const channels: ChannelAllocation[] = [
      {
        channel: "WhatsApp Broadcast",
        sharePct: 35,
        allocatedBudgetKes: Math.round(budget * 0.35),
        costPerClickKes: 12,
        projectedImpressions: Math.round(budget * 0.35 * 45),
        projectedClicks: Math.round((budget * 0.35) / 12),
        conversionRatePct: 4.8,
        targetAovKes: avgBasketKes,
        projectedOrders: Math.round(((budget * 0.35) / 12) * 0.048),
        projectedRevenueKes: Math.round(((budget * 0.35) / 12) * 0.048 * avgBasketKes),
        grossMarginPct: avgMarginPct,
        grossProfitKes: Math.round(((budget * 0.35) / 12) * 0.048 * avgBasketKes * (avgMarginPct / 100)),
        netRoasMultiplier: Number(((((budget * 0.35) / 12) * 0.048 * avgBasketKes) / (budget * 0.35)).toFixed(2)),
      },
      {
        channel: "Instagram Reels & Stories",
        sharePct: 30,
        allocatedBudgetKes: Math.round(budget * 0.30),
        costPerClickKes: 28,
        projectedImpressions: Math.round(budget * 0.30 * 22),
        projectedClicks: Math.round((budget * 0.30) / 28),
        conversionRatePct: 2.4,
        targetAovKes: avgBasketKes,
        projectedOrders: Math.round(((budget * 0.30) / 28) * 0.024),
        projectedRevenueKes: Math.round(((budget * 0.30) / 28) * 0.024 * avgBasketKes),
        grossMarginPct: avgMarginPct,
        grossProfitKes: Math.round(((budget * 0.30) / 28) * 0.024 * avgBasketKes * (avgMarginPct / 100)),
        netRoasMultiplier: Number(((((budget * 0.30) / 28) * 0.024 * avgBasketKes) / (budget * 0.30)).toFixed(2)),
      },
      {
        channel: "Google Search (OpenSEO)",
        sharePct: 20,
        allocatedBudgetKes: Math.round(budget * 0.20),
        costPerClickKes: 38,
        projectedImpressions: Math.round(budget * 0.20 * 16),
        projectedClicks: Math.round((budget * 0.20) / 38),
        conversionRatePct: 3.8,
        targetAovKes: avgBasketKes,
        projectedOrders: Math.round(((budget * 0.20) / 38) * 0.038),
        projectedRevenueKes: Math.round(((budget * 0.20) / 38) * 0.038 * avgBasketKes),
        grossMarginPct: avgMarginPct,
        grossProfitKes: Math.round(((budget * 0.20) / 38) * 0.038 * avgBasketKes * (avgMarginPct / 100)),
        netRoasMultiplier: Number(((((budget * 0.20) / 38) * 0.038 * avgBasketKes) / (budget * 0.20)).toFixed(2)),
      },
      {
        channel: "TikTok Tech Review",
        sharePct: 15,
        allocatedBudgetKes: Math.round(budget * 0.15),
        costPerClickKes: 18,
        projectedImpressions: Math.round(budget * 0.15 * 34),
        projectedClicks: Math.round((budget * 0.15) / 18),
        conversionRatePct: 1.8,
        targetAovKes: avgBasketKes,
        projectedOrders: Math.round(((budget * 0.15) / 18) * 0.018),
        projectedRevenueKes: Math.round(((budget * 0.15) / 18) * 0.018 * avgBasketKes),
        grossMarginPct: avgMarginPct,
        grossProfitKes: Math.round(((budget * 0.15) / 18) * 0.018 * avgBasketKes * (avgMarginPct / 100)),
        netRoasMultiplier: Number(((((budget * 0.15) / 18) * 0.018 * avgBasketKes) / (budget * 0.15)).toFixed(2)),
      },
    ];

    const totalProjectedRevenue = channels.reduce((acc, ch) => acc + ch.projectedRevenueKes, 0);
    const totalGrossProfit = channels.reduce((acc, ch) => acc + ch.grossProfitKes, 0);
    const expectedOrders = channels.reduce((acc, ch) => acc + ch.projectedOrders, 0);
    const netProfitAfterAdSpend = totalGrossProfit - budget;
    const breakEvenOrdersNeeded = Math.ceil(budget / (avgBasketKes * (avgMarginPct / 100)));
    const blendedRoas = budget > 0 ? Number((totalProjectedRevenue / budget).toFixed(2)) : 0;

    return {
      campaignId: camp.id,
      name: camp.name,
      objective: camp.objective,
      targetAudience: camp.targetAudience || "High-intent consumer electronics shoppers in Kenya",
      totalBudgetKes: budget,
      startDate: camp.startDate.toISOString(),
      endDate: camp.endDate ? camp.endDate.toISOString() : "",
      featuredProducts: campProducts,
      channels,
      totals: {
        totalProjectedRevenueKes: totalProjectedRevenue,
        totalGrossProfitKes: totalGrossProfit,
        blendedRoas,
        netProfitAfterAdSpendKes: netProfitAfterAdSpend,
        breakEvenOrdersNeeded,
        expectedOrders,
      },
    };
  });
}
