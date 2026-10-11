// Loads the starting content from the design concept into an empty database.
// Safe to run more than once: each collection is only filled when it is empty.
//   npm run seed
import mongoose from 'mongoose';
import { config } from '../config.js';
import { Settings, Notice, Review, Post } from '../models/index.js';
import { DEFAULT_SETTINGS } from '../lib/defaults.js';
import { cleanHtml } from '../lib/util.js';
import { POSTS, postFields } from '../content/posts.js';

await mongoose.connect(config.mongoUri);
const done = [];

if (!(await Settings.exists({ key: 'site' }))) {
  await Settings.create({ key: 'site', ...DEFAULT_SETTINGS });
  done.push('settings');
}

// The Gallery starts with the institute's own photos (client/src/content/gallery.js), so nothing is seeded here.

if (!(await Notice.exists({}))) {
  const now = Date.now();
  await Notice.insertMany([
    { title: 'New batches starting', text: '[ANNOUNCEMENT — add batch start dates and programmes]', category: 'BATCHES', date: new Date(now), link: '/programs' },
    { title: 'Latest results announced', text: '[ANNOUNCEMENT — add results highlights]', category: 'RESULTS', date: new Date(now - 86400000), link: '/results' },
    { title: 'Admission test dates', text: '[ANNOUNCEMENT — add test windows and registration deadline]', category: 'NOTICES', date: new Date(now - 2 * 86400000), link: '/contact' }
  ]);
  done.push('notices');
}

if (!(await Review.exists({}))) {
  await Review.insertMany([
    { name: '[PARENT NAME]', role: 'Parent of a Class 12 student', quote: '[TESTIMONIAL — a short quote from a parent, shared with permission.]', order: 0 },
    { name: '[STUDENT NAME]', role: '[EXAM, YEAR, RANK]', quote: '[TESTIMONIAL — a short quote from a student, shared with permission.]', order: 1 },
    { name: '[STUDENT NAME]', role: '[PROGRAM]', quote: '[TESTIMONIAL — a short quote from a student, shared with permission.]', order: 2 }
  ]);
  done.push('reviews');
}

if (!(await Post.exists({}))) {
  const now = Date.now();
  await Post.insertMany(POSTS.map((p, i) => ({ slug: p.slug, publishAt: new Date(now - i * 86400000), ...postFields(p, cleanHtml) })));
  done.push('blog posts');
}

console.log(done.length ? `Seeded: ${done.join(', ')}.` : 'Nothing to seed: the database already has content.');
await mongoose.disconnect();
