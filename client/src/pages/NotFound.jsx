import { Arrow } from '../components/Icons.jsx';
import { usePageMeta } from '../lib/hooks.js';

const LINKS = [['/', 'Home'], ['/programs', 'Programs'], ['/results', 'Results'], ['/blog', 'Blog'], ['/news', 'News'], ['/contact', 'Contact']];
const tile = { background: '#ffffff', border: '1px solid #E7EAF0', borderRadius: 12, padding: '18px 20px', fontSize: 16, fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 };

export default function NotFound() {
  usePageMeta('Page not found | Hawk Academe', 'The page you were looking for could not be found.');
  return (
    <section style={{ background: '#F6F8FC' }}>
      <div className="pad" style={{ maxWidth: 900, margin: '0 auto', padding: '72px 32px 96px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div aria-hidden="true" style={{ fontSize: 140, lineHeight: 1, fontWeight: 800, letterSpacing: '-.04em', color: '#0B1D45' }}>4<span style={{ color: '#D90A0A' }}>0</span>4</div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800 }}>This page could not be found</h1>
          <p style={{ margin: 0, maxWidth: 520, fontSize: 16, lineHeight: 1.65, color: '#3E4860' }}>The link may be old or mistyped. Jump to one of these pages, or contact us and we will help.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <a className="btn-red" href="/" style={{ height: 46, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 22px', borderRadius: 4, background: '#D90A0A', color: '#ffffff', fontWeight: 700, fontSize: 14 }}>Back to Home</a>
            <a className="btn-ghost" href="/contact" style={{ height: 46, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 22px', borderRadius: 4, border: '1.5px solid #D90A0A', color: '#D90A0A', background: '#ffffff', fontWeight: 700, fontSize: 14 }}>Contact Us</a>
          </div>
        </div>
        <nav aria-label="Main pages" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 12 }}>
          {LINKS.map(([href, label]) => <a key={href} className="card" href={href} style={tile}>{label}<Arrow size={16} /></a>)}
        </nav>
      </div>
    </section>
  );
}
