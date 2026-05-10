/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: builders.
 */

import { getSyntheticEventStreamLifecycleCapabilities } from './capabilities.js';
import { buildSyntheticEventStreamLifecycleApiContract } from './contracts.js';
import { stableDeterministicSyntheticEventStreamLifecycleChecksum } from './normalization.js';
import { reduceSyntheticEventStreamLifecycle } from './reducers.js';
import {
  type BuildSyntheticEventStreamLifecycleFixtureInput,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_VERSION,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE,
  type SyntheticEventStreamEnvelope,
  type SyntheticEventStreamIdentity,
  type SyntheticEventStreamLifecycleEventKind,
  type SyntheticEventStreamLifecycleFixture,
  type SyntheticEventStreamLifecycleSelectorResult,
  type SyntheticEventStreamLifecycleStreamKind,
  type SyntheticEventStreamLifecycleStreamName,
} from './types.js';
import { buildSyntheticEventStreamLifecycleViewModel } from './view-models.js';

interface ScenarioDefinition {
  readonly streamKind: SyntheticEventStreamLifecycleStreamKind;
  readonly sourceSyntheticLaunchFixtureName: string;
  readonly sourceProviderAdapterMockName: string;
  readonly metadataCompletenessLabel: 'complete' | 'partial' | 'incomplete';
  readonly initialLiquidityUsd: number;
  readonly changedLiquidityUsd: number;
  readonly topHolderConcentrationPct: number;
  readonly creatorRiskLabel: 'low' | 'medium' | 'high';
  readonly clusterLabel: 'none' | 'possible' | 'elevated';
  readonly bundleLikeObserved: boolean;
  readonly earlyVolumeBurstLabel: 'none' | 'moderate' | 'high';
  readonly safetyRejected: boolean;
}

const SCENARIO_DEFINITIONS: Readonly<
  Record<SyntheticEventStreamLifecycleStreamName, ScenarioDefinition>
