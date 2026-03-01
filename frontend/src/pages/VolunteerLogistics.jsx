import VolunteerTopNav from '../components/VolunteerTopNav'
import InteractiveMap from '../components/InteractiveMap'
import TrackingTimeline from '../components/TrackingTimeline'

export default function VolunteerLogistics() {
  return (
    <div className="bg-[#181210] font-display text-slate-100 min-h-screen flex flex-col overflow-x-hidden">
      <VolunteerTopNav />
      {/* Main Content Area */}
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden h-[calc(100vh-73px)]">
        <InteractiveMap />
        <TrackingTimeline />
      </main>
    </div>
  )
}
