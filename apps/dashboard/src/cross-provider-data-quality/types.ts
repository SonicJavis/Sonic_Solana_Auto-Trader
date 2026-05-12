import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';

export const CROSS_PROVIDER_DATA_QUALITY_PHASE = 67 as const;
export const PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT = '2026-05-12T00:00:00.000Z' as const;
export const PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SOURCE =
  'phase67_cross_provider_data_quality_and_reconciliation_v1' as const;
export const PHASE_67_CROSS_PROVIDER_DATA_QUALITY_VERSION = '1.0.0' as const;
export const PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SCHEMA_VERSION = '1.0.0' as const;

export const CROSS_PROVIDER_DATA_QUALITY_NAMES = [
  'all-providers-agree-high-confidence',
  'stale-provider-mismatch',
  'missing-field-partial-confidence',
  'conflicting-provider-values',
  'unhealthy-provider-rejected',
  'fallback-provider-reconciled',
  'all-providers-conflict-fail-closed',
  'unsafe-provider-capability-rejected',
] as const;

export const CROSS_PROVIDER_DATA_QUALITY_KINDS = [
  'all_providers_agree_high_confidence',
  'stale_provider_mismatch',
  'missing_field_partial_confidence',
  'conflicting_provider_values',
  'unhealthy_provider_rejected',
  'fallback_provider_reconciled',
  'all_providers_conflict_fail_closed',
  'unsafe_provider_capability_rejected',
] as const;

export const DATA_QUALITY_ISSUE_KINDS = [
  'provider_stale',
  'provider_missing_field',
  'provider_value_conflict',
  'provider_unhealthy',
  'provider_unsafe_capability',
  'provider_partial_record',
] as const;
export const DATA_QUALITY_SEVERITIES = ['low', 'moderate', 'high', 'critical'] as const;
export const DATA_QUALITY_CONFIDENCE_LABELS = ['none', 'low', 'medium', 'high', 'very_high'] as const;
export const PROVIDER_TRUST_LABELS = ['trusted', 'degraded', 'untrusted', 'rejected'] as const;
export const MISMATCH_CATEGORIES = [
  'value_mismatch',
  'missing_field',
  'stale_data',
  'partial_data',
  'shape_mismatch',
] as const;
export const RECONCILIATION_STATUS_LABELS = [
  'fully_reconciled',
  'reconciled_with_fallback',
  'partially_reconciled',
  'fail_closed',
] as const;

export type CrossProviderDataQualityName = (typeof CROSS_PROVIDER_DATA_QUALITY_NAMES)[number];
export type CrossProviderDataQualityKind = (typeof CROSS_PROVIDER_DATA_QUALITY_KINDS)[number];
export type DataQualityIssueKind = (typeof DATA_QUALITY_ISSUE_KINDS)[number];
export type DataQualitySeverity = (typeof DATA_QUALITY_SEVERITIES)[number];
export type DataQualityConfidenceLabel = (typeof DATA_QUALITY_CONFIDENCE_LABELS)[number];
export type ProviderTrustLabel = (typeof PROVIDER_TRUST_LABELS)[number];
export type ProviderMismatchCategory = (typeof MISMATCH_CATEGORIES)[number];
export type ReconciliationStatusLabel = (typeof RECONCILIATION_STATUS_LABELS)[number];

export interface ProviderDataQualityIssue {
  readonly issueId: string;
  readonly issueKind: DataQualityIssueKind;
  readonly severity: DataQualitySeverity;
  readonly providerIds: readonly string[];
  readonly fieldPath: string;
  readonly summary: string;
  readonly sourceFixtureRefs: readonly string[];
  readonly confidenceImpact: number;
  readonly safetyNotes: readonly string[];
}

export interface ProviderComparison {
  readonly comparisonId: string;
  readonly comparisonKind: ProviderMismatchCategory | 'agreement';
  readonly providerIds: readonly string[];
  readonly comparedFieldPaths: readonly string[];
  readonly agreements: readonly string[];
  readonly mismatches: readonly string[];
  readonly missingFields: readonly string[];
  readonly staleFields: readonly string[];
  readonly partialFields: readonly string[];
  readonly deterministicOnly: true;
}

