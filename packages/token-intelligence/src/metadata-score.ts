/**
 * Phase 8 — Token Intelligence v1: Metadata quality scoring.
 *
 * Scores token metadata completeness and quality from local/fixture data.
 * Deterministic, no network calls, no provider APIs.
 */

import type { TokenProfile } from './token-profile.js';
import type { MetadataQualityScore } from './score-types.js';

/** Minimum acceptable name length */
const MIN_NAME_LEN = 1;
/** Maximum acceptable name length before penalising */
const MAX_NAME_LEN = 64;
/** Minimum acceptable symbol length */
const MIN_SYMBOL_LEN = 1;
/** Maximum acceptable symbol length */
const MAX_SYMBOL_LEN = 10;

/**
 * Score name quality 0–1.
 * Penalises empty, too-short, or over-long names.
 */
function scoreNameQuality(name: string): number {
  const trimmed = name.trim();
  if (trimmed.length < MIN_NAME_LEN) return 0;
  if (trimmed.length > MAX_NAME_LEN) return 0.5;
  return 1;
}

/**
 * Score symbol quality 0–1.
 * Penalises empty, too-short, or over-long symbols.
 */
function scoreSymbolQuality(symbol: string): number {
  const trimmed = symbol.trim();
  if (trimmed.length < MIN_SYMBOL_LEN) return 0;
  if (trimmed.length > MAX_SYMBOL_LEN) return 0.6;
  return 1;
}

/**
 * Score metadata completeness as a fraction 0–1.
 * Considers name, symbol, description, image, website, telegram, twitter.
 */
function scoreCompleteness(profile: TokenProfile): number {
  let present = 0;
  const total = 7;
  if (profile.name.trim().length > 0) present++;
  if (profile.symbol.trim().length > 0) present++;
  if (profile.description.trim().length > 0) present++;
  if (profile.imageUriPresent) present++;
  if (profile.websitePresent) present++;
  if (profile.telegramPresent) present++;
  if (profile.twitterPresent) present++;
  return present / total;
}

/**
 * Score social presence as a boolean.
 * True if at least one social link is present.
 */
function scoreSocialPresence(profile: TokenProfile): boolean {
  return profile.telegramPresent || profile.twitterPresent || profile.websitePresent;
}

/**
 * Compute a MetadataQualityScore from a TokenProfile.
 * Deterministic from fixture data only. No network calls.
 */
export function scoreMetadata(profile: TokenProfile): MetadataQualityScore {
  const completeness = scoreCompleteness(profile);
  const nameQuality = scoreNameQuality(profile.name);
  const symbolQuality = scoreSymbolQuality(profile.symbol);
  const imagePresence = profile.imageUriPresent;
  const socialPresence = scoreSocialPresence(profile);

  // Weighted composite: completeness 40%, name 20%, symbol 15%, image 15%, social 10%
  const raw =
    completeness * 0.4 +
    nameQuality * 0.2 +
    symbolQuality * 0.15 +
    (imagePresence ? 1 : 0) * 0.15 +
    (socialPresence ? 1 : 0) * 0.1;

  const score = Math.round(Math.min(100, Math.max(0, raw * 100)));

  const reasons: string[] = [];
  if (completeness < 0.5) reasons.push('Less than half of metadata fields are present');
  if (nameQuality < 1) reasons.push('Token name is missing or unusually long');
  if (symbolQuality < 1) reasons.push('Token symbol is missing or unusually long');
  if (!imagePresence) reasons.push('No image URI present');
  if (!socialPresence) reasons.push('No social presence detected');
  if (score >= 70) reasons.push('Metadata quality is acceptable for fixture analysis');

  return {
    completeness,
    nameQuality,
    symbolQuality,
    imagePresence,
    socialPresence,
    suspiciousReusePlaceholder: false,
    score,
    reasons,
  };
}
