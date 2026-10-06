import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import compression from 'compression';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import { UPLOAD_DIR } from './lib/storage.js';
import { metaFor, sitemapXml, robotsTxt } from './seo.js';
import { ah } from './lib/util.js';

const DIST = join(process.cwd(), 'client', 'dist');

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // behind the host's HTTPS proxy

  // Redirect plain http to https in production.
  if (config.forceHttps) {
    app.use((req, res, next) => (req.secure || req.path === '/healthz' ? next() : res.redirect(301, `https://${req.headers.host}${req.originalUrl}`)));
  }

  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://challenges.cloudflare.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
        'frame-src': ['https://www.google.com', 'https://maps.google.com', 'https://challenges.cloudflare.com'],
        'connect-src': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': config.forceHttps ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: config.forceHttps ? { maxAge: 31536000, includeSubDomains: true } : false
  }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));

  app.get('/healthz', (req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 }));

  app.use('/api', session({
    name: 'ha.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({ client: mongoose.connection.getClient(), collectionName: 'sessions', ttl: config.sessionIdleMs / 1000 }),
    cookie: { httpOnly: true, secure: config.forceHttps, sameSite: 'strict', maxAge: config.sessionIdleMs }
  }));

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', publicRoutes);
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true, fallthrough: false }));

  app.get('/sitemap.xml', ah(async (req, res) => res.type('application/xml').send(await sitemapXml())));
  app.get('/robots.txt', (req, res) => res.type('text/plain').send(robotsTxt()));

  // The built React app. Hashed asset files are cached for a year; HTML is never cached.
  if (existsSync(DIST)) {
    app.use('/assets', express.static(join(DIST, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(DIST, { index: false, maxAge: '7d' }));
    let template;
    app.get(/^\/(?!api\/|uploads\/).*/, ah(async (req, res) => {
      template ??= await readFile(join(DIST, 'index.html'), 'utf8');
      const { tags, status } = await metaFor(req.path);
      res.status(status).set('Cache-Control', 'no-cache').type('html').send(template.replace('<!--app-meta-->', tags));
    }));
  }

  // Errors: show a friendly message, never a stack trace.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : err.name === 'ZodError' ? 400 : 500);
    if (status >= 500) console.error(err);
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'That photo is too large. Please use one under 10 MB.'
      : status >= 500 ? 'Something went wrong on our side. Please try again.' : err.message || 'Request failed.';
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return res.status(status).json({ error: message });
    res.status(status).type('text').send(message);
  });
  return app;
}
