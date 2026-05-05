# MANIPULATION_DETECTOR.md

## Phase 11 — Bundle / Manipulation Detector v1

**Status:** Local fixture detector only. No live bundle detection. No live wash-trade detection.

---

## Overview

The `@sonic/manipulation-detector` package provides a local, deterministic, fixture-only model layer for bundle and manipulation detection.

**This is a model-only package.** It does not:

- Connect to any providers, Solana RPC, or external APIs
- Ingest live chain events or market data
- Access or process real wallet addresses or private keys
- Create trade intents, enforcement actions, or buy/sell instructions
- Construct, simulate, sign, send, or execute any transactions
- Enable FULL_AUTO or LIMITED_LIVE modes

All scores, flags, and classifications are computed from local/fixture data only.

---

## Package Location

```
packages/manipulation-detector/
  src/
    index.ts                       — Public API barrel
    types.ts                       — ManipulationDetectorCapabilities, ManipulationDetectionResult
    bundle-signal.ts               — BundleSignal model, BundleSignalType
    manipulation-pattern.ts        — ManipulationPattern model, ManipulationPatternType
    coordinated-activity.ts        — CoordinatedActivitySnapshot model
    score-types.ts                 — Score component interfaces
    bundle-score.ts                — scoreBundleSignals()
    wash-trade-score.ts            — scoreWashTradePatterns()
    coordination-score.ts          — scoreCoordination()
    funding-pattern-score.ts       — scoreFundingPatterns()
    creator-link-score.ts          — scoreCreatorLinks()
    risk-flags.ts                  — ManipulationRiskFlag codes and helpers
    classifier.ts                  — ManipulationClassification and helpers
    manipulation-detector-engine.ts — Engine orchestration
    fixtures.ts                    — 8 deterministic synthetic fixtures
    validation.ts                  — Input validation
    errors.ts                      — Error codes, MdResult, mdOk, mdErr
```

---

## Models

### BundleSignal

Represents a single bundle/manipulation signal observation:

| Field | Type | Description |
|-------|------|-------------|
| signalId | string | Unique signal identifier |
| signalType | BundleSignalType | Type of signal (9 values) |
| tokenMint | string | Synthetic fixture token mint ID |
| clusterId | string | Wallet cluster identifier |
| creatorId | string | Creator identifier |
| walletIds | string[] | Participating wallet IDs |
| sameSlotParticipationCount | number | Same-slot wallet count |
| sameFundingSourceSignalCount | number | Same-funding-source count |
| coordinatedEntrySignalCount | number | Coordinated entry count |
| coordinatedExitSignalCount | number | Coordinated exit count |
| suspectedWashCycleCount | number | Suspected wash cycle count |
| creatorLinkedWalletSignalCount | number | Creator-linked wallet count |
| liveData | false | Always false |
| fixtureOnly | boolean | True in Phase 11 |
| safeToDisplay | boolean | Always true |

Signal types: `same_slot_participation`, `same_funding_source`, `coordinated_entry`, `coordinated_exit`, `wash_trade_cycle`, `creator_linked_wallets`, `fresh_wallet_farm`, `bot_noise`, `unknown_fixture`

### ManipulationPattern

Represents a detected manipulation pattern:

| Field | Type | Description |
|-------|------|-------------|
| patternId | string | Unique pattern identifier |
| patternType | ManipulationPatternType | Type of pattern (9 values) |
| severityHint | ManipulationSeverityHint | Display hint (not enforcement) |
| signalIds | string[] | Contributing signal IDs |
| confidenceHint | number | Confidence 0–1 |
| description | string | Human-readable description |
| liveData | false | Always false |
| fixtureOnly | boolean | True in Phase 11 |
| safeToDisplay | boolean | Always true |

Pattern types: `likely_bundle`, `possible_bundle`, `likely_wash_trade`, `possible_wash_trade`, `coordinated_dump`, `creator_linked_manipulation`, `fresh_wallet_farm_pattern`, `bot_noise_pattern`, `unknown_fixture`

### CoordinatedActivitySnapshot

Counts of coordinated activity signals for a token:

| Field | Type | Description |
|-------|------|-------------|
| snapshotId | string | Unique snapshot identifier |
| tokenMint | string | Synthetic fixture token mint ID |
| participatingWalletCount | number | Total wallets |
| sameSlotWalletCount | number | Same-slot wallet count |
| sameFundingWalletCount | number | Same-funding wallet count |
| coordinatedEntryCount | number | Coordinated entries |
| coordinatedExitCount | number | Coordinated exits |
| washTradeCycleCount | number | Wash trade cycles |
| creatorLinkedWalletCount | number | Creator-linked wallets |
| freshWalletCount | number | Fresh wallets |
| botNoiseSignalCount | number | Bot noise signals |
| liveData | false | Always false |
| fixtureOnly | boolean | True in Phase 11 |
| safeToDisplay | boolean | Always true |

---

## Scoring

All scores are bounded **0–100**. Higher score = safer (less manipulation detected).

### Components

| Component | Function | Description |
|-----------|----------|-------------|
| BundleRiskScore | `scoreBundleSignals()` | Same-slot, same-funding, coordinated entry/exit penalties |
| WashTradeScore | `scoreWashTradePatterns()` | Wash-cycle, repeated-counterparty placeholder, volume-symmetry placeholder |
| CoordinationScore | `scoreCoordination()` | Participant quality, coordination, coordinated-dump, bot-noise |
| FundingPatternScore | `scoreFundingPatterns()` | Diversity placeholder, same-funding, suspicious-funding placeholder |
| CreatorLinkScore | `scoreCreatorLinks()` | Creator-linked wallet, creator-history placeholder, relationship-unknown |

