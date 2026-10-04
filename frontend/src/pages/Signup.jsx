import React from 'react';
import { useMemo, useState } from 'react';
import { ArrowRight, Eye, EyeOff, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { emailRegex, validateAddress, validateName, validatePassword } from '../utils/validators';

const initialForm = { name: '', email: '', address: '', password: '' };

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validation = useMemo(() => ({
    name: !form.name ? 'Name is required' : !validateName(form.name) ? 'Name must be 6 to 60 characters' : '',
    email: !form.email ? 'Email is required' : !emailRegex.test(form.email) ? 'Enter a valid email address' : '',
    address: !form.address ? 'Address is required' : !validateAddress(form.address) ? 'Address must be 1 to 400 characters' : '',
    password: !form.password ? 'Password is required' : !validatePassword(form.password) ? 'Use 8–16 chars with one uppercase and one special character' : '',
  }), [form]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    const nextErrors = {
      name: validation.name,
      email: validation.email,
      address: validation.address,
      password: validation.password,
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    try {
      await signup(form);
      navigate('/login', { state: { message: 'Account created. Log in with your email and password.' } });
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || 'Could not create your account');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.22),transparent_30%)]" />
      <GlassCard as="section" className="w-full max-w-xl p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          <ShieldCheck className="h-4 w-4" /> RateIt
        </div>

        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-sm text-slate-300">Join RateIt as a normal user and start exploring stores.</p>
        {submitError && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{submitError}</p>}

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submit} noValidate>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-200">
              <span className="mb-2 inline-flex items-center gap-2"><UserRound className="h-4 w-4" /> Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className={['w-full rounded-xl border bg-slate-900/40 px-3.5 py-3 text-white outline-none placeholder:text-slate-500', errors.name ? 'border-red-400' : 'border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20'].join(' ')}
                placeholder="Your full name"
              />
              {errors.name && <span className="mt-1 block text-xs text-red-300">{errors.name}</span>}
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-200">
              <span className="mb-2 inline-flex items-center gap-2"><UserRound className="h-4 w-4" /> Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className={['w-full rounded-xl border bg-slate-900/40 px-3.5 py-3 text-white outline-none placeholder:text-slate-500', errors.email ? 'border-red-400' : 'border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20'].join(' ')}
                placeholder="you@example.com"
              />
              {errors.email && <span className="mt-1 block text-xs text-red-300">{errors.email}</span>}
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-200">
              <span className="mb-2 inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</span>
              <textarea
                rows={3}
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                className={['w-full rounded-xl border bg-slate-900/40 px-3.5 py-3 text-white outline-none placeholder:text-slate-500', errors.address ? 'border-red-400' : 'border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20'].join(' ')}
                placeholder="Street, city, country"
              />
              {errors.address && <span className="mt-1 block text-xs text-red-300">{errors.address}</span>}
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-200">
              <span className="mb-2 inline-flex items-center gap-2"><UserRound className="h-4 w-4" /> Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className={['w-full rounded-xl border bg-slate-900/40 px-3.5 py-3 text-white outline-none placeholder:text-slate-500', errors.password ? 'border-red-400' : 'border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20'].join(' ')}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="mt-2 rounded-md p-1 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.password && <span className="mt-1 block text-xs text-red-300">{errors.password}</span>}
            </label>
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 px-4 py-3 font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl">
              Create account <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="mt-5 text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-teal-300 hover:text-teal-200">
            Login
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
