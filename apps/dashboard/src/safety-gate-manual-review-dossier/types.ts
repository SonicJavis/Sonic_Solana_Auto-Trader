import type { ControlledLiveSmokeHarnessName } from '../controlled-live-smoke-harness/types.js';
import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { ExecutionOutcomeAuditContractName } from '../execution-outcome-audit-contracts/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
import type { LaunchRiskEngineAssessmentName } from '../launch-risk-engine/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { LiveSnapshotFixturePromotionReviewName } from '../live-snapshot-fixture-promotion-review/types.js';
import type { LiveSnapshotReplayParityAuditName } from '../live-snapshot-replay-parity-audit/types.js';
import type { ManualConfirmDryRunControlName } from '../manual-confirm-dry-run-control/types.js';
import type { ManualConfirmExecutionBoundaryName } from '../manual-confirm-execution-boundary/types.js';
import type { ManualConfirmLiveReadinessName } from '../manual-confirm-live-readiness/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { OutcomeRiskFeedbackContractName } from '../outcome-risk-feedback-contracts/types.js';
import type { PostSendObservationBoundaryName } from '../post-send-observation-boundary/types.js';
import type { PreLiveSafetyCertificationName } from '../pre-live-safety-certification/types.js';
import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';
import type { ReadOnlyLiveSnapshotCaptureName } from '../read-only-live-snapshot-capture/types.js';
import type { RiskExplanationEvidenceName } from '../risk-explanation-evidence/types.js';
import type { RiskFeedbackSafetyGateReevaluationName } from '../risk-feedback-safety-gate-reevaluation/types.js';
import type { SigningBoundarySafetyContractName } from '../signing-boundary-safety-contracts/types.js';
import type { TransactionConstructionContractMockName } from '../transaction-construction-contract-mocks/types.js';
import type { TransactionSendBoundarySafetyContractName } from '../transaction-send-boundary-safety/types.js';

export const SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE = 89 as const;
export const PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT =
  '2026-05-16T00:00:00.000Z' as const;
export const PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SOURCE =
  'phase89_safety_gate_manual_review_dossier_contracts_v1' as const;
export const PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_VERSION = '1.0.0' as const;
export const PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION = '1.0.0' as const;

export const SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES = [
  'manual-review-dossier-ready',
  'missing-reevaluation-ref-blocked',
  'missing-evidence-packet-blocked',
  'reviewer-checklist-incomplete-blocked',
  'signoff-placeholder-only',
  'unresolved-blockers-preserved',
  'automatic-approval-denied',
  'unsafe-capability-rejected',
] as const;

export const SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS = [
  'manual_review_dossier_ready',
  'missing_reevaluation_ref_blocked',
  'missing_evidence_packet_blocked',
  'reviewer_checklist_incomplete_blocked',
  'signoff_placeholder_only',
  'unresolved_blockers_preserved',
  'automatic_approval_denied',
  'unsafe_capability_rejected',
] as const;

export const DOSSIER_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;
export const DOSSIER_REVIEW_STATUSES = ['pending', 'in_review', 'denied'] as const;
export const DOSSIER_LINK_STATUSES = ['linked', 'warning', 'blocked'] as const;

export type SafetyGateManualReviewDossierName =
  (typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES)[number];
export type SafetyGateManualReviewDossierKind =
  (typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS)[number];
export type DossierGateStatus = (typeof DOSSIER_GATE_STATUSES)[number];
export type DossierReviewStatus = (typeof DOSSIER_REVIEW_STATUSES)[number];
export type DossierLinkStatus = (typeof DOSSIER_LINK_STATUSES)[number];

