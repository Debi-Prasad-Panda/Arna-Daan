import { useEffect, useState, useCallback } from 'react'
import useListingStore from '../store/listingStore'
import useRequestStore from '../store/requestStore'
import useDeliveryStore from '../store/deliveryStore'
import useUserProfileStore from '../store/userProfileStore'
import { useRealtime } from '../hooks/useRealtime'
import { APPWRITE_CONFIG } from '../lib/appwrite'

function StatCard({ title, value, icon, iconColor, trendBg, trendColor, trend, trendIcon, comparedTo, loading }) {
  return (
    <div className="bg-[#2f1d17] rounded-2xl p-5 border border-[#4a352f] shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
      <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className={`material-symbols-outlined text-6xl ${iconColor}`}>{icon}</span>
      </div>
      <div className="flex flex-col gap-1 z-10">
        <p className="text-[#d6c1ba] text-sm font-medium">{title}</p>
        {loading ? (
          <div className="h-8 w-20 bg-[#4a352f] rounded-lg animate-pulse mt-1" />
        ) : (
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        )}
      </div>
      <div className="flex items-center gap-2 mt-4 z-10">
        <span className={`${trendBg} ${trendColor} text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1`}>
          <span className="material-symbols-outlined text-sm">{trendIcon}</span>
          {trend}
        </span>
        <span className="text-[#d6c1ba] text-xs">{comparedTo}</span>
      </div>
    </div>
  )
}

export default function AdminStatsGrid() {
  const { listings, fetchListings } = useListingStore()
  const { requests, fetchRequests } = useRequestStore()
  const { deliveries, fetchDeliveries } = useDeliveryStore()
  const { profiles, fetchProfiles } = useUserProfileStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchListings(), fetchRequests(), fetchDeliveries(), fetchProfiles()])
      .finally(() => setLoading(false))
  }, [])

  // Realtime refresh on any change
  const refresh = useCallback(() => {
    fetchListings(); fetchRequests(); fetchDeliveries(); fetchProfiles()
  }, [])
  useRealtime(APPWRITE_CONFIG.listingsCollectionId,   refresh)
  useRealtime(APPWRITE_CONFIG.requestsCollectionId,   refresh)
  useRealtime(APPWRITE_CONFIG.deliveriesCollectionId, refresh)

  // Derive real numbers
  const totalUsers     = profiles.length
  const activeListings = listings.filter(l => l.status === 'Active').length
  const totalListings  = listings.length
  const mealsDelivered = deliveries.filter(d => d.status === 'Delivered').length
  const pendingKyc     = profiles.filter(p => p.role === 'ngo').length  // NGOs pending review

  // Format helpers
  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

  const STATS = [
    {
      title: 'Registered Users',
      value: fmt(totalUsers),
      icon: 'group',
      iconColor: 'text-primary',
      trend: `${totalUsers} total`,
      trendIcon: 'person_add',
      trendBg: 'bg-primary/20',
      trendColor: 'text-primary',
      comparedTo: 'Appwrite DB'
    },
    {
      title: 'Active Listings',
      value: fmt(activeListings),
      icon: 'inventory_2',
      iconColor: 'text-blue-400',
      trend: `${totalListings} ever posted`,
      trendIcon: 'trending_up',
      trendBg: 'bg-blue-500/20',
      trendColor: 'text-blue-400',
      comparedTo: 'including closed'
    },
    {
      title: 'Meals Delivered',
      value: fmt(mealsDelivered),
      icon: 'soup_kitchen',
      iconColor: 'text-orange-400',
      trend: `${deliveries.length} total`,
      trendIcon: 'local_shipping',
      trendBg: 'bg-orange-500/20',
      trendColor: 'text-orange-400',
      comparedTo: 'inc. in-progress'
    },
    {
      title: 'NGOs Registered',
      value: fmt(pendingKyc),
      icon: 'pending_actions',
      iconColor: 'text-yellow-400',
      trend: `${requests.filter(r => r.status === 'Pending').length} pending requests`,
      trendIcon: 'hourglass_empty',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400',
      comparedTo: 'awaiting approval'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(s => <StatCard key={s.title} {...s} loading={loading} />)}
    </div>
  )
}
