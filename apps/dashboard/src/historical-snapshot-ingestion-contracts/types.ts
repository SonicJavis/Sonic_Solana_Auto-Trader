import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';

export const HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE = 71 as const;
export const PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SOURCE =
  'phase71_read_only_historical_snapshot_ingestion_contracts_v1' as const;
export const PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_VERSION = '1.0.0' as const;
export const PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION = '1.0.0' as const;

export const HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES = [
  'healthy-provider-snapshot-contract',
  'stale-provider-snapshot-warning',
  'schema-drift-snapshot-rejected',
  'missing-critical-field-snapshot-blocked',
  'partial-provider-snapshot-quarantined',
  'replay-linked-historical-snapshot',
  'reliability-linked-drift-snapshot',
  'cross-provider-quality-snapshot-conflict',
] as const;

export const HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS = [
  'healthy_provider_snapshot_contract',
  'stale_provider_snapshot_warning',
  'schema_drift_snapshot_rejected',
  'missing_critical_field_snapshot_blocked',
  'partial_provider_snapshot_quarantined',
  'replay_linked_historical_snapshot',
  'reliability_linked_drift_snapshot',
  'cross_provider_quality_snapshot_conflict',
] as const;

export const HISTORICAL_SNAPSHOT_KINDS = ['full_snapshot', 'incremental_snapshot', 'partial_snapshot', 'conflict_snapshot'] as const;
export const HISTORICAL_SNAPSHOT_SOURCE_KINDS = ['provider_fixture', 'replay_fixture', 'reliability_fixture', 'cross_provider_fixture'] as const;
export const HISTORICAL_SNAPSHOT_COMPATIBILITY_LEVELS = ['strict', 'backward_compatible', 'forward_compatible'] as const;
export const HISTORICAL_SNAPSHOT_NORMALIZATION_MODES = ['canonical_json', 'field_sorted', 'schema_locked'] as const;
export const HISTORICAL_SNAPSHOT_FRESHNESS_BUCKETS = ['fresh', 'aging', 'stale', 'critical_stale'] as const;
export const HISTORICAL_SNAPSHOT_REJECTION_KINDS = [
  'schema_drift',
  'missing_critical_field',
  'partial_snapshot',
  'integrity_failure',
  'unsafe_state',
] as const;
export const HISTORICAL_SNAPSHOT_REJECTION_SEVERITIES = ['warning', 'error', 'critical'] as const;

export type HistoricalSnapshotIngestionContractName = (typeof HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES)[number];
export type HistoricalSnapshotIngestionContractKind = (typeof HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS)[number];
export type HistoricalSnapshotKind = (typeof HISTORICAL_SNAPSHOT_KINDS)[number];
export type HistoricalSnapshotSourceKind = (typeof HISTORICAL_SNAPSHOT_SOURCE_KINDS)[number];
export type HistoricalSnapshotCompatibilityLevel = (typeof HISTORICAL_SNAPSHOT_COMPATIBILITY_LEVELS)[number];
export type HistoricalSnapshotNormalizationMode = (typeof HISTORICAL_SNAPSHOT_NORMALIZATION_MODES)[number];
export type HistoricalSnapshotFreshnessBucket = (typeof HISTORICAL_SNAPSHOT_FRESHNESS_BUCKETS)[number];
export type HistoricalSnapshotRejectionKind = (typeof HISTORICAL_SNAPSHOT_REJECTION_KINDS)[number];
export type HistoricalSnapshotRejectionSeverity = (typeof HISTORICAL_SNAPSHOT_REJECTION_SEVERITIES)[number];

export interface SnapshotManifest {
  readonly snapshotId: string;
  readonly snapshotName: string;
  readonly snapshotKind: HistoricalSnapshotKind;
  readonly phase: typeof HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE;
  readonly schemaVersion: typeof PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION;
  readonly capturedAt: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly sourceProviderId: string;
  readonly sourceReliabilityFixtureName: ProviderReliabilityDriftAuditName;
}

export interface SnapshotSourceMetadata {
  readonly sourceMetadataId: string;
  readonly sourceKind: HistoricalSnapshotSourceKind;
  readonly providerId: string;
  readonly providerName: string;
  readonly reliabilityBand: string;
  readonly freshnessBand: HistoricalSnapshotFreshnessBucket;
  readonly observationWindow: string;
  readonly sourceRefs: readonly string[];
}

export interface SnapshotSchemaContract {
  readonly schemaContractId: string;
  readonly expectedSchemaVersion: string;
  readonly compatibilityLevel: HistoricalSnapshotCompatibilityLevel;
  readonly requiredFields: readonly string[];
  readonly optionalFields: readonly string[];
  readonly criticalFields: readonly string[];
  readonly failClosedOnCriticalDrift: boolean;
}

