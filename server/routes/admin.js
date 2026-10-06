import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import {
  Post, Photo, Notice, Review, Enquiry, Settings,
  BLOG_CATEGORIES, COVER_STYLES, GALLERY_CATEGORIES, NOTICE_CATEGORIES
} from '../models/index.js';
import { requireAdmin, requireAjax } from '../lib/auth.js';
import { ah, cleanHtml, plainText, slugify, getSettings, escapeRegex, httpError } from '../lib/util.js';
import { saveImage, removeStored, MAX_UPLOAD_BYTES } from '../lib/storage.js';
import { mailConfigured } from '../lib/mail.js';
import { publishedFilter } from './public.js';

const r = Router();
r.use(requireAdmin, requireAjax);
r.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 20 },
  fileFilter: (req, file, cb) => cb(/^image\/(jpeg|png|webp|gif|heic|heif|avif)$/.test(file.mimetype) ? null : httpError(400, 'Please upload JPG, PNG or WebP photos only.'), true)
});

function parse(schema, body) {
  const p = schema.safeParse(body || {});
  if (!p.success) throw httpError(400, p.error.issues[0]?.message || 'Please check the form.');
  return p.data;
}
const isId = (id) => /^[a-f0-9]{24}$/i.test(String(id));
function idOr404(req) {
  if (!isId(req.params.id)) throw httpError(404, 'Not found.');
  return req.params.id;
}

// ---------- Overview ----------
r.get('/overview', ah(async (req, res) => {
  const [newEnq, totalEnq, recentEnq, published, drafts, scheduled, photos, notices, reviews, latestPosts, latestNotices] = await Promise.all([
    Enquiry.countDocuments({ status: 'new' }),
    Enquiry.countDocuments(),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    Post.countDocuments(publishedFilter()),
    Post.countDocuments({ status: 'draft' }),
    Post.countDocuments({ status: 'published', publishAt: { $gt: new Date() } }),
    Photo.countDocuments(),
    Notice.countDocuments({ published: true }),
    Review.countDocuments({ published: true }),
    Post.find().sort({ updatedAt: -1 }).limit(4).select('title status publishAt slug').lean(),
    Notice.find().sort({ date: -1 }).limit(4).select('title date published').lean()
  ]);
  res.json({
    stats: { newEnq, totalEnq, published, drafts, scheduled, photos, notices, reviews },
    recentEnquiries: recentEnq.map(enqOut),
    latestPosts: latestPosts.map((p) => ({ id: String(p._id), title: p.title, status: postState(p), date: p.publishAt, slug: p.slug })),
    latestNotices: latestNotices.map((n) => ({ id: String(n._id), title: n.title, date: n.date, published: n.published })),
    mailConfigured: mailConfigured()
  });
}));

// ---------- Image upload (blog covers and pictures inside posts) ----------
r.post('/uploads', upload.single('file'), ah(async (req, res) => {
  if (!req.file) throw httpError(400, 'Please choose a photo.');
  const img = await saveImage(req.file.buffer, { folder: 'blog', maxWidth: 1600 });
  res.json({ url: img.url, key: img.key, width: img.width, height: img.height });
}));

// ---------- Blog ----------
const postState = (p) => (p.status === 'draft' ? 'draft' : new Date(p.publishAt) > new Date() ? 'scheduled' : 'published');
const postOut = (p) => ({
  id: String(p._id), title: p.title, slug: p.slug, category: p.category, excerpt: p.excerpt, content: p.content,
  cover: p.cover?.url ? p.cover : null, coverStyle: p.coverStyle, author: p.author, status: p.status, state: postState(p),
  publishAt: p.publishAt, createdAt: p.createdAt, updatedAt: p.updatedAt
});

const postSchema = z.object({
  title: z.string().trim().min(3, 'Please enter a title (at least 3 characters).').max(160),
  slug: z.string().trim().max(80).optional().default(''),
  category: z.enum(BLOG_CATEGORIES),
  excerpt: z.string().trim().max(300, 'Keep the summary under 300 characters.').optional().default(''),
  content: z.string().max(200000).optional().default(''),
  cover: z.object({ url: z.string().max(500), key: z.string().max(200).optional(), alt: z.string().max(200).optional(), width: z.number().optional(), height: z.number().optional() }).nullable().optional(),
  coverStyle: z.enum(COVER_STYLES).optional().default('physics'),
  author: z.string().trim().max(80).optional().default('Hawk Academe'),
  status: z.enum(['draft', 'published']),
  publishAt: z.coerce.date().optional()
});

async function uniqueSlug(base, exceptId) {
  let slug = slugify(base);
  for (let i = 2; await Post.exists({ slug, ...(exceptId ? { _id: { $ne: exceptId } } : {}) }); i++) slug = `${slugify(base)}-${i}`;
  return slug;
}

