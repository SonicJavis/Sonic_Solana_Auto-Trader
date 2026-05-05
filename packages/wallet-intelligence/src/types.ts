/**
 * Phase 10 — Wallet Cluster Intelligence v1: Core types.
 *
 * Re-exports wallet profile and score types, and defines capabilities
 * and the top-level wallet cluster intelligence result.
 */

export type { WalletProfile, WalletProfileSource } from './wallet-profile.js';
export type { WalletCluster, WalletClusterType } from './wallet-cluster.js';
export type { WalletClusterHistoryMetrics } from './cluster-history.js';
export type {
  WalletQualityScore,
  ClusterQualityScore,
  LeaderFollowerScore,
  FreshWalletRiskScore,
  FundingSourceScore,
  WalletComponentScores,
} from './score-types.js';
export type {
  WalletClusterRiskFlag,
  WalletClusterRiskFlagEntry,
  WalletClusterRiskFlagSeverity,
} from './risk-flags.js';
export type { WalletClusterClassification } from './classifier.js';

/**
 * Static capabilities of the Phase 10 wallet intelligence engine.
 *
 * All unsafe capabilities are always false.
 * fixtureOnly is always true.
 *
 * This object is returned by getWalletIntelligenceCapabilities()
 * to communicate system boundaries clearly.
 */
export interface WalletIntelligenceCapabilities {
  /** Always false — no live data in Phase 10 */
  readonly canUseLiveData: false;
  /** Always false — no Solana RPC in Phase 10 */
  readonly canUseSolanaRpc: false;
  /** Always false — no provider APIs in Phase 10 */
  readonly canUseProviderApis: false;
  /** Always false — no private key access in Phase 10 */
  readonly canAccessPrivateKeys: false;
  /** Always false — no trade intents in Phase 10 */
  readonly canCreateTradeIntents: false;
  /** Always false — no copy trading in Phase 10 */
  readonly canCopyTrade: false;
  /** Always false — no trading in Phase 10 */
  readonly canTrade: false;
  /** Always false — no execution in Phase 10 */
  readonly canExecute: false;
  /** Always true — fixture/local scoring only in Phase 10 */
  readonly fixtureOnly: true;
  /** Whether this capabilities object is safe to display */
  readonly safeToDisplay: true;
}

/**
 * The complete wallet cluster intelligence result for a single cluster.
 *
 * Safety invariants (enforced at construction time):
 *   - actionAllowed/tradingAllowed/executionAllowed/copyTradingAllowed are always false
 *   - liveData is always false
 *   - fixtureOnly is always true
 *   - safeToDisplay is always true
 *   - finalScore is bounded 0–100
 *   - confidence is bounded 0–1
 *   - No secrets, no private wallet data, no raw URLs, no RPC endpoints
 *   - finalScore must not be described as a trading signal
 */
export interface WalletClusterIntelligenceResult {
  /** Cluster ID of the analysed cluster */
  readonly clusterId: string;
  /** The wallet profiles used in scoring */
  readonly wallets: readonly import('./wallet-profile.js').WalletProfile[];
  /** The wallet cluster model */
  readonly cluster: import('./wallet-cluster.js').WalletCluster;
  /** Individual component scores */
  readonly componentScores: import('./score-types.js').WalletComponentScores;
  /** Weighted composite score 0–100 */
  readonly finalScore: number;
  /**
   * Confidence in the result 0–1.
   * Degrades when data is missing or incomplete.
   */
  readonly confidence: number;
  /** Classification of the cluster — never uses trade wording */
  readonly classification: import('./classifier.js').WalletClusterClassification;
  /** Risk flags raised by the scoring components */
  readonly riskFlags: readonly import('./risk-flags.js').WalletClusterRiskFlagEntry[];
  /** Safe human-readable reasons for the overall result */
  readonly reasons: readonly string[];
  /** ISO timestamp when this result was generated */
  readonly generatedAt: string;
  /** Always true — only fixture data in Phase 10 */
  readonly fixtureOnly: true;
  /** Always false — no live data in Phase 10 */
  readonly liveData: false;
  /** Always false — no trading actions permitted */
  readonly actionAllowed: false;
  /** Always false — no trading permitted */
  readonly tradingAllowed: false;
  /** Always false — no execution permitted */
  readonly executionAllowed: false;
  /** Always false — no copy trading permitted */
  readonly copyTradingAllowed: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: true;
}
