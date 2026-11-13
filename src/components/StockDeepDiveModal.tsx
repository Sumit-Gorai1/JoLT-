import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bot,
  Shield,
  Loader2,
} from 'lucide-react';
import { todayMorningReport, sectorIntelligenceData } from '../data/mockMarketData';

interface LiveStockQuote {
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  fetchedAtIST?: string;
}

interface StockDeepDiveModalProps {
  ticker: string | null;
  onClose: () => void;
  liveStockQuotes?: Record<string, LiveStockQuote>;
}

function buildClientFallbackStockData(ticker: string) {
  const cleanSym = ticker.toUpperCase().replace(/\.(NS|BO)$/i, '');
  const highlight = todayMorningReport.stocksRequiringAttention.find(
    (s) => s.ticker.toUpperCase().replace(/\.(NS|BO)$/i, '') === cleanSym
  );

  let matchedSector = '';
  let matchedCompany = highlight?.companyName || '';
  let matchedRole = highlight?.catalystForToday || '';

  for (const sec of sectorIntelligenceData) {
    const found = sec.keyListedStocks.find(
      (st) => st.ticker.toUpperCase().replace(/\.(NS|BO)$/i, '') === cleanSym
    );
    if (found) {
      matchedSector = `${sec.name} (${found.industry})`;
      if (!matchedCompany) matchedCompany = found.companyName;
      if (!matchedRole) matchedRole = found.primaryMacroDriver;
      break;
    }
  }

  return {
    ticker,
    companyName: matchedCompany || `${cleanSym} Ltd (NSE Listed)`,
    sector: matchedSector || 'Indian Listed Equities',
    currentRegimeSensitivity: 'Tracked under RBI Tightening & Domestic Institutional Flows',
    convictionScore: highlight ? highlight.confidenceScore : 78,
    primaryDrivers: [
      matchedRole || 'Domestic institutional accumulation and resilient sector demand.',
      'Balance-sheet capital allocation discipline and margin stability.',
      'Tracked across NSE/BSE regulatory disclosures and quarterly filings.',
    ],
    transmissionRisks: [
      'Global commodity input inflation or elevated Brent crude volatility',
      'Foreign institutional investor (FPI) positioning shifts around policy events',
    ],
    scenarios: {
      bull: 'Sustained EBITDA margin defense and order-book acceleration above baseline.',
      base: 'Rangebound consolidation aligned with NIFTY 50 institutional liquidity.',
      bear: 'Macro input cost shock compressing operating margins by 100-150 bps.',
    },
    invalidationTriggers: [
      'Sustained close below 200-day moving average on 2x delivery volume',
      'Material earnings guidance revision or adverse regulatory action',
    ],
    agentVotes: [
      { agent: 'Fundamental Agent', rating: 'OVERWEIGHT', keyObservation: 'Healthy return ratios and steady institutional ownership' },
      { agent: 'Technical Agent', rating: 'NEUTRAL_TO_BULLISH', keyObservation: 'Consolidating near key institutional accumulation support' },
      { agent: 'Geopolitical Agent', rating: 'MONITOR', keyObservation: 'Indirect sensitivity to global energy and FX movements' },
      { agent: 'Risk Agent', rating: 'CONTROLLED', keyObservation: 'Falsifiable stop levels calibrated against historical volatility' },
    ],
  };
}

function getLocalBaselineQuote(ticker: string): LiveStockQuote | null {
  const cleanSym = ticker.toUpperCase().replace(/\.(NS|BO)$/i, '');
  for (const sec of sectorIntelligenceData) {
    const found = sec.keyListedStocks.find(
      (st) => st.ticker.toUpperCase().replace(/\.(NS|BO)$/i, '') === cleanSym
    );
    if (found) {
      const change = Math.round(((found.price * found.changePercent) / 100) * 100) / 100;
      return {
        price: found.price,
        change,
        changePercent: found.changePercent,
        isPositive: found.changePercent >= 0,
      };
    }
  }
  return null;
}

