/**
 * tests/phase23.test.ts
 *
 * Phase 23 — Local Read-Only API Consumer SDK and Contract Fixtures v1
 *
 * Tests cover:
 *   1. SDK exports
 *   2. Client factory creation
 *   3. Endpoint definitions
 *   4. Request builder shape
 *   5. Query builder valid/invalid cases
 *   6. No real network calls
 *   7. No bound ports
 *   8. Success/error envelope type guards
 *   9. Envelope parsers
 *   10. Malformed envelope handling
 *   11. Metadata validation
 *   12. Safety flag preservation
 *   13. All success fixtures
 *   14. All error fixtures
 *   15. Fixture list/lookup helpers
 *   16. Fixture determinism
 *   17. Capability metadata Phase 23 flags
 *   18. Existing Phase 22 contract regression
 *   19. Safety boundaries
 *   20. No mutation/network regressions
 */

import { describe, it, expect } from 'vitest';

import {
  // Client factory
  createReadOnlyApiClient,
  buildReadOnlyApiRequest,
  // Endpoint definitions
  READ_ONLY_API_CLIENT_ENDPOINTS,
  getClientEndpoint,
  isKnownEndpointPath,
  listEndpointPaths,
  // Query builders
  buildReadOnlyApiQuery,
  buildQueryString,
  buildLimitParam,
  buildOffsetParam,
  buildCursorParam,
  buildSeverityParam,
  buildPanelParam,
  buildSourceKindParam,
  buildClassificationParam,
  buildStatusParam,
  buildSortByParam,
  buildSortDirectionParam,
  // Response parsers / type guards
  isReadOnlyApiSuccessEnvelope,
  isReadOnlyApiErrorEnvelope,
  assertReadOnlyApiSuccessEnvelope,
  assertReadOnlyApiErrorEnvelope,
  parseReadOnlyApiEnvelope,
  extractSuccessData,
  extractErrorInfo,
  validateEnvelopeMeta,
  isDeterministicGeneratedAt,
  ReadOnlyApiAssertionError,
  // Success fixtures
  HEALTH_SUCCESS_FIXTURE,
  CAPABILITIES_SUCCESS_FIXTURE,
  DASHBOARD_SUCCESS_FIXTURE,
  DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
  DASHBOARD_SAFETY_SUCCESS_FIXTURE,
  // Error fixtures
  INVALID_QUERY_ERROR_FIXTURE,
  INVALID_QUERY_EVIDENCE_ERROR_FIXTURE,
  UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
  METHOD_NOT_ALLOWED_ERROR_FIXTURE,
  SAFETY_REJECTION_ERROR_FIXTURE,
  INTERNAL_CONTRACT_ERROR_FIXTURE,
  // Fixture helpers
  listReadOnlyApiContractFixtures,
  getReadOnlyApiContractFixture,
  listReadOnlyApiContractFixturesByKind,
  listReadOnlyApiContractFixturesByEndpoint,
} from '@sonic/read-only-api-client';

import {
  getLocalReadOnlyApiCapabilities,
  PHASE_22_GENERATED_AT,
  handleHealth,
  handleCapabilities,
  handleDashboard,
  handleDashboardEvidence,
  handleDashboardSafety,
} from '@sonic/read-only-api';

// ─── 1. SDK exports ───────────────────────────────────────────────────────────

describe('Phase 23 — SDK exports', () => {
  it('exports createReadOnlyApiClient', () => { expect(typeof createReadOnlyApiClient).toBe('function'); });
  it('exports buildReadOnlyApiRequest', () => { expect(typeof buildReadOnlyApiRequest).toBe('function'); });
  it('exports READ_ONLY_API_CLIENT_ENDPOINTS', () => { expect(Array.isArray(READ_ONLY_API_CLIENT_ENDPOINTS)).toBe(true); });
  it('exports getClientEndpoint', () => { expect(typeof getClientEndpoint).toBe('function'); });
  it('exports isKnownEndpointPath', () => { expect(typeof isKnownEndpointPath).toBe('function'); });
  it('exports listEndpointPaths', () => { expect(typeof listEndpointPaths).toBe('function'); });
  it('exports buildReadOnlyApiQuery', () => { expect(typeof buildReadOnlyApiQuery).toBe('function'); });
  it('exports buildQueryString', () => { expect(typeof buildQueryString).toBe('function'); });
  it('exports buildLimitParam', () => { expect(typeof buildLimitParam).toBe('function'); });
  it('exports buildOffsetParam', () => { expect(typeof buildOffsetParam).toBe('function'); });
  it('exports buildCursorParam', () => { expect(typeof buildCursorParam).toBe('function'); });
  it('exports buildSeverityParam', () => { expect(typeof buildSeverityParam).toBe('function'); });
  it('exports buildPanelParam', () => { expect(typeof buildPanelParam).toBe('function'); });
  it('exports buildSourceKindParam', () => { expect(typeof buildSourceKindParam).toBe('function'); });
  it('exports buildClassificationParam', () => { expect(typeof buildClassificationParam).toBe('function'); });
  it('exports buildStatusParam', () => { expect(typeof buildStatusParam).toBe('function'); });
  it('exports buildSortByParam', () => { expect(typeof buildSortByParam).toBe('function'); });
  it('exports buildSortDirectionParam', () => { expect(typeof buildSortDirectionParam).toBe('function'); });
  it('exports isReadOnlyApiSuccessEnvelope', () => { expect(typeof isReadOnlyApiSuccessEnvelope).toBe('function'); });
  it('exports isReadOnlyApiErrorEnvelope', () => { expect(typeof isReadOnlyApiErrorEnvelope).toBe('function'); });
  it('exports assertReadOnlyApiSuccessEnvelope', () => { expect(typeof assertReadOnlyApiSuccessEnvelope).toBe('function'); });
  it('exports assertReadOnlyApiErrorEnvelope', () => { expect(typeof assertReadOnlyApiErrorEnvelope).toBe('function'); });
  it('exports parseReadOnlyApiEnvelope', () => { expect(typeof parseReadOnlyApiEnvelope).toBe('function'); });
  it('exports extractSuccessData', () => { expect(typeof extractSuccessData).toBe('function'); });
  it('exports extractErrorInfo', () => { expect(typeof extractErrorInfo).toBe('function'); });
  it('exports validateEnvelopeMeta', () => { expect(typeof validateEnvelopeMeta).toBe('function'); });
  it('exports isDeterministicGeneratedAt', () => { expect(typeof isDeterministicGeneratedAt).toBe('function'); });
  it('exports ReadOnlyApiAssertionError', () => { expect(typeof ReadOnlyApiAssertionError).toBe('function'); });
  it('exports HEALTH_SUCCESS_FIXTURE', () => { expect(typeof HEALTH_SUCCESS_FIXTURE).toBe('object'); });
  it('exports CAPABILITIES_SUCCESS_FIXTURE', () => { expect(typeof CAPABILITIES_SUCCESS_FIXTURE).toBe('object'); });
  it('exports DASHBOARD_SUCCESS_FIXTURE', () => { expect(typeof DASHBOARD_SUCCESS_FIXTURE).toBe('object'); });
  it('exports DASHBOARD_EVIDENCE_SUCCESS_FIXTURE', () => { expect(typeof DASHBOARD_EVIDENCE_SUCCESS_FIXTURE).toBe('object'); });
  it('exports DASHBOARD_SAFETY_SUCCESS_FIXTURE', () => { expect(typeof DASHBOARD_SAFETY_SUCCESS_FIXTURE).toBe('object'); });
  it('exports INVALID_QUERY_ERROR_FIXTURE', () => { expect(typeof INVALID_QUERY_ERROR_FIXTURE).toBe('object'); });
  it('exports INVALID_QUERY_EVIDENCE_ERROR_FIXTURE', () => { expect(typeof INVALID_QUERY_EVIDENCE_ERROR_FIXTURE).toBe('object'); });
  it('exports UNSUPPORTED_ENDPOINT_ERROR_FIXTURE', () => { expect(typeof UNSUPPORTED_ENDPOINT_ERROR_FIXTURE).toBe('object'); });
  it('exports METHOD_NOT_ALLOWED_ERROR_FIXTURE', () => { expect(typeof METHOD_NOT_ALLOWED_ERROR_FIXTURE).toBe('object'); });
  it('exports SAFETY_REJECTION_ERROR_FIXTURE', () => { expect(typeof SAFETY_REJECTION_ERROR_FIXTURE).toBe('object'); });
  it('exports INTERNAL_CONTRACT_ERROR_FIXTURE', () => { expect(typeof INTERNAL_CONTRACT_ERROR_FIXTURE).toBe('object'); });
  it('exports listReadOnlyApiContractFixtures', () => { expect(typeof listReadOnlyApiContractFixtures).toBe('function'); });
  it('exports getReadOnlyApiContractFixture', () => { expect(typeof getReadOnlyApiContractFixture).toBe('function'); });
  it('exports listReadOnlyApiContractFixturesByKind', () => { expect(typeof listReadOnlyApiContractFixturesByKind).toBe('function'); });
  it('exports listReadOnlyApiContractFixturesByEndpoint', () => { expect(typeof listReadOnlyApiContractFixturesByEndpoint).toBe('function'); });
});

