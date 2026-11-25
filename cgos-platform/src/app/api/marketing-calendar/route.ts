import { NextResponse } from "next/server";
import { getCalendarSchedule } from "@/lib/distribution/campaigns";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await getCalendarSchedule();
    return NextResponse.json({ status: "ok", count: entries.length, entries });
  } catch (error) {
    console.error("Failed to fetch calendar entries:", error);
    return NextResponse.json({ status: "error", message: "Failed to load calendar" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, productId, scheduledAt } = body;

    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) throw new Error("Tenant not found");

    const calendar = await prisma.marketingCalendar.findFirst({
      where: { tenantId: tenant.id },
    });

    if (!calendar) throw new Error("No calendar exists for tenant");

    const entry = await prisma.calendarEntry.create({
      data: {
        calendarId: calendar.id,
        title,
        productId,
        scheduledAt: new Date(scheduledAt),
        status: "scheduled",
      },
    });

    return NextResponse.json({ status: "ok", entry });
  } catch (error) {
    console.error("Failed to create calendar entry:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Creation failed" },
      { status: 500 }
    );
  }
}