export interface ProviderMismatchReport {
  readonly mismatchReportId: string;
  readonly mismatchKind: ProviderMismatchCategory;
  readonly providerIds: readonly string[];
  readonly fieldPath: string;
  readonly expectedShape: string;
  readonly observedShapes: readonly string[];
  readonly severity: DataQualitySeverity;
  readonly confidenceImpact: number;
  readonly sourceRefs: readonly string[];
}

export interface ProviderReconciliationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly failClosed: true;
  readonly preferFreshness: boolean;
  readonly preferHigherHealth: boolean;
  readonly preferConformance: boolean;
  readonly rejectUnsafeProviders: true;
  readonly noLiveFallback: true;
  readonly noLiveRefresh: true;
}

export interface ProviderReconciliationResult {
  readonly reconciliationId: string;
  readonly selectedProviderId: string;
  readonly rejectedProviderIds: readonly string[];
  readonly unresolvedFieldPaths: readonly string[];
  readonly reconciledFields: readonly string[];
  readonly confidenceScore: number;
  readonly confidenceLabel: DataQualityConfidenceLabel;
  readonly issueIds: readonly string[];
  readonly failClosed: boolean;
  readonly summary: string;
}

export interface ProviderConfidenceScore {
  readonly confidenceScoreId: string;
  readonly score: number;
  readonly label: DataQualityConfidenceLabel;
  readonly reasonCodes: readonly string[];
  readonly healthImpact: number;
  readonly freshnessImpact: number;
  readonly mismatchImpact: number;
  readonly conformanceImpact: number;
  readonly sourceRefs: readonly string[];
}

export interface ProviderProvenanceRecord {
  readonly provenanceId: string;
  readonly sourceProviderId: string;
  readonly sourceFixtureName: string;
  readonly sourcePhase: number;
  readonly fieldPath: string;
  readonly sourceKind: 'phase66_foundation_fixture' | 'phase67_derived';
  readonly deterministicOnly: true;
}

export interface ReadOnlyProviderEnrichmentContract {
  readonly enrichmentContractId: string;
  readonly enrichmentKind: 'quality_enrichment' | 'reconciliation_enrichment';
  readonly sourceReconciliationId: string;
  readonly enrichedFields: readonly string[];
  readonly provenanceRefs: readonly string[];
  readonly confidenceLabel: DataQualityConfidenceLabel;
  readonly readOnly: true;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

export interface CrossProviderDataQualityReport {
  readonly reportId: string;
  readonly comparisonSummary: string;
  readonly mismatchSummary: string;
  readonly reconciliationSummary: string;
  readonly confidenceSummary: string;
  readonly provenanceSummary: string;
  readonly enrichmentSummary: string;
  readonly safetySummary: string;
}

export interface CrossProviderDataQualityViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: CrossProviderDataQualityName;
  readonly selectedProviderId: string;
  readonly confidenceLabel: DataQualityConfidenceLabel;
  readonly unresolvedFieldPaths: readonly string[];
  readonly mismatchCount: number;
  readonly summary: string;
}

export interface CrossProviderDataQualityApiContract {
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
    readonly data: CrossProviderDataQualityViewModel;
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
      readonly confidenceLabel: DataQualityConfidenceLabel;
      readonly failClosed: boolean;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'CROSS_PROVIDER_DATA_QUALITY_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'CROSS_PROVIDER_DATA_QUALITY_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface CrossProviderDataQualitySelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: CrossProviderDataQualityName;
  readonly fixtureKind?: CrossProviderDataQualityKind;
  readonly selectedProviderId?: string;
}

export interface CrossProviderDataQualitySelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: CrossProviderDataQualityKind;
  readonly selectedProviderId: string;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface CrossProviderDataQualityCapabilities {
  readonly crossProviderDataQuality: true;
  readonly crossProviderComparison: true;
  readonly deterministicProviderMismatchDetection: true;
  readonly providerReconciliationReports: true;
  readonly providerConfidenceScoring: true;
  readonly providerProvenanceTracking: true;
  readonly readOnlyProviderEnrichmentContracts: true;
  readonly fixtureDerivedProviderQualityModels: true;
  readonly localOnlyProviderQualityModels: true;
  readonly crossProviderQualityViewModels: true;
  readonly crossProviderQualityApiContracts: true;
  readonly crossProviderQualitySelectors: true;
  readonly crossProviderLiveData: false;
  readonly crossProviderNetworkAccess: false;
  readonly crossProviderWriteMethods: false;
  readonly crossProviderWalletLogic: false;
  readonly crossProviderPrivateKeyHandling: false;
  readonly crossProviderSigning: false;
  readonly crossProviderTransactionSending: false;
  readonly crossProviderExecution: false;
  readonly crossProviderTradingSignals: false;
  readonly crossProviderRecommendations: false;
  readonly crossProviderInvestmentAdvice: false;
  readonly crossProviderRouteHandlers: false;
  readonly crossProviderRuntimeRequests: false;
  readonly crossProviderUiRendering: false;
  readonly crossProviderDomAccess: false;
  readonly crossProviderPersistence: false;
  readonly crossProviderFilesystemWrites: false;
  readonly crossProviderBackgroundJobs: false;
  readonly crossProviderScheduledJobs: false;
  readonly crossProviderRealOrders: false;
  readonly crossProviderRealFunds: false;
  readonly crossProviderRealPnL: false;
  readonly crossProviderLiveReconciliation: false;
  readonly crossProviderAutoExecution: false;
}

export interface CrossProviderDataQualityFixture {
  readonly fixtureId: string;
  readonly fixtureName: CrossProviderDataQualityName;
  readonly fixtureKind: CrossProviderDataQualityKind;
  readonly phase: typeof CROSS_PROVIDER_DATA_QUALITY_PHASE;
  readonly schemaVersion: typeof PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SCHEMA_VERSION;
  readonly sourcePhase66FixtureName: MultiProviderReadOnlyFoundationName;
  readonly issueTaxonomy: {
    readonly issueKinds: readonly DataQualityIssueKind[];
    readonly severities: readonly DataQualitySeverity[];
    readonly confidenceLabels: readonly DataQualityConfidenceLabel[];
    readonly providerTrustLabels: readonly ProviderTrustLabel[];
    readonly mismatchCategories: readonly ProviderMismatchCategory[];
    readonly reconciliationStatuses: readonly ReconciliationStatusLabel[];
  };
  readonly dataQualityIssues: readonly ProviderDataQualityIssue[];
  readonly providerComparison: ProviderComparison;
  readonly mismatchReports: readonly ProviderMismatchReport[];
  readonly reconciliationPolicy: ProviderReconciliationPolicy;
  readonly reconciliationResult: ProviderReconciliationResult;
  readonly confidenceScore: ProviderConfidenceScore;
  readonly provenanceRecords: readonly ProviderProvenanceRecord[];
  readonly enrichmentContract: ReadOnlyProviderEnrichmentContract;
  readonly report: CrossProviderDataQualityReport;
  readonly viewModel: CrossProviderDataQualityViewModel;
  readonly apiContract: CrossProviderDataQualityApiContract;
  readonly selectorExamples: readonly CrossProviderDataQualitySelectorResult[];
  readonly capabilityFlags: CrossProviderDataQualityCapabilities;
  readonly sourcePhase66FixtureSnapshot: readonly MultiProviderReadOnlyFoundationName[];
  readonly meta: {
    readonly generatedAt: typeof PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT;
    readonly source: typeof PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SOURCE;
    readonly version: typeof PHASE_67_CROSS_PROVIDER_DATA_QUALITY_VERSION;
    readonly phase: typeof CROSS_PROVIDER_DATA_QUALITY_PHASE;
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

export interface BuildCrossProviderDataQualityFixtureInput {
  readonly fixtureName: CrossProviderDataQualityName;
}

export interface CrossProviderDataQualityValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface CrossProviderDataQualityValidationResult {
  readonly valid: boolean;
  readonly issues: readonly CrossProviderDataQualityValidationIssue[];
}

export interface CrossProviderDataQualitySafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