function postFields(d) {
  const content = cleanHtml(d.content);
  return {
    title: d.title, category: d.category, content, coverStyle: d.coverStyle, author: d.author || 'Hawk Academe', status: d.status,
    excerpt: d.excerpt || plainText(content).slice(0, 180),
    cover: d.cover?.url && /^(https:\/\/|\/uploads\/|\/img\/)/.test(d.cover.url) ? { url: d.cover.url, key: d.cover.key || '', alt: d.cover.alt || d.title, width: d.cover.width, height: d.cover.height } : undefined,
    publishAt: d.publishAt || new Date()
  };
}

r.get('/posts', ah(async (req, res) => {
  const q = {};
  if (req.query.category && req.query.category !== 'all') q.category = String(req.query.category);
  if (req.query.q) q.title = new RegExp(escapeRegex(String(req.query.q).slice(0, 80)), 'i');
  const posts = await Post.find(q).sort({ publishAt: -1 }).select('-content').lean();
  res.json({ posts: posts.map(postOut) });
}));

r.get('/posts/:id', ah(async (req, res) => {
  const p = await Post.findById(idOr404(req)).lean();
  if (!p) throw httpError(404, 'Post not found.');
  res.json({ post: postOut(p) });
}));

r.post('/posts', ah(async (req, res) => {
  const d = parse(postSchema, req.body);
  const p = await Post.create({ ...postFields(d), slug: await uniqueSlug(d.slug || d.title) });
  res.status(201).json({ post: postOut(p.toObject()) });
}));

r.put('/posts/:id', ah(async (req, res) => {
  const d = parse(postSchema, req.body);
  const p = await Post.findById(idOr404(req));
  if (!p) throw httpError(404, 'Post not found.');
  const oldKey = p.cover?.key;
  const fields = postFields(d);
  Object.assign(p, fields);
  if (!fields.cover) p.cover = undefined;
  if (d.slug && slugify(d.slug) !== p.slug) p.slug = await uniqueSlug(d.slug, p._id);
  await p.save();
  if (oldKey && oldKey !== p.cover?.key) await removeStored(oldKey);
  res.json({ post: postOut(p.toObject()) });
}));

r.delete('/posts/:id', ah(async (req, res) => {
  const p = await Post.findByIdAndDelete(idOr404(req));
  if (p?.cover?.key) await removeStored(p.cover.key);
  res.json({ ok: true });
}));

// ---------- Gallery ----------
const photoOut = (p) => ({ id: String(p._id), url: p.url, thumbUrl: p.thumbUrl || p.url, caption: p.caption, alt: p.alt, category: p.category, order: p.order });

r.get('/gallery', ah(async (req, res) => {
  const photos = await Photo.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json({ photos: photos.map(photoOut), categories: GALLERY_CATEGORIES });
}));

r.post('/gallery', upload.array('files', 20), ah(async (req, res) => {
  if (!req.files?.length) throw httpError(400, 'Please choose at least one photo.');
  const category = GALLERY_CATEGORIES.includes(req.body.category) ? req.body.category : GALLERY_CATEGORIES[0];
  const caption = String(req.body.caption || '').trim().slice(0, 140);
  const alt = String(req.body.alt || '').trim().slice(0, 200);
  // New photos go to the top of the gallery.
  const first = await Photo.findOne().sort({ order: 1 }).lean();
  let order = (first?.order ?? 0) - req.files.length;
  const created = [];
  for (const f of req.files) {
    const img = await saveImage(f.buffer, { folder: 'gallery', maxWidth: 1600, thumbWidth: 640 });
    created.push(await Photo.create({
      url: img.url, key: img.key, thumbUrl: img.thumbUrl, thumbKey: img.thumbKey, width: img.width, height: img.height,
      caption, alt: alt || caption, category, order: order++
    }));
  }
  res.status(201).json({ photos: created.map((p) => photoOut(p.toObject())) });
}));

const photoSchema = z.object({
  caption: z.string().trim().max(140).optional().default(''),
  alt: z.string().trim().max(200).optional().default(''),
  category: z.enum(GALLERY_CATEGORIES)
});

r.put('/gallery/:id', ah(async (req, res) => {
  const d = parse(photoSchema, req.body);
  const p = await Photo.findByIdAndUpdate(idOr404(req), { caption: d.caption, alt: d.alt || d.caption, category: d.category }, { new: true }).lean();
  if (!p) throw httpError(404, 'Photo not found.');
  res.json({ photo: photoOut(p) });
}));

