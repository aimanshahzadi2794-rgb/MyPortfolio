import jwt from 'jsonwebtoken';

const secret = () => process.env.JWT_SECRET || 'dev-secret';

export const signToken = (email) => jwt.sign({ email, role: 'admin' }, secret(), { expiresIn: '8h' });

// protects admin-only routes
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Login required' });
  try {
    req.user = jwt.verify(token, secret());
    next();
  } catch {
    res.status(401).json({ message: 'Session expired, please log in again' });
  }
}
