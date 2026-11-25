import Link from "next/link";
import { getSEOIntelligence } from "@/lib/market/intelligence";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SEO Intelligence | CGOS",
  description: "Search rankings, keyword opportunities, and crawl health for NURU Electronics",
};

export default async function SEOPage() {
  const seo = await getSEOIntelligence("nuru-electronics");

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
              <span className="text-xs uppercase tracking-wider text-slate-400">Phase 5 Market Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Search Engine Optimization (OpenSEO)</h1>
            <p className="text-sm text-slate-400 mt-1">
              SERP rankings, search visibility, and organic keyword discovery
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/competitors"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
            >
              Competitor Benchmark
            </Link>
            <Link
              href="/content-studio"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-emerald-950/50"
            >
              Generate SEO Briefs
            </Link>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">OpenSEO Crawler</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-2xl font-bold text-emerald-400 capitalize">{seo.status}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 truncate">{seo.openseoUrl || "Managed Agent"}</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Crawl Health Score</span>
            <div className="text-2xl font-bold text-white mt-1">{seo.crawlHealthScore}%</div>
            <p className="text-xs text-emerald-400 mt-2">Optimal site architecture</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tracked Target Keywords</span>
            <div className="text-2xl font-bold text-white mt-1">{seo.trackedKeywords.length}</div>
            <p className="text-xs text-slate-400 mt-2">High commercial intent</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Average SERP Rank</span>
            <div className="text-2xl font-bold text-sky-400 mt-1">
              #{(seo.trackedKeywords.reduce((acc, k) => acc + k.rank, 0) / seo.trackedKeywords.length).toFixed(1)}
            </div>
            <p className="text-xs text-slate-400 mt-2">Top 5 average in Kenya</p>
          </div>
        </div>

        {/* Tracked Keywords Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Tracked Search Keywords & Rankings</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Target Keyword</th>
                  <th className="px-6 py-4">SERP Rank</th>
                  <th className="px-6 py-4">Monthly Search Vol</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Landing Page Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {seo.trackedKeywords.map((kw, index) => (
                  <tr key={index} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-semibold text-white">{kw.keyword}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Rank #{kw.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-200">{kw.searchVolume.toLocaleString()} searches</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full" style={{ width: `${kw.difficulty}%` }}></div>
                        </div>
                        <span className="text-xs font-mono">{kw.difficulty}/100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400 truncate max-w-xs">{kw.serpUrl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
