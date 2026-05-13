import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotIngestionContractName } from '../historical-snapshot-ingestion-contracts/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';

export const PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE = 73 as const;
export const PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SOURCE =
  'phase73_optional_provider_aware_replay_import_contracts_v1' as const;
export const PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_VERSION = '1.0.0' as const;
export const PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION = '1.0.0' as const;

export const PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES = [
  'clean-scenario-import-contract',
  'stale-snapshot-import-warning',
  'schema-drift-import-blocked',
  'missing-critical-field-import-rejected',
  'quarantined-scenario-import-blocked',
  'replay-linked-import-ready-fixture-only',
  'reliability-drift-import-warning',
  'cross-provider-conflict-import-rejected',
] as const;

export const PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS = [
  'clean_scenario_import_contract',
  'stale_snapshot_import_warning',
  'schema_drift_import_blocked',
  'missing_critical_field_import_rejected',
  'quarantined_scenario_import_blocked',
  'replay_linked_import_ready_fixture_only',
  'reliability_drift_import_warning',
  'cross_provider_conflict_import_rejected',
] as const;

export type ProviderAwareReplayImportContractName = (typeof PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES)[number];
export type ProviderAwareReplayImportContractKind = (typeof PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS)[number];

export interface ReplayImportCandidate {
  readonly candidateId: string;
  readonly candidateName: string;
  readonly candidateKind: ProviderAwareReplayImportContractKind;
  readonly phase: typeof PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE;
  readonly sourceScenarioFixtureName: ProviderAwareReplayScenarioName;
  readonly sourceSnapshotFixtureName: HistoricalSnapshotIngestionContractName;
  readonly fixtureOnly: true;
  readonly liveImport: false;
  readonly runtimeImport: false;
  readonly failClosed: boolean;
}

export interface ReplayImportManifest {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestKind: 'replay_import_manifest';
  readonly schemaVersion: typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION;
  readonly generatedAt: typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT;
  readonly sourceCandidateIds: readonly string[];
  readonly checksum: string;
  readonly deterministic: true;
}

export interface ReplayImportSourceMetadata {
  readonly sourceMetadataId: string;
  readonly sourcePhaseRefs: readonly (65 | 66 | 67 | 68 | 70 | 71 | 72)[];
  readonly sourceFixtureRefs: readonly string[];
  readonly sourceProviderIds: readonly string[];
  readonly sourceScenarioRefs: readonly ProviderAwareReplayScenarioName[];
  readonly sourceSnapshotRefs: readonly HistoricalSnapshotIngestionContractName[];
  readonly sourceReliabilityRefs: readonly ProviderReliabilityDriftAuditName[];
}

export interface ReplayImportCompatibilityContract {
  readonly compatibilityId: string;
  readonly replaySchemaCompatible: boolean;
  readonly scenarioCompatible: boolean;
  readonly snapshotCompatible: boolean;
  readonly qualityCompatible: boolean;
  readonly reliabilityCompatible: boolean;
  readonly compatibilityStatus: 'compatible' | 'warning' | 'blocked' | 'rejected';
  readonly incompatibilityReasonCodes: readonly string[];
  readonly failClosed: boolean;
}

export interface ReplayImportGatePolicy {
  readonly gatePolicyId: string;
  readonly gateState: 'disabled' | 'warning' | 'blocked';
  readonly disabledByDefault: true;
  readonly requiresManualEnable: true;
  readonly allowsLiveImport: false;
  readonly allowsFilesystemImport: false;
  readonly allowsRuntimeIngestion: false;
  readonly failClosed: boolean;
}

export interface ReplayImportPlan {
  readonly importPlanId: string;
  readonly planMode: 'fixture_contract_only';
  readonly candidateIds: readonly string[];
  readonly disabledRuntimeImport: true;
  readonly disabledFilesystemImport: true;
  readonly requiresNetwork: false;
  readonly requiresFilesystem: false;
  readonly requiresSecrets: false;
  readonly expectedOutcome: string;
}

export interface ReplayImportRejectionContract {
  readonly rejectionId: string;
  readonly rejectionKind: 'none' | 'schema_drift' | 'missing_critical_field' | 'quarantined' | 'cross_provider_conflict' | 'reliability_drift';
  readonly severity: 'warning' | 'error' | 'critical';
  readonly reasonCode: string;
  readonly failClosed: boolean;
  readonly safetyNotes: readonly string[];
}

export interface ReplayImportNormalizationContract {
  readonly normalizationContractId: string;
  readonly normalizationMode: 'canonical_json' | 'field_sorted';
  readonly stableOrdering: true;
  readonly deterministicChecksum: true;
  readonly localeIndependent: true;
  readonly mutationFree: true;
}

export interface ReplayImportValidationContract {
  readonly validationId: string;
  readonly rules: readonly string[];
  readonly rejectionReasons: readonly string[];
  readonly criticalFailureReasons: readonly string[];
  readonly warningReasons: readonly string[];
  readonly failClosed: true;
}

