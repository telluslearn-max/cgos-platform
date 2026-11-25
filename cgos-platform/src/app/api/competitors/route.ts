import { NextResponse } from "next/server";
import { getCompetitorIntelligence } from "@/lib/market/intelligence";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const competitors = await getCompetitorIntelligence("nuru-electronics");
    return NextResponse.json({ status: "ok", count: competitors.length, competitors });
  } catch (error) {
    console.error("Failed to load competitor intelligence:", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch competitor metrics" }, { status: 500 });
  }
}
