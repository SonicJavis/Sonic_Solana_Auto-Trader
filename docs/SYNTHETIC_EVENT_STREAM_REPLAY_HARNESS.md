# Synthetic Event Stream Replay Harness

**Phase 57 — Synthetic Event Stream Replay Harness v1**

## Purpose

Phase 57 adds a deterministic synthetic replay harness in `apps/dashboard/src/synthetic-event-stream-replay-harness/`.

The harness replays Phase 56 synthetic lifecycle events step-by-step, derives replay snapshots, compares expected snapshots, and emits deterministic replay reports.

## Relationship to Phase 56 lifecycle fixtures

Phase 57 builds strictly on Phase 56 lifecycle fixtures and reducer behavior.

Each Phase 57 replay fixture references exactly one Phase 56 lifecycle fixture name and replays only that source fixture stream.

## Why deterministic replay matters

Deterministic replay provides repeatable validation of fixture-derived lifecycle transitions and mismatch detection.

It creates a stable baseline for future gated risk-model phases while staying synthetic, local-only, and non-executable.

## Replay identity model

Each replay fixture includes `replayIdentity` with:

- replay ID/name/kind
- source Phase 56 fixture name
- schema version
- deterministic seed
- deterministic generated-at constant

## Replay clock model

Replay clock values are fixed deterministic timestamps.

`buildSyntheticEventStreamReplayClock()` returns pure clock state for each replay step index with no timers, no runtime clocks, and no dynamic date construction.

## Replay step model

Each replay step includes:

- step ID and sequence
- source event ID/kind
- deterministic clock timestamp
- input/output state IDs
- expected/actual snapshot IDs
- mismatch list
- safety notes

## Snapshot model

Each replay snapshot includes:

- snapshot ID and sequence
- source event reference
- lifecycle state checksum
- selected state summary
- deterministic timestamp
- schema version

## Replay report model

Each replay report includes:

- report ID and replay status
- total events/steps
- passed/failed steps
- mismatch count
- final state ID
- snapshot checksums
- deterministic summary, validation summary, and safety summary

No advisory output is produced.

## Mismatch taxonomy

Phase 57 deterministic mismatch kinds:

- `missing_expected_snapshot`
- `snapshot_checksum_mismatch`
- `state_summary_mismatch`
- `event_sequence_mismatch`
- `causal_parent_mismatch`
- `schema_version_mismatch`
- `unsafe_replay_input_rejected`
- `replay_source_fixture_not_found`

## Harness behavior

`runSyntheticEventStreamReplayHarness()`:

- accepts deterministic fixture-derived replay input
- replays Phase 56 events using the Phase 56 reducer
- derives snapshots per replay step
- compares expected vs actual snapshots
- emits deterministic typed report/result data
- remains pure and side-effect-free

No network, filesystem, runtime request handling, or mutation side effects occur.

## View model / API contract / selector overview

Phase 57 includes:

- replay harness view-model builder (`buildSyntheticEventStreamReplayHarnessViewModel`)
- replay harness API contract builder (`buildSyntheticEventStreamReplayHarnessApiContract`) for list/detail/summary/error fixtures
- pure selectors over replay fixtures, snapshots, reports, and summary contracts

No endpoint handlers or runtime request parsing are introduced.

## Capability flags

Phase 57 enables replay harness fixture/replay-clock/step/snapshot/report/view-model/contract/selector flags.

All unsafe flags remain `false`, including live data, network access, real providers, provider adapters, Solana RPC, WebSockets/Geyser/Yellowstone, Pump.fun/Jupiter/Raydium/Orca/Meteora/Jito integrations, persistence/filesystem/downloads, route/server/runtime handling, UI/DOM, background jobs, wallet/key/signing/sending, execution, signals/recommendations/advice, paper simulation, and live execution.

## Safety constraints

Phase 57 remains:

- synthetic
- local-only
- read-only
- deterministic
- fixture-derived
- replay-only
- non-networked
- non-wallet
- non-executing
- non-advisory

Explicitly not allowed:

- live data
- real provider adapters
- Solana RPC
- WebSockets/Geyser/Yellowstone
- Pump.fun/Jupiter/Raydium/Orca/Meteora integration
- wallet/private keys/signing/sending
- execution
- recommendations/trading signals/investment advice
- real endpoints/routes/handlers
- runtime request handling
- UI rendering/DOM
- persistence/background jobs
- paper simulation

## Validation behavior

`validateSyntheticEventStreamReplayHarnessFixture()` validates phase/schema/name/kind stability, source fixture references, deterministic replay identity/clock metadata, step ordering, snapshot schema/checksum shape, report totals, capability flags, and safety envelopes.

`validateSyntheticEventStreamReplayHarnessSafety()` rejects unsafe URL/network/filesystem/runtime/wallet/execution/provider/advisory content patterns.

## Testing summary

`tests/phase57.test.ts` covers constants/fixtures/map/list/get, builder helpers, replay identity/clock/steps/snapshots/reports, comparator taxonomy, replay harness behavior, source Phase 56 linkage, deterministic reducer integration, normalization/serialization/equality, selectors, view models, contracts, validation success/failure and safety rejection paths, capability propagation, determinism, immutability, and unsafe-pattern absence checks.

## Explicit non-goals

Phase 57 does not implement:

- paper simulation
- live providers
- network adapters
- Solana RPC/WebSocket/Geyser clients
- wallet/key handling/signing/sending
- execution or trading actions
- recommendations/signals/investment advice
- route handlers or runtime request handling
- UI rendering/DOM behavior
- persistence/filesystem exports/downloads

## Next milestone guidance

**Phase 58 — Launch Risk Engine v1** is the next recommended milestone.

Phase 58 is preview guidance only in this document and is not implemented in Phase 57.
