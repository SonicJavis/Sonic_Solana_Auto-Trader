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
import type { SigningBoundarySafetyContractName } from '../signing-boundary-safety-contracts/types.js';
import type { TransactionConstructionContractMockName } from '../transaction-construction-contract-mocks/types.js';
import type { TransactionSendBoundarySafetyContractName } from '../transaction-send-boundary-safety/types.js';

export const RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE = 88 as const;
export const PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_GENERATED_AT =
  '2026-05-16T00:00:00.000Z' as const;
export const PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SOURCE =
  'phase88_risk_feedback_safety_gate_reevaluation_contracts_v1' as const;
export const PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_VERSION = '1.0.0' as const;
export const PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SCHEMA_VERSION = '1.0.0' as const;

export const RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES = [
  'reevaluation-design-ready',
  'missing-feedback-loop-blocked',
  'missing-safety-gate-ref-blocked',
  'automatic-gate-mutation-denied',
  'automatic-unlock-denied',
  'manual-review-required',
  'evidence-review-incomplete-blocked',
  'unsafe-capability-rejected',
] as const;

export const RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS = [
  'reevaluation_design_ready',
  'missing_feedback_loop_blocked',
  'missing_safety_gate_ref_blocked',
  'automatic_gate_mutation_denied',
  'automatic_unlock_denied',
  'manual_review_required',
  'evidence_review_incomplete_blocked',
  'unsafe_capability_rejected',
] as const;

export const REEVALUATION_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;
export const REEVALUATION_REVIEW_STATUSES = ['pending', 'in_review', 'approved', 'denied'] as const;
export const REEVALUATION_LINK_STATUSES = ['linked', 'warning', 'blocked'] as const;

export type RiskFeedbackSafetyGateReevaluationName =
  (typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES)[number];
export type RiskFeedbackSafetyGateReevaluationKind =
  (typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS)[number];
export type ReevaluationGateStatus = (typeof REEVALUATION_GATE_STATUSES)[number];
export type ReevaluationReviewStatus = (typeof REEVALUATION_REVIEW_STATUSES)[number];
export type ReevaluationLinkStatus = (typeof REEVALUATION_LINK_STATUSES)[number];

