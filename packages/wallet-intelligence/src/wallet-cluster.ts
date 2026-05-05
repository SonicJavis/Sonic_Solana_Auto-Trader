/**
 * Phase 10 — Wallet Cluster Intelligence v1: Wallet cluster model.
 *
 * Local-only wallet cluster types.
 * All liveData fields are false. fixtureOnly is true for fixture data.
 * walletIds contains model-level identifiers only — no wallet access,
 * no signing, no private keys.
 */

/**
 * Type of wallet cluster observed in local/fixture data.
 *
 * All values are analysis-only — no trade/copy action implied.
 */
export type WalletClusterType =
  | 'smart_accumulators'
  | 'profitable_leaders'
  | 'fast_dumpers'
  | 'fresh_wallet_farm'
  | 'creator_linked'
  | 'same_funding_source'
  | 'bot_noise'
  | 'known_rug_cluster'
  | 'unknown_fixture';

/** All valid WalletClusterType values */
export const WALLET_CLUSTER_TYPES: readonly WalletClusterType[] = [
  'smart_accumulators',
  'profitable_leaders',
  'fast_dumpers',
  'fresh_wallet_farm',
  'creator_linked',
  'same_funding_source',
  'bot_noise',
  'known_rug_cluster',
  'unknown_fixture',
] as const;

/**
 * A local wallet cluster model.
 *
 * Safety invariants:
 *   - liveData is always false in Phase 10
 *   - fixtureOnly is true for all fixture clusters
 *   - walletIds are model-level identifiers only (no wallet access)
 *   - No private keys, seed phrases, raw funding graphs, or provider data
 */
export interface WalletCluster {
  /** Unique identifier for this cluster within the intelligence model */
  readonly clusterId: string;
  /** Type of cluster observed */
  readonly clusterType: WalletClusterType;
  /** Human-readable display label (safe to display) */
  readonly displayLabel: string;
  /** Wallet IDs belonging to this cluster */
  readonly walletIds: readonly string[];
  /** Number of representative wallets in the cluster */
  readonly representativeWalletCount: number;
  /** Number of same-funding-source signals observed (placeholder) */
  readonly sameFundingSourceSignalCount: number;
  /** Number of same-slot participation signals observed (placeholder) */
  readonly sameSlotParticipationSignalCount: number;
  /** Number of creator-linked wallet signals observed (placeholder) */
  readonly creatorLinkedSignalCount: number;
  /** Number of fresh-wallet signals observed */
  readonly freshWalletSignalCount: number;
  /** Number of coordinated-sell signals observed (placeholder) */
  readonly coordinatedSellSignalCount: number;
  /** Number of leader-follower signals observed (placeholder) */
  readonly leaderFollowerSignalCount: number;
  /** ISO timestamp when this cluster was observed */
  readonly observedAt: string;
  /** Always true for Phase 10 fixture clusters */
  readonly fixtureOnly: boolean;
  /** Always false in Phase 10 — no live data */
  readonly liveData: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: boolean;
}
