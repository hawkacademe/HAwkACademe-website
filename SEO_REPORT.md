# HAwk ACademe: SEO report (after)

Completed 7 October 2026 on https://www.hawkacademe.com. The baseline is in `SEO_AUDIT.md`.

## Results at a glance

**Crawlability.** Every public page now returns its full content without JavaScript. Raw HTML (what Bing, GPTBot, ClaudeBot, PerplexityBot and link previews see) went from 13 words and no H1 on every page to:

| Page | Words in raw HTML | Links | H1 |
|---|---|---|---|
| / | 998 | 78 | Building Brighter Futures |
| /programs | 499 | 58 | Programs for Every Aspirant |
| /programs/jee-coaching-madhyamgram-kolkata | 758 | 50 | JEE Coaching in Madhyamgram, Kolkata |
| /programs/neet-coaching-madhyamgram-kolkata | 719 | 50 | NEET Coaching in Madhyamgram, Kolkata |
| /programs/foundation-course-class-8-9-10-kolkata | 676 | 50 | Foundation Course for Class 8, 9 & 10 in Kolkata |
| /contact | 512 | 52 | Let's Talk About Your Goals |
| /blog/why-class-9-matters-more-than-you-think | 671 | 50 | Why Class 9 matters more than you think |

```
$ curl -s https://www.hawkacademe.com/programs/jee-coaching-madhyamgram-kolkata | grep -oE "<title>[^<]*|<h1[^>]*>[^<]*|application/ld\+json"
<title>JEE Coaching in Madhyamgram, Kolkata | HAwk ACademe
application/ld+json
<h1 class="h1" style="...">JEE Coaching in Madhyamgram, Kolkata
```

**Lighthouse (live site, Lighthouse 12; Perf / SEO / A11y / Best practices, LCP, CLS)**

| Page | Mode | Before | After |
|---|---|---|---|
| / | mobile | 78 / 100 / 96 / 100, LCP 3.9 s, CLS 0 | 89–98 / 100 / 100 / 100, LCP 1.9–2.1 s, CLS 0 |
| / | desktop | 88 / 100 / 96 / 100, LCP 1.4 s | 100 / 100 / 100 / 100, LCP 0.5 s |
| /programs | mobile | 90 / 100 / 96 / 100, LCP 3.2 s | 99–100 / 100 / 100 / 100, LCP 1.5–1.9 s |
| /programs | desktop | 74 / 100 / 96 / 100, **CLS 0.411** | 100 / 100 / 100 / 100, LCP 0.4 s, CLS 0 |
| /contact | mobile | 90 / 100 / 96 / 100, LCP 3.2 s | 99 / 100 / 96→100* / 100, LCP 1.7 s |
| /contact | desktop | 74 / 100 / 100 / 100, **CLS 0.366** | 100 / 100 / 96→100* / 100, LCP 0.5 s, CLS 0 |
| JEE landing page | mobile / desktop | (new page) | 99 / 100 / 100 / 100 and 100 / 100 / 100 / 100 |

\*The last Contact accessibility issue (an un-underlined link) was fixed in the final commit. Mobile scores vary by a few points between runs. Lighthouse's "SEO 100" before did not notice the empty body; the raw-HTML table above shows the real change.

**Brand name.** 58 replacements: 51 in code (48 × "Hawk Academe", 2 × "HAWK ACADEME" typed as capitals, 1 × capitalised in JavaScript), and 7 in the database (6 blog authors, 1 admin display name). No CSS `text-transform` touches the brand. "Hawk Academe" and "Hawk Academy" appear only as JSON-LD `alternateName`. `npm run build` now fails on any other spelling.

**Structured data.** schema.org validator: 0 errors, 0 warnings on the home, landing, article, About and Privacy pages.

## What changed, by phase (commits on `main`)

| Phase | Commit | Summary |
|---|---|---|
| 1 Audit | e6fe1b0 | `SEO_AUDIT.md` |
| Brand | ea51e2f | One `BRAND_NAME` constant (`client/src/lib/brand.js`); `tools/check-brand.mjs` runs before every build |
| 2 Technical | 33ef90a | Server-side rendering inside the existing Express/Vercel function, with hydration (no framework change, design unchanged); data preloaded as a CSP-safe JSON block; `/path/` 301 → `/path`; CDN caching |
| 3 On-page | b4faad9 | Central title/description config (`client/src/lib/seoPages.js`); 3 landing pages; Privacy and Terms; honest results (sample toppers, placeholder figures, sample reviews and notices hidden); blog posts with dates, reading time, table of contents and program links; 6 placeholder posts replaced with real articles (live database) |
| 4 Structured data | 50b7307 | WebSite, EducationalOrganization (with alternateName and founder), a LocalBusiness per centre (address, geo, map, hours), BreadcrumbList, Course, FAQPage, BlogPosting, ContactPage/AboutPage |
| 5 Social | 2d1face | Branded 1200 × 630 share images per page type, Twitter tags, favicon set, apple-touch-icon, web manifest |
| 6 Performance | eaac667, 4233881 | Self-hosted fonts, preloaded LCP image, smaller logo and program images, removed the page fade-in that hid LCP, contrast and label fixes |
| 8 AI search | bf0ed30 | `/llms.txt`, generated from site data |
| 10 Monitoring | a5bbbf6 | Optional GA4 with conversions (enquiry, call, WhatsApp, directions), Search Console and Bing verification tags, `npm run check:seo`, GitHub Actions + Lighthouse CI |

