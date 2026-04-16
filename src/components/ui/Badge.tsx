import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600 backdrop-blur-sm',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30 backdrop-blur-sm',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30 backdrop-blur-sm',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 backdrop-blur-sm',
    premium: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-700 shadow-lg shadow-emerald-500/25',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
