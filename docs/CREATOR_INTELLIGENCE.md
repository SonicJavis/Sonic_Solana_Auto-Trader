# Creator Intelligence v1

**Phase 9 — Local Creator Intelligence Models**

This document describes the `@sonic/creator-intelligence` package introduced in Phase 9 of the Sonic Solana Auto-Trader system.

> Phase 30 also adds deterministic creator-intelligence fixture models in the same package. See [CREATOR_INTELLIGENCE_FIXTURES.md](./CREATOR_INTELLIGENCE_FIXTURES.md) for the offline fixture-model layer.

---

## Overview

The Creator Intelligence layer provides **local, deterministic, fixture-only** scoring and classification of creator/dev wallet profiles based on historical launch metrics.

Phase 9 is **model infrastructure only**. It uses no live chain data, no provider APIs, no Solana RPC, and no network connections of any kind.

---

## What Phase 9 Provides

- `packages/creator-intelligence` package
- Creator profile types (`CreatorProfile`, `CreatorProfileSource`)
- Creator launch history types (`CreatorLaunchHistorySnapshot`)
- Score component types (`CreatorSuccessScore`, `CreatorLaunchQualityScore`, `CreatorConsistencyScore`, `CreatorSuspiciousPatternScore`, `CreatorComponentScores`)
- Creator risk flag model (`CreatorRiskFlag`, `CreatorRiskFlagEntry`)
- Creator classification model (`CreatorClassification`)
- Creator intelligence capabilities model (`CreatorIntelligenceCapabilities`)
- Creator intelligence result model (`CreatorIntelligenceResult`)
- Deterministic scoring functions (local/fixture data only)
- Six fixture creator profiles for tests
- Input validation helpers
- Safe error types (`CiResult`, `ciOk`, `ciErr`)

---

## What Phase 9 Does NOT Provide

- No Solana RPC
- No Helius / WebSocket / Yellowstone / Geyser providers
- No live creator/dev wallet data ingestion
- No live launch-history fetching
- No live funding-source analysis
- No wallet cluster intelligence (placeholder flags only)
- No bundle detector (placeholder flags only)
- No market data ingestion
- No provider API keys needed or used
- No wallet / private key handling
- No transaction construction / signing / sending
- No trade execution
- No trade intents
- No network calls of any kind
- No real wallet addresses in fixture data

---

## Score Components

### CreatorSuccessScore (weight: 30%)
Measures historical launch success: launch count quality, migration rate, average peak quality, failure penalty.

### CreatorLaunchQualityScore (weight: 30%)
Measures average quality of launches: holder quality, liquidity quality, metadata quality (placeholder), momentum quality (placeholder).

### CreatorConsistencyScore (weight: 20%)
Measures how consistently the creator produces quality launches: repeatability, positive history consistency, negative history penalty.

### CreatorSuspiciousPatternScore (weight: 20%)
**Higher score = SAFER (fewer suspicious patterns detected).**  
Penalises: suspicious funding signals, repeated metadata, bundle abuse, rug-like launches, fast dump history.

All scores are bounded **0–100**. Final score is a weighted composite.

---

## Risk Flags

| Code | Severity | Description |
|------|----------|-------------|
| `INSUFFICIENT_CREATOR_DATA` | high | No launch history observed |
| `LOW_LAUNCH_COUNT` | warn | Only 1–2 launches observed |
| `HIGH_FAILURE_RATE` | high | >50% of launches failed |
| `LOW_MIGRATION_RATE` | warn | <20% migration rate |
| `FAST_DUMP_HISTORY` | high | High average dump speed |
| `LOW_HOLDER_QUALITY` | warn | Low average holder quality |
| `LOW_LIQUIDITY_QUALITY` | warn | Low average liquidity quality |
| `SUSPICIOUS_FUNDING_PLACEHOLDER` | warn/high | Suspicious funding signals (placeholder) |
| `REPEATED_METADATA_PLACEHOLDER` | warn/high | Repeated metadata signals (placeholder) |
| `BUNDLE_ABUSE_PLACEHOLDER` | warn/high | Bundle abuse signals (placeholder) |
| `RUG_LIKE_HISTORY` | high/critical | Rug-like launches detected |
| `LIVE_DATA_UNAVAILABLE` | info | No live data — fixture scoring only |
| `WALLET_CLUSTER_UNKNOWN` | info | Wallet cluster analysis not available in Phase 9 |
| `BUNDLE_RISK_UNKNOWN` | info | Bundle risk analysis not available in Phase 9 |

