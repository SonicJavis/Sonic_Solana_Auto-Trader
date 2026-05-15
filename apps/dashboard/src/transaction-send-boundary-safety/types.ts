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
import type { PreLiveSafetyCertificationName } from '../pre-live-safety-certification/types.js';
import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';
import type { ReadOnlyLiveSnapshotCaptureName } from '../read-only-live-snapshot-capture/types.js';
import type { SigningBoundarySafetyContractName } from '../signing-boundary-safety-contracts/types.js';
import type { TransactionConstructionContractMockName } from '../transaction-construction-contract-mocks/types.js';

export const TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE = 84 as const;
export const PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_GENERATED_AT = '2026-05-15T00:00:00.000Z' as const;
export const PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SOURCE =
  'phase84_transaction_send_boundary_safety_contracts_v1' as const;
export const PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_VERSION = '1.0.0' as const;
export const PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SCHEMA_VERSION = '1.0.0' as const;

export const TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES = [
  'send-boundary-design-ready',
  'missing-signing-boundary-blocked',
  'send-request-denied',
  'network-submit-denied',
  'broadcast-denied',
  'dispatch-denied',
  'preflight-retry-confirmation-denied',
  'unsafe-capability-rejected',
] as const;

export const TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS = [
  'send_boundary_design_ready',
  'missing_signing_boundary_blocked',
  'send_request_denied',
  'network_submit_denied',
  'broadcast_denied',
  'dispatch_denied',
  'preflight_retry_confirmation_denied',
  'unsafe_capability_rejected',
] as const;

export const SEND_BOUNDARY_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;
export const SEND_APPROVAL_STATUSES = ['required', 'pending', 'recorded', 'rejected'] as const;

export type TransactionSendBoundarySafetyContractName = (typeof TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES)[number];
export type TransactionSendBoundarySafetyContractKind = (typeof TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS)[number];
export type SendBoundaryGateStatus = (typeof SEND_BOUNDARY_GATE_STATUSES)[number];
export type SendApprovalStatus = (typeof SEND_APPROVAL_STATUSES)[number];

