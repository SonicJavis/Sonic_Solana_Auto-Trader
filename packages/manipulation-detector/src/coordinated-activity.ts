/**
 * Phase 11 — Bundle / Manipulation Detector v1: Coordinated activity snapshot.
 *
 * Defines CoordinatedActivitySnapshot model.
 * All models are local/fixture-only — no Solana RPC, no live data.
 */

/**
 * A snapshot of coordinated activity metrics for a token.
 *
 * All instances must have liveData: false and fixtureOnly: true in Phase 11.
 * Metrics are synthetic fixture counts — not derived from live chain data.
 */
export interface CoordinatedActivitySnapshot {
  /** Unique snapshot identifier — safe to display */
  readonly snapshotId: string;
  /** Public token mint identifier (synthetic fixture ID only) */
  readonly tokenMint: string;
  /** Total number of participating wallets observed */
  readonly participatingWalletCount: number;
  /** Number of wallets observed in the same slot */
  readonly sameSlotWalletCount: number;
  /** Number of wallets sharing same-funding-source signals */
  readonly sameFundingWalletCount: number;
  /** Number of coordinated-entry observations */
  readonly coordinatedEntryCount: number;
  /** Number of coordinated-exit observations */
  readonly coordinatedExitCount: number;
  /** Number of suspected wash-trade cycles */
  readonly washTradeCycleCount: number;
  /** Number of creator-linked wallet observations */
  readonly creatorLinkedWalletCount: number;
  /** Number of fresh-wallet observations */
  readonly freshWalletCount: number;
  /** Number of bot-noise signal observations */
  readonly botNoiseSignalCount: number;
  /** ISO timestamp of observation */
  readonly observedAt: string;
  /** Always true in Phase 11 — no live data */
  readonly fixtureOnly: boolean;
  /** Always false — no live on-chain data */
  readonly liveData: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: boolean;
}
