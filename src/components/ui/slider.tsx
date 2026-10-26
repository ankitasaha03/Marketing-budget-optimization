'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onChange: (val: number) => void;
  className?: string;
  color?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 1000,
  disabled = false,
  onChange,
  className,
  color = '#6366F1',
}: SliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn('relative flex w-full touch-none select-none items-center', className)}>
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="absolute h-full transition-all duration-75"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      {/* Thumb representation */}
      <div
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-zinc-900 shadow-md transition-all dark:border-zinc-900 dark:bg-white"
        style={{
          left: `${percentage}%`,
          borderColor: color,
        }}
      />
    </div>
  );
}
