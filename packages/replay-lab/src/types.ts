export type ReplayVerdict = 'passed' | 'failed' | 'degraded' | 'inconclusive' | 'fixture_only';

export type ReplayStepType =
  | 'token_snapshot'
  | 'creator_snapshot'
  | 'wallet_cluster_snapshot'
  | 'manipulation_snapshot'
  | 'risk_assessment'
  | 'aggregate_checkpoint';

export type ReplayErrorCode =
  | 'INVALID_REPLAY_SCENARIO'
  | 'INVALID_REPLAY_STEP'
  | 'INVALID_REPLAY_RUN'
  | 'INVALID_REPLAY_RESULT'
  | 'INVALID_REPLAY_COMPARISON'
  | 'UNSAFE_REPLAY_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'PROVIDER_DATA_FORBIDDEN'
  | 'PRIVATE_KEY_ACCESS_FORBIDDEN'
  | 'TRADE_INTENTS_FORBIDDEN'
  | 'EXECUTION_FORBIDDEN'
  | 'PAPER_TRADING_FORBIDDEN'
  | 'REPLAY_LAB_FIXTURE_ONLY';

export interface ReplayLabCapabilities {
  readonly canUseLiveData: false;
  readonly canUseSolanaRpc: false;
  readonly canUseProviderApis: false;
  readonly canAccessPrivateKeys: false;
  readonly canCreateTradeIntents: false;
  readonly canCreateExecutionPlans: false;
  readonly canPaperTrade: false;
  readonly canTrade: false;
  readonly canExecute: false;
  readonly fixtureOnly: true;
}

export interface ReplayStep {
  readonly stepId: string;
  readonly stepType: ReplayStepType;
  readonly sequence: number;
  readonly tokenFixtureRef?: string;
  readonly creatorFixtureRef?: string;
  readonly walletFixtureRef?: string;
  readonly manipulationFixtureRef?: string;
  readonly riskFixtureRef?: string;
  readonly notes?: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: boolean;
}

export interface ReplayScenario {
  readonly scenarioId: string;
  readonly displayName: string;
  readonly description: string;
  readonly steps: readonly ReplayStep[];
  readonly expectedOutcome: ReplayVerdict;
  readonly fixtureOnly: boolean;
  readonly liveData: false;
  readonly safeToDisplay: boolean;
}

export interface TokenReplaySummary {
  readonly riskScore: number;
  readonly confidence: number;
  readonly flags: readonly string[];
  readonly classification: string;
}

export interface CreatorReplaySummary {
  readonly riskScore: number;
  readonly confidence: number;
  readonly flags: readonly string[];
  readonly classification: string;
}

export interface WalletReplaySummary {
  readonly riskScore: number;
  readonly confidence: number;
  readonly flags: readonly string[];
  readonly classification: string;
}

export interface ManipulationReplaySummary {
  readonly riskScore: number;
  readonly confidence: number;
  readonly flags: readonly string[];
  readonly classification: string;
}

export interface RiskReplaySummary {
  readonly riskScore: number;
  readonly confidence: number;
  readonly flags: readonly string[];
  readonly classification: string;
}

export interface ReplayStepResult {
  readonly stepId: string;
  readonly sequence: number;
  readonly tokenSummary?: TokenReplaySummary;
  readonly creatorSummary?: CreatorReplaySummary;
  readonly walletSummary?: WalletReplaySummary;
  readonly manipulationSummary?: ManipulationReplaySummary;
  readonly riskSummary?: RiskReplaySummary;
  readonly verdict: ReplayVerdict;
  readonly warnings: readonly string[];
  readonly safeToDisplay: true;
}

export interface ReplaySummary {
  readonly totalSteps: number;
  readonly passedSteps: number;
  readonly failedSteps: number;
  readonly degradedSteps: number;
  readonly inconclusiveSteps: number;
  readonly finalVerdict: ReplayVerdict;
  readonly finalRiskScore: number;
  readonly averageConfidence: number;
  readonly warnings: readonly string[];
  readonly reasons: readonly string[];
  readonly safeToDisplay: true;
}

export interface ReplayRun {
  readonly runId: string;
  readonly scenarioId: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly stepResults: readonly ReplayStepResult[];
  readonly summary: ReplaySummary;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

export interface ReplayComparison {
  readonly comparisonId: string;
  readonly baselineRunId: string;
  readonly candidateRunId: string;
  readonly scoreDelta: number;
  readonly confidenceDelta: number;
  readonly verdictChanged: boolean;
  readonly summary: string;
  readonly safeToDisplay: true;
}

export interface ReplayLabError {
  readonly ok: false;
  readonly code: ReplayErrorCode;
  readonly message: string;
}

export type RlResult<T> = { readonly ok: true; readonly value: T } | ReplayLabError;
