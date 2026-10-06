import { useState } from 'react';
import { useAdmin, Spinner, SectionHead, ConfirmButton, EmptyBox, Msg, Field, Badge, useFlash } from '../ui.jsx';
import { api, clearCache } from '../../lib/api.js';

const blank = () => ({ name: '', role: '', quote: '', published: true });

function ReviewForm({ initial, onCancel, onSaved }) {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  async function save() {
    setErr('');
    setBusy(true);
    try {
      if (f.id) await api(`/admin/reviews/${f.id}`, { method: 'PUT', body: f });
      else await api('/admin/reviews', { method: 'POST', body: f });
      clearCache();
      onSaved(f.id ? 'Review updated.' : 'Review added.');
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="a-card">
      <h3 style={{ fontSize: 20 }}>{f.id ? 'Edit review' : 'New review'}</h3>
      <div className="a-warn" role="note"><span>Only add a review with the person&apos;s permission. For a student under 18, get a parent&apos;s permission too.</span></div>
      <div className="a-grid">
        <Field label="Name">{(p) => <input {...p} className="a-in" maxLength={80} value={f.name} onChange={set('name')} autoFocus />}</Field>
        <Field label="Who they are (optional)" hint="e.g. Parent of a Class 12 student, or JEE 2025, AIR 340">{(p) => <input {...p} className="a-in" maxLength={120} value={f.role} onChange={set('role')} />}</Field>
        <Field label="Review" full hint={`${f.quote.length}/600`}>{(p) => <textarea {...p} className="a-in" rows={4} maxLength={600} value={f.quote} onChange={set('quote')} />}</Field>
      </div>
      <label className="a-check"><input type="checkbox" checked={f.published} onChange={set('published')} /> Show on the website</label>
      {err && <div className="a-err" role="alert">{err}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="a-btn" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
        <button type="button" className="a-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default function Reviews() {
  const { data, error, loading, reload, setData } = useAdmin('/admin/reviews');
  const [editing, setEditing] = useState(null);
  const [ok, setOk] = useFlash();
  const [err, setErr] = useState('');
  const reviews = data?.reviews || [];

  async function move(i, dir) {
    const next = [...reviews];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setData((d) => ({ ...d, reviews: next }));
    try {
      await api('/admin/reviews/reorder', { method: 'POST', body: { ids: next.map((r) => r.id) } });
      clearCache();
    } catch (e) { setErr(e.message); reload(); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Reviews">{!editing && <button type="button" className="a-btn" onClick={() => setEditing(blank())}>+ New review</button>}</SectionHead>
      <p className="a-hint" style={{ margin: 0, fontSize: 14 }}>Reviews from students and parents appear on the Home page (the first six, in this order).</p>
      <Msg ok={ok} err={err} />
      {editing && <ReviewForm key={editing.id || 'new'} initial={editing} onCancel={() => setEditing(null)} onSaved={(m) => { setEditing(null); setOk(m); reload(); }} />}
      <div className="a-card">
        {loading && !data && <Spinner />}
        {error && <div className="a-err" role="alert">{error.message}</div>}
        {data && reviews.length === 0 && <EmptyBox>No reviews yet.</EmptyBox>}
        {reviews.map((r, i) => (
          <div key={r.id} style={{ borderTop: i ? '1px solid #EEF1F6' : 0, paddingTop: i ? 16 : 0, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 320px' }}>
              <div style={{ fontWeight: 800 }}>{r.name} {r.published ? <Badge tone="green">Shown</Badge> : <Badge tone="grey">Hidden</Badge>}</div>
              {r.role && <div style={{ fontSize: 13, color: '#5A6378' }}>{r.role}</div>}
              <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.6, color: '#3E4860' }}>“{r.quote}”</p>
            </div>
            <div className="a-row-actions">
              <button type="button" className="pill" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
              <button type="button" className="pill" aria-label="Move down" disabled={i === reviews.length - 1} onClick={() => move(i, 1)}>↓</button>
              <button type="button" className="pill" onClick={() => { setEditing(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
              <ConfirmButton onConfirm={async () => { try { await api(`/admin/reviews/${r.id}`, { method: 'DELETE' }); clearCache(); setOk('Review deleted.'); reload(); } catch (e) { setErr(e.message); } }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
