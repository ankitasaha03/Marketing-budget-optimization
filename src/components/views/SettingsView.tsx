'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Settings2,
  CheckCircle2,
  Sliders,
  Zap,
  RefreshCw,
} from 'lucide-react';

export function SettingsView() {
  const [autoPause, setAutoPause] = React.useState(true);
  const [saturationCap, setSaturationCap] = React.useState(true);
  const [weeklyShift, setWeeklyShift] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const adNetworks = [
    { name: 'Google Ads (Search & PMax)', status: 'Connected', syncTime: '12m ago', active: true },
    { name: 'Meta Marketing API (Facebook & IG)', status: 'Connected', syncTime: '18m ago', active: true },
    { name: 'LinkedIn Marketing Solutions', status: 'Connected', syncTime: '45m ago', active: true },
    { name: 'TikTok Ads API', status: 'Connected', syncTime: '1h ago', active: true },
    { name: 'Customer.io / Klaviyo Lifecycle', status: 'Connected', syncTime: '5m ago', active: true },
    { name: 'Segment / Snowplow CDP', status: 'Connected', syncTime: '2m ago', active: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-zinc-800 text-white">
                <Settings2 className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Engine Settings & Automated Optimization Rules
              </h2>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              Configure attribution lookback windows, automated campaign throttle triggers, target KPI bounds,
              and ad network API credentials.
            </p>
          </div>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
            {savedSuccess ? '✓ Settings Saved' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* KPI Guardrails */}
        <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-indigo-500" />
              <CardTitle className="text-base font-semibold">
                Portfolio KPI Guardrails
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Establish minimum acceptable profitability thresholds for the budget optimizer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Minimum Portfolio ROAS Floor
                </div>
                <div className="text-[11px] text-zinc-500">Alert if blended ROAS dips below this</div>
              </div>
              <input
                type="text"
                defaultValue="2.80x"
                className="h-8 w-20 rounded-lg border border-zinc-200 px-2 text-center font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Target CAC Ceiling
                </div>
                <div className="text-[11px] text-zinc-500">Maximum allowable blended customer acquisition cost</div>
              </div>
              <input
                type="text"
                defaultValue="$160"
                className="h-8 w-20 rounded-lg border border-zinc-200 px-2 text-center font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Attribution Lookback Window
                </div>
                <div className="text-[11px] text-zinc-500">Touchpoint event history window</div>
              </div>
              <select className="h-8 rounded-lg border border-zinc-200 px-2 text-xs font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer">
                <option>30-Day Click / 1-Day View</option>
                <option>7-Day Click / 1-Day View</option>
                <option>60-Day Extended B2B Window</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Automated Rules */}
        <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-base font-semibold">
                Autonomous Safeguard Rules
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Actions the engine can execute automatically or send for 1-click Slack approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Auto-Throttle Bleeding Campaigns
                </div>
                <div className="text-[11px] text-zinc-500">
                  Reduce budget by 30% if CAC &gt; $220 for 7 consecutive days
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoPause}
                onChange={(e) => setAutoPause(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Saturation Cap Notification
                </div>
                <div className="text-[11px] text-zinc-500">
                  Alert in Slack when channel saturation exceeds 75%
                </div>
              </div>
              <input
                type="checkbox"
                checked={saturationCap}
                onChange={(e) => setSaturationCap(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Weekly Continuous Rebalance
                </div>
                <div className="text-[11px] text-zinc-500">
                  Automatically reallocate up to $2,500/week to highest mROAS channel
                </div>
              </div>
              <input
                type="checkbox"
                checked={weeklyShift}
                onChange={(e) => setWeeklyShift(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Ad Networks Table */}
      <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Connected Marketing APIs & Data Pipelines
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time spend and conversion event ingestion connectors.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
              <RefreshCw className="h-3 w-3" />
              <span>Sync All Data</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-950/40 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <th className="py-2.5 px-4">Integration Name</th>
                  <th className="py-2.5 px-3">Connection Status</th>
                  <th className="py-2.5 px-3">Last Sync</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {adNetworks.map((net, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      {net.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {net.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-500 dark:text-zinc-400">
                      {net.syncTime}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-[11px] text-zinc-500">
                        Configure
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
