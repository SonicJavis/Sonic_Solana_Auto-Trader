/**
 * apps/read-only-api/src/index.ts
 *
 * Phase 20 — @sonic/read-only-api public API barrel.
 *
 * Exports all Phase 20 Local Read-Only API Shell types, builders,
 * config, capabilities, safety validators, handlers, routes, response builders,
 * fixtures, and the app factory.
 *
 * What this app provides:
 *   - LocalReadOnlyApiCapabilities (all unsafe fields false, safe local fields true)
 *   - LocalReadOnlyApiConfig type (host: '127.0.0.1' only)
 *   - LroApiSafetyMeta type
 *   - LroApiResponseEnvelope<T> type
 *   - LroApiErrorDetail type
 *   - LocalReadOnlyApiErrorCode, LocalReadOnlyApiError, LroApiResult<T>, lroApiOk, lroApiErr
 *   - getLocalReadOnlyApiCapabilities — permanently-safe capabilities
 *   - createReadOnlyApiConfig — safe config builder (rejects unsafe hosts/ports)
 *   - createReadOnlyApiApp — Fastify app factory (does NOT auto-listen)
 *   - registerReadOnlyApiRoutes — GET-only route registration
 *   - buildReadOnlyApiResponse — deterministic response envelope builder
 *   - validateLocalReadOnlyApiSafety — safety invariant validator
 *   - validateLocalReadOnlyApiCapabilities, validateLocalReadOnlyApiConfig, validateLroApiSafetyMeta
 *   - containsUnsafeActionText, containsSecretPattern, containsUrlPattern, isDisplaySafe
 *   - startReadOnlyApiServer — explicit-only localhost server start (rejects unsafe hosts)
 *   - All fixture exports (LRO_API_CAPABILITIES, LRO_API_CONTRACTS_BUNDLE, etc.)
 *   - All handler functions
 *
 * What this app does NOT provide:
 *   - No auto-start on import
 *   - No external bind (0.0.0.0, ::, localhost, external hostnames)
 *   - No live data
 *   - No Solana RPC
 *   - No provider API connections
 *   - No wallet / private key handling
 *   - No trade intents or execution plans
 *   - No paper trading
 *   - No trade execution
 *   - No orders, fills, routes, swaps
 *   - No positions or PnL
 *   - No transaction construction, simulation, signing, or sending
 *   - No database writes
 *   - No Telegram alerts
 *   - No UI rendering
 *   - No external network calls
 *
 * IMPORTANT: LocalReadOnlyApi is NOT a trading system, live data source, or UI.
 * It is a localhost-only, GET-only, fixture-only, read-only, analysis-only,
 * non-executable Fastify API shell for safe Phase 20 contract/read-model exposure.
 */

export type {
  LocalReadOnlyApiCapabilities,
  LocalReadOnlyApiConfig,
  LroApiSafetyMeta,
  LroApiResponseEnvelope,
  LroApiErrorDetail,
  LocalReadOnlyApiErrorCode,
} from './types.js';

export type { LocalReadOnlyApiError, LroApiResult } from './errors.js';
export { lroApiOk, lroApiErr } from './errors.js';

export { getLocalReadOnlyApiCapabilities } from './capabilities.js';

export { createReadOnlyApiConfig } from './config.js';
export type { CreateReadOnlyApiConfigInput } from './config.js';

export {
  buildReadOnlyApiResponse,
  STANDARD_SAFETY_META,
} from './response.js';

export {
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
  validateLocalReadOnlyApiCapabilities,
  validateLocalReadOnlyApiConfig,
  validateLroApiSafetyMeta,
  validateLocalReadOnlyApiSafety,
} from './safety.js';

export {
  LRO_API_CAPABILITIES,
  LRO_API_CONTRACTS_BUNDLE,
  LRO_API_CONTRACTS_JSON,
  LRO_API_CONTRACTS_OPENAPI_SHAPE,
  LRO_API_ALL_CONTRACT_FIXTURES,
  LRO_API_DASHBOARD_FIXTURES,
  LRO_API_PRIMARY_DASHBOARD_FIXTURE,
} from './fixtures.js';

export {
  handleHealth,
  handleCapabilities,
  handleContracts,
  handleContractsOpenApiShape,
  handleDashboard,
  handleDashboardOverview,
  handleDashboardReplay,
  handleDashboardStrategy,
  handleDashboardEvaluation,
  handleDashboardEvidence,
  handleDashboardSafety,
  LRO_API_HANDLERS,
} from './handlers.js';

export { registerReadOnlyApiRoutes } from './routes.js';

export { createReadOnlyApiApp, getDefaultConfig } from './app.js';

export { startReadOnlyApiServer } from './server.js';
