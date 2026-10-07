import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { Enquiry } from '../models/index.js';
import { publishedFilter, siteData, noticesData, postsData, postData, galleryData, reviewsData } from '../lib/publicData.js';
import { ah, getSettings } from '../lib/util.js';
import { sendEnquiryEmail } from '../lib/mail.js';
import { config } from '../config.js';

const r = Router();

// Browsers re-check with the server each time (a quick 304 thanks to ETags), so admin
// edits show up straight away.
const cache = () => (req, res, next) => { res.set('Cache-Control', 'no-cache'); next(); };

export { publishedFilter };

r.get('/site', cache(60), ah(async (req, res) => res.json(await siteData())));
r.get('/notices', cache(60), ah(async (req, res) => res.json(await noticesData(req.query))));
r.get('/posts', cache(60), ah(async (req, res) => res.json(await postsData(req.query))));
r.get('/posts/:slug', cache(60), ah(async (req, res) => {
  const d = await postData(req.params.slug);
  if (!d) return res.status(404).json({ error: 'Post not found' });
  res.json(d);
}));
r.get('/gallery', cache(60), ah(async (req, res) => res.json(await galleryData())));
r.get('/reviews', cache(60), ah(async (req, res) => res.json(await reviewsData())));

// ---------- Contact form ----------
const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: 'You have sent several enquiries in a short time. Please wait a few minutes, or call us.' }
});

const phoneRe = /^[+()\-\s0-9]{8,20}$/;
const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter the student name.').max(80),
  phone: z.string().trim().regex(phoneRe, 'Please enter a valid phone number.').refine((v) => v.replace(/\D/g, '').length >= 10, 'Please enter a valid phone number.'),
  email: z.union([z.literal(''), z.string().trim().email('Please enter a valid email, or leave it empty.').max(120)]).optional().default(''),
  studentClass: z.string().trim().max(40).optional().default(''),
  program: z.string().trim().max(60).optional().default(''),
  centre: z.string().trim().max(60).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
  website: z.string().optional().default(''),  // honeypot: real people never fill this
  startedAt: z.coerce.number().optional(),      // when the form was shown
  turnstileToken: z.string().optional().default('')
});

async function turnstileOk(token, ip) {
  if (!config.turnstile.secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: config.turnstile.secret, response: token, remoteip: ip || '' });
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    return (await res.json()).success === true;
  } catch {
    return false;
  }
}

r.post('/enquiries', enquiryLimiter, ah(async (req, res) => {
  const parsed = enquirySchema.safeParse(req.body || {});
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return res.status(400).json({ error: issue?.message || 'Please check the form.', field: issue?.path?.[0] });
  }
  const d = parsed.data;
  const ref = 'ENQ' + Date.now().toString(36).toUpperCase().slice(-5) + randomBytes(1).toString('hex').toUpperCase();
  // Spam traps: pretend success so bots learn nothing.
  const tooFast = d.startedAt && Date.now() - d.startedAt < 2500;
  if (d.website || tooFast) return res.json({ ok: true, ref });
  if (!(await turnstileOk(d.turnstileToken, req.ip))) return res.status(400).json({ error: 'Please complete the "I am human" check and try again.' });
  const links = (d.message.match(/https?:\/\//g) || []).length;
  if (links > 3) return res.status(400).json({ error: 'Please remove the links from your message and try again.' });

  const enquiry = await Enquiry.create({ ref, name: d.name, phone: d.phone, email: d.email, studentClass: d.studentClass, program: d.program, centre: d.centre, message: d.message });
  const notify = async () => {
    try {
      const s = await getSettings();
      const sent = await sendEnquiryEmail(enquiry, s.enquiryEmail || config.mail.enquiryTo);
      if (sent) await Enquiry.updateOne({ _id: enquiry._id }, { emailSent: true });
    } catch (e) {
      console.error('Enquiry email failed', e.message);
    }
  };
  // On a normal server, email after replying so the visitor never waits on the mail server.
  // Serverless hosts (Vercel) may stop work once the reply is sent, so email first there.
  if (process.env.VERCEL) await notify();
  res.json({ ok: true, ref });
  if (!process.env.VERCEL) await notify();
}));

export default r;
