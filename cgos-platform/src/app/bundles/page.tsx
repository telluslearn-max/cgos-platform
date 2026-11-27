import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "Bundles | CGOS — NURU Electronics",
  description: "Commerce Growth OS - Cross-sell and complementary product bundle intelligence",
};

export const dynamic = "force-dynamic";

async function getBundlesData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) {
      return { bundles: [], stats: { total: 0, avgMargin: 0, pending: 0, approved: 0 } };
    }

    const rawBundles = await prisma.bundleRecommendation.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    const allProductIds = Array.from(new Set(rawBundles.flatMap((b) => b.productIds)));
    const products = await prisma.product.findMany({
      where: { id: { in: allProductIds } },
      select: { id: true, title: true, sellingPrice: true, sku: true, stockQuantity: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const bundles = rawBundles.map((b) => ({
      ...b,
      combinedPrice: Number(b.combinedPrice),
      marginEstimate: b.marginEstimate ? Number(b.marginEstimate) : 0,
      products: b.productIds
        .map((id) => productMap.get(id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined)
        .map((p) => ({ ...p, sellingPrice: Number(p.sellingPrice) })),
    }));

    const total = bundles.length;
    const pending = bundles.filter((b) => b.status === "pending_approval").length;
    const approved = bundles.filter((b) => b.status === "approved").length;
    const avgMargin =
      total > 0
        ? Math.round((bundles.reduce((acc, b) => acc + (b.marginEstimate || 0), 0) / total) * 10) / 10
        : 0;

    return { bundles, stats: { total, avgMargin, pending, approved } };
  } catch (error) {
    console.error("Failed to load bundles:", error);
    return { bundles: [], stats: { total: 0, avgMargin: 0, pending: 0, approved: 0 } };
  }
}

export default async function BundlesPage() {
  const { bundles, stats } = await getBundlesData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <GlobalNav currentPath="/bundles" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-400">Phase 2 Intelligence</span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Bundle Discovery Engine</h1>
            <p className="text-xs text-zinc-400">
              Complementary hardware pairings designed to lift Average Order Value (AOV) without margin erosion
            </p>
          </div>
          <Link
            href="/campaigns"
            className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
          >
            Campaign Economics &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Discovered Bundles</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">{stats.total}</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Average Margin</span>
            <div className="text-2xl font-semibold text-emerald-400 mt-1.5 font-mono">{stats.avgMargin}%</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Awaiting Approval</span>
            <div className="text-2xl font-semibold text-amber-400 mt-1.5 font-mono">{stats.pending}</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Approved Bundles</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">{stats.approved}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bundles.map((bundle) => (
            <div key={bundle.id} className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">{bundle.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{bundle.description}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px] uppercase whitespace-nowrap">
                  {bundle.status.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-2 border-t border-zinc-800/80 pt-3">
                {bundle.products.map((prod) => (
                  <div key={prod.id} className="flex justify-between text-xs">
                    <span className="text-zinc-300">{prod.title}</span>
                    <span className="font-mono text-zinc-400">KES {prod.sellingPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs font-mono">
                <span className="text-zinc-400">
                  Est. Margin: <strong className="text-emerald-400">{bundle.marginEstimate}%</strong>
                </span>
                <span className="text-white font-semibold">
                  Combined Price: KES {bundle.combinedPrice.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
