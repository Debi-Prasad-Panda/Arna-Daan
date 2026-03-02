import { useEffect, useCallback, useState } from 'react'
import ReceiverTopNav from '../components/ReceiverTopNav'
import useRequestStore from '../store/requestStore'
import useListingStore from '../store/listingStore'
import useAuthStore from '../store/authStore'
import { useRealtime } from '../hooks/useRealtime'
import { APPWRITE_CONFIG } from '../lib/appwrite'

const STATUS_STEPS = ['Pending', 'Accepted', 'Delivered']

const STATUS_META = {
  Pending:  { color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', icon: 'hourglass_empty', desc: 'Waiting for donor or volunteer to respond.' },
  Accepted: { color: 'text-blue-400',   border: 'border-blue-500/30',   bg: 'bg-blue-500/10',   icon: 'local_shipping',   desc: 'A volunteer has accepted the delivery.' },
  Delivered:{ color: 'text-green-400',  border: 'border-green-500/30',  bg: 'bg-green-500/10',  icon: 'check_circle',     desc: 'Food has been delivered successfully!' },
  Rejected: { color: 'text-red-400',    border: 'border-red-500/30',    bg: 'bg-red-500/10',    icon: 'cancel',           desc: 'This claim was rejected by the donor.' },
}

const DIET_COLOR = {
  VEG:     'bg-green-500/10 text-green-400',
  VEGAN:   'bg-lime-500/10 text-lime-400',
  'NON-VEG': 'bg-red-500/10 text-red-400',
}

function StatusStepper({ status }) {
  if (status === 'Rejected') {
    return (
      <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
        <span className="material-symbols-outlined text-[16px]">cancel</span>
        Rejected by donor
      </div>
    )
  }
  const current = STATUS_STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((step, i) => {
        const done    = i < current
        const active  = i === current
        const pending = i > current
        return (
          <div key={step} className="flex items-center gap-1">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all
              ${done    ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
              ${active  ? 'bg-primary/10 text-primary border-primary/30' : ''}
              ${pending ? 'bg-[#3a2c27] text-[#7a5a50] border-[#3a2c27]' : ''}`}>
              <span className="material-symbols-outlined text-[11px]">
                {done ? 'check_circle' : active ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
              {step}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-px w-4 ${done ? 'bg-green-500/40' : 'bg-[#3a2c27]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ClaimCard({ request, listing }) {
  const [now] = useState(() => Date.now())
  const meta = STATUS_META[request.status] || STATUS_META.Pending
  const diet = listing?.diet?.toUpperCase()
  const dietCls = DIET_COLOR[diet] || 'bg-[#3a2c27] text-[#bca39a]'

  const timeAgo = request.$createdAt
    ? (() => {
        const diff = (now - new Date(request.$createdAt)) / 60000
        if (diff < 1)    return 'just now'
        if (diff < 60)   return `${Math.round(diff)}m ago`
        if (diff < 1440) return `${Math.round(diff / 60)}h ago`
        return `${Math.round(diff / 1440)}d ago`
      })()
    : ''

  return (
    <div className={`rounded-2xl border ${meta.border} p-5 flex flex-col gap-4 bg-[#23140f] hover:border-primary/30 transition-all`}>
      {/* Top row */}
      <div className="flex items-start gap-4">
        <div className={`size-12 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
          <span className={`material-symbols-outlined text-[24px] ${meta.color}`}>{meta.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-white text-base leading-tight">
              {listing?.title || `Food Listing #${request.listingId?.slice(-6)}`}
            </h3>
            {listing?.diet && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${dietCls}`}>{listing.diet}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-[#bca39a]">
            {listing?.donorName && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">person</span>
                {listing.donorName}
              </span>
            )}
            {listing?.quantity && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">people</span>
                {listing.quantity} servings
              </span>
            )}
            {listing?.category && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">category</span>
                {listing.category}
              </span>
            )}
            <span className="flex items-center gap-1 ml-auto">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              {timeAgo}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="border-t border-[#3a2c27] pt-3">
        <StatusStepper status={request.status} />
        <p className="text-[#bca39a] text-xs mt-2">{meta.desc}</p>
      </div>
    </div>
  )
}

export default function MyClaimsPage() {
  const user = useAuthStore(s => s.user)
  const { requests, isLoading, fetchRequests } = useRequestStore()
  const { listings, fetchListings }             = useListingStore()

  useEffect(() => { fetchRequests(); fetchListings() }, [fetchRequests, fetchListings])

  const handleRefresh = useCallback(() => { fetchRequests(); fetchListings() }, [fetchRequests, fetchListings])
  useRealtime(APPWRITE_CONFIG.requestsCollectionId, handleRefresh)

  // This user's requests
  const myRequests  = requests.filter(r => r.receiverId === user?.$id)
  const listingById = Object.fromEntries(listings.map(l => [l.$id, l]))

  const pending   = myRequests.filter(r => r.status === 'Pending').length
  const active    = myRequests.filter(r => r.status === 'Accepted').length
  const delivered = myRequests.filter(r => r.status === 'Delivered').length
  const rejected  = myRequests.filter(r => r.status === 'Rejected').length

  return (
    <div className="min-h-screen bg-[#181210] flex flex-col">
      <ReceiverTopNav />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">My Claims</h1>
            <p className="text-[#bca39a] mt-1">Food listings you've claimed from the feed</p>
          </div>
          <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#3a2c27] text-[#bca39a] hover:text-white hover:bg-[#3a2c27] text-sm font-medium transition-all">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Pending',   val: pending,   color: 'text-yellow-400', icon: 'hourglass_empty' },
            { label: 'En Route',  val: active,    color: 'text-blue-400',   icon: 'local_shipping' },
            { label: 'Delivered', val: delivered, color: 'text-green-400',  icon: 'check_circle' },
            { label: 'Rejected',  val: rejected,  color: 'text-red-400',    icon: 'cancel' },
          ].map(s => (
            <div key={s.label} className="bg-[#23140f] border border-[#3a2c27] rounded-xl p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${s.color}`}>{s.icon}</span>
                <span className="text-xs text-[#bca39a] font-medium">{s.label}</span>
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Claims list */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-[#23140f] border border-[#3a2c27] rounded-2xl animate-pulse" />)}
          </div>
        )}

        {!isLoading && myRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#23140f] border border-[#3a2c27] rounded-2xl text-center">
            <span className="material-symbols-outlined text-5xl text-[#3a2c27]">volunteer_activism</span>
            <p className="text-white font-bold text-lg">No claims yet</p>
            <p className="text-[#bca39a] text-sm max-w-xs">
              Head to the feed to find food listings and click "Claim Now" to get started.
            </p>
            <a href="/feed" className="mt-2 bg-primary hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-xl text-sm transition-all">
              Browse Feed →
            </a>
          </div>
        )}

        {!isLoading && myRequests
          .sort((a, b) => {
            const order = { Pending: 0, Accepted: 1, Delivered: 2, Rejected: 3 }
            return (order[a.status] ?? 9) - (order[b.status] ?? 9) || new Date(b.$createdAt) - new Date(a.$createdAt)
          })
          .map(req => (
            <ClaimCard key={req.$id} request={req} listing={listingById[req.listingId]} />
          ))
        }
      </main>
    </div>
  )
}
