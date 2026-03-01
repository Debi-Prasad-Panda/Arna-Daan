import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Receiver Feed', href: '/feed' },
  { label: 'My Claims', href: '/claims' },
  { label: 'Impact', href: '/impact' },
]

const PROFILE_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2t6tpUYRghIKDCEGXQ-xgMdFUS2UnYsbkoqpCU3fKntth2MunOJ8XXowBZNnfZ-awC6Q0-yFXfy1_ckr6qtlUwS_aJldlOG7kWuLCQoZY5ANErNV1FKkPf80WpT0ElmXWboyxQKlLHwCeag94mIo89A5qHB57WjSsabuGztLNIdheCJkK8s48Ef7OlbRVRqsS9ZEFTCn7vR9uwGuZNN2kv6fdwdorA5YMA7lq8ZvaD1RU5D_M2gkYi6qgfvjX8FRlPOvtTcJHvg'

export default function ReceiverTopNav() {
  const { pathname } = useLocation()

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

          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-[#3a2c27] text-[#bca39a] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full" />
            </button>
            <div className="h-10 w-10 rounded-full bg-[#3a2c27] overflow-hidden border border-[#3a2c27] cursor-pointer">
              <img src={PROFILE_IMG} alt="User Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}
