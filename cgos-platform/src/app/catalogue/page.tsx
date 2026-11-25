import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "Live Catalogue & Stock Intelligence | NURU Electronics",
  description: "Commerce Growth OS - Real-time inventory status, margins, and stock intelligence",
};

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const totalCount = await prisma.product.count();

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
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased pb-20 selection:bg-emerald-500 selection:text-slate-950">
      <GlobalNav currentPath="/catalogue" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Header / Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <h1 className="text-2xl font-extrabold text-white">Live Storefront Catalogue</h1>
            </div>
            <p className="text-xs text-slate-400">
              Showing <strong className="text-white">{products.length}</strong> of <strong className="text-emerald-400">{totalCount}</strong> indexed hardware SKUs from NURU Electronics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              {isLiveDb ? "Database Connected" : "Connecting..."}
            </span>
            <Link
              href="/intelligence"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
            >
              Analyze Opportunities &rarr;
            </Link>
          </div>
        </div>

        {/* Product Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Product Title</th>
                  <th className="py-3.5 px-3">Brand</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-3">Wholesale Margin</th>
                  <th className="py-3.5 px-3">Stock Units</th>
                  <th className="py-3.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-sans text-sm">
                      No products found in catalogue. Ingestion in progress.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const margin = p.costPrice
                      ? Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 1000) / 10
                      : 24.0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition font-sans">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{p.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block">{p.sku || p.handle}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300 font-medium">{p.brand || "NURU"}</td>
                        <td className="py-3.5 px-3 text-slate-400 text-xs">{p.category || "Electronics"}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          KES {p.sellingPrice.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-sky-400">{margin}%</td>
                        <td className="py-3.5 px-3 font-mono text-slate-300">{p.stockQuantity} units</td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
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
