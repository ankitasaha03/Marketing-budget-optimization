import { ChannelConfig, ChannelId, ChannelPerformance, SimulationResult } from '@/types';

/**
 * Hill equation for marketing response curves (Diminishing returns)
 * Revenue = Vmax * (Spend^gamma) / (K^gamma + Spend^gamma)
 */
export function calculateChannelRevenue(config: ChannelConfig, spend: number): number {
  if (spend <= 0) return 0;
  const spendPow = Math.pow(spend, config.gamma);
  const kPow = Math.pow(config.kHalf, config.gamma);
  const revenue = config.vMax * (spendPow / (kPow + spendPow));
  return Math.round(revenue);
}

/**
 * First derivative d(Revenue)/d(Spend) -> Marginal ROAS
 * mROAS = Vmax * gamma * K^gamma * Spend^(gamma - 1) / (K^gamma + Spend^gamma)^2
 */
export function calculateMarginalRoas(config: ChannelConfig, spend: number): number {
  if (spend <= 1) return 5.0; // Early stage high return
  const spendPow = Math.pow(spend, config.gamma);
  const kPow = Math.pow(config.kHalf, config.gamma);
  const denominator = Math.pow(kPow + spendPow, 2);
  const numerator = config.vMax * config.gamma * kPow * Math.pow(spend, config.gamma - 1);
  const mRoas = numerator / denominator;
  return Number(mRoas.toFixed(2));
}

/**
 * Saturation Percentage (0% to 100%)
 * Measures how close current spend is to diminishing returns elbow
 */
export function calculateSaturation(config: ChannelConfig, spend: number): number {
  const currentRevenue = calculateChannelRevenue(config, spend);
  const saturationPercent = (currentRevenue / config.vMax) * 100;
  return Math.min(100, Math.round(saturationPercent));
}

/**
 * Calculate conversions and CAC based on revenue and channel efficiency curve
 */
export function calculateChannelMetrics(
  config: ChannelConfig,
  spend: number
): ChannelPerformance {
  const revenue = calculateChannelRevenue(config, spend);
  // Estimate conversions using efficiency curve
  const efficiencyDecay = Math.max(0.4, 1 - (spend / (config.vMax * 0.8)) * 0.35);
  const conversions = Math.max(1, Math.round((spend / config.baseCac) * efficiencyDecay));
  const cac = spend > 0 && conversions > 0 ? Math.round(spend / conversions) : config.baseCac;
  const roas = spend > 0 ? Number((revenue / spend).toFixed(2)) : 0;
  const ltv = config.avgLtv;
  const ltvToCac = cac > 0 ? Number((ltv / cac).toFixed(2)) : 0;
  const saturationScore = calculateSaturation(config, spend);
  const marginalRoas = calculateMarginalRoas(config, spend);

  return {
    channelId: config.id,
    name: config.name,
    color: config.color,
    spend,
    attributableRevenue: revenue,
    conversions,
    cac,
    roas,
    ltv,
    ltvToCac,
    saturationScore,
    marginalRoas,
  };
}

/**
 * Complete Simulation Result across all channels
 */
