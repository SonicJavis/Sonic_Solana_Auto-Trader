import type { ControlledLiveSmokeHarnessName } from '../controlled-live-smoke-harness/types.js';
import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotIngestionContractName } from '../historical-snapshot-ingestion-contracts/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { PreLiveSafetyCertificationName } from '../pre-live-safety-certification/types.js';
import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';

export const MANUAL_CONFIRM_LIVE_READINESS_PHASE = 76 as const;
export const PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SOURCE =
  'phase76_manual_confirm_live_readiness_contracts_v1' as const;
export const PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_VERSION = '1.0.0' as const;
export const PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SCHEMA_VERSION = '1.0.0' as const;

export const MANUAL_CONFIRM_LIVE_READINESS_NAMES = [
  'manual-confirm-readiness-complete',
  'missing-prelive-certification-blocked',
  'smoke-readiness-warning-review-required',
  'role-separation-violation-rejected',
  'confirmation-phrase-missing-blocked',
  'cooling-off-required-pending',
  'unsafe-capability-rejected',
  'documentation-review-warning',
] as const;

export const MANUAL_CONFIRM_LIVE_READINESS_KINDS = [
  'manual_confirm_readiness_complete',
  'missing_prelive_certification_blocked',
  'smoke_readiness_warning_review_required',
  'role_separation_violation_rejected',
  'confirmation_phrase_missing_blocked',
  'cooling_off_required_pending',
  'unsafe_capability_rejected',
  'documentation_review_warning',
] as const;

export const MANUAL_CONFIRM_GATE_KINDS = [
  'manual_confirm_approval_gate',
  'role_separation_gate',
  'phrase_confirmation_gate',
  'cooling_off_gate',
  'evidence_verification_gate',
] as const;

export const MANUAL_CONFIRM_GATE_STATUSES = [
  'ready',
  'blocked',
  'rejected',
  'review_required',
  'pending_manual_approval',
  'cooling_off_pending',
] as const;

export const MANUAL_CONFIRM_APPROVAL_STATUSES = [
  'pending_manual_review',
  'approved',
  'rejected',
] as const;

export const MANUAL_CONFIRM_PHRASE_STATUSES = [
  'phrase_required',
  'phrase_matched',
  'phrase_missing',
  'phrase_mismatch',
] as const;

export const MANUAL_CONFIRM_ROLE_STATUSES = [
  'separation_satisfied',
  'violation_detected',
  'pending_assignment',
] as const;

export const MANUAL_CONFIRM_COOLING_OFF_STATUSES = [
  'not_required',
  'pending',
  'completed_by_label',
] as const;

export const MANUAL_CONFIRM_CHECKLIST_STATUSES = [
  'passed',
  'warning',
  'failed',
  'blocked',
] as const;

export const MANUAL_CONFIRM_AUDIT_STATUSES = ['pass', 'warning', 'fail'] as const;

export const MANUAL_CONFIRM_INVARIANT_KINDS = [
  'read_only_default',
  'fail_closed_required',
  'no_unlock_authority',
  'no_execution_capability',
  'manual_confirm_required',
] as const;

export const MANUAL_CONFIRM_REJECTION_KINDS = [
  'missing_evidence',
  'unsafe_capability',
  'policy_violation',
  'documentation_gap',
  'role_separation_violation',
  'phrase_missing',
  'cooling_off_required',
] as const;

export const MANUAL_CONFIRM_REJECTION_SEVERITIES = ['warning', 'error', 'critical'] as const;

export type ManualConfirmLiveReadinessName = (typeof MANUAL_CONFIRM_LIVE_READINESS_NAMES)[number];
export type ManualConfirmLiveReadinessKind = (typeof MANUAL_CONFIRM_LIVE_READINESS_KINDS)[number];
export type ManualConfirmGateKind = (typeof MANUAL_CONFIRM_GATE_KINDS)[number];
export type ManualConfirmGateStatus = (typeof MANUAL_CONFIRM_GATE_STATUSES)[number];
export type ManualConfirmApprovalStatus = (typeof MANUAL_CONFIRM_APPROVAL_STATUSES)[number];
export type ManualConfirmPhraseStatus = (typeof MANUAL_CONFIRM_PHRASE_STATUSES)[number];
export type ManualConfirmRoleStatus = (typeof MANUAL_CONFIRM_ROLE_STATUSES)[number];
export type ManualConfirmCoolingOffStatus = (typeof MANUAL_CONFIRM_COOLING_OFF_STATUSES)[number];
export type ManualConfirmChecklistStatus = (typeof MANUAL_CONFIRM_CHECKLIST_STATUSES)[number];
export type ManualConfirmAuditStatus = (typeof MANUAL_CONFIRM_AUDIT_STATUSES)[number];
export type ManualConfirmInvariantKind = (typeof MANUAL_CONFIRM_INVARIANT_KINDS)[number];
export type ManualConfirmRejectionKind = (typeof MANUAL_CONFIRM_REJECTION_KINDS)[number];
export type ManualConfirmRejectionSeverity = (typeof MANUAL_CONFIRM_REJECTION_SEVERITIES)[number];

