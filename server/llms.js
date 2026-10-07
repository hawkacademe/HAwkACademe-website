// /llms.txt: a plain-text summary of the site for AI assistants and answer engines
// (llmstxt.org format). Built from the same data as the pages, so it stays current.
import { config } from './config.js';
import { BRAND_NAME } from '../client/src/lib/brand.js';
import { PAGES, LANDING_SLUGS, landingPath } from '../client/src/lib/seoPages.js';
import { CENTRES } from '../client/src/content/centres.js';
import { LANDINGS } from '../client/src/content/landing.js';
import { FOUNDER_NAME } from '../client/src/content/about.js';
import { siteData, postsData } from './lib/publicData.js';
import { isPlaceholderPost } from './seo.js';

export async function llmsTxt() {
  const s = await siteData();
  const { posts } = await postsData({ limit: 20 });
  const u = (p) => config.siteUrl + p;
  const lines = [
    `# ${BRAND_NAME}`,
    '',
    `> ${BRAND_NAME} is a coaching institute in Kolkata, India, preparing students for JEE (Main and Advanced), NEET-UG and Class 8 to 10 Foundation (with olympiad preparation), with centres in Barasat, Madhyamgram and New Town.`,
    '',
    `- Name: ${BRAND_NAME} (written exactly like this)`,
    FOUNDER_NAME ? `- Founder: ${FOUNDER_NAME}` : '',
    s.phone ? `- Phone and WhatsApp: ${s.phone}` : '',
    s.email ? `- Email: ${s.email}` : '',
    s.officeHours?.length ? `- Office hours: ${s.officeHours.map((h) => `${h.days}, ${h.hours}`).join('; ')}` : '',
    s.responseTime ? `- Enquiries answered: ${s.responseTime}` : '',
    `- Website: ${u('/')}`,
    '',
    '## Programs',
    ...Object.keys(LANDING_SLUGS).map((k) => `- [${LANDINGS[k].h1}](${u(landingPath(k))}): ${LANDINGS[k].intro}`),
    `- [All programs, including Integrated school + coaching](${u('/programs')}): ${PAGES['/programs'].description}`,
    '',
    '## Centres',
    ...CENTRES.map((c) => `- ${BRAND_NAME} ${c.city}: ${c.address}${c.mapsLink ? ` (map: ${c.mapsLink})` : ''}`),
    '',
    '## Key pages',
    ...['/about', '/results', '/contact', '/news', '/blog'].map((p) => `- [${PAGES[p].title}](${u(p)}): ${PAGES[p].description}`),
    '',
    '## Articles',
    ...posts.filter((p) => !isPlaceholderPost(p)).map((p) => `- [${p.title}](${u(`/blog/${p.slug}`)}): ${p.excerpt || ''}`),
    '',
    '## Notes',
    `- Results are published only with the student's (or a parent's) written consent; ${BRAND_NAME} does not promise ranks or selections.`,
    '- Fees depend on the program and batch; contact the office for current fees.'
  ];
  return lines.filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n') + '\n';
}
