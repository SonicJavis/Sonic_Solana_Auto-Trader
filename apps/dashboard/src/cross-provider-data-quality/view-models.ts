import type { CrossProviderDataQualityFixture, CrossProviderDataQualityViewModel } from './types.js';

export function buildCrossProviderDataQualityViewModel(
  fixture: Pick<
    CrossProviderDataQualityFixture,
    'fixtureId' | 'fixtureName' | 'reconciliationResult' | 'confidenceScore' | 'mismatchReports'
  >,
): CrossProviderDataQualityViewModel {
  return {
    viewModelId: `${fixture.fixtureId}-view-model`,
    fixtureId: fixture.fixtureId,
    fixtureName: fixture.fixtureName,
    selectedProviderId: fixture.reconciliationResult.selectedProviderId,
    confidenceLabel: fixture.confidenceScore.label,
    unresolvedFieldPaths: [...fixture.reconciliationResult.unresolvedFieldPaths],
    mismatchCount: fixture.mismatchReports.length,
    summary: fixture.reconciliationResult.summary,
  };
}
