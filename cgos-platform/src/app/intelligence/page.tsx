import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "Intelligence | CGOS — NURU Electronics",
  description: "Commerce Growth OS - Algorithmic opportunity scoring and product performance intelligence",
};

export const dynamic = "force-dynamic";

async function getIntelligenceData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) {
      return { products: [], recommendations: [], stats: { total: 0, avgScore: 0, heroCount: 0, highMarginCount: 0 } };
    }

    const [products, analyses, recommendations] = await Promise.all([
      prisma.product.findMany({
        where: { tenantId: tenant.id },
        select: {
          id: true,
          handle: true,
          title: true,
          brand: true,
          category: true,
          sellingPrice: true,
          costPrice: true,
          stockQuantity: true,
          sku: true,
        },
      }),
      prisma.productAnalysis.findMany(),
      prisma.growthRecommendation.findMany({
        where: { tenantId: tenant.id },
        orderBy: { priority: "desc" },
        take: 6,
      }),
    ]);

    const analysisMap = new Map(analyses.map((a) => [a.productId, a]));

    const scoredProducts = products.map((p) => {
      const analysis = analysisMap.get(p.id);
      const selling = Number(p.sellingPrice);
      const cost = p.costPrice ? Number(p.costPrice) : selling * 0.76;
      const margin = selling > 0 ? Math.round(((selling - cost) / selling) * 1000) / 10 : 24;

      return {
        ...p,
        sellingPrice: selling,
        grossMarginPercent: margin,
        opportunityScore: analysis ? Number(analysis.opportunityScore) : 75.0,
        bundlePotential: analysis ? Number(analysis.bundlePotential) : 70.0,
        lifecycleCategory: analysis?.lifecycleCategory || "volume_driver",
      };
    });

    scoredProducts.sort((a, b) => b.opportunityScore - a.opportunityScore);

    const total = scoredProducts.length;
    const avgScore =
      total > 0
        ? Math.round((scoredProducts.reduce((acc, p) => acc + p.opportunityScore, 0) / total) * 10) / 10
        : 0;
    const heroCount = scoredProducts.filter((p) => p.lifecycleCategory === "hero_product").length;
    const highMarginCount = scoredProducts.filter((p) => p.grossMarginPercent >= 20).length;

    return {
      products: scoredProducts.slice(0, 100),
      recommendations,
      stats: { total, avgScore, heroCount, highMarginCount },
    };
  } catch (error) {
    console.error("Failed to load intelligence data:", error);
    return {
      products: [],
      recommendations: [],
      stats: { total: 0, avgScore: 0, heroCount: 0, highMarginCount: 0 },
    };
  }
}

export default async function IntelligencePage() {
  const { products, recommendations, stats } = await getIntelligenceData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <GlobalNav currentPath="/intelligence" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-400">Phase 2 Intelligence</span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Opportunity Scoring Matrix</h1>
            <p className="text-xs text-zinc-400">
              Composite commercial ranking across margin, inventory depth, and bundle compatibility
            </p>
          </div>
          <Link
            href="/bundles"
            className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
          >
            View Bundles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Products Evaluated</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">{stats.total}</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Average Score</span>
            <div className="text-2xl font-semibold text-emerald-400 mt-1.5 font-mono">{stats.avgScore} / 100</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Hero Products</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">{stats.heroCount}</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">High-Margin SKUs (&ge;20%)</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">{stats.highMarginCount}</div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white">Autonomous Priority Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-xs text-white">{rec.title}</span>
                    <span className="text-[11px] font-mono text-emerald-400">Priority {Number(rec.priority)}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800/80 font-medium">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Lifecycle</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Margin</th>
                  <th className="py-3 px-4 text-right">Stock</th>
                  <th className="py-3 px-4 text-right">Opportunity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {products.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-3 px-4 text-zinc-500">#{idx + 1}</td>
                    <td className="py-3 px-4 font-sans font-medium text-zinc-100">{p.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px]">
                        {p.lifecycleCategory.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-200">KES {p.sellingPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{p.grossMarginPercent}%</td>
                    <td className="py-3 px-4 text-right text-zinc-400">{p.stockQuantity}</td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-400">{p.opportunityScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
