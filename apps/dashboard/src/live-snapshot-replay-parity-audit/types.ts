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
import type { ReadOnlyLiveSnapshotCaptureName } from '../read-only-live-snapshot-capture/types.js';

export const LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE = 79 as const;
export const PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SOURCE =
  'phase79_live_snapshot_replay_parity_audit_contracts_v1' as const;
export const PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_VERSION = '1.0.0' as const;
export const PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SCHEMA_VERSION = '1.0.0' as const;

export const LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES = [
  'snapshot-replay-parity-clean',
  'snapshot-schema-mismatch-quarantined',
  'snapshot-provenance-mismatch-blocked',
  'snapshot-integrity-mismatch-blocked',
  'replay-expectation-missing-blocked',
  'scenario-expectation-warning-review-required',
  'promotion-gate-manual-review-required',
  'unsafe-capability-rejected',
] as const;

export const LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS = [
  'snapshot_replay_parity_clean',
  'snapshot_schema_mismatch_quarantined',
  'snapshot_provenance_mismatch_blocked',
  'snapshot_integrity_mismatch_blocked',
  'replay_expectation_missing_blocked',
  'scenario_expectation_warning_review_required',
  'promotion_gate_manual_review_required',
  'unsafe_capability_rejected',
] as const;

export const LIVE_SNAPSHOT_REPLAY_PARITY_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;
export const LIVE_SNAPSHOT_REPLAY_PARITY_OUTCOMES = ['clean', 'warning', 'mismatch', 'missing'] as const;
export const LIVE_SNAPSHOT_REPLAY_PROMOTION_STATUSES = ['candidate', 'blocked', 'review_required', 'rejected'] as const;

export type LiveSnapshotReplayParityAuditName = (typeof LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES)[number];
export type LiveSnapshotReplayParityAuditKind = (typeof LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS)[number];
export type LiveSnapshotReplayParityGateStatus = (typeof LIVE_SNAPSHOT_REPLAY_PARITY_GATE_STATUSES)[number];
export type LiveSnapshotReplayParityOutcome = (typeof LIVE_SNAPSHOT_REPLAY_PARITY_OUTCOMES)[number];
export type LiveSnapshotReplayPromotionStatus = (typeof LIVE_SNAPSHOT_REPLAY_PROMOTION_STATUSES)[number];

export interface LiveSnapshotReplayParityGate {
  readonly parityGateId: string;
  readonly parityGateName: string;
  readonly phase: typeof LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE;
  readonly gateStatus: LiveSnapshotReplayParityGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly runtimeReplayAllowed: false;
  readonly automaticPromotionAllowed: false;
  readonly blockingReasonCodes: readonly string[];
  readonly reasonCodes: readonly string[];
}

export interface LiveSnapshotReplaySnapshotInput {
  readonly snapshotInputId: string;
  readonly snapshotInputKind: string;
  readonly sourceCaptureFixtureRef: string;
  readonly sourceFixtureRef: string;
  readonly stagedOnly: true;
  readonly persisted: false;
  readonly inputStatus: 'ready' | 'blocked' | 'review_required' | 'rejected';
  readonly readOnly: true;
  readonly runtimeCaptureAllowed: false;
  readonly networkAccessAllowed: false;
}

export interface LiveSnapshotReplayExpectationLinkage {
  readonly expectationId: string;
  readonly sourceReplayFixtureRef: string;
  readonly expectedStateKind: string;
  readonly expectedChecksum: string;
  readonly expectationStatus: 'ready' | 'blocked' | 'review_required' | 'missing';
  readonly replayExpectationLinkageId: string;
  readonly replayExpectationRef: string;
  readonly expectationPresent: boolean;
  readonly linkageStatus: 'aligned' | 'missing' | 'warning' | 'blocked';
  readonly failClosed: true;
}

export interface LiveSnapshotScenarioExpectationLinkage {
  readonly scenarioExpectationId: string;
  readonly sourceScenarioFixtureRef: string;
  readonly expectedLifecycleRef: string;
  readonly expectedReplayRef: string;
  readonly expectationStatus: 'ready' | 'blocked' | 'review_required' | 'missing';
  readonly scenarioExpectationLinkageId: string;
  readonly scenarioExpectationRef: string;
  readonly expectationPresent: boolean;
  readonly linkageStatus: 'aligned' | 'missing' | 'warning' | 'blocked';
  readonly failClosed: true;
}

