import { NextResponse } from "next/server";
import { getTenantAnalytics, resolveTenant } from "@/lib/saas/tenant";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get("tenant") || "nuru-electronics";

    const [tenant, analytics] = await Promise.all([
      resolveTenant(tenantSlug),
      getTenantAnalytics(tenantSlug),
    ]);

    if (!tenant || !analytics) {
      return NextResponse.json({ status: "error", message: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", tenant, analytics });
  } catch (error) {
    console.error("Failed to load tenant analytics:", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch analytics" }, { status: 500 });
  }
}
