import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHead, Msg, Field } from '../ui.jsx';
import { useAuth } from '../auth.jsx';
import { api } from '../../lib/api.js';

function strength(p) {
  let s = 0;
  if (p.length >= 10) s++;
  if (p.length >= 14) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][Math.min(s, 5)];
}

export default function Account() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [pw, setPw] = useState({ current: '', next: '', again: '' });
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function saveName() {
    setErr(''); setOk('');
    try {
      const r = await api('/auth/profile', { method: 'PUT', body: { name } });
      setUser(r.user);
      setOk('Name saved.');
    } catch (e) { setErr(e.message); }
  }

  async function changePassword(e) {
    e.preventDefault();
    setErr(''); setOk('');
    if (pw.next.length < 10) return setErr('The new password must be at least 10 characters.');
    if (pw.next !== pw.again) return setErr('The two new passwords do not match.');
    setBusy(true);
    try {
      const r = await api('/auth/password', { method: 'POST', body: { current: pw.current, next: pw.next } });
      const first = user.mustChangePassword;
      setUser(r.user);
      setPw({ current: '', next: '', again: '' });
      setOk('Password changed. Any other devices signed in with the old password have been signed out.');
      if (first) setTimeout(() => navigate('/admin'), 1500);
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Account" />
      {user.mustChangePassword && (
        <div className="a-warn" role="alert"><span><b>Please choose your own password.</b> You signed in with a temporary password. Change it below to open the rest of the admin panel.</span></div>
      )}
      <Msg ok={ok} err={err} />
      <form className="a-card" onSubmit={changePassword}>
        <h3 style={{ fontSize: 18 }}>Change password</h3>
        <input type="email" autoComplete="username" value={user.email} readOnly hidden />
        <div className="a-grid">
          <Field label="Current password" full>{(p) => <input {...p} className="a-in" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />}</Field>
          <Field label="New password" hint={pw.next ? `Strength: ${strength(pw.next)}. At least 10 characters; a short sentence is easy to remember.` : 'At least 10 characters. A short sentence is easy to remember and hard to guess.'}>
            {(p) => <input {...p} className="a-in" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />}
          </Field>
          <Field label="New password again">{(p) => <input {...p} className="a-in" type="password" autoComplete="new-password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} />}</Field>
        </div>
        <div><button type="submit" className="a-btn" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button></div>
      </form>
      {!user.mustChangePassword && (
        <div className="a-card">
          <h3 style={{ fontSize: 18 }}>Your details</h3>
          <div className="a-grid">
            <Field label="Name">{(p) => <input {...p} className="a-in" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />}</Field>
            <Field label="Login email" hint="Ask the developer to change the login email.">{(p) => <input {...p} className="a-in" value={user.email} readOnly />}</Field>
          </div>
          <div><button type="button" className="a-ghost" onClick={saveName}>Save name</button></div>
        </div>
      )}
      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Security tips</h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.8, color: '#3E4860' }}>
          <li>Do not share your admin password. Each person gets their own login (up to 2).</li>
          <li>Log out when you use a shared or office computer.</li>
          <li>You are signed out automatically after 2 hours without activity.</li>
        </ul>
      </div>
    </div>
  );
}
