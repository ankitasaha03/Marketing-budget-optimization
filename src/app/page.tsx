'use client';

import * as React from 'react';
import {
  ChannelConfig,
  ChannelId,
  Campaign,
  AttributionModelId,
  DateRangeId,
  ViewTab,
} from '@/types';
import { INITIAL_CHANNELS, CAMPAIGNS_DATA } from '@/lib/mock-data';
import { runSimulation, findOptimalAllocation } from '@/lib/optimizer';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { BudgetSimulator } from '@/components/dashboard/BudgetSimulator';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { AiCopilotChat } from '@/components/chat/AiCopilotChat';
import { AttributionView } from '@/components/views/AttributionView';
import { OptimizerView } from '@/components/views/OptimizerView';
import { LtvAnalysisView } from '@/components/views/LtvAnalysisView';
import { SettingsView } from '@/components/views/SettingsView';
import confetti from 'canvas-confetti';

export default function Home() {
  const [currentView, setCurrentView] = React.useState<ViewTab>('dashboard');
  const [selectedModel, setSelectedModel] = React.useState<AttributionModelId>('data_driven');
  const [selectedRange, setSelectedRange] = React.useState<DateRangeId>('30d');
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = React.useState(false);

  // Channels state
  const [channels] = React.useState<ChannelConfig[]>(INITIAL_CHANNELS);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(CAMPAIGNS_DATA);

  // Total baseline budget
  const totalBaselineBudget = React.useMemo(() => {
    return channels.reduce((sum, ch) => sum + ch.baseBudget, 0);
  }, [channels]);

  // Current simulated allocations
  const [allocations, setAllocations] = React.useState<Record<ChannelId, number>>(() => {
    const initial: Record<ChannelId, number> = {} as Record<ChannelId, number>;
    channels.forEach((ch) => {
      initial[ch.id] = ch.baseBudget;
    });
    return initial;
  });

  // Calculate baseline revenue for comparisons
  const baselineRevenue = React.useMemo(() => {
    const baseAlloc: Record<ChannelId, number> = {} as Record<ChannelId, number>;
    channels.forEach((ch) => {
      baseAlloc[ch.id] = ch.baseBudget;
    });
    const baselineSim = runSimulation(channels, baseAlloc, 0, totalBaselineBudget);
    return baselineSim.totalRevenue;
  }, [channels, totalBaselineBudget]);

  // Real-time dynamic simulation run
  const simulation = React.useMemo(() => {
    return runSimulation(channels, allocations, baselineRevenue, totalBaselineBudget);
  }, [channels, allocations, baselineRevenue, totalBaselineBudget]);

  // Sync dark mode class on HTML document
  React.useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDarkMode]);

  // Handle single channel budget slider change
  const handleAllocationChange = (channelId: ChannelId, value: number) => {
    setAllocations((prev) => ({
      ...prev,
      [channelId]: value,
    }));
  };

  // One-click AI optimal allocation button
  const handleApplyOptimal = () => {
    const optimalAllocations = findOptimalAllocation(channels, totalBaselineBudget);
    setAllocations(optimalAllocations);
  };

  // Reset sliders to baseline
  const handleResetAllocations = () => {
    const reset: Record<ChannelId, number> = {} as Record<ChannelId, number>;
    channels.forEach((ch) => {
      reset[ch.id] = ch.baseBudget;
    });
    setAllocations(reset);
  };

  // Apply action from Campaign table
  const handleApplyCampaignAction = (campaign: Campaign) => {
    const { type, amount, targetChannel } = campaign.suggestedAction;

    setAllocations((prev) => {
      const updated = { ...prev };
      if (type === 'cut' && amount) {
        updated[campaign.channelId] = Math.max(
          10000,
          (updated[campaign.channelId] || 30000) - amount
        );
        if (targetChannel) {
          updated[targetChannel] = (updated[targetChannel] || 30000) + amount;
        }
      } else if (type === 'scale' && amount) {
        updated[campaign.channelId] = (updated[campaign.channelId] || 30000) + amount;
      } else if (type === 'pause' && amount) {
        updated[campaign.channelId] = Math.max(5000, (updated[campaign.channelId] || 30000) - amount);
        updated['google_search'] = (updated['google_search'] || 70000) + amount;
      }
      return updated;
    });

    // Mark campaign as optimized
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: 'Optimized' } : c))
    );
  };

  // Handle AI Chat recommendation shift
  const handleApplyChatAction = (shiftFrom: ChannelId, shiftTo: ChannelId, amount: number) => {
    setAllocations((prev) => {
      const fromCurrent = prev[shiftFrom] ?? 40000;
      const toCurrent = prev[shiftTo] ?? 40000;
      const actualShift = Math.min(amount, fromCurrent - 5000);

      return {
        ...prev,
        [shiftFrom]: fromCurrent - actualShift,
        [shiftTo]: toCurrent + actualShift,
      };
    });

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  // Export report handler
  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      attributionModel: selectedModel,
      dateRange: selectedRange,
      totalSpend: simulation.totalSpend,
      projectedRevenue: simulation.totalRevenue,
      blendedRoas: simulation.blendedRoas,
      blendedCac: simulation.blendedCac,
      revenueLift: simulation.revenueLift,
      channelAllocations: allocations,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OptiScale-MMM-Optimization-Plan-${selectedRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bleedingCount = campaigns.filter((c) => c.status === 'Bleeding').length;

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 transition-colors dark:bg-zinc-950 light:bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        bleedingCount={bleedingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          isAiDrawerOpen={isAiDrawerOpen}
          onToggleAiDrawer={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onExportReport={handleExportReport}
        />

        {/* View Content */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Executive KPI Cards */}
              <KpiCards
                simulation={simulation}
                baselineSpend={totalBaselineBudget}
                baselineRevenue={baselineRevenue}
              />

              {/* Hero "What-If" Budget Reallocation Simulator */}
              <BudgetSimulator
                channels={channels}
                allocations={allocations}
                simulation={simulation}
                onAllocationChange={handleAllocationChange}
                onApplyOptimal={handleApplyOptimal}
                onReset={handleResetAllocations}
                totalBaselineBudget={totalBaselineBudget}
              />

              {/* Data Visualizations */}
              <AnalyticsCharts channels={channels} simulation={simulation} />

              {/* Campaign Watchlist & Action Table */}
              <CampaignTable
                campaigns={campaigns}
                onApplyAction={handleApplyCampaignAction}
              />
            </div>
          )}

          {currentView === 'attribution' && <AttributionView />}

          {currentView === 'optimizer' && <OptimizerView />}

          {currentView === 'ltv' && <LtvAnalysisView />}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Contextual AI Copilot Drawer */}
      <AiCopilotChat
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        simulation={simulation}
        channels={channels}
        currentModel={selectedModel}
        onApplyChatAction={handleApplyChatAction}
      />
    </div>
  );
}
