# Hawk Academe website (Pro plan)

This is the live website for agreement **HA-WEB-2026-01**. It has the 12 Pro pages, a backend and database, and an admin panel. It is built from the design concept in `../design concept/`.

| | |
|---|---|
| Front end | React 19 + React Router (Vite). The pages are ported from the design files. |
| Backend | Node.js 20 + Express 5 |
| Database | MongoDB (MongoDB Atlas free cluster in production) |
| Photos | Cloudinary in production. Locally they go in the `uploads/` folder. Every photo is resized and saved as WebP. |
| Email | Any SMTP service (for example Brevo or Zoho). It sends each Contact-form enquiry to the office. |

## The 12 pages

| Page | Address | Content comes from |
|---|---|---|
| Home | `/` | Admin (notices, reviews, highlight numbers) and `client/src/content/*` |
| About | `/about` | `client/src/content/about.js`, plus the highlight numbers |
| Programs | `/programs` | `client/src/content/programs.jsx`. Batch details come from Admin › Timings & highlights. |
| Results | `/results` | `client/src/content/results.js` (set at launch) |
| Gallery | `/gallery` | Admin › Gallery |
| Blog | `/blog` | Admin › Blog |
| Blog post | `/blog/<post-address>` | Admin › Blog |
| News | `/news` | Admin › Notices / News |
| Contact | `/contact` | Admin › Timings & highlights. Centres are in `client/src/content/centres.js`. |
| Admin login | `/admin/login` | |
| Admin panel | `/admin` | Overview, Blog, Gallery, Notices, Timings & highlights, Reviews, Enquiries, Account |
| 404 | any unknown address | |

Links in the design that pointed to pages outside the Pro plan (store, cart, student login, booking, admission tests, course pages, policies and so on) have been removed or now point to Contact, as section 3.2 of the agreement requires. The cookie banner is also gone. The site sets only one cookie, the admin login cookie, which is essential, and loads no analytics.

## Run it on your computer

You need Node.js 20 or later, and MongoDB 7 or later running locally (`brew install mongodb-community`).

```bash
cp .env.example .env            # then set SESSION_SECRET (a command to make one is in the file)
npm install
npm run seed                    # loads the starting content from the design concept
npm run create-admin -- "Your Name" you@example.com   # prints a temporary password
npm run dev                     # site: http://localhost:5173   API: http://localhost:4000
```

To try the production build locally:

```bash
npm run build
NODE_ENV=production FORCE_HTTPS=false SITE_URL=http://localhost:4000 npm start   # http://localhost:4000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API and the Vite dev server, both with live reload |
| `npm run build` | Builds the React app into `client/dist` |
| `npm start` | Production server. Serves the API, the built site, `sitemap.xml` and `robots.txt` |
| `npm run seed` | Loads the starting content. It only fills collections that are empty. |
| `npm run create-admin -- "Name" email` | Creates an admin (2 at most), or resets that admin's password. Prints a temporary password, which must be changed at first login. |
| `npm run remove-admin -- email` | Removes an admin |
| `npm run check:placeholders` | Lists every `[PLACEHOLDER]` and sample topper that still has to be replaced before go-live |
| `npm test` | API tests. They need MongoDB running and use a throwaway `hawk-academe-test` database. |

## Security (section 3.4 of the agreement)

- Admin passwords are hashed with bcrypt (cost 12).
- Temporary passwords must be changed at first login.
- A password change signs out the account's other sessions.
- Sessions are stored in the database. They end after 2 hours with no activity, and always after 12 hours. The cookie is `httpOnly`, `secure` and `SameSite=Strict`.
- After 5 wrong passwords the account is locked for 15 minutes. Each network can make at most 20 login attempts per 15 minutes.
- Every admin change must send an `X-Requested-With` header, which blocks cross-site form posts.
- All input is checked on the server with zod.
- Blog HTML is cleaned (`sanitize-html`) when it is saved.
- The CSV export guards against spreadsheet formulas.
- Security headers are set with helmet: a Content-Security-Policy that allows no inline or outside scripts, HSTS and no framing. HTTP redirects to HTTPS.
- The Contact form is protected by a hidden honeypot field, a minimum fill time and a limit of 5 enquiries per 10 minutes from one network. Cloudflare Turnstile is used too when its keys are set.

## Deploying (free plans to start, section 8.4)

1. **Database**: create a free MongoDB Atlas cluster in the institute's name (region Mumbai). Add a database user, allow access from anywhere (`0.0.0.0/0`), and copy the connection string.
2. **Photos**: create a free Cloudinary account and copy the `CLOUDINARY_URL`.
3. **Email**: create an SMTP sender, for example Brevo's free plan (300 emails a day), and verify the sending domain.
4. **Hosting**: on Render, choose New › Blueprint and select this repository. `render.yaml` sets everything up. Fill in `SITE_URL`, `MONGODB_URI`, `CLOUDINARY_URL` and the `SMTP_*` values. The free plan sleeps when idle, so the first visit after a quiet period takes a few seconds (Terms, clause 17).
5. Open the Render shell and run `npm run seed`, then `npm run create-admin -- "Name" email` for each of the two admins.
6. **Domain**: add the custom domain in Render, set the DNS records at the registrar, and wait for the HTTPS certificate.
7. **Google**: verify the site in Search Console and submit `https://<domain>/sitemap.xml`. Paste the Google Maps embed code into Admin › Timings & highlights.

## Go-live checklist (from Annex B)

- [ ] `npm run check:placeholders` reports nothing. This covers the content files, the settings, the sample notices, reviews and blog posts, and the design-concept toppers.
- [ ] The photos in the design concept are confirmed as Hawk Academe's own, or have been replaced (Part 4A of the scope).
- [ ] Every topper has written consent: from the student, or from a parent if the student is under 18.
- [ ] A Contact-form enquiry is saved in Admin and its email arrives in the office inbox.
- [ ] The WhatsApp, phone and email buttons are tested on a phone.
- [ ] The map shows the right location.
- [ ] Both admin users are created, and each has changed the temporary password.
- [ ] The client has added a notice, a blog post and a photo on their own.
- [ ] Search Console is verified and the sitemap is submitted.
- [ ] PageSpeed shows 80 or more on mobile for the public pages. Local Lighthouse runs scored 86–93, with 100 for accessibility, best practices and SEO.

## Recommended before launch (not included in the Pro plan)

The Contact form collects names, phone numbers and emails, and many of them belong to students under 18. India's DPDP Act expects a privacy notice wherever this kind of data is collected, so the **Policies** extra page (₹1,199) is strongly recommended (agreement section 6). It can then be linked from the footer and from under the Contact form.
