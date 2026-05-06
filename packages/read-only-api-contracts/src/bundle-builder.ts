/**
 * packages/read-only-api-contracts/src/bundle-builder.ts
 *
 * Phase 19 — ReadOnlyApiContractBundle builder.
 *
 * Combines endpoint contracts, health, dashboard, evidence, and safety contracts.
 */

import { roacOk, roacErr } from './errors.js';
import type { RoacResult } from './errors.js';
import type { ReadOnlyApiContractBundle } from './types.js';
import { buildReadOnlyApiEndpointContracts } from './endpoint-contracts.js';
import {
  buildReadOnlyApiHealthContract,
  type BuildReadOnlyApiHealthContractInput,
} from './health-contract.js';
import {
  buildReadOnlyDashboardContract,
  type BuildReadOnlyDashboardContractInput,
} from './dashboard-contract.js';
import {
  buildReadOnlyEvidenceContract,
  type BuildReadOnlyEvidenceContractInput,
} from './evidence-contract.js';
import {
  buildReadOnlySafetyContract,
  type BuildReadOnlySafetyContractInput,
} from './safety-contract.js';

export interface BuildReadOnlyApiContractBundleInput {
  readonly bundleId: string;
  readonly health: BuildReadOnlyApiHealthContractInput;
  readonly dashboard: BuildReadOnlyDashboardContractInput;
  readonly evidence: BuildReadOnlyEvidenceContractInput;
  readonly safety: BuildReadOnlySafetyContractInput;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

/**
 * Combines endpoint contracts, health, dashboard, evidence, and safety contracts
 * into a single safe ReadOnlyApiContractBundle.
 */
export function buildReadOnlyApiContractBundle(
  input: BuildReadOnlyApiContractBundleInput,
): RoacResult<ReadOnlyApiContractBundle> {
  if (input.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'input.fixtureOnly must be true');
  if (input.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'input.liveData must be false');

  const endpointContracts = buildReadOnlyApiEndpointContracts();

  const healthResult = buildReadOnlyApiHealthContract(input.health);
  if (!healthResult.ok)
    return roacErr(healthResult.code, `health: ${healthResult.message}`);

  const dashboardResult = buildReadOnlyDashboardContract(input.dashboard);
  if (!dashboardResult.ok)
    return roacErr(dashboardResult.code, `dashboard: ${dashboardResult.message}`);

  const evidenceResult = buildReadOnlyEvidenceContract(input.evidence);
  if (!evidenceResult.ok)
    return roacErr(evidenceResult.code, `evidence: ${evidenceResult.message}`);

  const safetyResult = buildReadOnlySafetyContract(input.safety);
  if (!safetyResult.ok)
    return roacErr(safetyResult.code, `safety: ${safetyResult.message}`);

  return roacOk({
    bundleId: input.bundleId,
    endpointContracts,
    healthContract: healthResult.value,
    dashboardContract: dashboardResult.value,
    evidenceContract: evidenceResult.value,
    safetyContract: safetyResult.value,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  });
}
