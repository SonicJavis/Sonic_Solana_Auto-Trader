# Read-Only Provider Adapter Mocks

**Phase 55 — Read-Only Provider Adapter Mocks v1**

---

## Purpose

Phase 55 adds deterministic, local-only, read-only mock provider adapters in `apps/dashboard/src/read-only-provider-adapter-mocks/`.

These adapters are **mock-only**, **fixture-derived**, and **contract-conforming** surfaces that prepare the future adapter layer without enabling any live integration.

---

## Relationship to Phase 54 Provider Contracts

Phase 54 defined provider interface contracts in `apps/dashboard/src/read-only-provider-contracts/`.

Phase 55 builds directly on those contracts by attaching each mock adapter fixture to a stable `sourceProviderContractName` and mirroring the same provider domains as deterministic mock adapter domains.

No real providers are connected.

---

## Relationship to Phase 53 Synthetic Launch Intelligence

Phase 55 mock requests and responses include `sourceSyntheticLaunchFixtureName` references to Phase 53 synthetic launch intelligence scenarios.

Mock result payloads are derived from Phase 53 fixture sections (launch events, token profile, liquidity snapshot, creator profile, holder distribution, wallet cluster, and risk factors), preserving deterministic synthetic behavior.

---

## Why This Is Adapter-Relevant But Still Safe

This phase introduces adapter-shaped fixtures and a pure `runReadOnlyProviderAdapterMock()` helper so future phases can consume adapter-like interfaces now.

Safety is preserved because the implementation is local-only, fixture-only, pure, deterministic, read-only, and explicitly disabled for live behavior.

---

## Mock Adapter Identity Model

Each fixture includes `adapterIdentity`:

- `adapterId`, `adapterName`, `adapterKind`, `adapterDomain`
- `sourceProviderContractName`
- `disabledByDefault`
- `mockOnly: true`
- `readOnly: true`
- `liveNetworkAccess: false`
- `walletAccess: false`
- `executionAccess: false`

Required stable domains:

- `mock_solana_rpc_adapter`
- `mock_pump_launch_adapter`
- `mock_dex_liquidity_adapter`
- `mock_token_metadata_adapter`
- `mock_holder_distribution_adapter`
- `mock_wallet_cluster_adapter`
- `mock_risk_intelligence_adapter`
- `mock_disabled_unsafe_adapter`

---

## Mock Request / Result Model

Each fixture includes deterministic `mockRequest` and `mockResult` shapes.

`mockRequest` includes:

- `requestId`, `requestKind`
- `fixtureOnly: true`, `readOnly: true`
- `domain`
- `sourceSyntheticLaunchFixtureName`
- `requestedResponseKind`
- `unsafeLiveRequested: false`

`mockResult` includes:

- `resultId`, `resultKind`, `statusCode`
- `success`, `matched`
- `data` (synthetic fixture-derived payload)
- `error` (typed deterministic error shape)
- deterministic `meta`
- safety envelope (`nonAdvisory`, `mockOnly`, `noLiveData`)

---

## Mock Capability Profile Model

Each fixture includes `adapterCapabilityProfile` with read-only/fixture-only support enabled and all unsafe capabilities disabled.

---

## Mock Health / Status Profile Model

Each fixture includes `adapterHealthProfile` with deterministic labels:

- health label
- latency bucket
- reliability label
- deterministic failure examples
- `noActualHealthCheck: true`
- `syntheticOnly: true`

No real health checks occur.

---

## `runReadOnlyProviderAdapterMock()` Behavior

`runReadOnlyProviderAdapterMock()` is a pure local function that:

- selects fixture data deterministically
- returns fixture success results for valid mock queries
- returns deterministic typed errors for unsafe or invalid requests:
  - `LIVE_NETWORK_UNAVAILABLE`
  - `PROVIDER_DISABLED`
  - `UNSAFE_CAPABILITY_REQUESTED`
  - `UNSUPPORTED_SYNTHETIC_DOMAIN`
  - `INVALID_DETERMINISTIC_MOCK_QUERY`

No runtime request objects, endpoints, or network clients are used.

---

## View Model / API Contract / Selector Overview

Phase 55 includes:

- view-model builder (`buildReadOnlyProviderAdapterMockViewModel`)
- API contract fixture builder (`buildReadOnlyProviderAdapterMockApiContract`) for list/detail/summary/error
- selector helper (`selectReadOnlyProviderAdapterMockFixture`) for pure local fixture selection

These are dashboard/API-friendly data shapes only, with no rendering and no runtime request parsing.

---

## Capability Flags

Positive flags:

- `readOnlyProviderAdapterMocks`
- `syntheticReadOnlyProviderAdapterMocks`
- `deterministicReadOnlyProviderAdapterMocks`
- `localOnlyReadOnlyProviderAdapterMocks`
- `fixtureDerivedReadOnlyProviderAdapterMocks`
- `pureReadOnlyProviderAdapterMocks`
- `readOnlyProviderAdapterMockViewModels`
- `readOnlyProviderAdapterMockApiContracts`
- `readOnlyProviderAdapterMockSelectors`

Negative flags are all `false` for live data, network access, real adapters, RPC/WebSocket/Geyser, integrations, persistence/filesystem/downloads, route/server/runtime handling, rendering/DOM, background jobs, wallet/signing/sending, execution, and advisory outputs.

---

## Safety Constraints

Phase 55 explicitly keeps all behavior synthetic and local-only:

- no live data
- no real provider adapters
- no Solana RPC
- no WebSockets/Geyser/Yellowstone
- no Pump.fun/Jupiter/Raydium/Orca/Meteora integration
- no wallet/private key/signing/sending
- no execution
- no recommendations/trading signals/investment advice
- no real endpoints/routes/handlers
- no runtime request handling
- no UI rendering/DOM
- no persistence/background jobs

---

## Validation Behavior

`validateReadOnlyProviderAdapterMockFixture()` validates structure, deterministic phase/meta/source/seed constants, stable names/kinds/domains, identity/capability/health/request/result/view-model/API-contract/selector shapes, capability flags, and safety envelopes.

`validateReadOnlyProviderAdapterMockSafety()` recursively scans string fields and rejects unsafe patterns (URLs, network calls, filesystem usage, server/runtime behavior, wallet references, execution/advisory text).

---

## Testing Summary

`tests/phase55.test.ts` covers:

- file existence and public exports
- constants, names, kinds, fixture count/map/list/get
- deterministic builders
- adapter identity/capability/health/request/result structures
- `runReadOnlyProviderAdapterMock()` success and typed error paths
- Phase 54 contract linkage and Phase 53 fixture linkage
- view models, API contracts, selectors
- normalization/serialization/equality and deterministic checksum
- validation success/failure and safety rejection
- capability flags and dashboard/read-only-api propagation
- determinism, source immutability, and unsafe-pattern absence checks
- aggressive-safe alignment and Phase 56 preview-only guard

---

## Explicit Non-Goals

Phase 55 does **not** implement:

- live provider adapters
- network clients
- Solana RPC/WebSocket/Geyser connections
- DEX/provider SDK integrations
- wallet/private key handling
- transaction signing/sending
- execution/trading systems
- recommendations, signals, or investment advice
- HTTP endpoints/route handlers/runtime request handling
- UI rendering/DOM features
- filesystem writes/download exports
- persistence, queue workers, or scheduled/background jobs

---

## Next Milestone Guidance

**Phase 56 — Synthetic Event Stream Lifecycle v1** is the next recommended milestone.

Phase 56 is **preview guidance only** in this document and is **not implemented** in Phase 55.
