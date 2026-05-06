/**
 * packages/read-only-api-contracts/src/request-models.ts
 *
 * Phase 19 — Read-Only API request model builders.
 *
 * Returns safe, documentation-shaped request models for each endpoint.
 * No HTTP transport, no runtime binding.
 */

import type { ReadOnlyApiRequestModel, ReadOnlyApiEndpointId } from './types.js';

/**
 * Builds a safe read-only API request model for the given endpoint.
 * No HTTP handling, no network calls, no live data.
 */
export function buildReadOnlyApiRequestModel(
  endpointId: ReadOnlyApiEndpointId,
  queryParams: Readonly<Record<string, string>> = {},
): ReadOnlyApiRequestModel {
  return {
    requestModelId: `request_model_${endpointId}`,
    endpointId,
    queryParams,
    description: `Contract-only request model for ${endpointId} endpoint. Fixture-only, no runtime transport.`,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  };
}
