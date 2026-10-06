import { useRef, useState } from 'react';
import { useAdmin, Spinner, SectionHead, ConfirmButton, EmptyBox, Msg, Field, useFlash } from '../ui.jsx';
import { api, clearCache } from '../../lib/api.js';

const CATS = ['Classroom', 'Seminars', 'Activities', 'Celebrations', 'Campus'];
const MAX_MB = 10;

function Uploader({ onDone, onError }) {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('Classroom');
  const [caption, setCaption] = useState('');
  const [alt, setAlt] = useState('');
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const input = useRef(null);

  function pick(list) {
    const imgs = [...list].filter((f) => /^image\//.test(f.type));
    const big = imgs.filter((f) => f.size > MAX_MB * 1024 * 1024);
    if (big.length) onError(`${big.length === 1 ? 'One photo is' : `${big.length} photos are`} larger than ${MAX_MB} MB and ${big.length === 1 ? 'was' : 'were'} left out.`);
    setFiles(imgs.filter((f) => f.size <= MAX_MB * 1024 * 1024).slice(0, 20));
  }

  async function upload() {
    if (!files.length) return onError('Please choose at least one photo.');
    setBusy(true);
    try {
      // Send in small groups so a slow connection does not time out.
      for (let i = 0; i < files.length; i += 4) {
        const form = new FormData();
        files.slice(i, i + 4).forEach((f) => form.append('files', f));
        form.append('category', category);
        form.append('caption', caption);
        form.append('alt', alt);
        await api('/admin/gallery', { method: 'POST', form });
      }
      onDone(`${files.length} photo${files.length === 1 ? '' : 's'} added to the gallery.`);
      setFiles([]); setCaption(''); setAlt('');
    } catch (e) { onError(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="a-card">
      <h3 style={{ fontSize: 18 }}>Add photos</h3>
      <div className={`a-drop${over ? ' over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files); }}>
        <p style={{ margin: '0 0 12px' }}>Drag photos here, or</p>
        <button type="button" className="a-ghost sm" onClick={() => input.current?.click()}>Choose photos</button>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple hidden onChange={(e) => { pick(e.target.files); e.target.value = ''; }} />
        <p className="a-hint" style={{ margin: '12px 0 0' }}>JPG, PNG or WebP, up to {MAX_MB} MB each, up to 20 at a time. Photos are resized and compressed automatically.</p>
      </div>
      {files.length > 0 && (
        <>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{files.length} photo{files.length === 1 ? '' : 's'} ready: {files.map((f) => f.name).join(', ')}</div>
          <div className="a-grid">
            <Field label="Category">{(p) => <select {...p} className="a-in" value={category} onChange={(e) => setCategory(e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>}</Field>
            <Field label="Caption (optional)" hint="Shown under the photo.">{(p) => <input {...p} className="a-in" maxLength={140} value={caption} onChange={(e) => setCaption(e.target.value)} />}</Field>
            <Field label="Describe the photo (alt text)" full hint="For people using screen readers, e.g. “Students solving problems on the board”. You can edit each photo later.">{(p) => <input {...p} className="a-in" maxLength={200} value={alt} onChange={(e) => setAlt(e.target.value)} />}</Field>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="a-btn" disabled={busy} onClick={upload}>{busy ? 'Uploading…' : 'Upload'}</button>
            <button type="button" className="a-ghost" disabled={busy} onClick={() => setFiles([])}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

function PhotoCard({ photo, index, total, onMove, onSaved, onDelete, onError }) {
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ caption: photo.caption, alt: photo.alt, category: photo.category });
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      await api(`/admin/gallery/${photo.id}`, { method: 'PUT', body: f });
      setEdit(false);
      onSaved();
    } catch (e) { onError(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="a-photo">
      <img src={photo.thumbUrl} alt={photo.alt} loading="lazy" />
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, flexGrow: 1 }}>
        {edit ? (
          <>
            <Field label="Caption">{(p) => <input {...p} className="a-in" maxLength={140} value={f.caption} onChange={(e) => setF({ ...f, caption: e.target.value })} />}</Field>
            <Field label="Alt text">{(p) => <input {...p} className="a-in" maxLength={200} value={f.alt} onChange={(e) => setF({ ...f, alt: e.target.value })} />}</Field>
            <Field label="Category">{(p) => <select {...p} className="a-in" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>}</Field>
            <div className="a-row-actions">
              <button type="button" className="pill on" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
              <button type="button" className="pill" onClick={() => { setF({ caption: photo.caption, alt: photo.alt, category: photo.category }); setEdit(false); }}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{photo.caption || <span style={{ color: '#8A93A8' }}>No caption</span>}</div>
            <div style={{ fontSize: 12, color: '#5A6378' }}>{photo.category}{!photo.alt && <span style={{ color: '#A80707', fontWeight: 700 }}> · needs alt text</span>}</div>
            <div className="a-row-actions" style={{ marginTop: 'auto' }}>
              <button type="button" className="pill" aria-label={`Move ${photo.caption || 'photo'} earlier`} disabled={index === 0} onClick={() => onMove(index, -1)}>←</button>
              <button type="button" className="pill" aria-label={`Move ${photo.caption || 'photo'} later`} disabled={index === total - 1} onClick={() => onMove(index, 1)}>→</button>
              <button type="button" className="pill" onClick={() => setEdit(true)}>Edit</button>
              <ConfirmButton label="Remove" confirmLabel="Yes, remove" onConfirm={onDelete} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function GalleryAdmin() {
  const { data, error, loading, reload, setData } = useAdmin('/admin/gallery');
  const [ok, setOk] = useFlash();
  const [err, setErr] = useState('');
  const photos = data?.photos || [];

  const done = (m) => { clearCache(); setErr(''); setOk(m); reload(); };
  async function move(i, dir) {
    const next = [...photos];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setData((d) => ({ ...d, photos: next }));
    try {
      await api('/admin/gallery/reorder', { method: 'POST', body: { ids: next.map((p) => p.id) } });
      clearCache();
    } catch (e) { setErr(e.message); reload(); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Gallery"><a className="a-ghost" href="/gallery" target="_blank" rel="noopener">Open gallery page</a></SectionHead>
      <Msg ok={ok} err={err} />
      <Uploader onDone={done} onError={(m) => { setOk(''); setErr(m); }} />
      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Photos on the website ({photos.length})</h3>
        <p className="a-hint" style={{ margin: 0 }}>The order here is the order on the Gallery page. Use the arrows to move a photo.</p>
        {loading && !data && <Spinner />}
        {error && <div className="a-err" role="alert">{error.message}</div>}
        {data && photos.length === 0 && <EmptyBox>No photos yet. Add some above.</EmptyBox>}
        <div className="a-photos">
          {photos.map((p, i) => (
            <PhotoCard key={p.id} photo={p} index={i} total={photos.length} onMove={move} onError={setErr}
              onSaved={() => done('Photo details saved.')}
              onDelete={async () => { try { await api(`/admin/gallery/${p.id}`, { method: 'DELETE' }); done('Photo removed.'); } catch (e) { setErr(e.message); } }} />
          ))}
        </div>
      </div>
    </div>
  );
}
