/**
 * Phase 10 — @sonic/wallet-intelligence public API barrel.
 *
 * Exports all Phase 10 Wallet Cluster Intelligence types, models, scoring
 * functions, risk flags, classification, fixtures, validation, and engine
 * functions.
 *
 * What this package provides:
 *   - WalletProfile and WalletCluster types (local model, fixture-only)
 *   - WalletClusterHistoryMetrics for cluster-level history signals
 *   - WalletQualityScore, ClusterQualityScore, LeaderFollowerScore,
 *     FreshWalletRiskScore, FundingSourceScore, WalletComponentScores
 *   - WalletClusterRiskFlag codes, WalletClusterRiskFlagEntry, risk flag helpers
 *   - WalletClusterClassification values
 *   - WalletIntelligenceCapabilities (all unsafe fields false)
 *   - WalletClusterIntelligenceResult (all safety invariants enforced)
 *   - Deterministic scoring functions: scoreWalletProfile, scoreWalletCluster
 *   - Engine: buildWalletClusterIntelligenceResult, classifyWalletCluster,
 *     buildWalletClusterRiskFlags, getWalletIntelligenceCapabilities
 *   - Validation: validateWalletProfile, validateWalletCluster,
 *     validateWalletId, validateWalletAddress, validateClusterId
 *   - Errors: WalletIntelligenceError, WalletIntelligenceErrorCode,
 *     wiOk, wiErr
 *   - Fixtures: 7 deterministic synthetic fixture clusters
 *
 * What this package does NOT provide:
 *   - No Solana RPC
 *   - No Helius / WebSocket / Yellowstone / Geyser providers
 *   - No live wallet data ingestion
 *   - No live funding-source analysis
 *   - No wallet / private key handling
 *   - No transaction construction / signing / sending
 *   - No trade execution
 *   - No copy trading
 *   - No network calls of any kind
 *   - No provider API keys
 *   - No real wallet addresses
 *   - No bundle detector (placeholder flags only)
 *   - No creator-wallet graph analysis (placeholder flags only)
 */

export * from './wallet-profile.js';
export * from './wallet-cluster.js';
export * from './cluster-history.js';
export * from './score-types.js';
export * from './risk-flags.js';
export * from './classifier.js';
export * from './types.js';
export * from './errors.js';
export * from './wallet-quality-score.js';
export * from './cluster-quality-score.js';
export * from './leader-follower-score.js';
export * from './fresh-wallet-score.js';
export * from './funding-source-score.js';
export * from './validation.js';
export * from './fixtures.js';
export * from './wallet-intelligence-engine.js';
