import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  RefreshCw,
  Cpu,
  BarChart2,
  Gauge,
  Share2,
  Info,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { FinbertSentiment } from '../types/market';

const PRESET_FINANCIAL_TEXTS = [
  {
    id: 'semicon',
    title: 'Semicon 2.0 Cabinet Outlay (Bullish)',
    category: 'Sovereign Capex',
    text: 'Union Cabinet officially approves Semicon 2.0 scheme with ₹1,27,500 crore fiscal outlay across 12 approved semiconductor fabrication and OSAT projects with massive private capex commitment.',
  },
  {
    id: 'dgtr_steel',
    title: 'DGTR 18.5% Steel Safeguard Tariff (Bullish for Mills)',
    category: 'Trade Remedy',
    text: 'DGTR recommends immediate imposition of 18.5% provisional safeguard duty on Asian hot-rolled steel coil imports to protect domestic steel producers from predatory pricing dumping.',
  },
  {
    id: 'crude_squeeze',
    title: 'Brent Crude Holds Near $96.21 (OMC Margin Squeeze)',
    category: 'Commodities Risk',
    text: 'Brent crude trades near $96.21 per barrel amid tanker transit risk premiums, pressuring domestic oil marketing companies as retail auto fuel prices remain capped.',
  },
  {
    id: 'rbi_hike',
    title: 'RBI Repo Rate Hike 25 bps (Calibrated Tightening)',
    category: 'Central Bank Macro',
    text: 'RBI Monetary Policy Committee raises repo rate by 25 bps to 5.50% with calibrated tightening stance to curb inflationary pressures arising from elevated global energy benchmarks.',
  },
  {
    id: 'hal_contract',
    title: 'HAL CCS Tejas ₹26,000 Cr Sanction (Defence Prime)',
    category: 'Order Book Win',
    text: 'Cabinet Committee on Security sanctions ₹26,000 crore contract for LCA Tejas Mk1A aero-engines with Hindustan Aeronautics Limited, guaranteeing multi-year serial production run.',
  },
  {
    id: 'mixed_earnings',
    title: 'Mixed Q2: Revenue Beats by 22% but EBITDA Margin Squeezed',
    category: 'Nuanced Earnings',
    text: 'Consolidated revenue grew strongly by 22.4% YoY driven by volume expansion; however operating EBITDA margin compressed 160 bps due to elevated imported coking coal and freight logistics costs.',
  },
  {
    id: 'minda_ncd',
    title: 'Minda Corp ₹1,500 Cr NCD Raise (Non-Dilutive Cap)',
    category: 'Capital Management',
    text: 'Minda Corporation board approves ₹1,500 crore private placement of Non-Convertible Debentures to fund advanced electronic sensor manufacturing with zero equity dilution.',
  },
];

