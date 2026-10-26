import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'purple' | 'cyan';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-100',
    destructive: 'bg-rose-500/15 text-rose-600 border border-rose-500/30 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
    success: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
    warning: 'bg-amber-500/15 text-amber-700 border border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
    purple: 'bg-purple-500/15 text-purple-700 border border-purple-500/30 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800',
    cyan: 'bg-cyan-500/15 text-cyan-700 border border-cyan-500/30 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800',
    outline: 'text-zinc-950 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
