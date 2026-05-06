/**
 * apps/read-only-api/src/index.ts
 *
 * Phase 21 — @sonic/read-only-api public API barrel (extends Phase 20).
 *
 * Phase 21 additions:
 *   - parseReadOnlyApiQuery — safe query parser
 *   - buildReadOnlyApiPagination — pagination validator/builder
 *   - applyReadOnlyApiFilters — in-memory filter helper
 *   - applyReadOnlyApiSorting — in-memory sort helper
 *   - applyReadOnlyApiPagination — in-memory pagination helper
 *   - buildReadOnlyApiQueryResult — shaped result builder
 *   - buildAppliedFiltersMeta, buildAppliedSortMeta — metadata builders
 *   - encodeCursor, decodeCursor — cursor helpers
 *   - validateReadOnlyApiQuerySafety — query safety validator
 *   - All query type exports
 *
 * What this app provides:
 *   - LocalReadOnlyApiCapabilities (all unsafe fields false, safe local fields true)
 *   - LocalReadOnlyApiConfig type (host: '127.0.0.1' only)
 *   - LroApiSafetyMeta type
 *   - LroApiResponseEnvelope<T> type
 *   - LroApiErrorDetail type
 *   - LroApiQueryMeta type
 *   - LocalReadOnlyApiErrorCode, LocalReadOnlyApiError, LroApiResult<T>, lroApiOk, lroApiErr
 *   - getLocalReadOnlyApiCapabilities — permanently-safe capabilities
 *   - createReadOnlyApiConfig — safe config builder (rejects unsafe hosts/ports)
 *   - createReadOnlyApiApp — Fastify app factory (does NOT auto-listen)
 *   - registerReadOnlyApiRoutes — GET-only route registration
 *   - buildReadOnlyApiResponse — deterministic response envelope builder
 *   - validateLocalReadOnlyApiSafety — safety invariant validator
 *   - validateReadOnlyApiQuerySafety — query/filter/pagination safety validator
 *   - validateLocalReadOnlyApiCapabilities, validateLocalReadOnlyApiConfig, validateLroApiSafetyMeta
 *   - containsUnsafeActionText, containsSecretPattern, containsUrlPattern, isDisplaySafe
 *   - startReadOnlyApiServer — explicit-only localhost server start (rejects unsafe hosts)
 *   - All fixture exports (LRO_API_CAPABILITIES, LRO_API_CONTRACTS_BUNDLE, etc.)
 *   - All handler functions
 *   - Phase 21 query/filter/pagination helpers
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
 *   - No arbitrary query languages (SQL, regex, eval)
 *
 * IMPORTANT: LocalReadOnlyApi is NOT a trading system, live data source, or UI.
 * It is a localhost-only, GET-only, fixture-only, read-only, analysis-only,
 * non-executable Fastify API shell for safe Phase 21 query/filter/pagination support.
 */

export type {
  LocalReadOnlyApiCapabilities,
  LocalReadOnlyApiConfig,
  LroApiSafetyMeta,
  LroApiResponseEnvelope,
  LroApiErrorDetail,
  LocalReadOnlyApiErrorCode,
  LroApiQueryMeta,
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
  validateReadOnlyApiQuerySafety,
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

// ─── Phase 21 — Query/filter/pagination exports ───────────────────────────────

export {
  parseReadOnlyApiQuery,
  buildReadOnlyApiQueryResult,
  ALLOWED_SEVERITY_VALUES,
  ALLOWED_PANEL_VALUES,
  ALLOWED_SOURCE_KIND_VALUES,
  ALLOWED_CLASSIFICATION_VALUES,
  ALLOWED_STATUS_VALUES,
  ALLOWED_SORT_FIELDS,
  ALLOWED_SORT_DIRECTIONS,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
} from './query.js';
export type {
  ReadOnlyApiQuery,
  AllowedSeverity,
  AllowedPanel,
  AllowedSourceKind,
  AllowedClassification,
  AllowedStatus,
  AllowedSortField,
  AllowedSortDirection,
  ReadOnlyApiQueryResult,
} from './query.js';

export {
  buildReadOnlyApiPagination,
  applyReadOnlyApiPagination,
  encodeCursor,
  decodeCursor,
} from './pagination.js';
export type { ReadOnlyApiPagination, ReadOnlyApiPaginationMeta } from './pagination.js';

export { applyReadOnlyApiFilters, buildAppliedFiltersMeta } from './filtering.js';
export type { FilterableItem, AppliedFiltersMeta } from './filtering.js';

export { applyReadOnlyApiSorting, buildAppliedSortMeta } from './sorting.js';
export type { AppliedSortMeta } from './sorting.js';
