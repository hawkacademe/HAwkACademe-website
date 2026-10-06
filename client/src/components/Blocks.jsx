// Small building blocks repeated across pages in the design concept.
import { Arrow, Trophy, Quote } from './Icons.jsx';
import { useSite } from '../lib/site.jsx';

const statIcons = [
  <svg key="0" className="ico" viewBox="0 0 24 24" style={{ width: 30, height: 30 }}><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M8 20h8" /></svg>,
  <svg key="1" className="ico" viewBox="0 0 24 24" style={{ width: 30, height: 30 }}><path d="M4 20h16" /><path d="M7 17v-5M12 17V7M17 17v-8" /></svg>,
  <svg key="2" className="ico" viewBox="0 0 24 24" style={{ width: 30, height: 30 }}><circle cx="12" cy="14" r="5" /><path d="M8.5 9.5L6 3h4l2 4 2-4h4l-2.5 6.5" /></svg>,
  <svg key="3" className="ico" viewBox="0 0 24 24" style={{ width: 30, height: 30 }}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
];

// The four highlight numbers (Admin > Timings & highlights).
export function HighlightTiles({ minWidth = 140 }) {
  const { highlights = [] } = useSite();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`, gap: 14 }}>
      {highlights.map((h, i) => (
        <div key={i} style={{ background: '#ffffff', borderRadius: 10, padding: 18, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 8px 24px rgba(11,29,69,.08)' }}>
          <div style={{ color: i === 3 ? '#0B1D45' : '#D90A0A' }}>{statIcons[i % 4]}</div>
          <div><div style={{ fontWeight: 800, fontSize: 22, color: '#D90A0A' }}>{h.value}</div><div style={{ fontSize: 12, color: '#3E4860' }}>{h.label}</div></div>
        </div>
      ))}
    </div>
  );
}

// Red call-to-action strip that ends most pages.
export function CtaBand({ title, text, primary = { href: '/contact', label: 'Talk to Counsellor' }, secondary }) {
  return (
    <section style={{ background: '#D90A0A', color: '#ffffff' }}>
      <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '52px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
          <h2 className="h2" style={{ margin: 0, fontSize: 32, lineHeight: 1.15, fontWeight: 800 }}>{title}</h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#FFE3E0' }}>{text}</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <a href={primary.href} style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 24px', background: '#ffffff', color: '#D90A0A', fontWeight: 700, fontSize: 15, borderRadius: 4 }}>{primary.label}</a>
          {secondary && <a href={secondary.href} style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 24px', border: '1.5px solid #ffffff', color: '#ffffff', fontWeight: 700, fontSize: 15, borderRadius: 4 }}>{secondary.label}</a>}
        </div>
      </div>
    </section>
  );
}

export function RedButton({ href, children, style, arrow = true, ...rest }) {
  return (
    <a className="btn-red" href={href} style={{ height: 48, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 24px', background: '#D90A0A', color: '#ffffff', fontWeight: 700, fontSize: 15, borderRadius: 4, ...style }} {...rest}>
      {children}{arrow && <Arrow size={18} />}
    </a>
  );
}

export function FounderQuote({ founder, compact = false }) {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 18 : 20 }}>
      <Quote size={56} />
      <p style={{ margin: 0, fontSize: compact ? 24 : 26, lineHeight: 1.5, fontWeight: 600, color: '#0A1530' }}>{founder.message}</p>
      <div style={{ height: 3, width: 60, background: '#D90A0A', borderRadius: 3 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
        {founder.photo ? (
          <img src={founder.photo} alt={founder.name} width="64" height="64" loading="lazy" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #D90A0A' }} />
        ) : null}
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{founder.name}</div>
          <div style={{ fontSize: 13, letterSpacing: '.12em', color: '#5A6378', marginTop: 4 }}>{founder.title.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

export function Loading({ label = 'Loading…' }) {
  return <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#5A6378', fontSize: 15, padding: '24px 0' }}><span className="spin" style={{ width: 28, height: 28, borderWidth: 4 }} />{label}</div>;
}

export function LoadError({ error }) {
  return <div role="alert" style={{ background: '#FDECEC', border: '1px solid #F3B7B7', color: '#8E0A0A', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontWeight: 600 }}>{error?.message || 'Could not load this section. Please refresh the page.'}</div>;
}

export function Empty({ children }) {
  return <div style={{ background: '#F6F8FC', border: '1px dashed #B7C4E3', borderRadius: 10, padding: 28, textAlign: 'center', fontSize: 15, color: '#3E4860' }}>{children}</div>;
}

export { Trophy };
