import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "CGOS Dashboard - Commerce Growth OS",
  description: "Commerce Growth OS - AI-powered commerce intelligence and marketing execution platform",
};

export const dynamic = "force-dynamic";

async function getOverviewData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    const tenantId = tenant?.id;

    const [totalProducts, activeVariants, activeCampaigns, contentBriefs, growthRecommendations] =
      await Promise.all([
        tenantId ? prisma.product.count({ where: { tenantId } }) : prisma.product.count(),
        prisma.productVariant.count(),
        prisma.campaign.count({ where: { status: "active" } }),
        prisma.contentBrief.count(),
        prisma.productAnalysis.count(),
      ]);

    const topOpportunities = await prisma.productAnalysis.findMany({
      take: 4,
      orderBy: { opportunityScore: "desc" },
    });

    return {
      tenantName: tenant?.name || "NURU Electronics (Pilot)",
      tenantLocation: tenant?.location || "Nairobi, Kenya",
      metrics: {
        totalProducts,
        activeVariants,
        activeCampaigns,
        contentBriefs,
        growthRecommendations,
      },
      topOpportunities,
      isLiveDb: true,
    };
  } catch (err) {
    console.error("Overview data fetch error:", err);
    return {
      tenantName: "NURU Electronics (Pilot)",
      tenantLocation: "Nairobi, Kenya",
      metrics: {
        totalProducts: 0,
        activeVariants: 0,
        activeCampaigns: 0,
        contentBriefs: 0,
        growthRecommendations: 0,
      },
      topOpportunities: [],
      isLiveDb: false,
    };
  }
}

export default async function OverviewPage() {
  const data = await getOverviewData();

  return (
    <div className="min-h-screen bg-gray-50 antialiased pb-16">
      <GlobalNav currentPath="/overview" />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Module Shortcuts Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[
            { name: "Overview", href: "/overview", active: true },
            { name: "Catalogue", href: "/catalogue", active: false },
            { name: "Intelligence", href: "/intelligence", active: false },
            { name: "Bundles", href: "/bundles", active: false },
            { name: "Content Studio", href: "/content-studio", active: false },
            { name: "Settings", href: "/settings", active: false },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-center py-2 px-3 rounded-lg text-xs font-medium transition ${
                item.active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Business Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Products</h3>
            <p className="text-3xl font-extrabold text-emerald-600">{data.metrics.totalProducts}</p>
            <p className="text-xs text-gray-400 mt-1">Live in catalogue</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Variants</h3>
            <p className="text-3xl font-extrabold text-emerald-600">{data.metrics.activeVariants}</p>
            <p className="text-xs text-gray-400 mt-1">SKUs tracked in inventory</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Campaigns</h3>
            <p className="text-3xl font-extrabold text-emerald-600">{data.metrics.activeCampaigns}</p>
            <p className="text-xs text-gray-400 mt-1">Growth & promotional tracks</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Opportunity Analyses</h3>
            <p className="text-3xl font-extrabold text-emerald-600">{data.metrics.growthRecommendations}</p>
            <p className="text-xs text-gray-400 mt-1">Assessed for marketing ROI</p>
          </div>
        </div>

        {/* Growth Intelligence Highlights & Action Centre */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Top Growth Opportunities</h3>
              <Link href="/intelligence" className="text-xs text-emerald-600 font-semibold hover:underline">
                View all &rarr;
              </Link>
            </div>
            {data.topOpportunities.length > 0 ? (
              <div className="space-y-3">
                {data.topOpportunities.map((opp, idx) => (
                  <div
                    key={opp.id || idx}
                    className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <div>
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 mr-2">
                        {opp.lifecycleCategory.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600 font-medium">Status: {opp.marketingStatus}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-600">
                        Score: {Number(opp.opportunityScore).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">
                Run <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">npm run seed</code> to populate initial opportunity scoring for NURU Electronics.
              </p>
            )}
          </div>

          {/* Action Centre */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">System Status</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Database: <strong>{data.isLiveDb ? "Connected" : "Standby"}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Tenant: <strong>NURU Electronics</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>OpenSEO: <strong>Configured</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Coolify Deploy: <strong>Ready</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
