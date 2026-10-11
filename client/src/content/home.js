import { CENTRES } from './centres.js';

// HOME PAGE CONTENT that is set at launch. Numbers shown in the Results section and the
// highlight badge come from Admin > Timings & highlights instead.

export const HERO_WORDS = ['DISCIPLINE', 'DEDICATION', 'MENTORSHIP', 'INTEGRITY', 'HARD WORK'];

export const YEARS_OF_EXCELLENCE = '15+';

// "Upcoming Diagnostic cum Scholarship Tests". Leave date empty to show "Date to be announced".
// Visitors are sent to the Contact form to register (online registration is a Phase 2 feature).
export const TESTS = [
  { tag: 'FLAGSHIP TEST', name: 'HAwk Talent Search Test', classes: 'Classes 8, 9, 10, 11 & 12', date: '', program: '', tone: 'red' },
  { tag: 'FOUNDATION', name: 'Foundation Aptitude Test', classes: 'Classes 8, 9 & 10', date: '', program: 'foundation', tone: 'navy' },
  { tag: 'JEE / NEET', name: 'All-India Mock Test Series', classes: 'Classes 11, 12 & 12 Pass', date: '', program: '', tone: 'red' }
];

// Red "Growing World of HAwk ACademe" band.
const ALL_GROWTH = [
  { value: String(CENTRES.length), label: CENTRES.length === 1 ? 'Study Centre' : 'Study Centres' },
  { value: '[XX]', label: 'Expert Faculty' },
  { value: '[XX]', label: 'Active Batches' },
  { value: YEARS_OF_EXCELLENCE, label: 'Years of Excellence' }
];
// Figures still holding a [PLACEHOLDER] are hidden until the real number is filled in.
export const GROWTH = ALL_GROWTH.filter((g) => !/\[[^\]]*\]/.test(g.value));

// Handwritten quote shown over each hero slideshow photo, by Gallery photo id (content/gallery.js).
export const HERO_QUOTES = {
  'life-15': ['Learn', 'Grow', 'Achieve'],
  'life-7': ['One concept', 'at a time'],
  'life-2': ['Mentors who', 'believe in you'],
  'life-14': ['Together', 'we rise'],
  'life-4': ['Grateful for', 'our teachers'],
  'life-13': ['Work hard,', 'celebrate harder'],
  'life-11': ['Dream big,', 'work bigger'],
  'life-3': ['Small thanks,', 'big hearts'],
  'life-5': ['Every day', 'is a lesson'],
  'life-8': ['Teachers', 'who inspire'],
  'life-12': ['Consistency', 'wins'],
  'life-6': ['Memories', 'and marks'],
  'life-9': ['Believe.', 'Prepare.', 'Perform.'],
  'life-1': ['Every rank', 'starts here'],
  'life-10': ['Sweet', 'success']
};
