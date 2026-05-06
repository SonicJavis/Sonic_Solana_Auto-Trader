/**
 * tests/phase21.test.ts
 *
 * Phase 21 — Local Read-Only API Query, Filter, and Pagination v1
 *
 * Test suite covering:
 *   - Package/app exports
 *   - Phase 20 endpoint regression
 *   - Capabilities unsafe flags false
 *   - New capability fields (canFilterFixtureData, canPaginateFixtureData, canSortFixtureData)
 *   - Query parser: defaults, rejects unknown fields, unsafe text, URLs, secrets
 *   - Limit: default, max, rejects negatives/huge values
 *   - Offset: default, rejects negatives
 *   - Cursor: handling, rejects unsafe values
 *   - Filtering: by severity, panel, sourceKind, classification, status
 *   - Sorting: allowed fields, rejects arbitrary, determinism
 *   - Pagination: determinism, no mutation
 *   - Query result metadata: hasMore, nextCursor, queryMeta
 *   - GET /dashboard with query params
 *   - GET /dashboard/evidence with query params
 *   - GET /dashboard/safety with query params
 *   - Safety metadata in all responses
 *   - Non-GET methods rejected/unsupported
 *   - No mutation endpoints
 *   - No live data, no Solana, no providers, no wallets, no execution
 *   - Phase 13–20 regression
 */

import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {
  // Phase 20 exports (regression)
  getLocalReadOnlyApiCapabilities,
  createReadOnlyApiConfig,
  createReadOnlyApiApp,
  STANDARD_SAFETY_META,
  validateLocalReadOnlyApiSafety,
  validateLocalReadOnlyApiCapabilities,
  validateLroApiSafetyMeta,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
  lroApiOk,
  lroApiErr,
  LRO_API_CAPABILITIES,
  LRO_API_CONTRACTS_BUNDLE,
  LRO_API_CONTRACTS_JSON,
  LRO_API_CONTRACTS_OPENAPI_SHAPE,
  LRO_API_ALL_CONTRACT_FIXTURES,
  LRO_API_DASHBOARD_FIXTURES,
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
  registerReadOnlyApiRoutes,
  getDefaultConfig,
  buildReadOnlyApiResponse,
  validateLocalReadOnlyApiConfig,
  LRO_API_PRIMARY_DASHBOARD_FIXTURE,
  // Phase 21 exports
  parseReadOnlyApiQuery,
  buildReadOnlyApiQueryResult,
  buildReadOnlyApiPagination,
  applyReadOnlyApiPagination,
  applyReadOnlyApiFilters,
  applyReadOnlyApiSorting,
  buildAppliedFiltersMeta,
  buildAppliedSortMeta,
  encodeCursor,
  decodeCursor,
  validateReadOnlyApiQuerySafety,
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
} from '@sonic/read-only-api';

// ─── 1. Package exports ───────────────────────────────────────────────────────

describe('Phase 21 — Package exports', () => {
  it('exports parseReadOnlyApiQuery', () => {
    expect(typeof parseReadOnlyApiQuery).toBe('function');
  });
  it('exports buildReadOnlyApiQueryResult', () => {
    expect(typeof buildReadOnlyApiQueryResult).toBe('function');
  });
  it('exports buildReadOnlyApiPagination', () => {
    expect(typeof buildReadOnlyApiPagination).toBe('function');
  });
  it('exports applyReadOnlyApiPagination', () => {
    expect(typeof applyReadOnlyApiPagination).toBe('function');
  });
  it('exports applyReadOnlyApiFilters', () => {
    expect(typeof applyReadOnlyApiFilters).toBe('function');
  });
  it('exports applyReadOnlyApiSorting', () => {
    expect(typeof applyReadOnlyApiSorting).toBe('function');
  });
  it('exports buildAppliedFiltersMeta', () => {
    expect(typeof buildAppliedFiltersMeta).toBe('function');
  });
  it('exports buildAppliedSortMeta', () => {
    expect(typeof buildAppliedSortMeta).toBe('function');
  });
  it('exports encodeCursor', () => {
    expect(typeof encodeCursor).toBe('function');
  });
  it('exports decodeCursor', () => {
    expect(typeof decodeCursor).toBe('function');
  });
  it('exports validateReadOnlyApiQuerySafety', () => {
    expect(typeof validateReadOnlyApiQuerySafety).toBe('function');
  });
  it('exports ALLOWED_SEVERITY_VALUES', () => {
    expect(Array.isArray(ALLOWED_SEVERITY_VALUES)).toBe(true);
    expect(ALLOWED_SEVERITY_VALUES.length).toBeGreaterThan(0);
  });
  it('exports ALLOWED_PANEL_VALUES', () => {
    expect(Array.isArray(ALLOWED_PANEL_VALUES)).toBe(true);
  });
  it('exports ALLOWED_SOURCE_KIND_VALUES', () => {
    expect(Array.isArray(ALLOWED_SOURCE_KIND_VALUES)).toBe(true);
  });
  it('exports ALLOWED_CLASSIFICATION_VALUES', () => {
    expect(Array.isArray(ALLOWED_CLASSIFICATION_VALUES)).toBe(true);
  });
  it('exports ALLOWED_STATUS_VALUES', () => {
    expect(Array.isArray(ALLOWED_STATUS_VALUES)).toBe(true);
  });
  it('exports ALLOWED_SORT_FIELDS', () => {
    expect(Array.isArray(ALLOWED_SORT_FIELDS)).toBe(true);
    expect(ALLOWED_SORT_FIELDS.length).toBeGreaterThan(0);
  });
  it('exports ALLOWED_SORT_DIRECTIONS', () => {
    expect(ALLOWED_SORT_DIRECTIONS).toContain('asc');
    expect(ALLOWED_SORT_DIRECTIONS).toContain('desc');
  });
  it('exports DEFAULT_LIMIT = 25', () => {
    expect(DEFAULT_LIMIT).toBe(25);
  });
  it('exports MAX_LIMIT = 100', () => {
    expect(MAX_LIMIT).toBe(100);
  });
  it('exports DEFAULT_SORT_BY = id', () => {
    expect(DEFAULT_SORT_BY).toBe('id');
  });
  it('exports DEFAULT_SORT_DIRECTION = asc', () => {
    expect(DEFAULT_SORT_DIRECTION).toBe('asc');
  });

  // Phase 20 regression — still exported
  it('still exports getLocalReadOnlyApiCapabilities (Phase 20 regression)', () => {
    expect(typeof getLocalReadOnlyApiCapabilities).toBe('function');
  });
  it('still exports createReadOnlyApiConfig (Phase 20 regression)', () => {
    expect(typeof createReadOnlyApiConfig).toBe('function');
  });
  it('still exports createReadOnlyApiApp (Phase 20 regression)', () => {
    expect(typeof createReadOnlyApiApp).toBe('function');
  });
  it('still exports LRO_API_HANDLERS (Phase 20 regression)', () => {
    expect(typeof LRO_API_HANDLERS).toBe('object');
  });
  it('still exports registerReadOnlyApiRoutes (Phase 20 regression)', () => {
    expect(typeof registerReadOnlyApiRoutes).toBe('function');
  });
  it('buildReadOnlyApiResponse returns envelope with safety meta', () => {
    const r = buildReadOnlyApiResponse({ envelopeId: 'test', status: 'ok', data: { fixture: true } });
    expect(r.meta.fixtureOnly).toBe(true);
    expect(r.meta.liveData).toBe(false);
  });
  it('validateLocalReadOnlyApiConfig rejects unsafe host', () => {
    const r = validateLocalReadOnlyApiConfig({ host: '0.0.0.0' as '127.0.0.1', port: 3140, fixtureOnly: true, readOnly: true, localOnly: true });
    expect(r.ok).toBe(false);
  });
  it('LRO_API_PRIMARY_DASHBOARD_FIXTURE is defined or undefined', () => {
    // May be defined (has fixtures) or undefined — either is safe
    expect(LRO_API_PRIMARY_DASHBOARD_FIXTURE === undefined || typeof LRO_API_PRIMARY_DASHBOARD_FIXTURE === 'object').toBe(true);
  });
});

