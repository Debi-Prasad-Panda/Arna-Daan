import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const NAV_ITEMS = [
  { label: 'KYC Verification', icon: 'verified_user', href: '/admin' },
  { label: 'Users Management', icon: 'group',         href: '/admin' },
  { label: 'Analytics',        icon: 'bar_chart',     href: '/admin/analytics' },
  { label: 'Settings',         icon: 'settings',      href: '/admin/settings' },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user   = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/login') }

  // ── Mobile: top bar with hamburger ──────────────────────────────────────
  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#2f1d17] border-b border-[#4a352f] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-9 bg-[#181210] rounded-full border-2 border-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d6c1ba] text-[18px]">admin_panel_settings</span>
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">{user?.name?.split(' ')[0] || 'Admin'}</p>
            <p className="text-[#d6c1ba] text-[10px] font-medium uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 text-white rounded-lg hover:bg-[#4a352f] transition-colors">
          <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile dropdown nav */}
      {open && (
        <div className="md:hidden bg-[#2f1d17] border-b border-[#4a352f] px-4 py-3 flex flex-col gap-1 sticky top-[57px] z-40">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.label + item.href} to={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-primary/20 text-primary border border-primary/30 font-bold' : 'text-[#d6c1ba] hover:bg-[#4a352f] hover:text-white font-medium'
                }`}>
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
          <button onClick={handleLogout}
            className="mt-1 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-[#4a352f] transition-colors font-bold text-sm">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      )}

      {/* Desktop sidebar ─ full height, sticky */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#2f1d17] border-r border-[#4a352f] flex-col min-h-screen sticky top-0 self-start h-screen">
        <div className="p-6 flex flex-col gap-8 flex-1 overflow-y-auto">
          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 bg-[#181210] rounded-full border-2 border-primary">
              <span className="material-symbols-outlined text-[#d6c1ba]">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-white text-base font-bold leading-tight truncate w-36">{user?.name || 'Annadaan Admin'}</h1>
              <p className="text-[#d6c1ba] text-xs font-medium uppercase tracking-wider">Super Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href
              return (
                <Link key={item.label + item.href} to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${
                    isActive ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm shadow-primary/10 font-bold' : 'text-[#d6c1ba] hover:bg-[#4a352f] hover:text-white font-medium'
                  }`}>
                  <span className={`material-symbols-outlined ${isActive ? 'fill-1' : 'group-hover:text-primary transition-colors'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-[#4a352f]">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl h-11 px-4 bg-[#4a352f] hover:bg-red-900/40 text-[#d6c1ba] hover:text-red-400 transition-all font-bold text-sm">
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
