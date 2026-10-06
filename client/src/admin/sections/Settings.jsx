import { useEffect, useState } from 'react';
import { useAdmin, Spinner, SectionHead, Msg, Field, useFlash } from '../ui.jsx';
import { api, clearCache } from '../../lib/api.js';

// Admin > Timings & highlights: office hours, batch details, Home numbers and contact details.
export default function Settings() {
  const { data, error, loading } = useAdmin('/admin/settings');
  const [s, setS] = useState(null);
  const [ok, setOk] = useFlash();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) setS(data.settings); }, [data]);
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (loading && !s) return <Spinner />;
  if (error) return <div className="a-err" role="alert">{error.message}</div>;
  if (!s) return null;

  const upd = (fn) => { setS((x) => fn(structuredClone(x))); setDirty(true); };
  const field = (k) => ({ value: s[k] || '', onChange: (e) => upd((x) => { x[k] = e.target.value; return x; }) });

  async function save() {
    setErr('');
    setBusy(true);
    try {
      const body = {
        phone: s.phone, whatsapp: (s.whatsapp || '').replace(/\D/g, ''), email: s.email, address: s.address, mapsLink: s.mapsLink,
        mapEmbed: s.mapEmbed, officeHours: s.officeHours.filter((h) => h.days || h.hours), responseTime: s.responseTime,
        enquiryEmail: s.enquiryEmail, social: s.social, highlights: s.highlights, programs: s.programs
      };
      const r = await api('/admin/settings', { method: 'PUT', body });
      setS(r.settings);
      setDirty(false);
      clearCache();
      setOk('Saved. The website shows the new details now (refresh any open pages).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErr(e.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally { setBusy(false); }
  }

  const saveBar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button type="button" className="a-btn" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save all changes'}</button>
      {dirty && <span style={{ fontSize: 13, color: '#7A5300', fontWeight: 600 }}>Unsaved changes</span>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Timings & highlights" />
      <Msg ok={ok} err={err} />

      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Office hours</h3>
        <p className="a-hint" style={{ margin: 0 }}>Shown on the Contact page and in the footer.</p>
        {s.officeHours.map((h, i) => (
          <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}><Field label="Days">{(p) => <input {...p} className="a-in" maxLength={60} value={h.days} placeholder="Monday to Saturday" onChange={(e) => upd((x) => { x.officeHours[i].days = e.target.value; return x; })} />}</Field></div>
            <div style={{ flex: '1 1 200px' }}><Field label="Hours">{(p) => <input {...p} className="a-in" maxLength={60} value={h.hours} placeholder="9:00 am – 7:00 pm" onChange={(e) => upd((x) => { x.officeHours[i].hours = e.target.value; return x; })} />}</Field></div>
            <button type="button" className="a-ghost sm" onClick={() => upd((x) => { x.officeHours.splice(i, 1); return x; })} aria-label={`Remove row ${i + 1}`}>Remove</button>
          </div>
        ))}
        {s.officeHours.length < 7 && <div><button type="button" className="a-ghost sm" onClick={() => upd((x) => { x.officeHours.push({ days: '', hours: '' }); return x; })}>+ Add a row</button></div>}
        <Field label="Usual reply time for enquiries" hint="Completes the sentence “We usually reply …”, e.g. “within 1 working day”.">{(p) => <input {...p} className="a-in" maxLength={80} {...field('responseTime')} />}</Field>
      </div>

      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Batch details (Programs page)</h3>
        {s.programs.map((pr, i) => (
          <fieldset key={pr.key} style={{ border: '1px solid #E7EAF0', borderRadius: 10, padding: '16px 18px', margin: 0 }}>
            <legend style={{ fontWeight: 800, padding: '0 6px' }}>{pr.name}</legend>
            <div className="a-grid">
              {[['classes', 'Classes'], ['duration', 'Duration'], ['batchSize', 'Batch size'], ['mode', 'Mode (online / offline)']].map(([k, l]) => (
                <Field key={k} label={l}>{(p) => <input {...p} className="a-in" maxLength={80} value={pr[k] || ''} onChange={(e) => upd((x) => { x.programs[i][k] = e.target.value; return x; })} />}</Field>
              ))}
              <Field label="Batch timings" full hint="One batch per line, e.g. “Morning: Mon, Wed, Fri 7–9 am”.">{(p) => <textarea {...p} className="a-in" rows={3} maxLength={300} value={pr.timings || ''} onChange={(e) => upd((x) => { x.programs[i].timings = e.target.value; return x; })} />}</Field>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Highlight numbers (Home and About)</h3>
        <div className="a-grid">
          {s.highlights.map((h, i) => (
            <fieldset key={i} style={{ border: '1px solid #E7EAF0', borderRadius: 10, padding: '12px 14px', margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <legend style={{ fontWeight: 800, padding: '0 6px', fontSize: 13 }}>Number {i + 1}</legend>
              <Field label="Number">{(p) => <input {...p} className="a-in" maxLength={20} value={h.value} onChange={(e) => upd((x) => { x.highlights[i].value = e.target.value; return x; })} />}</Field>
              <Field label="Label">{(p) => <input {...p} className="a-in" maxLength={60} value={h.label} onChange={(e) => upd((x) => { x.highlights[i].label = e.target.value; return x; })} />}</Field>
            </fieldset>
          ))}
        </div>
        <p className="a-hint" style={{ margin: 0 }}>Number 2 also appears on the photo at the top of the Home page.</p>
      </div>

      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Contact details</h3>
        <div className="a-grid">
          <Field label="Phone number">{(p) => <input {...p} className="a-in" type="tel" maxLength={60} {...field('phone')} />}</Field>
          <Field label="WhatsApp number" hint="Digits only with country code, e.g. 919876543210. Used by the green WhatsApp button.">{(p) => <input {...p} className="a-in" inputMode="numeric" maxLength={20} {...field('whatsapp')} />}</Field>
          <Field label="Email shown on the website">{(p) => <input {...p} className="a-in" type="email" maxLength={120} {...field('email')} />}</Field>
          <Field label="Send Contact-form enquiries to" hint="Every new enquiry is emailed here.">{(p) => <input {...p} className="a-in" type="email" maxLength={120} {...field('enquiryEmail')} />}</Field>
          <Field label="Office address" full>{(p) => <textarea {...p} className="a-in" rows={2} maxLength={300} {...field('address')} />}</Field>
          <Field label="Google Maps link" full hint="In Google Maps: Share > Copy link.">{(p) => <input {...p} className="a-in" type="url" maxLength={500} {...field('mapsLink')} placeholder="https://maps.app.goo.gl/…" />}</Field>
          <Field label="Google Maps embed code" full hint="In Google Maps: Share > Embed a map > Copy HTML, and paste it here.">{(p) => <textarea {...p} className="a-in" rows={3} maxLength={2000} {...field('mapEmbed')} />}</Field>
        </div>
      </div>

      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Social media</h3>
        <p className="a-hint" style={{ margin: 0 }}>Full page addresses starting with https://. Icons show only for the links filled in.</p>
        <div className="a-grid">
          {[['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn']].map(([k, l]) => (
            <Field key={k} label={l}>{(p) => <input {...p} className="a-in" type="url" maxLength={200} value={s.social?.[k] || ''} placeholder="https://" onChange={(e) => upd((x) => { x.social = { ...x.social, [k]: e.target.value }; return x; })} />}</Field>
          ))}
        </div>
      </div>

      {saveBar}
    </div>
  );
}
