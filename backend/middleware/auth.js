import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? null : 'kodflix-dev-secret-change-in-production');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('FATAL: Set JWT_SECRET in production environment variables.');
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const secret = JWT_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Server misconfiguration' });
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    res.clearCookie('token');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export { JWT_SECRET };
