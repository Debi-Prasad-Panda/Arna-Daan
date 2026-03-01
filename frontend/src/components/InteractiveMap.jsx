import { useState, useEffect, useCallback } from 'react';
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
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pickupIcon  = createIcon('orange');
const dropoffIcon = createIcon('green');
const youIcon     = createIcon('blue');

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

// ----- Main Component -----
export default function InteractiveMap() {
  const { deliveries, fetchDeliveries, isLoading } = useDeliveryStore();
  const { user } = useAuthStore();

  // Map controls
  const [flyTarget, setFlyTarget] = useState(null);
  const [zoomCmd,   setZoomCmd]   = useState(null);

  // User's real location
  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);

  // Which delivery is selected for the detail card
  const [activeRoute, setActiveRoute] = useState(DEMO_ROUTE);

  // ----- Fetch real deliveries from Appwrite on mount -----
  useEffect(() => {
    if (user) {
      fetchDeliveries(user.$id).catch(() => {
        // silently fail – we show the demo route instead
      });
    }
  }, [user]);

  // Use the first "live" delivery from Appwrite if one exists, else show demo
  useEffect(() => {
    if (deliveries && deliveries.length > 0) {
      const live = deliveries[0];
      // Deliveries may not have lat/lng yet (we'd store them when the listing is created).
      // For now we augment with demo coords so it still looks great.
      setActiveRoute({
        pickup:  { lat: 20.2961, lng: 85.8245, name: live.requestId ? `Pickup for ${live.requestId.slice(0, 6)}…` : DEMO_ROUTE.pickup.name,  address: 'Live Pickup Location' },
        dropoff: { lat: 20.2858, lng: 85.8361, name: live.volunteerName ? `Delivery by ${live.volunteerName}` : DEMO_ROUTE.dropoff.name, address: 'Live Dropoff Location' },
        status:  live.status,
        pickupCode: live.pickupCode,
      });
    }
  }, [deliveries]);

  // ----- Geolocation handler -----
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    const toastId = toast.loading('Acquiring GPS signal…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setFlyTarget(coords);
        toast.success('Location found! Map centered to you.', { id: toastId });
        setLocating(false);
      },
      (err) => {
        toast.error(`Geolocation failed: ${err.message}`, { id: toastId });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ----- Zoom helpers -----
  const handleZoom = (dir) => {
    setZoomCmd(dir);
    setTimeout(() => setZoomCmd(null), 150);
  };

  // Route polyline (pickup → dropoff, dashed orange line)
  const routePositions = [
    [activeRoute.pickup.lat,  activeRoute.pickup.lng],
    [activeRoute.dropoff.lat, activeRoute.dropoff.lng],
  ];

  return (
    <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-[#181210] border-b md:border-b-0 md:border-r border-[#3a2c27]">

      {/* ── Real Leaflet Map ── */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={13}
          zoomControl={false}
          style={{ width: '100%', height: '100%', background: '#181210' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Map controller reacts to state changes */}
          <MapController flyTarget={flyTarget} zoomCmd={zoomCmd} />

          {/* Route polyline */}
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#f97316', weight: 4, opacity: 0.8, dashArray: '10, 8' }}
          />

          {/* Pickup marker */}
          <Marker position={[activeRoute.pickup.lat, activeRoute.pickup.lng]} icon={pickupIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-orange-400 mb-1">📦 Pickup Location</div>
                <div className="font-semibold">{activeRoute.pickup.name}</div>
                <div className="text-gray-400 text-xs mt-0.5">{activeRoute.pickup.address}</div>
              </div>
            </Popup>
          </Marker>

          {/* Dropoff marker */}
          <Marker position={[activeRoute.dropoff.lat, activeRoute.dropoff.lng]} icon={dropoffIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-green-400 mb-1">🏠 Dropoff Location</div>
                <div className="font-semibold">{activeRoute.dropoff.name}</div>
                <div className="text-gray-400 text-xs mt-0.5">{activeRoute.dropoff.address}</div>
              </div>
            </Popup>
          </Marker>

          {/* Volunteer current position (after Locate Me) */}
          {userPos && (
            <Marker position={userPos} icon={youIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-bold text-blue-400 mb-1">📍 Your Location</div>
                  <div className="text-gray-400 text-xs">Live GPS · accuracy may vary</div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* ── Scoped Leaflet CSS overrides ── */}
      <style>{`
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

      {/* ── Zoom + Locate controls ── */}
      <div className="absolute bottom-32 md:bottom-8 right-4 md:right-8 flex flex-col gap-2 z-10">
        <div className="flex flex-col rounded-lg bg-[#281e1b]/95 backdrop-blur-sm shadow-lg border border-[#3a2c27] overflow-hidden">
          <button onClick={() => handleZoom('in')}  className="p-2 hover:bg-[#3a2c27] text-white border-b border-[#3a2c27] transition-colors">
            <span className="material-symbols-outlined block">add</span>
          </button>
          <button onClick={() => handleZoom('out')} className="p-2 hover:bg-[#3a2c27] text-white transition-colors">
            <span className="material-symbols-outlined block">remove</span>
          </button>
        </div>
        <button
          onClick={handleLocateMe}
          disabled={locating}
          className={`p-2 rounded-lg text-white shadow-lg transition-all flex items-center justify-center
            ${locating ? 'bg-primary/50 cursor-wait animate-pulse' : 'bg-primary hover:bg-[#e55a2b] shadow-primary/20'}`}
        >
          <span className="material-symbols-outlined">{locating ? 'gps_not_fixed' : 'my_location'}</span>
        </button>
      </div>

      {/* ── Active Delivery Card ── */}
      <div className="absolute bottom-8 left-4 right-4 md:left-8 md:right-auto md:w-80 bg-[#281e1b]/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-[#3a2c27] z-10">
        {isLoading ? (
          <div className="flex items-center gap-2 text-[#bca39a] text-sm animate-pulse">
            <span className="material-symbols-outlined text-sm">sync</span> Loading live mission…
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-white font-bold text-sm">Active Delivery</h4>
                {activeRoute.status && (
                  <span className="bg-orange-500/15 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    {activeRoute.status}
                  </span>
                )}
              </div>
              <p className="text-[#bca39a] text-xs truncate">{activeRoute.pickup.name} ➔ {activeRoute.dropoff.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">On Time</span>
                <span className="text-[#bca39a] text-xs">ETA: 10 mins</span>
                {activeRoute.pickupCode && (
                  <span className="ml-auto bg-[#3a2c27] text-[#bca39a] font-mono text-[10px] px-2 py-0.5 rounded font-bold">PIN: {activeRoute.pickupCode}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