export interface ManualConfirmReadinessGate {
  readonly readinessGateId: string;
  readonly readinessGateName: string;
  readonly readinessGateKind: ManualConfirmGateKind;
  readonly phase: typeof MANUAL_CONFIRM_LIVE_READINESS_PHASE;
  readonly gateStatus: ManualConfirmGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly manualLiveAllowed: false;
  readonly executionAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface ManualConfirmApprovalPolicy {
  readonly approvalPolicyId: string;
  readonly manualApprovalRequired: true;
  readonly multipleApproversRequired: boolean;
  readonly automaticApprovalAllowed: false;
  readonly automaticPromotionAllowed: false;
  readonly limitedLiveUnlockAllowed: false;
  readonly fullAutoUnlockAllowed: false;
  readonly requiresSeparateFuturePhase: true;
  readonly approvalStatus: ManualConfirmApprovalStatus;
}

export interface ManualConfirmPhraseContract {
  readonly phraseId: string;
  readonly phraseKind: string;
  readonly phraseRequired: true;
  readonly exactPhrase: string;
  readonly phraseMatched: boolean;
  readonly commandDispatchAllowed: false;
  readonly executionAllowed: false;
  readonly phraseStatus: ManualConfirmPhraseStatus;
}

export interface ManualConfirmRoleSeparation {
  readonly roleSeparationId: string;
  readonly requesterRole: string;
  readonly reviewerRole: string;
  readonly approverRole: string;
  readonly sameActorAllowed: false;
  readonly separationSatisfied: boolean;
  readonly violationReasonCodes: readonly string[];
  readonly roleSeparationStatus: ManualConfirmRoleStatus;
}

export interface ManualConfirmCoolingOffPolicy {
  readonly coolingOffId: string;
  readonly coolingOffRequired: boolean;
  readonly deterministicWindowLabel: string;
  readonly usesRuntimeTimers: false;
  readonly automaticTransitionAllowed: false;
  readonly coolingOffStatus: ManualConfirmCoolingOffStatus;
}

export interface ManualConfirmRiskAcknowledgement {
  readonly acknowledgementId: string;
  readonly riskAcknowledged: boolean;
  readonly advisoryOutput: false;
  readonly recommendationOutput: false;
  readonly signalOutput: false;
  readonly sourceEvidenceRefs: readonly string[];
  readonly acknowledgementStatus: 'acknowledged' | 'pending' | 'rejected';
}

export interface ManualConfirmOperatorChecklistItem {
  readonly itemId: string;
  readonly description: string;
  readonly status: 'passed' | 'failed' | 'warning' | 'pending';
  readonly phaseRef: string;
}

export interface ManualConfirmOperatorChecklist {
  readonly checklistId: string;
  readonly checklistItems: readonly ManualConfirmOperatorChecklistItem[];
  readonly requiredItemCount: number;
  readonly passedItemCount: number;
  readonly failedItemCount: number;
  readonly warningItemCount: number;
  readonly checklistStatus: ManualConfirmChecklistStatus;
  readonly failClosed: true;
}

export interface ManualConfirmPreflightEvidence {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly reviewRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface ManualConfirmRejectionContract {
  readonly rejectionId: string;
  readonly rejectionKind: ManualConfirmRejectionKind;
  readonly rejectionSeverity: ManualConfirmRejectionSeverity;
  readonly rejectionReasonCodes: readonly string[];
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly manualLiveAllowed: false;
}

export interface ManualConfirmCapabilityAudit {
  readonly auditId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly noWallet: true;
  readonly noSigning: true;
  readonly noSending: true;
  readonly noExecution: true;
  readonly noAdvisory: true;
  readonly auditStatus: ManualConfirmAuditStatus;
}

export interface ManualConfirmSafetyInvariant {
  readonly invariantId: string;
  readonly invariantKind: ManualConfirmInvariantKind;
  readonly invariantHolds: boolean;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly evidenceRef: string;
}

export interface ManualConfirmProviderReadinessLinkage {
  readonly linkageId: string;
  readonly phase65FixtureRef: string;
  readonly phase66FixtureRef: string;
  readonly providerReadinessVerified: boolean;
  readonly readOnlyOnly: true;
}

export interface ManualConfirmSmokeReadinessLinkage {
  readonly linkageId: string;
  readonly phase69FixtureRef: string;
  readonly phase74FixtureRef: string;
  readonly smokeCertified: boolean;
  readonly smokeStatus: string;
}

export interface ManualConfirmCertificationLinkage {
  readonly linkageId: string;
  readonly phase75FixtureRef: string;
  readonly certificationVerified: boolean;
  readonly certificationStatus: string;
  readonly certificationDoesNotUnlockLive: true;
}

export interface ManualConfirmReplayReadinessLinkage {
  readonly linkageId: string;
  readonly phase68FixtureRef: string;
  readonly phase73FixtureRef: string;
  readonly replayImportComplete: boolean;
  readonly replayStatus: string;
}

export interface ManualConfirmScenarioReadinessLinkage {
  readonly linkageId: string;
  readonly phase72FixtureRef: string;
  readonly scenarioReadinessVerified: boolean;
  readonly scenarioStatus: string;
}

export interface ManualConfirmScorecard {
  readonly scorecardId: string;
  readonly score: number;
  readonly maxScore: number;
  readonly gateStatus: ManualConfirmGateStatus;
  readonly checklistStatus: ManualConfirmChecklistStatus;
  readonly approvalStatus: ManualConfirmApprovalStatus;
  readonly failClosed: true;
}

export interface ManualConfirmReadinessReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly approvalSummary: string;
  readonly confirmationSummary: string;
  readonly roleSeparationSummary: string;
  readonly coolingOffSummary: string;
  readonly riskAcknowledgementSummary: string;
  readonly checklistSummary: string;
  readonly evidenceSummary: string;
  readonly safetySummary: string;
  readonly overallStatus: ManualConfirmGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly manualLiveAllowed: false;
}

export interface ManualConfirmViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ManualConfirmLiveReadinessName;
  readonly gateStatus: ManualConfirmGateStatus;
  readonly approvalStatus: ManualConfirmApprovalStatus;
  readonly phraseStatus: ManualConfirmPhraseStatus;
  readonly roleSeparationStatus: ManualConfirmRoleStatus;
  readonly coolingOffStatus: ManualConfirmCoolingOffStatus;
  readonly checklistStatus: ManualConfirmChecklistStatus;
  readonly summary: string;
}

