# Manual-Confirm Live Dry-Run Control Contracts v1

## Purpose

Phase 77 adds `apps/dashboard/src/manual-confirm-dry-run-control/` as deterministic, fixture-backed, fail-closed contracts for manual-confirm **dry-run control modeling only**.

This phase does not unlock live trading, does not authorize execution, and does not implement manual-live trading flows.

## Relationship to Prior Phases

Phase 77 links fixture references from Phase 76/75/74/73/72/70/69/68/67/66/65 surfaces for dry-run preflight and evidence traceability.

## Research Summary

Applied guidance:

- GitHub environment protection/required reviewer fail-closed approval patterns.
- Two-step confirmation and maker/checker separation patterns.
- Solana read-only boundary guidance separating data reads from signing/sending responsibilities.

Unsafe Solana repo patterns explicitly rejected:

- private key / seed phrase / mnemonic capture flows
- hidden signing/sending and wallet manager execution paths
- obfuscated payloads and suspicious install-time/postinstall behavior
- forced secret/API-key gating in deterministic CI paths
- drainer-like transfer logic and unrealistic profit claims

No unsafe external code was copied.

## Dry-Run Gate Model

`ManualConfirmDryRunGate` includes:

- `dryRunGateId`, `dryRunGateName`, `dryRunGateKind`, `phase`
- `gateStatus`, `failClosed`, `unlockAuthority: false`
- `dryRunOnly: true`, `liveExecutionAllowed: false`
- `blockingReasonCodes`

## Operator Intent Model

`ManualConfirmOperatorIntent` includes:

- `intentId`, `intentKind`, `operatorIntentLabel`, `intentStatus`
- `orderCreationAllowed: false`
- `transactionConstructionAllowed: false`
- `dispatchAllowed: false`

## Preflight Model

`ManualConfirmDryRunPreflight` includes:

- `preflightId`
- `sourceReadinessRefs`, `sourceCertificationRefs`, `sourceSmokeRefs`
- `preflightStatus`, `failClosed`

## Dispatch Block Model

`ManualConfirmDispatchBlock` includes:

- `blockId`, `blockKind`
- `dispatchBlocked: true`, `transactionSendBlocked: true`
- `reasonCodes`, `safetyNotes`

## Abort / Cancellation Models

`ManualConfirmAbortContract` and `ManualConfirmCancellationContract` include:

- `abortId` / `cancellationId`
- `abortAllowed: true` / `cancellationAllowed: true`
- `automaticTransitionAllowed: false`
- `usesRuntimeTimers: false`
- deterministic `status`

## Confirmation Snapshot Model

`ManualConfirmConfirmationSnapshot` includes:

- `snapshotId`
- `sourceManualConfirmReadinessRef`
- `phraseSnapshotRef`, `roleSeparationSnapshotRef`, `coolingOffSnapshotRef`
- `snapshotStatus`

## Simulated Decision Model

`ManualConfirmSimulatedDecision` includes:

- `decisionId`, `decisionKind`, `decisionStatus`
- `dryRunDecisionOnly: true`
- `advisoryOutput: false`
- `recommendationOutput: false`
- `signalOutput: false`

## Evidence Model

`ManualConfirmDryRunEvidence` includes:

- `evidenceBundleId`
- `sourcePhaseRefs`, `sourceFixtureRefs`
- `validationCommandRefs`, `safetyGrepRefs`, `docsRefs`
- `evidenceComplete`

## Capability Audit Model

`ManualConfirmDryRunCapabilityAudit` enforces read-only default and locked FULL_AUTO/LIMITED_LIVE/no unlock/no order/no transaction/no dispatch/no execution invariants.

## Safety Invariant Model

`ManualConfirmDryRunSafetyInvariant` binds invariant result to evidence reference and fail-closed posture.

## Linkage Models

- `ManualConfirmDryRunReadinessLinkage` (Phase 76)
- `ManualConfirmDryRunCertificationLinkage` (Phase 75)
- `ManualConfirmDryRunSmokeLinkage` (Phase 74/69)
- `ManualConfirmDryRunReplayLinkage` (Phase 73/72/70/68)

## Scorecards and Reports

`ManualConfirmDryRunScorecard` and `ManualConfirmDryRunReport` provide deterministic summaries of gate/intent/preflight/control/dispatch/abort/decision/evidence/safety status.

## View / API / Selector Overview

- View model: deterministic summary surface
- API contract: fixture-only list/get shape
- Selector: deterministic fixture selection by id/name/kind

## Capabilities

Positive capability flags expose dry-run control contract surfaces.

Negative capability flags keep unlock authority, live trading, manual-live implementation, execution, order creation, transaction building/sending, wallet/signing/private-key handling, dispatch, advisory outputs, real funds/orders/PnL, live network defaults, runtime jobs/monitoring, provider expansion, secrets requirements, filesystem/persistence, route/runtime/UI/DOM/background behavior disabled.

## Validation Behavior

Validation rejects:

- missing required fields and wrong phase/schema/meta
- duplicate IDs/names in fixture tables
- unsafe unlock/live/order/transaction/dispatch/execution toggles
- automatic transitions/runtime timers
- advisory/recommendation/signal/profit language
- missing evidence/docs/validation refs
- unsafe URL/network/secret/wallet/provider-SDK text refs
- mutable source fixture snapshots

## Testing Summary

`tests/phase77.test.ts` covers constants, fixtures/map/list/get, required builders, selectors, normalization/serialization/equality, validation/safety rejection, scenario fixtures, fail-closed behavior, capability propagation, deterministic rebuilds, primitive/randomness safety scans, and Phase 78 preview-only documentation checks.

## Non-Goals

Phase 77 does **not** implement:

- manual live trading
- unlock authority for LIMITED_LIVE or FULL_AUTO
- order creation, transaction building/signing/sending
- wallet/private key/seed phrase/keypair logic
- dispatch/execution engines
- recommendations/signals/investment advice
- real orders/funds/PnL
- live network defaults in standard CI
- scheduled jobs/runtime monitoring/runtime collectors
- provider expansion
- secrets/API keys required in deterministic CI paths
- filesystem writes/persistence
- route handlers/runtime requests
- UI rendering/DOM/background jobs

READ_ONLY remains default. FULL_AUTO and LIMITED_LIVE remain locked.

## Next Phase Guidance

Next recommended phase (implemented): **Phase 78 — Read-Only Live Snapshot Capture Contracts v1**.
Historical note: Phase 78 was previously listed as **preview only** before implementation.

Next recommended preview-only phase: **Phase 79 — Live Snapshot to Replay Parity Audit Contracts v1**.

Phase 81 execution-boundary design contracts additionally consume Phase 77 dry-run fixture names for deterministic operator-intent and dry-run linkage references.
