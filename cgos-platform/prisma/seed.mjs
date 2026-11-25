import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Commerce Growth OS database for pilot tenant: NURU Electronics...");

  // 1. Pilot Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "nuru-electronics" },
    update: {},
    create: {
      id: "tenant-nuru-electronics",
      name: "NURU Electronics",
      slug: "nuru-electronics",
      industry: "Consumer Electronics & Mobile",
      businessModel: "Omnichannel Retail & E-commerce",
      website: "https://nuruelectronics.com",
      location: "Nairobi, Kenya",
    },
  });

  console.log(`✓ Tenant ready: ${tenant.name} (${tenant.id})`);

  // 2. Admin User
  const user = await prisma.user.upsert({
    where: { email: "admin@nuruelectronics.com" },
    update: { tenantId: tenant.id },
    create: {
      id: "user-admin-nuru",
      email: "admin@nuruelectronics.com",
      name: "SG Kamau",
      role: "admin",
      status: "active",
      tenantId: tenant.id,
    },
  });

  console.log(`✓ Admin user ready: ${user.name} <${user.email}>`);

  // 3. Business Profile
  const existingProfile = await prisma.businessProfile.findFirst({
    where: { tenantId: tenant.id },
  });

  if (!existingProfile) {
    await prisma.businessProfile.create({
      data: {
        tenantId: tenant.id,
        businessName: "NURU Electronics",
        industry: "Consumer Electronics & Mobile Devices",
        businessModel: "B2C E-commerce & In-Store Sales",
        website: "https://nuruelectronics.com",
        location: "Nairobi, Kenya",
        targetCustomers: "Tech enthusiasts, professionals, and students in East Africa looking for genuine electronics",
        primaryProducts: "Smartphones, Laptops, Audio, Accessories, Smart Displays",
        brandPositioning: "Trusted destination for authentic gadgets with transparent pricing and warranty",
        brandTone: "Innovative, authoritative, helpful, and dependable",
      },
    });
    console.log("✓ Business Profile created");
  }

  // 4. Sample Core Products
  const sampleProducts = [
    {
      id: "prod-iphone-15-pro",
      handle: "apple-iphone-15-pro-128gb",
      title: "Apple iPhone 15 Pro (128GB, Natural Titanium)",
      description: "A17 Pro chip, titanium design, 48MP camera system with 3x Telephoto, Action button, and USB-C connectivity.",
      category: "Smartphones",
      brand: "Apple",
      vendor: "Apple Inc.",
      productType: "Smartphone",
      tags: ["Apple", "iPhone", "5G", "Flagship", "Titanium"],
      sellingPrice: 154999.00,
      costPrice: 132000.00,
      stockQuantity: 14,
      sku: "NURU-IPHONE-15P-128",
      variants: [
        {
          id: "var-iphone-15p-128",
          title: "Natural Titanium / 128GB",
          sku: "NURU-IPHONE-15P-128-NT",
          price: 154999.00,
          compareAtPrice: 165000.00,
          costPrice: 132000.00,
          stockQuantity: 14,
        },
      ],
      analysis: {
        opportunityScore: 92.5,
        bundlePotential: 88.0,
        marketingStatus: "ready_to_promote",
        lifecycleCategory: "hero_product",
      },
    },
    {
      id: "prod-s24-ultra",
      handle: "samsung-galaxy-s24-ultra-256gb",
      title: "Samsung Galaxy S24 Ultra (256GB, Titanium Gray)",
      description: "Galaxy AI powered flagship with built-in S Pen, 200MP camera with Quad Telephoto, Snapdragon 8 Gen 3 for Galaxy, and flat 6.8 QHD+ AMOLED display.",
      category: "Smartphones",
      brand: "Samsung",
      vendor: "Samsung Electronics",
      productType: "Smartphone",
      tags: ["Samsung", "Galaxy", "Galaxy AI", "Flagship", "S Pen"],
      sellingPrice: 168000.00,
      costPrice: 145000.00,
      stockQuantity: 9,
      sku: "NURU-SAM-S24U-256",
      variants: [
        {
          id: "var-s24u-256",
          title: "Titanium Gray / 256GB",
          sku: "NURU-SAM-S24U-256-GRY",
          price: 168000.00,
          compareAtPrice: 179000.00,
          costPrice: 145000.00,
          stockQuantity: 9,
        },
      ],
      analysis: {
        opportunityScore: 94.0,
        bundlePotential: 90.0,
        marketingStatus: "ready_to_promote",
        lifecycleCategory: "hero_product",
      },
    },
    {
      id: "prod-sony-wh1000xm5",
      handle: "sony-wh-1000xm5-wireless-headphones",
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      description: "Industry-leading noise cancellation with two processors and 8 microphones, exceptional sound quality with High-Res Audio, crystal clear hands-free calling, up to 30-hour battery life.",
      category: "Audio",
      brand: "Sony",
      vendor: "Sony Corporation",
      productType: "Headphones",
      tags: ["Sony", "Audio", "ANC", "Bluetooth", "Wireless"],
      sellingPrice: 48500.00,
      costPrice: 38000.00,
      stockQuantity: 22,
      sku: "NURU-SONY-XM5-BLK",
      variants: [
        {
          id: "var-sony-xm5-blk",
          title: "Black",
          sku: "NURU-SONY-XM5-BLK",
          price: 48500.00,
          compareAtPrice: 54000.00,
          costPrice: 38000.00,
          stockQuantity: 22,
        },
      ],
      analysis: {
        opportunityScore: 89.0,
        bundlePotential: 85.0,
        marketingStatus: "ready_to_promote",
        lifecycleCategory: "high_margin",
      },
    },
    {
      id: "prod-macbook-air-m3",
      handle: "macbook-air-13-inch-m3-16gb-512gb",
      title: "Apple MacBook Air 13-inch M3 (16GB RAM / 512GB SSD, Space Gray)",
      description: "Blazing-fast M3 chip, Liquid Retina display, MagSafe charging, 1080p FaceTime HD camera, silent fanless design with up to 18 hours battery life.",
      category: "Laptops",
      brand: "Apple",
      vendor: "Apple Inc.",
      productType: "Laptop",
      tags: ["Apple", "MacBook", "M3", "Laptop", "Apple Silicon"],
      sellingPrice: 189999.00,
      costPrice: 165000.00,
      stockQuantity: 6,
      sku: "NURU-MBA-M3-16-512",
      variants: [
        {
          id: "var-mba-m3-512",
          title: "Space Gray / 16GB / 512GB",
          sku: "NURU-MBA-M3-16-512-SG",
          price: 189999.00,
          compareAtPrice: 205000.00,
          costPrice: 165000.00,
          stockQuantity: 6,
        },
      ],
      analysis: {
        opportunityScore: 86.5,
        bundlePotential: 82.0,
        marketingStatus: "needs_creative",
        lifecycleCategory: "high_value",
      },
    },
    {
      id: "prod-anker-737",
      handle: "anker-737-power-bank-powercore-24k",
      title: "Anker 737 Power Bank (PowerCore 24,000mAh 140W)",
      description: "Ultra-powerful two-way fast charging with Power Delivery 3.1, smart digital display showing output/input and estimated recharge time.",
      category: "Accessories",
      brand: "Anker",
      vendor: "Anker Innovations",
      productType: "Power Bank",
      tags: ["Anker", "Power Bank", "USB-C", "Fast Charging", "Travel"],
      sellingPrice: 17500.00,
      costPrice: 12500.00,
      stockQuantity: 35,
      sku: "NURU-ANKER-737-24K",
      variants: [
        {
          id: "var-anker-737",
          title: "Black / 24,000mAh",
          sku: "NURU-ANKER-737-24K-BLK",
          price: 17500.00,
          compareAtPrice: 19500.00,
          costPrice: 12500.00,
          stockQuantity: 35,
        },
      ],
      analysis: {
        opportunityScore: 81.0,
        bundlePotential: 94.0,
        marketingStatus: "bundle_candidate",
        lifecycleCategory: "volume_driver",
      },
    },
  ];

  for (const item of sampleProducts) {
    const { variants, analysis, ...productData } = item;

    const product = await prisma.product.upsert({
      where: { handle: productData.handle },
      update: {
        ...productData,
        tenantId: tenant.id,
      },
      create: {
        ...productData,
        tenantId: tenant.id,
      },
    });

    for (const variant of variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: {
          ...variant,
          productId: product.id,
        },
        create: {
          ...variant,
          productId: product.id,
        },
      });
    }

    const existingAnalysis = await prisma.productAnalysis.findFirst({
      where: { productId: product.id },
    });

    if (existingAnalysis) {
      await prisma.productAnalysis.update({
        where: { id: existingAnalysis.id },
        data: analysis,
      });
    } else {
      await prisma.productAnalysis.create({
        data: {
          productId: product.id,
          ...analysis,
        },
      });
    }

    console.log(`✓ Product seeded: ${product.title} (SKU: ${product.sku})`);
  }

  // 5. Seed Initial Bundle Recommendations (PRD §6)
  const iphone = await prisma.product.findUnique({ where: { handle: "apple-iphone-15-pro-128gb" } });
  const anker = await prisma.product.findUnique({ where: { handle: "anker-737-power-bank-powercore-24k" } });
  const samsung = await prisma.product.findUnique({ where: { handle: "samsung-galaxy-s24-ultra-256gb" } });
  const sony = await prisma.product.findUnique({ where: { handle: "sony-wh-1000xm5-wireless-headphones" } });
  const macbook = await prisma.product.findUnique({ where: { handle: "macbook-air-13-inch-m3-16gb-512gb" } });

  if (iphone && anker) {
    const combinedPrice = Number(iphone.sellingPrice) + Number(anker.sellingPrice);
    await prisma.bundleRecommendation.upsert({
      where: { id: "bundle-creator-pack" },
      update: {},
      create: {
        id: "bundle-creator-pack",
        tenantId: tenant.id,
        name: "Mobile Creator Power Pack",
        description: "Apple iPhone 15 Pro paired with Anker 737 24K Power Bank for uninterrupted 4K video capture and fast field charging.",
        productIds: [iphone.id, anker.id],
        combinedPrice,
        individualPrices: { [iphone.id]: Number(iphone.sellingPrice), [anker.id]: Number(anker.sellingPrice) },
        marginEstimate: 21.5,
        status: "pending_approval",
      },
    });
    console.log("✓ Bundle seeded: Mobile Creator Power Pack");
  }

  if (samsung && sony) {
    const combinedPrice = Number(samsung.sellingPrice) + Number(sony.sellingPrice);
    await prisma.bundleRecommendation.upsert({
      where: { id: "bundle-audiophile-suite" },
      update: {},
      create: {
        id: "bundle-audiophile-suite",
        tenantId: tenant.id,
        name: "Executive Audiophile Suite",
        description: "Samsung Galaxy S24 Ultra combined with Sony WH-1000XM5 Wireless Noise Cancelling Headphones for hybrid executive focus.",
        productIds: [samsung.id, sony.id],
        combinedPrice,
        individualPrices: { [samsung.id]: Number(samsung.sellingPrice), [sony.id]: Number(sony.sellingPrice) },
        marginEstimate: 23.8,
        status: "approved",
      },
    });
    console.log("✓ Bundle seeded: Executive Audiophile Suite");
  }

  if (macbook && sony) {
    const combinedPrice = Number(macbook.sellingPrice) + Number(sony.sellingPrice);
    await prisma.bundleRecommendation.upsert({
      where: { id: "bundle-remote-workstation" },
      update: {},
      create: {
        id: "bundle-remote-workstation",
        tenantId: tenant.id,
        name: "Remote Pro Workstation",
        description: "Apple MacBook Air 13-inch M3 paired with Sony WH-1000XM5 Noise Cancelling Headphones for deep focus coding and design.",
        productIds: [macbook.id, sony.id],
        combinedPrice,
        individualPrices: { [macbook.id]: Number(macbook.sellingPrice), [sony.id]: Number(sony.sellingPrice) },
        marginEstimate: 24.2,
        status: "pending_approval",
      },
    });
    console.log("✓ Bundle seeded: Remote Pro Workstation");
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
