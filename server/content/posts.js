// All blog articles that ship with the site. Loaded by `npm run seed` (empty database)
// and `npm run update-content` (adds new posts and updates existing ones by slug).
// Cover photos are from Unsplash (free to use under the Unsplash License) and live in client/public/img/blog.
import { POSTS_A } from './posts-a.js';
import { POSTS_B } from './posts-b.js';

export const POSTS = [...POSTS_A, ...POSTS_B];

// The fields saved to the database for one article.
export const postFields = (p, cleanHtml) => ({
  title: p.title,
  category: p.category,
  excerpt: p.excerpt,
  content: cleanHtml(p.content.trim()),
  cover: { url: `/img/blog/${p.cover}.webp`, key: '', alt: p.coverAlt, width: 1200, height: 675 },
  status: 'published'
});