export const StockDeepDiveModal: React.FC<StockDeepDiveModalProps> = ({
  ticker,
  onClose,
  liveStockQuotes,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [liveQuote, setLiveQuote] = useState<LiveStockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const liveStockQuotesRef = useRef(liveStockQuotes);
  liveStockQuotesRef.current = liveStockQuotes;

  // Sync incoming cached quote updates without aborting in-flight stock analysis
  useEffect(() => {
    if (!ticker || !liveStockQuotes?.[ticker]) return;
    setLiveQuote((prev) => prev ?? liveStockQuotes[ticker]);
  }, [ticker, liveStockQuotes]);

  useEffect(() => {
    if (!ticker) {
      setData(null);
      setLiveQuote(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setData(null);
    setLiveQuote(liveStockQuotesRef.current?.[ticker] || getLocalBaselineQuote(ticker));
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort('timeout');
      }
    }, 12000);

    // Fetch live share quote concurrently
    fetch(`/api/live-quote/${encodeURIComponent(ticker)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (isMounted && res?.success && res.data && typeof res.data.price === 'number') {
          setLiveQuote({
            price: res.data.price,
            change: res.data.change,
            changePercent: res.data.changePercent,
            isPositive: res.data.isPositive,
            fetchedAtIST: res.data.fetchedAtIST,
          });
        }
      })
      .catch(() => {
        // Ignore abort / transient quote errors and keep cached or baseline quote
      });

    fetch('/api/analyze-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((res) => {
        if (isMounted) {
          if (res.success && res.data) {
            setData(res.data);
          } else {
            setData(buildClientFallbackStockData(ticker));
          }
        }
      })
      .catch((err) => {
        if (!isMounted || controller.signal.reason === 'unmount') {
          return;
        }
        if (err?.name !== 'AbortError') {
          console.warn('Stock analysis fallback activated:', err?.message || err);
        }
        setData(buildClientFallbackStockData(ticker));
      })
      .finally(() => {
        clearTimeout(timeoutId);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (!controller.signal.aborted) {
        controller.abort('unmount');
      }
    };
  }, [ticker]);

  if (!ticker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-modal rounded-3xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto space-y-5 border border-white/80 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-1.5 rounded-xl glass-card border border-slate-200/90 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
          aria-label="Close stock analysis"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200/80 pb-4 pr-8">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-shade-primary tracking-tight font-classic-serif">
                {ticker}
              </h2>
              <span className="text-[10px] font-bold badge-dynamic-shade px-2.5 py-0.5 rounded-md font-classic-title uppercase tracking-wider">
                NSE Listed
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-serif-classic italic font-medium">
              {data?.companyName || 'National Stock Exchange of India'} · {data?.sector || 'Equities'}
            </p>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            {liveQuote && (
              <div className="text-left sm:text-right border-r border-slate-200/80 pr-5">
                <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">
                  Current Share Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono-num">
                    ₹{liveQuote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono-num ${
                      liveQuote.isPositive ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {liveQuote.isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {liveQuote.isPositive ? '+' : ''}
                      {liveQuote.changePercent.toFixed(2)}%
                    </span>
                  </span>
                </div>
              </div>
            )}

            <div className="text-right">
              <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Agent Conviction</span>
              <span className="text-2xl font-bold font-shade-primary font-mono-num">
                {data?.convictionScore || 82}%
              </span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-600 font-serif-classic italic font-medium">
              Querying multi-agent consensus for {ticker}...
            </p>
          </div>
        )}

        {!loading && data && (
          <div className="space-y-5">
            {/* Regime Sensitivity */}
            <div className="glass-card p-3.5 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs">
              <span className="text-slate-600 font-classic-title uppercase tracking-wider text-[11px] font-bold">Current Market Regime Sensitivity:</span>
              <span className="font-bold text-slate-900 font-mono-num">{data.currentRegimeSensitivity}</span>
            </div>

            {/* Drivers vs Transmission Risks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl glass-card border border-slate-200/90 space-y-2.5 shadow-2xs">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-classic-title uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Key Structural Drivers</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-sans font-medium">
                  {data.primaryDrivers?.map((d: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 shrink-0 font-bold">▪</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl glass-card border border-slate-200/90 space-y-2.5 shadow-2xs">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 font-classic-title uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                  <span>Transmission & Margin Risks</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-sans font-medium">
                  {data.transmissionRisks?.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-700 shrink-0 font-bold">▪</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Scenarios */}
            {data.scenarios && (
              <div className="p-4 rounded-xl glass-card border border-slate-200/90 space-y-3 shadow-2xs">
                <span className="text-xs font-bold font-shade-primary block font-classic-title uppercase tracking-wider">
                  Probabilistic Scenario Outlook
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg glass-card-subtle border border-emerald-500/35 bg-emerald-500/10">
                    <span className="text-[10px] font-bold text-emerald-900 uppercase block mb-1 font-classic-title tracking-wider">
                      Bull Case
                    </span>
                    <p className="text-slate-700 text-[11px] leading-relaxed font-serif-classic italic font-medium">{data.scenarios.bull}</p>
                  </div>
                  <div className="p-3 rounded-lg glass-card-subtle border border-slate-300 bg-slate-100/60">
                    <span className="text-[10px] font-bold text-slate-800 uppercase block mb-1 font-classic-title tracking-wider">
                      Base Case
                    </span>
                    <p className="text-slate-700 text-[11px] leading-relaxed font-serif-classic italic font-medium">{data.scenarios.base}</p>
                  </div>
                  <div className="p-3 rounded-lg glass-card-subtle border border-rose-500/35 bg-rose-500/10">
                    <span className="text-[10px] font-bold text-rose-900 uppercase block mb-1 font-classic-title tracking-wider">
                      Bear Case
                    </span>
                    <p className="text-slate-700 text-[11px] leading-relaxed font-serif-classic italic font-medium">{data.scenarios.bear}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Invalidation Triggers */}
            {data.invalidationTriggers && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs">
                <span className="font-bold text-rose-900 block mb-1.5 font-classic-title uppercase tracking-wider">
                  Conditions That Invalidate This View:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-800 text-[11.5px] leading-relaxed font-medium">
                  {data.invalidationTriggers.map((trig: string, i: number) => (
                    <li key={i}>{trig}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agent Votes */}
            {data.agentVotes && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-classic-title uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Agent Network Consensus Votes:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  {data.agentVotes.map((v: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-lg glass-card border border-slate-200/90 shadow-2xs">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-slate-900">{v.agent}</span>
                        <span className="font-bold font-shade-primary font-mono-num">{v.rating}</span>
                      </div>
                      <p className="text-slate-600 leading-snug font-medium">{v.keyObservation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="pt-3 border-t border-slate-200/80 text-[10px] text-slate-600 flex items-center gap-1.5 font-serif-classic italic font-medium">
              <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                JoLT is an institutional intelligence platform. Analyses are evidence-based probabilistic estimates, not investment advice.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
