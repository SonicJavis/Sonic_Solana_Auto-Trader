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
import type { TransactionSendBoundarySafetyContractName } from '../transaction-send-boundary-safety/types.js';

export const POST_SEND_OBSERVATION_BOUNDARY_PHASE = 85 as const;
export const PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_GENERATED_AT = '2026-05-15T00:00:00.000Z' as const;
export const PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SOURCE =
  'phase85_post_send_observation_boundary_contracts_v1' as const;
export const PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_VERSION = '1.0.0' as const;
export const PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SCHEMA_VERSION = '1.0.0' as const;

export const POST_SEND_OBSERVATION_BOUNDARY_NAMES = [
  'observation-boundary-design-ready',
  'missing-send-boundary-blocked',
  'confirmation-lookup-denied',
  'signature-status-lookup-denied',
  'slot-finality-observation-denied',
  'polling-subscription-denied',
  'retry-observation-denied',
  'unsafe-capability-rejected',
] as const;

export const POST_SEND_OBSERVATION_BOUNDARY_KINDS = [
  'observation_boundary_design_ready',
  'missing_send_boundary_blocked',
  'confirmation_lookup_denied',
  'signature_status_lookup_denied',
  'slot_finality_observation_denied',
  'polling_subscription_denied',
  'retry_observation_denied',
  'unsafe_capability_rejected',
] as const;

export const OBSERVATION_BOUNDARY_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;

export type PostSendObservationBoundaryName = (typeof POST_SEND_OBSERVATION_BOUNDARY_NAMES)[number];
export type PostSendObservationBoundaryKind = (typeof POST_SEND_OBSERVATION_BOUNDARY_KINDS)[number];
export type ObservationBoundaryGateStatus = (typeof OBSERVATION_BOUNDARY_GATE_STATUSES)[number];

