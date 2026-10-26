'use client';

import * as React from 'react';
import { Campaign } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Sliders,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface CampaignTableProps {
  campaigns: Campaign[];
  onApplyAction?: (campaign: Campaign) => void;
}

export function CampaignTable({ campaigns, onApplyAction }: CampaignTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [channelFilter, setChannelFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'spend' | 'cac' | 'roas' | 'ltvToCac'>('spend');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [actionSuccess, setActionSuccess] = React.useState(false);

  // Filter & Search logic
  const filteredCampaigns = React.useMemo(() => {
    return campaigns
      .filter((cmp) => {
        const matchesSearch =
          cmp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmp.channelName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesChannel =
          channelFilter === 'all' || cmp.channelId === channelFilter;
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'bleeding' && cmp.status === 'Bleeding') ||
          (statusFilter === 'high' && cmp.status === 'High-Performing') ||
          (statusFilter === 'saturated' && cmp.status === 'Saturated');

        return matchesSearch && matchesChannel && matchesStatus;
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'desc' ? -1 : 1;
        return (a[sortBy] - b[sortBy]) * multiplier;
      });
  }, [campaigns, searchTerm, channelFilter, statusFilter, sortBy, sortOrder]);

  const handleSort = (field: 'spend' | 'cac' | 'roas' | 'ltvToCac') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleOpenActionModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActionSuccess(false);
    setIsDialogOpen(true);
  };

  const handleExecuteAction = () => {
    if (selectedCampaign && onApplyAction) {
      onApplyAction(selectedCampaign);
    }
    setActionSuccess(true);
    setTimeout(() => {
      setIsDialogOpen(false);
      setActionSuccess(false);
    }, 1500);
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'Bleeding':
        return (
          <Badge variant="destructive" className="gap-1 text-[10px]">
            <AlertTriangle className="h-3 w-3" />
            Bleeding / Inefficient
          </Badge>
        );
      case 'High-Performing':
        return (
          <Badge variant="success" className="gap-1 text-[10px]">
            <CheckCircle className="h-3 w-3" />
            High-Performing
          </Badge>
        );
      case 'Saturated':
        return (
          <Badge variant="warning" className="gap-1 text-[10px]">
            <TrendingUp className="h-3 w-3" />
            Saturated
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-500">
                <Sliders className="h-4 w-4" />
              </span>
              <CardTitle className="text-base font-semibold">
                Campaign Watchlist & AI Reallocation Actions
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Live campaign efficiency metrics, algorithmic health diagnostics, and recommended budget adjustments.
            </CardDescription>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">
              Showing {filteredCampaigns.length} of {campaigns.length} active campaigns
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          {/* Search input */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search campaigns by name or channel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-full rounded-lg border border-zinc-200/90 bg-white pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100"
            />
          </div>

          {/* Channel Filter */}
          <div className="sm:col-span-4 flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-zinc-400 hidden sm:inline" />
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-zinc-200/90 bg-white px-2.5 text-xs text-zinc-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200 cursor-pointer"
            >
              <option value="all">All Marketing Channels</option>
              <option value="google_search">Google Search</option>
              <option value="meta_retargeting">Meta Retargeting</option>
              <option value="linkedin_b2b">LinkedIn B2B</option>
              <option value="tiktok_awareness">TikTok Awareness</option>
              <option value="influencer">Influencer Partnerships</option>
              <option value="email_marketing">Email & Retention</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-zinc-200/90 bg-white px-2.5 text-xs text-zinc-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200 cursor-pointer"
            >
              <option value="all">All Campaign Health</option>
              <option value="bleeding">Bleeding / High Burn</option>
              <option value="high">High-Performing Only</option>
              <option value="saturated">Saturated Only</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-950/40 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 select-none">
                <th className="py-2.5 px-4 font-medium">Campaign & Channel</th>
                <th
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() => handleSort('spend')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Monthly Spend</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium">Conversions</th>
                <th
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() => handleSort('cac')}
                >
                  <div className="flex items-center space-x-1">
                    <span>CAC</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() => handleSort('roas')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ROAS</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() => handleSort('ltvToCac')}
                >
                  <div className="flex items-center space-x-1">
                    <span>LTV:CAC</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium">Diagnostic</th>
                <th className="py-2.5 px-4 font-medium min-w-[260px]">AI Recommendation</th>
                <th className="py-2.5 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No campaigns match your selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((cmp) => {
                  const isBleeding = cmp.status === 'Bleeding';
                  const isHigh = cmp.status === 'High-Performing';

                  return (
                    <tr
                      key={cmp.id}
                      className={`transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 ${
                        isBleeding
                          ? 'bg-rose-500/[0.02] dark:bg-rose-500/[0.03]'
                          : isHigh
                          ? 'bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03]'
                          : ''
                      }`}
                    >
                      {/* Name & Channel */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {cmp.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center space-x-1">
                          <span>{cmp.channelName}</span>
                        </div>
                      </td>

                      {/* Spend */}
                      <td className="py-3 px-3 font-semibold text-zinc-800 dark:text-zinc-200">
                        {formatCurrency(cmp.spend)}
                      </td>

                      {/* Conversions */}
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-300">
                        {formatNumber(cmp.conversions)}
                      </td>

                      {/* CAC */}
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold ${
                            cmp.cac > 200
                              ? 'text-rose-600 dark:text-rose-400'
                              : cmp.cac < 100
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          ${cmp.cac}
                        </span>
                      </td>

                      {/* ROAS */}
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold ${
                            cmp.roas >= 4.0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : cmp.roas < 1.8
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {cmp.roas.toFixed(2)}x
                        </span>
                      </td>

                      {/* LTV:CAC */}
                      <td className="py-3 px-3 font-semibold text-zinc-700 dark:text-zinc-300">
                        {cmp.ltvToCac.toFixed(1)}x
                      </td>

                      {/* Diagnostic Status */}
                      <td className="py-3 px-3">
                        {getStatusBadge(cmp.status)}
                      </td>

                      {/* Recommendation */}
                      <td className="py-3 px-4">
                        <div className="text-zinc-700 dark:text-zinc-300 font-medium text-[11px] leading-snug">
                          {cmp.recommendation}
                        </div>
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant={isBleeding ? 'destructive' : isHigh ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleOpenActionModal(cmp)}
                          className="h-7 px-2.5 text-[11px] gap-1"
                        >
                          <span>Review</span>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Campaign Action Review Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedCampaign && (
          <div>
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-500">
                  <Sparkles className="h-4 w-4" />
                </span>
                <DialogTitle>AI Reallocation Recommendation</DialogTitle>
              </div>
              <DialogDescription className="text-xs">
                Review simulated impact before pushing this change to the MMM engine.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2 text-xs">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {selectedCampaign.name}
                </div>
                <div className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5">
                  Channel: {selectedCampaign.channelName} • Spend: {formatCurrency(selectedCampaign.spend)}
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  {getStatusBadge(selectedCampaign.status)}
                  <span className="text-[11px] text-zinc-500">
                    CAC: ${selectedCampaign.cac} • ROAS: {selectedCampaign.roas}x
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-zinc-800 dark:text-zinc-200 space-y-1.5">
                <div className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Proposed Reallocation Rationale</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {selectedCampaign.suggestedAction.explanation}
                </p>
              </div>

              {actionSuccess && (
                <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-emerald-600 dark:text-emerald-400 font-medium text-center text-xs animate-in fade-in">
                  ✓ Reallocation applied to simulator successfully!
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteAction}
                disabled={actionSuccess}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
              >
                <Sparkles className="h-3 w-3" />
                <span>Apply Action to Simulator</span>
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </Card>
  );
}
