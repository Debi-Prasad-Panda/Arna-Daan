import { useEffect, useCallback, useState } from 'react'
import useListingStore from '../store/listingStore'
import useRequestStore from '../store/requestStore'
import { useRealtime } from '../hooks/useRealtime'
import { APPWRITE_CONFIG } from '../lib/appwrite'
import DirectionsModal from './DirectionsModal'

// ── Fallback demo cards shown when no real Appwrite listings exist ──
const MOCK_CARDS = [
  {
    id: 1,
    title: '50 Vegetarian Meals',
    donorName: 'Green Leaf Bistro',
    category: 'Ready to eat',
    quantity: 50,
    diet: 'Veg',
    bestBefore: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxIT36yDx143kNTXmSITHBt-ZqHSHEVOI_MZ1h9RDpm15y6rlHeReuvoulJeYFAkRsBv-vrzom66foOtb96HpCRldwXGsC9C3d23QR5mg0aFxJK1CpZ5kL_6C_-io7KVZN0f-PKfmgPmlibdMGGU9G-a1NIhSO3shumEYNE2bviyiHr3fKI_iXPY-iKec1HpSknXmCMwcWEsThZ-4nvgzjL7BDAWrsY8_JQz1xHQcCefKYEqbozg17GdR6togmTVcoWnCKADe9pA',
    _isMock: true,
  },
  {
    id: 2,
    title: 'Assorted Raw Veggies',
    donorName: 'City Market Co-op',
    category: 'Raw Ingredients',
    quantity: 30,
    diet: 'Veg',
    bestBefore: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAadeTglXWoMQx-S2wpVMzZxIso5HQQnPTa7hecrdsCbpv7zsYCBIRB1sInaKZ1WsJlppi-CInNExl4LDMDgIMv2obMWbJKUBeRfSIGC29GUcG8uQ3_jpmOMam6wKJFv3bAyzToELj4hnwgnbMWJga-QgEKiS33JFo-pcyrbTlI_Xe4vQSDKgCV_9z-p8SNf5EUAKBR-mSG_lnu31L2bNi3zHmEeGZFTYwvbxSR1r5xSIhIKpTDyEgT6cTVZL4fMR_bfb2fY7VEOg',
    _isMock: true,
  },
  {
    id: 3,
    title: '20 Frozen Pizzas',
    donorName: 'Dominos Downtown',
    category: 'Frozen',
    quantity: 20,
    diet: 'Non-Veg',
    bestBefore: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDaT_JjepvGoVLxW0CnyzykaEe4reQ2axAa5WbAcCpBaCe6d5mk8-Ms_s_VUjh-i1o7lf98gsL1zn0iNifJj_4_QDHaoD1KgoTCrssh6S97N8TNR3iAH06gQ1pdk42zVafGfe0XSB7ipXBwq-oJnTr7fi1nyRYS1PRi8Tu7Q5PhiujfDpeY2VRyvU1yvkt5eFT-vxFNLFod1Q_nvk6NeCl252ErgOaOQ1YZNWh4uwqzEi1UYkb7nn6fX-GhQSuSGdfmwT0WfulA',
    _isMock: true,
  },
  {
    id: 4,
    title: 'Surplus Bread Loaves',
    donorName: "Baker's Dozen",
    category: 'Baked Goods',
    quantity: 40,
    diet: 'Veg',
    bestBefore: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABqOUB349kfkdi1amD3D63mFuoeJRAhV4M7YJwX2Z7QGlm6B-PffpLbEiqqR4qd1hKUxmHm4S2Oyj4gyxgnrES8sRTiEX13yuFm4rfWRJ7F_j-da2blvkvecsV5attnmYhhkfHbuHvGnvp8XvTLXQHcYh_QGLRVWBtbN6h1bgOlAiOWOHbe4uR6s7wv7Pj83Yy_NKXqHQnsdl2Z74V8c6162-AALoDdnEaAesk07N1hoK3usN_O5RqqNgYqlAuMJUFkZSKgEnTMg',
    _isMock: true,
  },
  {
    id: 5,
    title: '100 Pasta Portions',
    donorName: 'Italian Feast Events',
    category: 'Ready to eat',
    quantity: 100,
    diet: 'Veg',
    bestBefore: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWxrx_NiY4XZ--fGgRh5MiO2i_Vq-QtlCKYaiU33Kk-LxTIZtqsOarLzDjPQtA3xzX8-KvfGJ2zucCbtEXfeSL9ni3IJ8yCWIiVp_-xdgo-wdPerjdsg44H9G3a4mEIGJ1VrHxMnOfEMjhF5HIrHs-7maWtz4nHbc6g3dyqCt0ZqYNtyfxQ4p6xY7CnJfqy9zAP2BTjo2U4g5HB-ANsAQ6et-he-72ZN_rc242SBI7B70ObsyQ2tm86NF9BS3hL2vZeVeIQ2p_8A',
    _isMock: true,
  },
  {
    id: 6,
    title: 'Fresh Seasonal Fruit',
    donorName: 'Whole Foods Local',
    category: 'Raw Ingredients',
    quantity: 80,
    diet: 'Veg',
    bestBefore: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqkClQ7sn0QeM834bquPPoRC5nQHQ27ovwr18mVS2biJsaL4AiTUaZIA5OAPYJKRwK64iBEnNxSZRYRKmvy17O2i-EfxwoNFdAGhr8Gmxo3Ara7gAj5494ntcUI1TP2qouMgtrpFGnm6W6kWmE_sbALDJKuCnjObpUeWcSQjMBs7iPh0-ju6KKhST5sQGi2IyoPnVLvjyLd3U47U8jO-jR6pKVmUuIewdbVCgy9If4qAKE7YiHFF5MQNguC245wwZkzLasISiecw',
    _isMock: true,
  },
]