export interface SnapshotProvenanceContract {
  readonly provenanceId: string;
  readonly sourcePhaseRefs: readonly (65 | 66 | 67 | 68 | 69 | 70)[];
  readonly sourceFixtureRefs: readonly string[];
  readonly providerReliabilityRefs: readonly string[];
  readonly replayScenarioRefs: readonly string[];
  readonly dataQualityRefs: readonly string[];
  readonly lineageSummary: string;
}

export interface SnapshotNormalizationContract {
  readonly normalizationContractId: string;
  readonly normalizationMode: HistoricalSnapshotNormalizationMode;
  readonly stableOrdering: boolean;
  readonly deterministicChecksum: boolean;
  readonly localeIndependent: boolean;
  readonly mutationFree: boolean;
}

export interface SnapshotValidationContract {
  readonly validationContractId: string;
  readonly rules: readonly string[];
  readonly rejectionReasons: readonly string[];
  readonly criticalFailureReasons: readonly string[];
  readonly warningReasons: readonly string[];
  readonly failClosed: boolean;
}

export interface SnapshotFreshnessContract {
  readonly freshnessContractId: string;
  readonly snapshotAgeBucket: HistoricalSnapshotFreshnessBucket;
  readonly stale: boolean;
  readonly staleReasonCode: string;
  readonly freshnessWindow: string;
  readonly sourceTelemetryRefs: readonly string[];
}

export interface SnapshotIntegrityContract {
  readonly integrityContractId: string;
  readonly checksum: string;
  readonly checksumAlgorithm: 'fnv1a32';
  readonly manifestHash: string;
  readonly sourceHash: string;
  readonly deterministic: boolean;
}

export interface SnapshotImportPlan {
  readonly importPlanId: string;
  readonly planMode: 'fixture_contract_only';
  readonly disabledRuntimeImport: true;
  readonly requiresNetwork: false;
  readonly requiresFilesystem: false;
  readonly requiresSecrets: false;
  readonly plannedSteps: readonly string[];
  readonly expectedOutcome: string;
}

export interface SnapshotRejectionContract {
  readonly rejectionId: string;
  readonly rejectionKind: HistoricalSnapshotRejectionKind;
  readonly severity: HistoricalSnapshotRejectionSeverity;
  readonly reasonCode: string;
  readonly failClosed: boolean;
  readonly safetyNotes: readonly string[];
}

export interface SnapshotReplayLinkage {
  readonly replayLinkageId: string;
  readonly replayScenarioRef: ProviderAwareReplayScenarioName;
  readonly parityStatus: 'passed' | 'failed' | 'rejected';
  readonly failClosed: boolean;
  readonly sourceRefs: readonly string[];
}

export interface SnapshotReliabilityLinkage {
  readonly reliabilityLinkageId: string;
  readonly providerReliabilityRef: ProviderReliabilityDriftAuditName;
  readonly driftSeverity: 'low' | 'moderate' | 'high' | 'critical';
  readonly driftCompatible: boolean;
  readonly failClosed: boolean;
  readonly sourceRefs: readonly string[];
}

export interface HistoricalSnapshotAuditReport {
  readonly reportId: string;
  readonly manifestSummary: string;
  readonly schemaSummary: string;
  readonly provenanceSummary: string;
  readonly freshnessSummary: string;
  readonly integritySummary: string;
  readonly validationSummary: string;
  readonly linkageSummary: string;
  readonly safetySummary: string;
}

export interface HistoricalSnapshotIngestionContractViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: HistoricalSnapshotIngestionContractName;
  readonly snapshotId: string;
  readonly stale: boolean;
  readonly rejected: boolean;
  readonly summary: string;
}

export interface HistoricalSnapshotIngestionContractApiContract {
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
    readonly data: HistoricalSnapshotIngestionContractViewModel;
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
      readonly snapshotId: string;
      readonly stale: boolean;
      readonly rejected: boolean;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface HistoricalSnapshotIngestionContractSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: HistoricalSnapshotIngestionContractName;
  readonly fixtureKind?: HistoricalSnapshotIngestionContractKind;
  readonly snapshotId?: string;
  readonly sourceProviderId?: string;
}

export interface HistoricalSnapshotIngestionContractSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: HistoricalSnapshotIngestionContractKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface HistoricalSnapshotIngestionContractCapabilities {
  readonly historicalSnapshotIngestionContracts: true;
  readonly deterministicHistoricalSnapshotFixtures: true;
  readonly fixtureDerivedSnapshotManifests: true;
  readonly readOnlySnapshotSourceMetadata: true;
  readonly snapshotSchemaContracts: true;
  readonly snapshotProvenanceContracts: true;
  readonly snapshotNormalizationContracts: true;
  readonly snapshotValidationContracts: true;
  readonly snapshotFreshnessContracts: true;
  readonly snapshotIntegrityContracts: true;
  readonly snapshotImportPlanContracts: true;
  readonly snapshotRejectionContracts: true;
  readonly snapshotReplayLinkage: true;
  readonly snapshotReliabilityLinkage: true;
  readonly snapshotAuditReports: true;
  readonly snapshotViewModels: true;
  readonly snapshotApiContracts: true;
  readonly snapshotSelectors: true;
  readonly historicalSnapshotLiveIngestion: false;
  readonly historicalSnapshotRuntimeIngestion: false;
  readonly historicalSnapshotLiveNetworkAccess: false;
  readonly historicalSnapshotRuntimeCollectors: false;
  readonly historicalSnapshotSecretsRequired: false;
  readonly historicalSnapshotApiKeyRequired: false;
  readonly historicalSnapshotWriteMethods: false;
  readonly historicalSnapshotWalletLogic: false;
  readonly historicalSnapshotPrivateKeyHandling: false;
  readonly historicalSnapshotSigning: false;
  readonly historicalSnapshotTransactionSending: false;
  readonly historicalSnapshotExecution: false;
  readonly historicalSnapshotTradingSignals: false;
  readonly historicalSnapshotRecommendations: false;
  readonly historicalSnapshotInvestmentAdvice: false;
  readonly historicalSnapshotRouteHandlers: false;
  readonly historicalSnapshotRuntimeRequests: false;
  readonly historicalSnapshotUiRendering: false;
  readonly historicalSnapshotDomAccess: false;
  readonly historicalSnapshotPersistence: false;
  readonly historicalSnapshotFilesystemWrites: false;
  readonly historicalSnapshotBackgroundJobs: false;
  readonly historicalSnapshotScheduledJobs: false;
  readonly historicalSnapshotRealOrders: false;
  readonly historicalSnapshotRealFunds: false;
  readonly historicalSnapshotRealPnL: false;
  readonly historicalSnapshotProviderExpansion: false;
}

export interface HistoricalSnapshotIngestionContractFixture {
  readonly fixtureId: string;
  readonly fixtureName: HistoricalSnapshotIngestionContractName;
  readonly fixtureKind: HistoricalSnapshotIngestionContractKind;
  readonly phase: typeof HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE;
  readonly schemaVersion: typeof PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION;
  readonly manifest: SnapshotManifest;
  readonly sourceMetadata: SnapshotSourceMetadata;
  readonly schemaContract: SnapshotSchemaContract;
  readonly provenanceContract: SnapshotProvenanceContract;
  readonly normalizationContract: SnapshotNormalizationContract;
  readonly validationContract: SnapshotValidationContract;
  readonly freshnessContract: SnapshotFreshnessContract;
  readonly integrityContract: SnapshotIntegrityContract;
  readonly importPlan: SnapshotImportPlan;
  readonly rejectionContract: SnapshotRejectionContract;
  readonly replayLinkage: SnapshotReplayLinkage;
  readonly reliabilityLinkage: SnapshotReliabilityLinkage;
  readonly auditReport: HistoricalSnapshotAuditReport;
  readonly viewModel: HistoricalSnapshotIngestionContractViewModel;
  readonly apiContract: HistoricalSnapshotIngestionContractApiContract;
  readonly selectorExamples: readonly HistoricalSnapshotIngestionContractSelectorResult[];
  readonly capabilityFlags: HistoricalSnapshotIngestionContractCapabilities;
  readonly sourcePhase65FixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourcePhase66FixtureSnapshot: readonly MultiProviderReadOnlyFoundationName[];
  readonly sourcePhase67FixtureSnapshot: readonly CrossProviderDataQualityName[];
  readonly sourcePhase68FixtureSnapshot: readonly ProviderAwareReplayScenarioName[];
  readonly sourcePhase69FixtureSnapshot: readonly LiveSmokeSafetyCertificationName[];
  readonly sourcePhase70FixtureSnapshot: readonly ProviderReliabilityDriftAuditName[];
  readonly sourceRefs: {
    readonly phase65FixtureId: string;
    readonly phase66FixtureId: string;
    readonly phase67FixtureId: string;
    readonly phase68FixtureId: string;
    readonly phase69FixtureId: string;
    readonly phase70FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT;
    readonly source: typeof PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SOURCE;
    readonly version: typeof PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_VERSION;
    readonly phase: typeof HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE;
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

export interface BuildHistoricalSnapshotIngestionContractFixtureInput {
  readonly fixtureName: HistoricalSnapshotIngestionContractName;
}

export interface HistoricalSnapshotIngestionContractValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface HistoricalSnapshotIngestionContractValidationResult {
  readonly valid: boolean;
  readonly issues: readonly HistoricalSnapshotIngestionContractValidationIssue[];
}

export interface HistoricalSnapshotIngestionContractSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
