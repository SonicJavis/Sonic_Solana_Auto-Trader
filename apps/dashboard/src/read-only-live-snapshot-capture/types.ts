import type { ControlledLiveSmokeHarnessName } from '../controlled-live-smoke-harness/types.js';
import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { ManualConfirmDryRunControlName } from '../manual-confirm-dry-run-control/types.js';
import type { ManualConfirmLiveReadinessName } from '../manual-confirm-live-readiness/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { PreLiveSafetyCertificationName } from '../pre-live-safety-certification/types.js';
import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';

export const READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE = 78 as const;
export const PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SOURCE =
  'phase78_read_only_live_snapshot_capture_contracts_v1' as const;
export const PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_VERSION = '1.0.0' as const;
export const PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION = '1.0.0' as const;

export const READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES = [
  'read-only-snapshot-capture-ready',
  'missing-manual-dry-run-readiness-blocked',
  'provider-not-eligible-blocked',
  'capture-scope-too-wide-rejected',
  'staged-response-quarantined',
  'schema-validation-warning-review-required',
  'promotion-candidate-manual-review-required',
  'unsafe-capability-rejected',
] as const;

export const READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS = [
  'read_only_snapshot_capture_ready',
  'missing_manual_dry_run_readiness_blocked',
  'provider_not_eligible_blocked',
  'capture_scope_too_wide_rejected',
  'staged_response_quarantined',
  'schema_validation_warning_review_required',
  'promotion_candidate_manual_review_required',
  'unsafe_capability_rejected',
] as const;

export const LIVE_SNAPSHOT_GATE_STATUSES = ['ready', 'blocked', 'rejected', 'review_required'] as const;
export const LIVE_SNAPSHOT_REQUEST_STATUSES = ['ready', 'blocked', 'rejected', 'review_required'] as const;
export const LIVE_SNAPSHOT_SCOPE_STATUSES = ['ready', 'blocked', 'rejected', 'review_required'] as const;
export const LIVE_SNAPSHOT_STAGING_STATUSES = ['staged', 'quarantined', 'review_required', 'rejected'] as const;
export const LIVE_SNAPSHOT_PROMOTION_STATUSES = ['candidate', 'blocked', 'review_required', 'rejected'] as const;

export type ReadOnlyLiveSnapshotCaptureName = (typeof READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES)[number];
export type ReadOnlyLiveSnapshotCaptureKind = (typeof READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS)[number];
export type LiveSnapshotCaptureGateStatus = (typeof LIVE_SNAPSHOT_GATE_STATUSES)[number];
export type LiveSnapshotCaptureRequestStatus = (typeof LIVE_SNAPSHOT_REQUEST_STATUSES)[number];
export type LiveSnapshotCaptureScopeStatus = (typeof LIVE_SNAPSHOT_SCOPE_STATUSES)[number];
export type LiveSnapshotResponseStagingStatus = (typeof LIVE_SNAPSHOT_STAGING_STATUSES)[number];
export type LiveSnapshotPromotionStatus = (typeof LIVE_SNAPSHOT_PROMOTION_STATUSES)[number];