> = {
  'clean-launch-lifecycle-stream': {
    streamKind: 'clean_launch_lifecycle',
    sourceSyntheticLaunchFixtureName: 'clean-launch-baseline',
    sourceProviderAdapterMockName: 'token-metadata-adapter-mock',
    metadataCompletenessLabel: 'complete',
    initialLiquidityUsd: 180000,
    changedLiquidityUsd: 172000,
    topHolderConcentrationPct: 24,
    creatorRiskLabel: 'low',
    clusterLabel: 'none',
    bundleLikeObserved: false,
    earlyVolumeBurstLabel: 'moderate',
    safetyRejected: false,
  },
  'thin-liquidity-lifecycle-stream': {
    streamKind: 'thin_liquidity_lifecycle',
    sourceSyntheticLaunchFixtureName: 'low-liquidity-launch',
    sourceProviderAdapterMockName: 'dex-liquidity-adapter-mock',
    metadataCompletenessLabel: 'partial',
    initialLiquidityUsd: 24000,
    changedLiquidityUsd: 19000,
    topHolderConcentrationPct: 48,
    creatorRiskLabel: 'medium',
    clusterLabel: 'possible',
    bundleLikeObserved: false,
    earlyVolumeBurstLabel: 'moderate',
    safetyRejected: false,
  },
  'concentrated-holders-lifecycle-stream': {
    streamKind: 'concentrated_holders_lifecycle',
    sourceSyntheticLaunchFixtureName: 'concentrated-holder-launch',
    sourceProviderAdapterMockName: 'holder-distribution-adapter-mock',
    metadataCompletenessLabel: 'partial',
    initialLiquidityUsd: 86000,
    changedLiquidityUsd: 79000,
    topHolderConcentrationPct: 78,
    creatorRiskLabel: 'medium',
    clusterLabel: 'possible',
    bundleLikeObserved: false,
    earlyVolumeBurstLabel: 'moderate',
    safetyRejected: false,
  },
  'suspicious-creator-lifecycle-stream': {
    streamKind: 'suspicious_creator_lifecycle',
    sourceSyntheticLaunchFixtureName: 'suspicious-creator-history-launch',
    sourceProviderAdapterMockName: 'risk-intelligence-adapter-mock',
    metadataCompletenessLabel: 'partial',
    initialLiquidityUsd: 72000,
    changedLiquidityUsd: 65000,
    topHolderConcentrationPct: 58,
    creatorRiskLabel: 'high',
    clusterLabel: 'possible',
    bundleLikeObserved: false,
    earlyVolumeBurstLabel: 'moderate',
    safetyRejected: false,
  },
  'bundle-cluster-lifecycle-stream': {
    streamKind: 'bundle_cluster_lifecycle',
    sourceSyntheticLaunchFixtureName: 'possible-bundle-cluster-launch',
    sourceProviderAdapterMockName: 'wallet-cluster-adapter-mock',
    metadataCompletenessLabel: 'partial',
    initialLiquidityUsd: 93000,
    changedLiquidityUsd: 89000,
    topHolderConcentrationPct: 63,
    creatorRiskLabel: 'medium',
    clusterLabel: 'elevated',
    bundleLikeObserved: true,
    earlyVolumeBurstLabel: 'high',
    safetyRejected: false,
  },
  'metadata-incomplete-lifecycle-stream': {
    streamKind: 'metadata_incomplete_lifecycle',
    sourceSyntheticLaunchFixtureName: 'metadata-incomplete-launch',
    sourceProviderAdapterMockName: 'token-metadata-adapter-mock',
    metadataCompletenessLabel: 'incomplete',
    initialLiquidityUsd: 70000,
    changedLiquidityUsd: 62000,
    topHolderConcentrationPct: 52,
    creatorRiskLabel: 'medium',
    clusterLabel: 'possible',
    bundleLikeObserved: false,
    earlyVolumeBurstLabel: 'moderate',
    safetyRejected: false,
  },
  'high-early-volume-lifecycle-stream': {
    streamKind: 'high_early_volume_lifecycle',
    sourceSyntheticLaunchFixtureName: 'high-velocity-early-volume-launch',
    sourceProviderAdapterMockName: 'pump-launch-adapter-mock',
    metadataCompletenessLabel: 'partial',
    initialLiquidityUsd: 125000,
    changedLiquidityUsd: 121000,
    topHolderConcentrationPct: 44,
    creatorRiskLabel: 'medium',
    clusterLabel: 'possible',
    bundleLikeObserved: false,
    earlyVolumeBurstLabel: 'high',
    safetyRejected: false,
  },
  'safety-rejected-lifecycle-stream': {
    streamKind: 'safety_rejected_lifecycle',
    sourceSyntheticLaunchFixtureName: 'safety-rejected-launch',
    sourceProviderAdapterMockName: 'disabled-unsafe-adapter-mock',
    metadataCompletenessLabel: 'incomplete',
    initialLiquidityUsd: 20000,
    changedLiquidityUsd: 15000,
    topHolderConcentrationPct: 88,
    creatorRiskLabel: 'high',
    clusterLabel: 'elevated',
    bundleLikeObserved: true,
    earlyVolumeBurstLabel: 'high',
    safetyRejected: true,
  },
};

const BASE_EVENT_TIMESTAMPS = [
  '2026-01-30T00:00:00.000Z',
  '2026-01-30T00:01:00.000Z',
  '2026-01-30T00:02:00.000Z',
  '2026-01-30T00:03:00.000Z',
  '2026-01-30T00:04:00.000Z',
  '2026-01-30T00:05:00.000Z',
  '2026-01-30T00:06:00.000Z',
  '2026-01-30T00:07:00.000Z',
  '2026-01-30T00:08:00.000Z',
  '2026-01-30T00:09:00.000Z',
  '2026-01-30T00:10:00.000Z',
  '2026-01-30T00:11:00.000Z',
  '2026-01-30T00:12:00.000Z',
  '2026-01-30T00:13:00.000Z',
  '2026-01-30T00:14:00.000Z',
] as const;

