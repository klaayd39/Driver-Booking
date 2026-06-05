import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

export const TRIP_TYPES = ['Designated driver', 'Long trip', 'Elderly care', 'Business trip', 'Hourly hire'];

export function AppProvider({ children }) {
  const [mode, setMode] = useState('customer');
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [driverOnline, setDriverOnline] = useState(true);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load drivers from Supabase
  useEffect(() => {
    const fetchDrivers = async () => {
      const { data, error } = await supabase.from('drivers').select('*');
      if (!error) setDrivers(data);
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  // Load bookings from Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (!error) setBookings(data);
    };
    fetchBookings();
  }, []);

  const addBooking = async (booking) => {
    const { data, error } = await supabase.from('bookings').insert([{ ...booking, status: 'confirmed' }]).select().single();
    if (!error) setBookings(prev => [data, ...prev]);
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