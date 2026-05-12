import type { CrossProviderDataQualityFixture, CrossProviderDataQualityReport } from './types.js';

export function buildCrossProviderDataQualityReport(
  fixture: Pick<
    CrossProviderDataQualityFixture,
    | 'fixtureId'
    | 'providerComparison'
    | 'mismatchReports'
    | 'reconciliationResult'
    | 'confidenceScore'
    | 'provenanceRecords'
    | 'enrichmentContract'
  >,
): CrossProviderDataQualityReport {
  return {
    reportId: `${fixture.fixtureId}-report`,
    comparisonSummary: `Compared ${fixture.providerComparison.providerIds.length} providers across ${fixture.providerComparison.comparedFieldPaths.length} fields.`,
    mismatchSummary: `${fixture.mismatchReports.length} mismatch reports detected.`,
    reconciliationSummary: fixture.reconciliationResult.summary,
    confidenceSummary: `Confidence score ${fixture.confidenceScore.score} (${fixture.confidenceScore.label}).`,
    provenanceSummary: `${fixture.provenanceRecords.length} provenance records captured.`,
    enrichmentSummary: `${fixture.enrichmentContract.enrichedFields.length} enriched fields produced in read-only mode.`,
    safetySummary: 'Fixture-only, local-only, read-only, fail-closed, deterministic reconciliation output.',
  };
}
