import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  TrendingUp,
  TrendingDown,
  Building2,
  Handshake,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  PieChart,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { SectorIntelligence, DealActivity } from '../types/market';

interface SectorIntelligenceViewProps {
  sectors: SectorIntelligence[];
  onSelectStock: (ticker: string) => void;
  onOpenCustomAnalysis: () => void;
  globalSearchQuery?: string;
  liveSectorChanges?: Record<string, number>;
  liveStockQuotes?: Record<string, { price: number; change: number; changePercent: number; isPositive: boolean }>;
}

export const SectorIntelligenceView: React.FC<SectorIntelligenceViewProps> = ({
  sectors,
  onSelectStock,
  onOpenCustomAnalysis,
  globalSearchQuery,
  liveSectorChanges,
  liveStockQuotes,
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('ALL');
  const [dealFilter, setDealFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');

  useEffect(() => {
    if (globalSearchQuery !== undefined) {
      setSearchQuery(globalSearchQuery);
    }
  }, [globalSearchQuery]);

  // Merge live fetched sector benchmark changes and individual stock quotes
  const enrichedSectors = useMemo(() => {
    return sectors.map((sec) => {
      const liveChange = liveSectorChanges?.[sec.id];
      const updatedStocks = sec.keyListedStocks.map((st) => {
        const q = liveStockQuotes?.[st.ticker];
        if (!q) return st;
        return {
          ...st,
          price: q.price,
          changePercent: q.changePercent,
        };
      });
      return {
        ...sec,
        indexChangePercent: typeof liveChange === 'number' ? liveChange : sec.indexChangePercent,
        keyListedStocks: updatedStocks,
      };
    });
  }, [sectors, liveSectorChanges, liveStockQuotes]);

  // Selected single sector for detailed drilldown
  const activeSector =
    selectedSectorId === 'ALL'
      ? null
      : enrichedSectors.find((s) => s.id === selectedSectorId) || null;

  // Filtered sectors for list/cards
  const filteredSectors = enrichedSectors.filter((sec) => {
    if (selectedSectorId !== 'ALL' && sec.id !== selectedSectorId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sec.name.toLowerCase().includes(q);
      const matchIndex = sec.benchmarkIndex.toLowerCase().includes(q);
      const matchDynamics = sec.currentDynamics.toLowerCase().includes(q);
      const matchStocks = sec.keyListedStocks.some((st) =>
        st.ticker.toLowerCase().includes(q) || st.companyName.toLowerCase().includes(q)
      );
      if (!matchName && !matchIndex && !matchDynamics && !matchStocks) return false;
    }
    return true;
  });

  // Calculate sector heatmap statistics
  const totalMarketCapWeight = enrichedSectors.reduce((acc, s) => acc + s.marketCapWeightPercent, 0);

  // Collect all deals across sectors
  const allDeals: { sectorName: string; deal: DealActivity }[] = [];
  enrichedSectors.forEach((sec) => {
    sec.dealsAndInvestments.forEach((d) => {
      allDeals.push({ sectorName: sec.name, deal: d });
    });
  });

  const filteredDeals = allDeals.filter(({ deal }) => {
    if (dealFilter !== 'ALL' && deal.dealType !== dealFilter) return false;
    if (selectedSectorId !== 'ALL') {
      const sec = enrichedSectors.find((s) => s.id === selectedSectorId);
      if (sec && !sec.dealsAndInvestments.some((d) => d.id === deal.id)) return false;
    }
    return true;
  });

  // Helper for heatmap tile color
  const getHeatmapColor = (changePercent: number) => {
    if (changePercent >= 1.5) return 'bg-emerald-600/90 text-white border-emerald-400';
    if (changePercent >= 0.5) return 'bg-emerald-500/40 text-emerald-950 border-emerald-500/60 font-semibold';
    if (changePercent > 0) return 'bg-emerald-500/20 text-emerald-950 border-emerald-500/40';
    if (changePercent === 0) return 'bg-slate-200/80 text-slate-800 border-slate-300';
    if (changePercent > -0.8) return 'bg-rose-500/20 text-rose-950 border-rose-500/40';
    if (changePercent > -1.5) return 'bg-rose-500/40 text-rose-950 border-rose-500/60 font-semibold';
    return 'bg-rose-600/90 text-white border-rose-400';
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-900 border border-emerald-500/40">
            BULLISH BIAS
          </span>
        );
      case 'MILDLY_POSITIVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
            MILDLY POSITIVE
          </span>
        );
      case 'BEARISH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-900 border border-rose-500/40">
            BEARISH PRESSURE
          </span>
        );
      case 'MILDLY_BEARISH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-800 border border-rose-500/30">
            MILDLY BEARISH
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/90 text-slate-800 border border-slate-300">
            NEUTRAL CONSOLIDATION
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Sector Intelligence & Deals Overview - Dynamic Iridescent Glass */}
      <div className="glass-panel-dynamic rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-classic-title">
              <span className="px-2.5 py-0.5 rounded-md badge-dynamic-shade text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                <Layers className="w-3.5 h-3.5 text-indigo-700" />
                <span className="font-shade-primary">Sector Nexus & Deal Flow</span>
              </span>
              <span className="text-[11px] font-shade-cyan font-mono-num font-bold">11 NSE/BSE Macro Sectors</span>
            </div>
            <h1 className="font-classic-serif text-2xl sm:text-3xl font-bold tracking-tight font-shade-primary">
              Sector Intelligence, M&A Deals & Relative Heatmap
            </h1>
            <p className="font-serif-classic text-xs sm:text-sm text-slate-700 mt-1.5 max-w-3xl leading-relaxed italic font-medium">
              Track real-time sector transmission dynamics, large institutional investments, mergers & acquisitions, and sovereign outlays mapped directly to listed Indian equities.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCustomAnalysis}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-dynamic-primary font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
              <span>Simulate Sector Shock</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: SECTOR PERFORMANCE HEATMAP (Visual Treemap/Tiles)             */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/40" />
              <h2 className="font-classic-serif text-lg font-bold tracking-tight font-shade-emerald">
                Indian Equities Sector Performance Heatmap
              </h2>
            </div>
            <p className="font-serif-classic text-xs text-slate-600 mt-1 italic font-medium">
              Tile sizes proportional to Nifty market capitalization weight. Colored by session return. Click any tile to isolate.
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono-num font-medium">
            <span className="font-shade-rose font-bold">-2.0%</span>
            <span className="w-4 h-3 rounded bg-rose-600/90 border border-rose-400 inline-block backdrop-blur-xs" />
            <span className="w-4 h-3 rounded bg-rose-500/40 border border-rose-500/60 inline-block backdrop-blur-xs" />
            <span className="w-4 h-3 rounded bg-slate-200/80 border border-slate-300 inline-block backdrop-blur-xs" />
            <span className="w-4 h-3 rounded bg-emerald-500/40 border border-emerald-500/60 inline-block backdrop-blur-xs" />
            <span className="w-4 h-3 rounded bg-emerald-600/90 border border-emerald-400 inline-block backdrop-blur-xs" />
            <span className="font-shade-emerald font-bold">+2.0%</span>
          </div>
        </div>

        {/* Heatmap Grid - Frosted Translucent Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {enrichedSectors.map((sec) => {
            const isSelected = selectedSectorId === sec.id;
            const isPositive = sec.indexChangePercent >= 0;

            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSectorId(isSelected ? 'ALL' : sec.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between min-h-[115px] backdrop-blur-md shadow-xs ${getHeatmapColor(
                  sec.indexChangePercent
                )} ${
                  isSelected
                    ? 'ring-2 ring-indigo-600 scale-[1.02] shadow-lg shadow-indigo-500/15'
                    : 'hover:scale-[1.01] hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1 font-mono-num">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 font-classic-title">
                      {sec.benchmarkIndex}
                    </span>
                    <span className="text-[10px] opacity-85 font-semibold">
                      {sec.marketCapWeightPercent}% Wt
                    </span>
                  </div>
                  <h3 className="text-xs font-black line-clamp-1 group-hover:text-amber-900 transition-colors font-classic-title tracking-tight">
                    {sec.name}
                  </h3>
                </div>

                <div className="pt-2 flex items-end justify-between font-mono-num">
                  <div className="flex items-center gap-1 text-sm font-black">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-800" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}
                      {sec.indexChangePercent.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/70 text-slate-900 font-bold backdrop-blur-xs border border-slate-300">
                    {sec.dealsAndInvestments.length} Deals
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedSectorId !== 'ALL' && (
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 text-xs text-slate-700">
            <span>
              Showing filtered view for{' '}
              <strong className="text-amber-900 font-classic-title font-bold">{activeSector?.name}</strong>
            </span>
            <button
              onClick={() => setSelectedSectorId('ALL')}
              className="text-amber-800 hover:text-amber-950 underline font-bold cursor-pointer"
            >
              Reset to All Sectors
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: DEALS, INVESTMENTS, M&A & JOINT VENTURES TRACKER              */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-800 shrink-0 mt-0.5 backdrop-blur-md">
              <Handshake className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-classic-serif text-lg font-bold text-slate-900 tracking-tight">
                  Major Sector Deals, M&A, Capital Investments & Joint Ventures
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-900 font-bold px-2.5 py-0.5 rounded border border-amber-500/35 font-mono-num">
                  {filteredDeals.length} High-Value Deals
                </span>
              </div>
              <p className="font-serif-classic text-xs text-slate-600 mt-1 italic font-medium">
                Strategic corporate actions, sovereign capital outlays, and private equity deals driving equity market valuations.
              </p>
            </div>
          </div>

          {/* Deal Type Filters - Translucent Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['ALL', 'M&A', 'GOVERNMENT_CAPEX', 'PRIVATE_EQUITY', 'STRATEGIC_STAKE', 'JOINT_VENTURE', 'DIVESTMENT'].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setDealFilter(type)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer backdrop-blur-sm ${
                    dealFilter === type
                      ? 'bg-amber-500/25 text-amber-900 border border-amber-500/40 shadow-xs'
                      : 'glass-card text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {type === 'ALL'
                    ? 'All Deals'
                    : type === 'GOVERNMENT_CAPEX'
                    ? 'Govt Capex'
                    : type === 'STRATEGIC_STAKE'
                    ? 'Strategic Stake'
                    : type === 'PRIVATE_EQUITY'
                    ? 'Private Equity'
                    : type === 'JOINT_VENTURE'
                    ? 'Joint Venture'
                    : type}
                </button>
              )
            )}
          </div>
        </div>

        {/* Deals Cards Grid - Translucent Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDeals.map(({ sectorName, deal }) => (
            <div
              key={deal.id}
              className="p-5 rounded-2xl glass-card glass-card-hover border border-white/[0.08] flex flex-col justify-between space-y-3.5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-900 border border-amber-500/35 font-classic-title tracking-wider">
                      {deal.dealType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-700 font-bold">
                      {sectorName}
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-900 font-mono-num bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/40">
                    {deal.dealValueINR}
                  </span>
                </div>

                <h3 className="font-classic-serif text-base font-bold text-slate-900 leading-snug tracking-tight">
                  {deal.headline}
                </h3>

                <p className="font-sans text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                  {deal.strategicSignificance}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-600 font-medium">
                  <span>Parties: </span>
                  <strong className="text-slate-900 font-bold">{deal.acquirerOrInvestor}</strong> →{' '}
                  <span className="text-slate-700">{deal.targetOrBeneficiary}</span>
                </div>

                {/* Benefited Tickers */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-600 uppercase font-classic-title tracking-wider font-bold">Equities:</span>
                  {deal.listedTickersBenefited.map((ticker) => (
                    <button
                      key={ticker}
                      onClick={() => onSelectStock(ticker)}
                      className="px-2 py-0.5 rounded text-[10.5px] font-mono-num font-bold glass-card hover:bg-amber-500/25 hover:text-amber-950 text-amber-900 border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer shadow-2xs"
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

      {/* ========================================================================= */}
      {/* SECTION 3: DEEP DIVE INTO ALL SECTORS (WHAT IS HAPPENING)                 */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/40" />
              <h2 className="font-classic-serif text-lg font-bold text-slate-900 tracking-tight">
                Sector-by-Sector Comprehensive Intelligence & Macro Dynamics
              </h2>
            </div>
            <p className="font-serif-classic text-xs text-slate-600 mt-1 italic font-medium">
              Detailed breakdown of market drivers, regulatory mandates, and listed large-cap equities across all 11 sectors.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sector or ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none border border-slate-300 font-medium"
            />
          </div>
        </div>

        {/* Sector Cards Feed */}
        <div className="space-y-4">
          {filteredSectors.map((sector) => {
            const isPositive = sector.indexChangePercent >= 0;

            return (
              <div
                key={sector.id}
                className="glass-panel rounded-2xl p-6 transition-all space-y-4 shadow-sm border border-slate-200/80"
              >
                {/* Sector Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-800 font-bold shrink-0 backdrop-blur-md">
                      <Building2 className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-classic-serif text-lg font-bold text-slate-900 tracking-tight">{sector.name}</h3>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-num font-bold glass-card text-amber-900 border border-amber-500/30 bg-amber-500/15">
                          {sector.benchmarkIndex}
                        </span>
                        {getSentimentBadge(sector.regimeSentiment)}
                      </div>
                      <span className="text-xs text-slate-600 mt-1 block font-mono-num font-medium">
                        Index Weight: <strong className="text-slate-900 font-bold">{sector.marketCapWeightPercent}%</strong> of Nifty 50
                      </span>
                    </div>
                  </div>

                  {/* Return badge */}
                  <div className="flex items-center gap-3 self-start lg:self-auto font-mono-num">
                    <div
                      className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-sm font-bold backdrop-blur-sm ${
                        isPositive
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-900'
                          : 'bg-rose-500/20 border-rose-500/40 text-rose-900'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-emerald-800" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-rose-800" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {sector.indexChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* What is Happening in this Sector */}
                <div>
                  <h4 className="text-[10.5px] uppercase font-bold text-amber-800 tracking-wider mb-1.5 flex items-center gap-1.5 font-classic-title">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>What is Happening in This Sector (Current Dynamics):</span>
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed glass-card-subtle p-4 rounded-xl border border-slate-200/80 font-medium">
                    {sector.currentDynamics}
                  </p>
                </div>

                {/* Sub-Industries Breakdown */}
                {sector.subIndustries && sector.subIndustries.length > 0 && (
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-600 tracking-wider mb-1.5 flex items-center gap-1.5 font-classic-title">
                      <Layers className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Classified Sub-Industries:</span>
                    </h5>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {sector.subIndustries.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold glass-card-subtle border border-cyan-500/30 text-cyan-900 bg-cyan-500/10"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Economic Drivers & Transmission Impact Matrix */}
                {sector.macroeconomicDrivers && sector.macroeconomicDrivers.length > 0 && (
                  <div className="p-4 rounded-xl glass-card-subtle border border-slate-200/80 space-y-2.5">
                    <h5 className="text-[10.5px] uppercase font-bold text-amber-900 tracking-wider flex items-center gap-1.5 font-classic-title">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                      <span>Relevant Macroeconomic Drivers & Direction of Impact:</span>
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      {sector.macroeconomicDrivers.map((driver, dIdx) => {
                        const isPos = driver.directionOfImpact === 'POSITIVE';
                        const isNeg = driver.directionOfImpact === 'NEGATIVE';
                        return (
                          <div
                            key={dIdx}
                            className="p-3 rounded-xl glass-card border border-slate-200/90 flex flex-col justify-between space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900 leading-tight font-classic-title">
                                {driver.driver}
                              </span>
                              <span
                                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border shrink-0 font-classic-title ${
                                  isPos
                                    ? 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40'
                                    : isNeg
                                    ? 'bg-rose-500/20 text-rose-900 border-rose-500/40'
                                    : 'bg-slate-200/80 text-slate-800 border-slate-300'
                                }`}
                              >
                                {driver.directionOfImpact}
                              </span>
                            </div>
                            <span className="text-[10px] text-amber-800 font-mono-num font-bold">
                              {driver.currentStatus}
                            </span>
                            <p className="text-[11px] text-slate-700 leading-snug font-medium">
                              {driver.transmissionImpact}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Key Catalysts & Policy Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Active Catalysts */}
                  <div className="p-4 rounded-xl glass-card-subtle border border-slate-200/80 space-y-2">
                    <h5 className="text-[10.5px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1.5 font-classic-title">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Active Catalysts & Valuation Drivers:</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      {sector.keyCatalysts.map((cat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-amber-700 font-bold">•</span>
                          <span>{cat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Regulatory & Policy */}
                  <div className="p-4 rounded-xl glass-card-subtle border border-slate-200/80 space-y-2">
                    <h5 className="text-[10.5px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5 font-classic-title">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Regulatory & Sovereign Policy Front:</span>
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
                      {sector.regulatoryAndPolicyFront}
                    </p>
                  </div>
                </div>

                {/* Affected Equities in this Sector with Industry & Direction of Impact */}
                <div className="pt-2">
                  <h5 className="text-[10.5px] uppercase font-bold text-slate-600 tracking-wider mb-2 font-classic-title">
                    Affected Companies, Industry Classification & Direction of Impact:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {sector.keyListedStocks.map((st) => {
                      const stPos = st.changePercent >= 0;
                      const dirIsPos = st.expectedDirection === 'POSITIVE';
                      const dirIsNeg = st.expectedDirection === 'NEGATIVE';

                      return (
                        <button
                          key={st.ticker}
                          onClick={() => onSelectStock(st.ticker)}
                          className="p-3.5 rounded-xl glass-card glass-card-hover border border-slate-200/90 text-left transition-all cursor-pointer flex flex-col justify-between group space-y-2 shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1 font-mono-num">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                                {st.ticker}
                              </span>
                              {st.expectedDirection && (
                                <span
                                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border font-classic-title ${
                                    dirIsPos
                                      ? 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40'
                                      : dirIsNeg
                                      ? 'bg-rose-500/20 text-rose-900 border-rose-500/40'
                                      : 'bg-slate-200/80 text-slate-800 border-slate-300'
                                  }`}
                                >
                                  {st.expectedDirection}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-700 font-bold block truncate">
                              {st.companyName}
                            </span>
                            {st.industry && (
                              <span className="text-[10px] text-cyan-800 font-mono-num font-medium block truncate mt-0.5">
                                {st.industry}
                              </span>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between font-mono-num">
                            <span className="text-xs font-bold text-slate-900">
                              ₹{st.price.toLocaleString('en-IN')}
                            </span>
                            <span
                              className={`text-[10px] font-bold ${
                                stPos ? 'text-emerald-800' : 'text-rose-800'
                              }`}
                            >
                              {stPos ? '+' : ''}
                              {st.changePercent.toFixed(2)}%
                            </span>
                          </div>

                          {st.primaryMacroDriver && (
                            <span className="text-[9px] text-slate-600 block line-clamp-1 italic font-medium">
                              Driver: {st.primaryMacroDriver}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

