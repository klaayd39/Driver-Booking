import { Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PAGE_TITLES = {
  book: 'Book a Driver',
  drivers: 'Browse Drivers',
  bookings: 'My Trips',
  profile: 'My Profile',
  'driver-dash': 'Driver Dashboard',
  'driver-bookings': 'My Bookings',
  'driver-profile': 'Driver Profile',
  settings: 'Settings',
};

export default function TopBar({ activePage, user }) {
  const { mode, setMode } = useApp();
  const initials = (user?.user_metadata?.full_name || 'User')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="topbar" style={{
      height: 60, background: '#1B4332', borderBottom: '1px solid #143426',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      paddingLeft: 'max(16px, env(safe-area-inset-left))',
      paddingRight: 'max(16px, env(safe-area-inset-right))',
      flexShrink: 0, position: 'relative', overflow: 'hidden',
    }}>
      <div className="tribal-pattern-light" />

      <h1 className="topbar-title" style={{
        fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
        color: '#fff', position: 'relative', zIndex: 1,
      }}>
        {PAGE_TITLES[activePage] || 'DriverLink'}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
        {/* Mode toggle */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.12)', borderRadius: 10,
          padding: 3, gap: 2,
        }}>
          {['customer', 'driver'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: mode === m ? '#D4A017' : 'transparent',
                color: mode === m ? '#1A1A18' : 'rgba(255,255,255,0.65)',
                fontSize: 12, fontWeight: mode === m ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
              }}
            >
              {m === 'customer' ? '🚗 Customer' : '🚘 Driver'}
            </button>
          ))}
        </div>

        {/* Notification bell */}
        <button style={{
          width: 34, height: 34, borderRadius: 10, border: 'none',
          background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff', position: 'relative',
        }}>
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: 7, right: 7, width: 7, height: 7,
            borderRadius: '50%', background: '#C1440E', border: '1.5px solid #1B4332',
          }} />
        </button>

        {/* User avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: '#D4A017',
          color: '#1A1A18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 12, cursor: 'pointer',
        }}>
          {initials}
        </div>
      </div>
    </header>
  );
}
