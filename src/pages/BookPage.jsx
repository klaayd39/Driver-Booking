import MapView from '../components/MapView';
import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { DRIVERS, TRIP_TYPES } from '../context/AppContext';
import {
  Chip,
  Input,
  SectionLabel,
  Card,
  Button,
} from '../components/UI';
import DriverCard from '../components/DriverCard';
import BookingModal from '../components/BookingModal';
import { useApp } from '../context/AppContext';

export default function BookPage() {
  const { addBooking, showNotification } = useApp();

  const [tripType, setTripType] = useState(TRIP_TYPES[0]);
  const [pickup, setPickup] = useState(
    'Maria Cristina St, Zamboanga City'
  );
  const [destination, setDestination] = useState('');
  const [searched, setSearched] = useState(false);
  const [bookingDriver, setBookingDriver] = useState(null);

  const availableDrivers = DRIVERS.filter(
    (driver) => driver.status !== 'offline'
  );

  const handleSearch = () => {
    setSearched(true);
  };

  const handleConfirm = (bookingData) => {
    addBooking(bookingData);

    setBookingDriver(null);

    showNotification(
      `Booking confirmed with ${
        DRIVERS.find((d) => d.id === bookingData.driverId)?.name
      }! 🎉`
    );
  };

  return (
   <div style={{ padding: '16px', maxWidth: '100%', animation: 'fadeUp 0.3s ease', overflowX: 'hidden' }}>
      {/* Hero */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#3a7fc1',
            marginBottom: 6,
          }}
        >
          Zamboanga City
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: '#1c1a17',
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          Need a driver
          <br />
          <em>for your own car?</em>
        </h2>

        <p
          style={{
            fontSize: 14,
            color: '#9c9890',
          }}
        >
          Book a verified local driver — by the hour or full day.
        </p>
      </div>

      {/* Trip Types */}
      <SectionLabel>What do you need?</SectionLabel>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 20,
        }}
        className="stagger"
      >
        {TRIP_TYPES.map((type) => (
          <Chip
            key={type}
            label={type}
            selected={tripType === type}
            onClick={() => setTripType(type)}
          />
        ))}
      </div>

      {/* Location Card */}
      <Card
        style={{
          padding: '18px',
          marginBottom: 20,
        }}
      >
        {/* Leaflet Map */}
        <div
          style={{
            height: 240,
            marginBottom: 16,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #e4e1d8',
          }}
        >
          <MapView
            onPickupSelect={(address) => setPickup(address)}
          />
        </div>

        <Input
          label="Pickup location"
          value={pickup}
          onChange={setPickup}
          placeholder="Your address"
          icon={<MapPin size={14} />}
        />

        <Input
          label="Destination (optional)"
          value={destination}
          onChange={setDestination}
          placeholder="Where to?"
          icon={<MapPin size={14} />}
        />

        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon={<Search size={16} />}
          onClick={handleSearch}
        >
          Find Available Drivers
        </Button>
      </Card>

      {/* Search Results */}
      {searched ? (
        <div className="animate-fadeUp">
          <SectionLabel style={{ marginBottom: 12 }}>
            {availableDrivers.length} drivers available near you
          </SectionLabel>

          <div className="stagger">
            {availableDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onBook={setBookingDriver}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <SectionLabel>Nearby drivers</SectionLabel>

          <Card
            style={{
              padding: '4px 16px',
            }}
          >
            {DRIVERS.filter(
              (driver) => driver.status === 'online'
            )
              .slice(0, 3)
              .map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  onBook={setBookingDriver}
                  compact
                />
              ))}
          </Card>
        </>
      )}

      {/* Booking Modal */}
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