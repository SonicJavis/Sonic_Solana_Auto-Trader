import {
  CROSS_PROVIDER_DATA_QUALITY_NAMES,
  CROSS_PROVIDER_DATA_QUALITY_FIXTURES,
} from '../cross-provider-data-quality/index.js';
import {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES,
} from '../synthetic-event-stream-lifecycle/index.js';
import {
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES,
} from '../synthetic-event-stream-replay-harness/index.js';
import { getProviderAwareReplayScenarioCapabilities } from './capabilities.js';
import { buildProviderAwareReplayApiContract } from './contracts.js';
import { buildProviderAwareReplayImport } from './import-models.js';
import { buildGeneratedLifecyclePreview } from './lifecycle-preview.js';
import { buildProviderObservationReplayReport } from './observation-reports.js';
import { buildProviderReplayParityCheck } from './parity-checks.js';
import { buildProviderReplayProvenanceMapping } from './provenance-mapping.js';
import { buildProviderFixtureRegenerationContract } from './regeneration-contracts.js';
import { buildReplayExpectationModel } from './replay-expectations.js';
import { buildProviderAwareReplayScenario } from './scenario-generation.js';
import type {
  BuildProviderAwareReplayScenarioFixtureInput,
  ProviderAwareReplayGeneratedScenario,
  ProviderAwareReplayScenarioFixture,
  ProviderAwareReplayScenarioKind,
  ProviderAwareReplayScenarioName,
  ProviderReplayParityMismatch,
} from './types.js';
import {
  PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT,
  PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SCHEMA_VERSION,
  PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SOURCE,
  PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_VERSION,
  PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE,
} from './types.js';
import { buildProviderAwareReplayViewModel } from './view-models.js';

interface ScenarioBlueprint {
  readonly fixtureKind: ProviderAwareReplayScenarioKind;
  readonly sourceQualityFixtureName: (typeof CROSS_PROVIDER_DATA_QUALITY_NAMES)[number];
  readonly replayFixtureName: (typeof SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES)[number];
  readonly lifecycleFixtureName: (typeof SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES)[number];
  readonly sourceProviderIds: readonly string[];
  readonly sourceReconciliationIds: readonly string[];
  readonly sourceIssueIds: readonly string[];
  readonly sourceMismatchReportIds: readonly string[];
  readonly provenanceFieldPaths: readonly string[];
  readonly confidenceLabel: string;
  readonly parityStatus: 'passed' | 'failed' | 'rejected';
  readonly parityMismatchKinds: readonly ProviderReplayParityMismatch['mismatchKind'][];
  readonly failClosed: boolean;
  readonly importStatus: 'ready' | 'rejected';
  readonly expectedStepCount: number;
  readonly expectedFinalStateKind: string;
}

