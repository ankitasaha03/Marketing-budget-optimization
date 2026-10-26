'use client';

import * as React from 'react';
import { ChannelConfig, ChannelId, SimulationResult } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Lock,
  Unlock,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface BudgetSimulatorProps {
  channels: ChannelConfig[];
  allocations: Record<ChannelId, number>;
  simulation: SimulationResult;
  onAllocationChange: (channelId: ChannelId, value: number) => void;
  onApplyOptimal: () => void;
  onReset: () => void;
  totalBaselineBudget: number;
}

export function BudgetSimulator({
  channels,
  allocations,
  simulation,
  onAllocationChange,
  onApplyOptimal,
  onReset,
  totalBaselineBudget,
}: BudgetSimulatorProps) {
  const [lockedChannels, setLockedChannels] = React.useState<Record<ChannelId, boolean>>({
    google_search: false,
    meta_retargeting: false,
    linkedin_b2b: false,
    tiktok_awareness: false,
    influencer: false,
    email_marketing: false,
  });

  const [appliedOptimalAnimation, setAppliedOptimalAnimation] = React.useState(false);

  const toggleLock = (channelId: ChannelId) => {
    setLockedChannels((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  const handleApplyOptimal = () => {
    onApplyOptimal();
    setAppliedOptimalAnimation(true);

    // Fire celebratory confetti effect
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#10B981', '#EC4899', '#3B82F6'],
      });
    } catch {
      // In case canvas-confetti is not supported in current environment
    }

    setTimeout(() => {
      setAppliedOptimalAnimation(false);
    }, 2500);
  };

  const budgetDelta = simulation.totalSpend - totalBaselineBudget;

  return (
    <Card className="border-indigo-500/20 bg-gradient-to-b from-white via-white to-zinc-50/50 dark:from-zinc-900/90 dark:via-zinc-900/70 dark:to-zinc-950/90 shadow-xl overflow-hidden relative">
      {/* Background glow header effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400">
                <Zap className="h-4 w-4" />
              </span>
              <CardTitle className="text-lg font-bold tracking-tight">
                Interactive &ldquo;What-If&rdquo; Budget Reallocation Simulator
              </CardTitle>
              <Badge variant="cyan" className="text-[10px]">
                Hill Response Modeling
              </Badge>
            </div>
            <CardDescription className="text-xs mt-1">
              Test dynamic budget scenarios across all channels. Our non-linear saturation engine
              calculates real-time diminishing returns and marginal ROAS.
            </CardDescription>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-8 gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Baseline</span>
            </Button>

            <Button
              size="sm"
              onClick={handleApplyOptimal}
              className={`h-8 gap-1.5 text-xs font-semibold shadow-lg transition-all ${
                appliedOptimalAnimation
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-400 ring-offset-2'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-500/25'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
              <span>{appliedOptimalAnimation ? 'Optimal Budget Applied!' : 'Apply AI Optimal Budget'}</span>
            </Button>
          </div>
        </div>

        {/* Real-Time Lift Highlight Banner */}
        <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-400/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>Projected Revenue:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  {formatCurrency(simulation.totalRevenue)}
                </span>
                <span className="text-zinc-400 font-normal">
                  ({simulation.blendedRoas.toFixed(2)}x ROAS)
                </span>
              </div>
              <div className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                {simulation.revenueLift >= 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    +{formatCurrency(simulation.revenueLift)} Lift ({formatPercent(
                      (simulation.revenueLift / (simulation.totalRevenue - simulation.revenueLift)) * 100
                    )})
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    {formatCurrency(simulation.revenueLift)} vs baseline
                  </span>
                )}{' '}
                under {formatCurrency(simulation.totalSpend)} total spend budget
              </div>
            </div>
          </div>

          {/* Budget Pool Tracker */}
          <div className="flex items-center space-x-3 text-right">
            <div className="text-[11px]">
              <div className="text-zinc-400">Total Allocated Spend:</div>
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {formatCurrency(simulation.totalSpend)}{' '}
                <span className="text-xs font-normal text-zinc-400">
                  / {formatCurrency(totalBaselineBudget)}
                </span>
              </div>
            </div>
            {budgetDelta === 0 ? (
              <Badge variant="success" className="text-[10px]">
                Zero-Sum Balanced
              </Badge>
            ) : budgetDelta > 0 ? (
              <Badge variant="warning" className="text-[10px]">
                +{formatCurrency(budgetDelta)} Added
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">
                {formatCurrency(Math.abs(budgetDelta))} Under
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((ch) => {
            const currentAlloc = allocations[ch.id] ?? ch.baseBudget;
            const channelPerf = simulation.channels.find((c) => c.channelId === ch.id);
            const isLocked = lockedChannels[ch.id];
            const spendDeltaPct = ((currentAlloc - ch.baseBudget) / ch.baseBudget) * 100;
            const isSaturated = (channelPerf?.saturationScore ?? 0) >= 75;
            const isHighHeadroom = (channelPerf?.saturationScore ?? 0) <= 45;

            return (
              <div
                key={ch.id}
                className={`rounded-xl border p-4 transition-all duration-150 ${
                  isLocked
                    ? 'border-zinc-300 bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950/40 opacity-80'
                    : 'border-zinc-200/90 bg-white dark:border-zinc-800/90 dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Header row for channel */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">
                      {ch.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Saturation badge */}
                    {isSaturated ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Saturated ({channelPerf?.saturationScore}%)
                      </span>
                    ) : isHighHeadroom ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Headroom ({channelPerf?.saturationScore}%)
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {channelPerf?.saturationScore}% Sat.
                      </span>
                    )}

                    {/* Lock toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleLock(ch.id)}
                      title={isLocked ? 'Unlock channel spend' : 'Lock channel spend during reallocation'}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded cursor-pointer transition-colors"
                    >
                      {isLocked ? (
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Spend value & Delta */}
                <div className="flex items-baseline justify-between my-2">
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(currentAlloc)}
                  </div>
                  <div className="text-xs">
                    {spendDeltaPct === 0 ? (
                      <span className="text-zinc-400 font-medium">Baseline</span>
                    ) : (
                      <span
                        className={`font-semibold ${
                          spendDeltaPct > 0
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {spendDeltaPct > 0 ? `+${spendDeltaPct.toFixed(0)}%` : `${spendDeltaPct.toFixed(0)}%`}
                      </span>
                    )}
                  </div>
                </div>

                {/* The Interactive Slider */}
                <div className="py-2">
                  <Slider
                    value={currentAlloc}
                    min={ch.minBudget}
                    max={ch.maxBudget}
                    step={1000}
                    disabled={isLocked}
                    onChange={(val) => onAllocationChange(ch.id, val)}
                    color={ch.color}
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5">
                    <span>Min: {formatCurrency(ch.minBudget, true)}</span>
                    <span className="font-medium text-zinc-500 dark:text-zinc-400">
                      Base: {formatCurrency(ch.baseBudget, true)}
                    </span>
                    <span>Max: {formatCurrency(ch.maxBudget, true)}</span>
                  </div>
                </div>

                {/* Dynamic Projected Metrics for this channel */}
                <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 grid grid-cols-3 gap-1 text-[11px]">
                  <div>
                    <div className="text-zinc-400 text-[10px]">Proj. Rev</div>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {formatCurrency(channelPerf?.attributableRevenue ?? 0, true)}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px]">ROAS</div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {channelPerf?.roas.toFixed(2)}x
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[10px]">mROAS</div>
                    <div
                      className={`font-semibold ${
                        (channelPerf?.marginalRoas ?? 0) < 1.0
                          ? 'text-rose-500 font-bold'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {channelPerf?.marginalRoas.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
