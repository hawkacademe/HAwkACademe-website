import mongoose from 'mongoose';
import { BRAND_NAME } from '../../client/src/lib/brand.js';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

// ---------- Admin users (up to 2) ----------
const AdminUser = model('AdminUser', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  mustChangePassword: { type: Boolean, default: true },
  failedAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  lastLoginAt: Date,
  passwordChangedAt: Date,
  sessionVersion: { type: Number, default: 0 } // bumped on password change to sign out other sessions
}, opts));

// ---------- Blog posts ----------
export const BLOG_CATEGORIES = ['Exam Tips', 'Study Plans', 'Parents', 'Updates'];
export const COVER_STYLES = ['physics', 'chemistry', 'maths', 'biology'];

const imageSchema = new Schema({ url: String, key: String, alt: String, width: Number, height: Number }, { _id: false });

const Post = model('Post', new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, enum: BLOG_CATEGORIES, default: 'Exam Tips' },
  excerpt: { type: String, trim: true, maxlength: 300, default: '' },
  content: { type: String, default: '' },          // sanitised HTML
  cover: imageSchema,                               // optional cover photo
  coverStyle: { type: String, enum: COVER_STYLES, default: 'physics' }, // used when there is no photo
  author: { type: String, trim: true, default: BRAND_NAME },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishAt: { type: Date, default: Date.now }      // a future date schedules the post
}, opts).index({ status: 1, publishAt: -1 }));

// ---------- Gallery ----------
export const GALLERY_CATEGORIES = ['Classroom', 'Seminars', 'Activities', 'Celebrations', 'Campus'];

const Photo = model('Photo', new Schema({
  url: { type: String, required: true },
  thumbUrl: String,
  key: String,          // storage key, empty for the built-in design photos
  thumbKey: String,
  width: Number,
  height: Number,
  caption: { type: String, trim: true, maxlength: 140, default: '' },
  alt: { type: String, trim: true, maxlength: 200, default: '' },
  category: { type: String, enum: GALLERY_CATEGORIES, default: 'Classroom' },
  order: { type: Number, default: 0 }
}, opts).index({ order: 1 }));

// ---------- Notices / News ----------
export const NOTICE_CATEGORIES = ['BATCHES', 'RESULTS', 'NOTICES'];

const Notice = model('Notice', new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  text: { type: String, trim: true, maxlength: 1000, default: '' },
  category: { type: String, enum: NOTICE_CATEGORIES, default: 'NOTICES' },
  date: { type: Date, default: Date.now },
  link: { type: String, trim: true, default: '' }, // optional page on this site, e.g. /results
  pinned: { type: Boolean, default: false },
  published: { type: Boolean, default: true }
}, opts).index({ published: 1, pinned: -1, date: -1 }));

// ---------- Testimonials / reviews ----------
const Review = model('Review', new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  role: { type: String, trim: true, maxlength: 120, default: '' }, // e.g. "Parent, Class 12 student"
  quote: { type: String, required: true, trim: true, maxlength: 600 },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, opts).index({ order: 1 }));

// ---------- Contact form enquiries ----------
const Enquiry = model('Enquiry', new Schema({
  ref: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  studentClass: { type: String, trim: true, default: '' },
  program: { type: String, trim: true, default: '' },
  centre: { type: String, trim: true, default: '' },
  message: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['new', 'handled'], default: 'new' },
  handledAt: Date,
  handledBy: String,
  emailSent: { type: Boolean, default: false },
  source: { type: String, default: 'contact' }
}, opts).index({ status: 1, createdAt: -1 }));

// ---------- Site settings (one document) ----------
const hoursSchema = new Schema({ days: String, hours: String }, { _id: false });
const statSchema = new Schema({ value: String, label: String }, { _id: false });
const programSchema = new Schema({
  key: String, name: String, classes: String, duration: String, batchSize: String, mode: String, timings: String
}, { _id: false });

const Settings = model('Settings', new Schema({
  key: { type: String, default: 'site', unique: true },
  phone: String,
  whatsapp: String,              // digits with country code, e.g. 919876543210
  email: String,
  address: String,
  mapsLink: String,              // "Open in Google Maps" link
  mapEmbed: String,              // Google Maps embed URL (https://www.google.com/maps/embed?...)
  officeHours: [hoursSchema],
  responseTime: String,          // e.g. "within 1 working day"
  enquiryEmail: String,          // where Contact-form enquiries are emailed
  social: { facebook: String, instagram: String, youtube: String, linkedin: String },
  highlights: [statSchema],      // the four numbers on Home (Results section)
  programs: [programSchema]      // batch details shown on Programs
}, opts));

export { AdminUser, Post, Photo, Notice, Review, Enquiry, Settings };
