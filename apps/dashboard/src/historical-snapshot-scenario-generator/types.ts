import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotIngestionContractName } from '../historical-snapshot-ingestion-contracts/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';

export const HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE = 72 as const;
export const PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SOURCE =
  'phase72_deterministic_historical_snapshot_scenario_generator_v1' as const;
export const PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_VERSION = '1.0.0' as const;
export const PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SCHEMA_VERSION = '1.0.0' as const;

export const HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES = [
  'healthy-snapshot-generates-clean-scenario',
  'stale-snapshot-generates-warning-scenario',
  'schema-drift-snapshot-generation-blocked',
  'missing-critical-field-generation-rejected',
  'partial-snapshot-generates-quarantined-scenario',
  'replay-linked-snapshot-generates-replay-scenario',
  'reliability-drift-snapshot-generates-drift-scenario',
  'cross-provider-conflict-generates-conflict-scenario',
] as const;

export const HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS = [
  'healthy_snapshot_generates_clean_scenario',
  'stale_snapshot_generates_warning_scenario',
  'schema_drift_snapshot_generation_blocked',
  'missing_critical_field_generation_rejected',
  'partial_snapshot_generates_quarantined_scenario',
  'replay_linked_snapshot_generates_replay_scenario',
  'reliability_drift_snapshot_generates_drift_scenario',
  'cross_provider_conflict_generates_conflict_scenario',
] as const;

export const HISTORICAL_SNAPSHOT_GENERATION_PLAN_KINDS = [
  'clean_generation_plan',
  'warning_generation_plan',
  'blocked_generation_plan',
  'quarantine_generation_plan',
  'replay_generation_plan',
  'drift_generation_plan',
  'conflict_generation_plan',
] as const;

export const HISTORICAL_SNAPSHOT_GENERATOR_MODES = ['deterministic_fixture_only', 'deterministic_fail_closed'] as const;
export const HISTORICAL_SNAPSHOT_SCENARIO_KINDS = [
  'clean_scenario',
  'warning_scenario',
  'blocked_scenario',
  'quarantined_scenario',
  'replay_scenario',
  'drift_scenario',
  'conflict_scenario',
] as const;
export const HISTORICAL_SNAPSHOT_REPLAY_KINDS = ['baseline_replay', 'warning_replay', 'blocked_replay', 'drift_replay'] as const;

export type HistoricalSnapshotScenarioGeneratorName = (typeof HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES)[number];
export type HistoricalSnapshotScenarioGeneratorKind = (typeof HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS)[number];
export type HistoricalSnapshotGenerationPlanKind = (typeof HISTORICAL_SNAPSHOT_GENERATION_PLAN_KINDS)[number];
export type HistoricalSnapshotGeneratorMode = (typeof HISTORICAL_SNAPSHOT_GENERATOR_MODES)[number];
export type HistoricalSnapshotScenarioKind = (typeof HISTORICAL_SNAPSHOT_SCENARIO_KINDS)[number];
export type HistoricalSnapshotReplayKind = (typeof HISTORICAL_SNAPSHOT_REPLAY_KINDS)[number];

export interface SnapshotScenarioGenerationPlan {
  readonly generationPlanId: string;
  readonly generationPlanName: string;
  readonly generationPlanKind: HistoricalSnapshotGenerationPlanKind;
  readonly phase: typeof HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE;
  readonly sourceSnapshotFixtureName: HistoricalSnapshotIngestionContractName;
  readonly generatorMode: HistoricalSnapshotGeneratorMode;
  readonly deterministicSeedLabel: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly requiresNetwork: false;
  readonly requiresFilesystem: false;
  readonly failClosed: boolean;
}

export interface SnapshotSourceSelection {
  readonly sourceSelectionId: string;
  readonly selectedSnapshotIds: readonly string[];
  readonly selectedProviderIds: readonly string[];
  readonly selectedReliabilityRefs: readonly ProviderReliabilityDriftAuditName[];
  readonly selectionReasonCode: string;
  readonly selectionWarnings: readonly string[];
}

export interface GeneratedSnapshotScenarioDescriptor {
  readonly scenarioId: string;
  readonly scenarioName: string;
  readonly scenarioKind: HistoricalSnapshotScenarioKind;
  readonly sourceSnapshotId: string;
  readonly generatedFromSnapshot: true;
  readonly deterministic: true;
  readonly replayReady: boolean;
  readonly advisory: false;
}

export interface SnapshotReplayDescriptor {
  readonly replayDescriptorId: string;
  readonly replayKind: HistoricalSnapshotReplayKind;
  readonly expectedStepCount: number;
  readonly expectedSnapshotCount: number;
  readonly expectedFinalStateKind: string;
  readonly replayImportMode: 'deterministic_fixture_only';
  readonly liveReplayImport: false;
}

