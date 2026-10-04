import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, interactive = false, onChange, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;

        return (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            className={[
              'rounded-md p-0.5 transition-transform',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
            ].join(' ')}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={[
                sizeClass,
                filled ? 'fill-teal-400 text-teal-400' : 'text-slate-500',
              ].join(' ')}
            />
          </button>
        );
      })}
    </div>
  );
}
