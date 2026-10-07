import mongoose from 'mongoose';
import { config } from './config.js';
import { createApp } from './index.js';

mongoose.set('strictQuery', true);
try {
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
} catch (e) {
  console.error(`Could not connect to MongoDB at ${config.mongoUri.replace(/\/\/[^@]*@/, '//***@')}: ${e.message}`);
  process.exit(1);
}
createApp().listen(config.port, () => console.log(`HAwk ACademe server running on http://localhost:${config.port}`));
