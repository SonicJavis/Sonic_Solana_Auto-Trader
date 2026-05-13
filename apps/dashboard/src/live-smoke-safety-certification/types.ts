import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';

export const LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE = 69 as const;
export const PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT = '2026-05-12T00:00:00.000Z' as const;
export const PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SOURCE =
  'phase69_live_smoke_harness_expansion_and_safety_certification_v1' as const;
export const PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_VERSION = '1.0.0' as const;
export const PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SCHEMA_VERSION = '1.0.0' as const;

export const LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES = [
  'standard-ci-smoke-skipped',
  'manual-smoke-disabled-by-default',
  'read-only-provider-certified-offline',
  'unsafe-capability-blocked',
  'missing-provider-config-blocked',
  'stale-provider-certification-warning',
  'cross-provider-quality-gate-blocked',
  'provider-aware-replay-certification-ready',
] as const;

export const LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS = [
  'standard_ci_smoke_skipped',
  'manual_smoke_disabled_by_default',
  'read_only_provider_certified_offline',
  'unsafe_capability_blocked',
  'missing_provider_config_blocked',
  'stale_provider_certification_warning',
  'cross_provider_quality_gate_blocked',
  'provider_aware_replay_certification_ready',
] as const;

export const LIVE_SMOKE_RESULT_STATUSES = [
  'skipped',
  'blocked',
  'certified_offline',
  'certification_failed',
  'manual_required',
] as const;

export const LIVE_SMOKE_CERTIFICATION_STATUSES = ['certified_offline', 'certification_failed', 'manual_review_required'] as const;

export const LIVE_SMOKE_CHECK_KINDS = [
  'health_check_contract',
  'schema_compatibility_check',
  'conformance_check',
  'freshness_check',
  'safety_capability_check',
  'cross_provider_quality_gate_check',
  'provider_replay_certification_readiness_check',
  'provider_configuration_check',
] as const;

export type LiveSmokeSafetyCertificationName = (typeof LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES)[number];
export type LiveSmokeSafetyCertificationKind = (typeof LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS)[number];
export type LiveSmokeResultStatus = (typeof LIVE_SMOKE_RESULT_STATUSES)[number];
export type LiveSmokeCertificationStatus = (typeof LIVE_SMOKE_CERTIFICATION_STATUSES)[number];
export type ReadOnlySmokeCheckKind = (typeof LIVE_SMOKE_CHECK_KINDS)[number];

export interface LiveSmokeConfig {
  readonly configId: string;
  readonly configName: string;
  readonly mode: 'standard_ci_offline' | 'manual_smoke_disabled' | 'manual_smoke_ready';
  readonly standardCi: boolean;
  readonly liveChecksEnabled: false;
  readonly requiresManualOptIn: boolean;
  readonly requiresReadOnlyProvider: true;
  readonly fixtureOnly: true;
}

export interface SmokeGuardPolicy {
  readonly policyId: string;
  readonly failClosed: true;
  readonly skipByDefault: true;
  readonly blockUnsafeCapabilities: true;
  readonly blockWriteMethods: true;
  readonly blockRuntimeRequests: true;
  readonly blockSecrets: true;
  readonly blockExecution: true;
  readonly standardCiOffline: true;
}

export interface SmokePlan {
  readonly smokePlanId: string;
  readonly sourceProviderId: string;
  readonly sourcePhase: 65 | 66 | 67 | 68;
  readonly checkKinds: readonly ReadOnlySmokeCheckKind[];
  readonly expectedOutcome: LiveSmokeResultStatus;
  readonly disabledByDefault: true;
  readonly manualOnly: true;
  readonly readOnlyOnly: true;
  readonly safetyNotes: readonly string[];
}

export interface ReadOnlySmokeCheck {
  readonly checkId: string;
  readonly checkKind: ReadOnlySmokeCheckKind;
  readonly providerId: string;
  readonly expectedCapability: string;
  readonly observedCapability: string;
  readonly passed: boolean;
  readonly reasonCode: string;
  readonly sourceRefs: readonly string[];
  readonly writeMethodDetected: false;
}

