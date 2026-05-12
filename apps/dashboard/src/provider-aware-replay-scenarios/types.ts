import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { SyntheticEventStreamReplayHarnessScenarioName } from '../synthetic-event-stream-replay-harness/types.js';
import type {
  SyntheticEventStreamLifecycleEventKind,
  SyntheticEventStreamLifecycleStreamName,
} from '../synthetic-event-stream-lifecycle/types.js';

export const PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE = 68 as const;
export const PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT = '2026-05-12T00:00:00.000Z' as const;
export const PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SOURCE =
  'phase68_provider_aware_replay_and_scenario_generation_v1' as const;
export const PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_VERSION = '1.0.0' as const;
export const PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SCHEMA_VERSION = '1.0.0' as const;

export const PROVIDER_AWARE_REPLAY_SCENARIO_NAMES = [
  'high-confidence-provider-agreement-scenario',
  'stale-provider-replay-scenario',
  'missing-field-partial-scenario',
  'conflicting-values-fail-closed-scenario',
  'unhealthy-provider-rejected-scenario',
  'fallback-reconciled-provider-scenario',
  'all-conflict-regeneration-blocked-scenario',
  'unsafe-provider-capability-blocked-scenario',
] as const;

export const PROVIDER_AWARE_REPLAY_SCENARIO_KINDS = [
  'high_confidence_provider_agreement_scenario',
  'stale_provider_replay_scenario',
  'missing_field_partial_scenario',
  'conflicting_values_fail_closed_scenario',
  'unhealthy_provider_rejected_scenario',
  'fallback_reconciled_provider_scenario',
  'all_conflict_regeneration_blocked_scenario',
  'unsafe_provider_capability_blocked_scenario',
] as const;

export const PROVIDER_AWARE_REPLAY_IMPORT_STATUSES = ['ready', 'rejected'] as const;
export const PROVIDER_AWARE_REPLAY_PARITY_STATUSES = ['passed', 'failed', 'rejected'] as const;
export const PROVIDER_AWARE_REPLAY_REGENERATION_MODES = ['deterministic_preview_only'] as const;

export type ProviderAwareReplayScenarioName = (typeof PROVIDER_AWARE_REPLAY_SCENARIO_NAMES)[number];
export type ProviderAwareReplayScenarioKind = (typeof PROVIDER_AWARE_REPLAY_SCENARIO_KINDS)[number];
export type ProviderAwareReplayImportStatus = (typeof PROVIDER_AWARE_REPLAY_IMPORT_STATUSES)[number];
export type ProviderAwareReplayParityStatus = (typeof PROVIDER_AWARE_REPLAY_PARITY_STATUSES)[number];
export type ProviderAwareReplayRegenerationMode = (typeof PROVIDER_AWARE_REPLAY_REGENERATION_MODES)[number];

