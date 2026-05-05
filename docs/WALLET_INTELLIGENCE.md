# Wallet Cluster Intelligence — Phase 10 Documentation

## Overview

Phase 10 introduces the **Wallet Cluster Intelligence v1** layer — a local, deterministic model infrastructure for wallet profile analysis and wallet cluster scoring.

This layer provides **fixture/local scoring only**. It contains no live data ingestion, no Solana RPC, no provider APIs, no wallet private key handling, no copy trading, and no trade execution.

---

## Scope

**Phase 10 is model infrastructure only.** It provides:

- Wallet profile models (`WalletProfile`)
- Wallet cluster models (`WalletCluster`, `WalletClusterType`)
- Cluster history metrics (`WalletClusterHistoryMetrics`)
- Component scoring types and functions
- Risk flag infrastructure
- Classification system
- `WalletClusterIntelligenceResult` output type
- Deterministic fixture data (7 synthetic clusters)
- Validation helpers
- Safe error types

**Phase 10 does NOT provide:**

- Live wallet fetching or chain data ingestion
- Solana RPC connectivity
- Helius, QuickNode, Triton, Alchemy, or any provider API
- WebSocket, Yellowstone, or Geyser streaming
- Live funding-source analysis
- Live creator-linked wallet analysis
- Live copy-trading logic
- Bundle detector implementation
- Creator-wallet graph analysis
- Wallet/keypair or private key handling
- Transaction construction, simulation, signing, sending
- Buy/sell/swap execution
- Jito integration
- Jupiter/Raydium/Orca/Meteora swaps
- Strategy trade intents
- Paper trading
- Telegram wallet lookup or copy-trading commands
- FULL_AUTO or LIMITED_LIVE mode enablement

---

## Package: `@sonic/wallet-intelligence`

**Location:** `packages/wallet-intelligence/`

### Source Files

| File | Purpose |
|------|---------|
| `wallet-profile.ts` | `WalletProfile` model — local public identifier only |
| `wallet-cluster.ts` | `WalletCluster` model + `WalletClusterType` values |
| `cluster-history.ts` | `WalletClusterHistoryMetrics` snapshot |
| `score-types.ts` | All component score interfaces |
| `risk-flags.ts` | `WalletClusterRiskFlag` codes + helpers |
| `classifier.ts` | `WalletClusterClassification` values + helpers |
| `types.ts` | `WalletIntelligenceCapabilities` + `WalletClusterIntelligenceResult` |
| `errors.ts` | `WalletIntelligenceError`, `WiResult`, `wiOk`/`wiErr` |
| `wallet-quality-score.ts` | `scoreWalletProfile()` — wallet-level scoring |
| `cluster-quality-score.ts` | `scoreWalletCluster()` — cluster-level scoring |
| `leader-follower-score.ts` | `scoreLeaderFollower()` — coordination signal scoring |
| `fresh-wallet-score.ts` | `scoreFreshWalletRisk()` — fresh-wallet risk scoring |
| `funding-source-score.ts` | `scoreFundingSource()` — funding source risk scoring |
| `validation.ts` | Input validation helpers |
| `fixtures.ts` | 7 synthetic deterministic fixture clusters |
| `wallet-intelligence-engine.ts` | Main engine: `buildWalletClusterIntelligenceResult()` etc. |
| `index.ts` | Public API barrel |

---

## Models

### `WalletProfile`

A local wallet profile model. `walletAddress` is a **public identifier model only** — no wallet access, no signing, no private keys, no funds.

```typescript
interface WalletProfile {
  walletId: string;
  walletAddress: string;       // public identifier only — synthetic in Phase 10
  displayLabel: string;
  walletAgeDays: number;
  observedLaunchCount: number;
  averageHoldTimeSeconds: number;
  averageEntryTimingQuality: number; // 0–1
  averageExitTimingQuality: number;  // 0–1
  profitabilityQualityPlaceholder: number; // 0–1, fixture estimate only
  fastDumpSignalCount: number;
  botNoiseSignalCount: number;
  source: 'fixture';
  fixtureOnly: boolean;   // always true in Phase 10
  liveData: false;        // always false
  safeToDisplay: boolean; // always true
}
```

### `WalletCluster`

A local wallet cluster model grouping wallets by observed pattern.

```typescript
interface WalletCluster {
  clusterId: string;
  clusterType: WalletClusterType;
  displayLabel: string;
  walletIds: readonly string[];
  representativeWalletCount: number;
  sameFundingSourceSignalCount: number;   // placeholder
  sameSlotParticipationSignalCount: number; // placeholder
  creatorLinkedSignalCount: number;       // placeholder
  freshWalletSignalCount: number;
  coordinatedSellSignalCount: number;     // placeholder
  leaderFollowerSignalCount: number;      // placeholder
  observedAt: string;
  fixtureOnly: boolean;  // always true in Phase 10
  liveData: false;       // always false
  safeToDisplay: boolean;
}
```

### `WalletClusterType` values

