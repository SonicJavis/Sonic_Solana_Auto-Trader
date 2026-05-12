import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { getCrossProviderDataQualityCapabilities } from './capabilities.js';
import { buildProviderConfidenceScore } from './confidence-scoring.js';
import { buildCrossProviderDataQualityApiContract } from './contracts.js';
import { buildReadOnlyProviderEnrichmentContract } from './enrichment-contracts.js';
import { buildIssueTaxonomy } from './issue-taxonomy.js';
import { buildProviderMismatchReport } from './mismatch-detection.js';
import { buildProviderComparison } from './provider-comparison.js';
import { buildProviderProvenanceRecord } from './provenance.js';
import { buildProviderReconciliationPolicy, buildProviderReconciliationResult } from './reconciliation-policy.js';
import { buildCrossProviderDataQualityReport } from './reports.js';
import type {
  BuildCrossProviderDataQualityFixtureInput,
  CrossProviderDataQualityFixture,
  CrossProviderDataQualityKind,
  CrossProviderDataQualityName,
  DataQualitySeverity,
  ProviderDataQualityIssue,
  ProviderMismatchCategory,
} from './types.js';
import {
  CROSS_PROVIDER_DATA_QUALITY_PHASE,
  PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT,
  PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SCHEMA_VERSION,
  PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SOURCE,
  PHASE_67_CROSS_PROVIDER_DATA_QUALITY_VERSION,
} from './types.js';
import { buildCrossProviderDataQualityViewModel } from './view-models.js';

interface Scenario {
  readonly fixtureKind: CrossProviderDataQualityKind;
  readonly sourcePhase66FixtureName: (typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)[number];
  readonly providerIds: readonly string[];
  readonly selectedProviderId: string;
  readonly rejectedProviderIds: readonly string[];
  readonly comparedFieldPaths: readonly string[];
  readonly agreements: readonly string[];
  readonly mismatches: readonly string[];
  readonly missingFields: readonly string[];
  readonly staleFields: readonly string[];
  readonly partialFields: readonly string[];
  readonly mismatchKind: ProviderMismatchCategory;
  readonly mismatchFieldPath: string;
  readonly mismatchSeverity: DataQualitySeverity;
  readonly confidenceScore: number;
  readonly issueKind: ProviderDataQualityIssue['issueKind'];
  readonly issueSeverity: ProviderDataQualityIssue['severity'];
  readonly unresolvedFieldPaths: readonly string[];
  readonly failClosed: boolean;
  readonly summary: string;
}

