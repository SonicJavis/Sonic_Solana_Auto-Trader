/**
 * packages/read-only-api-contracts/src/safety-contract.ts
 *
 * Phase 19 — Read-Only Safety API contract builder.
 *
 * Summarises locked safety capabilities for future API exposure.
 * All unsafe capability flags shown as false.
 */

import { roacOk, roacErr } from './errors.js';
import type { RoacResult } from './errors.js';
import type { ReadOnlySafetyContract } from './types.js';
import { getReadOnlyApiCapabilities } from './capabilities.js';

export interface BuildReadOnlySafetyContractInput {
  readonly safetyContractId: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

const LOCKED_CAPABILITY_NAMES: readonly string[] = [
  'canUseLiveData',
  'canUseSolanaRpc',
  'canUseProviderApis',
  'canAccessPrivateKeys',
  'canCreateTradeIntents',
  'canCreateExecutionPlans',
  'canPaperTrade',
  'canTrade',
  'canExecute',
  'canWriteToDatabase',
  'canSendTelegramAlerts',
  'canConstructTransactions',
  'canSimulateTransactions',
  'canCreateOrders',
  'canCreatePositions',
  'canCalculateLivePnl',
  'canMutatePriorEvidence',
  'canRenderUi',
  'canStartHttpServer',
  'canOpenNetworkPort',
  'canUseApiFramework',
];

/**
 * Builds a safety contract summarising locked capabilities for future API exposure.
 * All unsafe capability flags are false — permanently locked.
 */
export function buildReadOnlySafetyContract(
  input: BuildReadOnlySafetyContractInput,
): RoacResult<ReadOnlySafetyContract> {
  if (input.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'input.fixtureOnly must be true');
  if (input.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'input.liveData must be false');

  const capabilities = getReadOnlyApiCapabilities();

  return roacOk({
    safetyContractId: input.safetyContractId,
    capabilities,
    lockedCapabilityNames: [...LOCKED_CAPABILITY_NAMES].sort(),
    safetyInvariantsSatisfied: true,
    summaryText:
      'All unsafe capabilities are permanently locked to false. ' +
      'This package is fixture-only, analysis-only, non-executable, read-only, and contract-only. ' +
      'No HTTP server, no network port, no API framework, no live data, no trading, no execution.',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  });
}
