import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHero, { Eyebrow } from '../components/PageHero.jsx';
import Turnstile from '../components/Turnstile.jsx';
import { Arrow, ChevronDown, Pin, Phone, Mail, Clock, Social } from '../components/Icons.jsx';
import { useSite } from '../lib/site.jsx';
import { usePathMeta } from '../lib/hooks.js';
import { api } from '../lib/api.js';
import { telHref } from '../lib/format.js';
import { CENTRES } from '../content/centres.js';
import { CONTACT_FAQS as FAQS } from '../content/faqs.js';
import { PROGRAMS } from '../content/programs.jsx';

const CLASSES = [['8', 'Class 8'], ['9', 'Class 9'], ['10', 'Class 10'], ['11', 'Class 11'], ['12', 'Class 12'], ['dropper', 'Dropper']];


const label = { fontSize: 13, fontWeight: 700 };
const input = { height: 48, border: '1.5px solid #D5DBE8', borderRadius: 6, padding: '0 14px', fontFamily: 'inherit', fontSize: 15, color: '#0A1530', background: '#ffffff', width: '100%' };
const errText = { fontSize: 13, color: '#B00808', fontWeight: 600 };
const infoCard = { background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 12, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 8px 22px rgba(11,29,69,.06)' };
const infoIcon = { width: 46, height: 46, flexShrink: 0, borderRadius: 12, background: '#FFECEC', color: '#D90A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const infoLabel = { fontSize: 12, fontWeight: 800, letterSpacing: '.14em', color: '#5A6378' };
const infoValue = { fontSize: 15, lineHeight: 1.5, fontWeight: 600, overflowWrap: 'anywhere', color: '#0A1530' };

const EMPTY = { name: '', phone: '', email: '', studentClass: '', program: '', centre: '', message: '', website: '' };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Please enter the student name.';
  const digits = f.phone.replace(/\D/g, '');
  if (!/^[+()\-\s0-9]{8,20}$/.test(f.phone.trim()) || digits.length < 10) e.phone = 'Please enter a valid phone number.';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please enter a valid email, or leave it empty.';
  return e;
}

function Info({ icon, title, children }) {
  return (
    <div className="card" style={infoCard}>
      <div style={infoIcon}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={infoLabel}>{title}</div>
        <div style={infoValue}>{children}</div>
      </div>
    </div>
  );
}

export default function Contact() {
  usePathMeta('/contact');
  const site = useSite();
  const [params] = useSearchParams();
  const preProgram = PROGRAMS.some((p) => p.key === params.get('program')) ? params.get('program') : '';
  const [f, setF] = useState({ ...EMPTY, program: preProgram });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle' }); // idle | sending | sent | error
  const [token, setToken] = useState('');
  const [faq, setFaq] = useState(0);
  const startedAt = useRef(Date.now());
  const formRef = useRef(null);

  const set = (k) => (e) => { setF((x) => ({ ...x, [k]: e.target.value })); if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined })); };
  const fieldProps = (k) => ({ 'aria-invalid': errors[k] ? 'true' : undefined, 'aria-describedby': errors[k] ? `e-${k}` : undefined });

  async function submit(e) {
    e.preventDefault();
    const v = validate(f);
    setErrors(v);
    if (Object.keys(v).length) {
      formRef.current?.querySelector(`#f-${Object.keys(v)[0]}`)?.focus();
      return;
    }
    if (site.turnstileSiteKey && !token) {
      setStatus({ state: 'error', message: 'Please complete the "I am human" check.' });
      return;
    }
    setStatus({ state: 'sending' });
    try {
      const programName = PROGRAMS.find((p) => p.key === f.program)?.name || f.program;
      const className = CLASSES.find(([k]) => k === f.studentClass)?.[1] || f.studentClass;
      const centreName = CENTRES.find((c) => c.key === f.centre)?.city || f.centre;
      const res = await api('/enquiries', { method: 'POST', body: { ...f, program: programName, studentClass: className, centre: centreName, startedAt: startedAt.current, turnstileToken: token } });
      setStatus({ state: 'sent', ref: res.ref, name: f.name });
      window.dispatchEvent(new CustomEvent('ha:enquiry-sent', { detail: { program: programName } })); // analytics conversion
      window.scrollTo({ top: formRef.current?.closest('section')?.offsetTop - 100 || 0, behavior: 'smooth' });
    } catch (err) {
      if (err.field) setErrors({ [err.field]: err.message });
      setStatus({ state: 'error', message: err.message });
    }
  }

  function again() {
    setF({ ...EMPTY });
    setErrors({});
    setToken('');
    startedAt.current = Date.now();
    setStatus({ state: 'idle' });
  }

  const socials = ['youtube', 'instagram', 'linkedin', 'facebook'].filter((k) => site.social?.[k]);

  return (
    <>
      <PageHero crumb="Contact" title={<>Let&apos;s Talk About <span style={{ color: '#FF4A3A' }}>Your Goals</span></>}
        intro="Questions about programs, batches or admission tests? Send us a message or visit a centre and our team will guide you." />

      <section id="enquiry" style={{ background: '#F6F8FC', scrollMarginTop: 120 }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px', display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
          <div style={{ flex: '3 1 520px', minWidth: 0, background: '#ffffff', border: '1px solid #E7EAF0', borderTop: '4px solid #D90A0A', borderRadius: 14, padding: 32, boxShadow: '0 18px 40px rgba(11,29,69,.08)' }}>
            {status.state !== 'sent' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Eyebrow>ENQUIRY FORM</Eyebrow>
                  <h2 className="h2" style={{ margin: 0, fontSize: 34, lineHeight: 1.15, fontWeight: 800 }}>Send us a <span style={{ color: '#D90A0A' }}>message</span></h2>
                </div>
                <form ref={formRef} onSubmit={submit} noValidate style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 18 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="f-name" style={label}>Student name <span aria-hidden="true" style={{ color: '#D90A0A' }}>*</span></label>
                    <input id="f-name" className="fld" type="text" required maxLength={80} autoComplete="name" placeholder="Full name" value={f.name} onChange={set('name')} style={input} {...fieldProps('name')} />
                    {errors.name && <span id="e-name" style={errText}>{errors.name}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="f-phone" style={label}>Parent / guardian phone <span aria-hidden="true" style={{ color: '#D90A0A' }}>*</span></label>
                    <input id="f-phone" className="fld" type="tel" required maxLength={20} autoComplete="tel" inputMode="tel" placeholder="+91" value={f.phone} onChange={set('phone')} style={input} {...fieldProps('phone')} />
                    {errors.phone && <span id="e-phone" style={errText}>{errors.phone}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="f-email" style={label}>Email</label>
                    <input id="f-email" className="fld" type="email" maxLength={120} autoComplete="email" placeholder="you@example.com" value={f.email} onChange={set('email')} style={input} {...fieldProps('email')} />
                    {errors.email && <span id="e-email" style={errText}>{errors.email}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="f-studentClass" style={label}>Current class</label>
                    <select id="f-studentClass" className="fld" value={f.studentClass} onChange={set('studentClass')} style={input}>
                      <option value="">Select class</option>
                      {CLASSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="f-program" style={label}>Program of interest</label>
                    <select id="f-program" className="fld" value={f.program} onChange={set('program')} style={input}>
                      <option value="">Select program</option>
                      {PROGRAMS.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="f-centre" style={label}>Preferred centre</label>
                    <select id="f-centre" className="fld" value={f.centre} onChange={set('centre')} style={input}>
                      <option value="">Select centre</option>
                      {CENTRES.map((c) => <option key={c.key} value={c.key}>{c.city}</option>)}
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1' }}>
                    <label htmlFor="f-message" style={label}>Message</label>
                    <textarea id="f-message" className="fld" rows={4} maxLength={2000} placeholder="Tell us how we can help" value={f.message} onChange={set('message')} style={{ ...input, height: 'auto', padding: '12px 14px', resize: 'vertical' }} />
                  </div>
                  {/* Spam trap: hidden from people, bots fill it in */}
                  <div className="hp" aria-hidden="true">
                    <label htmlFor="f-website">Leave this empty</label>
                    <input id="f-website" type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
                  </div>
                  <Turnstile siteKey={site.turnstileSiteKey} onToken={setToken} />
                  {status.state === 'error' && (
                    <div role="alert" style={{ gridColumn: '1 / -1', background: '#FDECEC', border: '1px solid #F3B7B7', color: '#8E0A0A', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontWeight: 600 }}>{status.message}</div>
                  )}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
                    <button className="btn-red" type="submit" disabled={status.state === 'sending'} style={{ height: 52, padding: '0 28px', border: 0, borderRadius: 4, background: '#D90A0A', color: '#ffffff', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, cursor: status.state === 'sending' ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, opacity: status.state === 'sending' ? 0.75 : 1 }}>
                      {status.state === 'sending' ? 'Sending…' : <>Submit Enquiry <Arrow size={18} /></>}
                    </button>
                    {site.responseTime && <span style={{ fontSize: 13, color: '#5A6378' }}>We usually reply {site.responseTime}.</span>}
                  </div>
                  <p style={{ gridColumn: '1 / -1', margin: 0, fontSize: 12, lineHeight: 1.5, color: '#5A6378' }}>
                    We use these details only to reply to your enquiry (see our <a href="/privacy" style={{ textDecoration: 'underline' }}>Privacy Policy</a>). If the student is under 18, please send this as a parent or guardian, or with their consent. <span aria-hidden="true" style={{ color: '#D90A0A' }}>*</span> Required.
                  </p>
                </form>
              </div>
            ) : (
              <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, padding: '40px 12px' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#D90A0A', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg className="ico" viewBox="0 0 24 24" style={{ width: 36, height: 36, strokeWidth: 2.4 }} aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </div>
                <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>Thank you, we have your message</h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3E4860', maxWidth: 460 }}>
                  Our team will contact you on the phone number you shared{site.responseTime ? `, usually ${site.responseTime}` : ''}. Your reference is <strong style={{ color: '#0A1530' }}>{status.ref}</strong>.
                </p>
                <button type="button" className="pill" onClick={again}>Send another enquiry</button>
              </div>
            )}
          </div>

          <div style={{ flex: '2 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CENTRES.map((c) => (
              <Info key={c.key} icon={<Pin size={22} />} title={c.tag}>
                {c.address}
                {c.mapsLink && <><br /><a href={c.mapsLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>Get directions</a></>}
              </Info>
            ))}
            {site.phone && <Info icon={<Phone size={22} />} title="CALL US"><a href={telHref(site.phone)} style={{ color: '#0A1530' }}>{site.phone}</a></Info>}
            {site.email && <Info icon={<Mail size={22} />} title="EMAIL US"><a href={`mailto:${site.email}`} style={{ color: '#0A1530' }}>{site.email}</a></Info>}
            {site.officeHours?.length > 0 && (
              <Info icon={<Clock size={22} />} title="OFFICE HOURS">
                {site.officeHours.map((h, i) => <div key={i}>{h.days}: {h.hours}</div>)}
              </Info>
            )}
            {socials.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, marginRight: 6 }}>Follow us</span>
                {socials.map((k) => {
                  const Icon = Social[k];
                  return (
                    <a key={k} href={site.social[k]} target="_blank" rel="noopener noreferrer" aria-label={k[0].toUpperCase() + k.slice(1)} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1530', border: '1.5px solid #E7EAF0', borderRadius: '50%', background: '#ffffff' }}>
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="centres" style={{ background: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Eyebrow>VISIT US</Eyebrow>
            <h2 className="h2" style={{ margin: 0, fontSize: 40, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-.015em' }}>Our <span style={{ color: '#D90A0A' }}>Centres</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
            {CENTRES.map((c) => (
              <div key={c.key} className="card" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #E7EAF0', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
                {c.mapEmbed ? (
                  <iframe title={`Map showing the HAwk ACademe ${c.city} centre`} src={c.mapEmbed} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                    style={{ display: 'block', width: '100%', height: 280, border: 0, background: '#F6F8FC' }} />
                ) : (
                  <img src={c.img} alt={c.alt} width="960" height="520" loading="lazy" style={{ display: 'block', width: '100%', height: 150, objectFit: 'cover' }} />
                )}
                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', color: '#D90A0A' }}>{c.tag}</div>
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{c.city}</h3>
                  <div style={{ fontSize: 15, lineHeight: 1.55, color: '#3E4860' }}>{c.address}</div>
                  {site.phone && <a href={telHref(site.phone)} style={{ fontSize: 15, fontWeight: 700, color: '#0A1530' }}>{site.phone}</a>}
                  {c.mapsLink && (
                    <a className="btn-red" href={c.mapsLink} target="_blank" rel="noopener noreferrer"
                      style={{ marginTop: 'auto', alignSelf: 'flex-start', minHeight: 44, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 18px', background: '#D90A0A', color: '#ffffff', fontWeight: 700, fontSize: 14, borderRadius: 4 }}>
                      <Pin size={16} />Get directions
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F6F8FC' }}>
        <div className="pad" style={{ maxWidth: 860, margin: '0 auto', padding: '80px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
            <Eyebrow center>QUICK ANSWERS</Eyebrow>
            <h2 className="h2" style={{ margin: 0, fontSize: 38, lineHeight: 1.1, fontWeight: 800 }}>Frequently <span style={{ color: '#D90A0A' }}>Asked Questions</span></h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map(([q, a], i) => (
              <div key={q} style={{ background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 10, overflow: 'hidden' }}>
                <h3 style={{ margin: 0 }}>
                  <button type="button" className="faq-b" id={`faq-q${i}`} aria-expanded={faq === i} aria-controls={`faq-a${i}`} onClick={() => setFaq(faq === i ? -1 : i)}>
                    <span>{q}</span>
                    <span style={{ display: 'flex', color: '#D90A0A', transition: 'transform .2s', transform: `rotate(${faq === i ? 180 : 0}deg)` }}><ChevronDown size={20} /></span>
                  </button>
                </h3>
                <div id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`} hidden={faq !== i} style={{ padding: '0 20px 20px', fontSize: 15, lineHeight: 1.65, color: '#3E4860' }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
