# Strategy Evaluation Reports — Phase 16

`packages/strategy-evaluation` provides a **fixture-only, analysis-only, non-executable** strategy evaluation report layer on top of Phase 15 Strategy Intent.

## Safety

> ⚠️ **SAFETY NOTICE**: This package is fixture-only, analysis-only, and non-executable. It does not recommend or enable trading. It does not create real trade intents or execution plans.

All `StrategyEvaluationCapabilities` unsafe flags are permanently `false`:
- `canUseLiveData: false`
- `canUseSolanaRpc: false`
- `canUseProviderApis: false`
- `canAccessPrivateKeys: false`
- `canCreateTradeIntents: false`
- `canCreateExecutionPlans: false`
- `canPaperTrade: false`
- `canTrade: false`
- `canExecute: false`
- `canWriteToDatabase: false`
- `canSendTelegramAlerts: false`
- `canConstructTransactions: false`
- `canSimulateTransactions: false`
- `canCreateOrders: false`
- `canCreatePositions: false`
- `canCalculateLivePnl: false`

All outputs carry: `fixtureOnly: true`, `liveData: false`, `safeToDisplay: true`, `analysisOnly: true`, `nonExecutable: true`.

## Architecture

```
Replay Lab (@sonic/replay-lab)
  → Replay Reporting (@sonic/replay-reporting)
    → Strategy Intent (@sonic/strategy-intent)
      → Strategy Evaluation (@sonic/strategy-evaluation)  ← this package
        → [human review only — no execution path]
```

`@sonic/strategy-evaluation` imports only from `@sonic/strategy-intent`. It exports fixture-only, analysis-only, non-executable `StrategyEvaluation` models for human review.

## Package Structure

```
packages/strategy-evaluation/src/
  types.ts              — all type definitions
  errors.ts             — SeResult<T>, seOk, seErr, StrategyEvaluationError
  capabilities.ts       — getStrategyEvaluationCapabilities()
  score-bands.ts        — buildStrategyScoreBandSummary()
  evidence-summary.ts   — buildStrategyEvidenceDistribution()
  gate-summary.ts       — buildStrategySafetyGateSummary()
  family-comparison.ts  — compareStrategyFamilies()
  evaluation-builder.ts — buildStrategyEvaluation()
  export-json.ts        — exportStrategyEvaluationJson()
  export-markdown.ts    — exportStrategyEvaluationMarkdown()
  validation.ts         — validateStrategyEvaluation(), text safety helpers
  fixtures.ts           — 6 deterministic synthetic fixtures
  index.ts              — public API barrel
```

## Key Types

### StrategyScoreBand

Score bands are evidence quality bands for fixture-only review — NOT trade signals:

- `excellent_fixture_review` — strong evidence with confidence > 0.9
- `strong_fixture_review` — strong evidence
- `moderate_fixture_review` — moderate evidence
- `weak_fixture_review` — weak evidence
- `degraded_fixture_review` — degraded evidence
- `failed_fixture_review` — failed evidence
- `inconclusive_fixture_review` — inconclusive evidence

### StrategyEvaluationClassification

Non-actionable evaluation labels — NOT recommendations to act:

- `reject_heavy` — majority of intents classified as reject
- `watch_only_heavy` — majority of intents classified as watch_only
- `analysis_only_heavy` — majority of intents classified as analysis_only
- `insufficient_evidence` — majority inconclusive or insufficient
- `fixture_only` — all intents are fixture_only

### StrategyEvaluation

The core model contains:
- `id` — unique evaluation identifier
- `sourceKind` — fixture_batch, fixture_single, or fixture_only
- `intentCount` — number of intents evaluated
- `classification` — non-actionable evaluation classification
- `scoreBandSummary` — per-band counts
- `evidenceDistribution` — evidence quality, classification, and family counts
- `safetyGateSummary` — aggregated gate status counts
- `familyComparisons` — per-family analysis (sorted deterministically)
- `findings` — analysis-only findings (always includes ANALYSIS_ONLY and NOT_A_REAL_EVALUATION)
- Safety flags: `fixtureOnly: true`, `liveData: false`, `safeToDisplay: true`, `analysisOnly: true`, `nonExecutable: true`

## Usage

```typescript
import {
  buildStrategyEvaluation,
  validateStrategyEvaluation,
  exportStrategyEvaluationJson,
  exportStrategyEvaluationMarkdown,
  getStrategyEvaluationCapabilities,
} from '@sonic/strategy-evaluation';

import { CLEAN_STRATEGY_INTENT_FIXTURE } from '@sonic/strategy-intent';

// Build an evaluation from fixture intents
const result = buildStrategyEvaluation({
  intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
  fixtureOnly: true,
  liveData: false,
});

if (result.ok) {
  // Validate safety invariants
  const validation = validateStrategyEvaluation(result.value);

  // Export as JSON
  const json = exportStrategyEvaluationJson(result.value);

  // Export as Markdown (always includes safety footer)
  const markdown = exportStrategyEvaluationMarkdown(result.value);
}
```

## Fixtures

Six deterministic synthetic fixtures are provided:

- `CLEAN_STRATEGY_EVALUATION_FIXTURE` — clean evaluation with strong evidence
- `DEGRADED_STRATEGY_EVALUATION_FIXTURE` — degraded evaluation with watch_only_heavy classification
- `FAILED_STRATEGY_EVALUATION_FIXTURE` — failed evaluation with reject_heavy classification
- `INCONCLUSIVE_STRATEGY_EVALUATION_FIXTURE` — inconclusive evaluation with insufficient_evidence classification
- `MIXED_STRATEGY_EVALUATION_FIXTURE` — mixed evaluation combining all evidence types
- `REGRESSION_STRATEGY_EVALUATION_FIXTURE` — regression evaluation
- `ALL_STRATEGY_EVALUATION_FIXTURES` — array of all above

## Validation

`validateStrategyEvaluation()` checks:
- All safety flags (`fixtureOnly`, `liveData`, `safeToDisplay`, `analysisOnly`, `nonExecutable`)
- All summary text fields for forbidden patterns (unsafe action text, secrets, URLs)
- All finding messages for forbidden patterns
- Finding `safeToDisplay` flags

`validateStrategyEvaluationCapabilities()` checks all capability flags.

Text helpers:
- `containsUnsafeActionText(text)` — detects buy, sell, execute, snipe, etc.
- `containsSecretPattern(text)` — detects private_key, seed phrase, api_key, etc.
- `containsUrlPattern(text)` — detects wss://, helius.dev, mainnet-beta.solana.com, etc.
- `isDisplaySafe(text)` — returns true only if all checks pass

## Markdown Safety Footer

Every Markdown export includes the mandatory safety footer:

```
> ⚠️ SAFETY NOTICE: This report is fixture-only, analysis-only, and non-executable. It does not recommend or enable trading. It does not create real trade intents or execution plans.
```

## What This Package Does NOT Do

- No real trade intents
- No execution plans
- No order creation
- No position creation
- No live PnL calculation
- No Solana RPC
- No live market data
- No provider API keys or connections
- No wallet or private key handling
- No paper trading
- No trade execution
- No network calls of any kind
- No database writes
- No Telegram alerts
- No transaction construction, simulation, signing, or sending

`FULL_AUTO` and `LIMITED_LIVE` remain locked.
