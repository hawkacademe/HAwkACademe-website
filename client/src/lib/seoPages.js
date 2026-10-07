// Titles and descriptions for every page, in ONE place. The server puts them in the HTML
// (seo.js) and the browser updates them when moving between pages (usePageMeta).
// Keep titles about 50-60 characters and descriptions about 140-160.
import { BRAND_NAME } from './brand.js';

export const SITE_AREAS = 'Barasat, Madhyamgram and New Town, Kolkata';

// Program landing pages: /programs/<slug>
export const LANDING_SLUGS = {
  jee: 'jee-coaching-madhyamgram-kolkata',
  neet: 'neet-coaching-madhyamgram-kolkata',
  foundation: 'foundation-course-class-8-9-10-kolkata'
};
export const landingPath = (key) => `/programs/${LANDING_SLUGS[key]}`;

export const PAGES = {
  '/': {
    title: `JEE & NEET Coaching in Madhyamgram, Kolkata | ${BRAND_NAME}`,
    description: `${BRAND_NAME} offers JEE, NEET and Class 8 to 10 Foundation coaching at centres in Barasat, Madhyamgram and New Town, Kolkata. Call or WhatsApp to enquire.`
  },
  '/about': {
    title: `About ${BRAND_NAME} | JEE & NEET Coaching, Kolkata`,
    description: `How ${BRAND_NAME} teaches JEE, NEET and Foundation students in Kolkata: concept-first classes, regular tests, weekly doubt sessions and personal mentoring.`
  },
  '/programs': {
    title: `JEE, NEET & Foundation Courses in Kolkata | ${BRAND_NAME}`,
    description: `Compare ${BRAND_NAME}'s JEE (Main & Advanced), NEET (UG), Class 8 to 10 Foundation and Integrated programs: subjects, classes, batch size and mode.`
  },
  '/results': {
    title: `JEE & NEET Results and Toppers | ${BRAND_NAME} Kolkata`,
    description: `How ${BRAND_NAME} publishes JEE Main, JEE Advanced, NEET-UG and board results: the exact rank, exam and year, shown only with the student's written consent.`
  },
  '/gallery': {
    title: `Photo Gallery: Classes & Events | ${BRAND_NAME} Kolkata`,
    description: `Photos of classrooms, seminars, student activities and celebrations at ${BRAND_NAME}'s JEE, NEET and Foundation coaching centres in North Kolkata.`
  },
  '/blog': {
    title: `JEE & NEET Exam Tips and Study Plans | ${BRAND_NAME} Blog`,
    description: `Exam strategy, study plans and advice for students and parents preparing for JEE, NEET and Class 8 to 10 Foundation, from the ${BRAND_NAME} faculty in Kolkata.`
  },
  '/news': {
    title: `Admissions, Batches & Test Dates | ${BRAND_NAME} News`,
    description: `Latest notices from ${BRAND_NAME}, Kolkata: new JEE, NEET and Foundation batches, admission and scholarship test dates, results and centre announcements.`
  },
  '/contact': {
    title: `Contact ${BRAND_NAME} | Barasat, Madhyamgram, New Town`,
    description: `Call, WhatsApp or send an enquiry to ${BRAND_NAME}, or visit our JEE, NEET and Foundation coaching centres in Barasat, Madhyamgram and New Town, Kolkata.`
  },
  [landingPath('jee')]: {
    title: `JEE Coaching in Madhyamgram, Kolkata | ${BRAND_NAME}`,
    description: `JEE Main and Advanced coaching in Physics, Chemistry and Maths at ${BRAND_NAME}, Barasat, Madhyamgram and New Town: weekly tests, full mocks and doubt sessions.`
  },
  [landingPath('neet')]: {
    title: `NEET Coaching in Madhyamgram, Kolkata | ${BRAND_NAME}`,
    description: `NEET-UG coaching at ${BRAND_NAME} in Barasat, Madhyamgram and New Town, Kolkata: NCERT-focused Biology, Physics and Chemistry, NEET-pattern tests, doubt sessions.`
  },
  [landingPath('foundation')]: {
    title: `Class 8-10 Foundation Course, Kolkata | ${BRAND_NAME}`,
    description: `Class 8, 9 and 10 foundation course at ${BRAND_NAME}, Kolkata: Maths, Science and reasoning from first principles, with olympiad and talent-search preparation.`
  },
  '/privacy': {
    title: `Privacy Policy | ${BRAND_NAME}`,
    description: `How ${BRAND_NAME} collects, uses and protects the details you share through our website enquiry form, and how to ask us to correct or delete them.`
  },
  '/terms': {
    title: `Website Terms of Use | ${BRAND_NAME}`,
    description: `The terms that apply when you use the ${BRAND_NAME} website, including how we present course information, results and third-party links such as maps.`
  }
};

// Date each page's content last changed (YYYY-MM-DD), used as <lastmod> in sitemap.xml.
// Update it when you change a page's text.
export const UPDATED = {
  '/': '2026-10-07', '/about': '2026-10-07', '/programs': '2026-10-07', '/results': '2026-10-07', '/gallery': '2026-10-07',
  '/blog': '2026-10-07', '/news': '2026-10-07', '/contact': '2026-10-07',
  [landingPath('jee')]: '2026-10-07', [landingPath('neet')]: '2026-10-07', [landingPath('foundation')]: '2026-10-07',
  '/privacy': '2026-10-07', '/terms': '2026-10-07'
};

export const pageMeta = (path) => PAGES[path] || PAGES['/'];
