import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import useListingStore from '../store/listingStore'
import useRequestStore from '../store/requestStore'
import useDeliveryStore from '../store/deliveryStore'

// Simple CSS bar chart — no extra dependencies
function BarChart({ data, label, color }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-white text-sm font-bold">{label}</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className="text-[9px] text-[#bca39a] font-bold">{d.value || ''}</span>
            <div
              className={`w-full rounded-t-md transition-all duration-700 ${color}`}
              style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 8 : 0)}%` }}
            />
            <span className="text-[9px] text-[#bca39a] truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutRing({ pct, color, label, value }) {
  const r = 36, c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-24">
        <svg className="size-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#3a2c27" strokeWidth="10" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-black text-lg leading-none">{value}</span>
          <span className="text-[#bca39a] text-[9px] font-medium">{pct}%</span>
        </div>
      </div>
      <p className="text-[#bca39a] text-xs text-center font-medium">{label}</p>
    </div>
  )
}

// Build daily buckets for the last 14 days
function bucketByDay(items, dateField = '$createdAt') {
  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      date: d.toDateString(),
      value: 0,
    })
  }
  items.forEach(item => {
    const d = new Date(item[dateField] || item.createdAt || item.$createdAt).toDateString()
    const bucket = days.find(b => b.date === d)
    if (bucket) bucket.value++
  })
  return days
}

export default function AdminAnalytics() {
  const { listings, fetchListings }   = useListingStore()
  const { requests, fetchRequests }   = useRequestStore()
  const { deliveries, fetchDeliveries } = useDeliveryStore()
  const [loaded, setLoaded]           = useState(false)

  useEffect(() => {
    Promise.all([fetchListings(), fetchRequests(), fetchDeliveries()])
      .finally(() => setLoaded(true))
  }, [])

  // Derived metrics
  const totalMeals     = listings.reduce((s, l) => s + (Number(l.quantity) || 0), 0)
  const activeListings = listings.filter(l => l.status === 'Active').length
  const delivered      = deliveries.filter(d => d.status === 'Delivered').length
  const pending        = requests.filter(r => r.status === 'Pending').length

  const claimRate = listings.length
    ? Math.round((requests.length / listings.length) * 100)
    : 0
  const deliveryRate = requests.length
    ? Math.round((delivered / requests.length) * 100)
    : 0
  const activeRate = listings.length
    ? Math.round((activeListings / listings.length) * 100)
    : 0

  // Chart data
  const listingsByDay  = bucketByDay(listings)
  const requestsByDay  = bucketByDay(requests)
  const deliveriesByDay = bucketByDay(deliveries)

  // Category breakdown
  const byCategory = listings.reduce((acc, l) => {
    acc[l.category || 'Other'] = (acc[l.category || 'Other'] || 0) + 1
    return acc
  }, {})
  const categoryData = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }))

  return (
    <div className="bg-[#181210] text-slate-100 font-display min-h-screen flex flex-col md:flex-row overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#181210]">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#4a352f]/50 bg-[#181210]/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Platform Analytics</h2>
            <p className="text-[#d6c1ba] text-sm mt-1">Real-time insights from the Appwrite database</p>
          </div>
          <span className="flex items-center gap-2 text-xs text-green-400 font-bold">
            <span className="size-2 rounded-full bg-green-400 animate-pulse" /> Live data
          </span>
        </header>

        <div className="p-6 md:p-8 flex flex-col gap-8 max-w-[1400px] w-full mx-auto">

          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Listings',     val: listings.length,   icon: 'inventory_2',   color: 'text-primary'      },
              { label: 'Meals Capacity',      val: `${(totalMeals/1000).toFixed(1)}k`, icon: 'restaurant', color: 'text-orange-400' },
              { label: 'Deliveries Done',     val: delivered,         icon: 'local_shipping',color: 'text-green-400'    },
              { label: 'Active Requests',     val: pending,           icon: 'hourglass_empty',color:'text-yellow-400'   },
            ].map(k => (
              <div key={k.label} className="bg-[#2f1d17] border border-[#4a352f] rounded-2xl p-5 flex flex-col gap-2">
                <span className={`material-symbols-outlined ${k.color}`}>{k.icon}</span>
                <p className={`text-3xl font-black ${k.color}`}>{!loaded ? '…' : k.val}</p>
                <p className="text-[#d6c1ba] text-xs font-medium">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Listings over time */}
            <div className="bg-[#2f1d17] border border-[#4a352f] rounded-2xl p-6">
              {loaded
                ? <BarChart data={listingsByDay.slice(-10)} label="Listings Posted (last 10 days)" color="bg-primary/80" />
                : <div className="h-32 animate-pulse bg-[#3a2c27] rounded-xl" />}
            </div>
            {/* Deliveries over time */}
            <div className="bg-[#2f1d17] border border-[#4a352f] rounded-2xl p-6">
              {loaded
                ? <BarChart data={deliveriesByDay.slice(-10)} label="Deliveries Completed (last 10 days)" color="bg-green-500/70" />
                : <div className="h-32 animate-pulse bg-[#3a2c27] rounded-xl" />}
            </div>
          </div>

          {/* Donut ring row */}
          <div className="bg-[#2f1d17] border border-[#4a352f] rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="text-white font-bold text-sm">Platform Health Rings</h3>
            <div className="flex flex-wrap gap-10 justify-around">
              <DonutRing pct={claimRate}    color="#f97316" label="Claim Rate"           value={`${claimRate}%`}    />
              <DonutRing pct={deliveryRate} color="#4ade80" label="Delivery Success Rate" value={`${deliveryRate}%`} />
              <DonutRing pct={activeRate}   color="#60a5fa" label="Active Listing Rate"   value={`${activeRate}%`}  />
            </div>
          </div>

          {/* Category breakdown */}
          {categoryData.length > 0 && (
            <div className="bg-[#2f1d17] border border-[#4a352f] rounded-2xl p-6">
              <h3 className="text-white font-bold text-sm mb-5">Listings by Food Category</h3>
              <div className="flex flex-col gap-3">
                {categoryData.map((cat, i) => {
                  const maxVal = categoryData[0]?.value || 1
                  return (
                    <div key={cat.label} className="flex items-center gap-3">
                      <span className="text-xs text-[#d6c1ba] w-28 truncate shrink-0">{cat.label}</span>
                      <div className="flex-1 bg-[#3a2c27] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/80"
                          style={{ width: `${(cat.value / maxVal) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-white font-bold w-6 text-right">{cat.value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Requests trend */}
          <div className="bg-[#2f1d17] border border-[#4a352f] rounded-2xl p-6">
            {loaded
              ? <BarChart data={requestsByDay.slice(-10)} label="Requests / Claims (last 10 days)" color="bg-blue-400/70" />
              : <div className="h-32 animate-pulse bg-[#3a2c27] rounded-xl" />}
          </div>
        </div>
      </main>
    </div>
  )
}
