/**
 * Phase 11 — Bundle / Manipulation Detector v1: Classification.
 *
 * Defines allowed manipulation classification values.
 * No trade wording is used — classifications are analysis-only.
 */

/**
 * Manipulation classification output.
 *
 * Safe values only — no buy/sell/execute/trade/snipe/enter/copy/mirror wording.
 *
 * - reject: critical risk flags or likely bundle/wash/dump patterns present
 * - watch_only: medium risk signals but insufficient confidence for stronger conclusion
 * - analysis_only: low-risk fixture; safe for analysis review only
 * - insufficient_data: not enough data to produce a meaningful classification
 * - fixture_only: synthetic fixture data; no real-world inference
 */
export type ManipulationClassification =
  | 'reject'
  | 'watch_only'
  | 'analysis_only'
  | 'insufficient_data'
  | 'fixture_only';

/** All valid manipulation classification values */
export const MANIPULATION_CLASSIFICATIONS: readonly ManipulationClassification[] = [
  'reject',
  'watch_only',
  'analysis_only',
  'insufficient_data',
  'fixture_only',
] as const;

/** Returns true if the given string is a valid ManipulationClassification */
export function isManipulationClassification(
  value: string,
): value is ManipulationClassification {
  return (MANIPULATION_CLASSIFICATIONS as readonly string[]).includes(value);
}

/**
 * Validate that a classification does not use forbidden trade wording.
 * Returns true if safe, false if any forbidden wording is detected.
 */
export function isManipulationClassificationSafe(
  classification: ManipulationClassification,
): boolean {
  const forbidden = [
    'buy', 'sell', 'execute', 'trade', 'snipe',
    'live_candidate', 'auto_candidate', 'enter', 'copy', 'mirror',
  ];
  return !forbidden.some((word) => classification.includes(word));
}
