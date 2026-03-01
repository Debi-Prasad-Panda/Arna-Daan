export default function TrackingTimeline() {
  return (
    <div className="w-full md:w-1/3 flex flex-col bg-[#181210] h-1/2 md:h-full overflow-y-auto custom-scrollbar">
      {/* Header for Logistics Panel */}
      <div className="p-6 pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-black leading-tight tracking-[-0.033em]">Volunteer Hub</h1>
          <p className="text-[#bca39a] text-sm font-medium">Manage your active food rescue missions.</p>
        </div>
        
        <div className="mt-6 flex items-center justify-between p-4 bg-[#281e1b] rounded-xl border border-[#3a2c27]">
          <div className="flex flex-col">
            <span className="text-xs text-[#bca39a] font-medium uppercase tracking-wider">Total Impact</span>
            <span className="text-lg font-bold text-white">1,240 Meals Saved</span>
          </div>
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">emoji_events</span>
          </div>
        </div>
      </div>
      
      {/* Timeline Section */}
      <div className="flex-1 p-6 pt-2">
        <h3 className="text-white text-base font-bold mb-6 flex items-center gap-2">
          Current Mission Status
          <span className="size-2 bg-green-500 rounded-full animate-pulse" />
        </h3>
        
        <div className="relative pl-2">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-[#3a2c27]" />
          
          {/* Step 1: Listed */}
          <div className="group relative flex gap-4 pb-8">
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#281e1b] border-2 border-slate-600 text-slate-500 group-hover:border-primary group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">storefront</span>
              </div>
            </div>
            <div className="flex flex-col pt-1.5">
              <h4 className="text-white text-sm font-bold">Food Listed by Bakery</h4>
              <p className="text-[#bca39a] text-xs mt-0.5">09:45 AM • Sunshine Bakery, 123 Main St</p>
              <div className="mt-2 flex gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#281e1b] text-slate-400 border border-[#3a2c27]">Pastries</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#281e1b] text-slate-400 border border-[#3a2c27]">Bread</span>
              </div>
            </div>
          </div>
          
          {/* Step 2: Pickup Verified */}
          <div className="group relative flex gap-4 pb-8">
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20">
                <span className="material-symbols-outlined text-xl">check</span>
              </div>
            </div>
            <div className="flex flex-col pt-1.5">
              <h4 className="text-white text-sm font-bold">Pickup Verified</h4>
              <p className="text-[#bca39a] text-xs mt-0.5">10:30 AM • Verification ID #8821</p>
              <p className="text-green-400 text-xs font-medium mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span> Successfully picked up
              </p>
            </div>
          </div>
          
          {/* Step 3: In Transit (Active) */}
          <div className="group relative flex gap-4 pb-8">
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10">
                <span className="material-symbols-outlined text-xl animate-pulse">local_shipping</span>
              </div>
            </div>
            <div className="flex flex-col pt-1.5 w-full pr-4">
              <h4 className="text-sm font-bold text-primary">In Transit</h4>
              <p className="text-[#bca39a] text-xs mt-0.5">Current Status • ETA 15 mins</p>
              <div className="w-full bg-[#281e1b] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-3/4" />
              </div>
            </div>
          </div>
          
          {/* Step 4: Dropoff (Pending) */}
          <div className="group relative flex gap-4">
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#281e1b] border-2 border-dashed border-slate-600 text-slate-500">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
            </div>
            <div className="flex flex-col pt-1.5">
              <h4 className="text-slate-500 text-sm font-bold">Delivered to Shelter</h4>
              <p className="text-slate-600 text-xs mt-0.5">Pending Arrival • Hope Community Center</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="p-6 bg-[#23140f]">
        <button 
          onClick={async () => {
            const { default: toast } = await import('react-hot-toast');
            
            // In a real app, you would pass the specific request ID here
            // We'll use a dummy ID for the UI interaction demonstration
            const dummyRequestId = "REQ-" + Math.floor(Math.random() * 10000);
            
            const toastId = toast.loading('Accepting mission...');
            try {
              // await acceptMission(dummyRequestId);
              // For now, since we might not have a valid Request ID in the DB during this demo:
              toast.success('Mission accepted! You are now the assigned driver.', { id: toastId });
            } catch(e) {
              toast.error(e.message || 'Failed to accept mission', { id: toastId });
            }
          }}
          className="w-full group flex items-center justify-center gap-3 rounded-xl h-14 bg-primary hover:bg-[#e55a2b] transition-all shadow-lg shadow-primary/25 active:scale-[0.98]"
        >
          <span className="font-bold text-white text-lg">Accept Mission</span>
          <span className="material-symbols-outlined text-white group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  )
}
