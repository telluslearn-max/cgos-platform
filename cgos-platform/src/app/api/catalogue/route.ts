import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const whereClause: Record<string, unknown> = {};

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    // Format selling price and cost price as string or number for JSON serialization
    const formattedProducts = products.map((p) => ({
      ...p,
      sellingPrice: Number(p.sellingPrice),
      costPrice: p.costPrice ? Number(p.costPrice) : null,
    }));

    return NextResponse.json({
      status: "ok",
      totalCount,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Failed to fetch catalogue products:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to load products from database",
        totalCount: 0,
        products: [],
      },
      { status: 200 }
    );
  }
}
