import React from 'react';
import { X, GitCommit, ArrowDown, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';
import { NewsIntelligenceItem } from '../types/market';

interface TransmissionExplorerModalProps {
  item: NewsIntelligenceItem | null;
  onClose: () => void;
  onSelectStock: (ticker: string) => void;
}

export const TransmissionExplorerModal: React.FC<TransmissionExplorerModalProps> = ({
  item,
  onClose,
  onSelectStock,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-modal rounded-3xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto space-y-6 border border-white/80 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-1.5 rounded-xl glass-card border border-slate-200/90 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-widest mb-1.5 font-classic-title">
            <GitCommit className="w-4 h-4 text-amber-600" />
            <span>Transmission Mechanism Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug font-classic-serif">
            {item.headline}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2 font-mono-num font-medium">
            <span>{item.timestampIST}</span>
            <span>·</span>
            <span>Conviction: <strong className="text-amber-900 font-bold">{item.confidenceScore}%</strong></span>
            <span>·</span>
            <span>Horizon: <strong className="text-slate-900 capitalize font-bold">{item.timeHorizon.replace(/_/g, ' ').toLowerCase()}</strong></span>
          </div>
        </div>

        {/* Flowchart of Transmission Steps */}
        <div className="space-y-3.5">
          <span className="text-xs font-bold text-amber-900 block font-classic-title uppercase tracking-wider">
            Sequential Transmission Cascade:
          </span>

          {item.transmissionChain.map((step, idx) => (
            <React.Fragment key={step.stepNumber}>
              <div className="p-4 rounded-xl glass-card border border-slate-200/90 hover:border-amber-500/40 transition-all space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full glass-card border border-amber-500/40 bg-amber-500/15 text-amber-900 font-bold text-xs flex items-center justify-center font-mono-num">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-sans">{step.title}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 glass-card px-2.5 py-0.5 rounded border border-slate-200 font-classic-title uppercase tracking-wider">
                    {step.channelType.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pl-8 font-sans font-medium">
                  {step.description}
                </p>

                <div className="pl-8 pt-1 text-[11px] text-cyan-800 font-mono-num font-bold">
                  → Primary Metric Affected: {step.affectedVariable}
                </div>
              </div>

              {idx < item.transmissionChain.length - 1 && (
                <div className="flex justify-center my-1 text-amber-600/80">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Affected Tickers Direct Links */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/90 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 font-classic-title uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Receiving Entities on NSE/BSE</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {item.affectedTickers.map((ticker) => (
              <div
                key={ticker.ticker}
                onClick={() => {
                  onSelectStock(ticker.ticker);
                  onClose();
                }}
                className="p-3.5 rounded-xl glass-card-hover border border-slate-200/90 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-amber-900 transition-colors font-mono-num">
                    {ticker.ticker}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-classic-title uppercase tracking-wider ${
                      ticker.expectedDirection === 'POSITIVE'
                        ? 'text-emerald-900 bg-emerald-500/20 border border-emerald-500/40'
                        : 'text-rose-900 bg-rose-500/20 border border-rose-500/40'
                    }`}
                  >
                    {ticker.expectedMagnitude}
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 font-semibold">{ticker.companyName}</div>
                <div className="text-[10px] text-slate-600 mt-1 font-serif-classic italic font-medium">
                  Invalidation Trigger: {ticker.invalidationTrigger}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invalidation Criteria */}
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-900 mb-1.5 font-classic-title uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-700" />
            <span>Strict Falsification & Invalidation Triggers:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-800 text-[11px] leading-relaxed font-medium">
            {item.invalidationTriggers.map((trig, i) => (
              <li key={i}>{trig}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
