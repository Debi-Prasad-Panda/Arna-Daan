import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Feed',      href: '/feed',      icon: 'list_alt' },
  { label: 'Volunteer', href: '/logistics', icon: 'local_shipping' },
]

export default function DashboardTopNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user   = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <header className="sticky top-0 z-50 flex flex-col border-b border-[#3a2c27] bg-[#181210]/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">Annadaan</h2>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className={`text-sm font-medium transition-colors ${
              pathname === item.href ? 'text-primary font-bold' : 'text-[#bca39a] hover:text-white'
            }`}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/dashboard" className="hidden md:flex items-center justify-center h-10 px-5 rounded-xl bg-primary hover:bg-orange-700 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20">
            <span className="mr-2 material-symbols-outlined text-[18px]">add_circle</span>
            New Donation
          </Link>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-white leading-tight">{user?.name?.split(' ')[0] || 'Donor'}</span>
            <span className="text-xs text-[#bca39a] uppercase tracking-wider font-semibold">Donor</span>
          </div>

          <div className="relative group cursor-pointer">
            <div className="flex items-center justify-center size-9 rounded-full border-2 border-[#3a2c27] hover:border-primary transition-colors bg-[#281e1b]">
              <span className="material-symbols-outlined text-[#bca39a] text-[18px]">person</span>
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#281e1b] border border-[#3a2c27] shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-[#3a2c27] transition-colors">Profile</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 font-medium hover:bg-[#3a2c27] transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white rounded-lg hover:bg-[#3a2c27] transition-colors" aria-label="Toggle menu">
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[#3a2c27] bg-[#181210] px-4 py-3 flex flex-col gap-1">
          {navItems.map(item => (
            <Link key={item.href} to={item.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href ? 'bg-primary/10 text-primary font-bold' : 'text-[#bca39a] hover:text-white hover:bg-[#3a2c27]'
              }`}>
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <Link to="/dashboard" onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 py-3 bg-primary rounded-xl text-white text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            New Donation
          </Link>
          <button onClick={handleLogout} className="mt-1 flex items-center justify-center gap-2 py-3 text-red-400 text-sm font-medium rounded-xl hover:bg-[#3a2c27] transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
