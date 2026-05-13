import type { ControlledLiveSmokeHarnessName } from '../controlled-live-smoke-harness/types.js';
import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { ManualConfirmLiveReadinessName } from '../manual-confirm-live-readiness/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { PreLiveSafetyCertificationName } from '../pre-live-safety-certification/types.js';
import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';

export const MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE = 77 as const;
export const PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SOURCE =
  'phase77_manual_confirm_dry_run_control_contracts_v1' as const;
export const PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_VERSION = '1.0.0' as const;
export const PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SCHEMA_VERSION = '1.0.0' as const;

export const MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES = [
  'dry-run-control-ready',
  'missing-manual-confirm-readiness-blocked',
  'preflight-evidence-incomplete-blocked',
  'dispatch-attempt-blocked',
  'cancellation-requested-safe',
  'abort-state-ready',
  'unsafe-capability-rejected',
  'documentation-review-required',
] as const;

export const MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS = [
  'dry_run_control_ready',
  'missing_manual_confirm_readiness_blocked',
  'preflight_evidence_incomplete_blocked',
  'dispatch_attempt_blocked',
  'cancellation_requested_safe',
  'abort_state_ready',
  'unsafe_capability_rejected',
  'documentation_review_required',
] as const;

export const MANUAL_CONFIRM_DRY_RUN_GATE_STATUSES = ['ready', 'blocked', 'rejected', 'review_required'] as const;
export const MANUAL_CONFIRM_DRY_RUN_PREFLIGHT_STATUSES = ['ready', 'blocked', 'incomplete', 'review_required'] as const;
export const MANUAL_CONFIRM_DRY_RUN_CONTROL_STATUSES = ['ready', 'blocked', 'rejected', 'review_required'] as const;
export const MANUAL_CONFIRM_DRY_RUN_INTENT_STATUSES = ['ready', 'blocked', 'rejected'] as const;
export const MANUAL_CONFIRM_DRY_RUN_ABORT_STATUSES = ['ready', 'pending', 'aborted'] as const;
export const MANUAL_CONFIRM_DRY_RUN_CANCELLATION_STATUSES = ['ready', 'pending', 'cancelled'] as const;
export const MANUAL_CONFIRM_DRY_RUN_SNAPSHOT_STATUSES = ['ready', 'blocked', 'review_required'] as const;
export const MANUAL_CONFIRM_DRY_RUN_DECISION_STATUSES = ['ready', 'blocked', 'review_required'] as const;

export type ManualConfirmDryRunControlName = (typeof MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES)[number];
export type ManualConfirmDryRunControlKind = (typeof MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS)[number];
export type ManualConfirmDryRunGateStatus = (typeof MANUAL_CONFIRM_DRY_RUN_GATE_STATUSES)[number];
export type ManualConfirmDryRunPreflightStatus = (typeof MANUAL_CONFIRM_DRY_RUN_PREFLIGHT_STATUSES)[number];
export type ManualConfirmDryRunControlStatus = (typeof MANUAL_CONFIRM_DRY_RUN_CONTROL_STATUSES)[number];
export type ManualConfirmDryRunIntentStatus = (typeof MANUAL_CONFIRM_DRY_RUN_INTENT_STATUSES)[number];
export type ManualConfirmDryRunAbortStatus = (typeof MANUAL_CONFIRM_DRY_RUN_ABORT_STATUSES)[number];
export type ManualConfirmDryRunCancellationStatus = (typeof MANUAL_CONFIRM_DRY_RUN_CANCELLATION_STATUSES)[number];
export type ManualConfirmDryRunSnapshotStatus = (typeof MANUAL_CONFIRM_DRY_RUN_SNAPSHOT_STATUSES)[number];
export type ManualConfirmDryRunDecisionStatus = (typeof MANUAL_CONFIRM_DRY_RUN_DECISION_STATUSES)[number];

