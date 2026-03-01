import ReceiverTopNav from '../components/ReceiverTopNav'
import FeedFilters from '../components/FeedFilters'
import FeedGrid from '../components/FeedGrid'

export default function ReceiverFeed() {
  return (
    <div className="min-h-screen flex flex-col font-display" style={{ backgroundColor: '#181210', color: '#f2ebe9' }}>
      <ReceiverTopNav />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8">
        
        {/* Page Title & Hero Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary">Live Feed</span>
              <span className="text-[#bca39a] text-sm">Last updated 2 mins ago</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Available Surplus Food
            </h1>
            <p className="text-[#bca39a] text-lg max-w-xl">
              Browse real-time food donations near your registered location. Claim quickly to secure meals for your beneficiaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Urgent Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group bg-[#2c1a15] border border-[#3a2c27] rounded-xl px-4 py-2.5 hover:border-primary/50 transition-all select-none shadow-sm">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-9 h-5 bg-[#3a2c27] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">emergency_home</span>
                <span className="text-sm font-bold text-white">High Need Only</span>
              </div>
            </label>

            {/* View Toggle */}
            <div className="bg-[#2c1a15] border border-[#3a2c27] rounded-xl p-1 flex items-center shadow-sm">
              <button className="p-2 rounded-lg bg-[#3a2c27] text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">view_list</span>
              </button>
              <button className="p-2 rounded-lg text-[#bca39a] hover:bg-[#3a2c27]/50 transition-colors">
                <span className="material-symbols-outlined text-[20px]">map</span>
              </button>
            </div>
          </div>
        </div>

        <FeedFilters />
        <FeedGrid />

      </main>
    </div>
  )
}
