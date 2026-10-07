# HAwk ACademe: SEO audit (baseline, before changes)

Audited on 7 October 2026 against the live site https://www.hawkacademe.com and this codebase (commit `335c635`).

## Stack

| | |
|---|---|
| Framework | React 19 + React Router 7, built with Vite 8. Pages load as lazy chunks. |
| Rendering | Client-side only. The server injects per-route `<title>`, meta, canonical, Open Graph and (home only) JSON-LD, but `<body>` is an empty `#root`. |
| Server | Express 5, run on Vercel as one serverless function (`api/index.js`). Static assets come from Vercel's CDN (`client/dist`). |
| Data | MongoDB Atlas. Pages fetch `/api/site`, `/api/notices`, `/api/posts`, `/api/posts/:slug`, `/api/gallery` and `/api/reviews` in the browser. |
| Hosting/DNS | Vercel (nameservers `ns1/ns2.vercel-dns.com`), apex 308 → `www`, HTTPS with HSTS. |

## Lighthouse baseline (live site, Lighthouse 12)

| Page | Mode | Perf | SEO | A11y | BP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| / | mobile | 78 | 100 | 96 | 100 | 3.9 s | 0 | 0 ms |
| / | desktop | 88 | 100 | 96 | 100 | 1.4 s | 0 | 0 ms |
| /programs | mobile | 90 | 100 | 96 | 100 | 3.2 s | 0 | 30 ms |
| /programs | desktop | 74 | 100 | 96 | 100 | 1.4 s | **0.411** | 0 ms |
| /contact | mobile | 90 | 100 | 96 | 100 | 3.2 s | 0 | 30 ms |
| /contact | desktop | 74 | 100 | 100 | 100 | 1.5 s | **0.366** | 0 ms |

Lighthouse's "SEO 100" only checks the tags; it does not notice that the body is empty without JavaScript (see C1).

## Crawl (16 URLs: 8 pages, 6 posts, 2 unknown)

| Route | Status | Title len | Desc len | Raw words / H1 (no JS) | Rendered words | H1 |
|---|---|---|---|---|---|---|
| / | 200 | 48 | 123 | 13 / 0 | 1040 | 1 |
| /about | 200 | 23 | 136 | 13 / 0 | 295 | 1 |
| /programs | 200 | 61 | 122 | 13 / 0 | 402 | 1 |
| /results | 200 | 34 | 98 | 13 / 0 | 249 | 1 |
| /gallery | 200 | 22 | 89 | 13 / 0 | 60 | 1 |
| /blog | 200 | 46 | 91 | 13 / 0 | 215 | 1 |
| /news | 200 | 37 | 73 | 13 / 0 | 58 | 1 |
| /contact | 200 | 25 | 115 | 13 / 0 | 280 | 1 |
| 6 × /blog/… | 200 | 54–59 | 50–55 | 13 / 0 | 141–148 | 1 |
| unknown routes | **404** (correct) | | | | | |

- Titles, descriptions and canonicals are already unique per route (known issue 2 does not apply). Canonicals are self-referencing.
- 23 internal links, none broken.
- No mixed content. HSTS, Brotli compression, and 1-year immutable caching on hashed assets are already in place.
- Every page has exactly one H1. No `<img>` is missing an `alt` attribute. Empty `alt=""` is used only on decorative background patterns, which is correct.

## Findings

### Critical
- **C1. Content is invisible without JavaScript.** Raw HTML for every route is 13 words ("Please turn on JavaScript to use the Hawk Academe website, or call us."), with no H1, copy or links. Bing, AI crawlers (GPTBot, ClaudeBot, PerplexityBot) and link previews see an empty page. Google renders JS but with a delay. *Fix: server-side render the React app inside the existing Express function (no framework migration).*
- **C2. Fabricated sample results are live.** `/results` and the home page show 12 design-concept toppers (e.g. "Rohan Mehta, AIR 12, IIT Bombay") and unverified figures ("5000+ Students Trained", "1000+ Selections", "150+ in Top 500", "98% Student Satisfaction"). This is misleading to parents, conflicts with the white-hat rules in the brief, and is risky under India's 2024 guidelines against misleading coaching advertisements. *Fix: hide sample toppers and unconfirmed figures until the owner supplies real, consented results.*
- **C3. Placeholder blog posts are indexed.** All 6 posts are 24–30-word stubs reading "[ARTICLE TEXT — replace this sample post …]", listed in the sitemap. Thin and duplicate content across 6 URLs. *Fix: noindex unpublished/placeholder posts and leave them out of the sitemap until real articles exist; the owner writes or approves the articles.*

