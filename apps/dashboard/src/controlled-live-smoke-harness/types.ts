import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';

export const CONTROLLED_LIVE_SMOKE_HARNESS_PHASE = 74 as const;
export const PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SOURCE =
  'phase74_controlled_live_smoke_harness_expansion_v1' as const;
export const PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_VERSION = '1.0.0' as const;
export const PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SCHEMA_VERSION = '1.0.0' as const;

export const CONTROLLED_LIVE_SMOKE_HARNESS_NAMES = [
  'default-disabled-smoke-plan',
  'manual-trigger-required-plan',
  'standard-ci-smoke-skipped',
  'missing-manual-enable-blocked',
  'unsafe-capability-smoke-rejected',
  'reliability-drift-smoke-warning',
  'replay-import-linked-smoke-plan',
  'read-only-provider-smoke-ready-contract',
] as const;

export const CONTROLLED_LIVE_SMOKE_HARNESS_KINDS = [
  'default_disabled_smoke_plan',
  'manual_trigger_required_plan',
  'standard_ci_smoke_skipped',
  'missing_manual_enable_blocked',
  'unsafe_capability_smoke_rejected',
  'reliability_drift_smoke_warning',
  'replay_import_linked_smoke_plan',
  'read_only_provider_smoke_ready_contract',
] as const;

export const SMOKE_PLAN_KINDS = [
  'offline_fixture_only',
  'manual_only',
  'read_only_check',
  'replay_linked',
  'reliability_linked',
  'certification_linked',
] as const;

export const SMOKE_GUARD_STATES = [
  'disabled',
  'skipped',
  'blocked',
  'manual_approval_required',
] as const;

export const SMOKE_RESULT_KINDS = [
  'disabled',
  'skipped',
  'fixture_pass',
  'fixture_fail',
  'blocked',
  'manual_required',
] as const;

export const SMOKE_RESULT_STATUSES = [
  'disabled',
  'skipped',
  'passed_fixture_only',
  'failed_fixture_only',
  'blocked',
  'manual_required',
] as const;

export const SMOKE_FAILURE_KINDS = [
  'guard_fail_closed',
  'missing_manual_enable',
  'unsafe_capability_detected',
  'reliability_drift_detected',
  'secret_required_in_ci',
  'provider_not_eligible',
  'environment_mismatch',
  'certification_missing',
  'replay_import_incompatible',
] as const;

export const SMOKE_FAILURE_SEVERITIES = ['warning', 'error', 'critical'] as const;

export type ControlledLiveSmokeHarnessName = (typeof CONTROLLED_LIVE_SMOKE_HARNESS_NAMES)[number];
export type ControlledLiveSmokeHarnessKind = (typeof CONTROLLED_LIVE_SMOKE_HARNESS_KINDS)[number];
export type SmokePlanKind = (typeof SMOKE_PLAN_KINDS)[number];
export type SmokeGuardState = (typeof SMOKE_GUARD_STATES)[number];
export type SmokeResultKind = (typeof SMOKE_RESULT_KINDS)[number];
export type SmokeResultStatus = (typeof SMOKE_RESULT_STATUSES)[number];
export type SmokeFailureKind = (typeof SMOKE_FAILURE_KINDS)[number];
export type SmokeFailureSeverity = (typeof SMOKE_FAILURE_SEVERITIES)[number];

export interface SmokePlan {
  readonly smokePlanId: string;
  readonly smokePlanName: string;
  readonly smokePlanKind: SmokePlanKind;
  readonly phase: typeof CONTROLLED_LIVE_SMOKE_HARNESS_PHASE;
  readonly targetProviderId: string;
  readonly sourceCertificationFixtureName: LiveSmokeSafetyCertificationName;
  readonly fixtureOnly: true;
  readonly disabledByDefault: true;
  readonly liveNetworkDefault: false;
  readonly failClosed: true;
}

export interface ManualEnableSmokePolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly requiresManualTrigger: true;
  readonly requiresExplicitFlag: true;
  readonly allowsStandardCi: false;
  readonly allowsScheduledRuns: false;
  readonly requiresSecretsInCi: false;
  readonly failClosed: true;
}

