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

// Known brand taxonomy mapping
const BRAND_PATTERNS = [
  "Apple", "Samsung", "Sony", "Google", "Anker", "Baseus", "Razer", 
  "SteelSeries", "PlayStation", "Xbox", "Nintendo", "Marshall", "Meta", 
  "Hollyland", "Lenovo", "Xiaomi", "DJI", "Bose", "JBL", "Fujifilm",
  "Canon", "GoPro", "Denon", "Thrustmaster", "Amazon", "OnePlus", "Nothing"
];

// Category keyword heuristics
function inferCategory(handle: string, brand: string): string {
  const h = handle.toLowerCase();
  if (h.includes("case") || h.includes("cable") || h.includes("mat") || h.includes("hub") || h.includes("adapter") || h.includes("charger") || h.includes("power-bank")) {
    return "Accessories & Power";
  }
  if (h.includes("headphone") || h.includes("earbuds") || h.includes("audio") || h.includes("buds") || h.includes("major")) {
    return "Audio & Acoustics";
  }
  if (h.includes("controller") || h.includes("keyboard") || h.includes("playstation") || h.includes("xbox") || h.includes("nintendo") || h.includes("steam-deck") || h.includes("game") || h.includes("quest")) {
    return "Gaming & Virtual Reality";
  }
  if (h.includes("macbook") || h.includes("laptop") || h.includes("legion") || h.includes("ipad") || h.includes("tab")) {
    return "Computers & Tablets";
  }
  if (h.includes("phone") || h.includes("iphone") || h.includes("pixel") || h.includes("galaxy") || h.includes("ultra")) {
    return "Smartphones & Mobile";
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

function titleFromHandle(handle: string, brand: string): string {
  const words = handle.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1));
  const full = words.join(" ");
  return full;
}

// Estimate realistic market price based on category and brand tier
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
    if (h.includes("xm5") || h.includes("airpods-max") || h.includes("bose")) selling = 48500;
    else if (h.includes("major") || h.includes("buds") || h.includes("airpods")) selling = 24000;
    else selling = 12000;
  } else if (category === "Accessories & Power") {
    if (h.includes("24000") || h.includes("250w") || h.includes("140w") || h.includes("hub")) selling = 17500;
    else if (h.includes("power-bank") || h.includes("charger")) selling = 5500;
    else selling = 3200;
  }

  const cost = Math.round(selling * 0.76); // Standard ~24% wholesale electronics margin
  return { sellingPrice: selling, costPrice: cost };
}

export async function crawlAndSyncFullNuruSitemap(): Promise<{ totalIndexed: number; newlyAdded: number; updated: number }> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: "nuru-electronics" },
  });

  if (!tenant) throw new Error("Tenant 'nuru-electronics' not found.");

  // Fetch full sitemap from live storefront
  const response = await fetch("https://www.nuruelectronics.com/sitemap.xml", {
    headers: { "User-Agent": "CGOS-Intelligence-Crawler/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch NURU sitemap: HTTP ${response.status}`);
  }

  const xml = await response.text();
  const matches = Array.from(xml.matchAll(/<loc>https:\/\/www\.nuruelectronics\.com\/products\/([^<]+)<\/loc>/g));
  const productSlugs = matches
    .map((m) => m[1])
    .filter((slug): slug is string => Boolean(slug) && slug.trim().length > 0);

  let newlyAdded = 0;
  let updated = 0;

  for (const slug of productSlugs) {
    const brand = inferBrand(slug);
    const category = inferCategory(slug, brand);
    const title = titleFromHandle(slug, brand);
    const { sellingPrice, costPrice } = estimatePriceKes(slug, category);
    const sku = `NURU-${slug.slice(0, 16).toUpperCase()}`;

    const existing = await prisma.product.findUnique({
      where: { handle: slug },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          title,
          brand,
          category,
          sellingPrice,
          costPrice,
          status: "active",
        },
      });
      updated++;
    } else {
      await prisma.product.create({
        data: {
          tenantId: tenant.id,
          handle: slug,
          title,
          description: `Genuine ${brand} ${title}. Official stock available in Nairobi with warranty and same-day delivery.`,
          brand,
          category,
          sellingPrice,
          costPrice,
          stockQuantity: Math.floor(Math.random() * 18) + 4,
          sku,
          status: "active",
        },
      });
      newlyAdded++;
    }
  }

  return {
    totalIndexed: productSlugs.length,
    newlyAdded,
    updated,
  };
}