const SCENARIOS: Readonly<Record<ProviderAwareReplayScenarioName, ScenarioBlueprint>> = {
  'high-confidence-provider-agreement-scenario': {
    fixtureKind: 'high_confidence_provider_agreement_scenario',
    sourceQualityFixtureName: 'all-providers-agree-high-confidence',
    replayFixtureName: 'clean-launch-replay',
    lifecycleFixtureName: 'clean-launch-lifecycle-stream',
    sourceProviderIds: ['provider-a', 'provider-b', 'provider-c'],
    sourceReconciliationIds: ['phase67-fixture-all-providers-agree-high-confidence-reconciliation'],
    sourceIssueIds: ['phase67-fixture-all-providers-agree-high-confidence-provider_partial_record-token-symbol'],
    sourceMismatchReportIds: [],
    provenanceFieldPaths: ['token.symbol', 'token.decimals', 'liquidity.total'],
    confidenceLabel: 'very_high',
    parityStatus: 'passed',
    parityMismatchKinds: [],
    failClosed: false,
    importStatus: 'ready',
    expectedStepCount: 15,
    expectedFinalStateKind: 'review_completed',
  },
  'stale-provider-replay-scenario': {
    fixtureKind: 'stale_provider_replay_scenario',
    sourceQualityFixtureName: 'stale-provider-mismatch',
    replayFixtureName: 'thin-liquidity-replay',
    lifecycleFixtureName: 'thin-liquidity-lifecycle-stream',
    sourceProviderIds: ['provider-a', 'provider-b'],
    sourceReconciliationIds: ['phase67-fixture-stale-provider-mismatch-reconciliation'],
    sourceIssueIds: ['phase67-fixture-stale-provider-mismatch-provider_stale-slot'],
    sourceMismatchReportIds: ['phase67-fixture-stale-provider-mismatch-mismatch-stale_data-slot'],
    provenanceFieldPaths: ['slot', 'liquidity.total'],
    confidenceLabel: 'medium',
    parityStatus: 'failed',
    parityMismatchKinds: ['state_summary_mismatch'],
    failClosed: false,
    importStatus: 'ready',
    expectedStepCount: 15,
    expectedFinalStateKind: 'under_review',
  },
  'missing-field-partial-scenario': {
    fixtureKind: 'missing_field_partial_scenario',
    sourceQualityFixtureName: 'missing-field-partial-confidence',
    replayFixtureName: 'metadata-incomplete-replay',
    lifecycleFixtureName: 'metadata-incomplete-lifecycle-stream',
    sourceProviderIds: ['provider-a', 'provider-b'],
    sourceReconciliationIds: ['phase67-fixture-missing-field-partial-confidence-reconciliation'],
    sourceIssueIds: ['phase67-fixture-missing-field-partial-confidence-provider_missing_field-token-supply'],
    sourceMismatchReportIds: ['phase67-fixture-missing-field-partial-confidence-mismatch-missing_field-token-supply'],
    provenanceFieldPaths: ['token.symbol', 'token.supply', 'metadata.uri'],
    confidenceLabel: 'medium',
    parityStatus: 'failed',
    parityMismatchKinds: ['missing_expected_snapshot'],
    failClosed: false,
    importStatus: 'ready',
    expectedStepCount: 15,
    expectedFinalStateKind: 'review_completed',
  },
  'conflicting-values-fail-closed-scenario': {
    fixtureKind: 'conflicting_values_fail_closed_scenario',
    sourceQualityFixtureName: 'conflicting-provider-values',
    replayFixtureName: 'concentrated-holders-replay',
    lifecycleFixtureName: 'concentrated-holders-lifecycle-stream',
    sourceProviderIds: ['provider-a', 'provider-b', 'provider-c'],
    sourceReconciliationIds: ['phase67-fixture-conflicting-provider-values-reconciliation'],
    sourceIssueIds: ['phase67-fixture-conflicting-provider-values-provider_value_conflict-liquidity-total'],
    sourceMismatchReportIds: ['phase67-fixture-conflicting-provider-values-mismatch-value_mismatch-liquidity-total'],
    provenanceFieldPaths: ['liquidity.total', 'holders.top10Pct'],
    confidenceLabel: 'low',
    parityStatus: 'failed',
    parityMismatchKinds: ['critical_reconciliation_conflict'],
    failClosed: true,
    importStatus: 'ready',
    expectedStepCount: 15,
    expectedFinalStateKind: 'safety_rejected',
  },
  'unhealthy-provider-rejected-scenario': {
    fixtureKind: 'unhealthy_provider_rejected_scenario',
    sourceQualityFixtureName: 'unhealthy-provider-rejected',
    replayFixtureName: 'suspicious-creator-replay',
    lifecycleFixtureName: 'suspicious-creator-lifecycle-stream',
    sourceProviderIds: ['provider-a', 'provider-b'],
    sourceReconciliationIds: ['phase67-fixture-unhealthy-provider-rejected-reconciliation'],
    sourceIssueIds: ['phase67-fixture-unhealthy-provider-rejected-provider_unhealthy-health-status'],
    sourceMismatchReportIds: ['phase67-fixture-unhealthy-provider-rejected-mismatch-partial_data-health-status'],
    provenanceFieldPaths: ['health.status', 'token.symbol'],
    confidenceLabel: 'high',
    parityStatus: 'passed',
    parityMismatchKinds: [],
    failClosed: false,
    importStatus: 'ready',
    expectedStepCount: 15,
    expectedFinalStateKind: 'review_completed',
  },
  'fallback-reconciled-provider-scenario': {
    fixtureKind: 'fallback_reconciled_provider_scenario',
    sourceQualityFixtureName: 'fallback-provider-reconciled',
    replayFixtureName: 'high-early-volume-replay',
    lifecycleFixtureName: 'high-early-volume-lifecycle-stream',
    sourceProviderIds: ['provider-a', 'provider-b', 'provider-c'],
    sourceReconciliationIds: ['phase67-fixture-fallback-provider-reconciled-reconciliation'],
    sourceIssueIds: ['phase67-fixture-fallback-provider-reconciled-provider_stale-slot'],
    sourceMismatchReportIds: ['phase67-fixture-fallback-provider-reconciled-mismatch-stale_data-slot'],
    provenanceFieldPaths: ['slot', 'liquidity.total', 'token.symbol'],
    confidenceLabel: 'high',
    parityStatus: 'passed',
    parityMismatchKinds: [],
    failClosed: false,
    importStatus: 'ready',
    expectedStepCount: 15,
    expectedFinalStateKind: 'review_completed',
  },
  'all-conflict-regeneration-blocked-scenario': {
    fixtureKind: 'all_conflict_regeneration_blocked_scenario',
    sourceQualityFixtureName: 'all-providers-conflict-fail-closed',
    replayFixtureName: 'possible-bundle-cluster-replay',
    lifecycleFixtureName: 'bundle-cluster-lifecycle-stream',
    sourceProviderIds: ['provider-a', 'provider-b', 'provider-c'],
    sourceReconciliationIds: ['phase67-fixture-all-providers-conflict-fail-closed-reconciliation'],
    sourceIssueIds: ['phase67-fixture-all-providers-conflict-fail-closed-provider_value_conflict-token-supply'],
    sourceMismatchReportIds: ['phase67-fixture-all-providers-conflict-fail-closed-mismatch-shape_mismatch-token-supply'],
    provenanceFieldPaths: ['token.symbol', 'token.supply', 'liquidity.total'],
    confidenceLabel: 'none',
    parityStatus: 'rejected',
    parityMismatchKinds: ['critical_reconciliation_conflict', 'snapshot_checksum_mismatch'],
    failClosed: true,
    importStatus: 'rejected',
    expectedStepCount: 15,
    expectedFinalStateKind: 'safety_rejected',
  },
  'unsafe-provider-capability-blocked-scenario': {
    fixtureKind: 'unsafe_provider_capability_blocked_scenario',
    sourceQualityFixtureName: 'unsafe-provider-capability-rejected',
    replayFixtureName: 'safety-rejected-replay',
    lifecycleFixtureName: 'safety-rejected-lifecycle-stream',
    sourceProviderIds: ['provider-a', 'provider-b'],
    sourceReconciliationIds: ['phase67-fixture-unsafe-provider-capability-rejected-reconciliation'],
    sourceIssueIds: ['phase67-fixture-unsafe-provider-capability-rejected-provider_unsafe_capability-capabilities-writeMethods'],
    sourceMismatchReportIds: ['phase67-fixture-unsafe-provider-capability-rejected-mismatch-shape_mismatch-capabilities-writeMethods'],
    provenanceFieldPaths: ['capabilities.writeMethods', 'token.symbol'],
    confidenceLabel: 'high',
    parityStatus: 'rejected',
    parityMismatchKinds: ['unsafe_provider_capability_detected'],
    failClosed: true,
    importStatus: 'rejected',
    expectedStepCount: 15,
    expectedFinalStateKind: 'safety_rejected',
  },
};