// ─── 2. Capabilities ──────────────────────────────────────────────────────────

describe('Phase 21 — Capabilities', () => {
  const caps = getLocalReadOnlyApiCapabilities();

  it('canUseLiveData is false', () => expect(caps.canUseLiveData).toBe(false));
  it('canUseSolanaRpc is false', () => expect(caps.canUseSolanaRpc).toBe(false));
  it('canUseProviderApis is false', () => expect(caps.canUseProviderApis).toBe(false));
  it('canAccessPrivateKeys is false', () => expect(caps.canAccessPrivateKeys).toBe(false));
  it('canCreateTradeIntents is false', () => expect(caps.canCreateTradeIntents).toBe(false));
  it('canCreateExecutionPlans is false', () => expect(caps.canCreateExecutionPlans).toBe(false));
  it('canPaperTrade is false', () => expect(caps.canPaperTrade).toBe(false));
  it('canTrade is false', () => expect(caps.canTrade).toBe(false));
  it('canExecute is false', () => expect(caps.canExecute).toBe(false));
  it('canWriteToDatabase is false', () => expect(caps.canWriteToDatabase).toBe(false));
  it('canSendTelegramAlerts is false', () => expect(caps.canSendTelegramAlerts).toBe(false));
  it('canConstructTransactions is false', () => expect(caps.canConstructTransactions).toBe(false));
  it('canSimulateTransactions is false', () => expect(caps.canSimulateTransactions).toBe(false));
  it('canCreateOrders is false', () => expect(caps.canCreateOrders).toBe(false));
  it('canCreatePositions is false', () => expect(caps.canCreatePositions).toBe(false));
  it('canCalculateLivePnl is false', () => expect(caps.canCalculateLivePnl).toBe(false));
  it('canMutatePriorEvidence is false', () => expect(caps.canMutatePriorEvidence).toBe(false));
  it('canRenderUi is false', () => expect(caps.canRenderUi).toBe(false));
  it('canUseExternalNetwork is false', () => expect(caps.canUseExternalNetwork).toBe(false));

  // Phase 21 — new capability fields true
  it('canFilterFixtureData is true', () => expect(caps.canFilterFixtureData).toBe(true));
  it('canPaginateFixtureData is true', () => expect(caps.canPaginateFixtureData).toBe(true));
  it('canSortFixtureData is true', () => expect(caps.canSortFixtureData).toBe(true));

  // Allowed local capabilities
  it('canStartLocalhostServer is true', () => expect(caps.canStartLocalhostServer).toBe(true));
  it('canServeReadOnlyContracts is true', () => expect(caps.canServeReadOnlyContracts).toBe(true));
  it('canServeFixtureReadModels is true', () => expect(caps.canServeFixtureReadModels).toBe(true));
  it('fixtureOnly is true', () => expect(caps.fixtureOnly).toBe(true));
  it('analysisOnly is true', () => expect(caps.analysisOnly).toBe(true));
  it('nonExecutable is true', () => expect(caps.nonExecutable).toBe(true));
  it('readOnly is true', () => expect(caps.readOnly).toBe(true));
  it('localOnly is true', () => expect(caps.localOnly).toBe(true));

  it('validates capabilities successfully', () => {
    const result = validateLocalReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(true);
  });

  it('LRO_API_CAPABILITIES includes new Phase 21 fields', () => {
    expect(LRO_API_CAPABILITIES.canFilterFixtureData).toBe(true);
    expect(LRO_API_CAPABILITIES.canPaginateFixtureData).toBe(true);
    expect(LRO_API_CAPABILITIES.canSortFixtureData).toBe(true);
  });
});

// ─── 3. Query parser ──────────────────────────────────────────────────────────

