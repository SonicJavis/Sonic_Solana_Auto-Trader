import type {
  FirstReadOnlyProviderAdapterFixture,
  FirstReadOnlyProviderAdapterViewModel,
} from './types.js';

export function buildFirstReadOnlyProviderAdapterViewModel(
  fixture: FirstReadOnlyProviderAdapterFixture,
): FirstReadOnlyProviderAdapterViewModel {
  return {
    viewModelId: `${fixture.fixtureId}-view-model`,
    fixtureId: fixture.fixtureId,
    fixtureName: fixture.fixtureName,
    configState: fixture.providerConfig.mode,
    healthState: fixture.health.healthState,
    summary: `${fixture.fixtureName} is a read-only adapter fixture in offline deterministic mode.`,
  };
}
