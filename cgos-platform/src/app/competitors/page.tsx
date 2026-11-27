import Link from "next/link";
import { getCompetitorIntelligence } from "@/lib/market/intelligence";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Competitor Intelligence | CGOS",
  description: "Market pricing benchmarks and competitor monitoring for NURU Electronics",
};

export default async function CompetitorsPage() {
  const competitors = await getCompetitorIntelligence("nuru-electronics");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <GlobalNav currentPath="/competitors" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/overview" className="text-xs uppercase tracking-wider text-emerald-400 font-semibold hover:underline">
                Overview
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-xs uppercase tracking-wider text-slate-400">Phase 5 Market Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Competitor Benchmarking & Pricing</h1>
            <p className="text-sm text-slate-400 mt-1">
              Automated competitive price comparisons and catalog differential indexing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/seo"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
            >
              SEO Intelligence
            </Link>
            <Link
              href="/intelligence"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-emerald-950/50"
            >
              Opportunity Scoring
            </Link>
          </div>
        </div>

        {/* PRD Safeguard Notice */}
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-300 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-semibold">PRD §14 Safeguard Enforced:</span> Competitor price differentials serve as intelligence inputs only. CGOS never cuts prices, changes margins, or offers unapproved discounts automatically.
          </div>
        </div>

        {/* Competitor Cards */}
        <div className="space-y-6">
          {competitors.map((comp) => (
            <div key={comp.competitor.id} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{comp.competitor.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{comp.competitor.website || "Regional Electronics Distributor"}</p>
                </div>
                <span className="text-xs px-3 py-1 bg-slate-800 text-slate-300 font-mono rounded-full border border-slate-700">
                  {comp.trackedMatches.length} Products Monitored
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Product Title</th>
                      <th className="px-4 py-3">NURU Price</th>
                      <th className="px-4 py-3">Competitor Price</th>
                      <th className="px-4 py-3">Price Differential</th>
                      <th className="px-4 py-3">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {comp.trackedMatches.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="px-4 py-3 font-semibold text-white">{m.nuruProductTitle}</td>
                        <td className="px-4 py-3 font-mono text-emerald-400">KES {m.nuruSellingPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-slate-300">KES {m.competitorPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {m.priceDifferentialKes > 0 ? (
                            <span className="text-emerald-400">+KES {m.priceDifferentialKes.toLocaleString()} (+{m.priceDifferentialPct}%)</span>
                          ) : (
                            <span className="text-rose-400">KES {m.priceDifferentialKes.toLocaleString()} ({m.priceDifferentialPct}%)</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {m.marketAdvantage === "nuru_cheaper" ? (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              NURU Cheaper
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                              Competitor Lower
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
