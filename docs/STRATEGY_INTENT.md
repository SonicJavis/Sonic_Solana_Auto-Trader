# STRATEGY_INTENT.md

## Phase 15 — Strategy Intent Model v1

---

## Overview

`packages/strategy-intent` is a **fixture-only, analysis-only, non-executable** package that maps Phase 13 (Replay Lab) and Phase 14 (Replay Reporting) evidence into safe, human-reviewable strategy classification outputs.

**IMPORTANT SAFETY NOTICE:**

> `StrategyIntent` is **NOT** a real trade intent. It is an internal analysis model only.
> It does **not** recommend, enable, or imply any trading action.
> It does **not** create real trade intents, execution plans, paper trades, or any actionable output.
> All outputs are fixture-only, analysis-only, and non-executable.

---

## Phase Scope

This phase adds a read-only strategy intent model layer that:

1. Classifies fixture-only replay/reporting evidence into strategy family categories
2. Assesses evidence quality from fixture data
3. Generates analysis-only safety gates (none of which trigger actions)
4. Builds non-actionable rationale for human review
5. Produces `StrategyIntent` models that are explicitly analysis-only and non-executable

**This phase does NOT:**
- Create real trade intents
- Create execution plans or orders
- Enable paper trading
- Access live data, providers, wallets, or Solana RPC
- Construct, simulate, sign, or send transactions
- Enable copy trading, sniper logic, or auto execution

---

## Package Structure

```
packages/strategy-intent/
  src/
    types.ts          — all model types
    errors.ts         — SiResult, siOk, siErr, StrategyIntentError
    capabilities.ts   — getStrategyIntentCapabilities()
    evidence.ts       — assessStrategyEvidence()
    strategy-family.ts— classifyStrategyFamily()
    safety-gates.ts   — buildStrategySafetyGates()
    rationale.ts      — buildStrategyIntentRationale()
    intent-builder.ts — buildStrategyIntent()
    validation.ts     — validateStrategyIntent(), text helpers
    fixtures.ts       — 6 deterministic synthetic fixtures
    index.ts          — public API barrel
  package.json
  tsconfig.json
```

---

## Capability Table

All unsafe capability flags are **permanently false**.

| Capability                  | Value |
|-----------------------------|-------|
| canUseLiveData              | false |
| canUseSolanaRpc             | false |
| canUseProviderApis          | false |
| canAccessPrivateKeys        | false |
| canCreateTradeIntents       | false |
| canCreateExecutionPlans     | false |
| canPaperTrade               | false |
| canTrade                    | false |
| canExecute                  | false |
| canWriteToDatabase          | false |
| canSendTelegramAlerts       | false |
| canConstructTransactions    | false |
| canSimulateTransactions     | false |
| fixtureOnly                 | true  |
| analysisOnly                | true  |
| nonExecutable               | true  |

---

## Strategy Family Explanation

`StrategyFamily` labels classify what kind of fixture evidence pattern was observed. These are **not trade signals or recommendations**.

| Family                        | Meaning |
|-------------------------------|---------|
| `defensive_new_launch_filter` | Clean fixture with low risk, adequate confidence for analysis review |
| `creator_leaderboard_review`  | Degraded creator risk flags detected in fixture evidence |
| `wallet_cluster_review`       | Degraded wallet cluster risk signals in fixture evidence |
| `manipulation_avoidance_review` | Failed or critical risk signals in fixture evidence |
| `replay_regression_review`    | Score or verdict change between baseline and candidate fixture runs |
| `insufficient_evidence_review` | Missing, inconclusive, or below-threshold fixture data |
| `fixture_only_review`         | Synthetic fixture review with no specific risk pattern |

---

## Evidence Quality Explanation

`StrategyEvidenceQuality` classifies the reliability of fixture evidence.

| Quality                       | Meaning |
|-------------------------------|---------|
| `strong_fixture_evidence`     | High confidence, low risk score in fixture data |
| `moderate_fixture_evidence`   | Adequate confidence in fixture data |
| `weak_fixture_evidence`       | Low confidence or missing fixture data |
| `degraded_fixture_evidence`   | Elevated risk flags in fixture data |
| `failed_fixture_evidence`     | Failed verdict in fixture data |
| `inconclusive_fixture_evidence` | Insufficient data to determine quality |

---

## Safety Gate Explanation

`StrategySafetyGate` objects are analysis-only summaries of safety constraints. **No gate triggers any action or side effect.**

Required gates produced by `buildStrategySafetyGates()`:

| Gate ID                        | Description |
|--------------------------------|-------------|
| `fixture_only_gate`            | Confirms input is fixture-only synthetic data |
| `live_data_forbidden_gate`     | Confirms live data is permanently forbidden |
| `execution_forbidden_gate`     | Confirms execution is permanently forbidden |
| `trade_intent_forbidden_gate`  | Confirms trade intents are permanently forbidden |
| `paper_trading_forbidden_gate` | Confirms paper trading is permanently forbidden |
| `wallet_forbidden_gate`        | Confirms wallet access is permanently forbidden |
| `provider_forbidden_gate`      | Confirms provider API access is permanently forbidden |
| `reporting_safety_gate`        | Confirms reporting safety constraints are satisfied |
| `evidence_quality_gate`        | Reflects evidence quality (passed/warning/blocked/inconclusive) |

