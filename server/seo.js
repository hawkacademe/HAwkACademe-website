// Server-side page titles, descriptions, share previews and sitemap. Search engines, AI
// crawlers and WhatsApp/Facebook read these from the HTML before any JavaScript runs.
// Page titles and descriptions live in client/src/lib/seoPages.js (one list for server and browser).
import { Post } from './models/index.js';
import { publishedFilter } from './lib/publicData.js';
import { plainText } from './lib/util.js';
import { config } from './config.js';
import { BRAND_NAME } from '../client/src/lib/brand.js';
import { PAGES, UPDATED } from '../client/src/lib/seoPages.js';
import { structuredData } from './schema.js';

export const SITE_NAME = BRAND_NAME;
export { PAGES };

const SHARE = { url: '/img/share.jpg', width: 1200, height: 630, alt: `${BRAND_NAME}: JEE, NEET and Foundation coaching in Kolkata` };
const NOINDEX_PAGES = new Set(); // pages to keep out of search results and the sitemap

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const abs = (u) => (/^https?:\/\//.test(u) ? u : config.siteUrl + u);

// A post that still holds sample text ("[ARTICLE TEXT ...]") must not be indexed.
export const isPlaceholderPost = (p) => /\[[A-Z][A-Z \-—]{3,}/.test(`${p.title} ${p.excerpt} ${p.content}`);

// Works out the meta tags (and HTTP status) for a request path.
export async function metaFor(path) {
  const clean = path.replace(/\/+$/, '') || '/';
  let meta = PAGES[clean];
  let status = 200;
  let type = 'website';
  let image = SHARE;
  let robots = NOINDEX_PAGES.has(clean) ? 'noindex,follow' : 'index,follow,max-image-preview:large';
  let post = null;

  if (!meta && clean.startsWith('/admin')) {
    meta = { title: `Admin | ${BRAND_NAME}`, description: `${BRAND_NAME} site administration.` };
    robots = 'noindex,nofollow';
  } else if (!meta && clean.startsWith('/blog/')) {
    const slug = decodeURIComponent(clean.slice(6)).toLowerCase();
    post = /^[a-z0-9-]{1,90}$/.test(slug) ? await Post.findOne({ ...publishedFilter(), slug }).select('title excerpt content cover publishAt updatedAt author category').lean() : null;
    if (post) {
      meta = { title: `${post.title} | ${BRAND_NAME}`, description: (post.excerpt || plainText(post.content)).slice(0, 160) };
      type = 'article';
      if (post.cover?.url) image = { url: post.cover.url, alt: post.cover.alt || post.title };
      if (isPlaceholderPost(post)) robots = 'noindex,follow';
    }
  }
  if (!meta) {
    meta = { title: `Page not found | ${BRAND_NAME}`, description: 'The page you were looking for could not be found.' };
    status = 404;
    robots = 'noindex,follow';
  }
  const url = config.siteUrl + (clean === '/' ? '/' : clean);
  const jsonLd = status === 200 && !clean.startsWith('/admin') ? await structuredData({ path: clean, url, meta, post }) : [];
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="robots" content="${robots}">`,
    status === 200 ? `<link rel="canonical" href="${esc(url)}">` : '',
    `<meta property="og:site_name" content="${esc(BRAND_NAME)}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(abs(image.url))}">`,
    image.width ? `<meta property="og:image:width" content="${image.width}">` : '',
    image.height ? `<meta property="og:image:height" content="${image.height}">` : '',
    `<meta property="og:image:alt" content="${esc(image.alt)}">`,
    `<meta property="og:locale" content="en_IN">`,
    post ? `<meta property="article:published_time" content="${new Date(post.publishAt).toISOString()}">` : '',
    post?.updatedAt ? `<meta property="article:modified_time" content="${new Date(post.updatedAt).toISOString()}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${esc(abs(image.url))}">`,
    `<meta name="twitter:image:alt" content="${esc(image.alt)}">`,
    ...jsonLd.map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`)
  ].filter(Boolean).join('\n    ');
  return { tags, status };
}

export async function sitemapXml() {
  const posts = await Post.find(publishedFilter()).select('slug title excerpt content publishAt updatedAt').sort({ publishAt: -1 }).lean();
  const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
  const urls = [
    ...Object.keys(PAGES).filter((p) => !NOINDEX_PAGES.has(p)).map((p) => ({ loc: config.siteUrl + p, lastmod: UPDATED[p] })),
    ...posts.filter((p) => !isPlaceholderPost(p)).map((p) => ({ loc: `${config.siteUrl}/blog/${p.slug}`, lastmod: day(p.updatedAt || p.publishAt) }))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${BRAND_NAME} sitemap -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
}

export const robotsTxt = () => `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`;
