import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    const tenantId = tenant?.id;

    const [totalProducts, activeVariants, activeCampaigns, contentBriefs] =
      await Promise.all([
        tenantId ? prisma.product.count({ where: { tenantId } }) : prisma.product.count(),
        prisma.productVariant.count(),
        prisma.campaign.count({ where: { status: "active" } }),
        prisma.contentBrief.count(),
      ]);

    const topOpportunities = await prisma.productAnalysis.findMany({
      take: 5,
      orderBy: { opportunityScore: "desc" },
    });

    return NextResponse.json({
      status: "ok",
      tenant: tenant ? { name: tenant.name, slug: tenant.slug, location: tenant.location } : null,
      metrics: {
        totalProducts,
        activeVariants,
        activeCampaigns,
        contentBriefs,
      },
      topOpportunities,
    });
  } catch (error) {
    console.error("Failed to fetch overview metrics:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed or not initialized yet",
        metrics: {
          totalProducts: 0,
          activeVariants: 0,
          activeCampaigns: 0,
          contentBriefs: 0,
        },
        topOpportunities: [],
      },
      { status: 200 }
    );
  }
}
