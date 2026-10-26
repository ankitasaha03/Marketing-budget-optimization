'use client';

import * as React from 'react';
import { ViewTab } from '@/types';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  GitBranch,
  SlidersHorizontal,
  Users,
  Settings2,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewTab;
  onSelectView: (view: ViewTab) => void;
  bleedingCount: number;
}

export function Sidebar({ currentView, onSelectView, bleedingCount }: SidebarProps) {
  const navItems = [
    {
      id: 'dashboard' as ViewTab,
      label: 'Executive Dashboard',
      description: 'KPIs, Simulator & Matrix',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'attribution' as ViewTab,
      label: 'Campaign Attribution',
      description: 'Multi-touch & Shapley MMM',
      icon: GitBranch,
      badge: '4 Models',
    },
    {
      id: 'optimizer' as ViewTab,
      label: 'Budget Optimizer',
      description: 'Hill Curves & Saturation',
      icon: SlidersHorizontal,
      badge: 'AI Active',
    },
    {
      id: 'ltv' as ViewTab,
      label: 'Customer LTV Analysis',
      description: 'CAC Payback & Cohorts',
      icon: Users,
      badge: null,
    },
    {
      id: 'settings' as ViewTab,
      label: 'Engine Settings',
      description: 'Rules, Bidding & APIs',
      icon: Settings2,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-950/90 flex flex-col shrink-0 min-h-screen transition-all select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-white">
                OptiScale
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400 border border-indigo-500/20">
                MMM
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              Budget Intelligence AI
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 group cursor-pointer',
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm dark:bg-zinc-800/90 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/60'
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive
                      ? 'text-indigo-400'
                      : 'text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-200'
                  )}
                />
                <div>
                  <div className="text-xs font-medium leading-none">{item.label}</div>
                  <div
                    className={cn(
                      'text-[10px] mt-1',
                      isActive ? 'text-zinc-300' : 'text-zinc-400 dark:text-zinc-500'
                    )}
                  >
                    {item.description}
                  </div>
                </div>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded font-medium',
                    isActive
                      ? 'bg-indigo-500/30 text-indigo-200'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Live Channel Health Alert */}
        <div className="pt-6 px-1">
          <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase flex items-center justify-between">
            <span>Portfolio Health</span>
            {bleedingCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                <ShieldAlert className="h-3 w-3" />
                {bleedingCount} Alerts
              </span>
            )}
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white/60 p-3 dark:border-zinc-800/70 dark:bg-zinc-900/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Diminishing Waste:</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">-$24,000/mo</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Reallocation Lift:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">+$118,400</span>
            </div>
            <div className="pt-1 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Shapley MMM engine</span>
              <span className="flex items-center text-emerald-500 gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3" />
                Calibrated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-zinc-200/70 dark:border-zinc-800/70">
        <div className="rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 p-3">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Continuous MMM</span>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
            Real-time Bayesian attribution with 99.4% statistical confidence.
          </p>
        </div>
      </div>
    </aside>
  );
}
