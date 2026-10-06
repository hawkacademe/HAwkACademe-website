import sanitizeHtml from 'sanitize-html';
import { Settings } from '../models/index.js';
import { DEFAULT_SETTINGS } from './defaults.js';

// Only formatting that the blog editor can produce is kept; scripts, styles and
// event handlers are stripped so a post can never run code on the site.
export function cleanHtml(html) {
  return sanitizeHtml(String(html || ''), {
    allowedTags: ['p', 'br', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'hr', 'img', 'code', 'pre'],
    allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt', 'width', 'height'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tag, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href || '');
        return { tagName: 'a', attribs: external ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' } : { href: attribs.href } };
      }
    }
  });
}

export const plainText = (html) => sanitizeHtml(String(html || ''), { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();

export function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'post';
}

// Returns the settings document merged over the defaults, so new fields always have a value.
export async function getSettings() {
  const doc = (await Settings.findOne({ key: 'site' }).lean()) || {};
  const out = { ...DEFAULT_SETTINGS };
  for (const [k, v] of Object.entries(doc)) {
    if (v === undefined || v === null || k === '_id' || k === '__v') continue;
    out[k] = v;
  }
  out.social = { ...DEFAULT_SETTINGS.social, ...(doc.social || {}) };
  return out;
}

export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Wraps async route handlers so errors reach the error middleware.
export const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}
