// Programme descriptions from the design concept. Classes, duration, batch size, mode and
// timings come from Admin > Timings & highlights, so the office can update them.
export const PROGRAMS = [
  {
    key: 'jee', name: 'JEE (Main & Advanced)', short: 'JEE (Main & Advanced)', img: '/img/program-jee.webp', alt: 'JEE preparation: calculus and physics',
    summary: 'Comprehensive program to build strong concepts and problem-solving skills for engineering entrance exams.',
    card: 'Comprehensive program to build strong concepts and problem-solving skills.',
    bullets: ['Concept-first teaching in Physics, Chemistry and Mathematics', 'Expert full-time faculty who stay with the batch', 'Weekly tests and full-length mocks with analysis', 'Structured study plan and personal doubt sessions'],
    cardBullets: ['Expert Faculty', 'Structured Study Plan', 'Regular Mock Tests'],
    goal: 'Engineering entrance exams', subjects: 'Physics, Chemistry, Mathematics', tone: 'red',
    icon: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /><path d="M22 9v6" /></>
  },
  {
    key: 'neet', name: 'NEET (UG)', short: 'NEET (UG)', img: '/img/program-neet.webp', alt: 'NEET preparation: biology and chemistry',
    summary: 'Focused preparation with conceptual clarity and extensive practice for medical entrance.',
    card: 'Focused preparation with conceptual clarity and extensive practice.',
    bullets: ['NCERT-focused learning with deep Biology coverage', 'Regular assessments in NEET pattern', 'Doubt clearing sessions every week', 'Revision charts, formula sheets and previous year papers'],
    cardBullets: ['NCERT-Focused Learning', 'Regular Assessments', 'Doubt Clearing Sessions'],
    goal: 'Medical entrance exam', subjects: 'Physics, Chemistry, Biology', tone: 'navy',
    icon: <><path d="M6 3v6a4 4 0 0 0 8 0V3" /><path d="M10 13v2a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" /></>
  },
  {
    key: 'foundation', name: 'Foundation Courses', short: 'Foundation Courses', img: '/img/program-foundation.webp', alt: 'Foundation courses for classes 8 to 10',
    summary: 'Build a strong base for future success in Classes 8, 9 and 10, with olympiad preparation.',
    card: 'For Classes 8, 9 & 10. Build a strong base for future success.',
    bullets: ['Concept building from first principles', 'Olympiad and talent-search preparation', 'Interactive, activity-based classes', 'Early habit of discipline and regular practice'],
    cardBullets: ['Concept Building', 'Olympiad Preparation', 'Interactive Learning'],
    goal: 'Strong base and olympiads', subjects: 'Maths, Science and reasoning', tone: 'red',
    icon: <><path d="M3 5.5C5.5 4.5 9 4.5 12 6c3-1.5 6.5-1.5 9-.5V19c-2.5-1-6-1-9 .5-3-1.5-6.5-1.5-9-.5z" /><path d="M12 6v13.5" /></>
  },
  {
    key: 'integrated', name: 'Integrated Programs', short: 'Integrated Programs', img: '/img/program-integrated.webp', alt: 'Integrated school and coaching programs',
    summary: 'Long-term programs for JEE or NEET with school support and continuous evaluation.',
    card: 'Long-term programs for JEE/NEET with school support and continuous evaluation.',
    bullets: ['School and coaching under one roof', 'Comprehensive curriculum mapped to board and entrance exams', 'Personalised mentorship across the years', 'Continuous evaluation and parent progress updates'],
    cardBullets: ['School + Coaching', 'Comprehensive Curriculum', 'Personalized Mentorship'],
    goal: 'Board plus entrance, long-term', subjects: 'School syllabus with JEE/NEET', tone: 'navy',
    icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 2v4M16 2v4M7 13h4M7 16h7" /></>
  }
];

// Combines the description with the editable batch details for one programme.
export function withDetails(program, settingsPrograms = []) {
  const d = settingsPrograms.find((p) => p.key === program.key) || {};
  return { ...program, classes: d.classes || '', duration: d.duration || '', batchSize: d.batchSize || '', mode: d.mode || '', timings: d.timings || '' };
}