export interface ProviderSmokeEligibilityCheck {
  readonly eligibilityId: string;
  readonly providerId: string;
  readonly readOnlyProvider: boolean;
  readonly unsafeCapabilitiesDetected: boolean;
  readonly hasProviderConfig: boolean;
  readonly crossProviderQualityReady: boolean;
  readonly replayCertificationReady: boolean;
  readonly eligible: boolean;
  readonly reasonCodes: readonly string[];
}

export interface NetworkIsolationPolicy {
  readonly isolationPolicyId: string;
  readonly standardCiNetworkAccess: false;
  readonly manualSmokeNetworkAccessAllowed: false;
  readonly endpointRequired: false;
  readonly apiKeyRequired: false;
  readonly timeoutPolicy: string;
  readonly retryPolicyMetadataOnly: string;
}

export interface SmokeResult {
  readonly resultId: string;
  readonly planId: string;
  readonly status: LiveSmokeResultStatus;
  readonly skipped: boolean;
  readonly blocked: boolean;
  readonly certifiedOffline: boolean;
  readonly reasonCodes: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface ProviderCertificationGate {
  readonly gateId: string;
  readonly providerId: string;
  readonly gatePassed: boolean;
  readonly gateStatus: 'passed' | 'blocked' | 'manual_review_required';
  readonly reasonCodes: readonly string[];
}

export interface SafetyCertificate {
  readonly certificateId: string;
  readonly providerId: string;
  readonly certifiedReadOnly: boolean;
  readonly certifiedOfflineCi: boolean;
  readonly certifiedNoSecrets: boolean;
  readonly certifiedNoExecution: boolean;
  readonly certifiedNoAdvisory: boolean;
  readonly certificationStatus: LiveSmokeCertificationStatus;
  readonly failureReasons: readonly string[];
}

export interface OfflineCiCertificationContract {
  readonly contractId: string;
  readonly standardCiDeterministic: true;
  readonly networkAccess: false;
  readonly liveChecksRun: false;
  readonly optionalSmokeSkipped: true;
  readonly validationCommands: readonly string[];
  readonly safetyGrepRequired: true;
}

export interface LiveSmokeCertificationReport {
  readonly reportId: string;
  readonly configSummary: string;
  readonly guardSummary: string;
  readonly planSummary: string;
  readonly resultSummary: string;
  readonly certificateSummary: string;
  readonly safetySummary: string;
  readonly offlineCiSummary: string;
}

export interface LiveSmokeSafetyViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: LiveSmokeSafetyCertificationName;
  readonly smokeStatus: LiveSmokeResultStatus;
  readonly gateStatus: ProviderCertificationGate['gateStatus'];
  readonly certificationStatus: LiveSmokeCertificationStatus;
  readonly summary: string;
}

