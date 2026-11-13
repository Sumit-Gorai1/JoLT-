import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Loader2,
  ShieldCheck,
  Layers,
  GitCommit,
  AlertTriangle,
  Bot,
  CheckCircle2,
} from 'lucide-react';

interface CustomAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (ticker: string) => void;
  initialHeadline?: string;
  initialDetails?: string;
}

const PRESET_EVENTS = [
  {
    title: 'Middle East Drone Strikes on Oil Terminal',
    headline: 'Drone attack on key Gulf crude loading terminal damages storage; Brent crude spikes 6.5% to $82/bbl.',
    sector: 'Commodities & Energy',
  },
  {
    title: 'US Fed Surprise 50bps Rate Cut',
    headline: 'Federal Reserve delivers surprise 50 bps rate cut; signals accelerated global liquidity expansion.',
    sector: 'Global Macro & IT Services',
  },
  {
    title: 'Cabinet Doubles Semiconductor PLI to ₹1.5 Lakh Cr',
    headline: 'Cabinet approves expansion of India Semiconductor Mission with 50% fiscal capital support for testing & fab units.',
    sector: 'Electronics & Defence',
  },
  {
    title: 'RBI Reduces Statutory Liquidity Ratio (SLR)',
    headline: 'Reserve Bank of India reduces SLR requirement by 50 bps, freeing ₹1.2 lakh crore for commercial lending.',
    sector: 'Banking & Financial Services',
  },
];

