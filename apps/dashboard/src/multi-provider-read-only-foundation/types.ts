import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { ReadOnlyProviderAdapterGateName } from '../read-only-provider-adapter-gate/types.js';
import type { ReadOnlySolanaProviderBoundaryName } from '../read-only-solana-provider-boundary/types.js';

export const MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE = 66 as const;
export const PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT =
  '2026-05-12T00:00:00.000Z' as const;
export const PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SOURCE =
  'phase66_multi_provider_read_only_foundation_v1' as const;
export const PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_VERSION = '1.0.0' as const;
export const PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SCHEMA_VERSION = '1.0.0' as const;

export const MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES = [
  'single-provider-healthy',
  'multi-provider-healthy',
  'stale-primary-provider',
  'fallback-to-secondary',
  'all-providers-stale-fail-closed',
  'disabled-provider-blocked',
  'capability-mismatch-rejected',
  'unsafe-write-capability-rejected',
] as const;

export const MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS = [
  'single_provider_healthy',
  'multi_provider_healthy',
  'stale_primary_provider',
  'fallback_to_secondary',
  'all_providers_stale_fail_closed',
  'disabled_provider_blocked',
  'capability_mismatch_rejected',
  'unsafe_write_capability_rejected',
] as const;

export type MultiProviderReadOnlyFoundationName =
  (typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)[number];
export type MultiProviderReadOnlyFoundationKind =
  (typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS)[number];

export type MultiProviderHealthStatus = 'healthy' | 'degraded' | 'stale' | 'blocked' | 'rejected';
export type ReadOnlyStaleAction = 'use_stale_with_warning' | 'use_fallback' | 'fail_closed';

export interface MultiProviderEntryCapabilityFlags {
  readonly readOnly: true;
  readonly liveDataDefault: false;
  readonly networkAccessDefault: false;
  readonly writeMethods: false;
  readonly walletLogic: false;
  readonly privateKeyHandling: false;
  readonly signing: false;
  readonly transactionSending: false;
  readonly execution: false;
  readonly tradingSignals: false;
  readonly recommendations: false;
  readonly investmentAdvice: false;
  readonly routeHandlers: false;
  readonly runtimeRequests: false;
  readonly uiRendering: false;
  readonly domAccess: false;
  readonly persistence: false;
  readonly filesystemWrites: false;
  readonly backgroundJobs: false;
  readonly scheduledJobs: false;
  readonly realOrders: false;
  readonly realFunds: false;
  readonly realPnL: false;
  readonly gateBypass: false;
  readonly providerSdkRequired: false;
  readonly apiKeysRequired: false;
}

export interface MultiProviderRegistryEntry {
  readonly providerId: string;
  readonly providerName: string;
  readonly providerKind: 'first_read_only_provider_adapter_fixture';
  readonly sourceAdapterFixtureName: FirstReadOnlyProviderAdapterName;
  readonly sourceBoundaryFixtureName: ReadOnlySolanaProviderBoundaryName;
  readonly sourceGateFixtureName: ReadOnlyProviderAdapterGateName;
  readonly readOnly: true;
  readonly enabledByDefault: boolean;
  readonly liveDataDefault: false;
  readonly networkAccessDefault: false;
  readonly capabilityFlags: MultiProviderEntryCapabilityFlags;
}

export interface MultiProviderRegistry {
  readonly providerRegistryId: string;
  readonly registryName: string;
  readonly providerEntries: readonly MultiProviderRegistryEntry[];
  readonly defaultProviderOrder: readonly string[];
  readonly disabledProviderEntries: readonly string[];
  readonly gateRequired: true;
  readonly boundaryRequired: true;
  readonly adapterRequired: true;
}

export interface MultiProviderNormalizedRecord {
  readonly normalizedProviderRecordId: string;
  readonly providerId: string;
  readonly normalizedFields: readonly string[];
  readonly missingFields: readonly string[];
  readonly semanticCaveats: readonly string[];
  readonly sourceFixtureRefs: {
    readonly sourceAdapterFixtureName: FirstReadOnlyProviderAdapterName;
    readonly sourceBoundaryFixtureName: ReadOnlySolanaProviderBoundaryName;
    readonly sourceGateFixtureName: ReadOnlyProviderAdapterGateName;
  };
}