export interface LiveSmokeSafetyApiContract {
  readonly list: {
    readonly contractId: string;
    readonly contractKind: 'list';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: { readonly fixtureIds: readonly string[]; readonly totalCount: number };
  };
  readonly detail: {
    readonly contractId: string;
    readonly contractKind: 'detail';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: LiveSmokeSafetyViewModel;
  };
  readonly summary: {
    readonly contractId: string;
    readonly contractKind: 'summary';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: {
      readonly fixtureId: string;
      readonly smokeStatus: LiveSmokeResultStatus;
      readonly gateStatus: ProviderCertificationGate['gateStatus'];
      readonly certificationStatus: LiveSmokeCertificationStatus;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'LIVE_SMOKE_SAFETY_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'LIVE_SMOKE_SAFETY_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface LiveSmokeSafetySelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: LiveSmokeSafetyCertificationName;
  readonly fixtureKind?: LiveSmokeSafetyCertificationKind;
  readonly smokeStatus?: LiveSmokeResultStatus;
}

export interface LiveSmokeSafetySelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: LiveSmokeSafetyCertificationKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface LiveSmokeSafetyCertificationCapabilities {
  readonly liveSmokeSafetyCertification: true;
  readonly deterministicSmokeHarnessModels: true;
  readonly disabledByDefaultSmokeGuards: true;
  readonly readOnlySmokeCheckContracts: true;
  readonly providerSmokeEligibilityChecks: true;
  readonly networkIsolationPolicies: true;
  readonly smokeResultModels: true;
  readonly safetyCertificationReports: true;
  readonly offlineCiCertificationContracts: true;
  readonly liveSmokeSafetyViewModels: true;
  readonly liveSmokeSafetyApiContracts: true;
  readonly liveSmokeSafetySelectors: true;
  readonly fixtureDerivedSmokeCertification: true;
  readonly localOnlySmokeCertificationDefaults: true;
  readonly liveSmokeStandardCiNetworkAccess: false;
  readonly liveSmokeDefaultNetworkAccess: false;
  readonly liveSmokeSecretsRequired: false;
  readonly liveSmokeApiKeyRequired: false;
  readonly liveSmokeWriteMethods: false;
  readonly liveSmokeWalletLogic: false;
  readonly liveSmokePrivateKeyHandling: false;
  readonly liveSmokeSigning: false;
  readonly liveSmokeTransactionSending: false;
  readonly liveSmokeExecution: false;
  readonly liveSmokeTradingSignals: false;
  readonly liveSmokeRecommendations: false;
  readonly liveSmokeInvestmentAdvice: false;
  readonly liveSmokeRouteHandlers: false;
  readonly liveSmokeRuntimeRequests: false;
  readonly liveSmokeUiRendering: false;
  readonly liveSmokeDomAccess: false;
  readonly liveSmokePersistence: false;
  readonly liveSmokeFilesystemWrites: false;
  readonly liveSmokeBackgroundJobs: false;
  readonly liveSmokeScheduledJobs: false;
  readonly liveSmokeRealOrders: false;
  readonly liveSmokeRealFunds: false;
  readonly liveSmokeRealPnL: false;
  readonly liveSmokeAutoExecution: false;
  readonly liveSmokeProviderExpansion: false;
  readonly liveSmokeLiveReconciliation: false;
  readonly liveSmokeLiveReplayImport: false;
}

export interface LiveSmokeSafetyCertificationFixture {
  readonly fixtureId: string;
  readonly fixtureName: LiveSmokeSafetyCertificationName;
  readonly fixtureKind: LiveSmokeSafetyCertificationKind;
  readonly phase: typeof LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE;
  readonly schemaVersion: typeof PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SCHEMA_VERSION;
  readonly smokeConfig: LiveSmokeConfig;
  readonly smokeGuardPolicy: SmokeGuardPolicy;
  readonly smokePlan: SmokePlan;
  readonly readOnlyChecks: readonly ReadOnlySmokeCheck[];
  readonly providerEligibility: ProviderSmokeEligibilityCheck;
  readonly networkIsolationPolicy: NetworkIsolationPolicy;
  readonly smokeResult: SmokeResult;
  readonly certificationGate: ProviderCertificationGate;
  readonly safetyCertificate: SafetyCertificate;
  readonly offlineCiContract: OfflineCiCertificationContract;
  readonly certificationReport: LiveSmokeCertificationReport;
  readonly viewModel: LiveSmokeSafetyViewModel;
  readonly apiContract: LiveSmokeSafetyApiContract;
  readonly selectorExamples: readonly LiveSmokeSafetySelectorResult[];
  readonly capabilityFlags: LiveSmokeSafetyCertificationCapabilities;
  readonly sourcePhase65FixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourcePhase66FixtureSnapshot: readonly MultiProviderReadOnlyFoundationName[];
  readonly sourcePhase67FixtureSnapshot: readonly CrossProviderDataQualityName[];
  readonly sourcePhase68FixtureSnapshot: readonly ProviderAwareReplayScenarioName[];
  readonly meta: {
    readonly generatedAt: typeof PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT;
    readonly source: typeof PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SOURCE;
    readonly version: typeof PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_VERSION;
    readonly phase: typeof LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveData: true;
    readonly noNetworkAccessByDefault: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export interface BuildLiveSmokeSafetyCertificationFixtureInput {
  readonly fixtureName: LiveSmokeSafetyCertificationName;
}

export interface LiveSmokeSafetyCertificationValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface LiveSmokeSafetyCertificationValidationResult {
  readonly valid: boolean;
  readonly issues: readonly LiveSmokeSafetyCertificationValidationIssue[];
}

export interface LiveSmokeSafetyCertificationSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
