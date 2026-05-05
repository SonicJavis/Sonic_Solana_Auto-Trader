/**
 * Phase 12 — Risk Engine v1: Core result and capability types.
 */

import type { RiskFlagEntry } from './risk-flags.js';
import type { RiskDecision } from './risk-decision.js';
import type { RiskComponentScores } from './risk-score.js';
import type { RiskPolicy } from './risk-policy.js';

export interface RiskEngineCapabilities {
  readonly canUseLiveData: false;
  readonly canUseSolanaRpc: false;
  readonly canUseProviderApis: false;
  readonly canAccessPrivateKeys: false;
  readonly canCreateTradeIntents: false;
  readonly canCreateExecutionPlans: false;
  readonly canCreateEnforcementActions: false;
  readonly canTrade: false;
  readonly canExecute: false;
  readonly fixtureOnly: true;
  readonly safeToDisplay: true;
}

export interface RiskAssessmentResult {
  readonly resultId: string;
  readonly inputSummary: string;
  readonly policy: RiskPolicy;
  readonly componentScores: RiskComponentScores;
  readonly finalRiskScore: number;
  readonly confidence: number;
  readonly decision: RiskDecision;
  readonly blockingReasons: readonly string[];
  readonly warnings: readonly string[];
  readonly riskFlags: readonly RiskFlagEntry[];
  readonly generatedAt: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly actionAllowed: false;
  readonly tradingAllowed: false;
  readonly executionAllowed: false;
  readonly enforcementAllowed: false;
  readonly tradeIntentAllowed: false;
  readonly safeToDisplay: true;
}
