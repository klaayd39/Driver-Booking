import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Clock, DollarSign, Check, X } from 'lucide-react';
import { Avatar, Button } from './UI';

export default function BookingAlert({ driverId, onAccept, onDecline }) {
  const [pendingBooking, setPendingBooking] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!driverId) return;

    // Listen for new bookings in real-time
    const channel = supabase
      .channel('new-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `driver_id=eq.${driverId}`,
        },
        (payload) => {
          setPendingBooking(payload.new);
          setVisible(true);
        }
      )
      .subscribe();

    // Also check for existing pending bookings
    const fetchPending = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('driver_id', driverId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setPendingBooking(data[0]);
        setVisible(true);
      }
    };
    fetchPending();

    return () => supabase.removeChannel(channel);
  }, [driverId]);

  const handleAccept = async () => {
    await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', pendingBooking.id);
    setVisible(false);
    onAccept && onAccept(pendingBooking);
  };

  const handleDecline = async () => {
    await supabase
      .from('bookings')
      .update({ status: 'declined' })
      .eq('id', pendingBooking.id);
    setVisible(false);
    onDecline && onDecline();
  };

  if (!visible || !pendingBooking) return null;

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 999,
      width: 320, background: '#fff',
      borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      border: '2px solid #1a5c9a',
      animation: 'fadeUp 0.3s ease',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: '#1a5c9a', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: '#4ade80', animation: 'pulse 1.5s infinite',
        }} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
          New Booking Request!
        </span>
      </div>

      {/* Booking details */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#e8f1fb', color: '#1a5c9a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16,
          }}>
            {pendingBooking.customer_name?.charAt(0) || 'C'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {pendingBooking.customer_name || 'Customer'}
            </div>
            <div style={{ fontSize: 12, color: '#9c9890' }}>
              {pendingBooking.trip_type}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#1a5c9a' }}>
              ₱{pendingBooking.fare?.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: '#9c9890' }}>
              {pendingBooking.duration}
            </div>
          </div>
        </div>

        {/* Trip info */}
        <div style={{
          background: '#f9f8f6', borderRadius: 10,
          padding: '10px 12px', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#4a4740', marginBottom: 6 }}>
            <MapPin size={14} style={{ flexShrink: 0, marginTop: 1, color: '#1e9e6e' }} />
            <span>{pendingBooking.pickup}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#4a4740', marginBottom: 6 }}>
            <MapPin size={14} style={{ flexShrink: 0, marginTop: 1, color: '#d63b3b' }} />
            <span>{pendingBooking.destination}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#4a4740' }}>
            <Clock size={14} style={{ flexShrink: 0, marginTop: 1, color: '#6b6760' }} />
            <span>{pendingBooking.date} · {pendingBooking.time}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleDecline}
            style={{
              flex: 1, padding: '10px', borderRadius: 10,
              border: '1px solid #e4e1d8', background: '#fff',
              color: '#d63b3b', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <X size={16} /> Decline
          </button>
          <button
            onClick={handleAccept}
            style={{
              flex: 2, padding: '10px', borderRadius: 10,
              border: 'none', background: '#1e9e6e',
              color: '#fff', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Check size={16} /> Accept
          </button>
        </div>
      </div>
    </div>
  );
}