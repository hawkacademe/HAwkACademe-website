// ABOUT AND FOUNDER CONTENT: set at launch from the material HAwk ACademe sends
// (agreement section 10A, "Home and About"). Text in [SQUARE BRACKETS] is a placeholder.

const ALL_STORY = [
  '[OUR STORY — a short paragraph on how HAwk ACademe began and what it set out to change in how students prepare.]',
  '[WHAT MAKES US DIFFERENT — a second paragraph on the teaching approach, the batches and the support students receive.]'
];

const ALL_FOUNDED = '[YEAR FOUNDED]';

const ALL_FOUNDER = {
  name: '[FOUNDER NAME]',
  title: 'Founder & Director, HAwk ACademe',
  message: "[Founder's message — a short line on why HAwk ACademe exists and what it promises every student.]",
  photo: '' // e.g. '/img/founder.webp' (square, at least 400px)
};

// Faculty snapshot on About. subject: 'physics' | 'chemistry' | 'maths' | 'biology'
const ALL_FACULTY = [
  { subject: 'physics', name: '[FACULTY NAME]', qualification: '[QUALIFICATION]', experience: '[EXPERIENCE]', photo: '' },
  { subject: 'chemistry', name: '[FACULTY NAME]', qualification: '[QUALIFICATION]', experience: '[EXPERIENCE]', photo: '' },
  { subject: 'maths', name: '[FACULTY NAME]', qualification: '[QUALIFICATION]', experience: '[EXPERIENCE]', photo: '' },
  { subject: 'biology', name: '[FACULTY NAME]', qualification: '[QUALIFICATION]', experience: '[EXPERIENCE]', photo: '' }
];

// Only real content is shown on the site; anything still in [BRACKETS] stays hidden.
const real = (v) => !/\[[^\]]*\]/.test(String(v || ''));
const FALLBACK_STORY = [
  'HAwk ACademe prepares students from Class 8 to Class 12, and droppers, for JEE, NEET, olympiads and school exams, at our centres in Barasat, Madhyamgram and New Town, Kolkata.',
  'Our approach is simple: concept-first teaching by full-time faculty, weekly tests and full-length mocks with detailed analysis, one-on-one doubt sessions every week, and regular progress updates for parents.'
];
export const STORY = ALL_STORY.filter(real).length ? ALL_STORY.filter(real) : FALLBACK_STORY;
export const FOUNDED = real(ALL_FOUNDED) ? ALL_FOUNDED : '';
export const FOUNDER = real(ALL_FOUNDER.name) && real(ALL_FOUNDER.message) ? ALL_FOUNDER : null;
export const FACULTY = ALL_FACULTY.filter((f) => real(f.name) && real(f.qualification) && real(f.experience));

export const SUBJECT_BANDS = {
  physics: { label: 'PHYSICS FACULTY', glyph: 'F = ma', bg: 'linear-gradient(135deg,#0B1D45,#1B4290)' },
  chemistry: { label: 'CHEMISTRY FACULTY', glyph: 'H₂O', bg: 'linear-gradient(135deg,#B00808,#E8231A)' },
  maths: { label: 'MATHEMATICS FACULTY', glyph: '∫ f(x) dx', bg: 'linear-gradient(135deg,#13306B,#0B1D45)' },
  biology: { label: 'BIOLOGY FACULTY', glyph: 'DNA', bg: 'linear-gradient(135deg,#7A0505,#D90A0A)' }
};
