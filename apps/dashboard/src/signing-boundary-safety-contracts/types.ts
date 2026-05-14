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
import type { TransactionConstructionContractMockName } from '../transaction-construction-contract-mocks/types.js';

export const SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE = 83 as const;
export const PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT = '2026-05-14T00:00:00.000Z' as const;
export const PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SOURCE = 'phase83_signing_boundary_safety_design_contracts_v1' as const;
export const PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_VERSION = '1.0.0' as const;
export const PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SCHEMA_VERSION = '1.0.0' as const;

export const SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES = [
  'signing-boundary-design-ready',
  'missing-transaction-construction-mock-blocked',
  'signing-request-denied',
  'wallet-prompt-denied',
  'key-material-request-denied',
  'signature-output-denied',
  'approval-does-not-authorize-signing',
  'unsafe-capability-rejected',
] as const;

export const SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS = [
  'signing_boundary_design_ready',
  'missing_transaction_construction_mock_blocked',
  'signing_request_denied',
  'wallet_prompt_denied',
  'key_material_request_denied',
  'signature_output_denied',
  'approval_does_not_authorize_signing',
  'unsafe_capability_rejected',
] as const;

export const SIGNING_BOUNDARY_GATE_STATUSES = ['ready', 'blocked', 'review_required', 'rejected'] as const;
export const SIGNING_APPROVAL_STATUSES = ['required', 'pending', 'recorded', 'rejected'] as const;

export type SigningBoundarySafetyContractName = (typeof SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES)[number];
export type SigningBoundarySafetyContractKind = (typeof SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS)[number];
export type SigningBoundaryGateStatus = (typeof SIGNING_BOUNDARY_GATE_STATUSES)[number];
export type SigningApprovalStatus = (typeof SIGNING_APPROVAL_STATUSES)[number];

