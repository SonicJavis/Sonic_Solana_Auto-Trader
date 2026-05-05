/**
 * Phase 10 — Wallet Cluster Intelligence v1: Input validation.
 *
 * Validates WalletProfile and WalletCluster inputs.
 * Returns safe errors — no raw thrown objects, no secrets, no stack traces.
 */

import type { WalletProfile } from './wallet-profile.js';
import type { WalletCluster } from './wallet-cluster.js';
import { wiErr, wiOk } from './errors.js';
import type { WalletIntelligenceErr, WalletIntelligenceOk } from './errors.js';
import { WALLET_CLUSTER_TYPES } from './wallet-cluster.js';

type ValidationResult<T> = WalletIntelligenceOk<T> | WalletIntelligenceErr;

/** Minimum plausible wallet ID length */
const MIN_ID_LEN = 3;
/** Maximum plausible wallet ID length */
const MAX_ID_LEN = 128;
/** Minimum plausible wallet address length */
const MIN_ADDR_LEN = 3;
/** Maximum plausible wallet address length */
const MAX_ADDR_LEN = 256;
/** Maximum wallet IDs per cluster */
const MAX_WALLET_IDS = 500;

/**
 * Validate that a wallet ID string is plausible.
 * Does not require any SDK — purely string-level checks.
 */
export function validateWalletId(id: string): ValidationResult<string> {
  if (typeof id !== 'string' || id.trim().length < MIN_ID_LEN) {
    return wiErr('INVALID_WALLET_ID', 'Wallet ID is empty or too short');
  }
  if (id.trim().length > MAX_ID_LEN) {
    return wiErr('INVALID_WALLET_ID', 'Wallet ID exceeds maximum length');
  }
  if (/\s/.test(id)) {
    return wiErr('INVALID_WALLET_ID', 'Wallet ID must not contain whitespace');
  }
  return wiOk(id.trim());
}

/**
 * Validate that a wallet address string is plausible as a public identifier.
 * Does NOT use the Solana SDK — purely string-level checks.
 * walletAddress is a public identifier model only (no wallet access, no signing).
 */
export function validateWalletAddress(address: string): ValidationResult<string> {
  if (typeof address !== 'string' || address.trim().length < MIN_ADDR_LEN) {
    return wiErr('INVALID_WALLET_ADDRESS', 'Wallet address is empty or too short');
  }
  if (address.trim().length > MAX_ADDR_LEN) {
    return wiErr('INVALID_WALLET_ADDRESS', 'Wallet address exceeds maximum length');
  }
  if (/\s/.test(address)) {
    return wiErr('INVALID_WALLET_ADDRESS', 'Wallet address must not contain whitespace');
  }
  return wiOk(address.trim());
}

/**
 * Validate that a cluster ID string is plausible.
 */
export function validateClusterId(id: string): ValidationResult<string> {
  if (typeof id !== 'string' || id.trim().length < MIN_ID_LEN) {
    return wiErr('INVALID_CLUSTER_ID', 'Cluster ID is empty or too short');
  }
  if (id.trim().length > MAX_ID_LEN) {
    return wiErr('INVALID_CLUSTER_ID', 'Cluster ID exceeds maximum length');
  }
  if (/\s/.test(id)) {
    return wiErr('INVALID_CLUSTER_ID', 'Cluster ID must not contain whitespace');
  }
  return wiOk(id.trim());
}

/**
 * Validate a WalletProfile.
 * Checks required fields, safety invariants, and plausible value ranges.
 */
