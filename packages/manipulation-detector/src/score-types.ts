/**
 * Phase 11 — Bundle / Manipulation Detector v1: Score component types.
 *
 * All scores are bounded 0–100. Higher scores mean safer/lower manipulation risk
 * unless clearly documented otherwise.
 *
 * No component may produce a trade/copy action or imply live data accuracy.
 */

/**
 * Bundle risk score component.
 *
 * Higher score = fewer bundle risk indicators detected.
 * Lower score = more bundle-like signals present.
 */
export interface BundleRiskScore {
  /** Penalty from same-slot participation signals 0–100 */
  readonly sameSlotPenalty: number;
  /** Penalty from same-funding-source signals 0–100 */
  readonly sameFundingPenalty: number;
  /** Penalty from coordinated-entry signals 0–100 */
  readonly coordinatedEntryPenalty: number;
  /** Penalty from coordinated-exit signals 0–100 */
  readonly coordinatedExitPenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Wash trade score component.
 *
 * Higher score = fewer wash-trade risk indicators detected.
 */
export interface WashTradeScore {
  /** Penalty from suspected wash-cycle signals 0–100 */
  readonly washCyclePenalty: number;
  /** Placeholder penalty from repeated-counterparty patterns 0–100 */
  readonly repeatedCounterpartyPlaceholderPenalty: number;
  /** Placeholder penalty from volume-symmetry patterns 0–100 */
  readonly volumeSymmetryPlaceholderPenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Coordination score component.
 *
 * Higher score = less coordinated manipulation detected.
 */
export interface CoordinationScore {
  /** Quality from participant diversity 0–100 */
  readonly participantQuality: number;
  /** Penalty from coordination signal count 0–100 */
  readonly coordinationPenalty: number;
  /** Penalty from coordinated-dump patterns 0–100 */
  readonly coordinatedDumpPenalty: number;
  /** Penalty from bot-noise signals 0–100 */
  readonly botNoisePenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Funding pattern score component.
 *
 * Higher score = more diverse / less suspicious funding signals.
 */
export interface FundingPatternScore {
  /** Placeholder quality from funding diversity 0–100 */
  readonly diversityPlaceholderQuality: number;
  /** Penalty from same-funding signals 0–100 */
  readonly sameFundingPenalty: number;
  /** Placeholder penalty from suspicious funding patterns 0–100 */
  readonly suspiciousFundingPlaceholderPenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * Creator link score component.
 *
 * Higher score = fewer creator-linked manipulation indicators.
 */
export interface CreatorLinkScore {
  /** Penalty from creator-linked wallet signals 0–100 */
  readonly creatorLinkedWalletPenalty: number;
  /** Placeholder penalty from creator-history patterns 0–100 */
  readonly creatorHistoryPlaceholderPenalty: number;
  /** Penalty from unknown creator-wallet relationships 0–100 */
  readonly relationshipUnknownPenalty: number;
  /** Final bounded score 0–100 */
  readonly score: number;
  /** Safe human-readable reasons */
  readonly reasons: readonly string[];
}

/**
 * All component scores bundled for a manipulation detection result.
 */
export interface ManipulationComponentScores {
  readonly bundleRiskScore: BundleRiskScore;
  readonly washTradeScore: WashTradeScore;
  readonly coordinationScore: CoordinationScore;
  readonly fundingPatternScore: FundingPatternScore;
  readonly creatorLinkScore: CreatorLinkScore;
}
