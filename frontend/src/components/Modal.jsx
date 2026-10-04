import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;

  const sizeClass = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-md' : 'max-w-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-md">
      <div className={`w-full ${sizeClass} rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
