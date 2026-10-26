export type ChannelId =
  | 'google_search'
  | 'meta_retargeting'
  | 'linkedin_b2b'
  | 'tiktok_awareness'
  | 'influencer'
  | 'email_marketing';

export type AttributionModelId =
  | 'data_driven'
  | 'first_touch'
  | 'last_touch'
  | 'linear';

export type DateRangeId = '30d' | 'q1' | 'q2' | 'ytd';

export interface ChannelConfig {
  id: ChannelId;
  name: string;
  category: 'Paid Search' | 'Paid Social' | 'B2B Network' | 'Organic/Email' | 'Influencer';
  color: string;
  accentColor: string;
  baseBudget: number;
  currentBudget: number;
  minBudget: number;
  maxBudget: number;
  // Hill Saturation Equation parameters: R(S) = Vmax * (S^gamma) / (K^gamma + S^gamma)
  vMax: number;          // Maximum achievable revenue potential ($)
  kHalf: number;         // Half-saturation spend point ($)
  gamma: number;         // Hill coefficient (shape/steepness)
  baseCac: number;       // Baseline CAC ($)
  avgLtv: number;        // Average customer lifetime value ($)
  conversionsPerK: number; // Avg baseline conversions per $1k spend
  currentSaturation: number; // 0 - 100% saturation status
  marginalRoas: number;  // Current mROAS (derivative)
}

export interface ChannelPerformance {
  channelId: ChannelId;
  name: string;
  color: string;
  spend: number;
  attributableRevenue: number;
  conversions: number;
  cac: number;
  roas: number;
  ltv: number;
  ltvToCac: number;
  saturationScore: number; // 0 to 100
  marginalRoas: number;
}

export interface Campaign {
  id: string;
  name: string;
  channelId: ChannelId;
  channelName: string;
  spend: number;
  conversions: number;
  revenue: number;
  cac: number;
  roas: number;
  ltv: number;
  ltvToCac: number;
  status: 'Bleeding' | 'High-Performing' | 'Saturated' | 'Optimized' | 'Testing';
  recommendation: string;
  suggestedAction: {
    type: 'cut' | 'scale' | 'pause' | 'reallocate';
    amount?: number;
    targetChannel?: ChannelId;
    explanation: string;
  };
}

export interface SimulationResult {
  totalSpend: number;
  totalRevenue: number;
  totalConversions: number;
  blendedRoas: number;
  blendedCac: number;
  blendedLtvToCac: number;
  netProfit: number;
  revenueLift: number;
  roasLift: number;
  channels: ChannelPerformance[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  actionCard?: {
    title: string;
    description: string;
    shiftFrom: ChannelId;
    shiftTo: ChannelId;
    amount: number;
    projectedLift: string;
    applied?: boolean;
  };
}

export type ViewTab = 'dashboard' | 'attribution' | 'optimizer' | 'ltv' | 'settings';
