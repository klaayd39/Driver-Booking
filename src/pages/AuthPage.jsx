import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Car, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (isLogin) {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else onLogin(data.user);
    } else {
      // Sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });
      if (error) setError(error.message);
      else onLogin(data.user);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #e8f1fb 0%, #f9f8f6 100%)',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 36px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#1a5c9a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Car size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#1c1a17', marginBottom: 4 }}>
            Driver Booking
          </h1>
          <p style={{ fontSize: 14, color: '#9c9890' }}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: '#f1efe9', borderRadius: 12,
          padding: 4, marginBottom: 24, gap: 4,
        }}>
          {['Log in', 'Sign up'].map((label, i) => (
            <button
              key={label}
              onClick={() => { setIsLogin(i === 0); setError(''); }}
              style={{
                flex: 1, padding: '9px', borderRadius: 9, border: 'none',
                background: (isLogin ? i === 0 : i === 1) ? '#fff' : 'transparent',
                color: (isLogin ? i === 0 : i === 1) ? '#1c1a17' : '#9c9890',
                fontWeight: (isLogin ? i === 0 : i === 1) ? 600 : 400,
                cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-sans)',
                boxShadow: (isLogin ? i === 0 : i === 1) ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Fields */}
        {!isLogin && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5 }}>Full name</div>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c9890' }} />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Maria Vizcarra"
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', background: '#faf9f7' }}
                onFocus={e => e.target.style.borderColor = '#3a7fc1'}
                onBlur={e => e.target.style.borderColor = '#e4e1d8'}
              />
            </div>
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5 }}>Email</div>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c9890' }} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', background: '#faf9f7' }}
              onFocus={e => e.target.style.borderColor = '#3a7fc1'}
              onBlur={e => e.target.style.borderColor = '#e4e1d8'}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5 }}>Password</div>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c9890' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 36px 10px 36px', border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', background: '#faf9f7' }}
              onFocus={e => e.target.style.borderColor = '#3a7fc1'}
              onBlur={e => e.target.style.borderColor = '#e4e1d8'}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9c9890' }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fdeaea', color: '#d63b3b', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '13px', background: '#1a5c9a', color: '#fff',
            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            fontFamily: 'var(--font-sans)', transition: 'opacity 0.15s',
          }}
        >
          {loading ? '⏳ Please wait...' : isLogin ? 'Log in' : 'Create account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9c9890', marginTop: 20 }}>
          By continuing, you agree to DriverLink's Terms of Service.
        </p>
      </div>
    </div>
  );
}