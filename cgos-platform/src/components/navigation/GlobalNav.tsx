import Link from "next/link";

interface GlobalNavProps {
  currentPath?: string;
}

export function GlobalNav({ currentPath }: GlobalNavProps) {
  const navSections = [
    {
      group: "Intelligence",
      items: [
        { label: "Overview", href: "/overview", icon: "📊" },
        { label: "Catalogue", href: "/catalogue", icon: "📦" },
        { label: "Opportunity Scoring", href: "/intelligence", icon: "⚡" },
        { label: "Bundle Discovery", href: "/bundles", icon: "🧩" },
      ],
    },
    {
      group: "Execution",
      items: [
        { label: "Creative Studio", href: "/content-studio", icon: "🎨" },
        { label: "Campaigns & ROI", href: "/campaigns", icon: "🚀" },
        { label: "Marketing Calendar", href: "/marketing-calendar", icon: "📅" },
      ],
    },
    {
      group: "Market & Platform",
      items: [
        { label: "OpenSEO Tracker", href: "/seo", icon: "🔍" },
        { label: "Competitor Benchmarking", href: "/competitors", icon: "⚔️" },
        { label: "SaaS Analytics", href: "/analytics", icon: "📈" },
        { label: "NURU Sync Adapter", href: "/integrations", icon: "🔄" },
        { label: "Autonomous Controls", href: "/settings", icon: "⚙️" },
      ],
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      {/* Top Banner with Store Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold tracking-wider text-emerald-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CGOS Active
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            Pilot Store: <strong className="text-white">NURU Electronics</strong> (Nairobi, Kenya)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[11px] font-mono">
            PRD §14 Safeguards: Enforced
          </span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
            Sync: 616 URLs Indexed
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6 overflow-x-auto">
        <Link href="/overview" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 group-hover:bg-emerald-400 transition flex items-center justify-center font-black text-slate-950 text-base shadow-sm">
            C
          </div>
          <div className="leading-tight">
            <span className="font-bold text-sm tracking-tight text-white block">Commerce Growth OS</span>
            <span className="text-[10px] text-slate-400 font-mono block">NURU Operating Engine</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {navSections.flatMap((s) => s.items).map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
