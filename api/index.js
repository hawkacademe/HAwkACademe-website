// Vercel entry point. Vercel runs this file as a serverless function for every
// request that is not a static file in client/dist (see vercel.json).
// The MongoDB connection and the app are reused between requests on a warm instance.
import mongoose from 'mongoose';
import { config } from '../server/config.js';
import { createApp } from '../server/index.js';

mongoose.set('strictQuery', true);
let ready;

function init() {
  ready ??= mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 })
    .then(() => createApp())
    .catch((e) => { ready = undefined; throw e; });
  return ready;
}

export default async function handler(req, res) {
  try {
    const app = await init();
    return app(req, res);
  } catch (e) {
    console.error(`Could not connect to MongoDB: ${e.message}`);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain');
    res.end('The site is starting up. Please try again in a moment.');
  }
}