export const CustomAnalysisModal: React.FC<CustomAnalysisModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  initialHeadline = '',
  initialDetails = '',
}) => {
  const [headline, setHeadline] = useState(initialHeadline);
  const [details, setDetails] = useState(initialDetails);
  const [sectorHint, setSectorHint] = useState('General / Multi-Sector');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRunAnalysis = async (customH?: string, customD?: string, customS?: string) => {
    const h = customH || headline;
    const d = customD || details;
    const s = customS || sectorHint;

    if (!h.trim()) {
      setErrorMsg('Please enter a headline or choose an event preset.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: h,
          newsText: d,
          contextSector: s,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);
      } else {
        setErrorMsg(data.error || 'Failed to synthesize market intelligence.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg('Network error while running multi-agent synthesis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectPreset = (preset: typeof PRESET_EVENTS[0]) => {
    setHeadline(preset.headline);
    setDetails('');
    setSectorHint(preset.sector);
    handleRunAnalysis(preset.headline, '', preset.sector);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-modal rounded-3xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto border border-white/80 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-1.5 rounded-xl glass-card border border-slate-200/90 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-200/80 pb-5">
          <div className="w-11 h-11 rounded-2xl btn-dynamic-primary flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-classic-serif font-shade-primary">
              Test Any News Event with JoLT's 10-Agent Pipeline
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-serif-classic italic font-medium">
              Multi-agent reasoning with Bayesian calibration, JoLT Sentiment Engine embeddings, and strict falsification guardrails.
            </p>
          </div>
        </div>

        {/* Preset Triggers */}
        <div className="mb-6">
          <span className="text-[10.5px] font-bold uppercase tracking-widest block mb-2.5 font-classic-title font-shade-cyan">
            Instant Institutional Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_EVENTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => selectPreset(preset)}
                className="text-left p-3 rounded-xl glass-card-hover border border-slate-200/90 transition-all cursor-pointer text-xs group shadow-2xs"
              >
                <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors font-classic-title tracking-tight">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-1 mt-1 font-sans font-medium">
                  {preset.headline}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4 glass-card p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5 font-classic-title uppercase tracking-wider">
              Event Headline / Breaking Disclosure:
            </label>
            <input
              type="text"
              placeholder="e.g. Ministry of Heavy Industries raises FAME-III subsidy cap for commercial EV buses..."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all leading-relaxed border border-slate-300 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-900 block mb-1.5 font-classic-title uppercase tracking-wider">
                Additional Details / Excerpt (Optional):
              </label>
              <input
                type="text"
                placeholder="Include order sizes, percentages, or regulatory quotes..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all leading-relaxed border border-slate-300 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1.5 font-classic-title uppercase tracking-wider">
                Sector Hint:
              </label>
              <input
                type="text"
                placeholder="e.g. Auto, IT, Energy, Infra"
                value={sectorHint}
                onChange={(e) => setSectorHint(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all leading-relaxed border border-slate-300 font-medium"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-900 font-bold">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={() => handleRunAnalysis()}
              disabled={isLoading || !headline.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-dynamic-primary disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold cursor-pointer font-classic-title uppercase tracking-wider whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing 10-Agent Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-white text-white" />
                  <span>Execute Multi-Agent Synthesis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-6 p-8 rounded-2xl glass-card border border-slate-200/90 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <div className="text-sm font-bold text-slate-900 font-classic-serif">Running JoLT Multi-Agent Deliberation</div>
            <p className="text-xs text-slate-600 max-w-md mx-auto font-serif-classic italic font-medium">
              Agents executing: News verification → NSE Entity Mapping → Transmission Modeling → Risk Invalidation Checks.
            </p>
          </div>
        )}

        {/* Analysis Result Display */}
        {analysisResult && (
          <div className="mt-6 space-y-5 border-t border-slate-200/80 pt-6">
            {/* Top Scorecard */}
            <div className="glass-card p-5 rounded-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest font-classic-title">
                  Synthesis Completed
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 font-classic-serif">{analysisResult.headline}</h3>
                <p className="text-xs text-slate-700 mt-1 font-serif-classic italic font-medium">{analysisResult.summary}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono-num shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Direction</span>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-lg text-[11px] font-classic-title uppercase tracking-wider ${
                      analysisResult.primaryImpact === 'POSITIVE'
                        ? 'bg-emerald-500/20 text-emerald-900 border border-emerald-500/40'
                        : analysisResult.primaryImpact === 'NEGATIVE'
                        ? 'bg-rose-500/20 text-rose-900 border border-rose-500/40'
                        : 'bg-slate-200/90 text-slate-800'
                    }`}
                  >
                    {analysisResult.primaryImpact}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Conviction</span>
                  <span className="font-extrabold text-amber-900 text-lg">
                    {analysisResult.confidenceScore}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Credibility</span>
                  <span className="font-bold text-emerald-900 text-lg">
                    {analysisResult.credibilityScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* ProsusAI FinBERT Sentiment Model Card */}
            {analysisResult.finbertSentiment && (
              <div className="p-4 rounded-2xl glass-card border border-amber-500/35 space-y-3 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 font-bold badge-dynamic-shade text-xs px-2.5 py-1 rounded-md font-classic-title">
                      <span>⚡</span>
                      <span className="font-shade-primary">JoLT Sentiment Engine:</span>
                    </span>
                    <span
                      className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md border font-classic-title tracking-wider ${
                        analysisResult.finbertSentiment.label === 'positive'
                          ? 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40'
                          : analysisResult.finbertSentiment.label === 'negative'
                          ? 'bg-rose-500/20 text-rose-900 border-rose-500/40'
                          : 'bg-slate-200/90 text-slate-800 border-slate-300'
                      }`}
                    >
                      {analysisResult.finbertSentiment.label}
                    </span>
                    <span className="text-xs text-slate-700 font-mono-num font-medium">
                      Polarity:{' '}
                      <strong
                        className={
                          analysisResult.finbertSentiment.sentimentScore > 0
                            ? 'text-emerald-800 font-bold'
                            : analysisResult.finbertSentiment.sentimentScore < 0
                            ? 'text-rose-800 font-bold'
                            : 'text-slate-800 font-bold'
                        }
                      >
                        {analysisResult.finbertSentiment.sentimentScore > 0 ? '+' : ''}
                        {analysisResult.finbertSentiment.sentimentScore.toFixed(2)}
                      </strong>
                    </span>
                  </div>

                  <span className="text-[11px] font-shade-cyan font-bold flex items-center gap-1 font-classic-title">
                    <span>3-Class Neural Softmax</span>
                  </span>
                </div>

                {/* Softmax Probabilities Progress Bar */}
                <div className="space-y-1.5 text-xs">
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200/90 p-0.5 border border-slate-300">
                    <div
                      style={{
                        width: `${analysisResult.finbertSentiment.probabilities.positive * 100}%`,
                      }}
                      className="h-full bg-emerald-600 rounded-l-full transition-all"
                    />
                    <div
                      style={{
                        width: `${analysisResult.finbertSentiment.probabilities.neutral * 100}%`,
                      }}
                      className="h-full bg-slate-400 transition-all"
                    />
                    <div
                      style={{
                        width: `${analysisResult.finbertSentiment.probabilities.negative * 100}%`,
                      }}
                      className="h-full bg-rose-600 rounded-r-full transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5 font-mono-num font-medium">
                    <span className="text-emerald-800 font-bold">
                      Positive: {(analysisResult.finbertSentiment.probabilities.positive * 100).toFixed(1)}%
                    </span>
                    <span className="text-slate-700 font-semibold">
                      Neutral: {(analysisResult.finbertSentiment.probabilities.neutral * 100).toFixed(1)}%
                    </span>
                    <span className="text-rose-800 font-bold">
                      Negative: {(analysisResult.finbertSentiment.probabilities.negative * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Affected Tickers */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-3 font-classic-title uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Mapped Listed Companies (NSE/BSE)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysisResult.affectedTickers?.map((stk: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectStock(stk.ticker);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl glass-card-hover border border-slate-200/90 transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-amber-900 transition-colors font-mono-num">
                        {stk.ticker}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-classic-title uppercase tracking-wider ${
                          stk.impact === 'POSITIVE'
                            ? 'text-emerald-900 bg-emerald-500/20 border border-emerald-500/40'
                            : stk.impact === 'NEGATIVE'
                            ? 'text-rose-900 bg-rose-500/20 border border-rose-500/40'
                            : 'text-slate-800 bg-slate-200/90 border border-slate-300'
                        }`}
                      >
                        {stk.expectedMagnitude || stk.impact}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">{stk.companyName}</div>
                    <p className="text-[11px] text-slate-700 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {stk.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transmission Chain */}
            {analysisResult.transmissionMechanism && (
              <div className="glass-card p-5 rounded-2xl border border-slate-200/90 space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 font-classic-title uppercase tracking-wider">
                  <GitCommit className="w-4 h-4 text-amber-700" />
                  <span>Transmission Mechanism Causal Sequence</span>
                </h4>
                <div className="space-y-2.5">
                  {analysisResult.transmissionMechanism.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-xs glass-card-subtle p-3 rounded-xl border border-slate-200/80"
                    >
                      <span className="w-5 h-5 rounded-full glass-card border border-amber-500/35 text-amber-900 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 font-mono-num bg-amber-500/20">
                        {step.step || idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 font-sans">{step.title}</div>
                        <div className="text-slate-700 text-[11px] leading-relaxed mt-0.5 font-serif-classic italic font-medium">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invalidation Triggers */}
            {analysisResult.invalidationTriggers && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 mb-1.5 font-classic-title uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>What Would Invalidate This Thesis:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-800 text-[11px] leading-relaxed font-medium">
                  {analysisResult.invalidationTriggers.map((trig: string, idx: number) => (
                    <li key={idx}>{trig}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agent Deliberations */}
            {analysisResult.agentDeliberations && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-classic-title uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Agent Network Consensus Deliberation</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  {analysisResult.agentDeliberations.map((d: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl glass-card border border-slate-200/90 shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 font-sans">{d.agentName}</span>
                        <span className="font-mono-num text-amber-900 font-bold">{d.verdict}</span>
                      </div>
                      <p className="text-slate-600 leading-snug font-medium">{d.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
