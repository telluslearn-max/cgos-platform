import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";
import { crawlAndSyncFullNuruSitemap } from "@/lib/integrations/nuru/sitemapCrawler";
import { runOpportunityScoring } from "@/lib/intelligence/scoring";

export const metadata = {
  title: "Overview | CGOS — NURU Electronics",
  description: "Commerce Growth OS - Real-time commerce intelligence and executive command",
};

export const dynamic = "force-dynamic";

async function getOverviewData() {
  try {
    let tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    let totalProducts = tenant
      ? await prisma.product.count({ where: { tenantId: tenant.id } })
      : await prisma.product.count();

    // Auto-populate full storefront sitemap if only seed/fallback products exist
    if (totalProducts <= 6) {
      try {
        await crawlAndSyncFullNuruSitemap();
        await runOpportunityScoring("nuru-electronics");
        tenant = await prisma.tenant.findFirst({
          where: { slug: "nuru-electronics" },
        });
        totalProducts = tenant
          ? await prisma.product.count({ where: { tenantId: tenant.id } })
          : await prisma.product.count();
      } catch (syncErr) {
        console.warn("Auto-crawl fallback:", syncErr);
      }
    }

    const tenantId = tenant?.id;

    const [activeCampaigns, contentBriefs, totalAnalyses, totalBundles] = await Promise.all([
      prisma.campaign.count({ where: { status: "active" } }),
      prisma.contentBrief.count(),
      prisma.productAnalysis.count(),
      prisma.bundleRecommendation.count(),
    ]);

    const topOpportunities = await prisma.productAnalysis.findMany({
      take: 6,
      orderBy: { opportunityScore: "desc" },
    });

    const productIds = topOpportunities.map((o) => o.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    return {
      tenantName: tenant?.name || "NURU Electronics",
      tenantLocation: tenant?.location || "Nairobi, Kenya",
      metrics: {
        totalProducts,
        activeCampaigns,
        contentBriefs,
        totalAnalyses,
        totalBundles,
      },
      topOpportunities: topOpportunities.map((o) => ({
        ...o,
        product: productMap.get(o.productId),
      })),
      isLiveDb: true,
    };
  } catch (err) {
    console.error("Overview data fetch error:", err);
    return {
      tenantName: "NURU Electronics",
      tenantLocation: "Nairobi, Kenya",
      metrics: {
        totalProducts: 0,
        activeCampaigns: 0,
        contentBriefs: 0,
        totalAnalyses: 0,
        totalBundles: 0,
      },
      topOpportunities: [],
      isLiveDb: false,
    };
  }
}

export default async function OverviewPage() {
  const data = await getOverviewData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased pb-20">
      <GlobalNav currentPath="/overview" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Executive Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="text-emerald-400 font-medium">{data.tenantName}</span>
              <span>/</span>
              <span>{data.tenantLocation}</span>
              <span>/</span>
              <span>{data.isLiveDb ? "PostgreSQL Connected" : "Offline"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Executive Command
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Live catalogue intelligence, opportunity scoring, and capital allocation across your NURU Electronics inventory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/intelligence"
              className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
            >
              Opportunity Matrix
            </Link>
            <Link
              href="/campaigns"
              className="px-3.5 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium text-xs transition-colors"
            >
              Campaign Economics
            </Link>
            <Link
              href="/integrations"
              className="px-3.5 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium text-xs transition-colors"
            >
              Sync Controls
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/catalogue" className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors block">
            <span className="text-xs font-medium text-zinc-400">Indexed Catalogue</span>
            <div className="text-3xl font-semibold text-white mt-1.5 font-mono">
              {data.metrics.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-400 mt-2">
              {data.metrics.totalProducts >= 600 ? "Full storefront sitemap synced" : "Active hardware SKUs"}
            </p>
          </Link>

          <Link href="/intelligence" className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors block">
            <span className="text-xs font-medium text-zinc-400">Scored Opportunities</span>
            <div className="text-3xl font-semibold text-white mt-1.5 font-mono">
              {data.metrics.totalAnalyses.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-400 mt-2">Ranked by margin & stock depth</p>
          </Link>

          <Link href="/bundles" className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors block">
            <span className="text-xs font-medium text-zinc-400">Bundle Pairings</span>
            <div className="text-3xl font-semibold text-white mt-1.5 font-mono">
              {data.metrics.totalBundles}
            </div>
            <p className="text-xs text-zinc-400 mt-2">AOV-lifting cross-sell kits</p>
          </Link>

          <Link href="/content-studio" className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors block">
            <span className="text-xs font-medium text-zinc-400">Creative Briefs</span>
            <div className="text-3xl font-semibold text-white mt-1.5 font-mono">
              {data.metrics.contentBriefs}
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {data.metrics.activeCampaigns} active campaign{data.metrics.activeCampaigns === 1 ? "" : "s"}
            </p>
          </Link>
        </div>

        {/* Top Opportunities Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Top Commercial Opportunities</h2>
              <p className="text-xs text-zinc-400">
                Highest-scoring products ready for campaign allocation
              </p>
            </div>
            <Link href="/intelligence" className="text-xs font-medium text-emerald-400 hover:underline">
              View all &rarr;
            </Link>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800/80 font-medium">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Lifecycle</th>
                    <th className="py-3 px-4 text-right">Selling Price</th>
                    <th className="py-3 px-4 text-right">Bundle Fit</th>
                    <th className="py-3 px-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {data.topOpportunities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-zinc-500">
                        No scored opportunities yet. Visit Integrations to run a sync.
                      </td>
                    </tr>
                  ) : (
                    data.topOpportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-zinc-900/60 transition-colors">
                        <td className="py-3 px-4 font-medium text-zinc-100">
                          {opp.product?.title || "Catalog SKU"}
                        </td>
                        <td className="py-3 px-4 text-zinc-400">
                          {opp.product?.category || "Electronics"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]">
                            {opp.lifecycleCategory.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-200">
                          KES {Number(opp.product?.sellingPrice || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-400">
                          {Number(opp.bundlePotential)}%
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400">
                          {Number(opp.opportunityScore)} / 100
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