export interface SnapshotScenarioLineage {
  readonly lineageId: string;
  readonly sourceSnapshotRefs: readonly string[];
  readonly sourceManifestRefs: readonly string[];
  readonly sourceReliabilityRefs: readonly string[];
  readonly sourceReplayRefs: readonly string[];
  readonly generatedScenarioRefs: readonly string[];
  readonly lineageSummary: string;
}

export interface SnapshotScenarioIntegrityContract {
  readonly integrityId: string;
  readonly checksum: string;
  readonly checksumAlgorithm: 'fnv1a32';
  readonly sourceHash: string;
  readonly generatedScenarioHash: string;
  readonly deterministic: true;
}

export interface SnapshotScenarioValidationContract {
  readonly validationId: string;
  readonly rules: readonly string[];
  readonly rejectionReasons: readonly string[];
  readonly criticalFailureReasons: readonly string[];
  readonly warningReasons: readonly string[];
  readonly failClosed: boolean;
}

export interface SnapshotScenarioRejectionContract {
  readonly rejectionId: string;
  readonly rejectionKind: 'schema_drift' | 'missing_critical_field' | 'partial_snapshot' | 'cross_provider_conflict' | 'unsafe_state';
  readonly severity: 'warning' | 'error' | 'critical';
  readonly reasonCode: string;
  readonly failClosed: boolean;
  readonly safetyNotes: readonly string[];
}

export interface SnapshotScenarioQualityLinkage {
  readonly qualityLinkageId: string;
  readonly sourceQualityFixtureRef: CrossProviderDataQualityName;
  readonly qualityStatus: 'clean' | 'warning' | 'blocked';
  readonly qualityReasonCodes: readonly string[];
}

export interface SnapshotScenarioReliabilityLinkage {
  readonly reliabilityLinkageId: string;
  readonly sourceReliabilityFixtureRef: ProviderReliabilityDriftAuditName;
  readonly reliabilityStatus: 'stable' | 'degraded' | 'drifted';
  readonly driftSeverity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface SnapshotScenarioRiskLinkage {
  readonly riskLinkageId: string;
  readonly riskStatus: 'low' | 'moderate' | 'high' | 'critical';
  readonly riskReasonCodes: readonly string[];
  readonly failClosed: boolean;
}

export interface SnapshotScenarioGenerationAuditReport {
  readonly reportId: string;
  readonly planSummary: string;
  readonly sourceSelectionSummary: string;
  readonly scenarioSummary: string;
  readonly replaySummary: string;
  readonly lineageSummary: string;
  readonly integritySummary: string;
  readonly validationSummary: string;
  readonly safetySummary: string;
}

export interface HistoricalSnapshotScenarioGeneratorViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: HistoricalSnapshotScenarioGeneratorName;
  readonly scenarioId: string;
  readonly scenarioKind: HistoricalSnapshotScenarioKind;
  readonly replayReady: boolean;
  readonly blocked: boolean;
  readonly quarantined: boolean;
  readonly summary: string;
}

export interface HistoricalSnapshotScenarioGeneratorApiContract {
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
    readonly data: HistoricalSnapshotScenarioGeneratorViewModel;
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
      readonly scenarioId: string;
      readonly blocked: boolean;
      readonly quarantined: boolean;
      readonly replayReady: boolean;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface HistoricalSnapshotScenarioGeneratorSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: HistoricalSnapshotScenarioGeneratorName;
  readonly fixtureKind?: HistoricalSnapshotScenarioGeneratorKind;
  readonly scenarioId?: string;
  readonly sourceSnapshotFixtureName?: HistoricalSnapshotIngestionContractName;
}