function getTimeLabel(bestBefore) {
  if (!bestBefore) return 'Unknown'
  const ms = new Date(bestBefore) - Date.now()
  if (ms < 0) return 'Expired'
  const h = Math.floor(ms / 3600000)
  if (h < 1) return '< 1 hour'
  if (h < 24) return `${h} hours`
  return `${Math.floor(h / 24)} days`
}

function isUrgent(bestBefore) {
  if (!bestBefore) return false
  const h = (new Date(bestBefore) - Date.now()) / 3600000
  return h < 4
}

const CATEGORY_ICON = {
  'Ready to eat': 'restaurant',
  'Raw Ingredients': 'grocery',
  'Frozen': 'ac_unit',
  'Baked Goods': 'bakery_dining',
  'Canned': 'inventory_2',
}

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop',
]

function FeedCard({ card, index = 0 }) {
  const [directionsOpen, setDirectionsOpen] = useState(false)
  const timeLabel = getTimeLabel(card.bestBefore)
  const urgent    = isUrgent(card.bestBefore)
  const catIcon   = CATEGORY_ICON[card.category] || 'restaurant'
  const imgSrc    = card.img || FOOD_IMAGES[index % FOOD_IMAGES.length]
  const cardId    = card.$id || card.id

  return (
    <>
    <div className="group flex flex-col bg-[#23140f] border border-[#3a2c27] rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
      {/* Image area */}
      <div className="relative h-48 overflow-hidden">
        {urgent && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-primary/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            Expiring Soon
          </div>
        )}
        {card._isMock && (
          <div className="absolute top-3 right-12 z-10 bg-[#281e1b]/90 text-[#bca39a] text-[10px] font-bold px-2 py-0.5 rounded-full">
            DEMO
          </div>
        )}
        <button
          onClick={() => import('react-hot-toast').then(({ default: toast }) => toast.success('Added to favorites!'))}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">favorite</span>
        </button>
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${imgSrc}')` }}
        />
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-[#bca39a] mt-1">{card.donorName || 'Anonymous Donor'}</p>
          </div>
          {card.quantity && (
            <div className="flex items-center justify-center bg-[#3a2c27] rounded-lg px-2 py-1">
              <span className="text-xs font-bold text-white">{card.quantity} pcs</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 my-3 text-sm text-[#bca39a]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">{catIcon}</span>
            <span>{card.category || 'Food'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[18px] ${urgent ? 'text-primary' : 'text-slate-400'}`}>schedule</span>
            <span className={urgent ? 'text-primary font-semibold' : ''}>{timeLabel}</span>
          </div>
          {card.diet && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              card.diet === 'Veg' ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400'
            }`}>
              {card.diet}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-[#3a2c27] flex gap-2">
          {/* Get Directions */}
          <button
            onClick={() => setDirectionsOpen(true)}
            title="Get directions to pickup"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#3a2c27] text-[#bca39a] hover:text-white hover:border-blue-400/60 hover:bg-blue-500/10 transition-all text-sm font-semibold shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-400">directions</span>
            Directions
          </button>

          {/* Details / Claim Now */}
          <button
            onClick={async () => {
              if (card._isMock) {
                const { default: toast } = await import('react-hot-toast')
                toast.success('Demo card — real claims work with live Appwrite listings!')
                return
              }
              window.location.href = `/listing/${cardId}`
            }}
            className="flex-1 bg-primary hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Details</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>

    {/* Directions modal — rendered at FeedCard level, portal-style via fixed positioning */}
    {directionsOpen && (
      <DirectionsModal listing={card} onClose={() => setDirectionsOpen(false)} />
    )}
  </>
  )
}

export default function FeedGrid({ activeFilter = 'all', urgentOnly = false }) {
  const { listings, isLoading, fetchListings } = useListingStore()

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  // 🔴 Realtime: re-fetch whenever any listing is created, updated, or deleted
  const handleListingEvent = useCallback(() => {
    fetchListings()
  }, [fetchListings])
  useRealtime(APPWRITE_CONFIG.listingsCollectionId, handleListingEvent)

  // ── Filter logic ─────────────────────────────────────────────────────────────
  function applyFilters(cards) {
    let result = cards
    // Category / diet filter
    if (activeFilter !== 'all') {
      result = result.filter(c => {
        // 'Veg' / 'Non-Veg' match the diet field
        if (activeFilter === 'Veg' || activeFilter === 'Non-Veg') {
          return c.diet === activeFilter
        }
        // Everything else matches the category field
        return c.category === activeFilter
      })
    }
    // Urgency filter — cards expiring within 4 hours
    if (urgentOnly) {
      result = result.filter(c => isUrgent(c.bestBefore))
    }
    return result
  }

  // Use real Appwrite data if available, otherwise fall back to demo cards
  const baseCards    = listings.length > 0 ? listings : MOCK_CARDS
  const displayCards = applyFilters(baseCards)

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#23140f] border border-[#3a2c27] rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-[#3a2c27]" />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-5 bg-[#3a2c27] rounded w-3/4" />
                <div className="h-4 bg-[#3a2c27] rounded w-1/2" />
                <div className="h-10 bg-[#3a2c27] rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {listings.length === 0 && activeFilter === 'all' && !urgentOnly && (
            <div className="flex items-center gap-3 py-3 px-5 bg-[#3a2c27]/30 border border-dashed border-[#3a2c27] rounded-xl mb-6 text-[#bca39a] text-sm">
              <span className="material-symbols-outlined text-xl text-primary">info</span>
              No live listings yet — showing demo cards. Real donations will appear here once donors post them.
            </div>
          )}

          {displayCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <span className="material-symbols-outlined text-6xl text-[#3a2c27]">search_off</span>
              <div>
                <p className="text-white font-bold text-lg">No listings match this filter</p>
                <p className="text-[#bca39a] text-sm mt-1">Try a different category or remove the High Need filter.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCards.map((c, i) => (
                <FeedCard key={c.$id || c.id} card={c} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-12 mb-8 flex justify-center">
        <button
          onClick={() => fetchListings()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#3a2c27] bg-[#2c1a15] text-[#bca39a] hover:text-white hover:border-primary/50 transition-colors font-semibold"
        >
          <span>Refresh donations</span>
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>
    </>
  )
}