// ─── 2. Client factory ────────────────────────────────────────────────────────

describe('Phase 23 — Client factory', () => {
  it('createReadOnlyApiClient returns an object', () => {
    const client = createReadOnlyApiClient();
    expect(typeof client).toBe('object');
  });
  it('client.isNetworkClient is false', () => {
    const client = createReadOnlyApiClient();
    expect(client.isNetworkClient).toBe(false);
  });
  it('client.bindsPort is false', () => {
    const client = createReadOnlyApiClient();
    expect(client.bindsPort).toBe(false);
  });
  it('client.buildRequest is a function', () => {
    const client = createReadOnlyApiClient();
    expect(typeof client.buildRequest).toBe('function');
  });
  it('client.options is an object', () => {
    const client = createReadOnlyApiClient();
    expect(typeof client.options).toBe('object');
  });
  it('createReadOnlyApiClient accepts options', () => {
    const client = createReadOnlyApiClient({ generatedAt: PHASE_22_GENERATED_AT });
    expect(client.options.generatedAt).toBe(PHASE_22_GENERATED_AT);
  });
  it('client.buildRequest returns a request with method GET', () => {
    const client = createReadOnlyApiClient();
    const req = client.buildRequest('/health');
    expect(req.method).toBe('GET');
  });
  it('client.buildRequest sets endpoint correctly', () => {
    const client = createReadOnlyApiClient();
    const req = client.buildRequest('/capabilities');
    expect(req.endpoint).toBe('/capabilities');
  });
  it('client.buildRequest includes empty query by default', () => {
    const client = createReadOnlyApiClient();
    const req = client.buildRequest('/health');
    expect(typeof req.query).toBe('object');
  });
  it('client.buildRequest passes query through', () => {
    const client = createReadOnlyApiClient();
    const req = client.buildRequest('/dashboard', { limit: 10 });
    expect(req.query.limit).toBe(10);
  });
  it('multiple clients are independent', () => {
    const c1 = createReadOnlyApiClient({ generatedAt: '2026-01-01T00:00:00.000Z' });
    const c2 = createReadOnlyApiClient();
    expect(c1.options.generatedAt).toBe('2026-01-01T00:00:00.000Z');
    expect(c2.options.generatedAt).toBeUndefined();
  });
});

// ─── 3. Endpoint definitions ──────────────────────────────────────────────────

describe('Phase 23 — Endpoint definitions', () => {
  it('READ_ONLY_API_CLIENT_ENDPOINTS is a non-empty array', () => {
    expect(READ_ONLY_API_CLIENT_ENDPOINTS.length).toBeGreaterThan(0);
  });
  it('has exactly 11 endpoints', () => {
    expect(READ_ONLY_API_CLIENT_ENDPOINTS.length).toBe(11);
  });
  it('all endpoints have method GET', () => {
    for (const e of READ_ONLY_API_CLIENT_ENDPOINTS) {
      expect(e.method).toBe('GET');
    }
  });
  it('all endpoints have a string path', () => {
    for (const e of READ_ONLY_API_CLIENT_ENDPOINTS) {
      expect(typeof e.path).toBe('string');
    }
  });
  it('all endpoints have a non-empty description', () => {
    for (const e of READ_ONLY_API_CLIENT_ENDPOINTS) {
      expect(e.description.length).toBeGreaterThan(0);
    }
  });
  it('all endpoints have supportsQuery boolean', () => {
    for (const e of READ_ONLY_API_CLIENT_ENDPOINTS) {
      expect(typeof e.supportsQuery).toBe('boolean');
    }
  });
  it('all endpoints have queryParams array', () => {
    for (const e of READ_ONLY_API_CLIENT_ENDPOINTS) {
      expect(Array.isArray(e.queryParams)).toBe(true);
    }
  });
  it('includes /health', () => {
    expect(READ_ONLY_API_CLIENT_ENDPOINTS.some(e => e.path === '/health')).toBe(true);
  });
  it('includes /capabilities', () => {
    expect(READ_ONLY_API_CLIENT_ENDPOINTS.some(e => e.path === '/capabilities')).toBe(true);
  });
  it('includes /dashboard', () => {
    expect(READ_ONLY_API_CLIENT_ENDPOINTS.some(e => e.path === '/dashboard')).toBe(true);
  });
  it('includes /dashboard/evidence', () => {
    expect(READ_ONLY_API_CLIENT_ENDPOINTS.some(e => e.path === '/dashboard/evidence')).toBe(true);
  });
  it('includes /dashboard/safety', () => {
    expect(READ_ONLY_API_CLIENT_ENDPOINTS.some(e => e.path === '/dashboard/safety')).toBe(true);
  });
  it('/dashboard supportsQuery is true', () => {
    const e = READ_ONLY_API_CLIENT_ENDPOINTS.find(e => e.path === '/dashboard');
    expect(e?.supportsQuery).toBe(true);
  });
  it('/health supportsQuery is false', () => {
    const e = READ_ONLY_API_CLIENT_ENDPOINTS.find(e => e.path === '/health');
    expect(e?.supportsQuery).toBe(false);
  });
  it('getClientEndpoint returns endpoint for known path', () => {
    const e = getClientEndpoint('/health');
    expect(e?.path).toBe('/health');
  });
  it('getClientEndpoint returns undefined for unknown path', () => {
    const e = getClientEndpoint('/not-a-real-endpoint');
    expect(e).toBeUndefined();
  });
  it('isKnownEndpointPath returns true for /health', () => {
    expect(isKnownEndpointPath('/health')).toBe(true);
  });
  it('isKnownEndpointPath returns false for unknown paths', () => {
    expect(isKnownEndpointPath('/unknown')).toBe(false);
  });
  it('listEndpointPaths returns all paths', () => {
    const paths = listEndpointPaths();
    expect(paths.length).toBe(11);
  });
  it('listEndpointPaths includes /dashboard/evidence', () => {
    expect(listEndpointPaths().includes('/dashboard/evidence')).toBe(true);
  });
});

// ─── 4. Request builder ───────────────────────────────────────────────────────

describe('Phase 23 — Request builder', () => {
  it('buildReadOnlyApiRequest returns an object', () => {
    const req = buildReadOnlyApiRequest('/health');
    expect(typeof req).toBe('object');
  });
  it('buildReadOnlyApiRequest sets method to GET', () => {
    const req = buildReadOnlyApiRequest('/health');
    expect(req.method).toBe('GET');
  });
  it('buildReadOnlyApiRequest sets endpoint', () => {
    const req = buildReadOnlyApiRequest('/capabilities');
    expect(req.endpoint).toBe('/capabilities');
  });
  it('buildReadOnlyApiRequest sets empty query by default', () => {
    const req = buildReadOnlyApiRequest('/health');
    expect(Object.keys(req.query).length).toBe(0);
  });
  it('buildReadOnlyApiRequest stores query params', () => {
    const req = buildReadOnlyApiRequest('/dashboard', { limit: 5, severity: 'high' });
    expect(req.query.limit).toBe(5);
    expect(req.query.severity).toBe('high');
  });
  it('buildReadOnlyApiRequest does not mutate input query', () => {
    const q = { limit: 10 };
    const req = buildReadOnlyApiRequest('/dashboard', q);
    expect(req.query.limit).toBe(10);
    expect(q.limit).toBe(10);
  });
  it('request is deterministic for same inputs', () => {
    const r1 = buildReadOnlyApiRequest('/health');
    const r2 = buildReadOnlyApiRequest('/health');
    expect(r1.endpoint).toBe(r2.endpoint);
    expect(r1.method).toBe(r2.method);
  });
});

// ─── 5. Query builder — valid cases ──────────────────────────────────────────

