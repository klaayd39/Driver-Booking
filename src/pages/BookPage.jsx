import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { DRIVERS, TRIP_TYPES } from '../context/AppContext';
import { Chip, Input, Select, SectionLabel, Card, Button } from '../components/UI';
import DriverCard from '../components/DriverCard';
import BookingModal from '../components/BookingModal';
import { useApp } from '../context/AppContext';

export default function BookPage() {
  const { addBooking, showNotification } = useApp();
  const [tripType, setTripType] = useState(TRIP_TYPES[0]);
  const [pickup, setPickup] = useState('Maria Cristina St, Zamboanga City');
  const [destination, setDestination] = useState('');
  const [searched, setSearched] = useState(false);
  const [bookingDriver, setBookingDriver] = useState(null);

  const availableDrivers = DRIVERS.filter(d => d.status !== 'offline');

  const handleSearch = () => setSearched(true);

  const handleConfirm = (bookingData) => {
    addBooking(bookingData);
    setBookingDriver(null);
    showNotification(`Booking confirmed with ${DRIVERS.find(d => d.id === bookingData.driverId)?.name}! 🎉`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: 600, animation: 'fadeUp 0.3s ease' }}>
      {/* Hero */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#3a7fc1', marginBottom: 6 }}>Zamboanga City</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1c1a17', lineHeight: 1.2, marginBottom: 4 }}>
          Need a driver<br /><em>for your own car?</em>
        </h2>
        <p style={{ fontSize: 14, color: '#9c9890' }}>Book a verified local driver — by the hour or full day.</p>
      </div>

      {/* Trip type chips */}
      <SectionLabel>What do you need?</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }} className="stagger">
        {TRIP_TYPES.map(t => (
          <Chip key={t} label={t} selected={tripType === t} onClick={() => setTripType(t)} />
        ))}
      </div>

      {/* Location card */}
      <Card style={{ padding: '18px', marginBottom: 20 }}>
        {/* Map area */}
        <div style={{
          height: 120, background: 'linear-gradient(135deg, #e8f1fb 0%, #e2f7ef 100%)',
          borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#6b6760', fontSize: 13, gap: 8,
          border: '1px solid #e4e1d8', position: 'relative', overflow: 'hidden',
        }}>
          {/* Fake map dots */}
          {[{x:30,y:40},{x:55,y:65},{x:70,y:30},{x:45,y:75}].map((p,i) => (
            <div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: 8, height: 8, borderRadius: '50%', background: '#3a7fc1', opacity: 0.4 }} />
          ))}
          <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 7, backdropFilter: 'blur(4px)' }}>
            <MapPin size={15} color="#1a5c9a" /> Map preview · GPS enabled
          </div>
        </div>

        <Input label="Pickup location" value={pickup} onChange={setPickup} placeholder="Your address" icon={<MapPin size={14} />} />
        <Input label="Destination (optional)" value={destination} onChange={setDestination} placeholder="Where to?" icon={<MapPin size={14} />} />

        <Button variant="primary" fullWidth size="lg" icon={<Search size={16} />} onClick={handleSearch}>
          Find Available Drivers
        </Button>
      </Card>

      {/* Results */}
      {searched && (
        <div className="animate-fadeUp">
          <SectionLabel style={{ marginBottom: 12 }}>
            {availableDrivers.length} drivers available near you
          </SectionLabel>
          <div className="stagger">
            {availableDrivers.map(driver => (
              <DriverCard key={driver.id} driver={driver} onBook={setBookingDriver} />
            ))}
          </div>
        </div>
      )}

      {!searched && (
        <>
          <SectionLabel>Nearby drivers</SectionLabel>
          <Card style={{ padding: '4px 16px' }}>
            {DRIVERS.filter(d => d.status === 'online').slice(0, 3).map((driver, i) => (
              <DriverCard key={driver.id} driver={driver} onBook={setBookingDriver} compact />
            ))}
          </Card>
        </>
      )}

      {bookingDriver && (
        <BookingModal
          driver={bookingDriver}
          onClose={() => setBookingDriver(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
