import React from 'react';
import { ArrowUpRight, Building2, Star, Users2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import { mockStats } from '../data/mockData';

const cards = [
  { title: 'Total Users', value: mockStats.totalUsers, icon: Users2, accent: 'teal' },
  { title: 'Total Stores', value: mockStats.totalStores, icon: Building2, accent: 'purple' },
  { title: 'Total Ratings', value: mockStats.totalRatings, icon: Star, accent: 'teal' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-teal-300">Overview</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/users" className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-200 hover:bg-white/10">
            Manage users
          </Link>
          <Link to="/admin/stores" className="rounded-xl bg-gradient-to-r from-teal-400 to-violet-500 px-3.5 py-2 text-sm font-semibold text-slate-950 shadow-glow hover:-translate-y-0.5">
            Manage stores
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} accent={card.accent} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Performance</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Rating trend</h2>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-xs text-teal-200">
              +12.4% <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-6 flex h-52 items-end gap-3">
            {[32, 48, 60, 55, 76, 94, 88].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-2xl border border-teal-400/10 bg-gradient-to-t from-violet-500/30 via-teal-500/30 to-teal-300/40" style={{ height: `${height}%` }} />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Quick actions</h2>

          <div className="mt-5 space-y-3">
            {[
              'Review new store submissions',
              'Audit recent ratings',
              'Check owner activity',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/20 px-3 py-2.5 text-sm text-slate-200">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
