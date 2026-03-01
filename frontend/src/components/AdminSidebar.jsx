import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/admin-dashboard' },
  { label: 'KYC Verification', icon: 'verified_user', href: '/admin', active: true },
  { label: 'Users Management', icon: 'group', href: '/admin/users' },
  { label: 'Analytics', icon: 'bar_chart', href: '/admin/analytics' },
  { label: 'Settings', icon: 'settings', href: '/admin/settings' },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-full md:w-72 bg-[#2f1d17] border-r border-[#4a352f] flex flex-col h-full min-h-screen md:sticky md:top-0">
      <div className="p-6 flex flex-col gap-8 flex-1">
        
        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC_mC1TuGjhh_cVGzJ5dzRADtP-gb8MbDbnvbitqKsh_XHEuze0VycbxtA5ZKs5QGHE5Wxb1FCXLVShdmVbRC82CCYnz2RwBSRwK1_GqEuGZ7GSNopGxGCorgSw0gYcUhxAs2gotK1zZaldubePaaDZxjIUl2bU-klJPDc0bPpGPM9rtTwObwSDwta4er1CZn6u2fMhqO1M5jvt_nTd_VJsOa-girRwTPzg3PSF-jgpKpwCvWtIjQY7jZIKIkaD0W2uSeIZ2mqDg" 
              alt="Admin profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold leading-tight">Annadaan Admin</h1>
            <p className="text-[#d6c1ba] text-xs font-medium uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || item.active // Force active for demo if item.active matches

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm shadow-primary/10 font-bold'
                    : 'text-[#d6c1ba] hover:bg-[#4a352f] hover:text-white font-medium'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : 'group-hover:text-primary transition-colors'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-[#4a352f]">
        <button className="w-full flex items-center justify-center gap-2 rounded-xl h-11 px-4 bg-[#4a352f] hover:bg-red-900/40 text-[#d6c1ba] hover:text-red-400 transition-all font-bold text-sm">
          <span className="material-symbols-outlined text-lg">logout</span>
          Logout
        </button>
      </div>
    </aside>
  )
}
