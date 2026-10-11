// Uploads the institute's own photos and the blog cover photos to photo storage (Cloudinary in
// production) and saves them in the database, so they can be managed in Admin like any upload.
//  - Gallery: the photos listed in client/src/content/gallery.js, read from the original files in images/
//  - Blog: each post in server/content/posts.js that still uses a built-in /img/blog/ cover
// Safe to run more than once: photos already in the Gallery (same description) are skipped.
//   npm run upload-own-photos
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { Photo, Post } from '../models/index.js';
import { saveImage } from '../lib/storage.js';
import { LIFE_PHOTOS } from '../../client/src/content/gallery.js';
import { POSTS } from '../content/posts.js';

await mongoose.connect(config.mongoUri);

let gallery = 0;
for (const [i, p] of LIFE_PHOTOS.entries()) {
  if (await Photo.exists({ alt: p.alt })) continue;
  const n = p.id.replace('life-', '');
  const img = await saveImage(await readFile(`images/image-${n}.jpg`), { folder: 'gallery', maxWidth: 1600, thumbWidth: 640 });
  await Photo.create({ url: img.url, key: img.key, thumbUrl: img.thumbUrl, thumbKey: img.thumbKey, width: img.width, height: img.height, caption: '', alt: p.alt, category: p.category, order: i });
  gallery++;
}

let covers = 0;
for (const p of POSTS) {
  const post = await Post.findOne({ slug: p.slug });
  if (!post || (post.cover?.url && !post.cover.url.startsWith('/img/blog/'))) continue;
  const img = await saveImage(await readFile(`client/public/img/blog/${p.cover}.webp`), { folder: 'blog', maxWidth: 1600 });
  post.cover = { url: img.url, key: img.key, alt: p.coverAlt, width: img.width, height: img.height };
  await post.save();
  covers++;
}

console.log(`Uploaded ${gallery} gallery photos and ${covers} blog covers (${img0()}).`);
await mongoose.disconnect();

function img0() { return config.cloudinaryUrl ? 'Cloudinary' : 'local uploads/ folder'; }
