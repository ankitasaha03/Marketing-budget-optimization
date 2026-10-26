'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { COHORT_LTV_DATA } from '@/lib/mock-data';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Users, AlertTriangle } from 'lucide-react';

export function LtvAnalysisView() {
  const paybackChartData = COHORT_LTV_DATA.map((d) => ({
    name: d.channel.split(' ')[0],
    fullName: d.channel,
    paybackMonths: d.paybackMonths,
    cac: d.cac,
    m12Ltv: d.m12,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-indigo-500/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-500 text-white">
                <Users className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Customer Lifetime Value (LTV) & CAC Payback Velocity
              </h2>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              Evaluating marketing channels purely on immediate conversion cost creates blind spots.
              This cohort model tracks true retention, gross margin contribution, and capital recovery cycles.
            </p>
          </div>
          <Badge variant="cyan" className="py-1 px-3 text-xs shrink-0">
            24-Month Cohort Data
          </Badge>
        </div>
      </div>

      {/* Payback Period Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card className="lg:col-span-7 border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Months to Recover CAC (Payback Period)
                </CardTitle>
                <CardDescription className="text-xs">
                  SaaS benchmark: Under 12 months is healthy. Less than 3 months is extraordinary.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Target: &lt; 6.0 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={paybackChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: '#888888' }}
                    unit=" mo"
                    domain={[0, 16]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#888888' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(val: any) => [`${val} Months`, 'Payback Period']}
                  />
                  <Bar
                    dataKey="paybackMonths"
                    name="Payback Period (Months)"
                    fill="#06B6D4"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis callout card */}
        <Card className="lg:col-span-5 border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-500 font-semibold text-xs mb-3">
              <AlertTriangle className="h-4 w-4" />
              <span>Capital Risk Alert: TikTok Payback Horizon</span>
            </div>
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                <strong>TikTok Awareness</strong> requires{' '}
                <span className="font-bold text-rose-500">14.5 months</span> to recover its $245 customer acquisition cost due to high Month-3 churn.
              </p>
              <p>
                In contrast, <strong>Email Lifecycle</strong> recoups its spend in{' '}
                <span className="font-bold text-emerald-500">9 days (0.3 months)</span>, and <strong>Google Search</strong> repays within 1.8 months.
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px]">
                <strong>Executive Takeaway:</strong> Capital deployed into TikTok ties up marketing working capital for over a year. Shifting $15k from TikTok to Email and Google immediately accelerates enterprise cash flow.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cohort Expansion Table */}
      <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Cohort Cumulative LTV Progression by Acquisition Channel
          </CardTitle>
          <CardDescription className="text-xs">
            Cumulative gross revenue generated per acquired customer across 24 months.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-950/40 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <th className="py-2.5 px-4">Channel</th>
                  <th className="py-2.5 px-3">CAC</th>
                  <th className="py-2.5 px-3">Month 1</th>
                  <th className="py-2.5 px-3">Month 3</th>
                  <th className="py-2.5 px-3">Month 6</th>
                  <th className="py-2.5 px-3">Month 12</th>
                  <th className="py-2.5 px-3">Month 24</th>
                  <th className="py-2.5 px-4">LTV:CAC Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {COHORT_LTV_DATA.map((row, idx) => {
                  const ratio = Number((row.m24 / row.cac).toFixed(2));
                  const isHealthy = ratio >= 3.0;

                  return (
                    <tr key={idx} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        {row.channel}
                      </td>
                      <td className="py-3 px-3 text-zinc-700 dark:text-zinc-300 font-medium">
                        ${row.cac}
                      </td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">${row.m1}</td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">${row.m3}</td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">${row.m6}</td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">${row.m12}</td>
                      <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-100">${row.m24}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={isHealthy ? 'success' : 'destructive'}
                          className="text-[10px]"
                        >
                          {ratio}x LTV:CAC ({isHealthy ? 'Strong' : 'Weak'})
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
