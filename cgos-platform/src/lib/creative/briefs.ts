import { prisma } from "@/lib/prisma";

export interface CreativeBriefTemplate {
  title: string;
  objective: string;
  targetAudience: string;
  contentAngle: string;
  platform: string;
  format: string;
  cta: string;
}

export const BRAND_MEMORY_PROFILES = {
  nuruElectronics: {
    brandName: "NURU Electronics",
    tone: "Authoritative, customer-first, transparent, tech-savvy yet accessible",
    corePillars: [
      "100% Genuine, tested tech and electronics with warranty",
      "Fast, reliable nationwide delivery across Kenya",
      "Competitive prices with transparent import specifications",
      "Flexible Lipa Mdogo Mdogo (BNPL) financing options available",
    ],
  },
};

/**
 * Generates structured creative marketing briefs for top opportunity products
 */
export async function generateCreativeBriefs(tenantSlug = "nuru-electronics") {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) throw new Error(`Tenant "${tenantSlug}" not found`);

  // Fetch top hero products from catalogue
  const heroProducts = await prisma.product.findMany({
    where: { tenantId: tenant.id },
    take: 4,
  });

  const createdBriefs = [];

  for (const product of heroProducts) {
    const templates: CreativeBriefTemplate[] = [
      {
        title: `${product.title} — Flagship Instagram Showcase`,
        objective: "Drive direct DM enquiries and storefront visits highlighting flagship specs and verified warranty.",
        targetAudience: "Tech enthusiasts and creators seeking authentic, warranty-backed devices in Kenya.",
        contentAngle: "Premium unboxing, durability test, and speed overview under realistic Kenyan power/connectivity conditions.",
        platform: "Instagram",
        format: "Reel / Carousel",
        cta: "Tap link in bio to order with same-day Nairobi delivery or DM for wholesale rates.",
      },
      {
        title: `${product.title} — WhatsApp Catalog Flash Drop`,
        objective: "Immediate conversational checkout and repeat order velocity from high-intent VIP buyers.",
        targetAudience: "Repeat retail clients and regional electronics resellers.",
        contentAngle: "Exclusive limited-time price lock and guaranteed genuine serial check guarantee.",
        platform: "WhatsApp",
        format: "Catalog Message & Broadcast Card",
        cta: "Reply 'ORDER NOW' to reserve yours before stock runs out.",
      },
    ];

    for (const t of templates) {
      const brief = await prisma.contentBrief.create({
        data: {
          tenantId: tenant.id,
          title: t.title,
          objective: t.objective,
          targetAudience: t.targetAudience,
          productId: product.id,
          contentAngle: t.contentAngle,
          platform: t.platform,
          format: t.format,
          cta: t.cta,
          status: "draft",
        },
      });
      createdBriefs.push(brief);
    }
  }

  return createdBriefs;
}
