export type ImpactDirection = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';

export type TimeHorizon = 'INTRADAY' | 'SWING_1_5_DAYS' | 'MEDIUM_1_3_MONTHS' | 'STRUCTURAL';

export type ConfidenceLevel = 'HIGH' | 'MODERATE' | 'LOW' | 'SPECULATIVE';

export interface SourceCitation {
  name: string;
  type: 'EXCHANGE_FILING' | 'REGULATOR_RBI_SEBI' | 'TIER_1_WIRE' | 'FINANCIAL_DAILY' | 'GOVT_GAZETTE';
  credibilityScore: number; // 0-100
  urlOrRef: string;
  verifiedAt: string;
}

export interface StockImpactDetail {
  ticker: string; // e.g. "RELIANCE.NS"
  bseCode?: string; // e.g. "500325"
  companyName: string;
  sector: string;
  currentPrice: number;
  expectedDirection: ImpactDirection;
  expectedMagnitude: string; // e.g. "+1.8% to +2.5%" or "-3.2%"
  transmissionExplanation: string;
  directOrIndirect: 'DIRECT_EXPOSURE' | 'SUPPLY_CHAIN_SECONDARY' | 'PEER_COMPETITOR' | 'REGULATORY_BASKET';
  keyRisksToView: string[];
  invalidationTrigger: string;
  confidenceScore: number; // 0-100
}

export interface TransmissionStep {
  stepNumber: number;
  title: string;
  description: string;
  affectedVariable: string; // e.g. "Brent Crude Benchmark ($88/bbl)"
  channelType: 'COMMODITY_COST' | 'CURRENCY_FX' | 'REGULATORY_DUTY' | 'INTEREST_RATES' | 'GEOPOLITICAL_ROUTE' | 'DEMAND_EXPANSION';
}

export interface FinbertSentiment {
  model: 'ProsusAI/finbert';
  huggingFaceUrl: string;
  label: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // Polarity score: P(pos) - P(neg), between -1.00 and +1.00
  probabilities: {
    positive: number;
    negative: number;
    neutral: number;
  };
  logits?: {
    positive: number;
    negative: number;
    neutral: number;
  };
  clauses?: {
    clause: string;
    label: 'positive' | 'negative' | 'neutral';
    score: number;
  }[];
  entitySentiments?: {
    entity: string;
    label: 'positive' | 'negative' | 'neutral';
    score: number;
  }[];
  inferenceEngine: 'HUGGINGFACE_INFERENCE_API' | 'PROSUS_FINBERT_NEURAL_ENGINE';
  analyzedAtIST: string;
}

export interface NewsIntelligenceItem {
  id: string;
  headline: string;
  summary: string;
  category: 'GLOBAL_GEOPOLITICS' | 'INDIAN_MACRO' | 'CORPORATE_EARNINGS' | 'REGULATORY_SEBI_RBI' | 'COMMODITIES_ENERGY' | 'TECH_DISRUPTION';
  linkedSector: string; // e.g. "Metals & Mining", "Commercial Banking & NBFCs"
  industryClassification: string; // Specific industry e.g. "Primary Flat Steel & Hot-Rolled Coils"
  relevantEconomicDrivers: string[]; // e.g. ["Import Tariffs", "Domestic Infrastructure Demand", "Coking Coal Input Costs"]
  impactSeverity?: 'HIGH' | 'MODERATE' | 'LOW';
  expectedVolatilityChange?: string;
  timestampIST: string;
  timeAgo: string;
  sources: SourceCitation[];
  crossSourceConfirmed: boolean;
  duplicateClusterCount: number;
  primaryImpact: ImpactDirection;
  timeHorizon: TimeHorizon;
  confidenceScore: number;
  uncertaintyFactors: string[];
  affectedTickers: StockImpactDetail[];
  affectedIndices: {
    name: string; // e.g. "NIFTY 50", "NIFTY IT"
    direction: ImpactDirection;
    weightImpactPoints: string;
  }[];
  transmissionChain: TransmissionStep[];
  secondOrderEffects: string[];
  scenarios: {
    bull: { target: string; condition: string };
    base: { target: string; condition: string };
    bear: { target: string; condition: string };
  };
  invalidationTriggers: string[];
  agentVotes: {
    agentId: string;
    agentName: string;
    score: number;
    verdict: string;
    deliberationSnippet: string;
  }[];
  finbertSentiment?: FinbertSentiment;
  auditTrailId: string;
}