r.post('/gallery/reorder', ah(async (req, res) => {
  const ids = z.array(z.string().regex(/^[a-f0-9]{24}$/i)).max(2000).parse(req.body?.ids || []);
  await Photo.bulkWrite(ids.map((id, i) => ({ updateOne: { filter: { _id: id }, update: { order: i } } })));
  res.json({ ok: true });
}));

r.delete('/gallery/:id', ah(async (req, res) => {
  const p = await Photo.findByIdAndDelete(idOr404(req));
  if (p) { await removeStored(p.key); await removeStored(p.thumbKey); }
  res.json({ ok: true });
}));

// ---------- Notices / News ----------
const noticeOut = (n) => ({ id: String(n._id), title: n.title, text: n.text, category: n.category, date: n.date, link: n.link, pinned: n.pinned, published: n.published });
const noticeSchema = z.object({
  title: z.string().trim().min(3, 'Please enter a title (at least 3 characters).').max(160),
  text: z.string().trim().max(1000).optional().default(''),
  category: z.enum(NOTICE_CATEGORIES),
  date: z.coerce.date({ message: 'Please choose a date.' }),
  link: z.string().trim().max(200).optional().default('').refine((v) => !v || /^\/[a-z0-9\-/#?=&]*$/i.test(v) || /^https:\/\//.test(v), 'The link must be a page on this site (like /results) or start with https://'),
  pinned: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true)
});

r.get('/notices', ah(async (req, res) => {
  const notices = await Notice.find().sort({ pinned: -1, date: -1 }).lean();
  res.json({ notices: notices.map(noticeOut) });
}));
r.post('/notices', ah(async (req, res) => {
  const n = await Notice.create(parse(noticeSchema, req.body));
  res.status(201).json({ notice: noticeOut(n.toObject()) });
}));
r.put('/notices/:id', ah(async (req, res) => {
  const n = await Notice.findByIdAndUpdate(idOr404(req), parse(noticeSchema, req.body), { new: true }).lean();
  if (!n) throw httpError(404, 'Notice not found.');
  res.json({ notice: noticeOut(n) });
}));
r.delete('/notices/:id', ah(async (req, res) => {
  await Notice.findByIdAndDelete(idOr404(req));
  res.json({ ok: true });
}));

// ---------- Reviews / testimonials ----------
const reviewOut = (x) => ({ id: String(x._id), name: x.name, role: x.role, quote: x.quote, published: x.published, order: x.order });
const reviewSchema = z.object({
  name: z.string().trim().min(2, 'Please enter a name.').max(80),
  role: z.string().trim().max(120).optional().default(''),
  quote: z.string().trim().min(10, 'Please enter the review (at least 10 characters).').max(600, 'Keep the review under 600 characters.'),
  published: z.boolean().optional().default(true)
});

r.get('/reviews', ah(async (req, res) => {
  const reviews = await Review.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json({ reviews: reviews.map(reviewOut) });
}));
r.post('/reviews', ah(async (req, res) => {
  const first = await Review.findOne().sort({ order: 1 }).lean();
  const x = await Review.create({ ...parse(reviewSchema, req.body), order: (first?.order ?? 0) - 1 });
  res.status(201).json({ review: reviewOut(x.toObject()) });
}));
r.put('/reviews/:id', ah(async (req, res) => {
  const x = await Review.findByIdAndUpdate(idOr404(req), parse(reviewSchema, req.body), { new: true }).lean();
  if (!x) throw httpError(404, 'Review not found.');
  res.json({ review: reviewOut(x) });
}));
r.post('/reviews/reorder', ah(async (req, res) => {
  const ids = z.array(z.string().regex(/^[a-f0-9]{24}$/i)).max(500).parse(req.body?.ids || []);
  await Review.bulkWrite(ids.map((id, i) => ({ updateOne: { filter: { _id: id }, update: { order: i } } })));
  res.json({ ok: true });
}));
r.delete('/reviews/:id', ah(async (req, res) => {
  await Review.findByIdAndDelete(idOr404(req));
  res.json({ ok: true });
}));

// ---------- Enquiries ----------
function enqOut(e) {
  return {
    id: String(e._id), ref: e.ref, name: e.name, phone: e.phone, email: e.email, studentClass: e.studentClass, program: e.program,
    centre: e.centre, message: e.message, status: e.status, handledAt: e.handledAt, handledBy: e.handledBy, emailSent: e.emailSent, createdAt: e.createdAt
  };
}
function enqQuery(req) {
  const q = {};
  if (req.query.status === 'new' || req.query.status === 'handled') q.status = req.query.status;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 80)), 'i');
    q.$or = [{ name: rx }, { phone: rx }, { email: rx }, { ref: rx }, { program: rx }, { message: rx }];
  }
  return q;
}