export function runSimulation(
  channels: ChannelConfig[],
  budgetAllocations: Record<ChannelId, number>,
  baselineTotalRevenue: number,
  baselineTotalSpend: number
): SimulationResult {
  const channelPerformances: ChannelPerformance[] = channels.map((ch) => {
    const spend = budgetAllocations[ch.id] ?? ch.baseBudget;
    return calculateChannelMetrics(ch, spend);
  });

  const totalSpend = channelPerformances.reduce((acc, curr) => acc + curr.spend, 0);
  const totalRevenue = channelPerformances.reduce((acc, curr) => acc + curr.attributableRevenue, 0);
  const totalConversions = channelPerformances.reduce((acc, curr) => acc + curr.conversions, 0);

  const blendedRoas = totalSpend > 0 ? Number((totalRevenue / totalSpend).toFixed(2)) : 0;
  const blendedCac = totalConversions > 0 ? Math.round(totalSpend / totalConversions) : 0;
  
  const weightedLtv = channelPerformances.reduce((acc, curr) => acc + curr.ltv * curr.conversions, 0);
  const avgLtv = totalConversions > 0 ? weightedLtv / totalConversions : 0;
  const blendedLtvToCac = blendedCac > 0 ? Number((avgLtv / blendedCac).toFixed(2)) : 0;

  const netProfit = totalRevenue - totalSpend;
  const revenueLift = totalRevenue - baselineTotalRevenue;
  const baselineRoas = baselineTotalSpend > 0 ? baselineTotalRevenue / baselineTotalSpend : 0;
  const roasLift = Number((blendedRoas - baselineRoas).toFixed(2));

  return {
    totalSpend,
    totalRevenue,
    totalConversions,
    blendedRoas,
    blendedCac,
    blendedLtvToCac,
    netProfit,
    revenueLift,
    roasLift,
    channels: channelPerformances,
  };
}

/**
 * AI Optimizer Solver:
 * Uses iterative marginal ROAS equalization (Greedy discrete allocation)
 * Allocates total budget to channel with highest marginal ROAS step until target budget is exhausted
 */
export function findOptimalAllocation(
  channels: ChannelConfig[],
  totalBudgetToAllocate: number,
  lockedBudgets: Partial<Record<ChannelId, number>> = {}
): Record<ChannelId, number> {
  const allocation: Record<ChannelId, number> = {} as Record<ChannelId, number>;
  
  let remainingBudget = totalBudgetToAllocate;
  const activeChannels: ChannelConfig[] = [];

  // Initialize with minimum budgets or locked values
  for (const ch of channels) {
    if (lockedBudgets[ch.id] !== undefined) {
      allocation[ch.id] = lockedBudgets[ch.id]!;
      remainingBudget -= lockedBudgets[ch.id]!;
    } else {
      const minStart = Math.min(ch.minBudget, ch.baseBudget * 0.3);
      allocation[ch.id] = minStart;
      remainingBudget -= minStart;
      activeChannels.push(ch);
    }
  }

  // Step size for discrete marginal evaluation ($500 chunks)
  const step = 500;
  while (remainingBudget >= step && activeChannels.length > 0) {
    let bestChannel: ChannelConfig | null = null;
    let highestMarginalRoas = -Infinity;

    for (const ch of activeChannels) {
      const currentSpend = allocation[ch.id];
      if (currentSpend + step <= ch.maxBudget) {
        const mRoas = calculateMarginalRoas(ch, currentSpend + step / 2);
        if (mRoas > highestMarginalRoas) {
          highestMarginalRoas = mRoas;
          bestChannel = ch;
        }
      }
    }

    if (!bestChannel || highestMarginalRoas <= 0.6) {
      // Diminishing returns too steep, spread remainder across best roas channels
      if (bestChannel) {
        allocation[bestChannel.id] += remainingBudget;
      }
      break;
    }

    allocation[bestChannel.id] += step;
    remainingBudget -= step;
  }

  // Round all values to nearest 500
  for (const ch of channels) {
    allocation[ch.id] = Math.round(allocation[ch.id] / 500) * 500;
  }

  return allocation;
}

/**
 * Generate 20-point saturation curve data points for charting
 */
export function generateSaturationCurve(config: ChannelConfig, maxSpendMultiplier = 2.5) {
  const points = [];
  const maxSpend = config.baseBudget * maxSpendMultiplier;
  const step = maxSpend / 24;

  for (let s = 0; s <= maxSpend; s += step) {
    const revenue = calculateChannelRevenue(config, s);
    const mRoas = calculateMarginalRoas(config, s);
    const saturation = calculateSaturation(config, s);
    points.push({
      spend: Math.round(s),
      revenue: Math.round(revenue),
      marginalRoas: mRoas,
      saturation,
      isCurrentSpend: Math.abs(s - config.baseBudget) < step / 2,
    });
  }

  return points;
}
