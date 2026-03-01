import { useEffect, useCallback } from 'react'
import useDeliveryStore from '../store/deliveryStore'
import useAuthStore from '../store/authStore'
import { useRealtime } from '../hooks/useRealtime'
import { APPWRITE_CONFIG } from '../lib/appwrite'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  Assigned:   { icon: 'local_shipping', color: 'text-blue-400',  border: 'border-blue-400',  bg: 'bg-blue-400/10' , label: 'En Route'       },
  PickedUp:   { icon: 'inventory',      color: 'text-yellow-400',border: 'border-yellow-400',bg: 'bg-yellow-400/10',label: 'Picked Up'       },
  Delivered:  { icon: 'check_circle',   color: 'text-green-400', border: 'border-green-400', bg: 'bg-green-400/10' ,label: 'Delivered'       },
  Cancelled:  { icon: 'cancel',         color: 'text-red-400',   border: 'border-red-400',   bg: 'bg-red-400/10'   ,label: 'Cancelled'       },
}

const NEXT_STATUS = {
  Assigned:  'PickedUp',
  PickedUp:  'Delivered',
}

const NEXT_LABEL = {
  Assigned:  'Mark Picked Up',
  PickedUp:  'Mark Delivered',
}

function MissionCard({ delivery }) {
  const { updateDeliveryStatus } = useDeliveryStore()
  const cfg = STATUS_CONFIG[delivery.status] || STATUS_CONFIG.Assigned
  const next = NEXT_STATUS[delivery.status]

  const handleAdvance = async () => {
    if (!next) return
    const id = toast.loading(`Updating to ${next}…`)
    try {
      await updateDeliveryStatus(delivery.$id, next)
      toast.success(`Status updated to ${next}!`, { id })
    } catch {
      toast.error('Update failed.', { id })
    }
  }

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-white text-sm leading-tight">Request #{delivery.requestId?.slice(-6) || delivery.$id.slice(-6)}</p>
          <p className="text-xs text-[#bca39a] mt-0.5">Pickup Code: <span className="font-mono font-bold text-white">{delivery.pickupCode || '——'}</span></p>
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

export default function TrackingTimeline() {
  const { deliveries, isLoading, fetchDeliveries } = useDeliveryStore()
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    if (user) fetchDeliveries(user.$id)
  }, [user])

  // Live Realtime refresh when any delivery changes
  const handleRealtimeEvent = useCallback(() => {
    if (user) fetchDeliveries(user.$id)
  }, [user])

  useRealtime(APPWRITE_CONFIG.deliveriesCollectionId, handleRealtimeEvent)

  const myDeliveries = deliveries.filter(d => d.volunteerId === user?.$id)
  const activeCount = myDeliveries.filter(d => d.status === 'Assigned' || d.status === 'PickedUp').length
  const doneCount   = myDeliveries.filter(d => d.status === 'Delivered').length

  return (
    <div className="w-full md:w-1/3 flex flex-col bg-[#181210] h-1/2 md:h-full overflow-y-auto custom-scrollbar">

      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-black leading-tight tracking-[-0.033em]">Volunteer Hub</h1>
          <p className="text-[#bca39a] text-sm font-medium">Your active food rescue missions.</p>
        </div>

        {/* Stats bar */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center p-3 bg-[#281e1b] border border-[#3a2c27] rounded-xl">
            <span className="text-xl font-black text-primary">{activeCount}</span>
            <span className="text-[10px] text-[#bca39a] font-medium mt-0.5">Active</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-[#281e1b] border border-[#3a2c27] rounded-xl">
            <span className="text-xl font-black text-green-400">{doneCount}</span>
            <span className="text-[10px] text-[#bca39a] font-medium mt-0.5">Completed</span>
          </div>
        </div>
      </div>

      {/* Missions list */}
      <div className="flex-1 p-6 pt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white text-sm font-bold flex items-center gap-2">
            My Missions
            <span className="size-2 bg-green-500 rounded-full animate-pulse" />
          </h3>
          <button onClick={() => user && fetchDeliveries(user.$id)} className="text-[#bca39a] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2].map(i => <div key={i} className="h-24 bg-[#281e1b] border border-[#3a2c27] rounded-2xl animate-pulse" />)}
          </div>
        )}

        {!isLoading && myDeliveries.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-10 text-center gap-3">
            <span className="material-symbols-outlined text-5xl text-[#3a2c27]">local_shipping</span>
            <p className="text-[#bca39a] text-sm">No missions yet.</p>
            <p className="text-[#bca39a] text-xs max-w-[200px]">Accept a delivery from the Requests panel to get started.</p>
          </div>
        )}

        {!isLoading && myDeliveries.map(d => <MissionCard key={d.$id} delivery={d} />)}
      </div>
    </div>
  )
}
