// JSON-LD structured data, one @graph per page. Only facts that are visible on the site or
// confirmed by the owner go in: no ratings, reviews, prices or opening hours until real ones
// exist (opening hours are added automatically once filled in under Admin).
import { getSettings, plainText } from './lib/util.js';
import { config } from './config.js';
import { BRAND_NAME, BRAND_ALT_NAMES } from '../client/src/lib/brand.js';
import { PAGES, LANDING_SLUGS, landingPath } from '../client/src/lib/seoPages.js';
import { CENTRES } from '../client/src/content/centres.js';
import { LANDINGS } from '../client/src/content/landing.js';
import { CONTACT_FAQS } from '../client/src/content/faqs.js';
import { FOUNDER_NAME } from '../client/src/content/about.js';

const abs = (u) => (/^https?:\/\//.test(u) ? u : config.siteUrl + u);
const real = (v) => typeof v === 'string' && v.trim() && !/\[[^\]]*\]/.test(v);
const ORG = () => `${config.siteUrl}/#organization`;
const SITE = () => `${config.siteUrl}/#website`;
const centreId = (c) => `${config.siteUrl}/contact#centre-${c.key}`;

// "Monday to Saturday" + "9:00 AM - 7:00 PM" -> OpeningHoursSpecification (skipped if unparseable).
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export function openingHours(list = []) {
  const to24 = (t) => {
    const m = String(t).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
    if (!m) return null;
    let h = Number(m[1]) % 12;
    if (/pm/i.test(m[3] || '')) h += 12;
    if (!m[3] && Number(m[1]) === 12) h = 12;
    return `${String(h).padStart(2, '0')}:${m[2] || '00'}`;
  };
  const out = [];
  for (const { days, hours } of list) {
    if (!real(days) || !real(hours)) continue;
    const range = String(days).match(/(\w+)\s*(?:to|-|–)\s*(\w+)/i);
    const dayList = range
      ? DAYS.slice(DAYS.findIndex((d) => d.toLowerCase().startsWith(range[1].toLowerCase().slice(0, 3))), DAYS.findIndex((d) => d.toLowerCase().startsWith(range[2].toLowerCase().slice(0, 3))) + 1)
      : DAYS.filter((d) => d.toLowerCase().startsWith(String(days).toLowerCase().slice(0, 3)));
    const t = String(hours).split(/\s*(?:to|-|–)\s*/);
    const opens = to24(t[0]); const closes = to24(t[1] || '');
    if (dayList.length && opens && closes) out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: dayList, opens, closes });
  }
  return out.length ? out : undefined;
}

function organization(s) {
  return {
    '@type': 'EducationalOrganization',
    '@id': ORG(),
    name: BRAND_NAME,
    alternateName: BRAND_ALT_NAMES,
    url: `${config.siteUrl}/`,
    logo: { '@type': 'ImageObject', url: abs('/img/logo.png'), width: 1000, height: 148 },
    image: abs('/img/share.jpg'),
    description: PAGES['/'].description,
    telephone: real(s.phone) ? s.phone : undefined,
    email: real(s.email) ? s.email : undefined,
    areaServed: ['Barasat', 'Madhyamgram', 'New Town', 'Kolkata', 'North 24 Parganas'].map((name) => ({ '@type': 'Place', name })),
    founder: FOUNDER_NAME ? { '@type': 'Person', name: FOUNDER_NAME } : undefined,
    knowsAbout: ['JEE Main', 'JEE Advanced', 'NEET-UG', 'Foundation course for Class 8 to 10', 'Olympiad preparation'],
    sameAs: Object.values(s.social || {}).filter(real),
    location: CENTRES.map((c) => ({ '@id': centreId(c) }))
  };
}

function centre(c, s) {
  return {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': centreId(c),
    name: `${BRAND_NAME} ${c.city}`,
    parentOrganization: { '@id': ORG() },
    url: `${config.siteUrl}/contact`,
    image: abs('/img/share.jpg'),
    telephone: real(s.phone) ? s.phone : undefined,
    email: real(s.email) ? s.email : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.street || undefined,
      addressLocality: c.locality,
      addressRegion: 'West Bengal',
      postalCode: c.postalCode || undefined,
      addressCountry: 'IN'
    },
    geo: c.geo ? { '@type': 'GeoCoordinates', latitude: c.geo[0], longitude: c.geo[1] } : undefined,
    hasMap: c.mapsLink || undefined,
    openingHoursSpecification: openingHours(s.officeHours),
    areaServed: { '@type': 'City', name: 'Kolkata' }
  };
}

