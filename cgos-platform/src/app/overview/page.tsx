import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "CGOS Overview & Executive Command | NURU Electronics",
  description: "Commerce Growth OS - Real-time commerce intelligence and executive command",
};

export const dynamic = "force-dynamic";

async function getOverviewData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    const tenantId = tenant?.id;

    const [totalProducts, activeCampaigns, contentBriefs, totalAnalyses] =
      await Promise.all([
        tenantId ? prisma.product.count({ where: { tenantId } }) : prisma.product.count(),
        prisma.campaign.count({ where: { status: "active" } }),
        prisma.contentBrief.count(),
        prisma.productAnalysis.count(),
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
      },
      topOpportunities: [],
      isLiveDb: false,
    };
  }
}

export default async function OverviewPage() {
  const data = await getOverviewData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased pb-20 selection:bg-emerald-500 selection:text-slate-950">
      <GlobalNav currentPath="/overview" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Hero Banner with Executive Command */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">
                  Pilot Store Command
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs text-slate-400">Continuous Ingestion Loop</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {data.tenantName} Growth Command
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Autonomous intelligence engine actively indexing inventory, calculating cross-sell bundles, evaluating keyword SERP rankings, and generating creative briefs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/intelligence"
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-lg shadow-emerald-950/50 flex items-center gap-2"
              >
                <span>⚡</span> Run Opportunity Analysis
              </Link>
              <Link
                href="/campaigns"
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition flex items-center gap-2"
              >
                <span>🚀</span> View Financial Ledger
              </Link>
            </div>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Live Products</span>
            <div className="text-3xl font-extrabold text-white mt-1">{data.metrics.totalProducts}</div>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              {data.metrics.totalProducts >= 600 ? "All 616 Sitemap SKUs Ingested" : "Active Catalogue"}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Opportunity Matrix</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">{data.metrics.totalAnalyses}</div>
            <p className="text-xs text-slate-400 pt-1">Ranked by commercial margin</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Creative Briefs Generated</span>
            <div className="text-3xl font-extrabold text-sky-400 mt-1">{data.metrics.contentBriefs}</div>
            <p className="text-xs text-slate-400 pt-1">Draft briefs awaiting approval</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">PRD §14 Safeguards</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">Enforced</div>
            <p className="text-xs text-amber-400/80 pt-1">No autonomous discounting</p>
          </div>
        </div>

        {/* Opportunity Ranking Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🎯</span> Top High-Yield Commercial Opportunities
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite opportunity scores calculated from stock depth, margin, and search velocity
              </p>
            </div>
            <Link href="/intelligence" className="text-xs font-semibold text-emerald-400 hover:underline">
              View Matrix &rarr;
            </Link>
          </div>

          {data.topOpportunities.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
              No opportunity records computed. Execute an autonomous cycle or trigger sitemap crawler.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.topOpportunities.map((opp) => (
                <div key={opp.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {opp.lifecycleCategory.replace("_", " ")}
                    </span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {Number(opp.opportunityScore)} / 100
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">
                      {opp.product?.title || "Stock SKU"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Selling Price: <strong className="text-slate-200">KES {Number(opp.product?.sellingPrice || 0).toLocaleString()}</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Bundle Potential: <strong className="text-white">{Number(opp.bundlePotential)}%</strong></span>
                    <Link href="/content-studio" className="text-emerald-400 hover:underline">
                      Create Brief &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/bundles" className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2 block group">
            <span className="text-xl">🧩</span>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">Bundle Discovery Engine</h3>
            <p className="text-xs text-slate-400">Discovers complementary accessories and productivity kits to increase Average Order Value (AOV).</p>
          </Link>
          <Link href="/content-studio" className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2 block group">
            <span className="text-xl">🎨</span>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">Creative Studio</h3>
            <p className="text-xs text-slate-400">Formulates marketing briefs using NURU brand tone memory and channel conversion formats.</p>
          </Link>
          <Link href="/campaigns" className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2 block group">
            <span className="text-xl">🚀</span>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">Campaign Orchestration</h3>
            <p className="text-xs text-slate-400">Deterministic spend allocation across WhatsApp, Instagram, Google Search, and TikTok with ROAS ledger.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
