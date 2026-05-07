# LOCAL_READ_ONLY_API_CONTRACT.md

## Phase 22 — Local Read-Only API Response Contracts, Error Envelope, and Endpoint Documentation v1

---

> Phase 24 note: these Phase 22 envelopes are consumed by `@sonic/dashboard-view-models` to build deterministic, typed dashboard view models for future UI work. No UI is implemented in Phase 24.
>
> Phase 26 note: local dashboard interaction state/filters are added in `apps/dashboard/src/state` as an in-memory client-side layer only; no new API contract behavior is added.

### 1. Phase 22 Purpose

Phase 22 adds a **deterministic response contract layer** to the local read-only API shell.

Every existing read-only endpoint now returns a standard JSON envelope that contains:

- A stable success shape (`ok: true`) with endpoint, method, data, and metadata.
- A stable error shape (`ok: false`) with structured error codes, field-level details, and metadata.
- Phase 22 contract metadata in `meta`: phase, apiMode, deterministic, mutating, externalNetwork, generatedAt.
- All Phase 21 safety metadata fields preserved in `meta` for backward compatibility.
- Optional query/filter/sort/pagination metadata in `meta` for queryable endpoints.

Phase 22 does **not** add live data, wallets, Solana RPC, provider APIs, execution, trading, UI, or external network access of any kind.

---

### 2. Safety Boundaries

The Phase 22 local read-only API contract layer is subject to the same permanent safety boundaries as all prior phases:

| Boundary | Value |
|---|---|
| Live data | ❌ Never |
| Solana RPC | ❌ Never |
| Provider APIs | ❌ Never |
| Wallet/private keys | ❌ Never |
| Keypairs / seed phrases | ❌ Never |
| Transaction signing | ❌ Never |
| Transaction sending | ❌ Never |
| Swaps / routes / orders | ❌ Never |
| Trading / execution | ❌ Never |
| Paper trading | ❌ Never |
| Database writes | ❌ Never |
| Filesystem writes from handlers | ❌ Never |
| External network calls | ❌ Never |
| POST / PUT / PATCH / DELETE | ❌ Not registered |
| UI / rendering | ❌ Never |
| Background jobs | ❌ Never |
| Stack traces in error responses | ❌ Never |
| Local filesystem paths in errors | ❌ Never |
| Secrets in error responses | ❌ Never |
| Wall-clock timestamps | ❌ Never |
| Mutations of any kind | ❌ Never |
| Binding to 0.0.0.0 | ❌ Rejected |

The API remains:
- **localhost-only** (binds to 127.0.0.1 only)
- **GET-only** (no mutating methods registered)
- **fixture-only** (all data is static, deterministic, in-memory)
- **offline** (no external network access)
- **non-mutating** (no side effects)
- **deterministic** (same inputs produce same outputs every time)

---

### 3. Success Envelope

Every successful response returns a standard envelope:

```json
{
  "ok": true,
  "status": "ok",
  "envelopeId": "lro_health_response",
  "endpoint": "/health",
  "method": "GET",
  "data": {
    "status": "fixture_only",
    "message": "Local Read-Only API Shell is running.",
    "fixtureOnly": true,
    "liveData": false
  },
  "warnings": [],
  "errors": [],
  "meta": {
    "phase": 22,
    "apiMode": "local_read_only",
    "deterministic": true,
    "mutating": false,
    "externalNetwork": false,
    "generatedAt": "2026-01-01T00:00:00.000Z",
    "capabilities": {
      "responseEnvelope": true,
      "errorEnvelope": true,
      "queryValidationErrors": true,
      "deterministicMetadata": true,
      "endpointContracts": true
    },
    "fixtureOnly": true,
    "liveData": false,
    "safeToDisplay": true,
    "analysisOnly": true,
    "nonExecutable": true,
    "readOnly": true,
    "localOnly": true
  },
  "generatedAt": "2026-01-01T00:00:00.000Z"
}
```

Queryable endpoints (e.g., `/dashboard/evidence`) additionally include `query`, `filters`, `sort`, and `pagination` in `meta`:

```json
{
  "ok": true,
  "meta": {
    "phase": 22,
    "query": { "limit": 10, "offset": 0, "severity": "high", "sortBy": "severity", "sortDirection": "desc" },
    "filters": { "severity": "high", "filtersActive": true },
    "sort": { "sortBy": "severity", "sortDirection": "desc" },
    "pagination": { "limit": 10, "offset": 0, "totalCount": 3, "resultCount": 3, "hasMore": false }
  }
}
```

---

### 4. Error Envelope

When a query validation error occurs, the error envelope is returned:

