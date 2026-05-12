import type {
  FirstReadOnlyProviderHealth,
  FirstReadOnlyProviderHealthState,
} from './types.js';

export function buildFirstReadOnlyProviderHealth(input: {
  fixtureId: string;
  healthState: FirstReadOnlyProviderHealthState;
}): FirstReadOnlyProviderHealth {
  return {
    healthId: `${input.fixtureId}-health`,
    healthState: input.healthState,
    healthy: input.healthState === 'offline_fixture_ready',
  };
}
