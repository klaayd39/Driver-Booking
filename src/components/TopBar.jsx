import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

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

export default function TopBar({ activePage }) {
  const { mode, setMode } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
    }

    setShowMenu(false);
  };

  return (
 <header style={{
  height: 60, background: '#fff', borderBottom: '1px solid #eae8e2',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 16px',
  paddingTop: 'env(safe-area-inset-top)',
  paddingLeft: 'max(16px, env(safe-area-inset-left))',
  paddingRight: 'max(16px, env(safe-area-inset-right))',
  flexShrink: 0,
}}>
      <h1
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: '#1c1a17',
        }}
      >
        {PAGE_TITLES[activePage] || 'DriverLink'}
      </h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Mode Toggle */}
        <div
          style={{
            display: 'flex',
            background: '#f1efe9',
            borderRadius: 10,
            padding: 3,
            gap: 2,
          }}
        >
          {['customer', 'driver'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? '#1c1a17' : '#9c9890',
                fontSize: 13,
                fontWeight: mode === m ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-sans)',
                boxShadow:
                  mode === m
                    ? '0 1px 3px rgba(0,0,0,0.1)'
                    : 'none',
              }}
            >
              {m === 'customer'
                ? '🚗 Customer'
                : '🚘 Driver'}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid #eae8e2',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#6b6760',
            position: 'relative',
          }}
        >
          <Bell size={17} />

          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#d63b3b',
              border: '1.5px solid #fff',
            }}
          />
        </button>

        {/* Avatar + Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowMenu(!showMenu)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background:
                mode === 'customer'
                  ? '#e8f1fb'
                  : '#faeeda',
              color:
                mode === 'customer'
                  ? '#1a5c9a'
                  : '#854f0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {mode === 'customer' ? 'MV' : 'RD'}
          </div>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                minWidth: 150,
                background: '#fff',
                border: '1px solid #eae8e2',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                zIndex: 1000,
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#dc2626',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}