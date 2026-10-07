import 'dotenv/config';

const env = process.env;
const isProd = env.NODE_ENV === 'production';

function required(name, devDefault) {
  const v = env[name];
  if (v) return v;
  if (!isProd && devDefault !== undefined) return devDefault;
  throw new Error(`Missing environment variable ${name}. See .env.example.`);
}

export const config = {
  isProd,
  // HTTPS redirect, HSTS and secure cookies. Turn off only to test a production build on http://localhost.
  forceHttps: isProd && env.FORCE_HTTPS !== 'false',
  port: Number(env.PORT || 4000),
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/hawk-academe'),
  sessionSecret: required('SESSION_SECRET', 'dev-only-secret-change-me'),
  siteUrl: (env.SITE_URL || 'http://localhost:5173').replace(/\/$/, ''),
  mail: {
    brevoApiKey: env.BREVO_API_KEY || '',
    from: env.MAIL_FROM || 'HAwk ACademe Website <no-reply@hawkacademe.com>',
    enquiryTo: env.ENQUIRY_TO || ''
  },
  cloudinaryUrl: env.CLOUDINARY_URL || (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
    ? `cloudinary://${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}@${env.CLOUDINARY_CLOUD_NAME}` : ''),
  turnstile: {
    siteKey: env.TURNSTILE_SITE_KEY || '',
    secret: env.TURNSTILE_SECRET_KEY || ''
  },
  // Session lifetime: signed out after 2 hours without activity, and always after 12 hours.
  sessionIdleMs: 2 * 60 * 60 * 1000,
  sessionMaxMs: 12 * 60 * 60 * 1000,
  maxAdmins: 2
};
