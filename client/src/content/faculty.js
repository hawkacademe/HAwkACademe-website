// FACULTY: shown in the home page slider and on /faculty.
// Every entry below is a PLACEHOLDER (placeholder: true). To publish a real teacher, fill in
// the fields, set photo to a real image (square, at least 400x400, face near the top, e.g. '/img/faculty/physics-1.webp'; the original goes in images/faculty/ and
// `node tools/process-photos.mjs` makes the web copy)
// and delete the `placeholder: true` line. While any placeholder is left, /faculty stays out of
// search results and the sitemap, and `npm run check:placeholders` lists it.
// subject: 'physics' | 'chemistry' | 'maths' | 'biology'

// While true, the home page and /faculty show an "under maintenance" notice instead of the teacher cards.
export const FACULTY_UNDER_MAINTENANCE = true;

export const FACULTY_PLACEHOLDER_PHOTO = '/img/faculty/placeholder.svg';

const ALL_FACULTY = [
  { id: 'physics-1', subject: 'physics', name: 'Faculty Name', role: 'Senior Faculty, Physics', qualification: 'Qualification', experience: '10+ years teaching', programs: ['JEE', 'NEET'], bio: 'A short introduction to this teacher: their teaching style, the topics they love and what students say about their classes.', photo: '/img/faculty/physics-1.webp', placeholder: true },
  { id: 'maths-1', subject: 'maths', name: 'Faculty Name', role: 'Senior Faculty, Mathematics', qualification: 'Qualification', experience: '12+ years teaching', programs: ['JEE', 'Foundation'], bio: 'A short introduction to this teacher: their teaching style, the topics they love and what students say about their classes.', photo: '/img/faculty/maths-1.webp', placeholder: true },
  { id: 'biology-1', subject: 'biology', name: 'Faculty Name', role: 'Senior Faculty, Biology', qualification: 'Qualification', experience: '9+ years teaching', programs: ['NEET'], bio: 'A short introduction to this teacher: their teaching style, the topics they love and what students say about their classes.', photo: '', placeholder: true },
  { id: 'physics-2', subject: 'physics', name: 'Faculty Name', role: 'Faculty, Physics', qualification: 'Qualification', experience: '6+ years teaching', programs: ['Foundation', 'School'], bio: 'A short introduction to this teacher: their teaching style, the topics they love and what students say about their classes.', photo: '/img/faculty/physics-2.webp', placeholder: true },
  { id: 'chemistry-2', subject: 'chemistry', name: 'Faculty Name', role: 'Faculty, Chemistry', qualification: 'Qualification', experience: '5+ years teaching', programs: ['School', 'Foundation'], bio: 'A short introduction to this teacher: their teaching style, the topics they love and what students say about their classes.', photo: '', placeholder: true },
  { id: 'maths-2', subject: 'maths', name: 'Faculty Name', role: 'Faculty, Mathematics', qualification: 'Qualification', experience: '7+ years teaching', programs: ['School', 'Foundation'], bio: 'A short introduction to this teacher: their teaching style, the topics they love and what students say about their classes.', photo: '/img/faculty/maths-2.webp', placeholder: true },
  { id: 'biology-2', subject: 'biology', name: 'Faculty Name', role: 'Faculty, Biology', qualification: 'Qualification', experience: '5+ years teaching', programs: ['NEET', 'School'], bio: 'A short introduction to this teacher: their teaching style, the topics they love and what students say about their classes.', photo: '', placeholder: true }
];

export const FACULTY_LIST = ALL_FACULTY.map((f) => ({ ...f, photo: f.photo || FACULTY_PLACEHOLDER_PHOTO }));
export const FACULTY_HAS_PLACEHOLDERS = ALL_FACULTY.some((f) => f.placeholder);

export const SUBJECTS = [
  { key: 'physics', name: 'Physics' },
  { key: 'chemistry', name: 'Chemistry' },
  { key: 'maths', name: 'Mathematics' },
  { key: 'biology', name: 'Biology' }
];
export const subjectName = (key) => SUBJECTS.find((s) => s.key === key)?.name || key;
