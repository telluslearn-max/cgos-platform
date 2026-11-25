export interface NuruVariantPayload {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  stockQuantity: number;
  selectedOptions?: Record<string, string>;
}

export interface NuruProductPayload {
  id: string;
  handle: string;
  title: string;
  description: string;
  category?: string;
  brand?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  sellingPrice: number;
  costPrice?: number | null;
  stockQuantity: number;
  sku?: string;
  images?: Array<{
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  }>;
  variants: NuruVariantPayload[];
  updatedAt?: string;
}

export interface NuruSyncResult {
  success: boolean;
  syncedProducts: number;
  syncedVariants: number;
  syncedImages: number;
  errors: string[];
  timestamp: string;
  source: "live_api" | "fallback_catalogue";
}