export interface LiveSnapshotParityComparison {
  readonly comparisonId: string;
  readonly comparisonKind: string;
  readonly matched: boolean;
  readonly mismatchIds: readonly string[];
  readonly comparisonStatus: 'clean' | 'warning' | 'blocked' | 'rejected';
  readonly parityComparisonId: string;
  readonly parityStatus: LiveSnapshotReplayParityOutcome;
  readonly mismatchCount: number;
  readonly comparedFields: readonly string[];
}

export interface LiveSnapshotMismatchTaxonomy {
  readonly mismatchId: string;
  readonly mismatchKind: string;
  readonly sourceFieldPath: string;
  readonly expectedValueLabel: string;
  readonly observedValueLabel: string;
  readonly failClosed: true;
  readonly mismatchTaxonomyId: string;
  readonly mismatchCodes: readonly string[];
  readonly severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  readonly quarantined: boolean;
}

export interface LiveSnapshotDriftClassification {
  readonly driftId: string;
  readonly driftKind: string;
  readonly driftSeverity: 'low' | 'medium' | 'high' | 'critical';
  readonly promotionBlocked: boolean;
  readonly driftClassificationId: string;
  readonly driftStatus: 'none' | 'warning' | 'drifted';
  readonly driftClass: 'none' | 'schema' | 'provenance' | 'integrity' | 'expectation';
  readonly reviewRequired: boolean;
}

export interface LiveSnapshotProvenanceAudit {
  readonly provenanceAuditId: string;
  readonly auditStatus: 'pass' | 'warning' | 'fail';
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly missingRefs: readonly string[];
  readonly failClosed: true;
}

export interface LiveSnapshotSchemaParity {
  readonly schemaParityId: string;
  readonly schemaVersion: string;
  readonly schemaStatus: 'pass' | 'warning' | 'fail';
  readonly mismatchFields: readonly string[];
}

export interface LiveSnapshotIntegrityParity {
  readonly integrityParityId: string;
  readonly checksumKind: 'fnv1a32';
  readonly expectedChecksum: string;
  readonly actualChecksum: string;
  readonly integrityStatus: 'pass' | 'warning' | 'fail';
  readonly parityMatch: boolean;
}

export interface LiveSnapshotPromotionGate {
  readonly promotionGateId: string;
  readonly promotionAllowed: false;
  readonly promotionStatus: LiveSnapshotReplayPromotionStatus;
  readonly fixtureOnly: true;
  readonly automaticPromotionAllowed: false;
  readonly manualReviewRequired: true;
}

export interface LiveSnapshotReplayParityQuarantineContract {
  readonly quarantineId: string;
  readonly quarantined: boolean;
  readonly reasonCodes: readonly string[];
  readonly failClosed: true;
  readonly promotionAllowed: false;
  readonly releaseAllowed: false;
}

export interface LiveSnapshotAuditEvidence {
  readonly evidenceId: string;
  readonly evidenceBundleId: string;
  readonly sourceRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface LiveSnapshotParityScorecard {
  readonly parityScorecardId: string;
  readonly parityScore: number;
  readonly classification: 'clean' | 'warning' | 'blocked' | 'rejected';
  readonly reviewRequired: boolean;
}

export interface LiveSnapshotParityReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly snapshotSummary: string;
  readonly replayExpectationSummary: string;
  readonly scenarioExpectationSummary: string;
  readonly comparisonSummary: string;
  readonly mismatchSummary: string;
  readonly driftSummary: string;
  readonly replaySummary: string;
  readonly scenarioSummary: string;
  readonly schemaSummary: string;
  readonly provenanceSummary: string;
  readonly integritySummary: string;
  readonly promotionSummary: string;
  readonly safetySummary: string;
  readonly quarantineSummary: string;
}

export interface LiveSnapshotReplayParityAuditViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: LiveSnapshotReplayParityAuditName;
  readonly gateStatus: LiveSnapshotReplayParityGateStatus;
  readonly parityStatus: LiveSnapshotReplayParityOutcome;
  readonly promotionStatus: LiveSnapshotReplayPromotionStatus;
  readonly summary: string;
}

export interface LiveSnapshotReplayParityAuditApiContract {
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

export interface LiveSnapshotReplayParityAuditSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: LiveSnapshotReplayParityAuditKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface LiveSnapshotReplayParityAuditSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: LiveSnapshotReplayParityAuditName;
  readonly fixtureKind?: LiveSnapshotReplayParityAuditKind;
}

