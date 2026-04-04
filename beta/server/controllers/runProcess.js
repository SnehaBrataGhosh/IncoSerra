import pool from '../db.js';
import { fetchWeatherSummary } from '../services/weather.js';
import { evaluateClaim } from '../services/processClaim.js';

export async function runClaimProcess(req) {
  const userId = req.session.userId;
  const { activityLevel, movement, requestedAmount, city } = req.body || {};

  const validActivity = ['low', 'medium', 'high'].includes(activityLevel);
  if (!validActivity) {
    return { error: 400, body: { error: 'activityLevel must be low, medium, or high' } };
  }
  if (movement !== 'yes' && movement !== 'no') {
    return { error: 400, body: { error: 'movement must be yes or no' } };
  }

  const [users] = await pool.query('SELECT plan FROM users WHERE id = ?', [userId]);
  if (!users.length) return { error: 404, body: { error: 'User not found' } };
  const plan = users[0].plan;
  if (!plan) {
    return { error: 400, body: { error: 'Select a plan before submitting a claim' } };
  }

  const weather = await fetchWeatherSummary(city);
  const movementBool = movement === 'yes';

  const outcome = await evaluateClaim({
    userId,
    plan,
    activityLevel,
    movement: movementBool,
    requestedAmount: Number(requestedAmount) || 0,
    weatherIsBad: weather.isBad,
    weatherSummary: weather.summary,
  });

  return {
    error: null,
    body: { ...outcome, cityUsed: weather.cityUsed },
  };
}
