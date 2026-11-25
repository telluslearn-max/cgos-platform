import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCreativeBriefs } from "@/lib/creative/briefs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) return NextResponse.json({ status: "ok", briefs: [] });

    const briefs = await prisma.contentBrief.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    // Populate product titles
    const productIds = briefs.map((b) => b.productId).filter((id): id is string => Boolean(id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, brand: true, sellingPrice: true, sku: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const populatedBriefs = briefs.map((b) => ({
      ...b,
      product: b.productId ? productMap.get(b.productId) || null : null,
    }));

    return NextResponse.json({
      status: "ok",
      count: populatedBriefs.length,
      briefs: populatedBriefs,
    });
  } catch (error) {
    console.error("Failed to fetch creative briefs:", error);
    return NextResponse.json({ status: "error", message: "Failed to load briefs" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const created = await generateCreativeBriefs();
    return NextResponse.json({
      status: "ok",
      message: `Generated ${created.length} new creative briefs`,
      count: created.length,
    });
  } catch (error) {
    console.error("Failed to generate briefs:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const updated = await prisma.contentBrief.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ status: "ok", brief: updated });
  } catch (error) {
    console.error("Failed to update brief status:", error);
    return NextResponse.json({ status: "error", message: "Update failed" }, { status: 500 });
  }
}
