import type { ControlledLiveSmokeHarnessName } from '../controlled-live-smoke-harness/types.js';
import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotIngestionContractName } from '../historical-snapshot-ingestion-contracts/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';

export const PRE_LIVE_SAFETY_CERTIFICATION_PHASE = 75 as const;
export const PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SOURCE =
  'phase75_pre_live_safety_review_gate_and_read_only_certification_v1' as const;
export const PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_VERSION = '1.0.0' as const;
export const PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SCHEMA_VERSION = '1.0.0' as const;

export const PRE_LIVE_SAFETY_CERTIFICATION_NAMES = [
  'complete-read-only-certification-ready',
  'missing-smoke-certification-blocked',
  'replay-import-incomplete-blocked',
  'reliability-drift-warning-review-required',
  'unsafe-capability-rejected',
  'missing-codeql-review-blocked',
  'manual-approval-required-pending',
  'documentation-gap-warning',
] as const;

export const PRE_LIVE_SAFETY_CERTIFICATION_KINDS = [
  'complete_read_only_certification_ready',
  'missing_smoke_certification_blocked',
  'replay_import_incomplete_blocked',
  'reliability_drift_warning_review_required',
  'unsafe_capability_rejected',
  'missing_codeql_review_blocked',
  'manual_approval_required_pending',
  'documentation_gap_warning',
] as const;

export const PRE_LIVE_GATE_KINDS = ['pre_live_safety_review', 'read_only_certification', 'evidence_verification'] as const;
export const PRE_LIVE_GATE_STATUSES = ['ready', 'blocked', 'rejected', 'review_required', 'pending_manual_approval'] as const;
export const PRE_LIVE_CHECKLIST_STATUSES = ['passed', 'warning', 'failed', 'blocked'] as const;
export const PRE_LIVE_CERTIFICATION_KINDS = ['read_only_readiness', 'offline_ci_readiness'] as const;
export const PRE_LIVE_CERTIFICATION_STATUSES = ['certified', 'blocked', 'rejected', 'pending_review'] as const;
export const PRE_LIVE_SIGNOFF_STATUSES = ['pending_manual_review', 'approved', 'rejected'] as const;
export const PRE_LIVE_REJECTION_KINDS = ['missing_evidence', 'unsafe_capability', 'policy_violation', 'documentation_gap'] as const;
export const PRE_LIVE_REJECTION_SEVERITIES = ['warning', 'error', 'critical'] as const;
export const PRE_LIVE_AUDIT_STATUSES = ['pass', 'warning', 'fail'] as const;
export const PRE_LIVE_INVARIANT_KINDS = ['read_only_default', 'fail_closed_required', 'no_unlock_authority', 'no_execution_capability'] as const;

export type PreLiveSafetyCertificationName = (typeof PRE_LIVE_SAFETY_CERTIFICATION_NAMES)[number];
export type PreLiveSafetyCertificationKind = (typeof PRE_LIVE_SAFETY_CERTIFICATION_KINDS)[number];
export type PreLiveGateKind = (typeof PRE_LIVE_GATE_KINDS)[number];
export type PreLiveGateStatus = (typeof PRE_LIVE_GATE_STATUSES)[number];
export type PreLiveChecklistStatus = (typeof PRE_LIVE_CHECKLIST_STATUSES)[number];
export type PreLiveCertificationKind = (typeof PRE_LIVE_CERTIFICATION_KINDS)[number];
export type PreLiveCertificationStatus = (typeof PRE_LIVE_CERTIFICATION_STATUSES)[number];
export type PreLiveSignoffStatus = (typeof PRE_LIVE_SIGNOFF_STATUSES)[number];
export type PreLiveRejectionKind = (typeof PRE_LIVE_REJECTION_KINDS)[number];
export type PreLiveRejectionSeverity = (typeof PRE_LIVE_REJECTION_SEVERITIES)[number];
export type PreLiveAuditStatus = (typeof PRE_LIVE_AUDIT_STATUSES)[number];
export type PreLiveInvariantKind = (typeof PRE_LIVE_INVARIANT_KINDS)[number];

