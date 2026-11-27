"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SyncNowButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSync() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/integrations/nuru/crawl-all", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Synced ${data.syncResult?.totalIndexed ?? 0} SKUs (${data.syncResult?.newlyAdded ?? 0} new)`);
        router.refresh();
      } else {
        setMessage(data.message || "Sync failed");
      }
    } catch {
      setMessage("Network error during sync");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs transition-colors cursor-pointer"
      >
        {loading ? "Syncing Sitemap..." : "Sync All Storefront SKUs"}
      </button>
      {message && <span className="text-xs font-mono text-emerald-400">{message}</span>}
    </div>
  );
}
