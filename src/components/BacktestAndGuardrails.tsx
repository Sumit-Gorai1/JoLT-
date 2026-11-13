import React from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  History,
  Info,
} from 'lucide-react';
import { guardrailMetrics, historicalBacktests } from '../data/mockMarketData';

interface BacktestAndGuardrailsProps {
  onSelectStock: (ticker: string) => void;
}

export const BacktestAndGuardrails: React.FC<BacktestAndGuardrailsProps> = ({
  onSelectStock,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Overview & Compliance Banner - Dynamic Iridescent Glass */}
      <div className="glass-panel-dynamic rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 font-classic-title">
              <Shield className="w-4 h-4 text-indigo-700" />
              <span className="font-shade-cyan">Institutional Guardrails & Continuous Verification</span>
            </div>
            <h1 className="font-classic-serif text-2xl sm:text-3xl font-bold tracking-tight font-shade-primary">
              Safety Guardrails & Historical Backtesting Engine
            </h1>
            <p className="font-serif-classic text-xs sm:text-sm text-slate-700 mt-2 max-w-3xl leading-relaxed italic font-medium">
              JoLT enforces strict epistemological humility: no forecast is presented as a guaranteed outcome.
              All decisions are probabilistic, audited against historical price movements, and tracked for calibration error.
            </p>
          </div>

          <div className="p-3.5 glass-card border border-indigo-300/60 rounded-xl text-xs text-slate-800 flex items-start gap-2.5 max-w-xs shrink-0 shadow-2xs">
            <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <span className="font-serif-classic italic text-[11.5px] leading-relaxed font-medium">
              Past backtested accuracy does not guarantee future market returns. Falsifiable thresholds are hard-coded per thesis.
            </span>
          </div>
        </div>

        {/* 6 Guardrail Core Metrics - Frosted Glass Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-200/80">
          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Directional Hit Rate</span>
            <span className="text-xl font-bold font-shade-emerald font-mono-num">
              {guardrailMetrics.overallDirectionalHitRate}%
            </span>
            <span className="text-[10.5px] text-slate-600 block mt-0.5 font-medium">Across 418 Events</span>
          </div>

          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Cross-Source Quorum</span>
            <span className="text-xl font-bold font-shade-cyan font-mono-num">
              {guardrailMetrics.crossSourceConfirmationRate}%
            </span>
            <span className="text-[10.5px] text-slate-600 block mt-0.5 font-medium">≥2 Independent Wires</span>
          </div>

          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Duplicate Wire Noise</span>
            <span className="text-xl font-bold text-slate-900 font-mono-num">
              {guardrailMetrics.duplicateClustersPrevented}
            </span>
            <span className="text-[10.5px] text-slate-600 block mt-0.5 font-medium">Clustered & Deduplicated</span>
          </div>

          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Brier Calibration</span>
            <span className="text-xl font-bold font-shade-emerald font-mono-num">
              {guardrailMetrics.averageCalibrationError}
            </span>
            <span className="text-[10.5px] text-slate-600 block mt-0.5 font-medium">0.00 = Perfect Score</span>
          </div>

          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Rumors Suppressed</span>
            <span className="text-xl font-bold font-shade-gold font-mono-num">
              {guardrailMetrics.unverifiedRumorsRejected}
            </span>
            <span className="text-[10.5px] text-slate-600 block mt-0.5 font-medium">Failed Verification</span>
          </div>

          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 block font-classic-title uppercase tracking-wider font-bold">Audit Trail Integrity</span>
            <span className="text-xl font-bold font-shade-purple font-mono-num">100%</span>
            <span className="text-[10.5px] text-slate-600 block mt-0.5 font-medium">SHA-256 Hashed Logs</span>
          </div>
        </div>
      </div>

      {/* Strict Guardrail Mechanisms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 space-y-2.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 font-classic-title uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Multi-Source Corroboration</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
            Events require confirmation from at least two tier-1 financial wires (e.g. Reuters, Bloomberg, Mint)
            or an official exchange filing (NSE/BSE, PIB, RBI Gazette) before assigning high conviction (&gt;75%).
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 font-classic-title uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Anti-Hallucination & Uncertainty Flags</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
            Entities are validated against the official NSE/BSE security master. If financial metrics cannot be cited
            from verified quarterly reports, the engine triggers an "Insufficient Evidence" safeguard.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 font-classic-title uppercase tracking-wider">
            <Layers className="w-4 h-4 text-cyan-700" />
            <span>Explicit View Invalidation Triggers</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
            Every trade thesis mandates falsifiability. The system explicitly declares what technical level,
            management quote, or regulatory intervention proves the original thesis invalid.
          </p>
        </div>
      </div>

      {/* Historical Backtesting Event Table - Frosted Glass Container */}
      <div className="glass-panel rounded-2xl p-6 space-y-5 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div>
            <h2 className="font-classic-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" />
              <span>Historical Backtest Replay & Realized Price Tracking</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Comparing JoLT predicted transmission vs actual 1-day and 5-day market returns across NSE.
            </p>
          </div>
          <span className="text-xs text-emerald-900 bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/35 font-bold font-mono-num backdrop-blur-sm self-start sm:self-auto">
            Calibration Verified: Brier 0.038
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 bg-slate-100/60 font-classic-title uppercase tracking-wider text-[10.5px]">
                <th className="py-3 px-3 font-bold">Date & Event</th>
                <th className="py-3 px-3 font-bold">Stock & Sector</th>
                <th className="py-3 px-3 font-bold">JoLT Forecast</th>
                <th className="py-3 px-3 font-bold">Confidence</th>
                <th className="py-3 px-3 font-bold">Actual 1-Day</th>
                <th className="py-3 px-3 font-bold">Actual 5-Day</th>
                <th className="py-3 px-3 font-bold">Accuracy</th>
                <th className="py-3 px-3 font-bold">Transmission Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {historicalBacktests.map((record) => (
                <tr key={record.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="text-[11px] text-slate-600 font-semibold font-mono-num mb-0.5">
                      {record.date}
                    </div>
                    <div className="text-xs text-slate-900 font-bold line-clamp-2 leading-snug">
                      {record.headline}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <button
                      onClick={() => onSelectStock(record.affectedTicker)}
                      className="font-bold text-amber-800 hover:text-amber-950 text-xs block text-left cursor-pointer font-mono-num"
                    >
                      {record.affectedTicker}
                    </button>
                    <span className="text-[11px] text-slate-600 font-medium">{record.companyName}</span>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-classic-title tracking-wider ${
                        record.predictedDirection === 'POSITIVE'
                          ? 'bg-emerald-500/20 text-emerald-900 border border-emerald-500/40'
                          : record.predictedDirection === 'NEGATIVE'
                          ? 'bg-rose-500/20 text-rose-900 border border-rose-500/40'
                          : 'bg-slate-200/90 text-slate-800'
                      }`}
                    >
                      {record.predictedDirection} ({record.predictedMagnitude})
                    </span>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-slate-900 font-mono-num text-sm">
                    {record.confidenceScore}%
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-emerald-800 font-mono-num">
                    {record.actualOutcome1Day}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-emerald-800 font-mono-num">
                    {record.actualOutcome5Day}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 font-classic-title">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{record.directionalAccuracy}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-3 max-w-xs text-[11px] text-slate-700 leading-relaxed font-sans font-medium">
                    {record.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
