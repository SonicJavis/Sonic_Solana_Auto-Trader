/**
 * Phase 10 — Wallet Cluster Intelligence v1: Wallet profile model.
 *
 * Local-only wallet profile types.
 * All liveData fields are false. fixtureOnly is true for fixture data.
 * walletAddress is a public identifier model only — no wallet access,
 * no signing, no private keys, no funds.
 */

/**
 * Source of a wallet profile record.
 * In Phase 10, only 'fixture' is valid.
 */
export type WalletProfileSource = 'fixture';

/**
 * A local wallet profile.
 *
 * Safety invariants:
 *   - liveData is always false in Phase 10
 *   - fixtureOnly is true for all fixture profiles
 *   - walletAddress is a public identifier model only (no wallet access)
 *   - No private keys, seed phrases, or wallet secrets
 *   - No live provider provenance
 */
export interface WalletProfile {
  /** Unique identifier for this wallet within the intelligence model */
  readonly walletId: string;
  /**
   * Public wallet address (model identifier only).
   * In Phase 10, always a synthetic fixture address.
   * NOT connected to wallet access, signing, or private keys.
   */
  readonly walletAddress: string;
  /** Human-readable display label (safe to display) */
  readonly displayLabel: string;
  /** Approximate wallet age in days (fixture estimate) */
  readonly walletAgeDays: number;
  /** Number of launches this wallet was observed participating in */
  readonly observedLaunchCount: number;
  /** Average hold time in seconds across observed launches */
  readonly averageHoldTimeSeconds: number;
  /** Average entry timing quality 0–1 (fixture estimate) */
  readonly averageEntryTimingQuality: number;
  /** Average exit timing quality 0–1 (fixture estimate) */
  readonly averageExitTimingQuality: number;
  /**
   * Profitability quality placeholder 0–1.
   * Phase 10: fixture/model estimate only — no live P&L data.
   */
  readonly profitabilityQualityPlaceholder: number;
  /** Number of fast-dump signals observed for this wallet */
  readonly fastDumpSignalCount: number;
  /** Number of bot-noise signals observed for this wallet */
  readonly botNoiseSignalCount: number;
  /** Source of the profile data */
  readonly source: WalletProfileSource;
  /** Always true for Phase 10 fixture profiles */
  readonly fixtureOnly: boolean;
  /** Always false in Phase 10 — no live data */
  readonly liveData: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: boolean;
}
