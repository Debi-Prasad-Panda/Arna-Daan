import { useEffect, useState } from 'react'
import useListingStore from '../store/listingStore'
import { toast } from 'react-hot-toast'
import EditListingModal from './EditListingModal'

// Safe fallback for date formatting without adding dependencies right away
const getExpiryText = (dateString, status) => {
  if (status === 'Closed' || status === 'Picked Up') return `Completed`
  if (!dateString) return 'No expiry set'
  const date = new Date(dateString)
  if (isNaN(date)) return dateString
  
  const now = new Date()
  const diffMs = date - now
  if (diffMs < 0) return 'Expired'
  
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHrs < 24) return `Expires in ${diffHrs}h`
  const diffDays = Math.floor(diffHrs / 24)
  return `Expires in ${diffDays}d`
}

const getDietStyle = (diet) => {
  switch (diet?.toUpperCase()) {
    case 'VEG': return 'bg-green-900/80 text-green-400 border-green-700'
    case 'VEGAN': return 'bg-yellow-900/80 text-yellow-400 border-yellow-700'
    case 'NON-VEG': return 'bg-red-900/80 text-red-400 border-red-700'
    default: return 'bg-[#3a2c27] text-[#bca39a] border-[#5a433a]'
  }
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-600/20 text-green-400 border-green-600/30'
    case 'Picked Up': return 'bg-blue-600/20 text-blue-400 border-blue-600/30'
    case 'Closed': return 'bg-[#3a2c27] text-[#bca39a] border-transparent'
    default: return 'bg-[#3a2c27] text-[#bca39a] border-transparent'
  }
}

const DEFAULT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUNyGSEU1fovxDPHC5CW9NhKOYvP4Qc8wkDwNYtJiEHhCYU1uZAVGRQbZ9ReoqT2iaTASE3ByNloa9kM6ASlSh4yv1ffZxCNrDi3aoYTaXKUeTtHc9EjnjBC6Ue_NNZ29EjnU8h97PuclaWAlglX_Vs0vYfNU6B1DSBL9RRFKGWXI9BzfBwSeL65rprr7kyaqr-lBT-8_y3D3L2uHQWKm_CXT4WagxYhJtSDYRuGZIQlHwclRgIslQO7X1U2N71ON6oRlsJ_X3sQ'

