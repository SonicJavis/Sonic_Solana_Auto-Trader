/**
 * Phase 8 — Token Intelligence v1: Fixture token profiles.
 *
 * Provides deterministic, clearly synthetic token profiles and metric snapshots
 * for use in tests and local scoring demonstrations.
 *
 * All fixture data is synthetic. No real wallet addresses, no real token mints,
 * no real on-chain data, no API keys, no provider endpoints.
 */

import type { TokenProfile, TokenMetricSnapshot } from './token-profile.js';

const FIXTURE_OBSERVED_AT = '2024-01-01T00:00:00.000Z';
const FIXTURE_CREATED_AT = '2024-01-01T00:00:00.000Z';

// ── Good fixture token ─────────────────────────────────────────────────────────

/** A well-rounded fixture token with good metadata, liquidity, and holder distribution. */
export const GOOD_FIXTURE_TOKEN_PROFILE: TokenProfile = {
  tokenId: 'fixture_good_001',
  tokenMint: 'FIXTURE_GOOD_MINT_0000000000000000001',
  name: 'Good Fixture Token',
  symbol: 'GFT',
  description: 'A synthetic fixture token with complete metadata for Phase 8 testing.',
  imageUriPresent: true,
  websitePresent: true,
  telegramPresent: true,
  twitterPresent: true,
  createdAt: FIXTURE_CREATED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const GOOD_FIXTURE_TOKEN_METRICS: TokenMetricSnapshot = {
  tokenMint: 'FIXTURE_GOOD_MINT_0000000000000000001',
  curveProgress: 0.40,
  virtualLiquidity: 45,
  reserveQuality: 0.8,
  holderCount: 120,
  topHolderPercent: 12,
  uniqueBuyerCount: 60,
  buyVelocity: 10,
  sellVelocity: 3,
  volumeTrend: 0.6,
  metadataCompleteness: 1.0,
  socialCompleteness: 1.0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── Missing metadata fixture token ────────────────────────────────────────────

/** A fixture token with missing metadata (no name, symbol, or socials). */
export const MISSING_METADATA_FIXTURE_TOKEN_PROFILE: TokenProfile = {
  tokenId: 'fixture_missing_meta_002',
  tokenMint: 'FIXTURE_MISSING_META_MINT_00000000002',
  name: '',
  symbol: '',
  description: '',
  imageUriPresent: false,
  websitePresent: false,
  telegramPresent: false,
  twitterPresent: false,
  createdAt: FIXTURE_CREATED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const MISSING_METADATA_FIXTURE_TOKEN_METRICS: TokenMetricSnapshot = {
  tokenMint: 'FIXTURE_MISSING_META_MINT_00000000002',
  curveProgress: 0.10,
  virtualLiquidity: 5,
  reserveQuality: 0.3,
  holderCount: 8,
  topHolderPercent: 45,
  uniqueBuyerCount: 4,
  buyVelocity: 2,
  sellVelocity: 1,
  volumeTrend: 0.0,
  metadataCompleteness: 0.0,
  socialCompleteness: 0.0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── Concentrated holder fixture token ────────────────────────────────────────

/** A fixture token with high top-holder concentration risk. */
export const CONCENTRATED_HOLDER_FIXTURE_TOKEN_PROFILE: TokenProfile = {
  tokenId: 'fixture_concentrated_003',
  tokenMint: 'FIXTURE_CONCENTRATED_MINT_000000003',
  name: 'Concentrated Fixture Token',
  symbol: 'CFT',
  description: 'A fixture token with concentrated holder risk for Phase 8 testing.',
  imageUriPresent: true,
  websitePresent: false,
  telegramPresent: false,
  twitterPresent: false,
  createdAt: FIXTURE_CREATED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const CONCENTRATED_HOLDER_FIXTURE_TOKEN_METRICS: TokenMetricSnapshot = {
  tokenMint: 'FIXTURE_CONCENTRATED_MINT_000000003',
  curveProgress: 0.30,
  virtualLiquidity: 20,
  reserveQuality: 0.5,
  holderCount: 15,
  topHolderPercent: 65,
  uniqueBuyerCount: 10,
  buyVelocity: 4,
  sellVelocity: 2,
  volumeTrend: 0.1,
  metadataCompleteness: 0.3,
  socialCompleteness: 0.0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── Low liquidity fixture token ───────────────────────────────────────────────

/** A fixture token with very low liquidity. */
export const LOW_LIQUIDITY_FIXTURE_TOKEN_PROFILE: TokenProfile = {
  tokenId: 'fixture_low_liquidity_004',
  tokenMint: 'FIXTURE_LOW_LIQUIDITY_MINT_00000004',
  name: 'Low Liquidity Fixture Token',
  symbol: 'LLFT',
  description: 'A fixture token with low liquidity for Phase 8 testing.',
  imageUriPresent: true,
  websitePresent: true,
  telegramPresent: false,
  twitterPresent: false,
  createdAt: FIXTURE_CREATED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const LOW_LIQUIDITY_FIXTURE_TOKEN_METRICS: TokenMetricSnapshot = {
  tokenMint: 'FIXTURE_LOW_LIQUIDITY_MINT_00000004',
  curveProgress: 0.20,
  virtualLiquidity: 0.5,
  reserveQuality: 0.1,
  holderCount: 30,
  topHolderPercent: 20,
  uniqueBuyerCount: 15,
  buyVelocity: 3,
  sellVelocity: 1,
  volumeTrend: 0.2,
  metadataCompleteness: 0.6,
  socialCompleteness: 0.3,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── High sell pressure fixture token ─────────────────────────────────────────

/** A fixture token with high sell pressure relative to buy activity. */
export const HIGH_SELL_PRESSURE_FIXTURE_TOKEN_PROFILE: TokenProfile = {
  tokenId: 'fixture_sell_pressure_005',
  tokenMint: 'FIXTURE_SELL_PRESSURE_MINT_00000005',
  name: 'High Sell Pressure Fixture Token',
  symbol: 'HSFT',
  description: 'A fixture token with high sell pressure for Phase 8 testing.',
  imageUriPresent: false,
  websitePresent: false,
  telegramPresent: false,
  twitterPresent: false,
  createdAt: FIXTURE_CREATED_AT,
  source: 'fixture',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const HIGH_SELL_PRESSURE_FIXTURE_TOKEN_METRICS: TokenMetricSnapshot = {
  tokenMint: 'FIXTURE_SELL_PRESSURE_MINT_00000005',
  curveProgress: 0.50,
  virtualLiquidity: 15,
  reserveQuality: 0.4,
  holderCount: 40,
  topHolderPercent: 18,
  uniqueBuyerCount: 12,
  buyVelocity: 2,
  sellVelocity: 12,
  volumeTrend: -0.7,
  metadataCompleteness: 0.2,
  socialCompleteness: 0.0,
  observedAt: FIXTURE_OBSERVED_AT,
  fixtureOnly: true,
  liveData: false,
};

// ── All fixture pairs ─────────────────────────────────────────────────────────

export const ALL_FIXTURE_TOKEN_PROFILES: readonly TokenProfile[] = [
  GOOD_FIXTURE_TOKEN_PROFILE,
  MISSING_METADATA_FIXTURE_TOKEN_PROFILE,
  CONCENTRATED_HOLDER_FIXTURE_TOKEN_PROFILE,
  LOW_LIQUIDITY_FIXTURE_TOKEN_PROFILE,
  HIGH_SELL_PRESSURE_FIXTURE_TOKEN_PROFILE,
] as const;

export interface FixtureTokenPair {
  readonly profile: TokenProfile;
  readonly metrics: TokenMetricSnapshot;
}

export const ALL_FIXTURE_TOKEN_PAIRS: readonly FixtureTokenPair[] = [
  { profile: GOOD_FIXTURE_TOKEN_PROFILE, metrics: GOOD_FIXTURE_TOKEN_METRICS },
  { profile: MISSING_METADATA_FIXTURE_TOKEN_PROFILE, metrics: MISSING_METADATA_FIXTURE_TOKEN_METRICS },
  { profile: CONCENTRATED_HOLDER_FIXTURE_TOKEN_PROFILE, metrics: CONCENTRATED_HOLDER_FIXTURE_TOKEN_METRICS },
  { profile: LOW_LIQUIDITY_FIXTURE_TOKEN_PROFILE, metrics: LOW_LIQUIDITY_FIXTURE_TOKEN_METRICS },
  { profile: HIGH_SELL_PRESSURE_FIXTURE_TOKEN_PROFILE, metrics: HIGH_SELL_PRESSURE_FIXTURE_TOKEN_METRICS },
] as const;
