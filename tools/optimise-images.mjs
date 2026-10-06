// Converts the design concept photos into compressed WebP files with readable names.
//   node tools/optimise-images.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../../design concept/img/', import.meta.url));
const OUT = fileURLToPath(new URL('../client/public/img/', import.meta.url));
const MAP = {
  '03cfd90962823d698c49e1254cf86c56.jpg': 'classroom',
  '1653930c30bb1905e4f290e79ecbffc3.jpg': 'program-integrated',
  '1cad1a84cf71ee6435bb22e4dd50d1d3.jpg': 'program-jee',
  '2289114caa55faa800c7830c647ad443.jpg': 'doubt-sessions',
  '323e51e51f691966cf948bf90c80f5dc.jpg': 'centre-kolkata',
  '44b33ba49e71cdae08c4d4b79ec533ca.jpg': 'seminars',
  '53c209363d8c8819bdca035aea04eba7.jpg': 'program-neet',
  '655499bb72584ba3cfee84309f147054.jpg': 'program-foundation',
  '6ef65cdf8cd99c3cb94b5f4ff2aca272.jpg': 'activities',
  '6ff13928c8a66dcaa164f9ce0e19f79d.jpg': 'centre-bangalore',
  '73ed4087b46e14d016988c689d393551.jpg': 'centre-delhi',
  '80300edf99c5d7933931ceb4aeba5d37.jpg': 'study-desk',
  'a845ea4b5c3b812ed4e7ff1ba8233f21.jpg': 'celebrations',
  'f25ef3aeb676c7475982982ffe5cb572.jpg': 'hero-pattern',
  'faa0b63fd6c07319c78ba29c46d737fe.jpg': 'centre-mumbai',
  'fd181d907de977b5c0633d4be650303c.jpg': 'campus-night',
  '6505812d54e1a28721af3aa32e2835c4.png': 'logo'
};
mkdirSync(OUT, { recursive: true });
for (const [file, name] of Object.entries(MAP)) {
  const img = sharp(SRC + file).resize({ width: 1600, withoutEnlargement: true });
  await img.clone().webp({ quality: name === 'logo' ? 90 : 78 }).toFile(`${OUT}${name}.webp`);
  if (name === 'logo') await img.clone().png({ compressionLevel: 9 }).toFile(`${OUT}${name}.png`);
}
// Share preview image (1200x630) used by WhatsApp, Facebook etc.
await sharp(SRC + 'fd181d907de977b5c0633d4be650303c.jpg').resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(`${OUT}share.jpg`);
// Favicon from the logo mark (left part of the wordmark)
await sharp(SRC + '6505812d54e1a28721af3aa32e2835c4.png').extract({ left: 0, top: 0, width: 146, height: 146 }).resize(64, 64).png().toFile(`${OUT}favicon.png`);
console.log('done');
