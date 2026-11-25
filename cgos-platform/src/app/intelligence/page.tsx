/** @type {import('next').Metadata} */
export const metadata = {
  title: "CGOS Intelligence - Growth Opportunities",
  description: "Commerce Growth OS - Growth intelligence and learning engine",
};

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-purple-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-5h.01M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7a2 2 0 012 2h3m-3.5 3.5a2.121 2.121 0 013 3L10 15m-3.732-3.732a1 1 0 10-1.414-1.414L9.172 13H7m5 0h3a2 2 0 002-2v-4.586a1 1 0 00-.293-.707l-1.414-1.414m0 9.898a2 2 0 00-.121-.354l-2.097-2.097m9.898-1.298a2 2 0 010 3.162l-1.646 1.646m0 0a2.121 2.121 0 013 3l3.162-3.162m-3.162-3.162L18 15M15 10a5 5 0 10-10 0 5 5 0 0010 0z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-kesh-dark">Growth Intelligence</h2>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Opportunities */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Product Opportunities</h3>
            <p className="text-sm text-gray-500">
              Analyzing catalogue for growth opportunities...
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Bundle Recommendations</h3>
            <p className="text-sm text-gray-500">
              Running bundle discovery algorithms...
            </p>
          </div>

          {/* AI Learning */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Learning Engine</h3>
            <p className="text-sm text-gray-500">
              ML models training on commerce data...
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Revenue Forecasting</h3>
            <p className="text-sm text-gray-500">
              Predictive analytics engaged...
            </p>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Top Opportunity</h4>
            <p className="text-xs text-gray-400">No opportunities identified</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Confidence Score</h4>
            <p className="text-xs text-gray-400">0%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Priority</h4>
            <p className="text-xs text-gray-400">Low</p>
          </div>
        </div>
      </main>
    </div>
  );
}