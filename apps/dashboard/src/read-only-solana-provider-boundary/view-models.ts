import type {
  ReadOnlySolanaProviderBoundaryFixture,
  ReadOnlySolanaProviderBoundaryViewModel,
} from './types.js';

export function buildReadOnlySolanaProviderBoundaryViewModel(
  fixture: ReadOnlySolanaProviderBoundaryFixture,
): ReadOnlySolanaProviderBoundaryViewModel {
  const conformancePassCount = fixture.conformanceChecks.filter(check => check.pass).length;
  const conformanceFailCount = fixture.conformanceChecks.length - conformancePassCount;

  return {
    viewModelId: `${fixture.fixtureId}-view-model`,
    fixtureId: fixture.fixtureId,
    fixtureName: fixture.fixtureName,
    boundaryState: fixture.boundaryState.stateKind,
    mappingStatus: fixture.mockToRealMapping.mappingStatus,
    conformancePassCount,
    conformanceFailCount,
    summary:
      fixture.mockToRealMapping.mappingStatus === 'ready'
        ? 'Read-only future-only boundary mapping is ready and not live.'
        : 'Read-only future-only boundary mapping is incomplete and remains not live.',
  };
}

