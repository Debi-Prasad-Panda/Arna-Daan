import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useDeliveryStore from '../store/deliveryStore';
import useAuthStore from '../store/authStore';

// ----- Leaflet Icon Fix for Vite -----
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ----- Custom Icons -----
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const pickupIcon  = createIcon('orange');
const dropoffIcon = createIcon('green');

// Pulsing truck icon for the live delivery tracker
const truckIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:44px; height:44px; border-radius:50%;
    background: rgba(249,115,22,0.2);
    border: 3px solid #f97316;
    display:flex; align-items:center; justify-content:center;
    box-shadow: 0 0 0 0 rgba(249,115,22,0.7);
    animation: trackerPulse 1.6s infinite;
    font-size:20px; line-height:1;
  ">🚚</div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
});

// ----- Inner component that has access to map instance -----
function MapController({ flyTarget, zoomCmd }) {
  const map = useMap();
  useEffect(() => {
    if (zoomCmd === 'in')  map.zoomIn();
    if (zoomCmd === 'out') map.zoomOut();
  }, [zoomCmd, map]);
  useEffect(() => {
    if (flyTarget) map.flyTo(flyTarget, 15, { animate: true, duration: 1.2 });
  }, [flyTarget, map]);
  return null;
}

// ----- Static fallback route (shown when no Appwrite delivery is live) -----
const DEMO_ROUTE = {
  pickup:  { lat: 20.2961, lng: 85.8245, name: 'City Hospital Canteen',  address: '123 Hospital Rd, Bhubaneswar' },
  dropoff: { lat: 20.2858, lng: 85.8361, name: 'Hope Orphanage',          address: '45 Chilika Colony, Bhubaneswar' },
};
const DEFAULT_CENTER = [20.2910, 85.8300];

