import { useEffect, useCallback, useState } from 'react'
import useRequestStore from '../store/requestStore'
import useListingStore from '../store/listingStore'
import useAuthStore from '../store/authStore'
import { useRealtime } from '../hooks/useRealtime'
import { APPWRITE_CONFIG } from '../lib/appwrite'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  Pending:   { bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: 'hourglass_empty', label: 'Pending' },
  Accepted:  { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',       icon: 'local_shipping',   label: 'En Route' },
  Delivered: { bg: 'bg-green-500/10 text-green-400 border-green-500/20',    icon: 'check_circle',      label: 'Delivered' },
  Rejected:  { bg: 'bg-red-500/10 text-red-400 border-red-500/20',          icon: 'cancel',            label: 'Rejected'  },
}

function RequestRow({ request, listing }) {
  const { updateRequestStatus } = useRequestStore()
  const [busy, setBusy] = useState(false)
  const cfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.Pending

  const timeAgo = request.$createdAt
    ? (() => {
        const diff = (Date.now() - new Date(request.$createdAt)) / 60000
        if (diff < 1)  return 'just now'
        if (diff < 60) return `${Math.round(diff)}m ago`
        if (diff < 1440) return `${Math.round(diff / 60)}h ago`
        return `${Math.round(diff / 1440)}d ago`
      })()
    : ''

  const handleAction = async (action) => {
    setBusy(true)
    const newStatus = action === 'approve' ? 'Accepted' : 'Rejected'
    const tid = toast.loading(action === 'approve' ? 'Approving…' : 'Rejecting…')
    try {
      await updateRequestStatus(request.$id, newStatus)
      toast.success(action === 'approve' ? 'Request approved! Volunteer will be notified.' : 'Request rejected.', { id: tid })
    } catch (e) {
      toast.error(`Failed: ${e.message}`, { id: tid })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-[#23140f] border border-[#3a2c27] hover:border-primary/30 rounded-xl transition-all">
      {/* Icon */}
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-white text-sm">{request.receiverName || 'Unknown NGO'}</p>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg}`}>
            <span className="material-symbols-outlined text-[11px]">{cfg.icon}</span>
            {cfg.label}
          </span>
          <span className="text-[10px] text-[#bca39a]">{timeAgo}</span>
        </div>
        <p className="text-xs text-[#bca39a] mt-0.5 truncate">
          Claiming: <span className="text-white font-medium">{listing?.title || `Listing #${request.listingId?.slice(-6)}`}</span>
          {listing?.quantity && <span className="ml-1">· {listing.quantity} servings</span>}
        </p>
      </div>

      {/* Actions — only show for Pending */}
      {request.status === 'Pending' && (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleAction('approve')}
            disabled={busy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[14px]">thumb_up</span>
            Approve
          </button>
          <button
            onClick={() => handleAction('reject')}
            disabled={busy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[14px]">thumb_down</span>
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default function IncomingRequests() {
  const { requests, isLoading, fetchRequests } = useRequestStore()
  const { listings }                            = useListingStore()
  const user = useAuthStore(s => s.user)

  useEffect(() => { fetchRequests() }, [])

  const handleRefresh = useCallback(() => fetchRequests(), [])
  useRealtime(APPWRITE_CONFIG.requestsCollectionId, handleRefresh)

  // Build a map of listingId → listing for quick lookup
  const listingById = Object.fromEntries(listings.map(l => [l.$id, l]))

  // Filter to only requests for THIS donor's listings
  const myListingIds = new Set(listings.filter(l => l.donorId === user?.$id).map(l => l.$id))
  const myRequests   = requests.filter(r => myListingIds.has(r.listingId))

  const pending   = myRequests.filter(r => r.status === 'Pending').length
  const accepted  = myRequests.filter(r => r.status === 'Accepted').length
  const delivered = myRequests.filter(r => r.status === 'Delivered').length

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Incoming Requests
            {pending > 0 && (
              <span className="size-2 rounded-full bg-yellow-400 animate-pulse" />
            )}
          </h2>
          <p className="text-[#bca39a] text-sm mt-0.5">NGOs claiming your food listings</p>
        </div>
        <button onClick={handleRefresh} className="text-[#bca39a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#3a2c27]">
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs font-bold text-yellow-400">
          <span className="material-symbols-outlined text-[14px]">hourglass_empty</span>
          {pending} Pending
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-400">
          <span className="material-symbols-outlined text-[14px]">local_shipping</span>
          {accepted} Accepted
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-bold text-green-400">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          {delivered} Delivered
        </div>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-[#bca39a]">
          <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex flex-col gap-2">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-[#23140f] border border-[#3a2c27] rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && myRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 bg-[#23140f] border border-[#3a2c27] rounded-xl text-center">
            <span className="material-symbols-outlined text-4xl text-[#3a2c27]">inbox</span>
            <p className="text-[#bca39a] text-sm font-medium">No incoming requests yet</p>
            <p className="text-[#bca39a] text-xs max-w-xs">
              When NGOs claim your listings via the feed, their requests will appear here for you to approve.
            </p>
          </div>
        )}

        {!isLoading && myRequests
          .sort((a, b) => {
            // Pending first, then by date desc
            if (a.status === 'Pending' && b.status !== 'Pending') return -1
            if (b.status === 'Pending' && a.status !== 'Pending') return 1
            return new Date(b.$createdAt) - new Date(a.$createdAt)
          })
          .map(req => (
            <RequestRow
              key={req.$id}
              request={req}
              listing={listingById[req.listingId]}
            />
          ))
        }
      </div>
    </section>
  )
}
