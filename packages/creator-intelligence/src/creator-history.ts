/**
 * Phase 9 — Creator Intelligence v1: Creator launch history model.
 *
 * Snapshot of a creator's historical launch metrics.
 * All liveData fields are false. fixtureOnly is true for fixture data.
 * No live chain data, no provider API, no wallet data.
 */

/**
 * A snapshot of a creator's historical launch metrics.
 *
 * Safety invariants:
 *   - liveData is always false in Phase 9
 *   - fixtureOnly is true for fixture histories
 *   - All numeric fields are finite and bounded
 *   - No private keys, funding graphs, or wallet secrets
 *   - No live provider provenance
 */
export interface CreatorLaunchHistorySnapshot {
  /** Creator ID this history snapshot belongs to */
  readonly creatorId: string;
  /** Total number of launches observed for this creator */
  readonly launchCount: number;
  /**
   * Number of launches that reached migration (e.g. graduated from bonding curve).
   * Always 0 for new creators with no history.
   */
  readonly migratedLaunchCount: number;
  /** Number of launches that failed (low traction, no holders, abandoned) */
  readonly failedLaunchCount: number;
  /**
   * Average peak quality score (0–100) across observed launches.
   * 0 if no launches observed.
   */
  readonly averagePeakQuality: number;
  /**
   * Average dump speed indicator (0–1).
   * 1 = very fast dumps; 0 = stable/no dump.
   */
  readonly averageDumpSpeed: number;
  /**
   * Average holder quality across launches (0–1).
   * 0 if unknown or no launches.
   */
  readonly averageHolderQuality: number;
  /**
   * Average liquidity quality across launches (0–1).
   * 0 if unknown or no launches.
   */
  readonly averageLiquidityQuality: number;
  /**
   * Number of launches with suspicious funding signals observed.
   * Phase 9 placeholder — always 0 unless fixture data provides a value.
   */
  readonly suspiciousFundingSignals: number;
  /**
   * Number of launches with repeated/copied metadata signals.
   * Phase 9 placeholder.
   */
  readonly repeatedMetadataSignals: number;
  /**
   * Number of launches with suspected bundle abuse signals.
   * Phase 9 placeholder.
   */
  readonly bundleAbuseSignals: number;
  /** Number of launches that exhibited rug-like characteristics */
  readonly rugLikeLaunchCount: number;
  /** ISO timestamp when this snapshot was observed (fixture date in Phase 9) */
  readonly observedAt: string;
  /** Always true for Phase 9 fixture histories */
  readonly fixtureOnly: boolean;
  /** Always false in Phase 9 — no live data */
  readonly liveData: false;
}