export interface LiveSnapshotReplayParityAuditCapabilities {
  readonly liveSnapshotReplayParityAuditContracts: true;
  readonly deterministicLiveSnapshotReplayParityFixtures: true;
  readonly deterministicReplayParityAuditFixtures: true;
  readonly replayParityGates: true;
  readonly replayParitySnapshotInputs: true;
  readonly replayParityExpectationLinkage: true;
  readonly replayParityScenarioLinkage: true;
  readonly replayParityComparisons: true;
  readonly replayParityMismatchTaxonomy: true;
  readonly replayParityDriftClassification: true;
  readonly replayParityProvenanceAudits: true;
  readonly replayParitySchemaAudits: true;
  readonly replayParityIntegrityAudits: true;
  readonly replayParityPromotionGates: true;
  readonly replayParityQuarantineContracts: true;
  readonly replayParityEvidenceBundles: true;
  readonly replayParityScorecards: true;
  readonly replayParityReports: true;
  readonly replayParityViewModels: true;
  readonly liveSnapshotReplayParityGates: true;
  readonly liveSnapshotReplaySnapshotInputs: true;
  readonly liveSnapshotReplayExpectationLinkage: true;
  readonly liveSnapshotScenarioExpectationLinkage: true;
  readonly liveSnapshotParityComparisons: true;
  readonly liveSnapshotMismatchTaxonomy: true;
  readonly liveSnapshotDriftClassification: true;
  readonly liveSnapshotProvenanceAudits: true;
  readonly liveSnapshotSchemaParity: true;
  readonly liveSnapshotIntegrityParity: true;
  readonly liveSnapshotPromotionGates: true;
  readonly liveSnapshotReplayParityQuarantineContracts: true;
  readonly liveSnapshotAuditEvidence: true;
  readonly liveSnapshotParityScorecards: true;
  readonly liveSnapshotParityReports: true;
  readonly liveSnapshotReplayParityViewModels: true;
  readonly liveSnapshotReplayParityApiContracts: true;
  readonly liveSnapshotReplayParitySelectors: true;
  readonly replayParityApiContracts: true;
  readonly replayParitySelectors: true;
  readonly liveSnapshotReplayRuntime: false;
  readonly liveSnapshotReplayNetworkAccess: false;
  readonly liveSnapshotReplayUnlockAuthority: false;
  readonly liveSnapshotReplayLiveTrading: false;
  readonly liveSnapshotReplayExecution: false;
  readonly liveSnapshotReplayOrderCreation: false;
  readonly liveSnapshotReplayTransactionBuilding: false;
  readonly liveSnapshotReplayTransactionSending: false;
  readonly liveSnapshotReplayWalletLogic: false;
  readonly liveSnapshotReplayPrivateKeyHandling: false;
  readonly liveSnapshotReplaySigning: false;
  readonly liveSnapshotReplayDispatch: false;
  readonly liveSnapshotReplayTradingSignals: false;
  readonly liveSnapshotReplayRecommendations: false;
  readonly liveSnapshotReplayInvestmentAdvice: false;
  readonly liveSnapshotReplayRealOrders: false;
  readonly liveSnapshotReplayRealFunds: false;
  readonly liveSnapshotReplayRealPnL: false;
  readonly liveSnapshotReplayScheduledJobs: false;
  readonly liveSnapshotReplayRuntimeMonitoring: false;
  readonly liveSnapshotReplayRuntimeCollectors: false;
  readonly liveSnapshotReplayProviderExpansion: false;
  readonly liveSnapshotReplaySecretsRequired: false;
  readonly liveSnapshotReplayFilesystemWrites: false;
  readonly liveSnapshotReplayPersistence: false;
  readonly liveSnapshotReplayRouteHandlers: false;
  readonly liveSnapshotReplayRuntimeRequests: false;
  readonly liveSnapshotReplayUiRendering: false;
  readonly liveSnapshotReplayDomAccess: false;
  readonly liveSnapshotReplayBackgroundJobs: false;
  readonly liveSnapshotReplayAutomaticPromotion: false;
  readonly replayParityRuntimeCapture: false;
  readonly replayParityRuntimeReplay: false;
  readonly replayParityUnlockAuthority: false;
  readonly replayParityLiveTrading: false;
  readonly replayParityLimitedLiveUnlock: false;
  readonly replayParityFullAutoUnlock: false;
  readonly replayParityExecution: false;
  readonly replayParityOrderCreation: false;
  readonly replayParityTransactionBuilding: false;
  readonly replayParityTransactionSending: false;
  readonly replayParityWalletLogic: false;
  readonly replayParityPrivateKeyHandling: false;
  readonly replayParitySigning: false;
  readonly replayParityDispatch: false;
  readonly replayParityTradingSignals: false;
  readonly replayParityRecommendations: false;
  readonly replayParityInvestmentAdvice: false;
  readonly replayParityRealOrders: false;
  readonly replayParityRealFunds: false;
  readonly replayParityRealPnL: false;
  readonly replayParityLiveNetworkDefault: false;
  readonly replayParityScheduledJobs: false;
  readonly replayParityRuntimeMonitoring: false;
  readonly replayParityRuntimeCollectors: false;
  readonly replayParityProviderExpansion: false;
  readonly replayParitySecretsRequired: false;
  readonly replayParityApiKeyRequired: false;
  readonly replayParityFilesystemWrites: false;
  readonly replayParityPersistence: false;
  readonly replayParityRouteHandlers: false;
  readonly replayParityRuntimeRequests: false;
  readonly replayParityUiRendering: false;
  readonly replayParityDomAccess: false;
  readonly replayParityBackgroundJobs: false;
  readonly replayParityAutomaticPromotion: false;
}

