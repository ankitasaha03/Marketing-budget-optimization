'use client';

import * as React from 'react';
import { ChatMessage, ChannelId, ChannelConfig, SimulationResult, AttributionModelId } from '@/types';
import { INITIAL_AI_CHATS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  X,
  Send,
  Bot,
  CheckCircle2,
  Trash2,
  Zap,
} from 'lucide-react';

interface AiCopilotChatProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: SimulationResult;
  channels: ChannelConfig[];
  currentModel: AttributionModelId;
  onApplyChatAction: (shiftFrom: ChannelId, shiftTo: ChannelId, amount: number) => void;
}

let messageCounter = 0;
function getUniqueMessageId(prefix: string) {
  messageCounter += 1;
  return `${prefix}_${messageCounter}_${Math.random().toString(36).substring(2, 7)}`;
}

export function AiCopilotChat({
  isOpen,
  onClose,
  simulation,
  channels,
  currentModel,
  onApplyChatAction,
}: AiCopilotChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_AI_CHATS);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [appliedCards, setAppliedCards] = React.useState<Record<string, boolean>>({});
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const quickChips = [
    'Which campaigns are wasting money right now?',
    'How should I reallocate $50k to maximize profitable customers?',
    'Why is LinkedIn Ads showing high conversions but low profitability?',
    'Explain the current slider simulation results.',
  ];

  const handleSendMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: getUniqueMessageId('usr'),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // AI Contextual Response generation
    setTimeout(() => {
      let aiResponse = '';
      let actionCard: ChatMessage['actionCard'] = undefined;

      const lower = userText.toLowerCase();

      if (lower.includes('wasting money') || lower.includes('bleeding')) {
        aiResponse = `Based on current **Bayesian MMM Attribution** and diminishing returns analysis, **2 campaigns are actively burning capital**:

1. **TikTok Spark Ads - Trend Audio Memes** ($25,000/mo)
   - CAC is **$245** against an LTV of only **$310** (LTV:CAC of 1.27x).
   - Channel saturation is currently at **84%**, with a marginal ROAS of **0.72x** (loss-making).

2. **Display Remarketing Network** ($9,000/mo)
   - CAC is **$290** with 84% bounce rate and low post-click engagement.

**Recommendation:** Cut $15,000 from TikTok Spark Ads and shift immediately to Google PMax Search.`;
        actionCard = {
          title: 'AI Proposed Shift: Move $15k from TikTok to Google Search',
          description: 'Cuts saturated TikTok burn and funds high-intent search demand.',
          shiftFrom: 'tiktok_awareness',
          shiftTo: 'google_search',
          amount: 15000,
          projectedLift: '+$42,000 Net Revenue Lift',
        };
      } else if (lower.includes('reallocate $50k') || lower.includes('50k')) {
        aiResponse = `To maximize profitable customers from a **$50,000 reallocation portfolio**, here is the optimal mathematical deployment based on marginal efficiency:

| Destination Channel | Recommended Allocation | Projected mROAS | Expected Lift |
| :--- | :--- | :--- | :--- |
| **Email Lifecycle Drip** | **+$15,000** | **4.60x** | +$69,000 Rev |
| **Google Search PMax** | **+$20,000** | **2.85x** | +$57,000 Rev |
| **LinkedIn Enterprise ABM** | **+$15,000** | **3.12x** | +$46,800 Rev |

This shift captures high-intent demand while keeping blended CAC under **$135**.`;
        actionCard = {
          title: 'Shift $15,000 from TikTok to Email Lifecycle',
          description: 'Leverage Email retention curve with 38% saturation and 4.6x marginal return.',
          shiftFrom: 'tiktok_awareness',
          shiftTo: 'email_marketing',
          amount: 15000,
          projectedLift: '+$52,500 Revenue Lift',
        };
      } else if (lower.includes('linkedin')) {
        aiResponse = `Great diagnostic question. **LinkedIn B2B** has an apparent paradox:
- **High CAC ($264 - $346)** vs. Meta ($114) makes it look expensive on a surface-level Last-Touch view.
- However, its **Customer LTV is $1,480 - $1,680** (nearly 3x consumer channels).
- **LTV:CAC ratio is 6.36x**, well above the 3.0x SaaS health benchmark!

**Verdict:** Do **not** cut LinkedIn. Instead, tighten audience targeting to exclude general InMail and concentrate budget on Enterprise ABM accounts.`;
      } else if (lower.includes('simulation') || lower.includes('slider') || lower.includes('results')) {
        const rev = formatCurrency(simulation.totalRevenue);
        const spend = formatCurrency(simulation.totalSpend);
        const roas = simulation.blendedRoas.toFixed(2);
        const lift = formatCurrency(simulation.revenueLift);

        aiResponse = `Here is the diagnostic breakdown of your current simulated scenario:
- **Total Spend:** ${spend}
- **Projected Revenue:** ${rev}
- **Blended ROAS:** ${roas}x
- **Incremental Lift vs Baseline:** ${simulation.revenueLift >= 0 ? `+${lift}` : lift}

Under the **${currentModel.replace('_', ' ').toUpperCase()}** model, your simulated budget reallocation is generating **${formatCurrency(simulation.netProfit)} in net attributable margin**.

Click **"Apply AI Optimal Budget"** on the dashboard simulator to automatically balance marginal ROAS across all channels!`;
      } else {
        aiResponse = `I've analyzed your portfolio across all 6 marketing channels. Current total spend is **${formatCurrency(
          simulation.totalSpend
        )}** yielding **${formatCurrency(simulation.totalRevenue)}** in revenue (${simulation.blendedRoas.toFixed(2)}x ROAS).

To improve efficiency:
1. Reduce budget on channels where marginal ROAS < 1.0 (such as TikTok Awareness).
2. Scale channels with saturation < 50% (Email Lifecycle and Creator Partnerships).
3. Would you like me to apply an optimal budget distribution?`;
        actionCard = {
          title: 'Apply Global AI Optimal Distribution',
          description: 'Reallocates budget according to equal marginal ROAS across all channels.',
          shiftFrom: 'tiktok_awareness',
          shiftTo: 'email_marketing',
          amount: 12000,
          projectedLift: '+$118,400 Overall Portfolio Lift',
        };
      }

      const assistantMsg: ChatMessage = {
        id: getUniqueMessageId('ast'),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: aiResponse,
        actionCard,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleApplyCard = (card: NonNullable<ChatMessage['actionCard']>, msgId: string) => {
    onApplyChatAction(card.shiftFrom, card.shiftTo, card.amount);
    setAppliedCards((prev) => ({ ...prev, [msgId]: true }));
  };

  const handleClearChat = () => {
    setMessages(INITIAL_AI_CHATS);
    setAppliedCards({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] border-l border-zinc-200/80 bg-white/95 dark:border-zinc-800/80 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="h-16 px-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>OptiScale AI Copilot</span>
              <Badge variant="cyan" className="text-[9px] py-0 px-1.5">
                Active Context
              </Badge>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Aware of current sliders & Shapley attribution ({channels.length} channels)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="h-8 w-8 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            title="Clear Chat History"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isApplied = appliedCards[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 px-1">
                {isUser ? (
                  <>
                    <span>You</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-3 w-3 text-indigo-500" />
                    <span>Copilot</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                )}
              </div>

              <div
                className={`rounded-2xl p-3.5 max-w-[90%] leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-md'
                    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content}
                </div>

                {/* Interactive Action Card inside Chat */}
                {msg.actionCard && (
                  <div className="mt-3.5 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 rounded-xl bg-white/70 dark:bg-zinc-950/60 p-3 shadow-sm border">
                    <div className="flex items-center space-x-1.5 font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      <Zap className="h-3.5 w-3.5" />
                      <span>{msg.actionCard.title}</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mb-2">
                      {msg.actionCard.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {msg.actionCard.projectedLift}
                      </span>

                      <Button
                        size="sm"
                        onClick={() => handleApplyCard(msg.actionCard!, msg.id)}
                        disabled={isApplied}
                        className={`h-7 px-2.5 text-[11px] gap-1 shadow-sm ${
                          isApplied
                            ? 'bg-emerald-600 text-white hover:bg-emerald-600'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Applied to Simulator</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3" />
                            <span>Apply to Simulator</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 text-zinc-400 p-2">
            <Bot className="h-4 w-4 animate-spin-slow text-indigo-500" />
            <div className="flex space-x-1">
              <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-[11px] text-zinc-400">Synthesizing attribution matrix...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="text-[10px] font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
          Suggested Questions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center space-x-2 bg-white dark:bg-zinc-950"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Copilot about spend, ROAS, saturation..."
          className="h-9 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!inputValue.trim() || isTyping}
          className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
