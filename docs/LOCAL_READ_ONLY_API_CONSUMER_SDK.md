# Local Read-Only API Consumer SDK

## Phase 28 Note

Phase 28 dashboard report models remain fixture-backed and indirectly sourced from this deterministic SDK path (fixtures -> view models -> shell/state/snapshots -> report models). No export runtime behavior is introduced.

**Phase 23 — Local Read-Only API Consumer SDK and Contract Fixtures v1**

---

> Phase 24 companion layer: `@sonic/dashboard-view-models` consumes this SDK's fixtures/envelopes to produce deterministic typed view models for future dashboard UI consumers.
>
> Phase 26 note: dashboard interaction state and filters are local/in-memory in `apps/dashboard/src/state` and consume existing Phase 24/25 data only; this SDK remains unchanged in safety posture (no network, no persistence, no live data).

## 1. Phase 23 Purpose

Phase 23 adds a thin, typed, local/in-process consumer SDK and stable contract fixture layer around the Phase 22 read-only API contracts.

The goal is to make future dashboard/UI/read-model work easier and safer by providing:

- Typed local helpers for Phase 22 response envelopes
- Typed endpoint and request builders
- Typed query builders for Phase 21/22 query params
- Typed response parsing helpers and type guards
- Stable deterministic contract fixtures for success and error envelopes
- Fixture lookup and list helpers

---

## 2. Safety Boundaries

The SDK is **strictly local/in-process only**.

| Property | Value |
|---|---|
| Real network requests | **Never** |
| Port binding | **Never** |
| Mutation | **Never** |
| External I/O | **Never** |
| Live data | **Never** |
| Solana RPC | **Never** |
| Wallets / private keys | **Never** |
| Trade execution | **Never** |
| UI components | **None** |
| Filesystem writes | **Never** |
| Wall-clock timestamps | **Never** |

All SDK values are deterministic, static, and fixture-only.

`client.isNetworkClient === false`
`client.bindsPort === false`

---

## 3. SDK Architecture

```
packages/read-only-api-client/
├── src/
│   ├── types.ts            — SDK types + re-exported Phase 22 envelope types
│   ├── endpoints.ts        — Typed endpoint definitions
│   ├── query-builder.ts    — Query param builders and validators
│   ├── response-parser.ts  — Type guards, parsers, assertions, meta validators
│   ├── client.ts           — Client factory and request builder
│   ├── fixtures/
│   │   ├── success.ts      — Deterministic success envelope fixtures
│   │   ├── error.ts        — Deterministic error envelope fixtures
│   │   └── index.ts        — Fixture lookup/list helpers + registry
│   └── index.ts            — Public API barrel
```

---

## 4. In-Process Only Design

The SDK **never makes real network requests**. It is designed for:

- Local development and testing
- Future dashboard/read-model consumers
- Type-safe contract validation
- Deterministic fixture-based testing

There is no `fetch`, `axios`, `WebSocket`, or any runtime I/O in this package.
The Phase 22 handler functions are called in-process during fixture initialization.

---

## 5. Endpoint List

All Phase 22 read-only GET endpoints are covered:

| Path | Supports Query |
|---|---|
| `GET /health` | No |
| `GET /capabilities` | No |
| `GET /contracts` | No |
| `GET /contracts/openapi-shape` | No |
| `GET /dashboard` | Yes |
| `GET /dashboard/overview` | No |
| `GET /dashboard/replay` | No |
| `GET /dashboard/strategy` | No |
| `GET /dashboard/evaluation` | No |
| `GET /dashboard/evidence` | Yes |
| `GET /dashboard/safety` | Yes |

---

## 6. Request Builder Examples

