import Link from "next/link";

interface GlobalNavProps {
  currentPath?: string;
}

const NAV_ITEMS = [
  { label: "Overview", href: "/overview" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Intelligence", href: "/intelligence" },
  { label: "Bundles", href: "/bundles" },
  { label: "Studio", href: "/content-studio" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Calendar", href: "/marketing-calendar" },
  { label: "SEO", href: "/seo" },
  { label: "Competitors", href: "/competitors" },
  { label: "Analytics", href: "/analytics" },
  { label: "Integrations", href: "/integrations" },
  { label: "Settings", href: "/settings" },
];

export function GlobalNav({ currentPath }: GlobalNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/overview" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="h-7 w-7 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm tracking-tight text-white">CGOS</span>
            <span className="hidden sm:inline-block text-[11px] text-zinc-500 font-mono">
              NURU Electronics
            </span>
          </div>
        </Link>

        {/* Scrollable single-row navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Status badge */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            PRD §14 Read-Only
          </span>
        </div>
      </div>
    </header>
  );
}
