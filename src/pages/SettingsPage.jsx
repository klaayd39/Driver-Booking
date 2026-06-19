import { useState } from 'react';
import { Bell, Navigation, MessageSquare, CreditCard, Shield, Moon, Globe, LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Card, Badge, SectionLabel, Button, Divider } from '../components/UI';

function SettingRow({ icon, label, description, value, onToggle, isToggle = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #f5f4f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f1efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a4740', flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1c1a17' }}>{label}</div>
          {description && <div style={{ fontSize: 12, color: '#9c9890', marginTop: 1 }}>{description}</div>}
        </div>
      </div>
      {isToggle ? (
        <button
          onClick={onToggle}
          style={{
            width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
            background: value ? '#1a5c9a' : '#e4e1d8', transition: 'background 0.2s',
            position: 'relative', flexShrink: 0,
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: '50%', background: '#fff',
            position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </button>
      ) : (
        <ChevronRight size={16} color="#9c9890" />
      )}
    </div>
  );
}

export default function SettingsPage({ onLogout }) {
  const { showNotification } = useApp();
  const [settings, setSettings] = useState({
    notifications: true,
    gps: true,
    chat: true,
    darkMode: false,
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showNotification('Failed to sign out.', 'error');
      return;
    }
    showNotification('Logged out.', 'info');
    onLogout && onLogout();
  };

  return (
    <div style={{ padding: '16px', maxWidth: '100%', animation: 'fadeUp 0.3s ease', overflowX: 'hidden' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#1c1a17', marginBottom: 4 }}>Settings</h2>
        <p style={{ fontSize: 14, color: '#9c9890' }}>App version 1.0.0 · DriverLink PH</p>
      </div>

      <SectionLabel>App preferences</SectionLabel>
      <Card style={{ padding: '4px 18px', marginBottom: 16 }}>
        <SettingRow icon={<Bell size={16} />} label="Push notifications" description="Booking updates and messages" value={settings.notifications} onToggle={() => toggle('notifications')} />
        <SettingRow icon={<Navigation size={16} />} label="GPS tracking" description="Share location during trips" value={settings.gps} onToggle={() => toggle('gps')} />
        <SettingRow icon={<MessageSquare size={16} />} label="In-app chat" description="Message drivers directly" value={settings.chat} onToggle={() => toggle('chat')} />
        <SettingRow icon={<Moon size={16} />} label="Dark mode" value={settings.darkMode} onToggle={() => toggle('darkMode')} />
      </Card>

      <SectionLabel>Payments</SectionLabel>
      <Card style={{ padding: '4px 18px', marginBottom: 16 }}>
        <SettingRow icon={<CreditCard size={16} />} label="Payment methods" description="GCash · PayMaya · Cash" isToggle={false} />
        <SettingRow icon={<Globe size={16} />} label="Currency" description="Philippine Peso (₱)" isToggle={false} />
      </Card>

      <SectionLabel>Privacy & security</SectionLabel>
      <Card style={{ padding: '4px 18px', marginBottom: 16 }}>
        <SettingRow icon={<Shield size={16} />} label="Privacy settings" description="Data and permissions" isToggle={false} />
      </Card>

      <SectionLabel>Revenue model info</SectionLabel>
      <Card style={{ padding: '16px 18px', marginBottom: 20 }}>
        {[
          { label: 'Platform commission', value: '10–20% per booking' },
          { label: 'Driver subscription', value: '₱299/month (priority listing)' },
          { label: 'Corporate accounts', value: 'Custom pricing' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f4f0', fontSize: 13 }}>
            <span style={{ color: '#6b6760' }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </Card>

      <Button variant="danger" size="md" icon={<LogOut size={15} />} onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}