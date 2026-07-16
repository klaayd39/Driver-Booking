import { useState } from 'react';
import { BadgeCheck, FileText, Shield, MapPin, Edit3, Check, Phone, Mail } from 'lucide-react';
import { DRIVERS } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { Avatar, Card, Badge, Button, SectionLabel, StarRating, VerifyRow, Input, Select, Chip, Divider } from '../components/UI';
import { TRIP_TYPES } from '../context/AppContext';

export default function DriverProfilePage() {
  const { showNotification } = useApp();
  const driver = DRIVERS[0];
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(driver.bio);
  const [selectedTypes, setSelectedTypes] = useState(['Designated', 'Long trip']);
  const [availability, setAvailability] = useState('Weekdays + Weekends');

  const toggleType = (t) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '100%', animation: 'fadeUp 0.3s ease', overflowX: 'hidden' }}>
      {/* Header */}
      <Card style={{ padding: '24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Avatar initials={driver.initials} color={driver.color} bg={driver.bg} size={68} />
            <button style={{ position: 'absolute', bottom: 0, right: -4, width: 24, height: 24, borderRadius: '50%', background: driver.color, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Edit3 size={11} color="#fff" />
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>{driver.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b6760', fontSize: 13, marginBottom: 8 }}>
              <MapPin size={13} /> {driver.location}
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[['4.9 ★', 'Rating'], ['34', 'Trips'], ['5 yrs', 'Experience']].map(([val, lbl]) => (
                <div key={lbl} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#9c9890' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Bio */}
      <SectionLabel>About</SectionLabel>
      <Card style={{ padding: '16px 18px', marginBottom: 16 }}>
        {editing ? (
          <>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-sans)', resize: 'vertical', marginBottom: 12 }} />
            <Button variant="primary" size="sm" icon={<Check size={13} />} onClick={() => { setEditing(false); showNotification('Profile updated!'); }}>Save</Button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 14, color: '#4a4740', lineHeight: 1.7, marginBottom: 12 }}>{bio}</p>
            <Button variant="outline" size="sm" icon={<Edit3 size={13} />} onClick={() => setEditing(true)}>Edit bio</Button>
          </>
        )}
      </Card>

      {/* Trip types */}
      <SectionLabel>Services offered</SectionLabel>
      <Card style={{ padding: '16px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
          {TRIP_TYPES.map(t => (
            <Chip key={t} label={t} selected={selectedTypes.includes(t)} onClick={() => toggleType(t)} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#9c9890', marginTop: 8 }}>Select the services you offer.</div>
      </Card>

      {/* Availability */}
      <SectionLabel>Availability</SectionLabel>
      <Card style={{ padding: '16px 18px', marginBottom: 16 }}>
        <Select label="Schedule" value={availability} onChange={setAvailability} options={['Weekdays only', 'Weekends only', 'Weekdays + Weekends', 'On demand']} />
      </Card>

      {/* Verification */}
      <SectionLabel>Verification documents</SectionLabel>
      <Card style={{ padding: '8px 18px' }}>
        <VerifyRow label="Driver's license" icon={<BadgeCheck size={16} />} status="verified" />
        <VerifyRow label="NBI clearance" icon={<FileText size={16} />} status="verified" />
        <VerifyRow label="Identity check" icon={<Shield size={16} />} status="pending" />
        <div style={{ paddingTop: 14, paddingBottom: 4 }}>
          <Button variant="outline" size="sm">Upload documents</Button>
        </div>
      </Card>
    </div>
  );
}
