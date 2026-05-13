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
import {
  PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES,
} from '../provider-reliability-drift-audit/index.js';
import { getHistoricalSnapshotIngestionContractCapabilities } from './capabilities.js';
import { buildHistoricalSnapshotApiContract } from './contracts.js';
import { buildSnapshotFreshnessContract } from './freshness-contracts.js';
import { buildSnapshotImportPlan } from './import-plans.js';
import { buildSnapshotIntegrityContract } from './integrity-contracts.js';
import { stableDeterministicHistoricalSnapshotIngestionContractChecksum } from './normalization.js';
import { buildSnapshotNormalizationContract } from './normalization-contracts.js';
import { buildSnapshotProvenanceContract } from './provenance-contracts.js';
import { buildSnapshotRejectionContract } from './rejection-contracts.js';
import { buildSnapshotReliabilityLinkage } from './reliability-linkage.js';
import { buildHistoricalSnapshotAuditReport } from './reports.js';
import { buildSnapshotReplayLinkage } from './replay-linkage.js';
import { buildSnapshotSchemaContract } from './schema-contracts.js';
import { buildSnapshotManifest } from './snapshot-manifests.js';
import { buildSnapshotSourceMetadata } from './source-metadata.js';
import { buildSnapshotValidationContract } from './validation-contracts.js';
import type {
  BuildHistoricalSnapshotIngestionContractFixtureInput,
  HistoricalSnapshotIngestionContractFixture,
  HistoricalSnapshotIngestionContractKind,
  HistoricalSnapshotIngestionContractName,
} from './types.js';
import {
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE,
  PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT,
  PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION,
  PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SOURCE,
  PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_VERSION,
} from './types.js';
import { buildHistoricalSnapshotViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: HistoricalSnapshotIngestionContractKind;
  readonly snapshotKind: 'full_snapshot' | 'incremental_snapshot' | 'partial_snapshot' | 'conflict_snapshot';
  readonly sourceKind: 'provider_fixture' | 'replay_fixture' | 'reliability_fixture' | 'cross_provider_fixture';
  readonly providerId: string;
  readonly providerName: string;
  readonly reliabilityBand: string;
  readonly freshnessBand: 'fresh' | 'aging' | 'stale' | 'critical_stale';
  readonly observationWindow: string;
  readonly capturedAt: string;
  readonly sourcePhase65FixtureName: (typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES)[number];
  readonly sourcePhase66FixtureName: (typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)[number];
  readonly sourcePhase67FixtureName: (typeof CROSS_PROVIDER_DATA_QUALITY_NAMES)[number];
  readonly sourcePhase68FixtureName: (typeof PROVIDER_AWARE_REPLAY_SCENARIO_NAMES)[number];
  readonly sourcePhase69FixtureName: (typeof LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES)[number];
  readonly sourcePhase70FixtureName: (typeof PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES)[number];
  readonly compatibilityLevel: 'strict' | 'backward_compatible' | 'forward_compatible';
  readonly criticalFields: readonly string[];
  readonly failClosedOnCriticalDrift: boolean;
  readonly normalizationMode: 'canonical_json' | 'field_sorted' | 'schema_locked';
  readonly stale: boolean;
  readonly staleReasonCode: string;
  readonly rejectionKind: 'schema_drift' | 'missing_critical_field' | 'partial_snapshot' | 'integrity_failure' | 'unsafe_state';
  readonly rejectionSeverity: 'warning' | 'error' | 'critical';
  readonly rejectionFailClosed: boolean;
  readonly replayParityStatus: 'passed' | 'failed' | 'rejected';
  readonly reliabilityDriftSeverity: 'low' | 'moderate' | 'high' | 'critical';
  readonly driftCompatible: boolean;
}

