import { NextResponse } from "next/server";
import { syncNuruCatalogue } from "@/lib/integrations/nuru/sync";
import { NuruCommerceClient } from "@/lib/integrations/nuru/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const integration = await prisma.integration.findFirst({
      where: { name: "NURU Commerce Platform" },
    });

    const client = new NuruCommerceClient();
    const health = await client.checkHealth();

    return NextResponse.json({
      status: "ok",
      integration: integration
        ? {
            id: integration.id,
            name: integration.name,
            status: integration.status,
            lastSyncAt: integration.lastSyncAt,
            lastError: integration.lastError,
            config: integration.connectionConfig,
          }
        : null,
      nuruHealth: health,
    });
  } catch (error) {
    console.error("Failed to retrieve NURU integration status:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to read integration status",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await syncNuruCatalogue();
    return NextResponse.json({
      status: "ok",
      message: "NURU catalogue synchronization complete",
      result,
    });
  } catch (error) {
    console.error("Failed to execute NURU catalogue sync:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}
