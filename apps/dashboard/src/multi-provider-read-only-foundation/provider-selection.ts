import type { MultiProviderSelectionFixture } from './types.js';

export function buildProviderSelectionFixture(input: {
  fixtureId: string;
  selectedProviderId: string;
  fallbackProviderIds: readonly string[];
  selectionReason: string;
}): MultiProviderSelectionFixture {
  return {
    selectionId: `${input.fixtureId}-provider-selection`,
    selectedProviderId: input.selectedProviderId,
    fallbackProviderIds: input.fallbackProviderIds,
    selectionReason: input.selectionReason,
    failClosed: true,
    noLiveCall: true,
  };
}
