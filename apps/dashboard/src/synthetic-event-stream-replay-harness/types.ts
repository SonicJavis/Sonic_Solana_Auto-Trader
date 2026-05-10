/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: types.
 */

import type {
  SyntheticEventStreamEnvelope,
  SyntheticEventStreamLifecycleDerivedState,
  SyntheticEventStreamLifecycleFixture,
  SyntheticEventStreamLifecycleStreamName,
} from '../synthetic-event-stream-lifecycle/types.js';

export const SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE = 57 as const;

export const PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT =
  '2026-02-06T00:00:00.000Z' as const;

export const PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE =
  'phase57_synthetic_event_stream_replay_harness_v1' as const;

export const PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_VERSION = '1.0.0' as const;

export const PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION = '1.0.0' as const;

export const SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES = [
  'clean-launch-replay',
  'thin-liquidity-replay',
  'concentrated-holders-replay',
  'suspicious-creator-replay',
  'possible-bundle-cluster-replay',
  'metadata-incomplete-replay',
  'high-early-volume-replay',
  'safety-rejected-replay',
] as const;

export const SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS = [
  'clean_launch_replay',
  'thin_liquidity_replay',
  'concentrated_holders_replay',
  'suspicious_creator_replay',
  'possible_bundle_cluster_replay',
  'metadata_incomplete_replay',
  'high_early_volume_replay',
  'safety_rejected_replay',
] as const;

export const SYNTHETIC_EVENT_STREAM_REPLAY_MISMATCH_KINDS = [
  'missing_expected_snapshot',
  'snapshot_checksum_mismatch',
  'state_summary_mismatch',
  'event_sequence_mismatch',
  'causal_parent_mismatch',
  'schema_version_mismatch',
  'unsafe_replay_input_rejected',
  'replay_source_fixture_not_found',
] as const;

export type SyntheticEventStreamReplayHarnessScenarioName =
  (typeof SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES)[number];

export type SyntheticEventStreamReplayHarnessScenarioKind =
  (typeof SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS)[number];

export type SyntheticEventStreamReplayMismatchKind =
  (typeof SYNTHETIC_EVENT_STREAM_REPLAY_MISMATCH_KINDS)[number];

export type SyntheticEventStreamReplayStatus = 'passed' | 'failed' | 'rejected';

export interface SyntheticEventStreamReplayIdentity {
  readonly replayId: string;
  readonly replayName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly replayKind: SyntheticEventStreamReplayHarnessScenarioKind;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly schemaVersion: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT;
}

export interface SyntheticEventStreamReplayClock {
  readonly clockId: string;
  readonly startTimestamp: string;
  readonly stepIndex: number;
  readonly currentTimestamp: string;
  readonly schemaVersion: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION;
  readonly deterministic: true;
}

export interface SyntheticEventStreamReplayStateSummary {
  readonly lifecycleStatus: string;
  readonly safetyStatus: string;
  readonly liquidityLabel: string;
  readonly metadataLabel: string;
  readonly holderLabel: string;
  readonly creatorLabel: string;
  readonly anomalyLabel: string;
  readonly reviewOutcome: string;
  readonly eventReferenceCount: number;
}

export interface SyntheticEventStreamReplaySnapshot {
  readonly snapshotId: string;
  readonly snapshotSequence: number;
  readonly sourceEventId: string;
  readonly lifecycleStateChecksum: string;
  readonly selectedStateSummary: SyntheticEventStreamReplayStateSummary;
  readonly eventReferences: readonly string[];
  readonly deterministicTimestamp: string;
  readonly schemaVersion: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION;
}

export interface SyntheticEventStreamReplayMismatch {
  readonly mismatchId: string;
  readonly kind: SyntheticEventStreamReplayMismatchKind;
  readonly stepSequence: number;
  readonly sourceEventId: string;
  readonly message: string;
}

export interface SyntheticEventStreamReplayStep {
  readonly stepId: string;
  readonly stepSequence: number;
  readonly sourceEventId: string;
  readonly sourceEventKind: string;
  readonly clockTimestamp: string;
  readonly inputStateId: string;
  readonly outputStateId: string;
  readonly expectedSnapshotId: string;
  readonly actualSnapshotId: string;
  readonly mismatches: readonly SyntheticEventStreamReplayMismatch[];
  readonly safetyNotes: readonly string[];
}