Gate statuses: `passed`, `blocked`, `warning`, `inconclusive`

---

## Rationale Explanation

`StrategyIntentRationale` is a non-actionable, human-readable breakdown of the analysis.

Fields:
- `summary` — one-line synthesis of family, quality, and classification
- `evidenceNotes` — source, verdict, scores, counts from input
- `safetyNotes` — permanent safety disclaimers
- `limitationNotes` — fixture data limitations
- `reviewNotes` — classification-specific review guidance

All rationale text passes safety validation (no unsafe action text, no secrets, no URLs).

---

## Example Usage

```typescript
import {
  buildStrategyIntent,
  validateStrategyIntent,
  getStrategyIntentCapabilities,
  CLEAN_STRATEGY_INTENT_FIXTURE,
} from '@sonic/strategy-intent';
import type { StrategyIntentInput } from '@sonic/strategy-intent';

// Check capabilities (all unsafe flags will be false)
const caps = getStrategyIntentCapabilities();
console.log(caps.canTrade); // false
console.log(caps.fixtureOnly); // true
console.log(caps.nonExecutable); // true

// Build a strategy intent from fixture-only input
const input: StrategyIntentInput = {
  sourceKind: 'replay_run_report',
  sourceId: 'rpt_fixture_clean_001',
  finalVerdict: 'fixture_only',
  finalRiskScore: 0.18,
  averageConfidence: 0.6,
  fixtureOnly: true,
  liveData: false,
};

const result = buildStrategyIntent(input);
if (result.ok) {
  const intent = result.value;
  console.log(intent.strategyFamily); // 'defensive_new_launch_filter'
  console.log(intent.classification); // 'analysis_only'
  console.log(intent.nonExecutable); // true
  console.log(intent.liveData); // false

  // Validate safety invariants
  const validation = validateStrategyIntent(intent);
  if (validation.ok) {
    console.log('Intent passed all safety invariants');
  }
}

// Use pre-built fixtures
console.log(CLEAN_STRATEGY_INTENT_FIXTURE.intent.fixtureOnly); // true
```

---

## Safety Invariants

All `StrategyIntent` outputs must satisfy:

| Invariant           | Value |
|---------------------|-------|
| `fixtureOnly`       | true  |
| `liveData`          | false |
| `safeToDisplay`     | true  |
| `analysisOnly`      | true  |
| `nonExecutable`     | true  |

`validateStrategyIntent()` enforces all invariants and additionally checks:
- No unsafe action text (buy, sell, execute, snipe, copy trade, etc.) in any text field
- No secret-like patterns (private key, seed phrase, API key, etc.) in any text field
- No URL/RPC-like patterns in any text field
- All safety gate flags correct
- All rationale flags correct
- All finding safeToDisplay=true

---

## Architecture

```
Replay Lab (@sonic/replay-lab)
    │
    ├── Replay Reporting (@sonic/replay-reporting)
    │       │
    │       └── Strategy Intent (@sonic/strategy-intent)  ← THIS PACKAGE
    │               │
    │               └── [human review output only, no execution]
    │
    └── [no network, no providers, no wallets]
```

---

## Fixtures

Six deterministic synthetic `StrategyIntentFixture` objects are provided:

| Export                                       | Family                         | Classification       |
|----------------------------------------------|--------------------------------|----------------------|
| `CLEAN_STRATEGY_INTENT_FIXTURE`              | defensive_new_launch_filter    | analysis_only        |
| `DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE`   | creator_leaderboard_review     | watch_only           |
| `DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE`    | wallet_cluster_review          | watch_only           |
| `FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE`| manipulation_avoidance_review  | reject               |
| `INCONCLUSIVE_STRATEGY_INTENT_FIXTURE`       | insufficient_evidence_review   | insufficient_evidence|
| `REGRESSION_STRATEGY_INTENT_FIXTURE`         | replay_regression_review       | watch_only           |

All fixtures are:
- synthetic only — no real token mints, wallet addresses, or private data
- fixtureOnly=true, liveData=false, safeToDisplay=true, analysisOnly=true, nonExecutable=true
- deterministic across test runs

---

## Explicit Safety Statements

1. **This phase is fixture-only, analysis-only, and non-executable.**
2. **StrategyIntent is NOT a real trade intent.** It is an internal analysis model only.
3. **Outputs do not recommend or enable trading.** No output contains buy, sell, execute, or any action label.
4. **No live data, providers, wallets, or Solana RPC are used or accessible.**
5. **No execution plans, paper trades, or real intents are created.**
6. **No transactions are constructed, simulated, signed, or sent.**

---

## Future Phase Notes

> **The following items are FUTURE PHASE considerations only. They are NOT implemented in Phase 15.**

- Paper trading replay against fixture baselines (requires separate gated phase)
- Live data integration (requires separate gated phase with extensive safety review)
- Human-gated progression pipeline (requires separate gated phase)
- Real trade intent evaluation (requires multiple gated phases with safety evidence)

Any future progression beyond fixture-only review must go through a separate, independently-reviewed, safety-gated phase. The existence of StrategyIntent classification does NOT imply permission to trade.
