# Local Read-Only API Query, Filter, and Pagination

## Overview

Phase 21 adds safe, deterministic, fixture-only query parsing, filtering, sorting, and pagination helpers to the existing Phase 20 Local Read-Only API shell.

This document describes the supported query parameters, filter fields, sort fields, pagination model, cursor/offset rules, response metadata, and safety invariants.

---

## Phase Scope

This phase is **strictly** within the following constraints:

- **Localhost-only** — API still binds only to `127.0.0.1`
- **GET-only** — No POST, PUT, PATCH, DELETE, or mutation endpoints
- **Fixture-only** — All query/filter/pagination operates on in-memory fixture data only
- **Read-only** — No database reads, no live data, no external network calls
- **Analysis-only** — Outputs are for display/analysis only, never actionable
- **Non-executable** — No trade intents, no execution plans, no signals

This phase does **NOT** add a dashboard UI, live data, paper trading, or any execution capability.

---

## Supported Query Parameters

All query parameters are **optional** with deterministic defaults.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | integer | `25` | Maximum items per page (max: 100) |
| `offset` | integer | `0` | Number of items to skip |
| `cursor` | string | — | Opaque cursor for cursor-based pagination (overrides offset) |
| `severity` | enum | — | Filter by severity level |
| `panel` | enum | — | Filter by dashboard panel name |
| `sourceKind` | enum | — | Filter by data source kind |
| `classification` | enum | — | Filter by classification |
| `status` | enum | — | Filter by status |
| `sortBy` | enum | `id` | Field to sort by |
| `sortDirection` | `asc` \| `desc` | `asc` | Sort direction |

---

## Supported Filter Fields

Only explicit, bounded enum values are accepted. Unknown values are rejected with `INVALID_LRO_API_INPUT`.

### `severity`
Allowed values: `info`, `low`, `medium`, `high`, `critical`

### `panel`
Allowed values: `overview`, `replay`, `strategy`, `evaluation`, `evidence`, `safety`

### `sourceKind`
Allowed values: `replay`, `strategy`, `evaluation`, `evidence`, `safety`, `fixture`, `contract`

### `classification`
Allowed values: `safe`, `caution`, `warning`, `unsafe`, `unknown`, `fixture_only`, `analysis_only`

### `status`
Allowed values: `ok`, `degraded`, `failed`, `inconclusive`, `pending`, `fixture`

---

## Supported Sort Fields

Only the following explicit sort fields are allowed. Arbitrary field paths, nested fields, and SQL-like expressions are **never** supported.

| Field | Description |
|---|---|
| `id` | Item identifier |
| `severity` | Severity level (alphabetical) |
| `sourceKind` | Source kind (alphabetical) |
| `classification` | Classification (alphabetical) |
| `createdAt` | Creation timestamp (alphabetical/ISO) |
| `label` | Display label |
| `status` | Status string |
| `panel` | Panel name |

---

## Pagination Model

### Limit/Offset Pagination

```
GET /dashboard/evidence?limit=10&offset=20
```

- `limit`: Maximum items per page. Default: 25. Maximum: 100. Negative or huge values are rejected.
- `offset`: Items to skip from the beginning. Default: 0. Negative values are rejected.

### Cursor-Based Pagination

```
GET /dashboard/evidence?limit=10&cursor=<nextCursor>
```

- When `cursor` is provided, it overrides `offset`.
- `cursor` is an opaque base64url-encoded value returned in `queryMeta.pagination.nextCursor`.
- Cursors are encoded offsets — no external lookups are performed.
- Invalid/unsafe cursors are rejected.

---

## Response Metadata

Phase 21 enhances endpoint responses with `queryMeta` in the `data` field for query-aware endpoints.

### `queryMeta` Structure

```json
{
  "queryMeta": {
    "query": {
      "limit": 25,
      "offset": 0,
      "cursor": null,
      "sortBy": "id",
      "sortDirection": "asc",
      "severity": null,
      "panel": null,
      "sourceKind": null,
      "classification": null,
      "status": null
    },
    "appliedFilters": {
      "severity": null,
      "panel": null,
      "sourceKind": null,
      "classification": null,
      "status": null,
      "filtersActive": false,
      "fixtureOnly": true
    },
    "sort": {
      "sortBy": "id",
      "sortDirection": "asc",
      "fixtureOnly": true
    },
    "pagination": {
      "limit": 25,
      "offset": 0,
      "totalCount": 4,
      "resultCount": 4,
      "hasMore": false,
      "nextCursor": null,
      "fixtureOnly": true
    },
    "fixtureOnly": true,
    "analysisOnly": true,
    "nonExecutable": true,
    "readOnly": true,
    "localOnly": true
  }
}
```

### Fields

