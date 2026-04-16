'use client';

import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 text-white bg-slate-800/50 border rounded-lg',
            'backdrop-blur-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
            'cursor-pointer',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
              : 'border-slate-700/50 focus:border-amber-500 focus:ring-amber-500/30',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-800 text-white">
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
