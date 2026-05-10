/**
 * Phase 52 — Strategy Review Export Audit Report Surface Registry v1: types.
 */

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE = 52 as const;

export const PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT =
  '2026-01-08T00:00:00.000Z' as const;

export const PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE =
  'phase52_strategy_review_export_audit_report_surface_registry_v1' as const;

export const PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_VERSION = '1.0.0' as const;

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_KINDS = [
  'audit-fixtures',
  'report-fixtures',
  'view-models',
  'api-contracts',
  'contract-selectors',
  'selector-view-models',
  'selector-view-model-api-contracts',
] as const;

export type StrategyReviewExportAuditReportSurfaceRegistryEntryKind =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_KINDS)[number];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES = [
  'strategy-review-export-audit-fixtures',
  'strategy-review-export-audit-report-fixtures',
  'strategy-review-export-audit-report-view-models',
  'strategy-review-export-audit-report-api-contracts',
  'strategy-review-export-audit-report-contract-selectors',
  'strategy-review-export-audit-report-selector-view-models',
  'strategy-review-export-audit-report-selector-view-model-api-contracts',
] as const;

export type StrategyReviewExportAuditReportSurfaceRegistryEntryName =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES)[number];

export interface StrategyReviewExportAuditReportSurfaceRegistryCapabilities {
  readonly strategyReviewExportAuditReportSurfaceRegistry: true;
  readonly syntheticStrategyReviewExportAuditReportSurfaceRegistry: true;
  readonly deterministicStrategyReviewExportAuditReportSurfaceRegistry: true;
  readonly localOnlyStrategyReviewExportAuditReportSurfaceRegistry: true;
  readonly readOnlyStrategyReviewExportAuditReportSurfaceRegistry: true;
  readonly fixtureDerivedStrategyReviewExportAuditReportSurfaceRegistry: true;
  readonly aggressiveSafePhasePolicy: true;
  readonly preventsUnnecessaryDerivativeLayers: true;
  readonly strategyReviewExportAuditReportSurfaceRegistryLiveData: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryNetworkAccess: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryPersistence: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryFilesystemWrites: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryDownloads: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryPdfGeneration: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryCsvGeneration: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryHtmlGeneration: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryRouteHandlers: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryHttpServer: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryRuntimeRequests: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryUiRendering: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryDomAccess: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryBackgroundJobs: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryScheduledJobs: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryExecution: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryTradingSignals: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryRecommendations: false;
  readonly strategyReviewExportAuditReportSurfaceRegistryInvestmentAdvice: false;
}

export interface StrategyReviewExportAuditReportSurfaceRegistrySafetySummary {
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly nonEndpoint: true;
  readonly nonHandler: true;
  readonly nonRuntimeRequest: true;
  readonly nonRendering: true;
  readonly nonDom: true;
  readonly nonExecutable: true;
  readonly nonPersistent: true;
  readonly nonNetworked: true;
  readonly nonAdvisory: true;
}

export interface StrategyReviewExportAuditReportSurfaceRegistryConsumerGuidance {
  readonly preferredConsumptionPath: 'phase52-surface-registry';
  readonly avoidFurtherDerivativeLayers: true;
  readonly requiresRealConsumerForNewDerivatives: true;
  readonly notes: readonly string[];
}

export interface StrategyReviewExportAuditReportSurfaceRegistryValidationSummary {
  readonly fixtureOnly: true;
  readonly structuralValidation: 'passed';
  readonly safetyValidation: 'passed';
  readonly linkageValidation: 'passed';
  readonly policyValidation: 'passed';
  readonly issueCount: 0;
}

export interface StrategyReviewExportAuditReportSurfaceRegistryEntry {
  readonly entryId: string;
  readonly entryName: StrategyReviewExportAuditReportSurfaceRegistryEntryName;
  readonly entryKind: StrategyReviewExportAuditReportSurfaceRegistryEntryKind;
  readonly phase: 45 | 46 | 47 | 48 | 49 | 50 | 51;
  readonly modulePath: string;
  readonly docPath: string;
  readonly testPath: string;
  readonly surfaceRole: string;
  readonly sourcePhase: 45 | 46 | 47 | 48 | 49 | 50 | 51;
  readonly sourceEntries: readonly StrategyReviewExportAuditReportSurfaceRegistryEntryName[];
  readonly sourceEntryCount: number;
  readonly isDerivativeLayer: boolean;
  readonly hasRealConsumer: boolean;
  readonly shouldCreateFurtherDerivativeLayer: false;
  readonly consumerGuidance: StrategyReviewExportAuditReportSurfaceRegistryConsumerGuidance;
  readonly capabilitySummary: StrategyReviewExportAuditReportSurfaceRegistryCapabilities;
  readonly safetySummary: StrategyReviewExportAuditReportSurfaceRegistrySafetySummary;
  readonly validationSummary: StrategyReviewExportAuditReportSurfaceRegistryValidationSummary;
  readonly nextMilestoneNotes: readonly string[];
}

