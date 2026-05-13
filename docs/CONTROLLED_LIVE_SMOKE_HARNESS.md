# Controlled Live Smoke-Test Harness Expansion v1

**Phase 74 — Deterministic, fixture-backed, disabled-by-default live-smoke harness contracts**

---

## Purpose

Phase 74 introduces a controlled live-smoke harness expansion: a fully deterministic, fixture-backed collection of contract models and certification surfaces for an optional, manually gated, read-only live-smoke harness. All live-smoke behavior remains **disabled/skipped by default** in standard CI. No live network calls, no runtime monitoring, no secrets required, no wallet or execution logic.

This phase defines the *contracts and plans* that would govern a manually triggered read-only smoke check — not an implementation of one.

Current upstream phase status: Phase 75 and Phase 76 readiness-contract layers are implemented; smoke harness remains read-only and does not authorize live execution.

---

## Relationship to Prior Phases

| Phase | Foundation Used |
|-------|----------------|
| Phase 65 | First read-only provider adapter — source fixture names |
| Phase 69 | Live smoke safety certification — certification fixture linkage |
| Phase 70 | Provider reliability drift audit — eligibility linkage |
| Phase 73 | Provider-aware replay import contracts — replay linkage |

All eight fixtures reference deterministic fixture snapshots from these phases.

---

## Research Summary

Research was conducted on:

- **Disabled-by-default smoke test harness design**: Pattern of having smoke tests guarded by environment flags that are never set in standard CI (GitHub Actions `workflow_dispatch` / `manual` triggers).
- **Manually triggered smoke tests in CI**: GitHub Actions `workflow_dispatch` with explicit manual inputs provides the safest pattern for optional live checks — jobs do not run automatically on push/PR.
- **Read-only provider smoke check contracts**: Solana RPC read-only methods (`getHealth`, `getVersion`, `getSlot`) are safe polling targets — no transaction capability required.
- **Fail-closed smoke guard policies**: Industry standard is to treat any missing configuration as a `skip` rather than `fail` for smoke harnesses — preventing CI breakage when live infrastructure is unavailable.
- **Deterministic offline test separation**: Vitest's describe/skip patterns and environment-flag guards keep live smoke jobs entirely separate from deterministic CI.
- **Secrets/API key safety**: Optional smoke checks that require provider keys must never require those keys in standard CI paths.

### Unsafe/Scam Patterns Rejected

The following patterns found in publicly visible Solana trading repos were **not adapted**:

- Private key / seed phrase collection in `.env` files without isolation guards
- Obfuscated transaction-signing flows presented as "read-only" monitoring
- Auto-swap/sniper bots with hardcoded Jupiter/Raydium endpoints
- Telegram/Discord pay-to-unlock gating with unrealistic profit claims
- Postinstall scripts that establish live WebSocket connections
- Token-drainer patterns disguised as portfolio trackers
- Forced provider SDK imports with live HTTP in module load paths
- Hidden `sendTransaction` calls in "analysis" utilities

No code from these sources was used.

---

## Smoke Plan Model

A `SmokePlan` defines the intent and constraints of a single smoke check candidate:

```
smokePlanId          — unique plan identifier
smokePlanName        — human-readable name
smokePlanKind        — one of: offline_fixture_only | manual_only | read_only_check |
                       replay_linked | reliability_linked | certification_linked
phase                — always 74
targetProviderId     — provider under consideration
sourceCertificationFixtureName — Phase 69 certification fixture reference
fixtureOnly          — always true
disabledByDefault    — always true
liveNetworkDefault   — always false
failClosed           — always true
```

---

## Manual Enable Policy Model

A `ManualEnableSmokePolicy` models the approval gate required before any live smoke check:

```
policyId                    — unique policy identifier
policyName                  — human-readable name
requiresManualTrigger       — always true
requiresExplicitFlag        — always true
allowsStandardCi            — always false
allowsScheduledRuns         — always false
requiresSecretsInCi         — always false
failClosed                  — always true
```

---

## Guard Contract Model

A `SmokeGuardContract` is the fail-closed gate that determines whether a smoke check can proceed:

```
guardId                     — unique identifier
guardState                  — disabled | skipped | blocked | manual_approval_required
defaultDecision             — always 'skipped'
liveNetworkAllowedByDefault — always false
unsafeCapabilityDetected    — boolean
reasonCodes                 — list of rejection reasons
failClosed                  — always true
```

