import type { ControlledLiveSmokeHarnessName } from '../controlled-live-smoke-harness/types.js';
import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
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
import type { SigningBoundarySafetyContractName } from '../signing-boundary-safety-contracts/types.js';
import type { TransactionConstructionContractMockName } from '../transaction-construction-contract-mocks/types.js';
import type { TransactionSendBoundarySafetyContractName } from '../transaction-send-boundary-safety/types.js';

export const EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE = 86 as const;
export const PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_GENERATED_AT = '2026-05-16T00:00:00.000Z' as const;
export const PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SOURCE =
  'phase86_execution_outcome_audit_contracts_v1' as const;
export const PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_VERSION = '1.0.0' as const;
export const PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SCHEMA_VERSION = '1.0.0' as const;

export const EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES = [
  'outcome-audit-design-ready',
  'missing-observation-boundary-blocked',
  'transaction-result-lookup-denied',
  'confirmation-outcome-denied',
  'finality-outcome-denied',
  'network-observation-denied',
  'audit-evidence-incomplete-blocked',
  'unsafe-capability-rejected',
] as const;

export const EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS = [
  'outcome_audit_design_ready',
  'missing_observation_boundary_blocked',
  'transaction_result_lookup_denied',
  'confirmation_outcome_denied',
  'finality_outcome_denied',
  'network_observation_denied',
  'audit_evidence_incomplete_blocked',
  'unsafe_capability_rejected',
] as const;

export const OUTCOME_AUDIT_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;

export type ExecutionOutcomeAuditContractName = (typeof EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES)[number];
export type ExecutionOutcomeAuditContractKind = (typeof EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS)[number];
export type OutcomeAuditGateStatus = (typeof OUTCOME_AUDIT_GATE_STATUSES)[number];

