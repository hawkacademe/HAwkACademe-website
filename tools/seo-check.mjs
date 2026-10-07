// SEO regression check against a running site (production by default).
//   node tools/seo-check.mjs [https://www.hawkacademe.com]
// For every URL in sitemap.xml: HTTP 200, full server-rendered HTML (no JavaScript
// needed), title/description length, self-referencing canonical, exactly one H1,
// valid JSON-LD, no visible [PLACEHOLDER] text, brand spelled "HAwk ACademe", and no
// broken internal links. Also checks robots.txt, llms.txt and the 404 status.
const BASE = (process.argv[2] || 'https://www.hawkacademe.com').replace(/\/$/, '');
const BRAND = 'HAwk ACademe';
const problems = [];
const warn = [];
const fail = (url, msg) => problems.push(`${url}: ${msg}`);

const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const get = async (url, opts) => { const r = await fetch(url, { redirect: 'manual', ...opts }); return { status: r.status, body: await r.text(), headers: r.headers }; };

const sm = await get(`${BASE}/sitemap.xml`);
if (sm.status !== 200) { console.error(`sitemap.xml returned ${sm.status}`); process.exit(1); }
const urls = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https:\/\/www\.hawkacademe\.com/, BASE));
const titles = new Map();
const links = new Set();

for (const url of urls) {
  const { status, body } = await get(url);
  if (status !== 200) { fail(url, `status ${status}`); continue; }
  const head = body.split('<body')[0];
  const bodyHtml = body.split('<body')[1] || '';
  const title = (head.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (head.match(/name="description" content="([^"]*)"/) || [])[1] || '';
  const canonical = (head.match(/rel="canonical" href="([^"]*)"/) || [])[1] || '';
  const robots = (head.match(/name="robots" content="([^"]*)"/) || [])[1] || '';
  const words = text(bodyHtml).split(' ').length;
  const h1 = (bodyHtml.match(/<h1[\s>]/g) || []).length;

  if (!title) fail(url, 'missing <title>');
  else if (title.length > 65) warn.push(`${url}: title is ${title.length} chars`);
  if (titles.has(title)) fail(url, `duplicate title (also ${titles.get(title)})`); else titles.set(title, url);
  if (desc.length < 70 || desc.length > 170) warn.push(`${url}: description is ${desc.length} chars`);
  if (canonical.replace('https://www.hawkacademe.com', BASE) !== url) fail(url, `canonical is ${canonical}`);
  if (/noindex/.test(robots)) fail(url, 'listed in sitemap but noindex');
  if (h1 !== 1) fail(url, `${h1} <h1> elements`);
  if (words < 150) fail(url, `only ${words} words in the server HTML (JavaScript needed?)`);
  for (const m of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(url, 'invalid JSON-LD'); }
  }
  if (!/application\/ld\+json/.test(body)) fail(url, 'no structured data');
  const visible = text(bodyHtml) + ' ' + title + ' ' + desc;
  const ph = visible.match(/\[[A-Z][A-Z /\-—]{2,}[^\]]{0,40}\]/g);
  if (ph) fail(url, `visible placeholder ${ph.slice(0, 2).join(', ')}`);
  for (const m of visible.matchAll(/h\s*a\s*w\s*k[\s_-]*a\s*c\s*a\s*d\s*e\s*m\s*[ey]/gi)) {
    if (m[0] !== BRAND && !(m[0] === m[0].toLowerCase() && !/\s/.test(m[0]))) fail(url, `brand spelled "${m[0]}"`);
  }
  for (const m of bodyHtml.matchAll(/href="(\/[^"#?]*)/g)) if (!m[1].startsWith('/admin')) links.add(m[1]);
}

for (const path of links) {
  const { status } = await get(BASE + path, { method: 'HEAD' });
  if (status >= 400) fail(BASE + path, `broken internal link (${status})`);
}
const r404 = await get(`${BASE}/this-page-should-not-exist-${Date.now()}`);
if (r404.status !== 404) fail('unknown URL', `returned ${r404.status}, expected 404`);
const robots = await get(`${BASE}/robots.txt`);
if (!/Sitemap: https?:\/\/\S+\/sitemap\.xml/.test(robots.body) || /Disallow: \/\s*$/m.test(robots.body)) fail('robots.txt', 'missing sitemap line or blocks the whole site');
const llms = await get(`${BASE}/llms.txt`);
if (llms.status !== 200 || !llms.body.startsWith(`# ${BRAND}`)) fail('llms.txt', `status ${llms.status} or wrong heading`);

console.log(`Checked ${urls.length} sitemap URLs and ${links.size} internal links on ${BASE}.`);
if (warn.length) console.log(`Warnings:\n  ${warn.join('\n  ')}`);
if (problems.length) { console.error(`SEO check failed:\n  ${problems.join('\n  ')}`); process.exit(1); }
console.log('SEO check passed.');