export interface ManualConfirmApiContract {
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

export interface ManualConfirmSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ManualConfirmLiveReadinessKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface ManualConfirmSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: string;
  readonly fixtureKind?: ManualConfirmLiveReadinessKind;
}

export interface ManualConfirmLiveReadinessCapabilities {
  readonly manualConfirmLiveReadinessContracts: true;
  readonly deterministicManualConfirmReadinessFixtures: true;
  readonly manualConfirmReadinessGates: true;
  readonly manualConfirmApprovalPolicies: true;
  readonly manualConfirmPhraseContracts: true;
  readonly manualConfirmRoleSeparationModels: true;
  readonly manualConfirmCoolingOffPolicies: true;
  readonly manualConfirmRiskAcknowledgements: true;
  readonly manualConfirmOperatorChecklists: true;
  readonly manualConfirmPreflightEvidenceBundles: true;
  readonly manualConfirmRejectionContracts: true;
  readonly manualConfirmCapabilityAudits: true;
  readonly manualConfirmSafetyInvariants: true;
  readonly manualConfirmProviderReadinessLinkage: true;
  readonly manualConfirmSmokeReadinessLinkage: true;
  readonly manualConfirmPreLiveCertificationLinkage: true;
  readonly manualConfirmReplayReadinessLinkage: true;
  readonly manualConfirmScenarioReadinessLinkage: true;
  readonly manualConfirmScorecards: true;
  readonly manualConfirmReadinessReports: true;
  readonly manualConfirmViewModels: true;
  readonly manualConfirmApiContracts: true;
  readonly manualConfirmSelectors: true;
  readonly manualConfirmUnlockAuthority: false;
  readonly manualConfirmLiveTrading: false;
  readonly manualConfirmManualTradingImplementation: false;
  readonly manualConfirmLimitedLiveUnlock: false;
  readonly manualConfirmFullAutoUnlock: false;
  readonly manualConfirmExecution: false;
  readonly manualConfirmTransactionBuilding: false;
  readonly manualConfirmTransactionSending: false;
  readonly manualConfirmWalletLogic: false;
  readonly manualConfirmPrivateKeyHandling: false;
  readonly manualConfirmSigning: false;
  readonly manualConfirmTradingSignals: false;
  readonly manualConfirmRecommendations: false;
  readonly manualConfirmInvestmentAdvice: false;
  readonly manualConfirmRealOrders: false;
  readonly manualConfirmRealFunds: false;
  readonly manualConfirmRealPnL: false;
  readonly manualConfirmLiveNetworkDefault: false;
  readonly manualConfirmScheduledJobs: false;
  readonly manualConfirmRuntimeMonitoring: false;
  readonly manualConfirmRuntimeCollectors: false;
  readonly manualConfirmProviderExpansion: false;
  readonly manualConfirmSecretsRequired: false;
  readonly manualConfirmApiKeyRequired: false;
  readonly manualConfirmFilesystemWrites: false;
  readonly manualConfirmPersistence: false;
  readonly manualConfirmRouteHandlers: false;
  readonly manualConfirmRuntimeRequests: false;
  readonly manualConfirmUiRendering: false;
  readonly manualConfirmDomAccess: false;
  readonly manualConfirmBackgroundJobs: false;
}

