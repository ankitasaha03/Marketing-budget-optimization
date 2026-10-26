import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorColor?: string;
}

export function Progress({
  value,
  className,
  indicatorColor,
  ...props
}: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800',
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 transition-all duration-300"
        style={{
          transform: `translateX(-${100 - safeValue}%)`,
          backgroundColor: indicatorColor || 'rgb(99, 102, 241)',
        }}
      />
    </div>
  );
}
