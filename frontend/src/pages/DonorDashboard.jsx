import DashboardTopNav from '../components/DashboardTopNav'
import CreateListingForm from '../components/CreateListingForm'
import ActiveListings from '../components/ActiveListings'

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

function StatCard({ stat }) {
  return (
    <div className="flex flex-col p-5 bg-[#23140f] border border-[#3a2c27] rounded-xl relative overflow-hidden group">
      <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity select-none">
        <span className={`material-symbols-outlined text-6xl ${stat.iconColor}`}>{stat.icon}</span>
      </div>
      <p className="text-[#bca39a] text-sm font-medium">{stat.label}</p>
      <p className="text-3xl font-bold mt-1 text-white">
        {stat.value}
        {stat.unit && <span className="text-lg text-[#bca39a] font-normal ml-1">{stat.unit}</span>}
      </p>
      {stat.trend && (
        <div className="flex items-center gap-1 mt-2 text-green-500 text-xs font-bold">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>{stat.trend}</span>
        </div>
      )}
      {stat.progress !== undefined && (
        <div className="mt-2 h-1.5 w-full bg-[#3a2c27] rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${stat.progress}%` }} />
        </div>
      )}
    </div>
  )
}

export default function DonorDashboard() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#181210', color: '#ffffff' }}>
      <DashboardTopNav />
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 lg:px-16 flex flex-col gap-8">

        {/* Welcome + Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col justify-center gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
              Welcome back, <span className="text-primary">Rahul</span>
            </h1>
            <p className="text-[#bca39a]">Your contributions are changing lives daily. Track your surplus and impact here.</p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
          </div>
        </section>

        {/* Main split: Form + Listings */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
          <CreateListingForm />
          <ActiveListings />
        </div>

      </main>
    </div>
  )
}
