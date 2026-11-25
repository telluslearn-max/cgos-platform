import { prisma } from "@/lib/prisma";

export async function getCampaigns(tenantSlug = "nuru-electronics") {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) return [];

  const rawCampaigns = await prisma.campaign.findMany({
    where: { tenantId: tenant.id },
    orderBy: { startDate: "desc" },
  });

  const allProductIds = Array.from(new Set(rawCampaigns.flatMap((c) => c.productIds)));
  const products = await prisma.product.findMany({
    where: { id: { in: allProductIds } },
    select: { id: true, title: true, brand: true, sellingPrice: true, sku: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return rawCampaigns.map((c) => ({
    ...c,
    budget: c.budget ? Number(c.budget) : 0,
    products: c.productIds
      .map((id) => productMap.get(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .map((p) => ({
        ...p,
        sellingPrice: Number(p.sellingPrice),
      })),
  }));
}

export async function getCalendarSchedule(tenantSlug = "nuru-electronics") {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) return [];

  const calendars = await prisma.marketingCalendar.findMany({
    where: { tenantId: tenant.id },
  });

  const calendarIds = calendars.map((cal) => cal.id);

  const entries = await prisma.calendarEntry.findMany({
    where: { calendarId: { in: calendarIds } },
    orderBy: { scheduledAt: "asc" },
  });

  const productIds = entries.map((e) => e.productId).filter((id): id is string => Boolean(id));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, title: true, brand: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return entries.map((e) => ({
    ...e,
    product: e.productId ? productMap.get(e.productId) || null : null,
  }));
}
