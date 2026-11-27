import { prisma } from "@/lib/prisma";
import { NuruCommerceClient } from "./client";
import { NuruSyncResult } from "./types";
import { crawlAndSyncFullNuruSitemap } from "./sitemapCrawler";

export async function syncNuruCatalogue(tenantSlug = "nuru-electronics"): Promise<NuruSyncResult> {
  const errors: string[] = [];
  let syncedProducts = 0;
  let syncedVariants = 0;
  let syncedImages = 0;

  // 1. Resolve Tenant
  let tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        id: "tenant-nuru-electronics",
        name: "NURU Electronics",
        slug: tenantSlug,
        industry: "Consumer Electronics & Mobile",
        businessModel: "Omnichannel Retail & E-commerce",
        website: "https://nuruelectronics.com",
        location: "Nairobi, Kenya",
      },
    });
  }

  // 2. Upsert Integration record
  const existingIntegration = await prisma.integration.findFirst({
    where: {
      tenantId: tenant.id,
      name: "NURU Commerce Platform",
    },
  });

  const integration = existingIntegration
    ? await prisma.integration.update({
        where: { id: existingIntegration.id },
        data: {
          status: "syncing",
          lastError: null,
        },
      })
    : await prisma.integration.create({
        data: {
          tenantId: tenant.id,
          name: "NURU Commerce Platform",
          type: "commerce",
          status: "syncing",
          syncFrequency: "hourly",
          connectionConfig: {
            mode: "read_only",
            protocol: "https",
            target: "NURU Platform API",
          },
        },
      });

  // 3. Fetch from NURU Client
  const client = new NuruCommerceClient();
  const { products, source } = await client.fetchProducts();

  // 4. Ingest and Synchronize
  for (const item of products) {
    try {
      const sellingPrice = Number(item.sellingPrice);
      const costPrice = item.costPrice ? Number(item.costPrice) : null;

      // Compute opportunity score (PRD §5: Margin, Stock, Demand)
      const margin = costPrice ? (sellingPrice - costPrice) / sellingPrice : 0.2;
      const stockFactor = Math.min(item.stockQuantity / 20, 1);
      const calculatedScore = Math.min(Math.round((margin * 50 + stockFactor * 50) * 10) / 10, 99);

      const product = await prisma.product.upsert({
        where: { handle: item.handle },
        update: {
          tenantId: tenant.id,
          title: item.title,
          description: item.description,
          category: item.category || "Electronics",
          brand: item.brand,
          vendor: item.vendor,
          productType: item.productType || "Hardware",
          tags: item.tags || [],
          sellingPrice: item.sellingPrice,
          costPrice: item.costPrice ?? null,
          stockQuantity: item.stockQuantity,
          sku: item.sku,
          availability: item.stockQuantity > 0 ? "in_stock" : "out_of_stock",
        },
        create: {
          tenantId: tenant.id,
          handle: item.handle,
          title: item.title,
          description: item.description,
          category: item.category || "Electronics",
          brand: item.brand,
          vendor: item.vendor,
          productType: item.productType || "Hardware",
          tags: item.tags || [],
          sellingPrice: item.sellingPrice,
          costPrice: item.costPrice ?? null,
          stockQuantity: item.stockQuantity,
          sku: item.sku,
          availability: item.stockQuantity > 0 ? "in_stock" : "out_of_stock",
        },
      });

      syncedProducts++;

      // Synchronize variants
      if (item.variants && item.variants.length > 0) {
        for (const variant of item.variants) {
          await prisma.productVariant.upsert({
            where: { sku: variant.sku },
            update: {
              productId: product.id,
              title: variant.title,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice ?? null,
              costPrice: variant.costPrice ?? null,
              stockQuantity: variant.stockQuantity,
            },
            create: {
              productId: product.id,
              sku: variant.sku,
              title: variant.title,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice ?? null,
              costPrice: variant.costPrice ?? null,
              stockQuantity: variant.stockQuantity,
            },
          });
          syncedVariants++;
        }
      }

      // Synchronize media
      if (item.images && item.images.length > 0) {
        for (const img of item.images) {
          const mediaExists = await prisma.productMedia.findFirst({
            where: { productId: product.id, url: img.url },
          });

          if (!mediaExists) {
            await prisma.productMedia.create({
              data: {
                productId: product.id,
                url: img.url,
                altText: img.altText || product.title,
                width: img.width || 800,
                height: img.height || 800,
              },
            });
            syncedImages++;
          }
        }
      }

      // Update or create ProductAnalysis
      const existingAnalysis = await prisma.productAnalysis.findFirst({
        where: { productId: product.id },
      });

      const lifecycleCategory =
        calculatedScore > 90
          ? "hero_product"
          : calculatedScore > 80
          ? "high_margin"
          : "volume_driver";

      if (existingAnalysis) {
        await prisma.productAnalysis.update({
          where: { id: existingAnalysis.id },
          data: {
            opportunityScore: calculatedScore,
            bundlePotential: 85.0,
            marketingStatus: "ready_to_promote",
            lifecycleCategory,
          },
        });
      } else {
        await prisma.productAnalysis.create({
          data: {
            productId: product.id,
            opportunityScore: calculatedScore,
            bundlePotential: 85.0,
            marketingStatus: "ready_to_promote",
            lifecycleCategory,
          },
        });
      }
    } catch (err) {
      const msg = `Failed to sync item ${item.handle}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // 4b. Crawl full live storefront sitemap for any new or unpublished SKUs
  try {
    const crawlStats = await crawlAndSyncFullNuruSitemap();
    syncedProducts += crawlStats.newlyAdded;
  } catch (crawlErr) {
    console.warn("Sitemap crawl skipped during sync:", crawlErr);
  }

  // 5. Update Integration record with completion status
  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      status: errors.length === 0 ? "connected" : "error",
      lastSyncAt: new Date(),
      lastError: errors.length > 0 ? errors.join("; ") : null,
      connectionConfig: {
        mode: "read_only",
        syncedProducts,
        syncedVariants,
        syncedImages,
        source,
      },
    },
  });

  return {
    success: errors.length === 0,
    syncedProducts,
    syncedVariants,
    syncedImages,
    errors,
    timestamp: new Date().toISOString(),
    source,
  };
}
