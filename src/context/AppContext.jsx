import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

export const TRIP_TYPES = ['Designated driver', 'Long trip', 'Elderly care', 'Business trip', 'Hourly hire'];

export const DRIVERS = [
  { id: 1, name: 'Dashiel Dinopol', initials: 'RD', color: '#1a5c9a', bg: '#e8f1fb', location: 'Zamboanga City', distance: '3.2 km', rating: 4.9, trips: 34, status: 'online', types: ['Designated', 'Long trip'], nbi: true, licensed: true, phone: '+63 912 555 0101', bio: 'Professional driver with 5 years experience.' },
  { id: 2, name: 'Jun Manalo', initials: 'JM', color: '#0f6e56', bg: '#e1f5ee', location: 'Zamboanga City', distance: '5.1 km', rating: 4.6, trips: 18, status: 'online', types: ['Elderly care', 'Hourly'], nbi: true, licensed: true, phone: '+63 917 555 0202', bio: 'Patient and courteous driver.' },
  { id: 3, name: 'Lorna Paterno', initials: 'LP', color: '#854f0b', bg: '#faeeda', location: 'Zamboanga City', distance: '7.8 km', rating: 5.0, trips: 52, status: 'away', types: ['Corporate', 'Long trip', 'Designated'], nbi: true, licensed: true, phone: '+63 920 555 0303', bio: 'Top-rated corporate driver.' },
  { id: 4, name: 'Marco Reyes', initials: 'MR', color: '#533ab7', bg: '#eeedfe', location: 'Zamboanga City', distance: '2.4 km', rating: 4.8, trips: 27, status: 'online', types: ['Designated', 'Hourly'], nbi: true, licensed: false, phone: '+63 915 555 0404', bio: 'Young and reliable driver.' },
  { id: 5, name: 'Ana Santos', initials: 'AS', color: '#993556', bg: '#fbeaf0', location: 'Zamboanga City', distance: '9.0 km', rating: 4.7, trips: 11, status: 'offline', types: ['Elderly care', 'Corporate'], nbi: false, licensed: true, phone: '+63 918 555 0505', bio: 'Caring and attentive driver.' },
];

export function AppProvider({ children }) {
  const [mode, setMode] = useState('customer');
  const [drivers, setDrivers] = useState(DRIVERS);
  const [bookings, setBookings] = useState([]);
  const [driverOnline, setDriverOnline] = useState(true);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data, error } = await supabase.from('drivers').select('*');
      if (!error && data.length > 0) setDrivers(data);
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setBookings(data);
    };
    fetchBookings();
  }, []);

  const addBooking = async (booking) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ ...booking, status: 'confirmed' }])
      .select()
      .single();

    if (!error) {
      setBookings(prev => [data, ...prev]);

      // Send email notification to driver 📧
      await supabase.functions.invoke('notify-driver', {
        body: { booking: data }
      });
    }
    return data;
  };

  const cancelBooking = async (id) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <AppContext.Provider value={{
      mode, setMode,
      drivers, loading,
      bookings, addBooking, cancelBooking,
      driverOnline, setDriverOnline,
      notification, showNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);