export interface ObservationBoundaryGate {
  readonly observationBoundaryGateId: string;
  readonly observationBoundaryGateName: string;
  readonly phase: typeof POST_SEND_OBSERVATION_BOUNDARY_PHASE;
  readonly gateStatus: ObservationBoundaryGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly liveObservationAllowed: false;
  readonly pollingAllowed: false;
  readonly subscriptionAllowed: false;
  readonly networkReadAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface ObservationRequestDenial {
  readonly observationRequestDenialId: string;
  readonly observationRequestBlocked: true;
  readonly confirmationLookupBlocked: true;
  readonly transactionLookupBlocked: true;
  readonly reasonCodes: readonly string[];
}

export interface ConfirmationStatusPlaceholder {
  readonly confirmationStatusPlaceholderId: string;
  readonly placeholderOnly: true;
  readonly liveConfirmationFetched: false;
  readonly confirmationStatusProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface SignatureStatusPlaceholder {
  readonly signatureStatusPlaceholderId: string;
  readonly placeholderOnly: true;
  readonly realSignatureRequired: false;
  readonly liveSignatureLookupAllowed: false;
  readonly signatureStatusProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface SlotObservationPlaceholder {
  readonly slotObservationPlaceholderId: string;
  readonly liveSlotFetchAllowed: false;
  readonly deterministicLabelOnly: true;
  readonly reasonCodes: readonly string[];
}

export interface FinalityObservationPlaceholder {
  readonly finalityObservationPlaceholderId: string;
  readonly liveFinalityFetchAllowed: false;
  readonly deterministicLabelOnly: true;
  readonly reasonCodes: readonly string[];
}

export interface RetryObservationDenial {
  readonly retryObservationDenialId: string;
  readonly retryRuntimeAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface PollingDenialContract {
  readonly pollingDenialId: string;
  readonly pollingRuntimeAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface SubscriptionDenialContract {
  readonly subscriptionDenialId: string;
  readonly subscriptionRuntimeAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface NetworkReadDenial {
  readonly networkReadDenialId: string;
  readonly networkReadRuntimeAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface ObservationSendBoundaryLinkage {
  readonly sendBoundaryLinkageId: string;
  readonly sourceSendBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface ObservationSigningBoundaryLinkage {
  readonly signingBoundaryLinkageId: string;
  readonly sourceSigningBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface ObservationConstructionLinkage {
  readonly constructionLinkageId: string;
  readonly sourceTransactionConstructionMockRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface ObservationExecutionBoundaryLinkage {
  readonly executionBoundaryLinkageId: string;
  readonly sourceExecutionBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface ObservationAbortContract {
  readonly abortContractId: string;
  readonly abortModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface ObservationRollbackContract {
  readonly rollbackContractId: string;
  readonly rollbackModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface ObservationSafetyInvariants {
  readonly safetyInvariantId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly noLiveObservationRuntime: true;
}

export interface ObservationBlocker {
  readonly blockerId: string;
  readonly blockerCode: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly blocking: boolean;
  readonly reason: string;
}

export interface ObservationCapabilityAudit {
  readonly capabilityAuditId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly unlockAuthorityPresent: false;
  readonly liveObservationCapabilityPresent: false;
  readonly unsafeCapabilityDetected: boolean;
}

export interface ObservationScorecard {
  readonly scorecardId: string;
  readonly boundaryScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly reviewRequired: boolean;
}

export interface PostSendObservationBoundaryReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly requestSummary: string;
  readonly confirmationSummary: string;
  readonly signatureStatusSummary: string;
  readonly slotFinalitySummary: string;
  readonly retryPollingSubscriptionSummary: string;
  readonly linkageSummary: string;
  readonly safetySummary: string;
}

export interface PostSendObservationBoundaryViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: PostSendObservationBoundaryName;
  readonly gateStatus: ObservationBoundaryGateStatus;
  readonly summary: string;
}

export interface PostSendObservationBoundaryApiContract {
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

export interface PostSendObservationBoundarySelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: PostSendObservationBoundaryName;
  readonly fixtureKind?: PostSendObservationBoundaryKind;
}

export interface PostSendObservationBoundarySelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: PostSendObservationBoundaryKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface PostSendObservationBoundaryEvidence {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface PostSendObservationBoundaryCapabilities {
  readonly postSendObservationBoundaryContracts: true;
  readonly deterministicPostSendObservationFixtures: true;
  readonly observationBoundaryGates: true;
  readonly observationRequestDenialContracts: true;
  readonly confirmationStatusPlaceholders: true;
  readonly signatureStatusPlaceholders: true;
  readonly slotObservationPlaceholders: true;
  readonly finalityObservationPlaceholders: true;
  readonly retryObservationDenials: true;
  readonly pollingDenialContracts: true;
  readonly subscriptionDenialContracts: true;
  readonly networkReadDenialContracts: true;
  readonly observationSendBoundaryLinkage: true;
  readonly observationSigningBoundaryLinkage: true;
  readonly observationConstructionLinkage: true;
  readonly observationExecutionBoundaryLinkage: true;
  readonly observationAbortContracts: true;
  readonly observationRollbackContracts: true;
  readonly observationSafetyInvariants: true;
  readonly observationBlockerTaxonomy: true;
  readonly observationCapabilityAudits: true;
  readonly observationScorecards: true;
  readonly observationReports: true;
  readonly observationViewModels: true;
  readonly observationApiContracts: true;
  readonly observationSelectors: true;
  readonly observationRuntimeObservation: false;
  readonly observationLiveConfirmationLookup: false;
  readonly observationLiveSignatureLookup: false;
  readonly observationGetTransactionLookup: false;
  readonly observationNetworkRead: false;
  readonly observationPollingRuntime: false;
  readonly observationSubscriptionRuntime: false;
  readonly observationRetryRuntime: false;
  readonly observationScheduledTimers: false;
  readonly observationUnlockAuthority: false;
  readonly observationLiveTrading: false;
  readonly observationLimitedLiveUnlock: false;
  readonly observationFullAutoUnlock: false;
  readonly observationSending: false;
  readonly observationDispatch: false;
  readonly observationSigning: false;
  readonly observationWalletLogic: false;
  readonly observationPrivateKeyHandling: false;
  readonly observationKeypairHandling: false;
  readonly observationSeedPhraseHandling: false;
  readonly observationMnemonicHandling: false;
  readonly observationOrderCreation: false;
  readonly observationRuntimeExecution: false;
  readonly observationTradingSignals: false;
  readonly observationRecommendations: false;
  readonly observationInvestmentAdvice: false;
  readonly observationRealOrders: false;
  readonly observationRealFunds: false;
  readonly observationRealPnL: false;
  readonly observationLiveNetworkDefault: false;
  readonly observationRuntimeMonitoring: false;
  readonly observationRuntimeCollectors: false;
  readonly observationProviderExpansion: false;
  readonly observationSecretsRequired: false;
  readonly observationApiKeyRequired: false;
  readonly observationFilesystemWrites: false;
  readonly observationPersistence: false;
  readonly observationRouteHandlers: false;
  readonly observationRuntimeRequests: false;
  readonly observationUiRendering: false;
  readonly observationDomAccess: false;
  readonly observationBackgroundJobs: false;
  readonly observationAutomaticPromotion: false;
}

export interface PostSendObservationBoundaryFixture {
  readonly fixtureId: string;
  readonly fixtureName: PostSendObservationBoundaryName;
  readonly fixtureKind: PostSendObservationBoundaryKind;
  readonly phase: typeof POST_SEND_OBSERVATION_BOUNDARY_PHASE;
  readonly schemaVersion: typeof PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SCHEMA_VERSION;
  readonly boundaryGate: ObservationBoundaryGate;
  readonly observationRequestDenial: ObservationRequestDenial;
  readonly confirmationStatusPlaceholder: ConfirmationStatusPlaceholder;
  readonly signatureStatusPlaceholder: SignatureStatusPlaceholder;
  readonly slotObservationPlaceholder: SlotObservationPlaceholder;
  readonly finalityObservationPlaceholder: FinalityObservationPlaceholder;
  readonly retryObservationDenial: RetryObservationDenial;
  readonly pollingDenialContract: PollingDenialContract;
  readonly subscriptionDenialContract: SubscriptionDenialContract;
  readonly networkReadDenial: NetworkReadDenial;
  readonly sendBoundaryLinkage: ObservationSendBoundaryLinkage;
  readonly signingBoundaryLinkage: ObservationSigningBoundaryLinkage;
  readonly constructionLinkage: ObservationConstructionLinkage;
  readonly executionBoundaryLinkage: ObservationExecutionBoundaryLinkage;
  readonly abortContract: ObservationAbortContract;
  readonly rollbackContract: ObservationRollbackContract;
  readonly safetyInvariants: ObservationSafetyInvariants;
  readonly evidenceBundle: PostSendObservationBoundaryEvidence;
  readonly blocker: ObservationBlocker;
  readonly capabilityAudit: ObservationCapabilityAudit;
  readonly scorecard: ObservationScorecard;
  readonly report: PostSendObservationBoundaryReport;
  readonly viewModel: PostSendObservationBoundaryViewModel;
  readonly apiContract: PostSendObservationBoundaryApiContract;
  readonly selectorExamples: readonly PostSendObservationBoundarySelector[];
  readonly capabilities: PostSendObservationBoundaryCapabilities;
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
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_GENERATED_AT;
    readonly source: typeof PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SOURCE;
    readonly version: typeof PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_VERSION;
    readonly phase: typeof POST_SEND_OBSERVATION_BOUNDARY_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveObservation: true;
    readonly noPollingOrSubscriptions: true;
    readonly noNetworkRead: true;
    readonly noRetryRuntime: true;
    readonly noSendingDispatchSigningExecution: true;
    readonly noFilesystemWrites: true;
    readonly noPersistence: true;
    readonly noScheduledJobs: true;
    readonly nonAdvisory: true;
  };
}

export interface BuildPostSendObservationBoundaryFixtureInput {
  readonly fixtureName: PostSendObservationBoundaryName;
}

export interface PostSendObservationBoundaryValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface PostSendObservationBoundaryValidationResult {
  readonly valid: boolean;
  readonly issues: readonly PostSendObservationBoundaryValidationIssue[];
}

export interface PostSendObservationBoundarySafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
