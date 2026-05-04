/**
 * Phase 8 — Token Intelligence v1: Core token profile and metric types.
 *
 * All types are local-only model types. No live data, no Solana RPC,
 * no provider SDK, no wallet data, no API keys.
 *
 * Safety invariants:
 *   - liveData must always be false in Phase 8
 *   - fixtureOnly must be true for fixture/synthetic profiles
 *   - No wallet addresses, private keys, or raw secrets
 *   - No raw provider URLs
 *   - Social/website presence is represented as booleans, not raw URLs
 */

/**
 * Source of a token profile.
 * In Phase 8, only 'fixture' is valid.
 */
export type TokenProfileSource = 'fixture';

/**
 * A local-only token profile.
 *
 * Represents the descriptive/identity information about a token.
 * All boolean presence fields replace raw URLs for safety.
 * liveData is always false in Phase 8.
 * fixtureOnly is always true for fixture/synthetic data.
 */
export interface TokenProfile {
  /** Stable local identifier for this profile */
  readonly tokenId: string;
  /**
   * Token mint address (synthetic/fixture only in Phase 8).
   * Does not represent a real on-chain address.
   */
  readonly tokenMint: string;
  /** Display name of the token */
  readonly name: string;
  /** Ticker symbol */
  readonly symbol: string;
  /** Token description (may be empty) */
  readonly description: string;
  /** Whether an image URI is present (boolean — no raw URLs) */
  readonly imageUriPresent: boolean;
  /** Whether a website is present (boolean — no raw URLs) */
  readonly websitePresent: boolean;
  /** Whether a Telegram link is present (boolean — no raw links) */
  readonly telegramPresent: boolean;
  /** Whether a Twitter/X link is present (boolean — no raw links) */
  readonly twitterPresent: boolean;
  /** ISO timestamp when this profile was first observed */
  readonly createdAt: string;
  /** Source of this profile — always 'fixture' in Phase 8 */
  readonly source: TokenProfileSource;
  /** Always true for synthetic/fixture profiles in Phase 8 */
  readonly fixtureOnly: true;
  /** Always false in Phase 8 — no live data is used */
  readonly liveData: false;
  /** Whether this profile is safe to display in control-plane output */
  readonly safeToDisplay: boolean;
}

/**
 * A snapshot of quantitative metrics for a token at a point in time.
 *
 * All values are from fixture/local model data only.
 * liveData is always false in Phase 8.
 * fixtureOnly is always true for fixture data.
 *
 * Numeric fields represent model/fixture values — not real on-chain values.
 */
export interface TokenMetricSnapshot {
  /**
   * Token mint address this snapshot applies to.
   * Must match a TokenProfile.tokenMint.
   */
  readonly tokenMint: string;
  /**
   * Bonding curve progress as a fraction 0–1.
   * 0 = just launched, 1 = fully graduated.
   */
  readonly curveProgress: number;
  /**
   * Virtual liquidity in SOL-equivalent units (fixture/model value).
   * Always >= 0.
   */
  readonly virtualLiquidity: number;
  /**
   * Qualitative reserve quality derived from fixture data.
   * 0 = no liquidity, 1 = excellent.
   */
  readonly reserveQuality: number;
  /** Number of distinct token holders (fixture/model value) */
  readonly holderCount: number;
  /**
   * Percentage of supply held by the top holder(s).
   * 0–100.
   */
  readonly topHolderPercent: number;
  /** Number of unique buyers observed (fixture/model value) */
  readonly uniqueBuyerCount: number;
  /**
   * Buy velocity: buys per unit time window (fixture/model value).
   * Always >= 0.
   */
  readonly buyVelocity: number;
  /**
   * Sell velocity: sells per unit time window (fixture/model value).
   * Always >= 0.
   */
  readonly sellVelocity: number;
  /**
   * Volume trend: positive = increasing, negative = decreasing.
   * Range -1 to 1.
   */
  readonly volumeTrend: number;
  /**
   * Metadata completeness fraction 0–1.
   * Derived from TokenProfile presence fields.
   */
  readonly metadataCompleteness: number;
  /**
   * Social completeness fraction 0–1.
   * Derived from social presence booleans.
   */
  readonly socialCompleteness: number;
  /** ISO timestamp of when this snapshot was generated */
  readonly observedAt: string;
  /** Always true for fixture/synthetic snapshots in Phase 8 */
  readonly fixtureOnly: true;
  /** Always false in Phase 8 — no live data is used */
  readonly liveData: false;
}