export interface LiveSnapshotCaptureGate {
  readonly captureGateId: string;
  readonly captureGateName: string;
  readonly phase: typeof READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE;
  readonly gateStatus: LiveSnapshotCaptureGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly liveCaptureRuntimeAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface LiveSnapshotCaptureRequest {
  readonly requestId: string;
  readonly requestKind: string;
  readonly readOnly: true;
  readonly writeMethodAllowed: false;
  readonly dispatchAllowed: false;
  readonly targetProviderId: string;
  readonly requestStatus: LiveSnapshotCaptureRequestStatus;
}

export interface LiveSnapshotProviderTarget {
  readonly targetId: string;
  readonly providerId: string;
  readonly providerKind: string;
  readonly readOnlyEligible: boolean;
  readonly capabilityRefs: readonly string[];
  readonly providerExpansionAllowed: false;
}

export interface LiveSnapshotCaptureScope {
  readonly scopeId: string;
  readonly scopeKind: string;
  readonly accountSnapshotAllowed: boolean;
  readonly mintSnapshotAllowed: boolean;
  readonly poolSnapshotAllowed: boolean;
  readonly transactionWriteAllowed: false;
  readonly scopeStatus: LiveSnapshotCaptureScopeStatus;
}

export interface LiveSnapshotCaptureBounds {
  readonly boundsId: string;
  readonly maxRequestCount: number;
  readonly maxObservationCount: number;
  readonly deterministicWindowLabel: string;
  readonly usesRuntimeTimers: false;
  readonly scheduledCaptureAllowed: false;
}

export interface LiveSnapshotResponseStaging {
  readonly stagingId: string;
  readonly stagedResponseKind: string;
  readonly stagedOnly: true;
  readonly persisted: false;
  readonly filesystemWriteAllowed: false;
  readonly stagingStatus: LiveSnapshotResponseStagingStatus;
}

export interface LiveSnapshotQuarantineContract {
  readonly quarantineId: string;
  readonly quarantined: boolean;
  readonly reasonCodes: readonly string[];
  readonly failClosed: true;
  readonly promotionAllowed: false;
}

export interface LiveSnapshotNormalizationContract {
  readonly normalizationId: string;
  readonly schemaVersion: string;
  readonly deterministicSerialization: true;
  readonly stableOrdering: true;
}

export interface LiveSnapshotProvenanceContract {
  readonly provenanceId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly docsRefs: readonly string[];
}

export interface LiveSnapshotIntegrityContract {
  readonly integrityId: string;
  readonly checksum: string;
  readonly checksumKind: 'fnv1a32';
  readonly evidenceBundleId: string;
}

export interface LiveSnapshotSchemaValidationContract {
  readonly validationId: string;
  readonly schemaVersion: string;
  readonly validationStatus: 'pass' | 'warning' | 'fail';
  readonly warningCodes: readonly string[];
  readonly reviewRequired: boolean;
}

export interface LiveSnapshotPromotionCandidate {
  readonly candidateId: string;
  readonly fixtureCandidateOnly: true;
  readonly automaticPromotionAllowed: false;
  readonly manualReviewRequired: true;
  readonly promotionStatus: LiveSnapshotPromotionStatus;
}

export interface LiveSnapshotFixtureCandidateContract {
  readonly fixtureCandidateId: string;
  readonly fixtureCandidatePath: string;
  readonly fixtureCandidateOnly: true;
  readonly persistenceAllowed: false;
}

export interface LiveSnapshotCaptureCertification {
  readonly certificationId: string;
  readonly certifiedReadOnly: true;
  readonly failClosed: true;
  readonly certificationStatus: 'pass' | 'warning' | 'fail';
}

export interface LiveSnapshotCaptureReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly requestSummary: string;
  readonly providerSummary: string;
  readonly scopeSummary: string;
  readonly boundsSummary: string;
  readonly stagingSummary: string;
  readonly quarantineSummary: string;
  readonly promotionSummary: string;
  readonly safetySummary: string;
}

export interface LiveSnapshotCaptureViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ReadOnlyLiveSnapshotCaptureName;
  readonly gateStatus: LiveSnapshotCaptureGateStatus;
  readonly requestStatus: LiveSnapshotCaptureRequestStatus;
  readonly promotionStatus: LiveSnapshotPromotionStatus;
  readonly summary: string;
}

export interface LiveSnapshotCaptureApiContract {
  readonly list: {
    readonly contractId: string;
    readonly contractKind: 'list';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: { readonly fixtureIds: readonly string[]; readonly totalCount: number };
  };
  readonly get: {
    readonly contractId: string;
    readonly contractKind: 'get';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: { readonly fixtureId: string };
  };
}

export interface LiveSnapshotCaptureSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ReadOnlyLiveSnapshotCaptureKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface LiveSnapshotCaptureSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: string;
  readonly fixtureKind?: ReadOnlyLiveSnapshotCaptureKind;
}

export interface ReadOnlyLiveSnapshotCaptureCapabilities {
  readonly readOnlyLiveSnapshotCaptureContracts: true;
  readonly deterministicLiveSnapshotCaptureFixtures: true;
  readonly liveSnapshotCaptureGates: true;
  readonly liveSnapshotCaptureRequests: true;
  readonly liveSnapshotProviderTargets: true;
  readonly liveSnapshotCaptureScopes: true;
  readonly liveSnapshotCaptureBounds: true;
  readonly liveSnapshotResponseStaging: true;
  readonly liveSnapshotQuarantineContracts: true;
  readonly liveSnapshotNormalizationContracts: true;
  readonly liveSnapshotProvenanceContracts: true;
  readonly liveSnapshotIntegrityContracts: true;
  readonly liveSnapshotSchemaValidation: true;
  readonly liveSnapshotPromotionCandidates: true;
  readonly liveSnapshotFixtureCandidateContracts: true;
  readonly liveSnapshotCertificationReports: true;
  readonly liveSnapshotViewModels: true;
  readonly liveSnapshotApiContracts: true;
  readonly liveSnapshotSelectors: true;
  readonly liveSnapshotRuntimeCapture: false;
  readonly liveSnapshotUnlockAuthority: false;
  readonly liveSnapshotLiveTrading: false;
  readonly liveSnapshotLimitedLiveUnlock: false;
  readonly liveSnapshotFullAutoUnlock: false;
  readonly liveSnapshotExecution: false;
  readonly liveSnapshotOrderCreation: false;
  readonly liveSnapshotTransactionBuilding: false;
  readonly liveSnapshotTransactionSending: false;
  readonly liveSnapshotWalletLogic: false;
  readonly liveSnapshotPrivateKeyHandling: false;
  readonly liveSnapshotSigning: false;
  readonly liveSnapshotDispatch: false;
  readonly liveSnapshotTradingSignals: false;
  readonly liveSnapshotRecommendations: false;
  readonly liveSnapshotInvestmentAdvice: false;
  readonly liveSnapshotRealOrders: false;
  readonly liveSnapshotRealFunds: false;
  readonly liveSnapshotRealPnL: false;
  readonly liveSnapshotLiveNetworkDefault: false;
  readonly liveSnapshotScheduledJobs: false;
  readonly liveSnapshotRuntimeMonitoring: false;
  readonly liveSnapshotRuntimeCollectors: false;
  readonly liveSnapshotProviderExpansion: false;
  readonly liveSnapshotSecretsRequired: false;
  readonly liveSnapshotApiKeyRequired: false;
  readonly liveSnapshotFilesystemWrites: false;
  readonly liveSnapshotPersistence: false;
  readonly liveSnapshotRouteHandlers: false;
  readonly liveSnapshotRuntimeRequests: false;
  readonly liveSnapshotUiRendering: false;
  readonly liveSnapshotDomAccess: false;
  readonly liveSnapshotBackgroundJobs: false;
  readonly liveSnapshotAutomaticPromotion: false;
}

