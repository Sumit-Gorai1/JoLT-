import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { MorningReportView } from './components/MorningReportView';
import { LiveNewsIntelligence } from './components/LiveNewsIntelligence';
import { AgentNetworkView } from './components/AgentNetworkView';
import { BacktestAndGuardrails } from './components/BacktestAndGuardrails';
import { CustomAnalysisModal } from './components/CustomAnalysisModal';
import { TransmissionExplorerModal } from './components/TransmissionExplorerModal';
import { StockDeepDiveModal } from './components/StockDeepDiveModal';
import { SectorIntelligenceView } from './components/SectorIntelligenceView';
import { FinbertSentimentLab } from './components/FinbertSentimentLab';
import { HighImpactToastContainer, HighImpactToastNotification } from './components/HighImpactToastContainer';
import {
  liveMarketIndices,
  todayMorningReport,
  verifiedNewsStream,
  mockHighImpactNewsCatalog,
  sectorIntelligenceData,
} from './data/mockMarketData';
import { NewsIntelligenceItem } from './types/market';
import { Shield } from 'lucide-react';
import { JoltLogo } from './components/JoltLogo';

export type ColorPalette = 'aurora' | 'sapphire' | 'emerald' | 'orchid';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'morning_report' | 'live_news' | 'sector_intelligence' | 'finbert_lab' | 'agent_network' | 'backtest_guardrails'
  >('morning_report');

  const [palette, setPalette] = useState<ColorPalette>(() => {
    try {
      const saved = localStorage.getItem('jolt-color-palette') as ColorPalette | null;
      if (saved && ['aurora', 'sapphire', 'emerald', 'orchid'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'aurora';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
    try {
      localStorage.setItem('jolt-color-palette', palette);
    } catch {
      // ignore storage errors
    }
  }, [palette]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomAnalysisOpen, setIsCustomAnalysisOpen] = useState(false);
  const [customAnalysisHeadline, setCustomAnalysisHeadline] = useState('');
  const [customAnalysisDetails, setCustomAnalysisDetails] = useState('');
  const [selectedStockForDeepDive, setSelectedStockForDeepDive] = useState<string | null>(null);
  const [selectedNewsForTransmission, setSelectedNewsForTransmission] = useState<NewsIntelligenceItem | null>(null);

  // Managed verifiedNewsStream state
  const [newsStream, setNewsStream] = useState<NewsIntelligenceItem[]>(verifiedNewsStream);
  const [highImpactToasts, setHighImpactToasts] = useState<HighImpactToastNotification[]>([]);
  const knownNewsIdsRef = useRef<Set<string>>(new Set(verifiedNewsStream.map((n) => n.id)));
  const simIndexRef = useRef(0);

  // Live market benchmarks, sector changes & stock quotes
  const [liveIndices, setLiveIndices] = useState(liveMarketIndices);
  const [liveSectorChanges, setLiveSectorChanges] = useState<Record<string, number>>({});
  const [liveStockQuotes, setLiveStockQuotes] = useState<
    Record<string, { price: number; change: number; changePercent: number; isPositive: boolean }>
  >({});
  const [liveFetchedAt, setLiveFetchedAt] = useState<string>('');

  const fetchLiveMarket = useCallback(async (forceRefresh = false) => {
    try {
      const res = await fetch(`/api/live-market${forceRefresh ? '?refresh=1' : ''}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json?.success && json.data) {
        if (Array.isArray(json.data.indices) && json.data.indices.length > 0) {
          setLiveIndices(json.data.indices);
        }
        if (json.data.sectorChanges && typeof json.data.sectorChanges === 'object') {
          setLiveSectorChanges(json.data.sectorChanges);
        }
        if (json.data.stocks && typeof json.data.stocks === 'object') {
          setLiveStockQuotes(json.data.stocks);
        }
        if (json.data.fetchedAtIST) {
          setLiveFetchedAt(json.data.fetchedAtIST);
        }
      }
    } catch {
      // Retain baseline/last known market quotes on transient network issues
    }
  }, []);

  useEffect(() => {
    fetchLiveMarket(false);
    const interval = setInterval(() => fetchLiveMarket(false), 60000);
    return () => clearInterval(interval);
  }, [fetchLiveMarket]);

  // Function to add a news item to the verifiedNewsStream
  const addNewsToStream = (item: NewsIntelligenceItem) => {
    setNewsStream((prev) => {
      // Check if item already exists
      if (prev.some((n) => n.id === item.id)) {
        return prev;
      }
      return [item, ...prev];
    });

    // Check if item is High Impact
    const isHighImpact =
      item.impactSeverity === 'HIGH' ||
      item.confidenceScore >= 95 ||
      item.affectedTickers.some(
        (t) =>
          t.expectedMagnitude.includes('5') ||
          t.expectedMagnitude.includes('6') ||
          t.expectedMagnitude.includes('7') ||
          t.expectedMagnitude.includes('4.')
      );

    if (isHighImpact) {
      const primaryTicker = item.affectedTickers[0]?.ticker || 'NIFTY 50';
      const volChange =
        item.expectedVolatilityChange ||
        `±${item.affectedTickers[0]?.expectedMagnitude || '3.5%'} Volatility Drift`;

      const newToast: HighImpactToastNotification = {
        id: `toast_${item.id}_${Date.now()}`,
        item,
        ticker: item.affectedTickers.map((t) => t.ticker).slice(0, 2).join(', ') || primaryTicker,
        volatilityChange: volChange,
        expectedDirection: item.primaryImpact,
        expectedMagnitude: item.affectedTickers[0]?.expectedMagnitude || '±3.5%',
        timestamp: new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST',
      };

      setHighImpactToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep up to 3 active toasts

      // Auto-dismiss after 9 seconds
      setTimeout(() => {
        setHighImpactToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 9000);
    }
  };

  const handleDismissToast = (id: string) => {
    setHighImpactToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Simulate addition of a High-Impact news item
  const handleSimulateHighImpactNews = () => {
    const catalogItem = mockHighImpactNewsCatalog[simIndexRef.current % mockHighImpactNewsCatalog.length];
    simIndexRef.current += 1;

    // Create unique instance
    const freshItem: NewsIntelligenceItem = {
      ...catalogItem,
      id: `${catalogItem.id}_${Date.now()}`,
      timeAgo: 'Just now',
      timestampIST: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' IST',
    };

    addNewsToStream(freshItem);
  };

  // Trigger high-impact toast for initial demonstration after mount so user immediately sees system active
  useEffect(() => {
    const timer = setTimeout(() => {
      // Pick first high-impact item from stream to notify user that monitoring is active
      const hi = verifiedNewsStream.find((n) => n.impactSeverity === 'HIGH');
      if (hi) {
        const toastItem: HighImpactToastNotification = {
          id: `toast_init_${hi.id}`,
          item: hi,
          ticker: hi.affectedTickers.map((t) => t.ticker).slice(0, 2).join(', '),
          volatilityChange: hi.expectedVolatilityChange || '+5.6% Volatility Spike (KAYNES, DIXON)',
          expectedDirection: hi.primaryImpact,
          expectedMagnitude: hi.affectedTickers[0]?.expectedMagnitude || '+4.5% to +6.8%',
          timestamp: 'Live Ingestion Alert',
        };
        setHighImpactToasts([toastItem]);

        setTimeout(() => {
          setHighImpactToasts((prev) => prev.filter((t) => t.id !== toastItem.id));
        }, 9000);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenCustomAnalysis = (headline = '', details = '') => {
    setCustomAnalysisHeadline(headline);
    setCustomAnalysisDetails(details);
    setIsCustomAnalysisOpen(true);
  };

  const handleAnalyzeSpecificNews = (item: NewsIntelligenceItem) => {
    handleOpenCustomAnalysis(item.headline, item.summary);
  };

  return (
    <div className="min-h-screen animate-canvas-flow text-slate-900 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-950 relative overflow-x-hidden">
      {/* Dynamic Ambient Radiant Mesh & Transparent Grid Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle coordinate mesh */}
        <div className="absolute inset-0 bg-financial-grid opacity-90" />
        {/* Palette-driven dynamic floating multi-shade orbs */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[780px] h-[440px] bg-orb-1 rounded-full blur-3xl animate-orb-1" />
        <div className="absolute top-12 -left-36 w-[640px] h-[640px] bg-orb-2 rounded-full blur-3xl animate-orb-2" />
        <div className="absolute -bottom-24 -right-24 w-[680px] h-[680px] bg-orb-3 rounded-full blur-3xl animate-orb-3" />
        <div className="absolute top-1/3 left-1/3 w-[520px] h-[520px] bg-orb-4 rounded-full blur-3xl animate-orb-1" />
      </div>

      {/* Top Header & Navigation */}
      <div className="relative z-30">
        <Header
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectStock={(ticker) => setSelectedStockForDeepDive(ticker)}
          newsItems={newsStream}
          onOpenCustomAnalysis={() => handleOpenCustomAnalysis()}
          palette={palette}
          onChangePalette={setPalette}
          liveIndices={liveIndices}
          liveFetchedAt={liveFetchedAt}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 relative z-10">
        {activeTab === 'morning_report' && (
          <MorningReportView
            report={todayMorningReport}
            onSelectStock={(ticker) => setSelectedStockForDeepDive(ticker)}
            onOpenCustomAnalysis={() => handleOpenCustomAnalysis()}
            liveIndices={liveIndices}
            onRefreshMarket={() => fetchLiveMarket(true)}
          />
        )}

        {activeTab === 'live_news' && (
          <LiveNewsIntelligence
            newsItems={newsStream}
            onSelectStock={(ticker) => setSelectedStockForDeepDive(ticker)}
            onOpenTransmissionModal={(item) => setSelectedNewsForTransmission(item)}
            onAnalyzeSpecificNews={handleAnalyzeSpecificNews}
            onSimulateHighImpactNews={handleSimulateHighImpactNews}
            onRefreshFeed={handleSimulateHighImpactNews}
            onOpenFinbertLab={() => setActiveTab('finbert_lab')}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'sector_intelligence' && (
          <SectorIntelligenceView
            sectors={sectorIntelligenceData}
            onSelectStock={(ticker) => setSelectedStockForDeepDive(ticker)}
            onOpenCustomAnalysis={() => handleOpenCustomAnalysis()}
            globalSearchQuery={searchQuery}
            liveSectorChanges={liveSectorChanges}
            liveStockQuotes={liveStockQuotes}
          />
        )}

        {activeTab === 'finbert_lab' && (
          <FinbertSentimentLab />
        )}

        {activeTab === 'agent_network' && (
          <AgentNetworkView
            onOpenCustomAnalysis={() => handleOpenCustomAnalysis()}
            onOpenFinbertLab={() => setActiveTab('finbert_lab')}
          />
        )}

        {activeTab === 'backtest_guardrails' && (
          <BacktestAndGuardrails
            onSelectStock={(ticker) => setSelectedStockForDeepDive(ticker)}
          />
        )}
      </main>

      {/* Institutional Transparent Footer */}
      <footer className="border-t border-white/70 bg-white/60 backdrop-blur-xl py-6 text-xs text-slate-600 relative z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <JoltLogo
              size="sm"
              palette={palette}
              showTagline={false}
              onClick={() => setActiveTab('morning_report')}
            />
            <span>·</span>
            <span className="font-serif-classic text-[13px] text-slate-700 italic">Indian Stock Market Intelligence & Decision Support</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600 font-mono-num">
            <span>NSE / BSE Listed Equities</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-shade-emerald font-semibold">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Probabilistic Decision Support · Epistemological Humility</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CustomAnalysisModal
        isOpen={isCustomAnalysisOpen}
        onClose={() => setIsCustomAnalysisOpen(false)}
        onSelectStock={(ticker) => setSelectedStockForDeepDive(ticker)}
        initialHeadline={customAnalysisHeadline}
        initialDetails={customAnalysisDetails}
      />

      <TransmissionExplorerModal
        item={selectedNewsForTransmission}
        onClose={() => setSelectedNewsForTransmission(null)}
        onSelectStock={(ticker) => setSelectedStockForDeepDive(ticker)}
      />

      <StockDeepDiveModal
        ticker={selectedStockForDeepDive}
        onClose={() => setSelectedStockForDeepDive(null)}
        liveStockQuotes={liveStockQuotes}
      />

      {/* High Impact News Added Toast Notification System */}
      <HighImpactToastContainer
        toasts={highImpactToasts}
        onDismiss={handleDismissToast}
        onSelectStock={(ticker) => setSelectedStockForDeepDive(ticker)}
        onOpenTransmissionModal={(item) => setSelectedNewsForTransmission(item)}
      />
    </div>
  );
}
