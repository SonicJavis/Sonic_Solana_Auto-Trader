/**
 * Phase 19 — @sonic/read-only-api-contracts public API barrel.
 *
 * Exports all Phase 19 Read-Only API Contract types, models,
 * builders, validation helpers, fixtures, and capabilities guard.
 *
 * What this package provides:
 *   - ReadOnlyApiCapabilities (all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable/readOnly/contractOnly true)
 *   - ReadOnlyApiSeverity type union
 *   - ReadOnlyApiEndpointId type union
 *   - ReadOnlyApiEndpointMethod type union
 *   - ReadOnlyApiEndpointContract type
 *   - ReadOnlyApiRequestModel type
 *   - ReadOnlyApiResponseEnvelope<T> type
 *   - ReadOnlyApiResponseMetadata type
 *   - ReadOnlyApiErrorDetail type
 *   - ReadOnlyApiHealthContract type
 *   - ReadOnlyDashboardContract type
 *   - ReadOnlyEvidenceContract type
 *   - ReadOnlySafetyContract type
 *   - ReadOnlyApiContractBundle type
 *   - ReadOnlyApiContractExport type
 *   - ReadOnlyApiOpenApiShape type
 *   - ReadOnlyApiOpenApiPathItem type
 *   - ReadOnlyApiOpenApiOperation type
 *   - ReadOnlyApiContractFixture type
 *   - ReadOnlyApiContractErrorCode, ReadOnlyApiContractError, RoacResult<T>, roacOk, roacErr
 *   - getReadOnlyApiCapabilities — permanently-safe capabilities
 *   - buildReadOnlyApiEndpointContracts — deterministic endpoint contract list
 *   - buildReadOnlyApiRequestModel — safe request model builder
 *   - buildReadOnlyApiResponseEnvelope — deterministic response envelope builder
 *   - buildReadOnlyApiHealthContract — safe health contract builder
 *   - buildReadOnlyDashboardContract — safe dashboard contract builder
 *   - buildReadOnlyEvidenceContract — safe evidence contract builder
 *   - buildReadOnlySafetyContract — safe safety contract builder
 *   - buildReadOnlyApiContractBundle — combines all contracts into safe bundle
 *   - exportReadOnlyApiContractJson — deterministic JSON export
 *   - exportReadOnlyApiContractOpenApiShape — deterministic OpenAPI-like shape
 *   - validateReadOnlyApiCapabilities, validateReadOnlyApiHealthContract,
 *     validateReadOnlyDashboardContract, validateReadOnlyEvidenceContract,
 *     validateReadOnlySafetyContract, validateReadOnlyApiContractBundle
 *   - containsUnsafeActionText, containsSecretPattern, containsUrlPattern,
 *     containsServerPattern, isDisplaySafe
 *   - 6 deterministic synthetic fixtures + ALL_READ_ONLY_API_CONTRACT_FIXTURES
 *
 * What this package does NOT provide:
 *   - No API server
 *   - No HTTP listener
 *   - No open network port
 *   - No Fastify, Hono, tRPC, or Express integration
 *   - No router, handler, or framework runtime
 *   - No real trade intents
 *   - No execution plans
 *   - No order, fill, route, swap models
 *   - No Solana RPC
 *   - No live market data
 *   - No provider API keys or connections
 *   - No wallet / private key handling
 *   - No paper trading
 *   - No trade execution
 *   - No network calls of any kind
 *   - No database writes
 *   - No Telegram alerts
 *   - No transaction construction, simulation, signing, or sending
 *   - No orders or positions
 *   - No live PnL calculation
 *   - No mutation of prior evidence
 *   - No UI rendering
 *
 * IMPORTANT: ReadOnlyApiContracts are NOT a trading system, API server, or UI.
 * They are fixture-only, read-only, analysis-only, non-executable, contract-only
 * TypeScript models describing future local API boundary contracts.
 */

export type {
  ReadOnlyApiCapabilities,
  ReadOnlyApiSeverity,
  ReadOnlyApiEndpointId,
  ReadOnlyApiEndpointMethod,
  ReadOnlyApiEndpointContract,
  ReadOnlyApiRequestModel,
  ReadOnlyApiResponseEnvelope,
  ReadOnlyApiResponseMetadata,
  ReadOnlyApiErrorDetail,
  ReadOnlyApiHealthContract,
  ReadOnlyDashboardContract,
  ReadOnlyEvidenceContract,
  ReadOnlySafetyContract,
  ReadOnlyApiContractBundle,
  ReadOnlyApiContractExport,
  ReadOnlyApiOpenApiShape,
  ReadOnlyApiOpenApiPathItem,
  ReadOnlyApiOpenApiOperation,
  ReadOnlyApiContractFixture,
  ReadOnlyApiContractErrorCode,
} from './types.js';

export type { ReadOnlyApiContractError, RoacResult } from './errors.js';
export { roacOk, roacErr } from './errors.js';

export { getReadOnlyApiCapabilities } from './capabilities.js';

export { buildReadOnlyApiEndpointContracts } from './endpoint-contracts.js';

export { buildReadOnlyApiRequestModel } from './request-models.js';

export { buildReadOnlyApiResponseEnvelope } from './response-envelope.js';

export { buildReadOnlyApiHealthContract } from './health-contract.js';

export { buildReadOnlyDashboardContract } from './dashboard-contract.js';

export { buildReadOnlyEvidenceContract } from './evidence-contract.js';

export { buildReadOnlySafetyContract } from './safety-contract.js';

export { buildReadOnlyApiContractBundle } from './bundle-builder.js';

export { exportReadOnlyApiContractJson } from './export-json.js';

export { exportReadOnlyApiContractOpenApiShape } from './export-openapi-shape.js';

export {
  validateReadOnlyApiCapabilities,
  validateReadOnlyApiHealthContract,
  validateReadOnlyDashboardContract,
  validateReadOnlyEvidenceContract,
  validateReadOnlySafetyContract,
  validateReadOnlyApiContractBundle,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  containsServerPattern,
  isDisplaySafe,
} from './validation.js';

export {
  CLEAN_READ_ONLY_API_CONTRACT_FIXTURE,
  DEGRADED_READ_ONLY_API_CONTRACT_FIXTURE,
  FAILED_READ_ONLY_API_CONTRACT_FIXTURE,
  INCONCLUSIVE_READ_ONLY_API_CONTRACT_FIXTURE,
  MIXED_READ_ONLY_API_CONTRACT_FIXTURE,
  REGRESSION_READ_ONLY_API_CONTRACT_FIXTURE,
  ALL_READ_ONLY_API_CONTRACT_FIXTURES,
} from './fixtures.js';
