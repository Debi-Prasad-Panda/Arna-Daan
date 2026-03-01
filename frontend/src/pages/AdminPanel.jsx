import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import AdminStatsGrid from '../components/AdminStatsGrid'
import KycTable from '../components/KycTable'
import useRequestStore from '../store/requestStore'
import useListingStore from '../store/listingStore'
import { useRealtime } from '../hooks/useRealtime'
import { APPWRITE_CONFIG } from '../lib/appwrite'
import toast from 'react-hot-toast'

function NotificationBell() {
  const { requests, fetchRequests } = useRequestStore()
  const { listings, fetchListings }  = useListingStore()
  const [open, setOpen] = useState(false)
  const [seenIds, setSeenIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('admin_seen_notifs') || '[]')) }
    catch { return new Set() }
  })

  useEffect(() => { fetchRequests(); fetchListings() }, [])
  const refresh = useCallback(() => { fetchRequests(); fetchListings() }, [])
  useRealtime(APPWRITE_CONFIG.requestsCollectionId, refresh)
  useRealtime(APPWRITE_CONFIG.listingsCollectionId, refresh)

  const pendingRequests = requests.filter(r => r.status === 'Pending')
  const newListings     = listings.filter(l => l.status === 'Active')

  const notifications = [
    ...pendingRequests.slice(0, 5).map(r => ({
      id: r.$id, icon: 'groups', color: 'text-yellow-400',
      text: `${r.receiverName || 'An NGO'} claimed a listing`,
      time: r.$createdAt, isNew: !seenIds.has(r.$id),
    })),
    ...newListings.slice(0, 3).map(l => ({
      id: l.$id, icon: 'inventory_2', color: 'text-primary',
      text: `New listing: ${l.title || 'Food listing'}`,
      time: l.$createdAt, isNew: !seenIds.has(l.$id),
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8)

  const unread = notifications.filter(n => n.isNew).length

  const markAllRead = () => {
    const newSeen = new Set([...seenIds, ...notifications.map(n => n.id)])
    setSeenIds(newSeen)
    localStorage.setItem('admin_seen_notifs', JSON.stringify([...newSeen]))
    toast('All notifications marked as read', { icon: '✓' })
  }

  const timeAgo = (t) => {
    if (!t) return ''
    const diff = (Date.now() - new Date(t)) / 60000
    if (diff < 1)    return 'just now'
    if (diff < 60)   return `${Math.round(diff)}m ago`
    if (diff < 1440) return `${Math.round(diff / 60)}h ago`
    return `${Math.round(diff / 1440)}d ago`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 text-[#d6c1ba] hover:text-primary transition-colors relative"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-primary rounded-full text-[9px] font-black text-white flex items-center justify-center px-0.5 animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#2f1d17] border border-[#4a352f] shadow-2xl rounded-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#4a352f]">
              <h4 className="text-white font-bold text-sm">Notifications</h4>
              <button onClick={markAllRead} className="text-[10px] text-[#bca39a] hover:text-primary transition-colors font-medium">
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <div className="flex flex-col items-center py-8 gap-2 text-[#bca39a]">
                  <span className="material-symbols-outlined text-3xl">notifications_none</span>
                  <p className="text-xs">No notifications yet</p>
                </div>
              )}
              {notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-[#4a352f]/50 hover:bg-[#4a352f]/30 transition-colors ${n.isNew ? 'bg-primary/5' : ''}`}>
                  <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${n.color}`}>{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium leading-snug">{n.text}</p>
                    <p className="text-[#bca39a] text-[10px] mt-0.5">{timeAgo(n.time)}</p>
                  </div>
                  {n.isNew && <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminPanel() {
  return (
    <div className="bg-[#181210] text-slate-100 font-display min-h-screen flex flex-col md:flex-row overflow-hidden">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#181210] relative">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#4a352f]/50 bg-[#181210]/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">KYC Verification Dashboard</h2>
            <p className="text-[#d6c1ba] text-sm mt-1">Review and approve NGO documentation to enable food distribution.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-8 w-[1px] bg-[#4a352f]" />
            <div className="text-right hidden sm:block">
              <p className="text-xs text-[#d6c1ba]">Last login</p>
              <p className="text-sm font-medium text-white">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </header>
        
        <div className="p-8 flex flex-col gap-8 max-w-[1600px] w-full mx-auto">
          <AdminStatsGrid />
          <KycTable />
        </div>
      </main>
    </div>
  )
}
