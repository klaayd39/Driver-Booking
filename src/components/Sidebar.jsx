import { MapPin, Users, CalendarDays, Gauge, User, Settings, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS_CUSTOMER = [
  { id: 'book', icon: MapPin, label: 'Book' },
  { id: 'drivers', icon: Users, label: 'Drivers' },
  { id: 'bookings', icon: CalendarDays, label: 'My Trips' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const NAV_ITEMS_DRIVER = [
  { id: 'driver-dash', icon: Gauge, label: 'Dashboard' },
  { id: 'driver-bookings', icon: CalendarDays, label: 'Bookings' },
  { id: 'driver-profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { mode } = useApp();
  const items = mode === 'customer' ? NAV_ITEMS_CUSTOMER : NAV_ITEMS_DRIVER;

  return (
    <nav style={{
      width: 72, background: '#fff', borderRight: '1px solid #eae8e2',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '16px 0', gap: 4, flexShrink: 0,
      boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 16, padding: '8px 0' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12, background: '#1a5c9a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Car size={20} color="#fff" />
        </div>
      </div>

      {items.map(({ id, icon: Icon, label }) => {
        const active = activePage === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            title={label}
            style={{
              width: 48, height: 48, borderRadius: 14, border: 'none',
              background: active ? '#1a5c9a' : 'transparent',
              color: active ? '#fff' : '#9c9890',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', gap: 3,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f1efe9'; e.currentTarget.style.color = '#2e2c28'; }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9c9890'; }}}
          >
            <Icon size={20} />
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</span>
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      <button
        onClick={() => onNavigate('settings')}
        title="Settings"
        style={{
          width: 48, height: 48, borderRadius: 14, border: 'none',
          background: activePage === 'settings' ? '#1a5c9a' : 'transparent',
          color: activePage === 'settings' ? '#fff' : '#9c9890',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (activePage !== 'settings') { e.currentTarget.style.background = '#f1efe9'; e.currentTarget.style.color = '#2e2c28'; }}}
        onMouseLeave={e => { if (activePage !== 'settings') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9c9890'; }}}
      >
        <Settings size={20} />
      </button>
    </nav>
  );
}