const BLUEPRINTS: Readonly<Record<HistoricalSnapshotIngestionContractName, Blueprint>> = {
  'healthy-provider-snapshot-contract': {
    fixtureKind: 'healthy_provider_snapshot_contract',
    snapshotKind: 'full_snapshot',
    sourceKind: 'provider_fixture',
    providerId: 'provider-a',
    providerName: 'Provider A',
    reliabilityBand: 'high',
    freshnessBand: 'fresh',
    observationWindow: 'window_slot_8_or_age_4s',
    capturedAt: '2026-05-13T00:00:00.000Z',
    sourcePhase65FixtureName: 'offline-account-info-success',
    sourcePhase66FixtureName: 'single-provider-healthy',
    sourcePhase67FixtureName: 'all-providers-agree-high-confidence',
    sourcePhase68FixtureName: 'high-confidence-provider-agreement-scenario',
    sourcePhase69FixtureName: 'read-only-provider-certified-offline',
    sourcePhase70FixtureName: 'healthy-provider-stable-telemetry',
    compatibilityLevel: 'strict',
    criticalFields: ['snapshotId', 'capturedAt', 'providerId'],
    failClosedOnCriticalDrift: true,
    normalizationMode: 'canonical_json',
    stale: false,
    staleReasonCode: 'FRESHNESS_IN_WINDOW',
    rejectionKind: 'unsafe_state',
    rejectionSeverity: 'warning',
    rejectionFailClosed: false,
    replayParityStatus: 'passed',
    reliabilityDriftSeverity: 'low',
    driftCompatible: true,
  },
  'stale-provider-snapshot-warning': {
    fixtureKind: 'stale_provider_snapshot_warning',
    snapshotKind: 'incremental_snapshot',
    sourceKind: 'provider_fixture',
    providerId: 'provider-stale',
    providerName: 'Provider Stale',
    reliabilityBand: 'medium',
    freshnessBand: 'stale',
    observationWindow: 'window_slot_16_or_age_10s',
    capturedAt: '2026-05-13T00:05:00.000Z',
    sourcePhase65FixtureName: 'offline-token-metadata-success',
    sourcePhase66FixtureName: 'stale-primary-provider',
    sourcePhase67FixtureName: 'stale-provider-mismatch',
    sourcePhase68FixtureName: 'stale-provider-replay-scenario',
    sourcePhase69FixtureName: 'stale-provider-certification-warning',
    sourcePhase70FixtureName: 'stale-provider-drift-warning',
    compatibilityLevel: 'backward_compatible',
    criticalFields: ['snapshotId', 'capturedAt'],
    failClosedOnCriticalDrift: true,
    normalizationMode: 'field_sorted',
    stale: true,
    staleReasonCode: 'STALE_SLOT_LAG_WARNING',
    rejectionKind: 'unsafe_state',
    rejectionSeverity: 'warning',
    rejectionFailClosed: false,
    replayParityStatus: 'failed',
    reliabilityDriftSeverity: 'moderate',
    driftCompatible: false,
  },
  'schema-drift-snapshot-rejected': {
    fixtureKind: 'schema_drift_snapshot_rejected',
    snapshotKind: 'full_snapshot',
    sourceKind: 'reliability_fixture',
    providerId: 'provider-schema',
    providerName: 'Provider Schema Drift',
    reliabilityBand: 'low',
    freshnessBand: 'aging',
    observationWindow: 'window_slot_12_or_age_8s',
    capturedAt: '2026-05-13T00:10:00.000Z',
    sourcePhase65FixtureName: 'malformed-response-error',
    sourcePhase66FixtureName: 'capability-mismatch-rejected',
    sourcePhase67FixtureName: 'missing-field-partial-confidence',
    sourcePhase68FixtureName: 'missing-field-partial-scenario',
    sourcePhase69FixtureName: 'missing-provider-config-blocked',
    sourcePhase70FixtureName: 'schema-drift-fail-closed',
    compatibilityLevel: 'strict',
    criticalFields: ['schemaVersion', 'token.decimals'],
    failClosedOnCriticalDrift: true,
    normalizationMode: 'schema_locked',
    stale: false,
    staleReasonCode: 'SCHEMA_DRIFT_CRITICAL',
    rejectionKind: 'schema_drift',
    rejectionSeverity: 'critical',
    rejectionFailClosed: true,
    replayParityStatus: 'rejected',
    reliabilityDriftSeverity: 'critical',
    driftCompatible: false,
  },
  'missing-critical-field-snapshot-blocked': {
    fixtureKind: 'missing_critical_field_snapshot_blocked',
    snapshotKind: 'partial_snapshot',
    sourceKind: 'provider_fixture',
    providerId: 'provider-critical',
    providerName: 'Provider Critical Field Missing',
    reliabilityBand: 'low',
    freshnessBand: 'aging',
    observationWindow: 'window_slot_12_or_age_8s',
    capturedAt: '2026-05-13T00:15:00.000Z',
    sourcePhase65FixtureName: 'malformed-response-error',
    sourcePhase66FixtureName: 'capability-mismatch-rejected',
    sourcePhase67FixtureName: 'missing-field-partial-confidence',
    sourcePhase68FixtureName: 'missing-field-partial-scenario',
    sourcePhase69FixtureName: 'missing-provider-config-blocked',
    sourcePhase70FixtureName: 'conformance-regression-blocked',
    compatibilityLevel: 'strict',
    criticalFields: ['snapshotId', 'providerId', 'token.decimals'],
    failClosedOnCriticalDrift: true,
    normalizationMode: 'schema_locked',
    stale: false,
    staleReasonCode: 'MISSING_CRITICAL_FIELD',
    rejectionKind: 'missing_critical_field',
    rejectionSeverity: 'critical',
    rejectionFailClosed: true,
    replayParityStatus: 'rejected',
    reliabilityDriftSeverity: 'high',
    driftCompatible: false,
  },
  'partial-provider-snapshot-quarantined': {
    fixtureKind: 'partial_provider_snapshot_quarantined',
    snapshotKind: 'partial_snapshot',
    sourceKind: 'cross_provider_fixture',
    providerId: 'provider-partial',
    providerName: 'Provider Partial',
    reliabilityBand: 'medium',
    freshnessBand: 'stale',
    observationWindow: 'window_slot_16_or_age_10s',
    capturedAt: '2026-05-13T00:20:00.000Z',
    sourcePhase65FixtureName: 'provider-unavailable-error',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    sourcePhase67FixtureName: 'missing-field-partial-confidence',
    sourcePhase68FixtureName: 'missing-field-partial-scenario',
    sourcePhase69FixtureName: 'cross-provider-quality-gate-blocked',
    sourcePhase70FixtureName: 'intermittent-provider-instability',
    compatibilityLevel: 'forward_compatible',
    criticalFields: ['snapshotId', 'capturedAt'],
    failClosedOnCriticalDrift: true,
    normalizationMode: 'field_sorted',
    stale: true,
    staleReasonCode: 'PARTIAL_SNAPSHOT_QUARANTINED',
    rejectionKind: 'partial_snapshot',
    rejectionSeverity: 'error',
    rejectionFailClosed: true,
    replayParityStatus: 'failed',
    reliabilityDriftSeverity: 'moderate',
    driftCompatible: false,
  },
  'replay-linked-historical-snapshot': {
    fixtureKind: 'replay_linked_historical_snapshot',
    snapshotKind: 'incremental_snapshot',
    sourceKind: 'replay_fixture',
    providerId: 'provider-replay-link',
    providerName: 'Provider Replay Link',
    reliabilityBand: 'high',
    freshnessBand: 'fresh',
    observationWindow: 'window_slot_8_or_age_4s',
    capturedAt: '2026-05-13T00:25:00.000Z',
    sourcePhase65FixtureName: 'offline-account-info-success',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    sourcePhase67FixtureName: 'fallback-provider-reconciled',
    sourcePhase68FixtureName: 'fallback-reconciled-provider-scenario',
    sourcePhase69FixtureName: 'provider-aware-replay-certification-ready',
    sourcePhase70FixtureName: 'replay-scenario-drift-linked',
    compatibilityLevel: 'backward_compatible',
    criticalFields: ['snapshotId', 'capturedAt'],
    failClosedOnCriticalDrift: true,
    normalizationMode: 'canonical_json',
    stale: false,
    staleReasonCode: 'REPLAY_LINK_HEALTHY',
    rejectionKind: 'unsafe_state',
    rejectionSeverity: 'warning',
    rejectionFailClosed: false,
    replayParityStatus: 'passed',
    reliabilityDriftSeverity: 'moderate',
    driftCompatible: true,
  },
  'reliability-linked-drift-snapshot': {
    fixtureKind: 'reliability_linked_drift_snapshot',
    snapshotKind: 'incremental_snapshot',
    sourceKind: 'reliability_fixture',
    providerId: 'provider-cert-drift',
    providerName: 'Provider Certification Drift',
    reliabilityBand: 'very_low',
    freshnessBand: 'critical_stale',
    observationWindow: 'window_slot_16_or_age_10s',
    capturedAt: '2026-05-13T00:30:00.000Z',
    sourcePhase65FixtureName: 'rate-limited-error',
    sourcePhase66FixtureName: 'all-providers-stale-fail-closed',
    sourcePhase67FixtureName: 'all-providers-conflict-fail-closed',
    sourcePhase68FixtureName: 'all-conflict-regeneration-blocked-scenario',
    sourcePhase69FixtureName: 'cross-provider-quality-gate-blocked',
    sourcePhase70FixtureName: 'certification-drift-blocked',
    compatibilityLevel: 'strict',
    criticalFields: ['snapshotId', 'capturedAt', 'certificationStatus'],
    failClosedOnCriticalDrift: true,
    normalizationMode: 'schema_locked',
    stale: true,
    staleReasonCode: 'CERTIFICATION_DRIFT_AND_STALE',
    rejectionKind: 'integrity_failure',
    rejectionSeverity: 'critical',
    rejectionFailClosed: true,
    replayParityStatus: 'rejected',
    reliabilityDriftSeverity: 'critical',
    driftCompatible: false,
  },
  'cross-provider-quality-snapshot-conflict': {
    fixtureKind: 'cross_provider_quality_snapshot_conflict',
    snapshotKind: 'conflict_snapshot',
    sourceKind: 'cross_provider_fixture',
    providerId: 'provider-cross',
    providerName: 'Provider Cross Conflict',
    reliabilityBand: 'low',
    freshnessBand: 'aging',
    observationWindow: 'window_slot_12_or_age_8s',
    capturedAt: '2026-05-13T00:35:00.000Z',
    sourcePhase65FixtureName: 'offline-mint-authority-success',
    sourcePhase66FixtureName: 'multi-provider-healthy',
    sourcePhase67FixtureName: 'conflicting-provider-values',
    sourcePhase68FixtureName: 'conflicting-values-fail-closed-scenario',
    sourcePhase69FixtureName: 'cross-provider-quality-gate-blocked',
    sourcePhase70FixtureName: 'cross-provider-mismatch-telemetry',
    compatibilityLevel: 'strict',
    criticalFields: ['snapshotId', 'providerId', 'liquidity.total'],
    failClosedOnCriticalDrift: true,
    normalizationMode: 'schema_locked',
    stale: false,
    staleReasonCode: 'CROSS_PROVIDER_CONFLICT',
    rejectionKind: 'schema_drift',
    rejectionSeverity: 'critical',
    rejectionFailClosed: true,
    replayParityStatus: 'failed',
    reliabilityDriftSeverity: 'high',
    driftCompatible: false,
  },
};

