import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "Catalogue | CGOS — NURU Electronics",
  description: "Commerce Growth OS - Real-time inventory status, margins, and stock intelligence",
};

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        orderBy: [{ stockQuantity: "desc" }, { createdAt: "desc" }],
        take: 150,
      }),
      prisma.product.count(),
    ]);

    return {
      products: products.map((p) => ({
        ...p,
        sellingPrice: Number(p.sellingPrice),
        costPrice: p.costPrice ? Number(p.costPrice) : null,
      })),
      totalCount,
      isLiveDb: true,
    };
  } catch (error) {
    console.error("Error loading catalogue products:", error);
    return {
      products: [],
      totalCount: 0,
      isLiveDb: false,
    };
  }
}

export default async function CataloguePage() {
  const { products, totalCount, isLiveDb } = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased pb-20">
      <GlobalNav currentPath="/catalogue" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-400">
              Inventory &bull; {isLiveDb ? "Connected" : "Offline"}
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Product Catalogue</h1>
            <p className="text-xs text-zinc-400">
              Displaying <span className="text-white font-mono">{products.length}</span> of{" "}
              <span className="text-emerald-400 font-mono">{totalCount}</span> indexed NURU Electronics SKUs.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/integrations"
              className="px-3.5 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium text-xs transition-colors"
            >
              Sync Sitemap
            </Link>
            <Link
              href="/intelligence"
              className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
            >
              Opportunity Matrix
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800/80 font-medium">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-right">Est. Margin</th>
                  <th className="py-3 px-4 text-right">Stock</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      No products found in catalogue.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const margin = p.costPrice
                      ? Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 1000) / 10
                      : 24.0;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-900/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-zinc-100">{p.title}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">{p.sku || p.handle}</div>
                        </td>
                        <td className="py-3 px-4 text-zinc-300">{p.brand || "NURU"}</td>
                        <td className="py-3 px-4 text-zinc-400">{p.category || "Electronics"}</td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-100">
                          KES {p.sellingPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-400">{margin}%</td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-300">{p.stockQuantity}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] uppercase">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