export interface LiveSnapshotReplayParityAuditFixture {
  readonly fixtureId: string;
  readonly fixtureName: LiveSnapshotReplayParityAuditName;
  readonly fixtureKind: LiveSnapshotReplayParityAuditKind;
  readonly phase: typeof LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE;
  readonly schemaVersion: typeof PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SCHEMA_VERSION;
  readonly parityGate: LiveSnapshotReplayParityGate;
  readonly snapshotInput: LiveSnapshotReplaySnapshotInput;
  readonly replayExpectationLinkage: LiveSnapshotReplayExpectationLinkage;
  readonly scenarioExpectationLinkage: LiveSnapshotScenarioExpectationLinkage;
  readonly parityComparison: LiveSnapshotParityComparison;
  readonly mismatchTaxonomy: LiveSnapshotMismatchTaxonomy;
  readonly driftClassification: LiveSnapshotDriftClassification;
  readonly provenanceAudit: LiveSnapshotProvenanceAudit;
  readonly schemaParity: LiveSnapshotSchemaParity;
  readonly integrityParity: LiveSnapshotIntegrityParity;
  readonly promotionGate: LiveSnapshotPromotionGate;
  readonly quarantineContract: LiveSnapshotReplayParityQuarantineContract;
  readonly auditEvidence: LiveSnapshotAuditEvidence;
  readonly parityScorecard: LiveSnapshotParityScorecard;
  readonly parityReport: LiveSnapshotParityReport;
  readonly report: LiveSnapshotParityReport;
  readonly viewModel: LiveSnapshotReplayParityAuditViewModel;
  readonly apiContract: LiveSnapshotReplayParityAuditApiContract;
  readonly selectorExamples: readonly LiveSnapshotReplayParityAuditSelector[];
  readonly capabilityFlags: LiveSnapshotReplayParityAuditCapabilities;
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
  readonly sourcePhase78FixtureSnapshot: readonly ReadOnlyLiveSnapshotCaptureName[];
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
    readonly phase78FixtureId: string;
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
    readonly generatedAt: typeof PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT;
    readonly source: typeof PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SOURCE;
    readonly version: typeof PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_VERSION;
    readonly phase: typeof LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveNetwork: true;
    readonly noRuntimeReplay: true;
    readonly noProviderExpansion: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export type ReplayParityGate = LiveSnapshotReplayParityGate;
export type ReplayParitySnapshotInput = LiveSnapshotReplaySnapshotInput;
export type ReplayParityExpectationLinkage = LiveSnapshotReplayExpectationLinkage;
export type ReplayParityScenarioLinkage = LiveSnapshotScenarioExpectationLinkage;
export type ReplayParityComparison = LiveSnapshotParityComparison;
export type ReplayParityMismatch = LiveSnapshotMismatchTaxonomy;
export type ReplayParityDriftClassification = LiveSnapshotDriftClassification;
export type ReplayParityPromotionGate = LiveSnapshotPromotionGate;
export type ReplayParityQuarantineContract = LiveSnapshotReplayParityQuarantineContract;
export type ReplayParityReport = LiveSnapshotParityReport;
export type ReplayParityViewModel = LiveSnapshotReplayParityAuditViewModel;
export type ReplayParityApiContract = LiveSnapshotReplayParityAuditApiContract;

export interface BuildLiveSnapshotReplayParityAuditFixtureInput {
  readonly fixtureName: LiveSnapshotReplayParityAuditName;
}

export interface LiveSnapshotReplayParityAuditValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface LiveSnapshotReplayParityAuditValidationResult {
  readonly valid: boolean;
  readonly issues: readonly LiveSnapshotReplayParityAuditValidationIssue[];
}

export interface LiveSnapshotReplayParityAuditSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
