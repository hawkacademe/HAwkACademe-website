// Loads the starting content from the design concept into an empty database.
// Safe to run more than once: each collection is only filled when it is empty.
//   npm run seed
import mongoose from 'mongoose';
import { config } from '../config.js';
import { Settings, Photo, Notice, Review, Post } from '../models/index.js';
import { DEFAULT_SETTINGS } from '../lib/defaults.js';
import { slugify } from '../lib/util.js';

await mongoose.connect(config.mongoUri);
const done = [];

if (!(await Settings.exists({ key: 'site' }))) {
  await Settings.create({ key: 'site', ...DEFAULT_SETTINGS });
  done.push('settings');
}

if (!(await Photo.exists({}))) {
  const G = [
    ['Classroom', 'classroom', 'Classroom with blackboard and desks', 'Classroom learning'],
    ['Classroom', 'doubt-sessions', 'Doubt session chat bubbles', 'Doubt sessions'],
    ['Seminars', 'seminars', 'Seminar presentation screen', 'Seminars and workshops'],
    ['Activities', 'activities', 'Chess, football and science activities', 'Student activities'],
    ['Celebrations', 'celebrations', 'Trophy and confetti celebration', 'Celebrations'],
    ['Campus', 'campus-night', 'HAwk ACademe campus at night', 'The campus'],
    ['Classroom', 'study-desk', 'Study books, laptop and notes on a desk', 'Study resources']
  ];
  await Photo.insertMany(G.map(([category, file, alt, caption], i) => ({ url: `/img/${file}.webp`, thumbUrl: `/img/${file}.webp`, alt, caption, category, order: i })));
  done.push('gallery');
}

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
  const P = [
    ['Exam Tips', 'How to plan the last 90 days before JEE Main', 'A calm, week-by-week way to use your final months well.', 'physics'],
    ['Exam Tips', 'Reading NCERT Biology the right way for NEET', 'What to underline, what to revise and what to practise.', 'biology'],
    ['Parents', 'Handling exam stress: a guide for parents', 'How to support your child without adding pressure.', 'chemistry'],
    ['Study Plans', 'Why Class 9 matters more than you think', 'Foundation habits that pay off in Classes 11 and 12.', 'maths'],
    ['Study Plans', 'Building a daily study routine that lasts', 'Small, repeatable blocks beat occasional marathons.', 'physics'],
    ['Exam Tips', 'What a good mock test review looks like', 'Turn every test into a list of fixes, not just a score.', 'maths']
  ];
  const now = Date.now();
  await Post.insertMany(P.map(([category, title, excerpt, coverStyle], i) => ({
    category, title, excerpt, coverStyle, slug: slugify(title), status: 'published', publishAt: new Date(now - i * 3 * 86400000),
    content: `<p>${excerpt}</p><p>[ARTICLE TEXT — replace this sample post with the full article in Admin &gt; Blog, or delete it.]</p>`
  })));
  done.push('blog posts');
}

console.log(done.length ? `Seeded: ${done.join(', ')}.` : 'Nothing to seed: the database already has content.');
await mongoose.disconnect();
