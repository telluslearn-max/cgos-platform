import { GlobalNav } from "@/components/navigation/GlobalNav";

export const metadata = {
  title: "Social Intelligence | CGOS — NURU Electronics",
  description: "Commerce Growth OS - Social media intelligence and attribution",
};

export default function SocialIntelligencePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <GlobalNav currentPath="/social-intelligence" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="border-b border-zinc-800/80 pb-6 space-y-1">
          <span className="text-xs font-mono text-zinc-400">Phase 5 Market Intelligence</span>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Social Intelligence</h1>
          <p className="text-xs text-zinc-400">
            Cross-channel attribution across WhatsApp, Instagram, TikTok, and X
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 space-y-1">
            <span className="text-xs text-zinc-400">WhatsApp Catalog</span>
            <div className="text-xl font-semibold text-emerald-400 font-mono">4.8% Est. CVR</div>
            <p className="text-xs text-zinc-500">Primary direct-response channel</p>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 space-y-1">
            <span className="text-xs text-zinc-400">Instagram Reels & Stories</span>
            <div className="text-xl font-semibold text-white font-mono">2.4% Est. CVR</div>
            <p className="text-xs text-zinc-500">Flagship hardware discovery</p>
          </div>
          <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 space-y-1">
            <span className="text-xs text-zinc-400">TikTok Tech Reviews</span>
            <div className="text-xl font-semibold text-white font-mono">1.8% Est. CVR</div>
            <p className="text-xs text-zinc-500">High-velocity accessory reach</p>
          </div>
        </div>
      </main>
    </div>
  );
}
