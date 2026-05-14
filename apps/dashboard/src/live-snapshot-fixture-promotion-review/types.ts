import type { ControlledLiveSmokeHarnessName } from '../controlled-live-smoke-harness/types.js';
import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { LiveSnapshotReplayParityAuditName } from '../live-snapshot-replay-parity-audit/types.js';
import type { ManualConfirmDryRunControlName } from '../manual-confirm-dry-run-control/types.js';
import type { ManualConfirmLiveReadinessName } from '../manual-confirm-live-readiness/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { PreLiveSafetyCertificationName } from '../pre-live-safety-certification/types.js';
import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';
import type { ReadOnlyLiveSnapshotCaptureName } from '../read-only-live-snapshot-capture/types.js';

export const LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE = 80 as const;
export const PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT = '2026-05-14T00:00:00.000Z' as const;
export const PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SOURCE =
  'phase80_live_snapshot_fixture_promotion_review_contracts_v1' as const;
export const PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_VERSION = '1.0.0' as const;
export const PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SCHEMA_VERSION = '1.0.0' as const;

export const LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES = [
  'fixture-promotion-review-ready',
  'parity-audit-mismatch-blocked',
  'quarantined-snapshot-blocked',
  'missing-reviewer-decision-pending',
  'manifest-write-path-rejected',
  'provenance-review-warning-required',
  'schema-review-warning-required',
  'unsafe-capability-rejected',
] as const;

export const LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS = [
  'fixture_promotion_review_ready',
  'parity_audit_mismatch_blocked',
  'quarantined_snapshot_blocked',
  'missing_reviewer_decision_pending',
  'manifest_write_path_rejected',
  'provenance_review_warning_required',
  'schema_review_warning_required',
  'unsafe_capability_rejected',
] as const;

export const FIXTURE_PROMOTION_REVIEW_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;
export const FIXTURE_PROMOTION_CANDIDATE_STATUSES = ['staged', 'blocked', 'review_required', 'rejected'] as const;
export const FIXTURE_PROMOTION_POLICY_STATUSES = ['active', 'review_required', 'blocked', 'rejected'] as const;
export const FIXTURE_PROMOTION_DECISION_KINDS = ['approved', 'rejected', 'warning', 'pending'] as const;
export const FIXTURE_PROMOTION_DECISION_STATUSES = ['recorded', 'pending', 'blocked'] as const;
export const FIXTURE_PROMOTION_MANIFEST_STATUSES = ['proposed', 'blocked', 'review_required', 'rejected'] as const;

export type LiveSnapshotFixturePromotionReviewName = (typeof LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES)[number];
export type LiveSnapshotFixturePromotionReviewKind = (typeof LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS)[number];
export type FixturePromotionReviewGateStatus = (typeof FIXTURE_PROMOTION_REVIEW_GATE_STATUSES)[number];
export type FixturePromotionCandidateStatus = (typeof FIXTURE_PROMOTION_CANDIDATE_STATUSES)[number];
export type FixturePromotionPolicyStatus = (typeof FIXTURE_PROMOTION_POLICY_STATUSES)[number];
export type FixturePromotionDecisionKind = (typeof FIXTURE_PROMOTION_DECISION_KINDS)[number];
export type FixturePromotionDecisionStatus = (typeof FIXTURE_PROMOTION_DECISION_STATUSES)[number];
export type FixturePromotionManifestStatus = (typeof FIXTURE_PROMOTION_MANIFEST_STATUSES)[number];

