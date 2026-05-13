import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';

export const PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE = 70 as const;
export const PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT = '2026-05-13T00:00:00.000Z' as const;
export const PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SOURCE =
  'phase70_provider_reliability_telemetry_and_drift_audit_v1' as const;
export const PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_VERSION = '1.0.0' as const;
export const PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION = '1.0.0' as const;

export const PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES = [
  'healthy-provider-stable-telemetry',
  'stale-provider-drift-warning',
  'schema-drift-fail-closed',
  'conformance-regression-blocked',
  'intermittent-provider-instability',
  'cross-provider-mismatch-telemetry',
  'certification-drift-blocked',
  'replay-scenario-drift-linked',
] as const;

export const PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS = [
  'healthy_provider_stable_telemetry',
  'stale_provider_drift_warning',
  'schema_drift_fail_closed',
  'conformance_regression_blocked',
  'intermittent_provider_instability',
  'cross_provider_mismatch_telemetry',
  'certification_drift_blocked',
  'replay_scenario_drift_linked',
] as const;

export const PROVIDER_TELEMETRY_SAMPLE_KINDS = ['health_observation', 'freshness_observation', 'drift_observation'] as const;
export const PROVIDER_TELEMETRY_OBSERVED_STATUSES = ['healthy', 'degraded', 'stale', 'drift_detected', 'blocked'] as const;
export const PROVIDER_TELEMETRY_LATENCY_BUCKETS = ['lt_250ms', '250ms_to_750ms', '750ms_to_1500ms', 'gt_1500ms'] as const;
export const PROVIDER_TELEMETRY_FRESHNESS_BUCKETS = ['fresh', 'aging', 'stale', 'critical_stale'] as const;
export const PROVIDER_RELIABILITY_SCORE_BANDS = ['very_low', 'low', 'medium', 'high'] as const;
export const PROVIDER_CONFIDENCE_LABELS = ['none', 'low', 'medium', 'high', 'very_high'] as const;
export const PROVIDER_DRIFT_KINDS = [
  'schema_drift',
  'conformance_drift',
  'freshness_drift',
  'certification_drift',
  'cross_provider_drift',
  'replay_drift',
] as const;
export const PROVIDER_DRIFT_SEVERITIES = ['low', 'moderate', 'high', 'critical'] as const;
export const PROVIDER_CONFORMANCE_STATUSES = ['conformant', 'warning', 'regressed', 'critical'] as const;
export const PROVIDER_INSTABILITY_EVENT_KINDS = [
  'degraded_provider',
  'stale_provider',
  'inconsistent_provider',
  'certification_mismatch',
  'conformance_regression',
] as const;

export type ProviderReliabilityDriftAuditName = (typeof PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES)[number];
export type ProviderReliabilityDriftAuditKind = (typeof PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS)[number];
export type ProviderTelemetrySampleKind = (typeof PROVIDER_TELEMETRY_SAMPLE_KINDS)[number];
export type ProviderTelemetryObservedStatus = (typeof PROVIDER_TELEMETRY_OBSERVED_STATUSES)[number];
export type ProviderTelemetryLatencyBucket = (typeof PROVIDER_TELEMETRY_LATENCY_BUCKETS)[number];
export type ProviderTelemetryFreshnessBucket = (typeof PROVIDER_TELEMETRY_FRESHNESS_BUCKETS)[number];
export type ProviderReliabilityScoreBand = (typeof PROVIDER_RELIABILITY_SCORE_BANDS)[number];
export type ProviderConfidenceLabel = (typeof PROVIDER_CONFIDENCE_LABELS)[number];
export type ProviderDriftKind = (typeof PROVIDER_DRIFT_KINDS)[number];
export type ProviderDriftSeverity = (typeof PROVIDER_DRIFT_SEVERITIES)[number];
export type ProviderConformanceStatus = (typeof PROVIDER_CONFORMANCE_STATUSES)[number];
export type ProviderInstabilityEventKind = (typeof PROVIDER_INSTABILITY_EVENT_KINDS)[number];