export interface DossierGate {
  readonly dossierGateId: string;
  readonly dossierGateName: string;
  readonly phase: typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE;
  readonly gateStatus: DossierGateStatus;
  readonly failClosed: true;
  readonly approvalAuthority: false;
  readonly unlockAuthority: false;
  readonly automaticApprovalAllowed: false;
  readonly automaticUnlockAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface ReviewDossierHeader {
  readonly dossierHeaderId: string;
  readonly dossierName: string;
  readonly sourceReevaluationFixtureRef: string;
  readonly sourceFeedbackFixtureRef: string;
  readonly deterministicGeneratedAt: typeof PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT;
  readonly manualReviewRequired: true;
  readonly approvalAuthorizesUnlock: false;
}

export interface ReviewerChecklist {
  readonly reviewerChecklistId: string;
  readonly checklistItems: readonly string[];
  readonly requiredReviewerCount: number;
  readonly makerCheckerRequired: true;
  readonly allItemsDeterministic: true;
  readonly liveReviewerLookupAllowed: false;
}

export interface EvidencePacket {
  readonly evidencePacketId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly reevaluationRefs: readonly string[];
  readonly feedbackRefs: readonly string[];
  readonly riskRefs: readonly string[];
  readonly outcomeRefs: readonly string[];
  readonly certificationRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface SignoffPlaceholder {
  readonly signoffPlaceholderId: string;
  readonly placeholderOnly: true;
  readonly realSignoffCaptured: false;
  readonly signoffAuthorizesUnlock: false;
  readonly separateFuturePhaseRequired: true;
  readonly reasonCodes: readonly string[];
}

export interface UnresolvedBlockerSummary {
  readonly blockerSummaryId: string;
  readonly blockersPreserved: true;
  readonly unresolvedBlockerCount: number;
  readonly blockerResolutionAllowed: false;
  readonly automaticBlockerClearAllowed: false;
}

export interface EscalationReviewPlaceholder {
  readonly escalationReviewPlaceholderId: string;
  readonly deterministicOnly: true;
  readonly autoEscalationAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface PolicyReviewPlaceholder {
  readonly policyReviewPlaceholderId: string;
  readonly deterministicOnly: true;
  readonly livePolicyLookupAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface ReadinessReviewPlaceholder {
  readonly readinessReviewPlaceholderId: string;
  readonly deterministicOnly: true;
  readonly liveReadinessLookupAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface ApprovalDenialContract {
  readonly approvalDenialContractId: string;
  readonly approvalDeniedByDefault: true;
  readonly automaticApprovalBlocked: true;
  readonly unlockBlocked: true;
  readonly reasonCodes: readonly string[];
}

export interface DossierReevaluationLinkage {
  readonly reevaluationLinkageId: string;
  readonly sourceReevaluationPhase: 88;
  readonly sourceReevaluationFixtureRefs: readonly RiskFeedbackSafetyGateReevaluationName[];
  readonly linkageStatus: DossierLinkStatus;
  readonly liveGateStatusFetchAllowed: false;
}

export interface DossierFeedbackLinkage {
  readonly feedbackLinkageId: string;
  readonly sourceFeedbackPhase: 87;
  readonly sourceFeedbackFixtureRefs: readonly OutcomeRiskFeedbackContractName[];
  readonly linkageStatus: DossierLinkStatus;
  readonly liveFeedbackLookupAllowed: false;
}

export interface DossierRiskLinkage {
  readonly riskLinkageId: string;
  readonly sourceRiskPhases: readonly (58 | 59)[];
  readonly sourceRiskRefs: readonly RiskExplanationEvidenceName[];
  readonly linkageStatus: DossierLinkStatus;
  readonly liveRiskUpdateAllowed: false;
}

export interface DossierOutcomeLinkage {
  readonly outcomeLinkageId: string;
  readonly sourceOutcomePhase: 86;
  readonly sourceOutcomeRefs: readonly ExecutionOutcomeAuditContractName[];
  readonly linkageStatus: DossierLinkStatus;
  readonly liveOutcomeLookupAllowed: false;
}

export interface DossierCertificationLinkage {
  readonly certificationLinkageId: string;
  readonly sourceCertPhases: readonly (75 | 69)[];
  readonly sourceCertRefs: readonly (PreLiveSafetyCertificationName | LiveSmokeSafetyCertificationName)[];
  readonly linkageStatus: DossierLinkStatus;
  readonly liveCertificationLookupAllowed: false;
}

export interface DossierAuditTrailLinkage {
  readonly auditTrailLinkageId: string;
  readonly sourceAuditPhases: readonly (86 | 79 | 80)[];
  readonly sourceAuditRefs: readonly string[];
  readonly linkageStatus: DossierLinkStatus;
  readonly mutableAuditTrail: false;
}

export interface DossierAbortContract {
  readonly abortContractId: string;
  readonly abortRequired: true;
  readonly scheduledTimersAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface DossierRollbackContract {
  readonly rollbackContractId: string;
  readonly rollbackRequired: true;
  readonly scheduledTimersAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface DossierSafetyInvariants {
  readonly safetyInvariantsId: string;
  readonly failClosed: true;
  readonly approvalAuthority: false;
  readonly unlockAuthority: false;
  readonly automaticApprovalAllowed: false;
  readonly automaticUnlockAllowed: false;
  readonly liveReviewerLookupAllowed: false;
  readonly liveRiskUpdateAllowed: false;
  readonly liveFeedbackLookupAllowed: false;
  readonly liveGateStatusFetchAllowed: false;
  readonly liveOutcomeLookupAllowed: false;
  readonly networkReadAllowed: false;
  readonly pollingAllowed: false;
  readonly subscriptionAllowed: false;
  readonly retryRuntimeAllowed: false;
  readonly sendingAllowed: false;
  readonly dispatchAllowed: false;
  readonly signingAllowed: false;
  readonly walletLogicAllowed: false;
  readonly persistenceAllowed: false;
  readonly invariantsEnforced: true;
}

export interface DossierCapabilityAudit {
  readonly capabilityAuditId: string;
  readonly phase: typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE;
  readonly auditScore: number;
  readonly passedChecks: readonly string[];
  readonly failedChecks: readonly string[];
  readonly auditPassed: boolean;
}

export interface DossierScorecard {
  readonly scorecardId: string;
  readonly phase: typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE;
  readonly score: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly safetyConfirmed: true;
  readonly deterministicOnly: true;
}

export interface DossierReport {
  readonly reportId: string;
  readonly phase: typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE;
  readonly gateSummary: string;
  readonly headerSummary: string;
  readonly checklistSummary: string;
  readonly evidenceSummary: string;
  readonly signoffSummary: string;
  readonly blockerSummary: string;
  readonly approvalDenialSummary: string;
  readonly linkageSummary: string;
  readonly safetySummary: string;
}

export interface SafetyGateManualReviewDossierFixture {
  readonly fixtureId: string;
  readonly fixtureName: SafetyGateManualReviewDossierName;
  readonly fixtureKind: SafetyGateManualReviewDossierKind;
  readonly phase: typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE;
  readonly schemaVersion: typeof PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION;
  readonly dossierGate: DossierGate;
  readonly reviewDossierHeader: ReviewDossierHeader;
  readonly reviewerChecklist: ReviewerChecklist;
  readonly evidencePacket: EvidencePacket;
  readonly signoffPlaceholder: SignoffPlaceholder;
  readonly unresolvedBlockerSummary: UnresolvedBlockerSummary;
  readonly escalationReviewPlaceholder: EscalationReviewPlaceholder;
  readonly policyReviewPlaceholder: PolicyReviewPlaceholder;
  readonly readinessReviewPlaceholder: ReadinessReviewPlaceholder;
  readonly approvalDenialContract: ApprovalDenialContract;
  readonly reevaluationLinkage: DossierReevaluationLinkage;
  readonly feedbackLinkage: DossierFeedbackLinkage;
  readonly riskLinkage: DossierRiskLinkage;
  readonly outcomeLinkage: DossierOutcomeLinkage;
  readonly certificationLinkage: DossierCertificationLinkage;
  readonly auditTrailLinkage: DossierAuditTrailLinkage;
  readonly abortContract: DossierAbortContract;
  readonly rollbackContract: DossierRollbackContract;
  readonly safetyInvariants: DossierSafetyInvariants;
  readonly capabilityAudit: DossierCapabilityAudit;
  readonly scorecard: DossierScorecard;
  readonly report: DossierReport;
  readonly capabilities: SafetyGateManualReviewDossierCapabilities;
  readonly sourcePhase58FixtureSnapshot: readonly LaunchRiskEngineAssessmentName[];
  readonly sourcePhase59FixtureSnapshot: readonly RiskExplanationEvidenceName[];
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
  readonly sourcePhase80FixtureSnapshot: readonly LiveSnapshotFixturePromotionReviewName[];
  readonly sourcePhase81FixtureSnapshot: readonly ManualConfirmExecutionBoundaryName[];
  readonly sourcePhase82FixtureSnapshot: readonly TransactionConstructionContractMockName[];
  readonly sourcePhase83FixtureSnapshot: readonly SigningBoundarySafetyContractName[];
  readonly sourcePhase84FixtureSnapshot: readonly TransactionSendBoundarySafetyContractName[];
  readonly sourcePhase85FixtureSnapshot: readonly PostSendObservationBoundaryName[];
  readonly sourcePhase86FixtureSnapshot: readonly ExecutionOutcomeAuditContractName[];
  readonly sourcePhase87FixtureSnapshot: readonly OutcomeRiskFeedbackContractName[];
  readonly sourcePhase88FixtureSnapshot: readonly RiskFeedbackSafetyGateReevaluationName[];
  readonly sourceRefs: {
    readonly phase58FixtureId: string;
    readonly phase59FixtureId: string;
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
    readonly phase80FixtureId: string;
    readonly phase81FixtureId: string;
    readonly phase82FixtureId: string;
    readonly phase83FixtureId: string;
    readonly phase84FixtureId: string;
    readonly phase85FixtureId: string;
    readonly phase86FixtureId: string;
    readonly phase87FixtureId: string;
    readonly phase88FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT;
    readonly source: typeof PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SOURCE;
    readonly version: typeof PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_VERSION;
    readonly phase: typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noApprovalAuthority: true;
    readonly noAutomaticApproval: true;
    readonly noAutomaticUnlock: true;
    readonly noSafetyGateMutation: true;
    readonly noBlockerClearing: true;
    readonly noLiveReviewerLookup: true;
    readonly noLiveRiskFeedbackGateOutcomeLookup: true;
    readonly noNetworkRead: true;
    readonly noPollingOrSubscriptions: true;
    readonly noRetryRuntime: true;
    readonly noScheduledJobs: true;
    readonly noSendingDispatchSigningExecution: true;
    readonly noFilesystemWrites: true;
    readonly noPersistence: true;
    readonly nonAdvisory: true;
  };
  readonly checksum: string;
}

export interface SafetyGateManualReviewDossierValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface SafetyGateManualReviewDossierValidationResult {
  readonly valid: boolean;
  readonly issues: readonly SafetyGateManualReviewDossierValidationIssue[];
}

export interface SafetyGateManualReviewDossierSafetyResult {
  readonly safe: boolean;
  readonly issues: readonly SafetyGateManualReviewDossierValidationIssue[];
}

export interface SafetyGateManualReviewDossierApiContract {
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

export interface SafetyGateManualReviewDossierViewModel {
  readonly viewModelId: string;
  readonly fixtureName: SafetyGateManualReviewDossierName;
  readonly phase: typeof SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE;
  readonly gateStatus: DossierGateStatus;
  readonly safetyConfirmed: true;
  readonly deterministicOnly: true;
  readonly failClosed: true;
}

export interface SafetyGateManualReviewDossierCapabilities {
  readonly safetyGateManualReviewDossierContracts: true;
  readonly deterministicManualReviewDossierFixtures: true;
  readonly dossierGates: true;
  readonly reviewDossierHeaders: true;
  readonly reviewerChecklists: true;
  readonly evidencePackets: true;
  readonly signoffPlaceholders: true;
  readonly unresolvedBlockerSummaries: true;
  readonly escalationReviewPlaceholders: true;
  readonly policyReviewPlaceholders: true;
  readonly readinessReviewPlaceholders: true;
  readonly approvalDenialContracts: true;
  readonly dossierReevaluationLinkage: true;
  readonly dossierFeedbackLinkage: true;
  readonly dossierRiskLinkage: true;
  readonly dossierOutcomeLinkage: true;
  readonly dossierCertificationLinkage: true;
  readonly dossierAuditTrailLinkage: true;
  readonly dossierAbortContracts: true;
  readonly dossierRollbackContracts: true;
  readonly dossierSafetyInvariants: true;
  readonly dossierCapabilityAudits: true;
  readonly dossierScorecards: true;
  readonly dossierReports: true;
  readonly dossierViewModels: true;
  readonly dossierApiContracts: true;
  readonly dossierSelectors: true;
  readonly dossierRuntimeDossierGeneration: false;
  readonly dossierApprovalAuthority: false;
  readonly dossierUnlockAuthority: false;
  readonly dossierAutomaticApproval: false;
  readonly dossierAutomaticUnlock: false;
  readonly dossierAutomaticGateMutation: false;
  readonly dossierAutomaticBlockerClear: false;
  readonly dossierLiveReviewerLookup: false;
  readonly dossierLiveRiskUpdate: false;
  readonly dossierLiveFeedbackLookup: false;
  readonly dossierLiveGateStatusFetch: false;
  readonly dossierNetworkRead: false;
  readonly dossierPollingRuntime: false;
  readonly dossierSubscriptionRuntime: false;
  readonly dossierRetryRuntime: false;
  readonly dossierScheduledTimers: false;
  readonly dossierLiveTrading: false;
  readonly dossierLimitedLiveUnlock: false;
  readonly dossierFullAutoUnlock: false;
  readonly dossierSending: false;
  readonly dossierDispatch: false;
  readonly dossierSigning: false;
  readonly dossierWalletLogic: false;
  readonly dossierPrivateKeyHandling: false;
  readonly dossierKeypairHandling: false;
  readonly dossierSeedPhraseHandling: false;
  readonly dossierMnemonicHandling: false;
  readonly dossierOrderCreation: false;
  readonly dossierRuntimeExecution: false;
  readonly dossierTradingSignals: false;
  readonly dossierRecommendations: false;
  readonly dossierInvestmentAdvice: false;
  readonly dossierRealOrders: false;
  readonly dossierRealFunds: false;
  readonly dossierRealPnL: false;
  readonly dossierLiveNetworkDefault: false;
  readonly dossierRuntimeMonitoring: false;
  readonly dossierRuntimeCollectors: false;
  readonly dossierProviderExpansion: false;
  readonly dossierSecretsRequired: false;
  readonly dossierApiKeyRequired: false;
  readonly dossierFilesystemWrites: false;
  readonly dossierPersistence: false;
  readonly dossierRouteHandlers: false;
  readonly dossierRuntimeRequests: false;
  readonly dossierUiRendering: false;
  readonly dossierDomAccess: false;
  readonly dossierBackgroundJobs: false;
  readonly dossierAutomaticPromotion: false;
}

export interface BuildSafetyGateManualReviewDossierFixtureInput {
  readonly fixtureName: SafetyGateManualReviewDossierName;
}

export type {
  ControlledLiveSmokeHarnessName,
  CrossProviderDataQualityName,
  ExecutionOutcomeAuditContractName,
  FirstReadOnlyProviderAdapterName,
  HistoricalSnapshotScenarioGeneratorName,
  LaunchRiskEngineAssessmentName,
  LiveSmokeSafetyCertificationName,
  LiveSnapshotFixturePromotionReviewName,
  LiveSnapshotReplayParityAuditName,
  ManualConfirmDryRunControlName,
  ManualConfirmExecutionBoundaryName,
  ManualConfirmLiveReadinessName,
  MultiProviderReadOnlyFoundationName,
  OutcomeRiskFeedbackContractName,
  PostSendObservationBoundaryName,
  PreLiveSafetyCertificationName,
  ProviderAwareReplayImportContractName,
  ProviderAwareReplayScenarioName,
  ProviderReliabilityDriftAuditName,
  ReadOnlyLiveSnapshotCaptureName,
  RiskExplanationEvidenceName,
  RiskFeedbackSafetyGateReevaluationName,
  SigningBoundarySafetyContractName,
  TransactionConstructionContractMockName,
  TransactionSendBoundarySafetyContractName,
};
