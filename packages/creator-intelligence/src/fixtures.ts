/**
 * Phase 9 — Creator Intelligence v1: Deterministic fixture creator profiles.
 *
 * Provides clearly synthetic, deterministic creator profiles and history
 * snapshots for use in tests and local scoring demonstrations.
 *
 * All fixture data is synthetic. No real wallet addresses, no real creators,
 * no real on-chain data, no API keys, no provider endpoints, no private keys.
 */

import type { CreatorProfile } from './creator-profile.js';
import type { CreatorLaunchHistorySnapshot } from './creator-history.js';

const FIXTURE_FIRST_SEEN = '2024-01-01T00:00:00.000Z';
const FIXTURE_LAST_SEEN = '2024-06-01T00:00:00.000Z';
const FIXTURE_OBSERVED_AT = '2024-06-01T00:00:00.000Z';

// ── Strong fixture creator ─────────────────────────────────────────────────────

/** A well-established creator with multiple successful launches and high migration rate. */
export const STRONG_FIXTURE_CREATOR_PROFILE: CreatorProfile = {
  creatorId: 'fixture_strong_creator_001',
  creatorAddress: 'FIXTURE_STRONG_CREATOR_ADDR_0000000001',
  displayLabel: 'Strong Fixture Creator',
  firstSeenAt: FIXTURE_FIRST_SEEN,
  lastSeenAt: FIXTURE_LAST_SEEN,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const STRONG_FIXTURE_CREATOR_HISTORY: CreatorLaunchHistorySnapshot = {
  creatorId: 'fixture_strong_creator_001',
  launchCount: 8,
  migratedLaunchCount: 7,
  failedLaunchCount: 1,
  averagePeakQuality: 78,
  averageDumpSpeed: 0.15,
  averageHolderQuality: 0.75,
  averageLiquidityQuality: 0.72,
  suspiciousFundingSignals: 0,
  repeatedMetadataSignals: 0,
  bundleAbuseSignals: 0,
  rugLikeLaunchCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── New fixture creator ────────────────────────────────────────────────────────

/** A brand-new creator with no launch history — triggers insufficient data flags. */
export const NEW_FIXTURE_CREATOR_PROFILE: CreatorProfile = {
  creatorId: 'fixture_new_creator_002',
  creatorAddress: 'FIXTURE_NEW_CREATOR_ADDR_0000000002',
  displayLabel: 'New Fixture Creator',
  firstSeenAt: '2024-06-01T00:00:00.000Z',
  lastSeenAt: '2024-06-01T00:00:00.000Z',
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const NEW_FIXTURE_CREATOR_HISTORY: CreatorLaunchHistorySnapshot = {
  creatorId: 'fixture_new_creator_002',
  launchCount: 0,
  migratedLaunchCount: 0,
  failedLaunchCount: 0,
  averagePeakQuality: 0,
  averageDumpSpeed: 0,
  averageHolderQuality: 0,
  averageLiquidityQuality: 0,
  suspiciousFundingSignals: 0,
  repeatedMetadataSignals: 0,
  bundleAbuseSignals: 0,
  rugLikeLaunchCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── Fast dump fixture creator ──────────────────────────────────────────────────

/** A creator with a history of fast dumps and poor momentum. */
export const FAST_DUMP_FIXTURE_CREATOR_PROFILE: CreatorProfile = {
  creatorId: 'fixture_fast_dump_creator_003',
  creatorAddress: 'FIXTURE_FAST_DUMP_CREATOR_ADDR_000003',
  displayLabel: 'Fast Dump Fixture Creator',
  firstSeenAt: FIXTURE_FIRST_SEEN,
  lastSeenAt: FIXTURE_LAST_SEEN,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const FAST_DUMP_FIXTURE_CREATOR_HISTORY: CreatorLaunchHistorySnapshot = {
  creatorId: 'fixture_fast_dump_creator_003',
  launchCount: 5,
  migratedLaunchCount: 1,
  failedLaunchCount: 3,
  averagePeakQuality: 20,
  averageDumpSpeed: 0.85,
  averageHolderQuality: 0.18,
  averageLiquidityQuality: 0.15,
  suspiciousFundingSignals: 0,
  repeatedMetadataSignals: 0,
  bundleAbuseSignals: 0,
  rugLikeLaunchCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── Repeated metadata fixture creator ─────────────────────────────────────────

/** A creator with repeated/copied metadata patterns across launches. */
export const REPEATED_METADATA_FIXTURE_CREATOR_PROFILE: CreatorProfile = {
  creatorId: 'fixture_repeated_meta_creator_004',
  creatorAddress: 'FIXTURE_REPEATED_META_CREATOR_ADDR_04',
  displayLabel: 'Repeated Metadata Fixture Creator',
  firstSeenAt: FIXTURE_FIRST_SEEN,
  lastSeenAt: FIXTURE_LAST_SEEN,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const REPEATED_METADATA_FIXTURE_CREATOR_HISTORY: CreatorLaunchHistorySnapshot = {
  creatorId: 'fixture_repeated_meta_creator_004',
  launchCount: 6,
  migratedLaunchCount: 1,
  failedLaunchCount: 2,
  averagePeakQuality: 30,
  averageDumpSpeed: 0.55,
  averageHolderQuality: 0.25,
  averageLiquidityQuality: 0.22,
  suspiciousFundingSignals: 0,
  repeatedMetadataSignals: 5,
  bundleAbuseSignals: 0,
  rugLikeLaunchCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── Suspicious funding fixture creator ────────────────────────────────────────

/** A creator with suspicious funding signals across launches (placeholder). */
export const SUSPICIOUS_FUNDING_FIXTURE_CREATOR_PROFILE: CreatorProfile = {
  creatorId: 'fixture_suspicious_funding_creator_005',
  creatorAddress: 'FIXTURE_SUSPICIOUS_FUNDING_CREATOR_05',
  displayLabel: 'Suspicious Funding Fixture Creator',
  firstSeenAt: FIXTURE_FIRST_SEEN,
  lastSeenAt: FIXTURE_LAST_SEEN,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const SUSPICIOUS_FUNDING_FIXTURE_CREATOR_HISTORY: CreatorLaunchHistorySnapshot = {
  creatorId: 'fixture_suspicious_funding_creator_005',
  launchCount: 4,
  migratedLaunchCount: 1,
  failedLaunchCount: 1,
  averagePeakQuality: 35,
  averageDumpSpeed: 0.6,
  averageHolderQuality: 0.2,
  averageLiquidityQuality: 0.18,
  suspiciousFundingSignals: 3,
  repeatedMetadataSignals: 0,
  bundleAbuseSignals: 0,
  rugLikeLaunchCount: 0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── Rug-like fixture creator ───────────────────────────────────────────────────

/** A creator with multiple rug-like launches — triggers critical risk and reject classification. */
export const RUG_LIKE_FIXTURE_CREATOR_PROFILE: CreatorProfile = {
  creatorId: 'fixture_rug_like_creator_006',
  creatorAddress: 'FIXTURE_RUG_LIKE_CREATOR_ADDR_000006',
  displayLabel: 'Rug-Like Fixture Creator',
  firstSeenAt: FIXTURE_FIRST_SEEN,
  lastSeenAt: FIXTURE_LAST_SEEN,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const RUG_LIKE_FIXTURE_CREATOR_HISTORY: CreatorLaunchHistorySnapshot = {
  creatorId: 'fixture_rug_like_creator_006',
  launchCount: 5,
  migratedLaunchCount: 0,
  failedLaunchCount: 4,
  averagePeakQuality: 8,
  averageDumpSpeed: 0.95,
  averageHolderQuality: 0.05,
  averageLiquidityQuality: 0.04,
  suspiciousFundingSignals: 2,
  repeatedMetadataSignals: 3,
  bundleAbuseSignals: 2,
  rugLikeLaunchCount: 4,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── Fixture pair type ──────────────────────────────────────────────────────────

/** A paired creator profile + history fixture */
export interface CreatorFixturePair {
  readonly label: string;
  readonly profile: CreatorProfile;
  readonly history: CreatorLaunchHistorySnapshot;
}

/** All Phase 9 fixture creator pairs */
export const ALL_FIXTURE_CREATOR_PAIRS: readonly CreatorFixturePair[] = [
  {
    label: 'strong',
    profile: STRONG_FIXTURE_CREATOR_PROFILE,
    history: STRONG_FIXTURE_CREATOR_HISTORY,
  },
  {
    label: 'new',
    profile: NEW_FIXTURE_CREATOR_PROFILE,
    history: NEW_FIXTURE_CREATOR_HISTORY,
  },
  {
    label: 'fast_dump',
    profile: FAST_DUMP_FIXTURE_CREATOR_PROFILE,
    history: FAST_DUMP_FIXTURE_CREATOR_HISTORY,
  },
  {
    label: 'repeated_metadata',
    profile: REPEATED_METADATA_FIXTURE_CREATOR_PROFILE,
    history: REPEATED_METADATA_FIXTURE_CREATOR_HISTORY,
  },
  {
    label: 'suspicious_funding',
    profile: SUSPICIOUS_FUNDING_FIXTURE_CREATOR_PROFILE,
    history: SUSPICIOUS_FUNDING_FIXTURE_CREATOR_HISTORY,
  },
  {
    label: 'rug_like',
    profile: RUG_LIKE_FIXTURE_CREATOR_PROFILE,
    history: RUG_LIKE_FIXTURE_CREATOR_HISTORY,
  },
] as const;
