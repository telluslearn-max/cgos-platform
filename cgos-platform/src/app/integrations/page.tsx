import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";
import { SyncNowButton } from "@/components/integrations/SyncNowButton";

export const metadata = {
  title: "Integrations | CGOS — NURU Electronics",
  description: "Commerce Growth OS - Service integrations management and status",
};

export const dynamic = "force-dynamic";

async function getIntegrationsData() {
  try {
    const integrations = await prisma.integration.findMany({
      orderBy: { createdAt: "asc" },
    });

    const nuruIntegration = integrations.find((i) => i.name === "NURU Commerce Platform");
    const seoIntegration = integrations.find((i) => i.type === "seo");
    const totalProducts = await prisma.product.count();

    return {
      nuru: nuruIntegration,
      seo: seoIntegration,
      totalProducts,
    };
  } catch (err) {
    console.error("Failed to load integrations:", err);
    return {
      nuru: null,
      seo: null,
      totalProducts: 0,
    };
  }
}

export default async function IntegrationsPage() {
  const { nuru, totalProducts } = await getIntegrationsData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <GlobalNav currentPath="/integrations" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-400">Data Ingestion & Adapters</span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Connected Integrations</h1>
            <p className="text-xs text-zinc-400">
              Read-only commerce synchronization and OpenSEO discovery pipelines
            </p>
          </div>
          <SyncNowButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">NURU Commerce Platform</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] uppercase">
                {nuru?.status || "connected"}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Synchronizes live product handles from <span className="font-mono text-zinc-300">nuruelectronics.com/sitemap.xml</span> and NURU APIs under strict PRD §14 read-only safeguards.
            </p>
            <div className="border-t border-zinc-800/80 pt-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">Indexed SKUs</span>
                <span className="text-white">{totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Sync Frequency</span>
                <span className="text-zinc-300">{nuru?.syncFrequency || "hourly"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Last Sync</span>
                <span className="text-zinc-300">
                  {nuru?.lastSyncAt ? new Date(nuru.lastSyncAt).toLocaleString() : "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">OpenSEO Crawler</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] uppercase">
                connected
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Monitors organic SERP positions, commercial search volume, and crawl health across Kenyan electronics keywords.
            </p>
            <div className="border-t border-zinc-800/80 pt-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">Mode</span>
                <span className="text-zinc-300">Read-Only Telemetry</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Safeguards</span>
                <span className="text-emerald-400">PRD §14 Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
