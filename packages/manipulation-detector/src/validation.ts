/**
 * Phase 11 — Bundle / Manipulation Detector v1: Input validation.
 *
 * Validates BundleSignal, ManipulationPattern, and CoordinatedActivitySnapshot inputs.
 * Returns safe errors — no raw thrown objects, no secrets, no stack traces.
 */

import type { BundleSignal } from './bundle-signal.js';
import type { ManipulationPattern } from './manipulation-pattern.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';
import { mdErr, mdOk } from './errors.js';
import type { ManipulationDetectorErr, ManipulationDetectorOk } from './errors.js';
import { BUNDLE_SIGNAL_TYPES } from './bundle-signal.js';
import { MANIPULATION_PATTERN_TYPES } from './manipulation-pattern.js';

type ValidationResult<T> = ManipulationDetectorOk<T> | ManipulationDetectorErr;

/** Minimum plausible ID length */
const MIN_ID_LEN = 3;
/** Maximum plausible ID length */
const MAX_ID_LEN = 128;
/** Maximum wallet IDs per signal */
const MAX_WALLET_IDS = 500;
/** Maximum plausible token mint length */
const MAX_TOKEN_MINT_LEN = 256;

/**
 * Validate that a signal ID is plausible.
 * Does not require any SDK — purely string-level checks.
 */
export function validateSignalId(id: string): ValidationResult<string> {
  if (typeof id !== 'string' || id.trim().length < MIN_ID_LEN) {
    return mdErr('INVALID_SIGNAL_ID', 'Signal ID is empty or too short');
  }
  if (id.trim().length > MAX_ID_LEN) {
    return mdErr('INVALID_SIGNAL_ID', 'Signal ID exceeds maximum length');
  }
  if (/\s/.test(id)) {
    return mdErr('INVALID_SIGNAL_ID', 'Signal ID must not contain whitespace');
  }
  return mdOk(id.trim());
}

/**
 * Validate that a pattern ID is plausible.
 */
export function validatePatternId(id: string): ValidationResult<string> {
  if (typeof id !== 'string' || id.trim().length < MIN_ID_LEN) {
    return mdErr('INVALID_PATTERN_ID', 'Pattern ID is empty or too short');
  }
  if (id.trim().length > MAX_ID_LEN) {
    return mdErr('INVALID_PATTERN_ID', 'Pattern ID exceeds maximum length');
  }
  if (/\s/.test(id)) {
    return mdErr('INVALID_PATTERN_ID', 'Pattern ID must not contain whitespace');
  }
  return mdOk(id.trim());
}

/**
 * Validate that a token mint string is a plausible public identifier.
 * Does NOT use the Solana SDK — purely string-level checks.
 * tokenMint is a public identifier model only (no wallet access, no signing).
 */
export function validateTokenMint(mint: string): ValidationResult<string> {
  if (typeof mint !== 'string' || mint.trim().length < MIN_ID_LEN) {
    return mdErr('INVALID_TOKEN_MINT', 'Token mint is empty or too short');
  }
  if (mint.trim().length > MAX_TOKEN_MINT_LEN) {
    return mdErr('INVALID_TOKEN_MINT', 'Token mint exceeds maximum length');
  }
  if (/\s/.test(mint)) {
    return mdErr('INVALID_TOKEN_MINT', 'Token mint must not contain whitespace');
  }
  return mdOk(mint.trim());
}

/**
 * Validate a BundleSignal.
 * Checks required fields, allowed signal types, numeric bounds, and safety invariants.
 */
export function validateBundleSignal(signal: unknown): ValidationResult<BundleSignal> {
  if (!signal || typeof signal !== 'object') {
    return mdErr('INVALID_BUNDLE_SIGNAL', 'Bundle signal must be a non-null object');
  }
  const s = signal as Record<string, unknown>;

  const idResult = validateSignalId(String(s['signalId'] ?? ''));
  if (!idResult.ok) {
    return mdErr('INVALID_BUNDLE_SIGNAL', `Invalid signalId: ${idResult.error.message}`);
  }

  if (
    typeof s['signalType'] !== 'string' ||
    !(BUNDLE_SIGNAL_TYPES as readonly string[]).includes(s['signalType'])
  ) {
    return mdErr(
      'INVALID_BUNDLE_SIGNAL',
      `signalType '${s['signalType']}' is not a valid BundleSignalType`,
    );
  }

  const mintResult = validateTokenMint(String(s['tokenMint'] ?? ''));
  if (!mintResult.ok) {
    return mdErr('INVALID_BUNDLE_SIGNAL', `Invalid tokenMint: ${mintResult.error.message}`);
  }

  if (typeof s['clusterId'] !== 'string' || s['clusterId'].trim().length < MIN_ID_LEN) {
    return mdErr('INVALID_BUNDLE_SIGNAL', 'clusterId must be a non-empty string');
  }

  if (typeof s['creatorId'] !== 'string' || s['creatorId'].trim().length < MIN_ID_LEN) {
    return mdErr('INVALID_BUNDLE_SIGNAL', 'creatorId must be a non-empty string');
  }

  if (!Array.isArray(s['walletIds'])) {
    return mdErr('INVALID_BUNDLE_SIGNAL', 'walletIds must be an array');
  }
  if ((s['walletIds'] as unknown[]).length > MAX_WALLET_IDS) {
    return mdErr(
      'INVALID_BUNDLE_SIGNAL',
      `walletIds exceeds maximum of ${MAX_WALLET_IDS}`,
    );
  }

  if (s['liveData'] !== false) {
    return mdErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 11');
  }

  const countFields = [
    'sameSlotParticipationCount',
    'sameFundingSourceSignalCount',
    'coordinatedEntrySignalCount',
    'coordinatedExitSignalCount',
    'suspectedWashCycleCount',
    'creatorLinkedWalletSignalCount',
  ] as const;

  for (const field of countFields) {
    const val = s[field];
    if (typeof val !== 'number' || !isFinite(val) || val < 0) {
      return mdErr(
        'INVALID_BUNDLE_SIGNAL',
        `${field} must be a finite non-negative number`,
      );
    }
  }

  return mdOk(signal as BundleSignal);
}