```json
{
  "ok": false,
  "status": "failed",
  "envelopeId": "lro_dashboard_evidence_response",
  "endpoint": "/dashboard/evidence",
  "method": "GET",
  "data": null,
  "error": {
    "code": "READ_ONLY_API_INVALID_QUERY",
    "message": "Invalid read-only API query.",
    "details": [
      {
        "field": "severity",
        "reason": "severity must be one of: info, low, medium, high, critical",
        "received": "HACK"
      }
    ]
  },
  "errors": [
    { "code": "INVALID_LRO_API_INPUT", "message": "Invalid read-only API query." }
  ],
  "warnings": [],
  "meta": {
    "phase": 22,
    "apiMode": "local_read_only",
    "deterministic": true,
    "mutating": false,
    "externalNetwork": false,
    "generatedAt": "2026-01-01T00:00:00.000Z",
    "fixtureOnly": true,
    "liveData": false
  },
  "generatedAt": "2026-01-01T00:00:00.000Z"
}
```

**Error envelope rules:**
- `data` is always `null`.
- `error.details` contains field-level information (field name, reason, sanitized received value).
- No stack traces, no local filesystem paths, no secrets in any error field.
- `received` values are sanitized — secrets and URLs are redacted to `[redacted]`.
- The `errors` array is included for Phase 21 backward compatibility.

---

### 5. Metadata Fields

#### Standard `meta` fields (all endpoints)

| Field | Type | Value |
|---|---|---|
| `phase` | `number` | `22` |
| `apiMode` | `string` | `"local_read_only"` |
| `deterministic` | `boolean` | `true` |
| `mutating` | `boolean` | `false` |
| `externalNetwork` | `boolean` | `false` |
| `generatedAt` | `string` | `"2026-01-01T00:00:00.000Z"` (static) |
| `fixtureOnly` | `boolean` | `true` |
| `liveData` | `boolean` | `false` |
| `safeToDisplay` | `boolean` | `true` |
| `analysisOnly` | `boolean` | `true` |
| `nonExecutable` | `boolean` | `true` |
| `readOnly` | `boolean` | `true` |
| `localOnly` | `boolean` | `true` |
| `capabilities` | `object` | Phase 22 contract capability flags |

#### `meta.capabilities` fields

| Field | Value |
|---|---|
| `responseEnvelope` | `true` |
| `errorEnvelope` | `true` |
| `queryValidationErrors` | `true` |
| `deterministicMetadata` | `true` |
| `endpointContracts` | `true` |

#### Additional `meta` fields for queryable endpoints

| Field | Description |
|---|---|
| `meta.query` | Parsed and validated query parameters |
| `meta.filters` | Applied filter metadata |
| `meta.sort` | Applied sort metadata |
| `meta.pagination` | Pagination state (limit, offset, totalCount, etc.) |

#### `generatedAt` policy

The `generatedAt` field in both `meta` and the top-level envelope is always the static deterministic value `"2026-01-01T00:00:00.000Z"`. It is **never** a wall-clock timestamp.

---

### 6. Error Code Table

| Code | Meaning |
|---|---|
| `READ_ONLY_API_INVALID_QUERY` | Query parameter(s) are invalid (bad type, out of range, unsupported value) |
| `READ_ONLY_API_UNSUPPORTED_ENDPOINT` | The requested endpoint does not exist |
| `READ_ONLY_API_METHOD_NOT_ALLOWED` | The HTTP method is not GET (or a host/port safety rejection) |
| `READ_ONLY_API_SAFETY_REJECTION` | Query or content rejected by safety filters (secret patterns, unsafe URLs, etc.) |
| `READ_ONLY_API_INTERNAL_CONTRACT_ERROR` | An unexpected internal contract violation (should not normally occur) |

---

### 7. Endpoint Contract Table

| Endpoint | Method | Supports Query | Query Params |
|---|---|---|---|
| `/health` | GET | No | — |
| `/capabilities` | GET | No | — |
| `/contracts` | GET | No | — |
| `/contracts/openapi-shape` | GET | No | — |
| `/dashboard` | GET | Yes | limit, offset, cursor, severity, panel, sourceKind, classification, status, sortBy, sortDirection |
| `/dashboard/overview` | GET | No | — |
| `/dashboard/replay` | GET | No | — |
| `/dashboard/strategy` | GET | No | — |
| `/dashboard/evaluation` | GET | No | — |
| `/dashboard/evidence` | GET | Yes | limit, offset, cursor, severity, panel, sourceKind, classification, status, sortBy, sortDirection |
| `/dashboard/safety` | GET | Yes | limit, offset, cursor, severity, panel, sourceKind, classification, status, sortBy, sortDirection |

All endpoints:
- GET only
- localhost (127.0.0.1) only
- fixture-only data
- non-mutating
- deterministic

---

### 8. Query Validation Examples

#### Valid query

```
GET /dashboard/evidence?limit=10&severity=high&sortBy=severity&sortDirection=desc
```

Returns success envelope with `ok: true` and query metadata in `meta`.

#### Invalid severity

