/**
 * Phase 8 — Token Intelligence v1: Score component types.
 *
 * Defines the shape of each scoring component output.
 * All scores are bounded 0–100.
 * No component implies a trade action.
 * All reason strings are safe to display.
 */

/**
 * Metadata quality score component.
 * Evaluates the completeness and quality of token identity/metadata.
 */
export interface MetadataQualityScore {
  /** Fraction of metadata fields present (0–1) */
  readonly completeness: number;
  /** Quality of the token name (0–1): non-empty, non-gibberish */
  readonly nameQuality: number;
  /** Quality of the token symbol (0–1): non-empty, reasonable length */
  readonly symbolQuality: number;
  /** Whether an image is present */
  readonly imagePresence: boolean;
  /** Whether at least one social link is present */
  readonly socialPresence: boolean;
  /**
   * Placeholder: suspicious metadata reuse detection.
   * Always false in Phase 8 (no live comparison data).
   */
  readonly suspiciousReusePlaceholder: false;
  /** Composite metadata quality score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons for the score */
  readonly reasons: readonly string[];
}

/**
 * Curve quality score component.
 * Evaluates the bonding curve progress relative to an ideal window.
 */
export interface CurveQualityScore {
  /**
   * Quality of curve progress position.
   * Penalises very early (<5%) and very late (>85%) curves.
   * 0–1.
   */
  readonly curveProgressQuality: number;
  /** Quality of on-curve reserve level (0–1) */
  readonly reserveQuality: number;
  /**
   * Penalty applied when the curve is too early or too advanced.
   * 0 = no penalty, 1 = full penalty.
   */
  readonly tooEarlyOrTooLatePenalty: number;
  /** Composite curve quality score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons for the score */
  readonly reasons: readonly string[];
}

/**
 * Holder concentration score component.
 * Evaluates how distributed the token supply is.
 */
export interface HolderConcentrationScore {
  /**
   * Penalty for high top-holder concentration.
   * 0 = no penalty, 1 = maximum penalty.
   */
  readonly topHolderPenalty: number;
  /** Quality of holder count (more holders = higher quality, 0–1) */
  readonly holderCountQuality: number;
  /**
   * Concentration risk level 0–1.
   * Higher = more concentrated / higher risk.
   */
  readonly concentrationRisk: number;
  /** Composite holder concentration score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons for the score */
  readonly reasons: readonly string[];
}

/**
 * Liquidity quality score component.
 * Evaluates the depth and quality of available liquidity.
 */
export interface LiquidityQualityScore {
  /** Quality of virtual liquidity level (0–1) */
  readonly virtualLiquidityQuality: number;
  /** Quality of reserve level (0–1) */
  readonly reserveQuality: number;
  /**
   * Placeholder: exit liquidity assessment.
   * Always null in Phase 8 (no live order book data).
   */
  readonly exitLiquidityPlaceholder: null;
  /** Composite liquidity quality score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons for the score */
  readonly reasons: readonly string[];
}

/**
 * Organic momentum score component.
 * Evaluates whether buy/sell activity appears organic.
 */
export interface OrganicMomentumScore {
  /**
   * Buy/sell velocity balance.
   * 1 = all buys, 0 = balanced, negative = sell-heavy.
   * Range -1 to 1.
   */
  readonly buySellBalance: number;
  /** Quality of unique buyer count (more = higher quality, 0–1) */
  readonly uniqueBuyerQuality: number;
  /**
   * Quality of volume trend.
   * 1 = strong upward, 0 = flat, negative = downward.
   */
  readonly volumeTrendQuality: number;
  /**
   * Placeholder: bot noise detection.
   * Always false in Phase 8 (no live wallet cluster data).
   */
  readonly botNoisePlaceholder: false;
  /** Composite organic momentum score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons for the score */
  readonly reasons: readonly string[];
}

/**
 * All component scores bundled together.
 */
export interface TokenComponentScores {
  readonly metadata: MetadataQualityScore;
  readonly curve: CurveQualityScore;
  readonly holderConcentration: HolderConcentrationScore;
  readonly liquidity: LiquidityQualityScore;
  readonly organicMomentum: OrganicMomentumScore;
}
