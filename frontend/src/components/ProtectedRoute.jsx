import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore, { getHomeRoute } from '../store/authStore'

/**
 * Route → allowed roles mapping
 * Any route NOT listed here is accessible by ALL authenticated users.
 */
const ROLE_RULES = {
  // Donor only
  '/dashboard':       ['donor'],
  // NGO / Receiver only
  '/feed':            ['ngo'],
  '/claims':          ['ngo'],
  // Volunteer only
  '/logistics':       ['volunteer'],
  // Admin only
  '/admin':           ['admin'],
  '/admin/analytics': ['admin'],
  '/admin/settings':  ['admin'],
  // Community + Profile: all roles allowed (no entry needed)
}

export default function ProtectedRoute() {
  const { user, role, isLoading } = useAuthStore()
  const { pathname } = useLocation()

  // Still checking session — show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#181210]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
          <p className="text-[#d6c1ba] font-medium animate-pulse">Verifying session…</p>
        </div>
      </div>
    )
  }

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  const allowedRoles = ROLE_RULES[pathname]
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in but wrong role — redirect to their own home
    return <Navigate to={getHomeRoute(role)} replace />
  }

  return <Outlet />
}
