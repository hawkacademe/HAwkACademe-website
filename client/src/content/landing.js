// Program landing pages (/programs/<slug>). Every statement here is either already on the
// site (teaching method, tests, centres) or general, stable information about the exam.
// Fees, batch timings and dates are NOT written here: they come from Admin > Timings &
// highlights and are shown only when filled in. Keep answers short and factual.
import { BRAND_NAME } from '../lib/brand.js';

const ADMISSION = [
  ['Enquire', 'Call, WhatsApp or send the enquiry form. Tell us the class and the exam you are aiming for.'],
  ['Diagnostic test', 'A short test of aptitude and fundamentals shows each student\'s starting point.'],
  ['Counselling', 'We discuss the result with the student and parents and recommend the right batch and centre.'],
  ['Start classes', 'The student joins the batch, gets the study plan and starts weekly tests.']
];

export const LANDINGS = {
  jee: {
    key: 'jee',
    h1: 'JEE Coaching in Madhyamgram, Kolkata',
    crumb: 'JEE Coaching',
    intro: `${BRAND_NAME} prepares Class 11, Class 12 and dropper students for JEE Main and JEE Advanced, with concept-first teaching in Physics, Chemistry and Mathematics, weekly tests, full-length mocks and personal doubt sessions, at our centres in Barasat, Madhyamgram and New Town.`,
    exam: {
      heading: 'About JEE Main and JEE Advanced',
      points: [
        'JEE Main is conducted by the National Testing Agency (NTA), usually in two sessions (January and April). It is the entrance route to NITs, IIITs and many other engineering colleges.',
        'Students who rank among the top JEE Main candidates become eligible for JEE Advanced, which is conducted by one of the IITs and decides admission to the IITs.',
        'Both exams test Physics, Chemistry and Mathematics. In West Bengal, many engineering colleges also admit through WBJEE, which covers the same subjects.',
        'Exam patterns and dates can change each year, so always check the latest information bulletin on the official websites (jeemain.nta.nic.in and the JEE Advanced site).'
      ]
    },
    cover: [
      ['Physics', 'Mechanics, electricity and magnetism, optics, modern physics and thermodynamics, taught from first principles with numerical practice.'],
      ['Chemistry', 'Physical, organic and inorganic chemistry, with NCERT as the base and JEE-level problem sets on top.'],
      ['Mathematics', 'Algebra, calculus, coordinate geometry, trigonometry and vectors, built step by step from Class 11 fundamentals.']
    ],
    faqs: [
      ['When should a student start JEE preparation?', 'Most students start at the beginning of Class 11, which leaves two full years for the syllabus and revision. Students in Class 8 to 10 can build the base early through our Foundation course, and droppers can join too.'],
      ['How do you track progress?', 'Students take weekly tests and full-length mock tests, each followed by analysis. Parents are kept informed through regular progress updates and parent-teacher meetings.'],
      ['Where can my child attend JEE classes?', `${BRAND_NAME} has centres in Barasat, Madhyamgram and New Town, Kolkata. Ask us which centre runs the batch timing that suits your child.`],
      ['What are the fees for JEE coaching?', 'Fees depend on the program, its duration and the batch. Call or WhatsApp us for the current fee for your child\'s class.'],
      ['Is there a scholarship test?', 'Yes. We hold diagnostic cum scholarship tests; upcoming dates are posted on our News page.']
    ]
  },
  neet: {
    key: 'neet',
    h1: 'NEET Coaching in Madhyamgram, Kolkata',
    crumb: 'NEET Coaching',
    intro: `${BRAND_NAME} prepares Class 11, Class 12 and dropper students for NEET-UG, with NCERT-focused teaching in Biology, Physics and Chemistry, regular NEET-pattern tests and weekly doubt-clearing sessions, at our centres in Barasat, Madhyamgram and New Town.`,
    exam: {
      heading: 'About NEET-UG',
      points: [
        'NEET-UG is the single national entrance exam for MBBS, BDS and other undergraduate medical courses in India. It is conducted by the National Testing Agency (NTA), usually once a year in May.',
        'The paper tests Physics, Chemistry and Biology (Botany and Zoology). Biology carries the largest share of marks.',
        'Most NEET questions are built closely on the NCERT textbooks for Class 11 and 12, which is why our teaching keeps NCERT at the centre.',
        'Exam patterns and dates can change each year, so always check the latest information bulletin on the official website (neet.nta.nic.in).'
      ]
    },
    cover: [
      ['Biology', 'Botany and Zoology covered line by line from NCERT, with diagrams, revision charts and previous year questions.'],
      ['Chemistry', 'Physical, organic and inorganic chemistry with NCERT as the base, plus regular practice of NEET-level questions.'],
      ['Physics', 'Concepts and numericals from first principles, with formula sheets and timed practice for accuracy and speed.']
    ],
    faqs: [
      ['Who can join the NEET course?', 'Students in Class 11 and Class 12, and droppers preparing for another attempt. Starting in Class 11 gives two full years for the syllabus and revision. Ask us for the current batch durations.'],
      ['How important is NCERT for NEET?', 'Very important. Most NEET questions follow the Class 11 and 12 NCERT textbooks closely, so our classes, notes and tests are built around them.'],
      ['Do you have doubt-clearing sessions?', 'Yes. There are doubt-clearing sessions every week, along with regular NEET-pattern assessments and revision material.'],
      ['Where are your NEET classes held?', `${BRAND_NAME} has centres in Barasat, Madhyamgram and New Town, Kolkata. Ask us which centre runs the batch that suits you.`],
      ['What are the fees for NEET coaching?', 'Fees depend on the program, its duration and the batch. Call or WhatsApp us for the current fee.']
    ]
  },
  foundation: {
    key: 'foundation',
    h1: 'Foundation Course for Class 8, 9 & 10 in Kolkata',
    crumb: 'Foundation Course',
    intro: `${BRAND_NAME}'s Foundation course builds a strong base in Maths, Science and reasoning for students in Class 8, 9 and 10, with concept building from first principles, olympiad and talent-search preparation, and an early habit of regular practice.`,
    exam: {
      heading: 'Why start early?',
      points: [
        'Class 11 Physics, Chemistry and Mathematics build directly on Class 9 and 10 concepts. Students who are comfortable with them find JEE and NEET preparation far less stressful.',
        'Olympiads and talent-search exams reward understanding over memorising, and preparing for them sharpens reasoning and problem-solving.',
        'A steady study routine formed in Class 8 to 10 carries into the board exams and the two busy years of Class 11 and 12.'
      ]
    },
    cover: [
      ['Mathematics', 'Number systems, algebra, geometry and mensuration, with the reasoning behind each method.'],
      ['Science', 'Physics, Chemistry and Biology concepts explained from first principles, with interactive, activity-based classes.'],
      ['Reasoning and olympiads', 'Logical and mental-ability practice, plus preparation for olympiad and talent-search exams.']
    ],
    faqs: [
      ['At which class should a student start JEE or NEET foundation?', 'Class 8 or 9 is a good time to start. The Foundation course strengthens Maths and Science concepts so the student enters Class 11 ready for JEE or NEET preparation.'],
      ['Does the Foundation course help with school exams?', 'Yes. The course is built on the school syllabus, so the concept building and regular practice support Class 9 and 10 board preparation as well.'],
      ['Do you prepare students for olympiads?', 'Yes. Olympiad and talent-search preparation is part of the Foundation course.'],
      ['Where are Foundation classes held?', `${BRAND_NAME} has centres in Barasat, Madhyamgram and New Town, Kolkata.`],
      ['Is there an aptitude test for Foundation students?', 'Yes. We hold a Foundation Aptitude Test for Classes 8, 9 and 10; dates are posted on our News page.']
    ]
  }
};

export { ADMISSION };