export interface PreLiveSafetyGate {
  readonly gateId: string;
  readonly gateName: string;
  readonly gateKind: PreLiveGateKind;
  readonly phase: typeof PRE_LIVE_SAFETY_CERTIFICATION_PHASE;
  readonly gateStatus: PreLiveGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly liveTradingAllowed: false;
  readonly manualTradingAllowed: false;
  readonly executionAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface PreLiveReadinessChecklist {
  readonly checklistId: string;
  readonly checklistName: string;
  readonly checklistItems: readonly string[];
  readonly requiredItemCount: number;
  readonly passedItemCount: number;
  readonly failedItemCount: number;
  readonly warningItemCount: number;
  readonly checklistStatus: PreLiveChecklistStatus;
  readonly failClosed: true;
}

export interface PreLiveCertificationContract {
  readonly certificationId: string;
  readonly certificationKind: PreLiveCertificationKind;
  readonly readOnlyCertified: boolean;
  readonly noExecutionCertified: boolean;
  readonly noWalletCertified: boolean;
  readonly noAdvisoryCertified: boolean;
  readonly offlineCiCertified: boolean;
  readonly certificationStatus: PreLiveCertificationStatus;
  readonly certificationDoesNotUnlockLive: true;
}

export interface PreLiveEvidenceBundle {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly reviewRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface PreLiveSignoffModel {
  readonly signoffId: string;
  readonly requiresManualReview: true;
  readonly requiresMultipleApprovers: boolean;
  readonly automaticApprovalAllowed: false;
  readonly unlockAuthority: false;
  readonly approverSlots: readonly string[];
  readonly signoffStatus: PreLiveSignoffStatus;
}

export interface PreLiveApprovalPolicy {
  readonly approvalPolicyId: string;
  readonly manualApprovalRequired: true;
  readonly automaticPromotionAllowed: false;
  readonly fullAutoUnlockAllowed: false;
  readonly limitedLiveUnlockAllowed: false;
  readonly requiresSeparateFuturePhase: true;
}

export interface PreLiveRejectionContract {
  readonly rejectionId: string;
  readonly rejectionKind: PreLiveRejectionKind;
  readonly severity: PreLiveRejectionSeverity;
  readonly reasonCode: string;
  readonly failClosed: true;
  readonly safetyNotes: string;
}

export interface PreLiveCapabilityAudit {
  readonly auditId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly noWallet: true;
  readonly noSigning: true;
  readonly noSending: true;
  readonly noExecution: true;
  readonly noAdvisory: true;
  readonly auditStatus: PreLiveAuditStatus;
}

export interface PreLiveSafetyInvariant {
  readonly invariantId: string;
  readonly invariantKind: PreLiveInvariantKind;
  readonly required: true;
  readonly satisfied: boolean;
  readonly violationSeverity: PreLiveRejectionSeverity;
  readonly sourceRefs: readonly string[];
}

export interface PreLiveProviderReadinessLinkage {
  readonly linkageId: string;
  readonly sourcePhase66FixtureName: MultiProviderReadOnlyFoundationName;
  readonly sourcePhase65FixtureName: FirstReadOnlyProviderAdapterName;
  readonly linked: boolean;
  readonly reasonCodes: readonly string[];
}

export interface PreLiveReplayReadinessLinkage {
  readonly linkageId: string;
  readonly sourcePhase73FixtureName: ProviderAwareReplayImportContractName;
  readonly sourcePhase68FixtureName: ProviderAwareReplayScenarioName;
  readonly linked: boolean;
  readonly replayImportComplete: boolean;
  readonly reasonCodes: readonly string[];
}

export interface PreLiveScenarioReadinessLinkage {
  readonly linkageId: string;
  readonly sourcePhase72FixtureName: HistoricalSnapshotScenarioGeneratorName;
  readonly sourcePhase71FixtureName: HistoricalSnapshotIngestionContractName;
  readonly linked: boolean;
  readonly reasonCodes: readonly string[];
}

export interface PreLiveSmokeReadinessLinkage {
  readonly linkageId: string;
  readonly sourcePhase74FixtureName: ControlledLiveSmokeHarnessName;
  readonly sourcePhase69FixtureName: LiveSmokeSafetyCertificationName;
  readonly smokeCertified: boolean;
  readonly linked: boolean;
  readonly reasonCodes: readonly string[];
}

export interface PreLiveRiskReadinessLinkage {
  readonly linkageId: string;
  readonly sourcePhase70FixtureName: ProviderReliabilityDriftAuditName;
  readonly sourcePhase67FixtureName: CrossProviderDataQualityName;
  readonly linked: boolean;
  readonly riskBand: 'low' | 'medium' | 'high';
  readonly reasonCodes: readonly string[];
}

export interface PreLiveCertificationScorecard {
  readonly scorecardId: string;
  readonly score: number;
  readonly maxScore: number;
  readonly gateStatus: PreLiveGateStatus;
  readonly checklistStatus: PreLiveChecklistStatus;
  readonly certificationStatus: PreLiveCertificationStatus;
  readonly failClosed: true;
}

export interface PreLiveCertificationReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly checklistSummary: string;
  readonly certificationSummary: string;
  readonly evidenceSummary: string;
  readonly signoffSummary: string;
  readonly approvalSummary: string;
  readonly rejectionSummary: string;
  readonly safetySummary: string;
}

export interface PreLiveViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: PreLiveSafetyCertificationName;
  readonly gateStatus: PreLiveGateStatus;
  readonly certificationStatus: PreLiveCertificationStatus;
  readonly signoffStatus: PreLiveSignoffStatus;
  readonly summary: string;
}

export interface PreLiveApiContract {
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

export interface PreLiveSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: PreLiveSafetyCertificationKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface PreLiveSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: PreLiveSafetyCertificationName;
  readonly fixtureKind?: PreLiveSafetyCertificationKind;
}

