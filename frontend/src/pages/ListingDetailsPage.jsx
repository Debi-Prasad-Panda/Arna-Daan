import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useListingStore from '../store/listingStore'
import useAuthStore from '../store/authStore'
import useRequestStore from '../store/requestStore'
import { toast } from 'react-hot-toast'

const DEFAULT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUNyGSEU1fovxDPHC5CW9NhKOYvP4Qc8wkDwNYtJiEHhCYU1uZAVGRQbZ9ReoqT2iaTASE3ByNloa9kM6ASlSh4yv1ffZxCNrDi3aoYTaXKUeTtHc9EjnjBC6Ue_NNZ29EjnU8h97PuclaWAlglX_Vs0vYfNU6B1DSBL9RRFKGWXI9BzfBwSeL65rprr7kyaqr-lBT-8_y3D3L2uHQWKm_CXT4WagxYhJtSDYRuGZIQlHwclRgIslQO7X1U2N71ON6oRlsJ_X3sQ'

export default function ListingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const user = useAuthStore(state => state.user)
  const listings = useListingStore(state => state.listings)
  const fetchListings = useListingStore(state => state.fetchListings)
  const isLoadingListings = useListingStore(state => state.isLoading)

  const createRequest = useRequestStore(state => state.createRequest)
  const isRequesting = useRequestStore(state => state.isLoading)

  const [localListing, setLocalListing] = useState(null)

  useEffect(() => {
    // If listings are empty, we might have arrived here directly. Fetch them.
    if (listings.length === 0) {
      fetchListings()
    }
  }, [listings.length, fetchListings])

  useEffect(() => {
    // Find the listing from store
    const found = listings.find(l => l.$id === id)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setLocalListing(found)
  }, [id, listings])

  const handleRequestFood = async () => {
    if (!user) {
      toast.error('Please login to request food')
      navigate('/login')
      return
    }
    try {
      await createRequest({
        listingId: localListing.$id,
        receiverId: user.$id,
        receiverName: user.name,
      })
      toast.success('Food requested successfully!')
      navigate('/community')
    } catch (err) {
      toast.error(err.message || 'Failed to request food')
    }
  }

  if (isLoadingListings && !localListing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#181210] min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </div>
    )
  }

  if (!localListing) {
    return (
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center bg-[#181210] min-h-screen text-center">
        <span className="material-symbols-outlined text-6xl text-[#bca39a] mb-4">search_off</span>
        <h1 className="text-2xl font-bold text-white mb-2">Listing Not Found</h1>
        <p className="text-[#bca39a] mb-6">The food listing you are looking for might have been removed or picked up.</p>
        <button onClick={() => navigate('/community')} className="px-6 py-2 bg-[#23140f] border border-[#3a2c27] text-white rounded-lg hover:border-primary transition-colors">
          Back to Feed
        </button>
      </div>
    )
  }

  // Formatting helpers
  const expiryDate = localListing.bestBefore ? new Date(localListing.bestBefore) : null
  const isExpired = expiryDate && expiryDate < new Date()
  
  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-h-screen overflow-y-auto bg-[#181210]">
      <div className="max-w-4xl mx-auto xl:px-8">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#181210]/90 backdrop-blur-md z-10 py-2 border-b border-[#3a2c27]">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-[#bca39a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#23140f]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 text-[#bca39a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#23140f]">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="flex items-center gap-2 text-[#bca39a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#23140f]">
              <span className="material-symbols-outlined">flag</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          {/* Left Column: Image & Sticky Action */}
          <div className="space-y-6">
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-[#3a2c27] bg-[#23140f] relative group shadow-2xl">
              <img 
                src={localListing.imageUrl || DEFAULT_IMG} 
                alt={localListing.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 shadow-lg">
                {localListing.category}
              </div>
            </div>

            {/* Desktop Action Box (Sticky) */}
            <div className="hidden md:block sticky top-24 bg-[#23140f] border border-[#3a2c27] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-lg border-b border-[#3a2c27] pb-3 mb-3">Ready to collect?</h3>
              {localListing.status !== 'Active' || isExpired ? (
                <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-lg">error</span>
                  <div>
                    <p className="font-bold text-sm">Not Available</p>
                    <p className="text-xs opacity-80 mt-1">This listing is {isExpired ? 'expired' : localListing.status.toLowerCase()}.</p>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleRequestFood}
                  disabled={isRequesting || user?.$id === localListing.donorId}
                  className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                    user?.$id === localListing.donorId
                      ? 'bg-[#3a2c27] cursor-not-allowed opacity-50' 
                      : 'bg-primary hover:bg-orange-600 shadow-primary/20 hover:scale-[1.02]'
                  }`}
                >
                  {isRequesting ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined">volunteer_activism</span>
                  )}
                  {user?.$id === localListing.donorId ? "This is your listing" : "Request This Food"}
                </button>
              )}
              {user?.$id !== localListing.donorId && localListing.status === 'Active' && !isExpired && (
                 <p className="text-xs text-center text-[#bca39a]">The donor will be notified instantly.</p>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-8 pb-32 md:pb-0">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  localListing.diet === 'VEG' ? 'bg-green-900/30 text-green-400 border-green-700/50' :
                  localListing.diet === 'VEGAN' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50' :
                  localListing.diet === 'NON-VEG' ? 'bg-red-900/30 text-red-400 border-red-700/50' :
                  'bg-[#3a2c27] text-[#bca39a] border-[#3a2c27]'
                }`}>
                  {localListing.diet || 'Unknown Diet'}
                </span>
                
                {isExpired && (
                   <span className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-700/50 font-bold text-xs rounded-full flex items-center gap-1">
                     <span className="material-symbols-outlined text-[14px]">warning</span> Expired
                   </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                {localListing.title}
              </h1>
              <p className="text-lg text-[#bca39a] flex items-center gap-2">
                 <span className="material-symbols-outlined text-[20px] text-primary">restaurant_menu</span>
                 Approx. {localListing.quantity} Servings Available
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#23140f] border border-[#3a2c27] rounded-xl p-4">
                <p className="text-xs text-[#bca39a] mb-1 font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">schedule</span> Best Before</p>
                <p className={`font-bold ${isExpired ? 'text-red-400' : 'text-white'}`}>
                  {expiryDate ? expiryDate.toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                  }) : 'No expiry set'}
                </p>
              </div>
              <div className="bg-[#23140f] border border-[#3a2c27] rounded-xl p-4">
                <p className="text-xs text-[#bca39a] mb-1 font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">category</span> Category</p>
                <p className="font-bold text-white">{localListing.category}</p>
              </div>
            </div>

            {/* Donor Info Box */}
            <div className="bg-gradient-to-br from-[#2a1d18] to-[#23140f] border border-[#3a2c27] rounded-xl p-5 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
               <h3 className="text-sm font-bold text-[#bca39a] uppercase tracking-wider mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[18px]">account_circle</span> Donor Details
               </h3>
               
               <div className="flex items-center gap-4 mb-4">
                 <div className="size-12 rounded-full bg-gradient-to-br from-primary to-orange-700 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-primary/20">
                    {localListing.donorName?.charAt(0).toUpperCase() || '?'}
                 </div>
                 <div>
                   <p className="font-bold text-white text-lg">{localListing.donorName}</p>
                   <p className="text-sm text-[#bca39a]">Community Donor</p>
                 </div>
               </div>

               {localListing.address && (
                 <div className="flex items-start gap-3 pt-4 border-t border-[#3a2c27]/50 mt-4">
                    <span className="material-symbols-outlined text-[#bca39a] mt-0.5">location_on</span>
                    <div>
                      <p className="text-sm font-medium text-white mb-0.5">Pickup Location</p>
                      <p className="text-sm text-[#bca39a] leading-relaxed">{localListing.address}</p>
                    </div>
                 </div>
               )}
            </div>

            {/* Ingredients Section (Only if provided) */}
            {localListing.ingredients && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">eco</span> Ingredients
                </h3>
                <div className="bg-[#23140f] border border-[#3a2c27] rounded-xl p-5">
                  <p className="text-[#bca39a] text-sm leading-relaxed whitespace-pre-wrap">
                    {localListing.ingredients}
                  </p>
                </div>
              </div>
            )}

            {/* Guidelines */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">health_and_safety</span> Safety Guidelines
              </h3>
              <ul className="text-sm text-[#bca39a] space-y-2 bg-[#23140f] border border-[#3a2c27] p-5 rounded-xl">
                 <li className="flex gap-2 items-start"><span className="material-symbols-outlined text-[18px] text-green-500 shrink-0">check_circle</span> Please check the condition of the food visually and by smell before consuming.</li>
                 <li className="flex gap-2 items-start"><span className="material-symbols-outlined text-[18px] text-green-500 shrink-0">check_circle</span> Food should be consumed as close to the pickup time as possible.</li>
                 <li className="flex gap-2 items-start"><span className="material-symbols-outlined text-[18px] text-green-500 shrink-0">check_circle</span> Reheat cooked meals to a safe temperature before eating.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-16 sm:bottom-0 left-0 right-0 bg-[#23140f]/95 backdrop-blur-xl border-t border-[#3a2c27] p-4 z-40 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {localListing.status !== 'Active' || isExpired ? (
            <button disabled className="w-full py-3.5 rounded-xl font-bold text-red-300 bg-red-900/30 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">error</span> Not Available
            </button>
          ) : (
            <button 
              onClick={handleRequestFood}
              disabled={isRequesting || user?.$id === localListing.donorId}
              className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg ${
                user?.$id === localListing.donorId
                  ? 'bg-[#3a2c27] cursor-not-allowed opacity-50' 
                  : 'bg-primary shadow-primary/20 hover:bg-orange-600'
              }`}
            >
              {isRequesting ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined">volunteer_activism</span>
              )}
              {user?.$id === localListing.donorId ? "This is your listing" : "Request This Food"}
            </button>
          )}
      </div>
    
    </div>
  )
}
