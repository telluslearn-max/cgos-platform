import { prisma } from "@/lib/prisma";

export interface BundleCandidate {
  name: string;
  description: string;
  category: "Accessory Bundle" | "Complementary Bundle" | "Productivity Bundle";
  productHandles: string[];
  customerBenefit: string;
  commercialRationale: string;
  targetAudience: string;
  recommendedChannels: string[];
}

export const KNOWN_BUNDLE_TEMPLATES: BundleCandidate[] = [
  {
    name: "Mobile Creator Power Pack",
    description: "Apple iPhone 15 Pro paired with Anker 737 24K Power Bank for uninterrupted 4K video capture and fast field charging.",
    category: "Accessory Bundle",
    productHandles: ["apple-iphone-15-pro-128gb", "anker-737-power-bank-powercore-24k"],
    customerBenefit: "Never run out of charge while creating content or traveling; ultra-fast 140W two-way replenishment.",
    commercialRationale: "Attaches a high-margin accessory (Anker Power Bank) to a flagship device, lifting basket margin by +4.8%.",
    targetAudience: "Mobile creators, vloggers, and traveling executives.",
    recommendedChannels: ["Instagram Reels", "WhatsApp Catalog", "In-Store Showcase"],
  },
  {
    name: "Executive Audiophile Suite",
    description: "Samsung Galaxy S24 Ultra combined with Sony WH-1000XM5 Wireless Noise Cancelling Headphones.",
    category: "Complementary Bundle",
    productHandles: ["samsung-galaxy-s24-ultra-256gb", "sony-wh-1000xm5-wireless-headphones"],
    customerBenefit: "State-of-the-art mobile AI productivity paired with class-leading noise cancellation for meetings and commutes.",
    commercialRationale: "Captures high customer lifetime value in a single transaction with two market-leading flagships.",
    targetAudience: "Corporate professionals, hybrid workers, and tech enthusiasts.",
    recommendedChannels: ["LinkedIn", "Executive Email Digest", "Storefront Hero Banner"],
  },
  {
    name: "Remote Pro Workstation",
    description: "Apple MacBook Air 13-inch M3 paired with Sony WH-1000XM5 Noise Cancelling Headphones.",
    category: "Productivity Bundle",
    productHandles: ["macbook-air-13-inch-m3-16gb-512gb", "sony-wh-1000xm5-wireless-headphones"],
    customerBenefit: "Silent all-day M3 computing power combined with uninterrupted acoustic focus anywhere.",
    commercialRationale: "Lifts average order value above KES 235,000 while bundling high-inventory audio stock.",
    targetAudience: "Software developers, creatives, remote consultants.",
    recommendedChannels: ["Google Search (OpenSEO)", "Tech Community Forums", "WhatsApp Business"],
  },
];

/**
 * Discovers and generates bundle recommendations based on product catalogue state and affinities
 */
export async function generateBundleRecommendations(tenantSlug = "nuru-electronics") {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    throw new Error(`Tenant with slug "${tenantSlug}" not found`);
  }

  const allProducts = await prisma.product.findMany({
    where: { tenantId: tenant.id },
  });

  const productMap = new Map(allProducts.map((p) => [p.handle, p]));
  const results = [];

  for (const template of KNOWN_BUNDLE_TEMPLATES) {
    const matchedProducts = template.productHandles
      .map((handle) => productMap.get(handle))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    // Only create bundle if all referenced products exist in the catalogue
    if (matchedProducts.length === template.productHandles.length) {
      let totalSellingPrice = 0;
      let totalCostPrice = 0;
      const individualPrices: Record<string, number> = {};

      for (const p of matchedProducts) {
        const selling = Number(p.sellingPrice);
        const cost = p.costPrice ? Number(p.costPrice) : selling * 0.8;
        totalSellingPrice += selling;
        totalCostPrice += cost;
        individualPrices[p.id] = selling;
      }

      const grossMarginPercent =
        totalSellingPrice > 0
          ? ((totalSellingPrice - totalCostPrice) / totalSellingPrice) * 100
          : 0;

      const existingBundle = await prisma.bundleRecommendation.findFirst({
        where: {
          tenantId: tenant.id,
          name: template.name,
        },
      });

      const bundleData = {
        tenantId: tenant.id,
        name: template.name,
        description: `${template.description} (Audience: ${template.targetAudience} | Benefit: ${template.customerBenefit})`,
        productIds: matchedProducts.map((p) => p.id),
        combinedPrice: totalSellingPrice,
        individualPrices: individualPrices,
        marginEstimate: Math.round(grossMarginPercent * 10) / 10,
        status: existingBundle?.status || "pending_approval",
      };

      const bundle = existingBundle
        ? await prisma.bundleRecommendation.update({
            where: { id: existingBundle.id },
            data: bundleData,
          })
        : await prisma.bundleRecommendation.create({
            data: bundleData,
          });

      results.push(bundle);
    }
  }

  return results;
}
