'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: cn(
    'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
    'hover:from-emerald-400 hover:to-teal-500 active:from-emerald-600 active:to-teal-700',
    'shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30',
    'focus-visible:shadow-[0_0_0_2px_var(--bg-base),0_0_0_4px_var(--accent)]',
    'hover:scale-[1.02] active:scale-[0.98]'
  ),
  secondary: cn(
    'bg-[var(--bg-elevated)] text-[var(--text-primary)]',
    'border border-[var(--border-default)]',
    'hover:bg-[var(--bg-muted)] hover:border-[var(--border-strong)]',
    'active:bg-[var(--bg-muted)]'
  ),
  outline: cn(
    'bg-transparent text-[var(--text-primary)]',
    'border border-[var(--border-default)]',
    'hover:bg-[var(--bg-surface)] hover:border-emerald-500/30',
    'active:bg-[var(--bg-muted)]'
  ),
  ghost: cn(
    'bg-transparent text-[var(--text-primary)]',
    'hover:bg-[var(--bg-surface)]',
    'active:bg-[var(--bg-muted)]'
  ),
  destructive: cn(
    'bg-[var(--error)] text-white',
    'hover:brightness-110',
    'shadow-[var(--shadow-error)]'
  ),
};

const sizeStyles = {
  xs: 'px-2.5 py-1.5 text-xs gap-1.5',
  sm: 'px-3 py-2 text-sm gap-2',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