export interface ManualConfirmLiveReadinessFixture {
  readonly fixtureId: string;
  readonly fixtureName: ManualConfirmLiveReadinessName;
  readonly fixtureKind: ManualConfirmLiveReadinessKind;
  readonly phase: typeof MANUAL_CONFIRM_LIVE_READINESS_PHASE;
  readonly schemaVersion: typeof PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SCHEMA_VERSION;
  readonly readinessGate: ManualConfirmReadinessGate;
  readonly approvalPolicy: ManualConfirmApprovalPolicy;
  readonly phraseContract: ManualConfirmPhraseContract;
  readonly roleSeparation: ManualConfirmRoleSeparation;
  readonly coolingOffPolicy: ManualConfirmCoolingOffPolicy;
  readonly riskAcknowledgement: ManualConfirmRiskAcknowledgement;
  readonly operatorChecklist: ManualConfirmOperatorChecklist;
  readonly preflightEvidence: ManualConfirmPreflightEvidence;
  readonly rejectionContract: ManualConfirmRejectionContract;
  readonly capabilityAudit: ManualConfirmCapabilityAudit;
  readonly safetyInvariant: ManualConfirmSafetyInvariant;
  readonly providerReadinessLinkage: ManualConfirmProviderReadinessLinkage;
  readonly smokeReadinessLinkage: ManualConfirmSmokeReadinessLinkage;
  readonly certificationLinkage: ManualConfirmCertificationLinkage;
  readonly replayReadinessLinkage: ManualConfirmReplayReadinessLinkage;
  readonly scenarioReadinessLinkage: ManualConfirmScenarioReadinessLinkage;
  readonly scorecard: ManualConfirmScorecard;
  readonly readinessReport: ManualConfirmReadinessReport;
  readonly report: ManualConfirmReadinessReport;
  readonly viewModel: ManualConfirmViewModel;
  readonly apiContract: ManualConfirmApiContract;
  readonly selectorExamples: readonly ManualConfirmSelector[];
  readonly capabilityFlags: ManualConfirmLiveReadinessCapabilities;
  readonly sourcePhase65FixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourcePhase66FixtureSnapshot: readonly MultiProviderReadOnlyFoundationName[];
  readonly sourcePhase67FixtureSnapshot: readonly CrossProviderDataQualityName[];
  readonly sourcePhase68FixtureSnapshot: readonly ProviderAwareReplayScenarioName[];
  readonly sourcePhase69FixtureSnapshot: readonly LiveSmokeSafetyCertificationName[];
  readonly sourcePhase70FixtureSnapshot: readonly ProviderReliabilityDriftAuditName[];
  readonly sourcePhase71FixtureSnapshot: readonly HistoricalSnapshotIngestionContractName[];
  readonly sourcePhase72FixtureSnapshot: readonly HistoricalSnapshotScenarioGeneratorName[];
  readonly sourcePhase73FixtureSnapshot: readonly ProviderAwareReplayImportContractName[];
  readonly sourcePhase74FixtureSnapshot: readonly ControlledLiveSmokeHarnessName[];
  readonly sourcePhase75FixtureSnapshot: readonly PreLiveSafetyCertificationName[];
  readonly sourceRefs: {
    readonly phase65FixtureId: string;
    readonly phase66FixtureId: string;
    readonly phase67FixtureId: string;
    readonly phase68FixtureId: string;
    readonly phase69FixtureId: string;
    readonly phase70FixtureId: string;
    readonly phase71FixtureId: string;
    readonly phase72FixtureId: string;
    readonly phase73FixtureId: string;
    readonly phase74FixtureId: string;
    readonly phase75FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT;
    readonly source: typeof PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SOURCE;
    readonly version: typeof PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_VERSION;
    readonly phase: typeof MANUAL_CONFIRM_LIVE_READINESS_PHASE;
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

export interface BuildManualConfirmLiveReadinessFixtureInput {
  readonly fixtureName: ManualConfirmLiveReadinessName;
}

export interface ManualConfirmLiveReadinessValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ManualConfirmLiveReadinessValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ManualConfirmLiveReadinessValidationIssue[];
}

export interface ManualConfirmLiveReadinessSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
