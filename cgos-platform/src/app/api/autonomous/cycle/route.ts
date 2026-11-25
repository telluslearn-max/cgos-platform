import { NextResponse } from "next/server";
import { executeAutonomousGrowthCycle } from "@/lib/autonomous/orchestrator";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: "nuru-electronics" },
    });

    const recommendations = tenant
      ? await prisma.growthRecommendation.findMany({
          where: { tenantId: tenant.id },
          orderBy: { createdAt: "desc" },
          take: 10,
        })
      : [];

    return NextResponse.json({
      status: "ok",
      systemMode: "autonomous_growth_active",
      safeguard: "PRD §14 read-only enabled",
      recentCycles: recommendations,
    });
  } catch (error) {
    console.error("Failed to fetch autonomous engine status:", error);
    return NextResponse.json({ status: "error", message: "Failed to read engine status" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await executeAutonomousGrowthCycle("nuru-electronics");
    return NextResponse.json({ status: "ok", cycle: result });
  } catch (error) {
    console.error("Autonomous cycle failed:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Cycle failed" },
      { status: 500 }
    );
  }
}
