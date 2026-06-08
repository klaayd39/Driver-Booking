import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import { Toast } from './components/UI';
import AuthPage from './pages/AuthPage';

import BookPage from './pages/BookPage';
import DriversPage from './pages/DriversPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DriverDashPage from './pages/DriverDashPage';
import DriverBookingsPage from './pages/DriverBookingsPage';
import DriverProfilePage from './pages/DriverProfilePage';
import SettingsPage from './pages/SettingsPage';

function AppShell({ user, onLogout }) {
  const { mode, setMode, notification } = useApp();
  const [activePage, setActivePage] = useState('book');

  useEffect(() => {
    if (mode === 'customer') setActivePage('book');
    else setActivePage('driver-dash');
  }, [mode]);

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

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', width: '100vw', maxWidth: '100vw' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar activePage={activePage} user={user} />
        <main className="main-content" style={{ flex: 1, overflowY: 'auto', background: '#f9f8f6' }}>
          {pages[activePage] || <BookPage />}
        </main>
      </div>
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
      <Toast notification={notification} />
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

    return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden', 
      width: '100vw', 
      maxWidth: '100vw',
      position: 'relative',
    }}>
      {/* Sidebar - hidden on mobile via CSS */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        minWidth: 0,
        width: '100%',
      }}>
        <TopBar activePage={activePage} user={user} />
        <main className="main-content" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          background: '#f9f8f6',
          width: '100%',
        }}>
          {pages[activePage] || <BookPage />}
        </main>
      </div>

      {/* Bottom nav - shows on mobile only */}
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
      <Toast notification={notification} />
    </div>
  );
  }