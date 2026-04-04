import pool from '../db.js';

const PLAN_MAX_CLAIM_HINT = { silver: 60, gold: 120, platinum: 150 };

/**
 * Simulates demand as low with weighted randomness (demo-friendly).
 */
function simulateDemandLow() {
  return Math.random() < 0.72;
}

/**
 * Core payout and fraud logic.
 *
 * Payout path: bad weather + high activity + simulated low demand → approved baseline.
 * Fraud: no movement with a relatively high requested amount → review/reject pressure.
 * Repeated identical activity/movement/weather pattern across recent claims raises risk.
 */
export async function evaluateClaim({
  userId,
  plan,
  activityLevel,
  movement,
  requestedAmount,
  weatherIsBad,
  weatherSummary,
}) {
  const amt = Number(requestedAmount) || 0;
  const cap = PLAN_MAX_CLAIM_HINT[plan] || 60;
  const highClaim = amt >= cap * 0.85;

  const demandLow = simulateDemandLow();
  const demandLabel = demandLow ? 'low' : 'normal';

  let riskScore = 12;
  let status = 'review';
  let payoutAmount = 0;
  const reasons = [];

  const movementYes = movement === true || movement === 'yes';

  // Fraud / suspicion: idle claimant with a large requested amount
  if (!movementYes && highClaim) {
    riskScore += 38;
    reasons.push('No movement detected during claim while amount requested is high');
  }

  // Pull last few claims for pattern repetition (NIHARIKA / PADMINI flows share same logic)
  const [rows] = await pool.query(
    `SELECT activity_level, movement, weather_summary
     FROM claims WHERE user_id = ? ORDER BY created_at DESC LIMIT 4`,
    [userId]
  );

  const fingerprint = `${activityLevel}|${movementYes ? 'yes' : 'no'}|${weatherSummary}`;
  let repeatStreak = 0;
  for (const row of rows) {
    const fp = `${row.activity_level}|${row.movement === 'yes' ? 'yes' : 'no'}|${row.weather_summary}`;
    if (fp === fingerprint) repeatStreak += 1;
    else break;
  }
  if (repeatStreak >= 2) {
    riskScore += 22;
    reasons.push('Repeated same activity, movement, and weather pattern as recent claims');
  }

  const payoutGate = weatherIsBad && activityLevel === 'high' && demandLow;

  if (payoutGate && riskScore < 45) {
    status = 'approved';
    payoutAmount = Math.min(amt || cap * 0.4, cap);
    reasons.push(
      'Weather disruption with high activity and low simulated demand supports a payout'
    );
  } else if (riskScore >= 68) {
    status = 'rejected';
    payoutAmount = 0;
    reasons.push('Risk score exceeded safe threshold');
  } else {
    status = 'review';
    payoutAmount = payoutGate ? Math.min((amt || cap * 0.25) * 0.5, cap * 0.35) : 0;
    if (!payoutGate) {
      reasons.push(
        'Primary payout conditions not met (need adverse weather, high activity, and low demand)'
      );
    } else {
      reasons.push('Signals partially aligned; manual review recommended');
    }
  }

  riskScore = Math.min(100, Math.max(0, Math.round(riskScore)));

  const reasonText = reasons.join('. ') + '.';

  const [result] = await pool.query(
    `INSERT INTO claims
     (user_id, status, payout_amount, risk_score, reason, weather_summary, activity_level, movement, demand_simulated)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      status,
      payoutAmount,
      riskScore,
      reasonText,
      weatherSummary,
      activityLevel,
      movementYes ? 'yes' : 'no',
      demandLabel,
    ]
  );

  return {
    claimId: result.insertId,
    status,
    payoutAmount,
    riskScore,
    reason: reasonText,
    weatherSummary,
    activityLevel,
    movement: movementYes ? 'Yes' : 'No',
    demandSimulated: demandLabel,
  };
}
