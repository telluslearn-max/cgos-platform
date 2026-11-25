import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "CGOS Bundles - Cross-Sell & Bundle Intelligence",
  description: "Commerce Growth OS - Discovers complementary pairings that lift average order value and margin",
};

export const dynamic = "force-dynamic";

async function getBundlesData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) {
      return { bundles: [], stats: { total: 0, avgMargin: 0, pending: 0, approved: 0 }, isLiveDb: false };
    }

    const rawBundles = await prisma.bundleRecommendation.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    const allProductIds = Array.from(new Set(rawBundles.flatMap((b) => b.productIds)));
    const products = await prisma.product.findMany({
      where: { id: { in: allProductIds } },
      select: {
        id: true,
        title: true,
        brand: true,
        category: true,
        sellingPrice: true,
        sku: true,
        stockQuantity: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const bundles = rawBundles.map((b) => ({
      ...b,
      combinedPrice: Number(b.combinedPrice),
      marginEstimate: b.marginEstimate ? Number(b.marginEstimate) : 0,
      products: b.productIds
        .map((id) => productMap.get(id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined)
        .map((p) => ({
          ...p,
          sellingPrice: Number(p.sellingPrice),
        })),
    }));

    const total = bundles.length;
    const pending = bundles.filter((b) => b.status === "pending_approval").length;
    const approved = bundles.filter((b) => b.status === "approved").length;
    const avgMargin =
      total > 0
        ? Math.round(
            (bundles.reduce((acc, b) => acc + (b.marginEstimate || 0), 0) / total) * 10
          ) / 10
        : 0;

    return {
      bundles,
      stats: { total, avgMargin, pending, approved },
      isLiveDb: true,
    };
  } catch (error) {
    console.error("Failed to load bundles:", error);
    return {
      bundles: [],
      stats: { total: 0, avgMargin: 0, pending: 0, approved: 0 },
      isLiveDb: false,
    };
  }
}

export default async function BundlesPage() {
  const { bundles, stats, isLiveDb } = await getBundlesData();

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Top Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/overview" className="h-10 w-10 rounded-md bg-purple-600 flex items-center justify-center hover:opacity-90 transition">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </Link>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bundle & Cross-Sell Intelligence</h2>
                <p className="text-xs text-gray-500">NURU Electronics &bull; Phase 2 Discovery Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/overview"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md border border-gray-200"
              >
                &larr; Overview
              </Link>
              <Link
                href="/catalogue"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md border border-purple-200"
              >
                Catalogue
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* PRD Safeguard Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-purple-600 mt-0.5">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-900">PRD §6 Commercial Bundle Principles</h4>
            <p className="text-xs text-purple-700 mt-0.5">
              CGOS distinguishes a bundle from a discount. It identifies high-affinity complementary items to lift basket size. Bundle publication, discounting, and promotional pricing strictly require human approval.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Discovered</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-0.5">Product pairings evaluated</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Gross Margin</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.avgMargin}%</p>
            <p className="text-xs text-gray-400 mt-0.5">Estimated bundle profitability</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Review</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            <p className="text-xs text-gray-400 mt-0.5">Awaiting human sign-off</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved Bundles</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.approved}</p>
            <p className="text-xs text-gray-400 mt-0.5">Ready for campaign execution</p>
          </div>
        </div>

        {/* Bundle Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Discovered Bundle Recommendations</h3>
            <span className="text-xs text-gray-500">
              {isLiveDb ? "Connected to PostgreSQL" : "Connecting..."}
            </span>
          </div>

          {bundles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:border-purple-300 transition"
                >
                  <div>
                    {/* Header: Title & Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{bundle.name}</h4>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                          {bundle.marginEstimate ? `${bundle.marginEstimate}% Gross Margin` : "Margin Estimated"}
                        </span>
                      </div>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          bundle.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : bundle.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {bundle.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{bundle.description}</p>

                    {/* Products in Bundle */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Included Products</p>
                      {bundle.products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                          <div>
                            <span className="font-semibold text-gray-900">{product.title}</span>
                            <span className="text-gray-400 ml-1.5 font-mono">({product.sku})</span>
                          </div>
                          <span className="font-semibold text-gray-800">
                            KES {product.sellingPrice.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Footer & Actions */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Combined Value</p>
                      <p className="text-xl font-extrabold text-gray-900">
                        KES {bundle.combinedPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/campaigns"
                        className="text-xs font-semibold px-3 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
                      >
                        Plan Campaign &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-gray-900">No bundles generated yet</h4>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                Run the bundle discovery engine via <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-mono">npm run seed</code> or call <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-mono">POST /api/bundles</code>.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