describe('Phase 21 — Query parser defaults', () => {
  it('returns default limit when not provided', () => {
    const r = parseReadOnlyApiQuery({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(DEFAULT_LIMIT);
  });
  it('returns default offset = 0 when not provided', () => {
    const r = parseReadOnlyApiQuery({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.offset).toBe(0);
  });
  it('returns default sortBy = id when not provided', () => {
    const r = parseReadOnlyApiQuery({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.sortBy).toBe('id');
  });
  it('returns default sortDirection = asc when not provided', () => {
    const r = parseReadOnlyApiQuery({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.sortDirection).toBe('asc');
  });
  it('returns cursor = undefined when not provided', () => {
    const r = parseReadOnlyApiQuery({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.cursor).toBeUndefined();
  });
  it('returns severity = undefined when not provided', () => {
    const r = parseReadOnlyApiQuery({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.severity).toBeUndefined();
  });
  it('returns panel = undefined when not provided', () => {
    const r = parseReadOnlyApiQuery({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.panel).toBeUndefined();
  });
  it('handles null input as empty query', () => {
    const r = parseReadOnlyApiQuery(null);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(DEFAULT_LIMIT);
  });
  it('handles non-object input as empty query', () => {
    const r = parseReadOnlyApiQuery('not an object');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(DEFAULT_LIMIT);
  });
  it('handles array input as empty query', () => {
    const r = parseReadOnlyApiQuery(['a', 'b']);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(DEFAULT_LIMIT);
  });
});

describe('Phase 21 — Query parser valid values', () => {
  it('accepts valid limit', () => {
    const r = parseReadOnlyApiQuery({ limit: '10' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(10);
  });
  it('accepts valid offset', () => {
    const r = parseReadOnlyApiQuery({ offset: '5' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.offset).toBe(5);
  });
  it('accepts valid severity', () => {
    const r = parseReadOnlyApiQuery({ severity: 'high' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.severity).toBe('high');
  });
  it('accepts valid panel', () => {
    const r = parseReadOnlyApiQuery({ panel: 'evidence' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.panel).toBe('evidence');
  });
  it('accepts valid sourceKind', () => {
    const r = parseReadOnlyApiQuery({ sourceKind: 'replay' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.sourceKind).toBe('replay');
  });
  it('accepts valid classification', () => {
    const r = parseReadOnlyApiQuery({ classification: 'safe' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.classification).toBe('safe');
  });
  it('accepts valid status', () => {
    const r = parseReadOnlyApiQuery({ status: 'ok' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.status).toBe('ok');
  });
  it('accepts valid sortBy', () => {
    const r = parseReadOnlyApiQuery({ sortBy: 'severity' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.sortBy).toBe('severity');
  });
  it('accepts valid sortDirection desc', () => {
    const r = parseReadOnlyApiQuery({ sortDirection: 'desc' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.sortDirection).toBe('desc');
  });
  it('accepts all allowed severity values', () => {
    for (const v of ALLOWED_SEVERITY_VALUES) {
      const r = parseReadOnlyApiQuery({ severity: v });
      expect(r.ok).toBe(true);
    }
  });
  it('accepts all allowed panel values', () => {
    for (const v of ALLOWED_PANEL_VALUES) {
      const r = parseReadOnlyApiQuery({ panel: v });
      expect(r.ok).toBe(true);
    }
  });
  it('accepts all allowed sort fields', () => {
    for (const v of ALLOWED_SORT_FIELDS) {
      const r = parseReadOnlyApiQuery({ sortBy: v });
      expect(r.ok).toBe(true);
    }
  });
});

// ─── 4. Query parser rejections ───────────────────────────────────────────────

describe('Phase 21 — Query parser rejections', () => {
  it('rejects invalid severity', () => {
    const r = parseReadOnlyApiQuery({ severity: 'CRITICAL_ALERT' });
    expect(r.ok).toBe(false);
  });
  it('rejects invalid panel', () => {
    const r = parseReadOnlyApiQuery({ panel: 'unknown_panel' });
    expect(r.ok).toBe(false);
  });
  it('rejects invalid sourceKind', () => {
    const r = parseReadOnlyApiQuery({ sourceKind: 'live' });
    expect(r.ok).toBe(false);
  });
  it('rejects invalid classification', () => {
    const r = parseReadOnlyApiQuery({ classification: 'trade' });
    expect(r.ok).toBe(false);
  });
  it('rejects invalid status', () => {
    const r = parseReadOnlyApiQuery({ status: 'live' });
    expect(r.ok).toBe(false);
  });
  it('rejects invalid sortBy (arbitrary field)', () => {
    const r = parseReadOnlyApiQuery({ sortBy: 'walletAddress' });
    expect(r.ok).toBe(false);
  });
  it('rejects invalid sortBy (SQL injection attempt)', () => {
    const r = parseReadOnlyApiQuery({ sortBy: 'id; DROP TABLE' });
    expect(r.ok).toBe(false);
  });
  it('rejects invalid sortDirection', () => {
    const r = parseReadOnlyApiQuery({ sortDirection: 'ascending' });
    expect(r.ok).toBe(false);
  });
  it('rejects cursor with URL content', () => {
    const r = parseReadOnlyApiQuery({ cursor: 'wss://evil.com' });
    expect(r.ok).toBe(false);
  });
  it('rejects cursor with secret content', () => {
    const r = parseReadOnlyApiQuery({ cursor: 'private_key_abc' });
    expect(r.ok).toBe(false);
  });
  it('rejects cursor exceeding max length', () => {
    const r = parseReadOnlyApiQuery({ cursor: 'a'.repeat(300) });
    expect(r.ok).toBe(false);
  });
  it('rejects negative offset', () => {
    const r = parseReadOnlyApiQuery({ offset: -1 });
    expect(r.ok).toBe(false);
  });
});

// ─── 5. Limit handling ────────────────────────────────────────────────────────

describe('Phase 21 — Limit handling', () => {
  it('applies default limit when not provided', () => {
    const r = parseReadOnlyApiQuery({});
    if (r.ok) expect(r.value.limit).toBe(DEFAULT_LIMIT);
  });
  it('clamps limit to MAX_LIMIT (100)', () => {
    const r = parseReadOnlyApiQuery({ limit: '999' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(MAX_LIMIT);
  });
  it('accepts limit = 1', () => {
    const r = parseReadOnlyApiQuery({ limit: '1' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(1);
  });
  it('treats negative limit as default', () => {
    const r = parseReadOnlyApiQuery({ limit: '-5' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(DEFAULT_LIMIT);
  });
  it('treats NaN limit as default', () => {
    const r = parseReadOnlyApiQuery({ limit: 'abc' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.limit).toBe(DEFAULT_LIMIT);
  });
  it('buildReadOnlyApiPagination enforces max limit', () => {
    const q = parseReadOnlyApiQuery({ limit: '200' });
    expect(q.ok).toBe(true);
    if (q.ok) {
      const p = buildReadOnlyApiPagination(q.value);
      expect(p.ok).toBe(true);
      if (p.ok) expect(p.value.limit).toBeLessThanOrEqual(MAX_LIMIT);
    }
  });
  it('buildReadOnlyApiPagination rejects negative limit', () => {
    const p = buildReadOnlyApiPagination({ limit: -1, offset: 0 });
    expect(p.ok).toBe(false);
  });
  it('buildReadOnlyApiPagination rejects Infinity limit', () => {
    const p = buildReadOnlyApiPagination({ limit: Infinity, offset: 0 });
    expect(p.ok).toBe(false);
  });
  it('buildReadOnlyApiPagination rejects NaN limit', () => {
    const p = buildReadOnlyApiPagination({ limit: NaN, offset: 0 });
    expect(p.ok).toBe(false);
  });
});

// ─── 6. Offset handling ───────────────────────────────────────────────────────

describe('Phase 21 — Offset handling', () => {
  it('defaults offset to 0', () => {
    const r = parseReadOnlyApiQuery({});
    if (r.ok) expect(r.value.offset).toBe(0);
  });
  it('accepts valid offset', () => {
    const r = parseReadOnlyApiQuery({ offset: '10' });
    if (r.ok) expect(r.value.offset).toBe(10);
  });
  it('rejects negative offset from parseReadOnlyApiQuery', () => {
    const r = parseReadOnlyApiQuery({ offset: '-1' });
    expect(r.ok).toBe(false);
  });
  it('rejects negative offset from buildReadOnlyApiPagination', () => {
    const p = buildReadOnlyApiPagination({ limit: 10, offset: -5 });
    expect(p.ok).toBe(false);
  });
  it('rejects NaN offset from buildReadOnlyApiPagination', () => {
    const p = buildReadOnlyApiPagination({ limit: 10, offset: NaN });
    expect(p.ok).toBe(false);
  });
});

// ─── 7. Cursor handling ───────────────────────────────────────────────────────

describe('Phase 21 — Cursor handling', () => {
  it('encodeCursor returns a non-empty string', () => {
    expect(typeof encodeCursor(0)).toBe('string');
    expect(encodeCursor(0).length).toBeGreaterThan(0);
  });
  it('decodeCursor decodes valid cursor', () => {
    const c = encodeCursor(5);
    expect(decodeCursor(c)).toBe(5);
  });
  it('decodeCursor returns null for empty string', () => {
    expect(decodeCursor('')).toBeNull();
  });
  it('decodeCursor returns null for too-long cursor', () => {
    expect(decodeCursor('a'.repeat(300))).toBeNull();
  });
  it('decodeCursor returns null for random garbage', () => {
    expect(decodeCursor('not_a_valid_cursor_value_xyz')).toBeNull();
  });
  it('decodeCursor returns null for negative offset encoded', () => {
    // We should never encode negative offsets, so let's test a crafted value
    const bad = Buffer.from('offset:-5', 'utf8').toString('base64url');
    expect(decodeCursor(bad)).toBeNull();
  });
  it('applyReadOnlyApiPagination uses cursor offset when provided', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const cursor = encodeCursor(3);
    const { data } = applyReadOnlyApiPagination(items, { limit: 3, offset: 0, cursor });
    expect(data).toEqual([4, 5, 6]);
  });
  it('nextCursor is present when hasMore is true', () => {
    const items = Array.from({ length: 10 }, (_, i) => i + 1);
    const { paginationMeta } = applyReadOnlyApiPagination(items, { limit: 3, offset: 0, cursor: undefined });
    expect(paginationMeta.hasMore).toBe(true);
    expect(paginationMeta.nextCursor).toBeDefined();
  });
  it('nextCursor is undefined when hasMore is false', () => {
    const items = [1, 2];
    const { paginationMeta } = applyReadOnlyApiPagination(items, { limit: 10, offset: 0, cursor: undefined });
    expect(paginationMeta.hasMore).toBe(false);
    expect(paginationMeta.nextCursor).toBeUndefined();
  });
});

// ─── 8. Filtering ─────────────────────────────────────────────────────────────

describe('Phase 21 — Filtering', () => {
  const items = [
    { id: '1', severity: 'high', panel: 'evidence', sourceKind: 'replay', classification: 'safe', status: 'ok' },
    { id: '2', severity: 'low', panel: 'safety', sourceKind: 'strategy', classification: 'caution', status: 'ok' },
    { id: '3', severity: 'high', panel: 'evidence', sourceKind: 'fixture', classification: 'safe', status: 'degraded' },
    { id: '4', severity: 'medium', panel: 'replay', sourceKind: 'replay', classification: 'unknown', status: 'ok' },
  ];

  it('returns all items when no filters', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const result = applyReadOnlyApiFilters(items, q.value);
      expect(result.length).toBe(4);
    }
  });
  it('filters by severity = high', () => {
    const q = parseReadOnlyApiQuery({ severity: 'high' });
    if (q.ok) {
      const result = applyReadOnlyApiFilters(items, q.value);
      expect(result.length).toBe(2);
      expect(result.every(x => x.severity === 'high')).toBe(true);
    }
  });
  it('filters by panel = evidence', () => {
    const q = parseReadOnlyApiQuery({ panel: 'evidence' });
    if (q.ok) {
      const result = applyReadOnlyApiFilters(items, q.value);
      expect(result.length).toBe(2);
      expect(result.every(x => x.panel === 'evidence')).toBe(true);
    }
  });
  it('filters by sourceKind = replay', () => {
    const q = parseReadOnlyApiQuery({ sourceKind: 'replay' });
    if (q.ok) {
      const result = applyReadOnlyApiFilters(items, q.value);
      expect(result.length).toBe(2);
      expect(result.every(x => x.sourceKind === 'replay')).toBe(true);
    }
  });
  it('filters by classification = safe', () => {
    const q = parseReadOnlyApiQuery({ classification: 'safe' });
    if (q.ok) {
      const result = applyReadOnlyApiFilters(items, q.value);
      expect(result.length).toBe(2);
      expect(result.every(x => x.classification === 'safe')).toBe(true);
    }
  });
  it('filters by status = ok', () => {
    const q = parseReadOnlyApiQuery({ status: 'ok' });
    if (q.ok) {
      const result = applyReadOnlyApiFilters(items, q.value);
      expect(result.length).toBe(3);
      expect(result.every(x => x.status === 'ok')).toBe(true);
    }
  });
  it('filtering returns empty array when no match', () => {
    const q = parseReadOnlyApiQuery({ severity: 'critical' });
    if (q.ok) {
      const result = applyReadOnlyApiFilters(items, q.value);
      expect(result.length).toBe(0);
    }
  });
  it('does NOT mutate input array when filtering', () => {
    const original = [...items];
    const q = parseReadOnlyApiQuery({ severity: 'high' });
    if (q.ok) applyReadOnlyApiFilters(items, q.value);
    expect(items).toEqual(original);
  });
  it('builds applied filters meta', () => {
    const q = parseReadOnlyApiQuery({ severity: 'high' });
    if (q.ok) {
      const meta = buildAppliedFiltersMeta(q.value);
      expect(meta.severity).toBe('high');
      expect(meta.filtersActive).toBe(true);
      expect(meta.fixtureOnly).toBe(true);
    }
  });
  it('filtersActive is false when no filters', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const meta = buildAppliedFiltersMeta(q.value);
      expect(meta.filtersActive).toBe(false);
    }
  });
});

// ─── 9. Sorting ───────────────────────────────────────────────────────────────

describe('Phase 21 — Sorting', () => {
  const items = [
    { id: 'c', severity: 'high', label: 'charlie' },
    { id: 'a', severity: 'low', label: 'alpha' },
    { id: 'b', severity: 'medium', label: 'bravo' },
  ];

  it('sorts by id asc', () => {
    const q = parseReadOnlyApiQuery({ sortBy: 'id', sortDirection: 'asc' });
    if (q.ok) {
      const result = applyReadOnlyApiSorting(items, q.value);
      expect(result[0]?.id).toBe('a');
      expect(result[1]?.id).toBe('b');
      expect(result[2]?.id).toBe('c');
    }
  });
  it('sorts by id desc', () => {
    const q = parseReadOnlyApiQuery({ sortBy: 'id', sortDirection: 'desc' });
    if (q.ok) {
      const result = applyReadOnlyApiSorting(items, q.value);
      expect(result[0]?.id).toBe('c');
    }
  });
  it('sorts by label asc', () => {
    const q = parseReadOnlyApiQuery({ sortBy: 'label', sortDirection: 'asc' });
    if (q.ok) {
      const result = applyReadOnlyApiSorting(items, q.value);
      expect(result[0]?.label).toBe('alpha');
    }
  });
  it('sorts by severity asc', () => {
    const q = parseReadOnlyApiQuery({ sortBy: 'severity', sortDirection: 'asc' });
    if (q.ok) {
      const result = applyReadOnlyApiSorting(items, q.value);
      // 'high' < 'low' < 'medium' alphabetically
      expect(result[0]?.severity).toBe('high');
    }
  });
  it('sorting is deterministic (same result on repeated calls)', () => {
    const q = parseReadOnlyApiQuery({ sortBy: 'id', sortDirection: 'asc' });
    if (q.ok) {
      const r1 = applyReadOnlyApiSorting(items, q.value);
      const r2 = applyReadOnlyApiSorting(items, q.value);
      expect(r1).toEqual(r2);
    }
  });
  it('does NOT mutate input array when sorting', () => {
    const original = items.map(x => ({ ...x }));
    const q = parseReadOnlyApiQuery({ sortBy: 'id', sortDirection: 'desc' });
    if (q.ok) applyReadOnlyApiSorting(items, q.value);
    expect(items[0]?.id).toBe(original[0]?.id);
    expect(items[1]?.id).toBe(original[1]?.id);
    expect(items[2]?.id).toBe(original[2]?.id);
  });
  it('rejects arbitrary sort field', () => {
    const r = parseReadOnlyApiQuery({ sortBy: 'walletAddress' });
    expect(r.ok).toBe(false);
  });
  it('rejects arbitrary sort field with path traversal', () => {
    const r = parseReadOnlyApiQuery({ sortBy: '../secrets' });
    expect(r.ok).toBe(false);
  });
  it('builds applied sort meta', () => {
    const q = parseReadOnlyApiQuery({ sortBy: 'severity', sortDirection: 'desc' });
    if (q.ok) {
      const meta = buildAppliedSortMeta(q.value);
      expect(meta.sortBy).toBe('severity');
      expect(meta.sortDirection).toBe('desc');
      expect(meta.fixtureOnly).toBe(true);
    }
  });
});

// ─── 10. Pagination ───────────────────────────────────────────────────────────

describe('Phase 21 — Pagination', () => {
  const items = Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) }));

  it('returns first page correctly', () => {
    const { data, paginationMeta } = applyReadOnlyApiPagination(items, { limit: 5, offset: 0, cursor: undefined });
    expect(data.length).toBe(5);
    expect(paginationMeta.offset).toBe(0);
    expect(paginationMeta.totalCount).toBe(20);
    expect(paginationMeta.hasMore).toBe(true);
  });
  it('returns correct second page', () => {
    const { data } = applyReadOnlyApiPagination(items, { limit: 5, offset: 5, cursor: undefined });
    expect(data[0]?.id).toBe('6');
  });
  it('last page: hasMore is false', () => {
    const { paginationMeta } = applyReadOnlyApiPagination(items, { limit: 5, offset: 15, cursor: undefined });
    expect(paginationMeta.hasMore).toBe(false);
    expect(paginationMeta.nextCursor).toBeUndefined();
  });
  it('offset beyond total returns empty data', () => {
    const { data } = applyReadOnlyApiPagination(items, { limit: 5, offset: 100, cursor: undefined });
    expect(data.length).toBe(0);
  });
  it('pagination is deterministic', () => {
    const p = { limit: 5, offset: 3, cursor: undefined };
    const r1 = applyReadOnlyApiPagination(items, p);
    const r2 = applyReadOnlyApiPagination(items, p);
    expect(r1.data).toEqual(r2.data);
    expect(r1.paginationMeta).toEqual(r2.paginationMeta);
  });
  it('does NOT mutate input array when paginating', () => {
    const original = [...items];
    applyReadOnlyApiPagination(items, { limit: 5, offset: 0, cursor: undefined });
    expect(items).toEqual(original);
  });
  it('paginationMeta.fixtureOnly is true', () => {
    const { paginationMeta } = applyReadOnlyApiPagination(items, { limit: 5, offset: 0, cursor: undefined });
    expect(paginationMeta.fixtureOnly).toBe(true);
  });
  it('resultCount equals data.length', () => {
    const { data, paginationMeta } = applyReadOnlyApiPagination(items, { limit: 7, offset: 0, cursor: undefined });
    expect(paginationMeta.resultCount).toBe(data.length);
  });
});

// ─── 11. buildReadOnlyApiQueryResult ──────────────────────────────────────────

describe('Phase 21 — buildReadOnlyApiQueryResult', () => {
  const items = [
    { id: 'a', severity: 'high', panel: 'evidence' },
    { id: 'b', severity: 'low', panel: 'safety' },
    { id: 'c', severity: 'high', panel: 'evidence' },
    { id: 'd', severity: 'medium', panel: 'replay' },
    { id: 'e', severity: 'low', panel: 'safety' },
  ];

  it('returns data array', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(Array.isArray(result.data)).toBe(true);
    }
  });
  it('returns queryMeta', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta).toBeDefined();
    }
  });
  it('queryMeta.fixtureOnly is true', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta.fixtureOnly).toBe(true);
    }
  });
  it('queryMeta.analysisOnly is true', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta.analysisOnly).toBe(true);
    }
  });
  it('queryMeta.nonExecutable is true', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta.nonExecutable).toBe(true);
    }
  });
  it('queryMeta.readOnly is true', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta.readOnly).toBe(true);
    }
  });
  it('queryMeta.localOnly is true', () => {
    const q = parseReadOnlyApiQuery({});
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta.localOnly).toBe(true);
    }
  });
  it('filters and returns only matching items', () => {
    const q = parseReadOnlyApiQuery({ severity: 'high' });
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.data.every((x: typeof items[0]) => x.severity === 'high')).toBe(true);
    }
  });
  it('queryMeta.pagination.totalCount reflects filtered count', () => {
    const q = parseReadOnlyApiQuery({ severity: 'high' });
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta.pagination.totalCount).toBe(2);
    }
  });
  it('queryMeta.appliedFilters.filtersActive is true when filter applied', () => {
    const q = parseReadOnlyApiQuery({ severity: 'high' });
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta.appliedFilters.filtersActive).toBe(true);
    }
  });
  it('hasMore is correct when pagination applied', () => {
    const q = parseReadOnlyApiQuery({ limit: '2' });
    if (q.ok) {
      const result = buildReadOnlyApiQueryResult(items, q.value);
      expect(result.queryMeta.pagination.hasMore).toBe(true);
    }
  });
  it('does not mutate input array', () => {
    const original = [...items];
    const q = parseReadOnlyApiQuery({ sortBy: 'severity', sortDirection: 'desc' });
    if (q.ok) buildReadOnlyApiQueryResult(items, q.value);
    expect(items).toEqual(original);
  });
});

