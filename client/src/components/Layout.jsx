import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useSite } from '../lib/site.jsx';
import { WhatsApp, Phone } from './Icons.jsx';
import { telHref } from '../lib/format.js';
import ErrorBoundary from './ErrorBoundary.jsx';

// Pages are written with plain <a href="/about"> links (as in the design). This turns
// clicks on internal links into instant in-app navigation.
function useLinkInterception() {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        const t = document.getElementById(decodeURIComponent(href.slice(1)));
        if (t) { e.preventDefault(); scrollToEl(t); history.replaceState(null, '', href); }
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/') || href.startsWith('/uploads/') || /\.(xml|txt|pdf|csv)$/.test(href)) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
}

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function scrollToEl(el) {
  el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
}

// New page: go to the top, or to #section if the link had one. Moves focus for screen readers.
function useScrollManagement(mainRef) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      let tries = 0;
      const t = setInterval(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el || ++tries > 20) { clearInterval(t); if (el) scrollToEl(el); }
      }, 50);
      return () => clearInterval(t);
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
    return undefined;
  }, [pathname, hash, mainRef]);
}

// Gentle fade-up for each section as it scrolls into view (skipped for reduced motion).
function useReveal(mainRef) {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = mainRef.current;
    if (!root || reduced() || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    const sections = [...root.querySelectorAll(':scope > section, :scope > div > section')].slice(1);
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top < window.innerHeight) return; // already on screen
      s.classList.add('reveal');
      io.observe(s);
    });
    return () => io.disconnect();
  }, [pathname, mainRef]);
}

// Call and WhatsApp buttons. Phones get a bar fixed to the bottom of the screen;
// larger screens get two round floating buttons. Hidden in the admin panel.
export function ContactButtons() {
  const { phone, whatsapp } = useSite();
  const { pathname } = useLocation();
  if ((!phone && !whatsapp) || pathname.startsWith('/admin')) return null;
  const text = encodeURIComponent('Hello Hawk Academe, I would like to know more about your programs.');
  return (
    <>
      <div className="cbar-space" aria-hidden="true" />
      <div className="cbar" role="group" aria-label="Contact us">
        {phone && (
          <a className="cbar-call" href={telHref(phone)} aria-label={`Call us on ${phone}`}>
            <Phone /><span>Call Now</span>
          </a>
        )}
        {whatsapp && (
          <a className="cbar-wa" href={`https://wa.me/${whatsapp}?text=${text}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
            <WhatsApp /><span>WhatsApp</span>
          </a>
        )}
      </div>
    </>
  );
}

export default function Layout({ fallback = null }) {
  const mainRef = useRef(null);
  const { pathname } = useLocation();
  useLinkInterception();
  useScrollManagement(mainRef);
  useReveal(mainRef);
  return (
    <div id="top" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: '#0A1530', background: '#ffffff', overflowX: 'clip' }}>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        <ErrorBoundary key={pathname.startsWith('/admin') ? 'admin' : pathname}><Suspense fallback={fallback}><Outlet /></Suspense></ErrorBoundary>
      </main>
      <Footer />
      <ContactButtons />
    </div>
  );
}
