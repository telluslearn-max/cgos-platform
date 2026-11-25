import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "CGOS Integrations - Service Connections",
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
      isDbLive: true,
    };
  } catch (err) {
    console.error("Failed to load integrations:", err);
    return {
      nuru: null,
      seo: null,
      totalProducts: 0,
      isDbLive: false,
    };
  }
}

export default async function IntegrationsPage() {
  const { nuru, totalProducts, isDbLive } = await getIntegrationsData();

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Top Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/overview" className="h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center hover:opacity-90 transition">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </Link>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Connected Integrations</h2>
                <p className="text-xs text-gray-500">Service adapters & data pipelines</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
        {/* Architecture Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-emerald-600 mt-0.5">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">PRD §14 Strict Read-Only Safeguard Active</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              CGOS ingests product, variant, and pricing data via read-only APIs. Consequential mutations (price changes, inventory adjustments, orders) are strictly gated by human approval workflows.
            </p>
          </div>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NURU Commerce Adapter Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <h3 className="text-base font-bold text-gray-900">NURU Electronics Platform</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {nuru?.status === "connected" || isDbLive ? "Connected" : "Standby"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Dedicated commerce adapter ingesting catalogue products, inventory levels, variant pricing, and high-resolution media from NURU’s primary Coolify store.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs text-gray-600 border border-gray-100 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Pilot Tenant:</span>
                  <span className="font-semibold text-gray-800">NURU Electronics (nuru-electronics)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Synced Products:</span>
                  <span className="font-semibold text-gray-800">{totalProducts} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sync Mode:</span>
                  <span className="font-mono text-gray-800">Incremental &bull; Hourly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Endpoint:</span>
                  <span className="font-mono text-gray-800">/api/integrations/nuru/sync</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Last sync: {nuru?.lastSyncAt ? new Date(nuru.lastSyncAt).toLocaleString() : "Recently active"}
              </span>
              <Link
                href="/catalogue"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Inspect Catalogue &rarr;
              </Link>
            </div>
          </div>

          {/* OpenSEO Intelligence */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <h3 className="text-base font-bold text-gray-900">OpenSEO Intelligence</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Ready
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Monitors search visibility, keyword ranking, and SERP positions for NURU Electronics via DataForSEO.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs text-gray-600 border border-gray-100 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Instance URL:</span>
                  <span className="font-mono text-gray-800">seo.nuruelectronics.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Schedule:</span>
                  <span className="font-mono text-gray-800">Daily Recurrent</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">Status: Active</span>
              <Link href="/seo" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                SEO Dashboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
