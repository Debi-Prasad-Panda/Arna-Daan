import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const NAV_ITEMS = [
  { label: 'Receiver Feed', href: '/feed',      icon: 'list_alt' },
  { label: 'My Claims',     href: '/claims',    icon: 'receipt_long' },
  { label: 'Community',     href: '/community', icon: 'groups' },
  { label: 'Profile',       href: '/profile',   icon: 'person' },
]

export default function ReceiverTopNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user   = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3a2c27]/50 bg-[#181210]/95 backdrop-blur-md flex flex-col">
      <div className="mx-auto max-w-7xl w-full flex items-center justify-between gap-3 px-4 md:px-6 lg:px-12 py-3.5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-primary shrink-0">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[18px]">volunteer_activism</span>
          </div>
          <h2 className="text-white text-lg font-extrabold tracking-tight">Annadaan</h2>
        </Link>

        {/* Search bar — desktop only */}
        <div className="hidden md:flex flex-1 max-w-md items-center rounded-xl bg-[#3a2c27] px-3 h-10 border border-transparent focus-within:border-primary/50 transition-colors">
          <span className="material-symbols-outlined text-[#bca39a] mr-2 text-[18px]">search</span>
          <input type="text" placeholder="Search for donations, food type..." className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-[#bca39a] text-sm outline-none" />
        </div>

        {/* Desktop nav + profile */}
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden lg:flex items-center gap-5">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} to={item.href} className={`font-medium text-sm transition-colors ${
                pathname === item.href ? 'text-primary font-bold' : 'text-[#bca39a] hover:text-white'
              }`}>{item.label}</Link>
            ))}
          </nav>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-white leading-tight">{user?.name?.split(' ')[0] || 'NGO'}</span>
            <span className="text-xs text-[#bca39a] uppercase tracking-wider font-semibold">Receiver</span>
          </div>

          <div className="relative group cursor-pointer">
            <div className="flex items-center justify-center size-9 rounded-full border-2 border-[#3a2c27] hover:border-primary transition-colors bg-[#281e1b]">
              <span className="material-symbols-outlined text-[#d6c1ba] text-[18px]">domain</span>
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#281e1b] border border-[#3a2c27] shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 font-medium hover:bg-[#3a2c27] transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-white rounded-lg hover:bg-[#3a2c27] transition-colors" aria-label="Toggle menu">
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-[#3a2c27] bg-[#181210] px-4 py-3 flex flex-col gap-1">
          {/* Mobile search */}
          <div className="flex items-center rounded-xl bg-[#3a2c27] px-3 h-10 mb-2">
            <span className="material-symbols-outlined text-[#bca39a] mr-2 text-[18px]">search</span>
            <input type="text" placeholder="Search food listings..." className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-[#bca39a] text-sm outline-none" />
          </div>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} to={item.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href ? 'bg-primary/10 text-primary font-bold' : 'text-[#bca39a] hover:text-white hover:bg-[#3a2c27]'
              }`}>
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="mt-1 flex items-center gap-3 py-3 px-3 text-red-400 text-sm font-medium rounded-xl hover:bg-[#3a2c27] transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
