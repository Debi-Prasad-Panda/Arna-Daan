import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/volunteer-dashboard' },
  { label: 'Logistics', href: '/logistics' },
  { label: 'Community', href: '/community' },
  { label: 'Profile', href: '/profile' },
]

const PROFILE_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBELW-ODypq27sBGOoo4fKJGLPLAOIwj4GLsSxv9WKwBx0DkJEtEgStuS1TJAb21NxW_5rBwWUxQB46HxjffwCfbB43JS9Sf2CJHFvobmdBIcHo4M-x5-emz73fi-J4kUztSD8XNMxTQ9h_n6MM-b8frGzL_e41guu7mgHj9WL_1pbzoyxrnZHMYdVIjE0FfluQMGdSnxzG6yjdwb1A2SATtnPfeykjhznC24UKBhym5hQTs_gku9dq3GpuMLixuEuvahKNZAtxOw'

export default function VolunteerTopNav() {
  const { pathname } = useLocation()

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
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-[#e55a2b] transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Active Mission</span>
          </button>
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-[#3a2c27]" 
            style={{ backgroundImage: `url("${PROFILE_IMG}")` }}
          />
        </div>
      </div>
    </header>
  )
}
