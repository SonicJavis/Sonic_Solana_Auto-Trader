/**
 * Phase 58 — Launch Risk Engine v1: builders.
 *
 * Deterministic fixture builders for the launch risk engine.
 * Non-advisory, synthetic, local-only, rule-based.
 */

import { getLaunchRiskEngineCapabilities } from './capabilities.js';
import { buildLaunchRiskEngineApiContract } from './contracts.js';
import { LAUNCH_RISK_FACTOR_DEFINITIONS } from './factors.js';
import { stableDeterministicLaunchRiskEngineChecksum } from './normalization.js';
import { LAUNCH_RISK_ENGINE_DEFAULT_THRESHOLDS, classifyLaunchRiskBand } from './thresholds.js';
import { calculateLaunchRiskScore } from './scoring.js';
import { buildLaunchRiskAssessment } from './assessments.js';
import { buildLaunchRiskEngineViewModel } from './view-models.js';
import {
  LAUNCH_RISK_ENGINE_PHASE,
  PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
  PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION,
  PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
  PHASE_58_LAUNCH_RISK_ENGINE_VERSION,
  type BuildLaunchRiskEngineFixtureInput,
  type LaunchRiskConfidenceLabel,
  type LaunchRiskEngineAssessmentKind,
  type LaunchRiskEngineAssessmentName,
  type LaunchRiskEngineFixture,
  type LaunchRiskEngineSelectorResult,
  type LaunchRiskFactorOutput,
  type LaunchRiskSeverity,
} from './types.js';

// ─── Scenario Definitions ─────────────────────────────────────────────────────

interface RiskScenarioDefinition {
  readonly assessmentKind: LaunchRiskEngineAssessmentKind;
  readonly sourceLifecycleFixtureName:
    | 'clean-launch-lifecycle-stream'
    | 'thin-liquidity-lifecycle-stream'
    | 'concentrated-holders-lifecycle-stream'
    | 'suspicious-creator-lifecycle-stream'
    | 'bundle-cluster-lifecycle-stream'
    | 'metadata-incomplete-lifecycle-stream'
    | 'high-early-volume-lifecycle-stream'
    | 'safety-rejected-lifecycle-stream';
  readonly sourceReplayFixtureName:
    | 'clean-launch-replay'
    | 'thin-liquidity-replay'
    | 'concentrated-holders-replay'
    | 'suspicious-creator-replay'
    | 'possible-bundle-cluster-replay'
    | 'metadata-incomplete-replay'
    | 'high-early-volume-replay'
    | 'safety-rejected-replay';
}

const RISK_SCENARIO_DEFINITIONS: Readonly<
  Record<LaunchRiskEngineAssessmentName, RiskScenarioDefinition>
> = {
  'clean-launch-risk-assessment': {
    assessmentKind: 'clean_launch_risk',
    sourceLifecycleFixtureName: 'clean-launch-lifecycle-stream',
    sourceReplayFixtureName: 'clean-launch-replay',
  },
  'thin-liquidity-risk-assessment': {
    assessmentKind: 'thin_liquidity_risk',
    sourceLifecycleFixtureName: 'thin-liquidity-lifecycle-stream',
    sourceReplayFixtureName: 'thin-liquidity-replay',
  },
  'concentrated-holders-risk-assessment': {
    assessmentKind: 'concentrated_holders_risk',
    sourceLifecycleFixtureName: 'concentrated-holders-lifecycle-stream',
    sourceReplayFixtureName: 'concentrated-holders-replay',
  },
  'suspicious-creator-risk-assessment': {
    assessmentKind: 'suspicious_creator_risk',
    sourceLifecycleFixtureName: 'suspicious-creator-lifecycle-stream',
    sourceReplayFixtureName: 'suspicious-creator-replay',
  },
  'possible-bundle-cluster-risk-assessment': {
    assessmentKind: 'possible_bundle_cluster_risk',
    sourceLifecycleFixtureName: 'bundle-cluster-lifecycle-stream',
    sourceReplayFixtureName: 'possible-bundle-cluster-replay',
  },
  'metadata-incomplete-risk-assessment': {
    assessmentKind: 'metadata_incomplete_risk',
    sourceLifecycleFixtureName: 'metadata-incomplete-lifecycle-stream',
    sourceReplayFixtureName: 'metadata-incomplete-replay',
  },
  'high-early-volume-risk-assessment': {
    assessmentKind: 'high_early_volume_risk',
    sourceLifecycleFixtureName: 'high-early-volume-lifecycle-stream',
    sourceReplayFixtureName: 'high-early-volume-replay',
  },
  'safety-rejected-risk-assessment': {
    assessmentKind: 'safety_rejected_risk',
    sourceLifecycleFixtureName: 'safety-rejected-lifecycle-stream',
    sourceReplayFixtureName: 'safety-rejected-replay',
  },
} as const;