export interface OutcomeAuditGate {
  readonly outcomeAuditGateId: string;
  readonly outcomeAuditGateName: string;
  readonly phase: typeof EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE;
  readonly gateStatus: OutcomeAuditGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly liveOutcomeObservationAllowed: false;
  readonly transactionLookupAllowed: false;
  readonly confirmationLookupAllowed: false;
  readonly networkReadAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface OutcomeEventPlaceholder {
  readonly outcomeEventPlaceholderId: string;
  readonly placeholderOnly: true;
  readonly realOutcomeEventProduced: false;
  readonly transactionSignatureRequired: false;
  readonly reasonCodes: readonly string[];
}

export interface OutcomeStatusPlaceholder {
  readonly outcomeStatusPlaceholderId: string;
  readonly deterministicLabelOnly: true;
  readonly liveStatusFetched: false;
  readonly outcomeStatusProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface ConfirmationOutcomePlaceholder {
  readonly confirmationOutcomePlaceholderId: string;
  readonly deterministicLabelOnly: true;
  readonly liveConfirmationFetched: false;
  readonly reasonCodes: readonly string[];
}

export interface FinalityOutcomePlaceholder {
  readonly finalityOutcomePlaceholderId: string;
  readonly deterministicLabelOnly: true;
  readonly liveFinalityFetched: false;
  readonly reasonCodes: readonly string[];
}

export interface TransactionResultDenial {
  readonly transactionResultDenialId: string;
  readonly transactionLookupBlocked: true;
  readonly transactionResultProduced: false;
  readonly transactionMetaProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface NetworkObservationDenial {
  readonly networkObservationDenialId: string;
  readonly networkReadBlocked: true;
  readonly subscriptionBlocked: true;
  readonly pollingBlocked: true;
  readonly reasonCodes: readonly string[];
}

export interface OutcomeAuditEvidenceBundle {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface OutcomeObservationBoundaryLinkage {
  readonly observationBoundaryLinkageId: string;
  readonly sourceObservationBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface OutcomeSendBoundaryLinkage {
  readonly sendBoundaryLinkageId: string;
  readonly sourceSendBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface OutcomeSigningBoundaryLinkage {
  readonly signingBoundaryLinkageId: string;
  readonly sourceSigningBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface OutcomeConstructionLinkage {
  readonly constructionLinkageId: string;
  readonly sourceTransactionConstructionMockRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface OutcomeExecutionBoundaryLinkage {
  readonly executionBoundaryLinkageId: string;
  readonly sourceExecutionBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface OutcomeAbortContract {
  readonly abortContractId: string;
  readonly abortModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface OutcomeRollbackContract {
  readonly rollbackContractId: string;
  readonly rollbackModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface OutcomeSafetyInvariants {
  readonly safetyInvariantId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly noLiveOutcomeObservation: true;
}

export interface OutcomeBlocker {
  readonly blockerId: string;
  readonly blockerCode: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly blocking: boolean;
  readonly reason: string;
}

export interface OutcomeCapabilityAudit {
  readonly capabilityAuditId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly unlockAuthorityPresent: false;
  readonly liveOutcomeObservationCapabilityPresent: false;
  readonly unsafeCapabilityDetected: boolean;
}

export interface OutcomeScorecard {
  readonly scorecardId: string;
  readonly auditScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly reviewRequired: boolean;
}

export interface ExecutionOutcomeAuditReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly eventSummary: string;
  readonly statusSummary: string;
  readonly confirmationFinalitySummary: string;
  readonly transactionResultSummary: string;
  readonly networkObservationSummary: string;
  readonly linkageSummary: string;
  readonly evidenceSummary: string;
  readonly safetySummary: string;
}

export interface ExecutionOutcomeAuditViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ExecutionOutcomeAuditContractName;
  readonly gateStatus: OutcomeAuditGateStatus;
  readonly summary: string;
}

export interface ExecutionOutcomeAuditApiContract {
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

export interface ExecutionOutcomeAuditSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: ExecutionOutcomeAuditContractName;
  readonly fixtureKind?: ExecutionOutcomeAuditContractKind;
}

export interface ExecutionOutcomeAuditSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ExecutionOutcomeAuditContractKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface ExecutionOutcomeAuditCapabilities {
  readonly executionOutcomeAuditContracts: true;
  readonly deterministicExecutionOutcomeAuditFixtures: true;
  readonly outcomeAuditGates: true;
  readonly outcomeEventPlaceholders: true;
  readonly outcomeStatusPlaceholders: true;
  readonly confirmationOutcomePlaceholders: true;
  readonly finalityOutcomePlaceholders: true;
  readonly transactionResultDenialContracts: true;
  readonly networkObservationDenialContracts: true;
  readonly outcomeAuditEvidenceBundles: true;
  readonly outcomeLinkageContracts: true;
  readonly outcomeObservationBoundaryLinkage: true;
  readonly outcomeSendBoundaryLinkage: true;
  readonly outcomeSigningBoundaryLinkage: true;
  readonly outcomeConstructionLinkage: true;
  readonly outcomeExecutionBoundaryLinkage: true;
  readonly outcomeAbortContracts: true;
  readonly outcomeRollbackContracts: true;
  readonly outcomeSafetyInvariants: true;
  readonly outcomeBlockerTaxonomy: true;
  readonly outcomeCapabilityAudits: true;
  readonly outcomeScorecards: true;
  readonly outcomeReports: true;
  readonly outcomeViewModels: true;
  readonly outcomeApiContracts: true;
  readonly outcomeSelectors: true;
  readonly outcomeRuntimeObservation: false;
  readonly outcomeLiveTransactionLookup: false;
  readonly outcomeLiveConfirmationLookup: false;
  readonly outcomeLiveFinalityLookup: false;
  readonly outcomeNetworkRead: false;
  readonly outcomePollingRuntime: false;
  readonly outcomeSubscriptionRuntime: false;
  readonly outcomeRetryRuntime: false;
  readonly outcomeScheduledTimers: false;
  readonly outcomeUnlockAuthority: false;
  readonly outcomeLiveTrading: false;
  readonly outcomeLimitedLiveUnlock: false;
  readonly outcomeFullAutoUnlock: false;
  readonly outcomeSending: false;
  readonly outcomeDispatch: false;
  readonly outcomeSigning: false;
  readonly outcomeWalletLogic: false;
  readonly outcomePrivateKeyHandling: false;
  readonly outcomeKeypairHandling: false;
  readonly outcomeSeedPhraseHandling: false;
  readonly outcomeMnemonicHandling: false;
  readonly outcomeOrderCreation: false;
  readonly outcomeRuntimeExecution: false;
  readonly outcomeTradingSignals: false;
  readonly outcomeRecommendations: false;
  readonly outcomeInvestmentAdvice: false;
  readonly outcomeRealOrders: false;
  readonly outcomeRealFunds: false;
  readonly outcomeRealPnL: false;
  readonly outcomeLiveNetworkDefault: false;
  readonly outcomeRuntimeMonitoring: false;
  readonly outcomeRuntimeCollectors: false;
  readonly outcomeProviderExpansion: false;
  readonly outcomeSecretsRequired: false;
  readonly outcomeFilesystemWrites: false;
  readonly outcomePersistence: false;
  readonly outcomeRouteHandlers: false;
  readonly outcomeRuntimeRequests: false;
  readonly outcomeUiRendering: false;
  readonly outcomeDomAccess: false;
  readonly outcomeBackgroundJobs: false;
  readonly outcomeAutomaticPromotion: false;
}

export interface ExecutionOutcomeAuditFixture {
  readonly fixtureId: string;
  readonly fixtureName: ExecutionOutcomeAuditContractName;
  readonly fixtureKind: ExecutionOutcomeAuditContractKind;
  readonly phase: typeof EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE;
  readonly schemaVersion: typeof PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SCHEMA_VERSION;
  readonly auditGate: OutcomeAuditGate;
  readonly outcomeEventPlaceholder: OutcomeEventPlaceholder;
  readonly outcomeStatusPlaceholder: OutcomeStatusPlaceholder;
  readonly confirmationOutcomePlaceholder: ConfirmationOutcomePlaceholder;
  readonly finalityOutcomePlaceholder: FinalityOutcomePlaceholder;
  readonly transactionResultDenial: TransactionResultDenial;
  readonly networkObservationDenial: NetworkObservationDenial;
  readonly observationBoundaryLinkage: OutcomeObservationBoundaryLinkage;
  readonly sendBoundaryLinkage: OutcomeSendBoundaryLinkage;
  readonly signingBoundaryLinkage: OutcomeSigningBoundaryLinkage;
  readonly constructionLinkage: OutcomeConstructionLinkage;
  readonly executionBoundaryLinkage: OutcomeExecutionBoundaryLinkage;
  readonly abortContract: OutcomeAbortContract;
  readonly rollbackContract: OutcomeRollbackContract;
  readonly safetyInvariants: OutcomeSafetyInvariants;
  readonly evidenceBundle: OutcomeAuditEvidenceBundle;
  readonly blocker: OutcomeBlocker;
  readonly capabilityAudit: OutcomeCapabilityAudit;
  readonly scorecard: OutcomeScorecard;
  readonly report: ExecutionOutcomeAuditReport;
  readonly viewModel: ExecutionOutcomeAuditViewModel;
  readonly apiContract: ExecutionOutcomeAuditApiContract;
  readonly selectorExamples: readonly ExecutionOutcomeAuditSelector[];
  readonly capabilities: ExecutionOutcomeAuditCapabilities;
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
    readonly phase80FixtureId: string;
    readonly phase81FixtureId: string;
    readonly phase82FixtureId: string;
    readonly phase83FixtureId: string;
    readonly phase84FixtureId: string;
    readonly phase85FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_GENERATED_AT;
    readonly source: typeof PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SOURCE;
    readonly version: typeof PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_VERSION;
    readonly phase: typeof EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveOutcomeObservation: true;
    readonly noTransactionLookup: true;
    readonly noConfirmationLookup: true;
    readonly noNetworkRead: true;
    readonly noPollingOrSubscriptions: true;
    readonly noRetryRuntime: true;
    readonly noSendingDispatchSigningExecution: true;
    readonly noFilesystemWrites: true;
    readonly noPersistence: true;
    readonly noScheduledJobs: true;
    readonly nonAdvisory: true;
  };
}

export interface BuildExecutionOutcomeAuditFixtureInput {
  readonly fixtureName: ExecutionOutcomeAuditContractName;
}

export interface ExecutionOutcomeAuditValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ExecutionOutcomeAuditValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ExecutionOutcomeAuditValidationIssue[];
}

export interface ExecutionOutcomeAuditSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
