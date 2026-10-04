import React from 'react';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { emailRegex, validatePassword } from '../utils/validators';

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  const errors = {
    email: !form.email ? 'Email is required' : !emailRegex.test(form.email) ? 'Enter a valid email address' : '',
    password: !form.password ? 'Password is required' : !validatePassword(form.password) ? 'Use 8–16 chars with uppercase and a special character' : '',
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setTouched({ email: true, password: true });

    if (errors.email || errors.password) {
      setError('Please fix the highlighted fields.');
      return;
    }

    try {
      const authenticatedUser = await login({ email: form.email, password: form.password });
      navigate(authenticatedUser.role === 'ADMIN' ? '/admin' : authenticatedUser.role === 'OWNER' ? '/owner' : '/stores');
    } catch (loginError) {
      setError(loginError.response?.data?.message || loginError.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.22),transparent_30%)]" />
      <GlassCard as="section" className="w-full max-w-md p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
          <ShieldCheck className="h-4 w-4" /> RateIt
        </div>

        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-300">Sign in with your account and continue.</p>
        {location.state?.message && <p className="mt-4 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-sm text-teal-100">{location.state.message}</p>}

        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
          <div>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 px-3.5 py-3 text-sm text-slate-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-500/20">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(event) => {
                  setError('');
                  setForm((current) => ({ ...current, email: event.target.value }));
                }}
                onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="Email address"
              />
            </label>
            {touched.email && errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 px-3.5 py-3 text-sm text-slate-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-500/20">
              <LockKeyhole className="h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => {
                  setError('');
                  setForm((current) => ({ ...current, password: event.target.value }));
                }}
                onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="rounded-md p-1 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </label>
            {touched.password && errors.password && <p className="mt-1 text-xs text-red-300">{errors.password}</p>}
          </div>

          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 px-4 py-3 font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl">
            Login <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-5 text-sm text-slate-300">
          Need an account?{' '}
          <Link to="/signup" className="font-medium text-teal-300 hover:text-teal-200">
            Sign up
          </Link>
        </div>

      </GlassCard>
    </div>
  );
}
