import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["approved", "rejected", "pending_approval"].includes(status)) {
      return NextResponse.json(
        { status: "error", message: "Invalid status value. Must be approved, rejected, or pending_approval." },
        { status: 400 }
      );
    }

    const updated = await prisma.bundleRecommendation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      status: "ok",
      message: `Bundle status updated to ${status}`,
      bundle: {
        ...updated,
        combinedPrice: Number(updated.combinedPrice),
        marginEstimate: updated.marginEstimate ? Number(updated.marginEstimate) : null,
      },
    });
  } catch (error) {
    console.error("Failed to update bundle status:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update bundle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.bundleRecommendation.delete({
      where: { id },
    });

    return NextResponse.json({
      status: "ok",
      message: "Bundle recommendation deleted",
    });
  } catch (error) {
    console.error("Failed to delete bundle:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete bundle" },
      { status: 500 }
    );
  }
}
