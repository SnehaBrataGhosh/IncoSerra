import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { runClaimProcess } from '../controllers/runProcess.js';

const router = Router();

/** POST /api/process */
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

export default router;
