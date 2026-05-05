# Token Intelligence

## Overview

Phase 8 introduces the first Token Intelligence layer: a local, deterministic,
fixture-based scoring and classification system for Solana tokens.

All scoring in Phase 8 is performed from synthetic fixture/local model data only.
No live data, no Solana RPC, no provider APIs, no market data ingestion, no holder
fetching, no social fetching, and no trade actions of any kind.

---

## Package

```
packages/token-intelligence/
  src/
    token-profile.ts            — TokenProfile, TokenMetricSnapshot types
    score-types.ts              — Component score interfaces
    metadata-score.ts           — Metadata quality scoring
    curve-score.ts              — Bonding curve quality scoring
    holder-score.ts             — Holder concentration scoring
    liquidity-score.ts          — Liquidity quality scoring
    momentum-score.ts           — Organic momentum scoring
    risk-flags.ts               — TokenRiskFlag codes, TokenRiskFlagEntry, helpers
    classifier.ts               — TokenClassification values and helpers
    types.ts                    — TokenIntelligenceCapabilities, TokenIntelligenceResult
    errors.ts                   — TokenIntelligenceError, TiResult, tiOk/tiErr helpers
    validation.ts               — Input validation helpers
    fixtures.ts                 — 5 deterministic synthetic fixture profiles + metrics
    token-intelligence-engine.ts — Engine: score, classify, build risk flags, build result
    index.ts                    — Public API barrel
```

---

## Token Profile Model

### `TokenProfile`

Represents the descriptive/identity information for a token. All social/website
presence is expressed as booleans — no raw URLs are stored.

Key fields:
- `tokenId`, `tokenMint`, `name`, `symbol`, `description`
- `imageUriPresent`, `websitePresent`, `telegramPresent`, `twitterPresent` (boolean presence only)
- `source: 'fixture'` — always `'fixture'` in Phase 8
- `fixtureOnly: true` — always true in Phase 8
- `liveData: false` — always false in Phase 8
- `safeToDisplay: boolean`

### `TokenMetricSnapshot`

Quantitative metrics snapshot for scoring. All values are from fixture/local model data.

Key fields:
- `curveProgress` (0–1), `virtualLiquidity`, `reserveQuality`
- `holderCount`, `topHolderPercent`
- `uniqueBuyerCount`, `buyVelocity`, `sellVelocity`
- `volumeTrend` (-1 to 1)
- `metadataCompleteness`, `socialCompleteness` (0–1)
- `fixtureOnly: true`, `liveData: false`

---

## Score Components

All component scores are bounded 0–100. Missing or low-quality data reduces scores.
No component implies a trade action.

### `MetadataQualityScore`
Scores name quality, symbol quality, image presence, social presence, and overall
metadata completeness. `suspiciousReusePlaceholder` is always `false` in Phase 8.

### `CurveQualityScore`
Scores bonding curve position. Penalises very early (<5%) and very advanced (>85%)
curves via `tooEarlyOrTooLatePenalty`.

### `HolderConcentrationScore`
Scores holder distribution. High `topHolderPercent` produces `topHolderPenalty` and
elevated `concentrationRisk`.

### `LiquidityQualityScore`
Scores virtual liquidity depth and reserve quality. `exitLiquidityPlaceholder` is
always `null` in Phase 8 (no live order book data).

### `OrganicMomentumScore`
Scores buy/sell balance, unique buyer count, and volume trend.
`botNoisePlaceholder` is always `false` in Phase 8.

---

## Risk Flags

Risk flags are raised by `buildTokenRiskFlags()` based on profile and metric inputs.

