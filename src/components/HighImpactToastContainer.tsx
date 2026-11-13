import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, X, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { NewsIntelligenceItem } from '../types/market';

export interface HighImpactToastNotification {
  id: string;
  item: NewsIntelligenceItem;
  ticker: string;
  volatilityChange: string;
  expectedDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  expectedMagnitude: string;
  timestamp: string;
}

interface HighImpactToastContainerProps {
  toasts: HighImpactToastNotification[];
  onDismiss: (id: string) => void;
  onSelectStock: (ticker: string) => void;
  onOpenTransmissionModal: (item: NewsIntelligenceItem) => void;
}

export const HighImpactToastContainer: React.FC<HighImpactToastContainerProps> = ({
  toasts,
  onDismiss,
  onSelectStock,
  onOpenTransmissionModal,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none"
      role="region"
      aria-label="High Impact Market Intelligence Notifications"
    >
      {toasts.map((toast) => {
        const isBullish = toast.expectedDirection === 'POSITIVE';
        const isBearish = toast.expectedDirection === 'NEGATIVE';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto glass-panel-dynamic rounded-2xl p-4 shadow-xl transition-all transform animate-in slide-in-from-bottom-5 duration-300"
          >
            {/* Header: High Impact Badge & Dismiss */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-900 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider font-classic-title animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                  <span>High Impact News Added</span>
                </span>
                <span className="text-[10px] text-slate-600 font-mono-num font-medium">
                  {toast.timestamp}
                </span>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-500 hover:text-slate-900 p-1 rounded-lg glass-card border border-slate-200/90 hover:border-slate-400 transition-all cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Headline */}
            <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-relaxed mb-3 font-serif-classic">
              {toast.item.headline}
            </p>

            {/* Ticker & Volatility Highlight Box */}
            <div className="p-3 rounded-xl glass-card border border-slate-200/90 flex items-center justify-between gap-3 mb-3 shadow-2xs">
              {/* Impacted Ticker */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5 font-classic-title tracking-wider">
                  Target Ticker:
                </span>
                <button
                  onClick={() => onSelectStock(toast.ticker)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg badge-dynamic-shade font-mono-num font-bold text-xs transition-colors cursor-pointer hover:opacity-90"
                  title={`View deep dive for ${toast.ticker}`}
                >
                  <span className="font-shade-primary font-bold">{toast.ticker}</span>
                  {isBullish && <TrendingUp className="w-3 h-3 text-emerald-700" />}
                  {isBearish && <TrendingDown className="w-3 h-3 text-rose-700" />}
                </button>
              </div>

              {/* Expected Volatility Change */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5 flex items-center justify-end gap-1 font-classic-title tracking-wider">
                  <Activity className="w-3 h-3 text-indigo-600" />
                  <span>Expected Volatility:</span>
                </span>
                <span className="text-xs font-bold font-shade-cyan font-mono-num tracking-tight badge-dynamic-shade px-2.5 py-0.5 rounded-lg inline-block">
                  {toast.volatilityChange}
                </span>
              </div>
            </div>

            {/* Magnitude & Action Controls */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="text-slate-600 text-[10px] font-classic-title uppercase tracking-wider font-bold">Expected Drift:</span>
                <span
                  className={`font-bold font-mono-num ${
                    isBullish ? 'font-shade-emerald' : isBearish ? 'font-shade-rose' : 'text-slate-800'
                  }`}
                >
                  {toast.expectedMagnitude}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenTransmissionModal(toast.item);
                    onDismiss(toast.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold font-shade-primary hover:opacity-80 transition-opacity cursor-pointer font-classic-title uppercase tracking-wider"
                >
                  <Sparkles className="w-3 h-3 text-indigo-700" />
                  <span>View Transmission →</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
