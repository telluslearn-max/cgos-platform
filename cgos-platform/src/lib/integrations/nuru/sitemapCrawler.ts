import { prisma } from "@/lib/prisma";

export interface CrawledNuruProduct {
  handle: string;
  title: string;
  brand: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  stockQuantity: number;
  sku: string;
}

const BRAND_PATTERNS = [
  "Apple", "Samsung", "Sony", "Google", "Anker", "Baseus", "Razer",
  "SteelSeries", "PlayStation", "Xbox", "Nintendo", "Marshall", "Meta",
  "Hollyland", "Lenovo", "Xiaomi", "DJI", "Bose", "JBL", "Fujifilm",
  "Canon", "GoPro", "Denon", "Thrustmaster", "Amazon", "OnePlus", "Nothing",
  "Hisense", "TCL", "LG", "Sonos", "Beats", "Rode", "Shokz", "Kodak", "Vitron"
];

function inferCategory(handle: string): string {
  const h = handle.toLowerCase();
  if (h.includes("case") || h.includes("cable") || h.includes("mat") || h.includes("hub") || h.includes("adapter") || h.includes("charger") || h.includes("power-bank") || h.includes("smarttag")) {
    return "Accessories & Power";
  }
  if (h.includes("headphone") || h.includes("earbuds") || h.includes("audio") || h.includes("buds") || h.includes("major") || h.includes("airpods") || h.includes("speaker") || h.includes("soundbar")) {
    return "Audio & Acoustics";
  }
  if (h.includes("controller") || h.includes("keyboard") || h.includes("playstation") || h.includes("xbox") || h.includes("nintendo") || h.includes("steam-deck") || h.includes("game") || h.includes("quest") || h.includes("legion-go")) {
    return "Gaming & Virtual Reality";
  }
  if (h.includes("macbook") || h.includes("laptop") || h.includes("ipad") || h.includes("tab") || h.includes("remarkable")) {
    return "Computers & Tablets";
  }
  if (h.includes("phone") || h.includes("iphone") || h.includes("pixel") || h.includes("galaxy") || h.includes("ultra") || h.includes("oneplus") || h.includes("nothing")) {
    return "Smartphones & Mobile";
  }
  if (h.includes("watch") || h.includes("whoop") || h.includes("band")) {
    return "Wearables";
  }
  if (h.includes("camera") || h.includes("gopro") || h.includes("fujifilm") || h.includes("canon") || h.includes("dji") || h.includes("mic") || h.includes("lark")) {
    return "Cameras & Creator Gear";
  }
  return "Consumer Electronics";
}

function inferBrand(handle: string): string {
  const h = handle.toLowerCase();
  for (const b of BRAND_PATTERNS) {
    if (h.includes(b.toLowerCase())) return b;
  }
  return "NURU Certified";
}

