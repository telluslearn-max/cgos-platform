import { GlobalNav } from "@/components/navigation/GlobalNav";
import { getCampaignsWithDetailedEconomics } from "@/lib/distribution/economics";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Campaign Orchestration & Financial Projections | CGOS",
  description: "Mathematical breakdown of ad spend, channel routing, ROAS, and net margin return for NURU Electronics",
};

export default async function CampaignsPage() {
  const campaigns = await getCampaignsWithDetailedEconomics("nuru-electronics");

  const totalSpend = campaigns.reduce((acc, c) => acc + c.totalBudgetKes, 0);
  const totalProjectedRevenue = campaigns.reduce((acc, c) => acc + c.totals.totalProjectedRevenueKes, 0);
  const totalGrossProfit = campaigns.reduce((acc, c) => acc + c.totals.totalGrossProfitKes, 0);
  const netProfitAfterAdSpend = totalGrossProfit - totalSpend;
  const overallRoas = totalSpend > 0 ? (totalProjectedRevenue / totalSpend).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <GlobalNav currentPath="/campaigns" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Phase 4 Orchestration</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs uppercase tracking-wider text-slate-400">Financial Attribution & Math</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Campaign Economics & Mathematical Allocation</h1>
            <p className="text-sm text-slate-400 mt-1">
              Deterministic capital allocation, channel cost-per-click, conversion funnels, and net margin returns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono">
              PRD §14: No Autonomous Discounting
            </span>
          </div>
        </div>

        {/* High-Level Financial Ledger Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Total Campaign Spend</span>
            <div className="text-2xl font-bold text-white mt-1">KES {totalSpend.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1.5">Across {campaigns.length} coordinated campaigns</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Projected Topline Revenue</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">KES {totalProjectedRevenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-500/80 mt-1.5">Blended ROAS: <strong className="text-emerald-400">{overallRoas}x</strong></p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Product Gross Margin Pool</span>
            <div className="text-2xl font-bold text-sky-400 mt-1">KES {totalGrossProfit.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1.5">Pre-ad-spend commercial margin</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Net Return After Ad Spend</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">KES {netProfitAfterAdSpend.toLocaleString()}</div>
            <p className="text-xs text-amber-500/80 mt-1.5">Pure incremental cash flow</p>
          </div>
        </div>

        {/* Formula & Engine Architecture Card */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📐</span> Mathematical Model & Revenue Generation Formula
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-2 p-4 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">1. Channel Traffic Sizing</span>
              <p className="text-slate-400">
                Ad budget is allocated by commercial affinity. Available clicks are calculated by channel benchmark CPC:
              </p>
              <code className="block p-2 rounded bg-slate-900 text-sky-300 font-mono text-[11px]">
                Clicks = Budget_channel / CPC_channel
              </code>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">2. Conversions & Topline</span>
              <p className="text-slate-400">
                Orders derived from high-intent local conversion rate multiplied by Average Order Value (AOV):
              </p>
              <code className="block p-2 rounded bg-slate-900 text-sky-300 font-mono text-[11px]">
                Revenue = (Clicks * CVR) * Basket_AOV
              </code>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">3. True Net Commercial Profit</span>
              <p className="text-slate-400">
                Ensures positive return only after deducting wholesale product COGS and marketing spend:
              </p>
              <code className="block p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px]">
                Net_Profit = (Revenue * Margin%) - Spend
              </code>
            </div>
          </div>
        </div>

        {/* Detailed Campaign Cards */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-white">Active Orchestration Campaigns</h2>

          {campaigns.map((camp) => (
            <div key={camp.campaignId} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
              {/* Campaign Topbar */}
              <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    <h3 className="text-xl font-bold text-white">{camp.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Objective: <span className="text-slate-200">{camp.objective}</span> &bull; Target: <span className="text-slate-300">{camp.targetAudience}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-xs text-slate-500 uppercase block">Total Budget</span>
                    <span className="text-lg font-bold text-emerald-400">KES {camp.totalBudgetKes.toLocaleString()}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-4">
                    <span className="text-xs text-slate-500 uppercase block">Blended ROAS</span>
                    <span className="text-lg font-bold text-sky-400">{camp.totals.blendedRoas}x</span>
                  </div>
                </div>
              </div>

              {/* Featured Products Attached */}
              <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-2">Featured In-Stock Hardware Products:</span>
                <div className="flex flex-wrap gap-2">
                  {camp.featuredProducts.map((p, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700 font-medium">
                      {p.title} &mdash; <strong className="text-emerald-400">KES {p.sellingPriceKes.toLocaleString()}</strong> ({p.marginPct}% margin, {p.stock} units)
                    </span>
                  ))}
                </div>
              </div>

              {/* Channel Distribution Breakdown Table */}
              <div className="overflow-x-auto p-6">
                <h4 className="text-sm font-semibold text-white mb-3">Where Does the Spend Go & Where Does the Revenue Come From?</h4>
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Channel & Role</th>
                      <th className="py-3 px-3">Share</th>
                      <th className="py-3 px-3">Ad Spend</th>
                      <th className="py-3 px-3">CPC</th>
                      <th className="py-3 px-3">Traffic</th>
                      <th className="py-3 px-3">CVR</th>
                      <th className="py-3 px-3">Orders</th>
                      <th className="py-3 px-4">Projected Revenue</th>
                      <th className="py-3 px-4">Gross Profit</th>
                      <th className="py-3 px-3">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {camp.channels.map((ch, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-bold text-white">{ch.channel}</td>
                        <td className="py-3.5 px-3 font-mono text-slate-400">{ch.sharePct}%</td>
                        <td className="py-3.5 px-3 font-mono text-slate-200">KES {ch.allocatedBudgetKes.toLocaleString()}</td>
                        <td className="py-3.5 px-3 font-mono text-slate-400">KES {ch.costPerClickKes}</td>
                        <td className="py-3.5 px-3 font-mono text-slate-300">{ch.projectedClicks.toLocaleString()} clicks</td>
                        <td className="py-3.5 px-3 font-mono text-emerald-400">{ch.conversionRatePct}%</td>
                        <td className="py-3.5 px-3 font-mono font-semibold text-white">{ch.projectedOrders} orders</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">KES {ch.projectedRevenueKes.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-mono text-sky-400">KES {ch.grossProfitKes.toLocaleString()}</td>
                        <td className="py-3.5 px-3 font-mono font-semibold text-amber-400">{ch.netRoasMultiplier}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Bottom-line Summary */}
              <div className="bg-slate-950 p-6 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-white text-sm">Campaign Break-Even & Sensitivity Analysis</span>
                  <p className="text-slate-400">
                    Break-even requires selling <strong className="text-white">{camp.totals.breakEvenOrdersNeeded} units</strong>. The campaign is projected to generate <strong className="text-emerald-400">{camp.totals.expectedOrders} orders</strong>, providing a safety margin of <strong className="text-white">{(camp.totals.expectedOrders - camp.totals.breakEvenOrdersNeeded)} additional units</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Net Profit After Ad Spend</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      +KES {camp.totals.netProfitAfterAdSpendKes.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Capital Efficiency</span>
                    <span className="text-base font-extrabold text-sky-400">
                      {Math.round((camp.totals.netProfitAfterAdSpendKes / camp.totalBudgetKes) * 100)}% ROI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
