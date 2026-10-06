// API tests. Needs MongoDB running; uses a throwaway database.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/hawk-academe-test';
const { createApp } = await import('../server/index.js');
const { AdminUser, Enquiry, Post } = await import('../server/models/index.js');
const { cleanHtml, slugify } = await import('../server/lib/util.js');

let server, base;
const jar = { cookie: '' };
async function call(path, { method = 'GET', body, ajax = true, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (ajax) headers['X-Requested-With'] = 'fetch';
  if (auth && jar.cookie) headers.Cookie = jar.cookie;
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const set = res.headers.get('set-cookie');
  if (set) jar.cookie = set.split(';')[0];
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  return { status: res.status, json, text };
}

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.dropDatabase();
  await AdminUser.create({ name: 'Tester', email: 'test@example.com', passwordHash: await bcrypt.hash('correct horse battery', 4), mustChangePassword: false });
  server = createApp().listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.close();
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test('blog HTML is sanitised', () => {
  const out = cleanHtml('<p onclick="x()">Hi<script>alert(1)</script><a href="javascript:alert(1)">x</a><a href="https://a.com">y</a></p>');
  assert.ok(!out.includes('script') && !out.includes('onclick') && !out.includes('javascript:'));
  assert.ok(out.includes('rel="noopener noreferrer"'));
});

test('slugify makes clean addresses', () => {
  assert.equal(slugify('How to plan the last 90 days: JEE & NEET!'), 'how-to-plan-the-last-90-days-jee-and-neet');
});

test('enquiry: validates, saves, and blocks honeypot spam silently', async () => {
  const bad = await call('/api/enquiries', { method: 'POST', body: { name: 'A', phone: '123' } });
  assert.equal(bad.status, 400);
  const ok = await call('/api/enquiries', { method: 'POST', body: { name: 'Riya Sen', phone: '+91 98300 11111', startedAt: Date.now() - 10000 } });
  assert.equal(ok.status, 200);
  assert.match(ok.json.ref, /^ENQ/);
  const spam = await call('/api/enquiries', { method: 'POST', body: { name: 'Bot', phone: '+91 98300 22222', website: 'http://spam' } });
  assert.equal(spam.status, 200);
  assert.equal(await Enquiry.countDocuments(), 1);
});

test('admin routes need a login', async () => {
  const r = await call('/api/admin/overview', { auth: false });
  assert.equal(r.status, 401);
});

test('login, lockout after 5 wrong attempts', async () => {
  await AdminUser.create({ name: 'Lock', email: 'lock@example.com', passwordHash: await bcrypt.hash('right password 123', 4), mustChangePassword: false });
  for (let i = 0; i < 5; i++) {
    const r = await call('/api/auth/login', { method: 'POST', body: { email: 'lock@example.com', password: 'nope' }, auth: false });
    assert.equal(r.status, 401);
  }
  const locked = await call('/api/auth/login', { method: 'POST', body: { email: 'lock@example.com', password: 'right password 123' }, auth: false });
  assert.equal(locked.status, 429);
});

test('admin can create and publish a post; drafts and scheduled posts stay hidden', async () => {
  const login = await call('/api/auth/login', { method: 'POST', body: { email: 'test@example.com', password: 'correct horse battery' } });
  assert.equal(login.status, 200);
  const noAjax = await call('/api/admin/posts', { method: 'POST', ajax: false, body: { title: 'x', category: 'Parents', status: 'draft' } });
  assert.equal(noAjax.status, 403, 'cross-site style request is blocked');

  const pub = await call('/api/admin/posts', { method: 'POST', body: { title: 'Exam week checklist', category: 'Exam Tips', status: 'published', content: '<p>Sleep well.</p><script>x</script>' } });
  assert.equal(pub.status, 201);
  assert.ok(!pub.json.post.content.includes('script'));
  await call('/api/admin/posts', { method: 'POST', body: { title: 'Secret draft', category: 'Parents', status: 'draft', content: '<p>x</p>' } });
  await call('/api/admin/posts', { method: 'POST', body: { title: 'Future post', category: 'Parents', status: 'published', content: '<p>x</p>', publishAt: new Date(Date.now() + 86400000).toISOString() } });

  const list = await call('/api/posts', { auth: false });
  assert.deepEqual(list.json.posts.map((p) => p.title), ['Exam week checklist']);
  assert.equal((await call('/api/posts/secret-draft', { auth: false })).status, 404);
  assert.equal(await Post.countDocuments(), 3);
});

test('settings reject unsafe links', async () => {
  const r = await call('/api/admin/settings', { method: 'PUT', body: { social: { facebook: 'javascript:alert(1)' } } });
  assert.equal(r.status, 400);
  const ok = await call('/api/admin/settings', { method: 'PUT', body: { phone: '+91 90000 00000', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=abc"></iframe>' } });
  assert.equal(ok.status, 200);
  assert.equal(ok.json.settings.mapEmbed, 'https://www.google.com/maps/embed?pb=abc');
});

test('CSV export guards against spreadsheet formulas', async () => {
  await Enquiry.create({ ref: 'ENQTEST', name: '=HYPERLINK("x")', phone: '+91 98300 33333' });
  const r = await call('/api/admin/enquiries.csv');
  assert.ok(r.text.includes(`"'=HYPERLINK(""x"")"`));
  assert.ok(r.text.includes('"+91 98300 33333"'));
});

test('logout ends the session', async () => {
  await call('/api/auth/logout', { method: 'POST' });
  assert.equal((await call('/api/admin/overview')).status, 401);
});