export interface SigningBoundaryGate {
  readonly signingBoundaryGateId: string;
  readonly signingBoundaryGateName: string;
  readonly phase: typeof SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE;
  readonly gateStatus: SigningBoundaryGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly signingAllowed: false;
  readonly walletPromptAllowed: false;
  readonly signatureOutputAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface SigningRequestDenial {
  readonly signingRequestDenialId: string;
  readonly signingRequestBlocked: true;
  readonly signTransactionBlocked: true;
  readonly signAllTransactionsBlocked: true;
  readonly signatureOutputProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface WalletPromptDenial {
  readonly walletPromptDenialId: string;
  readonly walletPromptBlocked: true;
  readonly walletAdapterAllowed: false;
  readonly browserWalletAccessAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface KeyMaterialDenial {
  readonly keyMaterialDenialId: string;
  readonly privateKeyAccessAllowed: false;
  readonly keypairAccessAllowed: false;
  readonly seedPhraseAccessAllowed: false;
  readonly mnemonicAccessAllowed: false;
  readonly secretStorageAllowed: false;
  readonly reasonCodes: readonly string[];
}

export interface SignatureOutputDenial {
  readonly signatureOutputDenialId: string;
  readonly signatureBytesProduced: false;
  readonly signedTransactionProduced: false;
  readonly signedMessageProduced: false;
  readonly reasonCodes: readonly string[];
}

export interface SignerIdentityPlaceholder {
  readonly signerIdentityPlaceholderId: string;
  readonly signerLabel: string;
  readonly placeholderOnly: true;
  readonly realPublicKeyRequired: false;
  readonly signerAuthorityGranted: false;
}

export interface SigningApprovalBoundary {
  readonly approvalBoundaryId: string;
  readonly manualApprovalRequired: true;
  readonly approvalAuthorizesSigning: false;
  readonly separateSigningPhaseRequired: true;
  readonly approvalStatus: SigningApprovalStatus;
}

export interface SigningOperatorAcknowledgement {
  readonly operatorAcknowledgementId: string;
  readonly acknowledgementRecorded: boolean;
  readonly acknowledgementAuthorizesSigning: false;
}

export interface SigningConstructionLinkage {
  readonly constructionLinkageId: string;
  readonly sourceTransactionConstructionMockRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface SigningExecutionBoundaryLinkage {
  readonly executionBoundaryLinkageId: string;
  readonly sourceExecutionBoundaryRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface SigningDryRunLinkage {
  readonly dryRunLinkageId: string;
  readonly sourceDryRunControlRef: string;
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
}

export interface SigningAbortContract {
  readonly abortContractId: string;
  readonly abortModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface SigningRollbackContract {
  readonly rollbackContractId: string;
  readonly rollbackModeled: true;
  readonly runtimeSideEffectsAllowed: false;
  readonly scheduledTimersAllowed: false;
  readonly status: 'ready' | 'blocked' | 'review_required';
}

export interface SigningSafetyInvariants {
  readonly safetyInvariantId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly noSigningRuntime: true;
}

export interface SigningBoundaryBlocker {
  readonly blockerId: string;
  readonly blockerCode: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly blocking: boolean;
  readonly reason: string;
}

export interface SigningCapabilityAudit {
  readonly capabilityAuditId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly unlockAuthorityPresent: false;
  readonly signingCapabilityPresent: false;
  readonly unsafeCapabilityDetected: boolean;
}

export interface SigningScorecard {
  readonly scorecardId: string;
  readonly boundaryScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly reviewRequired: boolean;
}

export interface SigningBoundaryReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly signingRequestSummary: string;
  readonly walletPromptSummary: string;
  readonly keyMaterialSummary: string;
  readonly signatureOutputSummary: string;
  readonly signerIdentitySummary: string;
  readonly approvalSummary: string;
  readonly abortRollbackSummary: string;
  readonly evidenceSummary: string;
  readonly safetySummary: string;
}

export interface SigningBoundaryViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: SigningBoundarySafetyContractName;
  readonly gateStatus: SigningBoundaryGateStatus;
  readonly approvalStatus: SigningApprovalStatus;
  readonly summary: string;
}

export interface SigningBoundaryApiContract {
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

export interface SigningBoundarySelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: SigningBoundarySafetyContractName;
  readonly fixtureKind?: SigningBoundarySafetyContractKind;
}

export interface SigningBoundarySelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: SigningBoundarySafetyContractKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface SigningBoundaryEvidence {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface SigningBoundarySafetyCapabilities {
  readonly signingBoundarySafetyContracts: true;
  readonly deterministicSigningBoundaryFixtures: true;
  readonly signingBoundaryGates: true;
  readonly signingRequestDenialContracts: true;
  readonly walletPromptDenialContracts: true;
  readonly keyMaterialDenialContracts: true;
  readonly signatureOutputDenialContracts: true;
  readonly signerIdentityPlaceholders: true;
  readonly signingApprovalBoundaries: true;
  readonly signingOperatorAcknowledgements: true;
  readonly signingConstructionLinkage: true;
  readonly signingExecutionBoundaryLinkage: true;
  readonly signingDryRunLinkage: true;
  readonly signingAbortContracts: true;
  readonly signingRollbackContracts: true;
  readonly signingSafetyInvariants: true;
  readonly signingBlockerTaxonomy: true;
  readonly signingCapabilityAudits: true;
  readonly signingScorecards: true;
  readonly signingReports: true;
  readonly signingViewModels: true;
  readonly signingApiContracts: true;
  readonly signingSelectors: true;
  readonly signingRuntimeSigning: false;
  readonly signingUnlockAuthority: false;
  readonly signingLiveTrading: false;
  readonly signingLimitedLiveUnlock: false;
  readonly signingFullAutoUnlock: false;
  readonly signingTransactionSigning: false;
  readonly signingTransactionSending: false;
  readonly signingDispatch: false;
  readonly signingSignatureGeneration: false;
  readonly signingSignatureOutput: false;
  readonly signingWalletLogic: false;
  readonly signingWalletPrompt: false;
  readonly signingWalletAdapter: false;
  readonly signingBrowserWalletAccess: false;
  readonly signingPrivateKeyHandling: false;
  readonly signingKeypairHandling: false;
  readonly signingSeedPhraseHandling: false;
  readonly signingMnemonicHandling: false;
  readonly signingSecretStorage: false;
  readonly signingOrderCreation: false;
  readonly signingRuntimeExecution: false;
  readonly signingTradingSignals: false;
  readonly signingRecommendations: false;
  readonly signingInvestmentAdvice: false;
  readonly signingRealOrders: false;
  readonly signingRealFunds: false;
  readonly signingRealPnL: false;
  readonly signingLiveNetworkDefault: false;
  readonly signingScheduledJobs: false;
  readonly signingRuntimeMonitoring: false;
  readonly signingRuntimeCollectors: false;
  readonly signingProviderExpansion: false;
  readonly signingSecretsRequired: false;
  readonly signingApiKeyRequired: false;
  readonly signingFilesystemWrites: false;
  readonly signingPersistence: false;
  readonly signingRouteHandlers: false;
  readonly signingRuntimeRequests: false;
  readonly signingUiRendering: false;
  readonly signingDomAccess: false;
  readonly signingBackgroundJobs: false;
  readonly signingAutomaticPromotion: false;
}

export interface SigningBoundarySafetyFixture {
  readonly fixtureId: string;
  readonly fixtureName: SigningBoundarySafetyContractName;
  readonly fixtureKind: SigningBoundarySafetyContractKind;
  readonly phase: typeof SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE;
  readonly schemaVersion: typeof PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SCHEMA_VERSION;
  readonly boundaryGate: SigningBoundaryGate;
  readonly signingRequestDenial: SigningRequestDenial;
  readonly walletPromptDenial: WalletPromptDenial;
  readonly keyMaterialDenial: KeyMaterialDenial;
  readonly signatureOutputDenial: SignatureOutputDenial;
  readonly signerIdentityPlaceholder: SignerIdentityPlaceholder;
  readonly approvalBoundary: SigningApprovalBoundary;
  readonly operatorAcknowledgement: SigningOperatorAcknowledgement;
  readonly constructionLinkage: SigningConstructionLinkage;
  readonly executionBoundaryLinkage: SigningExecutionBoundaryLinkage;
  readonly dryRunLinkage: SigningDryRunLinkage;
  readonly abortContract: SigningAbortContract;
  readonly rollbackContract: SigningRollbackContract;
  readonly safetyInvariants: SigningSafetyInvariants;
  readonly evidenceBundle: SigningBoundaryEvidence;
  readonly blocker: SigningBoundaryBlocker;
  readonly capabilityAudit: SigningCapabilityAudit;
  readonly scorecard: SigningScorecard;
  readonly report: SigningBoundaryReport;
  readonly viewModel: SigningBoundaryViewModel;
  readonly apiContract: SigningBoundaryApiContract;
  readonly selectorExamples: readonly SigningBoundarySelector[];
  readonly capabilities: SigningBoundarySafetyCapabilities;
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
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT;
    readonly source: typeof PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SOURCE;
    readonly version: typeof PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_VERSION;
    readonly phase: typeof SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveNetwork: true;
    readonly noSigning: true;
    readonly noSignatureOutput: true;
    readonly noWalletPrompt: true;
    readonly noSending: true;
    readonly noDispatchOrExecution: true;
    readonly noFilesystemWrites: true;
    readonly noPersistence: true;
    readonly noRuntimeCaptureOrReplay: true;
    readonly noScheduledJobs: true;
    readonly nonAdvisory: true;
  };
}

export interface BuildSigningBoundarySafetyFixtureInput {
  readonly fixtureName: SigningBoundarySafetyContractName;
}

export interface SigningBoundarySafetyValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface SigningBoundarySafetyValidationResult {
  readonly valid: boolean;
  readonly issues: readonly SigningBoundarySafetyValidationIssue[];
}

export interface SigningBoundarySafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
