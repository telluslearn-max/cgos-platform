import { NextResponse } from "next/server";
import { getCampaigns } from "@/lib/distribution/campaigns";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const campaigns = await getCampaigns();
    return NextResponse.json({ status: "ok", count: campaigns.length, campaigns });
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json({ status: "error", message: "Failed to load campaigns" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, objective, targetAudience, productIds, budget, startDate, endDate } = body;

    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) throw new Error("Tenant not found");

    const campaign = await prisma.campaign.create({
      data: {
        tenantId: tenant.id,
        name,
        objective,
        targetAudience,
        productIds: productIds || [],
        budget: budget ? Number(budget) : null,
        startDate: new Date(startDate || Date.now()),
        endDate: endDate ? new Date(endDate) : null,
        status: "active",
      },
    });

    return NextResponse.json({ status: "ok", campaign });
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Creation failed" },
      { status: 500 }
    );
  }
}
