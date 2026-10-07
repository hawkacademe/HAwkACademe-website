// Public content, shared by the /api routes and the server-side renderer, so a page
// rendered on the server sees exactly the data the browser would fetch.
import { Post, Photo, Notice, Review } from '../models/index.js';
import { getSettings } from './util.js';
import { config } from '../config.js';

export const publishedFilter = () => ({ status: 'published', publishAt: { $lte: new Date() } });

const postCard = (p) => ({
  slug: p.slug, title: p.title, category: p.category, excerpt: p.excerpt, coverStyle: p.coverStyle,
  cover: p.cover?.url ? { url: p.cover.url, alt: p.cover.alt || p.title } : null, date: p.publishAt, updated: p.updatedAt, author: p.author
});

// Settings still holding a [PLACEHOLDER] are not shown to visitors (Admin still shows them).
const real = (v) => (typeof v === 'string' && /\[[^\]]*\]/.test(v) ? '' : v);

export async function siteData() {
  const s = await getSettings();
  return {
    phone: real(s.phone), whatsapp: s.whatsapp, email: real(s.email), address: real(s.address), mapsLink: s.mapsLink, mapEmbed: s.mapEmbed,
    officeHours: (s.officeHours || []).filter((h) => real(h.days) && real(h.hours)), responseTime: real(s.responseTime),
    social: s.social, highlights: (s.highlights || []).filter((h) => real(h.value) && real(h.label)), programs: s.programs,
    turnstileSiteKey: config.turnstile.siteKey
  };
}

export async function noticesData({ limit } = {}) {
  const n = Math.min(Number(limit) || 50, 100);
  const notices = (await Notice.find({ published: true }).sort({ pinned: -1, date: -1 }).limit(n).lean()).filter((x) => real(x.title) && real(x.text));
  return { notices: notices.map((x) => ({ id: String(x._id), title: x.title, text: x.text, category: x.category, date: x.date, link: x.link, pinned: x.pinned })) };
}

export async function postsData({ category, limit } = {}) {
  const q = publishedFilter();
  if (category && category !== 'all') q.category = String(category);
  const n = Math.min(Number(limit) || 60, 100);
  const posts = await Post.find(q).sort({ publishAt: -1 }).limit(n).select('-content').lean();
  return { posts: posts.map(postCard) };
}

// null when the post does not exist or is not published yet.
export async function postData(slug) {
  const post = await Post.findOne({ ...publishedFilter(), slug: String(slug).toLowerCase() }).lean();
  if (!post) return null;
  const related = await Post.find({ ...publishedFilter(), _id: { $ne: post._id } }).sort({ publishAt: -1 }).limit(12).select('-content').lean();
  related.sort((a, b) => (b.category === post.category) - (a.category === post.category));
  return { post: { ...postCard(post), content: post.content }, related: related.slice(0, 3).map(postCard) };
}

export async function galleryData() {
  const photos = await Photo.find().sort({ order: 1, createdAt: -1 }).lean();
  return { photos: photos.map((p) => ({ id: String(p._id), url: p.url, thumbUrl: p.thumbUrl || p.url, caption: p.caption, alt: p.alt || p.caption, category: p.category, width: p.width, height: p.height })) };
}

export async function reviewsData() {
  const reviews = (await Review.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean()).filter((x) => real(x.name) && real(x.quote) && real(x.role || ''));
  return { reviews: reviews.map((x) => ({ id: String(x._id), name: x.name, role: x.role, quote: x.quote })) };
}

// Resolves a client API path (as passed to useData, e.g. "/notices?limit=4") to its data.
// Returns { data } or { error: { status, message } }.
export async function loadApiPath(apiPath) {
  const u = new URL(apiPath, 'http://x');
  const q = Object.fromEntries(u.searchParams);
  const p = u.pathname;
  if (p === '/site') return { data: await siteData() };
  if (p === '/notices') return { data: await noticesData(q) };
  if (p === '/posts') return { data: await postsData(q) };
  if (p.startsWith('/posts/')) {
    const d = await postData(decodeURIComponent(p.slice(7)));
    return d ? { data: d } : { error: { status: 404, message: 'Post not found' } };
  }
  if (p === '/gallery') return { data: await galleryData() };
  if (p === '/reviews') return { data: await reviewsData() };
  return { error: { status: 404, message: 'Not found' } };
}