export interface ProviderAwareReplayImportModel {
  readonly importId: string;
  readonly importName: string;
  readonly sourceQualityFixtureName: CrossProviderDataQualityName;
  readonly sourceReconciliationIds: readonly string[];
  readonly sourceProviderIds: readonly string[];
  readonly replayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly lifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly importedAt: typeof PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT;
  readonly importStatus: ProviderAwareReplayImportStatus;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

export interface ProviderReplayProvenanceMapping {
  readonly provenanceMappingId: string;
  readonly sourceProviderId: string;
  readonly sourceFieldPath: string;
  readonly targetScenarioFieldPath: string;
  readonly sourceFixtureName: CrossProviderDataQualityName;
  readonly sourcePhase: 67;
  readonly confidenceLabel: string;
  readonly deterministicOnly: true;
}

export interface ProviderAwareReplayGeneratedScenario {
  readonly scenarioId: string;
  readonly scenarioName: ProviderAwareReplayScenarioName;
  readonly scenarioKind: ProviderAwareReplayScenarioKind;
  readonly sourceQualityFixtureName: CrossProviderDataQualityName;
  readonly sourceConfidenceLabel: string;
  readonly sourceIssueIds: readonly string[];
  readonly sourceMismatchReportIds: readonly string[];
  readonly providerProvenanceRefs: readonly string[];
  readonly generatedLifecyclePreviewIds: readonly string[];
  readonly expectedReplaySnapshotIds: readonly string[];
  readonly replayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly lifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly safetyNotes: readonly string[];
}

export interface ProviderReplayParityMismatch {
  readonly mismatchId: string;
  readonly mismatchKind:
    | 'missing_expected_snapshot'
    | 'snapshot_checksum_mismatch'
    | 'state_summary_mismatch'
    | 'critical_reconciliation_conflict'
    | 'unsafe_provider_capability_detected';
  readonly severity: 'low' | 'moderate' | 'high' | 'critical';
  readonly message: string;
}

export interface ProviderReplayParityCheck {
  readonly parityCheckId: string;
  readonly scenarioId: string;
  readonly replayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly expectedSnapshotIds: readonly string[];
  readonly observedSnapshotIds: readonly string[];
  readonly parityStatus: ProviderAwareReplayParityStatus;
  readonly mismatchIds: readonly string[];
  readonly mismatches: readonly ProviderReplayParityMismatch[];
  readonly failClosed: boolean;
  readonly summary: string;
}

export interface ProviderFixtureRegenerationContract {
  readonly regenerationContractId: string;
  readonly sourceQualityFixtureName: CrossProviderDataQualityName;
  readonly targetScenarioName: ProviderAwareReplayScenarioName;
  readonly regenerationMode: ProviderAwareReplayRegenerationMode;
  readonly filesystemWrites: false;
  readonly downloads: false;
  readonly deterministicPreviewOnly: true;
  readonly generatedArtifactPreviewId: string;
}

export interface GeneratedLifecyclePreview {
  readonly lifecyclePreviewId: string;
  readonly sourceScenarioId: string;
  readonly eventPreviewIds: readonly string[];
  readonly eventKinds: readonly SyntheticEventStreamLifecycleEventKind[];
  readonly causalLinks: readonly { readonly eventPreviewId: string; readonly parentEventPreviewIds: readonly string[] }[];
  readonly deterministicSequence: readonly number[];
}

export interface ReplayExpectationModel {
  readonly expectationId: string;
  readonly sourceScenarioId: string;
  readonly expectedStepCount: number;
  readonly expectedFinalStateKind: string;
  readonly expectedMismatchCount: number;
  readonly expectedFailClosed: boolean;
  readonly sourceRefs: readonly string[];
}

export interface ProviderObservationReplayReport {
  readonly reportId: string;
  readonly importSummary: string;
  readonly scenarioSummary: string;
  readonly provenanceSummary: string;
  readonly paritySummary: string;
  readonly regenerationSummary: string;
  readonly safetySummary: string;
}

export interface ProviderAwareReplayScenarioViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ProviderAwareReplayScenarioName;
  readonly sourceQualityFixtureName: CrossProviderDataQualityName;
  readonly parityStatus: ProviderAwareReplayParityStatus;
  readonly failClosed: boolean;
  readonly mismatchCount: number;
  readonly summary: string;
}

