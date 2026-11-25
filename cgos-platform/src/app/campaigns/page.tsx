import Link from "next/link";
import { getCampaigns } from "@/lib/distribution/campaigns";

export const metadata = {
  title: "CGOS Campaigns - Multi-Channel Growth Campaigns",
  description: "Commerce Growth OS - Coordinated multi-product marketing campaigns",
};

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  const totalBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Top Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/overview" className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center hover:opacity-90 transition">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </Link>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Campaign Management</h2>
                <p className="text-xs text-gray-500">NURU Electronics &bull; Phase 4 Marketing Distribution</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/marketing-calendar"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200"
              >
                Calendar View &rarr;
              </Link>
              <Link
                href="/overview"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md border border-gray-200"
              >
                &larr; Overview
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Guardrail Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900">PRD §8 Campaign Orchestration</h4>
            <p className="text-xs text-blue-700 mt-0.5">
              Campaigns coordinate multi-product marketing execution across social channels, WhatsApp, and search. Ad spend and commercial budgets are controlled and monitored within allocated limits.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Campaigns</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Currently driving commercial growth</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Allocated Budget</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">KES {totalBudget.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">Approved promotional spend</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured Products</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {campaigns.reduce((acc, c) => acc + c.products.length, 0)} Items
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Hero & bundle catalogue coverage</p>
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">Active Growth Campaigns</h3>
          {campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div key={camp.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 uppercase">
                          {camp.status}
                        </span>
                        <h4 className="text-lg font-bold text-gray-900">{camp.name}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Timeline: {new Date(camp.startDate).toLocaleDateString()} &mdash; {camp.endDate ? new Date(camp.endDate).toLocaleDateString() : "Ongoing"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">Budget:</span>
                      <p className="text-lg font-extrabold text-blue-600">KES {camp.budget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                    <div>
                      <span className="font-semibold text-gray-800">Objective:</span> {camp.objective}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Target Audience:</span> {camp.targetAudience}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Promoted Products</p>
                    <div className="flex flex-wrap gap-2">
                      {camp.products.map((p) => (
                        <span key={p.id} className="inline-flex items-center px-3 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200">
                          {p.title} &bull; <strong className="ml-1 text-emerald-700">KES {p.sellingPrice.toLocaleString()}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-sm text-gray-500">
                Run <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">npm run seed</code> to populate the Q4 campaign.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
