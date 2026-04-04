import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = Router();

const DOMAINS = ['E-commerce', 'Fast commerce', 'Taxi', 'Food delivery'];

function isValidAadhaar(v) {
  return /^\d{12}$/.test(String(v || ''));
}

/** POST /api/auth/register */
router.post('/register', async (req, res) => {
  try {
    const { name, phone, aadhaar, domain, password } = req.body || {};
    if (!name || !phone || !aadhaar || !domain || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!isValidAadhaar(aadhaar)) {
      return res.status(400).json({ error: 'Aadhaar must be exactly 12 digits' });
    }
    if (!DOMAINS.includes(domain)) {
      return res.status(400).json({ error: 'Invalid domain selection' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const [existingA] = await pool.query('SELECT id FROM users WHERE aadhaar = ?', [aadhaar]);
    if (existingA.length) {
      return res.status(409).json({ error: 'Aadhaar already registered' });
    }
    const [existingN] = await pool.query('SELECT id FROM users WHERE name = ?', [String(name).trim()]);
    if (existingN.length) {
      return res.status(409).json({ error: 'Name already taken' });
    }

    const hash = await bcrypt.hash(String(password), 12);
    await pool.query(
      `INSERT INTO users (name, phone, aadhaar, domain, password) VALUES (?, ?, ?, ?, ?)`,
      [String(name).trim(), String(phone).trim(), aadhaar, domain, hash]
    );

    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

/** POST /api/auth/login — session-based auth (no JWT) */
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body || {};
    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password required' });
    }

    const [rows] = await pool.query(
      'SELECT id, password FROM users WHERE name = ? LIMIT 1',
      [String(name).trim()]
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(String(password), rows[0].password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = rows[0].id;
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

export default router;
