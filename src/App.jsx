import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { Toast } from './components/UI';

import BookPage from './pages/BookPage';
import DriversPage from './pages/DriversPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DriverDashPage from './pages/DriverDashPage';
import DriverBookingsPage from './pages/DriverBookingsPage';
import DriverProfilePage from './pages/DriverProfilePage';
import SettingsPage from './pages/SettingsPage';

function AppShell() {
  const { mode, notification } = useApp();
  const [activePage, setActivePage] = useState('book');

  // Auto-switch default page when mode changes
  useEffect(() => {
    if (mode === 'customer') setActivePage('book');
    else setActivePage('driver-dash');
  }, [mode]);

  const pages = {
    book: <BookPage />,
    drivers: <DriversPage />,
    bookings: <BookingsPage />,
    profile: <ProfilePage />,
    'driver-dash': <DriverDashPage />,
    'driver-bookings': <DriverBookingsPage />,
    'driver-profile': <DriverProfilePage />,
    settings: <SettingsPage />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar activePage={activePage} />
        <main style={{ flex: 1, overflowY: 'auto', background: '#f9f8f6' }}>
          {pages[activePage] || <BookPage />}
        </main>
      </div>
      <Toast notification={notification} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
