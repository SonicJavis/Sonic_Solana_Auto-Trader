/**
 * packages/read-only-api-contracts/src/health-contract.ts
 *
 * Phase 19 — Read-Only API health contract builder.
 *
 * Builds a safe fixture-only health contract model.
 * No runtime health checks, network checks, process checks,
 * socket checks, or live dependency checks.
 */

import { roacOk, roacErr } from './errors.js';
import type { RoacResult } from './errors.js';
import type { ReadOnlyApiHealthContract } from './types.js';
import { getReadOnlyApiCapabilities } from './capabilities.js';

export interface BuildReadOnlyApiHealthContractInput {
  readonly healthId: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

/**
 * Builds a safe health contract model.
 * Clearly states fixture-only and contract-only.
 * No runtime health checks of any kind.
 */
export function buildReadOnlyApiHealthContract(
  input: BuildReadOnlyApiHealthContractInput,
): RoacResult<ReadOnlyApiHealthContract> {
  if (input.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'input.fixtureOnly must be true');
  if (input.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'input.liveData must be false');

  return roacOk({
    healthId: input.healthId,
    status: 'fixture_only' as const,
    message:
      'This is a fixture-only, contract-only health model. ' +
      'No runtime health checks are performed. ' +
      'No network connections are made. ' +
      'No live dependency status is reported.',
    capabilities: getReadOnlyApiCapabilities(),
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  });
}
