import { useState } from 'react';
import { MapPin, MessageCircle, Check, X } from 'lucide-react';
import { useApp, DRIVERS } from '../context/AppContext';
import { Avatar, Card, Badge, Button, SectionLabel, EmptyState } from '../components/UI';

const DRIVER_BOOKINGS = [
  { id: 'DB001', customer: 'Maria Vizcarra', initials: 'MV', color: '#854f0b', bg: '#faeeda', type: 'Designated driver', date: 'Tonight', time: '9:00 PM', duration: '2 hours', pickup: 'Canelar, Zamboanga City', destination: 'Maria Cristina St', fare: 450, status: 'confirmed' },
  { id: 'DB002', customer: 'Ramon Guzman', initials: 'RG', color: '#533ab7', bg: '#eeedfe', type: 'Long trip', date: 'June 5', time: '6:00 AM', duration: 'Full day', pickup: 'Zamboanga City', destination: 'Davao City', fare: 2800, status: 'confirmed' },
  { id: 'DB003', customer: 'Linda Tan', initials: 'LT', color: '#0f6e56', bg: '#e1f5ee', type: 'Elderly care', date: 'May 30', time: '10:00 AM', duration: '3 hours', pickup: 'Talon-Talon', destination: 'Zamboanga Medical Center', fare: 700, status: 'completed' },
];

export default function DriverBookingsPage() {
  const { showNotification } = useApp();
  const [bookings, setBookings] = useState(DRIVER_BOOKINGS);

  const cancel = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    showNotification('Booking cancelled.', 'info');
  };

  const complete = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'completed' } : b));
    showNotification('Trip marked as completed! ✅');
  };

  const upcoming = bookings.filter(b => b.status === 'confirmed');
  const past = bookings.filter(b => b.status !== 'confirmed');

  return (
    <div style={{ padding: '16px', maxWidth: '100%', animation: 'fadeUp 0.3s ease', overflowX: 'hidden' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#1c1a17', marginBottom: 4 }}>My Bookings</h2>
        <p style={{ fontSize: 14, color: '#9c9890' }}>Manage your upcoming and past trips.</p>
      </div>

      <SectionLabel>Upcoming ({upcoming.length})</SectionLabel>
      {upcoming.length === 0 ? (
        <EmptyState icon="📅" title="No upcoming bookings" subtitle="New bookings will appear on your dashboard." />
      ) : (
        upcoming.map(b => (
          <Card key={b.id} style={{ marginBottom: 12, padding: '16px 18px' }} className="animate-fadeUp">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <Avatar initials={b.initials} color={b.color} bg={b.bg} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{b.customer}</div>
                <div style={{ fontSize: 12, color: '#9c9890', marginTop: 2 }}>{b.type} · {b.date} · {b.time}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#1a5c9a', fontSize: 16 }}>₱{b.fare.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: '#9c9890' }}>{b.duration}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#6b6760', background: '#f9f8f6', borderRadius: 8, padding: '9px 12px', marginBottom: 12, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <MapPin size={13} style={{ marginTop: 1, flexShrink: 0, color: '#1a5c9a' }} />
              <span>{b.pickup} → {b.destination}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" size="sm" icon={<MessageCircle size={14} />}>Chat</Button>
              <Button variant="success" size="sm" icon={<Check size={14} />} onClick={() => complete(b.id)}>Mark complete</Button>
              <Button variant="danger" size="sm" icon={<X size={14} />} onClick={() => cancel(b.id)}>Cancel</Button>
            </div>
          </Card>
        ))
      )}

      {past.length > 0 && (
        <>
          <SectionLabel style={{ marginTop: 24 }}>History ({past.length})</SectionLabel>
          {past.map(b => (
            <Card key={b.id} style={{ marginBottom: 10, padding: '14px 18px', opacity: 0.8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={b.initials} color={b.color} bg={b.bg} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{b.customer}</div>
                  <div style={{ fontSize: 12, color: '#9c9890' }}>{b.type} · {b.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge variant={b.status === 'completed' ? 'green' : 'gray'}>{b.status}</Badge>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>₱{b.fare.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
