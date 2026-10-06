// Removes an admin login.   npm run remove-admin -- name@example.com
import mongoose from 'mongoose';
import { config } from '../config.js';
import { AdminUser } from '../models/index.js';

const email = String(process.argv[2] || '').trim().toLowerCase();
if (!email) {
  console.error('Usage: npm run remove-admin -- name@example.com');
  process.exit(1);
}
await mongoose.connect(config.mongoUri);
const r = await AdminUser.deleteOne({ email });
console.log(r.deletedCount ? `Removed ${email}. Their sessions end on their next request.` : `No admin with the email ${email}.`);
await mongoose.disconnect();
