import { useState, useEffect } from 'react';
import { Phone, Mail, CreditCard, MapPin, Shield, Edit3, Check, LogOut, Camera } from 'lucide-react';
import { Avatar, Card, Badge, Button, SectionLabel, Input, Select } from '../components/UI';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function ProfilePage({ user, onLogout }) {
  const { showNotification } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferGender, setPreferGender] = useState('Any');
  const [language, setLanguage] = useState('English');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Load real user data
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || 'Customer');
      setEmail(user.email || '');
    }
  }, [user]);

  // Load booking stats
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('fare, status')
        .eq('customer_id', user.id);
      if (data) {
        setTotalBookings(data.length);
        setTotalSpent(data.reduce((sum, b) => sum + (b.fare || 0), 0));
      }
    };
    fetchStats();
  }, [user]);

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
      phone: phone || undefined,
    });
    if (!error) {
      showNotification('Profile updated! ✅');
      setEditing(false);
    } else {
      showNotification('Error updating profile', 'error');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        setPhotoUrl(data.publicUrl);
        showNotification('Photo updated! 📸');
      }
    } catch (err) {
      showNotification('Photo upload failed', 'error');
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout && onLogout();
    showNotification('Logged out successfully.', 'info');
  };

  // Get initials from name
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ padding: '16px', maxWidth: '100%', animation: 'fadeUp 0.3s ease', overflowX: 'hidden' }}>
      {/* Profile header */}
      <Card style={{ padding: '24px', marginBottom: 16, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {/* Photo with upload button */}
          <div style={{ position: 'relative' }}>
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <Avatar initials={initials} color="#1a5c9a" bg="#e8f1fb" size={72} />
            )}
            <label style={{
              position: 'absolute', bottom: 0, right: -4,
              width: 24, height: 24, borderRadius: '50%',
              background: '#1a5c9a', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Camera size={11} color="#fff" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{name || 'Customer'}</div>
            <div style={{ fontSize: 13, color: '#9c9890', display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 4 }}>
              <MapPin size={12} /> Malaybalay City · Customer
            </div>
          </div>

          {/* Real stats */}
          <div style={{ display: 'flex', gap: 24, paddingTop: 8 }}>
            {[
              [totalBookings.toString(), 'Total trips'],
              [`₱${totalSpent.toLocaleString()}`, 'Spent'],
              ['4.9 ★', 'Rating'],
            ].map(([val, lbl]) => (
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
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="outline" onClick={() => setEditing(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} style={{ flex: 1, justifyContent: 'center' }} icon={<Check size={14} />}>Save</Button>
              </div>
            </>
          ) : (
            <>
              {[
                { icon: <Phone size={14} />, label: 'Phone', value: phone || 'Not set' },
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
      <Card style={{ padding: '12px 18px', marginBottom: 16 }}>
        {[
          { icon: <Phone size={14} />, label: 'Phone verified', status: 'verified' },
          { icon: <Mail size={14} />, label: 'Email verified', status: 'verified' },
          { icon: <Shield size={14} />, label: 'Government ID', status: 'pending' },
        ].map(({ icon, label, status }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #f5f4f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <span style={{ color: '#6b6760' }}>{icon}</span> {label}
            </div>
            <Badge variant={status === 'verified' ? 'green' : 'amber'}>
              {status === 'verified' ? '✓ Verified' : '⏳ Pending'}
            </Badge>
          </div>
        ))}
      </Card>

      {/* Logout button */}
      <Button
        variant="danger"
        size="md"
        fullWidth
        icon={<LogOut size={15} />}
        onClick={handleLogout}
      >
        Log out
      </Button>
    </div>
  );
}