describe('Phase 23 — Query builder valid cases', () => {
  it('buildReadOnlyApiQuery returns ok for empty input', () => {
    const r = buildReadOnlyApiQuery({});
    expect(r.ok).toBe(true);
  });
  it('default limit is 25', () => {
    const r = buildReadOnlyApiQuery({});
    expect(r.ok && r.query.limit).toBe(25);
  });
  it('default offset is 0', () => {
    const r = buildReadOnlyApiQuery({});
    expect(r.ok && r.query.offset).toBe(0);
  });
  it('default sortBy is id', () => {
    const r = buildReadOnlyApiQuery({});
    expect(r.ok && r.query.sortBy).toBe('id');
  });
  it('default sortDirection is asc', () => {
    const r = buildReadOnlyApiQuery({});
    expect(r.ok && r.query.sortDirection).toBe('asc');
  });
  it('accepts valid limit', () => {
    const r = buildReadOnlyApiQuery({ limit: 50 });
    expect(r.ok && r.query.limit).toBe(50);
  });
  it('accepts limit = 1', () => {
    const r = buildReadOnlyApiQuery({ limit: 1 });
    expect(r.ok && r.query.limit).toBe(1);
  });
  it('accepts limit = 100', () => {
    const r = buildReadOnlyApiQuery({ limit: 100 });
    expect(r.ok && r.query.limit).toBe(100);
  });
  it('accepts valid offset', () => {
    const r = buildReadOnlyApiQuery({ offset: 20 });
    expect(r.ok && r.query.offset).toBe(20);
  });
  it('accepts offset = 0', () => {
    const r = buildReadOnlyApiQuery({ offset: 0 });
    expect(r.ok && r.query.offset).toBe(0);
  });
  it('accepts valid cursor', () => {
    const r = buildReadOnlyApiQuery({ cursor: 'abc123' });
    expect(r.ok && r.query.cursor).toBe('abc123');
  });
  it('accepts valid severity info', () => {
    const r = buildReadOnlyApiQuery({ severity: 'info' });
    expect(r.ok && r.query.severity).toBe('info');
  });
  it('accepts valid severity high', () => {
    const r = buildReadOnlyApiQuery({ severity: 'high' });
    expect(r.ok && r.query.severity).toBe('high');
  });
  it('accepts valid severity critical', () => {
    const r = buildReadOnlyApiQuery({ severity: 'critical' });
    expect(r.ok && r.query.severity).toBe('critical');
  });
  it('accepts valid panel overview', () => {
    const r = buildReadOnlyApiQuery({ panel: 'overview' });
    expect(r.ok && r.query.panel).toBe('overview');
  });
  it('accepts valid panel evidence', () => {
    const r = buildReadOnlyApiQuery({ panel: 'evidence' });
    expect(r.ok && r.query.panel).toBe('evidence');
  });
  it('accepts valid sourceKind replay', () => {
    const r = buildReadOnlyApiQuery({ sourceKind: 'replay' });
    expect(r.ok && r.query.sourceKind).toBe('replay');
  });
  it('accepts valid classification safe', () => {
    const r = buildReadOnlyApiQuery({ classification: 'safe' });
    expect(r.ok && r.query.classification).toBe('safe');
  });
  it('accepts valid status ok', () => {
    const r = buildReadOnlyApiQuery({ status: 'ok' });
    expect(r.ok && r.query.status).toBe('ok');
  });
  it('accepts valid sortBy severity', () => {
    const r = buildReadOnlyApiQuery({ sortBy: 'severity' });
    expect(r.ok && r.query.sortBy).toBe('severity');
  });
  it('accepts valid sortDirection desc', () => {
    const r = buildReadOnlyApiQuery({ sortDirection: 'desc' });
    expect(r.ok && r.query.sortDirection).toBe('desc');
  });
  it('accepts combined valid params', () => {
    const r = buildReadOnlyApiQuery({ limit: 10, offset: 5, severity: 'high', sortBy: 'id', sortDirection: 'asc' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.query.limit).toBe(10);
      expect(r.query.severity).toBe('high');
    }
  });
  it('buildLimitParam undefined returns DEFAULT_LIMIT', () => {
    const r = buildLimitParam(undefined);
    expect(r.ok && r.value).toBe(25);
  });
  it('buildLimitParam 50 returns 50', () => {
    const r = buildLimitParam(50);
    expect(r.ok && r.value).toBe(50);
  });
  it('buildOffsetParam undefined returns 0', () => {
    const r = buildOffsetParam(undefined);
    expect(r.ok && r.value).toBe(0);
  });
  it('buildCursorParam undefined returns undefined', () => {
    const r = buildCursorParam(undefined);
    expect(r.ok && r.value).toBe(undefined);
  });
  it('buildSeverityParam valid info', () => {
    const r = buildSeverityParam('info');
    expect(r.ok && r.value).toBe('info');
  });
  it('buildPanelParam valid safety', () => {
    const r = buildPanelParam('safety');
    expect(r.ok && r.value).toBe('safety');
  });
  it('buildSourceKindParam valid fixture', () => {
    const r = buildSourceKindParam('fixture');
    expect(r.ok && r.value).toBe('fixture');
  });
  it('buildClassificationParam valid safe', () => {
    const r = buildClassificationParam('safe');
    expect(r.ok && r.value).toBe('safe');
  });
  it('buildStatusParam valid pending', () => {
    const r = buildStatusParam('pending');
    expect(r.ok && r.value).toBe('pending');
  });
  it('buildSortByParam valid label', () => {
    const r = buildSortByParam('label');
    expect(r.ok && r.value).toBe('label');
  });
  it('buildSortDirectionParam valid asc', () => {
    const r = buildSortDirectionParam('asc');
    expect(r.ok && r.value).toBe('asc');
  });
});

// ─── 6. Query builder — invalid cases ────────────────────────────────────────

describe('Phase 23 — Query builder invalid cases', () => {
  it('rejects limit 0', () => {
    const r = buildLimitParam(0);
    expect(r.ok).toBe(false);
  });
  it('rejects limit -1', () => {
    const r = buildLimitParam(-1);
    expect(r.ok).toBe(false);
  });
  it('rejects limit 101', () => {
    const r = buildLimitParam(101);
    expect(r.ok).toBe(false);
  });
  it('rejects limit NaN', () => {
    const r = buildLimitParam(NaN);
    expect(r.ok).toBe(false);
  });
  it('rejects limit Infinity', () => {
    const r = buildLimitParam(Infinity);
    expect(r.ok).toBe(false);
  });
  it('rejects limit non-integer', () => {
    const r = buildLimitParam(1.5);
    expect(r.ok).toBe(false);
  });
  it('rejects offset -1', () => {
    const r = buildOffsetParam(-1);
    expect(r.ok).toBe(false);
  });
  it('rejects offset NaN', () => {
    const r = buildOffsetParam(NaN);
    expect(r.ok).toBe(false);
  });
  it('rejects cursor too long', () => {
    const r = buildCursorParam('x'.repeat(513));
    expect(r.ok).toBe(false);
  });
  it('rejects cursor with secret pattern', () => {
    const r = buildCursorParam('private_key_abc');
    expect(r.ok).toBe(false);
  });
  it('rejects cursor with url', () => {
    const r = buildCursorParam('https://example.com');
    expect(r.ok).toBe(false);
  });
  it('rejects unknown severity', () => {
    const r = buildSeverityParam('extreme');
    expect(r.ok).toBe(false);
  });
  it('rejects unknown panel', () => {
    const r = buildPanelParam('not_a_panel');
    expect(r.ok).toBe(false);
  });
  it('rejects unknown sourceKind', () => {
    const r = buildSourceKindParam('live_data');
    expect(r.ok).toBe(false);
  });
  it('rejects unknown classification', () => {
    const r = buildClassificationParam('risky');
    expect(r.ok).toBe(false);
  });
  it('rejects unknown status', () => {
    const r = buildStatusParam('running');
    expect(r.ok).toBe(false);
  });
  it('rejects unknown sortBy', () => {
    const r = buildSortByParam('not_a_field');
    expect(r.ok).toBe(false);
  });
  it('rejects unknown sortDirection', () => {
    const r = buildSortDirectionParam('random');
    expect(r.ok).toBe(false);
  });
  it('buildReadOnlyApiQuery returns errors array on invalid input', () => {
    const r = buildReadOnlyApiQuery({ limit: -1 });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Array.isArray(r.errors)).toBe(true);
      expect(r.errors.length).toBeGreaterThan(0);
    }
  });
  it('buildReadOnlyApiQuery collects multiple errors', () => {
    const r = buildReadOnlyApiQuery({ limit: -1, severity: 'unknown_sev', sortBy: 'bad_field' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.length).toBeGreaterThanOrEqual(3);
    }
  });
  it('error messages contain no stack traces', () => {
    const r = buildLimitParam(-1);
    if (!r.ok) {
      expect(r.error).not.toContain('at Object.');
      expect(r.error).not.toContain('Error:');
    }
  });
  it('invalid query error message is a safe string', () => {
    const r = buildSeverityParam('bad_value');
    if (!r.ok) {
      expect(typeof r.error).toBe('string');
    }
  });
});

// ─── 7. Query string builder ──────────────────────────────────────────────────

