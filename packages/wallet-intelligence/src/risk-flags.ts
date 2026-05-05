/**
 * Phase 10 — Wallet Cluster Intelligence v1: Risk flags.
 *
 * Defines risk flag codes, severities, and entry structure.
 * All flags are safe to display.
 *
 * Placeholder flags (FRESH_WALLET_FARM_PLACEHOLDER, SAME_FUNDING_SOURCE_PLACEHOLDER,
 * SAME_SLOT_COORDINATION_PLACEHOLDER, CREATOR_LINKED_WALLET_PLACEHOLDER,
 * COORDINATED_SELL_PLACEHOLDER, BUNDLE_RISK_UNKNOWN, CREATOR_RELATIONSHIP_UNKNOWN)
 * are model-only risk flags in Phase 10 — no runtime enforcement.
 */

/** Risk flag severity levels */
export type WalletClusterRiskFlagSeverity = 'info' | 'warn' | 'high' | 'critical';

/**
 * Machine-readable wallet cluster risk flag codes.
 * All codes are safe to log and display.
 */
export type WalletClusterRiskFlag =
  | 'INSUFFICIENT_WALLET_DATA'
  | 'INSUFFICIENT_CLUSTER_DATA'
  | 'LOW_WALLET_AGE'
  | 'FAST_DUMPER_HISTORY'
  | 'BOT_NOISE_SIGNALS'
  | 'FRESH_WALLET_FARM_PLACEHOLDER'
  | 'SAME_FUNDING_SOURCE_PLACEHOLDER'
  | 'SAME_SLOT_COORDINATION_PLACEHOLDER'
  | 'CREATOR_LINKED_WALLET_PLACEHOLDER'
  | 'COORDINATED_SELL_PLACEHOLDER'
  | 'LOW_HOLD_TIME'
  | 'LOW_ENTRY_QUALITY'
  | 'LOW_EXIT_QUALITY'
  | 'LIVE_DATA_UNAVAILABLE'
  | 'BUNDLE_RISK_UNKNOWN'
  | 'CREATOR_RELATIONSHIP_UNKNOWN';

/**
 * A single wallet cluster risk flag entry with severity and safe reason text.
 * safeToDisplay is always true.
 */
export interface WalletClusterRiskFlagEntry {
  /** Machine-readable flag code — safe to display */
  readonly code: WalletClusterRiskFlag;
  /** Severity level of the flag */
  readonly severity: WalletClusterRiskFlagSeverity;
  /** Human-readable reason — safe to display */
  readonly reason: string;
  /** Always true */
  readonly safeToDisplay: true;
}

/** Convenience factory for wallet cluster risk flag entries */
export function makeWalletClusterRiskFlag(
  code: WalletClusterRiskFlag,
  severity: WalletClusterRiskFlagSeverity,
  reason: string,
): WalletClusterRiskFlagEntry {
  return { code, severity, reason, safeToDisplay: true };
}

/** Returns true if any of the given flags have critical severity */
export function hasWalletCriticalFlag(flags: readonly WalletClusterRiskFlagEntry[]): boolean {
  return flags.some((f) => f.severity === 'critical');
}

/** Returns flags filtered by severity */
export function filterWalletFlagsBySeverity(
  flags: readonly WalletClusterRiskFlagEntry[],
  severity: WalletClusterRiskFlagSeverity,
): readonly WalletClusterRiskFlagEntry[] {
  return flags.filter((f) => f.severity === severity);
}

/** Returns flags filtered by code */
export function filterWalletFlagsByCode(
  flags: readonly WalletClusterRiskFlagEntry[],
  code: WalletClusterRiskFlag,
): readonly WalletClusterRiskFlagEntry[] {
  return flags.filter((f) => f.code === code);
}