export interface ManualConfirmDryRunGate {
  readonly dryRunGateId: string;
  readonly dryRunGateName: string;
  readonly dryRunGateKind: string;
  readonly phase: typeof MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE;
  readonly gateStatus: ManualConfirmDryRunGateStatus;
  readonly failClosed: true;
  readonly unlockAuthority: false;
  readonly dryRunOnly: true;
  readonly liveExecutionAllowed: false;
  readonly blockingReasonCodes: readonly string[];
}

export interface ManualConfirmOperatorIntent {
  readonly intentId: string;
  readonly intentKind: string;
  readonly operatorIntentLabel: string;
  readonly orderCreationAllowed: false;
  readonly transactionConstructionAllowed: false;
  readonly dispatchAllowed: false;
  readonly intentStatus: ManualConfirmDryRunIntentStatus;
}

export interface ManualConfirmDryRunPreflight {
  readonly preflightId: string;
  readonly sourceReadinessRefs: readonly string[];
  readonly sourceCertificationRefs: readonly string[];
  readonly sourceSmokeRefs: readonly string[];
  readonly preflightStatus: ManualConfirmDryRunPreflightStatus;
  readonly failClosed: true;
}

export interface ManualConfirmDryRunControl {
  readonly controlId: string;
  readonly controlKind: string;
  readonly dryRunOnly: true;
  readonly liveNetworkAllowed: false;
  readonly executionAllowed: false;
  readonly dispatchAllowed: false;
  readonly controlStatus: ManualConfirmDryRunControlStatus;
}

export interface ManualConfirmDispatchBlock {
  readonly blockId: string;
  readonly blockKind: string;
  readonly dispatchBlocked: true;
  readonly transactionSendBlocked: true;
  readonly reasonCodes: readonly string[];
  readonly safetyNotes: readonly string[];
}

export interface ManualConfirmAbortContract {
  readonly abortId: string;
  readonly abortAllowed: true;
  readonly automaticTransitionAllowed: false;
  readonly usesRuntimeTimers: false;
  readonly status: ManualConfirmDryRunAbortStatus;
}

export interface ManualConfirmCancellationContract {
  readonly cancellationId: string;
  readonly cancellationAllowed: true;
  readonly automaticTransitionAllowed: false;
  readonly usesRuntimeTimers: false;
  readonly status: ManualConfirmDryRunCancellationStatus;
}

export interface ManualConfirmConfirmationSnapshot {
  readonly snapshotId: string;
  readonly sourceManualConfirmReadinessRef: string;
  readonly phraseSnapshotRef: string;
  readonly roleSeparationSnapshotRef: string;
  readonly coolingOffSnapshotRef: string;
  readonly snapshotStatus: ManualConfirmDryRunSnapshotStatus;
}

export interface ManualConfirmSimulatedDecision {
  readonly decisionId: string;
  readonly decisionKind: string;
  readonly dryRunDecisionOnly: true;
  readonly advisoryOutput: false;
  readonly recommendationOutput: false;
  readonly signalOutput: false;
  readonly decisionStatus: ManualConfirmDryRunDecisionStatus;
}

export interface ManualConfirmDryRunEvidence {
  readonly evidenceBundleId: string;
  readonly sourcePhaseRefs: readonly string[];
  readonly sourceFixtureRefs: readonly string[];
  readonly validationCommandRefs: readonly string[];
  readonly safetyGrepRefs: readonly string[];
  readonly docsRefs: readonly string[];
  readonly evidenceComplete: boolean;
}

export interface ManualConfirmDryRunSafetyInvariant {
  readonly invariantId: string;
  readonly invariantKind: string;
  readonly invariantHolds: boolean;
  readonly failClosed: true;
  readonly evidenceRef: string;
}

export interface ManualConfirmDryRunCapabilityAudit {
  readonly auditId: string;
  readonly readOnlyDefault: true;
  readonly fullAutoLocked: true;
  readonly limitedLiveLocked: true;
  readonly noUnlockAuthority: true;
  readonly noOrderCreation: true;
  readonly noTransactionConstruction: true;
  readonly noDispatch: true;
  readonly noExecution: true;
  readonly auditStatus: 'pass' | 'warning' | 'fail';
}

