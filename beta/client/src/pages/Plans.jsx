import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const PLANS = [
  {
    id: 'silver',
    title: 'Silver',
    deposit: '₹20 – ₹60 per deposit',
    frequency: 'Up to 3 deposits per week',
  },
  {
    id: 'gold',
    title: 'Gold',
    deposit: '₹40 – ₹120 per deposit',
    frequency: 'Up to 3 deposits per week',
  },
  {
    id: 'platinum',
    title: 'Platinum',
    deposit: '₹50 – ₹150 per deposit',
    frequency: 'Up to 3 deposits per week',
  },
];

function PlansContent() {
  const { user, refresh } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  async function choose(planId) {
    setError('');
    setBusy(planId);
    try {
      await api.setPlan(planId);
      await refresh();
      nav('/dashboard');
    } catch (e) {
      setError(e.message || 'Could not save plan');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">Choose your plan</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Plans set your deposit limits. You can change plans later—up to five switches after your
          first selection.
        </p>
        {user?.plan ? (
          <p className="mt-4 text-sm text-emerald-800">
            Current plan: <span className="font-semibold capitalize">{user.plan}</span>. Pick a new
            one below if you need to switch (remaining changes: {user.planChangesRemaining ?? '—'}).
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">{p.title}</h2>
              <p className="mt-3 text-sm text-slate-600">{p.deposit}</p>
              <p className="mt-2 text-sm text-slate-600">{p.frequency}</p>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => choose(p.id)}
                className="mt-6 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {busy === p.id ? 'Saving…' : `Select ${p.title}`}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function Plans() {
  return (
    <ProtectedRoute>
      <PlansContent />
    </ProtectedRoute>
  );
}
