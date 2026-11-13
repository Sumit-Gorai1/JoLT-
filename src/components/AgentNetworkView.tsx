import React, { useState } from 'react';
import {
  Radio,
  ShieldCheck,
  GitFork,
  Activity,
  Globe,
  BarChart3,
  TrendingUp,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';
import { specializedAgents } from '../data/mockMarketData';
import { AgentBotStatus } from '../types/market';

interface AgentNetworkViewProps {
  onOpenCustomAnalysis: () => void;
  onOpenFinbertLab?: () => void;
}

export const AgentNetworkView: React.FC<AgentNetworkViewProps> = ({
  onOpenCustomAnalysis,
  onOpenFinbertLab,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentBotStatus>(specializedAgents[0]);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'agent_news':
        return <Radio className="w-5 h-5 text-amber-600" />;
      case 'agent_verification':
        return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
      case 'agent_entity':
        return <GitFork className="w-5 h-5 text-cyan-700" />;
      case 'agent_sentiment':
        return <Activity className="w-5 h-5 text-purple-700" />;
      case 'agent_geopolitical':
        return <Globe className="w-5 h-5 text-blue-700" />;
      case 'agent_fundamental':
        return <BarChart3 className="w-5 h-5 text-emerald-700" />;
      case 'agent_technical':
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'agent_regime':
        return <Gauge className="w-5 h-5 text-indigo-700" />;
      case 'agent_risk':
        return <AlertTriangle className="w-5 h-5 text-rose-700" />;
      case 'agent_validation':
        return <CheckCircle2 className="w-5 h-5 text-amber-600" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Banner - Dynamic Iridescent Glass */}
      <div className="glass-panel-dynamic rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 font-classic-title">
              <Cpu className="w-4 h-4 text-indigo-700" />
              <span className="font-shade-purple font-bold">Multi-Agent Institutional Architecture</span>
            </div>
            <h1 className="font-classic-serif text-2xl sm:text-3xl font-bold tracking-tight font-shade-primary">
              Specialized 10-Agent Collaborative Pipeline
            </h1>
            <p className="font-serif-classic text-xs sm:text-sm text-slate-700 mt-2 max-w-3xl leading-relaxed italic font-medium">
              JoLT decomposes Indian market news processing into 10 autonomous, specialized analytical agents.
              Each agent operates under strict guardrails with Bayesian confidence calibration and cross-agent verification.
            </p>
          </div>

          <button
            onClick={onOpenCustomAnalysis}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-dynamic-primary text-xs font-bold cursor-pointer shrink-0 font-classic-title tracking-wider uppercase whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 fill-white text-white" />
            <span>Simulate Pipeline on Event</span>
          </button>
        </div>

        {/* 4-Stage Architecture Diagram */}
        <div className="mt-6 pt-5 border-t border-slate-200/80">
          <span className="text-[10.5px] font-bold font-shade-primary uppercase tracking-widest block mb-3 font-classic-title">
            Execution Flow & Consensus Routing
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl glass-card border border-indigo-200/80 shadow-2xs">
              <span className="text-[10px] font-bold font-shade-primary uppercase font-classic-title tracking-wider">Stage I</span>
              <div className="text-xs font-bold text-slate-900 mt-1 font-sans">Ingestion & Verification</div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">
                News Collection + Source Verification bots filter noise, check timestamps, and ensure 2+ tier-1 sources.
              </p>
            </div>

            <div className="p-3.5 rounded-xl glass-card border border-cyan-200/80 shadow-2xs">
              <span className="text-[10px] font-bold font-shade-cyan uppercase font-classic-title tracking-wider">Stage II</span>
              <div className="text-xs font-bold text-slate-900 mt-1 font-sans">Entity & Sentiment Mapping</div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">
                Entity Mapping bot links to NSE tickers, BSE codes, and supply chain peers. Sentiment bot computes institutional tone.
              </p>
            </div>

            <div className="p-3.5 rounded-xl glass-card border border-purple-200/80 shadow-2xs">
              <span className="text-[10px] font-bold font-shade-purple uppercase font-classic-title tracking-wider">Stage III</span>
              <div className="text-xs font-bold text-slate-900 mt-1 font-sans">Domain Deep Dive</div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">
                Fundamental, Technical, Geopolitical, and Regime bots execute parallel valuation, liquidity, and chart checks.
              </p>
            </div>

            <div className="p-3.5 rounded-xl glass-card border border-emerald-200/80 shadow-2xs">
              <span className="text-[10px] font-bold font-shade-emerald uppercase font-classic-title tracking-wider">Stage IV</span>
              <div className="text-xs font-bold text-slate-900 mt-1 font-sans">Risk & Final Synthesis</div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">
                Risk bot defines invalidation triggers; Final Validation bot calibrates conviction and outputs report.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="font-classic-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="font-shade-primary">Active Agent Fleet</span>
            </h2>
            <span className="text-xs text-slate-600 font-mono-num font-bold">10 of 10 Operational</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {specializedAgents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-4 rounded-xl transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'glass-panel-dynamic shadow-md ring-1 ring-indigo-500/35'
                      : 'glass-card border border-slate-200/90 hover:border-indigo-300/70 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="p-2 rounded-lg glass-card border border-slate-200/90">
                        {getAgentIcon(agent.id)}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-900 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/35 font-classic-title">
                          {agent.status}
                        </span>
                        <span className="text-[11px] text-slate-600 block mt-1 font-mono-num font-medium">
                          Weight: {agent.confidenceWeight}x
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 font-sans">{agent.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {agent.role}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="truncate mr-2 font-serif-classic italic font-medium">Bayesian calibration</span>
                    <span className="text-amber-800 font-bold font-classic-title">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Agent Inspector Panel (1 col) */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-sm border border-slate-200/80 self-start">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
            <div className="p-2.5 rounded-xl glass-card border border-slate-200/90">
              {getAgentIcon(selectedAgent.id)}
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest font-classic-title">
                Agent Inspector
              </span>
              <h3 className="text-base font-bold text-slate-900 font-classic-serif">{selectedAgent.name}</h3>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-600 font-bold block mb-1 text-[11px] uppercase tracking-wider font-classic-title">
                Core Responsibility
              </span>
              <p className="text-slate-800 leading-relaxed glass-card-subtle p-3 rounded-xl border border-slate-200/80 font-medium">
                {selectedAgent.role}
              </p>
            </div>

            <div>
              <span className="text-slate-600 font-bold block mb-1 text-[11px] uppercase tracking-wider font-classic-title">
                Analytical Specialization
              </span>
              <p className="text-slate-700 leading-relaxed glass-card-subtle p-3 rounded-xl border border-slate-200/80 font-medium">
                {selectedAgent.specialization}
              </p>
            </div>

            <div>
              <span className="text-slate-600 font-bold block mb-1 text-[11px] uppercase tracking-wider font-classic-title">
                Latest Executed Deliberation
              </span>
              <div className="p-3 rounded-xl glass-card-subtle border border-slate-200/80 text-amber-900 font-mono-num text-[11.5px] leading-relaxed font-semibold">
                "{selectedAgent.lastAction}"
              </div>
            </div>

            <div>
              <span className="text-slate-600 font-bold block mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-classic-title">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Active Safety Guardrail</span>
              </span>
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 text-[11.5px] leading-relaxed font-medium">
                {selectedAgent.activeGuardrail}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-600 text-xs">
              <span className="font-classic-title uppercase tracking-wider text-[10.5px] font-bold">Consensus Factor</span>
              <strong className="text-slate-900 font-mono-num">{selectedAgent.confidenceWeight}x weight</strong>
            </div>

            {selectedAgent.id === 'agent_sentiment' && (
              <div className="p-4 rounded-xl glass-panel-dynamic space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 font-classic-title font-shade-primary">
                    <span>⚡</span>
                    <span>JoLT Sentiment Engine</span>
                  </span>
                  <span className="text-[10px] font-shade-cyan font-semibold">
                    Neural NLP Core
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-sans font-medium">
                  This bot executes sequence classification on Financial PhraseBank using deep transformer embeddings, predicting calibrated probabilities across positive, negative, and neutral financial tone.
                </p>
                {onOpenFinbertLab && (
                  <button
                    onClick={onOpenFinbertLab}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg btn-dynamic-primary font-bold text-xs cursor-pointer font-classic-title uppercase tracking-wider"
                  >
                    <span>Launch JoLT Sentiment Engine →</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl glass-card border border-slate-200/90 text-xs text-slate-700 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-serif-classic italic text-[11.5px] text-slate-700 font-medium">
              Every agent must produce testable counter-hypotheses. If consensus falls below 65%, the event is flagged as "High Uncertainty / Neutral Wait".
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