// ─── Factor Output Builder ────────────────────────────────────────────────────

export function buildLaunchRiskFactorOutput(options: {
  readonly assessmentId: string;
  readonly factorKind: (typeof import('./types.js').LAUNCH_RISK_FACTOR_KINDS)[number];
  readonly scoreContribution: number;
  readonly severityLevel: number;
  readonly confidenceIndex: number;
  readonly reasonSuffix: string;
  readonly summary: string;
  readonly sourceLifecycleEventIds: readonly string[];
  readonly sourceReplaySnapshotIds: readonly string[];
  readonly evidenceReferenceIds: readonly string[];
  readonly safetyNotes: readonly string[];
}): LaunchRiskFactorOutput {
  const definition = LAUNCH_RISK_FACTOR_DEFINITIONS[options.factorKind];
  const severities: readonly LaunchRiskSeverity[] = [
    'none',
    'low',
    'moderate',
    'elevated',
    'high',
    'critical',
  ];
  const confidenceLabels: readonly LaunchRiskConfidenceLabel[] = [
    'high_confidence',
    'moderate_confidence',
    'low_confidence',
    'insufficient_evidence',
  ];
  const severityIndex = Math.min(options.severityLevel, severities.length - 1);
  const confidenceIndex = Math.min(options.confidenceIndex, confidenceLabels.length - 1);
  const severity: LaunchRiskSeverity = severities[severityIndex] ?? 'none';
  const confidenceLabel: LaunchRiskConfidenceLabel =
    confidenceLabels[confidenceIndex] ?? 'high_confidence';
  return {
    factorId: `phase58-factor-${options.assessmentId}-${options.factorKind}`,
    factorKind: options.factorKind,
    severity,
    scoreContribution: Math.min(1, Math.max(0, options.scoreContribution)),
    weight: definition.weight,
    confidenceLabel,
    reasonCode: `${definition.reasonCodePrefix}_${options.reasonSuffix}`,
    summary: options.summary,
    sourceLifecycleEventIds: options.sourceLifecycleEventIds,
    sourceReplaySnapshotIds: options.sourceReplaySnapshotIds,
    evidenceReferenceIds: options.evidenceReferenceIds,
    safetyNotes: options.safetyNotes,
  };
}

// ─── Per-Scenario Factor Definitions ─────────────────────────────────────────

