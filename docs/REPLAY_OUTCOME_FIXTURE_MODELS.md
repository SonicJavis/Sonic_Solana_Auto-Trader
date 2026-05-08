# Replay Outcome Fixture Models

**Phase 36 — Replay Outcome Fixture Models v1**

## 1. Purpose

Phase 36 adds deterministic synthetic replay outcome fixtures in `packages/offline-intelligence/src/replay-outcomes/`.

This layer models safe, local-only replay outcomes that can be associated with synthetic Phase 33 composite evidence, Phase 34 report integration fixtures, and Phase 35 dashboard/report fixtures. It prepares future score-band and replay analysis phases (including downstream Phase 38 strategy-candidate fixture references) without introducing any real replay/backtesting or execution logic.

## 2. Safety Boundaries

Phase 36 replay outcome fixtures are:

- fixture-only
- synthetic-only
- local-only
- read-only
- deterministic
- in-memory only
- non-persistent
- external-network-free
- file-export-free
- non-advisory
- non-accusatory

Phase 36 adds **no**:

- live data ingestion
- real replay engine
- real backtesting
- paper trading
- live trading
- order execution logic
- Solana RPC/provider/Jito/MEV/mempool integration
- wallet/private-key/signing/sending logic
- real PnL/balance/order/fill/position modeling
- file writes/download exports

## 3. Implementation Location

```
packages/offline-intelligence/src/replay-outcomes/
  types.ts
  builders.ts
  normalization.ts
  validation.ts
  fixtures.ts
  capabilities.ts
  index.ts
```

## 4. Core Types

Phase 36 introduces strict types, including:

- `ReplayOutcomeFixture`
- `ReplayOutcomeFixtureName`
- `ReplayOutcomeFixtureKind`
- `ReplayOutcomeScenarioReference`
- `ReplayOutcomeSyntheticObservation`
- `ReplayOutcomeEntryObservation`
- `ReplayOutcomeExitObservation`
- `ReplayOutcomeRiskIndicator`
- `ReplayOutcomeQualityIndicator`
- `ReplayOutcomeSummary`
- `ReplayOutcomeValidationResult`
- `ReplayOutcomeValidationIssue`
- `ReplayOutcomeSafetyResult`
- `ReplayOutcomeBuildInput`
- `ReplayOutcomeBuildResult`

## 5. Deterministic Fixture Set

Phase 36 includes 16 required fixtures:

1. `avoided-high-risk-loss-outcome`
2. `clean-low-risk-flat-outcome`
3. `clean-low-risk-positive-outcome`
4. `mixed-signal-watchlist-flat-outcome`
5. `high-risk-false-positive-outcome`
6. `high-risk-true-positive-outcome`
7. `insufficient-data-skipped-outcome`
8. `manipulation-risk-avoided-outcome`
9. `wallet-risk-avoided-outcome`
10. `creator-risk-avoided-outcome`
11. `missed-opportunity-outcome`
12. `drawdown-contained-outcome`
13. `no-action-safety-outcome`
14. `malformed-input-safe-outcome`
15. `dashboard-ready-replay-outcome`
16. `report-ready-replay-outcome`

All fixtures are deterministic and use fixed `generatedAt` metadata (`2026-01-01T00:00:00.000Z`).

## 6. Source References

Each replay outcome fixture includes a scenario reference chain:

- Phase 33 composite fixture name/kind
- Phase 34 report fixture name/kind
- Phase 35 dashboard/report fixture name

This keeps replay outcomes linked to synthetic upstream fixture evidence only.

## 7. Helpers

### Builders

- `buildReplayOutcomeFixture(input)`
- `buildReplayOutcomeSummary(fixture)`

### Normalization

- `normalizeReplayOutcomeFixture(fixture)`
- `serializeReplayOutcomeFixture(fixture)`
- `isReplayOutcomeFixtureSerializable(value)`
- `areReplayOutcomeFixturesEqual(a, b)`

### Validation

- `validateReplayOutcomeFixture(fixture)`
- `validateReplayOutcomeSafety(fixture)`

### Fixture Lookup

- `listReplayOutcomeFixtures()`
- `getReplayOutcomeFixture(name)`

### Capabilities

- `getReplayOutcomeFixtureCapabilities()`

## 8. Validation and Safety Validation

`validateReplayOutcomeFixture` checks:

- required fields and supported names/kinds
- deterministic metadata constants
- scenario-reference compatibility with Phase 33/34/35 fixture name sets
- summary consistency
- deterministic ordering of code/note arrays
- JSON serializability

`validateReplayOutcomeSafety` rejects content containing:

- wallet/transaction-like markers
- PII markers
- stack traces/local paths/secrets
- live-data/network claims
- execution/trading/advice wording
- real PnL/balance/order/fill wording

## 9. Capability Flags

Phase 36 adds replay-outcome capabilities:

- `replayOutcomeFixtures: true`
- `syntheticReplayOutcomes: true`
- `replayOutcomeBuilders: true`
- `replayOutcomeSafetyValidation: true`
- `replayOutcomeCompositeEvidenceReferences: true`
- `replayOutcomeReportReferences: true`
- `replayOutcomeDashboardReferences: true`
- `replayOutcomeLiveData: false`
- `replayOutcomeRealBacktesting: false`
- `replayOutcomePaperTrading: false`
- `replayOutcomeLiveTrading: false`
- `replayOutcomeExecution: false`
- `replayOutcomeSolanaRpc: false`
- `replayOutcomeExternalNetwork: false`
- `replayOutcomePersistence: false`
- `replayOutcomeFileExport: false`
- `replayOutcomeInvestmentAdvice: false`
- `replayOutcomeTradingSignals: false`

These flags are also exposed in dashboard and read-only-api compatibility capability surfaces.

## 10. What Phase 36 Does Not Implement

- no real replay execution
- no real strategy scoring
- no real backtest metrics
- no recommendations or trading signals
- no execution controls or transaction paths

## 11. Phase 37 Preview Only

Likely next phase:

> Phase 37 — Score Band Outcome Analysis Models v1

Phase 37 is not implemented in Phase 36.
