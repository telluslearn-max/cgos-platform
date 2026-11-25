import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "CGOS Creative Studio - Multi-Channel Briefs",
  description: "Commerce Growth OS - AI creative briefs, brand memory & copy generation",
};

export const dynamic = "force-dynamic";

async function getContentStudioData() {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { slug: "nuru-electronics" },
    });

    if (!tenant) return { briefs: [], stats: { total: 0, pending: 0, approved: 0, platforms: 0 }, isLiveDb: false };

    const briefs = await prisma.contentBrief.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    });

    const productIds = briefs.map((b) => b.productId).filter((id): id is string => Boolean(id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, brand: true, sellingPrice: true, sku: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const populated = briefs.map((b) => ({
      ...b,
      product: b.productId ? productMap.get(b.productId) || null : null,
    }));

    const total = populated.length;
    const pending = populated.filter((b) => b.status === "ready_for_review" || b.status === "draft").length;
    const approved = populated.filter((b) => b.status === "approved").length;
    const platforms = new Set(populated.map((b) => b.platform)).size;

    return {
      briefs: populated,
      stats: { total, pending, approved, platforms },
      isLiveDb: true,
    };
  } catch (error) {
    console.error("Failed to load briefs:", error);
    return { briefs: [], stats: { total: 0, pending: 0, approved: 0, platforms: 0 }, isLiveDb: false };
  }
}

export default async function ContentStudioPage() {
  const { briefs, stats, isLiveDb } = await getContentStudioData();

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/overview" className="h-10 w-10 rounded-md bg-pink-600 flex items-center justify-center hover:opacity-90 transition">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Link>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Creative Intelligence Studio</h2>
                <p className="text-xs text-gray-500">NURU Electronics &bull; Phase 3 Creative Generation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/marketing-calendar"
                className="text-sm font-medium text-pink-600 hover:text-pink-700 bg-pink-50 px-3 py-1.5 rounded-md border border-pink-200"
              >
                Marketing Calendar &rarr;
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
        {/* Brand Memory Banner */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-pink-600 mt-0.5">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-pink-900">PRD §7 Brand Memory & Creative Guardrails</h4>
            <p className="text-xs text-pink-700 mt-0.5">
              All generated marketing briefs enforce NURU’s verified tone: genuine East African stock with official warranty, transparent KES pricing, and same-day delivery. Fabricated claims and unapproved price discounts are strictly filtered.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Briefs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-0.5">Campaign briefs created</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Awaiting Review</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            <p className="text-xs text-gray-400 mt-0.5">Ready for human approval</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved for Production</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
            <p className="text-xs text-gray-400 mt-0.5">Queued for scheduling</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Channels Active</p>
            <p className="text-2xl font-bold text-pink-600 mt-1">{stats.platforms || 3}</p>
            <p className="text-xs text-gray-400 mt-0.5">Instagram, WhatsApp, TikTok</p>
          </div>
        </div>

        {/* Brief Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Generated Marketing Briefs</h3>
            <span className="text-xs font-semibold text-gray-400">
              {isLiveDb ? "Connected to PostgreSQL" : "Connecting..."}
            </span>
          </div>

          {briefs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {briefs.map((brief) => (
                <div key={brief.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:border-pink-300 transition">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-pink-100 text-pink-800 mr-2">
                          {brief.platform}
                        </span>
                        <span className="text-xs font-medium text-gray-500">{brief.format}</span>
                        <h4 className="text-base font-bold text-gray-900 mt-1.5">{brief.title}</h4>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        brief.status === "approved" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {brief.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs text-gray-600 mb-4 bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                      <div>
                        <span className="font-semibold text-gray-800">Objective:</span> {brief.objective}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Target Audience:</span> {brief.targetAudience}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Content Angle:</span> {brief.contentAngle}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Call to Action:</span> <span className="font-medium text-pink-700">{brief.cta}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {brief.product && (
                        <p className="text-xs text-gray-500">
                          Target: <span className="font-semibold text-gray-800">{brief.product.title}</span> (KES {Number(brief.product.sellingPrice).toLocaleString()})
                        </p>
                      )}
                    </div>
                    <Link
                      href="/marketing-calendar"
                      className="text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline"
                    >
                      Schedule in Calendar &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <h4 className="text-base font-semibold text-gray-900">No creative briefs generated yet</h4>
              <p className="text-sm text-gray-500 mt-1">
                Run <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">npm run seed</code> or call <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">POST /api/content-studio</code>.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
