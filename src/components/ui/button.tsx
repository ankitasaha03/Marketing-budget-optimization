import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default:
        'bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 active:scale-[0.98]',
      destructive:
        'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-[0.98]',
      outline:
        'border border-zinc-200 bg-transparent hover:bg-zinc-100 text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/80 dark:text-zinc-100 active:scale-[0.98]',
      secondary:
        'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 active:scale-[0.98]',
      ghost:
        'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
      link: 'text-primary underline-offset-4 hover:underline text-indigo-600 dark:text-indigo-400',
      gradient:
        'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:opacity-95 active:scale-[0.98]',
    };

    const sizeStyles = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-11 rounded-md px-8 text-base',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
