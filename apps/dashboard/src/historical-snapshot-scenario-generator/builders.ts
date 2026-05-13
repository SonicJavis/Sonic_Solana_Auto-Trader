import {
  CROSS_PROVIDER_DATA_QUALITY_FIXTURES,
  CROSS_PROVIDER_DATA_QUALITY_NAMES,
} from '../cross-provider-data-quality/index.js';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
} from '../first-read-only-provider-adapter/index.js';
import {
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES,
} from '../historical-snapshot-ingestion-contracts/index.js';
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
import { getHistoricalSnapshotScenarioGeneratorCapabilities } from './capabilities.js';
import { buildSnapshotScenarioApiContract } from './contracts.js';
import { buildHistoricalSnapshotGenerationPlan } from './generation-plans.js';
import { buildSnapshotScenarioGenerationRules } from './generation-rules.js';
import { buildSnapshotScenarioIntegrityContract } from './integrity-contracts.js';
import { buildSnapshotScenarioLineage } from './lineage-models.js';
import { stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum } from './normalization.js';
import { buildSnapshotScenarioQualityLinkage } from './quality-linkage.js';
import { buildSnapshotScenarioRejectionContract } from './rejection-contracts.js';
import { buildSnapshotReplayDescriptor } from './replay-descriptors.js';
import { buildSnapshotScenarioReliabilityLinkage } from './reliability-linkage.js';
import { buildSnapshotScenarioAuditReport } from './reports.js';
import { buildSnapshotScenarioRiskLinkage } from './risk-linkage.js';
import { buildGeneratedScenarioDescriptor } from './scenario-descriptors.js';
import { buildSnapshotSourceSelection } from './source-selection.js';
import {
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE,
  PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT,
  PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SCHEMA_VERSION,
  PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SOURCE,
  PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_VERSION,
  type BuildHistoricalSnapshotScenarioGeneratorFixtureInput,
  type HistoricalSnapshotScenarioGeneratorFixture,
  type HistoricalSnapshotScenarioGeneratorKind,
  type HistoricalSnapshotScenarioGeneratorName,
} from './types.js';
import { buildSnapshotScenarioValidationContract } from './validation-contracts.js';
import { buildSnapshotScenarioViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: HistoricalSnapshotScenarioGeneratorKind;
  readonly sourcePhase71FixtureName: (typeof HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES)[number];
  readonly sourcePhase70FixtureName: (typeof PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES)[number];
  readonly sourcePhase68FixtureName: (typeof PROVIDER_AWARE_REPLAY_SCENARIO_NAMES)[number];
  readonly sourcePhase67FixtureName: (typeof CROSS_PROVIDER_DATA_QUALITY_NAMES)[number];
  readonly sourcePhase66FixtureName: (typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)[number];
  readonly sourcePhase65FixtureName: (typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES)[number];
  readonly generationPlanKind:
    | 'clean_generation_plan'
    | 'warning_generation_plan'
    | 'blocked_generation_plan'
    | 'quarantine_generation_plan'
    | 'replay_generation_plan'
    | 'drift_generation_plan'
    | 'conflict_generation_plan';
  readonly scenarioKind:
    | 'clean_scenario'
    | 'warning_scenario'
    | 'blocked_scenario'
    | 'quarantined_scenario'
    | 'replay_scenario'
    | 'drift_scenario'
    | 'conflict_scenario';
  readonly replayKind: 'baseline_replay' | 'warning_replay' | 'blocked_replay' | 'drift_replay';
  readonly replayReady: boolean;
  readonly expectedStepCount: number;
  readonly expectedSnapshotCount: number;
  readonly expectedFinalStateKind: string;
  readonly selectionReasonCode: string;
  readonly selectionWarnings: readonly string[];
  readonly qualityStatus: 'clean' | 'warning' | 'blocked';
  readonly reliabilityStatus: 'stable' | 'degraded' | 'drifted';
  readonly driftSeverity: 'low' | 'moderate' | 'high' | 'critical';
  readonly riskStatus: 'low' | 'moderate' | 'high' | 'critical';
  readonly riskReasonCodes: readonly string[];
  readonly rejectionKind: 'schema_drift' | 'missing_critical_field' | 'partial_snapshot' | 'cross_provider_conflict' | 'unsafe_state';
  readonly rejectionSeverity: 'warning' | 'error' | 'critical';
  readonly rejectionReasonCode: string;
  readonly failClosed: boolean;
}

