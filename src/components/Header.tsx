import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Search,
  Sparkles,
  Layers,
  Palette,
  ArrowUpRight,
  Newspaper,
  Building2,
} from 'lucide-react';
import {
  liveMarketIndices,
  todayMorningReport,
  sectorIntelligenceData,
} from '../data/mockMarketData';
import type { ColorPalette } from '../App';
import type { NewsIntelligenceItem } from '../types/market';
import { JoltLogo } from './JoltLogo';

interface HeaderProps {
  onOpenCustomAnalysis: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectStock: (ticker: string) => void;
  newsItems: NewsIntelligenceItem[];
  activeTab: 'morning_report' | 'live_news' | 'sector_intelligence' | 'finbert_lab' | 'agent_network' | 'backtest_guardrails';
  onSelectTab: (tab: 'morning_report' | 'live_news' | 'sector_intelligence' | 'finbert_lab' | 'agent_network' | 'backtest_guardrails') => void;
  palette: ColorPalette;
  onChangePalette: (palette: ColorPalette) => void;
  liveIndices?: Array<{
    name: string;
    value: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
    source: string;
  }>;
  liveFetchedAt?: string;
}

interface SearchableStock {
  ticker: string;
  symbol: string;
  companyName: string;
  sector: string;
  rationale?: string;
}

const BASE_NSE_STOCKS: Array<{ ticker: string; companyName: string; sector: string }> = [
  { ticker: 'RELIANCE.NS', companyName: 'Reliance Industries Ltd', sector: 'Energy, Refining & Telecom' },
  { ticker: 'TCS.NS', companyName: 'Tata Consultancy Services Ltd', sector: 'IT Services & Technology' },
  { ticker: 'HDFCBANK.NS', companyName: 'HDFC Bank Ltd', sector: 'Banking & Financial Services' },
  { ticker: 'ICICIBANK.NS', companyName: 'ICICI Bank Ltd', sector: 'Banking & Financial Services' },
  { ticker: 'INFY.NS', companyName: 'Infosys Ltd', sector: 'IT Services & Technology' },
  { ticker: 'SBIN.NS', companyName: 'State Bank of India', sector: 'Public Sector Banking' },
  { ticker: 'BHARTIARTL.NS', companyName: 'Bharti Airtel Ltd', sector: 'Telecom & Digital Services' },
  { ticker: 'ITC.NS', companyName: 'ITC Limited', sector: 'FMCG & Consumer' },
  { ticker: 'LT.NS', companyName: 'Larsen & Toubro Ltd', sector: 'Infrastructure & Capital Goods' },
  { ticker: 'HAL.NS', companyName: 'Hindustan Aeronautics Limited', sector: 'Defence & Aerospace' },
  { ticker: 'BEL.NS', companyName: 'Bharat Electronics Limited', sector: 'Defence Electronics' },
  { ticker: 'BPCL.NS', companyName: 'Bharat Petroleum Corporation Ltd', sector: 'Oil & Gas / Downstream' },
  { ticker: 'ONGC.NS', companyName: 'Oil & Natural Gas Corporation', sector: 'Upstream Oil & Gas' },
  { ticker: 'BAJFINANCE.NS', companyName: 'Bajaj Finance Ltd', sector: 'NBFC & Consumer Lending' },
  { ticker: 'TITAN.NS', companyName: 'Titan Company Ltd', sector: 'Consumer Discretionary & Jewellery' },
  { ticker: 'ASIANPAINT.NS', companyName: 'Asian Paints Ltd', sector: 'Paints & Coatings' },
  { ticker: 'ZOMATO.NS', companyName: 'Zomato Ltd (Eternal)', sector: 'Consumer Tech & Quick Commerce' },
  { ticker: 'TRENT.NS', companyName: 'Trent Limited', sector: 'Retail & Apparel' },
  { ticker: 'ADANIENT.NS', companyName: 'Adani Enterprises Ltd', sector: 'Diversified Infrastructure' },
  { ticker: 'ADANIPORTS.NS', companyName: 'Adani Ports & SEZ Ltd', sector: 'Ports & Logistics' },
];

