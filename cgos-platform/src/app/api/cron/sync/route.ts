import { NextResponse } from "next/server";
import { executeAutonomousGrowthCycle } from "@/lib/autonomous/orchestrator";

export const dynamic = "force-dynamic";

/**
 * Dedicated cron execution endpoint for daily catalogue resync & autonomous growth cycle.
 * Compatible with Coolify scheduled tasks, Vercel cron, GitHub Actions, and external cron services.
 */
async function handleSync(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");
    const secretParam = searchParams.get("secret");
    const expectedSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is configured in env, enforce authentication
    if (expectedSecret && secretParam !== expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const tenantSlug = searchParams.get("tenant") || "nuru-electronics";
    console.log(`[CRON] Starting daily catalogue sync and autonomous cycle for tenant: ${tenantSlug}`);

    const result = await executeAutonomousGrowthCycle(tenantSlug);

    return NextResponse.json({
      status: "ok",
      triggeredAt: new Date().toISOString(),
      tenant: tenantSlug,
      cycle: result,
    });
  } catch (error) {
    console.error("[CRON] Scheduled catalogue sync failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Scheduled sync failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}
