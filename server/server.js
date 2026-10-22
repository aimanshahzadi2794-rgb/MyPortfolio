import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', contactRoutes);          // /api/contact and /api/messages

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// central error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || (err.name === 'MulterError' ? 400 : 500);
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((e) => {
    console.error('Database error:', e.message);
    console.error('Is MySQL running in XAMPP? Check DB_PORT in server/.env');
    process.exit(1);
  });
