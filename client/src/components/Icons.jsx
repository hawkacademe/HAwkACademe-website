// Line icons from the design concept (24px grid, stroke = currentColor).
const I = ({ size, style, children, ...rest }) => (
  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" style={size ? { width: size, height: size, ...style } : style} {...rest}>{children}</svg>
);

export const Arrow = (p) => <I {...p}><path d="M5 12h14M13 6l6 6-6 6" /></I>;
export const ArrowLeft = (p) => <I {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></I>;
export const Lock = (p) => <I {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></I>;
export const Phone = (p) => <I {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></I>;
export const Mail = (p) => <I {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></I>;
export const Pin = (p) => <I {...p}><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></I>;
export const Clock = (p) => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>;
export const Menu = (p) => <I {...p}><path d="M4 7h16M4 12h16M4 17h16" /></I>;
export const Close = (p) => <I {...p}><path d="M6 6l12 12M18 6L6 18" /></I>;
export const Chat = (p) => <I {...p}><path d="M4 5h16v11H9l-5 4z" /></I>;
export const Trophy = (p) => <I {...p}><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M8 20h8" /></I>;
export const Cap = (p) => <I {...p}><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /></I>;
export const Calendar = (p) => <I {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></I>;
export const ChevronDown = (p) => <I {...p}><path d="M6 9l6 6 6-6" /></I>;
export const ChevronLeft = (p) => <I {...p}><path d="M15 6l-6 6 6 6" /></I>;
export const ChevronRight = (p) => <I {...p}><path d="M9 6l6 6-6 6" /></I>;
export const Circled = (p) => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M10 8l4 4-4 4" /></I>;
export const Megaphone = (p) => <I {...p}><path d="M4 10v4h3l7 4V6L7 10z" /><path d="M17 9a4 4 0 0 1 0 6" /></I>;
export const Quote = ({ size = 40, color = '#D90A0A' }) => (
  <svg viewBox="0 0 48 36" style={{ width: size, height: size * 0.75 }} aria-hidden="true"><path d="M0 36V20C0 9 6 2 18 0l2 5c-7 2-10 6-10 12h8v19zM28 36V20c0-11 6-18 18-20l2 5c-7 2-10 6-10 12h8v19z" fill={color} /></svg>
);

// Filled tick used in the design's bullet lists.
export const Tick = ({ color = '#D90A0A' }) => (
  <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }} aria-hidden="true">
    <circle cx="10" cy="10" r="9" fill={color} />
    <path d="M6 10.5l2.6 2.5L14 7.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Social = {
  youtube: (p) => <I {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9v6l5-3z" fill="currentColor" /></I>,
  instagram: (p) => <I {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></I>,
  linkedin: (p) => <I {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V16M8 7.8v.01M11.5 16v-5.5M11.5 13c0-1.7 1-2.5 2.2-2.5s2.3.8 2.3 2.5v3" /></I>,
  facebook: (p) => <I {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M15 8h-1.5A1.5 1.5 0 0 0 12 9.5V20M10 12.5h5" /></I>
};

export const WhatsApp = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
    <path d="M16.04 3C9 3 3.3 8.7 3.3 15.73c0 2.24.59 4.43 1.7 6.36L3.2 28.8l6.88-1.8a12.7 12.7 0 0 0 5.95 1.5h.01c7.03 0 12.74-5.7 12.74-12.73A12.66 12.66 0 0 0 16.04 3zm0 23.3h-.01a10.56 10.56 0 0 1-5.38-1.47l-.39-.23-4.08 1.07 1.09-3.98-.25-.41a10.53 10.53 0 0 1-1.62-5.6c0-5.84 4.75-10.58 10.6-10.58a10.58 10.58 0 0 1 10.58 10.6c0 5.84-4.75 10.6-10.54 10.6zm5.8-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.98-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z" />
  </svg>
);