export interface HistoricalSnapshotScenarioGeneratorSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: HistoricalSnapshotScenarioGeneratorKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface HistoricalSnapshotScenarioGeneratorCapabilities {
  readonly historicalSnapshotScenarioGenerator: true;
  readonly deterministicSnapshotScenarioGeneration: true;
  readonly fixtureDerivedScenarioGeneration: true;
  readonly snapshotSourceSelectionModels: true;
  readonly snapshotGeneratedScenarioDescriptors: true;
  readonly snapshotReplayDescriptors: true;
  readonly snapshotScenarioLineageModels: true;
  readonly snapshotScenarioIntegrityContracts: true;
  readonly snapshotScenarioValidationContracts: true;
  readonly snapshotScenarioRejectionContracts: true;
  readonly snapshotScenarioQualityLinkage: true;
  readonly snapshotScenarioReliabilityLinkage: true;
  readonly snapshotScenarioAuditReports: true;
  readonly snapshotScenarioViewModels: true;
  readonly snapshotScenarioApiContracts: true;
  readonly snapshotScenarioSelectors: true;
  readonly snapshotScenarioLiveGeneration: false;
  readonly snapshotScenarioRuntimeGeneration: false;
  readonly snapshotScenarioLiveIngestion: false;
  readonly snapshotScenarioRuntimeIngestion: false;
  readonly snapshotScenarioLiveReplayImport: false;
  readonly snapshotScenarioLiveNetworkAccess: false;
  readonly snapshotScenarioRuntimeCollectors: false;
  readonly snapshotScenarioSecretsRequired: false;
  readonly snapshotScenarioApiKeyRequired: false;
  readonly snapshotScenarioWriteMethods: false;
  readonly snapshotScenarioWalletLogic: false;
  readonly snapshotScenarioPrivateKeyHandling: false;
  readonly snapshotScenarioSigning: false;
  readonly snapshotScenarioTransactionSending: false;
  readonly snapshotScenarioExecution: false;
  readonly snapshotScenarioTradingSignals: false;
  readonly snapshotScenarioRecommendations: false;
  readonly snapshotScenarioInvestmentAdvice: false;
  readonly snapshotScenarioRouteHandlers: false;
  readonly snapshotScenarioRuntimeRequests: false;
  readonly snapshotScenarioUiRendering: false;
  readonly snapshotScenarioDomAccess: false;
  readonly snapshotScenarioPersistence: false;
  readonly snapshotScenarioFilesystemWrites: false;
  readonly snapshotScenarioBackgroundJobs: false;
  readonly snapshotScenarioScheduledJobs: false;
  readonly snapshotScenarioRealOrders: false;
  readonly snapshotScenarioRealFunds: false;
  readonly snapshotScenarioRealPnL: false;
  readonly snapshotScenarioProviderExpansion: false;
}

export interface HistoricalSnapshotScenarioGeneratorFixture {
  readonly fixtureId: string;
  readonly fixtureName: HistoricalSnapshotScenarioGeneratorName;
  readonly fixtureKind: HistoricalSnapshotScenarioGeneratorKind;
  readonly phase: typeof HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE;
  readonly schemaVersion: typeof PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SCHEMA_VERSION;
  readonly generationPlan: SnapshotScenarioGenerationPlan;
  readonly sourceSelection: SnapshotSourceSelection;
  readonly scenarioDescriptor: GeneratedSnapshotScenarioDescriptor;
  readonly replayDescriptor: SnapshotReplayDescriptor;
  readonly lineageModel: SnapshotScenarioLineage;
  readonly generationRules: readonly string[];
  readonly integrityContract: SnapshotScenarioIntegrityContract;
  readonly validationContract: SnapshotScenarioValidationContract;
  readonly rejectionContract: SnapshotScenarioRejectionContract;
  readonly qualityLinkage: SnapshotScenarioQualityLinkage;
  readonly reliabilityLinkage: SnapshotScenarioReliabilityLinkage;
  readonly riskLinkage: SnapshotScenarioRiskLinkage;
  readonly auditReport: SnapshotScenarioGenerationAuditReport;
  readonly viewModel: HistoricalSnapshotScenarioGeneratorViewModel;
  readonly apiContract: HistoricalSnapshotScenarioGeneratorApiContract;
  readonly selectorExamples: readonly HistoricalSnapshotScenarioGeneratorSelectorResult[];
  readonly capabilityFlags: HistoricalSnapshotScenarioGeneratorCapabilities;
  readonly sourcePhase65FixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourcePhase66FixtureSnapshot: readonly MultiProviderReadOnlyFoundationName[];
  readonly sourcePhase67FixtureSnapshot: readonly CrossProviderDataQualityName[];
  readonly sourcePhase68FixtureSnapshot: readonly ProviderAwareReplayScenarioName[];
  readonly sourcePhase70FixtureSnapshot: readonly ProviderReliabilityDriftAuditName[];
  readonly sourcePhase71FixtureSnapshot: readonly HistoricalSnapshotIngestionContractName[];
  readonly sourceRefs: {
    readonly phase65FixtureId: string;
    readonly phase66FixtureId: string;
    readonly phase67FixtureId: string;
    readonly phase68FixtureId: string;
    readonly phase70FixtureId: string;
    readonly phase71FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT;
    readonly source: typeof PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SOURCE;
    readonly version: typeof PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_VERSION;
    readonly phase: typeof HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE;
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

export interface BuildHistoricalSnapshotScenarioGeneratorFixtureInput {
  readonly fixtureName: HistoricalSnapshotScenarioGeneratorName;
}

export interface HistoricalSnapshotScenarioGeneratorValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface HistoricalSnapshotScenarioGeneratorValidationResult {
  readonly valid: boolean;
  readonly issues: readonly HistoricalSnapshotScenarioGeneratorValidationIssue[];
}

export interface HistoricalSnapshotScenarioGeneratorSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
