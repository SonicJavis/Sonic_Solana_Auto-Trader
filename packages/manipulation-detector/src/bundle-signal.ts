/**
 * Phase 11 — Bundle / Manipulation Detector v1: Bundle signal model.
 *
 * Defines BundleSignal type and signal type constants.
 * All models are local/fixture-only — no Solana RPC, no live data.
 */

/**
 * Signal types for bundle/manipulation detection.
 * All are fixture-only placeholders in Phase 11.
 */
export type BundleSignalType =
  | 'same_slot_participation'
  | 'same_funding_source'
  | 'coordinated_entry'
  | 'coordinated_exit'
  | 'wash_trade_cycle'
  | 'creator_linked_wallets'
  | 'fresh_wallet_farm'
  | 'bot_noise'
  | 'unknown_fixture';

/** All valid signal types */
export const BUNDLE_SIGNAL_TYPES: readonly BundleSignalType[] = [
  'same_slot_participation',
  'same_funding_source',
  'coordinated_entry',
  'coordinated_exit',
  'wash_trade_cycle',
  'creator_linked_wallets',
  'fresh_wallet_farm',
  'bot_noise',
  'unknown_fixture',
] as const;

/** Returns true if the given string is a valid BundleSignalType */
export function isBundleSignalType(value: string): value is BundleSignalType {
  return (BUNDLE_SIGNAL_TYPES as readonly string[]).includes(value);
}

/**
 * A single bundle/manipulation signal observation.
 *
 * All instances must have liveData: false and fixtureOnly: true in Phase 11.
 * No real wallet addresses, no real token mints, no live chain data.
 */
export interface BundleSignal {
  /** Unique identifier for this signal — safe to display */
  readonly signalId: string;
  /** Type of manipulation signal observed */
  readonly signalType: BundleSignalType;
  /** Public token mint identifier (synthetic fixture ID only) */
  readonly tokenMint: string;
  /** Wallet cluster ID associated with this signal */
  readonly clusterId: string;
  /** Creator identifier associated with this signal */
  readonly creatorId: string;
  /** Wallet IDs participating in this signal (synthetic fixture IDs only) */
  readonly walletIds: readonly string[];
  /** Count of wallets observed in the same slot */
  readonly sameSlotParticipationCount: number;
  /** Count of wallets sharing same-funding-source signals */
  readonly sameFundingSourceSignalCount: number;
  /** Count of coordinated-entry signals */
  readonly coordinatedEntrySignalCount: number;
  /** Count of coordinated-exit signals */
  readonly coordinatedExitSignalCount: number;
  /** Count of suspected wash-trade cycles */
  readonly suspectedWashCycleCount: number;
  /** Count of creator-linked wallet signals */
  readonly creatorLinkedWalletSignalCount: number;
  /** ISO timestamp of observation */
  readonly observedAt: string;
  /** Source description (always 'fixture' in Phase 11) */
  readonly source: string;
  /** Always true in Phase 11 — no live data */
  readonly fixtureOnly: boolean;
  /** Always false — no live on-chain data */
  readonly liveData: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: boolean;
}
