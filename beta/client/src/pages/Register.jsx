import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { api } from '../api.js';

const DOMAINS = ['E-commerce', 'Fast commerce', 'Taxi', 'Food delivery'];

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    domain: DOMAINS[0],
    password: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!/^\d{12}$/.test(form.aadhaar)) {
      setError('Aadhaar must be exactly 12 digits (mock value is fine).');
      return;
    }
    setBusy(true);
    try {
      await api.register(form);
      nav('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Create your IncoSerra account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use any valid 12-digit mock Aadhaar. Example-style names: RAJU RASTOFI or AJEY NAGAR.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Aadhaar (12 digits)</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
              value={form.aadhaar}
              onChange={(e) => update('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
              inputMode="numeric"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Domain</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
              value={form.domain}
              onChange={(e) => update('domain', e.target.value)}
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
            Login
          </Link>
        </p>
      </main>
    </div>
  );
}
