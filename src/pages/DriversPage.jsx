import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { DRIVERS, TRIP_TYPES } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { SectionLabel, Chip, EmptyState } from '../components/UI';
import DriverCard from '../components/DriverCard';
import BookingModal from '../components/BookingModal';

const STATUS_FILTERS = ['All', 'Online', 'Away'];

export default function DriversPage() {
  const { addBooking, showNotification } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [bookingDriver, setBookingDriver] = useState(null);

  const filtered = useMemo(() => {
    return DRIVERS.filter(d => {
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || d.status === statusFilter.toLowerCase();
      const matchType = typeFilter === 'All' || d.types.includes(typeFilter);
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const handleConfirm = (bookingData) => {
    addBooking(bookingData);
    setBookingDriver(null);
    showNotification(`Booking confirmed! 🎉`);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '100%', animation: 'fadeUp 0.3s ease', overflowX: 'hidden' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#1c1a17', marginBottom: 4 }}>Find a Driver</h2>
        <p style={{ fontSize: 14, color: '#9c9890' }}>All drivers are NBI-cleared and license-verified.</p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9c9890' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or area…"
          style={{
            width: '100%', padding: '11px 14px 11px 38px',
            border: '1px solid #e4e1d8', borderRadius: 12, fontSize: 14,
            fontFamily: 'var(--font-sans)', color: '#1c1a17', background: '#fff',
            outline: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
          onFocus={e => e.target.style.borderColor = '#3a7fc1'}
          onBlur={e => e.target.style.borderColor = '#e4e1d8'}
        />
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 12, flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(s => (
          <Chip key={s} label={s} selected={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 20, flexWrap: 'wrap' }}>
        {['All', ...TRIP_TYPES].map(t => (
          <Chip key={t} label={t} selected={typeFilter === t} onClick={() => setTypeFilter(t)} />
        ))}
      </div>

      <SectionLabel>{filtered.length} driver{filtered.length !== 1 ? 's' : ''} found</SectionLabel>

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No drivers found" subtitle="Try adjusting your filters or search terms." />
      ) : (
        <div className="stagger">
          {filtered.map(driver => (
            <DriverCard key={driver.id} driver={driver} onBook={setBookingDriver} />
          ))}
        </div>
      )}

      {bookingDriver && (
        <BookingModal
          driver={bookingDriver}
          onClose={() => setBookingDriver(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
