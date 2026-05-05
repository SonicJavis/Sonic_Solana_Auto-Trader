/**
 * Phase 10 — Wallet Cluster Intelligence v1: Classification.
 *
 * Defines allowed wallet cluster classification values.
 * No trade wording is used — classifications are analysis-only.
 */

/**
 * Wallet cluster classification output.
 *
 * Safe values only — no buy/sell/execute/trade/snipe/enter/copy/mirror wording.
 *
 * - reject: critical risk flags present; cluster not suitable for further analysis
 * - watch_only: medium score but missing live data or too much uncertainty
 * - analysis_only: reasonable local/fixture score; safe for analysis review only
 * - insufficient_data: not enough data to produce a meaningful score
 * - fixture_only: cluster is synthetic fixture data; no real-world inference
 */
export type WalletClusterClassification =
  | 'reject'
  | 'watch_only'
  | 'analysis_only'
  | 'insufficient_data'
  | 'fixture_only';

/** All valid classification values */
export const WALLET_CLUSTER_CLASSIFICATIONS: readonly WalletClusterClassification[] = [
  'reject',
  'watch_only',
  'analysis_only',
  'insufficient_data',
  'fixture_only',
] as const;

/** Returns true if the given string is a valid WalletClusterClassification */
export function isWalletClusterClassification(
  value: string,
): value is WalletClusterClassification {
  return (WALLET_CLUSTER_CLASSIFICATIONS as readonly string[]).includes(value);
}

/**
 * Validate that a classification does not use forbidden trade wording.
 * Returns true if safe, false if any forbidden wording is detected.
 */
export function isWalletClusterClassificationSafe(
  classification: WalletClusterClassification,
): boolean {
  const forbidden = [
    'buy', 'sell', 'execute', 'trade', 'snipe',
    'live_candidate', 'auto_candidate', 'enter', 'copy', 'mirror',
  ];
  return !forbidden.some((word) => classification.includes(word));
}
