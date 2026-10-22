import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');
const CATEGORIES = ['web', 'ai', 'mobile', 'game', 'systems'];

// image upload (max 2 MB, images only)
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    const err = new Error('Only image files are allowed'); err.status = 400; cb(err);
  },
});

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const removeFile = (name) => { if (name) fs.unlink(path.join(uploadDir, name), () => {}); };

function validate(b) {
  const errors = {};
  if (!b.title || b.title.trim().length < 2 || b.title.length > 120) errors.title = 'Title is required (max 120 characters).';
  if (!b.description || b.description.trim().length < 10) errors.description = 'Description must be at least 10 characters.';
  if (!CATEGORIES.includes(b.category)) errors.category = 'Choose a valid category.';
  if (b.link) { try { new URL(b.link); } catch { errors.link = 'Enter a valid URL (https://...).'; } }
  if (b.tech_stack && b.tech_stack.length > 255) errors.tech_stack = 'Too long (max 255 characters).';
  return errors;
}

// READ: GET /api/projects (public)
router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC, id DESC');
  res.json(rows);
}));

// CREATE: POST /api/projects (admin)
router.post('/', requireAuth, upload.single('image'), wrap(async (req, res) => {
  const errors = validate(req.body);
  if (Object.keys(errors).length) { removeFile(req.file?.filename); return res.status(422).json({ message: 'Validation failed', errors }); }

  const { title, description, link, tech_stack, category } = req.body;
  const [r] = await pool.query(
    'INSERT INTO projects (title, description, image, link, tech_stack, category) VALUES (?,?,?,?,?,?)',
    [title.trim(), description.trim(), req.file?.filename || null, link || null, tech_stack || null, category]
  );
  res.status(201).json({ id: r.insertId, message: 'Project created' });
}));

// UPDATE: PUT /api/projects/:id (admin)
router.put('/:id', requireAuth, upload.single('image'), wrap(async (req, res) => {
  const [[old]] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
  if (!old) { removeFile(req.file?.filename); return res.status(404).json({ message: 'Project not found' }); }

  const errors = validate(req.body);
  if (Object.keys(errors).length) { removeFile(req.file?.filename); return res.status(422).json({ message: 'Validation failed', errors }); }

  const { title, description, link, tech_stack, category } = req.body;
  let image = old.image;
  if (req.file) { removeFile(old.image); image = req.file.filename; }

  await pool.query(
    'UPDATE projects SET title=?, description=?, image=?, link=?, tech_stack=?, category=? WHERE id=?',
    [title.trim(), description.trim(), image, link || null, tech_stack || null, category, req.params.id]
  );
  res.json({ message: 'Project updated' });
}));

// DELETE: DELETE /api/projects/:id (admin)
router.delete('/:id', requireAuth, wrap(async (req, res) => {
  const [[old]] = await pool.query('SELECT image FROM projects WHERE id = ?', [req.params.id]);
  if (!old) return res.status(404).json({ message: 'Project not found' });
  removeFile(old.image);
  await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
  res.json({ message: 'Project deleted' });
}));

export default router;
