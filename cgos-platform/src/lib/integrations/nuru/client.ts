import { NuruProductPayload } from "./types";

export interface NuruClientConfig {
  baseUrl?: string;
  apiToken?: string;
  timeoutMs?: number;
}

export class NuruCommerceClient {
  private baseUrl: string;
  private apiToken?: string;
  private timeoutMs: number;

  constructor(config: NuruClientConfig = {}) {
    this.baseUrl = (config.baseUrl || process.env.NURU_API_URL || "https://www.nuruelectronics.com").replace(/\/$/, "");
    this.apiToken = config.apiToken || process.env.NURU_API_TOKEN || process.env.NURU_BEARER_TOKEN;
    this.timeoutMs = config.timeoutMs || 10000;
  }

  /**
   * Test connection and verify API reachability
   */
  async checkHealth(): Promise<{ ok: boolean; status: string; latencyMs?: number }> {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: "GET",
        headers: this.buildHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        return { ok: true, status: "healthy", latencyMs };
      }
      return { ok: false, status: `http_${response.status}`, latencyMs };
    } catch (error) {
      return {
        ok: false,
        status: error instanceof Error ? error.message : "unreachable",
      };
    }
  }

  /**
   * Fetch live catalogue products from NURU Electronics API.
   * Falls back to high-fidelity reference catalogue if the endpoint is not yet connected.
   */
  async fetchProducts(): Promise<{ products: NuruProductPayload[]; source: "live_api" | "fallback_catalogue" }> {
    if (this.apiToken) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(`${this.baseUrl}/api/admin/products`, {
          method: "GET",
          headers: this.buildHeaders(),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data?.products)) {
            return {
              products: data.products as NuruProductPayload[],
              source: "live_api",
            };
          }
        }
      } catch (err) {
        console.warn("NURU live API request failed, falling back to reference catalogue:", err);
      }
    }

    return {
      products: this.getFallbackCatalogue(),
      source: "fallback_catalogue",
    };
  }

  private buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "CGOS-Commerce-Adapter/1.0",
    };

    if (this.apiToken) {
      headers["Authorization"] = `Bearer ${this.apiToken}`;
    }

    return headers;
  }

  /**
   * Reference catalogue representing NURU Electronics real inventory
   */
  private getFallbackCatalogue(): NuruProductPayload[] {
    return [
      {
        id: "nuru-prod-1",
        handle: "apple-iphone-15-pro-128gb",
        title: "Apple iPhone 15 Pro (128GB, Natural Titanium)",
        description: "Titanium design, A17 Pro chip, customizable Action button, 48MP main camera system with 3x Telephoto.",
        category: "Smartphones",
        brand: "Apple",
        vendor: "Apple Inc.",
        productType: "Smartphone",
        tags: ["Apple", "iPhone", "5G", "Flagship", "Titanium"],
        sellingPrice: 154999.00,
        costPrice: 132000.00,
        stockQuantity: 14,
        sku: "NURU-IPHONE-15P-128",
        images: [
          { url: "https://www.nuruelectronics.com/images/products/iphone-15-pro.png", altText: "iPhone 15 Pro Natural Titanium" }
        ],
        variants: [
          {
            id: "var-iph-15p-128-nt",
            sku: "NURU-IPHONE-15P-128-NT",
            title: "Natural Titanium / 128GB",
            price: 154999.00,
            compareAtPrice: 165000.00,
            costPrice: 132000.00,
            stockQuantity: 14,
          }
        ]
      },
      {
        id: "nuru-prod-2",
        handle: "samsung-galaxy-s24-ultra-256gb",
        title: "Samsung Galaxy S24 Ultra (256GB, Titanium Gray)",
        description: "Galaxy AI capabilities, built-in S Pen, 200MP camera with Quad Telephoto, Snapdragon 8 Gen 3.",
        category: "Smartphones",
        brand: "Samsung",
        vendor: "Samsung Electronics",
        productType: "Smartphone",
        tags: ["Samsung", "Galaxy", "Galaxy AI", "S Pen", "Flagship"],
        sellingPrice: 168000.00,
        costPrice: 145000.00,
        stockQuantity: 9,
        sku: "NURU-SAM-S24U-256",
        images: [
          { url: "https://www.nuruelectronics.com/images/products/s24-ultra.png", altText: "Samsung Galaxy S24 Ultra" }
        ],
        variants: [
          {
            id: "var-s24u-256-gry",
            sku: "NURU-SAM-S24U-256-GRY",
            title: "Titanium Gray / 256GB",
            price: 168000.00,
            compareAtPrice: 179000.00,
            costPrice: 145000.00,
            stockQuantity: 9,
          }
        ]
      },
      {
        id: "nuru-prod-3",
        handle: "sony-wh-1000xm5-wireless-headphones",
        title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        description: "Industry-leading noise cancellation, Hi-Res wireless audio, lightweight design, and 30-hour battery life.",
        category: "Audio",
        brand: "Sony",
        vendor: "Sony Corporation",
        productType: "Headphones",
        tags: ["Sony", "Audio", "ANC", "Wireless", "Headphones"],
        sellingPrice: 48500.00,
        costPrice: 38000.00,
        stockQuantity: 22,
        sku: "NURU-SONY-XM5-BLK",
        images: [
          { url: "https://www.nuruelectronics.com/images/products/sony-xm5.png", altText: "Sony WH-1000XM5 Black" }
        ],
        variants: [
          {
            id: "var-sony-xm5-blk",
            sku: "NURU-SONY-XM5-BLK",
            title: "Black",
            price: 48500.00,
            compareAtPrice: 54000.00,
            costPrice: 38000.00,
            stockQuantity: 22,
          }
        ]
      },
      {
        id: "nuru-prod-4",
        handle: "macbook-air-13-inch-m3-16gb-512gb",
        title: "Apple MacBook Air 13-inch M3 (16GB RAM / 512GB SSD, Space Gray)",
        description: "Apple M3 chip with 8-core CPU and 10-core GPU, Liquid Retina display, MagSafe charging, 18-hour battery.",
        category: "Laptops",
        brand: "Apple",
        vendor: "Apple Inc.",
        productType: "Laptop",
        tags: ["Apple", "MacBook", "M3", "Laptop", "Apple Silicon"],
        sellingPrice: 189999.00,
        costPrice: 165000.00,
        stockQuantity: 6,
        sku: "NURU-MBA-M3-16-512",
        images: [
          { url: "https://www.nuruelectronics.com/images/products/macbook-air-m3.png", altText: "MacBook Air M3 Space Gray" }
        ],
        variants: [
          {
            id: "var-mba-m3-512-sg",
            sku: "NURU-MBA-M3-16-512-SG",
            title: "Space Gray / 16GB / 512GB",
            price: 189999.00,
            compareAtPrice: 205000.00,
            costPrice: 165000.00,
            stockQuantity: 6,
          }
        ]
      },
      {
        id: "nuru-prod-5",
        handle: "anker-737-power-bank-powercore-24k",
        title: "Anker 737 Power Bank (PowerCore 24,000mAh 140W)",
        description: "Ultra-powerful two-way fast charging with Power Delivery 3.1, smart digital display showing output/input.",
        category: "Accessories",
        brand: "Anker",
        vendor: "Anker Innovations",
        productType: "Power Bank",
        tags: ["Anker", "Power Bank", "USB-C", "Fast Charging", "Travel"],
        sellingPrice: 17500.00,
        costPrice: 12500.00,
        stockQuantity: 35,
        sku: "NURU-ANKER-737-24K",
        images: [
          { url: "https://www.nuruelectronics.com/images/products/anker-737.png", altText: "Anker 737 Power Bank" }
        ],
        variants: [
          {
            id: "var-anker-737-blk",
            sku: "NURU-ANKER-737-24K-BLK",
            title: "Black / 24,000mAh",
            price: 17500.00,
            compareAtPrice: 19500.00,
            costPrice: 12500.00,
            stockQuantity: 35,
          }
        ]
      },
      {
        id: "nuru-prod-6",
        handle: "google-pixel-8-pro-128gb",
        title: "Google Pixel 8 Pro (128GB, Obsidian)",
        description: "Google Tensor G3 chip, fully upgraded pro triple camera system with Super Res Zoom, Pro controls, and Best Take.",
        category: "Smartphones",
        brand: "Google",
        vendor: "Google LLC",
        productType: "Smartphone",
        tags: ["Google", "Pixel", "Tensor", "AI", "Camera"],
        sellingPrice: 129000.00,
        costPrice: 108000.00,
        stockQuantity: 11,
        sku: "NURU-PIXEL-8P-128",
        images: [
          { url: "https://www.nuruelectronics.com/images/products/pixel-8-pro.png", altText: "Google Pixel 8 Pro Obsidian" }
        ],
        variants: [
          {
            id: "var-pixel-8p-128-obs",
            sku: "NURU-PIXEL-8P-128-OBS",
            title: "Obsidian / 128GB",
            price: 129000.00,
            compareAtPrice: 139000.00,
            costPrice: 108000.00,
            stockQuantity: 11,
          }
        ]
      }
    ];
  }
}
