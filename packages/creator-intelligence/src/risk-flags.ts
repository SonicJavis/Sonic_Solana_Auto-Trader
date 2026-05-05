/**
 * Phase 9 — Creator Intelligence v1: Creator risk flags.
 *
 * Defines risk flag codes, severities, and entry structure.
 * All flags are safe to display.
 *
 * Wallet cluster and bundle detector flags are placeholder unknown flags only
 * in Phase 9 — no runtime intelligence is implemented.
 */

/** Risk flag severity levels */
export type CreatorRiskFlagSeverity = 'info' | 'warn' | 'high' | 'critical';

/**
 * Machine-readable creator risk flag codes.
 * All codes are safe to log and display.
 *
 * Placeholder flags (SUSPICIOUS_FUNDING_PLACEHOLDER, REPEATED_METADATA_PLACEHOLDER,
 * BUNDLE_ABUSE_PLACEHOLDER, WALLET_CLUSTER_UNKNOWN, BUNDLE_RISK_UNKNOWN) are
 * model-only risk flags in Phase 9 — no runtime enforcement.
 */
export type CreatorRiskFlag =
  | 'INSUFFICIENT_CREATOR_DATA'
  | 'LOW_LAUNCH_COUNT'
  | 'HIGH_FAILURE_RATE'
  | 'LOW_MIGRATION_RATE'
  | 'FAST_DUMP_HISTORY'
  | 'LOW_HOLDER_QUALITY'
  | 'LOW_LIQUIDITY_QUALITY'
  | 'SUSPICIOUS_FUNDING_PLACEHOLDER'
  | 'REPEATED_METADATA_PLACEHOLDER'
  | 'BUNDLE_ABUSE_PLACEHOLDER'
  | 'RUG_LIKE_HISTORY'
  | 'LIVE_DATA_UNAVAILABLE'
  | 'WALLET_CLUSTER_UNKNOWN'
  | 'BUNDLE_RISK_UNKNOWN';

/**
 * A single creator risk flag entry with severity and safe reason text.
 * safeToDisplay is always true.
 */
export interface CreatorRiskFlagEntry {
  /** Machine-readable flag code — safe to display */
  readonly code: CreatorRiskFlag;
  /** Severity level of the flag */
  readonly severity: CreatorRiskFlagSeverity;
  /** Human-readable reason — safe to display */
  readonly reason: string;
  /** Always true */
  readonly safeToDisplay: true;
}

/** Convenience factory for creator risk flag entries */
export function makeCreatorRiskFlag(
  code: CreatorRiskFlag,
  severity: CreatorRiskFlagSeverity,
  reason: string,
): CreatorRiskFlagEntry {
  return { code, severity, reason, safeToDisplay: true };
}

/** Returns true if any of the given flags have critical severity */
export function hasCreatorCriticalFlag(flags: readonly CreatorRiskFlagEntry[]): boolean {
  return flags.some((f) => f.severity === 'critical');
}

/** Returns flags filtered by severity */
export function filterCreatorFlagsBySeverity(
  flags: readonly CreatorRiskFlagEntry[],
  severity: CreatorRiskFlagSeverity,
): readonly CreatorRiskFlagEntry[] {
  return flags.filter((f) => f.severity === severity);
}

/** Returns flags filtered by code */
export function filterCreatorFlagsByCode(
  flags: readonly CreatorRiskFlagEntry[],
  code: CreatorRiskFlag,
): readonly CreatorRiskFlagEntry[] {
  return flags.filter((f) => f.code === code);
}
