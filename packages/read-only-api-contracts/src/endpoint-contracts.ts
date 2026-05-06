/**
 * packages/read-only-api-contracts/src/endpoint-contracts.ts
 *
 * Phase 19 — Read-Only API endpoint contract builder.
 *
 * Returns a deterministic list of endpoint contract metadata.
 * No router, no server, no listener, no handler, no framework object.
 * Endpoint contracts are descriptive only.
 */

import type { ReadOnlyApiEndpointContract, ReadOnlyApiEndpointId } from './types.js';

const ENDPOINT_DEFINITIONS: ReadonlyArray<{
  endpointId: ReadOnlyApiEndpointId;
  pathTemplate: string;
  description: string;
  responseTypeName: string;
}> = [
  {
    endpointId: 'health',
    pathTemplate: '/api/v1/health',
    description:
      'Contract-only health endpoint. Returns fixture-only health status. No runtime checks.',
    responseTypeName: 'ReadOnlyApiHealthContract',
  },
  {
    endpointId: 'capabilities',
    pathTemplate: '/api/v1/capabilities',
    description:
      'Contract-only capabilities endpoint. Returns permanently-locked safe capabilities object.',
    responseTypeName: 'ReadOnlyApiCapabilities',
  },
  {
    endpointId: 'dashboard_overview',
    pathTemplate: '/api/v1/dashboard/overview',
    description:
      'Contract-only dashboard overview endpoint. Returns fixture-only dashboard overview read model.',
    responseTypeName: 'ReadOnlyDashboardContract',
  },
  {
    endpointId: 'dashboard_bundle',
    pathTemplate: '/api/v1/dashboard/bundle',
    description:
      'Contract-only dashboard bundle endpoint. Returns full fixture-only dashboard read model bundle.',
    responseTypeName: 'ReadOnlyApiContractBundle',
  },
  {
    endpointId: 'replay_panel',
    pathTemplate: '/api/v1/dashboard/replay',
    description:
      'Contract-only replay panel endpoint. Returns fixture-only replay analysis panel read model.',
    responseTypeName: 'ReadOnlyDashboardContract',
  },
  {
    endpointId: 'strategy_panel',
    pathTemplate: '/api/v1/dashboard/strategy',
    description:
      'Contract-only strategy panel endpoint. Returns fixture-only strategy intent panel read model.',
    responseTypeName: 'ReadOnlyDashboardContract',
  },
  {
    endpointId: 'evaluation_panel',
    pathTemplate: '/api/v1/dashboard/evaluation',
    description:
      'Contract-only evaluation panel endpoint. Returns fixture-only strategy evaluation panel read model.',
    responseTypeName: 'ReadOnlyDashboardContract',
  },
  {
    endpointId: 'evidence_panel',
    pathTemplate: '/api/v1/dashboard/evidence',
    description:
      'Contract-only evidence panel endpoint. Returns fixture-only evidence ledger panel read model.',
    responseTypeName: 'ReadOnlyEvidenceContract',
  },
  {
    endpointId: 'safety_panel',
    pathTemplate: '/api/v1/dashboard/safety',
    description:
      'Contract-only safety panel endpoint. Returns fixture-only locked safety capabilities summary.',
    responseTypeName: 'ReadOnlySafetyContract',
  },
];

/**
 * Builds the deterministic list of read-only API endpoint contracts.
 *
 * Returns documentation-shaped endpoint metadata only.
 * Does NOT create a router, server, listener, handler, or framework object.
 * All endpoints are fixture-only, read-only, contract-only.
 */
export function buildReadOnlyApiEndpointContracts(): readonly ReadOnlyApiEndpointContract[] {
  return ENDPOINT_DEFINITIONS.map(def => ({
    endpointId: def.endpointId,
    method: 'GET' as const,
    pathTemplate: def.pathTemplate,
    description: def.description,
    responseTypeName: def.responseTypeName,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  }));
}