const PALETTE_OPTIONS: Array<{
  id: ColorPalette;
  label: string;
  swatchClass: string;
}> = [
  {
    id: 'aurora',
    label: 'Aurora',
    swatchClass: 'bg-gradient-to-r from-indigo-600 via-sky-500 to-teal-500',
  },
  {
    id: 'sapphire',
    label: 'Cobalt',
    swatchClass: 'bg-gradient-to-r from-blue-800 via-cyan-500 to-amber-500',
  },
  {
    id: 'emerald',
    label: 'Jade',
    swatchClass: 'bg-gradient-to-r from-emerald-700 via-teal-500 to-sky-500',
  },
  {
    id: 'orchid',
    label: 'Orchid',
    swatchClass: 'bg-gradient-to-r from-purple-700 via-rose-500 to-amber-500',
  },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenCustomAnalysis,
  searchQuery,
  onSearchChange,
  onSelectStock,
  newsItems,
  activeTab,
  onSelectTab,
  palette,
  onChangePalette,
  liveIndices,
  liveFetchedAt,
}) => {
  const [istTime, setIstTime] = useState('');
  const [marketStatus, setMarketStatus] = useState<'PRE_MARKET' | 'NORMAL_TRADING' | 'POST_MARKET'>('PRE_MARKET');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setIstTime(istStr + ' IST');

      const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      if (totalMinutes >= 555 && totalMinutes <= 930) {
        setMarketStatus('NORMAL_TRADING');
      } else if (totalMinutes >= 480 && totalMinutes < 555) {
        setMarketStatus('PRE_MARKET');
      } else {
        setMarketStatus('POST_MARKET');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build deduplicated searchable stock catalog from report, sectors, news stream, and blue-chips
  const stockCatalog = useMemo<SearchableStock[]>(() => {
    const map = new Map<string, SearchableStock>();

    const upsert = (ticker: string, companyName: string, sector: string, rationale?: string) => {
      const cleanTicker = ticker.trim().toUpperCase();
      const symbol = cleanTicker.replace(/\.(NS|BO)$/i, '');
      if (!symbol) return;
      const existing = map.get(symbol);
      if (!existing) {
        map.set(symbol, {
          ticker: cleanTicker.includes('.') ? cleanTicker : `${symbol}.NS`,
          symbol,
          companyName,
          sector,
          rationale,
        });
      } else if (rationale && !existing.rationale) {
        existing.rationale = rationale;
      }
    };

    todayMorningReport.stocksRequiringAttention.forEach((s) =>
      upsert(s.ticker, s.companyName, 'Morning Focus', s.catalystForToday)
    );

    sectorIntelligenceData.forEach((sec) => {
      sec.keyListedStocks.forEach((st) => {
        upsert(st.ticker, st.companyName, sec.name, st.primaryMacroDriver);
      });
    });

    newsItems.forEach((item) => {
      item.affectedTickers.forEach((t) => {
        upsert(t.ticker, t.companyName, t.sector, t.transmissionExplanation);
      });
    });

    BASE_NSE_STOCKS.forEach((st) => upsert(st.ticker, st.companyName, st.sector));

    return Array.from(map.values());
  }, [newsItems]);

  const searchResults = useMemo(() => {
    const raw = searchQuery.trim();
    const q = raw.toLowerCase();

    if (!q) {
      return {
        stocks: stockCatalog.slice(0, 6),
        sectors: [],
        matchingNewsCount: 0,
        customTicker: null as string | null,
      };
    }

    const qNoSuffix = q.replace(/\.(ns|bo)$/i, '');

    const scoredStocks = stockCatalog
      .map((st) => {
        const sym = st.symbol.toLowerCase();
        const name = st.companyName.toLowerCase();
        const sec = st.sector.toLowerCase();
        let score = 0;
        if (sym === qNoSuffix) score = 100;
        else if (sym.startsWith(qNoSuffix)) score = 80;
        else if (name.startsWith(q)) score = 65;
        else if (sym.includes(qNoSuffix)) score = 50;
        else if (name.includes(q)) score = 40;
        else if (sec.includes(q)) score = 20;
        return { st, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.st);

    const matchingSectors = sectorIntelligenceData
      .filter(
        (sec) =>
          sec.name.toLowerCase().includes(q) ||
          sec.benchmarkIndex.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchingNewsCount = newsItems.filter(
      (item) =>
        item.headline.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.affectedTickers.some(
          (t) =>
            t.ticker.toLowerCase().includes(q) ||
            t.companyName.toLowerCase().includes(q) ||
            t.sector.toLowerCase().includes(q)
        )
    ).length;

    const cleanUpper = raw.toUpperCase().replace(/[^A-Z0-9&-]/g, '');
    const exactMatchExists = scoredStocks.some((s) => s.symbol === cleanUpper);
    const customTicker =
      cleanUpper.length >= 2 && cleanUpper.length <= 15 && !exactMatchExists
        ? `${cleanUpper}.NS`
        : null;

    return {
      stocks: scoredStocks,
      sectors: matchingSectors,
      matchingNewsCount,
      customTicker,
    };
  }, [searchQuery, stockCatalog, newsItems]);

  const handleSelectStockResult = (ticker: string) => {
    setIsSearchOpen(false);
    onSelectStock(ticker);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalOptions = searchResults.stocks.length + (searchResults.customTicker ? 1 : 0);

    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsSearchOpen(true);
      if (totalOptions > 0) {
        setHighlightedIdx((prev) => (prev + 1) % totalOptions);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (totalOptions > 0) {
        setHighlightedIdx((prev) => (prev - 1 + totalOptions) % totalOptions);
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.stocks.length > 0 && highlightedIdx < searchResults.stocks.length) {
        handleSelectStockResult(searchResults.stocks[highlightedIdx].ticker);
        return;
      }
      if (searchResults.customTicker) {
        handleSelectStockResult(searchResults.customTicker);
        return;
      }
      if (searchResults.sectors.length > 0) {
        setIsSearchOpen(false);
        onSelectTab('sector_intelligence');
        return;
      }
      if (searchResults.matchingNewsCount > 0) {
        setIsSearchOpen(false);
        onSelectTab('live_news');
      }
    }
  };

  return (
    <header className="border-b border-white/80 bg-white/60 backdrop-blur-2xl sticky top-0 z-40 shadow-xs">
      {/* Top Live Ticker & Dynamic Shade Palette Switcher Bar */}
      <div className="border-b border-slate-200/60 bg-white/45 backdrop-blur-md py-1.5 px-4 overflow-x-auto scrollbar-none flex items-center justify-between gap-6 text-xs text-slate-600 select-none">
        <div className="flex items-center gap-3 shrink-0">
          {/* Interactive Dynamic Shade Palette Selector */}
          <div
            className="flex items-center gap-1 bg-white/70 border border-slate-200/80 rounded-lg px-2 py-0.5 shadow-2xs"
            role="group"
            aria-label="Dynamic color shade palette"
          >
            <Palette className="w-3 h-3 text-slate-500 mr-0.5 shrink-0" />
            {PALETTE_OPTIONS.map((opt) => {
              const isSelected = palette === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangePalette(opt.id)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                  title={`Switch to ${opt.label} dynamic shade combination`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${opt.swatchClass} ring-1 ring-white/80`} />
                  <span className="hidden md:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="flex items-center gap-6 whitespace-nowrap font-mono-num text-[11.5px]"
          title={liveFetchedAt ? `Live Market Quotes synced at ${liveFetchedAt}` : 'Live Market Benchmarks'}
        >
          {(liveIndices && liveIndices.length > 0 ? liveIndices : liveMarketIndices).map((idx) => (
            <div key={idx.name} className="flex items-center gap-2">
              <span className="text-slate-600 font-semibold tracking-tight">{idx.name}</span>
              <span className="text-slate-900 font-bold font-mono-num">{idx.value}</span>
              <span
                className={`flex items-center gap-0.5 font-bold ${
                  idx.isPositive ? 'font-shade-emerald text-glow-emerald' : 'font-shade-rose text-glow-rose'
                }`}
              >
                {idx.isPositive ? (
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-600" />
                )}
                <span>{idx.changePercent}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between">
            <JoltLogo
              size="md"
              palette={palette}
              showTagline
              onClick={() => onSelectTab('morning_report')}
            />

            {/* Mobile Market Clock */}
            <div className="flex lg:hidden items-center gap-2 text-xs font-mono-num font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-shade-primary text-glow-primary">{istTime || '05:48 AM IST'}</span>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Global Stock & Sector Search with Instant Dropdown */}
            <div ref={searchContainerRef} className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search stocks (HAL, BPCL, TCS), sectors..."
                value={searchQuery}
                onFocus={() => {
                  setIsSearchOpen(true);
                  setHighlightedIdx(0);
                }}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchOpen(true);
                  setHighlightedIdx(0);
                }}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search NSE and BSE stocks or sectors"
                className="w-full glass-input rounded-lg pl-9 pr-7 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setHighlightedIdx(0);
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              )}

              {/* Instant Search Results Popover */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 sm:w-96 sm:right-0 sm:left-auto top-full mt-2 rounded-2xl glass-modal border border-white/90 shadow-2xl z-50 overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-slate-200/80 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                    <span>
                      {searchQuery.trim() ? 'Matching Equities & Sectors' : 'Featured NSE / BSE Equities'}
                    </span>
                    <span className="font-mono-num text-[10px] text-indigo-700">Enter to open</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-200/60">
                    {/* Stock Matches */}
                    {searchResults.stocks.map((st, idx) => {
                      const isActive = idx === highlightedIdx;
                      return (
                        <button
                          key={st.ticker}
                          type="button"
                          onClick={() => handleSelectStockResult(st.ticker)}
                          onMouseEnter={() => setHighlightedIdx(idx)}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                            isActive ? 'bg-indigo-500/12' : 'hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900 font-mono-num">
                                {st.ticker}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded badge-dynamic-shade font-semibold truncate max-w-[140px]">
                                {st.sector}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                              {st.companyName}
                            </div>
                          </div>
                          <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold font-shade-primary whitespace-nowrap">
                            <span>Deep Dive</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />
                          </span>
                        </button>
                      );
                    })}

                    {/* Direct Custom Ticker Lookup for any NSE stock */}
                    {searchResults.customTicker && (
                      <button
                        type="button"
                        onClick={() => handleSelectStockResult(searchResults.customTicker!)}
                        onMouseEnter={() => setHighlightedIdx(searchResults.stocks.length)}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          highlightedIdx === searchResults.stocks.length
                            ? 'bg-indigo-500/15'
                            : 'hover:bg-indigo-500/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold font-shade-primary truncate">
                              Analyze {searchResults.customTicker}
                            </div>
                            <div className="text-[11px] text-slate-600">
                              Run real-time 10-Agent Stock Deep Dive
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      </button>
                    )}

                    {/* Matching Sectors */}
                    {searchResults.sectors.map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          onSelectTab('sector_intelligence');
                        }}
                        className="w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{sec.name}</div>
                            <div className="text-[11px] text-slate-600 truncate">
                              {sec.benchmarkIndex} · Weight {sec.marketCapWeightPercent}%
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold font-shade-cyan shrink-0">
                          Sector →
                        </span>
                      </button>
                    ))}

                    {/* Matching Live News Shortcut */}
                    {searchQuery.trim() && searchResults.matchingNewsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          onSelectTab('live_news');
                        }}
                        className="w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Newspaper className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="text-xs font-semibold text-slate-800">
                            View {searchResults.matchingNewsCount} matching news item{searchResults.matchingNewsCount > 1 ? 's' : ''} in Live Feed
                          </span>
                        </div>
                        <span className="text-[11px] font-bold font-shade-emerald shrink-0">
                          Filter →
                        </span>
                      </button>
                    )}

                    {/* Empty State */}
                    {searchQuery.trim() &&
                      searchResults.stocks.length === 0 &&
                      searchResults.sectors.length === 0 &&
                      !searchResults.customTicker &&
                      searchResults.matchingNewsCount === 0 && (
                        <div className="px-4 py-4 text-center text-xs text-slate-600">
                          No matches found. Try an NSE symbol like HAL, BPCL, TCS, or RELIANCE.
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Market Clock (Desktop) - Iridescent Glass Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg badge-dynamic-shade text-xs font-mono-num shadow-xs backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 text-indigo-700" />
              <span className="font-shade-primary font-bold text-glow-primary">{istTime || '05:48 AM IST'}</span>
              <span className="text-slate-400">·</span>
              <span
                className={`font-semibold text-[10.5px] tracking-wide ${
                  marketStatus === 'NORMAL_TRADING'
                    ? 'font-shade-emerald text-glow-emerald font-bold'
                    : marketStatus === 'PRE_MARKET'
                    ? 'font-shade-cyan text-glow-cyan font-bold'
                    : 'text-slate-600'
                }`}
              >
                {marketStatus === 'NORMAL_TRADING'
                  ? 'LIVE MARKET (09:15 - 15:30)'
                  : marketStatus === 'PRE_MARKET'
                  ? 'PRE-MARKET PREP'
                  : 'POST-MARKET CUES'}
              </span>
            </div>

            {/* Run Custom Agent Analysis Button - Dynamic Multi-Shade Gradient */}
            <button
              onClick={onOpenCustomAnalysis}
              className="flex items-center gap-1.5 btn-dynamic-primary font-bold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
              <span>Test Event via Gemini</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Dynamic Shade Spectrum per Tab */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/70 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => onSelectTab('morning_report')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'morning_report'
                ? 'bg-gradient-to-r from-indigo-500/18 via-blue-500/16 to-teal-500/18 border border-indigo-400/45 shadow-xs backdrop-blur-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/65 border border-transparent'
            }`}
          >
            <span className={activeTab === 'morning_report' ? 'font-shade-primary font-bold text-glow-primary' : 'font-medium'}>
              Today's Morning Report
            </span>
          </button>
          <button
            onClick={() => onSelectTab('live_news')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'live_news'
                ? 'bg-gradient-to-r from-sky-500/18 via-cyan-500/16 to-teal-500/18 border border-cyan-500/45 shadow-xs backdrop-blur-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/65 border border-transparent'
            }`}
          >
            <span className={activeTab === 'live_news' ? 'font-shade-cyan font-bold text-glow-cyan' : 'font-medium'}>
              Live News & Transmission Feed
            </span>
          </button>
          <button
            onClick={() => onSelectTab('sector_intelligence')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sector_intelligence'
                ? 'bg-gradient-to-r from-rose-500/16 via-orange-500/15 to-amber-500/16 border border-rose-400/40 shadow-xs backdrop-blur-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/65 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-rose-600" />
            <span className={activeTab === 'sector_intelligence' ? 'font-shade-rose font-bold text-glow-rose' : 'font-medium'}>
              Sectors & M&A Heatmap
            </span>
          </button>
          <button
            onClick={() => onSelectTab('finbert_lab')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'finbert_lab'
                ? 'bg-gradient-to-r from-emerald-500/18 via-teal-500/16 to-cyan-500/16 border border-emerald-500/45 shadow-xs backdrop-blur-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/65 border border-transparent'
            }`}
          >
            <span className="text-xs">⚡</span>
            <span className={activeTab === 'finbert_lab' ? 'font-shade-emerald font-bold text-glow-emerald' : 'font-medium'}>
              JoLT Sentiment Engine
            </span>
          </button>
          <button
            onClick={() => onSelectTab('agent_network')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'agent_network'
                ? 'bg-gradient-to-r from-violet-500/18 via-purple-500/16 to-fuchsia-500/16 border border-violet-400/45 shadow-xs backdrop-blur-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/65 border border-transparent'
            }`}
          >
            <span className={activeTab === 'agent_network' ? 'font-shade-purple font-bold' : 'font-medium'}>
              10-Agent Pipeline Inspector
            </span>
          </button>
          <button
            onClick={() => onSelectTab('backtest_guardrails')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'backtest_guardrails'
                ? 'bg-gradient-to-r from-slate-500/15 via-indigo-500/15 to-cyan-500/15 border border-indigo-400/40 shadow-xs backdrop-blur-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/65 border border-transparent'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span className={activeTab === 'backtest_guardrails' ? 'font-shade-silver font-bold' : 'font-medium'}>
              Guardrails & Accuracy Tracking (79.4%)
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
