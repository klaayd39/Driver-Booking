import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons (common Leaflet issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom driver marker (blue circle with initials)
const driverIcon = (initials, status) => L.divIcon({
  html: `
    <div style="
      width: 40px; height: 40px; border-radius: 50%;
      background: ${status === 'online' ? '#1a5c9a' : '#d97b00'};
      border: 3px solid white;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 700; font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      font-family: sans-serif;
    ">${initials}</div>
  `,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Green pickup pin
const pickupIcon = L.divIcon({
  html: `
    <div style="
      width: 20px; height: 20px; border-radius: 50%;
      background: #1e9e6e; border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Fake driver positions around Zamboanga City
const DRIVERS = [
  { id: 1, name: 'Ricky Dela Cruz', initials: 'RD', status: 'online', lat: 6.9180, lng: 122.0750, rating: 4.9 },
  { id: 2, name: 'Jun Manalo', initials: 'JM', status: 'online', lat: 6.9250, lng: 122.0820, rating: 4.6 },
  { id: 3, name: 'Lorna Paterno', initials: 'LP', status: 'away', lat: 6.9150, lng: 122.0880, rating: 5.0 },
  { id: 4, name: 'Marco Reyes', initials: 'MR', status: 'online', lat: 6.9270, lng: 122.0720, rating: 4.8 },
];

const ZAMBOANGA = [6.9214, 122.0790];

// Component to handle map clicks
function ClickHandler({ onPickup }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPickup(lat, lng);
    },
  });
  return null;
}

export default function MapView({ onPickupSelect }) {
  const [pickupPos, setPickupPos] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handlePickup = async (lat, lng) => {
    setPickupPos([lat, lng]);

    // Reverse geocode using free OpenStreetMap Nominatim
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      onPickupSelect && onPickupSelect(address);
    } catch {
      onPickupSelect && onPickupSelect(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer
        center={ZAMBOANGA}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        {/* Free OpenStreetMap tiles */}
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Click to set pickup */}
        <ClickHandler onPickup={handlePickup} />

        {/* Driver markers */}
        {DRIVERS.map(driver => (
          <Marker
            key={driver.id}
            position={[driver.lat, driver.lng]}
            icon={driverIcon(driver.initials, driver.status)}
            eventHandlers={{ click: () => setSelectedDriver(driver) }}
          >
            <Popup>
              <div style={{ minWidth: 150, fontFamily: 'sans-serif' }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                  {driver.name}
                </div>
                <div style={{
                  fontSize: 12, marginBottom: 4,
                  color: driver.status === 'online' ? '#1e9e6e' : '#d97b00'
                }}>
                  ● {driver.status === 'online' ? 'Available now' : 'Away'}
                </div>
                <div style={{ fontSize: 12, color: '#6b6760', marginBottom: 8 }}>
                  ⭐ {driver.rating} rating
                </div>
                <button style={{
                  width: '100%', padding: '7px', background: '#1a5c9a',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                  Book this driver
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Pickup marker */}
        {pickupPos && (
          <Marker position={pickupPos} icon={pickupIcon}>
            <Popup>📍 Your pickup location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Hint bar */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderRadius: 99, padding: '7px 16px',
        fontSize: 12, color: '#4a4740',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        whiteSpace: 'nowrap', zIndex: 1000,
        pointerEvents: 'none',
      }}>
        📍 Tap map to set pickup · Blue = available drivers
      </div>
    </div>
  );
}