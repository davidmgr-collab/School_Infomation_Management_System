
import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../routes/Guards';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const user = await login(form);
      const requestedRole = params.get('role');

      if (requestedRole && requestedRole !== user.role) {
        setError(`This account belongs to the ${user.role} role, not ${requestedRole}.`);
        return;
      }

      navigate(
        location.state?.from?.pathname || homeForRole(user.role),
        { replace: true }
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-[85vh] place-items-center overflow-hidden bg-gradient-to-br from-[#10294f] via-[#173b70] to-[#2563eb] px-4 py-12">

      {/* Decorative background */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-fade-in">

        {/* Branding */}
        <div className="mb-7 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl font-black text-orange-400 shadow-xl backdrop-blur">
            S
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-wide">
            SIMS
          </h2>

          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            School Information Management System
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-white/60 bg-white p-7 shadow-2xl sm:p-9"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#173b70] transition hover:-translate-x-1 hover:text-blue-600"
          >
            <span>←</span>
            Back to public dashboard
          </Link>

          <div className="mt-8">
            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-600">
              Secure access
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#173b70]">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in with your school account. Your role determines your dashboard.
            </p>
          </div>

          {error && (
            <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span className="font-bold">!</span>
              <p>{error}</p>
            </div>
          )}

          <div className="mt-7">
            <label className="form-label" htmlFor="username">
              Username
            </label>

            <input
              id="username"
              className="field mb-5"
              autoComplete="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />

            <label className="form-label" htmlFor="password">
              Password
            </label>

            <input
              id="password"
              className="field mb-7"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              disabled={busy}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#173b70] to-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Signing in...' : 'Sign in'}
              {!busy && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>
          </div>

          <div className="mt-7 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Authorized school personnel only
            </p>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-blue-100">
          © {new Date().getFullYear()} SIMS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
