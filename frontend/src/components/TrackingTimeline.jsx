import { useEffect, useState, useCallback } from 'react'
import useDeliveryStore from '../store/deliveryStore'
import useRequestStore from '../store/requestStore'
import useListingStore from '../store/listingStore'
import useAuthStore from '../store/authStore'
import { useRealtime } from '../hooks/useRealtime'
import { APPWRITE_CONFIG } from '../lib/appwrite'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────────────────
// My Missions tab — already-accepted deliveries
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Assigned:  { icon: 'local_shipping', color: 'text-blue-400',   border: 'border-blue-400/40',   bg: 'bg-blue-400/8',   label: 'En Route'  },
  PickedUp:  { icon: 'inventory',      color: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400/8', label: 'Picked Up' },
  Delivered: { icon: 'check_circle',   color: 'text-green-400',  border: 'border-green-400/40',  bg: 'bg-green-400/8',  label: 'Delivered' },
  Cancelled: { icon: 'cancel',         color: 'text-red-400',    border: 'border-red-400/40',    bg: 'bg-red-400/8',    label: 'Cancelled' },
}
const NEXT_STATUS = { Assigned: 'PickedUp', PickedUp: 'Delivered' }
const NEXT_LABEL  = { Assigned: 'Mark Picked Up', PickedUp: 'Mark Delivered' }

