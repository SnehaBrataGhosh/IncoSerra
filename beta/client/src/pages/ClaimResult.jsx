import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function fmtMoney(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );
}

function ResultContent() {
  const loc = useLocation();
  const nav = useNavigate();
  const { refresh } = useAuth();
  const result = loc.state?.result;

  useEffect(() => {
    if (result) refresh();
  }, [result, refresh]);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-slate-600">No result to show. Start a claim from the dashboard.</p>
          <button
            type="button"
            onClick={() => nav('/claim/process')}
            className="mt-4 text-sm font-semibold text-emerald-700 hover:underline"
          >
            Go to process
          </button>
        </main>
      </div>
    );
  }

  const decision =
    result.status === 'approved'
      ? 'Approved'
      : result.status === 'rejected'
        ? 'Rejected'
        : 'Review';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Claim outcome</h1>
        <p className="mt-2 text-sm text-slate-600">
          Plain-language summary for NIHARIKA / PADMINI-style demo runs.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-slate-500">Weather</p>
              <p className="font-medium text-slate-900">{result.weatherSummary}</p>
            </div>
            <div>
              <p className="text-slate-500">Activity</p>
              <p className="font-medium capitalize text-slate-900">{result.activityLevel}</p>
            </div>
            <div>
              <p className="text-slate-500">Movement</p>
              <p className="font-medium text-slate-900">{result.movement}</p>
            </div>
            <div>
              <p className="text-slate-500">Simulated demand</p>
              <p className="font-medium capitalize text-slate-900">{result.demandSimulated}</p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">Decision</p>
            <p className="text-lg font-semibold text-slate-900">{decision}</p>
            <p className="mt-1 text-sm text-slate-600">
              Payout: <span className="font-semibold text-slate-900">{fmtMoney(result.payoutAmount)}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Risk score: <span className="font-semibold text-slate-900">{result.riskScore}</span> / 100
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{result.reason}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Back to dashboard
          </Link>
          <Link
            to="/claim/process"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            New claim
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ClaimResult() {
  return (
    <ProtectedRoute>
      <ResultContent />
    </ProtectedRoute>
  );
}