| Field | Description |
|---|---|
| `query` | The parsed, normalised query parameters |
| `appliedFilters` | Which filters were applied and whether any were active |
| `sort` | Applied sort field and direction |
| `pagination.totalCount` | Total items after filtering |
| `pagination.resultCount` | Items returned in this response |
| `pagination.hasMore` | Whether more items exist beyond this page |
| `pagination.nextCursor` | Opaque cursor for the next page (if `hasMore`) |

---

## Fixture-Only Endpoint Examples

All examples use the local API at `127.0.0.1:3140`.

### Basic evidence query

```
GET http://127.0.0.1:3140/dashboard/evidence
```

### Filter by severity

```
GET http://127.0.0.1:3140/dashboard/evidence?severity=high
```

### Filter and sort

```
GET http://127.0.0.1:3140/dashboard/evidence?severity=info&sortBy=label&sortDirection=asc
```

### Paginated with limit/offset

```
GET http://127.0.0.1:3140/dashboard/evidence?limit=5&offset=0
```

### Next page using cursor

```
GET http://127.0.0.1:3140/dashboard/evidence?limit=5&cursor=<nextCursor from previous response>
```

### Dashboard with query

```
GET http://127.0.0.1:3140/dashboard?limit=10&sortBy=severity&sortDirection=desc
```

### Safety panel with query

```
GET http://127.0.0.1:3140/dashboard/safety?limit=5
```

---

## Safety Invariants

The query/filter/pagination layer enforces the following invariants:

1. **Fixture-only** — All operations apply only to in-memory fixture/contract/read-model data. No external queries, no live data, no database reads.

2. **No live data** — `liveData: false` is enforced in all responses.

3. **No arbitrary query languages** — SQL, JSON query languages, regex injection, eval-like expressions are rejected.

4. **No eval or dynamic code** — The query engine never calls `eval()`, `new Function()`, or any dynamic code execution.

5. **Bounded enum filtering** — Only explicitly defined filter values are accepted. Unknown values return `INVALID_LRO_API_INPUT`.

6. **Bounded sort fields** — Only explicitly defined sort fields are accepted. Arbitrary field paths return `INVALID_LRO_API_INPUT`.

7. **Safe cursors** — Cursors are opaque base64url-encoded offsets. Invalid, unsafe, or too-long cursors are rejected.

8. **No mutation** — All helpers (`applyReadOnlyApiFilters`, `applyReadOnlyApiSorting`, `applyReadOnlyApiPagination`) return new arrays and never mutate input arrays.

9. **Determinism** — For the same input and fixture data, the same output is always produced.

10. **Localhost-only** — API still binds exclusively to `127.0.0.1`. External hosts (`0.0.0.0`, `::`, `localhost`) remain rejected.

---

## Important Disclaimers

> **This is NOT trading advice.**
> This API is fixture-only, read-only, analysis-only, and non-executable.
> It produces no live data, no trade signals, no actionable recommendations.

> **This is NOT a live data source.**
> All data is synthetic fixture data. No Solana RPC, no provider API, no WebSocket streams.

> **This is NOT a dashboard UI.**
> This phase adds only query/filter/pagination helpers to the existing API shell.
> A read-only React dashboard is explicitly out of scope for this phase.

> **This is NOT paper trading.**
> No trade intents, execution plans, orders, positions, or PnL calculations are supported.

> **This is NOT production-ready.**
> This API shell is for local development, analysis, and evidence review only.
> It must never be exposed to external networks.

---

## Endpoints Receiving Query Support (Phase 21)

| Endpoint | Query Params Supported |
|---|---|
| `GET /dashboard` | ✅ limit, offset, cursor, sortBy, sortDirection, severity, panel, sourceKind, classification, status |
| `GET /dashboard/evidence` | ✅ limit, offset, cursor, sortBy, sortDirection, severity, panel, sourceKind, classification, status |
| `GET /dashboard/safety` | ✅ limit, offset, cursor, sortBy, sortDirection |
| `GET /health` | — (no query params needed) |
| `GET /capabilities` | — (no query params needed) |
| `GET /contracts` | — (no query params needed) |
| `GET /contracts/openapi-shape` | — (no query params needed) |
| `GET /dashboard/overview` | — (fixture data served as-is) |
| `GET /dashboard/replay` | — (fixture data served as-is) |
| `GET /dashboard/strategy` | — (fixture data served as-is) |
| `GET /dashboard/evaluation` | — (fixture data served as-is) |

---

## Future Dashboard/API Notes

> ⚠️ **These notes describe future possibilities only. They are NOT in scope for Phase 21.**

Future phases (Phase 22+) may consider:

- A read-only React dashboard (only after explicit sign-off and stable Phase 13–21 gates)
- Additional filter fields if new fixture models introduce them
- More sophisticated cursor schemes if large fixture datasets are added
- API versioning if breaking changes are required

None of these are started, approved, or implied by this phase.