Phases 7 (mobile and accessibility) and 9 (local SEO) were delivered within the commits above: call and WhatsApp bar with tracking, logo alt "HAwk ACademe logo", `lang="en-IN"`, landmarks, labelled form, contrast fixes, lazy-loaded maps per centre on Contact, NAP identical across footer, Contact, schema and llms.txt.

**Deliberately not done**
- About, Programs, Results and News stay out of the header nav, as you asked earlier. They are linked from the footer, the home page and the landing pages instead.
- Footer links on phones are 36px tall (not 48px), to keep the compact footer. That still passes WCAG 2.2.
- No "best coaching" answer was written, because that would be an unverifiable claim.
- No ratings, reviews or price markup, since nothing has been confirmed.
- No doorway area pages (Barasat, Dum Dum and so on). Each needs genuinely different content first; see the content plan below.

## Settings to update on Vercel (Settings → Environment Variables, then Redeploy)

| Variable | Value |
|---|---|
| `MAIL_FROM` | `HAwk ACademe Website <hawkacademe@gmail.com>` (Vercel still has the old "Hawk Academe" spelling) |
| `GA_MEASUREMENT_ID` | Your GA4 ID (`G-…`). This turns on analytics and the conversion events. |
| `GOOGLE_SITE_VERIFICATION` | The content value of Search Console's HTML-tag method |
| `BING_SITE_VERIFICATION` | The content value of Bing Webmaster's meta-tag method |

## Off-site checklist

**Search engines**
1. Google Search Console: add the property `https://www.hawkacademe.com` (or a Domain property via DNS in Vercel) and verify it. Submit `https://www.hawkacademe.com/sitemap.xml`. Request indexing for `/`, the three `/programs/...` landing pages, `/contact` and `/programs`.
2. Bing Webmaster Tools: import from Search Console (quickest) and submit the same sitemap. Bing also feeds ChatGPT search and Copilot.

**Google Business Profile**
1. Claim or verify the profile. If you want each centre to appear on Maps, create one profile per centre.
2. Name exactly **HAwk ACademe**, matching the signboard. Don't add keywords to the name.
3. Primary category "Coaching center"; secondary "Tutoring service" and "Educational institution".
4. Address and pin exactly as on the website for each centre.
5. Hours: every day, 8 am–9 pm.
6. Phone +91 98318 25207.
7. Website `https://www.hawkacademe.com/?utm_source=gbp&utm_medium=organic&utm_campaign=<centre>`.
8. Services: JEE coaching, NEET coaching, Foundation (Class 8–10), Integrated program.
9. Add 10 or more real photos per centre (classrooms, faculty, events, signboard).
10. Post weekly (admissions, batch starts, test dates, results with consent).
11. Seed the Q&A with the FAQs from the landing pages.
12. Share a review link with parents and students who agree, never offer rewards for reviews, and reply to every review.

**Listings whose name must read exactly "HAwk ACademe"**
- **Facebook page:** the URL slug is `hawkacademe`; check that the display name uses this capitalisation.
- **IndiaMART:** rename the listing if it differs, and correct the address to the real centres.
- **YouTube channel:** check the display name; it may currently read "HAWK ACADEMY".
- **Instagram:** check the display name.
- **Google Business Profile.**

**Citations (same name, address and phone everywhere):** Justdial, Sulekha, Shiksha, Careers360 and CollegeDekho coaching listings, IndiaMART, Bing Places, Apple Business Connect, Facebook, Instagram, YouTube.

**Backlinks:** local school and PTA newsletters, alumni and toppers' profiles (with consent), local news coverage of results, guest articles for education blogs, and sponsoring or speaking at school science events.

**Content and reputation:** short Instagram and YouTube videos (concept explainers, topper interviews with consent, centre tours) that link to the landing pages; collect genuine reviews steadily.

## 90-day content plan (20 pieces)