const BLUEPRINTS: Readonly<Record<HistoricalSnapshotScenarioGeneratorName, Blueprint>> = {
  'healthy-snapshot-generates-clean-scenario': {
    fixtureKind: 'healthy_snapshot_generates_clean_scenario',
    sourcePhase71FixtureName: 'healthy-provider-snapshot-contract',
    sourcePhase70FixtureName: 'healthy-provider-stable-telemetry',
    sourcePhase68FixtureName: 'high-confidence-provider-agreement-scenario',
    sourcePhase67FixtureName: 'all-providers-agree-high-confidence',
    sourcePhase66FixtureName: 'single-provider-healthy',
    sourcePhase65FixtureName: 'offline-account-info-success',
    generationPlanKind: 'clean_generation_plan',
    scenarioKind: 'clean_scenario',
    replayKind: 'baseline_replay',
    replayReady: true,
    expectedStepCount: 4,
    expectedSnapshotCount: 2,
    expectedFinalStateKind: 'scenario_clean_completed',
    selectionReasonCode: 'HEALTHY_SOURCE_SELECTED',
    selectionWarnings: [],
    qualityStatus: 'clean',
    reliabilityStatus: 'stable',
    driftSeverity: 'low',
    riskStatus: 'low',
    riskReasonCodes: ['RISK_LOW_CLEAN_SOURCE'],
    rejectionKind: 'unsafe_state',
    rejectionSeverity: 'warning',
    rejectionReasonCode: 'NONE',
    failClosed: false,
  },
  'stale-snapshot-generates-warning-scenario': {
    fixtureKind: 'stale_snapshot_generates_warning_scenario',
    sourcePhase71FixtureName: 'stale-provider-snapshot-warning',
    sourcePhase70FixtureName: 'stale-provider-drift-warning',
    sourcePhase68FixtureName: 'stale-provider-replay-scenario',
    sourcePhase67FixtureName: 'stale-provider-mismatch',
    sourcePhase66FixtureName: 'stale-primary-provider',
    sourcePhase65FixtureName: 'offline-token-metadata-success',
    generationPlanKind: 'warning_generation_plan',
    scenarioKind: 'warning_scenario',
    replayKind: 'warning_replay',
    replayReady: true,
    expectedStepCount: 5,
    expectedSnapshotCount: 2,
    expectedFinalStateKind: 'scenario_warning_completed',
    selectionReasonCode: 'STALE_SOURCE_WITH_WARNING',
    selectionWarnings: ['stale_snapshot_warning'],
    qualityStatus: 'warning',
    reliabilityStatus: 'degraded',
    driftSeverity: 'moderate',
    riskStatus: 'moderate',
    riskReasonCodes: ['RISK_STALE_SOURCE'],
    rejectionKind: 'unsafe_state',
    rejectionSeverity: 'warning',
    rejectionReasonCode: 'STALE_WARNING',
    failClosed: false,
  },
  'schema-drift-snapshot-generation-blocked': {
    fixtureKind: 'schema_drift_snapshot_generation_blocked',
    sourcePhase71FixtureName: 'schema-drift-snapshot-rejected',
    sourcePhase70FixtureName: 'schema-drift-fail-closed',
    sourcePhase68FixtureName: 'all-conflict-regeneration-blocked-scenario',
    sourcePhase67FixtureName: 'all-providers-conflict-fail-closed',
    sourcePhase66FixtureName: 'capability-mismatch-rejected',
    sourcePhase65FixtureName: 'malformed-response-error',
    generationPlanKind: 'blocked_generation_plan',
    scenarioKind: 'blocked_scenario',
    replayKind: 'blocked_replay',
    replayReady: false,
    expectedStepCount: 0,
    expectedSnapshotCount: 1,
    expectedFinalStateKind: 'scenario_generation_blocked',
    selectionReasonCode: 'SCHEMA_DRIFT_BLOCKED',
    selectionWarnings: ['schema_drift_detected'],
    qualityStatus: 'blocked',
    reliabilityStatus: 'drifted',
    driftSeverity: 'critical',
    riskStatus: 'critical',
    riskReasonCodes: ['RISK_SCHEMA_DRIFT_BLOCK'],
    rejectionKind: 'schema_drift',
    rejectionSeverity: 'critical',
    rejectionReasonCode: 'SCHEMA_DRIFT_CRITICAL',
    failClosed: true,
  },
  'missing-critical-field-generation-rejected': {
    fixtureKind: 'missing_critical_field_generation_rejected',
    sourcePhase71FixtureName: 'missing-critical-field-snapshot-blocked',
    sourcePhase70FixtureName: 'conformance-regression-blocked',
    sourcePhase68FixtureName: 'missing-field-partial-scenario',
    sourcePhase67FixtureName: 'missing-field-partial-confidence',
    sourcePhase66FixtureName: 'capability-mismatch-rejected',
    sourcePhase65FixtureName: 'malformed-response-error',
    generationPlanKind: 'blocked_generation_plan',
    scenarioKind: 'blocked_scenario',
    replayKind: 'blocked_replay',
    replayReady: false,
    expectedStepCount: 0,
    expectedSnapshotCount: 1,
    expectedFinalStateKind: 'scenario_generation_rejected',
    selectionReasonCode: 'MISSING_CRITICAL_FIELD_REJECTED',
    selectionWarnings: ['missing_critical_field'],
    qualityStatus: 'blocked',
    reliabilityStatus: 'drifted',
    driftSeverity: 'high',
    riskStatus: 'critical',
    riskReasonCodes: ['RISK_CRITICAL_FIELD_MISSING'],
    rejectionKind: 'missing_critical_field',
    rejectionSeverity: 'critical',
    rejectionReasonCode: 'MISSING_CRITICAL_FIELD',
    failClosed: true,
  },
  'partial-snapshot-generates-quarantined-scenario': {
    fixtureKind: 'partial_snapshot_generates_quarantined_scenario',
    sourcePhase71FixtureName: 'partial-provider-snapshot-quarantined',
    sourcePhase70FixtureName: 'intermittent-provider-instability',
    sourcePhase68FixtureName: 'missing-field-partial-scenario',
    sourcePhase67FixtureName: 'missing-field-partial-confidence',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    sourcePhase65FixtureName: 'provider-unavailable-error',
    generationPlanKind: 'quarantine_generation_plan',
    scenarioKind: 'quarantined_scenario',
    replayKind: 'warning_replay',
    replayReady: true,
    expectedStepCount: 3,
    expectedSnapshotCount: 2,
    expectedFinalStateKind: 'scenario_quarantined',
    selectionReasonCode: 'PARTIAL_SOURCE_QUARANTINED',
    selectionWarnings: ['partial_snapshot_detected', 'quarantine_required'],
    qualityStatus: 'warning',
    reliabilityStatus: 'degraded',
    driftSeverity: 'moderate',
    riskStatus: 'high',
    riskReasonCodes: ['RISK_PARTIAL_SNAPSHOT'],
    rejectionKind: 'partial_snapshot',
    rejectionSeverity: 'error',
    rejectionReasonCode: 'PARTIAL_SNAPSHOT_QUARANTINED',
    failClosed: true,
  },
  'replay-linked-snapshot-generates-replay-scenario': {
    fixtureKind: 'replay_linked_snapshot_generates_replay_scenario',
    sourcePhase71FixtureName: 'replay-linked-historical-snapshot',
    sourcePhase70FixtureName: 'replay-scenario-drift-linked',
    sourcePhase68FixtureName: 'fallback-reconciled-provider-scenario',
    sourcePhase67FixtureName: 'fallback-provider-reconciled',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    sourcePhase65FixtureName: 'offline-account-info-success',
    generationPlanKind: 'replay_generation_plan',
    scenarioKind: 'replay_scenario',
    replayKind: 'baseline_replay',
    replayReady: true,
    expectedStepCount: 6,
    expectedSnapshotCount: 3,
    expectedFinalStateKind: 'scenario_replay_ready',
    selectionReasonCode: 'REPLAY_LINKED_SOURCE_SELECTED',
    selectionWarnings: [],
    qualityStatus: 'clean',
    reliabilityStatus: 'degraded',
    driftSeverity: 'moderate',
    riskStatus: 'moderate',
    riskReasonCodes: ['RISK_REPLAY_LINKED_DRIFT_MONITOR'],
    rejectionKind: 'unsafe_state',
    rejectionSeverity: 'warning',
    rejectionReasonCode: 'NONE',
    failClosed: false,
  },
  'reliability-drift-snapshot-generates-drift-scenario': {
    fixtureKind: 'reliability_drift_snapshot_generates_drift_scenario',
    sourcePhase71FixtureName: 'reliability-linked-drift-snapshot',
    sourcePhase70FixtureName: 'certification-drift-blocked',
    sourcePhase68FixtureName: 'all-conflict-regeneration-blocked-scenario',
    sourcePhase67FixtureName: 'all-providers-conflict-fail-closed',
    sourcePhase66FixtureName: 'all-providers-stale-fail-closed',
    sourcePhase65FixtureName: 'rate-limited-error',
    generationPlanKind: 'drift_generation_plan',
    scenarioKind: 'drift_scenario',
    replayKind: 'drift_replay',
    replayReady: false,
    expectedStepCount: 1,
    expectedSnapshotCount: 2,
    expectedFinalStateKind: 'scenario_drift_blocked',
    selectionReasonCode: 'RELIABILITY_DRIFT_ESCALATION',
    selectionWarnings: ['reliability_drift_critical'],
    qualityStatus: 'blocked',
    reliabilityStatus: 'drifted',
    driftSeverity: 'critical',
    riskStatus: 'critical',
    riskReasonCodes: ['RISK_RELIABILITY_DRIFT_CRITICAL'],
    rejectionKind: 'unsafe_state',
    rejectionSeverity: 'critical',
    rejectionReasonCode: 'RELIABILITY_DRIFT_CRITICAL',
    failClosed: true,
  },
  'cross-provider-conflict-generates-conflict-scenario': {
    fixtureKind: 'cross_provider_conflict_generates_conflict_scenario',
    sourcePhase71FixtureName: 'cross-provider-quality-snapshot-conflict',
    sourcePhase70FixtureName: 'cross-provider-mismatch-telemetry',
    sourcePhase68FixtureName: 'conflicting-values-fail-closed-scenario',
    sourcePhase67FixtureName: 'conflicting-provider-values',
    sourcePhase66FixtureName: 'multi-provider-healthy',
    sourcePhase65FixtureName: 'offline-mint-authority-success',
    generationPlanKind: 'conflict_generation_plan',
    scenarioKind: 'conflict_scenario',
    replayKind: 'drift_replay',
    replayReady: false,
    expectedStepCount: 2,
    expectedSnapshotCount: 2,
    expectedFinalStateKind: 'scenario_conflict_blocked',
    selectionReasonCode: 'CROSS_PROVIDER_CONFLICT_ESCALATED',
    selectionWarnings: ['cross_provider_conflict_detected'],
    qualityStatus: 'blocked',
    reliabilityStatus: 'drifted',
    driftSeverity: 'high',
    riskStatus: 'high',
    riskReasonCodes: ['RISK_CROSS_PROVIDER_CONFLICT'],
    rejectionKind: 'cross_provider_conflict',
    rejectionSeverity: 'critical',
    rejectionReasonCode: 'CROSS_PROVIDER_CONFLICT',
    failClosed: true,
  },
};