const SCENARIOS: Readonly<Record<CrossProviderDataQualityName, Scenario>> = {
  'all-providers-agree-high-confidence': {
    fixtureKind: 'all_providers_agree_high_confidence',
    sourcePhase66FixtureName: 'multi-provider-healthy',
    providerIds: ['provider-a', 'provider-b', 'provider-c'],
    selectedProviderId: 'provider-a',
    rejectedProviderIds: [],
    comparedFieldPaths: ['token.symbol', 'token.decimals', 'liquidity.total'],
    agreements: ['token.symbol', 'token.decimals', 'liquidity.total'],
    mismatches: [],
    missingFields: [],
    staleFields: [],
    partialFields: [],
    mismatchKind: 'value_mismatch',
    mismatchFieldPath: 'token.symbol',
    mismatchSeverity: 'low',
    confidenceScore: 97,
    issueKind: 'provider_partial_record',
    issueSeverity: 'low',
    unresolvedFieldPaths: [],
    failClosed: false,
    summary: 'All providers agree; reconciliation completed with very high data-quality confidence.',
  },
  'stale-provider-mismatch': {
    fixtureKind: 'stale_provider_mismatch',
    sourcePhase66FixtureName: 'stale-primary-provider',
    providerIds: ['provider-a', 'provider-b'],
    selectedProviderId: 'provider-b',
    rejectedProviderIds: ['provider-a'],
    comparedFieldPaths: ['slot', 'liquidity.total'],
    agreements: ['liquidity.total'],
    mismatches: ['slot'],
    missingFields: [],
    staleFields: ['slot'],
    partialFields: [],
    mismatchKind: 'stale_data',
    mismatchFieldPath: 'slot',
    mismatchSeverity: 'high',
    confidenceScore: 62,
    issueKind: 'provider_stale',
    issueSeverity: 'high',
    unresolvedFieldPaths: ['slot'],
    failClosed: false,
    summary: 'Primary provider was stale; fallback provider selected with medium confidence.',
  },
  'missing-field-partial-confidence': {
    fixtureKind: 'missing_field_partial_confidence',
    sourcePhase66FixtureName: 'capability-mismatch-rejected',
    providerIds: ['provider-a', 'provider-b'],
    selectedProviderId: 'provider-b',
    rejectedProviderIds: ['provider-a'],
    comparedFieldPaths: ['token.symbol', 'token.supply', 'metadata.uri'],
    agreements: ['token.symbol'],
    mismatches: ['metadata.uri'],
    missingFields: ['token.supply'],
    staleFields: [],
    partialFields: ['token.supply'],
    mismatchKind: 'missing_field',
    mismatchFieldPath: 'token.supply',
    mismatchSeverity: 'moderate',
    confidenceScore: 51,
    issueKind: 'provider_missing_field',
    issueSeverity: 'moderate',
    unresolvedFieldPaths: ['token.supply'],
    failClosed: false,
    summary: 'Missing field path detected; partial reconciliation completed with medium confidence.',
  },
  'conflicting-provider-values': {
    fixtureKind: 'conflicting_provider_values',
    sourcePhase66FixtureName: 'multi-provider-healthy',
    providerIds: ['provider-a', 'provider-b', 'provider-c'],
    selectedProviderId: 'provider-a',
    rejectedProviderIds: ['provider-c'],
    comparedFieldPaths: ['liquidity.total', 'holders.top10Pct'],
    agreements: [],
    mismatches: ['liquidity.total', 'holders.top10Pct'],
    missingFields: [],
    staleFields: [],
    partialFields: [],
    mismatchKind: 'value_mismatch',
    mismatchFieldPath: 'liquidity.total',
    mismatchSeverity: 'high',
    confidenceScore: 44,
    issueKind: 'provider_value_conflict',
    issueSeverity: 'high',
    unresolvedFieldPaths: ['liquidity.total'],
    failClosed: false,
    summary: 'Conflicting provider values remain; reconciliation is partial with low confidence.',
  },
  'unhealthy-provider-rejected': {
    fixtureKind: 'unhealthy_provider_rejected',
    sourcePhase66FixtureName: 'disabled-provider-blocked',
    providerIds: ['provider-a', 'provider-b'],
    selectedProviderId: 'provider-a',
    rejectedProviderIds: ['provider-b'],
    comparedFieldPaths: ['health.status', 'token.symbol'],
    agreements: ['token.symbol'],
    mismatches: ['health.status'],
    missingFields: [],
    staleFields: [],
    partialFields: [],
    mismatchKind: 'partial_data',
    mismatchFieldPath: 'health.status',
    mismatchSeverity: 'moderate',
    confidenceScore: 71,
    issueKind: 'provider_unhealthy',
    issueSeverity: 'moderate',
    unresolvedFieldPaths: [],
    failClosed: false,
    summary: 'Unhealthy provider rejected by policy; healthy provider selected with high confidence.',
  },
  'fallback-provider-reconciled': {
    fixtureKind: 'fallback_provider_reconciled',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    providerIds: ['provider-a', 'provider-b', 'provider-c'],
    selectedProviderId: 'provider-b',
    rejectedProviderIds: ['provider-a'],
    comparedFieldPaths: ['slot', 'liquidity.total', 'token.symbol'],
    agreements: ['liquidity.total', 'token.symbol'],
    mismatches: ['slot'],
    missingFields: [],
    staleFields: ['slot'],
    partialFields: [],
    mismatchKind: 'stale_data',
    mismatchFieldPath: 'slot',
    mismatchSeverity: 'moderate',
    confidenceScore: 79,
    issueKind: 'provider_stale',
    issueSeverity: 'moderate',
    unresolvedFieldPaths: [],
    failClosed: false,
    summary: 'Fallback reconciliation selected a fresher provider and resolved stale mismatch safely.',
  },
  'all-providers-conflict-fail-closed': {
    fixtureKind: 'all_providers_conflict_fail_closed',
    sourcePhase66FixtureName: 'all-providers-stale-fail-closed',
    providerIds: ['provider-a', 'provider-b', 'provider-c'],
    selectedProviderId: 'none',
    rejectedProviderIds: ['provider-a', 'provider-b', 'provider-c'],
    comparedFieldPaths: ['token.symbol', 'token.supply', 'liquidity.total'],
    agreements: [],
    mismatches: ['token.symbol', 'token.supply', 'liquidity.total'],
    missingFields: ['token.supply'],
    staleFields: ['liquidity.total'],
    partialFields: ['token.supply'],
    mismatchKind: 'shape_mismatch',
    mismatchFieldPath: 'token.supply',
    mismatchSeverity: 'critical',
    confidenceScore: 0,
    issueKind: 'provider_value_conflict',
    issueSeverity: 'critical',
    unresolvedFieldPaths: ['token.symbol', 'token.supply', 'liquidity.total'],
    failClosed: true,
    summary: 'Critical conflicts across all providers; deterministic policy kept fail-closed state.',
  },
  'unsafe-provider-capability-rejected': {
    fixtureKind: 'unsafe_provider_capability_rejected',
    sourcePhase66FixtureName: 'unsafe-write-capability-rejected',
    providerIds: ['provider-a', 'provider-b'],
    selectedProviderId: 'provider-b',
    rejectedProviderIds: ['provider-a'],
    comparedFieldPaths: ['capabilities.writeMethods', 'token.symbol'],
    agreements: ['token.symbol'],
    mismatches: ['capabilities.writeMethods'],
    missingFields: [],
    staleFields: [],
    partialFields: [],
    mismatchKind: 'shape_mismatch',
    mismatchFieldPath: 'capabilities.writeMethods',
    mismatchSeverity: 'critical',
    confidenceScore: 68,
    issueKind: 'provider_unsafe_capability',
    issueSeverity: 'critical',
    unresolvedFieldPaths: ['capabilities.writeMethods'],
    failClosed: false,
    summary: 'Unsafe provider capability detected and rejected before reconciliation selection.',
  },
};

