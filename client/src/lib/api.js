// Small fetch wrapper. Every request carries X-Requested-With, which the server
// requires for admin changes (blocks cross-site form posts).
export class ApiError extends Error {
  constructor(message, status, field) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = { 'X-Requested-With': 'fetch', Accept: 'application/json' };
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch('/api' + path, { method, headers, body: payload, credentials: 'same-origin' });
  } catch {
    throw new ApiError('Could not reach the server. Please check your internet connection and try again.', 0);
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    if (res.status === 401 && path.startsWith('/admin')) window.dispatchEvent(new Event('ha:signed-out'));
    throw new ApiError(data?.error || 'Something went wrong. Please try again.', res.status, data?.field);
  }
  return data;
}

// Cached GET for public content, so moving between pages feels instant.
const cache = new Map();
export function cachedGet(path, maxAgeMs = 60000) {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < maxAgeMs) return hit.promise;
  const promise = api(path).catch((e) => { cache.delete(path); throw e; });
  cache.set(path, { at: Date.now(), promise });
  return promise;
}
export const clearCache = () => cache.clear();
