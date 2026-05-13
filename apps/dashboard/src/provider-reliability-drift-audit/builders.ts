import {
  CROSS_PROVIDER_DATA_QUALITY_FIXTURES,
  CROSS_PROVIDER_DATA_QUALITY_NAMES,
} from '../cross-provider-data-quality/index.js';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
} from '../first-read-only-provider-adapter/index.js';
import {
  LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES,
  LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES,
} from '../live-smoke-safety-certification/index.js';
import {
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
} from '../multi-provider-read-only-foundation/index.js';
import {
  PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES,
  PROVIDER_AWARE_REPLAY_SCENARIO_NAMES,
} from '../provider-aware-replay-scenarios/index.js';
import { getProviderReliabilityDriftAuditCapabilities } from './capabilities.js';
import { buildProviderCertificationTelemetryLinkage } from './certification-linkage.js';
import { buildProviderConfidenceTrend } from './confidence-trends.js';
import { buildProviderConformanceDrift } from './conformance-drift.js';
import { buildProviderReliabilityApiContract } from './contracts.js';
import { buildProviderDriftAudit } from './drift-detection.js';
import { buildProviderFreshnessModel } from './freshness-models.js';
import { buildProviderInstabilityEvent } from './instability-events.js';
import { buildProviderReplayDriftLinkage } from './replay-drift-linkage.js';
import { buildProviderReliabilityScore } from './reliability-scoring.js';
import { buildProviderReliabilityReport } from './reports.js';
import { buildProviderSchemaDrift } from './schema-drift.js';
import { buildProviderStaleDataAudit } from './stale-data-audits.js';
import { buildProviderTelemetrySample } from './telemetry-models.js';
import type {
  BuildProviderReliabilityDriftAuditFixtureInput,
  ProviderReliabilityDriftAuditFixture,
  ProviderReliabilityDriftAuditKind,
  ProviderReliabilityDriftAuditName,
  ProviderDriftKind,
  ProviderDriftSeverity,
} from './types.js';
import {
  PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT,
  PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION,
  PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SOURCE,
  PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_VERSION,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE,
} from './types.js';
import { buildProviderReliabilityViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: ProviderReliabilityDriftAuditKind;
  readonly providerId: string;
  readonly providerName: string;
  readonly sourcePhase: 65 | 66 | 67 | 68 | 69;
  readonly sourcePhase65FixtureName: (typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES)[number];
  readonly sourcePhase66FixtureName: (typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)[number];
  readonly sourcePhase67FixtureName: (typeof CROSS_PROVIDER_DATA_QUALITY_NAMES)[number];
  readonly sourcePhase68FixtureName: (typeof PROVIDER_AWARE_REPLAY_SCENARIO_NAMES)[number];
  readonly sourcePhase69FixtureName: (typeof LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES)[number];
  readonly sampledAt: string;
  readonly sampleKind: 'health_observation' | 'freshness_observation' | 'drift_observation';
  readonly observedStatus: 'healthy' | 'degraded' | 'stale' | 'drift_detected' | 'blocked';
  readonly latencyBucket: 'lt_250ms' | '250ms_to_750ms' | '750ms_to_1500ms' | 'gt_1500ms';
  readonly freshnessBucket: 'fresh' | 'aging' | 'stale' | 'critical_stale';
  readonly stale: boolean;
  readonly staleReasonCode: string;
  readonly observedSlotLagBucket: string;
  readonly observedAgeBucket: string;
  readonly deterministicWindow: string;
  readonly score: number;
  readonly scoreBand: 'very_low' | 'low' | 'medium' | 'high';
  readonly confidenceLabel: 'none' | 'low' | 'medium' | 'high' | 'very_high';
  readonly reasonCodes: readonly string[];
  readonly driftKind: ProviderDriftKind;
  readonly driftSeverity: ProviderDriftSeverity;
  readonly expectedShapeId: string;
  readonly observedShapeId: string;
  readonly mismatchFields: readonly string[];
  readonly conformanceStatus: 'conformant' | 'warning' | 'regressed' | 'critical';
  readonly failClosed: boolean;
  readonly expectedSchemaVersion: string;
  readonly observedSchemaVersion: string;
  readonly missingFields: readonly string[];
  readonly extraFields: readonly string[];
  readonly incompatibleFields: readonly string[];
  readonly safeToUse: boolean;
  readonly confidenceDirection: 'improving' | 'stable' | 'degrading';
  readonly eventKind: 'degraded_provider' | 'stale_provider' | 'inconsistent_provider' | 'certification_mismatch' | 'conformance_regression';
  readonly eventReasonCode: string;
  readonly eventSafetyNotes: readonly string[];
  readonly certificationStatus: 'certified_offline' | 'certification_failed' | 'manual_review_required';
  readonly telemetryCompatible: boolean;
  readonly driftCompatible: boolean;
  readonly replayParityStatus: 'passed' | 'failed' | 'rejected';
}