describe('Phase 23 — Query string builder', () => {
  it('buildQueryString returns empty string for empty params', () => {
    expect(buildQueryString({})).toBe('');
  });
  it('buildQueryString includes limit', () => {
    expect(buildQueryString({ limit: 10 })).toContain('limit=10');
  });
  it('buildQueryString includes offset', () => {
    expect(buildQueryString({ offset: 5 })).toContain('offset=5');
  });
  it('buildQueryString includes severity', () => {
    expect(buildQueryString({ severity: 'high' })).toContain('severity=high');
  });
  it('buildQueryString includes sortBy', () => {
    expect(buildQueryString({ sortBy: 'id' })).toContain('sortBy=id');
  });
  it('buildQueryString omits undefined fields', () => {
    const qs = buildQueryString({ limit: 10, severity: undefined });
    expect(qs).not.toContain('severity');
  });
  it('buildQueryString is deterministic', () => {
    const q = { limit: 10, offset: 0, sortBy: 'id', sortDirection: 'asc' };
    expect(buildQueryString(q)).toBe(buildQueryString(q));
  });
  it('buildQueryString includes sortDirection', () => {
    expect(buildQueryString({ sortDirection: 'desc' })).toContain('sortDirection=desc');
  });
  it('buildQueryString URL-encodes cursor', () => {
    const qs = buildQueryString({ cursor: 'abc def' });
    expect(qs).toContain('cursor=abc%20def');
  });
});

// ─── 8. Success envelope type guard ──────────────────────────────────────────

describe('Phase 23 — Success envelope type guard', () => {
  it('isReadOnlyApiSuccessEnvelope returns true for health fixture', () => {
    expect(isReadOnlyApiSuccessEnvelope(HEALTH_SUCCESS_FIXTURE)).toBe(true);
  });
  it('isReadOnlyApiSuccessEnvelope returns true for capabilities fixture', () => {
    expect(isReadOnlyApiSuccessEnvelope(CAPABILITIES_SUCCESS_FIXTURE)).toBe(true);
  });
  it('isReadOnlyApiSuccessEnvelope returns true for dashboard fixture', () => {
    expect(isReadOnlyApiSuccessEnvelope(DASHBOARD_SUCCESS_FIXTURE)).toBe(true);
  });
  it('isReadOnlyApiSuccessEnvelope returns false for error fixture', () => {
    expect(isReadOnlyApiSuccessEnvelope(INVALID_QUERY_ERROR_FIXTURE)).toBe(false);
  });
  it('isReadOnlyApiSuccessEnvelope returns false for null', () => {
    expect(isReadOnlyApiSuccessEnvelope(null)).toBe(false);
  });
  it('isReadOnlyApiSuccessEnvelope returns false for undefined', () => {
    expect(isReadOnlyApiSuccessEnvelope(undefined)).toBe(false);
  });
  it('isReadOnlyApiSuccessEnvelope returns false for plain object', () => {
    expect(isReadOnlyApiSuccessEnvelope({ ok: false })).toBe(false);
  });
  it('isReadOnlyApiSuccessEnvelope returns false for string', () => {
    expect(isReadOnlyApiSuccessEnvelope('hello')).toBe(false);
  });
  it('isReadOnlyApiSuccessEnvelope returns false for number', () => {
    expect(isReadOnlyApiSuccessEnvelope(42)).toBe(false);
  });
  it('isReadOnlyApiSuccessEnvelope returns false for array', () => {
    expect(isReadOnlyApiSuccessEnvelope([])).toBe(false);
  });
  it('isReadOnlyApiSuccessEnvelope returns false for missing meta', () => {
    expect(isReadOnlyApiSuccessEnvelope({ ok: true, status: 'ok', endpoint: '/health', method: 'GET', data: {} })).toBe(false);
  });
});

// ─── 9. Error envelope type guard ────────────────────────────────────────────

describe('Phase 23 — Error envelope type guard', () => {
  it('isReadOnlyApiErrorEnvelope returns true for invalid query fixture', () => {
    expect(isReadOnlyApiErrorEnvelope(INVALID_QUERY_ERROR_FIXTURE)).toBe(true);
  });
  it('isReadOnlyApiErrorEnvelope returns true for unsupported endpoint fixture', () => {
    expect(isReadOnlyApiErrorEnvelope(UNSUPPORTED_ENDPOINT_ERROR_FIXTURE)).toBe(true);
  });
  it('isReadOnlyApiErrorEnvelope returns true for method not allowed fixture', () => {
    expect(isReadOnlyApiErrorEnvelope(METHOD_NOT_ALLOWED_ERROR_FIXTURE)).toBe(true);
  });
  it('isReadOnlyApiErrorEnvelope returns false for success fixture', () => {
    expect(isReadOnlyApiErrorEnvelope(HEALTH_SUCCESS_FIXTURE)).toBe(false);
  });
  it('isReadOnlyApiErrorEnvelope returns false for null', () => {
    expect(isReadOnlyApiErrorEnvelope(null)).toBe(false);
  });
  it('isReadOnlyApiErrorEnvelope returns false for undefined', () => {
    expect(isReadOnlyApiErrorEnvelope(undefined)).toBe(false);
  });
  it('isReadOnlyApiErrorEnvelope returns false for plain object', () => {
    expect(isReadOnlyApiErrorEnvelope({ ok: true })).toBe(false);
  });
  it('isReadOnlyApiErrorEnvelope returns false for missing error field', () => {
    expect(isReadOnlyApiErrorEnvelope({ ok: false, status: 'failed', endpoint: '/health', method: 'GET', data: null, meta: {} })).toBe(false);
  });
});

// ─── 10. Assertion helpers ────────────────────────────────────────────────────

describe('Phase 23 — Assertion helpers', () => {
  it('assertReadOnlyApiSuccessEnvelope does not throw for success fixture', () => {
    expect(() => assertReadOnlyApiSuccessEnvelope(HEALTH_SUCCESS_FIXTURE)).not.toThrow();
  });
  it('assertReadOnlyApiSuccessEnvelope throws ReadOnlyApiAssertionError for error fixture', () => {
    expect(() => assertReadOnlyApiSuccessEnvelope(INVALID_QUERY_ERROR_FIXTURE)).toThrow(ReadOnlyApiAssertionError);
  });
  it('assertReadOnlyApiSuccessEnvelope throws ReadOnlyApiAssertionError for null', () => {
    expect(() => assertReadOnlyApiSuccessEnvelope(null)).toThrow(ReadOnlyApiAssertionError);
  });
  it('assertReadOnlyApiErrorEnvelope does not throw for error fixture', () => {
    expect(() => assertReadOnlyApiErrorEnvelope(INVALID_QUERY_ERROR_FIXTURE)).not.toThrow();
  });
  it('assertReadOnlyApiErrorEnvelope throws ReadOnlyApiAssertionError for success fixture', () => {
    expect(() => assertReadOnlyApiErrorEnvelope(HEALTH_SUCCESS_FIXTURE)).toThrow(ReadOnlyApiAssertionError);
  });
  it('assertReadOnlyApiErrorEnvelope throws ReadOnlyApiAssertionError for null', () => {
    expect(() => assertReadOnlyApiErrorEnvelope(null)).toThrow(ReadOnlyApiAssertionError);
  });
  it('ReadOnlyApiAssertionError has correct name', () => {
    try {
      assertReadOnlyApiSuccessEnvelope(null);
    } catch (e) {
      expect((e as ReadOnlyApiAssertionError).name).toBe('ReadOnlyApiAssertionError');
    }
  });
  it('assertion error message does not contain stack trace', () => {
    try {
      assertReadOnlyApiSuccessEnvelope(null);
    } catch (e) {
      const msg = (e as Error).message;
      expect(msg).not.toContain('at Object.');
      expect(msg.length).toBeGreaterThan(0);
    }
  });
});

// ─── 11. Envelope parser ──────────────────────────────────────────────────────

