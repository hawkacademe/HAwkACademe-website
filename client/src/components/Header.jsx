import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSite } from '../lib/site.jsx';
import { telHref } from '../lib/format.js';
import { Lock, Menu, Close, Phone } from './Icons.jsx';

// Pro plan navigation: only the 12 Pro pages. Links from the design concept to pages
// outside the plan (store, cart, student login, booking) are removed.
// About, Programs, Results and News are left out of the header on request; they are
// still linked from the footer and from the home page.
export const NAV = [
  ['/', 'Home'], ['/gallery', 'Gallery'], ['/blog', 'Blog'], ['/contact', 'Contact']
];

const isOn = (path, href) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));

export default function Header() {
  const { pathname } = useLocation();
  const site = useSite();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    if (!menu) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#ffffff', borderBottom: '1px solid #E7EAF0' }}>
      <div className="topbar" style={{ background: '#0B1D45', color: '#ffffff' }}>
        <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '6px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 12, fontWeight: 600 }}>
          <span className="hide-xs" style={{ color: '#C3CBE0' }}>
            {site.phone && <>Call <a href={telHref(site.phone)} style={{ color: '#C3CBE0' }}>{site.phone}</a></>}
            {site.phone && site.email && ' · '}
            {site.email && <a href={`mailto:${site.email}`} style={{ color: '#C3CBE0' }}>{site.email}</a>}
          </span>
          <a href="/admin/login" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 12px', border: '1px solid #5B6FA3', borderRadius: 4, color: '#ffffff' }}>
            <Lock size={13} />Admin Login
          </a>
        </div>
      </div>
      <div className="pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 28 }}>
        <a href="/" aria-label="Hawk Academe home" style={{ display: 'flex', alignItems: 'center', flex: '1 1 0' }}>
          <img className="logo" src="/img/logo.webp" alt="HAwk ACademe" width="233" height="34" style={{ height: 34, width: 'auto', display: 'block' }} />
        </a>
        <nav className="nav" aria-label="Main" style={{ display: 'flex', gap: 28, justifyContent: 'center', flex: '0 0 auto', whiteSpace: 'nowrap' }}>
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className={isOn(pathname, href) ? 'on' : undefined} aria-current={isOn(pathname, href) ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flex: '1 1 0', marginLeft: 'auto' }}>
          {site.phone && (
            <a className="btn-ghost hide-sm" href={telHref(site.phone)} style={{ height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', border: '1.5px solid #D90A0A', color: '#D90A0A', fontWeight: 700, fontSize: 14, borderRadius: 4, whiteSpace: 'nowrap' }}>
              <Phone size={16} />Call Us
            </a>
          )}
          <a className="btn-red login-btn" href="/contact" style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 20px', background: '#D90A0A', color: '#ffffff', fontWeight: 700, fontSize: 14, borderRadius: 4, whiteSpace: 'nowrap' }}>Enquire Now</a>
          <button type="button" className="menu-btn" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)} style={{ width: 44, height: 44, border: '1.5px solid #E7EAF0', borderRadius: 8, background: '#ffffff', color: '#0A1530', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
            {menu ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
      {menu && (
        <nav id="mobile-menu" className="m-menu" aria-label="Mobile" style={{ borderTop: '1px solid #E7EAF0', background: '#ffffff', padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 66px)', overflowY: 'auto', boxShadow: '0 18px 30px rgba(11,29,69,.12)' }}>
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className={isOn(pathname, href) ? 'on' : undefined} aria-current={isOn(pathname, href) ? 'page' : undefined}>{label}</a>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {site.phone && <a className="btn-ghost" href={telHref(site.phone)} style={{ flex: 1, justifyContent: 'center', border: '1.5px solid #D90A0A', color: '#D90A0A', borderRadius: 4, fontSize: 15 }}>Call Us</a>}
            <a className="btn-red" href="/contact" style={{ flex: 1, justifyContent: 'center', background: '#D90A0A', color: '#ffffff', borderRadius: 4, borderBottom: 0, fontSize: 15 }}>Enquire Now</a>
          </div>
        </nav>
      )}
    </header>
  );
}
