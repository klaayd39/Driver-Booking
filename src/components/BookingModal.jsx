import { useState } from 'react';
import { X, MapPin, Clock, Calendar, Car } from 'lucide-react';
import { Avatar, Button, Input, Select, Chip, Card } from './UI';
import { TRIP_TYPES } from '../context/AppContext';
import { useApp } from '../context/AppContext';

export default function BookingModal({ driver, onClose, onConfirm }) {
  const { showNotification } = useApp();
  const [tripType, setTripType] = useState(TRIP_TYPES[0]);
  const [pickup, setPickup] = useState('Maria Cristina St, Zamboanga City');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('Today, June 3');
  const [duration, setDuration] = useState('2 hours');

  const fare = { '1 hour': 300, '2 hours': 500, '4 hours': 900, 'Full day': 1600, 'Overnight': 2200 };
  const estimatedFare = fare[duration] || 500;

  const handleConfirm = () => {
    if (!pickup.trim()) { showNotification('Please enter a pickup location', 'error'); return; }
    onConfirm({
      driverId: driver.id,
      type: tripType,
      date,
      time: '9:00 PM',
      duration,
      pickup,
      destination: destination || 'TBD',
      fare: estimatedFare,
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, padding: 20, animation: 'fadeIn 0.2s ease',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'fadeUp 0.25s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid #eae8e2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar initials={driver.initials} color={driver.color} bg={driver.bg} size={44} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Book {driver.name}</div>
              <div style={{ fontSize: 12, color: '#9c9890' }}>{driver.location}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f1efe9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6760' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 22px' }}>
          {/* Trip type */}
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 8 }}>Trip type</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
            {driver.types.map(t => (
              <Chip key={t} label={t} selected={tripType === t} onClick={() => setTripType(t)} />
            ))}
          </div>

          {/* Map placeholder */}
          <div style={{
            height: 110, background: 'linear-gradient(135deg, #e8f1fb 0%, #f1efe9 100%)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6b6760', fontSize: 13, gap: 8, marginBottom: 16, border: '1px solid #e4e1d8',
          }}>
            <MapPin size={18} /> Map · Pickup & drop-off
          </div>

          <Input
            label="Pickup location"
            value={pickup}
            onChange={setPickup}
            placeholder="Enter pickup address"
            icon={<MapPin size={15} />}
          />
          <Input
            label="Destination (optional)"
            value={destination}
            onChange={setDestination}
            placeholder="Where are you going?"
            icon={<MapPin size={15} />}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select
              label="Date"
              value={date}
              onChange={setDate}
              options={['Today, June 3', 'Tomorrow, June 4', 'June 5', 'June 6', 'June 7']}
            />
            <Select
              label="Duration"
              value={duration}
              onChange={setDuration}
              options={['1 hour', '2 hours', '4 hours', 'Full day', 'Overnight']}
            />
          </div>

          {/* Fare estimate */}
          <div style={{ background: '#f9f8f6', borderRadius: 12, padding: '14px 16px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eae8e2' }}>
            <div>
              <div style={{ fontSize: 11, color: '#9c9890', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Estimated fare</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#1c1a17', marginTop: 2 }}>₱{estimatedFare.toLocaleString()}</div>
            </div>
            <div style={{ fontSize: 12, color: '#9c9890', textAlign: 'right' }}>
              <div>GCash · PayMaya</div>
              <div>Cash accepted</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" size="md" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleConfirm} style={{ flex: 2, justifyContent: 'center' }}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
