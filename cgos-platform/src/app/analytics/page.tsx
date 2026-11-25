/** @type {import('next').Metadata} */
export const metadata = {
  title: "CGOS Analytics - Performance Measurement",
  description: "Commerce Growth OS - Analytics and attribution",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-indigo-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H11a2 2 0 00-2 2v6m12 4h-2m0 0h-2m2 0a2 2 0 100-4h2a2 2 0 100 4zm-2-6a2 2 0 11-4 0 2 2 0 014 0zM5 7a2 2 0 11-4 0 2 2 0 014 0zM3 15a2 2 0 11-2-2H1a2 2 0 112-2h12a2 2 0 112 2h-1M9 10v10m-7 0V5m7 0v5-3.5 3.5M15.5 15.5l3.5 3.5m1.4-1.4l-3.5-3.5M5 15a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-kesh-dark">Analytics</h2>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Metrics */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Revenue Overview</h3>
            <p className="text-sm text-gray-500">
                Revenue data loading...
            </p>
          </div>

          {/* Order Metrics */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Order Metrics</h3>
            <p className="text-sm text-gray-500">
                Order analytics loading...
            </p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Conversion Rate</h3>
            <p className="text-sm text-gray-500">
                0% conversion rate
            </p>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Average Order Value</h3>
            <p className="text-sm text-gray-500">
                $0.00 AOV
            </p>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-6 bg-white rounded-lg shadow p-6 border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Attribution</h3>
          <ul className="list-disc pl-5 text-gray-600 text-sm">
            <li>Organic search: Traffic source data loading</li>
            <li>Direct: Traffic source data loading</li>
            <li>Social: Traffic source data loading</li>
            <li>Referral: Traffic source data loading</li>
            <li>Paid: Traffic source data loading</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Attribution model: Data-driven
          </p>
        </div>
      </main>
    </div>
  );
}