export interface ReplayImportIntegrityContract {
  readonly integrityId: string;
  readonly checksum: string;
  readonly checksumAlgorithm: 'fnv1a32';
  readonly manifestHash: string;
  readonly sourceHash: string;
  readonly deterministic: true;
}

export interface ReplayImportProvenanceContract {
  readonly provenanceId: string;
  readonly sourceScenarioRefs: readonly ProviderAwareReplayScenarioName[];
  readonly sourceSnapshotRefs: readonly HistoricalSnapshotIngestionContractName[];
  readonly sourceReliabilityRefs: readonly ProviderReliabilityDriftAuditName[];
  readonly sourceQualityRefs: readonly CrossProviderDataQualityName[];
  readonly lineageSummary: string;
}

export interface ReplayImportScenarioLinkage {
  readonly scenarioLinkageId: string;
  readonly scenarioFixtureRef: ProviderAwareReplayScenarioName;
  readonly scenarioStatus: 'aligned' | 'warning' | 'blocked';
  readonly failClosed: boolean;
}

export interface ReplayImportSnapshotLinkage {
  readonly snapshotLinkageId: string;
  readonly snapshotFixtureRef: HistoricalSnapshotIngestionContractName;
  readonly snapshotStatus: 'aligned' | 'warning' | 'blocked';
  readonly failClosed: boolean;
}

export interface ReplayImportReliabilityLinkage {
  readonly reliabilityLinkageId: string;
  readonly sourceReliabilityFixtureRef: ProviderReliabilityDriftAuditName;
  readonly reliabilityStatus: 'stable' | 'degraded' | 'drifted';
  readonly driftSeverity: 'low' | 'moderate' | 'high' | 'critical';
  readonly failClosed: boolean;
}

export interface ReplayImportQualityLinkage {
  readonly qualityLinkageId: string;
  readonly sourceQualityFixtureRef: CrossProviderDataQualityName;
  readonly qualityStatus: 'clean' | 'warning' | 'blocked';
  readonly reasonCodes: readonly string[];
  readonly failClosed: boolean;
}

export interface ReplayImportAuditReport {
  readonly reportId: string;
  readonly candidateSummary: string;
  readonly manifestSummary: string;
  readonly compatibilitySummary: string;
  readonly gatePolicySummary: string;
  readonly importPlanSummary: string;
  readonly provenanceSummary: string;
  readonly integritySummary: string;
  readonly safetySummary: string;
}

export interface ProviderAwareReplayImportContractViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ProviderAwareReplayImportContractName;
  readonly candidateId: string;
  readonly compatibilityStatus: ReplayImportCompatibilityContract['compatibilityStatus'];
  readonly blocked: boolean;
  readonly warning: boolean;
  readonly summary: string;
}

export interface ProviderAwareReplayImportContractApiContract {
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
    readonly data: ProviderAwareReplayImportContractViewModel;
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
      readonly candidateId: string;
      readonly blocked: boolean;
      readonly warning: boolean;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface ProviderAwareReplayImportContractSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: ProviderAwareReplayImportContractName;
  readonly fixtureKind?: ProviderAwareReplayImportContractKind;
  readonly candidateId?: string;
}

export interface ProviderAwareReplayImportContractSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ProviderAwareReplayImportContractKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface ProviderAwareReplayImportContractCapabilities {
  readonly providerAwareReplayImportContracts: true;
  readonly deterministicReplayImportContracts: true;
  readonly fixtureDerivedReplayImportCandidates: true;
  readonly replayImportManifests: true;
  readonly replayImportSourceMetadata: true;
  readonly replayImportCompatibilityContracts: true;
  readonly replayImportGatePolicies: true;
  readonly replayImportPlanContracts: true;
  readonly replayImportRejectionContracts: true;
  readonly replayImportNormalizationContracts: true;
  readonly replayImportValidationContracts: true;
  readonly replayImportIntegrityContracts: true;
  readonly replayImportProvenanceContracts: true;
  readonly replayImportScenarioLinkage: true;
  readonly replayImportSnapshotLinkage: true;
  readonly replayImportReliabilityLinkage: true;
  readonly replayImportQualityLinkage: true;
  readonly replayImportAuditReports: true;
  readonly replayImportViewModels: true;
  readonly replayImportApiContracts: true;
  readonly replayImportSelectors: true;
  readonly replayImportLiveImport: false;
  readonly replayImportRuntimeImport: false;
  readonly replayImportLiveIngestion: false;
  readonly replayImportRuntimeIngestion: false;
  readonly replayImportFilesystemImport: false;
  readonly replayImportLiveNetworkAccess: false;
  readonly replayImportRuntimeCollectors: false;
  readonly replayImportSecretsRequired: false;
  readonly replayImportApiKeyRequired: false;
  readonly replayImportWriteMethods: false;
  readonly replayImportWalletLogic: false;
  readonly replayImportPrivateKeyHandling: false;
  readonly replayImportSigning: false;
  readonly replayImportTransactionSending: false;
  readonly replayImportExecution: false;
  readonly replayImportTradingSignals: false;
  readonly replayImportRecommendations: false;
  readonly replayImportInvestmentAdvice: false;
  readonly replayImportRouteHandlers: false;
  readonly replayImportRuntimeRequests: false;
  readonly replayImportUiRendering: false;
  readonly replayImportDomAccess: false;
  readonly replayImportPersistence: false;
  readonly replayImportFilesystemWrites: false;
  readonly replayImportBackgroundJobs: false;
  readonly replayImportScheduledJobs: false;
  readonly replayImportRealOrders: false;
  readonly replayImportRealFunds: false;
  readonly replayImportRealPnL: false;
  readonly replayImportProviderExpansion: false;
}

