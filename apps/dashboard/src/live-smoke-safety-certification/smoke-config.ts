import type { LiveSmokeConfig } from './types.js';

export function buildLiveSmokeConfig(input: {
  fixtureId: string;
  mode: LiveSmokeConfig['mode'];
  standardCi: boolean;
  requiresManualOptIn: boolean;
}): LiveSmokeConfig {
  return {
    configId: `${input.fixtureId}-smoke-config`,
    configName: `${input.fixtureId}-smoke-config-model`,
    mode: input.mode,
    standardCi: input.standardCi,
    liveChecksEnabled: false,
    requiresManualOptIn: input.requiresManualOptIn,
    requiresReadOnlyProvider: true,
    fixtureOnly: true,
  };
}
