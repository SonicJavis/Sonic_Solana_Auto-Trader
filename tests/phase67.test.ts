import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  CROSS_PROVIDER_DATA_QUALITY_PHASE,
  CROSS_PROVIDER_DATA_QUALITY_NAMES,
  CROSS_PROVIDER_DATA_QUALITY_KINDS,
  CROSS_PROVIDER_DATA_QUALITY_FIXTURES,
  CROSS_PROVIDER_DATA_QUALITY_FIXTURE_MAP,
  listCrossProviderDataQualityFixtures,
  getCrossProviderDataQualityFixture,
  buildCrossProviderDataQualityFixture,
  buildProviderDataQualityIssue,
  buildProviderComparison,
  buildProviderMismatchReport,
  buildProviderReconciliationPolicy,
  buildProviderReconciliationResult,
  buildProviderConfidenceScore,
  buildProviderProvenanceRecord,
  buildReadOnlyProviderEnrichmentContract,
  buildCrossProviderDataQualityReport,
  buildCrossProviderDataQualityViewModel,
  buildCrossProviderDataQualityApiContract,
  selectCrossProviderDataQualityFixture,
  validateCrossProviderDataQualityFixture,
  validateCrossProviderDataQualitySafety,
  normalizeCrossProviderDataQualityFixture,
  serializeCrossProviderDataQualityFixture,
  areCrossProviderDataQualityFixturesEqual,
  stableDeterministicCrossProviderDataQualityChecksum,
  getCrossProviderDataQualityCapabilities,
  PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT,
  CROSS_PROVIDER_DATA_QUALITY_PHASE as ROOT_PHASE,
  CROSS_PROVIDER_DATA_QUALITY_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../apps/dashboard/src/multi-provider-read-only-foundation/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_67_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/cross-provider-data-quality');