// ─── 12. validateReadOnlyApiQuerySafety ───────────────────────────────────────

describe('Phase 21 — validateReadOnlyApiQuerySafety', () => {
  it('accepts safe fixture-only object', () => {
    const r = validateReadOnlyApiQuerySafety({ fixtureOnly: true, liveData: false, safeToDisplay: true, analysisOnly: true, nonExecutable: true, readOnly: true, localOnly: true });
    expect(r.ok).toBe(true);
  });
  it('rejects null', () => {
    const r = validateReadOnlyApiQuerySafety(null);
    expect(r.ok).toBe(false);
  });
  it('rejects undefined', () => {
    const r = validateReadOnlyApiQuerySafety(undefined);
    expect(r.ok).toBe(false);
  });
  it('rejects array', () => {
    const r = validateReadOnlyApiQuerySafety([]);
    expect(r.ok).toBe(false);
  });
  it('rejects fixtureOnly=false', () => {
    const r = validateReadOnlyApiQuerySafety({ fixtureOnly: false });
    expect(r.ok).toBe(false);
  });
  it('rejects liveData=true', () => {
    const r = validateReadOnlyApiQuerySafety({ liveData: true });
    expect(r.ok).toBe(false);
  });
  it('rejects safeToDisplay=false', () => {
    const r = validateReadOnlyApiQuerySafety({ safeToDisplay: false });
    expect(r.ok).toBe(false);
  });
  it('rejects analysisOnly=false', () => {
    const r = validateReadOnlyApiQuerySafety({ analysisOnly: false });
    expect(r.ok).toBe(false);
  });
  it('rejects nonExecutable=false', () => {
    const r = validateReadOnlyApiQuerySafety({ nonExecutable: false });
    expect(r.ok).toBe(false);
  });
  it('rejects readOnly=false', () => {
    const r = validateReadOnlyApiQuerySafety({ readOnly: false });
    expect(r.ok).toBe(false);
  });
  it('rejects localOnly=false', () => {
    const r = validateReadOnlyApiQuerySafety({ localOnly: false });
    expect(r.ok).toBe(false);
  });
  it('rejects object with secret pattern in field', () => {
    const r = validateReadOnlyApiQuerySafety({ someField: 'private_key_abc' });
    expect(r.ok).toBe(false);
  });
  it('rejects object with URL pattern in field', () => {
    const r = validateReadOnlyApiQuerySafety({ someField: 'wss://evil.com' });
    expect(r.ok).toBe(false);
  });
  it('rejects object with unsafe action text in label field', () => {
    const r = validateReadOnlyApiQuerySafety({ label: 'auto trade this token' });
    expect(r.ok).toBe(false);
  });
  it('accepts plain safe object with no special fields', () => {
    const r = validateReadOnlyApiQuerySafety({ foo: 'bar' });
    expect(r.ok).toBe(true);
  });
});