function buildStreamIdentity(
  streamId: string,
  fixtureName: SyntheticEventStreamLifecycleStreamName,
  definition: ScenarioDefinition,
  deterministicSeed: string,
): SyntheticEventStreamIdentity {
  return {
    streamId,
    streamName: fixtureName,
    streamKind: definition.streamKind,
    sourceSyntheticLaunchFixtureName: definition.sourceSyntheticLaunchFixtureName,
    sourceProviderAdapterMockName: definition.sourceProviderAdapterMockName,
    schemaVersion: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
    deterministicSeed,
    generatedAt: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
  };
}

function buildEvent(
  streamId: string,
  sequence: number,
  eventKind: SyntheticEventStreamLifecycleEventKind,
  payload: Record<string, unknown>,
  causalParentEventIds: readonly string[],
  derivedFromEventIds: readonly string[],
): SyntheticEventStreamEnvelope {
  return {
    eventId: `${streamId}-event-${String(sequence).padStart(2, '0')}`,
    eventKind,
    sequence,
    schemaVersion: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
    syntheticTimestamp: BASE_EVENT_TIMESTAMPS[sequence - 1] ?? BASE_EVENT_TIMESTAMPS[0],
    source: 'synthetic_fixture_only',
    causalParentEventIds,
    derivedFromEventIds,
    payload,
    confidenceLabel: eventKind === 'safety_rejection_recorded' ? 'high' : 'medium',
    evidenceReferenceIds: [`${streamId}-evidence-${String(sequence).padStart(2, '0')}`],
    safetyNotes: ['fixture-only', 'non-actionable', 'requires review', 'not a signal'],
  };
}

function buildEvents(streamId: string, definition: ScenarioDefinition): readonly SyntheticEventStreamEnvelope[] {
  const event1 = buildEvent(streamId, 1, 'launch_detected', { observation: 'launch observed' }, [], []);
  const event2 = buildEvent(
    streamId,
    2,
    'mint_state_observed',
    { mintLabel: 'mint-observed' },
    [event1.eventId],
    [event1.eventId],
  );
  const event3 = buildEvent(
    streamId,
    3,
    'metadata_state_observed',
    { metadataCompletenessLabel: definition.metadataCompletenessLabel },
    [event2.eventId],
    [event2.eventId],
  );
  const event4 = buildEvent(
    streamId,
    4,
    'pool_created',
    { poolLabel: 'pool-observed' },
    [event1.eventId],
    [event1.eventId],
  );
  const event5 = buildEvent(
    streamId,
    5,
    'initial_liquidity_added',
    { liquidityUsd: definition.initialLiquidityUsd },
    [event4.eventId],
    [event4.eventId],
  );
  const event6 = buildEvent(
    streamId,
    6,
    'liquidity_changed',
    { liquidityUsd: definition.changedLiquidityUsd },
    [event5.eventId],
    [event5.eventId],
  );
  const event7 = buildEvent(
    streamId,
    7,
    'early_volume_burst_observed',
    { burstLabel: definition.earlyVolumeBurstLabel },
    [event5.eventId],
    [event5.eventId],
  );
  const event8 = buildEvent(
    streamId,
    8,
    'holder_distribution_snapshot_captured',
    { topHolderConcentrationPct: definition.topHolderConcentrationPct },
    [event6.eventId],
    [event6.eventId],
  );
  const event9 = buildEvent(
    streamId,
    9,
    'creator_activity_observed',
    { creatorRiskLabel: definition.creatorRiskLabel },
    [event1.eventId],
    [event1.eventId],
  );
  const event10 = buildEvent(
    streamId,
    10,
    'wallet_cluster_pattern_observed',
    { clusterLabel: definition.clusterLabel },
    [event8.eventId],
    [event8.eventId],
  );
  const event11 = buildEvent(
    streamId,
    11,
    'bundle_like_pattern_observed',
    { bundleLabel: definition.bundleLikeObserved ? 'bundle-like-observed' : 'bundle-like-not-observed' },
    [event10.eventId],
    [event10.eventId],
  );
  const event12 = buildEvent(
    streamId,
    12,
    'risk_review_requested',
    { reviewContext: 'requires-review' },
    [event11.eventId],
    [event11.eventId],
  );
  const event13 = buildEvent(
    streamId,
    13,
    'risk_review_completed',
    { reviewOutcome: definition.safetyRejected ? 'rejected' : 'completed' },
    [event12.eventId],
    [event12.eventId],
  );
  const event14 = buildEvent(
    streamId,
    14,
    'lifecycle_snapshot_derived',
    { snapshotLabel: 'lifecycle-derived' },
    [event13.eventId],
    [event2.eventId, event3.eventId, event6.eventId, event8.eventId, event13.eventId],
  );

  const baseEvents = [
    event1,
    event2,
    event3,
    event4,
    event5,
    event6,
    event7,
    event8,
    event9,
    event10,
    event11,
    event12,
    event13,
    event14,
  ];

  if (!definition.safetyRejected) {
    return baseEvents;
  }

  const event15 = buildEvent(
    streamId,
    15,
    'safety_rejection_recorded',
    { rejectionLabel: 'safety-rejection' },
    [event13.eventId, event14.eventId],
    [event13.eventId, event14.eventId],
  );

  return [...baseEvents, event15];
}