export interface ManualConfirmDryRunReadinessLinkage {
  readonly linkageId: string;
  readonly phase76FixtureRef: string;
  readonly readinessLinked: boolean;
}

export interface ManualConfirmDryRunCertificationLinkage {
  readonly linkageId: string;
  readonly phase75FixtureRef: string;
  readonly certificationLinked: boolean;
}

export interface ManualConfirmDryRunSmokeLinkage {
  readonly linkageId: string;
  readonly phase74FixtureRef: string;
  readonly phase69FixtureRef: string;
  readonly smokeLinked: boolean;
}

export interface ManualConfirmDryRunReplayLinkage {
  readonly linkageId: string;
  readonly phase73FixtureRef: string;
  readonly phase72FixtureRef: string;
  readonly phase70FixtureRef: string;
  readonly phase68FixtureRef: string;
  readonly replayLinked: boolean;
}

export interface ManualConfirmDryRunScorecard {
  readonly scorecardId: string;
  readonly score: number;
  readonly maxScore: number;
  readonly gateStatus: ManualConfirmDryRunGateStatus;
  readonly preflightStatus: ManualConfirmDryRunPreflightStatus;
  readonly controlStatus: ManualConfirmDryRunControlStatus;
}

export interface ManualConfirmDryRunReport {
  readonly reportId: string;
  readonly gateSummary: string;
  readonly intentSummary: string;
  readonly preflightSummary: string;
  readonly controlSummary: string;
  readonly dispatchBlockSummary: string;
  readonly abortSummary: string;
  readonly decisionSummary: string;
  readonly evidenceSummary: string;
  readonly safetySummary: string;
}

export interface ManualConfirmDryRunViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ManualConfirmDryRunControlName;
  readonly gateStatus: ManualConfirmDryRunGateStatus;
  readonly preflightStatus: ManualConfirmDryRunPreflightStatus;
  readonly controlStatus: ManualConfirmDryRunControlStatus;
  readonly summary: string;
}

export interface ManualConfirmDryRunApiContract {
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

export interface ManualConfirmDryRunSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ManualConfirmDryRunControlKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface ManualConfirmDryRunSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: string;
  readonly fixtureKind?: ManualConfirmDryRunControlKind;
}

export interface ManualConfirmDryRunControlCapabilities {
  readonly manualConfirmDryRunControlContracts: true;
  readonly deterministicDryRunControlFixtures: true;
  readonly manualConfirmDryRunGates: true;
  readonly manualConfirmOperatorIntentContracts: true;
  readonly manualConfirmDryRunPreflightContracts: true;
  readonly manualConfirmDryRunControls: true;
  readonly manualConfirmDispatchBlocks: true;
  readonly manualConfirmAbortContracts: true;
  readonly manualConfirmCancellationContracts: true;
  readonly manualConfirmConfirmationSnapshots: true;
  readonly manualConfirmSimulatedDecisions: true;
  readonly manualConfirmDryRunEvidenceBundles: true;
  readonly manualConfirmDryRunSafetyInvariants: true;
  readonly manualConfirmDryRunCapabilityAudits: true;
  readonly manualConfirmDryRunReadinessLinkage: true;
  readonly manualConfirmDryRunCertificationLinkage: true;
  readonly manualConfirmDryRunSmokeLinkage: true;
  readonly manualConfirmDryRunReplayLinkage: true;
  readonly manualConfirmDryRunScorecards: true;
  readonly manualConfirmDryRunReports: true;
  readonly manualConfirmDryRunViewModels: true;
  readonly manualConfirmDryRunApiContracts: true;
  readonly manualConfirmDryRunSelectors: true;
  readonly manualConfirmDryRunUnlockAuthority: false;
  readonly manualConfirmDryRunLiveTrading: false;
  readonly manualConfirmDryRunManualTradingImplementation: false;
  readonly manualConfirmDryRunLimitedLiveUnlock: false;
  readonly manualConfirmDryRunFullAutoUnlock: false;
  readonly manualConfirmDryRunExecution: false;
  readonly manualConfirmDryRunOrderCreation: false;
  readonly manualConfirmDryRunTransactionBuilding: false;
  readonly manualConfirmDryRunTransactionSending: false;
  readonly manualConfirmDryRunWalletLogic: false;
  readonly manualConfirmDryRunPrivateKeyHandling: false;
  readonly manualConfirmDryRunSigning: false;
  readonly manualConfirmDryRunDispatch: false;
  readonly manualConfirmDryRunTradingSignals: false;
  readonly manualConfirmDryRunRecommendations: false;
  readonly manualConfirmDryRunInvestmentAdvice: false;
  readonly manualConfirmDryRunRealOrders: false;
  readonly manualConfirmDryRunRealFunds: false;
  readonly manualConfirmDryRunRealPnL: false;
  readonly manualConfirmDryRunLiveNetworkDefault: false;
  readonly manualConfirmDryRunScheduledJobs: false;
  readonly manualConfirmDryRunRuntimeMonitoring: false;
  readonly manualConfirmDryRunRuntimeCollectors: false;
  readonly manualConfirmDryRunProviderExpansion: false;
  readonly manualConfirmDryRunSecretsRequired: false;
  readonly manualConfirmDryRunApiKeyRequired: false;
  readonly manualConfirmDryRunFilesystemWrites: false;
  readonly manualConfirmDryRunPersistence: false;
  readonly manualConfirmDryRunRouteHandlers: false;
  readonly manualConfirmDryRunRuntimeRequests: false;
  readonly manualConfirmDryRunUiRendering: false;
  readonly manualConfirmDryRunDomAccess: false;
  readonly manualConfirmDryRunBackgroundJobs: false;
}

