import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error('JWT_SECRET must be set in production');
  }
  return secret || 'kodflix-dev-secret-change-in-production';
}

const router = Router();
const SALT_ROUNDS = 10;

// Register: username, email, phone, password → store hashed, default role
router.post('/register', (req, res) => {
  const { username, email, phone, password } = req.body;
  if (!username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }
  const hashed = bcrypt.hashSync(password, SALT_ROUNDS);
  try {
    const stmt = db.prepare(
      'INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(username.trim(), email.trim(), phone?.trim() || null, hashed, 'user');
    return res.status(201).json({ message: 'Registration successful. Please log in.' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    throw err;
  }
});

// Login: username + password → verify, set JWT in HTTP-only cookie
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const row = db.prepare('SELECT id, username, password FROM users WHERE username = ?').get(username.trim());
  if (!row || !bcrypt.compareSync(password, row.password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const token = jwt.sign(
    { id: row.id, username: row.username },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  return res.json({ message: 'Login successful', user: { id: row.id, username: row.username } });
});

// Logout: clear cookie
router.post('/logout', (_req, res) => {
  res.clearCookie('token', { path: '/' });
  return res.json({ message: 'Logged out' });
});

// Get current user (verify session)
router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: { id: req.user.id, username: req.user.username } });
});

export default router;
