import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const NAV_ITEMS = [
  { label: 'Logistics', href: '/logistics' },
  { label: 'Community', href: '/community' },
  { label: 'Profile', href: '/profile' },
]

export default function VolunteerTopNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-[#3a2c27] px-6 py-4 bg-[#181210] sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="size-8 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
        </Link>
        <Link to="/">
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Annadaan</h2>
        </Link>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium leading-normal transition-colors ${
                pathname === item.href || (item.label === 'Logistics' && pathname.includes('/logistics'))
                  ? 'text-primary font-bold'
                  : 'text-[#bca39a] hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-[#e55a2b] transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Active Mission</span>
          </button>
          
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-white leading-tight">
                {user?.name || 'Volunteer'}
              </span>
              <span className="text-xs text-[#bca39a] uppercase tracking-wider font-semibold">
                Driver
              </span>
            </div>

            <div className="relative group cursor-pointer">
              <div className="flex items-center justify-center size-10 rounded-full overflow-hidden border-2 border-[#3a2c27] hover:border-primary transition-colors bg-[#281e1b]">
                <span className="material-symbols-outlined text-[#d6c1ba]">local_shipping</span>
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
      </div>
    </header>
  )
}