export interface SmokeGuardContract {
  readonly guardId: string;
  readonly guardState: SmokeGuardState;
  readonly defaultDecision: 'skipped';
  readonly liveNetworkAllowedByDefault: false;
  readonly unsafeCapabilityDetected: boolean;
  readonly reasonCodes: readonly string[];
  readonly failClosed: true;
}

export interface ReadOnlySmokeCheckContract {
  readonly checkId: string;
  readonly checkKind: string;
  readonly readOnly: true;
  readonly mutationAllowed: false;
  readonly transactionAllowed: false;
  readonly expectedOutcome: string;
  readonly deterministicFixtureOnly: true;
}

export interface SmokeEligibilityModel {
  readonly eligibilityId: string;
  readonly providerId: string;
  readonly reliabilityCompatible: boolean;
  readonly certificationCompatible: boolean;
  readonly replayImportCompatible: boolean;
  readonly eligibleForManualSmoke: boolean;
  readonly ineligibleReasonCodes: readonly string[];
  readonly failClosed: true;
}

export interface SmokeEnvironmentContract {
  readonly environmentContractId: string;
  readonly standardCiMode: boolean;
  readonly manualOnlyMode: boolean;
  readonly networkDisabledByDefault: true;
  readonly secretsRequiredInStandardCi: false;
  readonly providerKeyRequiredInStandardCi: false;
}

export interface SmokeSecretDenialContract {
  readonly denialId: string;
  readonly deniesSecretRead: true;
  readonly deniesSecretLogging: true;
  readonly deniesApiKeyRequirementInCi: true;
  readonly safetyNotes: string;
}

export interface SmokeResultFixture {
  readonly resultId: string;
  readonly resultKind: SmokeResultKind;
  readonly status: SmokeResultStatus;
  readonly skipped: boolean;
  readonly disabled: boolean;
  readonly providerId: string;
  readonly checkedAt: string;
  readonly liveNetworkUsed: false;
  readonly safetySummary: string;
}

export interface SmokeSkipFixture {
  readonly skipId: string;
  readonly skipKind: string;
  readonly reason: string;
  readonly standardCi: boolean;
  readonly manualTriggerRequired: boolean;
  readonly failClosed: true;
}

export interface SmokeFailureTaxonomy {
  readonly failureId: string;
  readonly failureKind: SmokeFailureKind;
  readonly severity: SmokeFailureSeverity;
  readonly failClosed: boolean;
  readonly reasonCode: string;
  readonly recoveryHint: string;
}

export interface SmokeCertificationReport {
  readonly reportId: string;
  readonly planSummary: string;
  readonly guardSummary: string;
  readonly eligibilitySummary: string;
  readonly environmentSummary: string;
  readonly resultSummary: string;
  readonly failureSummary: string;
  readonly safetySummary: string;
}

export interface SmokeReadinessViewModel {
  readonly viewModelId: string;
  readonly fixtureName: ControlledLiveSmokeHarnessName;
  readonly fixtureId: string;
  readonly providerId: string;
  readonly readinessStatus: string;
  readonly disabledByDefault: boolean;
  readonly guardState: SmokeGuardState;
  readonly summary: string;
}

