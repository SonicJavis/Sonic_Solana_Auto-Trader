import type {
  FirstReadOnlyProviderSmokeGuard,
  FirstReadOnlyProviderSmokeGuardInput,
} from './types.js';

export function buildFirstReadOnlyProviderSmokeGuard(input: {
  fixtureId: string;
  config: FirstReadOnlyProviderSmokeGuardInput;
}): FirstReadOnlyProviderSmokeGuard {
  const reasons: string[] = [];
  if (!input.config.allowLiveSmoke) reasons.push('live smoke is disabled by default');
  if (!input.config.explicitGateAccepted) reasons.push('explicit gate is not accepted');
  if (!input.config.envProvided) reasons.push('required smoke configuration is missing');
  if (!input.config.allowNetworkInTests) reasons.push('network use is disabled in deterministic test mode');

  const canRun = reasons.length === 0;
  return {
    smokeGuardId: `${input.fixtureId}-smoke-guard`,
    canRun,
    status: canRun ? 'enabled' : 'disabled',
    summary: canRun
      ? 'Live smoke may run only with explicit opt-in and full gate approvals.'
      : 'Live smoke is disabled/skipped in default deterministic mode.',
    reasons,
  };
}
