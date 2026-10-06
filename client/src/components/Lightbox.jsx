import { useEffect, useRef } from 'react';

// Full-screen photo viewer from the design concept. Arrow keys / swipe to move,
// Escape to close; focus stays inside while open and returns to the photo after.
export default function Lightbox({ items, index, onIndex, onClose }) {
  const ref = useRef(null);
  const touch = useRef(null);
  const cur = items[index];
  const n = items.length;
  const prev = () => onIndex((index - 1 + n) % n);
  const next = () => onIndex((index + 1) % n);

  useEffect(() => {
    const opener = document.activeElement;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = 'hidden';
    ref.current?.querySelector('[data-close]')?.focus();
    return () => { html.style.overflow = overflow; opener?.focus?.(); };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Tab') {
        const f = [...ref.current.querySelectorAll('button')];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!cur) return null;
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (touch.current ?? 0); if (Math.abs(dx) > 50) (dx > 0 ? prev : next)(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(8,20,47,.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 1080, width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <img src={cur.url} alt={cur.alt} style={{ display: 'block', width: '100%', maxHeight: '74vh', objectFit: 'contain', borderRadius: 12 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, color: '#ffffff' }}>
          <div style={{ fontSize: 16, fontWeight: 700 }} aria-live="polite">
            {cur.caption}{n > 1 && <span style={{ color: '#B7C4E3', fontWeight: 600, marginLeft: 10, fontSize: 14 }}>{index + 1} / {n}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {n > 1 && <button type="button" className="pill" onClick={prev}>Previous</button>}
            {n > 1 && <button type="button" className="pill" onClick={next}>Next</button>}
            <button type="button" data-close className="pill on" style={{ background: '#D90A0A', borderColor: '#D90A0A' }} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
