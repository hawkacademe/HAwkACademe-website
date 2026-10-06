const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
const dateTimeFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });

export const fmtDate = (d) => (d ? dateFmt.format(new Date(d)) : '');
export const fmtDateTime = (d) => (d ? dateTimeFmt.format(new Date(d)) : '');

// Value for <input type="date"> in Indian time.
export const isoDate = (d) => new Date(new Date(d || Date.now()).getTime() + 5.5 * 3600000).toISOString().slice(0, 10);
// Value for <input type="datetime-local"> in Indian time, and back.
export const isoLocal = (d) => new Date(new Date(d || Date.now()).getTime() + 5.5 * 3600000).toISOString().slice(0, 16);
export const fromLocal = (v) => new Date(v + ':00+05:30').toISOString();

export const telHref = (phone) => 'tel:' + String(phone || '').replace(/[^\d+]/g, '');
export const hasPlaceholder = (s) => /\[[^\]]+\]/.test(String(s || ''));

// Blog cover band used when a post has no photo (from the design concept).
export const COVER_STYLES = {
  physics: { label: 'Physics', glyph: 'F = ma', bg: 'linear-gradient(135deg,#0B1D45,#1B4290)' },
  chemistry: { label: 'Chemistry', glyph: 'H₂O', bg: 'linear-gradient(135deg,#B00808,#E8231A)' },
  maths: { label: 'Mathematics', glyph: '∫ f(x) dx', bg: 'linear-gradient(135deg,#13306B,#0B1D45)' },
  biology: { label: 'Biology', glyph: 'DNA', bg: 'linear-gradient(135deg,#7A0505,#D90A0A)' }
};
