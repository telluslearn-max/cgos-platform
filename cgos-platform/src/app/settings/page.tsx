/** @type {import('next').Metadata} */
export const metadata = {
  title: "CGOS Settings - Tenant Management",
  description: "Commerce Growth OS - Multi-tenant business management",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-purple-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H11a2 2 0 00-2 2v6m12 4h-2m0 0h-2m2 0a2 2 0 100-4h2a2 2 0 100 4zm-2-6a2 2 0 11-4 0 2 2 0 014 0zM5 7a2 2 0 11-4 0 2 2 0 014 0zM3 15a2 2 0 11-2-2H1a2 2 0 112-2h12a2 2 0 112 2h-1M9 10v10m-7 0V5m7 0v5-3.5 3.5M15.5 15.5l3.5 3.5m1.4-1.4l-3.5-3.5M5 15a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-kesh-dark">Settings</h2>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tenant Configuration */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Tenant Configuration</h3>
            <p className="text-sm text-gray-500">
                Tenant data loading...
            </p>
          </div>

          {/* Business Profile */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Business Profile</h3>
            <p className="text-sm text-gray-500">
                Profile data loading...
            </p>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Subscription</h3>
            <p className="text-sm text-gray-500">
                Plan: starter | Status: active
            </p>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">User Management</h3>
            <p className="text-sm text-gray-500">
                Users: 1 active
            </p>
          </div>
        </div>

        {/* Tenant Settings */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Currency</h4>
            <p className="text-3xl font-bold text-kesh-green">KES</p>
            <p className="text-xs text-gray-500">Kenyan Shilling</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Tax Rate</h4>
            <p className="text-3xl font-bold text-kesh-green">16%</p>
            <p className="text-xs text-gray-500">VAT rate</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Locale</h4>
            <p className="text-3xl font-bold text-kesh-green">en-KE</p>
            <p className="text-xs text-gray-500">English Kenya</p>
          </div>
        </div>

        {/* Tenant Management */}
        <div className="mt-6 bg-white rounded-lg shadow p-6 border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Tenant Management</h3>
          <p className="text-sm text-gray-500 text-gray-500">
                Current tenant: NURU Electronics
            </p>
          <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
            <li>Add new tenants to expand CGOS multi-tenant capabilities</li>
            <li>Configure per-tenant settings and permissions</li>
            <li>Manage tenant subscriptions and plans</li>
            <li>Set tenant-specific SEO configurations</li>
          </ul>
        </div>
      </main>
    </div>
  );
}