```
GET /dashboard/evidence?severity=INVALID_VALUE
```

Returns error envelope:
```json
{
  "ok": false,
  "error": {
    "code": "READ_ONLY_API_INVALID_QUERY",
    "message": "Invalid read-only API query.",
    "details": [{ "field": "severity", "reason": "severity must be one of: ...", "received": "INVALID_VALUE" }]
  }
}
```

#### Invalid sortBy

```
GET /dashboard/evidence?sortBy=walletAddress
```

Returns error envelope with `error.details[0].field = "sortBy"`.

#### Negative offset

```
GET /dashboard/evidence?offset=-1
```

Returns error envelope with `error.details[0].field = "offset"`.

#### Invalid sortDirection

```
GET /dashboard/evidence?sortDirection=up
```

Returns error envelope with `error.details[0].field = "sortDirection"`.

---

### 9. Successful Response Examples

#### GET /health

```json
{
  "ok": true,
  "status": "ok",
  "endpoint": "/health",
  "method": "GET",
  "data": { "status": "fixture_only", "fixtureOnly": true, "liveData": false },
  "meta": { "phase": 22, "apiMode": "local_read_only", "deterministic": true }
}
```

#### GET /capabilities

```json
{
  "ok": true,
  "endpoint": "/capabilities",
  "method": "GET",
  "data": {
    "canTrade": false,
    "canUseLiveData": false,
    "canServeResponseEnvelopes": true,
    "canReturnErrorEnvelopes": true,
    "canValidateQueryErrors": true,
    "canProvideEndpointContracts": true
  },
  "meta": { "phase": 22 }
}
```

#### GET /dashboard/evidence?severity=high&limit=3

```json
{
  "ok": true,
  "endpoint": "/dashboard/evidence",
  "method": "GET",
  "data": { "entries": [...], "queryMeta": { ... } },
  "meta": {
    "phase": 22,
    "query": { "limit": 3, "severity": "high" },
    "filters": { "severity": "high", "filtersActive": true },
    "pagination": { "limit": 3, "totalCount": 3, "hasMore": false }
  }
}
```

---

### 10. Error Response Examples

#### Invalid severity on /dashboard

```
GET /dashboard?severity=HACK
```

```json
{
  "ok": false,
  "status": "failed",
  "endpoint": "/dashboard",
  "method": "GET",
  "data": null,
  "error": {
    "code": "READ_ONLY_API_INVALID_QUERY",
    "message": "Invalid read-only API query.",
    "details": [{ "field": "severity", "reason": "...", "received": "HACK" }]
  },
  "meta": { "phase": 22, "apiMode": "local_read_only", "mutating": false }
}
```

#### Secret value in query param (safety rejection)

If a cursor or other param contains a secret pattern, the received value is redacted:
```json
{
  "error": {
    "code": "READ_ONLY_API_SAFETY_REJECTION",
    "details": [{ "field": "cursor", "received": "[redacted]" }]
  }
}
```

---

### 11. Notes for Future Dashboard/UI Consumers

When consuming this API in a future dashboard or UI layer:

1. **Always check `ok`** before accessing `data`. If `ok === false`, use `error.code` and `error.details` to display the error.
2. **Use `meta.phase`** to detect which Phase contract version is in use.
3. **Use `meta.pagination`** to implement next/previous page navigation.
4. **Use `meta.filters`** to display active filters.
5. **Use `meta.sort`** to display current sort state.
6. **Never expose `meta.generatedAt`** as a live timestamp — it is a static fixture value.
7. **Never display raw `received` values** to end users without sanitization.
8. All fields in `data` are fixture data — not live market data.
9. The `canServeResponseEnvelopes: true` capability flag confirms Phase 22 contract support.
10. The `errors` array (Phase 21 backward compat) is always empty on success and mirrors the `error` object on failure.

---

### 12. Future Phase 23 Preview

Phase 23 is expected to add:

> **Phase 23 — Local Read-Only API Consumer SDK and Contract Fixtures v1**

A consumer SDK for in-process use of the read-only API contracts, along with contract fixture files for testing and documentation purposes.

Phase 23 is not implemented in this PR.

---

### 13. Confirmation: What Phase 22 Does NOT Add

Phase 22 does **not** add any of the following:

- ❌ Live data
- ❌ Wallets or private keys
- ❌ Solana RPC connections
- ❌ Provider APIs (Helius, Yellowstone, etc.)
- ❌ External network calls of any kind
- ❌ Execution or trading logic
- ❌ UI or rendering
- ❌ Mutations (no POST/PUT/PATCH/DELETE)
- ❌ Background or scheduled jobs
- ❌ Database writes
- ❌ Filesystem writes from handlers
- ❌ Wall-clock timestamps
- ❌ Stack traces in error responses
- ❌ Secrets or credentials of any kind

---

*Generated as part of Phase 22 implementation. Last updated: Phase 22.*
