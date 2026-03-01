import VolunteerTopNav from '../components/VolunteerTopNav'
import InteractiveMap from '../components/InteractiveMap'
import TrackingTimeline from '../components/TrackingTimeline'

export default function VolunteerLogistics() {
  return (
    <div className="bg-[#181210] font-display text-slate-100 min-h-screen flex flex-col overflow-x-hidden">
      <VolunteerTopNav />
      {/* Mobile: stacked, each section scrolls. Desktop: side-by-side full-height */}
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden md:h-[calc(100vh-57px)]">
        <div className="h-[50vh] md:h-full md:flex-1">
          <InteractiveMap />
        </div>
        <div className="flex-1 md:flex-none md:w-[380px] lg:w-[420px] overflow-y-auto">
          <TrackingTimeline />
        </div>
      </main>
    </div>
  )
}

