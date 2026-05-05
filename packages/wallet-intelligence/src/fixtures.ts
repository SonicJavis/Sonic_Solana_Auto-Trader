/**
 * Phase 10 — Wallet Cluster Intelligence v1: Deterministic fixture clusters.
 *
 * Provides clearly synthetic, deterministic wallet profiles and cluster models
 * for use in tests and local scoring demonstrations.
 *
 * All fixture data is synthetic. No real wallet addresses, no real clusters,
 * no real on-chain data, no API keys, no provider endpoints, no private keys.
 */

import type { WalletProfile } from './wallet-profile.js';
import type { WalletCluster } from './wallet-cluster.js';

const FIXTURE_OBSERVED_AT = '2024-06-01T00:00:00.000Z';

// ── Smart Accumulator Fixture ─────────────────────────────────────────────────

/** Two smart accumulator wallets with good age and hold times */
export const SMART_ACCUMULATOR_FIXTURE_WALLETS: readonly WalletProfile[] = [
  {
    walletId: 'fixture_smart_acc_wallet_001',
    walletAddress: 'FIXTURE_SMART_ACC_WALLET_ADDR_0000001',
    displayLabel: 'Smart Accumulator Wallet A',
    walletAgeDays: 365,
    observedLaunchCount: 12,
    averageHoldTimeSeconds: 7200,
    averageEntryTimingQuality: 0.8,
    averageExitTimingQuality: 0.75,
    profitabilityQualityPlaceholder: 0.72,
    fastDumpSignalCount: 0,
    botNoiseSignalCount: 0,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  {
    walletId: 'fixture_smart_acc_wallet_002',
    walletAddress: 'FIXTURE_SMART_ACC_WALLET_ADDR_0000002',
    displayLabel: 'Smart Accumulator Wallet B',
    walletAgeDays: 280,
    observedLaunchCount: 9,
    averageHoldTimeSeconds: 5400,
    averageEntryTimingQuality: 0.72,
    averageExitTimingQuality: 0.7,
    profitabilityQualityPlaceholder: 0.68,
    fastDumpSignalCount: 0,
    botNoiseSignalCount: 0,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

export const SMART_ACCUMULATOR_FIXTURE_CLUSTER: WalletCluster = {
  clusterId: 'fixture_smart_accumulator_cluster_001',
  clusterType: 'smart_accumulators',
  displayLabel: 'Smart Accumulator Fixture Cluster',
  walletIds: ['fixture_smart_acc_wallet_001', 'fixture_smart_acc_wallet_002'],
  representativeWalletCount: 2,
  sameFundingSourceSignalCount: 0,
  sameSlotParticipationSignalCount: 0,
  creatorLinkedSignalCount: 0,
  freshWalletSignalCount: 0,
  coordinatedSellSignalCount: 0,
  leaderFollowerSignalCount: 1,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ── Profitable Leader Fixture ─────────────────────────────────────────────────

export const PROFITABLE_LEADER_FIXTURE_WALLETS: readonly WalletProfile[] = [
  {
    walletId: 'fixture_profitable_leader_wallet_001',
    walletAddress: 'FIXTURE_PROFITABLE_LEADER_WALLET_001',
    displayLabel: 'Profitable Leader Wallet',
    walletAgeDays: 500,
    observedLaunchCount: 20,
    averageHoldTimeSeconds: 10800,
    averageEntryTimingQuality: 0.85,
    averageExitTimingQuality: 0.82,
    profitabilityQualityPlaceholder: 0.8,
    fastDumpSignalCount: 0,
    botNoiseSignalCount: 0,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

export const PROFITABLE_LEADER_FIXTURE_CLUSTER: WalletCluster = {
  clusterId: 'fixture_profitable_leader_cluster_001',
  clusterType: 'profitable_leaders',
  displayLabel: 'Profitable Leader Fixture Cluster',
  walletIds: ['fixture_profitable_leader_wallet_001'],
  representativeWalletCount: 1,
  sameFundingSourceSignalCount: 0,
  sameSlotParticipationSignalCount: 0,
  creatorLinkedSignalCount: 0,
  freshWalletSignalCount: 0,
  coordinatedSellSignalCount: 0,
  leaderFollowerSignalCount: 2,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ── Fast Dumper Fixture ───────────────────────────────────────────────────────

export const FAST_DUMPER_FIXTURE_WALLETS: readonly WalletProfile[] = [
  {
    walletId: 'fixture_fast_dumper_wallet_001',
    walletAddress: 'FIXTURE_FAST_DUMPER_WALLET_ADDR_00001',
    displayLabel: 'Fast Dumper Wallet A',
    walletAgeDays: 90,
    observedLaunchCount: 8,
    averageHoldTimeSeconds: 45,
    averageEntryTimingQuality: 0.3,
    averageExitTimingQuality: 0.2,
    profitabilityQualityPlaceholder: 0.25,
    fastDumpSignalCount: 5,
    botNoiseSignalCount: 2,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  {
    walletId: 'fixture_fast_dumper_wallet_002',
    walletAddress: 'FIXTURE_FAST_DUMPER_WALLET_ADDR_00002',
    displayLabel: 'Fast Dumper Wallet B',
    walletAgeDays: 60,
    observedLaunchCount: 6,
    averageHoldTimeSeconds: 30,
    averageEntryTimingQuality: 0.2,
    averageExitTimingQuality: 0.15,
    profitabilityQualityPlaceholder: 0.1,
    fastDumpSignalCount: 4,
    botNoiseSignalCount: 3,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

export const FAST_DUMPER_FIXTURE_CLUSTER: WalletCluster = {
  clusterId: 'fixture_fast_dumper_cluster_001',
  clusterType: 'fast_dumpers',
  displayLabel: 'Fast Dumper Fixture Cluster',
  walletIds: ['fixture_fast_dumper_wallet_001', 'fixture_fast_dumper_wallet_002'],
  representativeWalletCount: 2,
  sameFundingSourceSignalCount: 1,
  sameSlotParticipationSignalCount: 3,
  creatorLinkedSignalCount: 0,
  freshWalletSignalCount: 2,
  coordinatedSellSignalCount: 3,
  leaderFollowerSignalCount: 4,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ── Fresh Wallet Farm Fixture ─────────────────────────────────────────────────

export const FRESH_WALLET_FARM_FIXTURE_WALLETS: readonly WalletProfile[] = [
  {
    walletId: 'fixture_fresh_farm_wallet_001',
    walletAddress: 'FIXTURE_FRESH_FARM_WALLET_ADDR_000001',
    displayLabel: 'Fresh Farm Wallet A',
    walletAgeDays: 3,
    observedLaunchCount: 2,
    averageHoldTimeSeconds: 60,
    averageEntryTimingQuality: 0.15,
    averageExitTimingQuality: 0.1,
    profitabilityQualityPlaceholder: 0.1,
    fastDumpSignalCount: 2,
    botNoiseSignalCount: 1,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  {
    walletId: 'fixture_fresh_farm_wallet_002',
    walletAddress: 'FIXTURE_FRESH_FARM_WALLET_ADDR_000002',
    displayLabel: 'Fresh Farm Wallet B',
    walletAgeDays: 5,
    observedLaunchCount: 3,
    averageHoldTimeSeconds: 45,
    averageEntryTimingQuality: 0.1,
    averageExitTimingQuality: 0.08,
    profitabilityQualityPlaceholder: 0.08,
    fastDumpSignalCount: 3,
    botNoiseSignalCount: 2,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

export const FRESH_WALLET_FARM_FIXTURE_CLUSTER: WalletCluster = {
  clusterId: 'fixture_fresh_wallet_farm_cluster_001',
  clusterType: 'fresh_wallet_farm',
  displayLabel: 'Fresh Wallet Farm Fixture Cluster',
  walletIds: ['fixture_fresh_farm_wallet_001', 'fixture_fresh_farm_wallet_002'],
  representativeWalletCount: 2,
  sameFundingSourceSignalCount: 4,
  sameSlotParticipationSignalCount: 4,
  creatorLinkedSignalCount: 1,
  freshWalletSignalCount: 5,
  coordinatedSellSignalCount: 3,
  leaderFollowerSignalCount: 2,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ── Same Funding Source Fixture ───────────────────────────────────────────────

export const SAME_FUNDING_SOURCE_FIXTURE_WALLETS: readonly WalletProfile[] = [
  {
    walletId: 'fixture_same_funding_wallet_001',
    walletAddress: 'FIXTURE_SAME_FUNDING_WALLET_ADDR_0001',
    displayLabel: 'Same Funding Wallet A',
    walletAgeDays: 20,
    observedLaunchCount: 4,
    averageHoldTimeSeconds: 120,
    averageEntryTimingQuality: 0.2,
    averageExitTimingQuality: 0.18,
    profitabilityQualityPlaceholder: 0.15,
    fastDumpSignalCount: 1,
    botNoiseSignalCount: 1,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  {
    walletId: 'fixture_same_funding_wallet_002',
    walletAddress: 'FIXTURE_SAME_FUNDING_WALLET_ADDR_0002',
    displayLabel: 'Same Funding Wallet B',
    walletAgeDays: 18,
    observedLaunchCount: 4,
    averageHoldTimeSeconds: 100,
    averageEntryTimingQuality: 0.18,
    averageExitTimingQuality: 0.15,
    profitabilityQualityPlaceholder: 0.12,
    fastDumpSignalCount: 1,
    botNoiseSignalCount: 2,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

export const SAME_FUNDING_SOURCE_FIXTURE_CLUSTER: WalletCluster = {
  clusterId: 'fixture_same_funding_source_cluster_001',
  clusterType: 'same_funding_source',
  displayLabel: 'Same Funding Source Fixture Cluster',
  walletIds: ['fixture_same_funding_wallet_001', 'fixture_same_funding_wallet_002'],
  representativeWalletCount: 2,
  sameFundingSourceSignalCount: 5,
  sameSlotParticipationSignalCount: 2,
  creatorLinkedSignalCount: 0,
  freshWalletSignalCount: 3,
  coordinatedSellSignalCount: 2,
  leaderFollowerSignalCount: 1,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ── Bot Noise Fixture ─────────────────────────────────────────────────────────

export const BOT_NOISE_FIXTURE_WALLETS: readonly WalletProfile[] = [
  {
    walletId: 'fixture_bot_noise_wallet_001',
    walletAddress: 'FIXTURE_BOT_NOISE_WALLET_ADDR_000001',
    displayLabel: 'Bot Noise Wallet A',
    walletAgeDays: 45,
    observedLaunchCount: 30,
    averageHoldTimeSeconds: 15,
    averageEntryTimingQuality: 0.05,
    averageExitTimingQuality: 0.05,
    profitabilityQualityPlaceholder: 0.05,
    fastDumpSignalCount: 8,
    botNoiseSignalCount: 10,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

export const BOT_NOISE_FIXTURE_CLUSTER: WalletCluster = {
  clusterId: 'fixture_bot_noise_cluster_001',
  clusterType: 'bot_noise',
  displayLabel: 'Bot Noise Fixture Cluster',
  walletIds: ['fixture_bot_noise_wallet_001'],
  representativeWalletCount: 1,
  sameFundingSourceSignalCount: 3,
  sameSlotParticipationSignalCount: 5,
  creatorLinkedSignalCount: 0,
  freshWalletSignalCount: 1,
  coordinatedSellSignalCount: 4,
  leaderFollowerSignalCount: 6,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ── Known Rug Cluster Fixture ─────────────────────────────────────────────────

export const KNOWN_RUG_CLUSTER_FIXTURE_WALLETS: readonly WalletProfile[] = [
  {
    walletId: 'fixture_rug_cluster_wallet_001',
    walletAddress: 'FIXTURE_RUG_CLUSTER_WALLET_ADDR_00001',
    displayLabel: 'Rug Cluster Wallet A',
    walletAgeDays: 10,
    observedLaunchCount: 3,
    averageHoldTimeSeconds: 20,
    averageEntryTimingQuality: 0.05,
    averageExitTimingQuality: 0.05,
    profitabilityQualityPlaceholder: 0.02,
    fastDumpSignalCount: 3,
    botNoiseSignalCount: 4,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
  {
    walletId: 'fixture_rug_cluster_wallet_002',
    walletAddress: 'FIXTURE_RUG_CLUSTER_WALLET_ADDR_00002',
    displayLabel: 'Rug Cluster Wallet B',
    walletAgeDays: 8,
    observedLaunchCount: 3,
    averageHoldTimeSeconds: 18,
    averageEntryTimingQuality: 0.04,
    averageExitTimingQuality: 0.04,
    profitabilityQualityPlaceholder: 0.02,
    fastDumpSignalCount: 4,
    botNoiseSignalCount: 5,
    source: 'fixture',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

export const KNOWN_RUG_CLUSTER_FIXTURE_CLUSTER: WalletCluster = {
  clusterId: 'fixture_known_rug_cluster_001',
  clusterType: 'known_rug_cluster',
  displayLabel: 'Known Rug Cluster Fixture',
  walletIds: ['fixture_rug_cluster_wallet_001', 'fixture_rug_cluster_wallet_002'],
  representativeWalletCount: 2,
  sameFundingSourceSignalCount: 5,
  sameSlotParticipationSignalCount: 5,
  creatorLinkedSignalCount: 3,
  freshWalletSignalCount: 5,
  coordinatedSellSignalCount: 5,
  leaderFollowerSignalCount: 5,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ── Fixture pair type ──────────────────────────────────────────────────────────

/** A paired wallet cluster + wallets fixture */
export interface WalletClusterFixturePair {
  readonly label: string;
  readonly wallets: readonly WalletProfile[];
  readonly cluster: WalletCluster;
}

/** All Phase 10 fixture wallet cluster pairs */
export const ALL_FIXTURE_CLUSTER_PAIRS: readonly WalletClusterFixturePair[] = [
  {
    label: 'smart_accumulator',
    wallets: SMART_ACCUMULATOR_FIXTURE_WALLETS,
    cluster: SMART_ACCUMULATOR_FIXTURE_CLUSTER,
  },
  {
    label: 'profitable_leader',
    wallets: PROFITABLE_LEADER_FIXTURE_WALLETS,
    cluster: PROFITABLE_LEADER_FIXTURE_CLUSTER,
  },
  {
    label: 'fast_dumper',
    wallets: FAST_DUMPER_FIXTURE_WALLETS,
    cluster: FAST_DUMPER_FIXTURE_CLUSTER,
  },
  {
    label: 'fresh_wallet_farm',
    wallets: FRESH_WALLET_FARM_FIXTURE_WALLETS,
    cluster: FRESH_WALLET_FARM_FIXTURE_CLUSTER,
  },
  {
    label: 'same_funding_source',
    wallets: SAME_FUNDING_SOURCE_FIXTURE_WALLETS,
    cluster: SAME_FUNDING_SOURCE_FIXTURE_CLUSTER,
  },
  {
    label: 'bot_noise',
    wallets: BOT_NOISE_FIXTURE_WALLETS,
    cluster: BOT_NOISE_FIXTURE_CLUSTER,
  },
  {
    label: 'known_rug_cluster',
    wallets: KNOWN_RUG_CLUSTER_FIXTURE_WALLETS,
    cluster: KNOWN_RUG_CLUSTER_FIXTURE_CLUSTER,
  },
] as const;