export interface ProviderAwareReplayImportContractFixture {
  readonly fixtureId: string;
  readonly fixtureName: ProviderAwareReplayImportContractName;
  readonly fixtureKind: ProviderAwareReplayImportContractKind;
  readonly phase: typeof PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE;
  readonly schemaVersion: typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION;
  readonly importCandidate: ReplayImportCandidate;
  readonly manifest: ReplayImportManifest;
  readonly sourceMetadata: ReplayImportSourceMetadata;
  readonly compatibilityContract: ReplayImportCompatibilityContract;
  readonly gatePolicy: ReplayImportGatePolicy;
  readonly importPlan: ReplayImportPlan;
  readonly rejectionContract: ReplayImportRejectionContract;
  readonly normalizationContract: ReplayImportNormalizationContract;
  readonly validationContract: ReplayImportValidationContract;
  readonly integrityContract: ReplayImportIntegrityContract;
  readonly provenanceContract: ReplayImportProvenanceContract;
  readonly scenarioLinkage: ReplayImportScenarioLinkage;
  readonly snapshotLinkage: ReplayImportSnapshotLinkage;
  readonly reliabilityLinkage: ReplayImportReliabilityLinkage;
  readonly qualityLinkage: ReplayImportQualityLinkage;
  readonly auditReport: ReplayImportAuditReport;
  readonly viewModel: ProviderAwareReplayImportContractViewModel;
  readonly apiContract: ProviderAwareReplayImportContractApiContract;
  readonly selectorExamples: readonly ProviderAwareReplayImportContractSelectorResult[];
  readonly capabilityFlags: ProviderAwareReplayImportContractCapabilities;
  readonly sourcePhase65FixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourcePhase66FixtureSnapshot: readonly MultiProviderReadOnlyFoundationName[];
  readonly sourcePhase67FixtureSnapshot: readonly CrossProviderDataQualityName[];
  readonly sourcePhase68FixtureSnapshot: readonly ProviderAwareReplayScenarioName[];
  readonly sourcePhase70FixtureSnapshot: readonly ProviderReliabilityDriftAuditName[];
  readonly sourcePhase71FixtureSnapshot: readonly HistoricalSnapshotIngestionContractName[];
  readonly sourcePhase72FixtureSnapshot: readonly HistoricalSnapshotScenarioGeneratorName[];
  readonly sourceRefs: {
    readonly phase65FixtureId: string;
    readonly phase66FixtureId: string;
    readonly phase67FixtureId: string;
    readonly phase68FixtureId: string;
    readonly phase70FixtureId: string;
    readonly phase71FixtureId: string;
    readonly phase72FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT;
    readonly source: typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SOURCE;
    readonly version: typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_VERSION;
    readonly phase: typeof PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveImport: true;
    readonly noRuntimeImport: true;
    readonly noNetworkAccessByDefault: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export interface BuildProviderAwareReplayImportContractFixtureInput {
  readonly fixtureName: ProviderAwareReplayImportContractName;
}

export interface ProviderAwareReplayImportContractValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ProviderAwareReplayImportContractValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ProviderAwareReplayImportContractValidationIssue[];
}

export interface ProviderAwareReplayImportContractSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

// Backward-compatible aliases for local module implementation helpers
export type SnapshotManifest = ReplayImportManifest;
export type SnapshotSourceMetadata = ReplayImportSourceMetadata;
export type SnapshotSchemaContract = ReplayImportCompatibilityContract;
export type SnapshotFreshnessContract = ReplayImportGatePolicy;
export type SnapshotImportPlan = ReplayImportPlan;
export type SnapshotRejectionContract = ReplayImportRejectionContract;
export type SnapshotNormalizationContract = ReplayImportNormalizationContract;
export type SnapshotValidationContract = ReplayImportValidationContract;
export type SnapshotIntegrityContract = ReplayImportIntegrityContract;
export type SnapshotProvenanceContract = ReplayImportProvenanceContract;
export type SnapshotReplayLinkage = ReplayImportScenarioLinkage;
export type SnapshotReliabilityLinkage = ReplayImportReliabilityLinkage;
export type HistoricalSnapshotAuditReport = ReplayImportAuditReport;
