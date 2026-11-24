/** @type {import('next').Metadata} */
export const metadata = {
  title: "CGOS Social Intelligence - Social Media Performance",
  description: "Commerce Growth OS - Social media intelligence and monitoring",
};

export default function SocialIntelligencePage() {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-cyan-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM12 10a5 5 0 015 5h-10a5 5 0 015-5zT16 7a1 1 0 010 2h1a1 1 0 010 2h-1m0-8a1 1 0 010 2h1a1 1 0 010 2h-1m-5.23 3h7.342a1 1 0 01.733.683l-.305 1.055a1 1 0 11-.947-.09l-.305-1.055a1 1 0 11-.378-.635zM8.358 15.555a1 1 0 01-.14.056l-.805.332a1 1 0 01-.587.318l-.805-.332a1 1 0 01-.158-.604l.529-1.03m1.782 0a1 1 0 01.533.218l.805.332a1 1 0 01.39.177l.805-.332a1 1 0 01.311-.443l-.467-1.011m-5.302.644a1 1 0 01-.312.72l-.805.332a1 1 0 01-.6 .178l-.805-.332a1 1 0 01-.582-.337l.528-1.03M13.364 5a1 1 0 01.637.11l.805.332a1 1 0 01.39.178l.805-.332a1 1 0 01-.078.633l-.805.332a1 1 0 11-.629-.316l-.805-.332a1 1 0 01-.14-.056l.528-1.03m5.408-.332a1 1 0 01.311.443l.805-.332a1 1 0 01.533.217l.805.332a1 1 0 11.158.298l-.805.332a1 1 0 01-.312-.72l-.805-.332M9.94 9.94l.707.707M15 15l.707.707m-3.356-3.356l-.707-.707M7 7l.707-.707 1.414 1.414M15 15l1.414 1.414M9.94 9.94l-1.414-1.414 1.414-1.414"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-kesh-dark">Social Intelligence</h2>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Social Accounts -->
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Connected Accounts</h3>
            <p className="text-sm text-gray-500">
                Social profiles loading...
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Performance Metrics</h3>
            <p className="text-sm text-gray-500">
                Metrics loading...
            </p>
          </div>

          <!-- Engagement -->
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Engagement Rate</h3>
            <p className="text-sm text-gray-500">
                Calculating engagement...
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Reach & Impressions</h3>
            <p className="text-sm text-gray-500">
                Reach data loading...
            </p>
          </div>
        </div>

        <!-- Platform Performance -->
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Facebook</h4>
            <p className="text-xs text-gray-400">0% engagement</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Instagram</h4>
            <p className="text-xs text-gray-400">0% engagement</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Twitter</h4>
            <p className="text-xs text-gray-400">0% engagement</p>
          </div>
        </div>
      </main>
    </div>
  );
}