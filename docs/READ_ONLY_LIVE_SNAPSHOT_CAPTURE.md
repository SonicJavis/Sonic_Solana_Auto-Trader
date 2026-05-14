# Read-Only Live Snapshot Capture Contracts v1

## Purpose

Phase 78 adds `apps/dashboard/src/read-only-live-snapshot-capture/` deterministic, fixture-backed, fail-closed contracts for **read-only live snapshot capture modeling only**.

This phase does **not** implement runtime capture, default live network calls, scheduled jobs, filesystem writes, persistence, provider expansion, wallet/signing/sending, execution, recommendations, signals, investment advice, or real funds/orders/PnL.

## Relationship to Prior Phases

Phase 78 links deterministic fixture snapshots from Phase 77/76/75/74/73/72/70/69/68/67/66/65 surfaces.

## Research Summary

Applied references and patterns:

- Solana JSON-RPC read-only retrieval patterns (`getAccountInfo`, `getMultipleAccounts`, `getProgramAccounts`, finalized commitment, bounded batched requests).
- Staged/quarantine architecture patterns with schema validation, provenance labeling, integrity checks, and manual promotion gates.
- GitHub supply-chain/account security guidance for fail-closed controls and strict review boundaries.

Unsafe Solana/sniper repo patterns rejected:

- private key / seed phrase / mnemonic capture
- hidden signing/sending or wallet-drainer transaction paths
- obfuscated payloads and suspicious postinstall scripts
- forced secrets/API keys in deterministic CI paths
- suspicious endpoints/unknown binaries and unrealistic profit claims

No unsafe external code was copied.

## Capture Gate Model

`LiveSnapshotCaptureGate` includes:

- `captureGateId`, `captureGateName`, `phase`
- `gateStatus`, `failClosed`, `unlockAuthority: false`
- `liveCaptureRuntimeAllowed: false`
- `blockingReasonCodes`

## Capture Request Model

`LiveSnapshotCaptureRequest` includes:

- `requestId`, `requestKind`, `targetProviderId`, `requestStatus`
- `readOnly: true`
- `writeMethodAllowed: false`
- `dispatchAllowed: false`

## Provider Target Model

`LiveSnapshotProviderTarget` includes:

- `targetId`, `providerId`, `providerKind`
- `readOnlyEligible`, `capabilityRefs`
- `providerExpansionAllowed: false`

## Capture Scope and Bounds Model

`LiveSnapshotCaptureScope` includes account/mint/pool snapshot booleans and `transactionWriteAllowed: false`.

`LiveSnapshotCaptureBounds` includes deterministic window labels and bounded counts with `usesRuntimeTimers: false` and `scheduledCaptureAllowed: false`.

## Staging and Quarantine Model

`LiveSnapshotResponseStaging` is staged-only with `persisted: false` and `filesystemWriteAllowed: false`.

`LiveSnapshotQuarantineContract` is fail-closed with `promotionAllowed: false`.

## Normalization / Provenance / Integrity Model

- `LiveSnapshotNormalizationContract` enforces deterministic serialization and stable ordering.
- `LiveSnapshotProvenanceContract` carries phase/source fixture refs and docs refs.
- `LiveSnapshotIntegrityContract` carries deterministic checksum and evidence-bundle linkage.

## Schema Validation Model

`LiveSnapshotSchemaValidationContract` captures pass/warning/fail state, warning codes, and review-required signals.

## Promotion Candidate Model

`LiveSnapshotPromotionCandidate` and `LiveSnapshotFixtureCandidateContract` enforce fixture-candidate-only modeling, no automatic promotion, and manual-review requirement.

## Capture Report Model

`LiveSnapshotCaptureReport` includes gate/request/provider/scope/bounds/staging/quarantine/promotion/safety summaries.

## View / API / Selector Overview

- View model: deterministic summary
- API contract: fixture-only list/get shape
- Selector: deterministic fixture lookup by id/name/kind

## Capabilities

Positive flags expose capture contracts, requests, provider targets, scope/bounds, staging/quarantine, normalization/provenance/integrity/schema, promotion candidates, certification reports, view/API/selectors.

Unsafe flags remain `false` for runtime capture, unlock authority, live trading, LIMITED_LIVE/FULL_AUTO unlock, execution/order/transaction/wallet/signing/dispatch, recommendations/signals/advice, real orders/funds/PnL, live network default, scheduled jobs, runtime monitoring/collectors, provider expansion, secrets/API keys required, filesystem/persistence, route/runtime requests, UI/DOM/background jobs, and automatic promotion.

## Validation Behavior

Validation rejects:

- missing required fields / wrong phase / wrong schema/meta
- duplicate IDs/names in fixture tables
- unsafe runtime capture/unlock/write/dispatch/execution states
- scheduled capture/runtime monitoring/provider-expansion toggles
- persistence/filesystem/route/runtime/UI/DOM/automatic-promotion toggles
- advisory/profit/signal/recommendation language
- missing evidence bundle / docs refs / validation command refs / source refs
- unsafe URL/network/secret/wallet/provider-SDK text refs
- mutable source fixture snapshots

## Testing Summary

`tests/phase78.test.ts` covers constants, names/kinds, map/list/get helpers, builders, gate/request/provider/scope/bounds/staging/quarantine/schema/promotion/report/view/API/selector surfaces, normalization/serialization/equality, validation and safety rejection, deterministic rebuilds, source immutability, capability propagation, and Phase 79 preview-only documentation checks.

## Non-Goals

Phase 78 does **not** implement:

- runtime live snapshot capture
- default live network capture
- scheduled capture jobs or runtime monitoring
- provider expansion or new real provider integrations
- transaction building/signing/sending/execution
- wallet/private-key logic
- recommendations/signals/investment advice
- real orders/funds/PnL
- filesystem writes/persistence
- route handlers/runtime requests/UI/DOM/background jobs

READ_ONLY remains default. FULL_AUTO and LIMITED_LIVE remain locked.

## Next Phase Guidance

Phase 79 now consumes Phase 78 snapshot fixture names as deterministic source references for replay-parity audits in `apps/dashboard/src/live-snapshot-replay-parity-audit/`.

Phase 80 now additionally consumes Phase 78 snapshot fixture names for promotion-review candidate linkage in `apps/dashboard/src/live-snapshot-fixture-promotion-review/`.

Next recommended phase (**preview only**): **Phase 81 — Manual-Confirm Execution Boundary Design Contracts v1**.