---

## Read-Only Check Contract Model

A `ReadOnlySmokeCheckContract` defines the safe parameters of a single read-only check:

```
checkId                — unique identifier
checkKind              — check category string
readOnly               — always true
mutationAllowed        — always false
transactionAllowed     — always false
expectedOutcome        — description of expected fixture result
deterministicFixtureOnly — always true
```

---

## Eligibility Model

A `SmokeEligibilityModel` captures provider suitability for optional manual smoke:

```
eligibilityId              — unique identifier
providerId                 — provider under evaluation
reliabilityCompatible      — linked to Phase 70 drift audit
certificationCompatible    — linked to Phase 69 certification
replayImportCompatible     — linked to Phase 73 replay import
eligibleForManualSmoke     — derived boolean
ineligibleReasonCodes      — reasons if not eligible
failClosed                 — always true
```

---

## Environment Contract Model

A `SmokeEnvironmentContract` captures the CI/manual environment constraints:

```
environmentContractId           — unique identifier
standardCiMode                  — true for standard CI scenarios
manualOnlyMode                  — true for manual-trigger scenarios
networkDisabledByDefault        — always true
secretsRequiredInStandardCi     — always false
providerKeyRequiredInStandardCi — always false
```

---

## Secret Denial Contract Model

A `SmokeSecretDenialContract` explicitly models the absence of secret requirements:

```
denialId                    — unique identifier
deniesSecretRead            — always true
deniesSecretLogging         — always true
deniesApiKeyRequirementInCi — always true
safetyNotes                 — human-readable safety note
```

---

## Result / Skip Fixture Models

`SmokeResultFixture` and `SmokeSkipFixture` model deterministic outcomes:

```
SmokeResultFixture:
  resultId, resultKind, status, skipped, disabled,
  providerId, checkedAt (deterministic), liveNetworkUsed: false, safetySummary

SmokeSkipFixture:
  skipId, skipKind, reason, standardCi, manualTriggerRequired, failClosed: true
```

---

## Failure Taxonomy

`SmokeFailureTaxonomy` categorizes possible guard/eligibility failures:

```
Kinds: guard_fail_closed | missing_manual_enable | unsafe_capability_detected |
       reliability_drift_detected | secret_required_in_ci | provider_not_eligible |
       environment_mismatch | certification_missing | replay_import_incompatible

Severities: warning | error | critical
```

---

## Certification Report Model

`SmokeCertificationReport` is the top-level summary view:

```
reportId, planSummary, guardSummary, eligibilitySummary,
environmentSummary, resultSummary, failureSummary, safetySummary
```

---

## View Model / API Contract / Selector Overview

- **`SmokeReadinessViewModel`**: Pure derived surface combining fixtureName, guardState, readinessStatus, summary
- **`SmokeApiContract`**: Deterministic list/get contract fixture — no route handler, no runtime, fixtureOnly
- **`SmokeSelector`** / **`selectControlledLiveSmokeHarnessFixture()`**: Pure lookup over fixture array

---

## Capability Flags

## Phase 75 Linkage

Phase 75 pre-live safety certification consumes Phase 74 fixture names as deterministic smoke-readiness linkage inputs only. This linkage is contract-only and fail-closed, and does not enable live/manual trading, execution, or any runtime smoke behavior.

### Positive flags (true)
`controlledLiveSmokeHarness`, `deterministicSmokeHarnessFixtures`, `disabledByDefaultSmokePlans`,
`manualEnableSmokePolicies`, `smokeGuardContracts`, `readOnlySmokeCheckContracts`,
`smokeEligibilityModels`, `smokeEnvironmentContracts`, `smokeSecretDenialContracts`,
`smokeResultFixtures`, `smokeSkipFixtures`, `smokeFailureTaxonomy`, `smokeCertificationReports`,
`smokeReadinessViewModels`, `smokeApiContracts`, `smokeSelectors`

### Negative flags (false)
`smokeLiveNetworkDefault`, `smokeRunsInStandardCi`, `smokeScheduledRuns`,
`smokeRuntimeMonitoring`, `smokeRuntimeCollectors`, `smokeSecretsRequired`,
`smokeProviderExpansion`, `smokeWriteMethods`, `smokeWalletLogic`,
`smokePrivateKeyHandling`, `smokeSigning`, `smokeTransactionSending`, `smokeExecution`,
`smokeTradingSignals`, `smokeRecommendations`, `smokeInvestmentAdvice`,
`smokeRouteHandlers`, `smokeRuntimeRequests`, `smokeUiRendering`, `smokeDomAccess`,
`smokePersistence`, `smokeFilesystemWrites`, `smokeBackgroundJobs`, `smokeScheduledJobs`,
`smokeRealOrders`, `smokeRealFunds`, `smokeRealPnL`

