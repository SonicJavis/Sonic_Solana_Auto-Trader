/**
 * packages/read-only-api-contracts/src/evidence-contract.ts
 *
 * Phase 19 — Read-Only Evidence API contract builder.
 *
 * Shapes Evidence Ledger outputs into safe API response contract models.
 * Append-safe / read-only — no mutation of prior evidence.
 */

import { roacOk, roacErr } from './errors.js';
import type { RoacResult } from './errors.js';
import type { ReadOnlyEvidenceContract, ReadOnlyApiSeverity } from './types.js';

export interface BuildReadOnlyEvidenceContractInput {
  readonly evidenceContractId: string;
  readonly evidenceLedgerId: string;
  readonly severity: ReadOnlyApiSeverity;
  readonly summaryText: string;
  readonly entryCount: number;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

/**
 * Shapes Evidence Ledger outputs into a safe API response contract model.
 * Remains append-safe/read-only — no mutation of prior evidence.
 */
export function buildReadOnlyEvidenceContract(
  input: BuildReadOnlyEvidenceContractInput,
): RoacResult<ReadOnlyEvidenceContract> {
  if (input.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'input.fixtureOnly must be true');
  if (input.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'input.liveData must be false');
  if (input.entryCount < 0)
    return roacErr(
      'INVALID_READ_ONLY_API_CONTRACT_INPUT',
      'input.entryCount must be >= 0',
    );

  return roacOk({
    evidenceContractId: input.evidenceContractId,
    evidenceLedgerId: input.evidenceLedgerId,
    severity: input.severity,
    summaryText: input.summaryText,
    entryCount: input.entryCount,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  });
}
