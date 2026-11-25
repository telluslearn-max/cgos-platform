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

export const BRAND_MEMORY_NURU = {
  name: "NURU Electronics",
  tagline: "Authentic Tech, Guaranteed Reliability",
  tone: "Modern, knowledgeable, trustworthy, clear, and tech-forward",
  guarantees: [
    "100% Genuine East Africa stock with manufacturer warranty",
    "Same-day Nairobi delivery and countrywide secure parcel dispatch",
    "Flexible Lipa Mdogo Mdogo (BNPL) financing options available",
  ],
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
    include: {
      variants: true,
    },
    take: 4,
  });

  const createdBriefs = [];

  for (const product of heroProducts) {
    const templates: CreativeBriefTemplate[] = [
      {
        title: `${product.title} — Flagship Instagram Showcase`,
        objective: "Drive direct DM enquiries and storefront visits highlighting flagship specs and verified warranty.",
        targetAudience: "Tech enthusiasts and creators seeking authentic, warranty-backed devices in Kenya.",
        contentAngle: `Focus on genuine flagship performance with transparent KES pricing. Highlight ${BRAND_MEMORY_NURU.guarantees[0]}.`,
        platform: "Instagram",
        format: "Carousel & Reels",
        cta: "Send DM or tap link in bio to order with same-day Nairobi delivery.",
      },
      {
        title: `${product.title} — WhatsApp VIP Broadcast`,
        objective: "Convert existing VIP customer list into high-ticket sales with limited stock availability announcement.",
        targetAudience: "Repeat NURU electronics shoppers and corporate executive buyers.",
        contentAngle: `Exclusive stock update: Limited units available in Nairobi. Flexible Lipa Mdogo Mdogo financing available.`,
        platform: "WhatsApp",
        format: "Direct Catalog Broadcast",
        cta: "Reply 'ORDER' to reserve your unit immediately.",
      },
    ];

    for (const tmpl of templates) {
      const existing = await prisma.contentBrief.findFirst({
        where: {
          tenantId: tenant.id,
          title: tmpl.title,
        },
      });

      if (!existing) {
        const brief = await prisma.contentBrief.create({
          data: {
            tenantId: tenant.id,
            productId: product.id,
            title: tmpl.title,
            objective: tmpl.objective,
            targetAudience: tmpl.targetAudience,
            contentAngle: tmpl.contentAngle,
            platform: tmpl.platform,
            format: tmpl.format,
            cta: tmpl.cta,
            status: "ready_for_review",
          },
        });
        createdBriefs.push(brief);
      }
    }
  }

  return createdBriefs;
}
