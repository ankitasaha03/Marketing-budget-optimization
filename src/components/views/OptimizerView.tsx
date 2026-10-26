'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INITIAL_CHANNELS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import {
  SlidersHorizontal,
  Cpu,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export function OptimizerView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-cyan-500/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-purple-500 text-white">
                <SlidersHorizontal className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Marketing Mix Modeling (MMM) Hill Parameters & Elasticity
              </h2>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              Our continuous optimization algorithm uses the non-linear Hill saturation function:
              <code className="mx-1 px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-300 font-mono text-[11px]">
                Revenue = Vmax × (Spend^γ) / (K^γ + Spend^γ)
              </code>
              to compute exact marginal returns and eliminate wasteful over-bidding.
            </p>
          </div>
          <Badge variant="purple" className="py-1 px-3 text-xs shrink-0">
            Bayesian Prior Calibrated
          </Badge>
        </div>
      </div>

      {/* Hill Parameters Table */}
      <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Calibrated Channel Hill Curve Parameters
          </CardTitle>
          <CardDescription className="text-xs">
            Model parameters derived from 18 months of historical marketing spend regressions and lift tests.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-950/40 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <th className="py-2.5 px-4">Channel</th>
                  <th className="py-2.5 px-3">Baseline Spend</th>
                  <th className="py-2.5 px-3">Max Cap (Vmax)</th>
                  <th className="py-2.5 px-3">Half-Sat (K)</th>
                  <th className="py-2.5 px-3">Hill Gamma (γ)</th>
                  <th className="py-2.5 px-3">Current Saturation</th>
                  <th className="py-2.5 px-3">Marginal ROAS (mROAS)</th>
                  <th className="py-2.5 px-4">Elasticity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {INITIAL_CHANNELS.map((ch) => {
                  const isSaturated = ch.currentSaturation >= 75;
                  const isHeadroom = ch.currentSaturation <= 45;

                  return (
                    <tr key={ch.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: ch.color }}
                          />
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {ch.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-zinc-800 dark:text-zinc-200">
                        {formatCurrency(ch.baseBudget)}
                      </td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-300">
                        {formatCurrency(ch.vMax)}
                      </td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-300">
                        {formatCurrency(ch.kHalf)}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                        {ch.gamma.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-1.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${ch.currentSaturation}%`,
                                backgroundColor: isSaturated ? '#EF4444' : isHeadroom ? '#10B981' : '#6366F1',
                              }}
                            />
                          </div>
                          <span className="font-semibold text-[11px] text-zinc-700 dark:text-zinc-300">
                            {ch.currentSaturation}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold ${
                            ch.marginalRoas < 1.0
                              ? 'text-rose-500'
                              : ch.marginalRoas > 3.0
                              ? 'text-emerald-500'
                              : 'text-zinc-800 dark:text-zinc-200'
                          }`}
                        >
                          {ch.marginalRoas.toFixed(2)}x
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isSaturated ? (
                          <Badge variant="destructive" className="text-[10px]">
                            Diminishing Return Hit
                          </Badge>
                        ) : isHeadroom ? (
                          <Badge variant="success" className="text-[10px]">
                            High Expansion Yield
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Efficient Elasticity
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Rules & Solvers Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 p-5">
          <div className="flex items-center space-x-2 text-indigo-500 font-semibold text-xs mb-2">
            <Zap className="h-4 w-4" />
            <span>KKT Optimality Condition</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Budget is mathematically optimized when the marginal return (mROAS) of all unconstrained channels is equalized:
            <code className="block mt-1 p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-800 dark:text-zinc-200">
              ∂Rev₁/∂S₁ = ∂Rev₂/∂S₂ = ... = λ
            </code>
          </p>
        </Card>

        <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 p-5">
          <div className="flex items-center space-x-2 text-emerald-500 font-semibold text-xs mb-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Adstock Decay Modeling</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Our MMM incorporates geometric adstock memory decay:
            <code className="block mt-1 p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-800 dark:text-zinc-200">
              Adstock_t = Spend_t + λ × Adstock_{`t-1`}
            </code>
            Accounting for brand awareness persistence after ad campaigns stop.
          </p>
        </Card>

        <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 p-5">
          <div className="flex items-center space-x-2 text-purple-500 font-semibold text-xs mb-2">
            <Cpu className="h-4 w-4" />
            <span>Incrementality Lift Testing</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Continuous synthetic geo-experiments ensure our saturation parameters don&apos;t rely on observational correlation alone.
          </p>
        </Card>
      </div>
    </div>
  );
}
