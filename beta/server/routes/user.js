import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const PLANS = ['silver', 'gold', 'platinum'];
const MAX_PLAN_CHANGES = 5;

/** GET /api/user */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const [users] = await pool.query(
      `SELECT id, name, phone, aadhaar, domain, plan, plan_change_count, created_at
       FROM users WHERE id = ?`,
      [userId]
    );
    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    const u = users[0];

    const [depSum] = await pool.query(
      'SELECT COALESCE(SUM(amount),0) AS total FROM deposits WHERE user_id = ?',
      [userId]
    );
    const [claimSum] = await pool.query(
      `SELECT COALESCE(SUM(CASE WHEN status = 'approved' THEN payout_amount ELSE 0 END),0) AS total
       FROM claims WHERE user_id = ?`,
      [userId]
    );

    const [deposits] = await pool.query(
      'SELECT id, amount, date FROM deposits WHERE user_id = ? ORDER BY date DESC LIMIT 50',
      [userId]
    );
    const [claims] = await pool.query(
      `SELECT id, status, payout_amount, risk_score, reason, weather_summary, activity_level, movement, created_at
       FROM claims WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    return res.json({
      user: {
        id: u.id,
        name: u.name,
        phone: u.phone,
        aadhaar: u.aadhaar,
        domain: u.domain,
        plan: u.plan,
        planChangeCount: u.plan_change_count,
        planChangesRemaining: Math.max(0, MAX_PLAN_CHANGES - u.plan_change_count),
        createdAt: u.created_at,
      },
      totals: {
        deposited: Number(depSum[0].total),
        claimedApproved: Number(claimSum[0].total),
      },
      deposits,
      claims,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load user' });
  }
});

/** PATCH /api/user/plan — initial selection does not consume a change; switching plans does */
router.patch('/plan', requireAuth, async (req, res) => {
  try {
    const { plan } = req.body || {};
    if (!PLANS.includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const userId = req.session.userId;
    const [users] = await pool.query(
      'SELECT plan, plan_change_count FROM users WHERE id = ?',
      [userId]
    );
    if (!users.length) return res.status(404).json({ error: 'User not found' });

    const prev = users[0].plan;
    let newCount = users[0].plan_change_count;

    if (prev != null && prev !== plan) {
      if (newCount >= MAX_PLAN_CHANGES) {
        return res.status(403).json({ error: 'Plan change limit reached (5 changes)' });
      }
      newCount += 1;
    }

    await pool.query('UPDATE users SET plan = ?, plan_change_count = ? WHERE id = ?', [
      plan,
      newCount,
      userId,
    ]);

    return res.json({ ok: true, plan, planChangeCount: newCount });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Could not update plan' });
  }
});

export default router;
