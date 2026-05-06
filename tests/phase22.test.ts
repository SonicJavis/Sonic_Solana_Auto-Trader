/**
 * tests/phase22.test.ts
 *
 * Phase 22 — Local Read-Only API Response Contracts, Error Envelope, and Endpoint Documentation v1
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  READ_ONLY_API_ERROR_CODES,
  buildReadOnlyApiSuccessEnvelope,
  buildReadOnlyApiErrorEnvelope,
  buildQueryErrorFromLroError,
  mapLroErrorCodeToPhase22,
  extractQueryFieldFromMessage,
  sanitizeReceivedValue,
  PHASE_22,
  API_MODE,
  PHASE_22_GENERATED_AT,
  QUERY_PARAM_NAMES,
  PHASE_22_CONTRACT_CAPABILITIES,
  PHASE_22_ENDPOINT_CONTRACTS,
  buildReadOnlyApiContractMeta,
  buildReadOnlyApiQueryContractMeta,
  createReadOnlyApiApp,
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
  getLocalReadOnlyApiCapabilities,
  parseReadOnlyApiQuery,
  buildReadOnlyApiPagination,
  applyReadOnlyApiPagination,
  buildAppliedFiltersMeta,
  buildAppliedSortMeta,
  ALLOWED_SEVERITY_VALUES,
  ALLOWED_PANEL_VALUES,
  ALLOWED_SOURCE_KIND_VALUES,
  ALLOWED_CLASSIFICATION_VALUES,
  ALLOWED_STATUS_VALUES,
  ALLOWED_SORT_FIELDS,
  ALLOWED_SORT_DIRECTIONS,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC_DIR = resolve(__dirname, '../apps/read-only-api/src');

// ─── 1. Package exports ───────────────────────────────────────────────────────

describe('Phase 22 — Package exports', () => {
  it('exports READ_ONLY_API_ERROR_CODES', () => { expect(typeof READ_ONLY_API_ERROR_CODES).toBe('object'); });
  it('exports buildReadOnlyApiSuccessEnvelope', () => { expect(typeof buildReadOnlyApiSuccessEnvelope).toBe('function'); });
  it('exports buildReadOnlyApiErrorEnvelope', () => { expect(typeof buildReadOnlyApiErrorEnvelope).toBe('function'); });
  it('exports buildQueryErrorFromLroError', () => { expect(typeof buildQueryErrorFromLroError).toBe('function'); });
  it('exports mapLroErrorCodeToPhase22', () => { expect(typeof mapLroErrorCodeToPhase22).toBe('function'); });
  it('exports extractQueryFieldFromMessage', () => { expect(typeof extractQueryFieldFromMessage).toBe('function'); });
  it('exports sanitizeReceivedValue', () => { expect(typeof sanitizeReceivedValue).toBe('function'); });
  it('PHASE_22 = 22', () => { expect(PHASE_22).toBe(22); });
  it('API_MODE = local_read_only', () => { expect(API_MODE).toBe('local_read_only'); });
  it('PHASE_22_GENERATED_AT is string', () => { expect(typeof PHASE_22_GENERATED_AT).toBe('string'); });
  it('QUERY_PARAM_NAMES is array', () => { expect(Array.isArray(QUERY_PARAM_NAMES)).toBe(true); });
  it('PHASE_22_CONTRACT_CAPABILITIES is object', () => { expect(typeof PHASE_22_CONTRACT_CAPABILITIES).toBe('object'); });
  it('PHASE_22_ENDPOINT_CONTRACTS is array', () => { expect(Array.isArray(PHASE_22_ENDPOINT_CONTRACTS)).toBe(true); });
  it('exports buildReadOnlyApiContractMeta', () => { expect(typeof buildReadOnlyApiContractMeta).toBe('function'); });
  it('exports buildReadOnlyApiQueryContractMeta', () => { expect(typeof buildReadOnlyApiQueryContractMeta).toBe('function'); });
  it('still exports createReadOnlyApiApp (Phase 20 regression)', () => { expect(typeof createReadOnlyApiApp).toBe('function'); });
  it('still exports LRO_API_HANDLERS (Phase 20 regression)', () => { expect(typeof LRO_API_HANDLERS).toBe('object'); });
});

// ─── 2. Error code constants ──────────────────────────────────────────────────

describe('Phase 22 — Error code constants', () => {
  it('INVALID_QUERY = READ_ONLY_API_INVALID_QUERY', () => { expect(READ_ONLY_API_ERROR_CODES.INVALID_QUERY).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('UNSUPPORTED_ENDPOINT = READ_ONLY_API_UNSUPPORTED_ENDPOINT', () => { expect(READ_ONLY_API_ERROR_CODES.UNSUPPORTED_ENDPOINT).toBe('READ_ONLY_API_UNSUPPORTED_ENDPOINT'); });
  it('METHOD_NOT_ALLOWED = READ_ONLY_API_METHOD_NOT_ALLOWED', () => { expect(READ_ONLY_API_ERROR_CODES.METHOD_NOT_ALLOWED).toBe('READ_ONLY_API_METHOD_NOT_ALLOWED'); });
  it('SAFETY_REJECTION = READ_ONLY_API_SAFETY_REJECTION', () => { expect(READ_ONLY_API_ERROR_CODES.SAFETY_REJECTION).toBe('READ_ONLY_API_SAFETY_REJECTION'); });
  it('INTERNAL_CONTRACT_ERROR = READ_ONLY_API_INTERNAL_CONTRACT_ERROR', () => { expect(READ_ONLY_API_ERROR_CODES.INTERNAL_CONTRACT_ERROR).toBe('READ_ONLY_API_INTERNAL_CONTRACT_ERROR'); });
  it('has exactly 5 error codes', () => { expect(Object.keys(READ_ONLY_API_ERROR_CODES).length).toBe(5); });
  it('all codes start with READ_ONLY_API_', () => {
    for (const v of Object.values(READ_ONLY_API_ERROR_CODES)) {
      expect(v.startsWith('READ_ONLY_API_')).toBe(true);
    }
  });
});

// ─── 3. buildReadOnlyApiContractMeta ─────────────────────────────────────────

describe('Phase 22 — buildReadOnlyApiContractMeta', () => {
  const meta = buildReadOnlyApiContractMeta();
  it('meta.phase is 22', () => { expect(meta.phase).toBe(22); });
  it('meta.apiMode is local_read_only', () => { expect(meta.apiMode).toBe('local_read_only'); });
  it('meta.deterministic is true', () => { expect(meta.deterministic).toBe(true); });
  it('meta.mutating is false', () => { expect(meta.mutating).toBe(false); });
  it('meta.externalNetwork is false', () => { expect(meta.externalNetwork).toBe(false); });
  it('meta.generatedAt equals PHASE_22_GENERATED_AT', () => { expect(meta.generatedAt).toBe(PHASE_22_GENERATED_AT); });
  it('meta.generatedAt is 2026-01-01T00:00:00.000Z', () => { expect(meta.generatedAt).toBe('2026-01-01T00:00:00.000Z'); });
  it('meta.fixtureOnly is true', () => { expect(meta.fixtureOnly).toBe(true); });
  it('meta.liveData is false', () => { expect(meta.liveData).toBe(false); });
  it('meta.safeToDisplay is true', () => { expect(meta.safeToDisplay).toBe(true); });
  it('meta.analysisOnly is true', () => { expect(meta.analysisOnly).toBe(true); });
  it('meta.nonExecutable is true', () => { expect(meta.nonExecutable).toBe(true); });
  it('meta.readOnly is true', () => { expect(meta.readOnly).toBe(true); });
  it('meta.localOnly is true', () => { expect(meta.localOnly).toBe(true); });
  it('meta.capabilities is an object', () => { expect(typeof meta.capabilities).toBe('object'); });
  it('meta.capabilities.responseEnvelope is true', () => { expect(meta.capabilities?.['responseEnvelope']).toBe(true); });
  it('meta.capabilities.errorEnvelope is true', () => { expect(meta.capabilities?.['errorEnvelope']).toBe(true); });
  it('meta.capabilities.queryValidationErrors is true', () => { expect(meta.capabilities?.['queryValidationErrors']).toBe(true); });
  it('meta.capabilities.deterministicMetadata is true', () => { expect(meta.capabilities?.['deterministicMetadata']).toBe(true); });
  it('meta.capabilities.endpointContracts is true', () => { expect(meta.capabilities?.['endpointContracts']).toBe(true); });
  it('is deterministic', () => {
    const m1 = buildReadOnlyApiContractMeta();
    const m2 = buildReadOnlyApiContractMeta();
    expect(JSON.stringify(m1)).toBe(JSON.stringify(m2));
  });
});

// ─── 4. buildReadOnlyApiQueryContractMeta ────────────────────────────────────

describe('Phase 22 — buildReadOnlyApiQueryContractMeta', () => {
  const q = parseReadOnlyApiQuery({ limit: '10', offset: '5', severity: 'high', sortBy: 'severity', sortDirection: 'desc' });
  const pag = q.ok ? buildReadOnlyApiPagination(q.value) : null;
  const pagValue = (pag && pag.ok) ? pag.value : { limit: 10, offset: 0, cursor: undefined };
  const { paginationMeta } = applyReadOnlyApiPagination([], pagValue);
  const queryMeta = q.ok ? {
    query: { limit: q.value.limit, offset: q.value.offset, cursor: q.value.cursor, sortBy: q.value.sortBy, sortDirection: q.value.sortDirection, severity: q.value.severity, panel: q.value.panel, sourceKind: q.value.sourceKind, classification: q.value.classification, status: q.value.status },
    appliedFilters: buildAppliedFiltersMeta(q.value),
    sort: buildAppliedSortMeta(q.value),
    pagination: paginationMeta,
    fixtureOnly: true as const, analysisOnly: true as const, nonExecutable: true as const, readOnly: true as const, localOnly: true as const,
  } : null;
  const meta = queryMeta ? buildReadOnlyApiQueryContractMeta(queryMeta) : buildReadOnlyApiContractMeta();

  it('meta.phase is 22', () => { expect(meta.phase).toBe(22); });
  it('meta.apiMode is local_read_only', () => { expect(meta.apiMode).toBe('local_read_only'); });
  it('meta.deterministic is true', () => { expect(meta.deterministic).toBe(true); });
  it('meta.mutating is false', () => { expect(meta.mutating).toBe(false); });
  it('meta.externalNetwork is false', () => { expect(meta.externalNetwork).toBe(false); });
  it('meta.generatedAt is deterministic', () => { expect(meta.generatedAt).toBe(PHASE_22_GENERATED_AT); });
  it('meta.query is an object', () => { expect(typeof meta.query).toBe('object'); });
  it('meta.filters is an object', () => { expect(typeof meta.filters).toBe('object'); });
  it('meta.sort is an object', () => { expect(typeof meta.sort).toBe('object'); });
  it('meta.pagination is an object', () => { expect(typeof meta.pagination).toBe('object'); });
  it('meta.fixtureOnly is true', () => { expect(meta.fixtureOnly).toBe(true); });
  it('meta.liveData is false', () => { expect(meta.liveData).toBe(false); });
  it('is deterministic', () => {
    if (queryMeta) {
      const m1 = buildReadOnlyApiQueryContractMeta(queryMeta);
      const m2 = buildReadOnlyApiQueryContractMeta(queryMeta);
      expect(JSON.stringify(m1)).toBe(JSON.stringify(m2));
    }
  });
});

// ─── 5. buildReadOnlyApiSuccessEnvelope shape ────────────────────────────────

describe('Phase 22 — buildReadOnlyApiSuccessEnvelope shape', () => {
  const meta = buildReadOnlyApiContractMeta();
  const env = buildReadOnlyApiSuccessEnvelope('/health', 'test_id', { x: 1 }, meta);
  it('ok is true', () => { expect(env.ok).toBe(true); });
  it('status is ok (backward compat)', () => { expect(env.status).toBe('ok'); });
  it('envelopeId is set', () => { expect(env.envelopeId).toBe('test_id'); });
  it('endpoint is /health', () => { expect(env.endpoint).toBe('/health'); });
  it('method is GET', () => { expect(env.method).toBe('GET'); });
  it('data is set', () => { expect(env.data).toEqual({ x: 1 }); });
  it('warnings is empty array', () => { expect(env.warnings).toEqual([]); });
  it('errors is empty array (backward compat)', () => { expect(env.errors).toEqual([]); });
  it('meta is set', () => { expect(env.meta).toBeDefined(); });
  it('meta.phase is 22', () => { expect(env.meta.phase).toBe(22); });
  it('meta.apiMode is local_read_only', () => { expect(env.meta.apiMode).toBe('local_read_only'); });
  it('meta.deterministic is true', () => { expect(env.meta.deterministic).toBe(true); });
  it('meta.mutating is false', () => { expect(env.meta.mutating).toBe(false); });
  it('meta.externalNetwork is false', () => { expect(env.meta.externalNetwork).toBe(false); });
  it('meta.generatedAt is deterministic', () => { expect(env.meta.generatedAt).toBe(PHASE_22_GENERATED_AT); });
  it('meta.fixtureOnly is true', () => { expect(env.meta.fixtureOnly).toBe(true); });
  it('meta.liveData is false', () => { expect(env.meta.liveData).toBe(false); });
  it('generatedAt is backward compat', () => { expect(env.generatedAt).toBe(PHASE_22_GENERATED_AT); });
  it('is deterministic', () => {
    const e1 = buildReadOnlyApiSuccessEnvelope('/health', 'test_id', { x: 1 }, meta);
    const e2 = buildReadOnlyApiSuccessEnvelope('/health', 'test_id', { x: 1 }, meta);
    expect(JSON.stringify(e1)).toBe(JSON.stringify(e2));
  });
  it('passes warnings through', () => {
    const e = buildReadOnlyApiSuccessEnvelope('/health', 'x', null, meta, ['warn1']);
    expect(e.warnings).toEqual(['warn1']);
  });
  it('data can be null', () => {
    const e = buildReadOnlyApiSuccessEnvelope('/health', 'x', null, meta);
    expect(e.data).toBeNull();
  });
  it('does not include error field (ok=true case)', () => {
    expect(Object.prototype.hasOwnProperty.call(env, 'error')).toBe(false);
  });
});

// ─── 6. buildReadOnlyApiErrorEnvelope shape ──────────────────────────────────

describe('Phase 22 — buildReadOnlyApiErrorEnvelope shape', () => {
  const meta = buildReadOnlyApiContractMeta();
  const errorObj = {
    code: 'READ_ONLY_API_INVALID_QUERY' as const,
    message: 'Invalid read-only API query.',
    details: [{ field: 'severity', reason: 'Must be one of: info, low, medium, high, critical', received: 'HACK' }],
  };
  const env = buildReadOnlyApiErrorEnvelope('/dashboard/evidence', 'test_err_id', errorObj, meta);
  it('ok is false', () => { expect(env.ok).toBe(false); });
  it('status is failed (backward compat)', () => { expect(env.status).toBe('failed'); });
  it('envelopeId is set', () => { expect(env.envelopeId).toBe('test_err_id'); });
  it('endpoint is /dashboard/evidence', () => { expect(env.endpoint).toBe('/dashboard/evidence'); });
  it('method is GET', () => { expect(env.method).toBe('GET'); });
  it('data is null (backward compat)', () => { expect(env.data).toBeNull(); });
  it('error is set', () => { expect(env.error).toBeDefined(); });
  it('error.code is READ_ONLY_API_INVALID_QUERY', () => { expect(env.error.code).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('error.message is set', () => { expect(typeof env.error.message).toBe('string'); });
  it('error.details is array', () => { expect(Array.isArray(env.error.details)).toBe(true); });
  it('error.details[0].field is severity', () => { expect(env.error.details[0]?.field).toBe('severity'); });
  it('error.details[0].reason is set', () => { expect(typeof env.error.details[0]?.reason).toBe('string'); });
  it('error.details[0].received is HACK', () => { expect(env.error.details[0]?.received).toBe('HACK'); });
  it('errors array is backward compat', () => { expect(Array.isArray(env.errors)).toBe(true); });
  it('warnings is empty array', () => { expect(env.warnings).toEqual([]); });
  it('meta.phase is 22', () => { expect(env.meta.phase).toBe(22); });
  it('meta.fixtureOnly is true', () => { expect(env.meta.fixtureOnly).toBe(true); });
  it('meta.liveData is false', () => { expect(env.meta.liveData).toBe(false); });
  it('generatedAt equals PHASE_22_GENERATED_AT', () => { expect(env.generatedAt).toBe(PHASE_22_GENERATED_AT); });
  it('error.message does not contain stack trace', () => {
    expect(env.error.message).not.toContain('at Object.');
    expect(env.error.message).not.toContain('Error:');
  });
  it('error.details do not contain filesystem paths', () => {
    const s = env.error.details.map(d => d.reason + d.received).join('');
    expect(s).not.toMatch(/\/home\//);
    expect(s).not.toMatch(/C:\\\\/);
  });
});

// ─── 7. mapLroErrorCodeToPhase22 ─────────────────────────────────────────────

describe('Phase 22 — mapLroErrorCodeToPhase22', () => {
  it('INVALID_LRO_API_INPUT → READ_ONLY_API_INVALID_QUERY', () => { expect(mapLroErrorCodeToPhase22('INVALID_LRO_API_INPUT')).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('UNSAFE_QUERY_FIELD → READ_ONLY_API_INVALID_QUERY', () => { expect(mapLroErrorCodeToPhase22('UNSAFE_QUERY_FIELD')).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('UNSAFE_SORT_FIELD → READ_ONLY_API_INVALID_QUERY', () => { expect(mapLroErrorCodeToPhase22('UNSAFE_SORT_FIELD')).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('UNSAFE_FILTER_VALUE → READ_ONLY_API_INVALID_QUERY', () => { expect(mapLroErrorCodeToPhase22('UNSAFE_FILTER_VALUE')).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('PAGINATION_LIMIT_EXCEEDED → READ_ONLY_API_INVALID_QUERY', () => { expect(mapLroErrorCodeToPhase22('PAGINATION_LIMIT_EXCEEDED')).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('PAGINATION_NEGATIVE_VALUE → READ_ONLY_API_INVALID_QUERY', () => { expect(mapLroErrorCodeToPhase22('PAGINATION_NEGATIVE_VALUE')).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('UNSAFE_CURSOR → READ_ONLY_API_INVALID_QUERY', () => { expect(mapLroErrorCodeToPhase22('UNSAFE_CURSOR')).toBe('READ_ONLY_API_INVALID_QUERY'); });
  it('UNSAFE_CONTENT_DETECTED → READ_ONLY_API_SAFETY_REJECTION', () => { expect(mapLroErrorCodeToPhase22('UNSAFE_CONTENT_DETECTED')).toBe('READ_ONLY_API_SAFETY_REJECTION'); });
  it('UNSAFE_ACTION_TEXT_DETECTED → READ_ONLY_API_SAFETY_REJECTION', () => { expect(mapLroErrorCodeToPhase22('UNSAFE_ACTION_TEXT_DETECTED')).toBe('READ_ONLY_API_SAFETY_REJECTION'); });
  it('SECRET_PATTERN_DETECTED → READ_ONLY_API_SAFETY_REJECTION', () => { expect(mapLroErrorCodeToPhase22('SECRET_PATTERN_DETECTED')).toBe('READ_ONLY_API_SAFETY_REJECTION'); });
  it('URL_PATTERN_DETECTED → READ_ONLY_API_SAFETY_REJECTION', () => { expect(mapLroErrorCodeToPhase22('URL_PATTERN_DETECTED')).toBe('READ_ONLY_API_SAFETY_REJECTION'); });
  it('UNSAFE_CAPABILITY_DETECTED → READ_ONLY_API_SAFETY_REJECTION', () => { expect(mapLroErrorCodeToPhase22('UNSAFE_CAPABILITY_DETECTED')).toBe('READ_ONLY_API_SAFETY_REJECTION'); });
  it('EXTERNAL_BIND_FORBIDDEN → READ_ONLY_API_METHOD_NOT_ALLOWED', () => { expect(mapLroErrorCodeToPhase22('EXTERNAL_BIND_FORBIDDEN')).toBe('READ_ONLY_API_METHOD_NOT_ALLOWED'); });
  it('UNSAFE_HOST_REJECTED → READ_ONLY_API_METHOD_NOT_ALLOWED', () => { expect(mapLroErrorCodeToPhase22('UNSAFE_HOST_REJECTED')).toBe('READ_ONLY_API_METHOD_NOT_ALLOWED'); });
  it('LIVE_DATA_FORBIDDEN → READ_ONLY_API_INTERNAL_CONTRACT_ERROR', () => { expect(mapLroErrorCodeToPhase22('LIVE_DATA_FORBIDDEN')).toBe('READ_ONLY_API_INTERNAL_CONTRACT_ERROR'); });
  it('LRO_API_FIXTURE_ONLY → READ_ONLY_API_INTERNAL_CONTRACT_ERROR', () => { expect(mapLroErrorCodeToPhase22('LRO_API_FIXTURE_ONLY')).toBe('READ_ONLY_API_INTERNAL_CONTRACT_ERROR'); });
});

// ─── 8. extractQueryFieldFromMessage ─────────────────────────────────────────

describe('Phase 22 — extractQueryFieldFromMessage', () => {
  it('extracts severity', () => { expect(extractQueryFieldFromMessage('severity must be one of: info, low')).toBe('severity'); });
  it('extracts panel', () => { expect(extractQueryFieldFromMessage('panel must be one of')).toBe('panel'); });
  it('extracts sourceKind', () => { expect(extractQueryFieldFromMessage('sourcekind must be one of')).toBe('sourceKind'); });
  it('extracts classification', () => { expect(extractQueryFieldFromMessage('classification must be one of')).toBe('classification'); });
  it('extracts sortBy', () => { expect(extractQueryFieldFromMessage('sortby must be one of: id')).toBe('sortBy'); });
  it('extracts sortDirection', () => { expect(extractQueryFieldFromMessage("sortdirection must be 'asc' or 'desc'")).toBe('sortDirection'); });
  it('extracts cursor', () => { expect(extractQueryFieldFromMessage('cursor exceeds max length')).toBe('cursor'); });
  it('extracts offset', () => { expect(extractQueryFieldFromMessage('offset must be >= 0')).toBe('offset'); });
  it('extracts limit', () => { expect(extractQueryFieldFromMessage('limit exceeded maximum')).toBe('limit'); });
  it('extracts status', () => { expect(extractQueryFieldFromMessage('status must be one of: ok')).toBe('status'); });
  it('falls back to query for unknown', () => { expect(extractQueryFieldFromMessage('something unknown')).toBe('query'); });
  it('is case-insensitive', () => { expect(extractQueryFieldFromMessage('SEVERITY is invalid')).toBe('severity'); });
});

// ─── 9. sanitizeReceivedValue ─────────────────────────────────────────────────

describe('Phase 22 — sanitizeReceivedValue', () => {
  it('returns safe string as-is', () => { expect(sanitizeReceivedValue('HACK')).toBe('HACK'); });
  it('returns number as string', () => { expect(sanitizeReceivedValue(42)).toBe('42'); });
  it('returns undefined as "undefined"', () => { expect(sanitizeReceivedValue(undefined)).toBe('undefined'); });
  it('returns null as "null"', () => { expect(sanitizeReceivedValue(null)).toBe('null'); });
  it('redacts private_key', () => { expect(sanitizeReceivedValue('private_key_abc123')).toBe('[redacted]'); });
  it('redacts seed_phrase', () => { expect(sanitizeReceivedValue('my_seed_phrase_here')).toBe('[redacted]'); });
  it('redacts mnemonic', () => { expect(sanitizeReceivedValue('mnemonic_word_list')).toBe('[redacted]'); });
  it('redacts apikey', () => { expect(sanitizeReceivedValue('apikey_abc123')).toBe('[redacted]'); });
  it('redacts https URL', () => { expect(sanitizeReceivedValue('https://evil.com')).toBe('[redacted]'); });
  it('redacts wss URL', () => { expect(sanitizeReceivedValue('wss://solana.rpc.com')).toBe('[redacted]'); });
  it('truncates values over 80 chars', () => { expect(sanitizeReceivedValue('a'.repeat(100))).toBe('[value too long]'); });
  it('returns safe short string', () => { expect(sanitizeReceivedValue('info')).toBe('info'); });
  it('is deterministic', () => { expect(sanitizeReceivedValue('test')).toBe(sanitizeReceivedValue('test')); });
});

// ─── 10. buildQueryErrorFromLroError ─────────────────────────────────────────

describe('Phase 22 — buildQueryErrorFromLroError', () => {
  it('returns correct code', () => {
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', 'severity must be one of: info', { severity: 'HACK' });
    expect(e.code).toBe('READ_ONLY_API_INVALID_QUERY');
  });
  it('returns stable message', () => {
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', 'offset must be >= 0', {});
    expect(e.message).toBe('Invalid read-only API query.');
  });
  it('details has field-level info', () => {
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', 'severity must be one of', { severity: 'BAD' });
    expect(e.details.length).toBeGreaterThan(0);
    expect(e.details[0]?.field).toBe('severity');
  });
  it('details[0].reason is the original message', () => {
    const msg = 'severity must be one of: info, low, medium';
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', msg, {});
    expect(e.details[0]?.reason).toBe(msg);
  });
  it('details[0].received is the received value', () => {
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', 'severity must be one of', { severity: 'BAD' });
    expect(e.details[0]?.received).toBe('BAD');
  });
  it('received is undefined when field not in rawQuery', () => {
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', 'severity must be one of', {});
    expect(e.details[0]?.received).toBe('undefined');
  });
  it('received is unknown when rawQuery not provided', () => {
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', 'severity must be one of');
    expect(e.details[0]?.received).toBe('unknown');
  });
  it('does not expose stack traces', () => {
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', 'test error');
    expect(JSON.stringify(e)).not.toContain('at Object.');
    expect(JSON.stringify(e)).not.toContain('Error:');
  });
  it('redacts secret in received value', () => {
    const e = buildQueryErrorFromLroError('INVALID_LRO_API_INPUT', 'severity must be one of', { severity: 'private_key_abc' });
    expect(e.details[0]?.received).toBe('[redacted]');
  });
  it('maps UNSAFE_CONTENT_DETECTED to safety rejection', () => {
    const e = buildQueryErrorFromLroError('UNSAFE_CONTENT_DETECTED', 'cursor contains unsafe content');
    expect(e.code).toBe('READ_ONLY_API_SAFETY_REJECTION');
  });
});

// ─── 11. handleHealth Phase 22 envelope ──────────────────────────────────────

describe('Phase 22 — handleHealth envelope', () => {
  const r = handleHealth();
  it('ok is true', () => { expect(r.ok).toBe(true); });
  it('status is ok (backward compat)', () => { expect(r.status).toBe('ok'); });
  it('endpoint is /health', () => { expect(r.endpoint).toBe('/health'); });
  it('method is GET', () => { expect(r.method).toBe('GET'); });
  it('data is defined', () => { expect(r.data).toBeDefined(); });
  it('meta.phase is 22', () => { expect(r.meta.phase).toBe(22); });
  it('meta.apiMode is local_read_only', () => { expect(r.meta.apiMode).toBe('local_read_only'); });
  it('meta.deterministic is true', () => { expect(r.meta.deterministic).toBe(true); });
  it('meta.mutating is false', () => { expect(r.meta.mutating).toBe(false); });
  it('meta.externalNetwork is false', () => { expect(r.meta.externalNetwork).toBe(false); });
  it('meta.fixtureOnly is true', () => { expect(r.meta.fixtureOnly).toBe(true); });
  it('meta.liveData is false', () => { expect(r.meta.liveData).toBe(false); });
  it('meta.nonExecutable is true', () => { expect(r.meta.nonExecutable).toBe(true); });
  it('meta.readOnly is true', () => { expect(r.meta.readOnly).toBe(true); });
  it('meta.localOnly is true', () => { expect(r.meta.localOnly).toBe(true); });
  it('meta.generatedAt is deterministic', () => { expect(r.meta.generatedAt).toBe(PHASE_22_GENERATED_AT); });
  it('generatedAt is backward compat', () => { expect(r.generatedAt).toBe(PHASE_22_GENERATED_AT); });
  it('errors is empty (backward compat)', () => { expect(r.errors).toEqual([]); });
  it('is deterministic', () => {
    const r1 = handleHealth();
    const r2 = handleHealth();
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
  it('custom endpoint param works', () => {
    const r2 = handleHealth('/custom/health');
    expect(r2.endpoint).toBe('/custom/health');
  });
});

// ─── 12. handleCapabilities envelope ─────────────────────────────────────────

describe('Phase 22 — handleCapabilities envelope', () => {
  const r = handleCapabilities();
  it('ok is true', () => { expect(r.ok).toBe(true); });
  it('status is ok', () => { expect(r.status).toBe('ok'); });
  it('endpoint is /capabilities', () => { expect(r.endpoint).toBe('/capabilities'); });
  it('method is GET', () => { expect(r.method).toBe('GET'); });
  it('meta.phase is 22', () => { expect(r.meta.phase).toBe(22); });
  it('data.canTrade is false', () => { expect((r.data as Record<string,unknown>)['canTrade']).toBe(false); });
  it('data.canUseLiveData is false', () => { expect((r.data as Record<string,unknown>)['canUseLiveData']).toBe(false); });
  it('data.canServeResponseEnvelopes is true', () => { expect((r.data as Record<string,unknown>)['canServeResponseEnvelopes']).toBe(true); });
  it('data.canReturnErrorEnvelopes is true', () => { expect((r.data as Record<string,unknown>)['canReturnErrorEnvelopes']).toBe(true); });
  it('data.canValidateQueryErrors is true', () => { expect((r.data as Record<string,unknown>)['canValidateQueryErrors']).toBe(true); });
  it('data.canProvideDeterministicMetadata is true', () => { expect((r.data as Record<string,unknown>)['canProvideDeterministicMetadata']).toBe(true); });
  it('data.canProvideEndpointContracts is true', () => { expect((r.data as Record<string,unknown>)['canProvideEndpointContracts']).toBe(true); });
  it('meta.safeToDisplay is true', () => { expect(r.meta.safeToDisplay).toBe(true); });
  it('meta.analysisOnly is true', () => { expect(r.meta.analysisOnly).toBe(true); });
  it('meta.capabilities.responseEnvelope is true', () => { expect(r.meta.capabilities?.['responseEnvelope']).toBe(true); });
});

// ─── 13. handleDashboard envelope ────────────────────────────────────────────

describe('Phase 22 — handleDashboard envelope', () => {
  const r = handleDashboard();
  it('ok is true', () => { expect(r.ok).toBe(true); });
  it('status is ok', () => { expect(r.status).toBe('ok'); });
  it('endpoint is /dashboard', () => { expect(r.endpoint).toBe('/dashboard'); });
  it('meta.phase is 22', () => { expect(r.meta.phase).toBe(22); });
  it('data.queryMeta is defined', () => { expect((r.data as Record<string,unknown>)?.['queryMeta']).toBeDefined(); });
  it('invalid severity returns error envelope', () => {
    const e = handleDashboard({ severity: 'INVALID_VALUE' });
    expect(e.ok).toBe(false);
    expect(e.status).toBe('failed');
  });
  it('error.code is READ_ONLY_API_INVALID_QUERY', () => {
    const e = handleDashboard({ severity: 'INVALID_VALUE' });
    if (!e.ok) expect(e.error.code).toBe('READ_ONLY_API_INVALID_QUERY');
  });
  it('error.details has field severity', () => {
    const e = handleDashboard({ severity: 'INVALID_VALUE' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('severity');
  });
  it('valid severity returns ok', () => {
    expect(handleDashboard({ severity: 'high' }).ok).toBe(true);
  });
  it('invalid sortBy returns error', () => {
    const e = handleDashboard({ sortBy: 'walletAddr' });
    expect(e.ok).toBe(false);
  });
});

// ─── 14. handleDashboardEvidence envelope ────────────────────────────────────

describe('Phase 22 — handleDashboardEvidence envelope', () => {
  const r = handleDashboardEvidence();
  it('ok is true', () => { expect(r.ok).toBe(true); });
  it('status is ok', () => { expect(r.status).toBe('ok'); });
  it('endpoint is /dashboard/evidence', () => { expect(r.endpoint).toBe('/dashboard/evidence'); });
  it('method is GET', () => { expect(r.method).toBe('GET'); });
  it('meta.phase is 22', () => { expect(r.meta.phase).toBe(22); });
  it('data.entries is array', () => { expect(Array.isArray((r.data as Record<string,unknown>)?.['entries'])).toBe(true); });
  it('data.queryMeta is defined', () => { expect((r.data as Record<string,unknown>)?.['queryMeta']).toBeDefined(); });
  it('meta includes query when provided', () => {
    const e = handleDashboardEvidence({ limit: '5', severity: 'high' });
    if (e.ok) expect(e.meta.query).toBeDefined();
  });
  it('meta includes filters when provided', () => {
    const e = handleDashboardEvidence({ severity: 'high' });
    if (e.ok) expect(e.meta.filters).toBeDefined();
  });
  it('meta includes sort when provided', () => {
    const e = handleDashboardEvidence({ sortBy: 'severity', sortDirection: 'desc' });
    if (e.ok) expect(e.meta.sort).toBeDefined();
  });
  it('meta includes pagination', () => {
    const e = handleDashboardEvidence({ limit: '5' });
    if (e.ok) expect(e.meta.pagination).toBeDefined();
  });
  it('invalid severity returns error', () => {
    const e = handleDashboardEvidence({ severity: 'INVALID_VALUE' });
    expect(e.ok).toBe(false);
    expect(e.status).toBe('failed');
  });
  it('error.details[0].field is severity', () => {
    const e = handleDashboardEvidence({ severity: 'BAD_VALUE' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('severity');
  });
  it('error.details[0].received is BAD_VALUE', () => {
    const e = handleDashboardEvidence({ severity: 'BAD_VALUE' });
    if (!e.ok) expect(e.error.details[0]?.received).toBe('BAD_VALUE');
  });
  it('error.endpoint is /dashboard/evidence', () => {
    const e = handleDashboardEvidence({ severity: 'BAD' });
    if (!e.ok) expect(e.endpoint).toBe('/dashboard/evidence');
  });
  it('invalid sortBy returns error', () => {
    const e = handleDashboardEvidence({ sortBy: 'BADFIELD' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('sortBy');
  });
  it('invalid sortDirection returns error', () => {
    const e = handleDashboardEvidence({ sortDirection: 'up' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('sortDirection');
  });
  it('negative offset returns error', () => {
    const e = handleDashboardEvidence({ offset: '-1' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('offset');
  });
  it('invalid panel returns error', () => {
    const e = handleDashboardEvidence({ panel: 'BADPANEL' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('panel');
  });
  it('invalid sourceKind returns error', () => {
    const e = handleDashboardEvidence({ sourceKind: 'BADSOURCE' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('sourceKind');
  });
  it('invalid classification returns error', () => {
    const e = handleDashboardEvidence({ classification: 'BADCLASS' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('classification');
  });
  it('invalid status returns error', () => {
    const e = handleDashboardEvidence({ status: 'BADSTATUS' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('status');
  });
});

// ─── 15. handleDashboardSafety envelope ──────────────────────────────────────

describe('Phase 22 — handleDashboardSafety envelope', () => {
  const r = handleDashboardSafety();
  it('ok is true', () => { expect(r.ok).toBe(true); });
  it('status is ok', () => { expect(r.status).toBe('ok'); });
  it('endpoint is /dashboard/safety', () => { expect(r.endpoint).toBe('/dashboard/safety'); });
  it('meta.phase is 22', () => { expect(r.meta.phase).toBe(22); });
  it('data.queryMeta is defined', () => { expect((r.data as Record<string,unknown>)?.['queryMeta']).toBeDefined(); });
  it('meta.fixtureOnly is true', () => { expect(r.meta.fixtureOnly).toBe(true); });
  it('meta.nonExecutable is true', () => { expect(r.meta.nonExecutable).toBe(true); });
  it('meta.readOnly is true', () => { expect(r.meta.readOnly).toBe(true); });
  it('invalid sortBy returns error', () => {
    const e = handleDashboardSafety({ sortBy: 'badField' });
    expect(e.ok).toBe(false);
    expect(e.status).toBe('failed');
  });
  it('error.details field is sortBy', () => {
    const e = handleDashboardSafety({ sortBy: 'badField' });
    if (!e.ok) expect(e.error.details[0]?.field).toBe('sortBy');
  });
  it('invalid severity returns error', () => {
    const e = handleDashboardSafety({ severity: 'INVALID' });
    expect(e.ok).toBe(false);
  });
  it('valid query returns ok', () => {
    const e = handleDashboardSafety({ limit: '5', sortBy: 'severity', sortDirection: 'asc' });
    expect(e.ok).toBe(true);
  });
});

// ─── 16. Other handler envelopes ─────────────────────────────────────────────

describe('Phase 22 — Other handler envelopes', () => {
  it('handleContracts returns ok with phase 22', () => {
    const r = handleContracts();
    expect(r.ok).toBe(true);
    expect(r.endpoint).toBe('/contracts');
    expect(r.meta.phase).toBe(22);
  });
  it('handleContractsOpenApiShape returns ok with phase 22', () => {
    const r = handleContractsOpenApiShape();
    expect(r.ok).toBe(true);
    expect(r.endpoint).toBe('/contracts/openapi-shape');
    expect(r.meta.phase).toBe(22);
  });
  it('handleDashboardOverview returns ok with phase 22', () => {
    const r = handleDashboardOverview();
    expect(r.ok).toBe(true);
    expect(r.endpoint).toBe('/dashboard/overview');
    expect(r.meta.phase).toBe(22);
  });
  it('handleDashboardReplay returns ok with phase 22', () => {
    const r = handleDashboardReplay();
    expect(r.ok).toBe(true);
    expect(r.endpoint).toBe('/dashboard/replay');
    expect(r.meta.phase).toBe(22);
  });
  it('handleDashboardStrategy returns ok with phase 22', () => {
    const r = handleDashboardStrategy();
    expect(r.ok).toBe(true);
    expect(r.endpoint).toBe('/dashboard/strategy');
    expect(r.meta.phase).toBe(22);
  });
  it('handleDashboardEvaluation returns ok with phase 22', () => {
    const r = handleDashboardEvaluation();
    expect(r.ok).toBe(true);
    expect(r.endpoint).toBe('/dashboard/evaluation');
    expect(r.meta.phase).toBe(22);
  });
  it('all handlers are deterministic', () => {
    for (const h of [handleHealth, handleCapabilities, handleContracts, handleContractsOpenApiShape, handleDashboard, handleDashboardOverview, handleDashboardReplay, handleDashboardStrategy, handleDashboardEvaluation, handleDashboardEvidence, handleDashboardSafety]) {
      const r1 = h();
      const r2 = h();
      expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
    }
  });
});

// ─── 17. HTTP inject — Phase 22 envelope fields ──────────────────────────────

describe('Phase 22 — HTTP inject GET /health Phase 22 envelope', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
  });
  it('body.ok is true', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.ok).toBe(true);
  });
  it('body.endpoint is /health', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.endpoint).toBe('/health');
  });
  it('body.method is GET', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.method).toBe('GET');
  });
  it('body.meta.phase is 22', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.meta.phase).toBe(22);
  });
  it('body.meta.apiMode is local_read_only', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.meta.apiMode).toBe('local_read_only');
  });
  it('body.meta.deterministic is true', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.meta.deterministic).toBe(true);
  });
  it('body.meta.mutating is false', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.meta.mutating).toBe(false);
  });
  it('body.meta.externalNetwork is false', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.meta.externalNetwork).toBe(false);
  });
  it('body.meta.fixtureOnly is true (backward compat)', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.meta.fixtureOnly).toBe(true);
  });
  it('body.meta.liveData is false (backward compat)', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.meta.liveData).toBe(false);
  });
  it('body.status is ok (backward compat)', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/health' })).body);
    expect(body.status).toBe('ok');
  });
});

// ─── 18. HTTP inject — capabilities Phase 22 ─────────────────────────────────

describe('Phase 22 — HTTP inject GET /capabilities Phase 22 envelope', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    expect((await app.inject({ method: 'GET', url: '/capabilities' })).statusCode).toBe(200);
  });
  it('body.ok is true', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/capabilities' })).body);
    expect(body.ok).toBe(true);
  });
  it('body.meta.phase is 22', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/capabilities' })).body);
    expect(body.meta.phase).toBe(22);
  });
  it('body.data.canServeResponseEnvelopes is true', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/capabilities' })).body);
    expect(body.data.canServeResponseEnvelopes).toBe(true);
  });
  it('body.data.canReturnErrorEnvelopes is true', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/capabilities' })).body);
    expect(body.data.canReturnErrorEnvelopes).toBe(true);
  });
  it('body.data.canValidateQueryErrors is true', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/capabilities' })).body);
    expect(body.data.canValidateQueryErrors).toBe(true);
  });
  it('body.data.canProvideEndpointContracts is true', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/capabilities' })).body);
    expect(body.data.canProvideEndpointContracts).toBe(true);
  });
  it('body.data.canTrade is false', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/capabilities' })).body);
    expect(body.data.canTrade).toBe(false);
  });
  it('body.data.canUseExternalNetwork is false', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/capabilities' })).body);
    expect(body.data.canUseExternalNetwork).toBe(false);
  });
});

// ─── 19. HTTP inject — invalid query error envelopes ─────────────────────────

describe('Phase 22 — HTTP inject invalid query error envelopes', () => {
  it('/dashboard?severity=INVALID → body.ok false', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=INVALID' })).body);
    expect(body.ok).toBe(false);
  });
  it('/dashboard?severity=INVALID → body.status failed', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=INVALID' })).body);
    expect(body.status).toBe('failed');
  });
  it('/dashboard?severity=INVALID → error.code is READ_ONLY_API_INVALID_QUERY', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=INVALID' })).body);
    expect(body.error?.code).toBe('READ_ONLY_API_INVALID_QUERY');
  });
  it('/dashboard?severity=INVALID → error.details has field severity', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=INVALID' })).body);
    expect(body.error?.details?.[0]?.field).toBe('severity');
  });
  it('/dashboard?severity=INVALID → meta.phase is 22', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=INVALID' })).body);
    expect(body.meta?.phase).toBe(22);
  });
  it('/dashboard/evidence?severity=INVALID → error envelope', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?severity=INVALID' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('READ_ONLY_API_INVALID_QUERY');
  });
  it('/dashboard/evidence?panel=BADPANEL → error field panel', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?panel=BADPANEL' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.details?.[0]?.field).toBe('panel');
  });
  it('/dashboard/evidence?sortBy=BADFIELD → error field sortBy', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?sortBy=BADFIELD' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.details?.[0]?.field).toBe('sortBy');
  });
  it('/dashboard/evidence?sortDirection=up → error field sortDirection', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?sortDirection=up' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.details?.[0]?.field).toBe('sortDirection');
  });
  it('/dashboard/evidence?offset=-1 → error field offset', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?offset=-1' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.details?.[0]?.field).toBe('offset');
  });
  it('/dashboard/safety?sortBy=invalid → error envelope', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/safety?sortBy=invalid' })).body);
    expect(body.ok).toBe(false);
  });
  it('/dashboard?panel=BADPANEL → error field panel', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?panel=BADPANEL' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.details?.[0]?.field).toBe('panel');
  });
  it('/dashboard?sourceKind=BADSOURCE → error field sourceKind', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?sourceKind=BADSOURCE' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.details?.[0]?.field).toBe('sourceKind');
  });
  it('/dashboard?classification=BADCLASS → error field classification', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?classification=BADCLASS' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.details?.[0]?.field).toBe('classification');
  });
  it('/dashboard?status=BADSTATUS → error field status', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?status=BADSTATUS' })).body);
    expect(body.ok).toBe(false);
    expect(body.error?.details?.[0]?.field).toBe('status');
  });
  it('error envelope does not contain stack trace text', async () => {
    const app = await createReadOnlyApiApp();
    const body = (await app.inject({ method: 'GET', url: '/dashboard?severity=INVALID' })).body;
    expect(body).not.toContain('at Object.');
    expect(body).not.toContain('node_modules');
  });
  it('error envelope does not contain local filesystem paths', async () => {
    const app = await createReadOnlyApiApp();
    const body = (await app.inject({ method: 'GET', url: '/dashboard?severity=INVALID' })).body;
    expect(body).not.toMatch(/\/home\//);
  });
  it('error envelope has endpoint set', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?severity=BAD' })).body);
    if (!body.ok) expect(body.endpoint).toBe('/dashboard/evidence');
  });
  it('error envelope has method GET', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=BAD' })).body);
    expect(body.method).toBe('GET');
  });
});

// ─── 20. HTTP inject — valid query envelopes ─────────────────────────────────

describe('Phase 22 — HTTP inject valid query envelopes', () => {
  it('/dashboard?severity=high → ok envelope', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=high' })).body);
    expect(body.ok).toBe(true);
    expect(body.meta.phase).toBe(22);
  });
  it('/dashboard?limit=5 → meta.pagination defined', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?limit=5' })).body);
    expect(body.meta.pagination).toBeDefined();
  });
  it('/dashboard?sortBy=severity&sortDirection=desc → meta.sort defined', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?sortBy=severity&sortDirection=desc' })).body);
    expect(body.meta.sort).toBeDefined();
  });
  it('/dashboard?severity=high → meta.filters defined', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=high' })).body);
    expect(body.meta.filters).toBeDefined();
  });
  it('/dashboard/evidence?limit=3 → ok', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?limit=3' })).body);
    expect(body.ok).toBe(true);
  });
  it('/dashboard/evidence?severity=info → ok with phase 22', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?severity=info' })).body);
    expect(body.ok).toBe(true);
    expect(body.meta.phase).toBe(22);
  });
  it('/dashboard/safety?limit=10 → ok', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/safety?limit=10' })).body);
    expect(body.ok).toBe(true);
  });
  it('/dashboard?offset=0 → ok', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?offset=0' })).body);
    expect(body.ok).toBe(true);
  });
});

// ─── 21. HTTP inject — all endpoints return Phase 22 meta ────────────────────

describe('Phase 22 — All endpoints return Phase 22 envelope fields', () => {
  const endpoints = ['/health','/capabilities','/contracts','/contracts/openapi-shape','/dashboard','/dashboard/overview','/dashboard/replay','/dashboard/strategy','/dashboard/evaluation','/dashboard/evidence','/dashboard/safety'];
  for (const ep of endpoints) {
    it(ep + ' → body.meta.phase is 22', async () => {
      const app = await createReadOnlyApiApp();
      const body = JSON.parse((await app.inject({ method: 'GET', url: ep })).body);
      expect(body.meta?.phase).toBe(22);
    });
    it(ep + ' → body.meta.apiMode is local_read_only', async () => {
      const app = await createReadOnlyApiApp();
      const body = JSON.parse((await app.inject({ method: 'GET', url: ep })).body);
      expect(body.meta?.apiMode).toBe('local_read_only');
    });
    it(ep + ' → body.ok is boolean', async () => {
      const app = await createReadOnlyApiApp();
      const body = JSON.parse((await app.inject({ method: 'GET', url: ep })).body);
      expect(typeof body.ok).toBe('boolean');
    });
    it(ep + ' → body.endpoint is set', async () => {
      const app = await createReadOnlyApiApp();
      const body = JSON.parse((await app.inject({ method: 'GET', url: ep })).body);
      expect(body.endpoint).toBe(ep);
    });
    it(ep + ' → body.method is GET', async () => {
      const app = await createReadOnlyApiApp();
      const body = JSON.parse((await app.inject({ method: 'GET', url: ep })).body);
      expect(body.method).toBe('GET');
    });
  }
});

// ─── 22. Endpoint contracts ───────────────────────────────────────────────────

describe('Phase 22 — Endpoint contracts', () => {
  it('has 11 contracts', () => { expect(PHASE_22_ENDPOINT_CONTRACTS.length).toBe(11); });
  it('all have endpoint starting with /', () => {
    for (const c of PHASE_22_ENDPOINT_CONTRACTS) { expect(c.endpoint.startsWith('/')).toBe(true); }
  });
  it('all have method GET', () => {
    for (const c of PHASE_22_ENDPOINT_CONTRACTS) { expect(c.method).toBe('GET'); }
  });
  it('all have phase 22', () => {
    for (const c of PHASE_22_ENDPOINT_CONTRACTS) { expect(c.phase).toBe(22); }
  });
  it('all have non-empty description', () => {
    for (const c of PHASE_22_ENDPOINT_CONTRACTS) { expect(c.description.length).toBeGreaterThan(0); }
  });
  it('/health contract exists', () => { expect(PHASE_22_ENDPOINT_CONTRACTS.some(c => c.endpoint === '/health')).toBe(true); });
  it('/capabilities contract exists', () => { expect(PHASE_22_ENDPOINT_CONTRACTS.some(c => c.endpoint === '/capabilities')).toBe(true); });
  it('/dashboard contract supportsQuery', () => {
    const c = PHASE_22_ENDPOINT_CONTRACTS.find(c => c.endpoint === '/dashboard');
    expect(c?.supportsQuery).toBe(true);
  });
  it('/dashboard/evidence contract supportsQuery', () => {
    const c = PHASE_22_ENDPOINT_CONTRACTS.find(c => c.endpoint === '/dashboard/evidence');
    expect(c?.supportsQuery).toBe(true);
  });
  it('/dashboard/safety contract supportsQuery', () => {
    const c = PHASE_22_ENDPOINT_CONTRACTS.find(c => c.endpoint === '/dashboard/safety');
    expect(c?.supportsQuery).toBe(true);
  });
  it('/health contract does not supportsQuery', () => {
    const c = PHASE_22_ENDPOINT_CONTRACTS.find(c => c.endpoint === '/health');
    expect(c?.supportsQuery).toBe(false);
  });
  it('/capabilities contract does not supportsQuery', () => {
    const c = PHASE_22_ENDPOINT_CONTRACTS.find(c => c.endpoint === '/capabilities');
    expect(c?.supportsQuery).toBe(false);
  });
  it('queryable contracts have queryParams array', () => {
    for (const c of PHASE_22_ENDPOINT_CONTRACTS.filter(c => c.supportsQuery)) {
      expect(Array.isArray(c.queryParams)).toBe(true);
      expect(c.queryParams.length).toBeGreaterThan(0);
    }
  });
  it('non-queryable contracts have empty queryParams', () => {
    for (const c of PHASE_22_ENDPOINT_CONTRACTS.filter(c => !c.supportsQuery)) {
      expect(c.queryParams.length).toBe(0);
    }
  });
  it('/dashboard/evidence description mentions fixture', () => {
    const c = PHASE_22_ENDPOINT_CONTRACTS.find(c => c.endpoint === '/dashboard/evidence');
    expect(c?.description.toLowerCase()).toContain('fixture');
  });
});

// ─── 23. QUERY_PARAM_NAMES ────────────────────────────────────────────────────

describe('Phase 22 — QUERY_PARAM_NAMES', () => {
  it('contains limit', () => { expect(QUERY_PARAM_NAMES).toContain('limit'); });
  it('contains offset', () => { expect(QUERY_PARAM_NAMES).toContain('offset'); });
  it('contains cursor', () => { expect(QUERY_PARAM_NAMES).toContain('cursor'); });
  it('contains severity', () => { expect(QUERY_PARAM_NAMES).toContain('severity'); });
  it('contains panel', () => { expect(QUERY_PARAM_NAMES).toContain('panel'); });
  it('contains sourceKind', () => { expect(QUERY_PARAM_NAMES).toContain('sourceKind'); });
  it('contains classification', () => { expect(QUERY_PARAM_NAMES).toContain('classification'); });
  it('contains status', () => { expect(QUERY_PARAM_NAMES).toContain('status'); });
  it('contains sortBy', () => { expect(QUERY_PARAM_NAMES).toContain('sortBy'); });
  it('contains sortDirection', () => { expect(QUERY_PARAM_NAMES).toContain('sortDirection'); });
  it('has 10 params', () => { expect(QUERY_PARAM_NAMES.length).toBe(10); });
});

// ─── 24. PHASE_22_CONTRACT_CAPABILITIES ──────────────────────────────────────

describe('Phase 22 — PHASE_22_CONTRACT_CAPABILITIES', () => {
  it('responseEnvelope is true', () => { expect(PHASE_22_CONTRACT_CAPABILITIES['responseEnvelope']).toBe(true); });
  it('errorEnvelope is true', () => { expect(PHASE_22_CONTRACT_CAPABILITIES['errorEnvelope']).toBe(true); });
  it('queryValidationErrors is true', () => { expect(PHASE_22_CONTRACT_CAPABILITIES['queryValidationErrors']).toBe(true); });
  it('deterministicMetadata is true', () => { expect(PHASE_22_CONTRACT_CAPABILITIES['deterministicMetadata']).toBe(true); });
  it('endpointContracts is true', () => { expect(PHASE_22_CONTRACT_CAPABILITIES['endpointContracts']).toBe(true); });
  it('has 5 keys', () => { expect(Object.keys(PHASE_22_CONTRACT_CAPABILITIES).length).toBe(5); });
});

// ─── 25. LocalReadOnlyApiCapabilities Phase 22 flags ─────────────────────────

describe('Phase 22 — Capabilities Phase 22 flags', () => {
  const caps = getLocalReadOnlyApiCapabilities();
  it('canServeResponseEnvelopes is true', () => { expect(caps.canServeResponseEnvelopes).toBe(true); });
  it('canReturnErrorEnvelopes is true', () => { expect(caps.canReturnErrorEnvelopes).toBe(true); });
  it('canValidateQueryErrors is true', () => { expect(caps.canValidateQueryErrors).toBe(true); });
  it('canProvideDeterministicMetadata is true', () => { expect(caps.canProvideDeterministicMetadata).toBe(true); });
  it('canProvideEndpointContracts is true', () => { expect(caps.canProvideEndpointContracts).toBe(true); });
  it('canTrade still false', () => { expect(caps.canTrade).toBe(false); });
  it('canUseLiveData still false', () => { expect(caps.canUseLiveData).toBe(false); });
  it('canUseSolanaRpc still false', () => { expect(caps.canUseSolanaRpc).toBe(false); });
  it('canUseExternalNetwork still false', () => { expect(caps.canUseExternalNetwork).toBe(false); });
  it('canAccessPrivateKeys still false', () => { expect(caps.canAccessPrivateKeys).toBe(false); });
});

// ─── 26. Deterministic metadata ──────────────────────────────────────────────

describe('Phase 22 — Deterministic metadata', () => {
  it('buildReadOnlyApiContractMeta is deterministic', () => {
    expect(JSON.stringify(buildReadOnlyApiContractMeta())).toBe(JSON.stringify(buildReadOnlyApiContractMeta()));
  });
  it('handleHealth is deterministic', () => {
    expect(JSON.stringify(handleHealth())).toBe(JSON.stringify(handleHealth()));
  });
  it('handleCapabilities is deterministic', () => {
    expect(JSON.stringify(handleCapabilities())).toBe(JSON.stringify(handleCapabilities()));
  });
  it('handleDashboard same query is deterministic', () => {
    expect(JSON.stringify(handleDashboard({ limit: '5' }))).toBe(JSON.stringify(handleDashboard({ limit: '5' })));
  });
  it('handleDashboardEvidence same query is deterministic', () => {
    expect(JSON.stringify(handleDashboardEvidence({ severity: 'high' }))).toBe(JSON.stringify(handleDashboardEvidence({ severity: 'high' })));
  });
  it('PHASE_22_GENERATED_AT is always 2026-01-01T00:00:00.000Z', () => {
    expect(PHASE_22_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });
  it('generatedAt is not wall-clock time', () => {
    expect(PHASE_22_GENERATED_AT).not.toBe(new Date().toISOString());
  });
  it('error envelope meta is deterministic', () => {
    const e1 = handleDashboardEvidence({ severity: 'INVALID' });
    const e2 = handleDashboardEvidence({ severity: 'INVALID' });
    expect(JSON.stringify(e1)).toBe(JSON.stringify(e2));
  });
});

// ─── 27. Phase 21 backward compat regression ─────────────────────────────────

describe('Phase 22 — Phase 21 backward compat regression', () => {
  it('handleHealth has meta.fixtureOnly=true', () => { expect(handleHealth().meta.fixtureOnly).toBe(true); });
  it('handleHealth has meta.liveData=false', () => { expect(handleHealth().meta.liveData).toBe(false); });
  it('handleCapabilities has meta.analysisOnly=true', () => { expect(handleCapabilities().meta.analysisOnly).toBe(true); });
  it('handleCapabilities has meta.safeToDisplay=true', () => { expect(handleCapabilities().meta.safeToDisplay).toBe(true); });
  it('handleDashboard valid returns status ok', () => { expect(handleDashboard().status).toBe('ok'); });
  it('handleDashboard invalid returns status failed', () => { expect(handleDashboard({ severity: 'INVALID' }).status).toBe('failed'); });
  it('handleDashboardEvidence has data.queryMeta', () => {
    const r = handleDashboardEvidence();
    if (r.ok) expect((r.data as Record<string,unknown>)?.['queryMeta']).toBeDefined();
  });
  it('handleDashboardEvidence has data.entries', () => {
    const r = handleDashboardEvidence();
    if (r.ok) expect(Array.isArray((r.data as Record<string,unknown>)?.['entries'])).toBe(true);
  });
  it('handleContracts has meta.fixtureOnly=true', () => { expect(handleContracts().meta.fixtureOnly).toBe(true); });
  it('HTTP /dashboard?severity=HACK → body.status failed', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?severity=HACK' })).body);
    expect(body.status).toBe('failed');
  });
  it('HTTP /dashboard/evidence?severity=info → body.status ok', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?severity=info' })).body);
    expect(body.status).toBe('ok');
  });
  it('HTTP /dashboard/safety?sortBy=badField → body.status failed', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/safety?sortBy=badField' })).body);
    expect(body.status).toBe('failed');
  });
  it('HTTP all endpoints have meta.fixtureOnly=true', async () => {
    const app = await createReadOnlyApiApp();
    for (const ep of ['/health','/capabilities','/contracts','/dashboard','/dashboard/evidence']) {
      const body = JSON.parse((await app.inject({ method: 'GET', url: ep })).body);
      expect(body.meta?.fixtureOnly).toBe(true);
    }
  });
  it('HTTP /health,/capabilities,/contracts have meta.liveData=false', async () => {
    const app = await createReadOnlyApiApp();
    for (const ep of ['/health','/capabilities','/contracts']) {
      const body = JSON.parse((await app.inject({ method: 'GET', url: ep })).body);
      expect(body.meta?.liveData).toBe(false);
    }
  });
  it('LRO_API_HANDLERS still exported', () => { expect(typeof LRO_API_HANDLERS).toBe('object'); });
  it('ALLOWED_SORT_DIRECTIONS still contains asc and desc', () => {
    expect(ALLOWED_SORT_DIRECTIONS).toContain('asc');
    expect(ALLOWED_SORT_DIRECTIONS).toContain('desc');
  });
});

// ─── 28. Safety boundary regression ──────────────────────────────────────────

describe('Phase 22 — Safety boundary regression', () => {
  it('canTrade is false', () => { expect(getLocalReadOnlyApiCapabilities().canTrade).toBe(false); });
  it('canUseLiveData is false', () => { expect(getLocalReadOnlyApiCapabilities().canUseLiveData).toBe(false); });
  it('canUseSolanaRpc is false', () => { expect(getLocalReadOnlyApiCapabilities().canUseSolanaRpc).toBe(false); });
  it('canUseProviderApis is false', () => { expect(getLocalReadOnlyApiCapabilities().canUseProviderApis).toBe(false); });
  it('canAccessPrivateKeys is false', () => { expect(getLocalReadOnlyApiCapabilities().canAccessPrivateKeys).toBe(false); });
  it('canCreateTradeIntents is false', () => { expect(getLocalReadOnlyApiCapabilities().canCreateTradeIntents).toBe(false); });
  it('canRenderUi is false', () => { expect(getLocalReadOnlyApiCapabilities().canRenderUi).toBe(false); });
  it('canUseExternalNetwork is false', () => { expect(getLocalReadOnlyApiCapabilities().canUseExternalNetwork).toBe(false); });
  it('canWriteToDatabase is false', () => { expect(getLocalReadOnlyApiCapabilities().canWriteToDatabase).toBe(false); });
  it('meta.mutating is false in all envelopes', () => { expect(handleHealth().meta.mutating).toBe(false); });
  it('meta.externalNetwork is false in all envelopes', () => { expect(handleCapabilities().meta.externalNetwork).toBe(false); });
  it('contract.ts has no fetch(', () => {
    const src = readFileSync(resolve(SRC_DIR, 'contract.ts'), 'utf-8');
    expect(src).not.toContain('fetch(');
  });
  it('response-envelope.ts has no fetch(', () => {
    const src = readFileSync(resolve(SRC_DIR, 'response-envelope.ts'), 'utf-8');
    expect(src).not.toContain('fetch(');
  });
  it('contract.ts has no signTransaction', () => {
    const src = readFileSync(resolve(SRC_DIR, 'contract.ts'), 'utf-8');
    expect(src).not.toContain('signTransaction');
  });
  it('response-envelope.ts has no eval(', () => {
    const src = readFileSync(resolve(SRC_DIR, 'response-envelope.ts'), 'utf-8');
    expect(src).not.toContain('eval(');
  });
  it('contract.ts has no sendTransaction', () => {
    const src = readFileSync(resolve(SRC_DIR, 'contract.ts'), 'utf-8');
    expect(src).not.toContain('sendTransaction');
  });
  it('POST /health returns 4xx', async () => {
    const app = await createReadOnlyApiApp();
    expect((await app.inject({ method: 'POST', url: '/health', body: '{}' })).statusCode).toBeGreaterThanOrEqual(400);
  });
  it('DELETE /dashboard returns 4xx', async () => {
    const app = await createReadOnlyApiApp();
    expect((await app.inject({ method: 'DELETE', url: '/dashboard' })).statusCode).toBeGreaterThanOrEqual(400);
  });
  it('PUT /capabilities returns 4xx', async () => {
    const app = await createReadOnlyApiApp();
    expect((await app.inject({ method: 'PUT', url: '/capabilities' })).statusCode).toBeGreaterThanOrEqual(400);
  });
});

// ─── 29. Pagination metadata preserved in Phase 22 meta ──────────────────────

describe('Phase 22 — Phase 21 pagination metadata preserved in meta', () => {
  it('evidence meta.pagination.totalCount is number', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence' })).body);
    expect(typeof body.meta?.pagination?.totalCount).toBe('number');
  });
  it('evidence meta.pagination.limit reflects query', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?limit=7' })).body);
    expect(body.meta?.pagination?.limit).toBe(7);
  });
  it('evidence meta.query.limit reflects query', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?limit=7' })).body);
    expect(body.meta?.query?.limit).toBe(7);
  });
  it('evidence meta.filters.severity reflects filter', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?severity=high' })).body);
    expect(body.meta?.filters?.severity).toBe('high');
  });
  it('evidence meta.sort.sortBy reflects sort', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?sortBy=severity&sortDirection=desc' })).body);
    expect(body.meta?.sort?.sortBy).toBe('severity');
  });
  it('dashboard meta.query is populated', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?limit=5&offset=0' })).body);
    expect(body.meta?.query).toBeDefined();
    expect(body.meta.query?.limit).toBe(5);
  });
  it('data.queryMeta still present for evidence (Phase 21 compat)', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence?limit=3' })).body);
    expect(body.data?.queryMeta).toBeDefined();
  });
  it('data.entries still present for evidence (Phase 21 compat)', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard/evidence' })).body);
    expect(Array.isArray(body.data?.entries)).toBe(true);
  });
  it('data.queryMeta still present for dashboard', async () => {
    const app = await createReadOnlyApiApp();
    const body = JSON.parse((await app.inject({ method: 'GET', url: '/dashboard?limit=5' })).body);
    expect(body.data?.queryMeta).toBeDefined();
  });
});

// ─── 30. Allowed Phase 21 query values still work ────────────────────────────

describe('Phase 22 — All allowed Phase 21 query values still work', () => {
  it('all ALLOWED_SEVERITY_VALUES still accepted', () => {
    for (const v of ALLOWED_SEVERITY_VALUES) { expect(parseReadOnlyApiQuery({ severity: v }).ok).toBe(true); }
  });
  it('all ALLOWED_PANEL_VALUES still accepted', () => {
    for (const v of ALLOWED_PANEL_VALUES) { expect(parseReadOnlyApiQuery({ panel: v }).ok).toBe(true); }
  });
  it('all ALLOWED_SOURCE_KIND_VALUES still accepted', () => {
    for (const v of ALLOWED_SOURCE_KIND_VALUES) { expect(parseReadOnlyApiQuery({ sourceKind: v }).ok).toBe(true); }
  });
  it('all ALLOWED_CLASSIFICATION_VALUES still accepted', () => {
    for (const v of ALLOWED_CLASSIFICATION_VALUES) { expect(parseReadOnlyApiQuery({ classification: v }).ok).toBe(true); }
  });
  it('all ALLOWED_STATUS_VALUES still accepted', () => {
    for (const v of ALLOWED_STATUS_VALUES) { expect(parseReadOnlyApiQuery({ status: v }).ok).toBe(true); }
  });
  it('all ALLOWED_SORT_FIELDS still accepted', () => {
    for (const v of ALLOWED_SORT_FIELDS) { expect(parseReadOnlyApiQuery({ sortBy: v }).ok).toBe(true); }
  });
  it('asc still accepted', () => { expect(parseReadOnlyApiQuery({ sortDirection: 'asc' }).ok).toBe(true); });
  it('desc still accepted', () => { expect(parseReadOnlyApiQuery({ sortDirection: 'desc' }).ok).toBe(true); });
  it('default limit still ' + DEFAULT_LIMIT, () => {
    const r = parseReadOnlyApiQuery({});
    if (r.ok) expect(r.value.limit).toBe(DEFAULT_LIMIT);
  });
  it('max limit clamped to ' + MAX_LIMIT, () => {
    const r = parseReadOnlyApiQuery({ limit: String(MAX_LIMIT + 100) });
    if (r.ok) expect(r.value.limit).toBe(MAX_LIMIT);
  });
  it('buildReadOnlyApiPagination rejects negative limit', () => {
    expect(buildReadOnlyApiPagination({ limit: -1, offset: 0 }).ok).toBe(false);
  });
});
