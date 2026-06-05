import { useState } from 'react';
import { Phone, Mail, CreditCard, MapPin, Shield, Edit3, Check } from 'lucide-react';
import { Avatar, Card, Badge, Button, Divider, SectionLabel, Input, Select } from '../components/UI';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { showNotification } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Maria Vizcarra');
  const [phone, setPhone] = useState('+63 912 555 0101');
  const [email, setEmail] = useState('m.vizcarra@email.com');
  const [preferGender, setPreferGender] = useState('Any');
  const [language, setLanguage] = useState('English');

  const handleSave = () => {
    setEditing(false);
    showNotification('Profile updated!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: 560, animation: 'fadeUp 0.3s ease' }}>
      {/* Profile header */}
      <Card style={{ padding: '24px', marginBottom: 16, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Avatar initials="MV" color="#1a5c9a" bg="#e8f1fb" size={72} />
            <button style={{ position: 'absolute', bottom: 0, right: -4, width: 24, height: 24, borderRadius: '50%', background: '#1a5c9a', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Edit3 size={11} color="#fff" />
            </button>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{name}</div>
            <div style={{ fontSize: 13, color: '#9c9890', display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 4 }}>
              <MapPin size={12} /> Zamboanga City · Customer since 2025
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, paddingTop: 8 }}>
            {[['12', 'Total trips'], ['₱8.4k', 'Spent'], ['4.9 ★', 'Rating']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#1c1a17' }}>{val}</div>
                <div style={{ fontSize: 11, color: '#9c9890', marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Account details */}
      <SectionLabel>Account</SectionLabel>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ padding: '16px 18px' }}>
          {editing ? (
            <>
              <Input label="Full name" value={name} onChange={setName} />
              <Input label="Phone" value={phone} onChange={setPhone} icon={<Phone size={14} />} />
              <Input label="Email" value={email} onChange={setEmail} icon={<Mail size={14} />} />
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="outline" onClick={() => setEditing(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} style={{ flex: 1, justifyContent: 'center' }} icon={<Check size={14} />}>Save</Button>
              </div>
            </>
          ) : (
            <>
              {[
                { icon: <Phone size={14} />, label: 'Phone', value: phone },
                { icon: <Mail size={14} />, label: 'Email', value: email },
                { icon: <CreditCard size={14} />, label: 'Payment', value: null, badge: <Badge variant="green">GCash linked</Badge> },
              ].map(({ icon, label, value, badge }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #f5f4f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6b6760', fontSize: 14 }}>
                    {icon} {label}
                  </div>
                  {badge || <span style={{ fontSize: 14, color: '#2e2c28' }}>{value}</span>}
                </div>
              ))}
              <div style={{ paddingTop: 14 }}>
                <Button variant="outline" size="sm" icon={<Edit3 size={13} />} onClick={() => setEditing(true)}>Edit profile</Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Preferences */}
      <SectionLabel>Preferences</SectionLabel>
      <Card style={{ padding: '16px 18px', marginBottom: 16 }}>
        <Select label="Preferred driver gender" value={preferGender} onChange={setPreferGender} options={['Any', 'Female', 'Male']} />
        <Select label="Language" value={language} onChange={setLanguage} options={['English', 'Filipino', 'Chavacano']} />
      </Card>

      {/* Safety */}
      <SectionLabel>Safety & verification</SectionLabel>
      <Card style={{ padding: '12px 18px' }}>
        {[
          { icon: <Phone size={14} />, label: 'Phone verified', status: 'verified' },
          { icon: <Mail size={14} />, label: 'Email verified', status: 'verified' },
          { icon: <Shield size={14} />, label: 'Government ID', status: 'pending' },
        ].map(({ icon, label, status }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #f5f4f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <span style={{ color: '#6b6760' }}>{icon}</span> {label}
            </div>
            <Badge variant={status === 'verified' ? 'green' : 'amber'}>{status === 'verified' ? '✓ Verified' : '⏳ Pending'}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}
