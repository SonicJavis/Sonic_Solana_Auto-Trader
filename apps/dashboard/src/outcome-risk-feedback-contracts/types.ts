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

export const OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE = 87 as const;
export const PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT =
  '2026-05-16T00:00:00.000Z' as const;
export const PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SOURCE =
  'phase87_outcome_risk_feedback_loop_contracts_v1' as const;
export const PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_VERSION = '1.0.0' as const;
export const PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SCHEMA_VERSION = '1.0.0' as const;

export const OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES = [
  'feedback-loop-design-ready',
  'missing-outcome-audit-blocked',
  'missing-risk-evidence-blocked',
  'live-risk-update-denied',
  'safety-gate-mutation-denied',
  'risk-delta-live-computation-denied',
  'evidence-feedback-incomplete-blocked',
  'unsafe-capability-rejected',
] as const;

export const OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS = [
  'feedback_loop_design_ready',
  'missing_outcome_audit_blocked',
  'missing_risk_evidence_blocked',
  'live_risk_update_denied',
  'safety_gate_mutation_denied',
  'risk_delta_live_computation_denied',
  'evidence_feedback_incomplete_blocked',
  'unsafe_capability_rejected',
] as const;

export const FEEDBACK_LOOP_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;

export type OutcomeRiskFeedbackContractName = (typeof OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES)[number];
export type OutcomeRiskFeedbackContractKind = (typeof OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS)[number];
export type FeedbackLoopGateStatus = (typeof FEEDBACK_LOOP_GATE_STATUSES)[number];

