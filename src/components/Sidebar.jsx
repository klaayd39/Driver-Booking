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

  // Helper for button styling to keep code DRY
  const getButtonStyle = (isActive) => ({
    width: 48, height: 48, borderRadius: 12, border: 'none',
    background: isActive ? 'rgba(26, 92, 154, 0.1)' : 'transparent',
    color: isActive ? '#1a5c9a' : '#9c9890',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', gap: 2,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  return (
    <nav style={{
      width: 72, background: '#ffffff', borderRight: '1px solid #f0eeea',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '20px 0', gap: 8, flexShrink: 0,
    }}>
      {/* Logo Container */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: '#1a5c9a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(26, 92, 154, 0.2)'
        }}>
          <Car size={22} color="#fff" />
        </div>
      </div>

      {items.map(({ id, icon: Icon, label }) => {
        const isActive = activePage === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            style={getButtonStyle(isActive)}
            className="sidebar-btn" // Add global hover styles in your CSS file
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.01em' }}>{label}</span>
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* Settings with Separator */}
      <div style={{ width: '100%', height: 1, background: '#f0eeea', margin: '8px 0' }} />
      
      <button
        onClick={() => onNavigate('settings')}
        style={getButtonStyle(activePage === 'settings')}
      >
        <Settings size={20} />
      </button>
    </nav>
  );
}