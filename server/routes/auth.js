import { Router } from 'express';
import { signToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const okEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const okPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (email !== okEmail || password !== okPass) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ token: signToken(email) });
});

export default router;
