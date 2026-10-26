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

const FACULTY_MAP = {
  '1. Hawk Sir Chemistry "Bridging complex theory and absolute clarity.".png': 'hawk-sir.webp',
  '2. R G Sir Physics "Where complex concepts click and potential energy becomes brilliance.".png': 'rg-sir.webp',
  'Deb Sir Computer "Building the algorithmic foundations today for technologies we have yet to imagine.".png': 'deb-sir.webp',
  'Momin Sir Mathametics "Transforming raw variables into vectors of absolute precision.".png': 'momin-sir.webp',
  'Tapas Sir Biology "Where complex life science sparks and dormant genius finds its pulse.".png': 'tapas-sir.webp'
};

const STAFF_MAP = {
  '1. Subhojit Sir.png': 'subhojit-sir.webp',
  "2. Tania Ma'am.webp": 'tania-maam.webp',
  "Antara Ma'am.png": 'antara-maam.webp',
  'Sanjay Sir.png': 'sanjay-sir.webp'
};

if (existsSync(`${ROOT}images/faculty`)) {
  for (const f of readdirSync(`${ROOT}images/faculty`)) {
    if (f.startsWith('.')) continue;
    const target = FACULTY_MAP[f] || (f.match(/^([a-z0-9-]+)\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase() + '.webp');
    if (target) {
      await make(`${ROOT}images/faculty/${f}`, `${FACULTY}${target}`, { width: 600, height: 600, fit: 'cover', position: 'top' }, 82);
    }
  }
}

if (existsSync(`${ROOT}images/staff`)) {
  for (const f of readdirSync(`${ROOT}images/staff`)) {
    if (f.startsWith('.')) continue;
    const target = STAFF_MAP[f] || (f.match(/^([a-z0-9-]+)\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase() + '.webp');
    if (target) {
      await make(`${ROOT}images/staff/${f}`, `${FACULTY}${target}`, { width: 600, height: 600, fit: 'cover', position: 'top' }, 82);
    }
  }
}

console.log(`Made ${made} image file(s).`);