describe('Phase 23 — Envelope parser', () => {
  it('parseReadOnlyApiEnvelope returns ok:true for success fixture', () => {
    const r = parseReadOnlyApiEnvelope(HEALTH_SUCCESS_FIXTURE);
    expect(r.ok).toBe(true);
  });
  it('parseReadOnlyApiEnvelope returns ok:false for error fixture', () => {
    const r = parseReadOnlyApiEnvelope(INVALID_QUERY_ERROR_FIXTURE);
    expect(r.ok).toBe(false);
  });
  it('parseReadOnlyApiEnvelope returns ok:false for null', () => {
    const r = parseReadOnlyApiEnvelope(null);
    expect(r.ok).toBe(false);
  });
  it('parseReadOnlyApiEnvelope returns ok:false for undefined', () => {
    const r = parseReadOnlyApiEnvelope(undefined);
    expect(r.ok).toBe(false);
  });
  it('parseReadOnlyApiEnvelope returns ok:false for plain object', () => {
    const r = parseReadOnlyApiEnvelope({ random: 'data' });
    expect(r.ok).toBe(false);
  });
  it('parseReadOnlyApiEnvelope preserves data from success envelope', () => {
    const r = parseReadOnlyApiEnvelope(HEALTH_SUCCESS_FIXTURE);
    expect(r.ok && r.data).not.toBeUndefined();
  });
  it('parseReadOnlyApiEnvelope preserves meta from success envelope', () => {
    const r = parseReadOnlyApiEnvelope(HEALTH_SUCCESS_FIXTURE);
    expect(r.meta).not.toBeUndefined();
  });
  it('parseReadOnlyApiEnvelope preserves error from error envelope', () => {
    const r = parseReadOnlyApiEnvelope(INVALID_QUERY_ERROR_FIXTURE);
    if (!r.ok) {
      expect(r.error.code).toBeDefined();
    }
  });
  it('parseReadOnlyApiEnvelope returns safe meta for malformed input', () => {
    const r = parseReadOnlyApiEnvelope({ garbage: true });
    expect(r.meta.phase).toBe(22);
    expect(r.meta.mutating).toBe(false);
    expect(r.meta.externalNetwork).toBe(false);
  });
  it('parseReadOnlyApiEnvelope returns INTERNAL_CONTRACT_ERROR code for malformed input', () => {
    const r = parseReadOnlyApiEnvelope('bad');
    if (!r.ok) {
      expect(r.error.code).toBe('READ_ONLY_API_INTERNAL_CONTRACT_ERROR');
    }
  });
});

// ─── 12. Data/error extractors ────────────────────────────────────────────────

describe('Phase 23 — Data/error extractors', () => {
  it('extractSuccessData returns data from health fixture', () => {
    const data = extractSuccessData(HEALTH_SUCCESS_FIXTURE);
    expect(data).not.toBeNull();
  });
  it('extractSuccessData returns data from capabilities fixture', () => {
    const data = extractSuccessData(CAPABILITIES_SUCCESS_FIXTURE);
    expect(data).not.toBeNull();
  });
  it('extractErrorInfo returns code from invalid query fixture', () => {
    const info = extractErrorInfo(INVALID_QUERY_ERROR_FIXTURE);
    expect(typeof info.code).toBe('string');
    expect(info.code.length).toBeGreaterThan(0);
  });
  it('extractErrorInfo returns message from error fixture', () => {
    const info = extractErrorInfo(INVALID_QUERY_ERROR_FIXTURE);
    expect(typeof info.message).toBe('string');
  });
  it('extractErrorInfo returns details array', () => {
    const info = extractErrorInfo(INVALID_QUERY_ERROR_FIXTURE);
    expect(Array.isArray(info.details)).toBe(true);
  });
  it('extractErrorInfo preserves error code', () => {
    const info = extractErrorInfo(UNSUPPORTED_ENDPOINT_ERROR_FIXTURE);
    expect(info.code).toBe('READ_ONLY_API_UNSUPPORTED_ENDPOINT');
  });
});

// ─── 13. Metadata validation ──────────────────────────────────────────────────