| Code | Severity | Trigger |
|------|----------|---------|
| `MISSING_METADATA` | critical/high | Empty name/symbol or <50% metadata completeness |
| `MISSING_SOCIALS` | warn | Zero social completeness |
| `LOW_HOLDER_COUNT` | high/warn | Holder count < 10 (high) or < 50 (warn) |
| `HIGH_TOP_HOLDER_CONCENTRATION` | critical/high | Top holder ≥ 50% (critical) or ≥ 30% (high) |
| `LOW_LIQUIDITY` | critical/high | Virtual liquidity < 1 (critical) or < 5 (high) |
| `CURVE_TOO_EARLY` | warn | `curveProgress` < 0.05 |
| `CURVE_TOO_ADVANCED` | warn | `curveProgress` > 0.85 |
| `SELL_PRESSURE_HIGH` | high | Sell velocity > 70% of total trade velocity |
| `INSUFFICIENT_FIXTURE_DATA` | — | (reserved for future use) |
| `LIVE_DATA_UNAVAILABLE` | info | Always present in Phase 8 (fixture scoring only) |
| `PLACEHOLDER_CREATOR_UNKNOWN` | info | Always present — creator intelligence not yet available |
| `PLACEHOLDER_WALLET_CLUSTER_UNKNOWN` | info | Always present — wallet cluster analysis not yet available |
| `PLACEHOLDER_BUNDLE_UNKNOWN` | info | Always present — bundle detection not yet available |

All `TokenRiskFlagEntry` instances have `safeToDisplay: true`.

---

## Classification

`classifyToken()` returns a `TokenClassification` — never uses trade wording.

| Value | Meaning |
|-------|---------|
| `reject` | Critical risk flags present — not suitable for further analysis |
| `watch_only` | Low score, low confidence, or high uncertainty |
| `analysis_only` | Reasonable local/fixture score — for analysis review only |
| `insufficient_data` | Not enough data to produce a meaningful score |
| `fixture_only` | Synthetic fixture profile, low score |

**No classification ever means "buy", "sell", "execute", "trade", "snipe",
"live_candidate", or "auto_candidate".**

Classification rules:
- Critical risk flags → `reject`
- Confidence < 0.2 → `insufficient_data`
- Fixture-only profile with score < 40 → `fixture_only`
- Score < 30 or confidence < 0.4 → `watch_only`
- High local fixture score → `analysis_only` (never a trade signal)

---

## Token Intelligence Result

`TokenIntelligenceResult` is the complete output of `buildTokenIntelligenceResult()`.

**Mandatory safety fields (always enforced):**
```
fixtureOnly: true
liveData: false
actionAllowed: false
tradingAllowed: false
executionAllowed: false
safeToDisplay: true
```

`finalScore` is bounded 0–100.
`confidence` is bounded 0–1 and degrades with missing metadata, low holder count, or
low liquidity.

---

## Engine Functions

```typescript
// Build a complete result from profile + metrics (validates inputs, fails safely)
buildTokenIntelligenceResult(profile, metrics): TiResult<TokenIntelligenceResult>

// Score profile + metrics, returning component scores, final score, and confidence
scoreTokenProfile(profile, metrics): { componentScores, finalScore, confidence }

// Build risk flags from profile + metrics
buildTokenRiskFlags(profile, metrics): readonly TokenRiskFlagEntry[]

// Classify a token from flags, score, confidence, and profile
classifyToken(flags, finalScore, confidence, profile): TokenClassification

// Return static engine capabilities (all unsafe fields false)
getTokenIntelligenceCapabilities(): TokenIntelligenceCapabilities
```

---

## Capabilities

`getTokenIntelligenceCapabilities()` returns:

```
canUseLiveData: false
canUseSolanaRpc: false
canUseProviderApis: false
canTrade: false
canCreateTradeIntents: false
canExecute: false
fixtureOnly: true
safeToDisplay: true
```

---

## Fixtures

Five deterministic synthetic fixtures are provided:

