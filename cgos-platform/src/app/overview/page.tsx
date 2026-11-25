/** @type {import('next').Metadata} */
export const metadata = {
  title: "CGOS Dashboard - Commerce Growth OS",
  description: "Commerce Growth OS - AI-powered commerce intelligence and marketing execution platform",
};

import Link from "next/link";

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-kesh-green flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h2a2 2 0 002-2V5a2 2 0 00-2-2H11a2 2 0 00-2 2v6m12 4h-2m0 0h-2m2 0a2 2 0 100-4h2a2 2 0 100 4zm-2-6a2 2 0 11-4 0 2 2 0 014 0zM5 7a2 2 0 11-4 0 2 2 0 014 0zM3 15a2 2 0 11-2-2H1a2 2 0 112-2h12a2 2 0 112 2h-1M9 10v10m-7 0V5m7 0v5-3.5 3.5M15.5 15.5l3.5 3.5m1.4-1.4l-3.5-3.5M5 15a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-kesh-dark">CGOS Platform</h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Metrics Cards */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Catalogue Intelligence</h3>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-kesh-green">0</p>
                <p className="text-sm text-gray-500">Total Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-kesh-green">0</p>
                <p className="text-sm text-gray-500">Active Variants</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Marketing Health</h3>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-kesh-green">0</p>
                <p className="text-sm text-gray-500">Active Campaigns</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-kesh-green">0</p>
                <p className="text-sm text-gray-500">Content Briefs</p>
              </div>
            </div>
          </div>

          {/* SEO Cards */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">SEO Intelligence</h3>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-kesh-green">0</p>
                <p className="text-sm text-gray-500">Tracked Keywords</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-kesh-green">0</p>
                <p className="text-sm text-gray-500">Ranking Products</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Growth Opportunities</h3>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-kesh-green">0</p>
                <p className="text-sm text-gray-500">Bundle Recommendations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-kesh-green">0</p>
                <p className="text-sm text-gray-500">Growth Recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Centre */}
        <div className="mt-6 bg-white rounded-lg shadow p-6 border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Action Centre</h3>
          <p className="text-sm text-gray-500 mb-4">
            No pending actions. All systems operational.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ OpenSEO integration: Connected</li>
            <li>✅ Database: Connected</li>
            <li>✅ Catalogue: Loaded</li>
          </ul>
        </div>
      </main>
    </div>
  );
}