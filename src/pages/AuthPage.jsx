import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Car, Mail, Lock, User, Eye, EyeOff, ShieldCheck, UserCircle } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'driver'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // OTP state
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else if (!data.user?.email_confirmed_at) {
          await supabase.auth.signOut();
          setError('Please verify your email address before logging in. Check your inbox.');
        } else {
          onLogin(data.user);
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name, role },
          },
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess('We sent a 6-digit code to ' + email);
          setShowOtp(true);
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') handleVerifyOtp();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const updated = [...otp];
    pasted.split('').forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    otpRefs.current[nextEmpty]?.focus();
  };

  const handleVerifyOtp = async () => {
    const token = otp.join('');
    if (token.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });

      if (error) {
        setError(error.message);
      } else {
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('A new code has been sent to ' + email);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Verification email sent successfully. Please check your inbox.');
    }
  };

  // ── OTP Screen ────────────────────────────────────────────────────────────
  if (showOtp) {
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
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#1a5c9a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <ShieldCheck size={28} color="#fff" />
          </div>

          <h2 style={{ fontSize: 22, color: '#1c1a17', marginBottom: 8 }}>Verify your email</h2>
          <p style={{ fontSize: 13, color: '#9c9890', marginBottom: 28, lineHeight: 1.6 }}>
            Enter the 6-digit code we sent to<br />
            <strong style={{ color: '#1c1a17' }}>{email}</strong>
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                onPaste={i === 0 ? handleOtpPaste : undefined}
                style={{
                  width: 48, height: 56, textAlign: 'center',
                  fontSize: 22, fontWeight: 700, color: '#1c1a17',
                  border: digit ? '2px solid #1a5c9a' : '2px solid #e4e1d8',
                  borderRadius: 12, background: digit ? '#eef4fb' : '#faf9f7',
                  outline: 'none', transition: 'border 0.15s, background 0.15s',
                }}
              />
            ))}
          </div>

          {error && (
            <div style={{ background: '#fdeaea', color: '#d63b3b', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#e8f8ee', color: '#1f7a45', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16, border: '1px solid #cdeed8' }}>
              ✅ {success}
            </div>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.join('').length < 6}
            style={{
              width: '100%', padding: '13px', background: '#1a5c9a',
              color: '#fff', border: 'none', borderRadius: 12, fontSize: 15,
              fontWeight: 600, cursor: (loading || otp.join('').length < 6) ? 'not-allowed' : 'pointer',
              opacity: (loading || otp.join('').length < 6) ? 0.65 : 1,
              marginBottom: 12,
            }}
          >
            {loading ? '⏳ Verifying...' : 'Verify code'}
          </button>

          <button
            onClick={resendOtp}
            disabled={loading}
            style={{
              width: '100%', padding: '10px', border: 'none',
              background: 'transparent', color: '#1a5c9a', cursor: 'pointer',
              fontSize: 13, fontWeight: 500,
            }}
          >
            Resend code
          </button>

          <button
            onClick={() => { setShowOtp(false); setOtp(['', '', '', '', '', '']); setError(''); setSuccess(''); }}
            style={{
              width: '100%', padding: '8px', border: 'none',
              background: 'transparent', color: '#9c9890', cursor: 'pointer',
              fontSize: 12, marginTop: 4,
            }}
          >
            ← Back to sign up
          </button>
        </div>
      </div>
    );
  }

  // ── Auth Screen ───────────────────────────────────────────────────────────
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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#1a5c9a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Car size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, color: '#1c1a17', marginBottom: 4 }}>Driver Booking</h1>
          <p style={{ fontSize: 14, color: '#9c9890' }}>{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        <div style={{ display: 'flex', background: '#f1efe9', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
          {['Log in', 'Sign up'].map((label, i) => (
            <button
              key={label}
              onClick={() => { setIsLogin(i === 0); setError(''); setSuccess(''); }}
              style={{
                flex: 1, padding: '9px', borderRadius: 9, border: 'none',
                background: (isLogin ? i === 0 : i === 1) ? '#fff' : 'transparent',
                color: (isLogin ? i === 0 : i === 1) ? '#1c1a17' : '#9c9890',
                fontWeight: (isLogin ? i === 0 : i === 1) ? 600 : 400,
                cursor: 'pointer', fontSize: 14,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {!isLogin && (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5 }}>Full name</div>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c9890' }} />
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Maria Vizcarra" style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14, background: '#faf9f7', outline: 'none' }} />
              </div>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5 }}>I am a...</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  style={{
                    flex: 1, padding: '14px 10px', borderRadius: 12,
                    border: role === 'customer' ? '2px solid #1a5c9a' : '1px solid #e4e1d8',
                    background: role === 'customer' ? '#eef4fb' : '#faf9f7',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    cursor: 'pointer', transition: 'border 0.15s, background 0.15s',
                  }}
                >
                  <UserCircle size={22} color={role === 'customer' ? '#1a5c9a' : '#9c9890'} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: role === 'customer' ? '#1a5c9a' : '#4a4740' }}>Customer</span>
                  <span style={{ fontSize: 11, color: '#9c9890', textAlign: 'center' }}>I want to book a driver</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  style={{
                    flex: 1, padding: '14px 10px', borderRadius: 12,
                    border: role === 'driver' ? '2px solid #1a5c9a' : '1px solid #e4e1d8',
                    background: role === 'driver' ? '#eef4fb' : '#faf9f7',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    cursor: 'pointer', transition: 'border 0.15s, background 0.15s',
                  }}
                >
                  <Car size={22} color={role === 'driver' ? '#1a5c9a' : '#9c9890'} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: role === 'driver' ? '#1a5c9a' : '#4a4740' }}>Driver</span>
                  <span style={{ fontSize: 11, color: '#9c9890', textAlign: 'center' }}>I want to give rides</span>
                </button>
              </div>
            </div>
          </>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5 }}>Email</div>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c9890' }} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14, background: '#faf9f7', outline: 'none' }} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6b6760', marginBottom: 5 }}>Password</div>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c9890' }} />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px 36px', border: '1px solid #e4e1d8', borderRadius: 10, fontSize: 14, background: '#faf9f7', outline: 'none' }} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9c9890' }}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && <div style={{ background: '#fdeaea', color: '#d63b3b', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
        {success && <div style={{ background: '#e8f8ee', color: '#1f7a45', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16, border: '1px solid #cdeed8' }}>✅ {success}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', background: '#1a5c9a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ Please wait...' : isLogin ? 'Log in' : 'Create account'}
        </button>

        {isLogin && (
          <button type="button" onClick={resendVerification} style={{ width: '100%', marginTop: 12, padding: '10px', border: 'none', background: 'transparent', color: '#1a5c9a', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            Resend verification email
          </button>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9c9890', marginTop: 20 }}>
          By continuing, you agree to DriverLink's Terms of Service.
        </p>
      </div>
    </div>
  );
}