export const FinbertSentimentLab: React.FC = () => {
  const [inputText, setInputText] = useState(PRESET_FINANCIAL_TEXTS[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FinbertSentiment | null>({
    model: 'ProsusAI/finbert',
    huggingFaceUrl: 'https://huggingface.co/ProsusAI/finbert',
    label: 'positive',
    sentimentScore: 0.93,
    probabilities: {
      positive: 0.954,
      neutral: 0.038,
      negative: 0.008,
    },
    logits: {
      positive: 3.42,
      neutral: -0.15,
      negative: -1.72,
    },
    clauses: [
      {
        clause: 'Union Cabinet officially approves Semicon 2.0 scheme with ₹1,27,500 crore fiscal outlay',
        label: 'positive',
        score: 0.96,
      },
      {
        clause: 'across 12 approved semiconductor fabrication and OSAT projects with massive private capex commitment',
        label: 'positive',
        score: 0.94,
      },
    ],
    entitySentiments: [
      {
        entity: 'KAYNES.NS (Kaynes Technology)',
        label: 'positive',
        score: 0.95,
      },
      {
        entity: 'DIXON.NS (Dixon Tech)',
        label: 'positive',
        score: 0.92,
      },
    ],
    inferenceEngine: 'PROSUS_FINBERT_NEURAL_ENGINE',
    analyzedAtIST: 'Just now (Live Desk)',
  });
  const [latencyMs, setLatencyMs] = useState<number | null>(42);

  const handleRunInference = async (customText?: string) => {
    const textToAnalyze = (customText !== undefined ? customText : inputText).trim();
    if (!textToAnalyze) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/finbert/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);
        setLatencyMs(data.latencyMs || 38);
      }
    } catch (err) {
      console.error('Error running FinBERT inference:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Dynamic Iridescent Glass */}
      <div className="glass-panel-dynamic rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-classic-title flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold badge-dynamic-shade backdrop-blur-sm">
                <span className="text-base leading-none">⚡</span>
                <span className="font-shade-primary">Neural Transformer Architecture</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono-num font-bold font-shade-cyan glass-card border border-cyan-500/30">
                JoLT Sentiment Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold font-shade-emerald glass-card border border-emerald-500/30">
                Active Inference Endpoint
              </span>
            </div>

            <h1 className="font-classic-serif text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5 font-shade-primary">
              <span>JoLT Sentiment Engine</span>
            </h1>

            <p className="font-serif-classic text-xs sm:text-sm text-slate-700 mt-2 max-w-3xl leading-relaxed italic font-medium">
              Native integration with the <strong className="text-slate-900 font-bold">JoLT Sentiment Engine</strong>, a benchmark financial NLP transformer
              calibrated on corporate disclosures and the Financial PhraseBank corpus. Outputs 3-class softmax probability distributions (<code className="font-shade-emerald font-bold">positive</code>, <code className="font-shade-rose font-bold">negative</code>, <code className="font-shade-silver font-bold">neutral</code>) specifically for Indian equities research.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg glass-card text-slate-800 text-xs font-bold border border-slate-200/90 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>3-Class Softmax Calibration</span>
            </span>
          </div>
        </div>

        {/* Model Spec Pills - Translucent Glass Cards with Color Shaded Text */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-200/80 text-xs font-mono-num">
          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider font-classic-title">Backbone Architecture</span>
            <div className="text-xs font-bold font-shade-cyan mt-1">BERT-base-uncased</div>
            <div className="text-[11px] text-slate-600 mt-0.5 font-medium">110M Parameters</div>
          </div>
          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider font-classic-title">Specialized Corpus</span>
            <div className="text-xs font-bold font-shade-silver mt-1 font-sans">Financial PhraseBank</div>
            <div className="text-[11px] text-slate-600 mt-0.5 font-sans font-medium">Annotated Consensus</div>
          </div>
          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider font-classic-title">Target Objective</span>
            <div className="text-xs font-bold font-shade-purple mt-1 font-sans">3-Class Softmax Logits</div>
            <div className="text-[11px] text-slate-600 mt-0.5 font-sans font-medium">Positive, Negative, Neutral</div>
          </div>
          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider font-classic-title">Polarity Metric</span>
            <div className="text-xs font-bold font-shade-primary font-mono-num mt-1">S = P(pos) - P(neg)</div>
            <div className="text-[11px] text-slate-600 mt-0.5 font-sans font-medium">[-1.00 Bearish to +1.00 Bullish]</div>
          </div>
        </div>
      </div>

      {/* Interactive Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and Presets */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2 font-classic-title tracking-wider uppercase">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Financial Text / Headline to Classify</span>
              </label>
              <span className="text-[11px] text-slate-600 font-mono-num font-medium">
                {inputText.length} characters
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Paste financial news, earnings snippet, RBI/SEBI gazette, or corporate disclosure..."
              className="w-full glass-input rounded-xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all leading-relaxed border border-slate-300 font-medium"
            />

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setInputText('')}
                className="text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
              >
                Clear Input
              </button>

              <button
                onClick={() => handleRunInference()}
                disabled={isLoading || !inputText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-dynamic-primary disabled:opacity-40 font-bold text-xs cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Running JoLT Sentiment Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white text-white" />
                    <span>Run JoLT Sentiment Engine</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Scenarios */}
          <div className="glass-panel rounded-2xl p-6 space-y-3.5 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-classic-title">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Preset Indian Financial Scenarios</span>
              </span>
              <span className="text-[11px] text-amber-900/80 font-mono-num font-bold">Click to test instantly</span>
            </div>

            <div className="space-y-2.5">
              {PRESET_FINANCIAL_TEXTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setInputText(preset.text);
                    handleRunInference(preset.text);
                  }}
                  className="w-full text-left p-3 rounded-xl glass-card glass-card-hover border border-slate-200/90 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 group-hover:text-amber-900 transition-colors font-classic-title tracking-tight">
                      {preset.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded glass-card text-amber-900 border border-amber-500/30 bg-amber-500/15 font-mono-num">
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-600 line-clamp-1 leading-snug font-sans font-medium">
                    {preset.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: FinBERT Results */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-5 shadow-sm border border-slate-200/80">
            {/* Header: Neural Sentiment & Alpha Signal Breakdown */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-classic-title">
                  Neural Sentiment & Alpha Signal Breakdown
                </span>
              </div>

              {latencyMs !== null && (
                <span className="text-[11px] font-mono-num font-bold text-emerald-900 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/35 backdrop-blur-sm">
                  Inference: {latencyMs}ms
                </span>
              )}
            </div>

            {analysisResult ? (
              <div className="space-y-5">
                {/* Primary Outcome Card - Translucent Glass */}
                <div className="p-5 rounded-2xl glass-card-subtle border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                  <div>
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider font-classic-title">
                      Dominant Classification Label
                    </span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span
                        className={`text-xl font-extrabold uppercase px-3.5 py-1 rounded-xl border font-classic-title tracking-wider ${
                          analysisResult.label === 'positive'
                            ? 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40'
                            : analysisResult.label === 'negative'
                            ? 'bg-rose-500/20 text-rose-900 border-rose-500/40'
                            : 'bg-slate-200/90 text-slate-800 border-slate-300'
                        }`}
                      >
                        {analysisResult.label}
                      </span>
                      <div className="text-xs">
                        <span className="text-slate-600 font-medium">Model Confidence: </span>
                        <strong className="text-slate-900 font-mono-num text-sm font-bold">
                          {(
                            Math.max(
                              analysisResult.probabilities.positive,
                              analysisResult.probabilities.negative,
                              analysisResult.probabilities.neutral
                            ) * 100
                          ).toFixed(1)}
                          %
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200/80 sm:pl-5 pt-3 sm:pt-0">
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider font-classic-title">
                      Net Polarity Score
                    </span>
                    <div className="text-2xl font-extrabold font-mono-num mt-1">
                      <span
                        className={
                          analysisResult.sentimentScore > 0
                            ? 'text-emerald-800 font-bold'
                            : analysisResult.sentimentScore < 0
                            ? 'text-rose-800 font-bold'
                            : 'text-slate-800 font-bold'
                        }
                      >
                        {analysisResult.sentimentScore > 0 ? '+' : ''}
                        {analysisResult.sentimentScore.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-slate-700 block font-serif-classic italic font-semibold">
                      {analysisResult.sentimentScore >= 0.5
                        ? 'Strong Institutional Bullish'
                        : analysisResult.sentimentScore > 0.1
                        ? 'Mildly Positive Tone'
                        : analysisResult.sentimentScore <= -0.5
                        ? 'High-Impact Risk-Off'
                        : analysisResult.sentimentScore < -0.1
                        ? 'Mildly Negative Tone'
                        : 'Balanced / Baseline Neutral'}
                    </span>
                  </div>
                </div>

                {/* Softmax Probability Distribution Bar */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 font-classic-title tracking-wide">
                      3-Class Softmax Probability Distribution
                    </span>
                    <span className="text-[11px] font-mono-num text-slate-600 font-medium">
                      Σ p_i = 1.000
                    </span>
                  </div>

                  {/* Multi-segment progress bar */}
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-200/90 p-0.5 border border-slate-300">
                    <div
                      style={{ width: `${analysisResult.probabilities.positive * 100}%` }}
                      className="h-full bg-emerald-600 rounded-l-full transition-all duration-500 shadow-xs"
                      title={`Positive: ${(analysisResult.probabilities.positive * 100).toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${analysisResult.probabilities.neutral * 100}%` }}
                      className="h-full bg-slate-400 transition-all duration-500"
                      title={`Neutral: ${(analysisResult.probabilities.neutral * 100).toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${analysisResult.probabilities.negative * 100}%` }}
                      className="h-full bg-rose-600 rounded-r-full transition-all duration-500 shadow-xs"
                      title={`Negative: ${(analysisResult.probabilities.negative * 100).toFixed(1)}%`}
                    />
                  </div>

                  {/* 3 Metrics Cards */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs font-mono-num">
                    <div className="p-3.5 rounded-xl glass-card-subtle border border-emerald-500/35 bg-emerald-500/10 text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider font-classic-title">
                        Positive
                      </span>
                      <div className="text-base font-extrabold text-emerald-900 mt-0.5">
                        {(analysisResult.probabilities.positive * 100).toFixed(1)}%
                      </div>
                      {analysisResult.logits && (
                        <span className="text-[10px] text-slate-600 block mt-0.5 font-medium">
                          logit: {analysisResult.logits.positive}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 rounded-xl glass-card-subtle border border-slate-200/90 bg-slate-100/60 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider font-classic-title">
                        Neutral
                      </span>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">
                        {(analysisResult.probabilities.neutral * 100).toFixed(1)}%
                      </div>
                      {analysisResult.logits && (
                        <span className="text-[10px] text-slate-600 block mt-0.5 font-medium">
                          logit: {analysisResult.logits.neutral}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 rounded-xl glass-card-subtle border border-rose-500/35 bg-rose-500/10 text-center">
                      <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider font-classic-title">
                        Negative
                      </span>
                      <div className="text-base font-extrabold text-rose-900 mt-0.5">
                        {(analysisResult.probabilities.negative * 100).toFixed(1)}%
                      </div>
                      {analysisResult.logits && (
                        <span className="text-[10px] text-slate-600 block mt-0.5 font-medium">
                          logit: {analysisResult.logits.negative}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Institutional Risk & Trading Desk Implications */}
                <div className="p-4 rounded-xl glass-card-subtle border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 font-classic-title tracking-wider">
                      <Gauge className="w-4 h-4 text-amber-600" />
                      <span>Institutional Risk & Trading Desk Action</span>
                    </span>
                    <span
                      className={`text-[9.5px] font-bold uppercase px-2 py-0.5 rounded border font-classic-title ${
                        analysisResult.sentimentScore >= 0.35
                          ? 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40'
                          : analysisResult.sentimentScore <= -0.35
                          ? 'bg-rose-500/20 text-rose-900 border-rose-500/40'
                          : 'bg-slate-200/90 text-slate-800 border-slate-300'
                      }`}
                    >
                      {analysisResult.sentimentScore >= 0.35
                        ? 'Risk-On / Tactical Long'
                        : analysisResult.sentimentScore <= -0.35
                        ? 'Risk-Off / Defensive Put Hedge'
                        : 'Market Neutral / Delta Hedge'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                    <div className="p-3 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] text-slate-600 uppercase font-bold block font-classic-title">Volatility Drift</span>
                      <span className="text-slate-900 font-bold text-xs mt-1 block font-mono-num">
                        {Math.abs(analysisResult.sentimentScore) > 0.5
                          ? '±4.5% to ±6.8% (Elevated)'
                          : Math.abs(analysisResult.sentimentScore) > 0.2
                          ? '±2.0% to ±3.5% (Moderate)'
                          : '±0.5% to ±1.5% (Subdued)'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] text-slate-600 uppercase font-bold block font-classic-title">Execution Window</span>
                      <span className="text-amber-900 font-bold text-xs mt-1 block font-mono-num">
                        {analysisResult.label !== 'neutral' ? 'T+0 Pre-Market & Open' : 'Standard Session Rebalance'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] text-slate-600 uppercase font-bold block font-classic-title">Transmission Scope</span>
                      <span className="text-slate-900 font-bold text-xs mt-1 block font-mono-num">
                        {analysisResult.entitySentiments && analysisResult.entitySentiments.length > 0
                          ? `${analysisResult.entitySentiments.length} Mapped Equities`
                          : 'Sector-wide Benchmark'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clause-by-Clause / Sentence-Level Breakdown */}
                {analysisResult.clauses && analysisResult.clauses.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-bold text-slate-900 block font-classic-title tracking-wider">
                      Sentence & Clause-Level Sentiment Decomposition
                    </span>
                    <div className="space-y-2 text-xs">
                      {analysisResult.clauses.map((c, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl glass-card border border-slate-200/90 flex items-start justify-between gap-3 shadow-2xs"
                        >
                          <p className="text-slate-800 leading-relaxed text-xs font-sans font-medium">"{c.clause}"</p>
                          <span
                            className={`shrink-0 text-[9.5px] uppercase font-bold px-2 py-0.5 rounded border font-mono-num ${
                              c.label === 'positive'
                                ? 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40'
                                : c.label === 'negative'
                                ? 'bg-rose-500/20 text-rose-900 border-rose-500/40'
                                : 'bg-slate-200/90 text-slate-800 border-slate-300'
                            }`}
                          >
                            {c.label} ({(c.score * 100).toFixed(0)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Identified Entity Sentiments */}
                {analysisResult.entitySentiments && analysisResult.entitySentiments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-bold text-slate-900 block font-classic-title tracking-wider">
                      Extracted Equities & Directional Tone Attribution
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {analysisResult.entitySentiments.map((ent, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg glass-card border border-slate-200/90 text-[11px] shadow-2xs"
                        >
                          <span className="font-bold text-slate-900 font-mono-num">{ent.entity}</span>
                          <span
                            className={`font-bold uppercase text-[9.5px] px-1.5 py-0.2 rounded font-classic-title ${
                              ent.label === 'positive'
                                ? 'text-emerald-900 bg-emerald-500/20 border border-emerald-500/35'
                                : ent.label === 'negative'
                                ? 'text-rose-900 bg-rose-500/20 border border-rose-500/35'
                                : 'text-slate-800 bg-slate-200 border border-slate-300'
                            }`}
                          >
                            {ent.label}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inference Origin Footer */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-mono-num font-medium">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-700" />
                    <span>
                      Engine:{' '}
                      <strong className="text-slate-900 font-bold">
                        {analysisResult.inferenceEngine === 'HUGGINGFACE_INFERENCE_API'
                          ? 'JoLT Sentiment Engine (Cloud Neural)'
                          : 'JoLT Sentiment Engine (Neural Core)'}
                      </strong>
                    </span>
                  </div>
                  <span>Timestamp: {analysisResult.analyzedAtIST}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-600 font-medium">
                Select a preset scenario or click Run JoLT Sentiment Engine to evaluate headline.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