export interface MorningReport {
  reportDate: string; // e.g. "September 24, 2026"
  generationTimeIST: string; // e.g. "05:48 AM IST"
  marketSession: 'PRE_MARKET' | 'LIVE_SESSION' | 'POST_MARKET';
  marketRegime: {
    current: string;
    volatilityIndex: number; // India VIX e.g. 13.85
    liquidityPosture: 'STRONG_DOMESTIC_SUPPORT' | 'FII_SELLING_PRESSURE' | 'BALANCED_CHURN' | 'RISK_OFF';
    description: string;
  };
  overnightGlobalDevelopments: {
    summary: string;
    cues: {
      asset: string;
      value: string;
      change: string;
      implicationForIndia: string;
      transmissionRationale?: string;
    }[];
  };
  indianMarketNews: {
    headline: string;
    impactSector: string;
    keyTakeaway: string;
    tickersInFocus: string[];
    justificationRationale?: string;
    firstOrderEffects?: string[];
    secondOrderEffects?: string[];
    financialMetricsImpacted?: string[];
    transmissionChain?: string[];
    officialSourceRef?: string;
  }[];
  sectorImpactMatrix: {
    sector: string;
    sectorCode?: string;
    stance: 'OVERWEIGHT' | 'UNDERWEIGHT' | 'NEUTRAL';
    catalyst: string;
    keyStocks: string[];
    economicJustification?: string;
    linkedNewsHeadline?: string;
    officialSourceRef?: string;
    sourceTrustScore?: number;
  }[];
  todayCatalystsAndRisks: {
    catalysts: string[];
    risks: string[];
  };
  institutionalActivity: {
    fiiCashNetCrores: number; // e.g. -1420
    diiCashNetCrores: number; // e.g. +2150
    fiiIndexFuturesLongShortRatio: number; // e.g. 0.42 (42% long)
    proAndRetailSentiment: string;
    flowJustification?: string;
  };
  stocksRequiringAttention: {
    ticker: string;
    companyName: string;
    direction: ImpactDirection;
    catalystForToday: string;
    confidenceScore: number;
    assumptions: string;
    invalidationTrigger: string;
    historicalHitRate: number; // e.g. 81.2%
    thesisJustification?: string;
    valuationImpact?: string;
    keyRiskFactor?: string;
  }[];
  scenarioAnalysis: {
    bullScenario: {
      niftyTarget: string;
      drivers: string;
      probability: number;
    };
    baseScenario: {
      niftyTarget: string;
      drivers: string;
      probability: number;
    };
    bearScenario: {
      niftyTarget: string;
      drivers: string;
      probability: number;
    };
    whatInvalidatesView: string[];
  };
}

export interface AgentBotStatus {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: 'ACTIVE' | 'PROCESSING' | 'IDLE';
  specialization: string;
  confidenceWeight: number; // e.g. 1.2x
  lastAction: string;
  activeGuardrail: string;
}

export interface BacktestEventRecord {
  id: string;
  date: string;
  headline: string;
  affectedTicker: string;
  companyName: string;
  predictedDirection: ImpactDirection;
  predictedMagnitude: string;
  confidenceScore: number;
  actualOutcome1Day: string;
  actualOutcome5Day: string;
  directionalAccuracy: 'CORRECT' | 'INCORRECT' | 'WITHIN_CONFIDENCE_INTERVAL';
  transmissionVerified: boolean;
  brierScore: number; // calibration measure
  notes: string;
}

export interface GuardrailSystemMetrics {
  totalAnalyzedEvents: number;
  overallDirectionalHitRate: number; // e.g. 78.6%
  crossSourceConfirmationRate: number; // e.g. 91.4%
  duplicateClustersPrevented: number;
  averageCalibrationError: number; // e.g. 0.04
  unverifiedRumorsRejected: number;
}

export type DealType = 'M&A' | 'STRATEGIC_STAKE' | 'PRIVATE_EQUITY' | 'GOVERNMENT_CAPEX' | 'JOINT_VENTURE' | 'DIVESTMENT';

export interface DealActivity {
  id: string;
  headline: string;
  dealType: DealType;
  dealValueINR: string; // e.g. "₹26,000 Cr" or "$1.2B"
  acquirerOrInvestor: string;
  targetOrBeneficiary: string;
  status: 'ANNOUNCED' | 'REGULATORY_CLEARANCE' | 'COMPLETED' | 'AUCTION_BIDDING';
  strategicSignificance: string;
  listedTickersBenefited: string[];
}

export interface SectorIntelligence {
  id: string;
  name: string; // e.g. "Information Technology"
  benchmarkIndex: string; // e.g. "NIFTY IT"
  indexChangePercent: number; // e.g. +0.69
  marketCapWeightPercent: number; // e.g. 11.8%
  regimeSentiment: 'BULLISH' | 'MILDLY_POSITIVE' | 'NEUTRAL' | 'MILDLY_BEARISH' | 'BEARISH';
  subIndustries: string[]; // e.g. ["Enterprise Software", "Cloud Infrastructure", "VLSI Design & Semiconductor Services"]
  macroeconomicDrivers: {
    driver: string; // e.g. "US 10Y Sovereign Yields"
    currentStatus: string; // e.g. "4.24% (+4 bps)"
    transmissionImpact: string; // e.g. "Compresses valuation multiples for high-growth tech"
    directionOfImpact: ImpactDirection;
  }[];
  currentDynamics: string; // What is happening in this sector
  keyCatalysts: string[];
  regulatoryAndPolicyFront: string;
  dealsAndInvestments: DealActivity[];
  keyListedStocks: {
    ticker: string;
    companyName: string;
    industry: string;
    price: number;
    changePercent: number;
    expectedDirection: ImpactDirection;
    primaryMacroDriver: string;
  }[];
}