| Value | Description |
|-------|-------------|
| `smart_accumulators` | Wallets with good entry/exit timing and longer hold times |
| `profitable_leaders` | Wallets with historically strong performance indicators |
| `fast_dumpers` | Wallets with fast-exit dump patterns |
| `fresh_wallet_farm` | Newly created wallets with coordinated patterns |
| `creator_linked` | Wallets with creator-linked signals (placeholder) |
| `same_funding_source` | Wallets sharing funding source signals (placeholder) |
| `bot_noise` | High bot-noise signal wallets |
| `known_rug_cluster` | Cluster with known rug-like coordinated patterns |
| `unknown_fixture` | Uncategorised fixture cluster |

---

## Component Scores

All scores are bounded **0–100**. Higher = safer/better indicators.

### `WalletQualityScore`
Scores a single wallet profile:
- `walletAgeQuality` — older wallets score higher
- `holdTimeQuality` — longer hold times score higher
- `entryTimingQuality`, `exitTimingQuality` — quality of timing signals
- `profitabilityPlaceholderQuality` — fixture estimate
- `fastDumpPenalty`, `botNoisePenalty` — penalties reduce final score

### `ClusterQualityScore`
Scores the cluster model itself:
- `clusterTypeQuality` — known good cluster types score higher
- `representativeWalletQuality` — more representative wallets = higher quality
- `coordinationRiskPenalty` — same-slot + coordinated-sell signals add penalty
- `creatorLinkRiskPenalty` — creator-link signals add penalty (placeholder)

### `LeaderFollowerScore`
Scores coordination signals:
- `leaderSignalQuality` — moderate leader signals are ok; high signals are risky
- `followerNoisePenalty` — same-slot participation signals add noise penalty
- `sameSlotPenalty` — direct same-slot signal penalty
- `coordinatedSellPenalty` — coordinated-sell signals add penalty

### `FreshWalletRiskScore`
Scores fresh-wallet risk (higher = safer):
- `freshWalletPenalty` — fresh wallet signals reduce score
- `sameFundingSourcePenalty` — same-funding signals reduce score (placeholder)
- `lowAgePenalty` — very young wallets reduce score
- `farmRiskPenalty` — farm cluster type adds penalty

### `FundingSourceScore`
Scores funding source risk (higher = safer):
- `sameFundingSignalPenalty` — shared funding signals reduce score (placeholder)
- `suspiciousFundingPlaceholderPenalty` — suspicious types add penalty (placeholder)
- `sourceDiversityPlaceholderQuality` — benign cluster types add diversity quality

---

## Risk Flags

All risk flag entries include `code`, `severity`, `reason`, and `safeToDisplay: true`.

### Flag Codes

| Code | Severity | Description |
|------|----------|-------------|
| `INSUFFICIENT_WALLET_DATA` | high | No wallet profiles provided |
| `INSUFFICIENT_CLUSTER_DATA` | high | No representative wallets |
| `LOW_WALLET_AGE` | warn/high | Average wallet age below threshold |
| `FAST_DUMPER_HISTORY` | warn/high | Fast-dump signals detected |
| `BOT_NOISE_SIGNALS` | warn/high | Bot-noise signals detected |
| `FRESH_WALLET_FARM_PLACEHOLDER` | warn/high | Fresh-wallet farm pattern suspected (placeholder) |
| `SAME_FUNDING_SOURCE_PLACEHOLDER` | warn/high | Shared funding source signals (placeholder) |
| `SAME_SLOT_COORDINATION_PLACEHOLDER` | warn/high | Same-slot participation signals (placeholder) |
| `CREATOR_LINKED_WALLET_PLACEHOLDER` | warn/high | Creator-linked wallet signals (placeholder) |
| `COORDINATED_SELL_PLACEHOLDER` | high/critical | Coordinated-sell signals (placeholder) |
| `LOW_HOLD_TIME` | warn/high | Very short average hold time |
| `LOW_ENTRY_QUALITY` | warn | Low entry timing quality |
| `LOW_EXIT_QUALITY` | warn | Low exit timing quality |
| `LIVE_DATA_UNAVAILABLE` | info | No live data — fixture/local scoring only |
| `BUNDLE_RISK_UNKNOWN` | info | Bundle risk analysis not available in Phase 10 |
| `CREATOR_RELATIONSHIP_UNKNOWN` | info | Creator-wallet graph analysis not available |

**Placeholder flags** (`FRESH_WALLET_FARM_PLACEHOLDER`, `SAME_FUNDING_SOURCE_PLACEHOLDER`, `SAME_SLOT_COORDINATION_PLACEHOLDER`, `CREATOR_LINKED_WALLET_PLACEHOLDER`, `COORDINATED_SELL_PLACEHOLDER`) are model-level risk signals only in Phase 10 — no runtime enforcement or live analysis.

---

## Classification

```typescript
type WalletClusterClassification =
  | 'reject'            // critical risk flags present
  | 'watch_only'        // medium score, missing data or uncertainty
  | 'analysis_only'     // reasonable fixture score — analysis review only
  | 'insufficient_data' // not enough data for meaningful scoring
  | 'fixture_only';     // synthetic fixture data, no real-world inference
```

**Rules:**
- Critical risk flags → `reject`
- Insufficient wallet or cluster data → `insufficient_data`
- Fixture-only with low score → `fixture_only`
- Medium score with missing live data → `watch_only`
- High fixture score → `analysis_only` — **never trade/copy**

