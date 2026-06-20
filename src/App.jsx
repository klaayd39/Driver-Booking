import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import { Toast } from './components/UI';
import AuthPage from './pages/AuthPage';
import { useApp } from './context/AppContext';

import BookPage from './pages/BookPage';
import DriversPage from './pages/DriversPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DriverDashPage from './pages/DriverDashPage';
import DriverBookingsPage from './pages/DriverBookingsPage';
import DriverProfilePage from './pages/DriverProfilePage';
import SettingsPage from './pages/SettingsPage';

const CUSTOMER_PAGES = ['book', 'drivers', 'bookings', 'profile', 'settings'];
const DRIVER_PAGES = ['driver-dash', 'driver-bookings', 'driver-profile', 'settings'];

function AppShell({ user, role, onLogout }) {
  const { notification } = useApp();
  const [activePage, setActivePage] = useState(role === 'driver' ? 'driver-dash' : 'book');

  const pages = {
    book: <BookPage />,
    drivers: <DriversPage />,
    bookings: <BookingsPage />,
    profile: <ProfilePage user={user} onLogout={onLogout} />,
    'driver-dash': <DriverDashPage />,
    'driver-bookings': <DriverBookingsPage />,
    'driver-profile': <DriverProfilePage />,
    settings: <SettingsPage onLogout={onLogout} />,
  };

  const allowedPages = role === 'driver' ? DRIVER_PAGES : CUSTOMER_PAGES;
  const safePage = allowedPages.includes(activePage) ? activePage : allowedPages[0];

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      width: '100vw', maxWidth: '100vw', position: 'relative',
    }}>
      <Sidebar role={role} activePage={safePage} onNavigate={setActivePage} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', minWidth: 0,
      }}>
        <TopBar activePage={safePage} user={user} />
        <main className="main-content" style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          background: '#f9f8f6', width: '100%',
        }}>
          {pages[safePage] || (role === 'driver' ? <DriverDashPage /> : <BookPage />)}
        </main>
      </div>
      <BottomNav role={role} activePage={safePage} onNavigate={setActivePage} />
      <Toast notification={notification} />
    </div>
  );
}

// Shown once for existing accounts that signed up before roles existed
function ChooseRolePage({ user, onRoleChosen }) {
  const [saving, setSaving] = useState(false);

  const pick = async (role) => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { role } });
    setSaving(false);
    if (!error) onRoleChosen(role);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #e8f1fb 0%, #f9f8f6 100%)',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 36px',
        width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 22, color: '#1c1a17', marginBottom: 8 }}>One quick thing</h2>
        <p style={{ fontSize: 13, color: '#9c9890', marginBottom: 28 }}>
          Tell us how you'll be using DriverLink.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            disabled={saving}
            onClick={() => pick('customer')}
            style={{
              flex: 1, padding: '20px 12px', borderRadius: 14, border: '1.5px solid #e4e1d8',
              background: '#faf9f7', cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 28 }}>🧑</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1c1a17' }}>I'm a Customer</span>
            <span style={{ fontSize: 11, color: '#9c9890' }}>I want to book a driver</span>
          </button>
          <button
            disabled={saving}
            onClick={() => pick('driver')}
            style={{
              flex: 1, padding: '20px 12px', borderRadius: 14, border: '1.5px solid #e4e1d8',
              background: '#faf9f7', cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 28 }}>🚗</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1c1a17' }}>I'm a Driver</span>
            <span style={{ fontSize: 11, color: '#9c9890' }}>I want to give rides</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (checking) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f8f6' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚗</div>
          <div style={{ fontSize: 14, color: '#9c9890' }}>Loading DriverLink...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  const role = user.user_metadata?.role;

  if (!role) {
    return (
      <ChooseRolePage
        user={user}
        onRoleChosen={(chosenRole) => {
          // Refresh local user object so role is picked up immediately
          setUser({ ...user, user_metadata: { ...user.user_metadata, role: chosenRole } });
        }}
      />
    );
  }

  return (
    <AppProvider>
      <AppShell user={user} role={role} onLogout={handleLogout} />
    </AppProvider>
  );
}