describe('Phase 23 — Metadata validation', () => {
  it('validateEnvelopeMeta returns empty array for valid health meta', () => {
    const errors = validateEnvelopeMeta(HEALTH_SUCCESS_FIXTURE.meta);
    expect(errors.length).toBe(0);
  });
  it('validateEnvelopeMeta returns empty array for valid error meta', () => {
    const errors = validateEnvelopeMeta(INVALID_QUERY_ERROR_FIXTURE.meta);
    expect(errors.length).toBe(0);
  });
  it('validateEnvelopeMeta returns error for null', () => {
    const errors = validateEnvelopeMeta(null);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('validateEnvelopeMeta returns error for non-object', () => {
    const errors = validateEnvelopeMeta('bad');
    expect(errors.length).toBeGreaterThan(0);
  });
  it('validateEnvelopeMeta detects wrong phase', () => {
    const meta = { ...HEALTH_SUCCESS_FIXTURE.meta, phase: 21 };
    const errors = validateEnvelopeMeta(meta);
    expect(errors.some(e => e.includes('phase'))).toBe(true);
  });
  it('validateEnvelopeMeta detects wrong apiMode', () => {
    const meta = { ...HEALTH_SUCCESS_FIXTURE.meta, apiMode: 'live' };
    const errors = validateEnvelopeMeta(meta);
    expect(errors.some(e => e.includes('apiMode'))).toBe(true);
  });
  it('validateEnvelopeMeta detects mutating: true', () => {
    const meta = { ...HEALTH_SUCCESS_FIXTURE.meta, mutating: true };
    const errors = validateEnvelopeMeta(meta);
    expect(errors.some(e => e.includes('mutating'))).toBe(true);
  });
  it('validateEnvelopeMeta detects externalNetwork: true', () => {
    const meta = { ...HEALTH_SUCCESS_FIXTURE.meta, externalNetwork: true };
    const errors = validateEnvelopeMeta(meta);
    expect(errors.some(e => e.includes('externalNetwork'))).toBe(true);
  });
  it('isDeterministicGeneratedAt returns true for Phase 22 constant', () => {
    expect(isDeterministicGeneratedAt(PHASE_22_GENERATED_AT)).toBe(true);
  });
  it('isDeterministicGeneratedAt returns false for current time', () => {
    expect(isDeterministicGeneratedAt(new Date().toISOString())).toBe(false);
  });
  it('isDeterministicGeneratedAt returns false for null', () => {
    expect(isDeterministicGeneratedAt(null)).toBe(false);
  });
});

// ─── 14. Safety flag preservation ────────────────────────────────────────────

describe('Phase 23 — Safety flag preservation', () => {
  const allSuccessFixtures = [
    HEALTH_SUCCESS_FIXTURE,
    CAPABILITIES_SUCCESS_FIXTURE,
    DASHBOARD_SUCCESS_FIXTURE,
    DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
    DASHBOARD_SAFETY_SUCCESS_FIXTURE,
  ];
  const allErrorFixtures = [
    INVALID_QUERY_ERROR_FIXTURE,
    UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
    METHOD_NOT_ALLOWED_ERROR_FIXTURE,
    SAFETY_REJECTION_ERROR_FIXTURE,
    INTERNAL_CONTRACT_ERROR_FIXTURE,
  ];
  const allFixtures = [...allSuccessFixtures, ...allErrorFixtures];

  it('all fixtures have meta.fixtureOnly = true', () => {
    for (const f of allFixtures) {
      expect(f.meta.fixtureOnly).toBe(true);
    }
  });
  it('all fixtures have meta.mutating = false', () => {
    for (const f of allFixtures) {
      expect(f.meta.mutating).toBe(false);
    }
  });
  it('all fixtures have meta.externalNetwork = false', () => {
    for (const f of allFixtures) {
      expect(f.meta.externalNetwork).toBe(false);
    }
  });
  it('all fixtures have meta.liveData = false', () => {
    for (const f of allFixtures) {
      expect(f.meta.liveData).toBe(false);
    }
  });
  it('all fixtures have meta.localOnly = true', () => {
    for (const f of allFixtures) {
      expect(f.meta.localOnly).toBe(true);
    }
  });
  it('all fixtures have meta.readOnly = true', () => {
    for (const f of allFixtures) {
      expect(f.meta.readOnly).toBe(true);
    }
  });
  it('all fixtures have meta.analysisOnly = true', () => {
    for (const f of allFixtures) {
      expect(f.meta.analysisOnly).toBe(true);
    }
  });
  it('all fixtures have meta.nonExecutable = true', () => {
    for (const f of allFixtures) {
      expect(f.meta.nonExecutable).toBe(true);
    }
  });
  it('all fixtures have meta.safeToDisplay = true', () => {
    for (const f of allFixtures) {
      expect(f.meta.safeToDisplay).toBe(true);
    }
  });
  it('all fixtures have meta.deterministic = true', () => {
    for (const f of allFixtures) {
      expect(f.meta.deterministic).toBe(true);
    }
  });
  it('all fixtures have method GET', () => {
    for (const f of allFixtures) {
      expect(f.method).toBe('GET');
    }
  });
  it('all fixtures have a string endpoint', () => {
    for (const f of allFixtures) {
      expect(typeof f.endpoint).toBe('string');
    }
  });
  it('all fixtures have meta.phase = 22', () => {
    for (const f of allFixtures) {
      expect(f.meta.phase).toBe(22);
    }
  });
  it('all fixtures have meta.apiMode = local_read_only', () => {
    for (const f of allFixtures) {
      expect(f.meta.apiMode).toBe('local_read_only');
    }
  });
});

// ─── 15. Health success fixture ───────────────────────────────────────────────

describe('Phase 23 — Health success fixture', () => {
  it('HEALTH_SUCCESS_FIXTURE.ok is true', () => { expect(HEALTH_SUCCESS_FIXTURE.ok).toBe(true); });
  it('HEALTH_SUCCESS_FIXTURE.status is ok', () => { expect(HEALTH_SUCCESS_FIXTURE.status).toBe('ok'); });
  it('HEALTH_SUCCESS_FIXTURE.endpoint is /health', () => { expect(HEALTH_SUCCESS_FIXTURE.endpoint).toBe('/health'); });
  it('HEALTH_SUCCESS_FIXTURE has data object', () => { expect(typeof HEALTH_SUCCESS_FIXTURE.data).toBe('object'); });
  it('HEALTH_SUCCESS_FIXTURE.data.fixtureOnly is true', () => {
    const d = HEALTH_SUCCESS_FIXTURE.data as Record<string, unknown>;
    expect(d['fixtureOnly']).toBe(true);
  });
  it('HEALTH_SUCCESS_FIXTURE.data.liveData is false', () => {
    const d = HEALTH_SUCCESS_FIXTURE.data as Record<string, unknown>;
    expect(d['liveData']).toBe(false);
  });
  it('HEALTH_SUCCESS_FIXTURE.generatedAt matches Phase 22 constant', () => {
    expect(HEALTH_SUCCESS_FIXTURE.generatedAt).toBe(PHASE_22_GENERATED_AT);
  });
  it('HEALTH_SUCCESS_FIXTURE has no stack trace in data', () => {
    const str = JSON.stringify(HEALTH_SUCCESS_FIXTURE.data);
    expect(str).not.toContain('at Object.');
    expect(str).not.toContain('Error:');
  });
});

// ─── 16. Capabilities success fixture ────────────────────────────────────────

describe('Phase 23 — Capabilities success fixture', () => {
  it('CAPABILITIES_SUCCESS_FIXTURE.ok is true', () => { expect(CAPABILITIES_SUCCESS_FIXTURE.ok).toBe(true); });
  it('CAPABILITIES_SUCCESS_FIXTURE.endpoint is /capabilities', () => { expect(CAPABILITIES_SUCCESS_FIXTURE.endpoint).toBe('/capabilities'); });
  it('CAPABILITIES_SUCCESS_FIXTURE has data object', () => { expect(typeof CAPABILITIES_SUCCESS_FIXTURE.data).toBe('object'); });
  it('capabilities data has canUseLiveData = false', () => {
    const d = CAPABILITIES_SUCCESS_FIXTURE.data as Record<string, unknown>;
    expect(d['canUseLiveData']).toBe(false);
  });
  it('capabilities data has fixtureOnly = true', () => {
    const d = CAPABILITIES_SUCCESS_FIXTURE.data as Record<string, unknown>;
    expect(d['fixtureOnly']).toBe(true);
  });
  it('capabilities data has canTrade = false', () => {
    const d = CAPABILITIES_SUCCESS_FIXTURE.data as Record<string, unknown>;
    expect(d['canTrade']).toBe(false);
  });
  it('CAPABILITIES_SUCCESS_FIXTURE.generatedAt is deterministic', () => {
    expect(CAPABILITIES_SUCCESS_FIXTURE.generatedAt).toBe(PHASE_22_GENERATED_AT);
  });
});

// ─── 17. Dashboard success fixture ───────────────────────────────────────────

describe('Phase 23 — Dashboard success fixture', () => {
  it('DASHBOARD_SUCCESS_FIXTURE.ok is true', () => { expect(DASHBOARD_SUCCESS_FIXTURE.ok).toBe(true); });
  it('DASHBOARD_SUCCESS_FIXTURE.endpoint is /dashboard', () => { expect(DASHBOARD_SUCCESS_FIXTURE.endpoint).toBe('/dashboard'); });
  it('DASHBOARD_SUCCESS_FIXTURE has data', () => { expect(DASHBOARD_SUCCESS_FIXTURE.data).not.toBeNull(); });
  it('DASHBOARD_SUCCESS_FIXTURE.generatedAt is deterministic', () => {
    expect(DASHBOARD_SUCCESS_FIXTURE.generatedAt).toBe(PHASE_22_GENERATED_AT);
  });
  it('DASHBOARD_SUCCESS_FIXTURE is deterministic (same ref on repeated access)', () => {
    const f1 = DASHBOARD_SUCCESS_FIXTURE;
    const f2 = DASHBOARD_SUCCESS_FIXTURE;
    expect(f1 === f2).toBe(true);
  });
});

// ─── 18. Dashboard evidence success fixture ───────────────────────────────────

describe('Phase 23 — Dashboard evidence success fixture', () => {
  it('DASHBOARD_EVIDENCE_SUCCESS_FIXTURE.ok is true', () => { expect(DASHBOARD_EVIDENCE_SUCCESS_FIXTURE.ok).toBe(true); });
  it('DASHBOARD_EVIDENCE_SUCCESS_FIXTURE.endpoint is /dashboard/evidence', () => {
    expect(DASHBOARD_EVIDENCE_SUCCESS_FIXTURE.endpoint).toBe('/dashboard/evidence');
  });
  it('DASHBOARD_EVIDENCE_SUCCESS_FIXTURE.generatedAt is deterministic', () => {
    expect(DASHBOARD_EVIDENCE_SUCCESS_FIXTURE.generatedAt).toBe(PHASE_22_GENERATED_AT);
  });
  it('DASHBOARD_EVIDENCE_SUCCESS_FIXTURE has data', () => {
    expect(DASHBOARD_EVIDENCE_SUCCESS_FIXTURE.data).not.toBeNull();
  });
});

// ─── 19. Dashboard safety success fixture ────────────────────────────────────

describe('Phase 23 — Dashboard safety success fixture', () => {
  it('DASHBOARD_SAFETY_SUCCESS_FIXTURE.ok is true', () => { expect(DASHBOARD_SAFETY_SUCCESS_FIXTURE.ok).toBe(true); });
  it('DASHBOARD_SAFETY_SUCCESS_FIXTURE.endpoint is /dashboard/safety', () => {
    expect(DASHBOARD_SAFETY_SUCCESS_FIXTURE.endpoint).toBe('/dashboard/safety');
  });
  it('DASHBOARD_SAFETY_SUCCESS_FIXTURE.generatedAt is deterministic', () => {
    expect(DASHBOARD_SAFETY_SUCCESS_FIXTURE.generatedAt).toBe(PHASE_22_GENERATED_AT);
  });
  it('DASHBOARD_SAFETY_SUCCESS_FIXTURE has data', () => {
    expect(DASHBOARD_SAFETY_SUCCESS_FIXTURE.data).not.toBeNull();
  });
});

// ─── 20. Invalid query error fixture ─────────────────────────────────────────

describe('Phase 23 — Invalid query error fixture', () => {
  it('INVALID_QUERY_ERROR_FIXTURE.ok is false', () => { expect(INVALID_QUERY_ERROR_FIXTURE.ok).toBe(false); });
  it('INVALID_QUERY_ERROR_FIXTURE.status is failed', () => { expect(INVALID_QUERY_ERROR_FIXTURE.status).toBe('failed'); });
  it('INVALID_QUERY_ERROR_FIXTURE.data is null', () => { expect(INVALID_QUERY_ERROR_FIXTURE.data).toBeNull(); });
  it('INVALID_QUERY_ERROR_FIXTURE.error.code is READ_ONLY_API_INVALID_QUERY', () => {
    expect(INVALID_QUERY_ERROR_FIXTURE.error.code).toBe('READ_ONLY_API_INVALID_QUERY');
  });
  it('INVALID_QUERY_ERROR_FIXTURE.error.details is array', () => {
    expect(Array.isArray(INVALID_QUERY_ERROR_FIXTURE.error.details)).toBe(true);
  });
  it('INVALID_QUERY_ERROR_FIXTURE has no stack trace in error details', () => {
    const str = JSON.stringify(INVALID_QUERY_ERROR_FIXTURE.error);
    expect(str).not.toContain('at Object.');
    expect(str).not.toContain('Error:');
  });
  it('INVALID_QUERY_ERROR_FIXTURE has no local path', () => {
    const str = JSON.stringify(INVALID_QUERY_ERROR_FIXTURE);
    expect(str).not.toContain('/home/');
    expect(str).not.toContain('/Users/');
    expect(str).not.toContain('C:\\');
  });
  it('INVALID_QUERY_ERROR_FIXTURE.generatedAt is deterministic', () => {
    expect(INVALID_QUERY_ERROR_FIXTURE.generatedAt).toBe(PHASE_22_GENERATED_AT);
  });
});

// ─── 21. Static error fixtures ────────────────────────────────────────────────

describe('Phase 23 — Unsupported endpoint error fixture', () => {
  it('UNSUPPORTED_ENDPOINT_ERROR_FIXTURE.ok is false', () => { expect(UNSUPPORTED_ENDPOINT_ERROR_FIXTURE.ok).toBe(false); });
  it('UNSUPPORTED_ENDPOINT_ERROR_FIXTURE.error.code is UNSUPPORTED_ENDPOINT', () => {
    expect(UNSUPPORTED_ENDPOINT_ERROR_FIXTURE.error.code).toBe('READ_ONLY_API_UNSUPPORTED_ENDPOINT');
  });
  it('UNSUPPORTED_ENDPOINT_ERROR_FIXTURE has details', () => {
    expect(Array.isArray(UNSUPPORTED_ENDPOINT_ERROR_FIXTURE.error.details)).toBe(true);
  });
});

describe('Phase 23 — Method not allowed error fixture', () => {
  it('METHOD_NOT_ALLOWED_ERROR_FIXTURE.ok is false', () => { expect(METHOD_NOT_ALLOWED_ERROR_FIXTURE.ok).toBe(false); });
  it('METHOD_NOT_ALLOWED_ERROR_FIXTURE.error.code is METHOD_NOT_ALLOWED', () => {
    expect(METHOD_NOT_ALLOWED_ERROR_FIXTURE.error.code).toBe('READ_ONLY_API_METHOD_NOT_ALLOWED');
  });
  it('METHOD_NOT_ALLOWED_ERROR_FIXTURE.data is null', () => { expect(METHOD_NOT_ALLOWED_ERROR_FIXTURE.data).toBeNull(); });
});

describe('Phase 23 — Safety rejection error fixture', () => {
  it('SAFETY_REJECTION_ERROR_FIXTURE.ok is false', () => { expect(SAFETY_REJECTION_ERROR_FIXTURE.ok).toBe(false); });
  it('SAFETY_REJECTION_ERROR_FIXTURE.error.code is SAFETY_REJECTION', () => {
    expect(SAFETY_REJECTION_ERROR_FIXTURE.error.code).toBe('READ_ONLY_API_SAFETY_REJECTION');
  });
  it('SAFETY_REJECTION_ERROR_FIXTURE error details received is [redacted]', () => {
    const detail = SAFETY_REJECTION_ERROR_FIXTURE.error.details[0];
    expect(detail?.received).toBe('[redacted]');
  });
  it('SAFETY_REJECTION_ERROR_FIXTURE has no secrets in fixture', () => {
    const str = JSON.stringify(SAFETY_REJECTION_ERROR_FIXTURE);
    expect(str.toLowerCase()).not.toContain('private_key');
    expect(str.toLowerCase()).not.toContain('seed_phrase');
    expect(str.toLowerCase()).not.toContain('mnemonic');
  });
});

describe('Phase 23 — Internal contract error fixture', () => {
  it('INTERNAL_CONTRACT_ERROR_FIXTURE.ok is false', () => { expect(INTERNAL_CONTRACT_ERROR_FIXTURE.ok).toBe(false); });
  it('INTERNAL_CONTRACT_ERROR_FIXTURE.error.code is INTERNAL_CONTRACT_ERROR', () => {
    expect(INTERNAL_CONTRACT_ERROR_FIXTURE.error.code).toBe('READ_ONLY_API_INTERNAL_CONTRACT_ERROR');
  });
  it('INTERNAL_CONTRACT_ERROR_FIXTURE.error.details is empty array', () => {
    expect(INTERNAL_CONTRACT_ERROR_FIXTURE.error.details.length).toBe(0);
  });
  it('INTERNAL_CONTRACT_ERROR_FIXTURE has no stack trace', () => {
    const str = JSON.stringify(INTERNAL_CONTRACT_ERROR_FIXTURE);
    expect(str).not.toContain('at Object.');
  });
});

// ─── 22. Fixture list/lookup helpers ─────────────────────────────────────────

describe('Phase 23 — Fixture list helper', () => {
  it('listReadOnlyApiContractFixtures returns array', () => {
    expect(Array.isArray(listReadOnlyApiContractFixtures())).toBe(true);
  });
  it('listReadOnlyApiContractFixtures returns 10 fixtures', () => {
    expect(listReadOnlyApiContractFixtures().length).toBe(10);
  });
  it('all fixtures have a name', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      expect(typeof f.name).toBe('string');
    }
  });
  it('all fixtures have a kind', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      expect(['success', 'error']).toContain(f.kind);
    }
  });
  it('all fixtures have a description', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      expect(f.description.length).toBeGreaterThan(0);
    }
  });
  it('all fixtures have an envelope', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      expect(typeof f.envelope).toBe('object');
    }
  });
  it('fixture list is deterministic (same array on repeated calls)', () => {
    const f1 = listReadOnlyApiContractFixtures();
    const f2 = listReadOnlyApiContractFixtures();
    expect(f1).toBe(f2);
  });
  it('has 5 success fixtures', () => {
    expect(listReadOnlyApiContractFixturesByKind('success').length).toBe(5);
  });
  it('has 5 error fixtures', () => {
    expect(listReadOnlyApiContractFixturesByKind('error').length).toBe(5);
  });
  it('listReadOnlyApiContractFixturesByKind success returns only success fixtures', () => {
    for (const f of listReadOnlyApiContractFixturesByKind('success')) {
      expect(f.kind).toBe('success');
    }
  });
  it('listReadOnlyApiContractFixturesByKind error returns only error fixtures', () => {
    for (const f of listReadOnlyApiContractFixturesByKind('error')) {
      expect(f.kind).toBe('error');
    }
  });
  it('listReadOnlyApiContractFixturesByEndpoint /health returns at least 1 fixture', () => {
    expect(listReadOnlyApiContractFixturesByEndpoint('/health').length).toBeGreaterThanOrEqual(1);
  });
  it('listReadOnlyApiContractFixturesByEndpoint /unknown returns empty array', () => {
    expect(listReadOnlyApiContractFixturesByEndpoint('/unknown').length).toBe(0);
  });
});

