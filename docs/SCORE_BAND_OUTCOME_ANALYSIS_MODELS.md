# Score Band Outcome Analysis Models

## Phase 37 — Score Band Outcome Analysis Models v1

**Status:** Complete
**Phase:** 37
**Location:** `packages/offline-intelligence/src/score-band-outcomes/`

---

## Purpose

Phase 37 adds deterministic **score-band outcome analysis models** that group Phase 36 synthetic replay outcome fixtures into score bands for future strategy analysis preparation.

This layer is **fixture-backed, synthetic-only, local-only, deterministic, in-memory, read-only, non-persistent, external-network-free, and non-advisory**. It does not calculate real trading scores, rank real assets, produce trade signals, run replay/backtests, or make recommendations.

---

## Architecture

```
packages/offline-intelligence/src/score-band-outcomes/
├── types.ts           — TypeScript types, constants, interfaces
├── capabilities.ts    — Phase 37 capability flags
├── normalization.ts   — deterministic normalization, serialization, equality
├── validation.ts      — full and safety validation helpers
├── builders.ts        — fixture and summary builders
├── fixtures.ts        — 16 deterministic synthetic fixtures + registry helpers
└── index.ts           — barrel export
```

All Phase 37 exports are re-exported from `packages/offline-intelligence/src/index.ts`.

---

## Score-Band Fixture Architecture

### Fixture Structure

Each `ScoreBandOutcomeAnalysisFixture` contains:

| Field | Description |
|---|---|
| `name` | Unique fixture name (one of 16 supported) |
| `kind` | Fixture kind matching the name |
| `scoreBandRange` | Synthetic score-band range with `lowerLabel`, `upperLabel`, `category` |
| `outcomeReference` | Reference to Phase 36 replay outcome fixture |
| `riskIndicators` | Synthetic risk indicators sorted by code |
| `qualityIndicators` | Synthetic quality indicators sorted by code |
| `confidenceIndicators` | Synthetic confidence indicators sorted by code |
| `outcomeDistribution` | Synthetic distribution of outcome categories |
| `summary` | Derived summary with safety flags |
| `safeNotes` | Sorted safe notes |
| `meta` | Phase metadata with all safety flags |

### Score Band Categories

Score band categories are illustrative synthetic groupings only. They do not represent real trading scores, strategy rankings, or market analysis results.

| Category | Description |
|---|---|
| `low` | Synthetic low-band grouping |
| `medium` | Synthetic medium-band grouping |
| `high` | Synthetic high-band grouping |
| `unknown` | Synthetic unknown/insufficient-data band |

---

## Supported Fixtures (16 Required)

| Name | Kind | Score Band | Source (Phase 36) |
|---|---|---|---|
| `low-score-safe-skip` | `low-score-safe-skip` | low | `avoided-high-risk-loss-outcome` |
| `low-score-false-negative` | `low-score-false-negative` | low | `missed-opportunity-outcome` |
| `medium-score-watchlist-flat` | `medium-score-watchlist-flat` | medium | `mixed-signal-watchlist-flat-outcome` |
| `medium-score-mixed-outcome` | `medium-score-mixed-outcome` | medium | `high-risk-false-positive-outcome` |
| `high-score-positive-outcome` | `high-score-positive-outcome` | high | `clean-low-risk-positive-outcome` |
| `high-score-false-positive` | `high-score-false-positive` | high | `high-risk-false-positive-outcome` |
| `manipulation-risk-avoidance` | `manipulation-risk-avoidance` | low | `manipulation-risk-avoided-outcome` |
| `creator-risk-avoidance` | `creator-risk-avoidance` | low | `creator-risk-avoided-outcome` |
| `wallet-risk-avoidance` | `wallet-risk-avoidance` | low | `wallet-risk-avoided-outcome` |
| `insufficient-data` | `insufficient-data` | unknown | `insufficient-data-skipped-outcome` |
| `missed-opportunity` | `missed-opportunity` | low | `missed-opportunity-outcome` |
| `drawdown-contained` | `drawdown-contained` | medium | `drawdown-contained-outcome` |
| `no-action-safety` | `no-action-safety` | unknown | `no-action-safety-outcome` |
| `malformed-input-safe` | `malformed-input-safe` | unknown | `malformed-input-safe-outcome` |
| `dashboard-ready-score-band` | `dashboard-ready` | high | `dashboard-ready-replay-outcome` |
| `report-ready-score-band` | `report-ready` | high | `report-ready-replay-outcome` |

---

## Source References

Phase 37 fixtures reference Phase 36 replay outcome fixtures exclusively via `outcomeReference.replayOutcomeFixtureName` and `outcomeReference.replayOutcomeFixtureKind`. No live data, real replay, or external sources are used.

The reference chain is:
- Phase 37 → Phase 36 (`replay-outcomes`) → Phase 35 → Phase 34 → Phase 33 (synthetic chain)

---

## Helpers

### Fixture Builders

```typescript
buildScoreBandOutcomeAnalysisFixture(input: ScoreBandOutcomeBuildInput): ScoreBandOutcomeBuildResult
buildScoreBandOutcomeSummary(fixture: ScoreBandOutcomeAnalysisFixture): ScoreBandOutcomeSummary
```

### Normalization

