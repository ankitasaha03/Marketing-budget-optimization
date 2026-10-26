'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimulationResult } from '@/types';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface KpiCardsProps {
  simulation: SimulationResult;
  baselineSpend: number;
  baselineRevenue: number;
}

export function KpiCards({ simulation, baselineSpend, baselineRevenue }: KpiCardsProps) {
  // Sparkline generator helper
  const renderSparkline = (points: number[], color: string) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const height = 28;
    const width = 80;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const spendDelta = ((simulation.totalSpend - baselineSpend) / baselineSpend) * 100;
  const revenueDelta = baselineRevenue > 0 ? ((simulation.totalRevenue - baselineRevenue) / baselineRevenue) * 100 : 0;

  const kpis = [
    {
      id: 'spend',
      title: 'Total Marketing Spend',
      value: formatCurrency(simulation.totalSpend),
      subtext: `Simulated: ${formatCurrency(simulation.totalSpend, true)}`,
      change: spendDelta === 0 ? '+4.2%' : `${formatPercent(spendDelta)} vs base`,
      isPositive: spendDelta <= 0, // Less spend or neutral is good
      sparkline: [210, 225, 240, 245, 250, simulation.totalSpend / 1000],
      color: '#3B82F6',
      icon: DollarSign,
      statusBadge: spendDelta === 0 ? 'On Budget' : spendDelta > 0 ? 'Budget Expanded' : 'Budget Reduced',
      badgeVariant: 'secondary' as const,
    },
    {
      id: 'roas',
      title: 'Blended ROAS',
      value: `${simulation.blendedRoas.toFixed(2)}x`,
      subtext: `Target: >3.0x (mROAS 2.1x)`,
      change: simulation.roasLift >= 0 ? `+${simulation.roasLift}x lift` : `${simulation.roasLift}x`,
      isPositive: simulation.blendedRoas >= 3.0,
      sparkline: [2.81, 2.93, 3.04, 3.12, 3.22, simulation.blendedRoas],
      color: '#10B981',
      icon: TrendingUp,
      statusBadge: simulation.blendedRoas >= 3.2 ? 'Exceptional' : 'Healthy',
      badgeVariant: 'success' as const,
    },
    {
      id: 'cac',
      title: 'Blended CAC',
      value: formatCurrency(simulation.blendedCac),
      subtext: `${formatNumber(simulation.totalConversions)} conversions`,
      change: '-12.4% vs last mo',
      isPositive: true, // Reduced CAC is positive
      sparkline: [168, 159, 152, 147, 144, simulation.blendedCac],
      color: '#8B5CF6',
      icon: Target,
      statusBadge: simulation.blendedCac < 150 ? 'Efficient' : 'Needs Tuning',
      badgeVariant: simulation.blendedCac < 150 ? ('success' as const) : ('warning' as const),
    },
    {
      id: 'ltv_cac',
      title: 'LTV:CAC & Net Revenue',
      value: `${simulation.blendedLtvToCac.toFixed(2)}x`,
      subtext: `Net Rev: ${formatCurrency(simulation.totalRevenue, true)}`,
      change: revenueDelta !== 0 ? `${formatPercent(revenueDelta)} vs base` : `+${formatCurrency(simulation.revenueLift, true)} lift`,
      isPositive: simulation.blendedLtvToCac >= 3.0,
      sparkline: [3.4, 3.7, 3.9, 4.0, 4.15, simulation.blendedLtvToCac],
      color: '#06B6D4',
      icon: Users,
      statusBadge: 'High Profitability',
      badgeVariant: 'cyan' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.id}
            className="relative overflow-hidden border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 hover:shadow-md transition-all duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {kpi.title}
                </span>
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${kpi.color}15`,
                    color: kpi.color,
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {kpi.value}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {kpi.subtext}
                  </div>
                </div>
                <div className="pt-1">
                  {renderSparkline(kpi.sparkline, kpi.color)}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 font-medium">
                  {kpi.isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
                  )}
                  <span
                    className={
                      kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }
                  >
                    {kpi.change}
                  </span>
                </div>
                <Badge variant={kpi.badgeVariant} className="text-[10px] py-0 px-2">
                  {kpi.statusBadge}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