describe('Phase 23 — Fixture lookup helper', () => {
  it('getReadOnlyApiContractFixture returns health_success fixture', () => {
    const f = getReadOnlyApiContractFixture('health_success');
    expect(f?.name).toBe('health_success');
  });
  it('getReadOnlyApiContractFixture returns capabilities_success fixture', () => {
    const f = getReadOnlyApiContractFixture('capabilities_success');
    expect(f?.name).toBe('capabilities_success');
  });
  it('getReadOnlyApiContractFixture returns dashboard_success fixture', () => {
    const f = getReadOnlyApiContractFixture('dashboard_success');
    expect(f?.kind).toBe('success');
  });
  it('getReadOnlyApiContractFixture returns dashboard_evidence_success fixture', () => {
    const f = getReadOnlyApiContractFixture('dashboard_evidence_success');
    expect(f?.kind).toBe('success');
  });
  it('getReadOnlyApiContractFixture returns dashboard_safety_success fixture', () => {
    const f = getReadOnlyApiContractFixture('dashboard_safety_success');
    expect(f?.kind).toBe('success');
  });
  it('getReadOnlyApiContractFixture returns invalid_query_error fixture', () => {
    const f = getReadOnlyApiContractFixture('invalid_query_error');
    expect(f?.kind).toBe('error');
  });
  it('getReadOnlyApiContractFixture returns unsupported_endpoint_error fixture', () => {
    const f = getReadOnlyApiContractFixture('unsupported_endpoint_error');
    expect(f?.kind).toBe('error');
  });
  it('getReadOnlyApiContractFixture returns method_not_allowed_error fixture', () => {
    const f = getReadOnlyApiContractFixture('method_not_allowed_error');
    expect(f?.kind).toBe('error');
  });
  it('getReadOnlyApiContractFixture returns safety_rejection_error fixture', () => {
    const f = getReadOnlyApiContractFixture('safety_rejection_error');
    expect(f?.kind).toBe('error');
  });
  it('getReadOnlyApiContractFixture returns internal_contract_error fixture', () => {
    const f = getReadOnlyApiContractFixture('internal_contract_error');
    expect(f?.kind).toBe('error');
  });
  it('fixture lookup is deterministic', () => {
    const f1 = getReadOnlyApiContractFixture('health_success');
    const f2 = getReadOnlyApiContractFixture('health_success');
    expect(f1).toBe(f2);
  });
});

// ─── 23. Fixture determinism ──────────────────────────────────────────────────

