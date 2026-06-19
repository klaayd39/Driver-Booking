import { MapPin, Users, CalendarDays, Gauge, User, Settings, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS_CUSTOMER = [
  { id: 'book', icon: MapPin, label: 'Book' },
  { id: 'drivers', icon: Users, label: 'Drivers' },
  { id: 'bookings', icon: CalendarDays, label: 'Trips' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const NAV_ITEMS_DRIVER = [
  { id: 'driver-dash', icon: Gauge, label: 'Stats' },
  { id: 'driver-bookings', icon: CalendarDays, label: 'Trips' },
  { id: 'driver-profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { mode } = useApp();
  const items = mode === 'customer' ? NAV_ITEMS_CUSTOMER : NAV_ITEMS_DRIVER;

  const getButtonStyle = (isActive) => ({
    width: 48, height: 48, borderRadius: 12, border: 'none',
    background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.45)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', gap: 2,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative', zIndex: 1,
  });

  return (
    <nav className="desktop-sidebar" style={{
      width: 72, background: '#1B4332', borderRight: '1px solid #143426',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '20px 0', gap: 8, flexShrink: 0,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle tribal weave texture */}
      <div className="tribal-pattern" />

      {/* Logo */}
      <div style={{ marginBottom: 12, position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: '#D4A017',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(212, 160, 23, 0.3)',
        }}>
          <Car size={22} color="#1B4332" />
        </div>
      </div>

      {items.map(({ id, icon: Icon, label }) => {
        const isActive = activePage === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            style={getButtonStyle(isActive)}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.01em', color: isActive ? '#D4A017' : 'inherit' }}>{label}</span>
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* Separator */}
      <div style={{ width: '70%', height: 1, background: 'rgba(255,255,255,0.1)', margin: '8px 0', position: 'relative', zIndex: 1 }} />

      <button
        onClick={() => onNavigate('settings')}
        style={getButtonStyle(activePage === 'settings')}
      >
        <Settings size={20} />
      </button>
    </nav>
  );
}
