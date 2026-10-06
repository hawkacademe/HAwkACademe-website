import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdmin, Spinner, SectionHead, ConfirmButton, EmptyBox, Msg, Field, Badge, useFlash } from '../ui.jsx';
import { api, clearCache } from '../../lib/api.js';
import { fmtDate, isoDate } from '../../lib/format.js';

const CATS = [['BATCHES', 'Batches'], ['RESULTS', 'Results'], ['NOTICES', 'Notices']];
const blank = () => ({ title: '', text: '', category: 'NOTICES', date: isoDate(), link: '', pinned: false, published: true });

function NoticeForm({ initial, onCancel, onSaved }) {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  async function save() {
    setErr('');
    if (f.title.trim().length < 3) return setErr('Please enter a title (at least 3 characters).');
    setBusy(true);
    try {
      const body = { ...f, date: f.date };
      if (f.id) await api(`/admin/notices/${f.id}`, { method: 'PUT', body });
      else await api('/admin/notices', { method: 'POST', body });
      clearCache();
      onSaved(f.id ? 'Notice updated.' : 'Notice added. It is on the News page now.');
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="a-card">
      <h3 style={{ fontSize: 20 }}>{f.id ? 'Edit notice' : 'New notice'}</h3>
      <div className="a-grid">
        <Field label="Title" full>{(p) => <input {...p} className="a-in" maxLength={160} value={f.title} onChange={set('title')} autoFocus placeholder="e.g. New JEE batch starts 5 January" />}</Field>
        <Field label="Details (optional)" full>{(p) => <textarea {...p} className="a-in" rows={3} maxLength={1000} value={f.text} onChange={set('text')} />}</Field>
        <Field label="Type">{(p) => <select {...p} className="a-in" value={f.category} onChange={set('category')}>{CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>}</Field>
        <Field label="Date">{(p) => <input {...p} className="a-in" type="date" value={f.date} onChange={set('date')} />}</Field>
        <Field label="Link (optional)" full hint="A page on this site, such as /programs or /results, or a full https:// address.">{(p) => <input {...p} className="a-in" maxLength={200} value={f.link} onChange={set('link')} placeholder="/programs" />}</Field>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <label className="a-check"><input type="checkbox" checked={f.pinned} onChange={set('pinned')} /> Pin to the top</label>
        <label className="a-check"><input type="checkbox" checked={f.published} onChange={set('published')} /> Show on the website</label>
      </div>
      {err && <div className="a-err" role="alert">{err}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="a-btn" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
        <button type="button" className="a-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default function Notices() {
  const { data, error, loading, reload } = useAdmin('/admin/notices');
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState(params.get('new') ? blank() : null);
  const [ok, setOk] = useFlash();
  const [err, setErr] = useState('');
  const notices = data?.notices || [];

  const close = () => { setEditing(null); if (params.get('new')) setParams({}, { replace: true }); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Notices / News">
        {!editing && <button type="button" className="a-btn" onClick={() => setEditing(blank())}>+ New notice</button>}
        <a className="a-ghost" href="/news" target="_blank" rel="noopener">Open News page</a>
      </SectionHead>
      <p className="a-hint" style={{ margin: 0, fontSize: 14 }}>Notices appear on the News page, newest first. The latest four also show on the Home page.</p>
      <Msg ok={ok} err={err} />
      {editing && <NoticeForm key={editing.id || 'new'} initial={editing} onCancel={close} onSaved={(m) => { close(); setOk(m); reload(); }} />}
      <div className="a-card">
        {loading && !data && <Spinner />}
        {error && <div className="a-err" role="alert">{error.message}</div>}
        {data && notices.length === 0 && <EmptyBox>No notices yet.</EmptyBox>}
        {notices.length > 0 && (
          <div className="a-tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Date</th><th>Title</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {notices.map((n) => (
                  <tr key={n.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(n.date)}</td>
                    <td><b style={{ color: '#0A1530' }}>{n.title}</b>{n.pinned && <> <Badge tone="amber">Pinned</Badge></>}</td>
                    <td>{CATS.find(([k]) => k === n.category)?.[1]}</td>
                    <td>{n.published ? <Badge tone="green">Shown</Badge> : <Badge tone="grey">Hidden</Badge>}</td>
                    <td>
                      <div className="a-row-actions">
                        <button type="button" className="pill" onClick={() => { setEditing({ ...n, date: isoDate(n.date) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
                        <ConfirmButton onConfirm={async () => { try { await api(`/admin/notices/${n.id}`, { method: 'DELETE' }); clearCache(); setOk('Notice deleted.'); reload(); } catch (e) { setErr(e.message); } }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
