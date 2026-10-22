import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

function validate(b = {}) {
  const errors = {};
  const name = (b.name || '').trim(), subject = (b.subject || '').trim(), message = (b.message || '').trim();
  if (name.length < 3 || name.length > 100) errors.name = 'Name must be 3 to 100 characters.';
  if (!/^\S+@\S+\.\S+$/.test(b.email || '') || b.email.length > 150) errors.email = 'Enter a valid email address.';
  if (subject.length < 3 || subject.length > 150) errors.subject = 'Subject must be 3 to 150 characters.';
  if (message.length < 10 || message.length > 2000) errors.message = 'Message must be 10 to 2000 characters.';
  return errors;
}

// POST /api/contact (public): validate and save to MySQL
router.post('/contact', wrap(async (req, res) => {
  const errors = validate(req.body);
  if (Object.keys(errors).length) return res.status(422).json({ message: 'Validation failed', errors });

  const { name, email, subject, message } = req.body;
  await pool.query(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?,?,?,?)',
    [name.trim(), email.trim(), subject.trim(), message.trim()]
  );
  res.status(201).json({ message: 'Thanks! Your message has been sent.' });
}));

// GET /api/messages (admin)
router.get('/messages', requireAuth, wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  res.json(rows);
}));

// DELETE /api/messages/:id (admin)
router.delete('/messages/:id', requireAuth, wrap(async (req, res) => {
  await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
  res.json({ message: 'Message deleted' });
}));

export default router;