export interface StrategyReviewExportAuditReportSurfaceRegistryRelationships {
  readonly phaseChain: readonly [45, 46, 47, 48, 49, 50, 51, 52];
  readonly dependencies: Readonly<Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, readonly StrategyReviewExportAuditReportSurfaceRegistryEntryName[]>>;
  readonly dependents: Readonly<Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, readonly StrategyReviewExportAuditReportSurfaceRegistryEntryName[]>>;
  readonly blocksRecursiveDerivativeLayers: true;
}

export interface StrategyReviewExportAuditReportSurfaceRegistryAggressiveSafePolicy {
  readonly preferVerticalSlicesOverMicroPhases: true;
  readonly disallowWrapperOnWrapperWithoutRealConsumer: true;
  readonly bundleFixturesModelsContractsSelectorsValidationDocsTestsWhenSafe: true;
  readonly keepHardLiveSafetyGates: true;
  readonly preventsUnnecessaryDerivativeLayers: true;
  readonly policyDocPath: 'docs/AGGRESSIVE_SAFE_PHASE_POLICY.md';
  readonly notes: readonly string[];
}

export interface StrategyReviewExportAuditReportSurfaceRegistryNextMilestoneGate {
  readonly nextPhase: 53;
  readonly milestoneName: 'Phase 53 — Synthetic Launch Intelligence Foundation v1';
  readonly implemented: false;
  readonly requiredBeforeAnyLiveTrading: readonly [
    'synthetic fixtures',
    'read-only provider contracts',
    'read-only provider adapters',
    'replay',
    'paper simulation',
    'manual-confirmed tiny live execution',
    'limited-live explicit unlock',
    'full-auto explicit authorization',
  ];
}

export interface StrategyReviewExportAuditReportSurfaceRegistryMeta {
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE;
  readonly registryVersion: typeof PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_VERSION;
  readonly generatedAt: typeof PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT;
  readonly source: typeof PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE;
  readonly deterministicSeed: string;
  readonly sourcePhases: readonly [45, 46, 47, 48, 49, 50, 51, 52];
  readonly fixtureOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly liveData: false;
  readonly networkAccess: false;
  readonly persistence: false;
  readonly runtimeRequests: false;
  readonly uiRendering: false;
  readonly domAccess: false;
  readonly execution: false;
  readonly tradingSignals: false;
  readonly recommendations: false;
  readonly investmentAdvice: false;
}

export interface StrategyReviewExportAuditReportSurfaceRegistry {
  readonly registryId: string;
  readonly registryName: 'strategy-review-export-audit-report-surface-registry';
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE;
  readonly generatedAt: typeof PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT;
  readonly entries: readonly StrategyReviewExportAuditReportSurfaceRegistryEntry[];
  readonly relationships: StrategyReviewExportAuditReportSurfaceRegistryRelationships;
  readonly capabilitySummary: StrategyReviewExportAuditReportSurfaceRegistryCapabilities;
  readonly safetySummary: StrategyReviewExportAuditReportSurfaceRegistrySafetySummary;
  readonly aggressiveSafePolicy: StrategyReviewExportAuditReportSurfaceRegistryAggressiveSafePolicy;
  readonly nextMilestone: StrategyReviewExportAuditReportSurfaceRegistryNextMilestoneGate;
  readonly meta: StrategyReviewExportAuditReportSurfaceRegistryMeta;
}

export interface BuildStrategyReviewExportAuditReportSurfaceRegistryEntryInput {
  readonly entryName: StrategyReviewExportAuditReportSurfaceRegistryEntryName;
}

export interface BuildStrategyReviewExportAuditReportSurfaceRegistryInput {
  readonly entries?: readonly StrategyReviewExportAuditReportSurfaceRegistryEntry[];
}

export interface StrategyReviewExportAuditReportSurfaceRegistryValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewExportAuditReportSurfaceRegistryValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewExportAuditReportSurfaceRegistryValidationIssue[];
}

export interface StrategyReviewExportAuditReportSurfaceRegistrySafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