export function buildHistoricalSnapshotScenarioGeneratorFixture(
  input: BuildHistoricalSnapshotScenarioGeneratorFixtureInput,
): HistoricalSnapshotScenarioGeneratorFixture {
  const blueprint = BLUEPRINTS[input.fixtureName];
  const fixtureId = `phase72-fixture-${input.fixtureName}`;

  const source65 = FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase65FixtureName);
  const source66 = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase66FixtureName);
  const source67 = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase67FixtureName);
  const source68 = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase68FixtureName);
  const source70 = PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase70FixtureName);
  const source71 = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase71FixtureName);

  if (!source65 || !source66 || !source67 || !source68 || !source70 || !source71) {
    throw new Error(`Phase 72 source linkage missing for ${input.fixtureName}`);
  }

  const sourceSnapshotIds = [source71.manifest.snapshotId];
  const sourceProviderIds = [source71.manifest.sourceProviderId];
  const sourceReliabilityRefs = [blueprint.sourcePhase70FixtureName] as const;

  const generationPlan = buildHistoricalSnapshotGenerationPlan({
    fixtureId,
    generationPlanName: input.fixtureName,
    generationPlanKind: blueprint.generationPlanKind,
    sourceSnapshotFixtureName: blueprint.sourcePhase71FixtureName,
    generatorMode: blueprint.failClosed ? 'deterministic_fail_closed' : 'deterministic_fixture_only',
    deterministicSeedLabel: `phase72-seed-${input.fixtureName}`,
    failClosed: blueprint.failClosed,
  });

  const sourceSelection = buildSnapshotSourceSelection({
    fixtureId,
    selectedSnapshotIds: sourceSnapshotIds,
    selectedProviderIds: sourceProviderIds,
    selectedReliabilityRefs: sourceReliabilityRefs,
    selectionReasonCode: blueprint.selectionReasonCode,
    selectionWarnings: blueprint.selectionWarnings,
  });

  const scenarioDescriptor = buildGeneratedScenarioDescriptor({
    fixtureId,
    scenarioName: input.fixtureName,
    scenarioKind: blueprint.scenarioKind,
    sourceSnapshotId: source71.manifest.snapshotId,
    replayReady: blueprint.replayReady,
  });

  const replayDescriptor = buildSnapshotReplayDescriptor({
    fixtureId,
    replayKind: blueprint.replayKind,
    expectedStepCount: blueprint.expectedStepCount,
    expectedSnapshotCount: blueprint.expectedSnapshotCount,
    expectedFinalStateKind: blueprint.expectedFinalStateKind,
  });

  const lineageModel = buildSnapshotScenarioLineage({
    fixtureId,
    sourceSnapshotRefs: [source71.fixtureId],
    sourceManifestRefs: [source71.manifest.snapshotId],
    sourceReliabilityRefs: [source70.fixtureId],
    sourceReplayRefs: [source68.fixtureId],
    generatedScenarioRefs: [scenarioDescriptor.scenarioId],
    lineageSummary: `scenario generated from ${source71.fixtureName} with reliability ${source70.fixtureName}`,
  });

  const generationRules = buildSnapshotScenarioGenerationRules({
    stale: source71.freshnessContract.stale,
    blocked: blueprint.failClosed,
    quarantined: blueprint.rejectionKind === 'partial_snapshot',
    replayReady: blueprint.replayReady,
    failClosed: blueprint.failClosed,
  });

  const sourceHash = stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum(
    JSON.stringify([source71.fixtureId, source70.fixtureId, source68.fixtureId, source67.fixtureId]),
  );
  const generatedScenarioHash = stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum(
    JSON.stringify({ scenarioDescriptor, replayDescriptor, generationPlan }),
  );

  const integrityContract = buildSnapshotScenarioIntegrityContract({
    fixtureId,
    checksum: stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum(`${sourceHash}|${generatedScenarioHash}`),
    sourceHash,
    generatedScenarioHash,
  });

  const validationContract = buildSnapshotScenarioValidationContract({
    fixtureId,
    rules: [
      'required-fields',
      'deterministic-timestamps',
      'no-live-generation',
      'no-runtime-generation',
      'no-live-ingestion',
      'no-runtime-ingestion',
      'no-live-replay-import',
      'no-network-or-filesystem',
      'integrity-required',
      'lineage-required',
      'fail-closed-on-critical-source-issues',
    ],
    rejectionReasons: ['schema_drift', 'missing_critical_field', 'partial_snapshot', 'cross_provider_conflict', 'unsafe_state'],
    criticalFailureReasons: ['schema_drift_critical', 'missing_critical_field', 'critical_reliability_drift', 'cross_provider_conflict'],
    warningReasons: ['stale_snapshot_warning', 'reliability_drift_warning'],
    failClosed: true,
  });

  const rejectionContract = buildSnapshotScenarioRejectionContract({
    fixtureId,
    rejectionKind: blueprint.rejectionKind,
    severity: blueprint.rejectionSeverity,
    reasonCode: blueprint.rejectionReasonCode,
    failClosed: blueprint.failClosed,
    safetyNotes: ['fixture-only', 'deterministic-only', 'non-executable', 'non-advisory'],
  });

  const qualityLinkage = buildSnapshotScenarioQualityLinkage({
    fixtureId,
    sourceQualityFixtureRef: blueprint.sourcePhase67FixtureName,
    qualityStatus: blueprint.qualityStatus,
    qualityReasonCodes: [blueprint.selectionReasonCode, ...blueprint.selectionWarnings],
  });

  const reliabilityLinkage = buildSnapshotScenarioReliabilityLinkage({
    fixtureId,
    sourceReliabilityFixtureRef: blueprint.sourcePhase70FixtureName,
    reliabilityStatus: blueprint.reliabilityStatus,
    driftSeverity: blueprint.driftSeverity,
  });

  const riskLinkage = buildSnapshotScenarioRiskLinkage({
    fixtureId,
    riskStatus: blueprint.riskStatus,
    riskReasonCodes: blueprint.riskReasonCodes,
    failClosed: blueprint.failClosed,
  });

  const auditReport = buildSnapshotScenarioAuditReport({
    fixtureId,
    generationPlan,
    sourceSelection,
    scenarioDescriptor,
    replayDescriptor,
    lineageModel,
    integrityContract,
    validationContract,
  });

  const viewModel = buildSnapshotScenarioViewModel({
    fixtureId,
    fixtureName: input.fixtureName,
    scenarioDescriptor,
    rejectionContract,
  });

  const sourcePhase65FixtureSnapshot = Object.freeze([...FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES]);
  const sourcePhase66FixtureSnapshot = Object.freeze([...MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES]);
  const sourcePhase67FixtureSnapshot = Object.freeze([...CROSS_PROVIDER_DATA_QUALITY_NAMES]);
  const sourcePhase68FixtureSnapshot = Object.freeze([...PROVIDER_AWARE_REPLAY_SCENARIO_NAMES]);
  const sourcePhase70FixtureSnapshot = Object.freeze([...PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES]);
  const sourcePhase71FixtureSnapshot = Object.freeze([...HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES]);

  return {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE,
    schemaVersion: PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SCHEMA_VERSION,
    generationPlan,
    sourceSelection,
    scenarioDescriptor,
    replayDescriptor,
    lineageModel,
    generationRules,
    integrityContract,
    validationContract,
    rejectionContract,
    qualityLinkage,
    reliabilityLinkage,
    riskLinkage,
    auditReport,
    viewModel,
    apiContract: buildSnapshotScenarioApiContract({ fixtureId, viewModel, fixtureIds: [fixtureId] }),
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: blueprint.fixtureKind,
        matched: true,
        source: 'deterministic_fixture_only',
      },
    ],
    capabilityFlags: getHistoricalSnapshotScenarioGeneratorCapabilities(),
    sourcePhase65FixtureSnapshot,
    sourcePhase66FixtureSnapshot,
    sourcePhase67FixtureSnapshot,
    sourcePhase68FixtureSnapshot,
    sourcePhase70FixtureSnapshot,
    sourcePhase71FixtureSnapshot,
    sourceRefs: {
      phase65FixtureId: source65.fixtureId,
      phase66FixtureId: source66.fixtureId,
      phase67FixtureId: source67.fixtureId,
      phase68FixtureId: source68.fixtureId,
      phase70FixtureId: source70.fixtureId,
      phase71FixtureId: source71.fixtureId,
    },
    meta: {
      generatedAt: PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT,
      source: PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SOURCE,
      version: PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_VERSION,
      phase: HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE,
      deterministicSeed: `phase72-seed-${input.fixtureName}`,
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