function buildSelectorExamples(
  fixtureId: string,
  fixtureKind: SyntheticEventStreamLifecycleStreamKind,
): readonly SyntheticEventStreamLifecycleSelectorResult[] {
  return [
    {
      selectorId: `phase56-selector-by-id-${fixtureId}`,
      selectedFixtureId: fixtureId,
      selectedStreamKind: fixtureKind,
      matched: true,
      source: 'synthetic_fixture_only',
    },
    {
      selectorId: `phase56-selector-by-kind-${fixtureKind}`,
      selectedFixtureId: fixtureId,
      selectedStreamKind: fixtureKind,
      matched: true,
      source: 'synthetic_fixture_only',
    },
  ];
}

export function buildSyntheticEventStreamLifecycleFixture(
  input: BuildSyntheticEventStreamLifecycleFixtureInput,
): SyntheticEventStreamLifecycleFixture {
  const definition = SCENARIO_DEFINITIONS[input.fixtureName];
  const deterministicSeed = `phase56:${input.fixtureName}:${definition.streamKind}`;
  const checksum = stableDeterministicSyntheticEventStreamLifecycleChecksum(deterministicSeed);
  const fixtureId = `phase56-fixture-${checksum.replace(':', '-')}`;
  const streamId = `phase56-stream-${checksum.replace(':', '-')}`;
  const streamIdentity = buildStreamIdentity(streamId, input.fixtureName, definition, deterministicSeed);
  const events = buildEvents(streamId, definition);
  const derivedLifecycleState = reduceSyntheticEventStreamLifecycle(events, streamIdentity);

  const capabilityFlags = getSyntheticEventStreamLifecycleCapabilities();

  const partialFixture = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: definition.streamKind,
    phase: SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE,
    schemaVersion: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
    streamIdentity,
    sourceSyntheticLaunchFixtureName: definition.sourceSyntheticLaunchFixtureName,
    sourceProviderAdapterMockName: definition.sourceProviderAdapterMockName,
    events,
    derivedLifecycleState,
    capabilityFlags,
    meta: {
      generatedAt: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
      source: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
      version: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_VERSION,
      phase: SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE,
      deterministicSeed,
    },
    safety: {
      nonAdvisory: true,
      fixtureOnly: true,
      localOnly: true,
      noLiveData: true,
      noNetworkAccess: true,
      notASignal: true,
    },
  } as const;

  const viewModel = buildSyntheticEventStreamLifecycleViewModel(
    partialFixture as unknown as SyntheticEventStreamLifecycleFixture,
  );

  const withViewModel = {
    ...partialFixture,
    viewModel,
  } as unknown as SyntheticEventStreamLifecycleFixture;

  const apiContracts = buildSyntheticEventStreamLifecycleApiContract(withViewModel);
  const selectorExamples = buildSelectorExamples(fixtureId, definition.streamKind);

  return {
    ...withViewModel,
    apiContracts,
    selectorExamples,
  };
}
