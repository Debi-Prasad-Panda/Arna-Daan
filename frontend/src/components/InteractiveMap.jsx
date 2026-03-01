import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons not showing up out-of-the-box in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Markers
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map interactions like "Locate Me" or flying to routes
function MapController({ center, zoomCmd }) {
  const map = useMap();
  
  if (zoomCmd === 'in') map.zoomIn();
  if (zoomCmd === 'out') map.zoomOut();
  if (center) map.flyTo(center, 14);

  return null;
}

export default function InteractiveMap() {
  // Dummy data for the active route demonstration
  const [route] = useState({
    pickup: { lat: 20.2961, lng: 85.8245, name: "City Hospital Canteen" },
    dropoff: { lat: 20.2858, lng: 85.8361, name: "Hope Orphanage" }
  });

  const [mapCenter, setMapCenter] = useState([20.2910, 85.8300]); // Center roughly between pickup and dropoff
  const [zoomCmd, setZoomCmd] = useState(null);

  const handleLocateMe = () => {
    // In a real app, you'd use navigator.geolocation here
    toast.success('Location centered to current GPS coordinates');
    setMapCenter([20.2910, 85.8300]); 
  };

  const handleZoom = (direction) => {
    setZoomCmd(direction);
    setTimeout(() => setZoomCmd(null), 100);
  };

  return (
    <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-[#181210] border-b md:border-b-0 md:border-r border-[#3a2c27]">
      
      {/* Real Interactive Leaflet Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          zoomControl={false}
          style={{ width: '100%', height: '100%', background: '#181210' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Beautiful dark theme map tiles
          />
          
          {/* Controllers */}
          <MapController center={mapCenter} zoomCmd={zoomCmd} />

          {/* Pickup Marker */}
          <Marker position={[route.pickup.lat, route.pickup.lng]} icon={pickupIcon}>
            <Popup className="custom-popup">
              <div className="font-bold text-[#e55a2b]">Pickup Location</div>
              <div>{route.pickup.name}</div>
            </Popup>
          </Marker>

          {/* Dropoff Marker */}
          <Marker position={[route.dropoff.lat, route.dropoff.lng]} icon={dropoffIcon}>
            <Popup className="custom-popup">
              <div className="font-bold text-green-500">Dropoff Location</div>
              <div>{route.dropoff.name}</div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Scoped styles for leaflet to match app theme */}
      <style>{`
        .leaflet-container {
          background-color: #181210 !important;
        }
        .leaflet-popup-content-wrapper {
          background-color: #281e1b !important;
          color: white !important;
          border: 1px solid #3a2c27 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip {
          background-color: #281e1b !important;
        }
        .leaflet-popup-close-button {
          color: #bca39a !important;
        }
      `}</style>

      {/* Map Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 md:w-96 flex flex-col gap-4 z-10">
        {/* Search Bar */}
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
      
      {/* Map Controls (Zoom/Locate) */}
      <div className="absolute bottom-32 md:bottom-8 right-4 md:right-8 flex flex-col gap-2 z-10">
        <div className="flex flex-col rounded-lg bg-[#281e1b]/95 backdrop-blur-sm shadow-lg border border-[#3a2c27] overflow-hidden">
          <button 
            onClick={() => handleZoom('in')}
            className="p-2 hover:bg-[#3a2c27] text-white border-b border-[#3a2c27] transition-colors"
          >
            <span className="material-symbols-outlined block">add</span>
          </button>
          <button 
            onClick={() => handleZoom('out')}
            className="p-2 hover:bg-[#3a2c27] text-white transition-colors"
          >
            <span className="material-symbols-outlined block">remove</span>
          </button>
        </div>
        <button 
          onClick={handleLocateMe}
          className="p-2 rounded-lg bg-primary text-white shadow-lg shadow-primary/20 hover:bg-[#e55a2b] transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {/* Active Route Card Overlay on Map */}
      <div className="absolute bottom-8 left-4 right-4 md:left-8 md:right-auto md:w-80 bg-[#281e1b]/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-[#3a2c27] z-10">
        <div className="flex items-start gap-3">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Active Delivery</h4>
            <p className="text-[#bca39a] text-xs mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {route.pickup.name} ➔ {route.dropoff.name}
            </p>
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
