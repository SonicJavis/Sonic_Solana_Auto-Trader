/**
 * packages/read-only-api-contracts/src/export-openapi-shape.ts
 *
 * Phase 19 — Read-Only API OpenAPI-like shape exporter.
 *
 * Produces a deterministic OpenAPI-like shape object for future documentation only.
 * No OpenAPI library imports. No live server config. No real URLs.
 * All endpoints marked future/read-only/contract-only.
 */

import type { ReadOnlyApiContractBundle, ReadOnlyApiOpenApiShape } from './types.js';

/**
 * Exports a deterministic OpenAPI-like shape for future documentation.
 * For documentation planning only — not a live API spec.
 * No imports from openapi or swagger libraries.
 * No real server URLs included.
 */
export function exportReadOnlyApiContractOpenApiShape(
  bundle: ReadOnlyApiContractBundle,
): ReadOnlyApiOpenApiShape {
  const paths: Record<string, ReadOnlyApiOpenApiShape['paths'][string]> = {};

  for (const ec of bundle.endpointContracts) {
    paths[ec.pathTemplate] = {
      get: {
        operationId: ec.endpointId,
        summary: ec.description,
        description:
          `Contract-only. Fixture-only. Non-executable. Read-only. ` +
          `Response type: ${ec.responseTypeName}. ` +
          `No HTTP handler exists. For future documentation only.`,
        tags: ['read-only', 'contract-only', 'fixture-only', 'future'],
        contractOnly: true,
        nonExecutable: true,
        readOnly: true,
      },
    };
  }

  // Stable key ordering
  const sortedPaths: Record<string, ReadOnlyApiOpenApiShape['paths'][string]> = {};
  for (const key of Object.keys(paths).sort()) {
    const value = paths[key];
    if (value !== undefined) {
      sortedPaths[key] = value;
    }
  }

  return {
    openApiShapeId: `openapi_shape_${bundle.bundleId}`,
    title: 'Sonic Solana Auto-Trader — Local Read-Only API Contracts (Phase 19)',
    version: '0.1.0',
    description:
      'This is a documentation-shaped, fixture-only, contract-only OpenAPI-like schema. ' +
      'It describes future read-only endpoints only. ' +
      'No HTTP server exists. No network ports are opened. ' +
      'No API framework is used. All data is fixture-only and synthetic.',
    note:
      'FUTURE ONLY: This schema is for planning and documentation purposes only. ' +
      'No Fastify, Hono, tRPC, or Express integration exists in this phase.',
    paths: sortedPaths,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  };
}