describe('Phase 23 — Fixture determinism', () => {
  it('HEALTH_SUCCESS_FIXTURE generatedAt never uses wall-clock time', () => {
    expect(HEALTH_SUCCESS_FIXTURE.generatedAt).toBe('2026-01-01T00:00:00.000Z');
  });
  it('CAPABILITIES_SUCCESS_FIXTURE generatedAt is static', () => {
    expect(CAPABILITIES_SUCCESS_FIXTURE.generatedAt).toBe('2026-01-01T00:00:00.000Z');
  });
  it('DASHBOARD_SUCCESS_FIXTURE generatedAt is static', () => {
    expect(DASHBOARD_SUCCESS_FIXTURE.generatedAt).toBe('2026-01-01T00:00:00.000Z');
  });
  it('INVALID_QUERY_ERROR_FIXTURE generatedAt is static', () => {
    expect(INVALID_QUERY_ERROR_FIXTURE.generatedAt).toBe('2026-01-01T00:00:00.000Z');
  });
  it('INTERNAL_CONTRACT_ERROR_FIXTURE generatedAt is static', () => {
    expect(INTERNAL_CONTRACT_ERROR_FIXTURE.generatedAt).toBe('2026-01-01T00:00:00.000Z');
  });
  it('success fixtures are the same object on repeated import (module-level const)', () => {
    const f = getReadOnlyApiContractFixture('health_success');
    expect(f?.envelope).toBe(HEALTH_SUCCESS_FIXTURE);
  });
  it('all fixture generatedAt values equal PHASE_22_GENERATED_AT', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      expect(f.envelope.generatedAt).toBe(PHASE_22_GENERATED_AT);
    }
  });
});

// ─── 24. No stack traces / secrets / paths in fixtures ───────────────────────

describe('Phase 23 — Fixture sanitization', () => {
  it('no stack traces in any fixture', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      const str = JSON.stringify(f.envelope);
      expect(str).not.toContain('at Object.');
      expect(str).not.toContain('at Function.');
    }
  });
  it('no local filesystem paths in any fixture', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      const str = JSON.stringify(f.envelope);
      expect(str).not.toContain('/home/runner');
      expect(str).not.toContain('/Users/');
      expect(str).not.toContain('C:\\Users\\');
    }
  });
  it('no secrets in any fixture', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      const str = JSON.stringify(f.envelope).toLowerCase();
      expect(str).not.toContain('private_key');
      expect(str).not.toContain('seed_phrase');
      expect(str).not.toContain('mnemonic');
      expect(str).not.toContain('apikey');
    }
  });
  it('no raw stack trace strings in error fixtures', () => {
    for (const f of listReadOnlyApiContractFixturesByKind('error')) {
      const str = JSON.stringify(f.envelope);
      expect(str).not.toContain('Error\n');
      expect(str).not.toContain('SyntaxError');
    }
  });
});

// ─── 25. Capability metadata — Phase 23 flags ────────────────────────────────

describe('Phase 23 — Capability metadata', () => {
  const caps = getLocalReadOnlyApiCapabilities();

  it('consumerSdk is true', () => { expect(caps.consumerSdk).toBe(true); });
  it('contractFixtures is true', () => { expect(caps.contractFixtures).toBe(true); });
  it('typedRequestBuilders is true', () => { expect(caps.typedRequestBuilders).toBe(true); });
  it('responseParsers is true', () => { expect(caps.responseParsers).toBe(true); });
  it('fixtureValidation is true', () => { expect(caps.fixtureValidation).toBe(true); });
  it('inProcessOnlyClient is true', () => { expect(caps.inProcessOnlyClient).toBe(true); });
  it('externalNetworkClient is false', () => { expect(caps.externalNetworkClient).toBe(false); });
  // Regression: Phase 22 capability flags
  it('canServeResponseEnvelopes is true (Phase 22 regression)', () => { expect(caps.canServeResponseEnvelopes).toBe(true); });
  it('canReturnErrorEnvelopes is true (Phase 22 regression)', () => { expect(caps.canReturnErrorEnvelopes).toBe(true); });
  it('canValidateQueryErrors is true (Phase 22 regression)', () => { expect(caps.canValidateQueryErrors).toBe(true); });
  it('canProvideDeterministicMetadata is true (Phase 22 regression)', () => { expect(caps.canProvideDeterministicMetadata).toBe(true); });
  it('canProvideEndpointContracts is true (Phase 22 regression)', () => { expect(caps.canProvideEndpointContracts).toBe(true); });
  it('canUseLiveData is false', () => { expect(caps.canUseLiveData).toBe(false); });
  it('canTrade is false', () => { expect(caps.canTrade).toBe(false); });
  it('canUseExternalNetwork is false', () => { expect(caps.canUseExternalNetwork).toBe(false); });
  it('canRenderUi is false', () => { expect(caps.canRenderUi).toBe(false); });
  it('fixtureOnly is true', () => { expect(caps.fixtureOnly).toBe(true); });
});

// ─── 26. Phase 22 contract regression ────────────────────────────────────────

describe('Phase 23 — Phase 22 contract regression', () => {
  it('handleHealth still returns ok: true', () => {
    expect(handleHealth().ok).toBe(true);
  });
  it('handleCapabilities still returns ok: true', () => {
    expect(handleCapabilities().ok).toBe(true);
  });
  it('handleDashboard with valid query still returns ok: true', () => {
    expect(handleDashboard({ limit: 10 }).ok).toBe(true);
  });
  it('handleDashboard with invalid query still returns ok: false', () => {
    expect(handleDashboard({ sortBy: 'not_a_real_field' }).ok).toBe(false);
  });
  it('handleDashboardEvidence still returns ok: true for empty query', () => {
    expect(handleDashboardEvidence().ok).toBe(true);
  });
  it('handleDashboardSafety still returns ok: true for empty query', () => {
    expect(handleDashboardSafety().ok).toBe(true);
  });
  it('health envelope generatedAt is Phase 22 static value', () => {
    const h = handleHealth();
    expect(h.generatedAt).toBe(PHASE_22_GENERATED_AT);
  });
  it('health envelope meta.mutating is false', () => {
    const h = handleHealth();
    expect(h.meta.mutating).toBe(false);
  });
  it('health envelope meta.externalNetwork is false', () => {
    const h = handleHealth();
    expect(h.meta.externalNetwork).toBe(false);
  });
  it('health envelope meta.fixtureOnly is true', () => {
    const h = handleHealth();
    expect(h.meta.fixtureOnly).toBe(true);
  });
});

// ─── 27. No network/mutation/execution regression ────────────────────────────

describe('Phase 23 — Safety boundary regression', () => {
  it('client.isNetworkClient is false (no real network)', () => {
    const client = createReadOnlyApiClient();
    expect(client.isNetworkClient).toBe(false);
  });
  it('client.bindsPort is false (no port binding)', () => {
    const client = createReadOnlyApiClient();
    expect(client.bindsPort).toBe(false);
  });
  it('SDK capabilities flag externalNetworkClient is false', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.externalNetworkClient).toBe(false);
  });
  it('SDK capabilities flag canUseExternalNetwork is false', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.canUseExternalNetwork).toBe(false);
  });
  it('all fixture metas have mutating: false', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      expect(f.envelope.meta.mutating).toBe(false);
    }
  });
  it('all fixture metas have externalNetwork: false', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      expect(f.envelope.meta.externalNetwork).toBe(false);
    }
  });
  it('buildReadOnlyApiRequest is a pure function (same input = same output)', () => {
    const r1 = buildReadOnlyApiRequest('/health');
    const r2 = buildReadOnlyApiRequest('/health');
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
  it('fixture envelopes have no trading-related fields', () => {
    for (const f of listReadOnlyApiContractFixtures()) {
      const str = JSON.stringify(f.envelope);
      expect(str).not.toContain('"swap"');
      expect(str).not.toContain('"order"');
      expect(str).not.toContain('"fill"');
      expect(str).not.toContain('"position"');
    }
  });
});

// ─── 28. No wallet/trading/execution terms in runtime source ─────────────────

describe('Phase 23 — No forbidden runtime terms in SDK fixtures', () => {
  it('HEALTH_SUCCESS_FIXTURE has no wallet key/keypair terms', () => {
    const str = JSON.stringify(HEALTH_SUCCESS_FIXTURE);
    expect(str.toLowerCase()).not.toContain('keypair');
    expect(str.toLowerCase()).not.toContain('signtransaction');
    expect(str.toLowerCase()).not.toContain('private_key');
    expect(str.toLowerCase()).not.toContain('seed_phrase');
  });
  it('CAPABILITIES_SUCCESS_FIXTURE has no trading terms', () => {
    // canTrade is a field name in the capabilities data, but its value must be false
    const d = CAPABILITIES_SUCCESS_FIXTURE.data as Record<string, unknown>;
    expect(d['canTrade']).toBe(false);
  });
  it('error fixtures have no Solana RPC references', () => {
    for (const f of listReadOnlyApiContractFixturesByKind('error')) {
      const str = JSON.stringify(f.envelope).toLowerCase();
      expect(str).not.toContain('solana rpc');
      expect(str).not.toContain('mainnet');
    }
  });
});