export interface PreLiveSafetyCertificationCapabilities {
  readonly preLiveSafetyCertification: true;
  readonly deterministicPreLiveSafetyFixtures: true;
  readonly preLiveSafetyGates: true;
  readonly preLiveReadinessChecklists: true;
  readonly preLiveCertificationContracts: true;
  readonly preLiveEvidenceBundles: true;
  readonly preLiveSignoffModels: true;
  readonly preLiveApprovalPolicies: true;
  readonly preLiveRejectionContracts: true;
  readonly preLiveCapabilityAudits: true;
  readonly preLiveSafetyInvariants: true;
  readonly preLiveProviderReadinessLinkage: true;
  readonly preLiveReplayReadinessLinkage: true;
  readonly preLiveScenarioReadinessLinkage: true;
  readonly preLiveSmokeReadinessLinkage: true;
  readonly preLiveRiskReadinessLinkage: true;
  readonly preLiveScorecards: true;
  readonly preLiveCertificationReports: true;
  readonly preLiveViewModels: true;
  readonly preLiveApiContracts: true;
  readonly preLiveSelectors: true;
  readonly preLiveUnlockAuthority: false;
  readonly preLiveLiveTrading: false;
  readonly preLiveManualTrading: false;
  readonly preLiveLimitedLiveUnlock: false;
  readonly preLiveFullAutoUnlock: false;
  readonly preLiveExecution: false;
  readonly preLiveTransactionBuilding: false;
  readonly preLiveTransactionSending: false;
  readonly preLiveWalletLogic: false;
  readonly preLivePrivateKeyHandling: false;
  readonly preLiveSigning: false;
  readonly preLiveTradingSignals: false;
  readonly preLiveRecommendations: false;
  readonly preLiveInvestmentAdvice: false;
  readonly preLiveRealOrders: false;
  readonly preLiveRealFunds: false;
  readonly preLiveRealPnL: false;
  readonly preLiveLiveNetworkDefault: false;
  readonly preLiveScheduledJobs: false;
  readonly preLiveRuntimeMonitoring: false;
  readonly preLiveRuntimeCollectors: false;
  readonly preLiveProviderExpansion: false;
  readonly preLiveSecretsRequired: false;
  readonly preLiveFilesystemWrites: false;
  readonly preLivePersistence: false;
  readonly preLiveRouteHandlers: false;
  readonly preLiveRuntimeRequests: false;
  readonly preLiveUiRendering: false;
  readonly preLiveDomAccess: false;
  readonly preLiveBackgroundJobs: false;
}

export interface PreLiveSafetyCertificationFixture {
  readonly fixtureId: string;
  readonly fixtureName: PreLiveSafetyCertificationName;
  readonly fixtureKind: PreLiveSafetyCertificationKind;
  readonly phase: typeof PRE_LIVE_SAFETY_CERTIFICATION_PHASE;
  readonly schemaVersion: typeof PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SCHEMA_VERSION;
  readonly safetyGate: PreLiveSafetyGate;
  readonly readinessChecklist: PreLiveReadinessChecklist;
  readonly certificationContract: PreLiveCertificationContract;
  readonly evidenceBundle: PreLiveEvidenceBundle;
  readonly signoffModel: PreLiveSignoffModel;
  readonly approvalPolicy: PreLiveApprovalPolicy;
  readonly rejectionContract: PreLiveRejectionContract;
  readonly capabilityAudit: PreLiveCapabilityAudit;
  readonly safetyInvariant: PreLiveSafetyInvariant;
  readonly providerReadinessLinkage: PreLiveProviderReadinessLinkage;
  readonly replayReadinessLinkage: PreLiveReplayReadinessLinkage;
  readonly scenarioReadinessLinkage: PreLiveScenarioReadinessLinkage;
  readonly smokeReadinessLinkage: PreLiveSmokeReadinessLinkage;
  readonly riskReadinessLinkage: PreLiveRiskReadinessLinkage;
  readonly scorecard: PreLiveCertificationScorecard;
  readonly certificationReport: PreLiveCertificationReport;
  readonly report: PreLiveCertificationReport;
  readonly viewModel: PreLiveViewModel;
  readonly apiContract: PreLiveApiContract;
  readonly selectorExamples: readonly PreLiveSelector[];
  readonly capabilityFlags: PreLiveSafetyCertificationCapabilities;
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
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT;
    readonly source: typeof PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SOURCE;
    readonly version: typeof PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_VERSION;
    readonly phase: typeof PRE_LIVE_SAFETY_CERTIFICATION_PHASE;
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

export interface BuildPreLiveSafetyCertificationFixtureInput {
  readonly fixtureName: PreLiveSafetyCertificationName;
}

export interface PreLiveSafetyCertificationValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface PreLiveSafetyCertificationValidationResult {
  readonly valid: boolean;
  readonly issues: readonly PreLiveSafetyCertificationValidationIssue[];
}

export interface PreLiveSafetyCertificationSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