const PHASE_67_FILES = [
  'types.ts',
  'issue-taxonomy.ts',
  'provider-comparison.ts',
  'mismatch-detection.ts',
  'reconciliation-policy.ts',
  'confidence-scoring.ts',
  'provenance.ts',
  'enrichment-contracts.ts',
  'reports.ts',
  'builders.ts',
  'fixtures.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 67 — source file existence', () => {
  for (const file of PHASE_67_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_67_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/CROSS_PROVIDER_DATA_QUALITY.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/CROSS_PROVIDER_DATA_QUALITY.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 67 — constants and fixture tables', () => {
  it('constants and root exports align', () => {
    expect(CROSS_PROVIDER_DATA_QUALITY_PHASE).toBe(67);
    expect(ROOT_PHASE).toBe(67);
    expect(ROOT_FIXTURES).toEqual(CROSS_PROVIDER_DATA_QUALITY_FIXTURES);
    expect(PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT).toBe('2026-05-12T00:00:00.000Z');
  });

  it('has deterministic names/kinds and fixture count', () => {
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toHaveLength(8);
    expect(CROSS_PROVIDER_DATA_QUALITY_KINDS).toHaveLength(8);
    expect(CROSS_PROVIDER_DATA_QUALITY_FIXTURES).toHaveLength(8);
  });

  it('map/list/get helpers are deterministic', () => {
    expect(listCrossProviderDataQualityFixtures()).toEqual(CROSS_PROVIDER_DATA_QUALITY_FIXTURES);
    for (const fixture of CROSS_PROVIDER_DATA_QUALITY_FIXTURES) {
      expect(CROSS_PROVIDER_DATA_QUALITY_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getCrossProviderDataQualityFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getCrossProviderDataQualityFixture('missing')).toBeNull();
  });
});

describe('Phase 67 — fixtures, scenarios, linkage', () => {
  it('fixtures include required deterministic surfaces', () => {
    for (const fixture of CROSS_PROVIDER_DATA_QUALITY_FIXTURES) {
      expect(fixture.phase).toBe(67);
      expect(fixture.dataQualityIssues.length).toBeGreaterThan(0);
      expect(fixture.providerComparison.deterministicOnly).toBe(true);
      expect(fixture.reconciliationPolicy.failClosed).toBe(true);
      expect(fixture.confidenceScore.score).toBeGreaterThanOrEqual(0);
      expect(fixture.confidenceScore.score).toBeLessThanOrEqual(100);
      expect(fixture.enrichmentContract.readOnly).toBe(true);
      expect(fixture.enrichmentContract.liveData).toBe(false);
      expect(fixture.report.safetySummary.toLowerCase()).toContain('read-only');
      expect(fixture.apiContract.errors).toHaveLength(2);
      expect(fixture.selectorExamples.length).toBeGreaterThan(0);
    }
  });

  it('fixtures link to Phase 66 names where practical', () => {
    for (const fixture of CROSS_PROVIDER_DATA_QUALITY_FIXTURES) {
      expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain(fixture.sourcePhase66FixtureName);
    }
  });

  it('required fixture scenarios are present', () => {
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain('all-providers-agree-high-confidence');
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain('stale-provider-mismatch');
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain('missing-field-partial-confidence');
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain('conflicting-provider-values');
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain('unhealthy-provider-rejected');
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain('fallback-provider-reconciled');
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain('all-providers-conflict-fail-closed');
    expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain('unsafe-provider-capability-rejected');
  });
});

describe('Phase 67 — builder helpers and model layers', () => {
  it('fixture builder is deterministic', () => {
    const a = buildCrossProviderDataQualityFixture({ fixtureName: 'fallback-provider-reconciled' });
    const b = buildCrossProviderDataQualityFixture({ fixtureName: 'fallback-provider-reconciled' });
    expect(a).toEqual(b);
  });

  it('individual helper builders produce deterministic records', () => {
    const issue = buildProviderDataQualityIssue({
      fixtureId: 'phase67-fixture-sample',
      issueKind: 'provider_missing_field',
      severity: 'moderate',
      providerIds: ['provider-a'],
      fieldPath: 'token.supply',
      summary: 'missing field',
      sourceFixtureRefs: ['multi-provider-healthy'],
      confidenceImpact: -20,
    });
    const comparison = buildProviderComparison({
      fixtureId: 'phase67-fixture-sample',
      comparisonKind: 'missing_field',
      providerIds: ['provider-a', 'provider-b'],
      comparedFieldPaths: ['token.supply'],
      agreements: [],
      mismatches: ['token.supply'],
      missingFields: ['token.supply'],
      staleFields: [],
      partialFields: ['token.supply'],
    });
    const mismatch = buildProviderMismatchReport({
      fixtureId: 'phase67-fixture-sample',
      mismatchKind: 'missing_field',
      providerIds: ['provider-a', 'provider-b'],
      fieldPath: 'token.supply',
      expectedShape: 'number',
      observedShapes: ['undefined'],
      severity: 'moderate',
      confidenceImpact: -20,
      sourceRefs: ['multi-provider-healthy'],
    });
    const policy = buildProviderReconciliationPolicy({
      fixtureId: 'phase67-fixture-sample',
      policyName: 'policy',
      preferFreshness: true,
      preferHigherHealth: true,
      preferConformance: true,
    });
    const confidence = buildProviderConfidenceScore({
      fixtureId: 'phase67-fixture-sample',
      score: 80,
      reasonCodes: ['good'],
      healthImpact: 0,
      freshnessImpact: 0,
      mismatchImpact: 0,
      conformanceImpact: 0,
      sourceRefs: ['multi-provider-healthy'],
    });
    const reconciliation = buildProviderReconciliationResult({
      fixtureId: 'phase67-fixture-sample',
      selectedProviderId: 'provider-a',
      rejectedProviderIds: [],
      unresolvedFieldPaths: [],
      reconciledFields: ['token.supply'],
      confidenceScore: 80,
      confidenceLabel: confidence.label,
      issueIds: [issue.issueId],
      failClosed: false,
      summary: 'ok',
    });
    const provenance = buildProviderProvenanceRecord({
      fixtureId: 'phase67-fixture-sample',
      sourceProviderId: 'provider-a',
      sourceFixtureName: 'multi-provider-healthy',
      sourcePhase: 66,
      fieldPath: 'token.supply',
      sourceKind: 'phase66_foundation_fixture',
    });
    const enrichment = buildReadOnlyProviderEnrichmentContract({
      fixtureId: 'phase67-fixture-sample',
      enrichmentKind: 'quality_enrichment',
      sourceReconciliationId: reconciliation.reconciliationId,
      enrichedFields: ['token.supply'],
      provenanceRefs: [provenance.provenanceId],
      confidenceLabel: confidence.label,
    });

    expect(issue.issueId).toContain('phase67-fixture-sample');
    expect(comparison.deterministicOnly).toBe(true);
    expect(mismatch.mismatchKind).toBe('missing_field');
    expect(policy.noLiveFallback).toBe(true);
    expect(confidence.label).toBe('high');
    expect(provenance.deterministicOnly).toBe(true);
    expect(enrichment.liveData).toBe(false);
  });
});

describe('Phase 67 — reports, view models, API contracts, selectors', () => {
  it('builds report/view/api from fixture', () => {
    const fixture = CROSS_PROVIDER_DATA_QUALITY_FIXTURES[0]!;
    const view = buildCrossProviderDataQualityViewModel(fixture);
    const report = buildCrossProviderDataQualityReport({ ...fixture, viewModel: view });
    const api = buildCrossProviderDataQualityApiContract({ ...fixture, viewModel: view });
    expect(view.fixtureId).toBe(fixture.fixtureId);
    expect(report.reportId).toContain(fixture.fixtureId);
    expect(api.list.contractKind).toBe('list');
  });

  it('selector finds fixtures and returns deterministic miss', () => {
    const fixture = CROSS_PROVIDER_DATA_QUALITY_FIXTURES[0]!;
    const found = selectCrossProviderDataQualityFixture({ fixtureId: fixture.fixtureId });
    expect(found.matched).toBe(true);
    expect(found.selectedFixtureId).toBe(fixture.fixtureId);

    const missing = selectCrossProviderDataQualityFixture({ fixtureId: 'missing' });
    expect(missing.matched).toBe(false);
    expect(missing.selectedProviderId).toBe('none');
  });
});

describe('Phase 67 — normalization, serialization, equality, determinism', () => {
  it('normalization and serialization are stable', () => {
    const base = clone(CROSS_PROVIDER_DATA_QUALITY_FIXTURES[1]!);
    const scrambled = {
      ...clone(base),
      dataQualityIssues: [...base.dataQualityIssues].reverse(),
      mismatchReports: [...base.mismatchReports].reverse(),
      provenanceRecords: [...base.provenanceRecords].reverse(),
    };
    expect(normalizeCrossProviderDataQualityFixture(scrambled)).toEqual(
      normalizeCrossProviderDataQualityFixture(base),
    );
    expect(serializeCrossProviderDataQualityFixture(scrambled)).toBe(
      serializeCrossProviderDataQualityFixture(base),
    );
    expect(areCrossProviderDataQualityFixturesEqual(scrambled, base)).toBe(true);
  });

  it('checksum helper is stable', () => {
    const checksum = stableDeterministicCrossProviderDataQualityChecksum('phase67-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicCrossProviderDataQualityChecksum('phase67-check')).toBe(checksum);
  });
});

describe('Phase 67 — validation and safety', () => {
  it('all shipped fixtures validate and are safety-clean', () => {
    for (const fixture of CROSS_PROVIDER_DATA_QUALITY_FIXTURES) {
      const validation = validateCrossProviderDataQualityFixture(fixture);
      const safety = validateCrossProviderDataQualitySafety(fixture);
      expect(validation.valid).toBe(true);
      expect(safety.safe).toBe(true);
    }
  });

  it('rejects unsafe capability drift and confidence range violations', () => {
    const fixture = clone(CROSS_PROVIDER_DATA_QUALITY_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      confidenceScore: { ...fixture.confidenceScore, score: 101 },
      capabilityFlags: { ...fixture.capabilityFlags, crossProviderExecution: true as never },
    };
    const validation = validateCrossProviderDataQualityFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'INVALID_CONFIDENCE_SCORE_RANGE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });

  it('rejects enrichment liveData=true and readOnly=false', () => {
    const fixture = clone(CROSS_PROVIDER_DATA_QUALITY_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      enrichmentContract: { ...fixture.enrichmentContract, liveData: true as never, readOnly: false as never },
    };
    const validation = validateCrossProviderDataQualityFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'ENRICHMENT_LIVE_DATA_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'ENRICHMENT_READ_ONLY_REQUIRED')).toBe(true);
  });
});

describe('Phase 67 — fixture-specific expectations', () => {
  it('all-providers-agree fixture has high confidence and no mismatches', () => {
    const fixture = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(
      entry => entry.fixtureName === 'all-providers-agree-high-confidence',
    );
    expect(fixture?.confidenceScore.label).toBe('very_high');
    expect(fixture?.mismatchReports).toHaveLength(0);
  });

  it('all-providers-conflict fixture is fail-closed', () => {
    const fixture = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(
      entry => entry.fixtureName === 'all-providers-conflict-fail-closed',
    );
    expect(fixture?.reconciliationResult.failClosed).toBe(true);
    expect(fixture?.reconciliationResult.selectedProviderId).toBe('none');
  });

  it('unsafe-provider fixture rejects one provider', () => {
    const fixture = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(
      entry => entry.fixtureName === 'unsafe-provider-capability-rejected',
    );
    expect(fixture?.reconciliationResult.rejectedProviderIds.length).toBeGreaterThan(0);
  });
});

describe('Phase 67 — capabilities and propagation', () => {
  it('phase capabilities expose required positive and negative flags', () => {
    const caps = getCrossProviderDataQualityCapabilities();
    expect(caps.crossProviderDataQuality).toBe(true);
    expect(caps.crossProviderComparison).toBe(true);
    expect(caps.crossProviderExecution).toBe(false);
    expect(caps.crossProviderTradingSignals).toBe(false);
    expect(caps.crossProviderInvestmentAdvice).toBe(false);
  });

  it('dashboard and read-only API capabilities include Phase 67 flags', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.crossProviderDataQuality).toBe(true);
    expect(dashboard.crossProviderExecution).toBe(false);
    expect(api.crossProviderDataQuality).toBe(true);
    expect(api.crossProviderExecution).toBe(false);
  });
});

describe('Phase 67 — safety scan assertions', () => {
  it('phase67 source avoids forbidden runtime patterns', () => {
    const forbidden = [
      /Date\.now\(/,
      /Math\.random\(/,
      /randomUUID\(/,
      /fetch\(/,
    ];

    for (const file of PHASE_67_FILES) {
      const content = readFileSync(resolve(PHASE_67_SRC, file), 'utf-8');
      for (const pattern of forbidden) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('docs retain Phase 68 as preview-only, not implemented', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/CROSS_PROVIDER_DATA_QUALITY.md'), 'utf-8');
    expect(doc).toContain('Phase 68');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(doc.toLowerCase()).toContain('not implemented');
  });
});