export interface SmokeApiContract {
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

export interface SmokeSelector {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ControlledLiveSmokeHarnessKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

export interface SmokeSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: ControlledLiveSmokeHarnessName;
  readonly fixtureKind?: ControlledLiveSmokeHarnessKind;
}

export interface ControlledLiveSmokeHarnessCapabilities {
  // Positive flags
  readonly controlledLiveSmokeHarness: true;
  readonly deterministicSmokeHarnessFixtures: true;
  readonly disabledByDefaultSmokePlans: true;
  readonly manualEnableSmokePolicies: true;
  readonly smokeGuardContracts: true;
  readonly readOnlySmokeCheckContracts: true;
  readonly smokeEligibilityModels: true;
  readonly smokeEnvironmentContracts: true;
  readonly smokeSecretDenialContracts: true;
  readonly smokeResultFixtures: true;
  readonly smokeSkipFixtures: true;
  readonly smokeFailureTaxonomy: true;
  readonly smokeCertificationReports: true;
  readonly smokeReadinessViewModels: true;
  readonly smokeApiContracts: true;
  readonly smokeSelectors: true;
  // Negative flags
  readonly smokeLiveNetworkDefault: false;
  readonly smokeRunsInStandardCi: false;
  readonly smokeScheduledRuns: false;
  readonly smokeRuntimeMonitoring: false;
  readonly smokeRuntimeCollectors: false;
  readonly smokeSecretsRequired: false;
  readonly smokeProviderExpansion: false;
  readonly smokeWriteMethods: false;
  readonly smokeWalletLogic: false;
  readonly smokePrivateKeyHandling: false;
  readonly smokeSigning: false;
  readonly smokeTransactionSending: false;
  readonly smokeExecution: false;
  readonly smokeTradingSignals: false;
  readonly smokeRecommendations: false;
  readonly smokeInvestmentAdvice: false;
  readonly smokeRouteHandlers: false;
  readonly smokeRuntimeRequests: false;
  readonly smokeUiRendering: false;
  readonly smokeDomAccess: false;
  readonly smokePersistence: false;
  readonly smokeFilesystemWrites: false;
  readonly smokeBackgroundJobs: false;
  readonly smokeScheduledJobs: false;
  readonly smokeRealOrders: false;
  readonly smokeRealFunds: false;
  readonly smokeRealPnL: false;
}

export interface ControlledLiveSmokeHarnessFixture {
  readonly fixtureId: string;
  readonly fixtureName: ControlledLiveSmokeHarnessName;
  readonly fixtureKind: ControlledLiveSmokeHarnessKind;
  readonly phase: typeof CONTROLLED_LIVE_SMOKE_HARNESS_PHASE;
  readonly schemaVersion: typeof PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SCHEMA_VERSION;
  readonly smokePlan: SmokePlan;
  readonly manualEnablePolicy: ManualEnableSmokePolicy;
  readonly guardContract: SmokeGuardContract;
  readonly readOnlyCheckContract: ReadOnlySmokeCheckContract;
  readonly eligibilityModel: SmokeEligibilityModel;
  readonly environmentContract: SmokeEnvironmentContract;
  readonly secretDenialContract: SmokeSecretDenialContract;
  readonly resultFixture: SmokeResultFixture;
  readonly skipFixture: SmokeSkipFixture;
  readonly failureTaxonomy: SmokeFailureTaxonomy;
  readonly certificationReport: SmokeCertificationReport;
  readonly readinessViewModel: SmokeReadinessViewModel;
  readonly apiContract: SmokeApiContract;
  readonly selectorExamples: readonly SmokeSelector[];
  readonly capabilityFlags: ControlledLiveSmokeHarnessCapabilities;
  readonly sourcePhase65FixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourcePhase69FixtureSnapshot: readonly LiveSmokeSafetyCertificationName[];
  readonly sourcePhase70FixtureSnapshot: readonly ProviderReliabilityDriftAuditName[];
  readonly sourcePhase73FixtureSnapshot: readonly ProviderAwareReplayImportContractName[];
  readonly sourceRefs: {
    readonly phase65FixtureId: string;
    readonly phase69FixtureId: string;
    readonly phase70FixtureId: string;
    readonly phase73FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT;
    readonly source: typeof PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SOURCE;
    readonly version: typeof PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_VERSION;
    readonly phase: typeof CONTROLLED_LIVE_SMOKE_HARNESS_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveNetwork: true;
    readonly noScheduledSmoke: true;
    readonly noRuntimeMonitoring: true;
    readonly noSecretsRequired: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export interface BuildControlledLiveSmokeHarnessFixtureInput {
  readonly fixtureName: ControlledLiveSmokeHarnessName;
}

export interface ControlledLiveSmokeHarnessValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ControlledLiveSmokeHarnessValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ControlledLiveSmokeHarnessValidationIssue[];
}

export interface ControlledLiveSmokeHarnessSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
