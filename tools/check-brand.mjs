// Fails (exit 1) if the brand name appears in any spelling other than exactly
// "HAwk ACademe". Allowed: all-lowercase forms with no space (hawkacademe.com,
// @hawkacademe, hawk-academe package/db names) and the alternate names defined
// in client/src/lib/brand.js for JSON-LD alternateName.
//   npm run check:brand
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['client/src', 'client/public', 'client/index.html', 'server', 'api', 'README.md', 'ADMIN-GUIDE.md'];
const EXT = new Set(['.js', '.jsx', '.mjs', '.html', '.css', '.json', '.md', '.txt', '.xml', '.webmanifest']);
const SKIP = new Set(['client/src/lib/brand.js']);
const BRAND = 'HAwk ACademe';
const RE = /h\s*a\s*w\s*k[\s_-]*a\s*c\s*a\s*d\s*e\s*m\s*[ey]/gi;

const files = [];
const walk = (p) => {
  const st = statSync(p);
  if (st.isDirectory()) { for (const f of readdirSync(p)) if (f !== 'node_modules' && f !== 'dist') walk(join(p, f)); }
  else if (EXT.has(extname(p)) && !SKIP.has(p)) files.push(p);
};
for (const r of ROOTS) { try { walk(r); } catch { /* missing root */ } }

const bad = [];
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      const s = m[0];
      if (s === BRAND) continue;
      if (s === s.toLowerCase() && !/\s/.test(s)) continue; // domain, email, handle, slug
      bad.push(`${f}:${i + 1}  "${s}"  ->  ${line.trim().slice(0, 110)}`);
    }
  });
}
if (bad.length) {
  console.error(`Brand check failed: ${bad.length} spelling(s) differ from "${BRAND}":\n  ` + bad.join('\n  '));
  process.exit(1);
}
console.log(`Brand check passed (${files.length} files).`);
