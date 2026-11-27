import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings & System Controls | CGOS",
  description: "Autonomous engine controls, safeguards, and tenant configuration for NURU Electronics",
};

export default async function SettingsPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: "nuru-electronics" },
  });

  const subscription = tenant
    ? await prisma.tenantSubscription.findFirst({
        where: { tenantId: tenant.id },
      })
    : null;

  const recentCycles = tenant
    ? await prisma.growthRecommendation.findMany({
        where: { tenantId: tenant.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <GlobalNav currentPath="/settings" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/overview" className="text-xs uppercase tracking-wider text-emerald-400 font-semibold hover:underline">
                Overview
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-xs uppercase tracking-wider text-slate-400">Phase 6 Autonomous Framework</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Autonomous Engine & Settings</h1>
            <p className="text-sm text-slate-400 mt-1">
              Autonomous loop configuration, guardrails, and tenant settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/analytics"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
            >
              Growth Analytics
            </Link>
            <Link
              href="/integrations"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-emerald-950/50"
            >
              Adapter Status
            </Link>
          </div>
        </div>

        {/* Safeguard Status Banner */}
        <div className="p-6 rounded-xl bg-slate-900 border border-emerald-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-lg font-semibold text-white">Autonomous Engine Status: Active & Enforced</h2>
            </div>
            <p className="text-sm text-slate-400">
              PRD §14 read-only safeguards are hardware-enforced. Ingestion &rarr; Scoring &rarr; Brief Generation &rarr; Distribution loop running continuously.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              PRD §14 Enforced
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-950 text-sky-400 border border-sky-800">
              Pilot: NURU Electronics
            </span>
          </div>
        </div>

        {/* Engine Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-semibold text-white text-sm">Data Ingestion</h3>
            <p className="text-xs text-slate-400">Syncs inventory from live NURU store</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-semibold text-white text-sm">Opportunity Scoring</h3>
            <p className="text-xs text-slate-400">Calculates composite commercial scores</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-semibold text-white text-sm">Bundle Discovery</h3>
            <p className="text-xs text-slate-400">Identifies complementary product kits</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-semibold text-white text-sm">Creative Studio</h3>
            <p className="text-xs text-slate-400">Synthesizes high-converting briefs</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs">
              05
            </div>
            <h3 className="font-semibold text-white text-sm">Calendar Distribution</h3>
            <p className="text-xs text-slate-400">Schedules cross-platform publications</p>
          </div>
        </div>

        {/* Tenant Details & Past Autonomous Cycles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Pilot Tenant Profile</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tenant Name</span>
                <span className="text-white font-medium">{tenant?.name || "NURU Electronics"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tenant Slug</span>
                <span className="text-emerald-400 font-mono">{tenant?.slug || "nuru-electronics"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Storefront URL</span>
                <a href={tenant?.website || "https://www.nuruelectronics.com"} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                  {tenant?.website || "https://www.nuruelectronics.com"}
                </a>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Subscription Tier</span>
                <span className="text-white font-semibold capitalize">{subscription?.plan || "Enterprise"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Safeguards Policy</span>
                <span className="text-emerald-400 font-medium">Read-Only Enforced</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Autonomous Growth Cycles</h3>
            {recentCycles.length === 0 ? (
              <p className="text-sm text-slate-400">No autonomous cycles executed yet.</p>
            ) : (
              <div className="space-y-3">
                {recentCycles.map((cycle) => (
                  <div key={cycle.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{cycle.title}</span>
                      <span className="text-xs text-emerald-400 font-mono">Confidence: {Number(cycle.confidence)}%</span>
                    </div>
                    <p className="text-xs text-slate-400">{cycle.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
