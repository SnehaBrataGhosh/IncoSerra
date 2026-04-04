import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function ProcessContent() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [activityLevel, setActivityLevel] = useState('medium');
  const [movement, setMovement] = useState('yes');
  const [city, setCity] = useState('Mumbai');
  const [requestedAmount, setRequestedAmount] = useState('40');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function runProcess() {
    setError('');
    setBusy(true);
    try {
      const res = await api.process({
        activityLevel,
        movement,
        city,
        requestedAmount: Number(requestedAmount) || 0,
      });
      await nav('/claim/result', { state: { result: res } });
    } catch (e) {
      setError(e.message || 'Processing failed');
    } finally {
      setBusy(false);
    }
  }

  if (!user?.plan) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-slate-600">Select a plan before starting a claim.</p>
          <Link to="/plans" className="mt-4 inline-block font-semibold text-emerald-700 hover:underline">
            Choose plan
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Claim flow</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Process</h1>
        <p className="mt-2 text-sm text-slate-600">
          Step {step} of 2 — proofs are simulated; weather is fetched for the city you enter when an
          API key is configured on the server.
        </p>

        {step === 1 ? (
          <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-700">Activity level</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['low', 'medium', 'high'].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setActivityLevel(a)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
                      activityLevel === a
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Movement detected</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMovement('yes')}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    movement === 'yes'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setMovement('no')}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    movement === 'no'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">City for weather lookup</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Requested support amount (INR)</label>
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Optional proof image (UI only)</label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-slate-600"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
              />
              {fileName ? <p className="mt-1 text-xs text-slate-500">Selected: {fileName} (not uploaded)</p> : null}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Review</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <span className="font-medium text-slate-800">Activity:</span>{' '}
                <span className="capitalize">{activityLevel}</span>
              </li>
              <li>
                <span className="font-medium text-slate-800">Movement:</span> {movement === 'yes' ? 'Yes' : 'No'}
              </li>
              <li>
                <span className="font-medium text-slate-800">City:</span> {city}
              </li>
              <li>
                <span className="font-medium text-slate-800">Requested amount:</span> ₹{requestedAmount}
              </li>
            </ul>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={busy}
                onClick={runProcess}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {busy ? 'Processing…' : 'Run backend processing'}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <Link to="/dashboard" className="mt-8 inline-block text-sm font-semibold text-slate-600 hover:text-slate-900">
          ← Dashboard
        </Link>
      </main>
    </div>
  );
}

export default function ProcessClaim() {
  return (
    <ProtectedRoute>
      <ProcessContent />
    </ProtectedRoute>
  );
}