// ----- Helpers -----
function fmtDist(meters) {
  if (!meters) return '—';
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}
function fmtDur(seconds) {
  if (!seconds) return '—';
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
function fmtSpeed(mps) {
  // mps = metres per second from Geolocation API
  if (!mps || mps < 0) return '0';
  return Math.round(mps * 3.6).toFixed(0); // convert to km/h
}

// ----- Main Component -----
export default function InteractiveMap() {
  const { deliveries, fetchDeliveries, isLoading } = useDeliveryStore();
  const { user } = useAuthStore();

  // Map controls
  const [flyTarget, setFlyTarget] = useState(null);
  const [zoomCmd,   setZoomCmd]   = useState(null);

  // Active route
  const [activeRoute, setActiveRoute] = useState(DEMO_ROUTE);

  // Road-following route geometry + OSRM metadata
  const [routePositions, setRoutePositions] = useState([]);
  const [routeLoading, setRouteLoading]     = useState(false);
  const [routeDistance, setRouteDistance]   = useState(null); // metres
  const [routeDuration, setRouteDuration]   = useState(null); // seconds
  const routeAbort = useRef(null);

  // Live GPS tracker for the delivery person
  const [trackerPos, setTrackerPos]     = useState(null);  // [lat, lng]
  const [trackerSpeed, setTrackerSpeed] = useState(null);  // m/s from Geolocation
  const [tracking, setTracking]         = useState(false);
  const watchId = useRef(null);

  // Simulated speed (increments while tracking on desktop where speed is null)
  const [simSpeed, setSimSpeed]         = useState(0);
  const simRef = useRef(null);

  // ----- Fetch real deliveries from Appwrite on mount -----
  useEffect(() => {
    if (user) fetchDeliveries(user.$id).catch(() => {});
  }, [user]);

  // Use the first live delivery from Appwrite if one exists
  useEffect(() => {
    if (deliveries?.length > 0) {
      const live = deliveries[0];
      setActiveRoute({
        pickup:  { lat: 20.2961, lng: 85.8245, name: live.requestId ? `Pickup #${live.requestId.slice(-6)}` : DEMO_ROUTE.pickup.name, address: 'Live Pickup Location' },
        dropoff: { lat: 20.2858, lng: 85.8361, name: live.volunteerName ? `Delivery by ${live.volunteerName}` : DEMO_ROUTE.dropoff.name, address: 'Live Dropoff Location' },
        status: live.status, pickupCode: live.pickupCode,
      });
    }
  }, [deliveries]);

  // ----- Fetch OSRM route whenever activeRoute changes -----
  useEffect(() => {
    const { pickup, dropoff } = activeRoute;
    if (!pickup?.lat || !dropoff?.lat) return;

    if (routeAbort.current) routeAbort.current.abort();
    const controller = new AbortController();
    routeAbort.current = controller;

    setRouteLoading(true);
    setRoutePositions([[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]]);

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}` +
      `?overview=full&geometries=geojson`;

    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        const route = data?.routes?.[0];
        if (route?.geometry?.coordinates?.length > 0) {
          setRoutePositions(route.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
        }
        setRouteDistance(route?.distance ?? null);
        setRouteDuration(route?.duration ?? null);
        setRouteLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.warn('OSRM failed:', err.message);
        setRouteLoading(false);
      });

    return () => controller.abort();
  }, [activeRoute]);

  // ----- Start / Stop live GPS tracking -----
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported.'); return;
    }
    setTracking(true);
    toast.success('Live tracking started! 🚚');

    // Start a simulated speed ramp for desktop (no real GPS speed on desktop)
    let s = 10;
    simRef.current = setInterval(() => {
      s = Math.min(60, s + (Math.random() * 4 - 1));  // random walk 10-60 km/h
      setSimSpeed(s);
    }, 1000);

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        setTrackerPos([latitude, longitude]);
        setFlyTarget([latitude, longitude]);
        if (speed !== null) {
          setTrackerSpeed(speed);     // real m/s
          setSimSpeed(null);          // if real speed available, drop sim
        }
      },
      (err) => { toast.error(`Tracking error: ${err.message}`); stopTracking(); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    clearInterval(simRef.current);
    setTracking(false);
    setSimSpeed(0);
    toast('Tracking stopped.', { icon: '⏹' });
  }, []);

  // Cleanup on unmount
  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    clearInterval(simRef.current);
  }, []);

  // ----- One-shot "Locate Me" -----
  const [locating, setLocating] = useState(false);
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported.'); return; }
    setLocating(true);
    const tid = toast.loading('Acquiring GPS signal…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = [pos.coords.latitude, pos.coords.longitude];
        setTrackerPos(c); setFlyTarget(c);
        toast.success('Located!', { id: tid });
        setLocating(false);
      },
      (err) => { toast.error(err.message, { id: tid }); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Speed to display (real GPS speed if available, else simulated)
  const displaySpeed = trackerSpeed !== null
    ? fmtSpeed(trackerSpeed)
    : simSpeed !== null && tracking
      ? Math.round(simSpeed).toFixed(0)
      : '0';

  // Polyline style
  const polylineOpts = routeLoading
    ? { color: '#f97316', weight: 3, opacity: 0.5, dashArray: '8, 8' }
    : { color: '#f97316', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' };

  // Distance remaining (crude: if tracking, subtract ~1km per 2 min elapsed — demo)
  const distKm = routeDistance ? (routeDistance / 1000).toFixed(1) : null;

  return (
    <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-[#181210] border-b md:border-b-0 md:border-r border-[#3a2c27]">

      {/* ── Pulse keyframe ── */}
      <style>{`
        @keyframes trackerPulse {
          0%   { box-shadow: 0 0 0 0 rgba(249,115,22,0.7); }
          70%  { box-shadow: 0 0 0 16px rgba(249,115,22,0); }
          100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
        }
        .leaflet-container { background-color: #181210 !important; }
        .leaflet-popup-content-wrapper {
          background-color: #281e1b !important; color: white !important;
          border: 1px solid #3a2c27 !important; border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
        }
        .leaflet-popup-tip { background-color: #281e1b !important; }
        .leaflet-popup-close-button { color: #bca39a !important; }
        .leaflet-popup-content { margin: 10px 14px !important; }
      `}</style>

      {/* ── Real Leaflet Map ── */}
      <div className="absolute inset-0 z-0">
        <MapContainer center={DEFAULT_CENTER} zoom={13} zoomControl={false} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapController flyTarget={flyTarget} zoomCmd={zoomCmd} />

          {/* Road-following route */}
          {routePositions.length >= 2 && (
            <Polyline positions={routePositions} pathOptions={polylineOpts} />
          )}

          {/* Pickup marker */}
          <Marker position={[activeRoute.pickup.lat, activeRoute.pickup.lng]} icon={pickupIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-orange-400 mb-1">📦 Pickup</div>
                <div className="font-semibold">{activeRoute.pickup.name}</div>
                <div className="text-gray-400 text-xs mt-0.5">{activeRoute.pickup.address}</div>
              </div>
            </Popup>
          </Marker>

          {/* Dropoff marker */}
          <Marker position={[activeRoute.dropoff.lat, activeRoute.dropoff.lng]} icon={dropoffIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-green-400 mb-1">🏠 Dropoff</div>
                <div className="font-semibold">{activeRoute.dropoff.name}</div>
                <div className="text-gray-400 text-xs mt-0.5">{activeRoute.dropoff.address}</div>
              </div>
            </Popup>
          </Marker>

          {/* Live delivery tracker (pulsing truck) */}
          {trackerPos && (
            <Marker position={trackerPos} icon={truckIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-bold text-orange-400 mb-1">🚚 Delivery Guy</div>
                  <div className="text-gray-300">Speed: <span className="font-bold text-white">{displaySpeed} km/h</span></div>
                  {routeDistance && (
                    <div className="text-gray-300">Route: <span className="font-bold text-white">{distKm} km</span></div>
                  )}
                  <div className="text-gray-400 text-xs mt-1">Live GPS · updating every second</div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* ── Search bar ── */}
      <div className="absolute top-4 left-4 right-4 md:w-96 z-10">
        <div className="flex w-full items-center rounded-xl bg-[#281e1b]/95 backdrop-blur-sm shadow-lg border border-[#3a2c27] h-12 overflow-hidden">
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

      {/* ── Route info strip (distance / ETA / speed) ── */}
      <div className="absolute top-20 left-4 z-10 flex flex-col gap-2">
        {/* Distance + ETA pill */}
        <div className="flex items-center gap-2">
          {routeDistance && (
            <div className="flex items-center gap-1.5 bg-[#281e1b]/95 backdrop-blur-sm border border-[#3a2c27] rounded-full px-3 py-1.5 shadow-lg">
              <span className="material-symbols-outlined text-orange-400 text-[16px]">route</span>
              <span className="text-white text-xs font-bold">{distKm} km</span>
              <span className="text-[#bca39a] text-[10px]">·</span>
              <span className="text-[#bca39a] text-xs">{fmtDur(routeDuration)} ETA</span>
            </div>
          )}
          {routeLoading && (
            <div className="flex items-center gap-1.5 bg-[#281e1b]/95 backdrop-blur-sm border border-[#3a2c27] rounded-full px-3 py-1.5">
              <span className="material-symbols-outlined text-orange-400 text-[16px] animate-spin">refresh</span>
              <span className="text-[#bca39a] text-xs">Calculating route…</span>
            </div>
          )}
        </div>

        {/* Live speed gauge (only when tracking) */}
        {tracking && (
          <div className="flex items-center gap-2 bg-[#281e1b]/95 backdrop-blur-sm border border-orange-500/40 rounded-full px-3 py-1.5 shadow-lg">
            <span className="size-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-white text-sm font-black">{displaySpeed}</span>
            <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider">km/h</span>
          </div>
        )}
      </div>

      {/* ── Zoom + Locate + Track controls ── */}
      <div className="absolute bottom-32 md:bottom-8 right-4 md:right-8 flex flex-col gap-2 z-10">
        <div className="flex flex-col rounded-lg bg-[#281e1b]/95 backdrop-blur-sm shadow-lg border border-[#3a2c27] overflow-hidden">
          <button onClick={() => { setZoomCmd('in');  setTimeout(() => setZoomCmd(null), 150); }} className="p-2 hover:bg-[#3a2c27] text-white border-b border-[#3a2c27] transition-colors">
            <span className="material-symbols-outlined block">add</span>
          </button>
          <button onClick={() => { setZoomCmd('out'); setTimeout(() => setZoomCmd(null), 150); }} className="p-2 hover:bg-[#3a2c27] text-white transition-colors">
            <span className="material-symbols-outlined block">remove</span>
          </button>
        </div>

        {/* Locate Me */}
        <button
          onClick={handleLocateMe}
          disabled={locating}
          className={`p-2 rounded-lg text-white shadow-lg transition-all flex items-center justify-center
            ${locating ? 'bg-primary/50 cursor-wait animate-pulse' : 'bg-primary hover:bg-[#e55a2b] shadow-primary/20'}`}
          title="Locate Me"
        >
          <span className="material-symbols-outlined">{locating ? 'gps_not_fixed' : 'my_location'}</span>
        </button>

        {/* Start / Stop Live Tracker */}
        <button
          onClick={tracking ? stopTracking : startTracking}
          className={`p-2 rounded-lg text-white shadow-lg transition-all flex items-center justify-center
            ${tracking ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 animate-pulse' : 'bg-[#281e1b] border border-[#3a2c27] hover:bg-[#3a2c27]'}`}
          title={tracking ? 'Stop Live Tracking' : 'Start Live Tracking'}
        >
          <span className="material-symbols-outlined">{tracking ? 'stop_circle' : 'radio_button_checked'}</span>
        </button>
      </div>

      {/* ── Active Delivery Card ── */}
      <div className="absolute bottom-8 left-4 right-4 md:left-8 md:right-auto md:w-80 bg-[#281e1b]/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-[#3a2c27] z-10">
        {isLoading ? (
          <div className="flex items-center gap-2 text-[#bca39a] text-sm animate-pulse">
            <span className="material-symbols-outlined text-sm">sync</span> Loading live mission…
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-white font-bold text-sm">Active Delivery</h4>
                  {activeRoute.status && (
                    <span className="bg-orange-500/15 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      {activeRoute.status}
                    </span>
                  )}
                </div>
                <p className="text-[#bca39a] text-xs truncate">{activeRoute.pickup.name} ➔ {activeRoute.dropoff.name}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#3a2c27] rounded-lg p-2 text-center">
                <p className="text-white font-black text-sm">{distKm ?? '…'}</p>
                <p className="text-[#bca39a] text-[10px] uppercase tracking-wide font-medium mt-0.5">km</p>
              </div>
              <div className="bg-[#3a2c27] rounded-lg p-2 text-center">
                <p className="text-white font-black text-sm">{fmtDur(routeDuration)}</p>
                <p className="text-[#bca39a] text-[10px] uppercase tracking-wide font-medium mt-0.5">ETA</p>
              </div>
              <div className={`rounded-lg p-2 text-center ${tracking ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-[#3a2c27]'}`}>
                <p className={`font-black text-sm ${tracking ? 'text-orange-400' : 'text-white'}`}>{displaySpeed}</p>
                <p className={`text-[10px] uppercase tracking-wide font-medium mt-0.5 ${tracking ? 'text-orange-400' : 'text-[#bca39a]'}`}>km/h</p>
              </div>
            </div>

            {/* Tracking CTA */}
            {!tracking ? (
              <button
                onClick={startTracking}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-700 text-white font-bold text-xs py-2 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">radio_button_checked</span>
                Start Live Tracking
              </button>
            ) : (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2">
                  <span className="size-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-orange-400 text-xs font-bold">LIVE</span>
                  <span className="text-[#bca39a] text-xs ml-1">Tracking active</span>
                </div>
                <button
                  onClick={stopTracking}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">stop</span>
                </button>
              </div>
            )}

            {activeRoute.pickupCode && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[#bca39a] text-xs">Pickup PIN:</span>
                <span className="ml-auto bg-[#3a2c27] text-[#bca39a] font-mono text-xs px-2 py-0.5 rounded font-bold">{activeRoute.pickupCode}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
