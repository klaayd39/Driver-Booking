import { useState } from 'react';
import { Star, Check, Clock, X } from 'lucide-react';

export function Avatar({ initials, color = '#1a5c9a', bg = '#e8f1fb', size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontWeight: 600, fontSize: size * 0.32,
      flexShrink: 0, letterSpacing: '0.02em',
    }}>
      {initials}
    </div>
  );
}

export function Badge({ children, variant = 'gray' }) {
  const styles = {
    gray: { bg: '#f1efe9', color: '#4a4740' },
    green: { bg: '#e2f7ef', color: '#0f6e56' },
    blue: { bg: '#e8f1fb', color: '#1a5c9a' },
    amber: { bg: '#fef3e2', color: '#854f0b' },
    red: { bg: '#fdeaea', color: '#d63b3b' },
    purple: { bg: '#eeedfe', color: '#533ab7' },
  };
  const s = styles[variant] || styles.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 99,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

export function StatusDot({ status }) {
  const colors = { online: '#1e9e6e', away: '#d97b00', offline: '#9c9890' };
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status] || colors.offline, display: 'inline-block', flexShrink: 0 }} />;
}

export function StarRating({ rating, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <Star size={size} fill="#f4a942" color="#f4a942" />
      <span style={{ fontSize: size + 1, fontWeight: 600, color: '#4a4740' }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export function Card({ children, style = {}, className = '' }) {
  return (
    <div className={className} style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #eae8e2',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', fullWidth = false, disabled = false, onClick, style = {}, icon }) {
  const sizes = { sm: { padding: '7px 14px', fontSize: 13 }, md: { padding: '10px 20px', fontSize: 14 }, lg: { padding: '13px 28px', fontSize: 15 } };
  const variants = {
    primary: { background: '#1a5c9a', color: '#fff', border: 'none' },
    secondary: { background: '#f1efe9', color: '#2e2c28', border: 'none' },
    outline: { background: 'transparent', color: '#2e2c28', border: '1px solid #cbc7bb' },
    danger: { background: '#fdeaea', color: '#d63b3b', border: '1px solid #f7c1c1' },
    success: { background: '#1e9e6e', color: '#fff', border: 'none' },
    ghost: { background: 'transparent', color: '#4a4740', border: 'none' },
  };
  const [hovered, setHovered] = useState(false);
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...sizes[size],
        ...v,
        borderRadius: 10,
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : hovered ? 0.88 : 1,
        transition: 'opacity 0.15s, transform 0.1s',
        transform: hovered && !disabled ? 'translateY(-1px)' : 'none',
        display: 'inline-flex', alignItems: 'center', gap: 7,
        width: fullWidth ? '100%' : 'auto',
        justifyContent: fullWidth ? 'center' : 'flex-start',
        ...style,
      }}
    >
      {icon && icon}
      {children}
    </button>
  );
}

export function Input({ label, value, onChange, placeholder, type = 'text', icon }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5, letterSpacing: '0.02em' }}>{label}</div>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9c9890', display: 'flex' }}>{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', padding: icon ? '10px 12px 10px 36px' : '10px 12px',
            border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14,
            fontFamily: 'var(--font-sans)', color: '#1c1a17', background: '#faf9f7',
            outline: 'none', transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = '#3a7fc1'}
          onBlur={e => e.target.style.borderColor = '#e4e1d8'}
        />
      </div>
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5 }}>{label}</div>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', border: '1px solid #e4e1d8',
          borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-sans)',
          color: '#1c1a17', background: '#faf9f7', outline: 'none',
        }}
      >
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

export function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500,
        border: selected ? 'none' : '1px solid #e4e1d8',
        background: selected ? '#1a5c9a' : '#fff',
        color: selected ? '#fff' : '#4a4740',
        cursor: 'pointer', transition: 'all 0.15s',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </button>
  );
}

export function Divider({ margin = '16px 0' }) {
  return <div style={{ borderTop: '1px solid #eae8e2', margin }} />;
}

export function VerifyRow({ label, icon, status }) {
  const statuses = {
    verified: { badge: 'green', label: 'Verified', icon: <Check size={10} /> },
    pending: { badge: 'amber', label: 'Pending', icon: <Clock size={10} /> },
    missing: { badge: 'red', label: 'Required', icon: <X size={10} /> },
  };
  const s = statuses[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #f1efe9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
        <span style={{ color: '#6b6760' }}>{icon}</span>
        {label}
      </div>
      <Badge variant={s.badge}>{s.icon} {s.label}</Badge>
    </div>
  );
}

export function SectionLabel({ children, style = {} }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9c9890', marginBottom: 10, ...style }}>
      {children}
    </div>
  );
}

export function Toast({ notification }) {
  if (!notification) return null;
  const colors = { success: { bg: '#1e9e6e', color: '#fff' }, error: { bg: '#d63b3b', color: '#fff' }, info: { bg: '#1a5c9a', color: '#fff' } };
  const c = colors[notification.type] || colors.info;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: c.bg, color: c.color, padding: '12px 24px', borderRadius: 12,
      fontSize: 14, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      zIndex: 1000, animation: 'fadeUp 0.3s ease both', whiteSpace: 'nowrap',
    }}>
      {notification.msg}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: 15, color: '#4a4740', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#9c9890' }}>{subtitle}</div>
    </div>
  );
}
