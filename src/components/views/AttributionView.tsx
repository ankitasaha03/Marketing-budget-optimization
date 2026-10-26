'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ATTRIBUTION_COMPARISON } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { GitBranch, Layers, ArrowRight } from 'lucide-react';

export function AttributionView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-500 text-white">
                <GitBranch className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Multi-Touch & AI Data-Driven Attribution Modeling
              </h2>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              Single-touch models (First-Touch / Last-Touch) systematically miscredit mid-funnel assist channels.
              Our Shapley-Markov game theory model evaluates removal effects across 14,000+ customer touchpoint paths.
            </p>
          </div>
          <Badge variant="cyan" className="py-1 px-3 text-xs shrink-0">
            Shapley-Markov Bayesian Engine
          </Badge>
        </div>
      </div>

      {/* Comparison Chart */}
      <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Cross-Model Attributable Revenue Comparison ($)
              </CardTitle>
              <CardDescription className="text-xs">
                Observe how single-touch models over-credit or under-credit top/bottom funnel channels.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[340px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ATTRIBUTION_COMPARISON}
                margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#888888' }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#888888' }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                  tickLine={false}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => [
                    formatCurrency(typeof val === 'number' ? val : Number(val || 0)),
                    '',
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="firstTouch" name="First-Touch" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="lastTouch" name="Last-Touch" fill="#64748B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="linear" name="Linear Multi-Touch" fill="#06B6D4" radius={[3, 3, 0, 0]} />
                <Bar dataKey="dataDriven" name="AI Data-Driven (Shapley)" fill="#6366F1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Model Definition Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'First-Touch Attribution',
            bias: 'Favors Top of Funnel (Awareness)',
            desc: 'Gives 100% of conversion credit to the very first click or impression. Overstates TikTok and PR.',
            tag: 'Top-Heavy',
            tagVariant: 'warning' as const,
          },
          {
            title: 'Last-Touch Attribution',
            bias: 'Favors Bottom of Funnel (Brand/Direct)',
            desc: 'Gives 100% credit to the last interaction before conversion. Overstates Branded Search & Retargeting.',
            tag: 'Bottom-Heavy',
            tagVariant: 'secondary' as const,
          },
          {
            title: 'Linear Multi-Touch',
            bias: 'Uniform Arbitrary Weighting',
            desc: 'Splits credit equally across all touchpoints in the path regardless of causal impact or time delay.',
            tag: 'Uniform Weight',
            tagVariant: 'outline' as const,
          },
          {
            title: 'AI Data-Driven (Shapley)',
            bias: 'Objective Removal Effect',
            desc: 'Calculates the incremental value generated by each channel when removed from the user journey.',
            tag: 'Recommended (Optimal)',
            tagVariant: 'success' as const,
          },
        ].map((m, idx) => (
          <Card key={idx} className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{m.title}</span>
              <Badge variant={m.tagVariant} className="text-[9px] py-0">
                {m.tag}
              </Badge>
            </div>
            <div className="text-[11px] font-medium text-indigo-500 mb-1">{m.bias}</div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">{m.desc}</p>
          </Card>
        ))}
      </div>

      {/* Customer Journey Flow Example */}
      <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 p-5">
        <div className="flex items-center space-x-2 mb-3">
          <Layers className="h-4 w-4 text-indigo-500" />
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            Real Customer Path Attribution Discrepancy Case Study
          </h3>
        </div>
        <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/60">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium mb-3">
            <span className="px-2.5 py-1 rounded-lg bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/20">
              1. TikTok Ad (Day 0)
            </span>
            <ArrowRight className="h-3 w-3 text-zinc-400" />
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              2. LinkedIn Whitepaper (Day 4)
            </span>
            <ArrowRight className="h-3 w-3 text-zinc-400" />
            <span className="px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              3. Meta Retargeting (Day 9)
            </span>
            <ArrowRight className="h-3 w-3 text-zinc-400" />
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              4. Google Brand Search (Day 12)
            </span>
            <ArrowRight className="h-3 w-3 text-emerald-500 font-bold" />
            <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold shadow-sm">
              $1,200 Annual Subscription
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3 pt-3 border-t border-zinc-200/70 dark:border-zinc-800/70">
            <div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                Last-Touch Flaw:
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px]">
                Last-Touch awards 100% ($1,200) to Google Brand Search, encouraging management to spend more on branded search keywords that the prospect would have typed anyway.
              </p>
            </div>
            <div>
              <span className="font-semibold text-indigo-500 block mb-1">
                AI Data-Driven (Shapley) Solution:
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px]">
                Markov removal calculates that without the LinkedIn Whitepaper (Day 4), the probability of conversion drops by 68%. Credit is properly distributed: LinkedIn 42%, Meta 28%, Google 18%, TikTok 12%.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
