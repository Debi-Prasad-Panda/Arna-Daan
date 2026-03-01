import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const NAV_ITEMS = [
  { label: 'Receiver Feed', href: '/feed' },
  { label: 'My Claims', href: '/claims' },
  { label: 'Impact', href: '/impact' },
]

export default function ReceiverTopNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3a2c27]/50 bg-[#181210]/95 backdrop-blur-md px-6 py-4 lg:px-12">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-6">

        {/* Logo & Search */}
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="flex items-center gap-3 text-primary">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">volunteer_activism</span>
            </div>
            <h2 className="text-white text-xl font-extrabold tracking-tight">Annadaan</h2>
          </Link>
          <div className="hidden md:flex w-full max-w-md items-center rounded-xl bg-[#3a2c27] px-3 h-11 border border-transparent focus-within:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-[#bca39a] mr-2">search</span>
            <input
              type="text"
              placeholder="Search for donations, food type..."
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-[#bca39a] text-sm outline-none"
            />
          </div>
        </div>

        {/* Navigation & Profile */}
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`font-medium text-sm transition-colors ${
                  pathname === item.href
                    ? 'text-primary font-bold'
                    : 'text-[#bca39a] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="h-6 w-px bg-[#3a2c27] hidden lg:block" />

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-white leading-tight">
                {user?.name || 'NGO User'}
              </span>
              <span className="text-xs text-[#bca39a] uppercase tracking-wider font-semibold">
                Receiver
              </span>
            </div>

            <div className="relative group cursor-pointer">
              <div className="flex items-center justify-center size-10 rounded-full overflow-hidden border-2 border-[#3a2c27] hover:border-primary transition-colors bg-[#281e1b]">
                <span className="material-symbols-outlined text-[#d6c1ba]">domain</span>
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
