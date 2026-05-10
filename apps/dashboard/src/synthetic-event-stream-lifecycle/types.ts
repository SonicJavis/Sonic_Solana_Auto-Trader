/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: types.
 */

export const SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE = 56 as const;

export const PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT =
  '2026-01-30T00:00:00.000Z' as const;

export const PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE =
  'phase56_synthetic_event_stream_lifecycle_v1' as const;

export const PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_VERSION = '1.0.0' as const;

export const PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION = '1.0.0' as const;

export const SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES = [
  'clean-launch-lifecycle-stream',
  'thin-liquidity-lifecycle-stream',
  'concentrated-holders-lifecycle-stream',
  'suspicious-creator-lifecycle-stream',
  'bundle-cluster-lifecycle-stream',
  'metadata-incomplete-lifecycle-stream',
  'high-early-volume-lifecycle-stream',
  'safety-rejected-lifecycle-stream',
] as const;

export const SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS = [
  'clean_launch_lifecycle',
  'thin_liquidity_lifecycle',
  'concentrated_holders_lifecycle',
  'suspicious_creator_lifecycle',
  'bundle_cluster_lifecycle',
  'metadata_incomplete_lifecycle',
  'high_early_volume_lifecycle',
  'safety_rejected_lifecycle',
] as const;

export const SYNTHETIC_EVENT_STREAM_LIFECYCLE_EVENT_KINDS = [
  'launch_detected',
  'mint_state_observed',
  'metadata_state_observed',
  'pool_created',
  'initial_liquidity_added',
  'liquidity_changed',
  'early_volume_burst_observed',
  'holder_distribution_snapshot_captured',
  'creator_activity_observed',
  'wallet_cluster_pattern_observed',
  'bundle_like_pattern_observed',
  'risk_review_requested',
  'risk_review_completed',
  'lifecycle_snapshot_derived',
  'safety_rejection_recorded',
] as const;

export type SyntheticEventStreamLifecycleStreamName =
  (typeof SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES)[number];

export type SyntheticEventStreamLifecycleStreamKind =
  (typeof SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS)[number];

export type SyntheticEventStreamLifecycleEventKind =
  (typeof SYNTHETIC_EVENT_STREAM_LIFECYCLE_EVENT_KINDS)[number];

export type SyntheticEventStreamLifecycleStatus =
  | 'observed'
  | 'under_review'
  | 'review_completed'
  | 'safety_rejected';

export type SyntheticEventStreamLifecycleSafetyStatus =
  | 'safe_for_fixture_display'
  | 'requires_review'
  | 'safety_rejection';

export interface SyntheticEventStreamIdentity {
  readonly streamId: string;
  readonly streamName: SyntheticEventStreamLifecycleStreamName;
  readonly streamKind: SyntheticEventStreamLifecycleStreamKind;
  readonly sourceSyntheticLaunchFixtureName: string;
  readonly sourceProviderAdapterMockName: string;
  readonly schemaVersion: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT;
}

export interface SyntheticEventStreamEnvelope {
  readonly eventId: string;
  readonly eventKind: SyntheticEventStreamLifecycleEventKind;
  readonly sequence: number;
  readonly schemaVersion: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION;
  readonly syntheticTimestamp: string;
  readonly source: 'synthetic_fixture_only';
  readonly causalParentEventIds: readonly string[];
  readonly derivedFromEventIds: readonly string[];
  readonly payload: Record<string, unknown>;
  readonly confidenceLabel: 'low' | 'medium' | 'high';
  readonly evidenceReferenceIds: readonly string[];
  readonly safetyNotes: readonly string[];
}

export interface SyntheticEventStreamLifecycleTokenState {
  readonly mintObserved: boolean;
  readonly mintLabel: string;
  readonly tokenStateSummary: string;
}

export interface SyntheticEventStreamLifecycleMetadataState {
  readonly metadataObserved: boolean;
  readonly metadataCompletenessLabel: 'complete' | 'partial' | 'incomplete';
  readonly metadataStateSummary: string;
}

export interface SyntheticEventStreamLifecycleLiquidityState {
  readonly poolObserved: boolean;
  readonly liquidityLabel: 'balanced' | 'moderate' | 'thin';
  readonly latestLiquidityUsd: number;
  readonly liquidityStateSummary: string;
}

export interface SyntheticEventStreamLifecycleHolderState {
  readonly holderSnapshotObserved: boolean;
  readonly concentrationLabel: 'low' | 'medium' | 'high';
  readonly topHolderConcentrationPct: number;
  readonly holderStateSummary: string;
}

