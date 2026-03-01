import { useState } from 'react'

const LISTING_IMGS = {
  rice: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUNyGSEU1fovxDPHC5CW9NhKOYvP4Qc8wkDwNYtJiEHhCYU1uZAVGRQbZ9ReoqT2iaTASE3ByNloa9kM6ASlSh4yv1ffZxCNrDi3aoYTaXKUeTtHc9EjnjBC6Ue_NNZ29EjnU8h97PuclaWAlglX_Vs0vYfNU6B1DSBL9RRFKGWXI9BzfBwSeL65rprr7kyaqr-lBT-8_y3D3L2uHQWKm_CXT4WagxYhJtSDYRuGZIQlHwclRgIslQO7X1U2N71ON6oRlsJ_X3sQ',
  bread: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo95zsgMUTRXiXD4uD-quN4DJMZZWSB0230RB9d3STpCkIUC6tSv7_wZR1A5lutYcYY2S-vAc76HGIqLYMD8f958vn0pmSi03zJVBmuWpYqEhJbafvAkRZPLanV022qZtPTrG7hZ3eb32M1uQUfUqt6q1_yMgcPZU6n_tfochhgXDi9fYc7qA8uXKWoJ-AlSSgZUUhGRs1_qhvYScPlQddQ03sZ7uMFQc1mZtsHHhkJdSR6dOgkvtuI-9X_laXOKXq8OD4GTmSzg',
  chicken: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdticwSA6Yb3YZwMY_36OcyTZR50W11AhYxJ7IpORggst1jwLjoZ6QwmTCe_rRU6SLGOs8joIoTX7e6KqBvWo8IWVWbPfZGS_P6OjVkHSm8zktNVec5WS7v9DRR81LIfBYykQMQ7jhCDU6hDdiF4jbkotvBnWK9xd1ucX-QZSWmnWCj7ePsy8RUbC3UvVgeMCj7bTF9itGfogDXAZbQDry8w1eeQeuHaXxWs8TDkZ0_Dtk-9rfKY3rgMttf7e7P6NV8F7X1RYTCg',
}

const LISTINGS = [
  {
    id: 1,
    title: 'Surplus Rice & Dal',
    servings: 'Approx. 40 servings',
    expiry: 'Expires in 3h',
    expiryUrgent: true,
    distance: '2.5 km away',
    diet: 'VEG',
    dietColor: 'bg-green-900/80 text-green-400 border-green-700',
    status: 'Active',
    statusColor: 'bg-green-600/20 text-green-400 border-green-600/30',
    img: LISTING_IMGS.rice,
    faded: false,
    grayscale: false,
  },
  {
    id: 2,
    title: 'Assorted Bakery Items',
    servings: '15 boxes of pastries',
    expiry: 'Expires in 12h',
    expiryUrgent: false,
    distance: '5.0 km away',
    diet: 'VEGAN',
    dietColor: 'bg-yellow-900/80 text-yellow-400 border-yellow-700',
    status: 'Picked Up',
    statusColor: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    img: LISTING_IMGS.bread,
    faded: false,
    grayscale: false,
  },
  {
    id: 3,
    title: 'Grilled Chicken Surplus',
    servings: '30 servings',
    expiry: 'Completed yesterday',
    expiryUrgent: false,
    distance: null,
    diet: 'NON-VEG',
    dietColor: 'bg-red-900/80 text-red-400 border-red-700',
    status: 'Closed',
    statusColor: 'bg-[#3a2c27] text-[#bca39a]',
    img: LISTING_IMGS.chicken,
    faded: true,
    grayscale: true,
  },
]

function ListingCard({ listing }) {
  return (
    <div className={`bg-[#23140f] border border-[#3a2c27] rounded-xl p-4 flex gap-4 hover:border-primary/50 transition-colors group ${listing.faded ? 'opacity-60 hover:opacity-100' : ''}`}>
      <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-lg overflow-hidden relative">
        <img
          src={listing.img}
          alt={listing.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${listing.grayscale ? 'grayscale' : ''}`}
        />
        <div className={`absolute top-2 left-2 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full border ${listing.dietColor}`}>
          {listing.diet}
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base leading-tight line-clamp-1 text-white">{listing.title}</h3>
            <span className="material-symbols-outlined text-[#bca39a] cursor-pointer hover:text-white text-lg flex-shrink-0 ml-2">more_vert</span>
          </div>
          <p className="text-[#bca39a] text-sm mt-1">{listing.servings}</p>
        </div>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="material-symbols-outlined text-sm text-[#bca39a]">{listing.distance ? 'schedule' : 'event_available'}</span>
            <span className={listing.expiryUrgent ? 'text-orange-400 font-medium' : 'text-[#bca39a]'}>{listing.expiry}</span>
          </div>
          {listing.distance && (
            <div className="flex items-center gap-1.5 text-[#bca39a] text-xs">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span>{listing.distance}</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 bg-[#3a2c27] hover:bg-white hover:text-black text-white text-xs font-bold py-2 rounded-lg transition-colors">
            {listing.status === 'Closed' ? 'Details' : 'Edit'}
          </button>
          <button className={`flex-1 text-xs font-bold py-2 rounded-lg border ${listing.statusColor}`}>
            {listing.status}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ActiveListings() {
  return (
    <div className="xl:col-span-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Active Listings</h2>
        <a className="text-sm text-primary font-medium hover:underline" href="#">View All</a>
      </div>
      <div className="flex flex-col gap-4">
        {LISTINGS.map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
      {/* Monthly Goal Card */}
      <div className="mt-2 bg-gradient-to-br from-[#2a1d18] to-[#23140f] border border-[#3a2c27] rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-xl text-white">Monthly Goal</h3>
          <p className="text-[#bca39a] text-sm mt-1 mb-4">You are close to reaching your donation goal for March!</p>
          <div className="w-full bg-black/40 rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-orange-500 to-primary h-3 rounded-full" style={{ width: '85%' }} />
          </div>
          <div className="flex justify-between text-xs font-bold text-[#bca39a]">
            <span>1,250 Meals</span>
            <span className="text-white">Goal: 1,500</span>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