function buildParityMismatches(
  fixtureId: string,
  mismatchKinds: readonly ProviderReplayParityMismatch['mismatchKind'][],
): readonly ProviderReplayParityMismatch[] {
  return mismatchKinds.map((mismatchKind, index) => ({
    mismatchId: `${fixtureId}-parity-mismatch-${index + 1}-${mismatchKind}`,
    mismatchKind,
    severity:
      mismatchKind === 'critical_reconciliation_conflict' || mismatchKind === 'unsafe_provider_capability_detected'
        ? 'critical'
        : mismatchKind === 'snapshot_checksum_mismatch'
          ? 'high'
          : 'moderate',
    message: `Deterministic parity mismatch classified as ${mismatchKind}.`,
  }));
}

function buildExpectedSnapshotIds(fixtureId: string, count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => `${fixtureId}-expected-snapshot-${index + 1}`);
}

function buildObservedSnapshotIds(
  fixtureId: string,
  expectedSnapshotIds: readonly string[],
  mismatchCount: number,
): readonly string[] {
  if (mismatchCount === 0) return [...expectedSnapshotIds];
  return expectedSnapshotIds.map((snapshotId, index) =>
    index < mismatchCount ? `${fixtureId}-observed-snapshot-${index + 1}` : snapshotId,
  );
}