export interface SyntheticEventStreamReplayReport {
  readonly reportId: string;
  readonly replayStatus: SyntheticEventStreamReplayStatus;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly totalEvents: number;
  readonly totalSteps: number;
  readonly passedSteps: number;
  readonly failedSteps: number;
  readonly mismatchCount: number;
  readonly finalStateId: string;
  readonly snapshotChecksums: readonly string[];
  readonly summary: string;
  readonly validationSummary: string;
  readonly safetySummary: string;
  readonly meta: {
    readonly generatedAt: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT;
    readonly source: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE;
    readonly schemaVersion: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION;
    readonly deterministic: true;
  };
}

export interface SyntheticEventStreamReplayHarnessViewModel {
  readonly viewModelId: string;
  readonly replayName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly replayKind: SyntheticEventStreamReplayHarnessScenarioKind;
  readonly replayStatus: SyntheticEventStreamReplayStatus;
  readonly totalSteps: number;
  readonly mismatchCount: number;
  readonly finalLifecycleStatus: string;
  readonly safetyLabel: string;
  readonly nonAdvisorySummary: string;
}

export interface SyntheticEventStreamReplayHarnessApiListContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT;
  readonly source: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface SyntheticEventStreamReplayHarnessApiDetailContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT;
  readonly source: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: SyntheticEventStreamReplayHarnessViewModel;
}

export interface SyntheticEventStreamReplayHarnessApiSummaryContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT;
  readonly source: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly replayStatus: SyntheticEventStreamReplayStatus;
    readonly mismatchCount: number;
    readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  };
}

export interface SyntheticEventStreamReplayHarnessApiErrorContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly generatedAt: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT;
  readonly source: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode:
    | 'SYNTHETIC_EVENT_STREAM_REPLAY_INVALID_REQUEST'
    | 'SYNTHETIC_EVENT_STREAM_REPLAY_NOT_FOUND';
  readonly message: string;
}

export interface SyntheticEventStreamReplayHarnessApiContracts {
  readonly list: SyntheticEventStreamReplayHarnessApiListContract;
  readonly detail: SyntheticEventStreamReplayHarnessApiDetailContract;
  readonly summary: SyntheticEventStreamReplayHarnessApiSummaryContract;
  readonly errors: readonly [
    SyntheticEventStreamReplayHarnessApiErrorContract,
    SyntheticEventStreamReplayHarnessApiErrorContract,
  ];
}

export interface SyntheticEventStreamReplayHarnessSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: SyntheticEventStreamReplayHarnessScenarioName;
  readonly fixtureKind?: SyntheticEventStreamReplayHarnessScenarioKind;
  readonly replayStatus?: SyntheticEventStreamReplayStatus;
}

export interface SyntheticEventStreamReplayHarnessSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: SyntheticEventStreamReplayHarnessScenarioKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticEventStreamReplayHarnessCapabilities {
  readonly syntheticEventStreamReplayHarness: true;
  readonly syntheticEventStreamReplayHarnessFixtures: true;
  readonly deterministicSyntheticEventStreamReplayHarness: true;
  readonly localOnlySyntheticEventStreamReplayHarness: true;
  readonly readOnlySyntheticEventStreamReplayHarness: true;
  readonly fixtureDerivedSyntheticEventStreamReplayHarness: true;
  readonly syntheticEventStreamReplayClock: true;
  readonly syntheticEventStreamReplaySteps: true;
  readonly syntheticEventStreamReplaySnapshots: true;
  readonly syntheticEventStreamReplayReports: true;
  readonly syntheticEventStreamReplayViewModels: true;
  readonly syntheticEventStreamReplayApiContracts: true;
  readonly syntheticEventStreamReplaySelectors: true;
  readonly syntheticEventStreamReplayLiveData: false;
  readonly syntheticEventStreamReplayNetworkAccess: false;
  readonly syntheticEventStreamReplayRealProviders: false;
  readonly syntheticEventStreamReplayProviderAdapters: false;
  readonly syntheticEventStreamReplaySolanaRpc: false;
  readonly syntheticEventStreamReplayWebSocketAccess: false;
  readonly syntheticEventStreamReplayGeyserYellowstone: false;
  readonly syntheticEventStreamReplayPumpFunIntegration: false;
  readonly syntheticEventStreamReplayDexIntegration: false;
  readonly syntheticEventStreamReplayJitoIntegration: false;
  readonly syntheticEventStreamReplayPersistence: false;
  readonly syntheticEventStreamReplayFilesystemWrites: false;
  readonly syntheticEventStreamReplayDownloads: false;
  readonly syntheticEventStreamReplayRouteHandlers: false;
  readonly syntheticEventStreamReplayHttpServer: false;
  readonly syntheticEventStreamReplayRuntimeRequests: false;
  readonly syntheticEventStreamReplayUiRendering: false;
  readonly syntheticEventStreamReplayDomAccess: false;
  readonly syntheticEventStreamReplayBackgroundJobs: false;
  readonly syntheticEventStreamReplayScheduledJobs: false;
  readonly syntheticEventStreamReplayWalletLogic: false;
  readonly syntheticEventStreamReplayPrivateKeyHandling: false;
  readonly syntheticEventStreamReplaySigning: false;
  readonly syntheticEventStreamReplayTransactionSending: false;
  readonly syntheticEventStreamReplayExecution: false;
  readonly syntheticEventStreamReplayTradingSignals: false;
  readonly syntheticEventStreamReplayRecommendations: false;
  readonly syntheticEventStreamReplayInvestmentAdvice: false;
  readonly syntheticEventStreamReplayPaperSimulation: false;
  readonly syntheticEventStreamReplayLiveExecution: false;
}

