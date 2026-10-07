// Server-side page titles, descriptions and share previews. WhatsApp, Facebook and
// search engines read these from the HTML before any JavaScript runs.
import { Post } from './models/index.js';
import { publishedFilter } from './routes/public.js';
import { getSettings, plainText } from './lib/util.js';
import { config } from './config.js';
import { BRAND_NAME } from '../client/src/lib/brand.js';

export const SITE_NAME = BRAND_NAME;

export const PAGES = {
  '/': { title: `${SITE_NAME} | JEE, NEET and Foundation Coaching`, description: 'Focused academic programs for JEE, NEET and Foundation courses with expert faculty, structured learning and proven results.' },
  '/about': { title: `About Us | ${SITE_NAME}`, description: 'HAwk ACademe prepares students for JEE, NEET and Foundation exams with focused teaching, personal mentorship and a culture of hard work.' },
  '/programs': { title: `Programs: JEE, NEET, Foundation and Integrated | ${SITE_NAME}`, description: 'Four clear paths, one standard of teaching. Classes covered, duration, batch size and mode for every HAwk ACademe program.' },
  '/results': { title: `Results and Toppers | ${SITE_NAME}`, description: 'HAwk ACademe toppers and selections in JEE Advanced, JEE Main, NEET and board exams, year by year.' },
  '/gallery': { title: `Gallery | ${SITE_NAME}`, description: 'Photos of classrooms, seminars, activities, celebrations and campus life at HAwk ACademe.' },
  '/blog': { title: `Blog: Exam Tips and Study Plans | ${SITE_NAME}`, description: 'Exam tips, study plans and guidance for students and parents from the HAwk ACademe faculty.' },
  '/news': { title: `News and Announcements | ${SITE_NAME}`, description: 'New batches, admission test dates, results and notices from HAwk ACademe.' },
  '/contact': { title: `Contact Us | ${SITE_NAME}`, description: 'Questions about programs, batches or admission tests? Send us a message, call or visit and our team will guide you.' }
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const abs = (u) => (/^https?:\/\//.test(u) ? u : config.siteUrl + u);

// Works out the meta tags (and HTTP status) for a request path.
export async function metaFor(path) {
  const clean = path.replace(/\/+$/, '') || '/';
  let meta = PAGES[clean];
  let status = 200;
  let type = 'website';
  let image = '/img/share.jpg';
  let robots = 'index,follow';
  let jsonLd = null;

  if (!meta && clean.startsWith('/admin')) {
    meta = { title: `Admin | ${SITE_NAME}`, description: 'HAwk ACademe site administration.' };
    robots = 'noindex,nofollow';
  } else if (!meta && clean.startsWith('/blog/')) {
    const slug = decodeURIComponent(clean.slice(6)).toLowerCase();
    const post = /^[a-z0-9-]{1,90}$/.test(slug) ? await Post.findOne({ ...publishedFilter(), slug }).select('title excerpt content cover publishAt').lean() : null;
    if (post) {
      meta = { title: `${post.title} | ${SITE_NAME}`, description: post.excerpt || plainText(post.content).slice(0, 160) };
      type = 'article';
      if (post.cover?.url) image = post.cover.url;
    }
  }
  if (!meta) {
    meta = { title: `Page not found | ${SITE_NAME}`, description: 'The page you were looking for could not be found.' };
    status = 404;
    robots = 'noindex,follow';
  }
  if (clean === '/') {
    const s = await getSettings();
    jsonLd = {
      '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: SITE_NAME, url: config.siteUrl,
      logo: abs('/img/logo.png'), image: abs('/img/share.jpg'), email: s.email || undefined,
      telephone: s.phone && !s.phone.includes('[') ? s.phone : undefined,
      address: s.address && !s.address.includes('[') ? s.address : undefined,
      sameAs: Object.values(s.social || {}).filter(Boolean)
    };
  }
  const url = config.siteUrl + (clean === '/' ? '/' : clean);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="robots" content="${robots}">`,
    status === 200 ? `<link rel="canonical" href="${esc(url)}">` : '',
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(abs(image))}">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''
  ].filter(Boolean).join('\n    ');
  return { tags, status };
}

export async function sitemapXml() {
  const posts = await Post.find(publishedFilter()).select('slug updatedAt').sort({ publishAt: -1 }).lean();
  const urls = [
    ...Object.keys(PAGES).map((p) => ({ loc: config.siteUrl + p, pri: p === '/' ? '1.0' : '0.8' })),
    ...posts.map((p) => ({ loc: `${config.siteUrl}/blog/${p.slug}`, lastmod: p.updatedAt?.toISOString().slice(0, 10), pri: '0.6' }))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.pri}</priority></url>`).join('\n')}\n</urlset>\n`;
}

export const robotsTxt = () => `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`;