export interface ManualConfirmDryRunControlFixture {
  readonly fixtureId: string;
  readonly fixtureName: ManualConfirmDryRunControlName;
  readonly fixtureKind: ManualConfirmDryRunControlKind;
  readonly phase: typeof MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE;
  readonly schemaVersion: typeof PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SCHEMA_VERSION;
  readonly dryRunGate: ManualConfirmDryRunGate;
  readonly operatorIntent: ManualConfirmOperatorIntent;
  readonly dryRunPreflight: ManualConfirmDryRunPreflight;
  readonly dryRunControl: ManualConfirmDryRunControl;
  readonly dispatchBlock: ManualConfirmDispatchBlock;
  readonly abortContract: ManualConfirmAbortContract;
  readonly cancellationContract: ManualConfirmCancellationContract;
  readonly confirmationSnapshot: ManualConfirmConfirmationSnapshot;
  readonly simulatedDecision: ManualConfirmSimulatedDecision;
  readonly dryRunEvidence: ManualConfirmDryRunEvidence;
  readonly capabilityAudit: ManualConfirmDryRunCapabilityAudit;
  readonly safetyInvariant: ManualConfirmDryRunSafetyInvariant;
  readonly readinessLinkage: ManualConfirmDryRunReadinessLinkage;
  readonly certificationLinkage: ManualConfirmDryRunCertificationLinkage;
  readonly smokeLinkage: ManualConfirmDryRunSmokeLinkage;
  readonly replayLinkage: ManualConfirmDryRunReplayLinkage;
  readonly scorecard: ManualConfirmDryRunScorecard;
  readonly dryRunReport: ManualConfirmDryRunReport;
  readonly report: ManualConfirmDryRunReport;
  readonly viewModel: ManualConfirmDryRunViewModel;
  readonly apiContract: ManualConfirmDryRunApiContract;
  readonly selectorExamples: readonly ManualConfirmDryRunSelector[];
  readonly capabilityFlags: ManualConfirmDryRunControlCapabilities;
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
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT;
    readonly source: typeof PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SOURCE;
    readonly version: typeof PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_VERSION;
    readonly phase: typeof MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE;
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

export interface BuildManualConfirmDryRunControlFixtureInput {
  readonly fixtureName: ManualConfirmDryRunControlName;
}

export interface ManualConfirmDryRunControlValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ManualConfirmDryRunControlValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ManualConfirmDryRunControlValidationIssue[];
}

export interface ManualConfirmDryRunControlSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