function MissionCard({ delivery }) {
  const { updateDeliveryStatus } = useDeliveryStore()
  const cfg  = STATUS_CONFIG[delivery.status] || STATUS_CONFIG.Assigned
  const next = NEXT_STATUS[delivery.status]

  const handleAdvance = async () => {
    const tid = toast.loading(`Updating to ${next}…`)
    try {
      await updateDeliveryStatus(delivery.$id, next)
      toast.success(`Marked as ${next}!`, { id: tid })
    } catch {
      toast.error('Update failed.', { id: tid })
    }
  }

  return (
    <div className={`rounded-2xl border ${cfg.border} p-4 flex flex-col gap-3 bg-[#23140f]`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-white text-sm">Request #{delivery.requestId?.slice(-6) || delivery.$id.slice(-6)}</p>
          <p className="text-xs text-[#bca39a] mt-0.5">
            PIN: <span className="font-mono font-bold text-white">{delivery.pickupCode || '——'}</span>
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.color} shrink-0`}>
          {cfg.label}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#bca39a]">
        <span className={`material-symbols-outlined text-[16px] ${cfg.color}`}>{cfg.icon}</span>
        <span>{new Date(delivery.$createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
      </div>
      {next && (
        <button
          onClick={handleAdvance}
          className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 font-bold text-xs py-2 rounded-xl transition-all"
        >
          {NEXT_LABEL[delivery.status]}
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Available Requests tab — all pending requests visible to any volunteer
// ─────────────────────────────────────────────────────────────────────────────
const DIET_COLOR = {
  VEG:     'bg-green-500/15 text-green-400 border-green-500/30',
  VEGAN:   'bg-lime-500/15 text-lime-400 border-lime-500/30',
  'NON-VEG': 'bg-red-500/15 text-red-400 border-red-500/30',
}

function RequestCard({ request, listing, onAccept, accepting }) {
  const dietCls = DIET_COLOR[listing?.diet?.toUpperCase()] || 'bg-[#3a2c27] text-[#bca39a] border-[#5a433a]'
  const timeAgo = request.$createdAt
    ? (() => {
        const diff = (Date.now() - new Date(request.$createdAt)) / 60000
        if (diff < 1)  return 'just now'
        if (diff < 60) return `${Math.round(diff)}m ago`
        return `${Math.round(diff / 60)}h ago`
      })()
    : ''

  return (
    <div className="bg-[#23140f] border border-[#3a2c27] hover:border-primary/40 rounded-2xl p-4 flex flex-col gap-3 transition-all">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[20px]">restaurant</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white text-sm leading-tight truncate">
            {listing?.title || `Food Request #${request.$id.slice(-6)}`}
          </p>
          <p className="text-xs text-[#bca39a] mt-0.5">
            by <span className="text-white font-medium">{request.receiverName || 'NGO'}</span>
          </p>
        </div>
        <span className="text-[10px] text-[#bca39a] shrink-0">{timeAgo}</span>
      </div>

      {/* Listing details */}
      {listing && (
        <div className="flex flex-wrap gap-2">
          {listing.quantity && (
            <span className="flex items-center gap-1 text-[10px] bg-[#3a2c27] text-[#bca39a] px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[12px]">people</span>
              {listing.quantity} servings
            </span>
          )}
          {listing.category && (
            <span className="flex items-center gap-1 text-[10px] bg-[#3a2c27] text-[#bca39a] px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[12px]">category</span>
              {listing.category}
            </span>
          )}
          {listing.diet && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${dietCls}`}>
              {listing.diet}
            </span>
          )}
          {listing.location && (
            <span className="flex items-center gap-1 text-[10px] bg-[#3a2c27] text-[#bca39a] px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[12px]">location_on</span>
              {listing.location}
            </span>
          )}
        </div>
      )}

      {/* Best before warning */}
      {listing?.bestBefore && (() => {
        const diff = (new Date(listing.bestBefore) - Date.now()) / 3600000
        if (diff < 0)   return <p className="text-[10px] text-red-400 font-semibold">⚠ Listing has expired</p>
        if (diff < 6)   return <p className="text-[10px] text-yellow-400 font-semibold">⏰ Expires in {Math.round(diff)}h — act fast!</p>
        return null
      })()}

      {/* Accept button */}
      <button
        onClick={() => onAccept(request.$id, request.listingId)}
        disabled={accepting}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-700 disabled:opacity-50 disabled:cursor-wait text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20"
      >
        {accepting ? (
          <><span className="material-symbols-outlined text-[16px] animate-spin">refresh</span> Accepting…</>
        ) : (
          <><span className="material-symbols-outlined text-[16px]">check_circle</span> Accept Mission</>
        )}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component — 2 tabs
// ─────────────────────────────────────────────────────────────────────────────
export default function TrackingTimeline() {
  const [tab, setTab] = useState('available')  // 'available' | 'missions'

  const { deliveries, isLoading: dlLoading, fetchDeliveries } = useDeliveryStore()
  const { requests, isLoading: reqLoading, fetchRequests }    = useRequestStore()
  const { listings, fetchListings }                            = useListingStore()
  const user = useAuthStore(s => s.user)

  const [acceptingId, setAcceptingId] = useState(null) // requestId being accepted

  // Initial data fetch
  useEffect(() => {
    if (user) fetchDeliveries(user.$id)
    fetchRequests()   // all pending requests (no filter → fetch all)
    fetchListings()
  }, [user])

  // Realtime refresh
  const onDeliveryEvent = useCallback(() => { if (user) fetchDeliveries(user.$id) }, [user])
  const onRequestEvent  = useCallback(() => { fetchRequests(); fetchListings() }, [])
  useRealtime(APPWRITE_CONFIG.deliveriesCollectionId, onDeliveryEvent)
  useRealtime(APPWRITE_CONFIG.requestsCollectionId,   onRequestEvent)

  // My accepted deliveries
  const myDeliveries   = deliveries.filter(d => d.volunteerId === user?.$id)
  const activeCount    = myDeliveries.filter(d => d.status === 'Assigned' || d.status === 'PickedUp').length
  const doneCount      = myDeliveries.filter(d => d.status === 'Delivered').length

  // Available = pending requests that don't already have a delivery accepted
  const acceptedRequestIds = new Set(deliveries.map(d => d.requestId))
  const pendingRequests = requests.filter(r =>
    r.status === 'Pending' && !acceptedRequestIds.has(r.$id)
  )

  // Build listing lookup map
  const listingById = Object.fromEntries(listings.map(l => [l.$id, l]))

  // Accept handler
  const handleAccept = async (requestId, listingId) => {
    setAcceptingId(requestId)
    const tid = toast.loading('Accepting mission…')
    try {
      await useDeliveryStore.getState().acceptMission(requestId)
      // Optionally update request status to Accepted
      await useRequestStore.getState().updateRequestStatus(requestId, 'Accepted')
      // Mark listing as Picked Up
      if (listingId) {
        await useListingStore.getState().updateListingStatus(listingId, 'Picked Up')
      }
      toast.success('Mission accepted! Check "My Missions".', { id: tid })
      setTab('missions')  // switch to missions tab
      // Refresh
      if (user) fetchDeliveries(user.$id)
      fetchRequests()
    } catch (e) {
      toast.error(`Failed: ${e.message}`, { id: tid })
    } finally {
      setAcceptingId(null)
    }
  }

  return (
    <div className="w-full md:w-1/3 flex flex-col bg-[#181210] h-1/2 md:h-full overflow-hidden">

      {/* Header */}
      <div className="p-5 pb-0">
        <h1 className="text-white text-xl font-black tracking-tight">Volunteer Hub</h1>
        <p className="text-[#bca39a] text-xs font-medium mt-0.5">Browse requests · manage your missions</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col items-center p-2.5 bg-[#23140f] border border-[#3a2c27] rounded-xl">
            <span className="text-lg font-black text-orange-400">{pendingRequests.length}</span>
            <span className="text-[9px] text-[#bca39a] font-medium mt-0.5 text-center">Available</span>
          </div>
          <div className="flex flex-col items-center p-2.5 bg-[#23140f] border border-[#3a2c27] rounded-xl">
            <span className="text-lg font-black text-blue-400">{activeCount}</span>
            <span className="text-[9px] text-[#bca39a] font-medium mt-0.5 text-center">Active</span>
          </div>
          <div className="flex flex-col items-center p-2.5 bg-[#23140f] border border-[#3a2c27] rounded-xl">
            <span className="text-lg font-black text-green-400">{doneCount}</span>
            <span className="text-[9px] text-[#bca39a] font-medium mt-0.5 text-center">Done</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[#23140f] border border-[#3a2c27] rounded-xl p-1 mt-4">
          <button
            onClick={() => setTab('available')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'available' ? 'bg-primary text-white shadow' : 'text-[#bca39a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">inbox</span>
            Available
            {pendingRequests.length > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${tab === 'available' ? 'bg-white/20' : 'bg-primary/20 text-primary'}`}>
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('missions')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'missions' ? 'bg-primary text-white shadow' : 'text-[#bca39a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            My Missions
            {activeCount > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${tab === 'missions' ? 'bg-white/20' : 'bg-blue-400/20 text-blue-400'}`}>
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panel body — scrollable */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 mt-2">

        {/* ── Available Requests tab ── */}
        {tab === 'available' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[#bca39a] text-xs font-medium">Pending NGO requests</span>
              <button onClick={() => { fetchRequests(); fetchListings() }} className="text-[#bca39a] hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[16px]">refresh</span>
              </button>
            </div>

            {reqLoading && (
              <div className="flex flex-col gap-3">
                {[1, 2].map(i => <div key={i} className="h-32 bg-[#23140f] border border-[#3a2c27] rounded-2xl animate-pulse" />)}
              </div>
            )}

            {!reqLoading && pendingRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-center gap-3">
                <span className="material-symbols-outlined text-5xl text-[#3a2c27]">inbox</span>
                <p className="text-[#bca39a] text-sm font-medium">No open requests yet</p>
                <p className="text-[#bca39a] text-xs max-w-[200px] leading-relaxed">
                  When NGOs claim food listings, their requests will appear here for you to accept.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#bca39a]/60 mt-1">
                  <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live via Realtime
                </div>
              </div>
            )}

            {!reqLoading && pendingRequests.map(req => (
              <RequestCard
                key={req.$id}
                request={req}
                listing={listingById[req.listingId]}
                onAccept={handleAccept}
                accepting={acceptingId === req.$id}
              />
            ))}
          </>
        )}

        {/* ── My Missions tab ── */}
        {tab === 'missions' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[#bca39a] text-xs font-medium flex items-center gap-1.5">
                My accepted deliveries
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              </span>
              <button onClick={() => user && fetchDeliveries(user.$id)} className="text-[#bca39a] hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[16px]">refresh</span>
              </button>
            </div>

            {dlLoading && (
              <div className="flex flex-col gap-3">
                {[1, 2].map(i => <div key={i} className="h-24 bg-[#23140f] border border-[#3a2c27] rounded-2xl animate-pulse" />)}
              </div>
            )}

            {!dlLoading && myDeliveries.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-center gap-3">
                <span className="material-symbols-outlined text-5xl text-[#3a2c27]">local_shipping</span>
                <p className="text-[#bca39a] text-sm font-medium">No missions yet</p>
                <p className="text-[#bca39a] text-xs max-w-[200px] leading-relaxed">
                  Accept a request from the Available tab to get started.
                </p>
                <button
                  onClick={() => setTab('available')}
                  className="mt-1 text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  Browse available requests
                </button>
              </div>
            )}

            {!dlLoading && myDeliveries.map(d => <MissionCard key={d.$id} delivery={d} />)}
          </>
        )}
      </div>
    </div>
  )
}