```typescript
normalizeScoreBandOutcomeAnalysisFixture(fixture): ScoreBandOutcomeAnalysisFixture
serializeScoreBandOutcomeAnalysisFixture(fixture): string
isScoreBandOutcomeAnalysisFixtureSerializable(value): boolean
areScoreBandOutcomeAnalysisFixturesEqual(left, right): boolean
```

### Validation

```typescript
validateScoreBandOutcomeAnalysisFixture(fixture): ScoreBandOutcomeValidationResult
validateScoreBandOutcomeSafety(fixture): ScoreBandOutcomeSafetyResult
```

### Fixture Registry

```typescript
listScoreBandOutcomeAnalysisFixtures(): readonly ScoreBandOutcomeAnalysisFixtureName[]
getScoreBandOutcomeAnalysisFixture(name): ScoreBandOutcomeAnalysisFixture | undefined
PHASE_37_SCORE_BAND_OUTCOME_ANALYSIS_FIXTURES: ReadonlyMap<...>
```

### Capability Flags

```typescript
getScoreBandOutcomeFixtureCapabilities(): ScoreBandOutcomeFixtureCapabilities
```

---

## Validation

### Structural Validation (`validateScoreBandOutcomeAnalysisFixture`)

Checks:
- Required fields (`name`, `kind`, `meta`, `summary`, `outcomeReference`, `scoreBandRange`, `outcomeDistribution`, indicators, `safeNotes`)
- Supported fixture names and kinds
- Phase 36 source-reference validity
- Deterministic metadata (`generatedAt`, `source`)
- Safety flags (`fixtureOnly`, `syntheticOnly`, `deterministic`, `readOnly`, `localOnly`, `inMemoryOnly`)
- False safety flags (`liveData`, `realScoring`, `realBacktesting`, `paperTrading`, `liveTrading`, `execution`, `externalNetwork`, `persistence`, `fileExport`)
- Non-advisory/non-accusatory flags
- Stable indicator ordering
- JSON serializability

### Safety Validation (`validateScoreBandOutcomeSafety`)

Checks all string values in the fixture for:
- Possible Solana wallet addresses
- Possible transaction hashes
- Email addresses
- Phone numbers
- Street addresses
- External URLs
- Stack traces
- Local filesystem paths
- Secret/key patterns
- Live-data claims
- Execution/trading language
- Advice/signal language
- Real PnL/balance/order claims

---

## Capability Flags

| Flag | Value | Description |
|---|---|---|
| `scoreBandOutcomeAnalysisFixtures` | `true` | Phase 37 score-band analysis fixtures enabled |
| `syntheticScoreBandOutcomes` | `true` | Synthetic-only score-band outcomes |
| `scoreBandOutcomeBuilders` | `true` | Builder helpers available |
| `scoreBandOutcomeSafetyValidation` | `true` | Safety validation available |
| `scoreBandReplayOutcomeReferences` | `true` | Phase 36 references available |
| `scoreBandRealScoring` | `false` | No real scoring |
| `scoreBandRealBacktesting` | `false` | No real backtesting |
| `scoreBandPaperTrading` | `false` | No paper trading |
| `scoreBandLiveTrading` | `false` | No live trading |
| `scoreBandExecution` | `false` | No execution logic |
| `scoreBandSolanaRpc` | `false` | No Solana RPC |
| `scoreBandExternalNetwork` | `false` | No external network |
| `scoreBandPersistence` | `false` | No persistence |
| `scoreBandFileExport` | `false` | No file export |
| `scoreBandInvestmentAdvice` | `false` | No investment advice |
| `scoreBandTradingSignals` | `false` | No trading signals |

---

## Safety Boundaries

This phase **does not** implement:
- Live data, real-time feeds, or external APIs
- Real scoring or ranking of real assets
- Strategy decisions or trade signals
- Real replay execution, real backtesting, paper trading, or live trading
- Execution logic, order simulation, or real PnL
- Solana RPC, Jito, MEV, mempool, Yellowstone, or Geyser integration
- External network calls (fetch, axios, websocket, etc.)
- Wallet access, private keys, or signing/sending transactions
- Filesystem writes, database writes, browser downloads
- Persistence or browser storage
- Investment advice or trading recommendations
- Accusations against real wallets or people

All fixtures are:
- Synthetic-only
- Local-only
- Deterministic (no `Date.now`, `Math.random`, timers)
- In-memory only
- Non-mutating
- JSON-serializable
- Free of real wallet addresses, transaction hashes, personal data, or secrets

---

## What This Prepares

Phase 37 prepares the synthetic score-band outcome analysis layer that future strategy-candidate evaluation phases (Phase 38+) may use as a reference foundation. By grouping Phase 36 synthetic replay outcomes into score bands, this layer provides:
- A deterministic vocabulary for score-band categories
- A typed outcome distribution model for synthetic strategy analysis
- Risk, quality, and confidence indicators grouped by band
- A validation/safety layer compatible with future fixture-backed analysis

---

## Phase 38 Preview

Phase 38 may add **Strategy Candidate Evaluation Fixtures v1**, using Phase 37 score-band models as synthetic inputs. Phase 38 must remain fixture-backed, synthetic-only, and execution-free.

---

## Tests

See `tests/phase37.test.ts` for the full test suite (300+ tests).

---

## Safety Rules

See `docs/SAFETY_RULES.md` for the full project safety contract.