function ListingCard({ listing, onEdit }) {
  const isClosed = listing.status === 'Closed'
  const dietColor = getDietStyle(listing.diet)
  const statusColor = getStatusStyle(listing.status)
  const expiryText = getExpiryText(listing.bestBefore, listing.status)
  
  // Basic heuristic: if it expires in < 24h, mark urgent
  const isUrgent = listing.status === 'Active' && expiryText.includes('Expires in') && !expiryText.includes('d')

  const deleteListing = useListingStore(state => state.deleteListing)
  const isDeleting = useListingStore(state => state.isLoading)
  const [showOptions, setShowOptions] = useState(false)

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
        try {
            await deleteListing(listing.$id)
            toast.success("Listing deleted")
        } catch (err) {
            toast.error(err.message || 'Failed to delete')
        }
    }
    setShowOptions(false)
  }

  return (
    <div className={`bg-[#23140f] border border-[#3a2c27] rounded-xl p-4 flex gap-4 hover:border-primary/50 transition-colors group relative ${isClosed ? 'opacity-60 hover:opacity-100' : ''}`}>
      <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-lg overflow-hidden relative border border-[#3a2c27]">
        <img
          src={listing.imageUrl || DEFAULT_IMG}
          alt={listing.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isClosed ? 'grayscale' : ''}`}
        />
        <div className={`absolute top-2 left-2 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full border ${dietColor}`}>
          {listing.diet || 'N/A'}
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base leading-tight line-clamp-1 text-white">{listing.title}</h3>
            
            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)} className="material-symbols-outlined text-[#bca39a] hover:text-white text-lg flex-shrink-0 ml-2">more_vert</button>
              {showOptions && (
                <div className="absolute right-0 top-6 mt-1 w-32 bg-[#181210] border border-[#3a2c27] rounded-lg shadow-xl overflow-hidden z-20">
                  <button onClick={() => { setShowOptions(false); onEdit(listing); }} className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-[#2a1d18] transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                  </button>
                  <button onClick={handleDelete} disabled={isDeleting} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2 border-t border-[#3a2c27]">
                    <span className="material-symbols-outlined text-[18px]">{isDeleting ? "refresh" : "delete"}</span> Delete
                  </button>
                </div>
              )}
            </div>
            {/* Click outside to close map options overlay (simplified hack for overlay) */}
            {showOptions && <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />}
          </div>
          <p className="text-[#bca39a] text-sm mt-1">{listing.quantity ? `Approx. ${listing.quantity} servings` : listing.category}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="material-symbols-outlined text-sm text-[#bca39a]">schedule</span>
            <span className={isUrgent ? 'text-orange-400 font-medium' : 'text-[#bca39a]'}>{expiryText}</span>
          </div>
        </div>
        
        <div className="mt-3 flex gap-2">
          <button 
            onClick={() => {
              if (isClosed) {
                toast('Listing is marked completed.', { icon: '📋' });
              } else {
                onEdit(listing);
              }
            }}
            className="flex-1 bg-[#3a2c27] hover:bg-white hover:text-black text-white text-xs font-bold py-2 rounded-lg transition-colors"
          >
            {isClosed ? 'Details' : 'Edit'}
          </button>
          <button 
            onClick={() => {
              toast(`Current status: ${listing.status || 'Active'}`);
            }}
            className={`flex-1 text-xs font-bold py-2 rounded-lg border ${statusColor}`}
          >
            {listing.status || 'Active'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ActiveListings() {
  const listings = useListingStore(state => state.listings)
  const fetchListings = useListingStore(state => state.fetchListings)
  const isLoading = useListingStore(state => state.isLoading)
  const error = useListingStore(state => state.error)

  const [editingListing, setEditingListing] = useState(null)

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  // Fake Monthly goal calculation for demo purposes
  const totalMeals = listings.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const goal = 1500
  const progressPercent = Math.min(Math.round((totalMeals / goal) * 100), 100)

  return (
    <div className="xl:col-span-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Active Listings</h2>
          {isLoading && <span className="material-symbols-outlined animate-spin text-primary text-sm">refresh</span>}
        </div>
        <a className="text-sm text-primary font-medium hover:underline" href="#">View All</a>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {listings.length === 0 && !isLoading && !error ? (
          <div className="text-center py-10 bg-[#23140f] border border-[#3a2c27] rounded-xl">
            <span className="material-symbols-outlined text-[#5a433a] text-5xl mb-3">inventory_2</span>
            <p className="text-[#bca39a] font-medium">No food listings yet.</p>
            <p className="text-sm text-[#5a433a] mt-1">Create your first donation to see it here.</p>
          </div>
        ) : (
          listings.map((l) => <ListingCard key={l.$id} listing={l} onEdit={setEditingListing} />)
        )}
      </div>
      
      {/* Monthly Goal Card */}
      <div className="mt-2 bg-gradient-to-br from-[#2a1d18] to-[#23140f] border border-[#3a2c27] rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-xl text-white">Monthly Goal</h3>
          <p className="text-[#bca39a] text-sm mt-1 mb-4">You are close to reaching your donation goal for this month!</p>
          <div className="w-full bg-black/40 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-primary h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex justify-between text-xs font-bold text-[#bca39a]">
            <span>{totalMeals} Meals Donated</span>
            <span className="text-white">Goal: {goal}</span>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      </div>

      <EditListingModal listing={editingListing} onClose={() => setEditingListing(null)} />
    </div>
  )
}