export interface ProviderTelemetrySample {
  readonly telemetryId: string;
  readonly providerId: string;
  readonly providerName: string;
  readonly sourcePhase: 65 | 66 | 67 | 68 | 69;
  readonly sampledAt: string;
  readonly sampleKind: ProviderTelemetrySampleKind;
  readonly observedStatus: ProviderTelemetryObservedStatus;
  readonly latencyBucket: ProviderTelemetryLatencyBucket;
  readonly freshnessBucket: ProviderTelemetryFreshnessBucket;
  readonly schemaVersion: typeof PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

export interface ProviderFreshnessModel {
  readonly freshnessId: string;
  readonly providerId: string;
  readonly stale: boolean;
  readonly staleReasonCode: string;
  readonly observedSlotLagBucket: string;
  readonly observedAgeBucket: string;
  readonly deterministicWindow: string;
  readonly sourceRefs: readonly string[];
}

export interface ProviderReliabilityScore {
  readonly scoreId: string;
  readonly providerId: string;
  readonly score: number;
  readonly scoreBand: ProviderReliabilityScoreBand;
  readonly confidenceLabel: ProviderConfidenceLabel;
  readonly reasonCodes: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly failClosed: boolean;
}

export interface ProviderDriftAudit {
  readonly auditId: string;
  readonly providerId: string;
  readonly driftKind: ProviderDriftKind;
  readonly driftSeverity: ProviderDriftSeverity;
  readonly expectedShapeId: string;
  readonly observedShapeId: string;
  readonly mismatchFields: readonly string[];
  readonly conformanceStatus: ProviderConformanceStatus;
  readonly failClosed: boolean;
}

export interface ProviderSchemaDrift {
  readonly schemaDriftId: string;
  readonly providerId: string;
  readonly expectedSchemaVersion: string;
  readonly observedSchemaVersion: string;
  readonly missingFields: readonly string[];
  readonly extraFields: readonly string[];
  readonly incompatibleFields: readonly string[];
  readonly safeToUse: boolean;
}

export interface ProviderConfidenceTrend {
  readonly trendId: string;
  readonly providerId: string;
  readonly direction: 'improving' | 'stable' | 'degrading';
  readonly confidenceLabel: ProviderConfidenceLabel;
  readonly sampledTelemetryIds: readonly string[];
  readonly sourceRefs: readonly string[];
}

export interface ProviderInstabilityEvent {
  readonly eventId: string;
  readonly providerId: string;
  readonly eventKind: ProviderInstabilityEventKind;
  readonly severity: ProviderDriftSeverity;
  readonly observedAt: string;
  readonly sourceTelemetryIds: readonly string[];
  readonly reasonCode: string;
  readonly safetyNotes: readonly string[];
}

export interface ProviderStaleDataAudit {
  readonly staleAuditId: string;
  readonly providerId: string;
  readonly stale: boolean;
  readonly staleReasonCode: string;
  readonly observedAgeBucket: string;
  readonly sourceFreshnessId: string;
  readonly failClosed: boolean;
}

export interface ProviderConformanceDrift {
  readonly conformanceDriftId: string;
  readonly providerId: string;
  readonly expectedContractId: string;
  readonly observedContractId: string;
  readonly driftSeverity: ProviderDriftSeverity;
  readonly failClosed: boolean;
  readonly reasonCodes: readonly string[];
}

export interface ProviderCertificationTelemetryLinkage {
  readonly linkageId: string;
  readonly providerId: string;
  readonly sourceCertificateId: string;
  readonly certificationStatus: 'certified_offline' | 'certification_failed' | 'manual_review_required';
  readonly telemetryCompatible: boolean;
  readonly driftCompatible: boolean;
  readonly failClosed: boolean;
}

export interface ProviderReplayDriftLinkage {
  readonly replayLinkageId: string;
  readonly providerId: string;
  readonly replayScenarioName: ProviderAwareReplayScenarioName;
  readonly parityStatus: 'passed' | 'failed' | 'rejected';
  readonly driftCompatible: boolean;
  readonly sourceRefs: readonly string[];
}

export interface ProviderReliabilityReport {
  readonly reportId: string;
  readonly providerId: string;
  readonly telemetrySummary: string;
  readonly freshnessSummary: string;
  readonly reliabilitySummary: string;
  readonly driftSummary: string;
  readonly certificationSummary: string;
  readonly safetySummary: string;
}

export interface ProviderReliabilityViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ProviderReliabilityDriftAuditName;
  readonly providerId: string;
  readonly scoreBand: ProviderReliabilityScoreBand;
  readonly confidenceLabel: ProviderConfidenceLabel;
  readonly driftSeverity: ProviderDriftSeverity;
  readonly stale: boolean;
  readonly summary: string;
}

export interface ProviderReliabilityApiContract {
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
    readonly data: ProviderReliabilityViewModel;
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
      readonly providerId: string;
      readonly scoreBand: ProviderReliabilityScoreBand;
      readonly driftSeverity: ProviderDriftSeverity;
      readonly stale: boolean;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'PROVIDER_RELIABILITY_DRIFT_AUDIT_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'PROVIDER_RELIABILITY_DRIFT_AUDIT_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface ProviderReliabilityDriftAuditSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: ProviderReliabilityDriftAuditName;
  readonly fixtureKind?: ProviderReliabilityDriftAuditKind;
  readonly providerId?: string;
  readonly driftKind?: ProviderDriftKind;
}

export interface ProviderReliabilityDriftAuditSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ProviderReliabilityDriftAuditKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface ProviderReliabilityDriftAuditCapabilities {
  readonly providerReliabilityDriftAudit: true;
  readonly deterministicProviderTelemetryModels: true;
  readonly fixtureDerivedProviderReliability: true;
  readonly providerFreshnessModels: true;
  readonly providerStaleDataAudits: true;
  readonly providerReliabilityScoring: true;
  readonly providerDriftDetection: true;
  readonly providerSchemaDriftAudits: true;
  readonly providerConformanceDriftAudits: true;
  readonly providerInstabilityEvents: true;
  readonly providerCertificationTelemetryLinkage: true;
  readonly providerReplayDriftLinkage: true;
  readonly providerReliabilityReports: true;
  readonly providerReliabilityViewModels: true;
  readonly providerReliabilityApiContracts: true;
  readonly providerReliabilitySelectors: true;
  readonly providerReliabilityLiveTelemetry: false;
  readonly providerReliabilityLiveNetworkAccess: false;
  readonly providerReliabilityRuntimeMonitoring: false;
  readonly providerReliabilitySecretsRequired: false;
  readonly providerReliabilityApiKeyRequired: false;
  readonly providerReliabilityWriteMethods: false;
  readonly providerReliabilityWalletLogic: false;
  readonly providerReliabilityPrivateKeyHandling: false;
  readonly providerReliabilitySigning: false;
  readonly providerReliabilityTransactionSending: false;
  readonly providerReliabilityExecution: false;
  readonly providerReliabilityTradingSignals: false;
  readonly providerReliabilityRecommendations: false;
  readonly providerReliabilityInvestmentAdvice: false;
  readonly providerReliabilityRouteHandlers: false;
  readonly providerReliabilityRuntimeRequests: false;
  readonly providerReliabilityUiRendering: false;
  readonly providerReliabilityDomAccess: false;
  readonly providerReliabilityPersistence: false;
  readonly providerReliabilityFilesystemWrites: false;
  readonly providerReliabilityBackgroundJobs: false;
  readonly providerReliabilityScheduledJobs: false;
  readonly providerReliabilityRealOrders: false;
  readonly providerReliabilityRealFunds: false;
  readonly providerReliabilityRealPnL: false;
  readonly providerReliabilityAutoExecution: false;
  readonly providerReliabilityProviderExpansion: false;
}

export interface ProviderReliabilityDriftAuditFixture {
  readonly fixtureId: string;
  readonly fixtureName: ProviderReliabilityDriftAuditName;
  readonly fixtureKind: ProviderReliabilityDriftAuditKind;
  readonly phase: typeof PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE;
  readonly schemaVersion: typeof PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION;
  readonly telemetrySample: ProviderTelemetrySample;
  readonly freshnessModel: ProviderFreshnessModel;
  readonly reliabilityScore: ProviderReliabilityScore;
  readonly driftAudit: ProviderDriftAudit;
  readonly schemaDrift: ProviderSchemaDrift;
  readonly confidenceTrend: ProviderConfidenceTrend;
  readonly instabilityEvents: readonly ProviderInstabilityEvent[];
  readonly staleDataAudit: ProviderStaleDataAudit;
  readonly conformanceDrift: ProviderConformanceDrift;
  readonly certificationLinkage: ProviderCertificationTelemetryLinkage;
  readonly replayDriftLinkage: ProviderReplayDriftLinkage;
  readonly reliabilityReport: ProviderReliabilityReport;
  readonly viewModel: ProviderReliabilityViewModel;
  readonly apiContract: ProviderReliabilityApiContract;
  readonly selectorExamples: readonly ProviderReliabilityDriftAuditSelectorResult[];
  readonly capabilityFlags: ProviderReliabilityDriftAuditCapabilities;
  readonly sourcePhase65FixtureSnapshot: readonly FirstReadOnlyProviderAdapterName[];
  readonly sourcePhase66FixtureSnapshot: readonly MultiProviderReadOnlyFoundationName[];
  readonly sourcePhase67FixtureSnapshot: readonly CrossProviderDataQualityName[];
  readonly sourcePhase68FixtureSnapshot: readonly ProviderAwareReplayScenarioName[];
  readonly sourcePhase69FixtureSnapshot: readonly LiveSmokeSafetyCertificationName[];
  readonly sourceRefs: {
    readonly phase65FixtureId: string;
    readonly phase66FixtureId: string;
    readonly phase67FixtureId: string;
    readonly phase68FixtureId: string;
    readonly phase69FixtureId: string;
  };
  readonly meta: {
    readonly generatedAt: typeof PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT;
    readonly source: typeof PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SOURCE;
    readonly version: typeof PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_VERSION;
    readonly phase: typeof PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE;
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

export interface BuildProviderReliabilityDriftAuditFixtureInput {
  readonly fixtureName: ProviderReliabilityDriftAuditName;
}

export interface ProviderReliabilityDriftAuditValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ProviderReliabilityDriftAuditValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ProviderReliabilityDriftAuditValidationIssue[];
}

export interface ProviderReliabilityDriftAuditSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
