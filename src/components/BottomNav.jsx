import { MapPin, Users, CalendarDays, User, Gauge } from 'lucide-react';

const NAV_CUSTOMER = [
  { id: 'book', icon: MapPin, label: 'Book' },
  { id: 'drivers', icon: Users, label: 'Drivers' },
  { id: 'bookings', icon: CalendarDays, label: 'Trips' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const NAV_DRIVER = [
  { id: 'driver-dash', icon: Gauge, label: 'Dashboard' },
  { id: 'driver-bookings', icon: CalendarDays, label: 'Bookings' },
  { id: 'driver-profile', icon: User, label: 'Profile' },
];

export default function BottomNav({ role, activePage, onNavigate }) {
  const items = role === 'driver' ? NAV_DRIVER : NAV_CUSTOMER;

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #E8E0C8',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      paddingTop: 8,
      paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      zIndex: 100,
      boxShadow: '0 -4px 16px rgba(27,67,50,0.1)',
    }}>
      {items.map(({ id, icon: Icon, label }) => {
        const active = activePage === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '4px 16px', border: 'none', background: 'none',
              color: active ? '#1B4332' : '#9C9484', cursor: 'pointer',
              transition: 'color 0.15s', minWidth: 60,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 500,
              fontFamily: 'var(--font-sans)',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}