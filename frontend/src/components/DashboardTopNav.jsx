// Shared sidebar/topnav for donor dashboard screens
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'My Listings', href: '/listings', icon: 'list_alt' },
  { label: 'History', href: '/history', icon: 'history' },
  { label: 'Impact', href: '/impact', icon: 'trending_up' },
]

const PROFILE_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyCQcEfpln9MZ9ap8_d3__9OOJkQgkMUC54pEEmPeoeXLWMtBu-tbiCCSluYbB14XhUb7CgMKpFVoLCfc0SE86sH-313NWSfpYxNPbgQHd05zd81NNCNIWPZnCSQfrR6wwhGSi67Ip9CSiqYxH8U5C2N623TbuC4oTRXYwxww4CpBXYm7AY-p2Zfz96VxTrQtmoUQ7RVyBoHQa9hRfkBcAP3c28uhGe8ihjsdXcuszuVK4ZhY8ut0Vzcwc6QqmCegqN8a5hZf1-A'

export default function DashboardTopNav() {
  const { pathname } = useLocation()

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
        <Link
          to="/listings/new"
          className="hidden md:flex items-center justify-center h-10 px-5 rounded-xl bg-primary hover:bg-orange-700 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20"
        >
          <span className="mr-2 material-symbols-outlined text-[18px]">add_circle</span>
          New Donation
        </Link>
        <div className="relative size-10 rounded-full overflow-hidden border border-[#3a2c27] cursor-pointer">
          <img src={PROFILE_IMG} alt="User Profile" className="object-cover w-full h-full" />
        </div>
      </div>
    </header>
  )
}
