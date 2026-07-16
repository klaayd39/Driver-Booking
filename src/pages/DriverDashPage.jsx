import { useState } from 'react';
import { TrendingUp, Clock, Star, DollarSign, Shield, BadgeCheck, FileText, ToggleLeft, ToggleRight, Check, X, MessageCircle } from 'lucide-react';
import { useApp, DRIVERS } from '../context/AppContext';
import { Avatar, Card, Badge, Button, SectionLabel, Divider, VerifyRow, StarRating } from '../components/UI';
import BookingAlert from '../components/BookingAlert';

export default function DriverDashPage() {
  const { driverOnline, setDriverOnline, showNotification } = useApp();
  const DRIVER_ID = '5fcecda4-f7c8-426b-8261-2ace5275e3d9';
  const driver = DRIVERS[0];

  const stats = [
    { label: 'Trips this month', value: '14', icon: <TrendingUp size={18} />, color: '#1a5c9a' },
    { label: 'Earnings (₱)', value: '9,400', icon: <DollarSign size={18} />, color: '#1e9e6e' },
    { label: 'Avg rating', value: '4.9', icon: <Star size={18} />, color: '#f4a942' },
    { label: 'Hours online', value: '38', icon: <Clock size={18} />, color: '#533ab7' },
  ];

  return (
    <div style={{ padding: '16px', maxWidth: '100%', animation: 'fadeUp 0.3s ease', overflowX: 'hidden' }}>

      {/* Driver header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={driver.initials} color={driver.color} bg={driver.bg} size={52} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{driver.name}</div>
            <StarRating rating={driver.rating} />
          </div>
        </div>
        <button
          onClick={() => {
            setDriverOnline(!driverOnline);
            showNotification(
              driverOnline ? 'You are now offline.' : 'You are now online! 🟢',
              driverOnline ? 'info' : 'success'
            );
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 16px', borderRadius: 12,
            border: `1.5px solid ${driverOnline ? '#1e9e6e' : '#cbc7bb'}`,
            background: driverOnline ? '#e2f7ef' : '#f9f8f6',
            color: driverOnline ? '#0f6e56' : '#6b6760',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
            fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
          }}
        >
          {driverOnline ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          {driverOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #eae8e2',
            borderRadius: 14, padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: s.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color,
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 12, color: '#9c9890', fontWeight: 500 }}>{s.label}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1c1a17' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Profile verification */}
      <SectionLabel>Profile verification</SectionLabel>
      <Card style={{ padding: '8px 18px', marginBottom: 20 }}>
        <VerifyRow label="Driver's license" icon={<BadgeCheck size={16} />} status="verified" />
        <VerifyRow label="NBI clearance" icon={<FileText size={16} />} status="verified" />
        <VerifyRow label="Identity check" icon={<Shield size={16} />} status="pending" />
      </Card>

      {/* Earnings breakdown */}
      <SectionLabel>This week</SectionLabel>
      <Card style={{ padding: '16px 18px' }}>
        {[
          { day: 'Monday', trips: 2, earned: 900 },
          { day: 'Tuesday', trips: 3, earned: 1350 },
          { day: 'Wednesday', trips: 1, earned: 450 },
          { day: 'Thursday', trips: 4, earned: 2100 },
        ].map(({ day, trips, earned }) => (
          <div key={day} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #f5f4f0',
            fontSize: 14,
          }}>
            <span style={{ color: '#4a4740' }}>{day}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: '#9c9890', fontSize: 12 }}>
                {trips} trip{trips !== 1 ? 's' : ''}
              </span>
              <span style={{ fontWeight: 600, color: '#1e9e6e' }}>
                ₱{earned.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: '#1e9e6e' }}>₱4,800</span>
        </div>
      </Card>

      {/* Booking Alert — pops up when customer books */}
      <BookingAlert
        driverId={DRIVER_ID}
        onAccept={(booking) => showNotification(`Booking accepted! ₱${booking.fare} 🚗`)}
        onDecline={() => showNotification('Booking declined.', 'info')}
      />

    </div>
  );
}