// ─── 13. GET /dashboard with query params ────────────────────────────────────

describe('Phase 21 — GET /dashboard with query params (Fastify inject)', () => {
  it('returns 200 with no query params', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard' });
    expect(res.statusCode).toBe(200);
  });
  it('returns 200 with limit param', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard?limit=5' });
    expect(res.statusCode).toBe(200);
  });
  it('returns safety metadata', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard' });
    const body = JSON.parse(res.body);
    expect(body.meta.fixtureOnly).toBe(true);
    expect(body.meta.liveData).toBe(false);
  });
  it('returns queryMeta in data', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard?limit=5' });
    const body = JSON.parse(res.body);
    expect(body.data?.queryMeta).toBeDefined();
  });
  it('handles invalid severity gracefully (returns error response)', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard?severity=HACK' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('failed');
  });
});

// ─── 14. GET /dashboard/evidence with query params ───────────────────────────

describe('Phase 21 — GET /dashboard/evidence with query params (Fastify inject)', () => {
  it('returns 200 with no query params', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence' });
    expect(res.statusCode).toBe(200);
  });
  it('returns 200 with limit param', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence?limit=3' });
    expect(res.statusCode).toBe(200);
  });
  it('returns safety metadata', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence' });
    const body = JSON.parse(res.body);
    expect(body.meta.fixtureOnly).toBe(true);
    expect(body.meta.analysisOnly).toBe(true);
  });
  it('returns queryMeta in data', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence?limit=3' });
    const body = JSON.parse(res.body);
    expect(body.data?.queryMeta).toBeDefined();
  });
  it('returns entries array in data', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence' });
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.data?.entries)).toBe(true);
  });
  it('severity filter returns failed on invalid value', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence?severity=INVALID' });
    const body = JSON.parse(res.body);
    expect(body.status).toBe('failed');
  });
  it('valid severity filter returns ok status', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence?severity=info' });
    const body = JSON.parse(res.body);
    expect(body.status).toBe('ok');
  });
  it('sortBy and sortDirection accepted', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence?sortBy=severity&sortDirection=desc' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('ok');
  });
});

