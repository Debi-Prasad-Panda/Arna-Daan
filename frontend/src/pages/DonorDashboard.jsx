import DashboardTopNav from '../components/DashboardTopNav'
import CreateListingForm from '../components/CreateListingForm'
import ActiveListings from '../components/ActiveListings'
import IncomingRequests from '../components/IncomingRequests'
import useAuthStore from '../store/authStore'
import useListingStore from '../store/listingStore'
import { useEffect, useMemo } from 'react'

const STATS = [
  {
    label: 'Total Meals Donated',
    value: '1,250',
    trend: '+12% this month',
    icon: 'restaurant',
    iconColor: 'text-primary',
  },
  {
    label: 'People Fed',
    value: '850',
    trend: '+5% this month',
    icon: 'groups',
    iconColor: 'text-blue-400',
  },
  {
    label: 'CO₂ Saved',
    value: '420',
    unit: 'kg',
    progress: 70,
    icon: 'co2',
    iconColor: 'text-green-400',
  },
]

function StatCard({ label, value, unit, trend, trendUp, icon, iconColor, progress }) {
  return (
    <div className="flex flex-col p-5 bg-[#23140f] border border-[#3a2c27] rounded-xl relative overflow-hidden group">
      <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity select-none">
        <span className={`material-symbols-outlined text-6xl ${iconColor}`}>{icon}</span>
      </div>
      <p className="text-[#bca39a] text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-1 text-white">
        {value}
        {unit && <span className="text-lg text-[#bca39a] font-normal ml-1">{unit}</span>}
      </p>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trendUp ? 'text-green-500' : 'text-[#bca39a]'}`}>
          <span className="material-symbols-outlined text-sm">{trendUp ? 'trending_up' : 'horizontal_rule'}</span>
          <span>{trend}</span>
        </div>
      )}
      {progress !== undefined && (
        <div className="mt-2 h-1.5 w-full bg-[#3a2c27] rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}

export default function DonorDashboard() {
  const user = useAuthStore(state => state.user)
  const { listings, fetchListings } = useListingStore()
  useEffect(() => { fetchListings() }, [])

  // Compute real stats from this donor's listings
  const myListings   = listings.filter(l => l.donorId === user?.$id)
  const totalMeals   = myListings.reduce((s, l) => s + (Number(l.quantity) || 0), 0)
  const peopleFed    = Math.round(totalMeals * 0.9)
  const co2Saved     = Math.round(totalMeals * 2.5)
  const co2Goal      = 1000

  // Monthly trend — count listings created this calendar month vs last
  const now = new Date()
  const thisMonth = myListings.filter(l => {
    const d = new Date(l.$createdAt || l.createdAt || 0)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const trend = thisMonth > 0 ? `+${thisMonth} this month` : 'No listings yet'
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#181210', color: '#ffffff' }}>
      <DashboardTopNav />
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 lg:px-16 flex flex-col gap-8">

        {/* Welcome + Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col justify-center gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
              Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'there'}</span>
            </h1>
            <p className="text-[#bca39a]">Your contributions are changing lives daily. Track your surplus and impact here.</p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Total Meals Donated" value={totalMeals.toLocaleString('en-IN')} icon="restaurant" iconColor="text-primary" trend={trend} trendUp={thisMonth > 0} />
            <StatCard label="People Fed" value={peopleFed.toLocaleString('en-IN')} icon="groups" iconColor="text-blue-400" trend={`~90% of servings`} trendUp />
            <StatCard label="CO₂ Saved" value={co2Saved.toLocaleString('en-IN')} unit="kg" icon="co2" iconColor="text-green-400" progress={Math.min((co2Saved / co2Goal) * 100, 100)} />
          </div>
        </section>

        {/* Main split: Form + Listings */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
          <CreateListingForm />
          <ActiveListings />
        </div>

        {/* Incoming requests from NGOs */}
        <IncomingRequests />

      </main>
    </div>
  )
}
