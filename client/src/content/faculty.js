// FACULTY: shown in the home page slider and on /faculty.
// Real faculty and academic mentors with authentic photography and quotations.

export const FACULTY_UNDER_MAINTENANCE = false;

export const FACULTY_PLACEHOLDER_PHOTO = '/img/faculty/placeholder.svg';

const ALL_FACULTY = [
  {
    id: 'hawk-sir',
    subject: 'chemistry',
    name: 'Hawk Sir',
    role: 'Founder & Senior Faculty, Chemistry',
    qualification: 'Founder & Director, HAwk ACademe',
    experience: '15+ years teaching',
    quote: 'Bridging complex theory and absolute clarity.',
    programs: ['JEE', 'NEET', 'Foundation'],
    bio: 'Founder of HAwk ACademe and veteran Chemistry mentor. Renowned for breaking down intricate chemical mechanisms and reaction kinetics into crystal-clear conceptual frameworks. Guides aspirants with visionary mentorship from foundational concepts to top ranks in JEE and NEET.',
    photo: '/img/faculty/hawk-sir.webp',
    isFounder: true,
    isSenior: true
  },
  {
    id: 'rg-sir',
    subject: 'physics',
    name: 'R G Sir',
    role: 'Senior Faculty, Physics',
    qualification: 'Physics Specialist',
    experience: '12+ years teaching',
    quote: 'Where complex concepts click and potential energy becomes brilliance.',
    programs: ['JEE Advanced', 'JEE Main', 'NEET'],
    bio: 'Masters the art of visual physics and intuitive problem-solving. Helps students build robust physical intuition, eliminating fear of numericals and unlocking high-scoring potential across JEE and NEET exams.',
    photo: '/img/faculty/rg-sir.webp',
    isSenior: true
  },
  {
    id: 'momin-sir',
    subject: 'maths',
    name: 'Momin Sir',
    role: 'Senior Faculty, Mathematics',
    qualification: 'Mathematics Specialist',
    experience: '10+ years teaching',
    quote: 'Transforming raw variables into vectors of absolute precision.',
    programs: ['JEE Advanced', 'JEE Main', 'Foundation'],
    bio: 'Transforms abstract mathematical concepts into structured, high-speed problem-solving strategies. Specializes in calculus, coordinate geometry and algebra for competitive engineering entrance exams.',
    photo: '/img/faculty/momin-sir.webp',
    isSenior: true
  },
  {
    id: 'tapas-sir',
    subject: 'biology',
    name: 'Tapas Sir',
    role: 'Senior Faculty, Biology',
    qualification: 'Life Sciences Specialist',
    experience: '10+ years teaching',
    quote: 'Where complex life science sparks and dormant genius finds its pulse.',
    programs: ['NEET-UG', 'Boards', 'Olympiads'],
    bio: 'Brings biological sciences to life with deep NCERT mastery, comprehensive diagrammatic analysis, and high-yield retention techniques specifically tailored for cracking top medical colleges via NEET-UG.',
    photo: '/img/faculty/tapas-sir.webp',
    isSenior: true
  },
  {
    id: 'deb-sir',
    subject: 'computer',
    name: 'Deb Sir',
    role: 'Senior Faculty, Computer Science',
    qualification: 'Computer Science Specialist',
    experience: '10+ years teaching',
    quote: 'Building the algorithmic foundations today for technologies we have yet to imagine.',
    programs: ['CBSE', 'ISC', 'Foundation'],
    bio: 'Guides students through computational thinking, data structures, and programming languages. Fosters algorithmic thinking that prepares students both for board examinations and modern tech frontiers.',
    photo: '/img/faculty/deb-sir.webp',
    isSenior: true
  },
  {
    id: 'subhojit-sir',
    subject: 'mentorship',
    name: 'Subhojit Sir',
    role: 'Faculty & Academic Mentor',
    qualification: 'Academic Mentorship & Guidance',
    experience: '8+ years mentoring',
    quote: 'Guiding every student with disciplined practice and unwavering support.',
    programs: ['Foundation', 'School Tuition', 'Doubt Clearing'],
    bio: 'Dedicated to student academic development, personalized doubt clearance, and maintaining rigorous study routines to ensure steady conceptual growth and consistent test performance.',
    photo: '/img/faculty/subhojit-sir.webp',
    isSenior: false
  },
  {
    id: 'tania-maam',
    subject: 'mentorship',
    name: "Tania Ma'am",
    role: 'Faculty & Academic Coordinator',
    qualification: 'Academic Guidance & Student Mentorship',
    experience: '7+ years mentoring',
    quote: 'Nurturing student confidence through attentive guidance and continuous care.',
    programs: ['Foundation', 'School Tuition', 'Mentorship'],
    bio: 'Coordinates batch progress, mentors students through academic hurdles, and bridges communication between teachers, students, and parents to foster a supportive learning environment.',
    photo: '/img/faculty/tania-maam.webp',
    isSenior: false
  },
  {
    id: 'antara-maam',
    subject: 'mentorship',
    name: "Antara Ma'am",
    role: 'Faculty & Academic Mentor',
    qualification: 'Student Mentorship & Foundation Support',
    experience: '6+ years mentoring',
    quote: 'Inspiring discipline and focus to turn potential into tangible achievement.',
    programs: ['School Tuition', 'Foundation', 'Doubt Clearing'],
    bio: 'Focuses on building strong fundamentals for junior and senior batches, conducting regular doubt-solving clinics, and mentoring students to achieve conceptual clarity and examination readiness.',
    photo: '/img/faculty/antara-maam.webp',
    isSenior: false
  },
  {
    id: 'sanjay-sir',
    subject: 'mentorship',
    name: 'Sanjay Sir',
    role: 'Faculty & Student Mentor',
    qualification: 'Academic Mentorship & Test Strategy',
    experience: '8+ years mentoring',
    quote: 'Building strong academic habits and exam resilience one day at a time.',
    programs: ['JEE', 'NEET', 'Foundation'],
    bio: 'Specializes in test analytics, academic discipline, and individualized mentorship to help competitive aspirants overcome exam anxiety and maximize their scoring efficiency.',
    photo: '/img/faculty/sanjay-sir.webp',
    isSenior: false
  }
];

export const FACULTY_LIST = ALL_FACULTY.map((f) => ({ ...f, photo: f.photo || FACULTY_PLACEHOLDER_PHOTO }));
export const FACULTY_HAS_PLACEHOLDERS = ALL_FACULTY.some((f) => f.placeholder);

export const SUBJECTS = [
  { key: 'physics', name: 'Physics' },
  { key: 'chemistry', name: 'Chemistry' },
  { key: 'maths', name: 'Mathematics' },
  { key: 'biology', name: 'Biology' },
  { key: 'computer', name: 'Computer Science' },
  { key: 'mentorship', name: 'Academic Mentors & Staff' }
];
export const subjectName = (key) => SUBJECTS.find((s) => s.key === key)?.name || key;
