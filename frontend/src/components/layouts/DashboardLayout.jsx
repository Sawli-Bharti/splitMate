import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'

const navItems = [
  { to: ROUTES.dashboard, label: 'Dashboard' },
  { to: ROUTES.balances, label: 'Balances' },
  { to: ROUTES.groups, label: 'Groups' },
  { to: ROUTES.settlements, label: 'Settlements' },
]

export default function DashboardLayout() {
  const { logout, user } = useAuth()

  return (
    <div className="min-h-svh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-950">SplitMate</p>
            <p className="text-sm text-slate-500">
              {user?.name ? `Signed in as ${user.name}` : 'Expense sharing workspace'}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-950 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
