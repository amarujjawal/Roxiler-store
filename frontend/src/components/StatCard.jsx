import React from 'react';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import GlassCard from './GlassCard';

export default function StatCard({ title, value, icon: Icon, accent = 'teal' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 600;
    const step = Math.max(1, Math.ceil(value / (duration / 16)));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
        return;
      }
      setCount(current);
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <GlassCard className="overflow-hidden p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
          <div className="mt-2 text-3xl font-bold text-white">{count}</div>
        </div>
        <div
          className={[
            'flex h-12 w-12 items-center justify-center rounded-xl border text-white',
            accent === 'purple' ? 'border-violet-400/30 bg-violet-500/20' : 'border-teal-400/30 bg-teal-500/20',
          ].join(' ')}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>vs. last month</span>
        <span className="inline-flex items-center gap-1 text-teal-300">
          +12.4% <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </GlassCard>
  );
}
