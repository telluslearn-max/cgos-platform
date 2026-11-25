import Link from "next/link";
import { getCalendarSchedule, getCampaigns } from "@/lib/distribution/campaigns";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marketing Calendar | CGOS",
  description: "Scheduled marketing and campaign calendar for NURU Electronics",
};

export default async function MarketingCalendarPage() {
  const [entries, campaigns] = await Promise.all([
    getCalendarSchedule("nuru-electronics"),
    getCampaigns("nuru-electronics"),
  ]);

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
              <span className="text-xs uppercase tracking-wider text-slate-400">Phase 4 Distribution</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Marketing Calendar & Timeline</h1>
            <p className="text-sm text-slate-400 mt-1">
              Scheduled promotional events, social drops, and product campaign launches
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/campaigns"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
            >
              View Campaigns ({campaigns.length})
            </Link>
            <Link
              href="/content-studio"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-emerald-950/50"
            >
              Creative Studio
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Scheduled Drops</span>
            <div className="text-2xl font-bold text-white mt-1">{entries.length}</div>
            <p className="text-xs text-emerald-400 mt-2">Active calendar sync</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Campaigns</span>
            <div className="text-2xl font-bold text-white mt-1">{campaigns.length}</div>
            <p className="text-xs text-slate-400 mt-2">Promotional drives</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Allocated Budget</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              KES {campaigns.reduce((acc, c) => acc + (c.budget || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-2">Across all campaigns</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pilot Guardrails</span>
            <div className="text-2xl font-bold text-sky-400 mt-1">PRD §14 Active</div>
            <p className="text-xs text-slate-400 mt-2">Draft mode &bull; No autonomous discounting</p>
          </div>
        </div>

        {/* Timeline Entries */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Scheduled Publications Timeline</h2>
          {entries.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              No calendar entries found. Seeding required.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                        {entry.status}
                      </span>
                      <h3 className="font-semibold text-white text-base">{entry.title}</h3>
                    </div>
                    {entry.product && (
                      <p className="text-xs text-slate-400">
                        Target Product: <span className="text-slate-200">{entry.product.brand} - {entry.product.title}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
                    <span className="text-xs text-slate-500">Scheduled Execution</span>
                    <span className="text-sm font-medium text-slate-200">
                      {new Date(entry.scheduledAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
