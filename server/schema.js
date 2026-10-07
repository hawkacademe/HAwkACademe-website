// JSON-LD structured data for each page. Expanded in SEO phase 4.
import { getSettings } from './lib/util.js';
import { config } from './config.js';
import { BRAND_NAME, BRAND_ALT_NAMES } from '../client/src/lib/brand.js';

const abs = (u) => (/^https?:\/\//.test(u) ? u : config.siteUrl + u);

export async function structuredData({ path }) {
  if (path !== '/') return [];
  const s = await getSettings();
  return [{
    '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: BRAND_NAME, alternateName: BRAND_ALT_NAMES, url: config.siteUrl,
    logo: abs('/img/logo.png'), image: abs('/img/share.jpg'), email: s.email || undefined,
    telephone: s.phone && !s.phone.includes('[') ? s.phone : undefined,
    sameAs: Object.values(s.social || {}).filter(Boolean)
  }];
}
