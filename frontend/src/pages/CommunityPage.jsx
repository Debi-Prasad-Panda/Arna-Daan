import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getHomeRoute } from '../store/authStore'
import useListingStore from '../store/listingStore'
import useDeliveryStore from '../store/deliveryStore'
import useRequestStore from '../store/requestStore'

// ── Shared nav sub-component based on role ──────────────────────────────────
function CommunityNav() {
  const { user, role, logout } = useAuthStore()
  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }
  const homeHref = getHomeRoute(role)
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#3a2c27] bg-[#181210]/95 backdrop-blur-md px-6 py-4 lg:px-12">
      <Link to="/" className="flex items-center gap-3 text-primary">
        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">volunteer_activism</span>
        </div>
        <h2 className="text-white text-xl font-extrabold tracking-tight">Annadaan</h2>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link to={homeHref} className="text-sm font-medium text-[#bca39a] hover:text-white transition-colors">Dashboard</Link>
        <Link to="/community" className="text-sm font-bold text-primary">Community</Link>
        <Link to="/profile" className="text-sm font-medium text-[#bca39a] hover:text-white transition-colors">Profile</Link>
      </nav>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-white">{user?.name || 'User'}</span>
          <span className="text-xs text-[#bca39a] uppercase tracking-wider font-semibold">{role || 'member'}</span>
        </div>
        <div className="relative group cursor-pointer">
          <div className="flex items-center justify-center size-10 rounded-full border-2 border-[#3a2c27] hover:border-primary transition-colors bg-[#281e1b]">
            <span className="material-symbols-outlined text-[#bca39a]">person</span>
          </div>
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#281e1b] border border-[#3a2c27] shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <Link to="/profile" className="w-full text-left px-4 py-2 text-sm text-white font-medium hover:bg-[#3a2c27] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">manage_accounts</span> Profile
            </Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 font-medium hover:bg-[#3a2c27] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">logout</span> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

// ── Leaderboard data (demo) ──────────────────────────────────────────────────
const LEADERBOARD = [
  { rank: 1, name: 'Sunshine Bakery', meals: 4820, badge: '🥇', role: 'Donor', trend: '+134 this week' },
  { rank: 2, name: 'Green Leaf Bistro', meals: 3610, badge: '🥈', role: 'Donor', trend: '+89 this week' },
  { rank: 3, name: 'Hope Foundation NGO', meals: 3210, badge: '🥉', role: 'NGO', trend: '+210 this week' },
  { rank: 4, name: 'Arun Sharma', meals: 2890, badge: '🚀', role: 'Volunteer', trend: '+56 this week' },
  { rank: 5, name: 'City Market Co-op', meals: 2540, badge: '⭐', role: 'Donor', trend: '+78 this week' },
  { rank: 6, name: 'Priya Nair', meals: 1980, badge: '⭐', role: 'Volunteer', trend: '+45 this week' },
  { rank: 7, name: 'Sunrise Shelter', meals: 1740, badge: '⭐', role: 'NGO', trend: '+92 this week' },
  { rank: 8, name: 'Dominos Downtown', meals: 1320, badge: '⭐', role: 'Donor', trend: '+23 this week' },
]

const STORIES = [
  {
    id: 1,
    title: '"Every meal delivered feels like a hug."',
    author: 'Priya Nair',
    role: 'Volunteer · 210 deliveries',
    avatar: '🚗',
    body: `I started volunteering here just three months ago. I had no idea how many families were just waiting for a warm meal. Now I do 2–3 deliveries every weekend. It takes 2 hours but the smiles last all week.`,
    color: 'from-primary/20 to-transparent',
  },
  {
    id: 2,
    title: '"We used to throw away 60 kg of food daily."',
    author: 'City Market Co-op',
    role: 'Donor · 3,200 meals saved',
    avatar: '🏪',
    body: `Our store had surplus produce that we couldn't sell. We'd discard it every night. Annadaan changed that. In five months, we have redirected over 3,200 meals to families who actually need them.`,
    color: 'from-blue-500/20 to-transparent',
  },
  {
    id: 3,
    title: '"Our shelter can now serve dinner every night."',
    author: 'Hope Foundation NGO',
    role: 'NGO · 420 beneficiaries served',
    avatar: '🙏',
    body: `Before Annadaan, dinner at our shelter was uncertain. Today, we receive food claims in real time, coordinate pickups through the platform, and have consistent meals for our 420 residents every single day.`,
    color: 'from-green-500/20 to-transparent',
  },
]

const ROLE_COLOR = {
  Donor: 'bg-primary/15 text-primary',
  NGO: 'bg-blue-500/15 text-blue-400',
  Volunteer: 'bg-green-500/15 text-green-400',
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('leaderboard')

  // Live Appwrite data for the stat strip
  const { listings, fetchListings }     = useListingStore()
  const { deliveries, fetchDeliveries } = useDeliveryStore()
  const { requests, fetchRequests }     = useRequestStore()
  useEffect(() => { fetchListings(); fetchDeliveries(); fetchRequests() }, [])

  const totalMeals      = listings.reduce((s, l) => s + (Number(l.quantity) || 0), 0)
  const peopleFed       = Math.round(totalMeals * 0.9)
  const volunteersCount = new Set(deliveries.filter(d => d.volunteerId).map(d => d.volunteerId)).size
  const co2Kg           = Math.round(totalMeals * 2.5)
  const co2Display      = co2Kg >= 1000 ? `${(co2Kg / 1000).toFixed(1)}t` : `${co2Kg}kg`
  const thisMonthMeals  = listings
    .filter(l => { const d = new Date(l.$createdAt || 0); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() })
    .reduce((s, l) => s + (Number(l.quantity) || 0), 0)

  return (
    <div className="min-h-screen flex flex-col bg-[#181210] font-display text-white">
      <CommunityNav />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-10">

        {/* Hero */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">groups</span>
            Community Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Together We've Saved<br />
            <span className="text-primary">
              {thisMonthMeals > 0 ? `${thisMonthMeals.toLocaleString('en-IN')} Meals` : '1,240+ Meals'}
            </span> This Month
          </h1>
          <p className="text-[#bca39a] text-lg max-w-2xl mx-auto">
            Every donor, volunteer, and NGO is part of this movement. Celebrate impact, discover stories, and climb the leaderboard.
          </p>
        </section>

        {/* Global stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: 'restaurant', val: totalMeals > 0 ? totalMeals.toLocaleString('en-IN') : '—', label: 'Meals Rescued', color: 'text-primary' },
            { icon: 'groups',     val: peopleFed  > 0 ? peopleFed.toLocaleString('en-IN')  : '—', label: 'People Fed',   color: 'text-blue-400' },
            { icon: 'local_shipping', val: volunteersCount > 0 ? String(volunteersCount) : '—', label: 'Active Volunteers', color: 'text-green-400' },
            { icon: 'co2',        val: co2Kg > 0  ? co2Display : '—', label: 'CO₂ Prevented', color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#23140f] border border-[#3a2c27] rounded-2xl p-5 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
              <span className={`material-symbols-outlined text-3xl mb-2 ${s.color}`}>{s.icon}</span>
              <p className="text-2xl font-black text-white">{s.val}</p>
              <p className="text-xs text-[#bca39a] font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 bg-[#23140f] border border-[#3a2c27] rounded-2xl p-1.5 mb-8 w-fit">
          {['leaderboard', 'stories'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-[#bca39a] hover:text-white'
              }`}
            >
              {tab === 'leaderboard' ? '🏆 Leaderboard' : '📖 Stories'}
            </button>
          ))}
        </div>

        {/* ── Leaderboard Tab ── */}
        {activeTab === 'leaderboard' && (
          <div className="flex flex-col gap-3">
            {LEADERBOARD.map((row) => (
              <div
                key={row.rank}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:border-primary/40 ${
                  row.rank <= 3
                    ? 'bg-gradient-to-r from-primary/10 to-[#23140f] border-primary/30'
                    : 'bg-[#23140f] border-[#3a2c27]'
                }`}
              >
                <div className="text-2xl w-10 text-center">{row.badge}</div>
                <div className="w-10 h-10 rounded-full bg-[#3a2c27] flex items-center justify-center text-lg font-black text-white">
                  {row.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{row.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLOR[row.role]}`}>{row.role}</span>
                  </div>
                  <p className="text-xs text-[#bca39a] mt-0.5">{row.trend}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-white text-lg">{row.meals.toLocaleString()}</p>
                  <p className="text-[10px] text-[#bca39a] uppercase tracking-wide font-semibold">meals saved</p>
                </div>
              </div>
            ))}
            <p className="text-center text-[#bca39a] text-xs mt-4">Rankings update weekly · based on meals rescued</p>
          </div>
        )}

        {/* ── Stories Tab ── */}
        {activeTab === 'stories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORIES.map(s => (
              <div
                key={s.id}
                className={`flex flex-col bg-gradient-to-br ${s.color} bg-[#23140f] border border-[#3a2c27] rounded-2xl p-6 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5`}
              >
                <p className="text-3xl mb-4">{s.avatar}</p>
                <blockquote className="text-white font-bold text-lg leading-snug mb-4">{s.title}</blockquote>
                <p className="text-[#bca39a] text-sm leading-relaxed flex-1">{s.body}</p>
                <div className="mt-6 pt-4 border-t border-[#3a2c27]">
                  <p className="font-bold text-white text-sm">{s.author}</p>
                  <p className="text-xs text-[#bca39a] mt-0.5">{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}