export interface ProviderAwareReplayScenarioApiContract {
  readonly list: {
    readonly contractId: string;
    readonly contractKind: 'list';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: { readonly fixtureIds: readonly string[]; readonly totalCount: number };
  };
  readonly detail: {
    readonly contractId: string;
    readonly contractKind: 'detail';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: ProviderAwareReplayScenarioViewModel;
  };
  readonly summary: {
    readonly contractId: string;
    readonly contractKind: 'summary';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: {
      readonly fixtureId: string;
      readonly parityStatus: ProviderAwareReplayParityStatus;
      readonly mismatchCount: number;
      readonly failClosed: boolean;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'PROVIDER_AWARE_REPLAY_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'PROVIDER_AWARE_REPLAY_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface ProviderAwareReplayScenarioSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: ProviderAwareReplayScenarioName;
  readonly fixtureKind?: ProviderAwareReplayScenarioKind;
  readonly sourceQualityFixtureName?: CrossProviderDataQualityName;
}

export interface ProviderAwareReplayScenarioSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ProviderAwareReplayScenarioKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface ProviderAwareReplayScenarioCapabilities {
  readonly providerAwareReplayScenarios: true;
  readonly deterministicProviderAwareScenarioGeneration: true;
  readonly fixtureDerivedProviderAwareScenarios: true;
  readonly localOnlyProviderAwareReplay: true;
  readonly readOnlyProviderAwareReplay: true;
  readonly providerQualityImportModels: true;
  readonly providerProvenanceReplayMapping: true;
  readonly replayParityChecks: true;
  readonly fixtureRegenerationContracts: true;
  readonly providerObservationReplayReports: true;
  readonly generatedLifecyclePreviews: true;
  readonly replayExpectationModels: true;
  readonly providerAwareReplayViewModels: true;
  readonly providerAwareReplayApiContracts: true;
  readonly providerAwareReplaySelectors: true;
  readonly providerAwareReplayLiveData: false;
  readonly providerAwareReplayNetworkAccess: false;
  readonly providerAwareReplayRuntimeIngestion: false;
  readonly providerAwareReplayFilesystemWrites: false;
  readonly providerAwareReplayDownloads: false;
  readonly providerAwareReplayPersistence: false;
  readonly providerAwareReplayWalletLogic: false;
  readonly providerAwareReplayPrivateKeyHandling: false;
  readonly providerAwareReplaySigning: false;
  readonly providerAwareReplayTransactionSending: false;
  readonly providerAwareReplayExecution: false;
  readonly providerAwareReplayTradingSignals: false;
  readonly providerAwareReplayRecommendations: false;
  readonly providerAwareReplayInvestmentAdvice: false;
  readonly providerAwareReplayRouteHandlers: false;
  readonly providerAwareReplayRuntimeRequests: false;
  readonly providerAwareReplayUiRendering: false;
  readonly providerAwareReplayDomAccess: false;
  readonly providerAwareReplayBackgroundJobs: false;
  readonly providerAwareReplayScheduledJobs: false;
  readonly providerAwareReplayRealOrders: false;
  readonly providerAwareReplayRealFunds: false;
  readonly providerAwareReplayRealPnL: false;
  readonly providerAwareReplayLiveStrategySelection: false;
  readonly providerAwareReplayAutoExecution: false;
}

export interface ProviderAwareReplayScenarioFixture {
  readonly fixtureId: string;
  readonly fixtureName: ProviderAwareReplayScenarioName;
  readonly fixtureKind: ProviderAwareReplayScenarioKind;
  readonly phase: typeof PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE;
  readonly schemaVersion: typeof PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SCHEMA_VERSION;
  readonly importModel: ProviderAwareReplayImportModel;
  readonly generatedScenario: ProviderAwareReplayGeneratedScenario;
  readonly provenanceMappings: readonly ProviderReplayProvenanceMapping[];
  readonly parityCheck: ProviderReplayParityCheck;
  readonly regenerationContract: ProviderFixtureRegenerationContract;
  readonly lifecyclePreview: GeneratedLifecyclePreview;
  readonly replayExpectation: ReplayExpectationModel;
  readonly observationReport: ProviderObservationReplayReport;
  readonly viewModel: ProviderAwareReplayScenarioViewModel;
  readonly apiContract: ProviderAwareReplayScenarioApiContract;
  readonly selectorExamples: readonly ProviderAwareReplayScenarioSelectorResult[];
  readonly capabilityFlags: ProviderAwareReplayScenarioCapabilities;
  readonly sourcePhase67FixtureSnapshot: readonly CrossProviderDataQualityName[];
  readonly sourcePhase57ReplayFixtureSnapshot: readonly SyntheticEventStreamReplayHarnessScenarioName[];
  readonly sourcePhase56LifecycleFixtureSnapshot: readonly SyntheticEventStreamLifecycleStreamName[];
  readonly meta: {
    readonly generatedAt: typeof PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT;
    readonly source: typeof PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SOURCE;
    readonly version: typeof PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_VERSION;
    readonly phase: typeof PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveData: true;
    readonly noNetworkAccessByDefault: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export interface BuildProviderAwareReplayScenarioFixtureInput {
  readonly fixtureName: ProviderAwareReplayScenarioName;
}

export interface ProviderAwareReplayScenarioValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ProviderAwareReplayScenarioValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ProviderAwareReplayScenarioValidationIssue[];
}

export interface ProviderAwareReplayScenarioSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