export interface ReevaluationGate {
  readonly reevaluationGateId: string;
  readonly reevaluationGateName: string;
  readonly phase: typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE;
  readonly gateStatus: ReevaluationGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly automaticGateMutationAllowed: false;
  readonly automaticUnlockAllowed: false;
  readonly liveRiskUpdateAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface FeedbackReviewEvent {
  readonly feedbackReviewEventId: string;
  readonly placeholderOnly: true;
  readonly sourceFeedbackFixtureRef: string;
  readonly liveFeedbackLookupAllowed: false;
  readonly manualReviewRequired: true;
  readonly reasonCodes: readonly string[];
}

export interface SafetyGateReevaluationLink {
  readonly safetyGateReevaluationLinkId: string;
  readonly sourceSafetyGateRef: string;
  readonly sourceFeedbackFixtureRef: string;
  readonly gateMutationAllowed: false;
  readonly automaticStatusChangeAllowed: false;
  readonly linkStatus: ReevaluationLinkStatus;
}

export interface ManualReviewPlaceholder {
  readonly manualReviewPlaceholderId: string;
  readonly manualReviewRequired: true;
  readonly reviewAuthorizesUnlock: false;
  readonly separateFuturePhaseRequired: true;
  readonly reviewStatus: ReevaluationReviewStatus;
}

export interface GateStatusPlaceholder {
  readonly gateStatusPlaceholderId: string;
  readonly deterministicLabelOnly: true;
  readonly liveGateStatusFetched: false;
  readonly gateStatusMutationProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface BlockerReviewContract {
  readonly blockerReviewContractId: string;
  readonly blockersPreserved: true;
  readonly automaticEscalationAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface EscalationContract {
  readonly escalationContractId: string;
  readonly escalationModeled: true;
  readonly automaticEscalationAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface EvidenceReviewBundle {
  readonly evidenceReviewBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly feedbackRefs: readonly string[];
  readonly riskRefs: readonly string[];
  readonly outcomeRefs: readonly string[];
  readonly certificationRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface PolicyCheckPlaceholder {
  readonly policyCheckPlaceholderId: string;
  readonly deterministicOnly: true;
  readonly livePolicyFetchAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface ReadinessImpactPlaceholder {
  readonly readinessImpactPlaceholderId: string;
  readonly deterministicLabelOnly: true;
  readonly liveReadinessFetchAllowed: false;
  readonly readinessImpactProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface ReevaluationAbortContract {
  readonly abortContractId: string;
  readonly reevaluationAbortRequired: true;
  readonly scheduledTimersAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface ReevaluationRollbackContract {
  readonly rollbackContractId: string;
  readonly reevaluationRollbackRequired: true;
  readonly scheduledTimersAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface ReevaluationSafetyInvariants {
  readonly safetyInvariantsId: string;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly automaticGateMutationAllowed: false;
  readonly automaticUnlockAllowed: false;
  readonly liveRiskUpdateAllowed: false;
  readonly liveGateStatusFetched: false;
  readonly networkReadAllowed: false;
  readonly sendingAllowed: false;
  readonly signingAllowed: false;
  readonly persistenceAllowed: false;
  readonly invariantsEnforced: true;
}

export interface ReevaluationCapabilityAudit {
  readonly capabilityAuditId: string;
  readonly phase: typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE;
  readonly auditScore: number;
  readonly passedChecks: readonly string[];
  readonly failedChecks: readonly string[];
  readonly auditPassed: boolean;
}

export interface ReevaluationScorecard {
  readonly scorecardId: string;
  readonly phase: typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE;
  readonly score: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly safetyConfirmed: true;
  readonly deterministicOnly: true;
}

export interface ReevaluationReport {
  readonly reportId: string;
  readonly phase: typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE;
  readonly gateSummary: string;
  readonly feedbackReviewSummary: string;
  readonly safetyGateLinkSummary: string;
  readonly manualReviewSummary: string;
  readonly gateStatusSummary: string;
  readonly blockerEscalationSummary: string;
  readonly evidenceSummary: string;
  readonly safetySummary: string;
}

export interface ReevaluationFeedbackLinkage {
  readonly feedbackLinkageId: string;
  readonly sourceFeedbackPhase: 87;
  readonly sourceFeedbackFixtureRefs: readonly OutcomeRiskFeedbackContractName[];
  readonly feedbackLinkStatus: ReevaluationLinkStatus;
  readonly liveFeedbackUpdateAllowed: false;
}

export interface ReevaluationRiskLinkage {
  readonly riskLinkageId: string;
  readonly sourceRiskPhases: readonly (58 | 59)[];
  readonly sourceRiskRefs: readonly RiskExplanationEvidenceName[];
  readonly riskLinkStatus: ReevaluationLinkStatus;
  readonly liveRiskUpdateAllowed: false;
}

export interface ReevaluationOutcomeLinkage {
  readonly outcomeLinkageId: string;
  readonly sourceOutcomePhase: 86;
  readonly sourceOutcomeRefs: readonly ExecutionOutcomeAuditContractName[];
  readonly outcomeLinkStatus: ReevaluationLinkStatus;
  readonly liveOutcomeLookupAllowed: false;
}

export interface ReevaluationCertificationLinkage {
  readonly certificationLinkageId: string;
  readonly sourceCertPhases: readonly (75 | 69)[];
  readonly sourceCertRefs: readonly (PreLiveSafetyCertificationName | LiveSmokeSafetyCertificationName)[];
  readonly certLinkStatus: ReevaluationLinkStatus;
  readonly liveCertFetchAllowed: false;
}

export interface RiskFeedbackSafetyGateReevaluationFixture {
  readonly fixtureId: string;
  readonly fixtureName: RiskFeedbackSafetyGateReevaluationName;
  readonly fixtureKind: RiskFeedbackSafetyGateReevaluationKind;
  readonly phase: typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE;
  readonly schemaVersion: typeof PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SCHEMA_VERSION;
  readonly reevaluationGate: ReevaluationGate;
  readonly feedbackReviewEvent: FeedbackReviewEvent;
  readonly safetyGateReevaluationLink: SafetyGateReevaluationLink;
  readonly manualReviewPlaceholder: ManualReviewPlaceholder;
  readonly gateStatusPlaceholder: GateStatusPlaceholder;
  readonly blockerReviewContract: BlockerReviewContract;
  readonly escalationContract: EscalationContract;
  readonly evidenceReviewBundle: EvidenceReviewBundle;
  readonly policyCheckPlaceholder: PolicyCheckPlaceholder;
  readonly readinessImpactPlaceholder: ReadinessImpactPlaceholder;
  readonly feedbackLinkage: ReevaluationFeedbackLinkage;
  readonly riskLinkage: ReevaluationRiskLinkage;
  readonly outcomeLinkage: ReevaluationOutcomeLinkage;
  readonly certificationLinkage: ReevaluationCertificationLinkage;
  readonly abortContract: ReevaluationAbortContract;
  readonly rollbackContract: ReevaluationRollbackContract;
  readonly safetyInvariants: ReevaluationSafetyInvariants;
  readonly capabilityAudit: ReevaluationCapabilityAudit;
  readonly scorecard: ReevaluationScorecard;
  readonly report: ReevaluationReport;
  readonly capabilities: RiskFeedbackSafetyGateReevaluationCapabilities;
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
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_GENERATED_AT;
    readonly source: typeof PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SOURCE;
    readonly version: typeof PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_VERSION;
    readonly phase: typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noAutomaticGateMutation: true;
    readonly noAutomaticUnlock: true;
    readonly noLiveRiskUpdate: true;
    readonly noLiveFeedbackLookup: true;
    readonly noLiveGateStatusFetch: true;
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

export interface RiskFeedbackSafetyGateReevaluationValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface RiskFeedbackSafetyGateReevaluationValidationResult {
  readonly valid: boolean;
  readonly issues: readonly RiskFeedbackSafetyGateReevaluationValidationIssue[];
}

export interface RiskFeedbackSafetyGateReevaluationSafetyResult {
  readonly safe: boolean;
  readonly issues: readonly RiskFeedbackSafetyGateReevaluationValidationIssue[];
}

export interface RiskFeedbackSafetyGateReevaluationApiContract {
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

export interface RiskFeedbackSafetyGateReevaluationViewModel {
  readonly viewModelId: string;
  readonly fixtureName: RiskFeedbackSafetyGateReevaluationName;
  readonly phase: typeof RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE;
  readonly gateStatus: ReevaluationGateStatus;
  readonly safetyConfirmed: true;
  readonly deterministicOnly: true;
  readonly failClosed: true;
}

export interface RiskFeedbackSafetyGateReevaluationCapabilities {
  // Positive capabilities
  readonly riskFeedbackSafetyGateReevaluationContracts: true;
  readonly deterministicRiskFeedbackReevaluationFixtures: true;
  readonly reevaluationGates: true;
  readonly feedbackReviewEvents: true;
  readonly safetyGateReevaluationLinks: true;
  readonly manualReviewPlaceholders: true;
  readonly gateStatusPlaceholders: true;
  readonly blockerReviewContracts: true;
  readonly escalationContracts: true;
  readonly evidenceReviewBundles: true;
  readonly policyCheckPlaceholders: true;
  readonly readinessImpactPlaceholders: true;
  readonly reevaluationFeedbackLinkage: true;
  readonly reevaluationRiskLinkage: true;
  readonly reevaluationOutcomeLinkage: true;
  readonly reevaluationCertificationLinkage: true;
  readonly reevaluationAbortContracts: true;
  readonly reevaluationRollbackContracts: true;
  readonly reevaluationSafetyInvariants: true;
  readonly reevaluationCapabilityAudits: true;
  readonly reevaluationScorecards: true;
  readonly reevaluationReports: true;
  readonly reevaluationViewModels: true;
  readonly reevaluationApiContracts: true;
  readonly reevaluationSelectors: true;
  // Negative capabilities
  readonly reevaluationRuntimeReevaluation: false;
  readonly reevaluationLiveGateMutation: false;
  readonly reevaluationAutomaticGateMutation: false;
  readonly reevaluationAutomaticUnlock: false;
  readonly reevaluationLiveRiskUpdate: false;
  readonly reevaluationLiveFeedbackLookup: false;
  readonly reevaluationLiveGateStatusFetch: false;
  readonly reevaluationNetworkRead: false;
  readonly reevaluationPollingRuntime: false;
  readonly reevaluationSubscriptionRuntime: false;
  readonly reevaluationRetryRuntime: false;
  readonly reevaluationScheduledTimers: false;
  readonly reevaluationUnlockAuthority: false;
  readonly reevaluationLiveTrading: false;
  readonly reevaluationLimitedLiveUnlock: false;
  readonly reevaluationFullAutoUnlock: false;
  readonly reevaluationSending: false;
  readonly reevaluationDispatch: false;
  readonly reevaluationSigning: false;
  readonly reevaluationWalletLogic: false;
  readonly reevaluationPrivateKeyHandling: false;
  readonly reevaluationKeypairHandling: false;
  readonly reevaluationSeedPhraseHandling: false;
  readonly reevaluationMnemonicHandling: false;
  readonly reevaluationOrderCreation: false;
  readonly reevaluationRuntimeExecution: false;
  readonly reevaluationTradingSignals: false;
  readonly reevaluationRecommendations: false;
  readonly reevaluationInvestmentAdvice: false;
  readonly reevaluationRealOrders: false;
  readonly reevaluationRealFunds: false;
  readonly reevaluationRealPnL: false;
  readonly reevaluationLiveNetworkDefault: false;
  readonly reevaluationRuntimeMonitoring: false;
  readonly reevaluationRuntimeCollectors: false;
  readonly reevaluationProviderExpansion: false;
  readonly reevaluationSecretsRequired: false;
  readonly reevaluationFilesystemWrites: false;
  readonly reevaluationPersistence: false;
  readonly reevaluationRouteHandlers: false;
  readonly reevaluationRuntimeRequests: false;
  readonly reevaluationUiRendering: false;
  readonly reevaluationDomAccess: false;
  readonly reevaluationBackgroundJobs: false;
  readonly reevaluationAutomaticPromotion: false;
}

export interface BuildRiskFeedbackSafetyGateReevaluationFixtureInput {
  readonly fixtureName: RiskFeedbackSafetyGateReevaluationName;
}

// Source phase name types (used in refs)
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
  SigningBoundarySafetyContractName,
  TransactionConstructionContractMockName,
  TransactionSendBoundarySafetyContractName,
};
