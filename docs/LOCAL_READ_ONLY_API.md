# Local Read-Only API Shell

## Phase 20 Overview

`apps/read-only-api` is a **localhost-only, GET-only, fixture-only, read-only, analysis-only, non-executable** Fastify API shell.

It is **Phase 20** of the Sonic Solana Auto-Trader defensive intelligence build.

Phase 24 adds `@sonic/dashboard-view-models` as a local adapter/view-model consumer layer on top of this API's Phase 22/23 envelopes and fixtures. That Phase 24 layer is still read-only, fixture-only, deterministic, and non-networked.

---

## Phase Scope

This is the first runtime API shell in the project. It serves safe fixture/contract/read-model outputs through deterministic, non-mutating GET endpoints.

**What it is:**
- A Fastify HTTP server, bound to `127.0.0.1` only
- GET-only (no POST, PUT, PATCH, DELETE)
- Fixture-only (all data is deterministic synthetic data from Phase 18/19)
- Read-only (no writes, no mutations)
- Analysis-only (outputs are analysis labels, not trading decisions)
- Non-executable (no trade intents, no execution plans, no orders)
- Local-only (never binds to external interfaces)

**What it is NOT:**
- Not trading advice
- Not live data
- Not a dashboard UI
- Not paper trading
- Not trade execution
- Not a live Solana data feed
- Not a provider connection
- Not a wallet manager

---

## Package / App Structure

```
apps/read-only-api/
├── package.json          # @sonic/read-only-api, depends on fastify + workspace packages
├── tsconfig.json         # TypeScript composite project config
└── src/
    ├── types.ts          # LocalReadOnlyApiCapabilities, LocalReadOnlyApiConfig, LroApiResponseEnvelope, etc.
    ├── errors.ts         # LroApiResult<T>, lroApiOk, lroApiErr, LocalReadOnlyApiError
    ├── capabilities.ts   # getLocalReadOnlyApiCapabilities()
    ├── config.ts         # createReadOnlyApiConfig() — validates host/port
    ├── safety.ts         # validateLocalReadOnlyApiSafety() and text helpers
    ├── fixtures.ts       # LRO_API_CONTRACTS_BUNDLE, LRO_API_DASHBOARD_FIXTURES, etc.
    ├── response.ts       # buildReadOnlyApiResponse(), STANDARD_SAFETY_META
    ├── handlers.ts       # handleHealth(), handleCapabilities(), etc.
    ├── routes.ts         # registerReadOnlyApiRoutes()
    ├── app.ts            # createReadOnlyApiApp() — returns Fastify instance, does NOT listen
    ├── server.ts         # startReadOnlyApiServer() — explicit-only, 127.0.0.1 enforced
    └── index.ts          # Public API barrel
```

---

## Capability Table

| Capability | Value |
|---|---|
| canUseLiveData | **false** — permanently |
| canUseSolanaRpc | **false** — permanently |
| canUseProviderApis | **false** — permanently |
| canAccessPrivateKeys | **false** — permanently |
| canCreateTradeIntents | **false** — permanently |
| canCreateExecutionPlans | **false** — permanently |
| canPaperTrade | **false** — permanently |
| canTrade | **false** — permanently |
| canExecute | **false** — permanently |
| canWriteToDatabase | **false** — permanently |
| canSendTelegramAlerts | **false** — permanently |
| canConstructTransactions | **false** — permanently |
| canSimulateTransactions | **false** — permanently |
| canCreateOrders | **false** — permanently |
| canCreatePositions | **false** — permanently |
| canCalculateLivePnl | **false** — permanently |
| canMutatePriorEvidence | **false** — permanently |
| canRenderUi | **false** — permanently |
| canUseExternalNetwork | **false** — permanently |
| canStartLocalhostServer | **true** — 127.0.0.1 only |
| canServeReadOnlyContracts | **true** |
| canServeFixtureReadModels | **true** |
| fixtureOnly | **true** |
| analysisOnly | **true** |
| nonExecutable | **true** |
| readOnly | **true** |
| localOnly | **true** |

---

## Localhost-Only Rule

The server **must only bind to `127.0.0.1`**.

**Forbidden bind hosts:**
- `0.0.0.0`
- `::`
- `::1`
- `localhost`
- Any external hostname or IP
- Any URL-like string
- Any RPC endpoint