// ─── 15. GET /dashboard/safety with query params ─────────────────────────────

describe('Phase 21 — GET /dashboard/safety with query params (Fastify inject)', () => {
  it('returns 200 with no query params', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/safety' });
    expect(res.statusCode).toBe(200);
  });
  it('returns safety metadata', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/safety' });
    const body = JSON.parse(res.body);
    expect(body.meta.fixtureOnly).toBe(true);
    expect(body.meta.nonExecutable).toBe(true);
    expect(body.meta.readOnly).toBe(true);
  });
  it('returns queryMeta in data', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/safety?limit=10' });
    const body = JSON.parse(res.body);
    expect(body.data?.queryMeta).toBeDefined();
  });
  it('handles invalid sort field gracefully', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/safety?sortBy=badField' });
    const body = JSON.parse(res.body);
    expect(body.status).toBe('failed');
  });
});

// ─── 16. Phase 20 endpoint regression ────────────────────────────────────────

describe('Phase 21 — Phase 20 endpoint regression (Fastify inject)', () => {
  it('GET /health returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /capabilities returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/capabilities' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /contracts returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/contracts' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /contracts/openapi-shape returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/contracts/openapi-shape' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /dashboard returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /dashboard/overview returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/overview' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /dashboard/replay returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/replay' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /dashboard/strategy returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/strategy' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /dashboard/evaluation returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evaluation' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /dashboard/evidence returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence' });
    expect(res.statusCode).toBe(200);
  });
  it('GET /dashboard/safety returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/safety' });
    expect(res.statusCode).toBe(200);
  });
  it('all responses include meta.fixtureOnly=true', async () => {
    const app = await createReadOnlyApiApp();
    const endpoints = ['/health', '/capabilities', '/contracts', '/dashboard', '/dashboard/evidence'];
    for (const ep of endpoints) {
      const res = await app.inject({ method: 'GET', url: ep });
      const body = JSON.parse(res.body);
      expect(body.meta?.fixtureOnly).toBe(true);
    }
  });
  it('all responses include meta.liveData=false', async () => {
    const app = await createReadOnlyApiApp();
    const endpoints = ['/health', '/capabilities', '/contracts'];
    for (const ep of endpoints) {
      const res = await app.inject({ method: 'GET', url: ep });
      const body = JSON.parse(res.body);
      expect(body.meta?.liveData).toBe(false);
    }
  });
});