export interface FixturePromotionReviewGate {
  readonly reviewGateId: string;
  readonly reviewGateName: string;
  readonly phase: typeof LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE;
  readonly gateStatus: FixturePromotionReviewGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly filesystemWriteAllowed: false;
  readonly automaticPromotionAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface FixturePromotionCandidate {
  readonly candidateId: string;
  readonly sourceParityAuditFixtureRef: string;
  readonly sourceSnapshotCaptureFixtureRef: string;
  readonly candidateStatus: FixturePromotionCandidateStatus;
  readonly stagedOnly: true;
  readonly persisted: false;
  readonly promotionAllowed: false;
}

export interface FixturePromotionReviewPolicy {
  readonly policyId: string;
  readonly manualReviewRequired: true;
  readonly automaticApprovalAllowed: false;
  readonly automaticPromotionAllowed: false;
  readonly multipleReviewersRequired: number;
  readonly policyStatus: FixturePromotionPolicyStatus;
}

export interface FixturePromotionReviewerDecision {
  readonly decisionId: string;
  readonly decisionKind: FixturePromotionDecisionKind;
  readonly reviewerSlot: string;
  readonly decisionStatus: FixturePromotionDecisionStatus;
  readonly approvalDoesNotPromote: true;
  readonly evidenceRefs: readonly string[];
}

export interface FixturePromotionEvidenceBundle {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly parityAuditRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface FixturePromotionManifest {
  readonly manifestId: string;
  readonly manifestKind: string;
  readonly proposedFixtureName: string;
  readonly proposedFixtureVersion: string;
  readonly fileWriteAllowed: false;
  readonly automaticCommitAllowed: false;
  readonly manifestStatus: FixturePromotionManifestStatus;
}

export interface FixturePromotionBlocker {
  readonly blockerId: string;
  readonly blockerKind: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly reasonCode: string;
  readonly failClosed: true;
  readonly promotionBlocked: boolean;
}

export interface FixturePromotionQuarantineReview {
  readonly quarantineReviewId: string;
  readonly quarantined: boolean;
  readonly quarantineReasonCodes: readonly string[];
  readonly releaseAllowed: false;
  readonly manualReviewRequired: true;
}

export interface FixturePromotionParityReviewLinkage {
  readonly parityReviewLinkageId: string;
  readonly sourceParityAuditFixtureRef: string;
  readonly parityStatus: 'clean' | 'warning' | 'mismatch';
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface FixturePromotionSnapshotCaptureLinkage {
  readonly snapshotCaptureLinkageId: string;
  readonly sourceSnapshotCaptureFixtureRef: string;
  readonly captureStatus: 'staged' | 'quarantined' | 'review_required';
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface FixturePromotionProvenanceReview {
  readonly provenanceReviewId: string;
  readonly reviewStatus: 'pass' | 'warning' | 'fail';
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
}

export interface FixturePromotionIntegrityReview {
  readonly integrityReviewId: string;
  readonly checksumKind: 'fnv1a32';
  readonly expectedChecksum: string;
  readonly observedChecksum: string;
  readonly reviewStatus: 'pass' | 'warning' | 'fail';
}

export interface FixturePromotionSchemaReview {
  readonly schemaReviewId: string;
  readonly schemaVersion: string;
  readonly reviewStatus: 'pass' | 'warning' | 'fail';
  readonly warningCodes: readonly string[];
  readonly manualReviewRequired: boolean;
}

export interface FixturePromotionScorecard {
  readonly scorecardId: string;
  readonly promotionScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly reviewRequired: boolean;
}

export interface FixturePromotionReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly candidateSummary: string;
  readonly policySummary: string;
  readonly decisionSummary: string;
  readonly evidenceSummary: string;
  readonly manifestSummary: string;
  readonly blockerSummary: string;
  readonly quarantineSummary: string;
  readonly safetySummary: string;
}

export interface FixturePromotionViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: LiveSnapshotFixturePromotionReviewName;
  readonly gateStatus: FixturePromotionReviewGateStatus;
  readonly candidateStatus: FixturePromotionCandidateStatus;
  readonly manifestStatus: FixturePromotionManifestStatus;
  readonly summary: string;
}

export interface FixturePromotionApiContract {
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

export interface FixturePromotionSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: LiveSnapshotFixturePromotionReviewName;
  readonly fixtureKind?: LiveSnapshotFixturePromotionReviewKind;
}

export interface FixturePromotionSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: LiveSnapshotFixturePromotionReviewKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface LiveSnapshotFixturePromotionReviewCapabilities {
  readonly liveSnapshotFixturePromotionReviewContracts: true;
  readonly deterministicFixturePromotionReviewFixtures: true;
  readonly fixturePromotionReviewGates: true;
  readonly fixturePromotionCandidates: true;
  readonly fixturePromotionReviewPolicies: true;
  readonly fixturePromotionReviewerDecisions: true;
  readonly fixturePromotionEvidenceBundles: true;
  readonly fixturePromotionManifests: true;
  readonly fixturePromotionBlockerTaxonomy: true;
  readonly fixturePromotionQuarantineReview: true;
  readonly fixturePromotionParityReviewLinkage: true;
  readonly fixturePromotionSnapshotCaptureLinkage: true;
  readonly fixturePromotionProvenanceReview: true;
  readonly fixturePromotionIntegrityReview: true;
  readonly fixturePromotionSchemaReview: true;
  readonly fixturePromotionScorecards: true;
  readonly fixturePromotionReports: true;
  readonly fixturePromotionViewModels: true;
  readonly fixturePromotionApiContracts: true;
  readonly fixturePromotionSelectors: true;
  readonly fixturePromotionRuntimeCapture: false;
  readonly fixturePromotionRuntimeReplay: false;
  readonly fixturePromotionUnlockAuthority: false;
  readonly fixturePromotionAutomaticPromotion: false;
  readonly fixturePromotionFilesystemWrites: false;
  readonly fixturePromotionPersistence: false;
  readonly fixturePromotionLiveTrading: false;
  readonly fixturePromotionLimitedLiveUnlock: false;
  readonly fixturePromotionFullAutoUnlock: false;
  readonly fixturePromotionExecution: false;
  readonly fixturePromotionOrderCreation: false;
  readonly fixturePromotionTransactionBuilding: false;
  readonly fixturePromotionTransactionSending: false;
  readonly fixturePromotionWalletLogic: false;
  readonly fixturePromotionPrivateKeyHandling: false;
  readonly fixturePromotionSigning: false;
  readonly fixturePromotionDispatch: false;
  readonly fixturePromotionTradingSignals: false;
  readonly fixturePromotionRecommendations: false;
  readonly fixturePromotionInvestmentAdvice: false;
  readonly fixturePromotionRealOrders: false;
  readonly fixturePromotionRealFunds: false;
  readonly fixturePromotionRealPnL: false;
  readonly fixturePromotionLiveNetworkDefault: false;
  readonly fixturePromotionScheduledJobs: false;
  readonly fixturePromotionRuntimeMonitoring: false;
  readonly fixturePromotionRuntimeCollectors: false;
  readonly fixturePromotionProviderExpansion: false;
  readonly fixturePromotionSecretsRequired: false;
  readonly fixturePromotionApiKeyRequired: false;
  readonly fixturePromotionRouteHandlers: false;
  readonly fixturePromotionRuntimeRequests: false;
  readonly fixturePromotionUiRendering: false;
  readonly fixturePromotionDomAccess: false;
  readonly fixturePromotionBackgroundJobs: false;
}

export interface LiveSnapshotFixturePromotionReviewFixture {
  readonly fixtureId: string;
  readonly fixtureName: LiveSnapshotFixturePromotionReviewName;
  readonly fixtureKind: LiveSnapshotFixturePromotionReviewKind;
  readonly phase: typeof LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE;
  readonly schemaVersion: typeof PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SCHEMA_VERSION;
  readonly reviewGate: FixturePromotionReviewGate;
  readonly candidate: FixturePromotionCandidate;
  readonly reviewPolicy: FixturePromotionReviewPolicy;
  readonly reviewerDecision: FixturePromotionReviewerDecision;
  readonly evidenceBundle: FixturePromotionEvidenceBundle;
  readonly manifest: FixturePromotionManifest;
  readonly blocker: FixturePromotionBlocker;
  readonly quarantineReview: FixturePromotionQuarantineReview;
  readonly parityReviewLinkage: FixturePromotionParityReviewLinkage;
  readonly snapshotCaptureLinkage: FixturePromotionSnapshotCaptureLinkage;
  readonly provenanceReview: FixturePromotionProvenanceReview;
  readonly integrityReview: FixturePromotionIntegrityReview;
  readonly schemaReview: FixturePromotionSchemaReview;
  readonly scorecard: FixturePromotionScorecard;
  readonly report: FixturePromotionReport;
  readonly viewModel: FixturePromotionViewModel;
  readonly apiContract: FixturePromotionApiContract;
  readonly selectorExamples: readonly FixturePromotionSelector[];
  readonly capabilities: LiveSnapshotFixturePromotionReviewCapabilities;
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
  readonly sourcePhase79FixtureSnapshot: readonly LiveSnapshotReplayParityAuditName[];
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
    readonly phase79FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT;
    readonly source: typeof PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SOURCE;
    readonly version: typeof PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_VERSION;
    readonly phase: typeof LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveNetwork: true;
    readonly noRuntimeCapture: true;
    readonly noRuntimeReplay: true;
    readonly nonAdvisory: true;
    readonly noFilesystemWrites: true;
  };
}

export interface BuildLiveSnapshotFixturePromotionReviewFixtureInput {
  readonly fixtureName: LiveSnapshotFixturePromotionReviewName;
}

export interface LiveSnapshotFixturePromotionReviewValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface LiveSnapshotFixturePromotionReviewValidationResult {
  readonly valid: boolean;
  readonly issues: readonly LiveSnapshotFixturePromotionReviewValidationIssue[];
}

export interface LiveSnapshotFixturePromotionReviewSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
