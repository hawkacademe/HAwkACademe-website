// Hosting limits uploads to about 4.5 MB per request, so large phone photos are
// scaled down in the browser first. The server still resizes and converts to WebP.
const LIMIT = 4 * 1024 * 1024;
const MAX_SIDE = 2400;

export async function shrinkImage(file) {
  if (file.size <= LIMIT) return file;
  let bmp;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file; // a format the browser can't read (e.g. HEIC); let the server decide
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
}
