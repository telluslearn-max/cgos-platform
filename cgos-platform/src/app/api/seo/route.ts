import { NextResponse } from "next/server";
import { getSEOIntelligence } from "@/lib/market/intelligence";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seo = await getSEOIntelligence("nuru-electronics");
    return NextResponse.json({ status: "ok", seo });
  } catch (error) {
    console.error("Failed to load SEO intelligence:", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch SEO metrics" }, { status: 500 });
  }
}
