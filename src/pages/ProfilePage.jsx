import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, CreditCard, MapPin, Shield, Edit3, Check, LogOut, Camera, X } from 'lucide-react';
import { Avatar, Card, Badge, Button, SectionLabel, Input, Select } from '../components/UI';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const PAYMENT_OPTIONS = ['Cash', 'GCash', 'PayMaya', 'Bank transfer'];
const GENDER_OPTIONS = ['Any', 'Female', 'Male'];
const LANGUAGE_OPTIONS = ['English', 'Filipino', 'Chavacano'];

function getProfileFromUser(user) {
  const meta = user?.user_metadata || {};
  return {
    name: meta.full_name || '',
    phone: meta.phone || user?.phone || '',
    email: user?.email || '',
    location: meta.location || 'Malaybalay City',
    preferGender: meta.prefer_gender || 'Any',
    language: meta.language || 'English',
    paymentMethod: meta.payment_method || 'Cash',
    photoUrl: meta.avatar_url || null,
    idVerified: Boolean(meta.id_verified),
  };
}

export default function ProfilePage({ user, onLogout }) {
  const { showNotification } = useApp();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const draftRef = useRef(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Malaybalay City');
  const [preferGender, setPreferGender] = useState('Any');
  const [language, setLanguage] = useState('English');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [idVerified, setIdVerified] = useState(false);

  const [totalBookings, setTotalBookings] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Load profile fields from auth user
  useEffect(() => {
    if (!user) return;
    const profile = getProfileFromUser(user);
    setName(profile.name);
    setPhone(profile.phone);
    setEmail(profile.email);
    setLocation(profile.location);
    setPreferGender(profile.preferGender);
    setLanguage(profile.language);
    setPaymentMethod(profile.paymentMethod);
    setPhotoUrl(profile.photoUrl);
    setIdVerified(profile.idVerified);
  }, [user]);

  // Load booking stats for this customer
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('fare, status')
        .eq('customer_id', user.id);

      if (error || !data) return;

      const completed = data.filter(b => b.status === 'completed' || b.status === 'confirmed');
      setTotalBookings(data.length);
      setCompletedTrips(completed.length);
      setTotalSpent(
        completed.reduce((sum, b) => sum + (Number(b.fare) || 0), 0)
      );
    };

    fetchStats();
  }, [user]);

  const startEditing = () => {
    draftRef.current = { name, phone, location, paymentMethod };
    setEditing(true);
  };

  const cancelEditing = () => {
    if (draftRef.current) {
      setName(draftRef.current.name);
      setPhone(draftRef.current.phone);
      setLocation(draftRef.current.location);
      setPaymentMethod(draftRef.current.paymentMethod);
    }
    setEditing(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showNotification('Please enter your full name.', 'error');
      return;
    }

    setSaving(true);
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: name.trim(),
        phone: phone.trim(),
        location: location.trim() || 'Malaybalay City',
        payment_method: paymentMethod,
        prefer_gender: preferGender,
        language,
        avatar_url: photoUrl,
      },
    });
    setSaving(false);

    if (error) {
      showNotification(error.message || 'Error updating profile', 'error');
      return;
    }

    if (data?.user) {
      const profile = getProfileFromUser(data.user);
      setName(profile.name);
      setPhone(profile.phone);
      setLocation(profile.location);
      setPaymentMethod(profile.paymentMethod);
    }

    showNotification('Profile updated!');
    setEditing(false);
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        prefer_gender: preferGender,
        language,
        payment_method: paymentMethod,
      },
    });
    setSavingPrefs(false);

    if (error) {
      showNotification(error.message || 'Could not save preferences', 'error');
      return;
    }

    showNotification('Preferences saved!');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Please choose an image file.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image must be under 5MB.', 'error');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setPhotoUrl(publicUrl);
      showNotification('Photo updated!');
    } catch (err) {
      console.error('Photo upload failed:', err);
      showNotification(err.message || 'Photo upload failed. Check Storage bucket "avatars".', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout && onLogout();
    showNotification('Logged out successfully.', 'info');
  };

  const initials = (name || 'Customer')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const emailVerified = Boolean(user?.email_confirmed_at);
  const phoneVerified = Boolean(phone?.trim());

  return (
    <div style={{ padding: '16px', maxWidth: '100%', animation: 'fadeUp 0.3s ease', overflowX: 'hidden' }}>
      {/* Profile header */}
      <Card style={{ padding: '24px', marginBottom: 16, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8f1fb' }}
              />
            ) : (
              <Avatar initials={initials} color="#1a5c9a" bg="#e8f1fb" size={72} />
            )}
            <label
              title={uploading ? 'Uploading…' : 'Change photo'}
              style={{
                position: 'absolute', bottom: 0, right: -4,
                width: 24, height: 24, borderRadius: '50%',
                background: uploading ? '#9c9890' : '#1a5c9a', border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: uploading ? 'wait' : 'pointer',
              }}
            >
              <Camera size={11} color="#fff" />
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{name || 'Customer'}</div>
            <div style={{ fontSize: 13, color: '#9c9890', display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 4 }}>
              <MapPin size={12} /> {location || 'Malaybalay City'} · Customer
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, paddingTop: 8 }}>
            {[
              [totalBookings.toString(), 'Total trips'],
              [completedTrips.toString(), 'Completed'],
              [`₱${totalSpent.toLocaleString()}`, 'Spent'],
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
              <Input label="Full name" value={name} onChange={setName} placeholder="Your full name" />
              <Input label="Phone" value={phone} onChange={setPhone} placeholder="+63 9XX XXX XXXX" icon={<Phone size={14} />} />
              <Input label="Location" value={location} onChange={setLocation} placeholder="City / area" icon={<MapPin size={14} />} />
              <Select label="Preferred payment" value={paymentMethod} onChange={setPaymentMethod} options={PAYMENT_OPTIONS} />
              <div style={{ fontSize: 12, color: '#9c9890', marginBottom: 14 }}>
                Email is managed by your account and can’t be changed here: <strong style={{ color: '#4a4740' }}>{email}</strong>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="outline" onClick={cancelEditing} disabled={saving} style={{ flex: 1, justifyContent: 'center' }} icon={<X size={14} />}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: 'center' }} icon={<Check size={14} />}>
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </>
          ) : (
            <>
              {[
                { icon: <Phone size={14} />, label: 'Phone', value: phone || 'Not set' },
                { icon: <Mail size={14} />, label: 'Email', value: email || 'Not set' },
                { icon: <MapPin size={14} />, label: 'Location', value: location || 'Not set' },
                {
                  icon: <CreditCard size={14} />,
                  label: 'Payment',
                  value: null,
                  badge: (
                    <Badge variant={paymentMethod === 'Cash' ? 'gray' : 'green'}>
                      {paymentMethod}
                    </Badge>
                  ),
                },
              ].map(({ icon, label, value, badge }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #f5f4f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6b6760', fontSize: 14 }}>
                    {icon} {label}
                  </div>
                  {badge || <span style={{ fontSize: 14, color: '#2e2c28' }}>{value}</span>}
                </div>
              ))}
              <div style={{ paddingTop: 14 }}>
                <Button variant="outline" size="sm" icon={<Edit3 size={13} />} onClick={startEditing}>
                  Edit profile
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Preferences */}
      <SectionLabel>Preferences</SectionLabel>
      <Card style={{ padding: '16px 18px', marginBottom: 16 }}>
        <Select label="Preferred driver gender" value={preferGender} onChange={setPreferGender} options={GENDER_OPTIONS} />
        <Select label="Language" value={language} onChange={setLanguage} options={LANGUAGE_OPTIONS} />
        <Button
          variant="primary"
          size="sm"
          icon={<Check size={13} />}
          onClick={handleSavePreferences}
          disabled={savingPrefs}
        >
          {savingPrefs ? 'Saving…' : 'Save preferences'}
        </Button>
      </Card>

      {/* Safety */}
      <SectionLabel>Safety & verification</SectionLabel>
      <Card style={{ padding: '12px 18px', marginBottom: 16 }}>
        {[
          { icon: <Phone size={14} />, label: 'Phone on file', status: phoneVerified ? 'verified' : 'pending' },
          { icon: <Mail size={14} />, label: 'Email verified', status: emailVerified ? 'verified' : 'pending' },
          { icon: <Shield size={14} />, label: 'Government ID', status: idVerified ? 'verified' : 'pending' },
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
        <div style={{ fontSize: 12, color: '#9c9890', paddingTop: 10, lineHeight: 1.5 }}>
          Add your phone in Edit profile. Email verification comes from signup. Government ID review is handled by support.
        </div>
      </Card>

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
