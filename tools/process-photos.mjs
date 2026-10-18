// Turns the institute's original photos in images/ into the compressed WebP files the site serves.
//   images/gallery/photo-N.jpg   -> client/public/img/life/photo-N.webp (1600px) and photo-N-640.webp
//   images/faculty/<id>.(jpg|png) -> client/public/img/faculty/<id>.webp (600x600, square)
// Only files that do not exist yet are made; pass --all to remake every file.
//   node tools/process-photos.mjs
// To add a gallery photo: save it as the next images/gallery/photo-N.jpg, run this, then list it in
// client/src/content/gallery.js (and give it a quote in HERO_QUOTES in client/src/content/home.js).
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const all = process.argv.includes('--all');
let made = 0;

async function make(src, out, resize, quality = 78) {
  if (!all && existsSync(out)) return;
  await sharp(src).rotate().resize(resize).webp({ quality }).toFile(out);
  made++;
}

const LIFE = `${ROOT}client/public/img/life/`;
mkdirSync(LIFE, { recursive: true });
for (const f of readdirSync(`${ROOT}images/gallery`)) {
  const m = f.match(/^(photo-\d+)\.(jpe?g|png|webp)$/i);
  if (!m) continue;
  const src = `${ROOT}images/gallery/${f}`;
  await make(src, `${LIFE}${m[1]}.webp`, { width: 1600, withoutEnlargement: true });
  await make(src, `${LIFE}${m[1]}-640.webp`, { width: 640, withoutEnlargement: true }, 72);
}

const FACULTY = `${ROOT}client/public/img/faculty/`;
mkdirSync(FACULTY, { recursive: true });
for (const f of readdirSync(`${ROOT}images/faculty`)) {
  const m = f.match(/^([a-z0-9-]+)\.(jpe?g|png|webp)$/i);
  if (m) await make(`${ROOT}images/faculty/${f}`, `${FACULTY}${m[1].toLowerCase()}.webp`, { width: 600, height: 600, fit: 'cover', position: 'top' }, 80);
}

console.log(`Made ${made} image file(s).`);
