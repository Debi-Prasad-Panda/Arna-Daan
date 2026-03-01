import { useEffect, useState } from 'react'
import useListingStore from '../store/listingStore'
import useDeliveryStore from '../store/deliveryStore'
import useRequestStore from '../store/requestStore'

function useRealStats() {
  const { listings, fetchListings }     = useListingStore()
  const { deliveries, fetchDeliveries } = useDeliveryStore()
  const { requests, fetchRequests }     = useRequestStore()
  useEffect(() => { fetchListings(); fetchDeliveries(); fetchRequests() }, [])

  const totalMeals   = listings.reduce((s, l) => s + (Number(l.quantity) || 0), 0)
  const volunteersSet = new Set(deliveries.filter(d => d.volunteerId).map(d => d.volunteerId))
  const donorsSet    = new Set(listings.filter(l => l.donorId).map(l => l.donorId))
  const delivered    = deliveries.filter(d => d.status === 'Delivered').length

  return { totalMeals, activeVolunteers: volunteersSet.size, activeDonors: donorsSet.size, delivered }
}

export default function StatsSection() {
  const { totalMeals, activeVolunteers, activeDonors, delivered } = useRealStats()

  const stats = [
    {
      label: 'Total Meals Saved',
      value: totalMeals > 0 ? `${totalMeals.toLocaleString('en-IN')}` : '—',
      trend: delivered > 0 ? `${delivered} delivered so far` : 'Be the first to donate!',
      icon: 'restaurant',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Active Donors',
      value: activeDonors > 0 ? String(activeDonors) : '—',
      trend: activeDonors > 0 ? `${activeDonors} organisations giving` : 'Join as a donor today',
      icon: 'storefront',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Active Volunteers',
      value: activeVolunteers > 0 ? String(activeVolunteers) : '—',
      trend: activeVolunteers > 0 ? `${activeVolunteers} on the road` : 'Volunteer to deliver meals',
      icon: 'diversity_1',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
  ]

  return (
    <section id="impact" className="py-10 border-y border-white/5 bg-background-dark/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl bg-surface-dark p-8 border border-white/5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <h3 className="mt-2 text-4xl font-black text-white tracking-tight">{stat.value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-full ${stat.iconBg} flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-green-500">trending_up</span>
                <span className="text-sm font-medium text-green-500">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