function titleFromHandle(handle: string): string {
  return handle
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function estimatePriceKes(handle: string, category: string): { sellingPrice: number; costPrice: number } {
  const h = handle.toLowerCase();
  let selling = 25000;

  if (category === "Smartphones & Mobile") {
    if (h.includes("ultra") || h.includes("pro-max") || h.includes("fold")) selling = 175000;
    else if (h.includes("pro") || h.includes("plus")) selling = 135000;
    else selling = 65000;
  } else if (category === "Computers & Tablets") {
    if (h.includes("macbook-pro") || h.includes("m5") || h.includes("m4")) selling = 265000;
    else if (h.includes("macbook-air") || h.includes("m3") || h.includes("legion")) selling = 185000;
    else selling = 85000;
  } else if (category === "Gaming & Virtual Reality") {
    if (h.includes("playstation-5-pro") || h.includes("series-x")) selling = 115000;
    else if (h.includes("steam-deck") || h.includes("switch") || h.includes("quest")) selling = 68000;
    else if (h.includes("controller") || h.includes("keyboard") || h.includes("stick")) selling = 14500;
    else selling = 9500;
  } else if (category === "Audio & Acoustics") {
    if (h.includes("xm5") || h.includes("airpods-max") || h.includes("bose") || h.includes("sonos")) selling = 48500;
    else if (h.includes("major") || h.includes("buds") || h.includes("airpods")) selling = 24000;
    else selling = 12000;
  } else if (category === "Wearables") {
    if (h.includes("ultra")) selling = 98000;
    else selling = 38000;
  } else if (category === "Cameras & Creator Gear") {
    if (h.includes("canon") || h.includes("fujifilm") || h.includes("dji")) selling = 125000;
    else selling = 32000;
  } else if (category === "Accessories & Power") {
    if (h.includes("24000") || h.includes("250w") || h.includes("140w") || h.includes("hub") || h.includes("prime")) selling = 17500;
    else if (h.includes("power-bank") || h.includes("charger")) selling = 5500;
    else selling = 3200;
  }

  const cost = Math.round(selling * 0.76);
  return { sellingPrice: selling, costPrice: cost };
}

function buildUniqueSku(slug: string): string {
  const normalized = slug.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return `NURU-${normalized}`.slice(0, 64);
}

export async function crawlAndSyncFullNuruSitemap(): Promise<{
  totalIndexed: number;
  newlyAdded: number;
  updated: number;
}> {
  let tenant = await prisma.tenant.findUnique({
    where: { slug: "nuru-electronics" },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "NURU Electronics",
        slug: "nuru-electronics",
        industry: "Consumer Electronics",
        businessModel: "Omnichannel Retail",
        website: "https://www.nuruelectronics.com",
        location: "Nairobi, Kenya",
      },
    });
  }

  const response = await fetch("https://www.nuruelectronics.com/sitemap.xml", {
    headers: { "User-Agent": "CGOS-Intelligence-Crawler/1.0" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch NURU sitemap: HTTP ${response.status}`);
  }

  const xml = await response.text();
  const matches = Array.from(xml.matchAll(/<loc>https:\/\/www\.nuruelectronics\.com\/products\/([^<]+)<\/loc>/g));
  const productSlugs = Array.from(
    new Set(
      matches
        .map((m) => m[1])
        .filter((slug): slug is string => Boolean(slug) && slug.trim().length > 0)
    )
  );

  const existingProducts = await prisma.product.findMany({
    where: { tenantId: tenant.id },
    select: { handle: true, sku: true },
  });

  const existingHandles = new Set(existingProducts.map((p) => p.handle));
  const existingSkus = new Set(existingProducts.map((p) => p.sku).filter((s): s is string => Boolean(s)));

  const toCreate: Array<{
    tenantId: string;
    handle: string;
    title: string;
    description: string;
    brand: string;
    category: string;
    sellingPrice: number;
    costPrice: number;
    stockQuantity: number;
    sku: string;
    status: "active";
  }> = [];

  for (let i = 0; i < productSlugs.length; i++) {
    const slug = productSlugs[i];
    if (!slug || existingHandles.has(slug)) continue;

    const brand = inferBrand(slug);
    const category = inferCategory(slug);
    const title = titleFromHandle(slug);
    const { sellingPrice, costPrice } = estimatePriceKes(slug, category);

    let sku = buildUniqueSku(slug);
    if (existingSkus.has(sku)) {
      sku = `${sku.slice(0, 56)}-${i}`;
    }
    existingSkus.add(sku);

    toCreate.push({
      tenantId: tenant.id,
      handle: slug,
      title,
      description: `Genuine ${brand} ${title}. Official stock available in Nairobi with warranty and same-day delivery.`,
      brand,
      category,
      sellingPrice,
      costPrice,
      stockQuantity: (i % 15) + 5,
      sku,
      status: "active",
    });
  }

  let newlyAdded = 0;
  if (toCreate.length > 0) {
    const result = await prisma.product.createMany({
      data: toCreate,
      skipDuplicates: true,
    });
    newlyAdded = result.count;
  }

  return {
    totalIndexed: productSlugs.length,
    newlyAdded,
    updated: productSlugs.length - newlyAdded,
  };
}