No classification value uses trade, buy, sell, execute, copy, mirror, snipe, or enter wording.

---

## `WalletClusterIntelligenceResult`

The complete output of the wallet intelligence engine.

```typescript
interface WalletClusterIntelligenceResult {
  clusterId: string;
  wallets: readonly WalletProfile[];
  cluster: WalletCluster;
  componentScores: WalletComponentScores;
  finalScore: number;         // 0–100
  confidence: number;         // 0–1
  classification: WalletClusterClassification;
  riskFlags: readonly WalletClusterRiskFlagEntry[];
  reasons: readonly string[];
  generatedAt: string;
  fixtureOnly: true;          // always true
  liveData: false;            // always false
  actionAllowed: false;       // always false
  tradingAllowed: false;      // always false
  executionAllowed: false;    // always false
  copyTradingAllowed: false;  // always false
  safeToDisplay: true;        // always true
}
```

---

## Engine Functions

| Function | Description |
|----------|-------------|
| `buildWalletClusterIntelligenceResult(wallets, cluster)` | Main builder — returns `WiResult<WalletClusterIntelligenceResult>` |
| `scoreWalletClusterGroup(wallets, cluster)` | Score wallets + cluster, return component scores + final score + confidence |
| `buildWalletClusterRiskFlags(wallets, cluster)` | Build risk flags array |
| `classifyWalletCluster(flags, score, confidence, cluster)` | Classify cluster (safe values only) |
| `getWalletIntelligenceCapabilities()` | Return static capabilities (all unsafe = false) |

---

## `WalletIntelligenceCapabilities`

```typescript
{
  canUseLiveData: false,
  canUseSolanaRpc: false,
  canUseProviderApis: false,
  canAccessPrivateKeys: false,
  canCreateTradeIntents: false,
  canCopyTrade: false,
  canTrade: false,
  canExecute: false,
  fixtureOnly: true,
  safeToDisplay: true,
}
```

---

## Fixtures

7 deterministic synthetic fixture cluster pairs are provided:

| Label | Cluster Type | Expected Classification |
|-------|-------------|------------------------|
| `smart_accumulator` | `smart_accumulators` | `analysis_only` |
| `profitable_leader` | `profitable_leaders` | `analysis_only` |
| `fast_dumper` | `fast_dumpers` | `fixture_only` or `watch_only` |
| `fresh_wallet_farm` | `fresh_wallet_farm` | `reject` or `fixture_only` |
| `same_funding_source` | `same_funding_source` | `reject` or `fixture_only` |
| `bot_noise` | `bot_noise` | `reject` or `fixture_only` |
| `known_rug_cluster` | `known_rug_cluster` | **`reject`** (critical flags) |

All fixture wallet addresses are synthetic (`FIXTURE_*` prefixed) — not real Solana addresses.

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_WALLET_PROFILE` | Wallet profile validation failed |
| `INVALID_WALLET_CLUSTER` | Cluster validation failed |
| `INVALID_WALLET_ID` | Wallet ID invalid |
| `INVALID_WALLET_ADDRESS` | Wallet address invalid |
| `INVALID_CLUSTER_ID` | Cluster ID invalid |
| `INVALID_CLUSTER_TYPE` | Cluster type not in allowed list |
| `UNSAFE_WALLET_OUTPUT` | Output safety invariant violation |
| `LIVE_DATA_FORBIDDEN` | Attempt to use live data |
| `PROVIDER_DATA_FORBIDDEN` | Attempt to use provider data |
| `PRIVATE_KEY_ACCESS_FORBIDDEN` | Attempt to access private keys |
| `WALLET_SCORE_OUT_OF_RANGE` | Score outside 0–100 |
| `WALLET_CONFIDENCE_OUT_OF_RANGE` | Confidence outside 0–1 |
| `WALLET_INTELLIGENCE_FIXTURE_ONLY` | Non-fixture data provided |

All errors include `safeToDisplay: true` and contain no secrets, stack traces, RPC URLs, API keys, or private key data.

---

## Safety Summary

| Capability | Status |
|-----------|--------|
| Live wallet data | **Forbidden** |
| Solana RPC | **Forbidden** |
| Provider APIs (Helius/QuickNode etc.) | **Forbidden** |
| Private key access | **Forbidden** |
| Trade intent creation | **Forbidden** |
| Copy trading | **Forbidden** |
| Trade execution | **Forbidden** |
| Transaction signing/sending | **Forbidden** |
| FULL_AUTO mode | **Locked** |
| LIMITED_LIVE mode | **Locked** |
| Fixture/local scoring | **Available** |
| Bundle detector | **Not yet implemented** (placeholder flags only) |
| Creator-wallet graph | **Not yet implemented** (placeholder flags only) |

---

## Next Phase

Phase 11 may add **Bundle/Manipulation Detector v1** model infrastructure — local/fixture pattern recognition for bundle signals, manipulation indicators, and wash-trade patterns.

Phase 11 will remain model infrastructure only. No live chain data, no Solana RPC, no execution.
