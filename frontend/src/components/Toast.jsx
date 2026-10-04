import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, visible, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-slate-900/90 px-4 py-3 text-sm text-emerald-200 shadow-glass backdrop-blur-xl">
      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      <span>{message}</span>
      <button type="button" onClick={onClose} className="ml-2 text-slate-300 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
