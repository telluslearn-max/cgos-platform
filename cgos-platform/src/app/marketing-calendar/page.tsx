/** @type {import('next').Metadata} */
export const metadata = {
  title: "CGOS Marketing Calendar - Campaign Management",
  description: "Commerce Growth OS - Marketing calendar and campaign management",
};

export default function MarketingCalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-green-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0-10l4 4M7 3a2 2 0 00-2 2v2M7 3a2 2 0 012-2h3.286a2 2 0 011.62.9l.828.44m2.929 1.43a2 2 0 01.896 1.83l-.12.12m4.5 1.5a2 2 0 001.964 2.363l1.55.275M15 13V6a2 2 0 00-2-2h-1m-4.286 7l-2.3 5.8M15 13l2.3 5.8m0 0a2 2 0 012 2v2m0-10l4 4M5 17a2 2 0 002 2h6m0 0a2 2 0 002-2h6m-9-7h.01m9.9 0a2 2 0 012 2v2m0-10a2 2 0 00-2-2H5m0 0a2 2 0 01-2 2v2M5 7a2 2 0 00-2 2h2m2.286 4l.321.585a1.998 1.998 0 01.11.3 1.999 1.999 0 00.294 1.25l2.186 1.2zM7 19a2 2 0 002 2h6m0 0a2 2 0 002-2H7m0 0a2 2 0 104 0a2 2 0 00-4 0z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-kesh-dark">Marketing Calendar</h2>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Calendar View -->
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Monthly Calendar</h3>
            <p className="text-sm text-gray-500">
              Calendar view loading...
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Upcoming Campaigns</h3>
            <p className="text-sm text-gray-500">
                Campaigns loading...
            </p>
          </div>

          <!-- Campaign Schedule -->
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Schedule</h3>
            <p className="text-sm text-gray-500">
              Drag & drop scheduling
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Budget Overview</h3>
            <p className="text-sm text-gray-500">
              Total budget: Loading...
            </p>
          </div>
        </div>

        <!-- Campaign Calendar -->
        <div className="mt-6 h-[500px] bg-white rounded-lg shadow overflow-hidden">
          <div className="h-full p-6">
            <p className="text-sm text-gray-500 text-center">
              Calendar visualization coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}