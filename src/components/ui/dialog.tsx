'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      {/* Modal Card */}
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in zoom-in-95 fade-in duration-200">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 text-left mb-4', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end space-x-2 mt-6', className)} {...props} />;
}
