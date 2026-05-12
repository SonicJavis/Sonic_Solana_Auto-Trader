# Cross-Provider Data Quality and Reconciliation

## Phase 67 — Cross-Provider Data Quality and Reconciliation v1

### Purpose

Phase 67 adds `apps/dashboard/src/cross-provider-data-quality/` as a deterministic, fixture-derived, local-only, read-only reconciliation layer over the Phase 66 multi-provider read-only foundation.

### Relationship to Phase 66

- Uses Phase 66 fixture names as immutable source references (`sourcePhase66FixtureName` + snapshot linkage).
- Compares provider-shaped fixture records only (no live provider calls).
- Produces mismatch, reconciliation, confidence, provenance, enrichment, and report artifacts.

### GitHub/source research summary and decisions

Useful references reviewed:

- `https://github.com/TauriccResearch/Solana-Trading-Bot`
  - relevance: representative public Solana sniper/trading bot.
  - adapted pattern: none for runtime behavior; used only as unsafe-pattern contrast.
  - not copied: private-key/RPC/live buy-sell workflow.
  - safety concern: requires `PRIVATE_KEY`, live RPC endpoints, and runtime trading flow.

- `https://github.com/web3batman/Solana_Memecoin_Sniper_Bot`
  - relevance: representative bot repo with wallet and auto-trading posture.
  - adapted pattern: none; used to document rejected unsafe scope.
  - not copied: wallet registration, auto-trading, live backend configuration.
  - safety concern: live trading behavior and execution-focused architecture.

- `https://github.com/machenxi/meteora-sniper-bot`
  - relevance: representative low-latency execution bot architecture.
  - adapted pattern: none for runtime; only reinforced strict exclusion of execution paths.
  - not copied: private key ingestion, transaction building, Jito execution.
  - safety concern: explicit private key configuration and execution orchestration.

Best-practice decisions applied:

- deterministic fixture-only reconciliation and confidence scoring
- strict provenance and source-reference capture
- fail-closed handling for critical unresolved conflicts
- explicit validation and safety rejection of wallet/network/execution/advisory drift

### Unsafe/scam patterns explicitly rejected

- private key / seed phrase collection and wallet import flows
- hidden or explicit transaction signing/sending/execution logic
- forced live RPC/network requirements in deterministic paths
- advisory/profit/signal language and strategy recommendation output
- runtime route/server/DOM/persistence/filesystem behavior
- auto-execution or live reconciliation unlocks

### Issue taxonomy model

Phase 67 defines deterministic taxonomies for:

- issue kinds
- severity labels
- confidence labels
- provider trust labels
- mismatch categories
- reconciliation status labels

### Provider comparison model

Each fixture includes `ProviderComparison` with:

- provider IDs
- compared fields
- agreements/mismatches
- missing/stale/partial field lists
- deterministic-only marker

### Mismatch detection model

Each fixture includes deterministic `ProviderMismatchReport` rows with mismatch kind, field path, expected/observed shapes, severity, confidence impact, and source refs.

### Reconciliation policy/result model

Policy is always fail-closed with:

- unsafe-provider rejection
- no live fallback
- no live refresh

Result tracks:

- selected/rejected providers
- reconciled vs unresolved fields
- confidence score/label
- issue linkage
- fail-closed status

### Confidence scoring model

Confidence scores are deterministic (0–100) and include:

- label classification (`none` → `very_high`)
- reason codes
- health/freshness/mismatch/conformance impacts

Confidence is strictly **data quality confidence**, not trade confidence.

### Provenance model

Each fixture includes provenance records that capture:

- source provider ID
- source fixture name/phase
- field path
- source kind
- deterministic-only marker

### Read-only enrichment contract model

Each fixture includes read-only enrichment metadata with:

- source reconciliation ID
- enriched fields
- provenance refs
- confidence label
- `readOnly: true`
- `fixtureOnly: true`
- `liveData: false`

### Report model

Each fixture includes a deterministic cross-provider report with:

- comparison summary
- mismatch summary
- reconciliation summary
- confidence summary
- provenance summary
- enrichment summary
- safety summary

### View model / API contract / selector overview

Phase 67 includes:

- deterministic view models
- list/detail/summary/error API contract fixtures
- pure fixture selectors

No runtime handlers/routes are introduced.

### Capability flags

Positive flags include:

- cross-provider data-quality/comparison/reconciliation/confidence/provenance/enrichment/view/API/selector surfaces

Negative flags remain `false` for:

- live data/network
- write/wallet/signing/sending/execution
- recommendations/signals/advice
- routes/runtime/UI/DOM
- persistence/filesystem/background jobs
- real orders/funds/PnL
- live reconciliation/auto execution

### Safety constraints

Phase 67 remains:

- read-only
- local-only by default
- deterministic in normal CI
- fixture-backed
- fail-closed
- non-wallet/non-signing/non-sending/non-executing
- non-advisory

### Validation behavior

Validation rejects:

- wrong phase/schema/meta constants
- duplicate fixture IDs/names
- invalid Phase 66 source refs/snapshot mutation
- confidence score out of range or label mismatch
- mismatch reports missing source refs
- reconciliation without provenance
- enrichment with `liveData: true` or `readOnly: false`
- fail-closed inconsistencies
- unsafe capability drift
- unsafe network/wallet/execution/advisory content patterns

### Testing summary

`tests/phase67.test.ts` covers:

- files/exports/constants/fixtures/map/list/get
- fixture scenarios and Phase 66 linkage
- issue/comparison/mismatch/reconciliation/confidence/provenance/enrichment builders
- reports/view models/contracts/selectors
- normalization/serialization/equality/determinism
- validation and safety rejection paths
- capability propagation in dashboard and read-only API surfaces
- preview-only Phase 68 documentation guard

### Explicit non-goals

Phase 67 does **not** add:

- new real providers
- live network calls in normal CI
- live reconciliation
- write methods
- wallet/private key/signing/sending logic
- transaction building/execution/live trading
- recommendations/signals/investment advice
- real orders/funds/PnL
- route handlers/runtime requests
- UI/DOM behavior
- persistence/filesystem/background jobs

### Next phase guidance

**Phase 68 — Provider-Aware Replay and Scenario Generation v1** is preview only in this document and is **not implemented** in Phase 67.
