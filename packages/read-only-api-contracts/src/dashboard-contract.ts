/**
 * packages/read-only-api-contracts/src/dashboard-contract.ts
 *
 * Phase 19 — Read-Only Dashboard API contract builder.
 *
 * Shapes Dashboard Read Models into safe API response contract models.
 * No UI rendering, no app state, no live data.
 */

import { roacOk, roacErr } from './errors.js';
import type { RoacResult } from './errors.js';
import type { ReadOnlyDashboardContract, ReadOnlyApiSeverity } from './types.js';

export interface BuildReadOnlyDashboardContractInput {
  readonly dashboardContractId: string;
  readonly severity: ReadOnlyApiSeverity;
  readonly summaryText: string;
  readonly panelsAvailable: readonly string[];
  readonly totalFindings: number;
  readonly evidenceLedgerId: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

/**
 * Shapes Dashboard Read Models into a safe API response contract model.
 * No UI rendering. No app state. No live data.
 */
export function buildReadOnlyDashboardContract(
  input: BuildReadOnlyDashboardContractInput,
): RoacResult<ReadOnlyDashboardContract> {
  if (input.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'input.fixtureOnly must be true');
  if (input.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'input.liveData must be false');
  if (input.totalFindings < 0)
    return roacErr(
      'INVALID_READ_ONLY_API_CONTRACT_INPUT',
      'input.totalFindings must be >= 0',
    );

  return roacOk({
    dashboardContractId: input.dashboardContractId,
    severity: input.severity,
    summaryText: input.summaryText,
    panelsAvailable: [...input.panelsAvailable].sort(),
    totalFindings: input.totalFindings,
    evidenceLedgerId: input.evidenceLedgerId,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  });
}
