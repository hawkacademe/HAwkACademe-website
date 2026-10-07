// Lists every placeholder that still has to be replaced before go-live:
// [BRACKETED] text in the launch content files, sample toppers, and placeholders
// saved in the database (settings, notices, reviews, blog posts).
//   npm run check:placeholders
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import mongoose from 'mongoose';

const ROOT = new URL('..', import.meta.url).pathname;
const RX = /\[(?:[A-Z][^\]\n]{1,80}|—[^\]\n]*|X+|99\.9|State|Student Name|Program|Target College|Branch|Medical College|Board|Percentage)\]/g;
const found = [];
const has = (v) => new RegExp(RX.source).test(String(v ?? ""));

function scan(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) scan(p);
    else if (/\.(jsx?|html)$/.test(f.name)) {
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments
        const hits = line.match(RX);
        if (hits) found.push(`${p.replace(ROOT, '')}:${i + 1}  ${[...new Set(hits)].join(' ')}`);
        if (/sample:\s*true/.test(line)) found.push(`${p.replace(ROOT, '')}:${i + 1}  sample topper from the design concept`);
      });
    }
  }
}
// Launch content lives in client/src/content (see the comments at the top of each file).
scan(join(ROOT, 'client/src/content'));

try {
  await import('dotenv/config');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hawk-academe', { serverSelectionTimeoutMS: 3000 });
  const { Settings, Notice, Review, Post, AdminUser } = await import('../server/models/index.js');
  const s = await Settings.findOne({ key: 'site' }).lean();
  const flat = (o, pre = '') => Object.entries(o || {}).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${pre}${k}.`) : [[pre + k, v]]));
  for (const [k, v] of flat(s)) if (typeof v === 'string' && has(v)) found.push(`database settings  ${k} = ${v}`);
  for (const k of ['enquiryEmail']) if (!s?.[k]) found.push(`database settings  ${k} is empty`);
  for (const n of await Notice.find().lean()) if (has(n.title + n.text)) found.push(`database notice  "${n.title}"`);
  for (const r of await Review.find().lean()) if (has(r.name + r.role + r.quote)) found.push(`database review  "${r.name}"`);
  for (const p of await Post.find().lean()) if (has(p.title + p.content)) found.push(`database blog post  "${p.title}"`);
  if (!(await AdminUser.countDocuments())) found.push('database  no admin users yet (npm run create-admin)');
  await mongoose.disconnect();
} catch (e) {
  found.push(`(database not checked: ${e.message})`);
}

if (!found.length) console.log('No placeholders left. Ready for the go-live check.');
else {
  console.log(`${found.length} placeholder${found.length === 1 ? '' : 's'} to replace before go-live:\n`);
  console.log(found.map((f) => '  ' + f).join('\n'));
  process.exitCode = 1;
}
