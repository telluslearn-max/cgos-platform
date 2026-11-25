import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBundleRecommendations } from "@/lib/intelligence/bundles";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) {
      return NextResponse.json({ status: "ok", bundles: [], totalCount: 0 });
    }

    const whereClause: Record<string, unknown> = {
      tenantId: tenant.id,
    };

    if (status) {
      whereClause.status = status;
    }

    const rawBundles = await prisma.bundleRecommendation.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Populate products for each bundle
    const allProductIds = Array.from(new Set(rawBundles.flatMap((b) => b.productIds)));
    const products = await prisma.product.findMany({
      where: { id: { in: allProductIds } },
      select: {
        id: true,
        title: true,
        brand: true,
        category: true,
        sellingPrice: true,
        sku: true,
        stockQuantity: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const bundles = rawBundles.map((b) => ({
      ...b,
      combinedPrice: Number(b.combinedPrice),
      marginEstimate: b.marginEstimate ? Number(b.marginEstimate) : null,
      products: b.productIds
        .map((id) => productMap.get(id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined)
        .map((p) => ({
          ...p,
          sellingPrice: Number(p.sellingPrice),
        })),
    }));

    return NextResponse.json({
      status: "ok",
      totalCount: bundles.length,
      bundles,
    });
  } catch (error) {
    console.error("Failed to fetch bundles:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to load bundle recommendations", bundles: [] },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const generated = await generateBundleRecommendations();
    return NextResponse.json({
      status: "ok",
      message: `Successfully generated ${generated.length} bundle recommendations`,
      count: generated.length,
    });
  } catch (error) {
    console.error("Failed to generate bundles:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to generate bundles" },
      { status: 500 }
    );
  }
}
