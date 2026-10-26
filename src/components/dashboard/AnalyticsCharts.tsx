'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChannelConfig, SimulationResult } from '@/types';
import { generateSaturationCurve } from '@/lib/optimizer';
import { formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import { BarChart3, ScatterChart as ScatterIcon, Activity, AlertCircle } from 'lucide-react';

interface AnalyticsChartsProps {
  channels: ChannelConfig[];
  simulation: SimulationResult;
}

export function AnalyticsCharts({ channels, simulation }: AnalyticsChartsProps) {
  const [selectedSaturationChannel, setSelectedSaturationChannel] = React.useState<string>(
    'tiktok_awareness'
  );

  // 1. Spend vs Revenue & LTV data
  const spendVsRevData = simulation.channels.map((ch) => ({
    name: ch.name.split(' ')[0], // short name
    fullName: ch.name,
    spend: ch.spend,
    revenue: ch.attributableRevenue,
    ltvTotal: Math.round(ch.conversions * ch.ltv),
    roas: ch.roas,
    color: ch.color,
  }));

  // 2. Efficiency Matrix data (CAC vs LTV)
  const efficiencyMatrixData = simulation.channels.map((ch) => ({
    name: ch.name,
    cac: ch.cac,
    ltv: ch.ltv,
    spend: ch.spend,
    ratio: ch.ltvToCac,
    conversions: ch.conversions,
    color: ch.color,
  }));

  // 3. Saturation Curve data for chosen channel
  const activeChannelConfig =
    channels.find((c) => c.id === selectedSaturationChannel) || channels[0];
  const saturationCurvePoints = React.useMemo(() => {
    return generateSaturationCurve(activeChannelConfig);
  }, [activeChannelConfig]);

  const currentSpendForActive =
    simulation.channels.find((c) => c.channelId === activeChannelConfig.id)?.spend ||
    activeChannelConfig.baseBudget;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 1. Spend vs. Attributable Revenue (7 cols on large screens) */}
      <Card className="lg:col-span-7 border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-blue-500/10 text-blue-500">
                <BarChart3 className="h-4 w-4" />
              </span>
              <CardTitle className="text-base font-semibold">
                Spend vs. Attributable Revenue & LTV
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Shapley Multi-Touch
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Direct comparison of monthly channel spend vs. attributable revenue and total pipeline LTV.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={spendVsRevData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#888888' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#888888' }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-zinc-200 bg-white/95 p-2.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/95 text-xs">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                            {data.fullName}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4 text-zinc-500 dark:text-zinc-400">
                              <span>Monthly Spend:</span>
                              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                {formatCurrency(data.spend)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4 text-indigo-500 font-semibold">
                              <span>Attributable Revenue:</span>
                              <span>{formatCurrency(data.revenue)}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-emerald-500">
                              <span>Pipeline LTV Value:</span>
                              <span className="font-semibold">{formatCurrency(data.ltvTotal)}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-zinc-400 pt-1 border-t border-zinc-200 dark:border-zinc-800">
                              <span>ROAS:</span>
                              <span className="font-bold">{data.roas}x</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                  iconType="circle"
                />
                <Bar
                  dataKey="spend"
                  name="Monthly Spend"
                  fill="#64748B"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="revenue"
                  name="Attributable Revenue"
                  fill="#6366F1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
                <Line
                  type="monotone"
                  dataKey="ltvTotal"
                  name="Total LTV Created"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10B981' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Efficiency Matrix Scatter / Bubble Plot (5 cols on large screens) */}
      <Card className="lg:col-span-5 border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-purple-500/10 text-purple-500">
                <ScatterIcon className="h-4 w-4" />
              </span>
              <CardTitle className="text-base font-semibold">
                Efficiency Matrix (CAC vs. LTV)
              </CardTitle>
            </div>
            <Badge variant="purple" className="text-[10px]">
              Bubble = Spend
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Identify high-burn channels (High CAC, Low LTV) vs. scale-up opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full pt-1 relative">
            {/* Visual quadrant watermark tags */}
            <div className="absolute top-4 left-10 text-[9px] font-semibold text-emerald-500/70 tracking-wider uppercase pointer-events-none">
              ★ Scale Up (High LTV / Low CAC)
            </div>
            <div className="absolute top-4 right-4 text-[9px] font-semibold text-cyan-500/70 tracking-wider uppercase pointer-events-none">
              Enterprise (High ACV)
            </div>
            <div className="absolute bottom-10 right-4 text-[9px] font-semibold text-rose-500/70 tracking-wider uppercase pointer-events-none">
              ⚠ High Burn / Bleeding
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  type="number"
                  dataKey="cac"
                  name="CAC"
                  unit="$"
                  domain={[0, 350]}
                  tick={{ fontSize: 10, fill: '#888888' }}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="ltv"
                  name="LTV"
                  unit="$"
                  domain={[0, 1800]}
                  tick={{ fontSize: 10, fill: '#888888' }}
                  tickFormatter={(val) => `$${val}`}
                  tickLine={false}
                />
                <ZAxis type="number" dataKey="spend" range={[90, 480]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-zinc-200 bg-white/95 p-2.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/95 text-xs">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            {data.name}
                          </div>
                          <div className="space-y-1 text-zinc-500 dark:text-zinc-400">
                            <div>CAC: <span className="font-semibold text-zinc-800 dark:text-zinc-200">${data.cac}</span></div>
                            <div>LTV: <span className="font-semibold text-zinc-800 dark:text-zinc-200">${data.ltv}</span></div>
                            <div>LTV:CAC Ratio: <span className="font-bold text-emerald-500">{data.ratio}x</span></div>
                            <div>Simulated Spend: <span className="font-medium text-zinc-700 dark:text-zinc-300">{formatCurrency(data.spend)}</span></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Quadrant split lines */}
                <ReferenceLine x={180} stroke="#ef4444" strokeDasharray="3 3" opacity={0.4} />
                <ReferenceLine y={600} stroke="#10b981" strokeDasharray="3 3" opacity={0.4} />
                <Scatter data={efficiencyMatrixData} fill="#6366F1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Marginal ROAS / Diminishing Returns Curve (Full Width 12 cols) */}
      <Card className="lg:col-span-12 border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-500">
                <Activity className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base font-semibold">
                  Channel Saturation & Marginal ROAS (Diminishing Returns)
                </CardTitle>
                <CardDescription className="text-xs">
                  Inspect the non-linear inflection point where additional marketing spend stops producing profitable return.
                </CardDescription>
              </div>
            </div>

            {/* Channel Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-400 font-medium">Channel:</span>
              <select
                value={selectedSaturationChannel}
                onChange={(e) => setSelectedSaturationChannel(e.target.value)}
                className="h-8 rounded-lg border border-zinc-200/90 bg-white px-2.5 text-xs font-medium text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
              >
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            {/* Chart Area */}
            <div className="lg:col-span-3 h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={saturationCurvePoints}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeChannelConfig.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={activeChannelConfig.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="spend"
                    tick={{ fontSize: 10, fill: '#888888' }}
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#888888' }}
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-zinc-200 bg-white/95 p-2.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/95 text-xs">
                            <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                              Spend: {formatCurrency(data.spend)}
                            </div>
                            <div className="text-indigo-500 font-bold mt-1">
                              Projected Revenue: {formatCurrency(data.revenue)}
                            </div>
                            <div className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                              Marginal ROAS (dRev/dSpend):{' '}
                              <span
                                className={`font-semibold ${
                                  data.marginalRoas < 1.0 ? 'text-rose-500' : 'text-emerald-500'
                                }`}
                              >
                                {data.marginalRoas}x
                              </span>
                            </div>
                            <div className="text-zinc-400 text-[10px]">
                              Saturation Level: {data.saturation}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    x={currentSpendForActive}
                    stroke="#F59E0B"
                    strokeWidth={2}
                    label={{
                      value: `Current Spend: ${formatCurrency(currentSpendForActive, true)}`,
                      position: 'top',
                      fill: '#F59E0B',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Projected Revenue"
                    stroke={activeChannelConfig.color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Channel Saturation Diagnostic Callout */}
            <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/80 text-xs space-y-3">
              <div className="flex items-center space-x-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>MMM Channel Diagnostic</span>
              </div>
              <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-200">{activeChannelConfig.name}</strong>{' '}
                  is currently operating at{' '}
                  <span className="font-semibold text-indigo-500">
                    {activeChannelConfig.currentSaturation}% saturation
                  </span>.
                </div>
                <div>
                  Marginal ROAS is{' '}
                  <span
                    className={`font-bold ${
                      activeChannelConfig.marginalRoas < 1.0
                        ? 'text-rose-500'
                        : 'text-emerald-500'
                    }`}
                  >
                    {activeChannelConfig.marginalRoas}x
                  </span>
                  .
                  {activeChannelConfig.marginalRoas < 1.0 ? (
                    <span className="text-rose-500 block mt-1">
                      ⚠️ Saturated: Every additional $1,000 spent returns only $
                      {Math.round(activeChannelConfig.marginalRoas * 1000)}. Reallocate to higher-yield channels.
                    </span>
                  ) : (
                    <span className="text-emerald-500 block mt-1">
                      ✓ Profitable headroom: Scaling this channel generates positive marginal profit.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