function buildCleanLaunchFactors(assessmentId: string): readonly LaunchRiskFactorOutput[] {
  return [
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'metadata_completeness_risk',
      scoreContribution: 0.05,
      severityLevel: 0,
      confidenceIndex: 0,
      reasonSuffix: 'COMPLETE',
      summary: 'Metadata observed as complete in lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-metadata-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-metadata-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'mint_authority_risk',
      scoreContribution: 0.05,
      severityLevel: 0,
      confidenceIndex: 0,
      reasonSuffix: 'REVOKED',
      summary: 'Mint authority observed as revoked in lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-mint-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-mint-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'thin_liquidity_risk',
      scoreContribution: 0.05,
      severityLevel: 0,
      confidenceIndex: 0,
      reasonSuffix: 'ADEQUATE',
      summary: 'Liquidity depth observed as adequate in lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-liq-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`],
      evidenceReferenceIds: [`${assessmentId}-evid-liq-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'holder_concentration_risk',
      scoreContribution: 0.05,
      severityLevel: 0,
      confidenceIndex: 0,
      reasonSuffix: 'DISTRIBUTED',
      summary: 'Holder distribution observed as distributed in lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-holder-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [`${assessmentId}-evid-holder-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'replay_integrity_risk',
      scoreContribution: 0.00,
      severityLevel: 0,
      confidenceIndex: 0,
      reasonSuffix: 'PASSED',
      summary: 'Phase 57 replay report observed as passed for this lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-review-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-4`],
      evidenceReferenceIds: [`${assessmentId}-evid-replay-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
  ];
}

function buildThinLiquidityFactors(assessmentId: string): readonly LaunchRiskFactorOutput[] {
  return [
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'metadata_completeness_risk',
      scoreContribution: 0.10,
      severityLevel: 1,
      confidenceIndex: 0,
      reasonSuffix: 'PARTIAL',
      summary: 'Metadata observed as partially complete in lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-metadata-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-metadata-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'thin_liquidity_risk',
      scoreContribution: 0.90,
      severityLevel: 4,
      confidenceIndex: 0,
      reasonSuffix: 'OBSERVED_THIN',
      summary: 'Thin liquidity depth observed in lifecycle liquidity events.',
      sourceLifecycleEventIds: [
        `${assessmentId}-lc-evt-liq-1`,
        `${assessmentId}-lc-evt-liq-2`,
      ],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`, `${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [`${assessmentId}-evid-liq-1`, `${assessmentId}-evid-liq-2`],
      safetyNotes: ['Fixture-only risk classification. Not a signal or trading instruction.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'liquidity_volatility_risk',
      scoreContribution: 0.65,
      severityLevel: 3,
      confidenceIndex: 1,
      reasonSuffix: 'HIGH_VARIANCE',
      summary: 'High liquidity change variance observed in lifecycle events.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-liq-3`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [`${assessmentId}-evid-liqvol-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'replay_integrity_risk',
      scoreContribution: 0.10,
      severityLevel: 1,
      confidenceIndex: 0,
      reasonSuffix: 'PASSED_WITH_NOTES',
      summary: 'Phase 57 replay passed with non-critical notes for this lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-review-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-4`],
      evidenceReferenceIds: [`${assessmentId}-evid-replay-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
  ];
}

function buildConcentratedHoldersFactors(assessmentId: string): readonly LaunchRiskFactorOutput[] {
  return [
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'holder_concentration_risk',
      scoreContribution: 0.88,
      severityLevel: 4,
      confidenceIndex: 0,
      reasonSuffix: 'CONCENTRATED_OBSERVED',
      summary: 'High holder concentration observed in lifecycle holder distribution events.',
      sourceLifecycleEventIds: [
        `${assessmentId}-lc-evt-holder-1`,
        `${assessmentId}-lc-evt-holder-2`,
      ],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`],
      evidenceReferenceIds: [
        `${assessmentId}-evid-holder-1`,
        `${assessmentId}-evid-holder-2`,
      ],
      safetyNotes: ['Fixture-only risk classification. Not a signal or trading instruction.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'wallet_cluster_risk',
      scoreContribution: 0.55,
      severityLevel: 3,
      confidenceIndex: 1,
      reasonSuffix: 'CLUSTER_OBSERVED',
      summary: 'Wallet cluster pattern observed in lifecycle wallet cluster events.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-cluster-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [`${assessmentId}-evid-cluster-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'thin_liquidity_risk',
      scoreContribution: 0.30,
      severityLevel: 2,
      confidenceIndex: 1,
      reasonSuffix: 'MODERATE_THIN',
      summary: 'Moderate thin liquidity observed in lifecycle liquidity events.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-liq-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-liq-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'replay_integrity_risk',
      scoreContribution: 0.05,
      severityLevel: 0,
      confidenceIndex: 0,
      reasonSuffix: 'PASSED',
      summary: 'Phase 57 replay passed for this lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-review-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-4`],
      evidenceReferenceIds: [`${assessmentId}-evid-replay-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
  ];
}

function buildSuspiciousCreatorFactors(assessmentId: string): readonly LaunchRiskFactorOutput[] {
  return [
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'creator_activity_risk',
      scoreContribution: 0.82,
      severityLevel: 4,
      confidenceIndex: 0,
      reasonSuffix: 'ANOMALOUS_OBSERVED',
      summary: 'Anomalous creator activity pattern observed in lifecycle creator events.',
      sourceLifecycleEventIds: [
        `${assessmentId}-lc-evt-creator-1`,
        `${assessmentId}-lc-evt-creator-2`,
      ],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`, `${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [
        `${assessmentId}-evid-creator-1`,
        `${assessmentId}-evid-creator-2`,
      ],
      safetyNotes: ['Fixture-only risk classification. Not a signal or trading instruction.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'wallet_cluster_risk',
      scoreContribution: 0.60,
      severityLevel: 3,
      confidenceIndex: 1,
      reasonSuffix: 'RELATED_CLUSTER',
      summary: 'Wallet cluster pattern correlated with creator observed in lifecycle events.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-cluster-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [`${assessmentId}-evid-cluster-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'metadata_completeness_risk',
      scoreContribution: 0.20,
      severityLevel: 1,
      confidenceIndex: 0,
      reasonSuffix: 'PARTIAL',
      summary: 'Partial metadata completeness observed in lifecycle events.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-metadata-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-metadata-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'replay_integrity_risk',
      scoreContribution: 0.15,
      severityLevel: 1,
      confidenceIndex: 0,
      reasonSuffix: 'PASSED_WITH_NOTES',
      summary: 'Phase 57 replay passed with notes for this lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-review-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-4`],
      evidenceReferenceIds: [`${assessmentId}-evid-replay-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
  ];
}

function buildBundleClusterFactors(assessmentId: string): readonly LaunchRiskFactorOutput[] {
  return [
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'bundle_like_pattern_risk',
      scoreContribution: 0.92,
      severityLevel: 4,
      confidenceIndex: 1,
      reasonSuffix: 'BUNDLE_PATTERN_OBSERVED',
      summary: 'Bundle-like pattern observed in lifecycle bundle pattern events.',
      sourceLifecycleEventIds: [
        `${assessmentId}-lc-evt-bundle-1`,
        `${assessmentId}-lc-evt-bundle-2`,
      ],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`],
      evidenceReferenceIds: [
        `${assessmentId}-evid-bundle-1`,
        `${assessmentId}-evid-bundle-2`,
      ],
      safetyNotes: ['Fixture-only risk classification. Not a signal or trading instruction.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'wallet_cluster_risk',
      scoreContribution: 0.78,
      severityLevel: 4,
      confidenceIndex: 1,
      reasonSuffix: 'CLUSTERED',
      summary: 'Wallet cluster pattern consistent with bundle-like activity.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-cluster-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [`${assessmentId}-evid-cluster-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'early_volume_burst_risk',
      scoreContribution: 0.70,
      severityLevel: 3,
      confidenceIndex: 1,
      reasonSuffix: 'BURST_OBSERVED',
      summary: 'Early volume burst observed coincident with bundle-like pattern.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-vol-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`],
      evidenceReferenceIds: [`${assessmentId}-evid-vol-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'replay_integrity_risk',
      scoreContribution: 0.15,
      severityLevel: 1,
      confidenceIndex: 0,
      reasonSuffix: 'PASSED',
      summary: 'Phase 57 replay passed for this lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-review-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-4`],
      evidenceReferenceIds: [`${assessmentId}-evid-replay-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
  ];
}

function buildMetadataIncompleteFactors(assessmentId: string): readonly LaunchRiskFactorOutput[] {
  return [
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'metadata_completeness_risk',
      scoreContribution: 0.95,
      severityLevel: 4,
      confidenceIndex: 0,
      reasonSuffix: 'INCOMPLETE_OBSERVED',
      summary: 'Significant metadata incompleteness observed in lifecycle events.',
      sourceLifecycleEventIds: [
        `${assessmentId}-lc-evt-metadata-1`,
        `${assessmentId}-lc-evt-metadata-2`,
      ],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`, `${assessmentId}-rp-snap-2`],
      evidenceReferenceIds: [
        `${assessmentId}-evid-metadata-1`,
        `${assessmentId}-evid-metadata-2`,
      ],
      safetyNotes: ['Fixture-only risk classification. Not a signal or trading instruction.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'mint_authority_risk',
      scoreContribution: 0.50,
      severityLevel: 3,
      confidenceIndex: 1,
      reasonSuffix: 'ACTIVE',
      summary: 'Mint authority observed as active (not revoked) in lifecycle events.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-mint-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-mint-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'freeze_authority_risk',
      scoreContribution: 0.40,
      severityLevel: 2,
      confidenceIndex: 1,
      reasonSuffix: 'ACTIVE',
      summary: 'Freeze authority observed as active (not revoked) in lifecycle events.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-freeze-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-freeze-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'replay_integrity_risk',
      scoreContribution: 0.20,
      severityLevel: 1,
      confidenceIndex: 0,
      reasonSuffix: 'PASSED_WITH_NOTES',
      summary: 'Phase 57 replay passed with notes for this lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-review-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [`${assessmentId}-evid-replay-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
  ];
}

function buildHighEarlyVolumeFactors(assessmentId: string): readonly LaunchRiskFactorOutput[] {
  return [
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'early_volume_burst_risk',
      scoreContribution: 0.88,
      severityLevel: 4,
      confidenceIndex: 0,
      reasonSuffix: 'HIGH_BURST_OBSERVED',
      summary: 'High early volume burst observed in lifecycle early volume events.',
      sourceLifecycleEventIds: [
        `${assessmentId}-lc-evt-vol-1`,
        `${assessmentId}-lc-evt-vol-2`,
      ],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`],
      evidenceReferenceIds: [
        `${assessmentId}-evid-vol-1`,
        `${assessmentId}-evid-vol-2`,
      ],
      safetyNotes: ['Fixture-only risk classification. Not a signal or trading instruction.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'liquidity_volatility_risk',
      scoreContribution: 0.55,
      severityLevel: 3,
      confidenceIndex: 1,
      reasonSuffix: 'HIGH_VARIANCE',
      summary: 'High liquidity volatility correlated with early volume burst.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-liq-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-3`],
      evidenceReferenceIds: [`${assessmentId}-evid-liqvol-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'holder_concentration_risk',
      scoreContribution: 0.40,
      severityLevel: 2,
      confidenceIndex: 1,
      reasonSuffix: 'MODERATE_CONCENTRATION',
      summary: 'Moderate holder concentration observed coincident with high early volume.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-holder-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`],
      evidenceReferenceIds: [`${assessmentId}-evid-holder-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'replay_integrity_risk',
      scoreContribution: 0.10,
      severityLevel: 1,
      confidenceIndex: 0,
      reasonSuffix: 'PASSED',
      summary: 'Phase 57 replay passed for this lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-review-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-4`],
      evidenceReferenceIds: [`${assessmentId}-evid-replay-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
  ];
}

function buildSafetyRejectedFactors(assessmentId: string): readonly LaunchRiskFactorOutput[] {
  return [
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'safety_rejection_risk',
      scoreContribution: 1.00,
      severityLevel: 5,
      confidenceIndex: 0,
      reasonSuffix: 'SAFETY_REJECTION_OBSERVED',
      summary: 'Safety rejection observed in lifecycle safety rejection events.',
      sourceLifecycleEventIds: [
        `${assessmentId}-lc-evt-safety-1`,
        `${assessmentId}-lc-evt-safety-2`,
      ],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [
        `${assessmentId}-evid-safety-1`,
        `${assessmentId}-evid-safety-2`,
      ],
      safetyNotes: [
        'Fixture-only safety rejection classification. Not a trading instruction.',
        'This is a safety risk classification derived from lifecycle data only.',
      ],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'mint_authority_risk',
      scoreContribution: 0.80,
      severityLevel: 4,
      confidenceIndex: 0,
      reasonSuffix: 'ACTIVE_AT_REJECTION',
      summary: 'Mint authority observed active at time of safety rejection.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-mint-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-mint-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'freeze_authority_risk',
      scoreContribution: 0.80,
      severityLevel: 4,
      confidenceIndex: 0,
      reasonSuffix: 'ACTIVE_AT_REJECTION',
      summary: 'Freeze authority observed active at time of safety rejection.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-freeze-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-1`],
      evidenceReferenceIds: [`${assessmentId}-evid-freeze-1`],
      safetyNotes: ['Fixture-only observed classification. Not a signal.'],
    }),
    buildLaunchRiskFactorOutput({
      assessmentId,
      factorKind: 'replay_integrity_risk',
      scoreContribution: 0.70,
      severityLevel: 3,
      confidenceIndex: 0,
      reasonSuffix: 'REJECTED_REPLAY',
      summary: 'Phase 57 replay classified as rejected for this safety-rejected lifecycle stream.',
      sourceLifecycleEventIds: [`${assessmentId}-lc-evt-review-1`],
      sourceReplaySnapshotIds: [`${assessmentId}-rp-snap-2`],
      evidenceReferenceIds: [`${assessmentId}-evid-replay-1`],
      safetyNotes: ['Fixture-only observed classification. Replay rejection is a safety classification.'],
    }),
  ];
}

function buildFactorsForScenario(
  assessmentName: LaunchRiskEngineAssessmentName,
  assessmentId: string,
): readonly LaunchRiskFactorOutput[] {
  switch (assessmentName) {
    case 'clean-launch-risk-assessment':
      return buildCleanLaunchFactors(assessmentId);
    case 'thin-liquidity-risk-assessment':
      return buildThinLiquidityFactors(assessmentId);
    case 'concentrated-holders-risk-assessment':
      return buildConcentratedHoldersFactors(assessmentId);
    case 'suspicious-creator-risk-assessment':
      return buildSuspiciousCreatorFactors(assessmentId);
    case 'possible-bundle-cluster-risk-assessment':
      return buildBundleClusterFactors(assessmentId);
    case 'metadata-incomplete-risk-assessment':
      return buildMetadataIncompleteFactors(assessmentId);
    case 'high-early-volume-risk-assessment':
      return buildHighEarlyVolumeFactors(assessmentId);
    case 'safety-rejected-risk-assessment':
      return buildSafetyRejectedFactors(assessmentId);
  }
}

function buildHardRejectionReasons(
  assessmentName: LaunchRiskEngineAssessmentName,
): readonly string[] {
  if (assessmentName === 'safety-rejected-risk-assessment') {
    return [
      'Safety rejection observed in lifecycle events. Risk classification: rejected.',
      'Non-actionable safety classification derived from fixture data only.',
    ];
  }
  return [];
}

function buildSoftWarningReasons(
  assessmentName: LaunchRiskEngineAssessmentName,
): readonly string[] {
  switch (assessmentName) {
    case 'thin-liquidity-risk-assessment':
      return ['Thin liquidity observed. Risk classification: requires review.'];
    case 'concentrated-holders-risk-assessment':
      return ['Concentrated holders observed. Risk classification: requires review.'];
    case 'suspicious-creator-risk-assessment':
      return ['Anomalous creator activity observed. Risk classification: requires review.'];
    case 'possible-bundle-cluster-risk-assessment':
      return ['Bundle-like pattern observed. Risk classification: requires review.'];
    case 'metadata-incomplete-risk-assessment':
      return ['Incomplete metadata observed. Risk classification: requires review.'];
    case 'high-early-volume-risk-assessment':
      return ['High early volume burst observed. Risk classification: requires review.'];
    default:
      return [];
  }
}

// ─── Main Fixture Builder ─────────────────────────────────────────────────────

export function buildLaunchRiskEngineFixture(
  input: BuildLaunchRiskEngineFixtureInput,
): LaunchRiskEngineFixture {
  const { fixtureName } = input;
  const scenario = RISK_SCENARIO_DEFINITIONS[fixtureName];
  const deterministicSeed = stableDeterministicLaunchRiskEngineChecksum(
    `phase58-${fixtureName}-seed`,
  );
  const fixtureId = `phase58-fixture-${fixtureName}`;
  const assessmentId = `phase58-assessment-${fixtureName}`;

  const factorOutputs = buildFactorsForScenario(fixtureName, assessmentId);
  const totalRiskScore = calculateLaunchRiskScore(factorOutputs);
  const riskBand = classifyLaunchRiskBand(totalRiskScore);
  const hardRejectionReasons = buildHardRejectionReasons(fixtureName);
  const softWarningReasons = buildSoftWarningReasons(fixtureName);

  const assessment = buildLaunchRiskAssessment({
    assessmentId,
    assessmentName: fixtureName,
    sourceLifecycleFixtureName: scenario.sourceLifecycleFixtureName,
    sourceReplayFixtureName: scenario.sourceReplayFixtureName,
    factorOutputs,
    hardRejectionReasons,
    softWarningReasons,
    summary: `Risk classification: ${riskBand}. Derived from ${factorOutputs.length} observed risk factors across lifecycle and replay data.`,
    validationSummary:
      'All fixture fields validated. Deterministic. Local-only. Non-advisory.',
    safetySummary:
      'Fixture-only risk classification. Non-actionable, non-advisory, and not a signal.',
  });

  const riskIdentity = {
    assessmentId,
    assessmentName: fixtureName,
    assessmentKind: scenario.assessmentKind,
    sourceLifecycleFixtureName: scenario.sourceLifecycleFixtureName,
    sourceReplayFixtureName: scenario.sourceReplayFixtureName,
    schemaVersion: PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION,
    deterministicSeed,
    generatedAt: PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
  } as const;

  const capabilityFlags = getLaunchRiskEngineCapabilities();

  const selectorExample: LaunchRiskEngineSelectorResult = {
    selectorId: `phase58-selector-${fixtureId}`,
    selectedFixtureId: fixtureId,
    selectedFixtureKind: scenario.assessmentKind,
    matched: true,
    source: 'synthetic_fixture_only',
  };

  // Build the partial fixture for view model and contract builders
  const partialFixture = {
    fixtureId,
    fixtureName,
    fixtureKind: scenario.assessmentKind,
    phase: LAUNCH_RISK_ENGINE_PHASE,
    schemaVersion: PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION,
    sourceLifecycleFixtureName: scenario.sourceLifecycleFixtureName,
    sourceReplayFixtureName: scenario.sourceReplayFixtureName,
    riskIdentity,
    factorOutputs,
    thresholds: LAUNCH_RISK_ENGINE_DEFAULT_THRESHOLDS,
    assessment,
    capabilityFlags,
    meta: {
      generatedAt: PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
      source: PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
      version: PHASE_58_LAUNCH_RISK_ENGINE_VERSION,
      phase: LAUNCH_RISK_ENGINE_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true as const,
      localOnly: true as const,
      readOnly: true as const,
      noLiveData: true as const,
      noNetworkAccess: true as const,
      nonAdvisory: true as const,
      notASignal: true as const,
    },
  };

  const viewModel = buildLaunchRiskEngineViewModel(partialFixture as LaunchRiskEngineFixture);

  const completeFixture: LaunchRiskEngineFixture = {
    ...partialFixture,
    viewModel,
    apiContracts: buildLaunchRiskEngineApiContract({
      ...partialFixture,
      viewModel,
      apiContracts: undefined as unknown as LaunchRiskEngineFixture['apiContracts'],
      selectorExamples: [selectorExample],
    } as LaunchRiskEngineFixture),
    selectorExamples: [selectorExample],
  };

  return completeFixture;
}
