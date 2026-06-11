import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const blue   = '#1565c0';
const green  = '#2e7d32';

/* ── Fake registered users for demo ── */
const DEMO_USERS = [
  { email: 'siri@sky.com', password: 'siri123', name: 'Siri' },
  { email: 'demo@sky.com', password: 'demo123', name: 'Demo User' },
];

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a237e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 16px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: 440,
  },
  logo: {
    textAlign: 'center',
    marginBottom: 28,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: -1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoSub: {
    fontSize: 13,
    color: '#90caf9',
    marginTop: 6,
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '32px 32px',
    boxShadow: '0 24px 60px rgba(0,0,0,.25)',
  },
  tabRow: {
    display: 'flex',
    marginBottom: 28,
    background: '#f0f4ff',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    padding: '9px 0',
    borderRadius: 7,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: '#888',
    transition: 'all .15s',
  },
  tabActive: {
    background: '#fff',
    color: blue,
    boxShadow: '0 1px 6px rgba(21,101,192,.15)',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    marginBottom: 6,
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid #e3e8f5',
    fontSize: 14,
    color: '#1a1a2e',
    background: '#fafbff',
    marginBottom: 14,
    outline: 'none',
    transition: 'border .15s',
    boxSizing: 'border-box',
  },
  btnPrimary: {
    width: '100%',
    padding: '13px 0',
    borderRadius: 10,
    background: blue,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    marginTop: 4,
    transition: 'opacity .15s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0',
    color: '#bbb',
    fontSize: 12,
  },
  divLine: { flex: 1, height: 1, background: '#e3e8f5' },
  btnGoogle: {
    width: '100%',
    padding: '12px 0',
    borderRadius: 10,
    background: '#fff',
    color: '#333',
    fontSize: 14,
    fontWeight: 600,
    border: '1.5px solid #e3e8f5',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
    transition: 'border .15s',
  },
  btnGuest: {
    width: '100%',
    padding: '12px 0',
    borderRadius: 10,
    background: '#f5f7ff',
    color: blue,
    fontSize: 14,
    fontWeight: 600,
    border: '1.5px solid #c5d5f5',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'border .15s',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 8,
    marginBottom: 14,
    border: '1px solid #ffcdd2',
  },
  success: {
    background: '#e8f5e9',
    color: green,
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 8,
    marginBottom: 14,
    border: '1px solid #a5d6a7',
  },
  hint: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 1.6,
  },
};

/* Google "G" SVG icon */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

export default function AuthPage({ onAuth }) {
  const { login } = useAuth();
  const [tab,      setTab]      = useState('login');   // 'login' | 'signup'
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [msg,      setMsg]      = useState('');
  const [loading,  setLoading]  = useState(false);

  /* registered users stored in memory for this session */
  const [registered, setRegistered] = useState([...DEMO_USERS]);

  function reset() { setError(''); setMsg(''); }

  function handleLogin(e) {
    e.preventDefault();
    reset();
    if (!email || !password) return setError('Please fill in all fields.');
    const found = registered.find(u => u.email === email && u.password === password);
    if (!found) return setError('Incorrect email or password.');
    setLoading(true);
    setTimeout(() => {
      login({ name: found.name, email: found.email, avatar: found.name[0].toUpperCase() });
      setLoading(false);
      onAuth();
    }, 800);
  }

  function handleSignup(e) {
    e.preventDefault();
    reset();
    if (!name || !email || !password || !confirm) return setError('Please fill in all fields.');
    if (password.length < 6)   return setError('Password must be at least 6 characters.');
    if (password !== confirm)  return setError('Passwords do not match.');
    if (registered.find(u => u.email === email)) return setError('Email already registered. Please log in.');
    const newUser = { name, email, password };
    setRegistered(prev => [...prev, newUser]);
    setLoading(true);
    setTimeout(() => {
      login({ name, email, avatar: name[0].toUpperCase() });
      setLoading(false);
      onAuth();
    }, 800);
  }

  function handleGoogle() {
    setLoading(true);
    setTimeout(() => {
      login({ name: 'Google User', email: 'google@gmail.com', avatar: 'G', provider: 'google' });
      setLoading(false);
      onAuth();
    }, 700);
  }

  function handleGuest() {
    login({ name: 'Guest', email: '', avatar: '?', guest: true });
    onAuth();
  }

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoText}>
            <i className="ti ti-plane-departure" style={{ fontSize: 30 }} />
            SkyCompare
          </div>
          <div style={s.logoSub}>India's smartest flight comparison tool</div>
        </div>

        {/* Card */}
        <div style={s.card}>

          {/* Tabs */}
          <div style={s.tabRow}>
            {[['login','Sign In'],['signup','Create Account']].map(([v,l]) => (
              <button key={v} style={{ ...s.tab, ...(tab === v ? s.tabActive : {}) }}
                onClick={() => { setTab(v); reset(); }}>
                {l}
              </button>
            ))}
          </div>

          {error && <div style={s.error}>⚠️ {error}</div>}
          {msg   && <div style={s.success}>✅ {msg}</div>}

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <label style={s.label}>Email Address</label>
              <input style={s.input} type="email" placeholder="you@email.com"
                value={email} onChange={e => setEmail(e.target.value)} />

              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} />

              <button style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)} />

              <label style={s.label}>Email Address</label>
              <input style={s.input} type="email" placeholder="you@email.com"
                value={email} onChange={e => setEmail(e.target.value)} />

              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Min. 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} />

              <label style={s.label}>Confirm Password</label>
              <input style={s.input} type="password" placeholder="Repeat your password"
                value={confirm} onChange={e => setConfirm(e.target.value)} />

              <button style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account →'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div style={s.divider}>
            <div style={s.divLine} />
            or continue with
            <div style={s.divLine} />
          </div>

          {/* Google */}
          <button style={s.btnGoogle} onClick={handleGoogle} disabled={loading}>
            <GoogleIcon /> Continue with Google
          </button>

          {/* Guest */}
          <button style={s.btnGuest} onClick={handleGuest}>
            <i className="ti ti-user" style={{ fontSize: 16 }} /> Continue as Guest
          </button>

          {/* Demo hint */}
          <div style={s.hint}>
            Demo credentials: <strong>siri@sky.com</strong> / <strong>siri123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
