// RESULTS CONTENT: set at launch (agreement section 3.2, "Results: set at launch").
// Replace every entry with HAwk ACademe's real toppers once written consent has been
// received from each student (or a parent, if under 18). Entries marked `sample: true`
// come from the design concept and must not go live: `npm run check:placeholders` lists them.
//
// exam:  'jeeadv' | 'jeemain' | 'neet' | 'boards'
// photo: optional, e.g. '/img/toppers/rohan.webp' (square, at least 300px). Initials are shown without one.

export const EXAMS = [
  { key: 'jeeadv', label: 'JEE Advanced', name: 'JEE Advanced' },
  { key: 'jeemain', label: 'JEE Main', name: 'JEE Main' },
  { key: 'neet', label: 'NEET-UG', name: 'NEET-UG' },
  { key: 'boards', label: 'Boards', name: 'Board Exams' }
];

export const TOPPERS = [
  { sample: true, exam: 'jeeadv', year: 2024, metricLabel: 'AIR', metric: '12', name: 'Rohan Mehta', program: '2 Year Classroom Program', detail: 'IIT Bombay', detailSub: 'Computer Science' },
  { sample: true, exam: 'jeeadv', year: 2024, metricLabel: 'AIR', metric: '28', name: 'Ananya Sharma', program: '4 Year Integrated Program', detail: 'IIT Delhi', detailSub: 'Electrical Engineering' },
  { sample: true, exam: 'neet', year: 2024, metricLabel: 'AIR', metric: '45', name: 'Arjun Singh', program: '2 Year Classroom Program', detail: 'AIIMS Delhi', detailSub: 'MBBS' },
  { sample: true, exam: 'jeeadv', year: 2024, metricLabel: 'AIR', metric: '62', name: 'Sneha Patel', program: '3 Year Classroom Program', detail: 'IIT Madras', detailSub: 'Mechanical Engineering' },
  { sample: true, exam: 'jeemain', year: 2024, metricLabel: 'Percentile', metric: '[99.9]', name: '[Student Name]', program: '[Program]', detail: '[Target College]', detailSub: '[Branch]', badge: '[State] Topper' },
  { sample: true, exam: 'jeemain', year: 2024, metricLabel: 'Percentile', metric: '[99.9]', name: '[Student Name]', program: '[Program]', detail: '[Target College]', detailSub: '[Branch]' },
  { sample: true, exam: 'neet', year: 2024, metricLabel: 'AIR', metric: '[—]', name: '[Student Name]', program: '[Program]', detail: '[Medical College]', detailSub: 'MBBS', badge: '[State] Topper' },
  { sample: true, exam: 'boards', year: 2024, metricLabel: 'Marks', metric: '[—]/500', name: '[Student Name]', program: 'Class 12 Boards', detail: '[Board]', detailSub: '[Percentage]' },
  { sample: true, exam: 'boards', year: 2024, metricLabel: 'Marks', metric: '[—]/500', name: '[Student Name]', program: 'Class 10 Boards', detail: '[Board]', detailSub: '[Percentage]' },
  { sample: true, exam: 'jeeadv', year: 2023, metricLabel: 'AIR', metric: '[—]', name: '[Student Name]', program: '[Program]', detail: '[Target College]', detailSub: '[Branch]' },
  { sample: true, exam: 'neet', year: 2023, metricLabel: 'AIR', metric: '[—]', name: '[Student Name]', program: '[Program]', detail: '[Medical College]', detailSub: 'MBBS' },
  { sample: true, exam: 'jeemain', year: 2022, metricLabel: 'Percentile', metric: '[—]', name: '[Student Name]', program: '[Program]', detail: '[Target College]', detailSub: '[Branch]' }
];

// Headline numbers on the Results page.
export const RESULT_STATS = [
  { value: '[NUMBER]', label: 'Selections in top institutes' },
  { value: '[NUMBER]', label: 'Ranks under 1000' },
  { value: '[NUMBER]', label: 'Students scoring 90%+' },
  { value: '[NUMBER]', label: 'Years of results' }
];

// The dark strip shown on Home when an exam filter is picked.
export const EXAM_STATS = {
  jeeadv: [['[X]', 'in Top 100 AIR'], ['[X]', 'State / City Toppers'], ['[X]', 'Students Qualified']],
  jeemain: [['[X]', 'above 99 percentile'], ['[X]', 'State / City Toppers'], ['[X]', 'Students Qualified']],
  neet: [['[X]', 'in Top 1000 AIR'], ['[X]', 'State / City Toppers'], ['[X]', 'Students Qualified']],
  boards: [['[X]', 'scored 95%+'], ['[X]', 'School Toppers'], ['[X]', 'scored 90%+']]
};

export const initials = (name) => {
  const parts = String(name || '').replace(/\[.*?\]/g, '').trim().split(/\s+/).filter(Boolean);
  return parts.length ? (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase() : '—';
};
export const examLabel = (t) => `${(EXAMS.find((e) => e.key === t.exam)?.name || '').toUpperCase()} ${t.year}`;