```typescript
import { createReadOnlyApiClient, buildReadOnlyApiRequest } from '@sonic/read-only-api-client';

// Create a client (local/in-process only)
const client = createReadOnlyApiClient();
// client.isNetworkClient === false
// client.bindsPort === false

// Build a request descriptor
const req = client.buildRequest('/health');
// { endpoint: '/health', method: 'GET', query: {} }

// Build a request with query params
const req2 = client.buildRequest('/dashboard/evidence', {
  limit: 10,
  severity: 'high',
  sortBy: 'severity',
  sortDirection: 'desc',
});

// Or use the standalone helper
const req3 = buildReadOnlyApiRequest('/capabilities');
```

---

## 7. Query Builder Examples

```typescript
import {
  buildReadOnlyApiQuery,
  buildQueryString,
  buildLimitParam,
  buildSeverityParam,
} from '@sonic/read-only-api-client';

// Build a validated query object
const result = buildReadOnlyApiQuery({
  limit: 10,
  severity: 'high',
  sortBy: 'id',
  sortDirection: 'desc',
});

if (result.ok) {
  // result.query is a validated ReadOnlyApiClientQueryParams
  const qs = buildQueryString(result.query);
  // "limit=10&severity=high&sortBy=id&sortDirection=desc"
} else {
  // result.errors is an array of validation error strings
  console.log(result.errors);
}

// Individual param builders
const limitResult = buildLimitParam(50);   // { ok: true, value: 50 }
const badLimit = buildLimitParam(-1);       // { ok: false, error: '...' }
const sevResult = buildSeverityParam('high'); // { ok: true, value: 'high' }
const badSev = buildSeverityParam('extreme'); // { ok: false, error: '...' }
```

**Supported query params:**

| Param | Type | Allowed values |
|---|---|---|
| `limit` | number | 1–100 |
| `offset` | number | ≥0 |
| `cursor` | string | safe string ≤512 chars |
| `severity` | string | `info`, `low`, `medium`, `high`, `critical` |
| `panel` | string | `overview`, `replay`, `strategy`, `evaluation`, `evidence`, `safety` |
| `sourceKind` | string | `replay`, `strategy`, `evaluation`, `evidence`, `safety`, `fixture`, `contract` |
| `classification` | string | `safe`, `caution`, `warning`, `unsafe`, `unknown`, `fixture_only`, `analysis_only` |
| `status` | string | `ok`, `degraded`, `failed`, `inconclusive`, `pending`, `fixture` |
| `sortBy` | string | `id`, `severity`, `sourceKind`, `classification`, `createdAt`, `label`, `status`, `panel` |
| `sortDirection` | string | `asc`, `desc` |

---

## 8. Response Parser Examples

```typescript
import {
  isReadOnlyApiSuccessEnvelope,
  isReadOnlyApiErrorEnvelope,
  parseReadOnlyApiEnvelope,
  assertReadOnlyApiSuccessEnvelope,
  extractSuccessData,
  extractErrorInfo,
  validateEnvelopeMeta,
  isDeterministicGeneratedAt,
} from '@sonic/read-only-api-client';

// Type guards
const envelope = someSource; // unknown
if (isReadOnlyApiSuccessEnvelope(envelope)) {
  // envelope is ReadOnlyApiSuccessEnvelope<unknown>
  const data = extractSuccessData(envelope);
}
if (isReadOnlyApiErrorEnvelope(envelope)) {
  // envelope is ReadOnlyApiErrorEnvelope
  const { code, message, details } = extractErrorInfo(envelope);
}

// Parse unknown input
const result = parseReadOnlyApiEnvelope(envelope);
if (result.ok) {
  // result.data, result.meta
} else {
  // result.error.code, result.meta
}

// Assert (throws ReadOnlyApiAssertionError on failure)
assertReadOnlyApiSuccessEnvelope(envelope);

// Meta validation
const errors = validateEnvelopeMeta(envelope.meta);
// errors.length === 0 means valid

// Check deterministic timestamp
isDeterministicGeneratedAt(envelope.generatedAt); // true for Phase 22 constant
```

---

## 9. Contract Fixture Examples

