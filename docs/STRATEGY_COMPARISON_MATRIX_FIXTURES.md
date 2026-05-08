# Strategy Comparison Matrix Fixtures

**Phase 39 — Strategy Comparison Matrix Fixtures v1**

---

## 1. Purpose

Phase 39 adds deterministic, synthetic strategy comparison matrix fixtures to the Sonic Solana Auto-Trader offline intelligence layer. These fixtures provide a typed, in-memory, fixture-backed model for comparing Phase 38 strategy candidates across safe offline criteria such as synthetic risk, quality, confidence, evidence coverage, false-positive protection, no-action safety, and overall safety posture.

This phase does **not** implement real strategy ranking, real scoring, asset selection, recommendations, trade signals, execution decisions, paper trades, live trades, real PnL, or automated strategy selection.

---

## 2. Safety Boundaries

All Phase 39 strategy comparison matrix fixtures are:

- **Synthetic-only** — no live data, no real market analysis
- **Local-only** — no external network calls, no RPC, no Jito/MEV/mempool
- **Read-only** — no persistence, no file exports, no browser downloads
- **Deterministic** — no `Date.now`, no `Math.random`, no wall-clock timestamps
- **In-memory** — no database writes, no filesystem writes
- **Non-persistent** — no localStorage, sessionStorage, or IndexedDB
- **Non-mutating** — no input mutation, pure helpers only
- **Non-advisory** — no investment advice, no recommendations, no trading signals
- **Non-executing** — no wallet access, no private keys, no signing, no sending
- **Non-accusatory** — no accusations against real wallets or people
- **Fixture-backed** — all data is synthetic Phase 38 candidate references

---

## 3. Architecture

### Location

```
packages/offline-intelligence/src/strategy-comparison/
  types.ts          — TypeScript types and constants
  capabilities.ts   — Phase 39 capability flags
  normalization.ts  — Normalization, serialization, equality helpers
  validation.ts     — Validation and safety validation helpers
  builders.ts       — Deterministic fixture builder helpers
  fixtures.ts       — All 16 deterministic synthetic fixtures
  index.ts          — Re-exports everything
```

The module is exported from:
- `packages/offline-intelligence/src/index.ts`

Capability flags are updated in:
- `apps/dashboard/src/types.ts`
- `apps/dashboard/src/capabilities.ts`
- `apps/read-only-api/src/types.ts`
- `apps/read-only-api/src/capabilities.ts`

---

## 4. Supported Matrix Cases

All 16 required deterministic synthetic fixtures:

| # | Name | Kind | Candidates |
|---|------|------|------------|
| 1 | `defensive-vs-aggressive-matrix` | `defensive-vs-aggressive` | 2 |
| 2 | `creator-led-candidate-matrix` | `creator-led-candidate` | 2 |
| 3 | `wallet-led-candidate-matrix` | `wallet-led-candidate` | 2 |
| 4 | `manipulation-avoidance-matrix` | `manipulation-avoidance` | 2 |
| 5 | `no-action-safety-matrix` | `no-action-safety` | 2 |
| 6 | `insufficient-data-matrix` | `insufficient-data` | 2 |
| 7 | `high-score-positive-comparison-matrix` | `high-score-positive-comparison` | 2 |
| 8 | `high-score-false-positive-comparison-matrix` | `high-score-false-positive-comparison` | 2 |
| 9 | `missed-opportunity-comparison-matrix` | `missed-opportunity-comparison` | 2 |
| 10 | `drawdown-contained-comparison-matrix` | `drawdown-contained-comparison` | 2 |
| 11 | `mixed-signal-watchlist-matrix` | `mixed-signal-watchlist` | 2 |
| 12 | `false-positive-protection-matrix` | `false-positive-protection` | 3 |
| 13 | `malformed-input-safe-matrix` | `malformed-input-safe` | 2 |
| 14 | `dashboard-ready-comparison-matrix` | `dashboard-ready-comparison` | 2 |
| 15 | `report-ready-comparison-matrix` | `report-ready-comparison` | 3 |
| 16 | `safety-boundary-comparison-matrix` | `safety-boundary-comparison` | 4 |

---

## 5. Phase 38 Candidate References

Each comparison matrix references one or more Phase 38 strategy candidate evaluation fixtures by name and kind. References are typed as `StrategyComparisonCandidateReference` and carry `fixtureOnly: true` and `syntheticOnly: true` to signal synthetic provenance.

Example:
```ts
{
  candidateFixtureName: 'defensive-new-launch-candidate',
  candidateFixtureKind: 'defensive-new-launch',
  candidateId: 'cand-def-001',
  candidateTitle: 'Defensive New Launch',
  candidateFamily: 'defensive',
  fixtureOnly: true,
  syntheticOnly: true,
  notes: ['Phase 38 defensive strategy candidate reference.'],
}
```

---

## 6. Comparison Criteria

All fixtures use 7 synthetic comparison criteria:

| Code | Label | Dimension |
|------|-------|-----------|
| `synthetic-risk` | Synthetic Risk | `risk-control` |
| `quality` | Quality | `quality-check` |
| `confidence` | Confidence | `confidence-check` |
| `evidence-coverage` | Evidence Coverage | `data-sufficiency` |
| `false-positive-protection` | False-Positive Protection | `safety-boundary` |
| `no-action-safety` | No-Action Safety | `safety-boundary` |
| `overall-safety-posture` | Overall Safety Posture | `safety-boundary` |

All criteria are synthetic-only with no real scoring or ranking.

---

## 7. Validation Examples

```ts
import { validateStrategyComparisonMatrixFixture } from '@sonic/offline-intelligence';

const result = validateStrategyComparisonMatrixFixture(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
// result.valid === true
// result.issues === []

const bad = validateStrategyComparisonMatrixFixture(null);
// bad.valid === false
// bad.issues[0].code === 'INVALID_INPUT'
```

---

## 8. Safety Validation Examples

```ts
import { validateStrategyComparisonMatrixSafety } from '@sonic/offline-intelligence';

const safeResult = validateStrategyComparisonMatrixSafety(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
// safeResult.safe === true
// safeResult.violations === []

const badSafety = validateStrategyComparisonMatrixSafety({
  ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
  meta: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.meta, liveData: true },
});
// badSafety.safe === false
// badSafety.violations includes 'meta.liveData must be false.'
```

---

## 9. Building Fixtures

```ts
import { buildStrategyComparisonMatrixFixture } from '@sonic/offline-intelligence';

const result = buildStrategyComparisonMatrixFixture({
  name: 'defensive-vs-aggressive-matrix',
  kind: 'defensive-vs-aggressive',
  title: 'My Matrix',
  description: 'Synthetic offline comparison.',
  candidateReferences: [
    {
      candidateFixtureName: 'defensive-new-launch-candidate',
      candidateFixtureKind: 'defensive-new-launch',
      candidateId: 'cand-001',
      candidateTitle: 'Defensive Candidate',
      candidateFamily: 'defensive',
      fixtureOnly: true,
      syntheticOnly: true,
      notes: [],
    },
  ],
});
// result.success === true
// result.fixture.meta.phase === 39
```

---

## 10. Listing and Getting Fixtures

```ts
import {
  listStrategyComparisonMatrixFixtures,
  getStrategyComparisonMatrixFixture,
  PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES,
} from '@sonic/offline-intelligence';

const names = listStrategyComparisonMatrixFixtures(); // sorted, stable
const f = getStrategyComparisonMatrixFixture('defensive-vs-aggressive-matrix');
const allFixtures = [...PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()];
```

---

## 11. Preparing Future Strategy Review

Phase 39 provides the fixture layer and types that future offline strategy review phases will use. By establishing typed synthetic comparison matrix models, normalization helpers, validation guards, and safety boundary declarations, Phase 39 enables:

- Deterministic offline fixture review without real data
- Type-safe integration with Phase 38 strategy candidates
- Safety-validated matrix models safe for display in offline dashboards
- Serialization-ready output for read-only API responses

---

## 12. What Phase 39 Does NOT Implement

Phase 39 does **not** implement:

- Real strategy scoring or ranking
- Automated strategy selection
- Trade signals or investment advice
- Recommendations
- Real replay or backtesting
- Paper trading or live trading
- Execution logic
- Order simulation against real markets
- Real PnL, balances, positions, or fills
- Solana RPC or provider APIs
- Jito, MEV, mempool, Yellowstone, or Geyser integration
- External network calls (fetch, axios, websocket)
- Wallet or private key access
- File exports, browser downloads, or persistence
- Real wallet addresses or transaction hashes

---

## 13. Capability Flags

Phase 39 adds the following capability flags:

```ts
{
  strategyComparisonMatrixFixtures: true,
  syntheticStrategyComparisonMatrices: true,
  strategyComparisonMatrixBuilders: true,
  strategyComparisonMatrixSafetyValidation: true,
  strategyComparisonCandidateReferences: true,
  strategyComparisonRealScoring: false,
  strategyComparisonRealRanking: false,
  strategyComparisonRealBacktesting: false,
  strategyComparisonPaperTrading: false,
  strategyComparisonLiveTrading: false,
  strategyComparisonExecution: false,
  strategyComparisonSolanaRpc: false,
  strategyComparisonExternalNetwork: false,
  strategyComparisonPersistence: false,
  strategyComparisonFileExport: false,
  strategyComparisonInvestmentAdvice: false,
  strategyComparisonTradingSignals: false,
  strategyComparisonRecommendations: false,
}
```

---

## 14. Phase 40 Preview

**Phase 40 — Strategy Review Dashboard Fixtures v1** (not yet implemented)

Phase 40 will add deterministic synthetic fixtures for strategy review dashboard display models, leveraging Phase 39 comparison matrix fixtures as the underlying data source.
