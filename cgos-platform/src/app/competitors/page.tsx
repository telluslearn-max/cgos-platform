/** @type {import('next').Metadata} */
export const metadata = {
  title: "CGOS Competitors - Competitive Intelligence",
  description: "Commerce Growth OS - Competitor monitoring and analysis",
};

export default function CompetitorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-red-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253a4 4 0 110-7.998m0 7.998l3.87 3m-3.87-3v12l-3.87-3M5.25 3h13.5A2.75 2.75 0 0121.25 5.75v12.5c0 .767-.225 1.476-.66 2.093l-2.057-1.07a2.752 2.752 0 01-1.298-.605L17.51 18.07a2.75 2.75 0 00.53 1.065h1.5a2.75 2.75 0 012.75 2.75v1.5c0 .613.25 1.165.705 1.615l2.266 1.11a.75.75 0 001.088-.413l2.633-2.057a.75.75 0 00-.413-1.088L15.416 14.03a2.75 2.75 0 00-.605-1.298L11.5 5.385a2.752 2.752 0 01.065-.53H5.75c-.926 0-1.691.433-2.167 1.082m0-18C4.6 1.66 3 3.368 3 5.25v12.5c0 .507.127 .958.37 1.35l2.078 1.055c.318.16.652.253 1.014.235.363-.018.695-.12 1.014-.305v-12.5c0-1.887 1.523-3.418 3.405-3.153zM9.75 15H5.25v-2.25c0-.388.158-.61.477-.73l2.067-1.055a.75.75 0 011.105 0l2.067 1.055c.318.16.477.382.477.73V15z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-kesh-dark">Competitor Intelligence</h2>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Competitor Overview -->
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Monitored Competitors</h3>
            <p className="text-sm text-gray-500">
                Competitor data loading...
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Market Position</h3>
            <p className="text-sm text-gray-500">
                Market analysis pending
            </p>
          </div>

          <!-- Pricing Comparison -->
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Pricing Comparison</h3>
            <p className="text-sm text-gray-500">
                Price data loading...
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Feature Gaps</h3>
            <p className="text-sm text-gray-500">
                Analysis in progress
            </p>
          </div>
        </div>

        <!-- Competitor List -->
        <div className="mt-6 bg-white rounded-lg shadow p-6 border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Competitor Analysis</h3>
          <p className="text-sm text-gray-500 text-gray-500">
                No competitors currently tracked
            </p>
          <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
            <li>Add competitors to monitor market trends</li>
            <li>Track pricing changes and promotions</li>
            <li>Analyze feature differences</li>
            <li>Identify competitive advantages</li>
          </ul>
        </div>
      </main>
    </div>
  );
}