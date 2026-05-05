/**
 * Phase 10 — Wallet Cluster Intelligence v1: Cluster history metrics.
 *
 * Local snapshot of cluster-level history signals.
 * All liveData fields are false. fixtureOnly is true for fixture data.
 */

/**
 * A snapshot of historical metrics for a wallet cluster.
 *
 * Safety invariants:
 *   - liveData is always false in Phase 10
 *   - fixtureOnly is true for all fixture snapshots
 *   - No live chain data, no provider provenance
 */
export interface WalletClusterHistoryMetrics {
  /** Cluster ID this snapshot belongs to */
  readonly clusterId: string;
  /** Total launches where cluster wallets were observed */
  readonly observedLaunchCount: number;
  /** Average hold time across all cluster wallets in seconds */
  readonly averageHoldTimeSeconds: number;
  /** Average entry timing quality 0–1 across cluster wallets (fixture estimate) */
  readonly averageEntryTimingQuality: number;
  /** Average exit timing quality 0–1 across cluster wallets (fixture estimate) */
  readonly averageExitTimingQuality: number;
  /** Total fast-dump signal count across cluster wallets */
  readonly totalFastDumpSignalCount: number;
  /** Total bot-noise signal count across cluster wallets */
  readonly totalBotNoiseSignalCount: number;
  /**
   * Average wallet age in days across cluster wallets.
   * Low values indicate a fresh-wallet farm pattern.
   */
  readonly averageWalletAgeDays: number;
  /** ISO timestamp when this metrics snapshot was observed */
  readonly observedAt: string;
  /** Always true for Phase 10 fixture snapshots */
  readonly fixtureOnly: boolean;
  /** Always false in Phase 10 — no live data */
  readonly liveData: false;
}
