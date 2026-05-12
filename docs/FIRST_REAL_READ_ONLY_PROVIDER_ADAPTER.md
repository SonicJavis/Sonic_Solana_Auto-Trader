# First Real Read-Only Provider Adapter

## Phase 65 — First Real Read-Only Provider Adapter v1

### Purpose

Phase 65 adds `apps/dashboard/src/first-read-only-provider-adapter/` as the first deterministic, fixture-backed, read-only provider adapter foundation.

### Relationship to prior phases

- Phase 64 boundary: fixtures link to Phase 64 boundary fixture names and enforce boundary conformance.
- Phase 63 gate: fixtures link to Phase 63 gate fixture names and remain fail-closed by default.
- Phase 54/55 foundations: contract and mock safety posture remains unchanged (local-only, read-only, deterministic).

### Why the first real provider remains disabled by default

This milestone introduces adapter contracts only. It does not enable live provider behavior in standard CI or default runtime fixture paths.

### Offline fixture mode

All baseline fixtures are offline, deterministic, sanitized, and frozen. No live network is used in normal tests.

### Frozen response fixtures

Fixtures include account info success, mint authority success, token metadata success, provider unavailable, malformed response, rate limited, gate closed, and unsupported write capability.

### Read-only client contract

Client contract supports read-shape methods only and explicitly rejects write/build/sign/send/execute methods.

### Transport boundary

Supported transport kinds:

- `offline_fixture_transport`
- `future_live_smoke_transport_disabled`

Live smoke transport is guard-only and disabled by default.

### Response mapping model

Response mapping covers required normalized boundary fields with deterministic missing-field checks and no-live/no-write assertions.

### Error normalization model

Deterministic categories:

- `provider_unavailable`
- `rate_limited`
- `malformed_response`
- `missing_required_field`
- `unsupported_write_capability`
- `network_access_disabled`
- `gate_closed`
- `live_smoke_disabled`

### Conformance model

Conformance tracks boundary linkage, gate linkage, offline transport behavior, smoke-disabled behavior, and no wallet/sign/send/write capability drift.

### Health model

Deterministic health states include offline-ready, smoke-disabled, configuration-missing, gate-closed, unavailable-fixture, and conformance-failed.

### Smoke guard model

`buildFirstReadOnlyProviderSmokeGuard()` is pure and config-driven. It returns disabled/skipped unless explicit gates are satisfied.

### Safety boundaries

- No wallet logic
- No private key handling
- No signing
- No sending
- No transaction building
- No execution
- No live trading
- No recommendations
- No trading signals
- No investment advice
- No route handlers/endpoints/runtime request handling
- No UI rendering/DOM
- No persistence/background jobs/filesystem writes

### CI and determinism

Standard CI remains offline and deterministic. Live smoke is disabled by default and not run in normal `pnpm test` flows.

### View model/API contract/selector overview

Fixtures include deterministic view models, list/detail/summary/error API contract fixtures, and pure selectors.

### Capability flags

Phase 65 adds positive capability flags for fixtures/contracts/mappings/normalization/conformance/health/smoke/report/view/API/selector surfaces and negative flags that remain `false` for all unsafe/live behaviors.

### Validation behavior

Validation rejects unsafe defaults, write/sign/send/wallet requirements, live smoke unsafe enablement, endpoint/api-key/sdk references, missing required mappings, and unsafe advisory language.

### Testing summary

`tests/phase65.test.ts` covers exports, fixture structures, linkage, helper builders, mappings, errors, conformance, health, smoke guard defaults, reports, selectors, normalization, validation rejection paths, capability propagation, determinism, immutability, and safety scan checks.

### Explicit non-goals

Phase 65 does not implement live provider calls, API keys/secrets, Solana write RPC, wallet/sign/send/write behavior, route handlers, execution logic, real orders, real funds, real PnL, recommendations, signals, or investment advice.

### Next milestone guidance

**Phase 66 — Multi-Provider Read-Only Abstraction and Normalization v1** is next guidance only and is **not implemented** in Phase 65.
