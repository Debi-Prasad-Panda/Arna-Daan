import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default icons in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const YOU_ICON = L.divIcon({
  className: '',
  html: `<div style="
    width:20px;height:20px;border-radius:50%;
    background:#3b82f6;border:3px solid white;
    box-shadow:0 0 0 4px rgba(59,130,246,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const PICKUP_ICON = new L.Icon({
  iconUrl:      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl:    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize:     [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})

function FitBounds({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions.map(p => [p[0], p[1]]), { padding: [40, 40] })
    }
  }, [positions, map])
  return null
}

function fmt(m) {
  if (!m) return '—'
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`
}
function fmtMin(s) {
  if (!s) return '—'
  const m = Math.round(s / 60)
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`
}

// Geocode a query string using Nominatim
async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
  const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  const data = await res.json()
  if (data.length === 0) throw new Error(`Could not locate: ${query}`)
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name }
}

// Fetch OSRM walking/driving route
async function fetchRoute(from, to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=false`
  const res  = await fetch(url)
  const data = await res.json()
  if (!data.routes?.length) throw new Error('No route found')
  const route = data.routes[0]
  const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
  return { coords, distance: route.distance, duration: route.duration }
}

export default function DirectionsModal({ listing, onClose }) {
  const [step, setStep]         = useState('loading') // loading | ready | error
  const [error, setError]       = useState('')
  const [userPos, setUserPos]   = useState(null)
  const [pickupPos, setPickupPos] = useState(null)
  const [routeCoords, setRouteCoords] = useState([])
  const [routeInfo, setRouteInfo]     = useState(null)
  const abortRef = useRef(false)

  useEffect(() => {
    abortRef.current = false
    async function run() {
      try {
        // 1. Get user's GPS location
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
        )
        if (abortRef.current) return
        const user = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserPos(user)

        // 2. Geocode the donor's location
        // Try address first, then title + city, then just city center
        const geoQuery = listing.address?.trim()
          ? listing.address.trim()
          : `Bhubaneswar, Odisha, India`
        const pickup = await geocode(geoQuery)
        if (abortRef.current) return
        setPickupPos({ lat: pickup.lat, lng: pickup.lng, label: pickup.display })

        // 3. Fetch OSRM route
        const route = await fetchRoute(user, { lat: pickup.lat, lng: pickup.lng })
        if (abortRef.current) return
        setRouteCoords(route.coords)
        setRouteInfo({ distance: route.distance, duration: route.duration })
        setStep('ready')
      } catch (e) {
        if (!abortRef.current) {
          setError(e.code === 1 ? 'Location access denied. Please allow location in your browser.' : e.message)
          setStep('error')
        }
      }
    }
    run()
    return () => { abortRef.current = true }
  }, [listing.address, listing.donorName, listing.title])

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const allPositions = [
    ...(userPos  ? [[userPos.lat,   userPos.lng]]   : []),
    ...(pickupPos ? [[pickupPos.lat, pickupPos.lng]] : []),
  ]

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#181210] border border-[#3a2c27] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
           style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3a2c27]">
          <div>
            <h2 className="text-white font-black text-lg">Get Directions</h2>
            <p className="text-[#bca39a] text-xs mt-0.5 truncate max-w-xs">
              {listing.donorName || listing.title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#3a2c27] text-[#bca39a] hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Route info strip */}
        {routeInfo && (
          <div className="flex items-center gap-6 px-5 py-3 bg-[#23140f] border-b border-[#3a2c27]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">route</span>
              <span className="text-white font-black">{fmt(routeInfo.distance)}</span>
              <span className="text-[#bca39a] text-xs">distance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-[18px]">schedule</span>
              <span className="text-white font-black">{fmtMin(routeInfo.duration)}</span>
              <span className="text-[#bca39a] text-xs">ETA (driving)</span>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userPos?.lat},${userPos?.lng}&destination=${pickupPos?.lat},${pickupPos?.lng}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              Open in Maps
            </a>
          </div>
        )}

        {/* Map area */}
        <div className="flex-1 min-h-[340px] relative">
          {step === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#23140f]">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">my_location</span>
              <p className="text-[#bca39a] text-sm">Getting your location and calculating route…</p>
            </div>
          )}
          {step === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#23140f] p-6 text-center">
              <span className="material-symbols-outlined text-4xl text-red-400">location_off</span>
              <p className="text-white font-bold">Could not get directions</p>
              <p className="text-[#bca39a] text-sm">{error}</p>
              <button onClick={onClose} className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Close</button>
            </div>
          )}
          {step === 'ready' && userPos && pickupPos && (
            <MapContainer
              center={[userPos.lat, userPos.lng]}
              zoom={13}
              className="h-full w-full"
              style={{ minHeight: 340, background: '#23140f' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='© OpenStreetMap © CARTO'
              />

              {/* User's location */}
              <Marker position={[userPos.lat, userPos.lng]} icon={YOU_ICON}>
                <Popup>
                  <div className="text-sm font-bold">📍 Your Location</div>
                </Popup>
              </Marker>

              {/* Pickup location */}
              <Marker position={[pickupPos.lat, pickupPos.lng]} icon={PICKUP_ICON}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold text-orange-500 mb-1">🍱 Pickup Point</div>
                    <div className="font-semibold">{listing.donorName || listing.title}</div>
                  </div>
                </Popup>
              </Marker>

              {/* OSRM Road route */}
              {routeCoords.length > 0 && (
                <Polyline
                  positions={routeCoords}
                  pathOptions={{ color: '#e8622a', weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }}
                />
              )}

              <FitBounds positions={allPositions} />
            </MapContainer>
          )}
        </div>

        {/* Legend */}
        {step === 'ready' && (
          <div className="px-5 py-3 border-t border-[#3a2c27] flex items-center gap-5 text-xs text-[#bca39a]">
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-blue-500 border-2 border-white" />
              You
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-orange-500" />
              Pickup point
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-6 bg-primary rounded-full" />
              Route
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