export function buildProviderDataQualityIssue(input: {
  fixtureId: string;
  issueKind: ProviderDataQualityIssue['issueKind'];
  severity: ProviderDataQualityIssue['severity'];
  providerIds: readonly string[];
  fieldPath: string;
  summary: string;
  sourceFixtureRefs: readonly string[];
  confidenceImpact: number;
}): ProviderDataQualityIssue {
  return {
    issueId: `${input.fixtureId}-${input.issueKind}-${input.fieldPath.replace(/[^a-z0-9]/gi, '-')}`,
    issueKind: input.issueKind,
    severity: input.severity,
    providerIds: [...input.providerIds],
    fieldPath: input.fieldPath,
    summary: input.summary,
    sourceFixtureRefs: [...input.sourceFixtureRefs],
    confidenceImpact: input.confidenceImpact,
    safetyNotes: ['data-quality-only', 'non-advisory', 'read-only'],
  };
}

export function buildCrossProviderDataQualityFixture(
  input: BuildCrossProviderDataQualityFixtureInput,
): CrossProviderDataQualityFixture {
  const scenario = SCENARIOS[input.fixtureName];
  const fixtureId = `phase67-fixture-${input.fixtureName}`;
  const issue = buildProviderDataQualityIssue({
    fixtureId,
    issueKind: scenario.issueKind,
    severity: scenario.issueSeverity,
    providerIds: scenario.providerIds,
    fieldPath: scenario.mismatchFieldPath,
    summary: scenario.summary,
    sourceFixtureRefs: [scenario.sourcePhase66FixtureName],
    confidenceImpact: Math.max(-100, scenario.confidenceScore - 100),
  });
  const providerComparison = buildProviderComparison({
    fixtureId,
    comparisonKind: scenario.mismatches.length === 0 ? 'agreement' : scenario.mismatchKind,
    providerIds: scenario.providerIds,
    comparedFieldPaths: scenario.comparedFieldPaths,
    agreements: scenario.agreements,
    mismatches: scenario.mismatches,
    missingFields: scenario.missingFields,
    staleFields: scenario.staleFields,
    partialFields: scenario.partialFields,
  });
  const mismatchReport = buildProviderMismatchReport({
    fixtureId,
    mismatchKind: scenario.mismatchKind,
    providerIds: scenario.providerIds,
    fieldPath: scenario.mismatchFieldPath,
    expectedShape: 'deterministic_phase66_normalized_shape',
    observedShapes: scenario.mismatches.length === 0 ? ['matching'] : ['provider-disagreement'],
    severity: scenario.mismatchSeverity,
    confidenceImpact: Math.max(-100, scenario.confidenceScore - 100),
    sourceRefs: [scenario.sourcePhase66FixtureName, issue.issueId],
  });
  const confidence = buildProviderConfidenceScore({
    fixtureId,
    score: scenario.confidenceScore,
    reasonCodes: [
      scenario.failClosed ? 'fail_closed_conflict' : 'reconciled_deterministically',
      scenario.mismatches.length === 0 ? 'provider_agreement' : 'provider_mismatch_detected',
    ],
    healthImpact: scenario.rejectedProviderIds.length > 0 ? -15 : 0,
    freshnessImpact: scenario.staleFields.length > 0 ? -20 : 5,
    mismatchImpact: scenario.mismatches.length * -10,
    conformanceImpact: 10,
    sourceRefs: [scenario.sourcePhase66FixtureName],
  });
  const reconciliationResult = buildProviderReconciliationResult({
    fixtureId,
    selectedProviderId: scenario.selectedProviderId,
    rejectedProviderIds: scenario.rejectedProviderIds,
    unresolvedFieldPaths: scenario.unresolvedFieldPaths,
    reconciledFields: scenario.comparedFieldPaths.filter(field => !scenario.unresolvedFieldPaths.includes(field)),
    confidenceScore: confidence.score,
    confidenceLabel: confidence.label,
    issueIds: [issue.issueId],
    failClosed: scenario.failClosed,
    summary: scenario.summary,
  });
  const provenanceRecords = scenario.comparedFieldPaths.map(fieldPath =>
    buildProviderProvenanceRecord({
      fixtureId,
      sourceProviderId: scenario.selectedProviderId,
      sourceFixtureName: scenario.sourcePhase66FixtureName,
      sourcePhase: 66,
      fieldPath,
      sourceKind: 'phase66_foundation_fixture',
    }),
  );
  const enrichmentContract = buildReadOnlyProviderEnrichmentContract({
    fixtureId,
    enrichmentKind: 'quality_enrichment',
    sourceReconciliationId: reconciliationResult.reconciliationId,
    enrichedFields: reconciliationResult.reconciledFields,
    provenanceRefs: provenanceRecords.map(record => record.provenanceId),
    confidenceLabel: confidence.label,
  });
  const base = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: CROSS_PROVIDER_DATA_QUALITY_PHASE,
    schemaVersion: PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SCHEMA_VERSION,
    sourcePhase66FixtureName: scenario.sourcePhase66FixtureName,
    issueTaxonomy: buildIssueTaxonomy(),
    dataQualityIssues: [issue],
    providerComparison,
    mismatchReports: scenario.mismatches.length === 0 ? [] : [mismatchReport],
    reconciliationPolicy: buildProviderReconciliationPolicy({
      fixtureId,
      policyName: 'phase67-deterministic-reconciliation-policy',
      preferFreshness: true,
      preferHigherHealth: true,
      preferConformance: true,
    }),
    reconciliationResult,
    confidenceScore: confidence,
    provenanceRecords,
    enrichmentContract,
    report: {
      reportId: `${fixtureId}-report`,
      comparisonSummary: '',
      mismatchSummary: '',
      reconciliationSummary: '',
      confidenceSummary: '',
      provenanceSummary: '',
      enrichmentSummary: '',
      safetySummary: '',
    },
    viewModel: {
      viewModelId: `${fixtureId}-view-model`,
      fixtureId,
      fixtureName: input.fixtureName,
      selectedProviderId: scenario.selectedProviderId,
      confidenceLabel: confidence.label,
      unresolvedFieldPaths: scenario.unresolvedFieldPaths,
      mismatchCount: scenario.mismatches.length,
      summary: scenario.summary,
    },
    apiContract: {
      list: {
        contractId: `${fixtureId}-contract-list`,
        contractKind: 'list' as const,
        statusCode: 200 as const,
        fixtureOnly: true as const,
        readOnly: true as const,
        localOnly: true as const,
        data: { fixtureIds: [fixtureId], totalCount: 1 },
      },
      detail: {
        contractId: `${fixtureId}-contract-detail`,
        contractKind: 'detail' as const,
        statusCode: 200 as const,
        fixtureOnly: true as const,
        readOnly: true as const,
        localOnly: true as const,
        data: {
          viewModelId: `${fixtureId}-view-model`,
          fixtureId,
          fixtureName: input.fixtureName,
          selectedProviderId: scenario.selectedProviderId,
          confidenceLabel: confidence.label,
          unresolvedFieldPaths: scenario.unresolvedFieldPaths,
          mismatchCount: scenario.mismatches.length,
          summary: scenario.summary,
        },
      },
      summary: {
        contractId: `${fixtureId}-contract-summary`,
        contractKind: 'summary' as const,
        statusCode: 200 as const,
        fixtureOnly: true as const,
        readOnly: true as const,
        localOnly: true as const,
        data: {
          fixtureId,
          selectedProviderId: scenario.selectedProviderId,
          confidenceLabel: confidence.label,
          failClosed: scenario.failClosed,
        },
      },
      errors: [
        {
          contractId: `${fixtureId}-contract-error-400`,
          contractKind: 'error' as const,
          statusCode: 400 as const,
          errorCode: 'CROSS_PROVIDER_DATA_QUALITY_INVALID_REQUEST' as const,
          message: 'Invalid cross-provider data-quality fixture request.',
        },
        {
          contractId: `${fixtureId}-contract-error-404`,
          contractKind: 'error' as const,
          statusCode: 404 as const,
          errorCode: 'CROSS_PROVIDER_DATA_QUALITY_NOT_FOUND' as const,
          message: 'Cross-provider data-quality fixture not found.',
        },
      ] as const,
    },
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: scenario.fixtureKind,
        selectedProviderId: scenario.selectedProviderId,
        matched: true,
        source: 'synthetic_fixture_only' as const,
      },
    ],
    capabilityFlags: getCrossProviderDataQualityCapabilities(),
    sourcePhase66FixtureSnapshot: MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
    meta: {
      generatedAt: PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT,
      source: PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SOURCE,
      version: PHASE_67_CROSS_PROVIDER_DATA_QUALITY_VERSION,
      phase: CROSS_PROVIDER_DATA_QUALITY_PHASE,
      deterministicSeed: `phase67-seed-${input.fixtureName}`,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveData: true,
      noNetworkAccessByDefault: true,
      nonAdvisory: true,
      notExecutable: true,
    },
  } satisfies CrossProviderDataQualityFixture;

  const viewModel = buildCrossProviderDataQualityViewModel(base);
  const report = buildCrossProviderDataQualityReport({ ...base, viewModel });
  const apiContract = buildCrossProviderDataQualityApiContract({
    fixtureId: base.fixtureId,
    viewModel,
    reconciliationResult,
  });

  return {
    ...base,
    report,
    viewModel,
    apiContract,
  };
}
