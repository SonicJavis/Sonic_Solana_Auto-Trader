/**
 * Phase 9 — Creator Intelligence v1: Score component types.
 *
 * Defines all creator intelligence score component shapes.
 * Scores are bounded 0–100. Reasons are safe to display.
 * No component produces a trade action or implies live data accuracy.
 */

/**
 * Creator success score — measures historical launch success and migration rate.
 *
 * Score range: 0–100 (higher = better historical success)
 */
export interface CreatorSuccessScore {
  /** Quality contribution from having more launches (0–100 component) */
  readonly launchCountQuality: number;
  /** Quality contribution from migration rate (0–100 component) */
  readonly migrationRateQuality: number;
  /** Quality contribution from average peak performance (0–100 component) */
  readonly peakQuality: number;
  /** Penalty for high failure rate (-100 to 0 component) */
  readonly failurePenalty: number;
  /** Composite success score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons (no trade wording) */
  readonly reasons: readonly string[];
}

/**
 * Creator launch quality score — measures average quality of launches.
 *
 * Score range: 0–100 (higher = better average launch quality)
 */
export interface CreatorLaunchQualityScore {
  /** Holder quality contribution (0–100 component) */
  readonly holderQuality: number;
  /** Liquidity quality contribution (0–100 component) */
  readonly liquidityQuality: number;
  /**
   * Metadata quality placeholder (0–100 component).
   * Phase 9: derived from fixture data only.
   */
  readonly metadataQualityPlaceholder: number;
  /**
   * Momentum quality placeholder (0–100 component).
   * Phase 9: derived from fixture data only.
   */
  readonly momentumQualityPlaceholder: number;
  /** Composite launch quality score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Creator consistency score — measures how consistently the creator performs.
 *
 * Score range: 0–100 (higher = more consistent positive history)
 */
export interface CreatorConsistencyScore {
  /** Repeatability contribution from multiple launches (0–100 component) */
  readonly repeatabilityQuality: number;
  /** Positive history consistency contribution (0–100 component) */
  readonly positiveHistoryConsistency: number;
  /** Penalty for negative/inconsistent patterns (-100 to 0 component) */
  readonly negativeHistoryPenalty: number;
  /** Composite consistency score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Creator suspicious pattern score — measures safety/absence of suspicious patterns.
 *
 * Score range: 0–100.
 * IMPORTANT: Higher score = SAFER (fewer suspicious patterns).
 * 100 = no suspicious patterns detected; 0 = maximum suspicious patterns.
 * This score is used as a safety quality signal — penalizes suspicious behaviours.
 */
export interface CreatorSuspiciousPatternScore {
  /** Penalty for suspicious funding patterns (-100 to 0 component) */
  readonly suspiciousFundingPenalty: number;
  /** Penalty for repeated/copied metadata patterns (-100 to 0 component) */
  readonly repeatedMetadataPenalty: number;
  /** Penalty for suspected bundle abuse (-100 to 0 component) */
  readonly bundleAbusePenalty: number;
  /** Penalty for rug-like launch history (-100 to 0 component) */
  readonly rugLikeLaunchPenalty: number;
  /** Penalty for fast dump history (-100 to 0 component) */
  readonly fastDumpPenalty: number;
  /**
   * Composite suspicious pattern score 0–100.
   * Higher = safer (fewer suspicious patterns detected).
   */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * All creator intelligence component scores together.
 */
export interface CreatorComponentScores {
  readonly successScore: CreatorSuccessScore;
  readonly launchQualityScore: CreatorLaunchQualityScore;
  readonly consistencyScore: CreatorConsistencyScore;
  readonly suspiciousPatternScore: CreatorSuspiciousPatternScore;
}
