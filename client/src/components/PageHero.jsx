// Navy title band used at the top of every inner page in the design concept.
export default function PageHero({ crumb, crumbs, title, intro, compact = false, children }) {
  const trail = crumbs || [{ href: '/', label: 'Home' }, { label: crumb }];
  return (
    <section style={{ position: 'relative', background: '#0B1D45', color: '#ffffff', overflow: 'hidden' }}>
      <img src="/img/hero-pattern.webp" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
      {!compact && <div className="hide-sm" style={{ position: 'absolute', top: 0, right: 0, width: '38%', height: '100%', background: 'linear-gradient(118deg,transparent 0 46%,#D90A0A 46% 49%,transparent 49%)' }} />}
      <div className="pad hero-s" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: compact ? '36px 32px' : '56px 32px', display: 'flex', flexDirection: 'column', gap: compact ? 8 : 14 }}>
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#B7C4E3', flexWrap: 'wrap' }}>
          {trail.map((c, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && <span aria-hidden="true">/</span>}
              {c.href ? <a href={c.href} style={{ color: '#B7C4E3' }}>{c.label}</a> : <span aria-current="page" style={{ color: '#ffffff' }}>{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="h1" style={{ margin: 0, fontSize: compact ? 40 : 50, lineHeight: compact ? 1.1 : 1.06, fontWeight: 800, letterSpacing: '-.02em' }}>{title}</h1>
        {intro && <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#D5DDF0', maxWidth: 640 }}>{intro}</p>}
        {children}
      </div>
    </section>
  );
}

// "—— LABEL" eyebrow used above section headings.
export function Eyebrow({ children, center = false, color, line = '#D90A0A' }) {
  const bar = <span style={{ width: 32, height: 3, background: line }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: center ? 'center' : undefined, gap: 12, fontSize: 12, fontWeight: 800, letterSpacing: '.22em', color }}>
      {bar}{children}{center && bar}
    </div>
  );
}