/**
 * Validate a ManipulationPattern.
 */
export function validateManipulationPattern(
  pattern: unknown,
): ValidationResult<ManipulationPattern> {
  if (!pattern || typeof pattern !== 'object') {
    return mdErr('INVALID_MANIPULATION_PATTERN', 'Manipulation pattern must be a non-null object');
  }
  const p = pattern as Record<string, unknown>;

  const idResult = validatePatternId(String(p['patternId'] ?? ''));
  if (!idResult.ok) {
    return mdErr(
      'INVALID_MANIPULATION_PATTERN',
      `Invalid patternId: ${idResult.error.message}`,
    );
  }

  if (
    typeof p['patternType'] !== 'string' ||
    !(MANIPULATION_PATTERN_TYPES as readonly string[]).includes(p['patternType'])
  ) {
    return mdErr(
      'INVALID_MANIPULATION_PATTERN',
      `patternType '${p['patternType']}' is not a valid ManipulationPatternType`,
    );
  }

  if (!Array.isArray(p['signalIds'])) {
    return mdErr('INVALID_MANIPULATION_PATTERN', 'signalIds must be an array');
  }

  const confHint = p['confidenceHint'];
  if (typeof confHint !== 'number' || !isFinite(confHint) || confHint < 0 || confHint > 1) {
    return mdErr(
      'INVALID_MANIPULATION_PATTERN',
      'confidenceHint must be a finite number 0–1',
    );
  }

  if (p['liveData'] !== false) {
    return mdErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 11');
  }

  return mdOk(pattern as ManipulationPattern);
}

/**
 * Validate a CoordinatedActivitySnapshot.
 */
export function validateCoordinatedActivity(
  activity: unknown,
): ValidationResult<CoordinatedActivitySnapshot> {
  if (!activity || typeof activity !== 'object') {
    return mdErr(
      'INVALID_COORDINATED_ACTIVITY',
      'Coordinated activity must be a non-null object',
    );
  }
  const a = activity as Record<string, unknown>;

  if (typeof a['snapshotId'] !== 'string' || a['snapshotId'].trim().length < MIN_ID_LEN) {
    return mdErr('INVALID_COORDINATED_ACTIVITY', 'snapshotId must be a non-empty string');
  }

  const mintResult = validateTokenMint(String(a['tokenMint'] ?? ''));
  if (!mintResult.ok) {
    return mdErr(
      'INVALID_COORDINATED_ACTIVITY',
      `Invalid tokenMint: ${mintResult.error.message}`,
    );
  }

  if (a['liveData'] !== false) {
    return mdErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 11');
  }

  const countFields = [
    'participatingWalletCount',
    'sameSlotWalletCount',
    'sameFundingWalletCount',
    'coordinatedEntryCount',
    'coordinatedExitCount',
    'washTradeCycleCount',
    'creatorLinkedWalletCount',
    'freshWalletCount',
    'botNoiseSignalCount',
  ] as const;

  for (const field of countFields) {
    const val = a[field];
    if (typeof val !== 'number' || !isFinite(val) || val < 0) {
      return mdErr(
        'INVALID_COORDINATED_ACTIVITY',
        `${field} must be a finite non-negative number`,
      );
    }
  }

  return mdOk(activity as CoordinatedActivitySnapshot);
}

/**
 * Validate that a score value is within 0–100 bounds.
 */
export function validateManipulationScoreBounds(
  score: number,
  label: string,
): ValidationResult<number> {
  if (!isFinite(score) || score < 0 || score > 100) {
    return mdErr(
      'MANIPULATION_SCORE_OUT_OF_RANGE',
      `${label} score must be 0–100, got ${score}`,
    );
  }
  return mdOk(score);
}

/**
 * Validate that a confidence value is within 0–1 bounds.
 */
export function validateManipulationConfidenceBounds(
  confidence: number,
): ValidationResult<number> {
  if (!isFinite(confidence) || confidence < 0 || confidence > 1) {
    return mdErr(
      'MANIPULATION_CONFIDENCE_OUT_OF_RANGE',
      `Confidence must be 0–1, got ${confidence}`,
    );
  }
  return mdOk(confidence);
}