| Wk | Title | Target search | Links to |
|---|---|---|---|
| 1 | JEE Main syllabus and chapter-wise weightage | jee main chapter wise weightage | JEE page |
| 1 | NEET Biology: NCERT line-by-line strategy (expanded) | neet biology ncert strategy | NEET page |
| 2 | NEET vs JEE: how to choose after Class 10 | neet or jee which is better | both |
| 2 | Class 10 to 11 transition for science students | class 11 science preparation tips | Foundation, JEE, NEET |
| 3 | WBJEE vs JEE Main: differences, colleges, preparation | wbjee vs jee main | JEE page |
| 3 | West Bengal NEET medical counselling guide | wb neet counselling process | NEET page |
| 4 | JEE coaching near Barasat: how to choose (honest checklist) | jee coaching barasat | JEE page, Contact |
| 4 | Best study timetable for droppers (JEE and NEET) | dropper study timetable | JEE, NEET |
| 5 | Scholarship and diagnostic tests: what to expect | coaching scholarship test kolkata | News, Contact |
| 5 | Olympiads and NTSE-style exams for Class 8 to 10 | olympiad preparation class 9 | Foundation |
| 6 | NEET Physics: how to stop losing marks | neet physics preparation | NEET page |
| 6 | Organic chemistry for JEE: a reaction-map method | jee organic chemistry tips | JEE page |
| 7 | Students in Madhyamgram: balancing school, coaching and travel | coaching madhyamgram | Contact (Madhyamgram) |
| 7 | How many mock tests before JEE Main, and how to review them | how many mock tests jee | mock-review post |
| 8 | Class 9 Maths topics that decide Class 11 | class 9 maths important for jee | Foundation |
| 8 | NEET previous year papers: how to use them | neet previous year question strategy | NEET page |
| 9 | Board exams and JEE together: a Class 12 plan | class 12 boards and jee preparation | JEE page |
| 10 | New Town and Rajarhat students: getting started with NEET | neet coaching new town | Contact (New Town) |
| 11 | Parents' guide: questions to ask any coaching institute | how to choose coaching institute | Programs, About |
| 12 | Last 30 days before NEET: a revision plan | neet last month preparation | NEET page |

Each post should have 800+ words, a named faculty author (with a short bio on About), at least two internal links, and a published date. Area-themed posts (weeks 4, 7, 10) should give real local information (centre location, travel, batch timings) rather than repeating text.

## Placeholders and assumptions to confirm

**Must confirm (currently hidden or approximate)**
1. **Headline numbers still shown:**
   - 5000+ Students Trained, 1000+ Selections in Top Institutes, 150+ Students in Top 500 (JEE), 98% Student Satisfaction (Admin › Timings & highlights)
   - 15+ Years of Excellence (`client/src/content/home.js`)

   These come from the design concept. Confirm them or change them; India's 2024 coaching-advertisement guidelines require such claims to be verifiable.
2. **Toppers:** name, exam, year, rank or score, college, and written consent (`client/src/content/results.js`). Hidden until supplied.
3. **Results page figures** (selections, ranks, 90%+ scorers, years of results). Hidden.
4. **Founder's one-line message**, so the quote block appears on Home and About.
5. **Year founded, and the "Our story" paragraphs.** About currently uses a short factual summary.
6. **Faculty:** names, qualifications, experience and photos for About and blog author bios. Hidden.
7. **Testimonials:** real, consented quotes in Admin › Reviews. Samples hidden.
8. **News:** real notices (batch start dates, test dates). /news stays noindex until one exists.
9. **Program details:** duration, batch size, mode and timings for each program, and the classes covered by the Integrated program (Admin › Timings & highlights). Shown as "Ask us" until filled in.
10. **Addresses:**
    - Madhyamgram street address (only the area and PIN 700129 are shown; the PIN came from OpenStreetMap)
    - New Town PIN code (700161 or 700135?)
    - Whether the unverified "Basunagar 1st Gate, Madhyamgram" from the brief is the Madhyamgram centre's address
11. **Head office:** which centre, if any, to label as the main one.
12. **Programs at each centre:** whether every program runs at all three. The landing pages currently say "ask which centre runs the batch that suits you".
13. **Fees and refund policy:** needed before a Fee/Refund policy page can be published.
14. **Diagnostic and scholarship tests on Home** ("HAwk Talent Search Test" and others): confirm the names and dates.
15. **Gallery:** confirm the photos are Hawk Academe's own and replace the samples.

**Assumptions made**
- JEE and NEET serve "Class 11, Class 12 and droppers", and Foundation serves Class 8 to 10, as saved in Admin settings.
- Instagram `instagram.com/hawkacademe` and YouTube channel `UCHVaJRbj3YkqktpuOGEh7AQ` belong to the institute, since you supplied them.
- Exam facts on the landing pages are general and stable (NTA conducts JEE Main and NEET-UG; JEE Advanced is run by an IIT), and each page points to the official sites for current details.
- The six blog articles were written as general study advice under the author "HAwk ACademe". Please have a teacher review them and add a named author if you like.
