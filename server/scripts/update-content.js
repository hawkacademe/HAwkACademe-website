// Brings an existing database up to date with the content that ships in the code:
//  - adds the blog articles in server/content/posts.js and updates ones with the same slug
//  - adds any program in server/lib/defaults.js that the saved settings do not have yet (so Admin can edit it)
//  - removes the sample illustrations that the first seed put in the Gallery
// Posts and photos added in Admin are not touched.
//   npm run update-content
import mongoose from 'mongoose';
import { config } from '../config.js';
import { Photo, Post, Settings } from '../models/index.js';
import { DEFAULT_SETTINGS } from '../lib/defaults.js';
import { cleanHtml } from '../lib/util.js';
import { POSTS, postFields } from '../content/posts.js';

const SAMPLE_PHOTOS = ['classroom', 'doubt-sessions', 'seminars', 'activities', 'celebrations', 'campus-night', 'study-desk'].map((f) => `/img/${f}.webp`);

await mongoose.connect(config.mongoUri);

let added = 0, updated = 0;
const now = Date.now();
for (const [i, p] of POSTS.entries()) {
  const res = await Post.updateOne(
    { slug: p.slug },
    { $set: postFields(p, cleanHtml), $setOnInsert: { slug: p.slug, publishAt: new Date(now - i * 86400000) } },
    { upsert: true }
  );
  if (res.upsertedCount) added++; else if (res.modifiedCount) updated++;
}

const removed = await Photo.deleteMany({ url: { $in: SAMPLE_PHOTOS }, $or: [{ key: '' }, { key: { $exists: false } }] });

const site = await Settings.findOne({ key: 'site' });
const newPrograms = [];
if (site) {
  const have = new Set(site.programs.map((p) => p.key));
  // keep the default order: insert each missing program before the first saved program that follows it in the defaults
  const order = DEFAULT_SETTINGS.programs.map((p) => p.key);
  for (const p of DEFAULT_SETTINGS.programs) {
    if (have.has(p.key)) continue;
    const at = site.programs.findIndex((x) => order.indexOf(x.key) > order.indexOf(p.key));
    site.programs.splice(at < 0 ? site.programs.length : at, 0, p);
    newPrograms.push(p.key);
  }
  if (newPrograms.length) await site.save();
}

console.log(`Programs added to settings: ${newPrograms.join(', ') || 'none'}.`);
console.log(`Blog: ${added} added, ${updated} updated. Gallery: ${removed.deletedCount} sample photos removed.`);
await mongoose.disconnect();