export interface SendBoundaryGate {
  readonly sendBoundaryGateId: string;
  readonly sendBoundaryGateName: string;
  readonly phase: typeof TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE;
  readonly gateStatus: SendBoundaryGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly sendingAllowed: false;
  readonly networkSubmitAllowed: false;
  readonly broadcastAllowed: false;
  readonly dispatchAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface SendRequestDenial {
  readonly sendRequestDenialId: string;
  readonly sendRequestBlocked: true;
  readonly sendTransactionBlocked: true;
  readonly sendRawTransactionBlocked: true;
  readonly transactionIdProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface NetworkSubmitDenial {
  readonly networkSubmitDenialId: string;
  readonly networkSubmitBlocked: true;
  readonly rpcWriteBlocked: true;
  readonly endpointSubmitBlocked: true;
  readonly reasonCodes: readonly string[];
}

export interface BroadcastDenial {
  readonly broadcastDenialId: string;
  readonly broadcastBlocked: true;
  readonly mempoolBroadcastAllowed: false;
  readonly bundleSubmitAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface DispatchDenial {
  readonly dispatchDenialId: string;
  readonly dispatchBlocked: true;
  readonly queueDispatchAllowed: false;
  readonly workerDispatchAllowed: false;
  readonly routeDispatchAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface PreflightDenialPlaceholder {
  readonly preflightDenialId: string;
  readonly livePreflightAllowed: false;
  readonly simulationAgainstLiveRpcAllowed: false;
  readonly preflightResultProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface SignedPayloadDenial {
  readonly signedPayloadDenialId: string;
  readonly signatureOutputProduced: false;
  readonly signedPayloadProduced: false;
  readonly signedTransactionPayloadProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface RetryDenialContract {
  readonly retryDenialId: string;
  readonly retryRuntimeAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface ConfirmationDenialContract {
  readonly confirmationDenialId: string;
  readonly confirmationPollingAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface SendOperatorApprovalBoundary {
  readonly approvalBoundaryId: string;
  readonly manualApprovalRequired: true;
  readonly approvalAuthorizesSending: false;
  readonly separateSendingPhaseRequired: true;
  readonly approvalStatus: SendApprovalStatus;
}

export interface SendSigningLinkage {
  readonly signingLinkageId: string;
  readonly sourceSigningBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface SendConstructionLinkage {
  readonly constructionLinkageId: string;
  readonly sourceTransactionConstructionMockRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface SendExecutionBoundaryLinkage {
  readonly executionBoundaryLinkageId: string;
  readonly sourceExecutionBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface SendAbortContract {
  readonly abortContractId: string;
  readonly abortModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface SendRollbackContract {
  readonly rollbackContractId: string;
  readonly rollbackModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface SendSafetyInvariants {
  readonly safetyInvariantId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly noSendRuntime: true;
}

export interface SendBoundaryBlocker {
  readonly blockerId: string;
  readonly blockerCode: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly blocking: boolean;
  readonly reason: string;
}

export interface SendCapabilityAudit {
  readonly capabilityAuditId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly unlockAuthorityPresent: false;
  readonly sendingCapabilityPresent: false;
  readonly unsafeCapabilityDetected: boolean;
}

export interface SendScorecard {
  readonly scorecardId: string;
  readonly boundaryScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly reviewRequired: boolean;
}

export interface TransactionSendBoundaryReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly sendRequestSummary: string;
  readonly networkSubmitSummary: string;
  readonly broadcastSummary: string;
  readonly dispatchSummary: string;
  readonly preflightSummary: string;
  readonly retryConfirmationSummary: string;
  readonly approvalSummary: string;
  readonly abortRollbackSummary: string;
  readonly evidenceSummary: string;
  readonly safetySummary: string;
}

export interface TransactionSendBoundaryViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: TransactionSendBoundarySafetyContractName;
  readonly gateStatus: SendBoundaryGateStatus;
  readonly approvalStatus: SendApprovalStatus;
  readonly summary: string;
}

export interface TransactionSendBoundaryApiContract {
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

export interface TransactionSendBoundarySelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: TransactionSendBoundarySafetyContractName;
  readonly fixtureKind?: TransactionSendBoundarySafetyContractKind;
}

export interface TransactionSendBoundarySelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: TransactionSendBoundarySafetyContractKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface TransactionSendBoundaryEvidence {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface TransactionSendBoundarySafetyCapabilities {
  readonly transactionSendBoundarySafetyContracts: true;
  readonly deterministicTransactionSendBoundaryFixtures: true;
  readonly sendBoundaryGates: true;
  readonly sendRequestDenialContracts: true;
  readonly networkSubmitDenialContracts: true;
  readonly broadcastDenialContracts: true;
  readonly dispatchDenialContracts: true;
  readonly preflightDenialPlaceholders: true;
  readonly signedPayloadDenialContracts: true;
  readonly retryDenialContracts: true;
  readonly confirmationDenialContracts: true;
  readonly sendOperatorApprovalBoundaries: true;
  readonly sendSigningLinkage: true;
  readonly sendConstructionLinkage: true;
  readonly sendExecutionBoundaryLinkage: true;
  readonly sendAbortContracts: true;
  readonly sendRollbackContracts: true;
  readonly sendSafetyInvariants: true;
  readonly sendBlockerTaxonomy: true;
  readonly sendCapabilityAudits: true;
  readonly sendScorecards: true;
  readonly sendReports: true;
  readonly sendViewModels: true;
  readonly sendApiContracts: true;
  readonly sendSelectors: true;
  readonly sendRuntimeSending: false;
  readonly sendUnlockAuthority: false;
  readonly sendLiveTrading: false;
  readonly sendLimitedLiveUnlock: false;
  readonly sendFullAutoUnlock: false;
  readonly sendTransactionSending: false;
  readonly sendRawTransactionSending: false;
  readonly sendNetworkSubmit: false;
  readonly sendRpcWrite: false;
  readonly sendEndpointSubmit: false;
  readonly sendBroadcast: false;
  readonly sendDispatch: false;
  readonly sendQueueDispatch: false;
  readonly sendWorkerDispatch: false;
  readonly sendRouteDispatch: false;
  readonly sendPreflightLiveSimulation: false;
  readonly sendRetryRuntime: false;
  readonly sendConfirmationPolling: false;
  readonly sendTransactionIdOutput: false;
  readonly sendSignatureOutput: false;
  readonly sendWalletLogic: false;
  readonly sendWalletPrompt: false;
  readonly sendWalletAdapter: false;
  readonly sendPrivateKeyHandling: false;
  readonly sendKeypairHandling: false;
  readonly sendSeedPhraseHandling: false;
  readonly sendMnemonicHandling: false;
  readonly sendOrderCreation: false;
  readonly sendRuntimeExecution: false;
  readonly sendTradingSignals: false;
  readonly sendRecommendations: false;
  readonly sendInvestmentAdvice: false;
  readonly sendRealOrders: false;
  readonly sendRealFunds: false;
  readonly sendRealPnL: false;
  readonly sendLiveNetworkDefault: false;
  readonly sendScheduledJobs: false;
  readonly sendRuntimeMonitoring: false;
  readonly sendRuntimeCollectors: false;
  readonly sendProviderExpansion: false;
  readonly sendSecretsRequired: false;
  readonly sendApiKeyRequired: false;
  readonly sendFilesystemWrites: false;
  readonly sendPersistence: false;
  readonly sendRouteHandlers: false;
  readonly sendRuntimeRequests: false;
  readonly sendUiRendering: false;
  readonly sendDomAccess: false;
  readonly sendBackgroundJobs: false;
  readonly sendAutomaticPromotion: false;
}

export interface TransactionSendBoundarySafetyFixture {
  readonly fixtureId: string;
  readonly fixtureName: TransactionSendBoundarySafetyContractName;
  readonly fixtureKind: TransactionSendBoundarySafetyContractKind;
  readonly phase: typeof TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE;
  readonly schemaVersion: typeof PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SCHEMA_VERSION;
  readonly boundaryGate: SendBoundaryGate;
  readonly sendRequestDenial: SendRequestDenial;
  readonly networkSubmitDenial: NetworkSubmitDenial;
  readonly broadcastDenial: BroadcastDenial;
  readonly dispatchDenial: DispatchDenial;
  readonly preflightDenialPlaceholder: PreflightDenialPlaceholder;
  readonly signedPayloadDenial: SignedPayloadDenial;
  readonly retryDenialContract: RetryDenialContract;
  readonly confirmationDenialContract: ConfirmationDenialContract;
  readonly approvalBoundary: SendOperatorApprovalBoundary;
  readonly signingLinkage: SendSigningLinkage;
  readonly constructionLinkage: SendConstructionLinkage;
  readonly executionBoundaryLinkage: SendExecutionBoundaryLinkage;
  readonly abortContract: SendAbortContract;
  readonly rollbackContract: SendRollbackContract;
  readonly safetyInvariants: SendSafetyInvariants;
  readonly evidenceBundle: TransactionSendBoundaryEvidence;
  readonly blocker: SendBoundaryBlocker;
  readonly capabilityAudit: SendCapabilityAudit;
  readonly scorecard: SendScorecard;
  readonly report: TransactionSendBoundaryReport;
  readonly viewModel: TransactionSendBoundaryViewModel;
  readonly apiContract: TransactionSendBoundaryApiContract;
  readonly selectorExamples: readonly TransactionSendBoundarySelector[];
  readonly capabilities: TransactionSendBoundarySafetyCapabilities;
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
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_GENERATED_AT;
    readonly source: typeof PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SOURCE;
    readonly version: typeof PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_VERSION;
    readonly phase: typeof TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveNetwork: true;
    readonly noSending: true;
    readonly noTransactionIdOutput: true;
    readonly noNetworkSubmit: true;
    readonly noBroadcastOrDispatchOrExecution: true;
    readonly noFilesystemWrites: true;
    readonly noPersistence: true;
    readonly noRuntimeCaptureOrReplay: true;
    readonly noScheduledJobs: true;
    readonly nonAdvisory: true;
  };
}

export interface BuildTransactionSendBoundarySafetyFixtureInput {
  readonly fixtureName: TransactionSendBoundarySafetyContractName;
}

export interface TransactionSendBoundarySafetyValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface TransactionSendBoundarySafetyValidationResult {
  readonly valid: boolean;
  readonly issues: readonly TransactionSendBoundarySafetyValidationIssue[];
}

export interface TransactionSendBoundarySafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
