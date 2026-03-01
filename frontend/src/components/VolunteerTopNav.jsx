import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const NAV_ITEMS = [
  { label: 'Logistics',  href: '/logistics', icon: 'local_shipping' },
  { label: 'Community',  href: '/community', icon: 'groups' },
  { label: 'Profile',    href: '/profile',   icon: 'person' },
]

export default function VolunteerTopNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user   = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <header className="flex flex-col whitespace-nowrap border-b border-[#3a2c27] bg-[#181210] sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">volunteer_activism</span>
          </Link>
          <Link to="/"><h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Annadaan</h2></Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} to={item.href} className={`text-sm font-medium leading-normal transition-colors ${
              pathname === item.href ? 'text-primary font-bold' : 'text-[#bca39a] hover:text-primary'
            }`}>{item.label}</Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-9 px-5 bg-primary hover:bg-[#e55a2b] transition-colors text-white text-sm font-bold">
            Active Mission
          </button>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-white leading-tight">{user?.name?.split(' ')[0] || 'Volunteer'}</span>
            <span className="text-xs text-[#bca39a] uppercase tracking-wider font-semibold">Driver</span>
          </div>

          <div className="relative group cursor-pointer">
            <div className="flex items-center justify-center size-9 rounded-full border-2 border-[#3a2c27] hover:border-primary transition-colors bg-[#281e1b]">
              <span className="material-symbols-outlined text-[#d6c1ba] text-[18px]">local_shipping</span>
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#281e1b] border border-[#3a2c27] shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
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
          {NAV_ITEMS.map(item => (
            <Link key={item.href} to={item.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href ? 'bg-primary/10 text-primary font-bold' : 'text-[#bca39a] hover:text-white hover:bg-[#3a2c27]'
              }`}>
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button className="mt-2 flex items-center justify-center gap-2 py-3 bg-primary rounded-xl text-white text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
            Active Mission
          </button>
          <button onClick={handleLogout} className="mt-1 flex items-center gap-3 py-3 px-3 text-red-400 text-sm font-medium rounded-xl hover:bg-[#3a2c27] transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