The `createReadOnlyApiConfig()` function enforces this at the config level.
The `startReadOnlyApiServer()` function enforces this again as a final guard before calling `listen`.

Default host: `127.0.0.1`
Default port: `3140`

---

## GET-Only Endpoint List

All endpoints are GET-only. No mutation endpoints exist.

| Path | Description |
|---|---|
| `GET /health` | Server health — fixture-only status, no runtime checks |
| `GET /capabilities` | LocalReadOnlyApiCapabilities — all unsafe flags false |
| `GET /contracts` | Read-Only API contract bundle (from Phase 19) |
| `GET /contracts/openapi-shape` | OpenAPI-like shape for contract documentation |
| `GET /dashboard` | Dashboard contract summary |
| `GET /dashboard/overview` | Dashboard overview panel model |
| `GET /dashboard/replay` | Dashboard replay panel model |
| `GET /dashboard/strategy` | Dashboard strategy panel model |
| `GET /dashboard/evaluation` | Dashboard evaluation panel model |
| `GET /dashboard/evidence` | Dashboard evidence panel model |
| `GET /dashboard/safety` | Dashboard safety panel model |

All responses are deterministic and return the same data on every call.

---

## Response Envelope

Every response is wrapped in a `LroApiResponseEnvelope<T>`:

```typescript
{
  envelopeId: string;
  status: 'ok' | 'degraded' | 'failed' | 'inconclusive';
  data: T | null;
  warnings: string[];
  errors: LroApiErrorDetail[];
  meta: LroApiSafetyMeta;
  generatedAt: string;
}
```

### Safety Metadata

Every response includes a `meta` field:

```typescript
{
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
  localOnly: true,
}
```

No response contains raw `Error` objects or stack traces.

---

## Fastify Usage

### Creating the app without listening

```typescript
import { createReadOnlyApiApp } from '@sonic/read-only-api';

const app = await createReadOnlyApiApp();
// Use app.inject() for testing — no real port is opened
const response = await app.inject({ method: 'GET', url: '/health' });
await app.close();
```

The app **does not listen** when created. You must call `startReadOnlyApiServer()` explicitly to open a port.

### How to start locally

```typescript
import { startReadOnlyApiServer } from '@sonic/read-only-api';

// Starts on 127.0.0.1:3140 by default
const server = await startReadOnlyApiServer();

// Or with custom port:
const server = await startReadOnlyApiServer({ host: '127.0.0.1', port: 8080 });

// To stop:
await server.close();
```

`startReadOnlyApiServer()`:
- Validates config safety before calling listen
- Rejects all forbidden hosts before opening any port
- Binds only to `127.0.0.1`
- Must be called explicitly — never auto-starts

---

## Safety Statement

> **This is fixture-only, read-only, local-only.**
>
> This API shell is NOT trading advice.
> It does NOT provide live data.
> It does NOT produce trade signals.
> It does NOT create trade intents.
> It does NOT create execution plans.
> It does NOT support paper trading.
> It does NOT execute trades.
> It does NOT access wallets or private keys.
> It does NOT connect to Solana RPC, Helius, Yellowstone, Geyser, Jupiter, Raydium, Pump.fun, Jito, or any other live provider.
> It does NOT construct, simulate, sign, or send transactions.
> It does NOT create orders, fills, routes, swaps, positions, or PnL.
> It does NOT render a UI.
> It does NOT write to a database.
> It does NOT send Telegram alerts.
> It does NOT use an external network.
> It does NOT bind to external interfaces.

---

## Future Notes (Not in Phase 20)

> **The following features are NOT in Phase 20 and are listed here for future planning only.**

- Live data integration — future, pending explicit sign-off
- Dashboard UI (React/web) — future, pending explicit sign-off
- Paper trading — future, pending explicit sign-off and paper-gate evidence
- Trade execution — future, far future, requires all prior gates
- Provider API connections — future, requires security review
- External API exposure — future, requires security and operational review
- Database writes — future, separate audit gate
- Authentication / API keys — future, requires security design
- WebSocket streaming — future, requires explicit sign-off

None of these features may be added without explicit phase approval, safety evidence review, and gated implementation.

---

## Tests

Phase 20 adds `tests/phase20.test.ts` with **233 tests** covering:

- All package exports
- Capabilities (unsafe flags false, safe flags true)
- Config defaults (127.0.0.1:3140)
- Config rejections (0.0.0.0, ::, localhost, external hosts, ports)
- Safety validation
- Response builder determinism and safety
- Fastify app creation (no auto-listen)
- All 11 GET endpoints via Fastify inject
- Non-GET methods rejected
- No mutation endpoints
- Fixture integrity
- No forbidden dependencies
- Text safety helpers
- Phase 19 regression guard

Total tests after Phase 20: **3050** (up from 2817).

---

## Phase 21 — Query, Filter, and Pagination

Phase 21 extends the Local Read-Only API Shell with safe, deterministic, fixture-only query parsing, filtering, sorting, and pagination helpers.

### New capabilities (Phase 21)

- `canFilterFixtureData: true` — in-memory enum-safe filtering on fixture data
- `canPaginateFixtureData: true` — in-memory limit/offset/cursor pagination on fixture data
- `canSortFixtureData: true` — in-memory sort on explicit allow-listed fields only

All three remain fixture-only, read-only, analysis-only, and non-executable.

### Endpoints updated

| Endpoint | Phase 21 change |
|---|---|
| `GET /dashboard` | Accepts optional query params |
| `GET /dashboard/evidence` | Accepts optional query params |
| `GET /dashboard/safety` | Accepts optional query params |

All other endpoints are unchanged.

### New response metadata

Query-aware endpoints now include `queryMeta` in the `data` field:

```json
{
  "status": "ok",
  "meta": { "fixtureOnly": true, "liveData": false, ... },
  "data": {
    "queryMeta": {
      "query": { "limit": 25, "offset": 0, "sortBy": "id", ... },
      "appliedFilters": { "filtersActive": false, "fixtureOnly": true, ... },
      "sort": { "sortBy": "id", "sortDirection": "asc", "fixtureOnly": true },
      "pagination": {
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
}
```

### Validation commands (Phase 21)

```sh
pnpm typecheck  # must pass
pnpm lint       # must pass
pnpm test       # must pass (3305 tests, 27 test files)
```

For full query/filter/pagination documentation, see [docs/LOCAL_READ_ONLY_API_QUERY.md](./LOCAL_READ_ONLY_API_QUERY.md).

### Safety invariants (Phase 21 additions)

- Query/filter/pagination is **fixture-only and in-memory** — no external queries, no live data
- Only bounded enum filter values are accepted — unknown values are rejected
- Only explicit sort fields are accepted — arbitrary field paths are rejected
- All array operations are non-mutating
- Cursors are opaque base64url-encoded offsets — no external lookups
- SQL patterns, eval expressions, path traversal, and script patterns are rejected

---

## Phase 22 — Response Contracts, Error Envelope, and Endpoint Documentation v1

Phase 22 adds a **standard JSON response contract layer** to all existing GET endpoints.

### New Envelope Structure

Every endpoint now returns either:
- `ReadOnlyApiSuccessEnvelope<T>` — `ok: true`, `data`, `meta`, `generatedAt`
- `ReadOnlyApiErrorEnvelope` — `ok: false`, `error`, `meta`, `generatedAt`

### New Phase 22 Capabilities

| Capability | Value |
|---|---|
| `canServeResponseEnvelopes` | `true` |
| `canReturnErrorEnvelopes` | `true` |
| `canValidateQueryErrors` | `true` |
| `canProvideDeterministicMetadata` | `true` |
| `canProvideEndpointContracts` | `true` |

### Key Safety Rules (Phase 22)

- `meta.generatedAt` is always `"2026-01-01T00:00:00.000Z"` — never a wall-clock timestamp
- `meta.mutating` is permanently `false`
- `meta.externalNetwork` is permanently `false`
- `meta.fixtureOnly` is permanently `true`
- Error envelopes never expose stack traces, local filesystem paths, or secrets
- Received values in error details are sanitized (secrets and URLs are redacted)

### Validation commands (Phase 22)

```sh
pnpm typecheck  # must pass
pnpm lint       # must pass
pnpm test       # must pass (3751 tests, 28 test files)
```

For full response contract documentation, see [docs/LOCAL_READ_ONLY_API_CONTRACT.md](./LOCAL_READ_ONLY_API_CONTRACT.md).
