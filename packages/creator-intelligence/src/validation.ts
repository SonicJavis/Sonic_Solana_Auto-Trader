/**
 * Phase 9 — Creator Intelligence v1: Input validation.
 *
 * Validates CreatorProfile and CreatorLaunchHistorySnapshot inputs.
 * Returns safe errors — no raw thrown objects, no secrets, no stack traces.
 */

import type { CreatorProfile } from './creator-profile.js';
import type { CreatorLaunchHistorySnapshot } from './creator-history.js';
import { ciErr, ciOk } from './errors.js';
import type { CreatorIntelligenceErr, CreatorIntelligenceOk } from './errors.js';

type ValidationResult<T> = CreatorIntelligenceOk<T> | CreatorIntelligenceErr;

/** Minimum plausible creator ID length */
const MIN_ID_LEN = 3;
/** Maximum plausible creator ID length */
const MAX_ID_LEN = 128;
/** Minimum plausible creator address length */
const MIN_ADDR_LEN = 3;
/** Maximum plausible creator address length */
const MAX_ADDR_LEN = 256;

/**
 * Validate that a creator ID string is plausible.
 * Does not require any SDK — purely string-level checks.
 */
export function validateCreatorId(id: string): ValidationResult<string> {
  if (typeof id !== 'string' || id.trim().length < MIN_ID_LEN) {
    return ciErr('INVALID_CREATOR_ID', 'Creator ID is empty or too short');
  }
  if (id.trim().length > MAX_ID_LEN) {
    return ciErr('INVALID_CREATOR_ID', 'Creator ID exceeds maximum length');
  }
  if (/\s/.test(id)) {
    return ciErr('INVALID_CREATOR_ID', 'Creator ID must not contain whitespace');
  }
  return ciOk(id.trim());
}

/**
 * Validate that a creator address string is plausible as a public identifier.
 * Does NOT use the Solana SDK — purely string-level checks.
 * creatorAddress is a public identifier model only (no wallet access, no signing).
 */
export function validateCreatorAddress(address: string): ValidationResult<string> {
  if (typeof address !== 'string' || address.trim().length < MIN_ADDR_LEN) {
    return ciErr('INVALID_CREATOR_ADDRESS', 'Creator address is empty or too short');
  }
  if (address.trim().length > MAX_ADDR_LEN) {
    return ciErr('INVALID_CREATOR_ADDRESS', 'Creator address exceeds maximum length');
  }
  if (/\s/.test(address)) {
    return ciErr('INVALID_CREATOR_ADDRESS', 'Creator address must not contain whitespace');
  }
  return ciOk(address.trim());
}

/**
 * Validate a CreatorProfile.
 * Checks required fields, safety invariants, and plausible value ranges.
 */
export function validateCreatorProfile(profile: unknown): ValidationResult<CreatorProfile> {
  if (!profile || typeof profile !== 'object') {
    return ciErr('INVALID_CREATOR_PROFILE', 'Creator profile must be a non-null object');
  }
  const p = profile as Record<string, unknown>;

  const idResult = validateCreatorId(String(p['creatorId'] ?? ''));
  if (!idResult.ok) {
    return ciErr('INVALID_CREATOR_PROFILE', `Invalid creatorId: ${idResult.error.message}`);
  }

  const addrResult = validateCreatorAddress(String(p['creatorAddress'] ?? ''));
  if (!addrResult.ok) {
    return ciErr('INVALID_CREATOR_PROFILE', `Invalid creatorAddress: ${addrResult.error.message}`);
  }

  if (typeof p['displayLabel'] !== 'string') {
    return ciErr('INVALID_CREATOR_PROFILE', 'displayLabel must be a string');
  }

  if (p['liveData'] !== false) {
    return ciErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 9');
  }
  if (p['fixtureOnly'] !== true) {
    return ciErr(
      'CREATOR_INTELLIGENCE_FIXTURE_ONLY',
      'fixtureOnly must be true in Phase 9',
    );
  }

  return ciOk(profile as CreatorProfile);
}

/**
 * Validate a CreatorLaunchHistorySnapshot.
 * Checks required fields, numeric bounds, and safety invariants.
 */
export function validateCreatorHistory(
  history: unknown,
): ValidationResult<CreatorLaunchHistorySnapshot> {
  if (!history || typeof history !== 'object') {
    return ciErr('INVALID_CREATOR_HISTORY', 'Creator history must be a non-null object');
  }
  const h = history as Record<string, unknown>;

  const idResult = validateCreatorId(String(h['creatorId'] ?? ''));
  if (!idResult.ok) {
    return ciErr('INVALID_CREATOR_HISTORY', `Invalid creatorId: ${idResult.error.message}`);
  }

  if (h['liveData'] !== false) {
    return ciErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 9');
  }
  if (h['fixtureOnly'] !== true) {
    return ciErr(
      'CREATOR_INTELLIGENCE_FIXTURE_ONLY',
      'fixtureOnly must be true in Phase 9',
    );
  }

  const countFields = [
    'launchCount',
    'migratedLaunchCount',
    'failedLaunchCount',
    'rugLikeLaunchCount',
    'suspiciousFundingSignals',
    'repeatedMetadataSignals',
    'bundleAbuseSignals',
  ] as const;

  for (const field of countFields) {
    const val = h[field];
    if (typeof val !== 'number' || !isFinite(val) || val < 0) {
      return ciErr('INVALID_CREATOR_HISTORY', `${field} must be a finite non-negative number`);
    }
  }

  const ratioFields = [
    'averageDumpSpeed',
    'averageHolderQuality',
    'averageLiquidityQuality',
  ] as const;

  for (const field of ratioFields) {
    const val = h[field];
    if (typeof val !== 'number' || !isFinite(val) || val < 0 || val > 1) {
      return ciErr('INVALID_CREATOR_HISTORY', `${field} must be a finite number 0–1`);
    }
  }

  const peakQuality = h['averagePeakQuality'];
  if (
    typeof peakQuality !== 'number' ||
    !isFinite(peakQuality) ||
    peakQuality < 0 ||
    peakQuality > 100
  ) {
    return ciErr('INVALID_CREATOR_HISTORY', 'averagePeakQuality must be a finite number 0–100');
  }

  return ciOk(history as CreatorLaunchHistorySnapshot);
}

/**
 * Validate that a score value is within 0–100 bounds.
 */
export function validateCreatorScoreBounds(
  score: number,
  label: string,
): ValidationResult<number> {
  if (!isFinite(score) || score < 0 || score > 100) {
    return ciErr(
      'CREATOR_SCORE_OUT_OF_RANGE',
      `${label} score must be 0–100, got ${score}`,
    );
  }
  return ciOk(score);
}

/**
 * Validate that a confidence value is within 0–1 bounds.
 */
export function validateCreatorConfidenceBounds(confidence: number): ValidationResult<number> {
  if (!isFinite(confidence) || confidence < 0 || confidence > 1) {
    return ciErr(
      'CREATOR_CONFIDENCE_OUT_OF_RANGE',
      `Confidence must be 0–1, got ${confidence}`,
    );
  }
  return ciOk(confidence);
}