export function buildHistoricalSnapshotIngestionContractFixture(
  input: BuildHistoricalSnapshotIngestionContractFixtureInput,
): HistoricalSnapshotIngestionContractFixture {
  const blueprint = BLUEPRINTS[input.fixtureName];
  const fixtureId = `phase71-fixture-${input.fixtureName}`;

  const source65 = FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase65FixtureName);
  const source66 = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase66FixtureName);
  const source67 = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase67FixtureName);
  const source68 = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase68FixtureName);
  const source69 = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase69FixtureName,
  );
  const source70 = PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase70FixtureName,
  );

  if (!source65 || !source66 || !source67 || !source68 || !source69 || !source70) {
    throw new Error(`Phase 71 source linkage missing for ${input.fixtureName}`);
  }

  const sourceRefs = [source65.fixtureId, source66.fixtureId, source67.fixtureId, source68.fixtureId, source69.fixtureId, source70.fixtureId] as const;

  const manifest = buildSnapshotManifest({
    fixtureId,
    snapshotName: input.fixtureName,
    snapshotKind: blueprint.snapshotKind,
    capturedAt: blueprint.capturedAt,
    sourceProviderId: blueprint.providerId,
    sourceReliabilityFixtureName: blueprint.sourcePhase70FixtureName,
    schemaVersion: PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION,
    phase: HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE,
  });

  const sourceMetadata = buildSnapshotSourceMetadata({
    fixtureId,
    sourceKind: blueprint.sourceKind,
    providerId: blueprint.providerId,
    providerName: blueprint.providerName,
    reliabilityBand: blueprint.reliabilityBand,
    freshnessBand: blueprint.freshnessBand,
    observationWindow: blueprint.observationWindow,
    sourceRefs,
  });

  const schemaContract = buildSnapshotSchemaContract({
    fixtureId,
    expectedSchemaVersion: PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION,
    compatibilityLevel: blueprint.compatibilityLevel,
    requiredFields: ['snapshotId', 'snapshotKind', 'capturedAt', 'sourceProviderId'],
    optionalFields: ['lineageSummary', 'notes'],
    criticalFields: blueprint.criticalFields,
    failClosedOnCriticalDrift: blueprint.failClosedOnCriticalDrift,
  });

  const provenanceContract = buildSnapshotProvenanceContract({
    fixtureId,
    sourcePhaseRefs: [65, 66, 67, 68, 69, 70],
    sourceFixtureRefs: sourceRefs,
    providerReliabilityRefs: [source70.fixtureId],
    replayScenarioRefs: [source68.fixtureId],
    dataQualityRefs: [source67.fixtureId],
    lineageSummary: `Derived from immutable fixture lineage for ${input.fixtureName}`,
  });

  const normalizationContract = buildSnapshotNormalizationContract({
    fixtureId,
    normalizationMode: blueprint.normalizationMode,
    stableOrdering: true,
    deterministicChecksum: true,
    localeIndependent: true,
    mutationFree: true,
  });

  const validationContract = buildSnapshotValidationContract({
    fixtureId,
    rules: ['required-fields', 'critical-fields-fail-closed', 'staleness-policy', 'integrity-checksum', 'unsafe-capability-block'],
    rejectionReasons: ['schema_drift', 'missing_critical_field', 'partial_snapshot', 'integrity_failure', 'unsafe_state'],
    criticalFailureReasons: ['critical_schema_drift', 'missing_critical_field', 'integrity_mismatch'],
    warningReasons: ['stale_snapshot_warning', 'parity_warning'],
    failClosed: true,
  });

  const freshnessContract = buildSnapshotFreshnessContract({
    fixtureId,
    snapshotAgeBucket: blueprint.freshnessBand,
    stale: blueprint.stale,
    staleReasonCode: blueprint.staleReasonCode,
    freshnessWindow: blueprint.observationWindow,
    sourceTelemetryRefs: [source70.telemetrySample.telemetryId],
  });

  const manifestHash = stableDeterministicHistoricalSnapshotIngestionContractChecksum(JSON.stringify(manifest));
  const sourceHash = stableDeterministicHistoricalSnapshotIngestionContractChecksum(sourceRefs.join('|'));
  const integrityContract = buildSnapshotIntegrityContract({
    fixtureId,
    checksum: stableDeterministicHistoricalSnapshotIngestionContractChecksum(`${manifestHash}|${sourceHash}`),
    manifestHash,
    sourceHash,
  });

  const importPlan = buildSnapshotImportPlan({
    fixtureId,
    plannedSteps: ['validate-manifest', 'validate-schema', 'validate-provenance', 'validate-integrity', 'link-replay-and-reliability'],
    expectedOutcome: blueprint.rejectionFailClosed ? 'rejected_or_quarantined' : 'accepted_for_read_only_contract_surface',
  });

  const rejectionContract = buildSnapshotRejectionContract({
    fixtureId,
    rejectionKind: blueprint.rejectionKind,
    severity: blueprint.rejectionSeverity,
    reasonCode: blueprint.staleReasonCode,
    failClosed: blueprint.rejectionFailClosed,
    safetyNotes: ['fixture-only', 'non-executable', 'non-advisory'],
  });

  const replayLinkage = buildSnapshotReplayLinkage({
    fixtureId,
    replayScenarioRef: blueprint.sourcePhase68FixtureName,
    parityStatus: blueprint.replayParityStatus,
    failClosed: blueprint.replayParityStatus === 'rejected',
    sourceRefs: [source68.fixtureId, source67.fixtureId],
  });

  const reliabilityLinkage = buildSnapshotReliabilityLinkage({
    fixtureId,
    providerReliabilityRef: blueprint.sourcePhase70FixtureName,
    driftSeverity: blueprint.reliabilityDriftSeverity,
    driftCompatible: blueprint.driftCompatible,
    failClosed: !blueprint.driftCompatible,
    sourceRefs: [source70.fixtureId, source69.fixtureId],
  });

  const auditReport = buildHistoricalSnapshotAuditReport({
    fixtureId,
    manifest,
    schemaContract,
    provenanceContract,
    freshnessContract,
    integrityContract,
    validationContract,
    replayLinkage,
    reliabilityLinkage,
  });

  const viewModel = buildHistoricalSnapshotViewModel({
    fixtureId,
    fixtureName: input.fixtureName,
    manifest,
    freshnessContract,
    rejectionContract,
  });

  return {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE,
    schemaVersion: PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION,
    manifest,
    sourceMetadata,
    schemaContract,
    provenanceContract,
    normalizationContract,
    validationContract,
    freshnessContract,
    integrityContract,
    importPlan,
    rejectionContract,
    replayLinkage,
    reliabilityLinkage,
    auditReport,
    viewModel,
    apiContract: buildHistoricalSnapshotApiContract({ fixtureId, viewModel, fixtureIds: [fixtureId] }),
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: blueprint.fixtureKind,
        matched: true,
        source: 'synthetic_fixture_only',
      },
    ],
    capabilityFlags: getHistoricalSnapshotIngestionContractCapabilities(),
    sourcePhase65FixtureSnapshot: FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
    sourcePhase66FixtureSnapshot: MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
    sourcePhase67FixtureSnapshot: CROSS_PROVIDER_DATA_QUALITY_NAMES,
    sourcePhase68FixtureSnapshot: PROVIDER_AWARE_REPLAY_SCENARIO_NAMES,
    sourcePhase69FixtureSnapshot: LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES,
    sourcePhase70FixtureSnapshot: PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES,
    sourceRefs: {
      phase65FixtureId: source65.fixtureId,
      phase66FixtureId: source66.fixtureId,
      phase67FixtureId: source67.fixtureId,
      phase68FixtureId: source68.fixtureId,
      phase69FixtureId: source69.fixtureId,
      phase70FixtureId: source70.fixtureId,
    },
    meta: {
      generatedAt: PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT,
      source: PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SOURCE,
      version: PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_VERSION,
      phase: HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE,
      deterministicSeed: `phase71-seed-${input.fixtureName}`,
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
