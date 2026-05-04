/**
 * Phase 8 — Token Intelligence v1: Input validation.
 *
 * Validates TokenProfile and TokenMetricSnapshot inputs.
 * Returns safe errors — no raw thrown objects, no secrets, no stack traces.
 */

import type { TokenProfile, TokenMetricSnapshot } from './token-profile.js';
import { tiErr, tiOk } from './errors.js';
import type { TokenIntelligenceErr, TokenIntelligenceOk } from './errors.js';

type ValidationResult<T> = TokenIntelligenceOk<T> | TokenIntelligenceErr;

/** Minimum plausible token mint length (non-empty, fixture-style) */
const MIN_MINT_LEN = 3;
/** Maximum plausible token mint length */
const MAX_MINT_LEN = 128;

/**
 * Validate that a token mint string is plausible.
 * Does not use the Solana SDK — purely string-level checks.
 */
export function validateTokenMint(mint: string): ValidationResult<string> {
  if (typeof mint !== 'string' || mint.trim().length < MIN_MINT_LEN) {
    return tiErr('INVALID_TOKEN_MINT', 'Token mint is empty or too short');
  }
  if (mint.trim().length > MAX_MINT_LEN) {
    return tiErr('INVALID_TOKEN_MINT', 'Token mint exceeds maximum length');
  }
  if (/\s/.test(mint)) {
    return tiErr('INVALID_TOKEN_MINT', 'Token mint must not contain whitespace');
  }
  return tiOk(mint.trim());
}

/**
 * Validate a TokenProfile.
 * Checks required fields, safety invariants, and plausible value ranges.
 */
export function validateTokenProfile(profile: unknown): ValidationResult<TokenProfile> {
  if (!profile || typeof profile !== 'object') {
    return tiErr('INVALID_TOKEN_PROFILE', 'Token profile must be a non-null object');
  }
  const p = profile as Record<string, unknown>;

  const mintResult = validateTokenMint(String(p['tokenMint'] ?? ''));
  if (!mintResult.ok) {
    return tiErr('INVALID_TOKEN_PROFILE', `Invalid tokenMint: ${mintResult.error.message}`);
  }

  if (typeof p['tokenId'] !== 'string' || p['tokenId'].trim().length === 0) {
    return tiErr('INVALID_TOKEN_PROFILE', 'tokenId must be a non-empty string');
  }
  if (typeof p['name'] !== 'string') {
    return tiErr('INVALID_TOKEN_PROFILE', 'name must be a string');
  }
  if (typeof p['symbol'] !== 'string') {
    return tiErr('INVALID_TOKEN_PROFILE', 'symbol must be a string');
  }
  if (typeof p['description'] !== 'string') {
    return tiErr('INVALID_TOKEN_PROFILE', 'description must be a string');
  }
  if (p['liveData'] !== false) {
    return tiErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 8');
  }
  if (p['fixtureOnly'] !== true) {
    return tiErr('TOKEN_INTELLIGENCE_FIXTURE_ONLY', 'fixtureOnly must be true in Phase 8');
  }

  return tiOk(profile as TokenProfile);
}

/**
 * Validate a TokenMetricSnapshot.
 * Checks required fields, numeric bounds, and safety invariants.
 */
export function validateTokenMetrics(metrics: unknown): ValidationResult<TokenMetricSnapshot> {
  if (!metrics || typeof metrics !== 'object') {
    return tiErr('INVALID_TOKEN_METRICS', 'Token metrics must be a non-null object');
  }
  const m = metrics as Record<string, unknown>;

  const mintResult = validateTokenMint(String(m['tokenMint'] ?? ''));
  if (!mintResult.ok) {
    return tiErr('INVALID_TOKEN_METRICS', `Invalid tokenMint: ${mintResult.error.message}`);
  }

  if (m['liveData'] !== false) {
    return tiErr('LIVE_DATA_FORBIDDEN', 'liveData must be false in Phase 8');
  }
  if (m['fixtureOnly'] !== true) {
    return tiErr('TOKEN_INTELLIGENCE_FIXTURE_ONLY', 'fixtureOnly must be true in Phase 8');
  }

  const numericFields = [
    'curveProgress', 'virtualLiquidity', 'reserveQuality',
    'holderCount', 'topHolderPercent', 'uniqueBuyerCount',
    'buyVelocity', 'sellVelocity', 'volumeTrend',
    'metadataCompleteness', 'socialCompleteness',
  ] as const;

  for (const field of numericFields) {
    const val = m[field];
    if (typeof val !== 'number' || !isFinite(val)) {
      return tiErr('INVALID_TOKEN_METRICS', `${field} must be a finite number`);
    }
  }

  // Bounds checks
  const curveProgress = m['curveProgress'] as number;
  if (curveProgress < 0 || curveProgress > 1) {
    return tiErr('INVALID_TOKEN_METRICS', 'curveProgress must be 0–1');
  }
  const topHolderPercent = m['topHolderPercent'] as number;
  if (topHolderPercent < 0 || topHolderPercent > 100) {
    return tiErr('INVALID_TOKEN_METRICS', 'topHolderPercent must be 0–100');
  }
  const volumeTrend = m['volumeTrend'] as number;
  if (volumeTrend < -1 || volumeTrend > 1) {
    return tiErr('INVALID_TOKEN_METRICS', 'volumeTrend must be -1 to 1');
  }
  const metadataCompleteness = m['metadataCompleteness'] as number;
  if (metadataCompleteness < 0 || metadataCompleteness > 1) {
    return tiErr('INVALID_TOKEN_METRICS', 'metadataCompleteness must be 0–1');
  }
  const socialCompleteness = m['socialCompleteness'] as number;
  if (socialCompleteness < 0 || socialCompleteness > 1) {
    return tiErr('INVALID_TOKEN_METRICS', 'socialCompleteness must be 0–1');
  }

  return tiOk(metrics as TokenMetricSnapshot);
}

/**
 * Validate that a score value is within 0–100 bounds.
 */
export function validateScoreBounds(score: number, label: string): ValidationResult<number> {
  if (!isFinite(score) || score < 0 || score > 100) {
    return tiErr('TOKEN_SCORE_OUT_OF_RANGE', `${label} score must be 0–100, got ${score}`);
  }
  return tiOk(score);
}

/**
 * Validate that a confidence value is within 0–1 bounds.
 */
export function validateConfidenceBounds(confidence: number): ValidationResult<number> {
  if (!isFinite(confidence) || confidence < 0 || confidence > 1) {
    return tiErr(
      'TOKEN_CONFIDENCE_OUT_OF_RANGE',
      `Confidence must be 0–1, got ${confidence}`,
    );
  }
  return tiOk(confidence);
}
