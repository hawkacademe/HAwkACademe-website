import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { Tick, Lock } from '../components/Icons.jsx';
import { AuthProvider, useAuth } from './auth.jsx';
import { api } from '../lib/api.js';
import { usePageMeta } from '../lib/hooks.js';
import { Spinner } from './ui.jsx';
import './admin.css';
import { BRAND_NAME } from '../lib/brand.js';

const input = { height: 48, border: '1.5px solid #D5DBE8', borderRadius: 6, padding: '0 14px', fontFamily: 'inherit', fontSize: 15, color: '#0A1530', background: '#ffffff', width: '100%' };

function LoginPanel() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || !pass) return setErr('Please enter your email and password.');
    setBusy(true);
    setErr('');
    try {
      const res = await api('/auth/login', { method: 'POST', body: { email: email.trim(), password: pass } });
      setUser(res.user);
      setPass('');
      navigate(res.user.mustChangePassword ? '/admin/account' : '/admin');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  }

  if (user === undefined) return <Spinner label="Checking your session…" />;
  if (user) {
    return (
      <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0B1D45', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={30} /></div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Signed in as {user.name}</h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#3E4860' }}>{user.email}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a className="a-btn" href="/admin">Open Admin Dashboard</a>
          <button type="button" className="a-ghost" onClick={logout}>Log out</button>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Admin login</h2>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#5A6378' }}>For HAwk ACademe staff only. Manage the blog, gallery, notices, timings, reviews and enquiries.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="f-email" style={{ fontSize: 13, fontWeight: 700 }}>Admin email</label>
        <input id="f-email" className="fld" type="email" autoComplete="username" value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }} style={input} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="f-pass" style={{ fontSize: 13, fontWeight: 700 }}>Password</label>
        <input id="f-pass" className="fld" type="password" autoComplete="current-password" value={pass} onChange={(e) => { setPass(e.target.value); setErr(''); }} style={input} />
      </div>
      {err && <div role="alert" className="a-err">{err}</div>}
      <button type="submit" className="btn-red" disabled={busy} style={{ height: 50, padding: '0 28px', border: 0, borderRadius: 4, background: '#D90A0A', color: '#ffffff', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, cursor: busy ? 'wait' : 'pointer' }}>
        {busy ? 'Logging in…' : 'Log in to Admin'}
      </button>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#5A6378' }}>
        Forgot your password? Ask the website developer to reset it. After 5 wrong attempts the account is locked for 15 minutes.
      </p>
    </form>
  );
}

export default function AdminLogin() {
  usePageMeta(`Admin Login | ${BRAND_NAME}`, `${BRAND_NAME} site administration.`);
  return (
    <AuthProvider>
      <PageHero compact crumb="Admin login" title="Admin Login" />
      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px 88px', display: 'flex', flexWrap: 'wrap', gap: 0 }}>
          <div className="hide-sm" style={{ flex: '1 1 340px', background: '#0B1D45', color: '#ffffff', padding: 40, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', overflow: 'hidden', borderRadius: '16px 0 0 16px' }}>
            <img src="/img/hero-pattern.webp" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <img src="/img/logo-480.webp" alt={`${BRAND_NAME} logo`} style={{ height: 34, width: 'auto', alignSelf: 'flex-start', background: '#ffffff', padding: '8px 12px', borderRadius: 8, boxSizing: 'content-box' }} />
              <div style={{ margin: 0, fontSize: 34, lineHeight: 1.15, fontWeight: 800 }}>Staff <span style={{ color: '#FF4A3A' }}>sign in</span></div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Write blog posts and add notices', 'Upload gallery photos and update timings', 'Read and export Contact-form enquiries'].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.5, color: '#D5DDF0' }}><span style={{ marginTop: 3, display: 'flex' }}><Tick /></span><span>{t}</span></li>
                ))}
              </ul>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 30, lineHeight: 1.1, marginTop: 8 }}>“Discipline today, Brighter tomorrow.”</div>
            </div>
          </div>
          <div style={{ flex: '1 1 380px', background: '#ffffff', padding: 40, display: 'flex', flexDirection: 'column', gap: 20, borderRadius: '0 16px 16px 0', boxShadow: '0 18px 40px rgba(11,29,69,.08)' }}>
            <LoginPanel />
          </div>
        </div>
      </section>
    </AuthProvider>
  );
}
