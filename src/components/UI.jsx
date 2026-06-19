import { useState } from 'react';
import { Star, Check, Clock, X } from 'lucide-react';

export function Avatar({ initials, color = '#1B4332', bg = '#D8F3DC', size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontWeight: 700, fontSize: size * 0.32,
      flexShrink: 0, letterSpacing: '0.02em',
    }}>
      {initials}
    </div>
  );
}

export function Badge({ children, variant = 'gray' }) {
  const styles = {
    gray: { bg: '#EFE6CB', color: '#524E40' },
    green: { bg: '#D8F3DC', color: '#1B4332' },
    blue: { bg: '#D8F3DC', color: '#1B4332' },
    amber: { bg: '#FDF3D0', color: '#7A5C00' },
    red: { bg: '#FCEBEB', color: '#A32D2D' },
    purple: { bg: '#F5E6D3', color: '#6B4226' },
    gold: { bg: '#FDF3D0', color: '#7A5C00' },
    terracotta: { bg: '#F5E6D3', color: '#8A3209' },
  };
  const s = styles[variant] || styles.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 99,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

export function StatusDot({ status }) {
  const colors = { online: '#2D6A4F', away: '#D4A017', offline: '#9C9484' };
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status] || colors.offline, display: 'inline-block', flexShrink: 0 }} />;
}

export function StarRating({ rating, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <Star size={size} fill="#D4A017" color="#D4A017" />
      <span style={{ fontSize: size + 1, fontWeight: 700, color: '#524E40' }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export function Card({ children, style = {}, className = '' }) {
  return (
    <div className={`card ${className}`} style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #E8E0C8',
      boxShadow: '0 1px 3px rgba(27,67,50,0.06)',
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
    primary: { background: '#1B4332', color: '#fff', border: 'none' },
    secondary: { background: '#EFE6CB', color: '#1A1A18', border: 'none' },
    outline: { background: 'transparent', color: '#1B4332', border: '1.5px solid #1B4332' },
    danger: { background: '#FCEBEB', color: '#A32D2D', border: '1px solid #F0B0B0' },
    success: { background: '#2D6A4F', color: '#fff', border: 'none' },
    gold: { background: '#D4A017', color: '#1A1A18', border: 'none' },
    ghost: { background: 'transparent', color: '#524E40', border: 'none' },
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
        fontWeight: 600,
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
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: '#75705F', marginBottom: 5, letterSpacing: '0.02em' }}>{label}</div>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9C9484', display: 'flex' }}>{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', padding: icon ? '10px 12px 10px 36px' : '10px 12px',
            border: '1.5px solid #E0D6B8', borderRadius: 10, fontSize: 14,
            fontFamily: 'var(--font-sans)', color: '#1A1A18', background: '#FAF8EF',
            outline: 'none', transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = '#40916C'}
          onBlur={e => e.target.style.borderColor = '#E0D6B8'}
        />
      </div>
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: '#75705F', marginBottom: 5 }}>{label}</div>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', border: '1.5px solid #E0D6B8',
          borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-sans)',
          color: '#1A1A18', background: '#FAF8EF', outline: 'none',
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
        padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
        border: selected ? 'none' : '1.5px solid #2D6A4F',
        background: selected ? '#1B4332' : '#fff',
        color: selected ? '#fff' : '#2D6A4F',
        cursor: 'pointer', transition: 'all 0.15s',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </button>
  );
}

export function Divider({ margin = '16px 0' }) {
  return <div style={{ borderTop: '1px solid #E8E0C8', margin }} />;
}

export function VerifyRow({ label, icon, status }) {
  const statuses = {
    verified: { badge: 'green', label: 'Verified', icon: <Check size={10} /> },
    pending: { badge: 'amber', label: 'Pending', icon: <Clock size={10} /> },
    missing: { badge: 'red', label: 'Required', icon: <X size={10} /> },
  };
  const s = statuses[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #F1EBD8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
        <span style={{ color: '#75705F' }}>{icon}</span>
        {label}
      </div>
      <Badge variant={s.badge}>{s.icon} {s.label}</Badge>
    </div>
  );
}

export function SectionLabel({ children, style = {} }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9C9484', marginBottom: 10, ...style }}>
      {children}
    </div>
  );
}

export function Toast({ notification }) {
  if (!notification) return null;
  const colors = { success: { bg: '#1B4332', color: '#fff' }, error: { bg: '#A32D2D', color: '#fff' }, info: { bg: '#2D6A4F', color: '#fff' } };
  const c = colors[notification.type] || colors.info;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: c.bg, color: c.color, padding: '12px 24px', borderRadius: 12,
      fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(27,67,50,0.25)',
      zIndex: 1000, animation: 'fadeUp 0.3s ease both', whiteSpace: 'nowrap',
    }}>
      {notification.msg}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.35 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#524E40', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#9C9484' }}>{subtitle}</div>
    </div>
  );
}
