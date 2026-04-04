import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function fmtMoney(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );
}

function DashboardContent() {
  const { user, totals, deposits, claims, refresh } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (user && !user.plan) {
      nav('/plans', { replace: true });
    }
  }, [user, nav]);

  if (!user?.plan) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">Redirecting…</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Signed in as <span className="font-medium text-slate-800">{user.name}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/deposit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Deposit
            </Link>
            <Link
              to="/claim/process"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Claim
            </Link>
            <Link
              to="/plans"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Change plan
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Plan</p>
            <p className="mt-1 text-lg font-semibold capitalize text-slate-900">{user.plan}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total deposited</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{fmtMoney(totals?.deposited)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Approved payouts</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{fmtMoney(totals?.claimedApproved)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Plan switches left</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{user.planChangesRemaining ?? '—'}</p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Phone</dt>
              <dd className="font-medium text-slate-900">{user.phone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Domain</dt>
              <dd className="font-medium text-slate-900">{user.domain}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Aadhaar (mock)</dt>
              <dd className="font-medium tracking-wide text-slate-900">{user.aadhaar}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="text-base font-semibold text-slate-900">Deposit history</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {deposits.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={2}>
                      No deposits yet.
                    </td>
                  </tr>
                ) : (
                  deposits.map((d) => (
                    <tr key={d.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 text-slate-700">
                        {new Date(d.date).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{fmtMoney(d.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-base font-semibold text-slate-900">Claim history</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payout</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={4}>
                      No claims yet.
                    </td>
                  </tr>
                ) : (
                  claims.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 text-slate-700">
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-900">{c.status}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {fmtMoney(c.payout_amount)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{c.risk_score}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
