# Strategy Candidate Evaluation Fixtures

## Phase 38 — Strategy Candidate Evaluation Fixtures v1

**Status:** Complete  
**Phase:** 38  
**Location:** `packages/offline-intelligence/src/strategy-candidates/`

## 1) Purpose

Phase 38 adds deterministic synthetic strategy-candidate evaluation fixtures that reference Phase 37 score-band outcome fixtures.

This phase is fixture-backed, synthetic-only, local-only, read-only, deterministic, in-memory, non-persistent, external-network-free, non-advisory, and non-accusatory.

## 2) Safety Boundaries

Phase 38 adds no live data, no real scoring, no real ranking, no real replay/backtesting, no paper/live trading, no execution logic, no wallet/private-key logic, no RPC/provider/Jito/MEV/mempool integration, no external network calls, no persistence, and no file export/download behavior.

## 3) Architecture

```
packages/offline-intelligence/src/strategy-candidates/
  types.ts
  capabilities.ts
  normalization.ts
  validation.ts
  builders.ts
  fixtures.ts
  index.ts
```

## 4) Supported Candidate Cases (16)

1. defensive-new-launch-candidate  
2. creator-leaderboard-candidate  
3. wallet-leader-copy-candidate  
4. post-bundle-dip-candidate  
5. no-action-safety-candidate  
6. manipulation-avoidance-candidate  
7. insufficient-data-candidate  
8. high-score-positive-candidate  
9. high-score-false-positive-candidate  
10. missed-opportunity-candidate  
11. drawdown-contained-candidate  
12. mixed-signal-watchlist-candidate  
13. malformed-input-safe-candidate  
14. dashboard-ready-strategy-candidate  
15. report-ready-strategy-candidate  
16. safety-boundary-strategy-candidate

## 5) Score-Band References

Each fixture includes `scoreBandReference` with:
- Phase 37 score-band fixture name/kind
- score-band category
- referenced Phase 36 replay outcome fixture name

Only synthetic local fixture references are used.

## 6) Validation and Safety Validation

Helpers:
- `validateStrategyCandidateEvaluationFixture`
- `validateStrategyCandidateSafety`

Validation covers required fields, supported names/kinds, reference compatibility, deterministic metadata, serializability, stable ordering, and safety flags.

Safety validation rejects strings that look like real wallet/transaction markers, personal data, secrets, stack traces, local paths, live-data claims, execution language, recommendation/trading-signal language, or real scoring/ranking/PnL wording.

## 7) Future Preparation

Phase 38 prepares a deterministic typed candidate-evaluation layer for future fixture-based strategy comparison workflows.

## 8) What Phase 38 Does Not Implement

- real strategy execution
- real scoring
- real ranking
- strategy recommendations
- trading signals
- real replay/backtesting
- paper/live trading
- real PnL/balances/orders/fills/positions
- external intelligence ingestion

## 9) Follow-up

Phase 39 (strategy comparison matrix fixtures) and Phase 40 (strategy review dashboard fixtures) are implemented and consume Phase 38 candidate fixtures as synthetic references.

Next phase preview:
**Phase 41 — Strategy Review Report Fixtures v1**

## 10) Explicit Confirmation

Phase 38 adds no real scoring, no real ranking, no real replay/backtesting, no real PnL, no live intelligence, no recommendations, no actual execution, no trading signals, and no proven alpha.