export interface MultiProviderHealthScore {
  readonly healthScoreId: string;
  readonly providerId: string;
  readonly status: MultiProviderHealthStatus;
  readonly score: number;
  readonly reasonCodes: readonly string[];
  readonly staleDataImpact: number;
  readonly gateImpact: number;
  readonly conformanceImpact: number;
}

export interface MultiProviderStaleDataCheck {
  readonly staleDataCheckId: string;
  readonly providerId: string;
  readonly observedAt: string;
  readonly freshnessWindow: number;
  readonly stale: boolean;
  readonly staleReason: string;
  readonly deterministicOnly: true;
}

export interface MultiProviderFreshnessPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly maxAgeMs: number;
  readonly staleAction: ReadOnlyStaleAction;
  readonly failClosed: true;
  readonly noLiveRefresh: true;
}

export interface MultiProviderCachePolicy {
  readonly cachePolicyId: string;
  readonly policyName: string;
  readonly fixtureOnly: true;
  readonly persistentCache: false;
  readonly filesystemCache: false;
  readonly browserCache: false;
  readonly deterministicTtlMs: number;
}

export interface MultiProviderSelectionFixture {
  readonly selectionId: string;
  readonly selectedProviderId: string;
  readonly fallbackProviderIds: readonly string[];
  readonly selectionReason: string;
  readonly failClosed: true;
  readonly noLiveCall: true;
}

export interface MultiProviderFallbackFixture {
  readonly fallbackPolicyId: string;
  readonly primaryProviderId: string;
  readonly fallbackProviderIds: readonly string[];
  readonly fallbackReasonCodes: readonly string[];
  readonly unsafeFallbackBlocked: true;
}

export interface MultiProviderConformanceSummary {
  readonly conformanceId: string;
  readonly phase65AdapterLinkageValid: boolean;
  readonly phase64BoundaryLinkageValid: boolean;
  readonly phase63GateLinkageValid: boolean;
  readonly registryOrderValid: boolean;
  readonly noUnsafeCapabilities: boolean;
  readonly summary: string;
}

export interface MultiProviderReadOnlyFoundationReport {
  readonly reportId: string;
  readonly registrySummary: string;
  readonly healthSummary: string;
  readonly staleDataSummary: string;
  readonly freshnessSummary: string;
  readonly cachePolicySummary: string;
  readonly selectionSummary: string;
  readonly fallbackSummary: string;
  readonly safetySummary: string;
}

export interface MultiProviderReadOnlyFoundationViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: MultiProviderReadOnlyFoundationName;
  readonly selectedProviderId: string;
  readonly fallbackProviderIds: readonly string[];
  readonly staleProviderIds: readonly string[];
  readonly disabledProviderIds: readonly string[];
  readonly summary: string;
}

export interface MultiProviderReadOnlyFoundationApiContract {
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
    readonly data: MultiProviderReadOnlyFoundationViewModel;
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
      readonly selectedProviderId: string;
      readonly staleProviderCount: number;
      readonly failClosed: true;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'MULTI_PROVIDER_READ_ONLY_FOUNDATION_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'MULTI_PROVIDER_READ_ONLY_FOUNDATION_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface MultiProviderReadOnlyFoundationSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: MultiProviderReadOnlyFoundationName;
  readonly fixtureKind?: MultiProviderReadOnlyFoundationKind;
  readonly selectedProviderId?: string;
}

export interface MultiProviderReadOnlyFoundationSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: MultiProviderReadOnlyFoundationKind;
  readonly selectedProviderId: string;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface MultiProviderReadOnlyFoundationCapabilities {
  readonly multiProviderReadOnlyFoundation: true;
  readonly multiProviderReadOnlyRegistry: true;
  readonly deterministicMultiProviderRegistry: true;
  readonly localOnlyMultiProviderRegistry: true;
  readonly fixtureDerivedMultiProviderRegistry: true;
  readonly multiProviderNormalization: true;
  readonly providerHealthScoring: true;
  readonly staleDataDetection: true;
  readonly readOnlyFreshnessPolicies: true;
  readonly readOnlyCachePolicyContracts: true;
  readonly providerSelectionFixtures: true;
  readonly providerFallbackFixtures: true;
  readonly multiProviderConformanceReports: true;
  readonly multiProviderViewModels: true;
  readonly multiProviderApiContracts: true;
  readonly multiProviderSelectors: true;
  readonly multiProviderLiveDataDefault: false;
  readonly multiProviderNetworkAccessDefault: false;
  readonly multiProviderWriteMethods: false;
  readonly multiProviderWalletLogic: false;
  readonly multiProviderPrivateKeyHandling: false;
  readonly multiProviderSigning: false;
  readonly multiProviderTransactionSending: false;
  readonly multiProviderExecution: false;
  readonly multiProviderTradingSignals: false;
  readonly multiProviderRecommendations: false;
  readonly multiProviderInvestmentAdvice: false;
  readonly multiProviderRouteHandlers: false;
  readonly multiProviderRuntimeRequests: false;
  readonly multiProviderUiRendering: false;
  readonly multiProviderDomAccess: false;
  readonly multiProviderPersistence: false;
  readonly multiProviderFilesystemWrites: false;
  readonly multiProviderBackgroundJobs: false;
  readonly multiProviderScheduledJobs: false;
  readonly multiProviderRealOrders: false;
  readonly multiProviderRealFunds: false;
  readonly multiProviderRealPnL: false;
  readonly multiProviderLiveStrategySelection: false;
  readonly multiProviderAutoExecution: false;
}

export interface MultiProviderReadOnlyFoundationFixture {
  readonly fixtureId: string;
  readonly fixtureName: MultiProviderReadOnlyFoundationName;
  readonly fixtureKind: MultiProviderReadOnlyFoundationKind;
  readonly phase: typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE;
  readonly schemaVersion: typeof PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SCHEMA_VERSION;
  readonly providerRegistry: MultiProviderRegistry;
  readonly normalizedProviderRecord: MultiProviderNormalizedRecord;
  readonly providerHealthScores: readonly MultiProviderHealthScore[];
  readonly staleDataChecks: readonly MultiProviderStaleDataCheck[];
  readonly freshnessPolicy: MultiProviderFreshnessPolicy;
  readonly cachePolicy: MultiProviderCachePolicy;
  readonly providerSelection: MultiProviderSelectionFixture;
  readonly providerFallback: MultiProviderFallbackFixture;
  readonly conformanceSummary: MultiProviderConformanceSummary;
  readonly report: MultiProviderReadOnlyFoundationReport;
  readonly viewModel: MultiProviderReadOnlyFoundationViewModel;
  readonly apiContract: MultiProviderReadOnlyFoundationApiContract;
  readonly selectorExamples: readonly MultiProviderReadOnlyFoundationSelectorResult[];
  readonly capabilityFlags: MultiProviderReadOnlyFoundationCapabilities;
  readonly sourceAdapterFixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourceBoundaryFixtureSnapshot: readonly ReadOnlySolanaProviderBoundaryName[];
  readonly sourceGateFixtureSnapshot: readonly ReadOnlyProviderAdapterGateName[];
  readonly meta: {
    readonly generatedAt: typeof PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT;
    readonly source: typeof PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SOURCE;
    readonly version: typeof PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_VERSION;
    readonly phase: typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE;
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

export interface BuildMultiProviderReadOnlyFoundationFixtureInput {
  readonly fixtureName: MultiProviderReadOnlyFoundationName;
}

export interface MultiProviderReadOnlyFoundationValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface MultiProviderReadOnlyFoundationValidationResult {
  readonly valid: boolean;
  readonly issues: readonly MultiProviderReadOnlyFoundationValidationIssue[];
}

export interface MultiProviderReadOnlyFoundationSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
