/**
 * Phase 8 — Token Intelligence v1: Token classification.
 *
 * Defines allowed classification values.
 * No trade wording is used — classifications are analysis-only.
 */

/**
 * Token classification output.
 *
 * Safe values only — no buy/sell/execute/trade/snipe wording.
 *
 * - reject: critical risk flags present; not suitable for further analysis
 * - watch_only: medium score but missing live data or too much uncertainty
 * - analysis_only: reasonable local/fixture score; safe for analysis review only
 * - insufficient_data: not enough data to produce a meaningful score
 * - fixture_only: profile is synthetic fixture data; no real-world inference
 */
export type TokenClassification =
  | 'reject'
  | 'watch_only'
  | 'analysis_only'
  | 'insufficient_data'
  | 'fixture_only';

/** All valid classification values */
export const TOKEN_CLASSIFICATIONS: readonly TokenClassification[] = [
  'reject',
  'watch_only',
  'analysis_only',
  'insufficient_data',
  'fixture_only',
] as const;

/** Returns true if the given string is a valid TokenClassification */
export function isTokenClassification(value: string): value is TokenClassification {
  return (TOKEN_CLASSIFICATIONS as readonly string[]).includes(value);
}

/**
 * Validate that a classification does not use forbidden trade wording.
 * Returns true if safe, false if any forbidden wording is detected.
 */
export function isClassificationSafe(classification: TokenClassification): boolean {
  const forbidden = ['buy', 'sell', 'execute', 'trade', 'snipe', 'live_candidate', 'auto_candidate', 'enter'];
  return !forbidden.some((word) => classification.includes(word));
}
