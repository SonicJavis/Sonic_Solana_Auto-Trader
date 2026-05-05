/**
 * Phase 12 — Risk Engine v1: Safe summary types and risk assessment input.
 *
 * These are local summary types — no imports from intelligence packages to
 * avoid circular dependencies. All liveData = false, fixtureOnly = true.
 */

export interface TokenIntelligenceSummary {
  readonly tokenMint: string;
  readonly finalScore: number;
  readonly confidence: number;
  readonly classification: string;
  readonly hasRejection: boolean;
  readonly hasCriticalFlags: boolean;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

export interface CreatorIntelligenceSummary {
  readonly creatorId: string;
  readonly finalScore: number;
  readonly confidence: number;
  readonly classification: string;
  readonly hasRejection: boolean;
  readonly hasCriticalFlags: boolean;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

export interface WalletClusterIntelligenceSummary {
  readonly clusterId: string;
  readonly finalScore: number;
  readonly confidence: number;
  readonly classification: string;
  readonly hasRejection: boolean;
  readonly hasCriticalFlags: boolean;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

export interface ManipulationDetectionSummary {
  readonly tokenMint: string;
  readonly finalScore: number;
  readonly confidence: number;
  readonly classification: string;
  readonly hasRejection: boolean;
  readonly hasCriticalFlags: boolean;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

export interface RiskAssessmentInput {
  readonly requestId: string;
  readonly tokenIntelligence?: TokenIntelligenceSummary;
  readonly creatorIntelligence?: CreatorIntelligenceSummary;
  readonly walletClusterIntelligence?: WalletClusterIntelligenceSummary;
  readonly manipulationDetection?: ManipulationDetectionSummary;
  readonly requestedAt: string;
  readonly source: string;
  readonly fixtureOnly: boolean;
  readonly liveData: false;
  readonly safeToDisplay: boolean;
}
