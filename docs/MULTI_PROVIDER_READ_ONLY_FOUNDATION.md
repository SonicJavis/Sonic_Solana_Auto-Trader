# Multi-Provider Read-Only Foundation

## Phase 66 — Multi-Provider Read-Only Foundation v1

### Purpose

Phase 66 adds `apps/dashboard/src/multi-provider-read-only-foundation/` as a deterministic, fixture-backed, local-only, read-only multi-provider foundation that sits on top of the Phase 65 first adapter, Phase 64 boundary, Phase 63 gate, and earlier provider contract/mock layers.

### Relationship to Phase 65 / 64 / 63

- **Phase 65 adapter linkage:** provider entries reference Phase 65 first-read-only adapter fixture names.
- **Phase 64 boundary linkage:** provider entries reference Phase 64 boundary fixture names.
- **Phase 63 gate linkage:** provider entries reference Phase 63 gate fixture names and selection enforces safe gate references only.

### GitHub/source research summary and decisions

Useful sources reviewed:

- `https://github.com/solana-labs/solana-web3.js`
  - relevant pattern: keep provider interactions wrapped behind explicit client interfaces and avoid side-effectful defaults.
  - applied decision: Phase 66 remains provider-interface/fixture driven, with no implicit runtime network behavior.
  - not copied: no runtime Solana client code, no transaction/send logic, no live RPC use.

- `https://raw.githubusercontent.com/AV1080p/Solana-Sniper-Bot/master/README.md`
- `https://raw.githubusercontent.com/TauriccResearch/Solana-Trading-Bot/master/README.md`
- `https://raw.githubusercontent.com/hanshaze/solana-sniper-copy-mev-trading-bot/master/README.md`
  - relevant pattern (rejected): funded-wallet private key workflows, live RPC/WebSocket requirements, live buy/sell execution loops, and promotional profit language.
  - applied decision: explicit validation rejects wallet/sign/send/execute/advisory drift, and fixtures remain deterministic with no live runtime calls.
  - not copied: any key handling, transaction execution, live protocol integrations, bot runtime logic, or promotional/referral mechanics.

### Unsafe/scam patterns explicitly rejected

- private key / seed phrase / wallet import requirements
- hidden or explicit transaction sending / swap execution paths
- obfuscated execution or remote runtime code fetch patterns
- forced live RPC/WS defaults in deterministic paths
- Telegram/Discord pay-to-unlock and unrealistic profit claims
- API-key/secrets/provider-SDK references in fixture source paths

### Provider registry model

Each fixture defines a deterministic registry with:

- `providerRegistryId`
- `registryName`
- `providerEntries`
- `defaultProviderOrder`
- `disabledProviderEntries`
- `gateRequired`
- `boundaryRequired`
- `adapterRequired`

### Provider normalization model

Fixtures include deterministic normalized records with:

- `normalizedProviderRecordId`
- `providerId`
- `normalizedFields`
- `missingFields`
- `semanticCaveats`
- `sourceFixtureRefs`

### Health scoring model

Deterministic health entries expose:

- `healthScoreId`
- `providerId`
- `status`
- `score`
- `reasonCodes`
- `staleDataImpact`
- `gateImpact`
- `conformanceImpact`

### Stale-data detection model

Synthetic stale checks include:

- `staleDataCheckId`
- `providerId`
- `observedAt` (deterministic constants only)
- `freshnessWindow`
- `stale`
- `staleReason`
- `deterministicOnly`

### Freshness policy model

Read-only freshness policy model includes:

- `policyId`
- `policyName`
- `maxAgeMs`
- `staleAction`
- `failClosed`
- `noLiveRefresh`

### Cache-policy contract model

Read-only cache policy contracts include:

- `cachePolicyId`
- `policyName`
- `fixtureOnly`
- `persistentCache: false`
- `filesystemCache: false`
- `browserCache: false`
- `deterministicTtlMs`

### Provider selection/fallback model

Selection and fallback fixtures provide:

- deterministic selected provider IDs and fallback IDs
- fail-closed selection semantics
- unsafe fallback blocking
- no-live-call selection behavior

### Conformance/report model

Conformance tracks linkage and safety across Phase 65/64/63 references and registry order validity. Reports summarize registry/health/stale/freshness/cache/selection/fallback plus safety posture.

### View model / API contract / selector overview

Phase 66 includes deterministic:

- view models for dashboard/read-only API consumption
- list/detail/summary/error API contract fixtures
- pure selector helpers over local fixture tables

### Capability flags

Phase 66 adds positive flags for multi-provider registry/normalization/health/stale/freshness/cache/selection/fallback/conformance/view/API/selector surfaces, and negative flags fixed to `false` for live network, wallet, signing, sending, execution, advisory, runtime routes/requests, UI/DOM, persistence/background jobs, and real orders/funds/PnL.

### Safety constraints

Phase 66 remains:

- read-only
- local-only by default
- deterministic in normal CI
- fixture-backed
- fail-closed
- non-wallet / non-signing / non-sending / non-executing
- non-advisory

### Validation behavior

Validation rejects:

- missing required fields and wrong phase/schema
- duplicate fixture/provider identifiers
- invalid provider order or invalid Phase 65/64/63 source references
- non-deterministic stale timestamps
- unsafe provider defaults/capabilities
- unsafe cache/freshness policy mutations
- unsafe fallback and gate-bypass selection
- unsafe network/wallet/execution/advisory text patterns
- source fixture snapshot mutation

### Testing summary

`tests/phase66.test.ts` covers exports, fixture cardinality, builders, registry/normalization/health/stale/freshness/cache/selection/fallback/conformance/report/view/API/selector helpers, deterministic normalization/serialization/equality, safety validation success/failure paths, Phase 65/64/63 linkage, capability propagation, deterministic scan checks, and Phase 67 preview guard.

### Explicit non-goals

Phase 66 does not add:

- new real provider clients
- live network calls in normal CI
- wallet/private-key/sign/send/execute logic
- transaction building
- real orders/funds/PnL
- recommendations/signals/investment advice
- route handlers/runtime request handling
- UI/DOM rendering
- persistence/filesystem writes/background jobs

### Next phase guidance

**Phase 67 — Cross-Provider Data Quality and Reconciliation v1** is implemented in the current phase.

Next milestone preview only: **Phase 68 — Provider-Aware Replay and Scenario Generation v1** (not implemented in this document).
