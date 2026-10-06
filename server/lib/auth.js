import { AdminUser } from '../models/index.js';
import { config } from '../config.js';

// Signed-in check for every /api/admin route. Also enforces the absolute session limit.
export async function requireAdmin(req, res, next) {
  const s = req.session;
  if (!s || !s.adminId) return res.status(401).json({ error: 'Please log in again.' });
  if (!s.startedAt || Date.now() - s.startedAt > config.sessionMaxMs) {
    return s.destroy(() => res.status(401).json({ error: 'Your session has ended. Please log in again.' }));
  }
  try {
    const user = await AdminUser.findById(s.adminId).lean();
    // Sessions made before a password change stop working.
    if (!user || (user.sessionVersion || 0) !== (s.version || 0)) {
      return s.destroy(() => res.status(401).json({ error: 'Please log in again.' }));
    }
    req.admin = user;
    next();
  } catch (e) {
    next(e);
  }
}

// Blocks cross-site form posts: every state-changing admin request must come from our own
// pages, which always send this header. Browsers do not let other sites set it.
export function requireAjax(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-Requested-With') !== 'fetch') return res.status(403).json({ error: 'Request blocked.' });
  next();
}

export const publicUser = (u) => ({ id: String(u._id), name: u.name, email: u.email, mustChangePassword: !!u.mustChangePassword });
