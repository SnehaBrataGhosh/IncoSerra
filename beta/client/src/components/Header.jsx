import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Bengali', 'Tamil', 'Marathi'];

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [lang, setLang] = useState('English');

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-emerald-700">
          IncoSerra
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <label className="sr-only" htmlFor="lang">
            Language
          </label>
          <select
            id="lang"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none ring-emerald-500/30 focus:ring-2"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  nav('/');
                }}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