export function validateWalletProfile(profile: unknown): ValidationResult<WalletProfile> {
  if (!profile || typeof profile !== 'object') {
    return wiErr('INVALID_WALLET_PROFILE', 'Wallet profile must be a non-null object');
  }
  const p = profile as Record<string, unknown>;

  const idResult = validateWalletId(String(p['walletId'] ?? ''));
  if (!idResult.ok) {
    return wiErr('INVALID_WALLET_PROFILE', `Invalid walletId: ${idResult.error.message}`);
  }

  const addrResult = validateWalletAddress(String(p['walletAddress'] ?? ''));
  if (!addrResult.ok) {
    return wiErr('INVALID_WALLET_PROFILE', `Invalid walletAddress: ${addrResult.error.message}`);
  }

  if (typeof p['displayLabel'] !== 'string') {
    return wiErr('INVALID_WALLET_PROFILE', 'displayLabel must be a string');
  }

  if (p['liveData'] !== false) {
    return wiErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 10');
  }
  if (p['fixtureOnly'] !== true) {
    return wiErr(
      'WALLET_INTELLIGENCE_FIXTURE_ONLY',
      'fixtureOnly must be true in Phase 10',
    );
  }

  const numericFields = [
    'walletAgeDays',
    'observedLaunchCount',
    'averageHoldTimeSeconds',
    'fastDumpSignalCount',
    'botNoiseSignalCount',
  ] as const;

  for (const field of numericFields) {
    const val = p[field];
    if (typeof val !== 'number' || !isFinite(val) || val < 0) {
      return wiErr('INVALID_WALLET_PROFILE', `${field} must be a finite non-negative number`);
    }
  }

  const ratioFields = [
    'averageEntryTimingQuality',
    'averageExitTimingQuality',
    'profitabilityQualityPlaceholder',
  ] as const;

  for (const field of ratioFields) {
    const val = p[field];
    if (typeof val !== 'number' || !isFinite(val) || val < 0 || val > 1) {
      return wiErr('INVALID_WALLET_PROFILE', `${field} must be a finite number 0–1`);
    }
  }

  return wiOk(profile as WalletProfile);
}

/**
 * Validate a WalletCluster.
 * Checks required fields, allowed cluster types, numeric bounds, and safety invariants.
 */
export function validateWalletCluster(cluster: unknown): ValidationResult<WalletCluster> {
  if (!cluster || typeof cluster !== 'object') {
    return wiErr('INVALID_WALLET_CLUSTER', 'Wallet cluster must be a non-null object');
  }
  const c = cluster as Record<string, unknown>;

  const idResult = validateClusterId(String(c['clusterId'] ?? ''));
  if (!idResult.ok) {
    return wiErr('INVALID_WALLET_CLUSTER', `Invalid clusterId: ${idResult.error.message}`);
  }

  if (
    typeof c['clusterType'] !== 'string' ||
    !(WALLET_CLUSTER_TYPES as readonly string[]).includes(c['clusterType'])
  ) {
    return wiErr('INVALID_CLUSTER_TYPE', `clusterType '${c['clusterType']}' is not allowed`);
  }

  if (!Array.isArray(c['walletIds']) || (c['walletIds'] as unknown[]).length === 0) {
    return wiErr('INVALID_WALLET_CLUSTER', 'walletIds must be a non-empty array');
  }
  if ((c['walletIds'] as unknown[]).length > MAX_WALLET_IDS) {
    return wiErr('INVALID_WALLET_CLUSTER', `walletIds exceeds maximum of ${MAX_WALLET_IDS}`);
  }

  if (c['liveData'] !== false) {
    return wiErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 10');
  }
  if (c['fixtureOnly'] !== true) {
    return wiErr(
      'WALLET_INTELLIGENCE_FIXTURE_ONLY',
      'fixtureOnly must be true in Phase 10',
    );
  }

  const countFields = [
    'representativeWalletCount',
    'sameFundingSourceSignalCount',
    'sameSlotParticipationSignalCount',
    'creatorLinkedSignalCount',
    'freshWalletSignalCount',
    'coordinatedSellSignalCount',
    'leaderFollowerSignalCount',
  ] as const;

  for (const field of countFields) {
    const val = c[field];
    if (typeof val !== 'number' || !isFinite(val) || val < 0) {
      return wiErr('INVALID_WALLET_CLUSTER', `${field} must be a finite non-negative number`);
    }
  }

  return wiOk(cluster as WalletCluster);
}

/**
 * Validate that a score value is within 0–100 bounds.
 */
export function validateWalletScoreBounds(
  score: number,
  label: string,
): ValidationResult<number> {
  if (!isFinite(score) || score < 0 || score > 100) {
    return wiErr(
      'WALLET_SCORE_OUT_OF_RANGE',
      `${label} score must be 0–100, got ${score}`,
    );
  }
  return wiOk(score);
}

/**
 * Validate that a confidence value is within 0–1 bounds.
 */
export function validateWalletConfidenceBounds(confidence: number): ValidationResult<number> {
  if (!isFinite(confidence) || confidence < 0 || confidence > 1) {
    return wiErr(
      'WALLET_CONFIDENCE_OUT_OF_RANGE',
      `Confidence must be 0–1, got ${confidence}`,
    );
  }
  return wiOk(confidence);
}