### Final Score

Weighted composite of component scores:

```
finalScore = bundleRisk × 0.30 + washTrade × 0.25 + coordination × 0.20 + fundingPattern × 0.15 + creatorLink × 0.10
```

---

## Risk Flags

17 flag codes with severity `info | warn | high | critical`:

| Code | Severity | Description |
|------|----------|-------------|
| INSUFFICIENT_MANIPULATION_DATA | high | No signals provided |
| SAME_SLOT_PARTICIPATION_PLACEHOLDER | warn/high | Same-slot signals |
| SAME_FUNDING_SOURCE_PLACEHOLDER | warn/high | Same-funding signals |
| COORDINATED_ENTRY_PLACEHOLDER | warn/high | Coordinated entry signals |
| COORDINATED_EXIT_PLACEHOLDER | warn/high | Coordinated exit signals |
| WASH_TRADE_CYCLE_PLACEHOLDER | warn/high | Wash cycle signals |
| CREATOR_LINKED_WALLETS_PLACEHOLDER | warn/high | Creator-linked wallet signals |
| FRESH_WALLET_FARM_PLACEHOLDER | warn/high | Fresh wallet count signals |
| BOT_NOISE_PATTERN | warn/high | Bot noise signals |
| LIKELY_BUNDLE_PATTERN | critical | Likely bundle pattern detected |
| POSSIBLE_BUNDLE_PATTERN | high | Possible bundle pattern detected |
| LIKELY_WASH_TRADE_PATTERN | critical | Likely wash trade detected |
| POSSIBLE_WASH_TRADE_PATTERN | high | Possible wash trade detected |
| COORDINATED_DUMP_PATTERN | critical | Coordinated dump detected |
| LIVE_DATA_UNAVAILABLE | info | No live data — fixture only |
| WALLET_CLUSTER_CONTEXT_UNKNOWN | info | No wallet cluster context |
| CREATOR_CONTEXT_UNKNOWN | info | No creator context |

---

## Classification

5 safe values (no trade wording):

| Value | Condition |
|-------|-----------|
| `reject` | Critical flags, likely bundle/wash/dump patterns |
| `watch_only` | Score < 25 or confidence < 0.3 |
| `analysis_only` | Clean, low-risk fixture data |
| `insufficient_data` | No signals or very low confidence |
| `fixture_only` | (Reserved for future use) |

---

## ManipulationDetectionResult Safety Invariants

Every result enforces:

| Field | Value |
|-------|-------|
| `liveData` | `false` |
| `fixtureOnly` | `true` |
| `actionAllowed` | `false` |
| `tradingAllowed` | `false` |
| `executionAllowed` | `false` |
| `enforcementAllowed` | `false` |
| `safeToDisplay` | `true` |

---

## Capabilities

```typescript
getManipulationDetectorCapabilities() → {
  canUseLiveData: false,
  canUseSolanaRpc: false,
  canUseProviderApis: false,
  canAccessPrivateKeys: false,
  canCreateTradeIntents: false,
  canCreateEnforcementActions: false,
  canTrade: false,
  canExecute: false,
  fixtureOnly: true,
  safeToDisplay: true,
}
```

---

## Fixtures

8 deterministic synthetic fixture groups (no real data):

| Name | Expected Classification |
|------|------------------------|
| clean_activity_fixture | analysis_only |
| likely_bundle_fixture | reject |
| possible_bundle_fixture | reject or watch_only |
| likely_wash_trade_fixture | reject |
| coordinated_dump_fixture | reject |
| creator_linked_manipulation_fixture | watch_only or reject |
| fresh_wallet_farm_manipulation_fixture | reject or watch_only |
| bot_noise_fixture | watch_only or analysis_only |

All fixture token mints begin with `FIXTURE_`. All wallet IDs begin with `fixture_`. No real addresses.

---

## Usage Example

```typescript
import {
  buildManipulationDetectionResult,
  LIKELY_BUNDLE_FIXTURE_SIGNAL,
  LIKELY_BUNDLE_FIXTURE_ACTIVITY,
  LIKELY_BUNDLE_FIXTURE_PATTERNS,
} from '@sonic/manipulation-detector';

const result = buildManipulationDetectionResult({
  resultId: 'example_result_001',
  tokenMint: LIKELY_BUNDLE_FIXTURE_SIGNAL.tokenMint,
  signals: [LIKELY_BUNDLE_FIXTURE_SIGNAL],
  patterns: LIKELY_BUNDLE_FIXTURE_PATTERNS,
  activity: LIKELY_BUNDLE_FIXTURE_ACTIVITY,
});

if (result.ok) {
  console.log(result.value.classification); // 'reject'
  console.log(result.value.finalScore);     // low score
  console.log(result.value.actionAllowed);  // false
}
```

---

## Safety Constraints

- **No live bundle detection** — Phase 11 fixture/placeholder only
- **No live wash-trade detection** — Phase 11 fixture/placeholder only
- **No providers** — No Helius, QuickNode, Triton, Alchemy
- **No Solana RPC** — No `@solana/web3.js` or any RPC calls
- **No live wallet/funding-source fetching** — Placeholder flags only
- **No enforcement actions** — Analysis display only
- **No trade intents** — No buy/sell/execute instructions
- **No transaction construction/simulation/signing/sending**
- **No wallet/private key access**
- **FULL_AUTO and LIMITED_LIVE remain locked**

---

## Next Phase

Phase 12 may add Risk Engine v1 model layer. Risk Engine integrates Token Intelligence, Creator Intelligence, Wallet Intelligence, and Manipulation Detector scores into a unified risk assessment. No execution in Phase 12.
