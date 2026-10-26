'use client';

import * as React from 'react';
import { AttributionModelId, DateRangeId } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Download,
  Check,
} from 'lucide-react';

interface HeaderProps {
  selectedRange: DateRangeId;
  onRangeChange: (range: DateRangeId) => void;
  selectedModel: AttributionModelId;
  onModelChange: (model: AttributionModelId) => void;
  isAiDrawerOpen: boolean;
  onToggleAiDrawer: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onExportReport: () => void;
}

export function Header({
  selectedRange,
  onRangeChange,
  selectedModel,
  onModelChange,
  isAiDrawerOpen,
  onToggleAiDrawer,
  isDarkMode,
  onToggleTheme,
  onExportReport,
}: HeaderProps) {
  const [exported, setExported] = React.useState(false);

  const handleExport = () => {
    setExported(true);
    onExportReport();
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between transition-all">
      {/* Left: Model & Date Controls */}
      <div className="flex items-center space-x-3">
        {/* Attribution Model Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:flex">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            <span>Model:</span>
          </div>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value as AttributionModelId)}
            className="h-8 rounded-lg border border-zinc-200/90 bg-white px-2.5 text-xs font-medium text-zinc-800 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
          >
            <option value="data_driven">AI Data-Driven (Shapley-Markov)</option>
            <option value="last_touch">Last-Touch Attribution</option>
            <option value="first_touch">First-Touch Attribution</option>
            <option value="linear">Linear Multi-Touch</option>
          </select>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:flex">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            <span>Range:</span>
          </div>
          <select
            value={selectedRange}
            onChange={(e) => onRangeChange(e.target.value as DateRangeId)}
            className="h-8 rounded-lg border border-zinc-200/90 bg-white px-2.5 text-xs font-medium text-zinc-800 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
          >
            <option value="30d">Last 30 Days (Jun 2026)</option>
            <option value="q2">Q2 2026 (Apr - Jun)</option>
            <option value="q1">Q1 2026 (Jan - Mar)</option>
            <option value="ytd">Year-to-Date (2026)</option>
          </select>
        </div>
      </div>

      {/* Right: Actions, AI Copilot Toggle, Theme */}
      <div className="flex items-center space-x-2.5">
        {/* Export Report */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="h-8 gap-1.5 text-xs hidden md:inline-flex border-zinc-200 dark:border-zinc-800"
        >
          {exported ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Exported</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>Export MMM Plan</span>
            </>
          )}
        </Button>

        {/* Dark/Light Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          className="h-8 w-8 rounded-lg border-zinc-200 dark:border-zinc-800"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-zinc-600" />
          )}
        </Button>

        {/* AI Copilot Drawer Toggle Button */}
        <Button
          onClick={onToggleAiDrawer}
          className={`relative h-8 px-3.5 rounded-lg text-white shadow-md text-xs font-medium gap-2 transition-all active:scale-[0.98] ${
            isAiDrawerOpen
              ? 'bg-zinc-800 hover:bg-zinc-700 ring-2 ring-indigo-400'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-indigo-500/20'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
          <span>{isAiDrawerOpen ? 'Close Copilot' : 'AI Copilot'}</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </Button>
      </div>
    </header>
  );
}
