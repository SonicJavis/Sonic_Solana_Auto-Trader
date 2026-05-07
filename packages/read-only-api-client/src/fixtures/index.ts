/**
 * packages/read-only-api-client/src/fixtures/index.ts
 *
 * Phase 23 — Fixture lookup and list helpers barrel.
 *
 * Exports all success and error fixtures plus lookup/list helpers.
 *
 * Safety: no network, no live data, no mutation, no secrets.
 */

import type {
  ReadOnlyApiContractFixtureName,
  ReadOnlyApiFixtureKind,
  ReadOnlyApiEndpointPath,
  ReadOnlySdkContractFixture,
} from '../types.js';

import {
  HEALTH_SUCCESS_FIXTURE,
  CAPABILITIES_SUCCESS_FIXTURE,
  DASHBOARD_SUCCESS_FIXTURE,
  DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
  DASHBOARD_SAFETY_SUCCESS_FIXTURE,
} from './success.js';

import {
  INVALID_QUERY_ERROR_FIXTURE,
  INVALID_QUERY_EVIDENCE_ERROR_FIXTURE,
  UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
  METHOD_NOT_ALLOWED_ERROR_FIXTURE,
  SAFETY_REJECTION_ERROR_FIXTURE,
  INTERNAL_CONTRACT_ERROR_FIXTURE,
} from './error.js';

export {
  HEALTH_SUCCESS_FIXTURE,
  CAPABILITIES_SUCCESS_FIXTURE,
  DASHBOARD_SUCCESS_FIXTURE,
  DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
  DASHBOARD_SAFETY_SUCCESS_FIXTURE,
  INVALID_QUERY_ERROR_FIXTURE,
  INVALID_QUERY_EVIDENCE_ERROR_FIXTURE,
  UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
  METHOD_NOT_ALLOWED_ERROR_FIXTURE,
  SAFETY_REJECTION_ERROR_FIXTURE,
  INTERNAL_CONTRACT_ERROR_FIXTURE,
};

// ─── Fixture registry ─────────────────────────────────────────────────────────

/** All registered Phase 23 contract fixtures. */
const ALL_FIXTURES: readonly ReadOnlySdkContractFixture[] = [
  {
    name: 'health_success',
    kind: 'success',
    endpoint: '/health',
    envelope: HEALTH_SUCCESS_FIXTURE,
    description: 'Deterministic success envelope for GET /health.',
  },
  {
    name: 'capabilities_success',
    kind: 'success',
    endpoint: '/capabilities',
    envelope: CAPABILITIES_SUCCESS_FIXTURE,
    description: 'Deterministic success envelope for GET /capabilities.',
  },
  {
    name: 'dashboard_success',
    kind: 'success',
    endpoint: '/dashboard',
    envelope: DASHBOARD_SUCCESS_FIXTURE,
    description: 'Deterministic success envelope for GET /dashboard (no query params).',
  },
  {
    name: 'dashboard_evidence_success',
    kind: 'success',
    endpoint: '/dashboard/evidence',
    envelope: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
    description: 'Deterministic success envelope for GET /dashboard/evidence (no query params).',
  },
  {
    name: 'dashboard_safety_success',
    kind: 'success',
    endpoint: '/dashboard/safety',
    envelope: DASHBOARD_SAFETY_SUCCESS_FIXTURE,
    description: 'Deterministic success envelope for GET /dashboard/safety (no query params).',
  },
  {
    name: 'invalid_query_error',
    kind: 'error',
    endpoint: '/dashboard',
    envelope: INVALID_QUERY_ERROR_FIXTURE,
    description: 'Deterministic error envelope for an invalid query (limit out of range).',
  },
  {
    name: 'unsupported_endpoint_error',
    kind: 'error',
    endpoint: '/not-found' as ReadOnlyApiEndpointPath,
    envelope: UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
    description: 'Static sanitized example of an unsupported endpoint error envelope.',
  },
  {
    name: 'method_not_allowed_error',
    kind: 'error',
    endpoint: '/health',
    envelope: METHOD_NOT_ALLOWED_ERROR_FIXTURE,
    description: 'Static sanitized example of a method-not-allowed error envelope.',
  },
  {
    name: 'safety_rejection_error',
    kind: 'error',
    endpoint: '/dashboard',
    envelope: SAFETY_REJECTION_ERROR_FIXTURE,
    description: 'Static sanitized example of a safety rejection error envelope.',
  },
  {
    name: 'internal_contract_error',
    kind: 'error',
    endpoint: '/health',
    envelope: INTERNAL_CONTRACT_ERROR_FIXTURE,
    description: 'Static sanitized example of an internal contract error envelope (no real error triggered).',
  },
];

// ─── Lookup/list helpers ──────────────────────────────────────────────────────

/**
 * Lists all registered Phase 23 contract fixtures.
 * Pure. Deterministic. Returns the same array on every call.
 */
export function listReadOnlyApiContractFixtures(): readonly ReadOnlySdkContractFixture[] {
  return ALL_FIXTURES;
}

/**
 * Returns a contract fixture by name, or undefined if not found.
 * Pure. Deterministic.
 */
export function getReadOnlyApiContractFixture(
  name: ReadOnlyApiContractFixtureName,
): ReadOnlySdkContractFixture | undefined {
  return ALL_FIXTURES.find(f => f.name === name);
}

/**
 * Lists all fixtures of a given kind ('success' | 'error').
 * Pure. Deterministic.
 */
export function listReadOnlyApiContractFixturesByKind(
  kind: ReadOnlyApiFixtureKind,
): readonly ReadOnlySdkContractFixture[] {
  return ALL_FIXTURES.filter(f => f.kind === kind);
}

/**
 * Lists all fixtures for a given endpoint path.
 * Pure. Deterministic.
 */
export function listReadOnlyApiContractFixturesByEndpoint(
  endpoint: string,
): readonly ReadOnlySdkContractFixture[] {
  return ALL_FIXTURES.filter(f => f.endpoint === endpoint);
}
