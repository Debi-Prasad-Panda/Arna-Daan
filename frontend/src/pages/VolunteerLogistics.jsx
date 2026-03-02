import VolunteerTopNav from '../components/VolunteerTopNav'
import InteractiveMap from '../components/InteractiveMap'
import TrackingTimeline from '../components/TrackingTimeline'

export default function VolunteerLogistics() {
  return (
    <div className="bg-[#181210] font-display text-slate-100 min-h-screen flex flex-col">
      <VolunteerTopNav />

      {/* ── Mobile: map on top (50vh), panel scrolls below ── */}
      {/* ── Desktop: side‑by‑side, map fills remaining height ── */}
      <main className="flex flex-col md:flex-row flex-1">

        {/* Map — grows to fill 60% of horizontal space on desktop */}
        <div className="h-[50vh] md:h-[calc(100vh-65px)] md:flex-[3] md:sticky md:top-[65px] overflow-hidden">
          <InteractiveMap />
        </div>

        {/* Side panel — 40% on desktop, full width on mobile */}
        <div className="w-full md:flex-[2] md:h-[calc(100vh-65px)] md:overflow-y-auto md:sticky md:top-[65px] shrink-0">
          <TrackingTimeline />
        </div>

      </main>
    </div>
  )
}