export function buildProviderAwareReplayScenarioFixture(
  input: BuildProviderAwareReplayScenarioFixtureInput,
): ProviderAwareReplayScenarioFixture {
  const scenario = SCENARIOS[input.fixtureName];
  const fixtureId = `phase68-fixture-${input.fixtureName}`;
  const sourceQuality = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(
    fixture => fixture.fixtureName === scenario.sourceQualityFixtureName,
  );
  const sourceReplay = SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES.find(
    fixture => fixture.fixtureName === scenario.replayFixtureName,
  );
  const sourceLifecycle = SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.find(
    fixture => fixture.fixtureName === scenario.lifecycleFixtureName,
  );

  if (!sourceQuality || !sourceReplay || !sourceLifecycle) {
    throw new Error(`Phase 68 source linkage missing for ${input.fixtureName}`);
  }

  const importModel = buildProviderAwareReplayImport({
    fixtureName: input.fixtureName,
    sourceQualityFixtureName: scenario.sourceQualityFixtureName,
    sourceReconciliationIds: scenario.sourceReconciliationIds,
    sourceProviderIds: scenario.sourceProviderIds,
    replayFixtureName: scenario.replayFixtureName,
    lifecycleFixtureName: scenario.lifecycleFixtureName,
    importStatus: scenario.importStatus,
  });

  const provenanceMappings = scenario.provenanceFieldPaths.map((fieldPath, index) =>
    buildProviderReplayProvenanceMapping({
      fixtureId,
      sourceProviderId: scenario.sourceProviderIds[index % scenario.sourceProviderIds.length]!,
      sourceFieldPath: fieldPath,
      targetScenarioFieldPath: `generatedScenario.${fieldPath}`,
      sourceFixtureName: scenario.sourceQualityFixtureName,
      confidenceLabel: scenario.confidenceLabel,
    }),
  );

  const lifecyclePreview = buildGeneratedLifecyclePreview({
    fixtureId,
    sourceScenarioId: `${fixtureId}-scenario`,
    eventKinds: sourceLifecycle.events.slice(0, scenario.expectedStepCount).map(event => event.eventKind),
  });

  const expectedSnapshotIds = buildExpectedSnapshotIds(fixtureId, scenario.expectedStepCount);

  const generatedScenario: ProviderAwareReplayGeneratedScenario = buildProviderAwareReplayScenario({
    fixtureId,
    scenarioName: input.fixtureName,
    scenarioKind: scenario.fixtureKind,
    sourceQualityFixtureName: scenario.sourceQualityFixtureName,
    sourceConfidenceLabel: scenario.confidenceLabel,
    sourceIssueIds: scenario.sourceIssueIds,
    sourceMismatchReportIds: scenario.sourceMismatchReportIds,
    providerProvenanceRefs: provenanceMappings.map(mapping => mapping.provenanceMappingId),
    generatedLifecyclePreviewIds: [lifecyclePreview.lifecyclePreviewId],
    expectedReplaySnapshotIds: expectedSnapshotIds,
    replayFixtureName: scenario.replayFixtureName,
    lifecycleFixtureName: scenario.lifecycleFixtureName,
    failClosed: scenario.failClosed,
  });

  const parityMismatches = buildParityMismatches(fixtureId, scenario.parityMismatchKinds);
  const parityCheck = buildProviderReplayParityCheck({
    fixtureId,
    scenarioId: generatedScenario.scenarioId,
    replayFixtureName: scenario.replayFixtureName,
    expectedSnapshotIds,
    observedSnapshotIds: buildObservedSnapshotIds(fixtureId, expectedSnapshotIds, parityMismatches.length),
    mismatches: parityMismatches,
    parityStatus: scenario.parityStatus,
    failClosed: scenario.failClosed,
  });

  const regenerationContract = buildProviderFixtureRegenerationContract({
    fixtureId,
    sourceQualityFixtureName: scenario.sourceQualityFixtureName,
    targetScenarioName: input.fixtureName,
  });

  const replayExpectation = buildReplayExpectationModel({
    fixtureId,
    sourceScenarioId: generatedScenario.scenarioId,
    expectedStepCount: scenario.expectedStepCount,
    expectedFinalStateKind: scenario.expectedFinalStateKind,
    expectedMismatchCount: parityMismatches.length,
    expectedFailClosed: scenario.failClosed,
    sourceRefs: [sourceQuality.fixtureId, sourceReplay.fixtureId, sourceLifecycle.fixtureId],
  });

  const observationReport = buildProviderObservationReplayReport({
    fixtureId,
    importModel,
    generatedScenario,
    provenanceMappings,
    parityCheck,
    regenerationContract,
  });

  const viewModel = buildProviderAwareReplayViewModel({
    fixtureId,
    fixtureName: input.fixtureName,
    generatedScenario,
    parityCheck,
  });

  return {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE,
    schemaVersion: PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SCHEMA_VERSION,
    importModel,
    generatedScenario,
    provenanceMappings,
    parityCheck,
    regenerationContract,
    lifecyclePreview,
    replayExpectation,
    observationReport,
    viewModel,
    apiContract: buildProviderAwareReplayApiContract({ fixtureId, viewModel, fixtureIds: [fixtureId] }),
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: scenario.fixtureKind,
        matched: true,
        source: 'synthetic_fixture_only',
      },
    ],
    capabilityFlags: getProviderAwareReplayScenarioCapabilities(),
    sourcePhase67FixtureSnapshot: CROSS_PROVIDER_DATA_QUALITY_NAMES,
    sourcePhase57ReplayFixtureSnapshot: SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES,
    sourcePhase56LifecycleFixtureSnapshot: SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES,
    meta: {
      generatedAt: PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT,
      source: PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SOURCE,
      version: PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_VERSION,
      phase: PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE,
      deterministicSeed: `phase68-seed-${input.fixtureName}`,
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
