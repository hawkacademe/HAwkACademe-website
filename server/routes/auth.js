import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { AdminUser } from '../models/index.js';
import { requireAdmin, publicUser } from '../lib/auth.js';
import { ah } from '../lib/util.js';

const r = Router();

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
// A dummy hash so a wrong email takes as long as a wrong password.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: 'Too many login attempts from this network. Please wait 15 minutes and try again.' }
});

const loginSchema = z.object({ email: z.string().trim().toLowerCase().email().max(200), password: z.string().min(1).max(200) });

r.post('/login', loginLimiter, ah(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Please enter your email and password.' });
  const { email, password } = parsed.data;
  const user = await AdminUser.findOne({ email });

  if (user?.lockUntil && user.lockUntil > new Date()) {
    const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
    return res.status(429).json({ error: `Too many wrong attempts. This account is locked for ${mins} more minute${mins === 1 ? '' : 's'}.` });
  }
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) {
    if (user) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= MAX_FAILS) { user.lockUntil = new Date(Date.now() + LOCK_MS); user.failedAttempts = 0; }
      await user.save();
    }
    return res.status(401).json({ error: 'That email and password do not match.' });
  }
  user.failedAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();

  // New session id on login stops session fixation.
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'Could not start a session. Please try again.' });
    req.session.adminId = String(user._id);
    req.session.version = user.sessionVersion || 0;
    req.session.startedAt = Date.now();
    req.session.save(() => res.json({ user: publicUser(user) }));
  });
}));

r.post('/logout', (req, res) => {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(() => {
    res.clearCookie('ha.sid');
    res.json({ ok: true });
  });
});

// Signed-out visitors get { user: null } rather than an error.
r.get('/me', (req, res, next) => (req.session?.adminId ? next() : res.json({ user: null })), requireAdmin, (req, res) => res.json({ user: publicUser(req.admin) }));

const pwSchema = z.object({
  current: z.string().min(1).max(200),
  next: z.string().min(10, 'The new password must be at least 10 characters.').max(200)
});

r.post('/password', requireAdmin, ah(async (req, res) => {
  const parsed = pwSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Please check the form.' });
  const { current, next } = parsed.data;
  const user = await AdminUser.findById(req.admin._id);
  if (!(await bcrypt.compare(current, user.passwordHash))) return res.status(400).json({ error: 'Your current password is not right.' });
  if (current === next) return res.status(400).json({ error: 'Choose a new password that is different from the current one.' });
  if (next.toLowerCase().includes(user.email.split('@')[0].toLowerCase())) return res.status(400).json({ error: 'The password should not contain your email name.' });
  user.passwordHash = await bcrypt.hash(next, 12);
  user.mustChangePassword = false;
  user.passwordChangedAt = new Date();
  user.sessionVersion = (user.sessionVersion || 0) + 1; // signs out every other device
  await user.save();
  req.session.version = user.sessionVersion;
  res.json({ ok: true, user: publicUser(user) });
}));

r.put('/profile', requireAdmin, ah(async (req, res) => {
  const name = String(req.body?.name || '').trim().slice(0, 80);
  if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' });
  const user = await AdminUser.findByIdAndUpdate(req.admin._id, { name }, { new: true });
  res.json({ user: publicUser(user) });
}));

export default r;
