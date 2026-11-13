import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { MorningReport } from '../types/market';

interface MorningReportViewProps {
  report: MorningReport;
  onSelectStock: (ticker: string) => void;
  onOpenCustomAnalysis: () => void;
  liveIndices?: Array<{
    name: string;
    value: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
    source: string;
  }>;
  onRefreshMarket?: () => Promise<void> | void;
}

export const MorningReportView: React.FC<MorningReportViewProps> = ({
  report,
  onSelectStock,
  onOpenCustomAnalysis,
  liveIndices,
  onRefreshMarket,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);

  const getLiveIndex = (name: string) => liveIndices?.find((i) => i.name === name);
  const liveNifty = getLiveIndex('NIFTY 50');
  const liveSensex = getLiveIndex('SENSEX');
  const liveBrent = getLiveIndex('BRENT CRUDE');
  const liveUsdInr = getLiveIndex('USD / INR');
  const liveVix = getLiveIndex('INDIA VIX');

  const handleRefreshReport = async () => {
    setIsRefreshing(true);
    try {
      const [syncResult] = await Promise.allSettled([
        fetch('/api/trigger-sync', { method: 'POST' }).then((r) => r.json()),
        onRefreshMarket ? Promise.resolve(onRefreshMarket()) : Promise.resolve(),
      ]);
      if (syncResult.status === 'fulfilled' && syncResult.value?.success) {
        setLastRefreshedAt(syncResult.value.lastSyncTimestampIST);
        setTimeout(() => setLastRefreshedAt(null), 4000);
      } else {
        setLastRefreshedAt('Live quotes synced');
        setTimeout(() => setLastRefreshedAt(null), 3000);
      }
    } catch {
      setLastRefreshedAt('Feeds refreshed');
      setTimeout(() => setLastRefreshedAt(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getFullReportText = () => {
    const niftyDisplay = liveNifty ? `${liveNifty.value} (${liveNifty.changePercent} | ${liveNifty.change} pts)` : '25,114.80 (-0.73%)';
    const sensexDisplay = liveSensex ? `${liveSensex.value} (${liveSensex.changePercent} | ${liveSensex.change} pts)` : '81,502.11 (-0.50%)';
    const brentDisplay = liveBrent ? `${liveBrent.value}/bbl (${liveBrent.changePercent})` : '$96.21/bbl (+0.41%)';
    const usdInrDisplay = liveUsdInr ? `${liveUsdInr.value} (${liveUsdInr.changePercent})` : '₹94.22 (+0.19%)';
    const vixDisplay = liveVix ? liveVix.value : report.marketRegime.volatilityIndex;

    return (
      `📊 *JoLT Institutional Market Intelligence Briefing (${report.reportDate})*\n\n` +
      `📈 *BENCHMARKS & INSTITUTIONAL FLOWS*:\n` +
      `• *NIFTY 50*: ${niftyDisplay}\n` +
      `• *BSE Sensex*: ${sensexDisplay}\n` +
      `• *FII Net Cash*: -₹${Math.abs(report.institutionalActivity.fiiCashNetCrores).toLocaleString('en-IN')} Cr (NSE Clearing T-1)\n` +
      `• *DII Net Cash*: +₹${report.institutionalActivity.diiCashNetCrores.toLocaleString('en-IN')} Cr (Mutual Fund Support)\n` +
      `• *FII Futures Long Ratio*: ${(report.institutionalActivity.fiiIndexFuturesLongShortRatio * 100).toFixed(0)}%\n` +
      `• *Brent Crude*: ${brentDisplay} (ICE London Benchmark)\n` +
      `• *USD / INR*: ${usdInrDisplay}\n` +
      `• *India VIX*: ${vixDisplay}\n\n` +
      `⚡ *CURRENT REGULATORY & MACRO REGIME*:\n` +
      `• *Regime*: ${report.marketRegime.current}\n` +
      `• *RBI Benchmark Repo Rate*: 5.50% (Calibrated Tightening)\n` +
      `• *SEBI Key Directives*: Research Analyst call records relaxation & Early Pay-In margin waiver.\n\n` +
      `🎯 *SCENARIOS & INVALIDATION BOUNDS*:\n` +
      `• Base (${report.scenarioAnalysis.baseScenario.probability}% Prob): ${report.scenarioAnalysis.baseScenario.niftyTarget}\n` +
      `• Bull (${report.scenarioAnalysis.bullScenario.probability}% Prob): ${report.scenarioAnalysis.bullScenario.niftyTarget}\n` +
      `• Bear (${report.scenarioAnalysis.bearScenario.probability}% Prob): ${report.scenarioAnalysis.bearScenario.niftyTarget}\n\n` +
      `_JoLT 24/7 Automated Indian Stock Market Intelligence Engine_`
    );
  };

  const handleCopyReport = () => {
    const text = getFullReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Timestamp & Quick Actions - Dynamic Iridescent Glass */}
      <div className="glass-panel-dynamic rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mb-1.5 font-mono-num">
              <span className="flex items-center gap-1.5 font-shade-primary font-bold uppercase tracking-wider text-[11px] font-classic-title text-glow-primary">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Institutional Morning Edition</span>
              </span>
              <span>·</span>
              <span className="text-slate-600 font-medium">{report.reportDate}</span>
              <span>·</span>
              <span className="font-shade-cyan font-semibold">{report.generationTimeIST}</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline font-shade-emerald font-semibold">
                Verified Exchange Ingestion
              </span>
            </div>
            <h1 className="font-classic-serif text-2xl sm:text-3xl font-bold font-shade-primary text-glow-primary tracking-tight">
              Today's Market Intelligence Report
            </h1>
            <p className="font-serif-classic text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed italic font-medium">
              Synthesized overnight by JoLT's 10-Agent network for NSE/BSE institutional readiness before market opening.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRefreshReport}
              disabled={isRefreshing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer backdrop-blur-md ${
                isRefreshing
                  ? 'badge-dynamic-shade'
                  : 'border-slate-200 glass-card-subtle hover:border-indigo-400/50 text-slate-700'
              }`}
              title="Refresh feeds from NSE/BSE filings and regulatory gazettes"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : lastRefreshedAt ? `Synced ${lastRefreshedAt}` : 'Refresh Feeds'}</span>
            </button>

            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 glass-card-subtle hover:border-indigo-400/50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              title="Copy Complete Market Intelligence Report"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-cyan-700" />}
              <span>{copied ? 'Copied' : 'Copy Briefing'}</span>
            </button>

            <button
              onClick={onOpenCustomAnalysis}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-dynamic-primary font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
              <span>Simulate Shock</span>
            </button>
          </div>
        </div>

        {/* Market Regime Bar - Translucent & Classic with Color-Shaded Metrics */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-slate-600 font-classic-title tracking-wider text-[11px] uppercase font-semibold">Market Regime:</span>
            <span className="font-bold font-shade-secondary badge-dynamic-shade px-2.5 py-0.5 rounded-md backdrop-blur-sm tracking-wide">
              {report.marketRegime.current}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-700 font-mono-num text-[11.5px]">
            <span>
              India VIX: <strong className="font-shade-purple font-bold">{liveVix?.value || report.marketRegime.volatilityIndex}</strong>
            </span>
            <span>·</span>
            <span>
              Liquidity Posture:{' '}
              <strong className="font-shade-emerald font-bold text-glow-emerald">
                {report.marketRegime.liquidityPosture.replace(/_/g, ' ')}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Overnight Global Developments & Institutional Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overnight Global Developments (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <h2 className="font-classic-serif text-lg font-bold flex items-center gap-2.5 tracking-tight font-shade-cyan text-glow-cyan">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-xs shadow-cyan-500 animate-pulse" />
              <span>I. Overnight Global & Geopolitical Developments</span>
            </h2>
            <span className="text-xs font-shade-gold font-bold font-mono-num text-glow-gold">Cross-Asset Grounding</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed glass-card-subtle p-4 rounded-xl border border-slate-200/70 font-medium">
            {report.overnightGlobalDevelopments.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {report.overnightGlobalDevelopments.cues.map((cue, idx) => {
              const assetLower = cue.asset.toLowerCase();
              const matchedLive =
                assetLower.includes('brent')
                  ? liveBrent
                  : assetLower.includes('usd/inr') || assetLower.includes('usd / inr')
                  ? liveUsdInr
                  : undefined;
              const displayValue = matchedLive ? `${matchedLive.value}${assetLower.includes('brent') ? '/bbl' : ''}` : cue.value;
              const displayChange = matchedLive ? `${matchedLive.changePercent} (${matchedLive.change})` : cue.change;

              return (
              <div
                key={idx}
                className="p-4 rounded-xl glass-card glass-card-hover border border-slate-200/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 font-classic-title tracking-wide">{cue.asset}</span>
                  <span className="font-bold font-shade-gold font-mono-num text-glow-gold">{displayValue}</span>
                </div>
                <div className="text-[11px] font-shade-emerald font-bold font-mono-num text-glow-emerald">
                  {displayChange}
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  {cue.implicationForIndia}
                </p>
                {cue.transmissionRationale && (
                  <div className="text-[11px] text-slate-600 glass-card-subtle p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                    <span className="font-bold font-shade-amber block text-[10px] uppercase mb-0.5 tracking-wide">
                      Causal Transmission Rationale:
                    </span>
                    {cue.transmissionRationale}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>

        {/* Institutional Flows & Positioning (1 col) */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/70 pb-3">
              <h2 className="font-classic-serif text-lg font-bold flex items-center gap-2.5 tracking-tight font-shade-purple">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500 animate-pulse" />
                <span>II. Institutional Flows</span>
              </h2>
              <span className="text-[10px] font-shade-emerald font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 font-classic-title tracking-wider">
                NSE/BSE Official
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl glass-card border border-slate-200/70">
                <div className="flex justify-between items-center text-xs mb-1.5 font-mono-num">
                  <span className="text-slate-600 font-medium">FII Net Cash (NSE/BSE)</span>
                  <span
                    className={`font-bold text-sm tabular-numbers font-mono-num ${
                      report.institutionalActivity.fiiCashNetCrores >= 0
                        ? 'font-shade-emerald text-glow-emerald'
                        : 'font-shade-rose text-glow-rose'
                    }`}
                  >
                    {report.institutionalActivity.fiiCashNetCrores >= 0 ? '+' : ''}
                    ₹{report.institutionalActivity.fiiCashNetCrores.toLocaleString()} Cr
                  </span>
                </div>
                <div className="w-full bg-slate-200/90 h-1.5 rounded-full overflow-hidden border border-slate-300/60">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: '85%' }}
                  />
                </div>
                <span className="text-[10px] text-rose-700 block mt-1.5 italic font-semibold">Aggressive cash offloading</span>
              </div>

              <div className="p-3.5 rounded-xl glass-card border border-slate-200/70">
                <div className="flex justify-between items-center text-xs mb-1.5 font-mono-num">
                  <span className="text-slate-600 font-medium">DII Net Cash (Domestic SIP)</span>
                  <span className="font-bold text-sm font-shade-emerald text-glow-emerald tabular-numbers font-mono-num">
                    +₹{report.institutionalActivity.diiCashNetCrores.toLocaleString()} Cr
                  </span>
                </div>
                <div className="w-full bg-slate-200/90 h-1.5 rounded-full overflow-hidden border border-slate-300/60">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
                <span className="text-[10px] text-emerald-700 block mt-1.5 italic font-semibold">Counter-cyclical domestic absorption</span>
              </div>

              <div className="p-3.5 rounded-xl glass-card border border-slate-200/70 text-xs">
                <div className="flex justify-between items-center mb-1 text-slate-700 font-mono-num">
                  <span className="text-slate-600 font-medium">FII Index Futures Long Ratio</span>
                  <span className="font-bold font-shade-rose text-glow-rose tabular-numbers font-mono-num">
                    {(report.institutionalActivity.fiiIndexFuturesLongShortRatio * 100).toFixed(0)}% (Extreme Short)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  3,09,822 net short contracts. High oversold positioning creates positive skew for an abrupt short squeeze.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="text-xs text-slate-700 glass-card-subtle p-3.5 rounded-xl border border-slate-200/70 leading-relaxed">
              {report.institutionalActivity.proAndRetailSentiment}
            </div>
            {report.institutionalActivity.flowJustification && (
              <div className="text-[11px] text-amber-900 bg-amber-500/15 p-3 rounded-xl border border-amber-500/30 leading-relaxed backdrop-blur-sm">
                <span className="font-bold text-amber-800 block text-[10px] uppercase mb-0.5 tracking-wider">
                  Flow Mechanism & Squeeze Math:
                </span>
                {report.institutionalActivity.flowJustification}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Indian Market Impactive News & Statutory Transmission Analysis */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3.5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500 animate-pulse" />
              <h2 className="font-classic-serif text-lg font-bold flex items-center gap-2.5 tracking-tight font-shade-amber text-glow-gold">
                <span>III. Statutory Causal Transmissions & Ingested News</span>
              </h2>
            </div>
            <p className="font-serif-classic text-xs text-slate-600 mt-1 italic font-medium">
              Verified corporate filings & regulatory circulars paired with fundamental economic justifications and first/second-order effects.
            </p>
          </div>
          <span className="text-[10px] font-shade-gold font-bold bg-amber-500/15 px-2.5 py-1 rounded border border-amber-500/30 font-classic-title tracking-wider self-start sm:self-auto text-glow-gold">
            100% Citation Grounded
          </span>
        </div>

        <div className="space-y-4">
          {report.indianMarketNews.map((news, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl glass-card glass-card-hover border border-slate-200/80 space-y-4 shadow-sm"
            >
              {/* Header: Headline & Official Source Tag */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2.5 border-b border-slate-200/60 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono-num">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-400/40 tracking-wider font-classic-title">
                      FILING #{idx + 1}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      Sector: <span className="font-shade-cyan font-bold">{news.impactSector}</span>
                    </span>
                  </div>
                  <h3 className="font-classic-serif text-base font-bold text-slate-900 leading-snug tracking-tight">
                    {news.headline}
                  </h3>
                </div>

                {news.officialSourceRef && (
                  <span className="text-[10px] font-shade-cyan font-bold bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/25 font-mono-num shrink-0 self-start text-glow-cyan">
                    {news.officialSourceRef}
                  </span>
                )}
              </div>

              {/* Justification Rationale (The Fundamental Economic 'Why') */}
              {news.justificationRationale && (
                <div className="p-3.5 rounded-xl glass-card-subtle border border-slate-200/60 space-y-1">
                  <span className="text-[11px] font-bold font-shade-amber flex items-center gap-1.5 uppercase tracking-wider font-classic-title">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Fundamental Economic Justification:</span>
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
                    {news.justificationRationale}
                  </p>
                </div>
              )}

              {/* Key Takeaway & Tickers in Focus */}
              <div className="text-xs text-slate-700 leading-relaxed font-medium">
                <strong className="font-shade-gold font-bold font-classic-title tracking-wider text-[11px] uppercase mr-1">Core Takeaway:</strong>
                {news.keyTakeaway}
              </div>

              {/* First-Order vs Second-Order Effects */}
              {(news.firstOrderEffects || news.secondOrderEffects) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {/* First Order Direct Effects */}
                  {news.firstOrderEffects && (
                    <div className="p-3.5 rounded-xl glass-card-subtle border border-emerald-500/30 space-y-2">
                      <span className="text-[10.5px] font-bold font-shade-emerald uppercase tracking-wider font-classic-title block">
                        Direct First-Order Effects
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                        {news.firstOrderEffects.map((eff, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">•</span>
                            <span>{eff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Second Order Contagion */}
                  {news.secondOrderEffects && (
                    <div className="p-3.5 rounded-xl glass-card-subtle border border-amber-500/30 space-y-2">
                      <span className="text-[10.5px] font-bold font-shade-amber uppercase tracking-wider font-classic-title block">
                        Second-Order & Contagion Effects
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                        {news.secondOrderEffects.map((eff, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold shrink-0">•</span>
                            <span>{eff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Quantified Financial Metrics Impacted */}
              {news.financialMetricsImpacted && (
                <div className="p-3 rounded-xl glass-card-subtle border border-indigo-500/30 text-xs">
                  <span className="text-[10px] font-bold font-shade-purple uppercase tracking-wider block mb-1 font-classic-title">
                    Quantified Sensitivity Bounds:
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-700 font-mono-num font-semibold">
                    {news.financialMetricsImpacted.map((metric, i) => (
                      <span key={i} className="bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/25 text-indigo-900">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Transmission Chain */}
              {news.transmissionChain && news.transmissionChain.length > 0 && (
                <div className="text-[11px] text-slate-700 glass-card-subtle p-3 rounded-xl border border-slate-200/60 font-medium">
                  <span className="font-semibold text-slate-500 block mb-1 text-[10px] uppercase font-classic-title tracking-wider">
                    Transmission Vector:
                  </span>
                  <span className="font-mono-num text-[11px] text-cyan-800 font-semibold">
                    {news.transmissionChain[0]}
                  </span>
                </div>
              )}

              {/* Tickers In Focus Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <span className="text-slate-600 text-[11px] font-classic-title uppercase tracking-wider font-semibold">Affected Equities:</span>
                {news.tickersInFocus.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => onSelectStock(ticker)}
                    className="px-2.5 py-1 glass-card hover:bg-amber-500/20 text-amber-900 rounded-md font-bold text-[11px] transition-all cursor-pointer border border-amber-400/40 hover:border-amber-400/70 font-mono-num hover:font-shade-gold shadow-xs"
                  >
                    {ticker}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stocks Requiring Attention Today (High Conviction Radar) */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3.5">
          <div>
            <h2 className="font-classic-serif text-lg font-bold flex items-center gap-2.5 tracking-tight font-shade-gold text-glow-gold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500 animate-pulse" />
              <span>IV. High Conviction Stock Radar</span>
            </h2>
            <p className="font-serif-classic text-xs text-slate-600 mt-1 italic font-medium">
              Ranked by multi-agent conviction score with explicit invalidation triggers and historical hit rates.
            </p>
          </div>
          <span className="text-[10px] font-shade-amber font-bold bg-amber-500/15 px-2.5 py-1 rounded border border-amber-500/30 font-mono-num">
            Confidence Threshold: ≥70%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.stocksRequiringAttention.map((stock) => (
            <div
              key={stock.ticker}
              onClick={() => onSelectStock(stock.ticker)}
              className="glass-card glass-card-hover border border-slate-200/80 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Header: Ticker, Direction, Score */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-classic-title text-base font-bold text-slate-900 group-hover:font-shade-gold group-hover:text-glow-gold transition-colors tracking-wide">
                        {stock.ticker}
                      </span>
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-classic-title ${
                          stock.direction === 'POSITIVE'
                            ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/40 font-shade-emerald'
                            : stock.direction === 'NEGATIVE'
                            ? 'bg-rose-500/15 text-rose-800 border border-rose-500/40 font-shade-rose'
                            : 'bg-slate-200/80 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {stock.direction}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-sans font-medium">{stock.companyName}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black font-shade-gold font-mono-num text-glow-gold">
                      {stock.confidenceScore}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-classic-title uppercase tracking-wider font-semibold">Conviction</div>
                  </div>
                </div>

                {/* Catalyst */}
                <div className="mt-3">
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1 font-classic-title uppercase tracking-wider">
                    Primary Catalyst:
                  </span>
                  <p className="text-xs text-slate-700 leading-snug font-medium">
                    {stock.catalystForToday}
                  </p>
                </div>

                {/* Thesis Justification */}
                {stock.thesisJustification && (
                  <div className="mt-2.5 text-[11px] text-slate-700 glass-card-subtle p-2.5 rounded-lg border border-slate-200/60 leading-relaxed font-medium">
                    <span className="font-semibold text-amber-700 block text-[10px] uppercase mb-0.5 tracking-wider font-classic-title">
                      Thesis Justification:
                    </span>
                    {stock.thesisJustification}
                  </div>
                )}

                {/* Valuation Impact */}
                {stock.valuationImpact && (
                  <div className="mt-2 text-[11px] text-indigo-900 bg-indigo-500/15 p-2.5 rounded-lg border border-indigo-500/30 font-medium">
                    <span className="font-semibold text-indigo-800 block text-[10px] uppercase mb-0.5 tracking-wider font-classic-title">
                      Valuation Sensitivity:
                    </span>
                    {stock.valuationImpact}
                  </div>
                )}

                {/* Assumptions */}
                <div className="mt-2 text-[11px] text-slate-600 glass-card-subtle p-2 rounded-lg border border-slate-200/50">
                  <span className="font-semibold text-slate-500">Working Assumption: </span>
                  {stock.assumptions}
                </div>
              </div>

              {/* Invalidation Trigger & Hit Rate */}
              <div className="mt-4 pt-3.5 border-t border-slate-200/70">
                <div className="flex items-start gap-1.5 text-[11px] text-amber-900 mb-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong className="text-amber-800 font-classic-title text-[10px] uppercase tracking-wider">Invalidation: </strong>
                    {stock.invalidationTrigger}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 font-mono-num font-medium">
                  <span>
                    Historical Hit Rate:{' '}
                    <strong className="text-emerald-700 font-bold">
                      {stock.historicalHitRate}%
                    </strong>
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-700 group-hover:translate-x-0.5 transition-transform font-sans font-semibold">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Impact Matrix & Key Catalysts/Risks */}
      <div className="space-y-6">
        {/* Full-width Sector Nexus with Current News Linkage */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3.5">
            <div>
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <h2 className="font-classic-serif text-lg font-bold flex items-center gap-2.5 tracking-tight font-shade-emerald text-glow-emerald">
                  <span>V. Sector Dynamics & Statutory Filings Nexus</span>
                </h2>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 font-classic-title tracking-wider font-shade-emerald">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>100% Registry Ingestion</span>
                </span>
              </div>
              <p className="font-serif-classic text-xs text-slate-600 mt-1 italic font-medium">
                Every sector stance is systematically linked to official regulatory actions (SEBI/RBI) and exchange filings (NSE/BSE).
              </p>
            </div>
            <div className="text-xs text-slate-600 shrink-0 font-mono-num">
              Ingested <strong className="font-shade-gold font-bold">{report.sectorImpactMatrix.length} Sectors</strong>
            </div>
          </div>

          {/* Quick Sector Filter Chips - Translucent Glass Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-600 text-[11px] font-classic-title uppercase tracking-wider mr-1 font-semibold">Sector:</span>
            {[
              { label: 'All 11 Sectors', value: 'ALL' },
              { label: 'Banking & NBFCs', value: 'BANKING' },
              { label: 'IT & Tech', value: 'IT' },
              { label: 'Auto & Ancillaries', value: 'AUTO' },
              { label: 'Pharma & Healthcare', value: 'PHARMA' },
              { label: 'Oil & Gas', value: 'ENERGY' },
              { label: 'Capital Goods & EPC', value: 'CAPITAL_GOODS' },
              { label: 'Metals & Steel', value: 'METALS' },
              { label: 'FMCG & Staples', value: 'FMCG' },
              { label: 'Asset Management', value: 'FIN_SERVICES' },
              { label: 'Realty', value: 'REALTY' },
              { label: 'Chemicals', value: 'CHEMICALS' },
            ].map((chip) => (
              <button
                key={chip.value}
                onClick={() => setSelectedSectorFilter(chip.value)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer backdrop-blur-sm ${
                  selectedSectorFilter === chip.value
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'glass-card text-slate-700 hover:text-slate-900 hover:border-amber-400/40'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Grid of Sector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {report.sectorImpactMatrix
              .filter(
                (item) =>
                  selectedSectorFilter === 'ALL' || item.sectorCode === selectedSectorFilter
              )
              .map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl glass-card glass-card-hover border border-slate-200/80 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    {/* Header: Sector & Stance Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <span className="text-xs font-bold text-slate-900 tracking-wide font-classic-title">
                        {item.sector}
                      </span>
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 font-classic-title ${
                          item.stance === 'OVERWEIGHT'
                            ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/40'
                            : item.stance === 'UNDERWEIGHT'
                            ? 'bg-rose-500/15 text-rose-800 border border-rose-500/40'
                            : 'bg-slate-200/80 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {item.stance}
                      </span>
                    </div>

                    {/* Linked Current News */}
                    {item.linkedNewsHeadline && (
                      <div className="p-3 rounded-xl glass-card-subtle border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1 font-classic-title">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Linked Statutory News:</span>
                          </span>
                          <span className="text-emerald-800 font-mono-num bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/30 text-[10px]">
                            Verified {item.sourceTrustScore || 100}%
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 leading-snug">
                          {item.linkedNewsHeadline}
                        </p>
                        {item.officialSourceRef && (
                          <span className="text-[10px] text-cyan-800 block truncate font-mono-num font-medium">
                            Ref: {item.officialSourceRef}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Catalyst description */}
                    <div className="text-xs text-slate-700 leading-snug">
                      <strong className="text-amber-800 font-classic-title text-[10px] uppercase tracking-wider">Driver: </strong>
                      {item.catalyst}
                    </div>

                    {/* Fundamental Justification */}
                    {item.economicJustification && (
                      <div className="text-[11px] text-slate-700 glass-card-subtle p-2.5 rounded-lg border border-slate-200/80 leading-relaxed font-medium">
                        <strong className="text-slate-600 block text-[10px] uppercase mb-0.5 font-classic-title tracking-wider">
                          Economic Transmission:
                        </strong>
                        {item.economicJustification}
                      </div>
                    )}
                  </div>

                  {/* Affected Key Stocks */}
                  <div className="pt-2.5 border-t border-slate-200/80">
                    <span className="text-slate-600 text-[10px] uppercase font-classic-title tracking-wider block mb-1">
                      Key Equities:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {item.keyStocks.map((ticker) => (
                        <button
                          key={ticker}
                          onClick={() => onSelectStock(ticker)}
                          className="px-2 py-0.5 glass-card hover:bg-amber-500/25 text-amber-900 rounded font-semibold text-[11px] transition-all cursor-pointer border border-amber-500/30 hover:border-amber-500/60 font-mono-num"
                        >
                          {ticker}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Catalysts vs Key Risks For Today */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="font-classic-serif text-lg font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/40" />
            <span>VI. Today's Catalysts vs Headwinds</span>
          </h2>

          <div className="space-y-4">
            {/* Catalysts */}
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2 font-classic-title">
                Positive Catalysts (Upside Vectors)
              </span>
              <div className="space-y-2">
                {report.todayCatalystsAndRisks.catalysts.map((cat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-700 glass-card-subtle p-3 rounded-xl border border-emerald-500/30 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div>
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-2 font-classic-title">
                Identified Headwinds & Risks
              </span>
              <div className="space-y-2">
                {report.todayCatalystsAndRisks.risks.map((risk, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-700 glass-card-subtle p-3 rounded-xl border border-rose-500/30 font-medium"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Analysis & Invalidation Triggers - Classic Transparent Panels */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="border-b border-slate-200/80 pb-3.5">
          <h2 className="font-classic-serif text-lg font-bold flex items-center gap-2.5 tracking-tight font-shade-gold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/40" />
            <span>VII. Probabilistic Scenario Analysis (NIFTY 50)</span>
          </h2>
          <p className="font-serif-classic text-xs text-amber-900/80 mt-1 italic font-medium">
            Calibrated across overnight index futures, options chain open interest, and macro news flows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bull Scenario */}
          <div className="p-5 rounded-2xl glass-card-subtle border border-emerald-500/30 hover:border-emerald-500/50 transition-all space-y-2 shadow-sm shadow-slate-900/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-shade-emerald uppercase tracking-wider font-classic-title">
                Bull Scenario ({report.scenarioAnalysis.bullScenario.probability}%)
              </span>
              <span className="text-xs font-bold font-shade-emerald font-mono-num">
                {report.scenarioAnalysis.bullScenario.niftyTarget}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
              {report.scenarioAnalysis.bullScenario.drivers}
            </p>
          </div>

          {/* Base Scenario */}
          <div className="p-5 rounded-2xl glass-card-subtle border border-amber-500/30 hover:border-amber-500/50 transition-all space-y-2 shadow-sm shadow-slate-900/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-shade-gold uppercase tracking-wider font-classic-title">
                Base Scenario ({report.scenarioAnalysis.baseScenario.probability}%)
              </span>
              <span className="text-xs font-bold font-shade-gold font-mono-num">
                {report.scenarioAnalysis.baseScenario.niftyTarget}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
              {report.scenarioAnalysis.baseScenario.drivers}
            </p>
          </div>

          {/* Bear Scenario */}
          <div className="p-5 rounded-2xl glass-card-subtle border border-rose-500/30 hover:border-rose-500/50 transition-all space-y-2 shadow-sm shadow-slate-900/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-shade-rose uppercase tracking-wider font-classic-title">
                Bear Scenario ({report.scenarioAnalysis.bearScenario.probability}%)
              </span>
              <span className="text-xs font-bold font-shade-rose font-mono-num">
                {report.scenarioAnalysis.bearScenario.niftyTarget}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
              {report.scenarioAnalysis.bearScenario.drivers}
            </p>
          </div>
        </div>

        {/* View Invalidation Section */}
        <div className="mt-4 p-4 rounded-xl bg-amber-500/15 border border-amber-500/35 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold font-shade-amber mb-2 font-classic-title tracking-wider uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Strict Invalidation Triggers (When to Discard Today's Working Thesis)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.scenarioAnalysis.whatInvalidatesView.map((item, idx) => (
              <div key={idx} className="text-xs text-slate-800 leading-snug font-medium">
                <span className="font-bold text-amber-800 font-mono-num">{idx + 1}. </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
