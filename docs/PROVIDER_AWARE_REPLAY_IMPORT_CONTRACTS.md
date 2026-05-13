# Provider-Aware Replay Import Contracts

## Phase 73 — Optional Provider-Aware Replay Import Contracts v1

### Purpose

Phase 73 adds `apps/dashboard/src/provider-aware-replay-import-contracts/` as a deterministic, fixture-backed, read-only, fail-closed contract surface for optional replay-import planning and validation only.

### Relationship to Phase 72/71/70/68/67/66/65

- Phase 72 historical snapshot scenario generator fixtures are linked as deterministic scenario sources.
- Phase 71 historical snapshot ingestion contract fixtures are linked as deterministic snapshot sources.
- Phase 70 provider reliability drift fixtures are linked for reliability compatibility and warning/rejection posture.
- Phase 68 provider-aware replay scenarios are linked for scenario-level provenance and compatibility.
- Phase 67 cross-provider quality fixtures are linked for quality compatibility and conflict rejection.
- Phase 66/65 fixture snapshots remain immutable source baselines for provider posture and adapter lineage.

### GitHub/source research summary

Reviewed and adapted high-level patterns from:

- Martin Fowler event-sourcing reference (`martinfowler.com/eaaDev/EventSourcing.html`) for replay/versioned contract boundaries.
- Apache Kafka MirrorMaker 2 checkpoint/offset mapping references (`kafka.apache.org` KIP-382/MM2 docs) for deterministic manifest/checkpoint lineage patterns.
- OpenTelemetry resource/security references (`opentelemetry.io` resource semantic conventions and security concepts) for provenance/integrity metadata framing.
- Public Solana sniper/trading repos discovered by GitHub search for threat-model boundaries only (not copied):
  - `TauriccResearch/Solana-Trading-Bot`
  - `web3batman/Solana_Memecoin_Sniper_Bot`
  - `machenxi/meteora-sniper-bot`

### Unsafe/scam patterns explicitly rejected

- private key / seed phrase / mnemonic collection or export
- hidden transaction signing/sending
- transaction execution / buy / sell / trade flows
- obfuscated or minified runtime payloads
- suspicious install-time behavior (postinstall/drainer patterns)
- forced live network/runtime ingestion/filesystem import
- recommendation/signal/investment-advice/profit language
- runtime request handlers/routes/UI/DOM/background jobs/persistence

### Contract models

Phase 73 provides deterministic models for:

- replay import candidate
- replay import manifest
- replay import source metadata
- replay compatibility contract
- replay gate policy
- replay import plan
- replay import rejection
- replay import normalization contract
- replay import validation contract
- replay import integrity/checksum contract
- replay import provenance contract
- scenario linkage
- snapshot linkage
- reliability linkage
- quality linkage
- replay import audit report
- replay import view model / API contracts / selectors

### Capability flags

Positive Phase 73 capability flags expose deterministic replay-import contract surfaces (candidate/manifest/source/compatibility/gate/plan/rejection/normalization/validation/integrity/provenance/linkage/report/view/API/selector).

Negative capability flags remain locked `false` for live import/runtime import/live ingestion/runtime ingestion/filesystem import/live network/runtime collectors/secrets/API keys/write methods/wallet/private keys/signing/sending/execution/recommendations/signals/investment advice/routes/runtime/UI/DOM/persistence/filesystem writes/background/scheduled jobs/real orders/real funds/real PnL/provider expansion.

### Safety constraints

Phase 73 explicitly does **not** implement:

- live replay import
- runtime replay import
- live ingestion
- runtime ingestion
- filesystem import
- runtime collectors
- default live network access
- secrets/API keys requirements
- provider expansion
- live reconciliation
- filesystem writes/persistence
- write methods
- wallet/signing/sending/transaction building/execution
- recommendations/signals/investment advice
- real orders/funds/PnL
- route handlers/runtime requests
- UI/DOM
- background jobs

### Validation behavior

Validation rejects:

- missing required fields and wrong phase/schema/meta
- duplicate IDs/names
- dynamic timestamps
- live/runtime import or ingestion flags
- unsafe gate policy/import plan requirements
- non-fail-closed blocked/rejected compatibility states
- missing integrity/provenance references
- unsafe network/filesystem/wallet/execution/advisory/secret text patterns
- source fixture snapshot mutation

### Testing summary

`tests/phase73.test.ts` covers:

- file existence and exports
- constants, names/kinds, fixture list/map/get
- all required builder/model layers
- selectors/view/API contracts
- normalization/serialization/equality/checksum determinism
- validation/safety success and unsafe rejection paths
- all 8 required fixtures and fail-closed behavior
- capability propagation to dashboard/read-only-api
- deterministic primitive safety scans
- Phase 74 preview-only documentation guard

### Explicit non-goals

No live replay import, runtime ingestion, filesystem import, persistence, provider expansion, wallet/signing/sending/execution, or advisory/trading behavior is added in Phase 73.

### Next phase guidance

**Phase 74 — Controlled Live Smoke-Test Harness Expansion v1** is preview only and not implemented in Phase 73.
