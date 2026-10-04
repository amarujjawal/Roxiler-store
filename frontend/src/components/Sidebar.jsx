import React from 'react';
import { LogOut, ShieldCheck, Store, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navMap = {
  ADMIN: [
    { label: 'Dashboard', to: '/admin', icon: ShieldCheck },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Stores', to: '/admin/stores', icon: Store },
  ],
};

export default function Sidebar({ children }) {
  const { user, logout } = useAuth();

  const items = navMap[user?.role] ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.10),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.14),transparent_22%),rgba(2,8,23,0.88)] lg:flex-row">
      <aside className="w-full border-b border-white/10 bg-slate-950/60 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:w-72 lg:border-b-0 lg:border-r">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-teal-300">RateIt</div>
            <div className="mt-1 text-lg font-semibold text-white">Admin Panel</div>
          </div>
        </div>

        <nav className="space-y-2">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                  isActive ? 'bg-teal-500/15 text-white ring-1 ring-teal-400/30' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
          <div className="text-slate-400">Signed in</div>
          <div className="mt-1 font-medium text-white">{user?.name}</div>
          <div className="mt-2 inline-flex rounded-full bg-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-200">
            {user?.role}
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-transparent p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
