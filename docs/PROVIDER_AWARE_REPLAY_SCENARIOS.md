# Provider-Aware Replay Scenarios

## Phase 68 — Provider-Aware Replay and Scenario Generation v1

### Purpose

Phase 68 adds `apps/dashboard/src/provider-aware-replay-scenarios/` as a deterministic, fixture-derived, local-only, read-only provider-aware replay/scenario-generation layer.

### Relationship to Phase 67, 57, and 56

- **Phase 67** supplies sanitized cross-provider quality fixtures as immutable source references.
- **Phase 57** supplies deterministic replay fixture naming/semantics for parity surfaces.
- **Phase 56** supplies deterministic lifecycle event kinds and causal-order-compatible preview models.

### GitHub/source research summary and decisions

Useful references reviewed:

- `https://github.com/Shivay00001/event-sourcing-stream`
  - relevance: TypeScript append-only event log with deterministic replay language.
  - adapted pattern: deterministic replay identity + replayable fixture-first modeling.
  - not copied: repository code, runtime event ingestion logic.

- `https://github.com/ava-avant-iconic/ts-event-sourcing`
  - relevance: TypeScript event-sourcing toolkit with snapshot/replay terminology.
  - adapted pattern: explicit replay expectation surfaces and schema-versioned contracts.
  - not copied: toolkit implementation internals.

- `https://github.com/web3batman/Solana_Memecoin_Sniper_Bot/blob/ef4140a31dcd6e48c9ab92e7d5a63ea7bab864c6/solana-bot-FE/src/services/wallet.ts`
  - relevance: representative unsafe wallet/trading surface in public Solana bot ecosystems.
  - adapted pattern: none; used only as explicit anti-pattern reference.
  - not copied: wallet flows, signing/sending/trading logic.

- `https://github.com/AV1080p/Solana-Sniper-Bot`
  - relevance: representative sniper bot repo with profit-marketing posture.
  - adapted pattern: none; used only for threat-model boundaries.
  - not copied: live trading/routing/runtime bot behavior.

Notes:
- External general-web documentation fetches were unavailable in this environment during this phase run; only accessible GitHub sources were used.

### Unsafe/scam patterns explicitly rejected

- private key, seed phrase, mnemonic, or wallet import/collection flows
- hidden or explicit signing/sending/transaction execution behavior
- forced live RPC/network runtime ingestion in deterministic paths
- postinstall/binary/obfuscated runtime behavior
- recommendation/signal/investment-advice/profit language
- route handlers/runtime requests/UI/DOM/persistence/background job behavior

### Provider-aware import model

Phase 68 models deterministic import envelopes with:

- `importId`, `importName`
- `sourceQualityFixtureName`, `sourceReconciliationIds`, `sourceProviderIds`
- replay/lifecycle source fixture names
- `importedAt` fixed deterministic timestamp
- `importStatus`
- `fixtureOnly: true`, `liveData: false`

### Scenario generation model

Generated scenarios include:

- `scenarioId`, `scenarioName`, `scenarioKind`
- source quality confidence/issues/mismatch references
- provenance mapping references
- generated lifecycle preview references
- expected replay snapshot references
- deterministic safety notes

### Provenance mapping model

Mappings capture provider-field lineage with:

- `provenanceMappingId`
- source provider/field/fixture/phase
- target scenario field path
- confidence label
- deterministic-only marker

### Replay parity check model

Parity checks include:

- expected/observed snapshot ID arrays
- parity status
- mismatch taxonomy and mismatch IDs
- fail-closed behavior for critical mismatches
- deterministic summary

### Fixture regeneration contract model

Regeneration remains contract-only:

- deterministic preview metadata only
- `filesystemWrites: false`
- `downloads: false`
- no export/runtime write behavior

### Lifecycle preview model

Generated lifecycle previews provide:

- event preview IDs
- event kinds derived from Phase 56-compatible taxonomy
- deterministic causal links
- deterministic sequence ordering

### Replay expectation model

Replay expectation models include:

- expected step count
- expected final state kind
- expected mismatch count
- expected fail-closed posture
- deterministic source references

### Observation report model

Provider observation replay reports summarize:

- import, scenario, provenance, parity, regeneration, and safety sections
- deterministic wording with non-advisory safety language

### View model / API contract / selector overview

Phase 68 ships deterministic derived surfaces:

- view models
- list/detail/summary/error API contract fixtures
- pure selectors over fixture tables

No routes, handlers, runtime requests, or rendering are added.

### Capability flags

Positive flags include provider-aware replay scenario generation, import/provenance/parity/regeneration/report/lifecycle expectation/view/API/selector surfaces.

Negative flags remain fixed `false` for live data/network/runtime ingestion/filesystem/download/persistence/wallet/private key/signing/sending/execution/trading signal/recommendation/advice/routes/runtime/UI/DOM/background jobs/real orders/real funds/real PnL/live strategy selection/auto execution.

### Safety constraints

Phase 68 remains:

- read-only
- local-only by default
- deterministic in normal CI
- fixture-backed
- fail-closed
- non-wallet / non-signing / non-sending / non-executing
- non-advisory

And explicitly does **not** add:

- live provider ingestion
- live network in normal CI
- runtime ingestion
- fixture export/download/filesystem writes
- transaction building/signing/sending
- execution/live trading
- recommendations/signals/investment advice
- real orders/funds/PnL
- route handlers/runtime requests
- UI/DOM behavior
- persistence/background jobs

### Validation behavior

Validation rejects:

- wrong phase/schema/meta constants
- duplicate IDs/names and low fixture count
- invalid Phase 67/57/56 practical source references
- import model with `liveData: true`
- generated scenario without provenance refs
- parity checks without expected snapshots
- critical mismatch with fail-closed disabled
- regeneration contract writes/downloads enabled
- invalid lifecycle deterministic order
- invalid replay expectation step count
- unsafe capability drift
- unsafe URL/network/wallet/execution/advisory/secret text patterns
- source fixture snapshot mutation

### Testing summary

`tests/phase68.test.ts` covers:

- source files/docs existence
- constants, names/kinds/count/map/list/get and root export propagation
- fixture structure and Phase 67/57/56 practical linkage
- helper builders and deterministic outputs
- parity, regeneration, report, lifecycle preview, expectation, view/API/selectors
- normalization/serialization/equality/checksum determinism
- validation/safety success and rejection cases
- capability propagation to dashboard and read-only API surfaces
- safety primitive scan checks and Phase 69 preview-only documentation guard

### Explicit non-goals

Phase 68 does not implement:

- live provider expansion
- live network calls in normal CI
- runtime ingestion
- filesystem writes or downloads
- wallet/sign/send/execution behavior
- recommendations/signals/advice
- real orders/funds/PnL
- route handlers/runtime request handling
- UI/DOM rendering
- persistence/background jobs

### Next phase guidance

**Phase 69 — Live Smoke Harness Expansion and Safety Certification v1** is implemented in the current phase lineage.

Next milestone preview only: **Phase 70 — Provider Reliability Telemetry and Drift Audit v1** (not implemented in this document).