export interface ReadOnlyLiveSnapshotCaptureFixture {
  readonly fixtureId: string;
  readonly fixtureName: ReadOnlyLiveSnapshotCaptureName;
  readonly fixtureKind: ReadOnlyLiveSnapshotCaptureKind;
  readonly phase: typeof READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE;
  readonly schemaVersion: typeof PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION;
  readonly captureGate: LiveSnapshotCaptureGate;
  readonly captureRequest: LiveSnapshotCaptureRequest;
  readonly providerTarget: LiveSnapshotProviderTarget;
  readonly captureScope: LiveSnapshotCaptureScope;
  readonly captureBounds: LiveSnapshotCaptureBounds;
  readonly responseStaging: LiveSnapshotResponseStaging;
  readonly quarantineContract: LiveSnapshotQuarantineContract;
  readonly normalizationContract: LiveSnapshotNormalizationContract;
  readonly provenanceContract: LiveSnapshotProvenanceContract;
  readonly integrityContract: LiveSnapshotIntegrityContract;
  readonly schemaValidationContract: LiveSnapshotSchemaValidationContract;
  readonly promotionCandidate: LiveSnapshotPromotionCandidate;
  readonly fixtureCandidateContract: LiveSnapshotFixtureCandidateContract;
  readonly captureCertification: LiveSnapshotCaptureCertification;
  readonly captureReport: LiveSnapshotCaptureReport;
  readonly report: LiveSnapshotCaptureReport;
  readonly viewModel: LiveSnapshotCaptureViewModel;
  readonly apiContract: LiveSnapshotCaptureApiContract;
  readonly selectorExamples: readonly LiveSnapshotCaptureSelector[];
  readonly capabilityFlags: ReadOnlyLiveSnapshotCaptureCapabilities;
  readonly sourcePhase65FixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourcePhase66FixtureSnapshot: readonly MultiProviderReadOnlyFoundationName[];
  readonly sourcePhase67FixtureSnapshot: readonly CrossProviderDataQualityName[];
  readonly sourcePhase68FixtureSnapshot: readonly ProviderAwareReplayScenarioName[];
  readonly sourcePhase69FixtureSnapshot: readonly LiveSmokeSafetyCertificationName[];
  readonly sourcePhase70FixtureSnapshot: readonly ProviderReliabilityDriftAuditName[];
  readonly sourcePhase72FixtureSnapshot: readonly HistoricalSnapshotScenarioGeneratorName[];
  readonly sourcePhase73FixtureSnapshot: readonly ProviderAwareReplayImportContractName[];
  readonly sourcePhase74FixtureSnapshot: readonly ControlledLiveSmokeHarnessName[];
  readonly sourcePhase75FixtureSnapshot: readonly PreLiveSafetyCertificationName[];
  readonly sourcePhase76FixtureSnapshot: readonly ManualConfirmLiveReadinessName[];
  readonly sourcePhase77FixtureSnapshot: readonly ManualConfirmDryRunControlName[];
  readonly sourceRefs: {
    readonly phase65FixtureId: string;
    readonly phase66FixtureId: string;
    readonly phase67FixtureId: string;
    readonly phase68FixtureId: string;
    readonly phase69FixtureId: string;
    readonly phase70FixtureId: string;
    readonly phase72FixtureId: string;
    readonly phase73FixtureId: string;
    readonly phase74FixtureId: string;
    readonly phase75FixtureId: string;
    readonly phase76FixtureId: string;
    readonly phase77FixtureId: string;
  };
  readonly evidence: {
    readonly evidenceBundleId: string;
    readonly sourcePhaseRefs: readonly string[];
    readonly sourceFixtureRefs: readonly string[];
    readonly validationCommandRefs: readonly string[];
    readonly docsRefs: readonly string[];
    readonly evidenceComplete: boolean;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT;
    readonly source: typeof PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SOURCE;
    readonly version: typeof PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_VERSION;
    readonly phase: typeof READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveNetwork: true;
    readonly noSecretsRequired: true;
    readonly noProviderExpansion: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export interface BuildReadOnlyLiveSnapshotCaptureFixtureInput {
  readonly fixtureName: ReadOnlyLiveSnapshotCaptureName;
}

export interface ReadOnlyLiveSnapshotCaptureValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ReadOnlyLiveSnapshotCaptureValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ReadOnlyLiveSnapshotCaptureValidationIssue[];
}

export interface ReadOnlyLiveSnapshotCaptureSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
