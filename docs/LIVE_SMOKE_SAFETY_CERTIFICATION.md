# Live Smoke Safety Certification

## Phase 69 — Live Smoke Harness Expansion and Safety Certification v1

### Purpose

Phase 69 adds `apps/dashboard/src/live-smoke-safety-certification/` as a deterministic, fixture-derived, disabled-by-default, read-only live-smoke harness and safety-certification layer.

### Relationship to Phase 65/66/67/68

- **Phase 65** provides first read-only provider adapter fixture linkage.
- **Phase 66** provides multi-provider read-only readiness and fail-closed linkage.
- **Phase 67** provides cross-provider quality gate linkage.
- **Phase 68** provides provider-aware replay certification-readiness linkage.

### GitHub/source research summary and decisions

Useful references reviewed:

- `https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch`
  - relevance: optional/manual trigger model for smoke workflows.
  - adapted pattern: explicit manual opt-in and disabled-by-default semantics.
  - not copied: workflow file implementation details.
- `https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule`
  - relevance: clean separation of scheduled/non-default smoke checks from default CI.
  - adapted pattern: keep deterministic CI separate from optional smoke controls.
  - not copied: any deployment/runtime workflow logic.
- `https://raw.githubusercontent.com/TauriccResearch/Solana-Trading-Bot/master/README.md`
  - relevance: representative execution bot posture and required private key/RPC setup.
  - adapted pattern: none; used as explicit anti-pattern boundary.
  - not copied: private key ingestion, signing/sending/trading logic.
- `https://raw.githubusercontent.com/AV1080p/Solana-Sniper-Bot/master/README.md`
  - relevance: representative copy/sniper execution architecture with wallet/runtime engines.
  - adapted pattern: none; used for unsafe-pattern screening.
  - not copied: wallet and execution engine behavior.
- `https://raw.githubusercontent.com/web3batman/Solana_Memecoin_Sniper_Bot/master/README.md`
  - relevance: representative wallet registration + automated buy/sell + profit-marketing posture.
  - adapted pattern: none; used to reinforce scope exclusion.
  - not copied: trading/runtime/wallet flows.

### Unsafe/scam patterns explicitly rejected

- private key, seed phrase, mnemonic, wallet registration/import collection
- hidden or explicit signing/sending/execution flows
- forced live RPC/websocket defaults in deterministic paths
- profit/recommendation/signal/investment-advice posture
- runtime route handlers, request handlers, UI/DOM, persistence, background jobs
- postinstall/drainer/proxy-style behavior

### Smoke config model

`LiveSmokeConfig` includes `configId`, `configName`, `mode`, `standardCi`, `liveChecksEnabled: false`, `requiresManualOptIn`, `requiresReadOnlyProvider: true`, `fixtureOnly: true`.

### Disabled-by-default smoke guard model

`SmokeGuardPolicy` is fail-closed and skip-by-default with blocked unsafe capabilities, write methods, runtime requests, secrets, and execution.

### Read-only smoke check model

`ReadOnlySmokeCheck` captures check contract metadata only (`checkKind`, capabilities, reason codes, source refs) and forbids write-method detection.

### Provider eligibility model

`ProviderSmokeEligibilityCheck` captures read-only eligibility, unsafe-capability screening, config readiness, quality/replay readiness, and reason codes.

### Network isolation policy

`NetworkIsolationPolicy` keeps:

- `standardCiNetworkAccess: false`
- `manualSmokeNetworkAccessAllowed: false` (Phase 69)
- `endpointRequired: false`
- `apiKeyRequired: false`
- timeout/retry metadata as model-only text

### Smoke result model

`SmokeResult` supports deterministic outcomes:

- `skipped`
- `blocked`
- `certified_offline`
- `certification_failed`
- `manual_required`

### Safety certificate model

`SafetyCertificate` includes `certifiedReadOnly`, `certifiedOfflineCi`, `certifiedNoSecrets`, `certifiedNoExecution`, `certifiedNoAdvisory`, status, and failure reasons.

### Offline CI contract model

`OfflineCiCertificationContract` enforces deterministic standard CI:

- `networkAccess: false`
- `liveChecksRun: false`
- `optionalSmokeSkipped: true`
- fixed validation command contract list
- safety grep requirement marker

### Report model

`LiveSmokeCertificationReport` provides deterministic config/guard/plan/result/certificate/safety/offline summaries with non-advisory wording.

### View model / API contract / selector overview

Phase 69 includes deterministic:

- `LiveSmokeSafetyViewModel`
- list/detail/summary/error API contract fixtures
- pure selectors over fixture tables

No routes, runtime handlers, rendering, or networking are added.

### Capability flags

Positive flags add live-smoke safety certification model surfaces.

Negative flags remain fixed `false` for:

- standard/default network access
- secrets/API key requirement
- write/wallet/private-key/sign/send/execution
- recommendations/signals/investment advice
- route/runtime/UI/DOM/persistence/background jobs
- real orders/funds/PnL
- provider expansion/live reconciliation/live replay import

### Safety constraints

Phase 69 remains:

- read-only
- disabled-by-default
- deterministic in standard CI
- fixture-backed
- fail-closed
- smoke-harness-model-only
- safety-certification-only
- non-wallet / non-signing / non-sending / non-executing
- non-advisory

And explicitly does **not** add:

- live smoke execution in standard CI
- default live network access
- secrets/API keys
- provider expansion
- live reconciliation or live replay import
- write RPC, transaction building/signing/sending/execution
- recommendations/signals/investment advice
- real orders/funds/PnL
- route handlers/runtime requests/UI/DOM/persistence/background jobs

### Validation behavior

Validation rejects:

- wrong phase/schema/meta
- duplicate IDs/names and low fixture count
- live checks enabled by default
- CI/manual network access drift
- API key requirement drift
- smoke plan not disabled-by-default
- unsafe capabilities, write-method flags, execution drift
- offline CI contract network/live-check drift
- advisory/profit/wallet/network/secret text patterns
- source Phase 65/66/67/68 snapshot mutation

### Testing summary

`tests/phase69.test.ts` covers:

- file/docs existence
- constants, fixtures, map/list/get
- required fixture scenarios
- builders and model layers
- selectors/normalization/serialization/equality/checksum
- validation/safety success and rejection cases
- practical linkage to Phase 65/66/67/68 snapshot sources
- capability propagation to dashboard/read-only-api surfaces
- deterministic primitive scan checks
- Phase 70 preview-only documentation guard

### Explicit non-goals

Phase 69 does not implement live provider smoke execution, runtime request handling, route handlers, UI rendering, DOM access, persistence, filesystem writes, background jobs, wallet logic, signing/sending, execution, or advisory outputs.

### Next phase guidance

**Phase 70 — Provider Reliability Telemetry and Drift Audit v1** is preview only and **not implemented** in Phase 69.
