import { useState } from 'react';
import { MapPin, MessageCircle, Navigation, X, Star } from 'lucide-react';
import { useApp, DRIVERS } from '../context/AppContext';
import { Card, Avatar, Badge, Button, Divider, SectionLabel, EmptyState } from '../components/UI';

function BookingCard({ booking, onCancel, onReview }) {
  const driver = DRIVERS.find(d => d.id === booking.driverId);
  if (!driver) return null;

  const statusVariant = { confirmed: 'blue', completed: 'green', cancelled: 'gray', inprogress: 'amber' };
  const statusLabel = { confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled', inprogress: 'In Progress' };

  return (
    <Card style={{ marginBottom: 12 }} className="animate-fadeUp">
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar initials={driver.initials} color={driver.color} bg={driver.bg} size={44} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{driver.name}</div>
              <div style={{ fontSize: 12, color: '#9c9890', marginTop: 2 }}>{booking.type} · {booking.date} · {booking.time}</div>
            </div>
          </div>
          <Badge variant={statusVariant[booking.status]}>{statusLabel[booking.status]}</Badge>
        </div>

        <div style={{ margin: '14px 0', padding: '12px', background: '#f9f8f6', borderRadius: 10, border: '1px solid #eae8e2' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#4a4740' }}>
            <MapPin size={14} style={{ marginTop: 1, flexShrink: 0, color: '#1a5c9a' }} />
            <div>
              <div>{booking.pickup}</div>
              {booking.destination !== 'TBD' && (
                <div style={{ color: '#9c9890', marginTop: 2 }}>→ {booking.destination}</div>
              )}
            </div>
          </div>
          <Divider margin="10px 0" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#9c9890' }}>{booking.duration}</span>
            <span style={{ fontWeight: 600, color: '#1c1a17' }}>₱{booking.fare?.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {booking.status === 'confirmed' && (
            <>
              <Button variant="secondary" size="sm" icon={<MessageCircle size={14} />}>Chat</Button>
              <Button variant="secondary" size="sm" icon={<Navigation size={14} />}>Track</Button>
              <Button variant="danger" size="sm" icon={<X size={14} />} onClick={() => onCancel(booking.id)}>Cancel</Button>
            </>
          )}
          {booking.status === 'completed' && (
            <Button variant="outline" size="sm" icon={<Star size={14} />} onClick={() => onReview(booking)}>
              Leave a Review
            </Button>
          )}
          {booking.status === 'cancelled' && (
            <span style={{ fontSize: 13, color: '#9c9890' }}>This booking was cancelled.</span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function BookingsPage() {
  const { bookings, cancelBooking, showNotification } = useApp();
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const upcoming = bookings.filter(b => b.status === 'confirmed');
  const past = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const handleCancel = (id) => {
    cancelBooking(id);
    showNotification('Booking cancelled.', 'info');
  };

  const handleSubmitReview = () => {
    setReviewBooking(null);
    showNotification('Review submitted! Thank you. ⭐');
    setRating(5);
    setReviewText('');
  };

  return (
    <div style={{ padding: '24px', maxWidth: 600, animation: 'fadeUp 0.3s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#1c1a17', marginBottom: 4 }}>My Trips</h2>
        <p style={{ fontSize: 14, color: '#9c9890' }}>Manage your driver bookings.</p>
      </div>

      <SectionLabel>Upcoming ({upcoming.length})</SectionLabel>
      {upcoming.length === 0 ? (
        <EmptyState icon="🗓️" title="No upcoming bookings" subtitle="Book a driver from the Book page." />
      ) : (
        <div className="stagger">
          {upcoming.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} onReview={setReviewBooking} />)}
        </div>
      )}

      {past.length > 0 && (
        <>
          <SectionLabel style={{ marginTop: 24 }}>Past trips ({past.length})</SectionLabel>
          <div className="stagger">
            {past.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} onReview={setReviewBooking} />)}
          </div>
        </>
      )}

      {/* Review modal */}
      {reviewBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 20, animation: 'fadeIn 0.2s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setReviewBooking(null); }}
        >
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400, padding: '24px', animation: 'fadeUp 0.25s ease' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>Leave a Review</div>
            <div style={{ fontSize: 13, color: '#9c9890', marginBottom: 20 }}>
              {DRIVERS.find(d => d.id === reviewBooking.driverId)?.name} · {reviewBooking.type}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 28 }}>
                  {n <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Tell others about your experience…"
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-sans)', resize: 'none', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="outline" fullWidth onClick={() => setReviewBooking(null)}>Cancel</Button>
              <Button variant="primary" fullWidth onClick={handleSubmitReview}>Submit Review</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
