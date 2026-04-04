import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const LIMITS = {
  silver: { min: 20, max: 60 },
  gold: { min: 40, max: 120 },
  platinum: { min: 50, max: 150 },
};

function DepositContent() {
  const { user, refresh } = useAuth();
  const nav = useNavigate();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const limits = useMemo(() => (user?.plan ? LIMITS[user.plan] : null), [user?.plan]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!limits) {
      setError('Select a plan first.');
      return;
    }
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setBusy(true);
    try {
      await api.deposit(n);
      await refresh();
      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Deposit failed');
    } finally {
      setBusy(false);
    }
  }

  if (!user?.plan) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-slate-600">Choose a plan before depositing.</p>
          <Link to="/plans" className="mt-4 inline-block font-semibold text-emerald-700 hover:underline">
            Go to plans
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Deposit</h1>
        <p className="mt-2 text-sm text-slate-600">
          Simulated deposit for <span className="font-semibold capitalize">{user.plan}</span>: between
          ₹{limits.min} and ₹{limits.max}. Weekly cap: 3 deposits.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div>
            <label className="text-sm font-medium text-slate-700">Amount (INR)</label>
            <input
              type="number"
              min={limits.min}
              max={limits.max}
              step="1"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save deposit'}
          </button>
        </form>
        <Link to="/dashboard" className="mt-6 inline-block text-sm font-semibold text-slate-600 hover:text-slate-900">
          ← Back to dashboard
        </Link>
      </main>
    </div>
  );
}

export default function Deposit() {
  return (
    <ProtectedRoute>
      <DepositContent />
    </ProtectedRoute>
  );
}
