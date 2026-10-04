import React from 'react';
export default function GlassCard({ children, className = '', as: Component = 'div' }) {
  return (
    <Component
      className={[
        'rounded-2xl border border-white/10 bg-slate-900/55 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/60 backdrop-blur-xl shadow-glass ring-1 ring-white/5',
        className,
      ].join(' ')}
    >
      {children}
    </Component>
  );
}