export interface FeedbackLoopGate {
  readonly feedbackLoopGateId: string;
  readonly feedbackLoopGateName: string;
  readonly phase: typeof OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE;
  readonly gateStatus: FeedbackLoopGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly liveRiskUpdateAllowed: false;
  readonly automaticRiskMutationAllowed: false;
  readonly safetyGateMutationAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface OutcomeFeedbackEvent {
  readonly outcomeFeedbackEventId: string;
  readonly placeholderOnly: true;
  readonly sourceOutcomeAuditRef: string;
  readonly realOutcomeEventRequired: false;
  readonly liveOutcomeLookupAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface RiskFeedbackLink {
  readonly riskFeedbackLinkId: string;
  readonly sourceRiskFixtureRef: string;
  readonly sourceEvidenceFixtureRef: string;
  readonly sourceOutcomeAuditFixtureRef: string;
  readonly linkStatus: 'linked' | 'warning' | 'blocked';
  readonly liveRiskRefreshAllowed: false;
}

export interface RiskReassessmentPlaceholder {
  readonly riskReassessmentPlaceholderId: string;
  readonly deterministicLabelOnly: true;
  readonly liveReassessmentAllowed: false;
  readonly reassessmentOutputProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface SafetyGateFeedbackLink {
  readonly safetyGateFeedbackLinkId: string;
  readonly safetyGateMutationAllowed: false;
  readonly manualReviewRequired: true;
  readonly automaticUnlockAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface RiskDeltaPlaceholder {
  readonly riskDeltaPlaceholderId: string;
  readonly deltaComputedFromLiveData: false;
  readonly deterministicLabelOnly: true;
  readonly liveDeltaOutputProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface ConfidenceDeltaPlaceholder {
  readonly confidenceDeltaPlaceholderId: string;
  readonly deltaComputedFromLiveData: false;
  readonly deterministicLabelOnly: true;
  readonly liveDeltaOutputProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface EvidenceFeedbackBundle {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly outcomeAuditRefs: readonly string[];
  readonly riskEvidenceRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface FeedbackReplayLinkage {
  readonly feedbackReplayLinkageId: string;
  readonly sourceReplayFixtureRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface FeedbackOutcomeAuditLinkage {
  readonly feedbackOutcomeAuditLinkageId: string;
  readonly sourceOutcomeAuditRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface FeedbackObservationBoundaryLinkage {
  readonly feedbackObservationBoundaryLinkageId: string;
  readonly sourceObservationBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface FeedbackRiskEngineLinkage {
  readonly feedbackRiskEngineLinkageId: string;
  readonly sourceRiskEngineRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface FeedbackEvidenceModelLinkage {
  readonly feedbackEvidenceModelLinkageId: string;
  readonly sourceEvidenceModelRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface FeedbackAbortContract {
  readonly abortContractId: string;
  readonly abortModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface FeedbackRollbackContract {
  readonly rollbackContractId: string;
  readonly rollbackModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface FeedbackSafetyInvariants {
  readonly safetyInvariantId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly noLiveFeedback: true;
  readonly noLiveRiskUpdate: true;
}

export interface FeedbackBlocker {
  readonly blockerId: string;
  readonly blockerCode: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly blocking: boolean;
  readonly reason: string;
}

export interface FeedbackCapabilityAudit {
  readonly capabilityAuditId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly unlockAuthorityPresent: false;
  readonly liveFeedbackCapabilityPresent: false;
  readonly unsafeCapabilityDetected: boolean;
}

export interface FeedbackScorecard {
  readonly scorecardId: string;
  readonly auditScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly reviewRequired: boolean;
}

export interface OutcomeRiskFeedbackReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly outcomeFeedbackSummary: string;
  readonly riskLinkSummary: string;
  readonly reassessmentSummary: string;
  readonly safetyGateFeedbackSummary: string;
  readonly deltaSummary: string;
  readonly evidenceSummary: string;
  readonly safetySummary: string;
}

export interface OutcomeRiskFeedbackViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: OutcomeRiskFeedbackContractName;
  readonly gateStatus: FeedbackLoopGateStatus;
  readonly summary: string;
}

export interface OutcomeRiskFeedbackApiContract {
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

export interface OutcomeRiskFeedbackSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: OutcomeRiskFeedbackContractName;
  readonly fixtureKind?: OutcomeRiskFeedbackContractKind;
}

export interface OutcomeRiskFeedbackSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: OutcomeRiskFeedbackContractKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface OutcomeRiskFeedbackCapabilities {
  readonly outcomeRiskFeedbackContracts: true;
  readonly deterministicOutcomeRiskFeedbackFixtures: true;
  readonly feedbackLoopGates: true;
  readonly outcomeFeedbackEvents: true;
  readonly riskFeedbackLinks: true;
  readonly riskReassessmentPlaceholders: true;
  readonly safetyGateFeedbackLinks: true;
  readonly evidenceFeedbackBundles: true;
  readonly riskDeltaPlaceholders: true;
  readonly confidenceDeltaPlaceholders: true;
  readonly feedbackBlockerTaxonomy: true;
  readonly feedbackReplayLinkage: true;
  readonly feedbackOutcomeAuditLinkage: true;
  readonly feedbackObservationBoundaryLinkage: true;
  readonly feedbackRiskEngineLinkage: true;
  readonly feedbackEvidenceModelLinkage: true;
  readonly feedbackAbortContracts: true;
  readonly feedbackRollbackContracts: true;
  readonly feedbackSafetyInvariants: true;
  readonly feedbackCapabilityAudits: true;
  readonly feedbackScorecards: true;
  readonly feedbackReports: true;
  readonly feedbackViewModels: true;
  readonly feedbackApiContracts: true;
  readonly feedbackSelectors: true;
  readonly feedbackRuntimeFeedback: false;
  readonly feedbackLiveRiskUpdate: false;
  readonly feedbackAutomaticRiskMutation: false;
  readonly feedbackSafetyGateMutation: false;
  readonly feedbackAutomaticUnlock: false;
  readonly feedbackLiveOutcomeLookup: false;
  readonly feedbackLiveRiskRefresh: false;
  readonly feedbackLiveDeltaComputation: false;
  readonly feedbackNetworkRead: false;
  readonly feedbackPollingRuntime: false;
  readonly feedbackSubscriptionRuntime: false;
  readonly feedbackRetryRuntime: false;
  readonly feedbackScheduledTimers: false;
  readonly feedbackUnlockAuthority: false;
  readonly feedbackLiveTrading: false;
  readonly feedbackLimitedLiveUnlock: false;
  readonly feedbackFullAutoUnlock: false;
  readonly feedbackSending: false;
  readonly feedbackDispatch: false;
  readonly feedbackSigning: false;
  readonly feedbackWalletLogic: false;
  readonly feedbackPrivateKeyHandling: false;
  readonly feedbackKeypairHandling: false;
  readonly feedbackSeedPhraseHandling: false;
  readonly feedbackMnemonicHandling: false;
  readonly feedbackOrderCreation: false;
  readonly feedbackRuntimeExecution: false;
  readonly feedbackTradingSignals: false;
  readonly feedbackRecommendations: false;
  readonly feedbackInvestmentAdvice: false;
  readonly feedbackRealOrders: false;
  readonly feedbackRealFunds: false;
  readonly feedbackRealPnL: false;
  readonly feedbackLiveNetworkDefault: false;
  readonly feedbackRuntimeMonitoring: false;
  readonly feedbackRuntimeCollectors: false;
  readonly feedbackProviderExpansion: false;
  readonly feedbackSecretsRequired: false;
  readonly feedbackApiKeyRequired: false;
  readonly feedbackFilesystemWrites: false;
  readonly feedbackPersistence: false;
  readonly feedbackRouteHandlers: false;
  readonly feedbackRuntimeRequests: false;
  readonly feedbackUiRendering: false;
  readonly feedbackDomAccess: false;
  readonly feedbackBackgroundJobs: false;
  readonly feedbackAutomaticPromotion: false;
}

export interface OutcomeRiskFeedbackFixture {
  readonly fixtureId: string;
  readonly fixtureName: OutcomeRiskFeedbackContractName;
  readonly fixtureKind: OutcomeRiskFeedbackContractKind;
  readonly phase: typeof OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE;
  readonly schemaVersion: typeof PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SCHEMA_VERSION;
  readonly feedbackLoopGate: FeedbackLoopGate;
  readonly outcomeFeedbackEvent: OutcomeFeedbackEvent;
  readonly riskFeedbackLink: RiskFeedbackLink;
  readonly riskReassessmentPlaceholder: RiskReassessmentPlaceholder;
  readonly safetyGateFeedbackLink: SafetyGateFeedbackLink;
  readonly riskDeltaPlaceholder: RiskDeltaPlaceholder;
  readonly confidenceDeltaPlaceholder: ConfidenceDeltaPlaceholder;
  readonly evidenceBundle: EvidenceFeedbackBundle;
  readonly feedbackReplayLinkage: FeedbackReplayLinkage;
  readonly feedbackOutcomeAuditLinkage: FeedbackOutcomeAuditLinkage;
  readonly feedbackObservationBoundaryLinkage: FeedbackObservationBoundaryLinkage;
  readonly feedbackRiskEngineLinkage: FeedbackRiskEngineLinkage;
  readonly feedbackEvidenceModelLinkage: FeedbackEvidenceModelLinkage;
  readonly abortContract: FeedbackAbortContract;
  readonly rollbackContract: FeedbackRollbackContract;
  readonly safetyInvariants: FeedbackSafetyInvariants;
  readonly blocker: FeedbackBlocker;
  readonly capabilityAudit: FeedbackCapabilityAudit;
  readonly scorecard: FeedbackScorecard;
  readonly report: OutcomeRiskFeedbackReport;
  readonly viewModel: OutcomeRiskFeedbackViewModel;
  readonly apiContract: OutcomeRiskFeedbackApiContract;
  readonly selectorExamples: readonly OutcomeRiskFeedbackSelector[];
  readonly capabilities: OutcomeRiskFeedbackCapabilities;
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
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT;
    readonly source: typeof PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SOURCE;
    readonly version: typeof PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_VERSION;
    readonly phase: typeof OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveFeedback: true;
    readonly noLiveRiskUpdate: true;
    readonly noAutomaticRiskMutation: true;
    readonly noSafetyGateMutation: true;
    readonly noLiveOutcomeLookup: true;
    readonly noLiveRiskRefresh: true;
    readonly noLiveDeltaComputation: true;
    readonly noNetworkRead: true;
    readonly noPollingOrSubscriptions: true;
    readonly noRetryRuntime: true;
    readonly noScheduledJobs: true;
    readonly noSendingDispatchSigningExecution: true;
    readonly noFilesystemWrites: true;
    readonly noPersistence: true;
    readonly nonAdvisory: true;
  };
}

export interface BuildOutcomeRiskFeedbackFixtureInput {
  readonly fixtureName: OutcomeRiskFeedbackContractName;
}

export interface OutcomeRiskFeedbackValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface OutcomeRiskFeedbackValidationResult {
  readonly valid: boolean;
  readonly issues: readonly OutcomeRiskFeedbackValidationIssue[];
}

export interface OutcomeRiskFeedbackSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
