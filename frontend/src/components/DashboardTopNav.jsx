// Shared sidebar/topnav for donor dashboard screens
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Feed', href: '/feed', icon: 'list_alt' },
  { label: 'Volunteer', href: '/logistics', icon: 'local_shipping' },
]

export default function DashboardTopNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#3a2c27] bg-[#181210]/80 backdrop-blur-md px-6 py-4 lg:px-10">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <span className="material-symbols-outlined">volunteer_activism</span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-white">Annadaan</h2>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'text-primary font-bold'
                : 'text-[#bca39a] hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => document.getElementById('create-listing-form')?.scrollIntoView({ behavior: 'smooth' })}
          className="hidden md:flex items-center justify-center h-10 px-5 rounded-xl bg-primary hover:bg-orange-700 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20"
        >
          <span className="mr-2 material-symbols-outlined text-[18px]">add_circle</span>
          New Donation
        </button>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-white leading-tight">
              {user?.name || 'Donor User'}
            </span>
            <span className="text-xs text-[#bca39a] uppercase tracking-wider font-semibold">
              Donor
            </span>
          </div>

          <div className="relative group cursor-pointer">
            <div className="flex items-center justify-center size-10 rounded-full overflow-hidden border-2 border-[#3a2c27] hover:border-primary transition-colors bg-[#281e1b]">
              <span className="material-symbols-outlined text-[#bca39a]">person</span>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#281e1b] border border-[#3a2c27] shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 font-medium hover:bg-[#3a2c27] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
