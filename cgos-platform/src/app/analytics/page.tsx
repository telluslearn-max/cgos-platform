import Link from "next/link";
import { getTenantAnalytics } from "@/lib/saas/tenant";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Growth Analytics & Performance | CGOS",
  description: "Commercial metrics, bundle revenue attribution, and ROI for NURU Electronics",
};

export default async function AnalyticsPage() {
  const data = await getTenantAnalytics("nuru-electronics");

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex items-center justify-center">
        <p>Tenant not found.</p>
      </div>
    );
  }

  const { metrics, topPerformingCategories } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/overview" className="text-xs uppercase tracking-wider text-emerald-400 font-semibold hover:underline">
                Overview
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-xs uppercase tracking-wider text-slate-400">Phase 7 SaaS Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Commercial Growth Analytics</h1>
            <p className="text-sm text-slate-400 mt-1">
              Revenue projections, bundle attribution, and autonomous growth ROI for {data.tenantName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
            >
              Tenant Settings
            </Link>
            <Link
              href="/overview"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-emerald-950/50"
            >
              Platform Overview
            </Link>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Catalog Inventory</span>
            <div className="text-2xl font-bold text-white mt-1">
              KES {metrics.totalCatalogValue.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-400 mt-2">{metrics.totalProducts} active product SKUs</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Bundle Revenue Pipeline</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              KES {metrics.potentialIncrementalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-2">{metrics.activeBundles} synthesized bundles</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Campaign Commitments</span>
            <div className="text-2xl font-bold text-sky-400 mt-1">
              KES {metrics.totalCampaignBudget.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-2">{metrics.activeCampaigns} active campaigns</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated ROI Factor</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{metrics.estimatedRoiMultiplier}x</div>
            <p className="text-xs text-emerald-400 mt-2">{metrics.autonomousCyclesRun} autonomous cycles</p>
          </div>
        </div>

        {/* Category Contribution and Attribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Revenue Contribution by Category</h3>
            <div className="space-y-4">
              {topPerformingCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-medium">{cat.category}</span>
                    <span className="text-emerald-400 font-mono">{cat.revenueSharePct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${cat.revenueSharePct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Pilot Commercial Model (PRD §17)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Billing Architecture</span>
                <span className="text-white font-medium">B2B SaaS Multi-Tenancy</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Multi-Store Isolation</span>
                <span className="text-emerald-400 font-medium">Tenant Slug Scoping</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Safeguards Audit</span>
                <span className="text-emerald-400 font-semibold">Active & Passing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Autonomous Cycle Status</span>
                <span className="text-sky-400 font-mono">Continuous Evaluation Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