const BLUEPRINTS: Readonly<Record<ProviderReliabilityDriftAuditName, Blueprint>> = {
  'healthy-provider-stable-telemetry': {
    fixtureKind: 'healthy_provider_stable_telemetry',
    providerId: 'provider-a',
    providerName: 'Provider A',
    sourcePhase: 69,
    sourcePhase65FixtureName: 'offline-account-info-success',
    sourcePhase66FixtureName: 'single-provider-healthy',
    sourcePhase67FixtureName: 'all-providers-agree-high-confidence',
    sourcePhase68FixtureName: 'high-confidence-provider-agreement-scenario',
    sourcePhase69FixtureName: 'read-only-provider-certified-offline',
    sampledAt: '2026-05-13T00:00:00.000Z',
    sampleKind: 'health_observation',
    observedStatus: 'healthy',
    latencyBucket: 'lt_250ms',
    freshnessBucket: 'fresh',
    stale: false,
    staleReasonCode: 'FRESHNESS_IN_WINDOW',
    observedSlotLagBucket: 'slot_lag_0_4',
    observedAgeBucket: 'age_0_2s',
    deterministicWindow: 'window_slot_5_or_age_2s',
    score: 92,
    scoreBand: 'high',
    confidenceLabel: 'very_high',
    reasonCodes: ['HEALTHY_STABLE_TELEMETRY', 'FRESHNESS_IN_WINDOW'],
    driftKind: 'freshness_drift',
    driftSeverity: 'low',
    expectedShapeId: 'shape_provider_read_model_v1',
    observedShapeId: 'shape_provider_read_model_v1',
    mismatchFields: [],
    conformanceStatus: 'conformant',
    failClosed: false,
    expectedSchemaVersion: '1.0.0',
    observedSchemaVersion: '1.0.0',
    missingFields: [],
    extraFields: [],
    incompatibleFields: [],
    safeToUse: true,
    confidenceDirection: 'stable',
    eventKind: 'degraded_provider',
    eventReasonCode: 'NO_ACTIVE_INSTABILITY',
    eventSafetyNotes: ['deterministic-model-only', 'no-live-authorization'],
    certificationStatus: 'certified_offline',
    telemetryCompatible: true,
    driftCompatible: true,
    replayParityStatus: 'passed',
  },
  'stale-provider-drift-warning': {
    fixtureKind: 'stale_provider_drift_warning',
    providerId: 'provider-stale',
    providerName: 'Provider Stale',
    sourcePhase: 68,
    sourcePhase65FixtureName: 'offline-token-metadata-success',
    sourcePhase66FixtureName: 'stale-primary-provider',
    sourcePhase67FixtureName: 'stale-provider-mismatch',
    sourcePhase68FixtureName: 'stale-provider-replay-scenario',
    sourcePhase69FixtureName: 'stale-provider-certification-warning',
    sampledAt: '2026-05-13T00:05:00.000Z',
    sampleKind: 'freshness_observation',
    observedStatus: 'stale',
    latencyBucket: '750ms_to_1500ms',
    freshnessBucket: 'stale',
    stale: true,
    staleReasonCode: 'STALE_SLOT_LAG_WARNING',
    observedSlotLagBucket: 'slot_lag_25_64',
    observedAgeBucket: 'age_8_20s',
    deterministicWindow: 'window_slot_16_or_age_6s',
    score: 56,
    scoreBand: 'medium',
    confidenceLabel: 'medium',
    reasonCodes: ['STALE_PROVIDER_WARNING', 'MANUAL_REVIEW_REQUIRED'],
    driftKind: 'freshness_drift',
    driftSeverity: 'moderate',
    expectedShapeId: 'shape_provider_read_model_v1',
    observedShapeId: 'shape_provider_read_model_v1',
    mismatchFields: ['slot'],
    conformanceStatus: 'warning',
    failClosed: false,
    expectedSchemaVersion: '1.0.0',
    observedSchemaVersion: '1.0.0',
    missingFields: [],
    extraFields: [],
    incompatibleFields: [],
    safeToUse: true,
    confidenceDirection: 'degrading',
    eventKind: 'stale_provider',
    eventReasonCode: 'STALE_SLOT_LAG_WARNING',
    eventSafetyNotes: ['manual-review-gate', 'no-live-trading-meaning'],
    certificationStatus: 'manual_review_required',
    telemetryCompatible: true,
    driftCompatible: false,
    replayParityStatus: 'failed',
  },
  'schema-drift-fail-closed': {
    fixtureKind: 'schema_drift_fail_closed',
    providerId: 'provider-schema',
    providerName: 'Provider Schema Drift',
    sourcePhase: 67,
    sourcePhase65FixtureName: 'malformed-response-error',
    sourcePhase66FixtureName: 'capability-mismatch-rejected',
    sourcePhase67FixtureName: 'missing-field-partial-confidence',
    sourcePhase68FixtureName: 'missing-field-partial-scenario',
    sourcePhase69FixtureName: 'missing-provider-config-blocked',
    sampledAt: '2026-05-13T00:10:00.000Z',
    sampleKind: 'drift_observation',
    observedStatus: 'drift_detected',
    latencyBucket: '250ms_to_750ms',
    freshnessBucket: 'aging',
    stale: false,
    staleReasonCode: 'FRESHNESS_STILL_WITHIN_WINDOW',
    observedSlotLagBucket: 'slot_lag_5_12',
    observedAgeBucket: 'age_3_7s',
    deterministicWindow: 'window_slot_12_or_age_8s',
    score: 19,
    scoreBand: 'very_low',
    confidenceLabel: 'low',
    reasonCodes: ['SCHEMA_DRIFT_CRITICAL', 'FAIL_CLOSED_BLOCK'],
    driftKind: 'schema_drift',
    driftSeverity: 'critical',
    expectedShapeId: 'shape_provider_read_model_v1',
    observedShapeId: 'shape_provider_read_model_v2_unexpected',
    mismatchFields: ['token.supply', 'token.decimals'],
    conformanceStatus: 'critical',
    failClosed: true,
    expectedSchemaVersion: '1.0.0',
    observedSchemaVersion: '2.0.0',
    missingFields: ['token.decimals'],
    extraFields: ['token.syntheticFlag'],
    incompatibleFields: ['token.supply:number_to_string'],
    safeToUse: false,
    confidenceDirection: 'degrading',
    eventKind: 'inconsistent_provider',
    eventReasonCode: 'SCHEMA_DRIFT_CRITICAL',
    eventSafetyNotes: ['fail-closed-required', 'schema-regression-blocked'],
    certificationStatus: 'certification_failed',
    telemetryCompatible: false,
    driftCompatible: false,
    replayParityStatus: 'rejected',
  },
  'conformance-regression-blocked': {
    fixtureKind: 'conformance_regression_blocked',
    providerId: 'provider-conformance',
    providerName: 'Provider Conformance',
    sourcePhase: 67,
    sourcePhase65FixtureName: 'unsupported-write-capability-rejected',
    sourcePhase66FixtureName: 'capability-mismatch-rejected',
    sourcePhase67FixtureName: 'unsafe-provider-capability-rejected',
    sourcePhase68FixtureName: 'unsafe-provider-capability-blocked-scenario',
    sourcePhase69FixtureName: 'unsafe-capability-blocked',
    sampledAt: '2026-05-13T00:15:00.000Z',
    sampleKind: 'drift_observation',
    observedStatus: 'blocked',
    latencyBucket: '250ms_to_750ms',
    freshnessBucket: 'aging',
    stale: false,
    staleReasonCode: 'NOT_STALE_CONFORMANCE_BLOCK',
    observedSlotLagBucket: 'slot_lag_5_12',
    observedAgeBucket: 'age_3_7s',
    deterministicWindow: 'window_slot_12_or_age_8s',
    score: 24,
    scoreBand: 'low',
    confidenceLabel: 'low',
    reasonCodes: ['CONFORMANCE_REGRESSION_BLOCKED', 'FAIL_CLOSED_BLOCK'],
    driftKind: 'conformance_drift',
    driftSeverity: 'high',
    expectedShapeId: 'shape_read_only_contract_v1',
    observedShapeId: 'shape_unsafe_capability_v1',
    mismatchFields: ['capabilities.writeMethods'],
    conformanceStatus: 'regressed',
    failClosed: true,
    expectedSchemaVersion: '1.0.0',
    observedSchemaVersion: '1.0.0',
    missingFields: [],
    extraFields: ['capabilities.unsafeMode'],
    incompatibleFields: ['capabilities.writeMethods:false_to_true'],
    safeToUse: false,
    confidenceDirection: 'degrading',
    eventKind: 'conformance_regression',
    eventReasonCode: 'CONFORMANCE_REGRESSION_BLOCKED',
    eventSafetyNotes: ['capability-regression-detected', 'execution-not-permitted'],
    certificationStatus: 'certification_failed',
    telemetryCompatible: false,
    driftCompatible: false,
    replayParityStatus: 'rejected',
  },
  'intermittent-provider-instability': {
    fixtureKind: 'intermittent_provider_instability',
    providerId: 'provider-intermittent',
    providerName: 'Provider Intermittent',
    sourcePhase: 66,
    sourcePhase65FixtureName: 'provider-unavailable-error',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    sourcePhase67FixtureName: 'fallback-provider-reconciled',
    sourcePhase68FixtureName: 'fallback-reconciled-provider-scenario',
    sourcePhase69FixtureName: 'manual-smoke-disabled-by-default',
    sampledAt: '2026-05-13T00:20:00.000Z',
    sampleKind: 'health_observation',
    observedStatus: 'degraded',
    latencyBucket: 'gt_1500ms',
    freshnessBucket: 'aging',
    stale: false,
    staleReasonCode: 'INTERMITTENT_DELAY_OBSERVED',
    observedSlotLagBucket: 'slot_lag_13_24',
    observedAgeBucket: 'age_4_10s',
    deterministicWindow: 'window_slot_16_or_age_10s',
    score: 48,
    scoreBand: 'medium',
    confidenceLabel: 'medium',
    reasonCodes: ['INTERMITTENT_PROVIDER_INSTABILITY', 'FALLBACK_REQUIRED'],
    driftKind: 'cross_provider_drift',
    driftSeverity: 'moderate',
    expectedShapeId: 'shape_provider_read_model_v1',
    observedShapeId: 'shape_provider_read_model_v1',
    mismatchFields: ['latencyBucket'],
    conformanceStatus: 'warning',
    failClosed: false,
    expectedSchemaVersion: '1.0.0',
    observedSchemaVersion: '1.0.0',
    missingFields: [],
    extraFields: [],
    incompatibleFields: [],
    safeToUse: true,
    confidenceDirection: 'degrading',
    eventKind: 'degraded_provider',
    eventReasonCode: 'INTERMITTENT_PROVIDER_INSTABILITY',
    eventSafetyNotes: ['fallback-contract-only', 'no-runtime-switching'],
    certificationStatus: 'manual_review_required',
    telemetryCompatible: true,
    driftCompatible: true,
    replayParityStatus: 'passed',
  },
  'cross-provider-mismatch-telemetry': {
    fixtureKind: 'cross_provider_mismatch_telemetry',
    providerId: 'provider-cross',
    providerName: 'Provider Cross Mismatch',
    sourcePhase: 67,
    sourcePhase65FixtureName: 'offline-mint-authority-success',
    sourcePhase66FixtureName: 'multi-provider-healthy',
    sourcePhase67FixtureName: 'conflicting-provider-values',
    sourcePhase68FixtureName: 'conflicting-values-fail-closed-scenario',
    sourcePhase69FixtureName: 'cross-provider-quality-gate-blocked',
    sampledAt: '2026-05-13T00:25:00.000Z',
    sampleKind: 'drift_observation',
    observedStatus: 'drift_detected',
    latencyBucket: '750ms_to_1500ms',
    freshnessBucket: 'aging',
    stale: false,
    staleReasonCode: 'MISMATCH_NOT_STALENESS',
    observedSlotLagBucket: 'slot_lag_5_12',
    observedAgeBucket: 'age_3_7s',
    deterministicWindow: 'window_slot_12_or_age_8s',
    score: 31,
    scoreBand: 'low',
    confidenceLabel: 'low',
    reasonCodes: ['CROSS_PROVIDER_MISMATCH_DETECTED', 'FAIL_CLOSED_BLOCK'],
    driftKind: 'cross_provider_drift',
    driftSeverity: 'high',
    expectedShapeId: 'shape_cross_provider_aggregate_v1',
    observedShapeId: 'shape_cross_provider_conflict_v1',
    mismatchFields: ['liquidity.total', 'token.supply'],
    conformanceStatus: 'regressed',
    failClosed: true,
    expectedSchemaVersion: '1.0.0',
    observedSchemaVersion: '1.0.0',
    missingFields: [],
    extraFields: [],
    incompatibleFields: ['liquidity.total:number_to_string'],
    safeToUse: false,
    confidenceDirection: 'degrading',
    eventKind: 'inconsistent_provider',
    eventReasonCode: 'CROSS_PROVIDER_MISMATCH_DETECTED',
    eventSafetyNotes: ['cross-provider-block', 'telemetry-is-not-trading-guidance'],
    certificationStatus: 'certification_failed',
    telemetryCompatible: false,
    driftCompatible: false,
    replayParityStatus: 'failed',
  },
  'certification-drift-blocked': {
    fixtureKind: 'certification_drift_blocked',
    providerId: 'provider-cert-drift',
    providerName: 'Provider Certification Drift',
    sourcePhase: 69,
    sourcePhase65FixtureName: 'rate-limited-error',
    sourcePhase66FixtureName: 'all-providers-stale-fail-closed',
    sourcePhase67FixtureName: 'all-providers-conflict-fail-closed',
    sourcePhase68FixtureName: 'all-conflict-regeneration-blocked-scenario',
    sourcePhase69FixtureName: 'cross-provider-quality-gate-blocked',
    sampledAt: '2026-05-13T00:30:00.000Z',
    sampleKind: 'drift_observation',
    observedStatus: 'blocked',
    latencyBucket: 'gt_1500ms',
    freshnessBucket: 'critical_stale',
    stale: true,
    staleReasonCode: 'CERTIFICATION_DRIFT_AND_STALE',
    observedSlotLagBucket: 'slot_lag_gt_64',
    observedAgeBucket: 'age_gt_20s',
    deterministicWindow: 'window_slot_16_or_age_10s',
    score: 8,
    scoreBand: 'very_low',
    confidenceLabel: 'none',
    reasonCodes: ['CERTIFICATION_DRIFT_BLOCKED', 'FAIL_CLOSED_BLOCK'],
    driftKind: 'certification_drift',
    driftSeverity: 'critical',
    expectedShapeId: 'shape_certified_offline_v1',
    observedShapeId: 'shape_certification_failed_v1',
    mismatchFields: ['certificationStatus'],
    conformanceStatus: 'critical',
    failClosed: true,
    expectedSchemaVersion: '1.0.0',
    observedSchemaVersion: '1.0.0',
    missingFields: [],
    extraFields: [],
    incompatibleFields: ['certificationStatus:certified_to_failed'],
    safeToUse: false,
    confidenceDirection: 'degrading',
    eventKind: 'certification_mismatch',
    eventReasonCode: 'CERTIFICATION_DRIFT_BLOCKED',
    eventSafetyNotes: ['certification-drift-fail-closed', 'never-authorizes-execution'],
    certificationStatus: 'certification_failed',
    telemetryCompatible: false,
    driftCompatible: false,
    replayParityStatus: 'rejected',
  },
  'replay-scenario-drift-linked': {
    fixtureKind: 'replay_scenario_drift_linked',
    providerId: 'provider-replay-link',
    providerName: 'Provider Replay Link',
    sourcePhase: 68,
    sourcePhase65FixtureName: 'offline-account-info-success',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    sourcePhase67FixtureName: 'fallback-provider-reconciled',
    sourcePhase68FixtureName: 'fallback-reconciled-provider-scenario',
    sourcePhase69FixtureName: 'provider-aware-replay-certification-ready',
    sampledAt: '2026-05-13T00:35:00.000Z',
    sampleKind: 'drift_observation',
    observedStatus: 'degraded',
    latencyBucket: '250ms_to_750ms',
    freshnessBucket: 'fresh',
    stale: false,
    staleReasonCode: 'FRESH_REPLAY_DRIFT',
    observedSlotLagBucket: 'slot_lag_0_4',
    observedAgeBucket: 'age_0_2s',
    deterministicWindow: 'window_slot_8_or_age_4s',
    score: 67,
    scoreBand: 'high',
    confidenceLabel: 'high',
    reasonCodes: ['REPLAY_DRIFT_LINKED', 'CERTIFICATION_COMPATIBLE'],
    driftKind: 'replay_drift',
    driftSeverity: 'moderate',
    expectedShapeId: 'shape_replay_expectation_v1',
    observedShapeId: 'shape_replay_observation_v1',
    mismatchFields: ['expectedSnapshotIds[0]'],
    conformanceStatus: 'warning',
    failClosed: false,
    expectedSchemaVersion: '1.0.0',
    observedSchemaVersion: '1.0.0',
    missingFields: [],
    extraFields: [],
    incompatibleFields: [],
    safeToUse: true,
    confidenceDirection: 'stable',
    eventKind: 'degraded_provider',
    eventReasonCode: 'REPLAY_DRIFT_LINKED',
    eventSafetyNotes: ['replay-linkage-only', 'phase71-preview-not-implemented'],
    certificationStatus: 'certified_offline',
    telemetryCompatible: true,
    driftCompatible: true,
    replayParityStatus: 'failed',
  },
};

