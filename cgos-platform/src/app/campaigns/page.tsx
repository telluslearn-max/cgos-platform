import { GlobalNav } from "@/components/navigation/GlobalNav";
import { getCampaignsWithDetailedEconomics } from "@/lib/distribution/economics";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Campaigns & Economics | CGOS — NURU Electronics",
  description: "Mathematical breakdown of ad spend, channel routing, ROAS, and net margin return",
};

export default async function CampaignsPage() {
  const campaigns = await getCampaignsWithDetailedEconomics("nuru-electronics");

  const totalSpend = campaigns.reduce((acc, c) => acc + c.totalBudgetKes, 0);
  const totalProjectedRevenue = campaigns.reduce((acc, c) => acc + c.totals.totalProjectedRevenueKes, 0);
  const totalGrossProfit = campaigns.reduce((acc, c) => acc + c.totals.totalGrossProfitKes, 0);
  const netProfitAfterAdSpend = totalGrossProfit - totalSpend;
  const overallRoas = totalSpend > 0 ? (totalProjectedRevenue / totalSpend).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <GlobalNav currentPath="/campaigns" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-400">
              Phase 4 Distribution &bull; Financial Attribution
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Campaign Economics & Spend Allocation
            </h1>
            <p className="text-xs text-zinc-400">
              Deterministic capital allocation, channel cost-per-click, conversion funnels, and net margin returns
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-mono">
            PRD §14: Human Approval Required for Spend
          </span>
        </div>

        {/* High-Level Financial Ledger Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs font-medium text-zinc-400">Total Campaign Spend</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
              KES {totalSpend.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">Across {campaigns.length} campaign(s)</p>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs font-medium text-zinc-400">Projected Topline Revenue</span>
            <div className="text-2xl font-semibold text-emerald-400 mt-1.5 font-mono">
              KES {totalProjectedRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-400 mt-1.5">
              Blended ROAS: <span className="text-emerald-400 font-mono font-semibold">{overallRoas}x</span>
            </p>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs font-medium text-zinc-400">Product Gross Margin Pool</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
              KES {totalGrossProfit.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">Pre-ad-spend commercial margin</p>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs font-medium text-zinc-400">Net Return After Ad Spend</span>
            <div className="text-2xl font-semibold text-emerald-400 mt-1.5 font-mono">
              KES {netProfitAfterAdSpend.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">Incremental cash flow</p>
          </div>
        </div>

        {/* Formula Model Card */}
        <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-4">
          <h2 className="text-sm font-semibold text-white">Deterministic Revenue & Margin Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5 p-3.5 rounded-md bg-zinc-950 border border-zinc-800/80">
              <span className="font-medium text-zinc-300 block">1. Channel Traffic Sizing</span>
              <code className="block text-emerald-400 font-mono text-[11px]">
                Clicks = Budget_channel / CPC_channel
              </code>
            </div>
            <div className="space-y-1.5 p-3.5 rounded-md bg-zinc-950 border border-zinc-800/80">
              <span className="font-medium text-zinc-300 block">2. Conversions & Topline</span>
              <code className="block text-emerald-400 font-mono text-[11px]">
                Revenue = (Clicks * CVR) * Basket_AOV
              </code>
            </div>
            <div className="space-y-1.5 p-3.5 rounded-md bg-zinc-950 border border-zinc-800/80">
              <span className="font-medium text-zinc-300 block">3. Net Commercial Profit</span>
              <code className="block text-emerald-400 font-mono text-[11px]">
                Net_Profit = (Revenue * Margin%) - Spend
              </code>
            </div>
          </div>
        </div>

        {/* Campaign Breakdowns */}
        <div className="space-y-6">
          {campaigns.length === 0 ? (
            <div className="p-12 text-center rounded-lg border border-zinc-800/80 bg-zinc-900/40 text-zinc-500 text-sm">
              No active campaigns configured.
            </div>
          ) : (
            campaigns.map((camp) => (
              <div key={camp.campaignId} className="rounded-lg bg-zinc-900/40 border border-zinc-800/80 overflow-hidden">
                <div className="p-5 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-white">{camp.name}</h3>
                    <p className="text-xs text-zinc-400">
                      {camp.objective} &bull; {camp.targetAudience}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[11px] text-zinc-500 block">Budget</span>
                      <span className="text-sm font-mono font-semibold text-white">
                        KES {camp.totalBudgetKes.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-l border-zinc-800 pl-6">
                      <span className="text-[11px] text-zinc-500 block">Blended ROAS</span>
                      <span className="text-sm font-mono font-semibold text-emerald-400">
                        {camp.totals.blendedRoas}x
                      </span>
                    </div>
                  </div>
                </div>

                {/* Featured Products */}
                <div className="px-5 py-3 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-zinc-500 font-medium mr-1">Target SKUs:</span>
                  {camp.featuredProducts.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono text-[11px]"
                    >
                      {p.title} (KES {p.sellingPriceKes.toLocaleString()} &bull; {p.marginPct}% margin)
                    </span>
                  ))}
                </div>

                {/* Channel Allocation Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800/80 font-medium">
                      <tr>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-3 text-right">Share</th>
                        <th className="py-3 px-3 text-right">Ad Spend</th>
                        <th className="py-3 px-3 text-right">CPC</th>
                        <th className="py-3 px-3 text-right">Clicks</th>
                        <th className="py-3 px-3 text-right">CVR</th>
                        <th className="py-3 px-3 text-right">Orders</th>
                        <th className="py-3 px-4 text-right">Revenue</th>
                        <th className="py-3 px-4 text-right">Gross Profit</th>
                        <th className="py-3 px-4 text-right">ROAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {camp.channels.map((ch, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                          <td className="py-3 px-4 font-sans font-medium text-zinc-100">{ch.channel}</td>
                          <td className="py-3 px-3 text-right text-zinc-400">{ch.sharePct}%</td>
                          <td className="py-3 px-3 text-right text-zinc-200">
                            KES {ch.allocatedBudgetKes.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right text-zinc-400">KES {ch.costPerClickKes}</td>
                          <td className="py-3 px-3 text-right text-zinc-300">
                            {ch.projectedClicks.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right text-zinc-300">{ch.conversionRatePct}%</td>
                          <td className="py-3 px-3 text-right text-white">{ch.projectedOrders}</td>
                          <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                            KES {ch.projectedRevenueKes.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-zinc-200">
                            KES {ch.grossProfitKes.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-400">{ch.netRoasMultiplier}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Break-Even Footer */}
                <div className="bg-zinc-950/80 px-5 py-4 border-t border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <p className="text-zinc-400">
                    Break-even threshold:{" "}
                    <span className="text-white font-mono font-semibold">
                      {camp.totals.breakEvenOrdersNeeded} orders
                    </span>{" "}
                    &bull; Projected volume:{" "}
                    <span className="text-emerald-400 font-mono font-semibold">
                      {camp.totals.expectedOrders} orders
                    </span>
                  </p>
                  <div className="flex items-center gap-6 font-mono">
                    <span className="text-zinc-400">
                      Net Profit:{" "}
                      <strong className="text-emerald-400">
                        +KES {camp.totals.netProfitAfterAdSpendKes.toLocaleString()}
                      </strong>
                    </span>
                    <span className="text-zinc-400">
                      ROI:{" "}
                      <strong className="text-white">
                        {Math.round((camp.totals.netProfitAfterAdSpendKes / camp.totalBudgetKes) * 100)}%
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
