# Transaction Construction Contract Mocks v1

## Purpose

Phase 82 adds `apps/dashboard/src/transaction-construction-contract-mocks/` deterministic, fixture-backed, fail-closed contracts for **transaction-construction contract mocks only**.

This phase is contract/model only and does not implement construction.

## Relationship to Prior Phases

Phase 82 links deterministic fixture references from Phase 80/79/78/77/76/75/74/73/72/70/69/68/67/66/65 surfaces.

## Phase 79/80 clean-runner verification outcome

Attempted clean-runner validation before Phase 82 edits:

- `corepack pnpm@10.17.0 install --frozen-lockfile` succeeded but reported ignored build scripts for `better-sqlite3`.
- Full `corepack pnpm@10.17.0 test` remained blocked by environment-native binding error:
  - `Could not locate the bindings file`
  - `better-sqlite3.../better_sqlite3.node`
- Targeted Phase 79/80 verification passed:
  - `corepack pnpm@10.17.0 test tests/phase79.test.ts tests/phase80.test.ts`
- `typecheck`, `lint`, dashboard build, and offline-intelligence build passed pre-edit.

## Research summary

Applied patterns from:

- GitHub protected environments and required reviewers for explicit manual approval boundaries.
- Maker/checker and separation-of-duties fail-closed gate models.
- Solana lifecycle separation (construction, signing, dispatch) with each stage independently denyable by default.
- Rollback/abort control guidance emphasizing no side effects, no timers, and deterministic non-runtime modeling.

## Unsafe Solana/sniper repo patterns rejected

- private key / seed phrase / mnemonic collection and wallet import/export flows
- hidden signing/sending paths and direct order/construction routes
- obfuscated scripts, suspicious postinstall behavior, unknown binary downloaders
- forced secret/API-key gating in deterministic CI paths
- drainer-like transfer loops and unrealistic profit/advisory claims

No unsafe external code was copied.

## Execution boundary gate model

`ExecutionBoundaryGate` includes:

- `boundaryGateId`, `boundaryGateName`, `phase`, `gateStatus`
- `failClosed: true`
- `unlockAuthority: false`
- `constructionAllowed: false`
- `transactionConstructionAllowed: false`
- `transactionSerializationAllowed: false`
- `transactionSimulationAllowed: false`
- `signingAllowed: false`
- `dispatchAllowed: false`
- `sendAllowed: false`
- `blockingReasonCodes`

## Boundary state model

`ExecutionBoundaryState` includes:

- `boundaryStateId`, `boundaryStateKind`, `stateStatus`
- `designOnly: true`
- `liveExecutionAvailable: false`
- `futurePhaseRequired: true`

## Construction/signing/dispatch/wallet denial models

- `ExecutionConstructionDenial`: construction/serialization/simulation blocked
- `ExecutionSigningDenial`: signing and wallet prompt blocked, no key material required
- `ExecutionDispatchDenial`: dispatch/send/network submit blocked
- `ExecutionWalletDenial`: wallet/private-key/keypair handling disabled

## Approval boundary model

`ExecutionApprovalBoundary` enforces:

- `manualApprovalRequired: true`
- `approvalAuthorizesExecution: false`
- `separateExecutionPhaseRequired: true`

## Abort/rollback model

`ExecutionAbortContract` and `ExecutionRollbackContract` enforce:

- `abortModeled: true` / `rollbackModeled: true`
- `runtimeSideEffectsAllowed: false`
- `scheduledTimersAllowed: false`

## Evidence/blocker/capability audit model

- `ExecutionBoundaryEvidence` includes source refs, docs refs, validation command refs, safety grep refs
- `ExecutionBoundaryBlocker` models blocker taxonomy and severity
- `ExecutionBoundaryCapabilityAudit` binds read-only default with FULL_AUTO/LIMITED_LIVE locks

## Source linkage model

Phase 82 includes deterministic linkage models for:

- operator intent (Phase 77)
- dry-run control (Phase 77)
- readiness (Phase 76)
- promotion review (Phase 80)
- risk acknowledgement (Phase 76)

## Report model

`ExecutionBoundaryReport` includes deterministic summaries for gate/state/denials/approval/abort+rollback/evidence/safety.

Reports remain non-advisory and reject profit/signal/recommendation language.

## View/API/selector overview

- view model: deterministic summary lens
- API contract: fixture-only list/get contract shapes
- selector: deterministic fixture lookup by id/name/kind

## Capabilities

Positive flags expose transaction construction mock contract surfaces and linkage/report/validation helpers.

Unsafe flags remain `false` for runtime construction, unlock authority, live trading, LIMITED_LIVE/FULL_AUTO unlock, order creation, transaction building/serialization/simulation/sending, wallet/private-key/keypair/signing/dispatch logic, recommendations/signals/advice, real orders/funds/PnL, live network defaults, scheduled jobs, runtime monitoring/collectors, provider expansion, secrets/API-key requirement, filesystem writes/persistence, route/runtime/UI/DOM/background jobs, and automatic promotion.

## Validation behavior

Validation rejects:

- missing required fields / wrong phase / duplicate IDs and names
- dynamic timestamps and unsafe URL/network/secret/wallet refs
- unlock/construction/construction/serialization/simulation/signing/dispatch/send enablement
- approval authorizing construction or boundary state with `futurePhaseRequired: false`
- runtime side effects, scheduled timers, filesystem/persistence/runtime/UI/DOM/route flags
- advisory/profit language in boundary reports
- missing docs refs, validation refs, source fixture refs
- mutable source fixture snapshots

## Testing summary

`tests/phase81.test.ts` covers constants/names/kinds/map/list/get, all builders and denial models, all 8 fixtures, fail-closed blocking scenarios, normalization/serialization/equality, validation+safety rejection, capability propagation, deterministic rebuilds, source immutability, randomness/network primitive scans, and Phase 79/80 blocker evidence plus Phase 82 preview-only documentation checks.

## Non-goals

Phase 82 does **not** implement:

- transaction construction, serialization, simulation, signing, sending, dispatch, wallet logic, or construction
- order creation or routing
- filesystem writes or persistence
- runtime capture/replay/import
- default live network access
- scheduled jobs/runtime monitoring/runtime collectors
- provider expansion
- recommendations/signals/investment advice
- real orders/funds/PnL
- route handlers/runtime requests/UI rendering/DOM/background jobs

READ_ONLY remains default. FULL_AUTO and LIMITED_LIVE remain locked.

## Next phase guidance

Next recommended phase (**preview only**): **Phase 82 — Transaction Construction Contract Mocks v1**.

Phase 82 is not implemented in this phase.