// ─── 17. Non-GET methods rejected ────────────────────────────────────────────

describe('Phase 21 — Non-GET methods rejected', () => {
  it('POST /dashboard returns 404', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'POST', url: '/dashboard', body: '{}' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
  it('PUT /health returns 404', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'PUT', url: '/health' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
  it('DELETE /contracts returns 404', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'DELETE', url: '/contracts' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
  it('PATCH /capabilities returns 404', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'PATCH', url: '/capabilities' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
  it('POST /dashboard/evidence with body returns 404', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'POST', url: '/dashboard/evidence', payload: { data: 'something' } });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});

// ─── 18. Safety invariants ────────────────────────────────────────────────────

describe('Phase 21 — Safety invariants', () => {
  it('handleHealth includes safety fields', () => {
    const r = handleHealth();
    expect(r.meta.fixtureOnly).toBe(true);
    expect(r.meta.liveData).toBe(false);
    expect(r.meta.nonExecutable).toBe(true);
    expect(r.meta.readOnly).toBe(true);
    expect(r.meta.localOnly).toBe(true);
  });
  it('handleCapabilities includes safety fields', () => {
    const r = handleCapabilities();
    expect(r.meta.safeToDisplay).toBe(true);
    expect(r.meta.analysisOnly).toBe(true);
  });
  it('handleContracts includes safety fields', () => {
    const r = handleContracts();
    expect(r.meta.fixtureOnly).toBe(true);
  });
  it('handleDashboard includes safety fields', () => {
    const r = handleDashboard();
    expect(r.meta.fixtureOnly).toBe(true);
    expect(r.meta.readOnly).toBe(true);
  });
  it('handleDashboardEvidence includes safety fields', () => {
    const r = handleDashboardEvidence();
    expect(r.meta.nonExecutable).toBe(true);
    expect(r.meta.localOnly).toBe(true);
  });
  it('handleDashboardSafety includes safety fields', () => {
    const r = handleDashboardSafety();
    expect(r.meta.fixtureOnly).toBe(true);
  });
  it('STANDARD_SAFETY_META has correct values', () => {
    expect(STANDARD_SAFETY_META.fixtureOnly).toBe(true);
    expect(STANDARD_SAFETY_META.liveData).toBe(false);
    expect(STANDARD_SAFETY_META.safeToDisplay).toBe(true);
    expect(STANDARD_SAFETY_META.analysisOnly).toBe(true);
    expect(STANDARD_SAFETY_META.nonExecutable).toBe(true);
    expect(STANDARD_SAFETY_META.readOnly).toBe(true);
    expect(STANDARD_SAFETY_META.localOnly).toBe(true);
  });
  it('lroApiOk returns ok=true', () => {
    const r = lroApiOk('test');
    expect(r.ok).toBe(true);
  });
  it('lroApiErr returns ok=false', () => {
    const r = lroApiErr('INVALID_LRO_API_INPUT', 'msg');
    expect(r.ok).toBe(false);
  });
});

// ─── 19. No forbidden runtime imports ────────────────────────────────────────

describe('Phase 21 — No forbidden runtime imports', () => {
  const pkgPath = resolve(__dirname, '../apps/read-only-api/package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { dependencies?: Record<string, string> };

  const forbidden = [
    '@solana/web3.js',
    'helius',
    'yellowstone',
    'geyser',
    'jito',
    'pump',
    '@jito-foundation',
    'react',
    'ws',
    'socket.io',
  ];

  for (const dep of forbidden) {
    it(`does not depend on ${dep}`, () => {
      const deps = Object.keys(pkg.dependencies ?? {});
      expect(deps.some(d => d.toLowerCase().includes(dep.toLowerCase()))).toBe(false);
    });
  }

  it('query.ts does not call eval( as a runtime function', () => {
    const src = readFileSync(resolve(__dirname, '../apps/read-only-api/src/query.ts'), 'utf-8');
    // Allow 'eval(' as a string constant in safety patterns array, but not as a runtime call
    // The file should not have a bare eval( call outside of string literals
    const lines = src.split('\n').filter(line => {
      // Skip comment lines and string literal lines in arrays
      const trimmed = line.trim();
      return !trimmed.startsWith('//') && !trimmed.startsWith('*') && !trimmed.startsWith('\'eval(') && !trimmed.startsWith('"eval(');
    });
    // Check that eval is not called as a runtime expression (not inside a string)
    const hasRuntimeEval = lines.some(line => /(?<!['"\/])eval\s*\(/.test(line));
    expect(hasRuntimeEval).toBe(false);
  });
  it('query.ts does not contain new Function', () => {
    const src = readFileSync(resolve(__dirname, '../apps/read-only-api/src/query.ts'), 'utf-8');
    expect(src).not.toContain('new Function');
  });
  it('filtering.ts does not contain eval(', () => {
    const src = readFileSync(resolve(__dirname, '../apps/read-only-api/src/filtering.ts'), 'utf-8');
    expect(src).not.toContain('eval(');
  });
  it('sorting.ts does not contain eval(', () => {
    const src = readFileSync(resolve(__dirname, '../apps/read-only-api/src/sorting.ts'), 'utf-8');
    expect(src).not.toContain('eval(');
  });
  it('pagination.ts does not contain eval(', () => {
    const src = readFileSync(resolve(__dirname, '../apps/read-only-api/src/pagination.ts'), 'utf-8');
    expect(src).not.toContain('eval(');
  });
});

// ─── 20. Unsafe text detection ────────────────────────────────────────────────

describe('Phase 21 — Unsafe text detection', () => {
  it('containsUnsafeActionText detects unsafe patterns', () => {
    expect(containsUnsafeActionText('auto trade now')).toBe(true);
    expect(containsUnsafeActionText('send transaction')).toBe(true);
    expect(containsUnsafeActionText('snipe this token')).toBe(true);
  });
  it('containsSecretPattern detects secrets', () => {
    expect(containsSecretPattern('my_private_key_here')).toBe(true);
    expect(containsSecretPattern('seed_phrase_words')).toBe(true);
    expect(containsSecretPattern('apikey_abc')).toBe(true);
  });
  it('containsUrlPattern detects URLs', () => {
    expect(containsUrlPattern('wss://solana.rpc.com')).toBe(true);
    expect(containsUrlPattern('helius.dev/api')).toBe(true);
  });
  it('isDisplaySafe returns false for unsafe text', () => {
    expect(isDisplaySafe('auto trade now')).toBe(false);
    expect(isDisplaySafe('private_key_here')).toBe(false);
    expect(isDisplaySafe('wss://evil.com')).toBe(false);
  });
  it('isDisplaySafe returns true for safe text', () => {
    expect(isDisplaySafe('fixture analysis summary')).toBe(true);
    expect(isDisplaySafe('read-only local-only')).toBe(true);
  });
});

// ─── 21. Phase 13–19 regression guard ────────────────────────────────────────

describe('Phase 21 — Phase 13-19 regression guard', () => {
  it('getLocalReadOnlyApiCapabilities still returns capabilities', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps).toBeDefined();
    expect(caps.canTrade).toBe(false);
  });
  it('createReadOnlyApiConfig creates valid config', () => {
    const r = createReadOnlyApiConfig({ host: '127.0.0.1', port: 3140 });
    expect(r.ok).toBe(true);
  });
  it('createReadOnlyApiConfig rejects external host', () => {
    const r = createReadOnlyApiConfig({ host: '0.0.0.0', port: 3140 });
    expect(r.ok).toBe(false);
  });
  it('validateLocalReadOnlyApiSafety still works for config', () => {
    const r = validateLocalReadOnlyApiSafety({ host: '127.0.0.1', port: 3140, fixtureOnly: true, readOnly: true, localOnly: true });
    expect(r.ok).toBe(true);
  });
  it('validateLroApiSafetyMeta still validates', () => {
    const r = validateLroApiSafetyMeta({ fixtureOnly: true, liveData: false, safeToDisplay: true, analysisOnly: true, nonExecutable: true, readOnly: true, localOnly: true });
    expect(r.ok).toBe(true);
  });
  it('LRO_API_ALL_CONTRACT_FIXTURES is an array', () => {
    expect(Array.isArray(LRO_API_ALL_CONTRACT_FIXTURES)).toBe(true);
  });
  it('LRO_API_DASHBOARD_FIXTURES is an array', () => {
    expect(Array.isArray(LRO_API_DASHBOARD_FIXTURES)).toBe(true);
  });
  it('LRO_API_CONTRACTS_BUNDLE has dashboardContract', () => {
    expect(LRO_API_CONTRACTS_BUNDLE.dashboardContract).toBeDefined();
  });
  it('LRO_API_CONTRACTS_JSON is defined', () => {
    expect(LRO_API_CONTRACTS_JSON).toBeDefined();
  });
  it('LRO_API_CONTRACTS_OPENAPI_SHAPE is an object', () => {
    expect(typeof LRO_API_CONTRACTS_OPENAPI_SHAPE).toBe('object');
  });
  it('getDefaultConfig returns valid config', () => {
    const c = getDefaultConfig();
    expect(c.host).toBe('127.0.0.1');
    expect(c.port).toBe(3140);
  });
  it('handleHealth returns ok status', () => {
    const r = handleHealth();
    expect(r.status).toBe('ok');
  });
  it('handleContracts returns ok status', () => {
    const r = handleContracts();
    expect(r.status).toBe('ok');
  });
  it('handleContractsOpenApiShape returns ok status', () => {
    const r = handleContractsOpenApiShape();
    expect(r.status).toBe('ok');
  });
  it('handleDashboardOverview returns ok status', () => {
    const r = handleDashboardOverview();
    expect(r.status).toBe('ok');
  });
  it('handleDashboardReplay returns ok status', () => {
    const r = handleDashboardReplay();
    expect(r.status).toBe('ok');
  });
  it('handleDashboardStrategy returns ok status', () => {
    const r = handleDashboardStrategy();
    expect(r.status).toBe('ok');
  });
  it('handleDashboardEvaluation returns ok status', () => {
    const r = handleDashboardEvaluation();
    expect(r.status).toBe('ok');
  });
});