| Export | Description |
|--------|-------------|
| `GOOD_FIXTURE_TOKEN_PROFILE` + `GOOD_FIXTURE_TOKEN_METRICS` | Complete metadata, good liquidity, balanced activity |
| `MISSING_METADATA_FIXTURE_TOKEN_PROFILE` + `MISSING_METADATA_FIXTURE_TOKEN_METRICS` | Empty name/symbol, no socials, low holder count |
| `CONCENTRATED_HOLDER_FIXTURE_TOKEN_PROFILE` + `CONCENTRATED_HOLDER_FIXTURE_TOKEN_METRICS` | 65% top-holder concentration |
| `LOW_LIQUIDITY_FIXTURE_TOKEN_PROFILE` + `LOW_LIQUIDITY_FIXTURE_TOKEN_METRICS` | 0.5 SOL virtual liquidity |
| `HIGH_SELL_PRESSURE_FIXTURE_TOKEN_PROFILE` + `HIGH_SELL_PRESSURE_FIXTURE_TOKEN_METRICS` | Sell velocity 6× buy velocity, declining volume |

All fixtures have synthetic token mints (not real on-chain addresses), `fixtureOnly: true`,
and `liveData: false`.

---

## State Integration

`@sonic/state` exports a static Phase 8 Token Intelligence status:

```typescript
PHASE_8_TOKEN_INTELLIGENCE_STATUS: TokenIntelligenceStatusSnapshot
buildTokenIntelligenceStatusSnapshot(): TokenIntelligenceStatusSnapshot
```

The snapshot always reports:
```
status: 'local_model_ready'
fixtureScoring: 'available'
liveData: 'forbidden'
providerApis: 'forbidden'
solanaRpc: 'forbidden'
tradeActions: 'forbidden'
execution: 'forbidden'
safeToDisplay: true
```

---

## Validation

`validateTokenProfile()`, `validateTokenMetrics()`, and `validateTokenMint()` validate
inputs without throwing. All return `TiResult<T>` (ok or safe error).

`validateScoreBounds(score, label)` and `validateConfidenceBounds(confidence)` validate
numeric bounds.

---

## Error Codes

| Code | Meaning |
|------|---------|
| `INVALID_TOKEN_PROFILE` | Profile is null, not an object, or missing required fields |
| `INVALID_TOKEN_METRICS` | Metrics are null, not an object, or missing required fields |
| `INVALID_TOKEN_MINT` | Mint is empty, too short, too long, or contains whitespace |
| `UNSAFE_TOKEN_OUTPUT` | Output would include unsafe data |
| `LIVE_DATA_FORBIDDEN` | `liveData` field is not `false` |
| `PROVIDER_DATA_FORBIDDEN` | Provider API data is forbidden |
| `TOKEN_SCORE_OUT_OF_RANGE` | Score is outside 0–100 |
| `TOKEN_CONFIDENCE_OUT_OF_RANGE` | Confidence is outside 0–1 |
| `TOKEN_INTELLIGENCE_FIXTURE_ONLY` | `fixtureOnly` field is not `true` |

All `TokenIntelligenceError` instances have `safeToDisplay: true`. No error contains
stack traces, raw thrown objects, RPC URLs, API keys, wallet data, or secrets.

---

## Safety Invariants

- No live data source of any kind is connected or polled
- No Solana RPC is used
- No provider API keys are required or accepted
- No market data is ingested
- No live token, holder, or social data is fetched
- No trade intents are created
- No transactions are constructed, simulated, signed, or sent
- No wallet or private key handling
- No execution of any kind
- `FULL_AUTO` and `LIMITED_LIVE` remain locked
- All score outputs are analysis-only
- All classification values are safe (no trade wording)
- All result fields `actionAllowed`, `tradingAllowed`, `executionAllowed` are always `false`
- Token Intelligence outputs must never imply permission to trade

---

## Next Phases

Phase 9 may add:
- Creator intelligence (wallet cluster analysis for token creators)
- Bundle detection
- Controlled read-only data ingestion via provider gates

Phase 9 and later phases may add controlled read-only data ingestion, but
**no execution, no transaction construction, no signing, no sending, no wallet
access, and no live trading are in scope until explicitly gated by the project
safety review process.**