---

## Safety Constraints

- **Disabled/skipped by default** — live smoke never runs in standard CI
- **No live network in standard CI** — all results are fixture-backed
- **No scheduled smoke jobs** — no cron, no timers, no auto-trigger
- **No runtime monitoring** — no collectors, exporters, or observers
- **No secrets/API keys required** in deterministic paths
- **No provider expansion** — no new live provider clients added
- **No live replay import** — contracts only, no live ingestion
- **No filesystem reads/writes** — pure in-memory, no persistence
- **No wallet/signing/sending** — no private keys, no transaction building
- **No execution/live trading** — no buy/sell/swap logic
- **No recommendations/signals/advice** — non-advisory by design
- **No real orders/funds/PnL** — fixture values only
- **No route handlers/runtime requests** — no server endpoints
- **No UI/DOM** — headless, no browser APIs
- **No background jobs/workers** — no async background processes

---

## Validation Behavior

`validateControlledLiveSmokeHarnessFixture()` rejects:

- Wrong phase (must be 74)
- Invalid fixture name or kind
- Invalid schema version or generatedAt timestamp
- `smokePlan.disabledByDefault !== true`
- `smokePlan.liveNetworkDefault !== false`
- `guardContract.liveNetworkAllowedByDefault !== false`
- `guardContract.defaultDecision !== 'skipped'`
- `manualEnablePolicy.allowsStandardCi !== false`
- `manualEnablePolicy.allowsScheduledRuns !== false`
- `environmentContract.secretsRequiredInStandardCi !== false`
- `resultFixture.liveNetworkUsed !== false`
- Missing safety summary
- Unsafe URL/network/wallet/execution/secret text in fixture fields

`validateControlledLiveSmokeHarnessSafety()` separately checks safety invariants only.

`validateControlledLiveSmokeHarnessFixtureTable()` additionally checks for duplicate IDs/names.

---

## Testing Summary

`tests/phase74.test.ts` covers:

- Module file existence (all 23 files)
- Constants (phase, names, kinds, cardinality, generatedAt)
- Fixture count >= 8, unique IDs/names
- All fixtures disabled/skipped/blocked by default
- No live network in any fixture
- Safety block fields
- All 8 required fixtures by name (specific property checks)
- All builder helpers
- Selectors (match/miss)
- Normalization, serialization, equality, deterministic checksum
- Normalization guards (isValid*)
- Validation success for all fixtures
- Validation failure cases (wrong phase, live network, CI allowed, secrets)
- All capability flags (positive and negative)
- Dashboard capabilities propagation
- Read-only API capabilities propagation
- Source phase 65/69/70/73 linkage validity
- Determinism (build same fixture twice = equal)
- Source immutability
- Safety grep (no Date.now, Math.random, randomUUID, fetch, axios, setInterval, etc.)
- Phase 75 preview: not implemented

---

## Non-Goals

This phase does **not**:

- Execute any live smoke checks
- Call any live RPC endpoint
- Require any API keys or secrets
- Add any providers or provider clients
- Build any routes or HTTP handlers
- Include any wallet, signing, or transaction code
- Provide any trading signals, recommendations, or investment advice
- Run in standard CI by default
- Add scheduled or automatic smoke triggers
- Write to disk or any persistent store
- Render any UI or access DOM APIs
- Launch background jobs or workers
- Guarantee or imply that smoke certification = trading safety or profitability

---

## Next Phase Guidance

**Phase 75 — Pre-Live Safety Review Gate and Read-Only Certification v1** (preview only, not implemented)

Phase 75 would build on Phase 74 harness contracts to introduce a formal pre-live safety review gate: a deterministic checklist of requirements that must all be satisfied before any future live provider capability could even be considered. This would include: certification completeness checks, reliability score thresholds, replay import compatibility verification, secret management policy review, and a multi-approver sign-off model — all as fixture-backed contract surfaces without any live execution.

Do not implement Phase 75 here.