export function buildProviderReliabilityDriftAuditFixture(
  input: BuildProviderReliabilityDriftAuditFixtureInput,
): ProviderReliabilityDriftAuditFixture {
  const blueprint = BLUEPRINTS[input.fixtureName];
  const fixtureId = `phase70-fixture-${input.fixtureName}`;

  const source65 = FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase65FixtureName,
  );
  const source66 = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase66FixtureName,
  );
  const source67 = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase67FixtureName,
  );
  const source68 = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase68FixtureName,
  );
  const source69 = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase69FixtureName,
  );

  if (!source65 || !source66 || !source67 || !source68 || !source69) {
    throw new Error(`Phase 70 source linkage missing for ${input.fixtureName}`);
  }

  const sourceRefs = [source65.fixtureId, source66.fixtureId, source67.fixtureId, source68.fixtureId, source69.fixtureId] as const;

  const telemetrySample = buildProviderTelemetrySample({
    fixtureId,
    providerId: blueprint.providerId,
    providerName: blueprint.providerName,
    sourcePhase: blueprint.sourcePhase,
    sampledAt: blueprint.sampledAt,
    sampleKind: blueprint.sampleKind,
    observedStatus: blueprint.observedStatus,
    latencyBucket: blueprint.latencyBucket,
    freshnessBucket: blueprint.freshnessBucket,
    schemaVersion: PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION,
  });

  const freshnessModel = buildProviderFreshnessModel({
    fixtureId,
    providerId: blueprint.providerId,
    stale: blueprint.stale,
    staleReasonCode: blueprint.staleReasonCode,
    observedSlotLagBucket: blueprint.observedSlotLagBucket,
    observedAgeBucket: blueprint.observedAgeBucket,
    deterministicWindow: blueprint.deterministicWindow,
    sourceRefs,
  });

  const reliabilityScore = buildProviderReliabilityScore({
    fixtureId,
    providerId: blueprint.providerId,
    score: blueprint.score,
    scoreBand: blueprint.scoreBand,
    confidenceLabel: blueprint.confidenceLabel,
    reasonCodes: blueprint.reasonCodes,
    evidenceRefs: sourceRefs,
    failClosed: blueprint.failClosed,
  });

  const driftAudit = buildProviderDriftAudit({
    fixtureId,
    providerId: blueprint.providerId,
    driftKind: blueprint.driftKind,
    driftSeverity: blueprint.driftSeverity,
    expectedShapeId: blueprint.expectedShapeId,
    observedShapeId: blueprint.observedShapeId,
    mismatchFields: blueprint.mismatchFields,
    conformanceStatus: blueprint.conformanceStatus,
    failClosed: blueprint.failClosed,
  });

  const schemaDrift = buildProviderSchemaDrift({
    fixtureId,
    providerId: blueprint.providerId,
    expectedSchemaVersion: blueprint.expectedSchemaVersion,
    observedSchemaVersion: blueprint.observedSchemaVersion,
    missingFields: blueprint.missingFields,
    extraFields: blueprint.extraFields,
    incompatibleFields: blueprint.incompatibleFields,
    safeToUse: blueprint.safeToUse,
  });

  const confidenceTrend = buildProviderConfidenceTrend({
    fixtureId,
    providerId: blueprint.providerId,
    direction: blueprint.confidenceDirection,
    confidenceLabel: blueprint.confidenceLabel,
    sampledTelemetryIds: [telemetrySample.telemetryId],
    sourceRefs,
  });

  const instabilityEvents = [
    buildProviderInstabilityEvent({
      fixtureId,
      providerId: blueprint.providerId,
      eventKind: blueprint.eventKind,
      severity: blueprint.driftSeverity,
      observedAt: blueprint.sampledAt,
      sourceTelemetryIds: [telemetrySample.telemetryId],
      reasonCode: blueprint.eventReasonCode,
      safetyNotes: blueprint.eventSafetyNotes,
    }),
  ] as const;

  const staleDataAudit = buildProviderStaleDataAudit({
    fixtureId,
    providerId: blueprint.providerId,
    stale: blueprint.stale,
    staleReasonCode: blueprint.staleReasonCode,
    observedAgeBucket: blueprint.observedAgeBucket,
    sourceFreshnessId: freshnessModel.freshnessId,
    failClosed: blueprint.stale && blueprint.driftSeverity !== 'low',
  });

  const conformanceDrift = buildProviderConformanceDrift({
    fixtureId,
    providerId: blueprint.providerId,
    expectedContractId: `${fixtureId}-expected-contract`,
    observedContractId: `${fixtureId}-observed-contract`,
    driftSeverity: blueprint.driftSeverity,
    failClosed: blueprint.failClosed,
    reasonCodes: blueprint.reasonCodes,
  });

  const certificationLinkage = buildProviderCertificationTelemetryLinkage({
    fixtureId,
    providerId: blueprint.providerId,
    sourceCertificateId: source69.safetyCertificate.certificateId,
    certificationStatus: blueprint.certificationStatus,
    telemetryCompatible: blueprint.telemetryCompatible,
    driftCompatible: blueprint.driftCompatible,
    failClosed: blueprint.failClosed || blueprint.certificationStatus !== 'certified_offline',
  });

  const replayDriftLinkage = buildProviderReplayDriftLinkage({
    fixtureId,
    providerId: blueprint.providerId,
    replayScenarioName: blueprint.sourcePhase68FixtureName,
    parityStatus: blueprint.replayParityStatus,
    driftCompatible: blueprint.driftCompatible,
    sourceRefs: [source68.fixtureId, source67.fixtureId],
  });

  const reliabilityReport = buildProviderReliabilityReport({
    fixtureId,
    providerId: blueprint.providerId,
    telemetrySample,
    freshnessModel,
    reliabilityScore,
    driftAudit,
    certificationLinkage,
  });

  const viewModel = buildProviderReliabilityViewModel({
    fixtureId,
    fixtureName: input.fixtureName,
    providerId: blueprint.providerId,
    reliabilityScore,
    driftAudit,
    staleDataAudit,
  });

  return {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE,
    schemaVersion: PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION,
    telemetrySample,
    freshnessModel,
    reliabilityScore,
    driftAudit,
    schemaDrift,
    confidenceTrend,
    instabilityEvents,
    staleDataAudit,
    conformanceDrift,
    certificationLinkage,
    replayDriftLinkage,
    reliabilityReport,
    viewModel,
    apiContract: buildProviderReliabilityApiContract({ fixtureId, providerId: blueprint.providerId, viewModel, fixtureIds: [fixtureId] }),
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: blueprint.fixtureKind,
        matched: true,
        source: 'synthetic_fixture_only',
      },
    ],
    capabilityFlags: getProviderReliabilityDriftAuditCapabilities(),
    sourcePhase65FixtureSnapshot: FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
    sourcePhase66FixtureSnapshot: MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
    sourcePhase67FixtureSnapshot: CROSS_PROVIDER_DATA_QUALITY_NAMES,
    sourcePhase68FixtureSnapshot: PROVIDER_AWARE_REPLAY_SCENARIO_NAMES,
    sourcePhase69FixtureSnapshot: LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES,
    sourceRefs: {
      phase65FixtureId: source65.fixtureId,
      phase66FixtureId: source66.fixtureId,
      phase67FixtureId: source67.fixtureId,
      phase68FixtureId: source68.fixtureId,
      phase69FixtureId: source69.fixtureId,
    },
    meta: {
      generatedAt: PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT,
      source: PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SOURCE,
      version: PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_VERSION,
      phase: PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE,
      deterministicSeed: `phase70-seed-${input.fixtureName}`,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveData: true,
      noNetworkAccessByDefault: true,
      nonAdvisory: true,
      notExecutable: true,
    },
  };
}
