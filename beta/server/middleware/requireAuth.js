/**
 * Ensures an authenticated session exists before continuing.
 */
export function requireAuth(req, res, next) {
  if (!req.session || req.session.userId == null) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}