r.get('/enquiries', ah(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const per = 25;
  const q = enqQuery(req);
  const [total, items, newCount] = await Promise.all([
    Enquiry.countDocuments(q),
    Enquiry.find(q).sort({ createdAt: -1 }).skip((page - 1) * per).limit(per).lean(),
    Enquiry.countDocuments({ status: 'new' })
  ]);
  res.json({ enquiries: items.map(enqOut), total, page, pages: Math.max(1, Math.ceil(total / per)), newCount });
}));

r.patch('/enquiries/:id', ah(async (req, res) => {
  const status = z.enum(['new', 'handled']).parse(req.body?.status);
  const update = status === 'handled' ? { status, handledAt: new Date(), handledBy: req.admin.name } : { status, $unset: { handledAt: 1, handledBy: 1 } };
  const e = await Enquiry.findByIdAndUpdate(idOr404(req), update, { new: true }).lean();
  if (!e) throw httpError(404, 'Enquiry not found.');
  res.json({ enquiry: enqOut(e) });
}));

r.delete('/enquiries/:id', ah(async (req, res) => {
  await Enquiry.findByIdAndDelete(idOr404(req));
  res.json({ ok: true });
}));

r.get('/enquiries.csv', ah(async (req, res) => {
  const items = await Enquiry.find(enqQuery(req)).sort({ createdAt: -1 }).lean();
  // Cells starting with = + - @ would run as a formula in Excel, so they get a ' prefix
  // (phone numbers like +91 98765 43210 are left alone).
  const cell = (v) => {
    let s = v == null ? '' : String(v);
    if (/^[=@\t\r]/.test(s) || /^[+-](?![\d\s()-]+$)/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const fmt = (d) => (d ? new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '');
  const head = ['Reference', 'Received', 'Student name', 'Phone', 'Email', 'Class', 'Program', 'Centre', 'Message', 'Status', 'Handled by', 'Handled on'];
  const lines = [head, ...items.map((e) => [e.ref, fmt(e.createdAt), e.name, e.phone, e.email, e.studentClass, e.program, e.centre, e.message, e.status, e.handledBy, fmt(e.handledAt)])];
  const stamp = new Date().toISOString().slice(0, 10);
  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', `attachment; filename="hawk-academe-enquiries-${stamp}.csv"`);
  res.send('﻿' + lines.map((l) => l.map(cell).join(',')).join('\r\n'));
}));

// ---------- Timings, highlights and contact settings ----------
const str = (max) => z.string().trim().max(max).optional().default('');
const settingsSchema = z.object({
  phone: str(60), whatsapp: z.string().trim().max(20).optional().default('').refine((v) => !v || /^\d{10,15}$/.test(v), 'WhatsApp number: digits only, with country code (for example 919876543210).'),
  email: z.union([z.literal(''), z.string().trim().email('Please enter a valid email address.')]).optional().default(''),
  address: str(300),
  mapsLink: z.union([z.literal(''), z.string().trim().url('The Google Maps link must start with https://')]).optional().default(''),
  mapEmbed: z.string().trim().max(2000).optional().default('').transform((v) => {
    const m = v.match(/src="([^"]+)"/); // accept the whole <iframe> code from Google Maps too
    return m ? m[1] : v;
  }).refine((v) => !v || /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(v), 'Paste the "Embed a map" code from Google Maps (Share > Embed a map).'),
  officeHours: z.array(z.object({ days: str(60), hours: str(60) })).max(7).optional().default([]),
  responseTime: str(80),
  enquiryEmail: z.union([z.literal(''), z.string().trim().email('Please enter a valid email for enquiries.')]).optional().default(''),
  social: z.object({ facebook: str(200), instagram: str(200), youtube: str(200), linkedin: str(200) }).optional().default({})
    .refine((s) => Object.values(s).every((v) => !v || /^https:\/\//.test(v)), 'Social media links must start with https://'),
  highlights: z.array(z.object({ value: str(20), label: str(60) })).length(4).optional(),
  programs: z.array(z.object({ key: str(30), name: str(80), classes: str(80), duration: str(80), batchSize: str(80), mode: str(80), timings: str(300) })).max(12).optional()
});

r.get('/settings', ah(async (req, res) => res.json({ settings: await getSettings(), mailConfigured: mailConfigured() })));

r.put('/settings', ah(async (req, res) => {
  const d = parse(settingsSchema, req.body);
  const cur = await getSettings();
  // Programmes keep their keys; only their details change here.
  if (d.programs) d.programs = cur.programs.map((p) => ({ ...p, ...(d.programs.find((x) => x.key === p.key) || {}), key: p.key, name: p.name }));
  await Settings.findOneAndUpdate({ key: 'site' }, { $set: d }, { upsert: true });
  res.json({ settings: await getSettings() });
}));

export default r;
