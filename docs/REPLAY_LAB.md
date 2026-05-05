# Replay Lab

## Overview

`packages/replay-lab` is the Phase 13 local, deterministic Replay Lab model layer. It replays synthetic fixture scenarios across the existing local intelligence stack. This is replay/scenario model infrastructure only — **no live data, no trading, no RPC**.

## Capabilities

```typescript
getReplayLabCapabilities() === {
  canUseLiveData: false,
  canUseSolanaRpc: false,
  canUseProviderApis: false,
  canAccessPrivateKeys: false,
  canCreateTradeIntents: false,
  canCreateExecutionPlans: false,
  canPaperTrade: false,
  canTrade: false,
  canExecute: false,
  fixtureOnly: true,
}
```

## Replay Verdicts

All replay verdicts are analysis-only:
- `passed` — all steps met their expected outcome
- `failed` — at least one step detected a hard failure (e.g. manipulation rejection)
- `degraded` — at least one step has elevated risk signals
- `inconclusive` — insufficient fixture data to determine an outcome
- `fixture_only` — scenario completed with no signal triggers (fixture-only run)

**Forbidden verdicts**: `buy`, `sell`, `enter`, `execute`, `trade`, `snipe`, `copy`, `mirror`, `live_candidate`, `auto_candidate`

## Package Structure

```
packages/replay-lab/src/
  types.ts           — All model types: ReplayStep, ReplayScenario, ReplayRun, ReplayComparison, etc.
  errors.ts          — rlOk, rlErr, isSafeErrorMessage helpers
  validation.ts      — validateVerdict, validateReplayStep, validateReplayScenario,
                       validateReplayStepResult, validateReplayRun, validateReplayComparison
  replay-step.ts     — buildReplayStep builder
  replay-scenario.ts — buildReplayScenario builder
  replay-result.ts   — buildReplayStepResult (deterministic step verdict engine)
  replay-summary.ts  — buildReplaySummary (final verdict aggregation)
  replay-run.ts      — runReplayScenario (execute a full scenario)
  comparison.ts      — compareReplayRuns (regression comparison)
  fixtures.ts        — 8 deterministic synthetic fixture scenarios
  index.ts           — Public API barrel
```

## Fixture Scenarios

| ID | Expected Verdict | Description |
|----|-----------------|-------------|
| `clean_token_replay_scenario` | `fixture_only` | Low-risk clean token |
| `risky_creator_replay_scenario` | `degraded` | Elevated-risk creator profile |
| `wallet_cluster_risk_replay_scenario` | `degraded` | High-risk wallet cluster |
| `manipulation_reject_replay_scenario` | `failed` | Bundle/manipulation detected |
| `mixed_warning_replay_scenario` | `degraded` | Multiple warning signals |
| `missing_data_replay_scenario` | `inconclusive` | Missing fixture data |
| `regression_comparison_baseline` | `fixture_only` | Regression baseline |
| `regression_comparison_candidate` | `degraded` | Regression candidate (elevated vs baseline) |

## Usage

```typescript
import {
  runReplayScenario,
  compareReplayRuns,
  CLEAN_TOKEN_REPLAY_SCENARIO,
  REGRESSION_COMPARISON_BASELINE_SCENARIO,
  REGRESSION_COMPARISON_CANDIDATE_SCENARIO,
} from '@sonic/replay-lab';

// Run a single fixture scenario
const run = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
if (run.ok) {
  console.log(run.value.summary.finalVerdict); // 'fixture_only'
}

// Regression comparison
const baseline = runReplayScenario(REGRESSION_COMPARISON_BASELINE_SCENARIO);
const candidate = runReplayScenario(REGRESSION_COMPARISON_CANDIDATE_SCENARIO);
if (baseline.ok && candidate.ok) {
  const comparison = compareReplayRuns(baseline.value, candidate.value);
  if (comparison.ok) {
    console.log(comparison.value.summary); // human-readable delta
  }
}
```

## Safety Invariants

- All `ReplayRun` results have `fixtureOnly: true`, `liveData: false`, `safeToDisplay: true`
- No stack traces, no RPC URLs, no API keys, no private keys, no secrets in error messages
- `isSafeErrorMessage()` rejects messages containing forbidden patterns
- All `ReplayLabCapabilities` unsafe flags are permanently `false`
- No Solana RPC, no provider APIs, no wallet access, no trade intents, no execution plans
- FULL_AUTO and LIMITED_LIVE remain locked
