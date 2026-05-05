/**
 * Phase 9 — Creator Intelligence v1: Creator profile model.
 *
 * Local-only creator profile types.
 * All liveData fields are false. fixtureOnly is true for fixture data.
 * creatorAddress is a public identifier model only — no wallet access,
 * no signing, no private keys, no funds.
 */

/**
 * Source of a creator profile record.
 * In Phase 9, only 'fixture' is valid.
 */
export type CreatorProfileSource = 'fixture';

/**
 * A local creator profile.
 *
 * Safety invariants:
 *   - liveData is always false in Phase 9
 *   - fixtureOnly is true for all fixture profiles
 *   - creatorAddress is a public identifier model only (no wallet access)
 *   - No private keys, seed phrases, or wallet secrets
 *   - No live provider provenance
 */
export interface CreatorProfile {
  /** Unique identifier for this creator within the intelligence model */
  readonly creatorId: string;
  /**
   * Public creator/dev wallet address (model identifier only).
   * In Phase 9, always a synthetic fixture address.
   * NOT connected to wallet access, signing, or private keys.
   */
  readonly creatorAddress: string;
  /** Human-readable display label (safe to display) */
  readonly displayLabel: string;
  /** ISO timestamp when this creator was first observed (fixture date in Phase 9) */
  readonly firstSeenAt: string;
  /** ISO timestamp when this creator was last observed (fixture date in Phase 9) */
  readonly lastSeenAt: string;
  /** Source of the profile data */
  readonly source: CreatorProfileSource;
  /** Always true for Phase 9 fixture profiles */
  readonly fixtureOnly: boolean;
  /** Always false in Phase 9 — no live data */
  readonly liveData: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: boolean;
}
