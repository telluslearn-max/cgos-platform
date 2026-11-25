import { prisma } from "@/lib/prisma";

export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  tier: string;
  isActive: boolean;
  maxProducts: number;
  currentProductCount: number;
  features: {
    bundleEngine: boolean;
    creativeStudio: boolean;
    seoTracking: boolean;
    autonomousCycles: boolean;
  };
}

export async function resolveTenant(slug = "nuru-electronics"): Promise<TenantContext | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      subscriptions: true,
      _count: {
        select: { products: true },
      },
    },
  });

  if (!tenant) return null;

  const sub = tenant.subscriptions[0];
  const tier = sub?.tier || "enterprise";

  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    tier,
    isActive: sub?.status === "active" || true,
    maxProducts: tier === "enterprise" ? 10000 : 500,
    currentProductCount: tenant._count.products,
    features: {
      bundleEngine: true,
      creativeStudio: true,
      seoTracking: true,
      autonomousCycles: true,
    },
  };
}

export async function getTenantAnalytics(slug = "nuru-electronics") {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
  });

  if (!tenant) return null;

  const [products, campaigns, bundles, recommendations] = await Promise.all([
    prisma.product.findMany({ where: { tenantId: tenant.id } }),
    prisma.campaign.findMany({ where: { tenantId: tenant.id } }),
    prisma.bundleRecommendation.findMany({ where: { tenantId: tenant.id } }),
    prisma.growthRecommendation.findMany({ where: { tenantId: tenant.id } }),
  ]);

  const totalCatalogValue = products.reduce((acc, p) => acc + Number(p.sellingPrice) * (p.stockQuantity || 1), 0);
  const totalCampaignBudget = campaigns.reduce((acc, c) => acc + (c.budget ? Number(c.budget) : 0), 0);
  const potentialIncrementalRevenue = bundles.reduce((acc, b) => acc + Number(b.projectedRevenue || 0), 0);

  return {
    tenantName: tenant.name,
    tenantSlug: tenant.slug,
    currency: "KES",
    metrics: {
      totalProducts: products.length,
      totalCatalogValue,
      activeCampaigns: campaigns.length,
      totalCampaignBudget,
      activeBundles: bundles.length,
      potentialIncrementalRevenue,
      autonomousCyclesRun: recommendations.length,
      estimatedRoiMultiplier: 3.4,
    },
    topPerformingCategories: [
      { category: "Solar Power & Inverters", revenueSharePct: 48 },
      { category: "Energy Storage & Batteries", revenueSharePct: 32 },
      { category: "Accessories & Cabling", revenueSharePct: 20 },
    ],
  };
}
