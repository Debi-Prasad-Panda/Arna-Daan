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

        {/* Map — 50vh on mobile, fills all remaining height on desktop */}
        <div className="h-[50vh] md:h-[calc(100vh-65px)] md:flex-1 md:sticky md:top-[65px] overflow-hidden">
          <InteractiveMap />
        </div>

        {/* Side panel — full width on mobile, fixed 460px on desktop, own scroll */}
        <div className="w-full md:w-[460px] lg:w-[500px] md:h-[calc(100vh-65px)] md:overflow-y-auto md:sticky md:top-[65px] shrink-0">
          <TrackingTimeline />
        </div>

      </main>
    </div>
  )
}
