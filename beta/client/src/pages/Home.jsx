import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURES = [
  {
    title: 'Income Stability',
    description:
      'Small, timely support when your day turns rough—so rent, food, and travel feel less fragile.',
  },
  {
    title: 'Smart Payouts',
    description:
      'Decisions combine weather, activity, and demand signals instead of relying on a single checkbox.',
  },
  {
    title: 'Fraud Protection',
    description:
      'Movement and pattern checks reduce spoofing while keeping genuine workers in the clear.',
  },
  {
    title: 'Transparency',
    description:
      'Every outcome includes a plain-language reason you can read in seconds—not hidden fine print.',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <section className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-700">Stability for gig days</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Calm support when conditions slip.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            IncoSerra focuses on the day you are having—weather, demand, and real activity—before
            deciding if a small payout makes sense. Built for clarity, not clutter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Create account
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Demo accounts (after seeding): NIHARIKA and PADMINI share the documented demo password.
          </p>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} title={f.title} description={f.description} />
          ))}
        </section>
      </main>
    </div>
  );
}