```typescript
import {
  HEALTH_SUCCESS_FIXTURE,
  CAPABILITIES_SUCCESS_FIXTURE,
  DASHBOARD_SUCCESS_FIXTURE,
  INVALID_QUERY_ERROR_FIXTURE,
  listReadOnlyApiContractFixtures,
  getReadOnlyApiContractFixture,
  listReadOnlyApiContractFixturesByKind,
} from '@sonic/read-only-api-client';

// Direct access to deterministic success fixtures
console.log(HEALTH_SUCCESS_FIXTURE.ok);         // true
console.log(HEALTH_SUCCESS_FIXTURE.endpoint);   // '/health'
console.log(HEALTH_SUCCESS_FIXTURE.meta.mutating);    // false
console.log(HEALTH_SUCCESS_FIXTURE.meta.fixtureOnly); // true

// Error fixtures
console.log(INVALID_QUERY_ERROR_FIXTURE.ok);    // false
console.log(INVALID_QUERY_ERROR_FIXTURE.error.code); // 'READ_ONLY_API_INVALID_QUERY'

// List all fixtures
const all = listReadOnlyApiContractFixtures(); // 10 fixtures

// Lookup by name
const fixture = getReadOnlyApiContractFixture('health_success');
// fixture.kind === 'success'

// Filter by kind
const successFixtures = listReadOnlyApiContractFixturesByKind('success'); // 5
const errorFixtures = listReadOnlyApiContractFixturesByKind('error');     // 5
```

**Fixture registry:**

| Name | Kind | Endpoint |
|---|---|---|
| `health_success` | success | `/health` |
| `capabilities_success` | success | `/capabilities` |
| `dashboard_success` | success | `/dashboard` |
| `dashboard_evidence_success` | success | `/dashboard/evidence` |
| `dashboard_safety_success` | success | `/dashboard/safety` |
| `invalid_query_error` | error | `/dashboard` |
| `unsupported_endpoint_error` | error | `/not-found` |
| `method_not_allowed_error` | error | `/health` |
| `safety_rejection_error` | error | `/dashboard` |
| `internal_contract_error` | error | `/health` |

---

## 10. How Fixtures Support Future UI/Dashboard Work

Contract fixtures serve as:

1. **Typed contract snapshots** — future dashboard/UI code can consume these without running a server.
2. **Storybook / component test data** — deterministic, sanitized, no wall-clock timestamps.
3. **Integration test baselines** — assert that envelope shapes have not changed between phases.
4. **Documentation examples** — each fixture is a complete, real response from a Phase 22 handler.

All fixtures are computed once at module load from Phase 22 handler functions, ensuring they remain in sync with the actual API contract.

---

## 11. What Phase 23 Does NOT Implement

Phase 23 does **not** add:

- Any UI or frontend components
- Any React components or hooks
- Any real HTTP client (`fetch`, `axios`, etc.)
- Any live data sources
- Any Solana RPC connections
- Any provider API integrations
- Any wallet or private key logic
- Any transaction construction, simulation, signing, or sending
- Any trade execution, swap, order, or fill logic
- Any paper trading or live trading
- Any position or PnL tracking
- Any database writes
- Any filesystem writes from SDK
- Any background or scheduled jobs
- Any WebSocket clients
- Any POST/PUT/PATCH/DELETE behavior
- Any secrets or credentials

---

## 12. Future Phase 24 Preview

**Phase 24** will likely add:

> Phase 24 — Local Read-Only Dashboard Data Adapter and View Models v1

This phase is expected to build typed view models and data adapters for dashboard panels,
consuming the Phase 23 SDK fixtures and Phase 22 contract envelopes.

**Phase 24 is not implemented in this branch.**

---

## 13. Safety Confirmation

Phase 23 adds:

- ✅ No UI
- ✅ No live data
- ✅ No Solana RPC
- ✅ No provider APIs
- ✅ No wallets or private keys
- ✅ No execution or trading logic
- ✅ No external network access
- ✅ No mutation endpoints
- ✅ No wall-clock timestamps
- ✅ No secrets or credentials

All fixtures are deterministic, sanitized, and fixture-only.