export interface SyntheticEventStreamReplayHarnessFixture {
  readonly fixtureId: string;
  readonly fixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly fixtureKind: SyntheticEventStreamReplayHarnessScenarioKind;
  readonly phase: typeof SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE;
  readonly schemaVersion: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly replayIdentity: SyntheticEventStreamReplayIdentity;
  readonly replayClock: SyntheticEventStreamReplayClock;
  readonly replaySteps: readonly SyntheticEventStreamReplayStep[];
  readonly expectedSnapshots: readonly SyntheticEventStreamReplaySnapshot[];
  readonly actualReport: SyntheticEventStreamReplayReport;
  readonly viewModel: SyntheticEventStreamReplayHarnessViewModel;
  readonly apiContracts: SyntheticEventStreamReplayHarnessApiContracts;
  readonly selectorExamples: readonly SyntheticEventStreamReplayHarnessSelectorResult[];
  readonly capabilityFlags: SyntheticEventStreamReplayHarnessCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT;
    readonly source: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE;
    readonly version: typeof PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_VERSION;
    readonly phase: typeof SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly noLiveData: true;
    readonly noNetworkAccess: true;
    readonly nonAdvisory: true;
    readonly notASignal: true;
  };
}

export interface BuildSyntheticEventStreamReplayHarnessFixtureInput {
  readonly fixtureName: SyntheticEventStreamReplayHarnessScenarioName;
}

export interface RunSyntheticEventStreamReplayHarnessInput {
  readonly fixture: Pick<
    SyntheticEventStreamReplayHarnessFixture,
    'fixtureId' | 'fixtureName' | 'fixtureKind' | 'sourceLifecycleFixtureName' | 'replayIdentity' | 'expectedSnapshots'
  >;
}

export interface SyntheticEventStreamReplayHarnessRunResult {
  readonly replayStatus: SyntheticEventStreamReplayStatus;
  readonly sourceFixture: SyntheticEventStreamLifecycleFixture | null;
  readonly replaySteps: readonly SyntheticEventStreamReplayStep[];
  readonly actualSnapshots: readonly SyntheticEventStreamReplaySnapshot[];
  readonly mismatches: readonly SyntheticEventStreamReplayMismatch[];
  readonly finalState: SyntheticEventStreamLifecycleDerivedState | null;
  readonly report: SyntheticEventStreamReplayReport;
}

export interface CompareSyntheticEventStreamReplaySnapshotsInput {
  readonly expectedSnapshot: SyntheticEventStreamReplaySnapshot | null;
  readonly actualSnapshot: SyntheticEventStreamReplaySnapshot;
  readonly sourceEvent: SyntheticEventStreamEnvelope;
  readonly stepSequence: number;
}

export interface SyntheticEventStreamReplayHarnessValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface SyntheticEventStreamReplayHarnessValidationResult {
  readonly valid: boolean;
  readonly issues: readonly SyntheticEventStreamReplayHarnessValidationIssue[];
}

export interface SyntheticEventStreamReplayHarnessSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
