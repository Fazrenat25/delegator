'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 text-white bg-slate-800/50 border rounded-lg',
            'backdrop-blur-sm transition-all duration-200',
            'placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
              : 'border-slate-700/50 focus:border-emerald-500 focus:ring-emerald-500/30',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
