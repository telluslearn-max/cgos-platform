import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "CGOS Intelligence - Growth Opportunities & Scoring",
  description: "Commerce Growth OS - Algorithmic opportunity scoring and product performance intelligence",
};

export const dynamic = "force-dynamic";

async function getIntelligenceData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) {
      return { products: [], recommendations: [], stats: { total: 0, avgScore: 0, heroCount: 0, highMarginCount: 0 }, isLiveDb: false };
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
      }),
    ]);

    const analysisMap = new Map(analyses.map((a) => [a.productId, a]));

    const scoredProducts = products.map((p) => {
      const analysis = analysisMap.get(p.id);
      const selling = Number(p.sellingPrice);
      const cost = p.costPrice ? Number(p.costPrice) : selling * 0.8;
      const margin = selling > 0 ? Math.round(((selling - cost) / selling) * 1000) / 10 : 20;

      return {
        ...p,
        sellingPrice: selling,
        costPrice: p.costPrice ? Number(p.costPrice) : null,
        grossMarginPercent: margin,
        opportunityScore: analysis ? Number(analysis.opportunityScore) : 75.0,
        bundlePotential: analysis ? Number(analysis.bundlePotential) : 70.0,
        lifecycleCategory: analysis?.lifecycleCategory || "volume_driver",
        marketingStatus: analysis?.marketingStatus || "active",
      };
    });

    scoredProducts.sort((a, b) => b.opportunityScore - a.opportunityScore);

    const total = scoredProducts.length;
    const avgScore =
      total > 0
        ? Math.round(
            (scoredProducts.reduce((acc, p) => acc + p.opportunityScore, 0) / total) * 10
          ) / 10
        : 0;
    const heroCount = scoredProducts.filter((p) => p.lifecycleCategory === "hero_product").length;
    const highMarginCount = scoredProducts.filter((p) => p.grossMarginPercent >= 20).length;

    return {
      products: scoredProducts,
      recommendations,
      stats: { total, avgScore, heroCount, highMarginCount },
      isLiveDb: true,
    };
  } catch (error) {
    console.error("Failed to load intelligence data:", error);
    return {
      products: [],
      recommendations: [],
      stats: { total: 0, avgScore: 0, heroCount: 0, highMarginCount: 0 },
      isLiveDb: false,
    };
  }
}

export default async function IntelligencePage() {
  const { products, recommendations, stats, isLiveDb } = await getIntelligenceData();

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Top Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/overview" className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center hover:opacity-90 transition">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </Link>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Catalogue Growth Intelligence</h2>
                <p className="text-xs text-gray-500">NURU Electronics &bull; Opportunity Scoring & Recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/bundles"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md border border-purple-200"
              >
                Bundle Engine &rarr;
              </Link>
              <Link
                href="/overview"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md border border-gray-200"
              >
                &larr; Overview
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* PRD Safeguard Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-indigo-600 mt-0.5">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h2a2 2 0 002-2V5a2 2 0 00-2-2H11a2 2 0 00-2 2v6m12 4h-2m0 0h-2m2 0a2 2 0 100-4h2a2 2 0 100 4zm-2-6a2 2 0 11-4 0 2 2 0 014 0zM5 7a2 2 0 11-4 0 2 2 0 014 0zM3 15a2 2 0 11-2-2H1a2 2 0 112-2h12a2 2 0 112 2h-1M9 10v10m-7 0V5m7 0v5-3.5 3.5M15.5 15.5l3.5 3.5m1.4-1.4l-3.5-3.5M5 15a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900">PRD §5 Continuous Opportunity Scoring</h4>
            <p className="text-xs text-indigo-700 mt-0.5">
              CGOS evaluates catalogue items across gross margin, stock runway, and commercial momentum. Products with score &ge; 88.0 are ranked as <strong>Hero Products</strong> to lead upcoming marketing sprints.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catalogue Evaluated</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total} Products</p>
            <p className="text-xs text-gray-400 mt-0.5">100% coverage tracked</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Opportunity Score</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.avgScore} / 100</p>
            <p className="text-xs text-gray-400 mt-0.5">Weighted commercial rating</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Products</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.heroCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Score &ge; 88 &bull; Ample stock</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">High Margin Stock</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.highMarginCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Gross margin &ge; 20%</p>
          </div>
        </div>

        {/* Strategic Growth Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Strategic Action Items</h3>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 uppercase">
                        {rec.type}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900">{rec.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      Priority: {Number(rec.priority).toFixed(1)}
                    </span>
                    <Link
                      href="/campaigns"
                      className="text-xs font-semibold px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Act Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunity Scoring Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Product Opportunity Matrix</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ranked from highest commercial marketing potential</p>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              {isLiveDb ? "Database Connected" : "Connecting..."}
            </span>
          </div>

          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Rank & Product</th>
                    <th className="px-6 py-3 font-semibold">Opportunity Score</th>
                    <th className="px-6 py-3 font-semibold">Gross Margin</th>
                    <th className="px-6 py-3 font-semibold">Inventory Runway</th>
                    <th className="px-6 py-3 font-semibold">Lifecycle Segment</th>
                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold font-mono text-gray-400 w-5">#{idx + 1}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{p.title}</div>
                            <div className="text-xs text-gray-500">{p.category} &bull; <span className="font-mono">{p.sku}</span></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-extrabold text-sm ${
                              p.opportunityScore >= 88
                                ? "text-emerald-600"
                                : p.opportunityScore >= 80
                                ? "text-indigo-600"
                                : "text-amber-600"
                            }`}
                          >
                            {p.opportunityScore.toFixed(1)}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                p.opportunityScore >= 88
                                  ? "bg-emerald-500"
                                  : p.opportunityScore >= 80
                                  ? "bg-indigo-500"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${p.opportunityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {p.grossMarginPercent}%
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            p.stockQuantity >= 10
                              ? "bg-green-100 text-green-800"
                              : p.stockQuantity >= 5
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                            p.lifecycleCategory === "hero_product"
                              ? "bg-emerald-100 text-emerald-800"
                              : p.lifecycleCategory === "high_margin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {p.lifecycleCategory.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href="/bundles"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          Find Bundles &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm text-gray-500">
                Run <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">npm run seed</code> or trigger scoring via <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">POST /api/intelligence</code>.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
