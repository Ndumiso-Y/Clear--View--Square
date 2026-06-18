import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin/dashboard', enabled: true },
  { label: 'Stores',    to: '/admin/stores',    enabled: true },
  { label: 'Promotions',to: null,               enabled: false },
  { label: 'Settings',  to: null,               enabled: false },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Admin</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">Clearview Square</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
          {NAV_ITEMS.map(item =>
            item.enabled ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed select-none"
              >
                {item.label}
                <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              </span>
            )
          )}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          {user?.email && (
            <p className="text-xs text-gray-500 truncate mb-3" title={user.email}>
              {user.email}
            </p>
          )}
          <button
            onClick={signOut}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 min-w-0 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