const website = () => ({
  '@type': 'WebSite', '@id': SITE(), url: `${config.siteUrl}/`, name: BRAND_NAME, alternateName: BRAND_ALT_NAMES,
  inLanguage: 'en-IN', publisher: { '@id': ORG() }
});

function breadcrumbs(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: config.siteUrl + (path === '/' ? '/' : path) }))
  };
}

const faqPage = (url, faqs) => ({
  '@type': 'FAQPage', '@id': `${url}#faq`,
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
});

const LEVEL = { jee: 'Class 11, Class 12 and droppers', neet: 'Class 11, Class 12 and droppers', foundation: 'Class 8, 9 and 10' };
function course(key, url) {
  const l = LANDINGS[key];
  return {
    '@type': 'Course', '@id': `${url}#course`, name: l.h1.replace(/ in (Madhyamgram, )?Kolkata$/, ''), description: l.intro, url,
    provider: { '@id': ORG() }, educationalLevel: LEVEL[key], inLanguage: 'en-IN',
    about: l.cover.map(([subject]) => subject)
  };
}

const PAGE_NAMES = {
  '/about': 'About', '/programs': 'Programs', '/results': 'Results', '/gallery': 'Gallery', '/blog': 'Blog', '/news': 'News',
  '/contact': 'Contact', '/privacy': 'Privacy Policy', '/terms': 'Terms of Use'
};

export async function structuredData({ path, url, meta, post }) {
  const s = await getSettings();
  const graph = [website(), organization(s)];
  const page = { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: meta.title, description: meta.description, isPartOf: { '@id': SITE() }, inLanguage: 'en-IN' };

  if (path === '/' || path === '/contact') graph.push(...CENTRES.map((c) => centre(c, s)));
  else delete graph[1].location; // the centres are described on Home and Contact

  const landingKey = Object.keys(LANDING_SLUGS).find((k) => landingPath(k) === path);
  if (landingKey) {
    graph.push(course(landingKey, url), faqPage(url, LANDINGS[landingKey].faqs));
    graph.push(breadcrumbs([['Home', '/'], ['Programs', '/programs'], [LANDINGS[landingKey].crumb, path]]));
    page.about = { '@id': `${url}#course` };
  } else if (post) {
    const image = post.cover?.url ? abs(post.cover.url) : abs('/img/share.jpg');
    const author = !post.author || post.author === BRAND_NAME ? { '@id': ORG() } : { '@type': 'Person', name: post.author };
    graph.push({
      '@type': 'BlogPosting', '@id': `${url}#article`, headline: post.title, description: meta.description,
      image, datePublished: new Date(post.publishAt).toISOString(), dateModified: new Date(post.updatedAt || post.publishAt).toISOString(),
      author, publisher: { '@id': ORG() }, mainEntityOfPage: { '@id': `${url}#webpage` }, articleSection: post.category,
      wordCount: plainText(post.content).split(/\s+/).filter(Boolean).length, inLanguage: 'en-IN'
    });
    graph.push(breadcrumbs([['Home', '/'], ['Blog', '/blog'], [post.title, path]]));
    page['@type'] = 'WebPage';
  } else if (PAGE_NAMES[path]) {
    graph.push(breadcrumbs([['Home', '/'], [PAGE_NAMES[path], path]]));
    if (path === '/contact') { graph.push(faqPage(url, CONTACT_FAQS)); page['@type'] = 'ContactPage'; }
    if (path === '/about') page['@type'] = 'AboutPage';
    if (path === '/blog') page['@type'] = 'CollectionPage';
  }
  graph.push(page);
  return [{ '@context': 'https://schema.org', '@graph': JSON.parse(JSON.stringify(graph)) }]; // drops undefined fields
}
