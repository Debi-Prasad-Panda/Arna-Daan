export default function InteractiveMap() {
  return (
    <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-[#281e1b] border-b md:border-b-0 md:border-r border-[#3a2c27]">
      {/* Map Background Image Placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale opacity-80" 
        style={{ backgroundImage: 'url("https://placeholder.pics/svg/1000x800/181210-281e1b/ffffff-ffffff/Map%20Placeholder")' }}
      />
      
      {/* Map Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 md:w-96 flex flex-col gap-4 z-10">
        {/* Search Bar */}
        <div className="flex w-full items-center rounded-xl bg-[#281e1b] shadow-lg border border-[#3a2c27] h-12 overflow-hidden">
          <div className="flex items-center justify-center pl-4 pr-2 text-[#bca39a]">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            type="text"
            className="w-full bg-transparent border-none text-white outline-none placeholder:text-[#bca39a] focus:ring-0 text-sm font-medium h-full" 
            placeholder="Search location or route ID"
          />
        </div>
      </div>
      
      {/* Map Controls (Zoom/Locate) */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
        <div className="flex flex-col rounded-lg bg-[#281e1b] shadow-lg border border-[#3a2c27] overflow-hidden">
          <button className="p-2 hover:bg-[#181210] text-white border-b border-[#3a2c27] transition-colors">
            <span className="material-symbols-outlined block">add</span>
          </button>
          <button className="p-2 hover:bg-[#181210] text-white transition-colors">
            <span className="material-symbols-outlined block">remove</span>
          </button>
        </div>
        <button className="p-2 rounded-lg bg-primary text-white shadow-lg hover:bg-[#e55a2b] transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {/* Active Route Card Overlay on Map */}
      <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-80 bg-[#281e1b] p-4 rounded-xl shadow-xl border border-[#3a2c27] z-10">
        <div className="flex items-start gap-3">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Active Delivery</h4>
            <p className="text-[#bca39a] text-xs mt-0.5">Route #9921 • 3.2 km remaining</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">On Time</span>
              <span className="text-[#bca39a] text-xs">ETA: 10 mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
