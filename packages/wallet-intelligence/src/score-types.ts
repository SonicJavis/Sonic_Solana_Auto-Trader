/**
 * Phase 10 — Wallet Cluster Intelligence v1: Score component types.
 *
 * All scores are bounded 0–100. Higher scores mean safer/better unless
 * clearly documented otherwise (e.g. penalty fields where higher = more risk
 * are combined in the final computation to produce a safe final score).
 *
 * No component may produce a trade/copy action or imply live data accuracy.
 */

/**
 * Quality score for a single wallet profile.
 *
 * Higher final score = wallet has better local fixture quality indicators.
 * All fields are safe to display.
 */
export interface WalletQualityScore {
  /** Quality contribution from wallet age (older = better) 0–100 */
  readonly walletAgeQuality: number;
  /** Quality contribution from average hold time 0–100 */
  readonly holdTimeQuality: number;
  /** Quality contribution from entry timing 0–100 */
  readonly entryTimingQuality: number;
  /** Quality contribution from exit timing 0–100 */
  readonly exitTimingQuality: number;
  /** Placeholder profitability quality contribution 0–100 */
  readonly profitabilityPlaceholderQuality: number;
  /** Penalty from fast-dump signal count (higher = worse wallet) 0–100 */
  readonly fastDumpPenalty: number;
  /** Penalty from bot-noise signal count (higher = more bot noise) 0–100 */
  readonly botNoisePenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Quality score for a wallet cluster.
 *
 * Higher final score = cluster has better local fixture quality indicators.
 */
export interface ClusterQualityScore {
  /** Quality contribution from cluster type 0–100 */
  readonly clusterTypeQuality: number;
  /** Quality contribution from representative wallet count 0–100 */
  readonly representativeWalletQuality: number;
  /** Penalty from coordination signals 0–100 */
  readonly coordinationRiskPenalty: number;
  /** Penalty from creator-link signals 0–100 */
  readonly creatorLinkRiskPenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Leader-follower signal score for a wallet cluster.
 *
 * Higher final score = cluster shows fewer leader-follower coordination risks.
 */
export interface LeaderFollowerScore {
  /** Quality contribution from leader-signal count 0–100 */
  readonly leaderSignalQuality: number;
  /** Penalty from follower noise signals 0–100 */
  readonly followerNoisePenalty: number;
  /** Penalty from same-slot participation signals 0–100 */
  readonly sameSlotPenalty: number;
  /** Penalty from coordinated-sell signals 0–100 */
  readonly coordinatedSellPenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Fresh-wallet risk score for a wallet cluster.
 *
 * Higher final score = cluster has fewer fresh-wallet risk indicators.
 * (Fewer fresh wallets = lower risk = higher score.)
 */
export interface FreshWalletRiskScore {
  /** Penalty from fresh wallet count signals 0–100 */
  readonly freshWalletPenalty: number;
  /** Penalty from same-funding-source signals 0–100 */
  readonly sameFundingSourcePenalty: number;
  /** Penalty from low average wallet age 0–100 */
  readonly lowAgePenalty: number;
  /** Penalty from farm-like cluster risk signals 0–100 */
  readonly farmRiskPenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Funding source score for a wallet cluster.
 *
 * Higher final score = cluster has fewer suspicious funding source indicators.
 */
export interface FundingSourceScore {
  /** Penalty from same-funding-source signals 0–100 */
  readonly sameFundingSignalPenalty: number;
  /** Placeholder penalty from suspicious funding patterns 0–100 */
  readonly suspiciousFundingPlaceholderPenalty: number;
  /** Placeholder quality from diverse funding sources 0–100 */
  readonly sourceDiversityPlaceholderQuality: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * All component scores bundled for a wallet cluster intelligence result.
 */
export interface WalletComponentScores {
  readonly walletQualityScore: WalletQualityScore;
  readonly clusterQualityScore: ClusterQualityScore;
  readonly leaderFollowerScore: LeaderFollowerScore;
  readonly freshWalletRiskScore: FreshWalletRiskScore;
  readonly fundingSourceScore: FundingSourceScore;
}
