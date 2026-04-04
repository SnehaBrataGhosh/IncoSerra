import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const PLAN_LIMITS = {
  silver: { min: 20, max: 60 },
  gold: { min: 40, max: 120 },
  platinum: { min: 50, max: 150 },
};

/** ISO week helper: Monday-based week start in local server TZ */
function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** POST /api/deposit */
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const amount = Number(req.body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount required' });
    }

    const [users] = await pool.query('SELECT plan FROM users WHERE id = ?', [userId]);
    if (!users.length) return res.status(404).json({ error: 'User not found' });
    const plan = users[0].plan;
    if (!plan) {
      return res.status(400).json({ error: 'Select a plan before depositing' });
    }

    const limits = PLAN_LIMITS[plan];
    if (amount < limits.min || amount > limits.max) {
      return res.status(400).json({
        error: `Amount must be between ₹${limits.min} and ₹${limits.max} for ${plan} plan`,
      });
    }

    const weekStart = startOfWeek(new Date());
    const [cnt] = await pool.query(
      `SELECT COUNT(*) AS c FROM deposits WHERE user_id = ? AND date >= ?`,
      [userId, weekStart]
    );
    if (Number(cnt[0].c) >= 3) {
      return res.status(400).json({
        error: 'Weekly deposit limit reached (3 deposits per week for your plan)',
      });
    }

    await pool.query('INSERT INTO deposits (user_id, amount) VALUES (?, ?)', [userId, amount]);
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Deposit failed' });
  }
});

export default router;