All flag entries have `safeToDisplay: true`.

---

## Classifications

| Value | Meaning |
|-------|---------|
| `reject` | Critical risk flags present — not suitable for analysis |
| `watch_only` | Medium score with missing live data or high uncertainty |
| `analysis_only` | Reasonable fixture score — safe for analysis review only |
| `insufficient_data` | Insufficient history to produce a meaningful score |
| `fixture_only` | Fixture data with low score — no real-world inference |

**No classification uses buy/sell/execute/trade/snipe/enter wording.**

A result classified as `analysis_only` does **not** indicate permission to trade.

---

## Safety Invariants

All `CreatorIntelligenceResult` objects enforce:

```typescript
fixtureOnly: true          // always
liveData: false            // always
actionAllowed: false       // always
tradingAllowed: false      // always
executionAllowed: false    // always
safeToDisplay: true        // always
```

All `CreatorIntelligenceCapabilities` objects enforce:

```typescript
canUseLiveData: false
canUseSolanaRpc: false
canUseProviderApis: false
canUseWalletData: false
canCreateTradeIntents: false
canTrade: false
canExecute: false
fixtureOnly: true
```

---

## Fixtures

Six deterministic synthetic fixture creator profiles are provided:

| Label | Profile | Description |
|-------|---------|-------------|
| `strong` | `STRONG_FIXTURE_CREATOR_PROFILE` | Well-established creator, high migration rate |
| `new` | `NEW_FIXTURE_CREATOR_PROFILE` | Brand-new creator, no history |
| `fast_dump` | `FAST_DUMP_FIXTURE_CREATOR_PROFILE` | High dump speed, poor momentum |
| `repeated_metadata` | `REPEATED_METADATA_FIXTURE_CREATOR_PROFILE` | Repeated metadata patterns |
| `suspicious_funding` | `SUSPICIOUS_FUNDING_FIXTURE_CREATOR_PROFILE` | Suspicious funding signals |
| `rug_like` | `RUG_LIKE_FIXTURE_CREATOR_PROFILE` | Multiple rug-like launches → reject |

All fixture creator addresses are synthetic. No real wallet addresses are used.

---

## Engine API

```typescript
import {
  buildCreatorIntelligenceResult,
  scoreCreatorProfile,
  buildCreatorRiskFlags,
  classifyCreator,
  getCreatorIntelligenceCapabilities,
} from '@sonic/creator-intelligence';

// Build a full result from fixture data
const result = buildCreatorIntelligenceResult(profile, history);
if (result.ok) {
  console.log(result.value.classification); // 'analysis_only', 'reject', etc.
  console.log(result.value.finalScore);     // 0–100
  console.log(result.value.actionAllowed);  // always false
}

// Get static capabilities
const caps = getCreatorIntelligenceCapabilities();
// caps.canTrade === false, caps.fixtureOnly === true
```

---

## Architecture Boundaries

`packages/creator-intelligence`:
- No dependency on apps, worker, or Telegram internals
- No DB dependency
- No network dependency
- No Solana SDK dependency
- No provider SDK dependency
- No wallet dependency
- No execution dependency

---

## Limitations (Phase 9)

- Fixture/local scoring only — no live provider data
- No wallet cluster intelligence (placeholder unknown flags only)
- No bundle detector (placeholder unknown flags only)
- No funding-source graph analysis
- No live creator/dev wallet fetching
- Confidence is capped due to no live data signals

---

## Next Phase

**Phase 10 (recommended):** Wallet Cluster Intelligence v1 or Bundle/Manipulation Placeholder Models.

These phases may add read-only data models and placeholder classification for wallet clustering and bundle detection patterns — but **not** execution, **not** live trading, and **not** unlocks of FULL_AUTO or LIMITED_LIVE.