export interface SyntheticEventStreamLifecycleCreatorState {
  readonly creatorActivityObserved: boolean;
  readonly creatorRiskLabel: 'low' | 'medium' | 'high';
  readonly creatorStateSummary: string;
}

export interface SyntheticEventStreamLifecycleWalletClusterState {
  readonly walletClusterObserved: boolean;
  readonly bundleLikeObserved: boolean;
  readonly clusterLabel: 'none' | 'possible' | 'elevated';
  readonly walletClusterStateSummary: string;
}

export interface SyntheticEventStreamLifecycleAnomalyState {
  readonly earlyVolumeObserved: boolean;
  readonly anomalyLabel: 'none' | 'moderate' | 'high';
  readonly anomalyStateSummary: string;
}

export interface SyntheticEventStreamLifecycleRiskReviewState {
  readonly reviewRequested: boolean;
  readonly reviewCompleted: boolean;
  readonly reviewOutcome: 'pending' | 'completed' | 'rejected';
  readonly riskReviewSummary: string;
}

export interface SyntheticEventStreamLifecycleSafetyState {
  readonly status: SyntheticEventStreamLifecycleSafetyStatus;
  readonly nonAdvisory: true;
  readonly notASignal: true;
  readonly safetySummary: string;
}

export interface SyntheticEventStreamLifecycleDerivedState {
  readonly stateId: string;
  readonly streamId: string;
  readonly lastEventSequence: number;
  readonly lifecycleStatus: SyntheticEventStreamLifecycleStatus;
  readonly tokenState: SyntheticEventStreamLifecycleTokenState;
  readonly metadataState: SyntheticEventStreamLifecycleMetadataState;
  readonly liquidityState: SyntheticEventStreamLifecycleLiquidityState;
  readonly holderState: SyntheticEventStreamLifecycleHolderState;
  readonly creatorState: SyntheticEventStreamLifecycleCreatorState;
  readonly walletClusterState: SyntheticEventStreamLifecycleWalletClusterState;
  readonly anomalyState: SyntheticEventStreamLifecycleAnomalyState;
  readonly riskReviewState: SyntheticEventStreamLifecycleRiskReviewState;
  readonly safetyState: SyntheticEventStreamLifecycleSafetyState;
  readonly eventReferences: readonly string[];
  readonly meta: {
    readonly generatedAt: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT;
    readonly source: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE;
    readonly schemaVersion: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION;
    readonly deterministic: true;
  };
}

export interface SyntheticEventStreamLifecycleViewModel {
  readonly viewModelId: string;
  readonly streamLabel: string;
  readonly lifecycleStatusLabel: string;
  readonly safetyStatusLabel: string;
  readonly liquidityLabel: string;
  readonly metadataLabel: string;
  readonly holderLabel: string;
  readonly creatorLabel: string;
  readonly anomalyLabel: string;
  readonly evidenceEventCount: number;
  readonly nonAdvisorySummary: string;
}

export interface SyntheticEventStreamLifecycleApiListContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT;
  readonly source: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface SyntheticEventStreamLifecycleApiDetailContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT;
  readonly source: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: SyntheticEventStreamLifecycleViewModel;
}

export interface SyntheticEventStreamLifecycleApiSummaryContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT;
  readonly source: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly streamKind: SyntheticEventStreamLifecycleStreamKind;
    readonly lifecycleStatus: SyntheticEventStreamLifecycleStatus;
    readonly safetyStatus: SyntheticEventStreamLifecycleSafetyStatus;
  };
}

export interface SyntheticEventStreamLifecycleApiErrorContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly generatedAt: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT;
  readonly source: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode:
    | 'SYNTHETIC_EVENT_STREAM_INVALID_REQUEST'
    | 'SYNTHETIC_EVENT_STREAM_NOT_FOUND';
  readonly message: string;
}

export interface SyntheticEventStreamLifecycleApiContracts {
  readonly list: SyntheticEventStreamLifecycleApiListContract;
  readonly detail: SyntheticEventStreamLifecycleApiDetailContract;
  readonly summary: SyntheticEventStreamLifecycleApiSummaryContract;
  readonly errors: readonly [
    SyntheticEventStreamLifecycleApiErrorContract,
    SyntheticEventStreamLifecycleApiErrorContract,
  ];
}

export interface SyntheticEventStreamLifecycleSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: SyntheticEventStreamLifecycleStreamName;
  readonly streamKind?: SyntheticEventStreamLifecycleStreamKind;
  readonly lifecycleStatus?: SyntheticEventStreamLifecycleStatus;
  readonly safetyStatus?: SyntheticEventStreamLifecycleSafetyStatus;
}

export interface SyntheticEventStreamLifecycleSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedStreamKind: SyntheticEventStreamLifecycleStreamKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticEventStreamLifecycleCapabilities {
  readonly syntheticEventStreamLifecycle: true;
  readonly syntheticEventStreamLifecycleFixtures: true;
  readonly deterministicSyntheticEventStreamLifecycle: true;
  readonly localOnlySyntheticEventStreamLifecycle: true;
  readonly readOnlySyntheticEventStreamLifecycle: true;
  readonly fixtureDerivedSyntheticEventStreamLifecycle: true;
  readonly appendOnlySyntheticEventStreams: true;
  readonly syntheticEventStreamReducers: true;
  readonly syntheticEventStreamViewModels: true;
  readonly syntheticEventStreamApiContracts: true;
  readonly syntheticEventStreamSelectors: true;
  readonly syntheticEventStreamLiveData: false;
  readonly syntheticEventStreamNetworkAccess: false;
  readonly syntheticEventStreamRealProviders: false;
  readonly syntheticEventStreamProviderAdapters: false;
  readonly syntheticEventStreamSolanaRpc: false;
  readonly syntheticEventStreamWebSocketAccess: false;
  readonly syntheticEventStreamGeyserYellowstone: false;
  readonly syntheticEventStreamPumpFunIntegration: false;
  readonly syntheticEventStreamDexIntegration: false;
  readonly syntheticEventStreamJitoIntegration: false;
  readonly syntheticEventStreamPersistence: false;
  readonly syntheticEventStreamFilesystemWrites: false;
  readonly syntheticEventStreamDownloads: false;
  readonly syntheticEventStreamRouteHandlers: false;
  readonly syntheticEventStreamHttpServer: false;
  readonly syntheticEventStreamRuntimeRequests: false;
  readonly syntheticEventStreamUiRendering: false;
  readonly syntheticEventStreamDomAccess: false;
  readonly syntheticEventStreamBackgroundJobs: false;
  readonly syntheticEventStreamScheduledJobs: false;
  readonly syntheticEventStreamWalletLogic: false;
  readonly syntheticEventStreamPrivateKeyHandling: false;
  readonly syntheticEventStreamSigning: false;
  readonly syntheticEventStreamTransactionSending: false;
  readonly syntheticEventStreamExecution: false;
  readonly syntheticEventStreamTradingSignals: false;
  readonly syntheticEventStreamRecommendations: false;
  readonly syntheticEventStreamInvestmentAdvice: false;
  readonly syntheticEventStreamReplayHarness: false;
  readonly syntheticEventStreamPaperSimulation: false;
}

export interface SyntheticEventStreamLifecycleFixture {
  readonly fixtureId: string;
  readonly fixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly fixtureKind: SyntheticEventStreamLifecycleStreamKind;
  readonly phase: typeof SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE;
  readonly schemaVersion: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION;
  readonly streamIdentity: SyntheticEventStreamIdentity;
  readonly sourceSyntheticLaunchFixtureName: string;
  readonly sourceProviderAdapterMockName: string;
  readonly events: readonly SyntheticEventStreamEnvelope[];
  readonly derivedLifecycleState: SyntheticEventStreamLifecycleDerivedState;
  readonly viewModel: SyntheticEventStreamLifecycleViewModel;
  readonly apiContracts: SyntheticEventStreamLifecycleApiContracts;
  readonly selectorExamples: readonly SyntheticEventStreamLifecycleSelectorResult[];
  readonly capabilityFlags: SyntheticEventStreamLifecycleCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT;
    readonly source: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE;
    readonly version: typeof PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_VERSION;
    readonly phase: typeof SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly nonAdvisory: true;
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly noLiveData: true;
    readonly noNetworkAccess: true;
    readonly notASignal: true;
  };
}

export interface BuildSyntheticEventStreamLifecycleFixtureInput {
  readonly fixtureName: SyntheticEventStreamLifecycleStreamName;
}

export interface SyntheticEventStreamLifecycleValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface SyntheticEventStreamLifecycleValidationResult {
  readonly valid: boolean;
  readonly issues: readonly SyntheticEventStreamLifecycleValidationIssue[];
}

export interface SyntheticEventStreamLifecycleSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
