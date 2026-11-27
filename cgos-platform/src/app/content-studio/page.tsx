import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "Creative Studio | CGOS — NURU Electronics",
  description: "Commerce Growth OS - Creative briefs, brand tone memory, and multi-channel copy",
};

export const dynamic = "force-dynamic";

async function getContentStudioData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) return { briefs: [], stats: { total: 0, pending: 0, approved: 0, platforms: 0 } };

    const briefs = await prisma.contentBrief.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    const productIds = briefs.map((b) => b.productId).filter((id): id is string => Boolean(id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, brand: true, sellingPrice: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const populated = briefs.map((b) => ({
      ...b,
      product: b.productId ? productMap.get(b.productId) || null : null,
    }));

    return {
      briefs: populated,
      stats: {
        total: populated.length,
        pending: populated.filter((b) => b.status === "ready_for_review" || b.status === "draft").length,
        approved: populated.filter((b) => b.status === "approved").length,
        platforms: new Set(populated.map((b) => b.platform)).size,
      },
    };
  } catch (error) {
    console.error("Failed to load briefs:", error);
    return { briefs: [], stats: { total: 0, pending: 0, approved: 0, platforms: 0 } };
  }
}

export default async function ContentStudioPage() {
  const { briefs, stats } = await getContentStudioData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <GlobalNav currentPath="/content-studio" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-400">Phase 3 Creative Intelligence</span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Creative Studio</h1>
            <p className="text-xs text-zinc-400">
              Brand-aligned creative briefs synthesized from NURU Electronics inventory and tone memory
            </p>
          </div>
          <Link
            href="/marketing-calendar"
            className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
          >
            Marketing Calendar &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Total Briefs</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">{stats.total}</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Awaiting Review</span>
            <div className="text-2xl font-semibold text-amber-400 mt-1.5 font-mono">{stats.pending}</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Approved</span>
            <div className="text-2xl font-semibold text-emerald-400 mt-1.5 font-mono">{stats.approved}</div>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
            <span className="text-xs text-zinc-400">Active Channels</span>
            <div className="text-2xl font-semibold text-white mt-1.5 font-mono">{stats.platforms}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {briefs.map((brief) => (
            <div key={brief.id} className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase">
                    {brief.platform} &bull; {brief.format}
                  </span>
                  <h3 className="text-sm font-semibold text-white mt-1">{brief.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] uppercase">
                  {brief.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{brief.objective}</p>
              <div className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded border border-zinc-800/80 space-y-1">
                <div><span className="text-zinc-500">Angle:</span> {brief.contentAngle}</div>
                <div><span className="text-zinc-500">CTA:</span> {brief.cta}</div>
              </div>
              {brief.product && (
                <div className="text-[11px] font-mono text-zinc-400 pt-1">
                  Target SKU: {brief.product.title} (KES {Number(brief.product.sellingPrice).toLocaleString()})
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