### High
- **H1. Brand name is spelled wrongly in titles, OG and schema.** `SITE_NAME = 'Hawk Academe'` drives every `<title>`, `og:site_name` and the JSON-LD name. Codebase totals: **48 × "Hawk Academe"**, **2 × "HAWK ACADEME"** (hard-coded uppercase eyebrow text, not CSS), against 30 × the correct "HAwk ACademe", across 28 files. Live database: 6 blog `author` fields and 1 admin name use "Hawk Academe". No CSS `text-transform` is applied to the brand.
- **H2. Desktop layout shift (CLS 0.37–0.41)** on /programs and /contact: the footer renders first and is pushed down when the lazy page chunk arrives. SSR (C1) removes this.
- **H3. Slow mobile first paint (FCP/LCP 3.2–3.9 s).** Render-blocking Google Fonts CSS and the app stylesheet; nothing paints until JS runs. SSR, self-hosted fonts and LCP-image preload address it.
- **H4. No landing pages for target searches** ("JEE coaching in Madhyamgram", "NEET coaching in Kolkata", "foundation course class 9 10 Kolkata"). Only one combined /programs page. Titles do not mention location.
- **H5. Structured data is minimal.** Only the home page has JSON-LD (`EducationalOrganization` with name "Hawk Academe", address as a plain string, no geo, hours or areaServed). No `WebSite`, `BreadcrumbList`, `Course`, `FAQPage` or `BlogPosting`.
- **H6. NAP is not settled.** The site lists three centres (Barasat, Madhyamgram, New Town) from the owner. The brief's "Basunagar 1st Gate, Madhyamgram 700129" is unverified; Madhyamgram and New Town street addresses and the New Town PIN are unconfirmed. Office hours are placeholders.

### Medium
- **M1.** Trailing-slash duplicates: `/about/` returns 200 instead of redirecting to `/about` (the canonical limits the damage).
- **M2.** Apex HTTP takes two hops (`http://hawkacademe.com` → `https://hawkacademe.com` → `https://www.`). This is Vercel's domain-level behaviour.
- **M3.** No `twitter:title`, `twitter:description` or `twitter:image` (Twitter falls back to OG). No `og:image:width/height/alt`.
- **M4.** No privacy policy, terms or refund/fee policy pages (the Contact form collects data of minors, so the DPDP Act applies).
- **M5.** Sitemap: blog `lastmod` is the seeding date. Core pages have no `lastmod`.
- **M6.** Thin pages: /gallery (60 words), /news (58 words, 3 placeholder notices).
- **M7.** Colour contrast failures on small text (Lighthouse a11y 96). The "label-content-name-mismatch" audit fails on mobile.
- **M8.** No web app manifest. Favicon is a single 180 × 180 PNG.

### Low
- **L1.** No `/llms.txt`.
- **L2.** No analytics, Search Console or Bing verification, or conversion tracking on call/WhatsApp/directions clicks.
- **L3.** Google Maps iframes load lazily but are still full iframes (a click-to-load facade would save about 1 MB per centre on Contact).
- **L4.** `share.jpg` is 1200 × 630, 50 KB (fine). Check that its artwork uses the new logo and the "HAwk ACademe" spelling.

## Facts in the brief that the codebase does not confirm
- Address "Basunagar 1st Gate, Madhyamgram 700129" and owner name: not in the codebase. Not used.
- "Maths, Physics, Chemistry for Classes X–XII", NTSE: the codebase offers JEE (Main & Advanced), NEET (UG), Foundation (classes 8–10, with olympiad/talent-search preparation) and Integrated school+coaching programs.
- YouTube: the owner supplied `youtube.com/channel/UCHVaJRbj3YkqktpuOGEh7AQ` on 7 Oct 2026, so it is treated as confirmed. Instagram `instagram.com/hawkacademe` was supplied too.
