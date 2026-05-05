/**
 * Phase 11 — Bundle / Manipulation Detector v1: Deterministic synthetic fixtures.
 *
 * Provides clearly synthetic, deterministic bundle signals, manipulation patterns,
 * and coordinated activity snapshots for use in tests and local detection.
 *
 * All fixture data is synthetic. No real wallet addresses, no real token mints,
 * no real creators, no live RPC URLs, no API keys, no private keys.
 */

import type { BundleSignal } from './bundle-signal.js';
import type { ManipulationPattern } from './manipulation-pattern.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';

const FIXTURE_OBSERVED_AT = '2024-06-01T00:00:00.000Z';

// ── Clean Activity Fixture ────────────────────────────────────────────────────

/** Clean, low-risk activity fixture — no manipulation signals */
export const CLEAN_ACTIVITY_FIXTURE_SIGNAL: BundleSignal = {
  signalId: 'fixture_signal_clean_001',
  signalType: 'unknown_fixture',
  tokenMint: 'FIXTURE_CLEAN_TOKEN_MINT_0000001',
  clusterId: 'fixture_clean_cluster_001',
  creatorId: 'fixture_clean_creator_001',
  walletIds: ['fixture_clean_wallet_001', 'fixture_clean_wallet_002'],
  sameSlotParticipationCount: 0,
  sameFundingSourceSignalCount: 0,
  coordinatedEntrySignalCount: 0,
  coordinatedExitSignalCount: 0,
  suspectedWashCycleCount: 0,
  creatorLinkedWalletSignalCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const CLEAN_ACTIVITY_FIXTURE_ACTIVITY: CoordinatedActivitySnapshot = {
  snapshotId: 'fixture_snapshot_clean_001',
  tokenMint: 'FIXTURE_CLEAN_TOKEN_MINT_0000001',
  participatingWalletCount: 8,
  sameSlotWalletCount: 0,
  sameFundingWalletCount: 0,
  coordinatedEntryCount: 0,
  coordinatedExitCount: 0,
  washTradeCycleCount: 0,
  creatorLinkedWalletCount: 0,
  freshWalletCount: 1,
  botNoiseSignalCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const CLEAN_ACTIVITY_FIXTURE_PATTERNS: readonly ManipulationPattern[] = [] as const;

// ── Likely Bundle Fixture ─────────────────────────────────────────────────────

/** High-risk bundle activity fixture */
export const LIKELY_BUNDLE_FIXTURE_SIGNAL: BundleSignal = {
  signalId: 'fixture_signal_bundle_001',
  signalType: 'same_slot_participation',
  tokenMint: 'FIXTURE_BUNDLE_TOKEN_MINT_0000002',
  clusterId: 'fixture_bundle_cluster_001',
  creatorId: 'fixture_bundle_creator_001',
  walletIds: [
    'fixture_bundle_wallet_001',
    'fixture_bundle_wallet_002',
    'fixture_bundle_wallet_003',
    'fixture_bundle_wallet_004',
    'fixture_bundle_wallet_005',
  ],
  sameSlotParticipationCount: 8,
  sameFundingSourceSignalCount: 6,
  coordinatedEntrySignalCount: 5,
  coordinatedExitSignalCount: 4,
  suspectedWashCycleCount: 0,
  creatorLinkedWalletSignalCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const LIKELY_BUNDLE_FIXTURE_ACTIVITY: CoordinatedActivitySnapshot = {
  snapshotId: 'fixture_snapshot_bundle_001',
  tokenMint: 'FIXTURE_BUNDLE_TOKEN_MINT_0000002',
  participatingWalletCount: 5,
  sameSlotWalletCount: 5,
  sameFundingWalletCount: 5,
  coordinatedEntryCount: 5,
  coordinatedExitCount: 4,
  washTradeCycleCount: 0,
  creatorLinkedWalletCount: 0,
  freshWalletCount: 4,
  botNoiseSignalCount: 2,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const LIKELY_BUNDLE_FIXTURE_PATTERNS: readonly ManipulationPattern[] = [
  {
    patternId: 'fixture_pattern_bundle_001',
    patternType: 'likely_bundle',
    severityHint: 'critical',
    signalIds: ['fixture_signal_bundle_001'],
    confidenceHint: 0.9,
    description:
      'Likely bundle pattern: high same-slot and same-funding coordination (fixture/placeholder)',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

// ── Possible Bundle Fixture ───────────────────────────────────────────────────

/** Medium-risk possible bundle activity fixture */
export const POSSIBLE_BUNDLE_FIXTURE_SIGNAL: BundleSignal = {
  signalId: 'fixture_signal_possible_bundle_001',
  signalType: 'coordinated_entry',
  tokenMint: 'FIXTURE_POSSIBLE_BUNDLE_TOKEN_MINT_003',
  clusterId: 'fixture_possible_bundle_cluster_001',
  creatorId: 'fixture_possible_bundle_creator_001',
  walletIds: ['fixture_pb_wallet_001', 'fixture_pb_wallet_002', 'fixture_pb_wallet_003'],
  sameSlotParticipationCount: 3,
  sameFundingSourceSignalCount: 2,
  coordinatedEntrySignalCount: 3,
  coordinatedExitSignalCount: 1,
  suspectedWashCycleCount: 0,
  creatorLinkedWalletSignalCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const POSSIBLE_BUNDLE_FIXTURE_ACTIVITY: CoordinatedActivitySnapshot = {
  snapshotId: 'fixture_snapshot_possible_bundle_001',
  tokenMint: 'FIXTURE_POSSIBLE_BUNDLE_TOKEN_MINT_003',
  participatingWalletCount: 6,
  sameSlotWalletCount: 3,
  sameFundingWalletCount: 2,
  coordinatedEntryCount: 3,
  coordinatedExitCount: 1,
  washTradeCycleCount: 0,
  creatorLinkedWalletCount: 0,
  freshWalletCount: 2,
  botNoiseSignalCount: 1,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const POSSIBLE_BUNDLE_FIXTURE_PATTERNS: readonly ManipulationPattern[] = [
  {
    patternId: 'fixture_pattern_possible_bundle_001',
    patternType: 'possible_bundle',
    severityHint: 'high',
    signalIds: ['fixture_signal_possible_bundle_001'],
    confidenceHint: 0.6,
    description:
      'Possible bundle pattern: moderate same-slot and coordinated-entry signals (fixture/placeholder)',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

// ── Likely Wash Trade Fixture ─────────────────────────────────────────────────

/** High-risk wash trade fixture */
export const LIKELY_WASH_TRADE_FIXTURE_SIGNAL: BundleSignal = {
  signalId: 'fixture_signal_wash_trade_001',
  signalType: 'wash_trade_cycle',
  tokenMint: 'FIXTURE_WASH_TRADE_TOKEN_MINT_0004',
  clusterId: 'fixture_wash_trade_cluster_001',
  creatorId: 'fixture_wash_trade_creator_001',
  walletIds: ['fixture_wt_wallet_001', 'fixture_wt_wallet_002'],
  sameSlotParticipationCount: 1,
  sameFundingSourceSignalCount: 2,
  coordinatedEntrySignalCount: 1,
  coordinatedExitSignalCount: 1,
  suspectedWashCycleCount: 5,
  creatorLinkedWalletSignalCount: 1,
  observedAt: FIXTURE_OBSERVED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const LIKELY_WASH_TRADE_FIXTURE_ACTIVITY: CoordinatedActivitySnapshot = {
  snapshotId: 'fixture_snapshot_wash_trade_001',
  tokenMint: 'FIXTURE_WASH_TRADE_TOKEN_MINT_0004',
  participatingWalletCount: 3,
  sameSlotWalletCount: 1,
  sameFundingWalletCount: 2,
  coordinatedEntryCount: 1,
  coordinatedExitCount: 1,
  washTradeCycleCount: 5,
  creatorLinkedWalletCount: 1,
  freshWalletCount: 1,
  botNoiseSignalCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const LIKELY_WASH_TRADE_FIXTURE_PATTERNS: readonly ManipulationPattern[] = [
  {
    patternId: 'fixture_pattern_wash_trade_001',
    patternType: 'likely_wash_trade',
    severityHint: 'critical',
    signalIds: ['fixture_signal_wash_trade_001'],
    confidenceHint: 0.88,
    description:
      'Likely wash-trade pattern: high wash-cycle count with creator-linked wallets (fixture/placeholder)',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

// ── Coordinated Dump Fixture ──────────────────────────────────────────────────

/** High-risk coordinated dump fixture */
export const COORDINATED_DUMP_FIXTURE_SIGNAL: BundleSignal = {
  signalId: 'fixture_signal_coord_dump_001',
  signalType: 'coordinated_exit',
  tokenMint: 'FIXTURE_COORD_DUMP_TOKEN_MINT_00005',
  clusterId: 'fixture_coord_dump_cluster_001',
  creatorId: 'fixture_coord_dump_creator_001',
  walletIds: [
    'fixture_cd_wallet_001',
    'fixture_cd_wallet_002',
    'fixture_cd_wallet_003',
    'fixture_cd_wallet_004',
  ],
  sameSlotParticipationCount: 2,
  sameFundingSourceSignalCount: 3,
  coordinatedEntrySignalCount: 1,
  coordinatedExitSignalCount: 6,
  suspectedWashCycleCount: 0,
  creatorLinkedWalletSignalCount: 2,
  observedAt: FIXTURE_OBSERVED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const COORDINATED_DUMP_FIXTURE_ACTIVITY: CoordinatedActivitySnapshot = {
  snapshotId: 'fixture_snapshot_coord_dump_001',
  tokenMint: 'FIXTURE_COORD_DUMP_TOKEN_MINT_00005',
  participatingWalletCount: 5,
  sameSlotWalletCount: 2,
  sameFundingWalletCount: 3,
  coordinatedEntryCount: 1,
  coordinatedExitCount: 6,
  washTradeCycleCount: 0,
  creatorLinkedWalletCount: 2,
  freshWalletCount: 3,
  botNoiseSignalCount: 1,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const COORDINATED_DUMP_FIXTURE_PATTERNS: readonly ManipulationPattern[] = [
  {
    patternId: 'fixture_pattern_coord_dump_001',
    patternType: 'coordinated_dump',
    severityHint: 'critical',
    signalIds: ['fixture_signal_coord_dump_001'],
    confidenceHint: 0.85,
    description:
      'Coordinated dump pattern: heavy coordinated-exit with same-funding signals (fixture/placeholder)',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

// ── Creator Linked Manipulation Fixture ──────────────────────────────────────

/** Creator-linked manipulation fixture */
export const CREATOR_LINKED_MANIPULATION_FIXTURE_SIGNAL: BundleSignal = {
  signalId: 'fixture_signal_creator_linked_001',
  signalType: 'creator_linked_wallets',
  tokenMint: 'FIXTURE_CREATOR_LINKED_TOKEN_MINT_006',
  clusterId: 'fixture_creator_linked_cluster_001',
  creatorId: 'fixture_creator_linked_creator_001',
  walletIds: ['fixture_cl_wallet_001', 'fixture_cl_wallet_002', 'fixture_cl_wallet_003'],
  sameSlotParticipationCount: 1,
  sameFundingSourceSignalCount: 2,
  coordinatedEntrySignalCount: 2,
  coordinatedExitSignalCount: 1,
  suspectedWashCycleCount: 1,
  creatorLinkedWalletSignalCount: 4,
  observedAt: FIXTURE_OBSERVED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const CREATOR_LINKED_MANIPULATION_FIXTURE_ACTIVITY: CoordinatedActivitySnapshot = {
  snapshotId: 'fixture_snapshot_creator_linked_001',
  tokenMint: 'FIXTURE_CREATOR_LINKED_TOKEN_MINT_006',
  participatingWalletCount: 4,
  sameSlotWalletCount: 1,
  sameFundingWalletCount: 2,
  coordinatedEntryCount: 2,
  coordinatedExitCount: 1,
  washTradeCycleCount: 1,
  creatorLinkedWalletCount: 4,
  freshWalletCount: 2,
  botNoiseSignalCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const CREATOR_LINKED_MANIPULATION_FIXTURE_PATTERNS: readonly ManipulationPattern[] = [
  {
    patternId: 'fixture_pattern_creator_linked_001',
    patternType: 'creator_linked_manipulation',
    severityHint: 'high',
    signalIds: ['fixture_signal_creator_linked_001'],
    confidenceHint: 0.75,
    description:
      'Creator-linked manipulation pattern: multiple creator-linked wallets observed (fixture/placeholder)',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

// ── Fresh Wallet Farm Manipulation Fixture ────────────────────────────────────

/** Fresh wallet farm manipulation fixture */
export const FRESH_WALLET_FARM_MANIPULATION_FIXTURE_SIGNAL: BundleSignal = {
  signalId: 'fixture_signal_fresh_farm_001',
  signalType: 'fresh_wallet_farm',
  tokenMint: 'FIXTURE_FRESH_FARM_TOKEN_MINT_00007',
  clusterId: 'fixture_fresh_farm_cluster_001',
  creatorId: 'fixture_fresh_farm_creator_001',
  walletIds: [
    'fixture_ff_wallet_001',
    'fixture_ff_wallet_002',
    'fixture_ff_wallet_003',
    'fixture_ff_wallet_004',
    'fixture_ff_wallet_005',
    'fixture_ff_wallet_006',
  ],
  sameSlotParticipationCount: 4,
  sameFundingSourceSignalCount: 5,
  coordinatedEntrySignalCount: 4,
  coordinatedExitSignalCount: 2,
  suspectedWashCycleCount: 0,
  creatorLinkedWalletSignalCount: 1,
  observedAt: FIXTURE_OBSERVED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const FRESH_WALLET_FARM_MANIPULATION_FIXTURE_ACTIVITY: CoordinatedActivitySnapshot = {
  snapshotId: 'fixture_snapshot_fresh_farm_001',
  tokenMint: 'FIXTURE_FRESH_FARM_TOKEN_MINT_00007',
  participatingWalletCount: 6,
  sameSlotWalletCount: 4,
  sameFundingWalletCount: 5,
  coordinatedEntryCount: 4,
  coordinatedExitCount: 2,
  washTradeCycleCount: 0,
  creatorLinkedWalletCount: 1,
  freshWalletCount: 6,
  botNoiseSignalCount: 2,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const FRESH_WALLET_FARM_MANIPULATION_FIXTURE_PATTERNS: readonly ManipulationPattern[] = [
  {
    patternId: 'fixture_pattern_fresh_farm_001',
    patternType: 'fresh_wallet_farm_pattern',
    severityHint: 'high',
    signalIds: ['fixture_signal_fresh_farm_001'],
    confidenceHint: 0.78,
    description:
      'Fresh wallet farm pattern: all wallets are fresh with same-funding signals (fixture/placeholder)',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

// ── Bot Noise Fixture ─────────────────────────────────────────────────────────

/** Bot noise activity fixture */
export const BOT_NOISE_FIXTURE_SIGNAL: BundleSignal = {
  signalId: 'fixture_signal_bot_noise_001',
  signalType: 'bot_noise',
  tokenMint: 'FIXTURE_BOT_NOISE_TOKEN_MINT_000008',
  clusterId: 'fixture_bot_noise_cluster_001',
  creatorId: 'fixture_bot_noise_creator_001',
  walletIds: ['fixture_bn_wallet_001', 'fixture_bn_wallet_002'],
  sameSlotParticipationCount: 1,
  sameFundingSourceSignalCount: 0,
  coordinatedEntrySignalCount: 0,
  coordinatedExitSignalCount: 0,
  suspectedWashCycleCount: 0,
  creatorLinkedWalletSignalCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const BOT_NOISE_FIXTURE_ACTIVITY: CoordinatedActivitySnapshot = {
  snapshotId: 'fixture_snapshot_bot_noise_001',
  tokenMint: 'FIXTURE_BOT_NOISE_TOKEN_MINT_000008',
  participatingWalletCount: 4,
  sameSlotWalletCount: 1,
  sameFundingWalletCount: 0,
  coordinatedEntryCount: 0,
  coordinatedExitCount: 0,
  washTradeCycleCount: 0,
  creatorLinkedWalletCount: 0,
  freshWalletCount: 1,
  botNoiseSignalCount: 6,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
} as const;

export const BOT_NOISE_FIXTURE_PATTERNS: readonly ManipulationPattern[] = [
  {
    patternId: 'fixture_pattern_bot_noise_001',
    patternType: 'bot_noise_pattern',
    severityHint: 'medium',
    signalIds: ['fixture_signal_bot_noise_001'],
    confidenceHint: 0.55,
    description:
      'Bot noise pattern: elevated bot-noise signals with minor same-slot participation (fixture/placeholder)',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  },
] as const;

// ── All Fixtures ──────────────────────────────────────────────────────────────

/** All fixture groups bundled for iteration in tests */
export const ALL_MANIPULATION_FIXTURE_GROUPS = [
  {
    name: 'clean_activity_fixture',
    signal: CLEAN_ACTIVITY_FIXTURE_SIGNAL,
    activity: CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    patterns: CLEAN_ACTIVITY_FIXTURE_PATTERNS,
  },
  {
    name: 'likely_bundle_fixture',
    signal: LIKELY_BUNDLE_FIXTURE_SIGNAL,
    activity: LIKELY_BUNDLE_FIXTURE_ACTIVITY,
    patterns: LIKELY_BUNDLE_FIXTURE_PATTERNS,
  },
  {
    name: 'possible_bundle_fixture',
    signal: POSSIBLE_BUNDLE_FIXTURE_SIGNAL,
    activity: POSSIBLE_BUNDLE_FIXTURE_ACTIVITY,
    patterns: POSSIBLE_BUNDLE_FIXTURE_PATTERNS,
  },
  {
    name: 'likely_wash_trade_fixture',
    signal: LIKELY_WASH_TRADE_FIXTURE_SIGNAL,
    activity: LIKELY_WASH_TRADE_FIXTURE_ACTIVITY,
    patterns: LIKELY_WASH_TRADE_FIXTURE_PATTERNS,
  },
  {
    name: 'coordinated_dump_fixture',
    signal: COORDINATED_DUMP_FIXTURE_SIGNAL,
    activity: COORDINATED_DUMP_FIXTURE_ACTIVITY,
    patterns: COORDINATED_DUMP_FIXTURE_PATTERNS,
  },
  {
    name: 'creator_linked_manipulation_fixture',
    signal: CREATOR_LINKED_MANIPULATION_FIXTURE_SIGNAL,
    activity: CREATOR_LINKED_MANIPULATION_FIXTURE_ACTIVITY,
    patterns: CREATOR_LINKED_MANIPULATION_FIXTURE_PATTERNS,
  },
  {
    name: 'fresh_wallet_farm_manipulation_fixture',
    signal: FRESH_WALLET_FARM_MANIPULATION_FIXTURE_SIGNAL,
    activity: FRESH_WALLET_FARM_MANIPULATION_FIXTURE_ACTIVITY,
    patterns: FRESH_WALLET_FARM_MANIPULATION_FIXTURE_PATTERNS,
  },
  {
    name: 'bot_noise_fixture',
    signal: BOT_NOISE_FIXTURE_SIGNAL,
    activity: BOT_NOISE_FIXTURE_ACTIVITY,
    patterns: BOT_NOISE_FIXTURE_PATTERNS,
  },
] as const;
