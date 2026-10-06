// Image storage. Uses Cloudinary when CLOUDINARY_URL is set (recommended in production,
// because free hosts wipe their disk on every deploy), otherwise the local uploads/ folder.
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';

export const UPLOAD_DIR = join(process.cwd(), 'uploads');
const useCloud = !!config.cloudinaryUrl;
if (useCloud) cloudinary.config({ secure: true }); // reads CLOUDINARY_URL

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

async function put(buffer, folder) {
  const id = `${Date.now().toString(36)}-${randomBytes(5).toString('hex')}`;
  if (useCloud) {
    const res = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: `hawk-academe/${folder}`, public_id: id, resource_type: 'image', format: 'webp' },
        (err, r) => (err ? reject(err) : resolve(r))).end(buffer);
    });
    return { url: res.secure_url, key: `cld:${res.public_id}` };
  }
  const dir = join(UPLOAD_DIR, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${id}.webp`), buffer);
  return { url: `/uploads/${folder}/${id}.webp`, key: `local:${folder}/${id}.webp` };
}

export async function removeStored(key) {
  if (!key) return; // built-in photos have no key and are never deleted
  try {
    if (key.startsWith('cld:')) await cloudinary.uploader.destroy(key.slice(4));
    else if (key.startsWith('local:')) await unlink(join(UPLOAD_DIR, key.slice(6)));
  } catch (e) {
    console.warn('Could not remove stored file', key, e.message);
  }
}

// Resize and convert to WebP so photos load quickly on mobile data.
export async function saveImage(buffer, { folder = 'images', maxWidth = 1600, thumbWidth } = {}) {
  let meta;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    const err = new Error('That file is not an image we can read. Please use a JPG, PNG or WebP photo.');
    err.status = 400;
    throw err;
  }
  const base = sharp(buffer, { failOn: 'none' }).rotate(); // honour phone camera orientation
  const main = await base.clone().resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
  const out = { ...(await put(main.data, folder)), width: main.info.width, height: main.info.height, format: meta.format };
  if (thumbWidth) {
    const thumb = await base.clone().resize({ width: thumbWidth, withoutEnlargement: true }).webp({ quality: 74 }).toBuffer();
    const t = await put(thumb, `${folder}/thumbs`);
    out.thumbUrl = t.url;
    out.thumbKey = t.key;
  }
  return out;
}
