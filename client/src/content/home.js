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
export const GROWTH = [
  { value: String(CENTRES.length), label: CENTRES.length === 1 ? 'Study Centre' : 'Study Centres' },
  { value: '[XX]', label: 'Expert Faculty' },
  { value: '[XX]', label: 'Active Batches' },
  { value: YEARS_OF_EXCELLENCE, label: 'Years of Excellence' }
];
