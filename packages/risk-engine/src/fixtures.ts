/**
 * Phase 12 — Risk Engine v1: Deterministic fixtures for testing and validation.
 *
 * All fixtures use fixtureOnly: true, liveData: false.
 * No live data, no real token mints, no real wallet addresses.
 */

import type { RiskAssessmentInput } from './risk-input.js';
import type { RiskAssessmentResult } from './types.js';
import type { ReResult } from './errors.js';
import { buildRiskAssessmentResult } from './aggregate.js';
import { buildDefaultRiskPolicy } from './risk-policy.js';

const FIXTURE_REQUESTED_AT = '2024-01-01T00:00:00.000Z';
const FIXTURE_SOURCE = 'risk-engine-fixture';

// ---------------------------------------------------------------------------
// 1. CLEAN — all components present, high scores, no rejections → analysis_only
// ---------------------------------------------------------------------------

export const CLEAN_RISK_ASSESSMENT_INPUT: RiskAssessmentInput = {
  requestId: 'FIXTURE_RISK_CLEAN_0001',
  source: FIXTURE_SOURCE,
  requestedAt: FIXTURE_REQUESTED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  tokenIntelligence: {
    tokenMint: 'FIXTURE_RISK_TOKEN_CLEAN_0001',
    finalScore: 85,
    confidence: 0.9,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  creatorIntelligence: {
    creatorId: 'fixture_risk_creator_001',
    finalScore: 80,
    confidence: 0.85,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  walletClusterIntelligence: {
    clusterId: 'fixture_risk_wallet_001',
    finalScore: 78,
    confidence: 0.8,
    classification: 'normal',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  manipulationDetection: {
    tokenMint: 'FIXTURE_RISK_TOKEN_CLEAN_0001',
    finalScore: 82,
    confidence: 0.88,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
};

export const CLEAN_RISK_ASSESSMENT_RESULT: ReResult<RiskAssessmentResult> =
  buildRiskAssessmentResult(CLEAN_RISK_ASSESSMENT_INPUT, buildDefaultRiskPolicy());

// ---------------------------------------------------------------------------
// 2. TOKEN_REJECT — token hasRejection=true → block
// ---------------------------------------------------------------------------

export const TOKEN_REJECT_RISK_INPUT: RiskAssessmentInput = {
  requestId: 'FIXTURE_RISK_TOKEN_REJECT_0002',
  source: FIXTURE_SOURCE,
  requestedAt: FIXTURE_REQUESTED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  tokenIntelligence: {
    tokenMint: 'FIXTURE_RISK_TOKEN_REJECT_0002',
    finalScore: 10,
    confidence: 0.9,
    classification: 'rejected',
    hasRejection: true,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  creatorIntelligence: {
    creatorId: 'fixture_risk_creator_002',
    finalScore: 75,
    confidence: 0.8,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  walletClusterIntelligence: {
    clusterId: 'fixture_risk_wallet_002',
    finalScore: 70,
    confidence: 0.8,
    classification: 'normal',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  manipulationDetection: {
    tokenMint: 'FIXTURE_RISK_TOKEN_REJECT_0002',
    finalScore: 65,
    confidence: 0.7,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
};

export const TOKEN_REJECT_RISK_RESULT: ReResult<RiskAssessmentResult> =
  buildRiskAssessmentResult(TOKEN_REJECT_RISK_INPUT, buildDefaultRiskPolicy());

// ---------------------------------------------------------------------------
// 3. CREATOR_REJECT — creator hasRejection=true → block
// ---------------------------------------------------------------------------

export const CREATOR_REJECT_RISK_INPUT: RiskAssessmentInput = {
  requestId: 'FIXTURE_RISK_CREATOR_REJECT_0003',
  source: FIXTURE_SOURCE,
  requestedAt: FIXTURE_REQUESTED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  tokenIntelligence: {
    tokenMint: 'FIXTURE_RISK_TOKEN_003',
    finalScore: 70,
    confidence: 0.8,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  creatorIntelligence: {
    creatorId: 'fixture_risk_creator_003_rejected',
    finalScore: 8,
    confidence: 0.9,
    classification: 'rejected',
    hasRejection: true,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  walletClusterIntelligence: {
    clusterId: 'fixture_risk_wallet_003',
    finalScore: 72,
    confidence: 0.75,
    classification: 'normal',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  manipulationDetection: {
    tokenMint: 'FIXTURE_RISK_TOKEN_003',
    finalScore: 68,
    confidence: 0.7,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
};

export const CREATOR_REJECT_RISK_RESULT: ReResult<RiskAssessmentResult> =
  buildRiskAssessmentResult(CREATOR_REJECT_RISK_INPUT, buildDefaultRiskPolicy());

// ---------------------------------------------------------------------------
// 4. WALLET_REJECT — walletCluster hasRejection=true → block
// ---------------------------------------------------------------------------

export const WALLET_REJECT_RISK_INPUT: RiskAssessmentInput = {
  requestId: 'FIXTURE_RISK_WALLET_REJECT_0004',
  source: FIXTURE_SOURCE,
  requestedAt: FIXTURE_REQUESTED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  tokenIntelligence: {
    tokenMint: 'FIXTURE_RISK_TOKEN_004',
    finalScore: 72,
    confidence: 0.8,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  creatorIntelligence: {
    creatorId: 'fixture_risk_creator_004',
    finalScore: 70,
    confidence: 0.78,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  walletClusterIntelligence: {
    clusterId: 'fixture_risk_wallet_004_rejected',
    finalScore: 5,
    confidence: 0.95,
    classification: 'rejected',
    hasRejection: true,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  manipulationDetection: {
    tokenMint: 'FIXTURE_RISK_TOKEN_004',
    finalScore: 65,
    confidence: 0.7,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
};

export const WALLET_REJECT_RISK_RESULT: ReResult<RiskAssessmentResult> =
  buildRiskAssessmentResult(WALLET_REJECT_RISK_INPUT, buildDefaultRiskPolicy());

// ---------------------------------------------------------------------------
// 5. MANIPULATION_REJECT — manipulation hasRejection=true → block
// ---------------------------------------------------------------------------

export const MANIPULATION_REJECT_RISK_INPUT: RiskAssessmentInput = {
  requestId: 'FIXTURE_RISK_MANIPULATION_REJECT_0005',
  source: FIXTURE_SOURCE,
  requestedAt: FIXTURE_REQUESTED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  tokenIntelligence: {
    tokenMint: 'FIXTURE_RISK_TOKEN_005',
    finalScore: 68,
    confidence: 0.8,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  creatorIntelligence: {
    creatorId: 'fixture_risk_creator_005',
    finalScore: 70,
    confidence: 0.75,
    classification: 'clean',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  walletClusterIntelligence: {
    clusterId: 'fixture_risk_wallet_005',
    finalScore: 65,
    confidence: 0.75,
    classification: 'normal',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  manipulationDetection: {
    tokenMint: 'FIXTURE_RISK_TOKEN_005',
    finalScore: 3,
    confidence: 0.95,
    classification: 'rejected',
    hasRejection: true,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
};

export const MANIPULATION_REJECT_RISK_RESULT: ReResult<RiskAssessmentResult> =
  buildRiskAssessmentResult(MANIPULATION_REJECT_RISK_INPUT, buildDefaultRiskPolicy());

// ---------------------------------------------------------------------------
// 6. MISSING_DATA — no components at all → insufficient_data
// ---------------------------------------------------------------------------

export const MISSING_DATA_RISK_INPUT: RiskAssessmentInput = {
  requestId: 'FIXTURE_RISK_MISSING_DATA_0006',
  source: FIXTURE_SOURCE,
  requestedAt: FIXTURE_REQUESTED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const MISSING_DATA_RISK_RESULT: ReResult<RiskAssessmentResult> =
  buildRiskAssessmentResult(MISSING_DATA_RISK_INPUT, buildDefaultRiskPolicy());

// ---------------------------------------------------------------------------
// 7. LOW_CONFIDENCE — all present but confidence=0.1 → watch_only
// ---------------------------------------------------------------------------

// All components present with low individual confidence (0.1) and low scores (~35-42).
// Coverage ratio = 1.0 pushes overall confidence to ~0.46 (above 0.3 threshold),
// so watch_only is reached via the score path: adjusted score ~39 < watchBelowScore 50.
export const LOW_CONFIDENCE_RISK_INPUT: RiskAssessmentInput = {
  requestId: 'FIXTURE_RISK_LOW_CONFIDENCE_0007',
  source: FIXTURE_SOURCE,
  requestedAt: FIXTURE_REQUESTED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  tokenIntelligence: {
    tokenMint: 'FIXTURE_RISK_TOKEN_007',
    finalScore: 35,
    confidence: 0.1,
    classification: 'uncertain',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  creatorIntelligence: {
    creatorId: 'fixture_risk_creator_007',
    finalScore: 38,
    confidence: 0.1,
    classification: 'uncertain',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  walletClusterIntelligence: {
    clusterId: 'fixture_risk_wallet_007',
    finalScore: 40,
    confidence: 0.1,
    classification: 'uncertain',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  manipulationDetection: {
    tokenMint: 'FIXTURE_RISK_TOKEN_007',
    finalScore: 42,
    confidence: 0.1,
    classification: 'uncertain',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
};

export const LOW_CONFIDENCE_RISK_RESULT: ReResult<RiskAssessmentResult> =
  buildRiskAssessmentResult(LOW_CONFIDENCE_RISK_INPUT, buildDefaultRiskPolicy());

// ---------------------------------------------------------------------------
// 8. MIXED_WARNING — some warnings but overall ok → watch_only or analysis_only
// ---------------------------------------------------------------------------

export const MIXED_WARNING_RISK_INPUT: RiskAssessmentInput = {
  requestId: 'FIXTURE_RISK_MIXED_WARNING_0008',
  source: FIXTURE_SOURCE,
  requestedAt: FIXTURE_REQUESTED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  tokenIntelligence: {
    tokenMint: 'FIXTURE_RISK_TOKEN_008',
    finalScore: 55,
    confidence: 0.65,
    classification: 'moderate',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  creatorIntelligence: {
    creatorId: 'fixture_risk_creator_008',
    finalScore: 45,
    confidence: 0.6,
    classification: 'moderate',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  // walletCluster missing — generates a warning flag
  manipulationDetection: {
    tokenMint: 'FIXTURE_RISK_TOKEN_008',
    finalScore: 50,
    confidence: 0.55,
    classification: 'moderate',
    hasRejection: false,
    hasCriticalFlags: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
};

export const MIXED_WARNING_RISK_RESULT: ReResult<RiskAssessmentResult> =
  buildRiskAssessmentResult(MIXED_WARNING_RISK_INPUT, buildDefaultRiskPolicy());

// ---------------------------------------------------------------------------
// Convenience exports
// ---------------------------------------------------------------------------

export const ALL_RISK_FIXTURES = [
  { name: 'CLEAN', input: CLEAN_RISK_ASSESSMENT_INPUT, result: CLEAN_RISK_ASSESSMENT_RESULT },
  { name: 'TOKEN_REJECT', input: TOKEN_REJECT_RISK_INPUT, result: TOKEN_REJECT_RISK_RESULT },
  { name: 'CREATOR_REJECT', input: CREATOR_REJECT_RISK_INPUT, result: CREATOR_REJECT_RISK_RESULT },
  { name: 'WALLET_REJECT', input: WALLET_REJECT_RISK_INPUT, result: WALLET_REJECT_RISK_RESULT },
  {
    name: 'MANIPULATION_REJECT',
    input: MANIPULATION_REJECT_RISK_INPUT,
    result: MANIPULATION_REJECT_RISK_RESULT,
  },
  { name: 'MISSING_DATA', input: MISSING_DATA_RISK_INPUT, result: MISSING_DATA_RISK_RESULT },
  {
    name: 'LOW_CONFIDENCE',
    input: LOW_CONFIDENCE_RISK_INPUT,
    result: LOW_CONFIDENCE_RISK_RESULT,
  },
  {
    name: 'MIXED_WARNING',
    input: MIXED_WARNING_RISK_INPUT,
    result: MIXED_WARNING_RISK_RESULT,
  },
] as const;
