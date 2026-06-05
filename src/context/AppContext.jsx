import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const DRIVERS = [
  { id: 1, name: 'Ricky Dela Cruz', initials: 'RD', color: '#1a5c9a', bg: '#e8f1fb', location: 'Zamboanga City', distance: '3.2 km', rating: 4.9, trips: 34, status: 'online', types: ['Designated', 'Long trip'], nbi: true, licensed: true, phone: '+63 912 555 0101', bio: 'Professional driver with 5 years experience. Specializes in designated driving and long-distance trips across Mindanao.' },
  { id: 2, name: 'Jun Manalo', initials: 'JM', color: '#0f6e56', bg: '#e1f5ee', location: 'Zamboanga City', distance: '5.1 km', rating: 4.6, trips: 18, status: 'online', types: ['Elderly care', 'Hourly'], nbi: true, licensed: true, phone: '+63 917 555 0202', bio: 'Patient and courteous driver, trusted by families with elderly parents. Available for hourly hire across the city.' },
  { id: 3, name: 'Lorna Paterno', initials: 'LP', color: '#854f0b', bg: '#faeeda', location: 'Zamboanga City', distance: '7.8 km', rating: 5.0, trips: 52, status: 'away', types: ['Corporate', 'Long trip', 'Designated'], nbi: true, licensed: true, phone: '+63 920 555 0303', bio: 'Top-rated corporate driver with impeccable professionalism. Preferred by executives and business travelers.' },
  { id: 4, name: 'Marco Reyes', initials: 'MR', color: '#533ab7', bg: '#eeedfe', location: 'Zamboanga City', distance: '2.4 km', rating: 4.8, trips: 27, status: 'online', types: ['Designated', 'Hourly'], nbi: true, licensed: false, phone: '+63 915 555 0404', bio: 'Young and reliable driver, great with night-time designated driving. License verification pending.' },
  { id: 5, name: 'Ana Santos', initials: 'AS', color: '#993556', bg: '#fbeaf0', location: 'Zamboanga City', distance: '9.0 km', rating: 4.7, trips: 11, status: 'offline', types: ['Elderly care', 'Corporate'], nbi: false, licensed: true, phone: '+63 918 555 0505', bio: 'Caring and attentive driver especially for seniors. NBI clearance in process.' },
];

export const TRIP_TYPES = ['Designated driver', 'Long trip', 'Elderly care', 'Business trip', 'Hourly hire'];

const INITIAL_BOOKINGS = [
  { id: 'BK001', driverId: 1, type: 'Designated driver', date: 'Today, June 3', time: '9:00 PM', duration: '2 hours', pickup: 'Maria Cristina St, Zamboanga City', destination: 'Canelar, Zamboanga City', status: 'confirmed', fare: 450 },
  { id: 'BK002', driverId: 2, type: 'Long trip', date: 'May 28', time: '6:00 AM', duration: '4 hours', pickup: 'Zamboanga City', destination: 'Pagadian City', status: 'completed', fare: 1200 },
];

export function AppProvider({ children }) {
  const [mode, setMode] = useState('customer'); // 'customer' | 'driver'
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [driverOnline, setDriverOnline] = useState(true);
  const [notification, setNotification] = useState(null);

  const addBooking = (booking) => {
    const newBooking = { ...booking, id: 'BK' + Date.now(), status: 'confirmed' };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <AppContext.Provider value={{
      mode, setMode,
      bookings, addBooking, cancelBooking,
      activeBookingId, setActiveBookingId,
      driverOnline, setDriverOnline,
      notification, showNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
