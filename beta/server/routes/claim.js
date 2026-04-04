import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { runClaimProcess } from '../controllers/runProcess.js';

const router = Router();

/** POST /api/claim */
router.post('/', requireAuth, async (req, res) => {
  try {
    const result = await runClaimProcess(req);
    if (result.error) return res.status(result.error).json(result.body);
    return res.json(result.body);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Processing failed' });
  }
});

/** GET /api/claim/:id */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const [rows] = await pool.query(
      `SELECT id, status, payout_amount, risk_score, reason, weather_summary, activity_level, movement,
              demand_simulated, created_at
       FROM claims WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Claim not found' });
    const c = rows[0];
    return res.json({
      id: c.id,
      status: c.status,
      payoutAmount: Number(c.payout_amount),
      riskScore: c.risk_score,
      reason: c.reason,
      weather: c.weather_summary,
      activity: c.activity_level,
      movement: c.movement,
      demandSimulated: c.demand_simulated,
      createdAt: c.created_at,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load claim' });
  }
});

export default router;
