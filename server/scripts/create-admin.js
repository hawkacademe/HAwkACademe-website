// Creates an admin login (up to 2), or resets the password of an existing one.
//   npm run create-admin -- "Full Name" name@example.com
// A strong temporary password is printed once. The admin must change it on first login.
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { config } from '../config.js';
import { AdminUser } from '../models/index.js';

const [name, emailArg] = process.argv.slice(2);
const email = String(emailArg || '').trim().toLowerCase();
if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: npm run create-admin -- "Full Name" name@example.com');
  process.exit(1);
}

await mongoose.connect(config.mongoUri);
// Readable but strong: 4 groups of 4 characters, no look-alike letters.
const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
const bytes = randomBytes(16);
const temp = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('').replace(/(.{4})(?!$)/g, '$1-');
const passwordHash = await bcrypt.hash(temp, 12);

const existing = await AdminUser.findOne({ email });
if (existing) {
  existing.passwordHash = passwordHash;
  existing.mustChangePassword = true;
  existing.failedAttempts = 0;
  existing.lockUntil = undefined;
  existing.sessionVersion = (existing.sessionVersion || 0) + 1;
  await existing.save();
  console.log(`Password reset for ${email}.`);
} else {
  const count = await AdminUser.countDocuments();
  if (count >= config.maxAdmins) {
    console.error(`There are already ${count} admin users (the limit is ${config.maxAdmins}). Remove one first: npm run remove-admin -- email`);
    process.exit(1);
  }
  await AdminUser.create({ name, email, passwordHash, mustChangePassword: true });
  console.log(`Admin created for ${name} <${email}>.`);
}
console.log(`Temporary password: ${temp}\nThey will be asked to choose a new password on first login.`);
await mongoose.disconnect();
