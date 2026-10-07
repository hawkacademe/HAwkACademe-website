// Server-side rendering of public pages with the React app built into client/dist-ssr.
// Admin pages are left to the browser. If the SSR bundle is missing (e.g. `npm run dev`),
// pages are served as before and render in the browser.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadApiPath } from './lib/publicData.js';

const BUNDLE = join(process.cwd(), 'client', 'dist-ssr', 'entry-server.js');
let mod;
async function bundle() {
  if (mod === undefined) mod = existsSync(BUNDLE) ? await import(pathToFileURL(BUNDLE).href) : null;
  return mod;
}

// API paths each page reads through useData; anything missed is picked up by a second pass.
function pathsFor(path) {
  const p = path.replace(/\/+$/, '') || '/';
  const list = ['/site'];
  if (p === '/') list.push('/notices?limit=4', '/reviews');
  else if (p === '/news') list.push('/notices');
  else if (p === '/gallery') list.push('/gallery');
  else if (p === '/blog') list.push('/posts');
  else if (p.startsWith('/blog/')) {
    let slug = p.slice(6);
    try { slug = decodeURIComponent(slug); } catch { /* keep raw */ }
    list.push(`/posts/${encodeURIComponent(slug)}`);
  }
  return list;
}

async function load(paths, into) {
  await Promise.all(paths.filter((p) => !(p in into)).map(async (p) => { into[p] = await loadApiPath(p); }));
  return into;
}

// Returns { html, json } or null when the page should render in the browser only.
export async function renderPage(url, path) {
  if (/^\/admin(\/|$)/.test(path)) return null;
  const b = await bundle();
  if (!b) return null;
  const values = await load(pathsFor(path), {});
  let out = await b.render(url, values);
  if (out.missing.length) {
    await load(out.missing, values);
    out = await b.render(url, values);
  }
  return { html: out.html, json: JSON.stringify(values).replace(/</g, '\\u003c') };
}
