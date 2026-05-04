/**
 * Phase 8 — Token Intelligence v1: Token risk flags.
 *
 * Defines the risk flag codes, severities, and entry structure.
 * All flags are safe to display.
 */

/** Risk flag severity levels */
export type TokenRiskFlagSeverity = 'info' | 'warn' | 'high' | 'critical';

/**
 * Machine-readable risk flag codes.
 * All codes are safe to log and display.
 */
export type TokenRiskFlag =
  | 'MISSING_METADATA'
  | 'MISSING_SOCIALS'
  | 'LOW_HOLDER_COUNT'
  | 'HIGH_TOP_HOLDER_CONCENTRATION'
  | 'LOW_LIQUIDITY'
  | 'CURVE_TOO_EARLY'
  | 'CURVE_TOO_ADVANCED'
  | 'SELL_PRESSURE_HIGH'
  | 'INSUFFICIENT_FIXTURE_DATA'
  | 'LIVE_DATA_UNAVAILABLE'
  | 'PLACEHOLDER_BUNDLE_UNKNOWN'
  | 'PLACEHOLDER_CREATOR_UNKNOWN'
  | 'PLACEHOLDER_WALLET_CLUSTER_UNKNOWN';

/**
 * A single risk flag entry with severity and safe reason text.
 * safeToDisplay is always true.
 */
export interface TokenRiskFlagEntry {
  /** Machine-readable flag code — safe to display */
  readonly code: TokenRiskFlag;
  /** Severity level of the flag */
  readonly severity: TokenRiskFlagSeverity;
  /** Human-readable reason — safe to display */
  readonly reason: string;
  /** Always true */
  readonly safeToDisplay: true;
}

/** Convenience factory for risk flag entries */
export function makeRiskFlag(
  code: TokenRiskFlag,
  severity: TokenRiskFlagSeverity,
  reason: string,
): TokenRiskFlagEntry {
  return { code, severity, reason, safeToDisplay: true };
}

/** Returns true if any of the given flags have critical severity */
export function hasCriticalFlag(flags: readonly TokenRiskFlagEntry[]): boolean {
  return flags.some((f) => f.severity === 'critical');
}

/** Returns flags filtered by severity */
export function filterFlagsBySeverity(
  flags: readonly TokenRiskFlagEntry[],
  severity: TokenRiskFlagSeverity,
): readonly TokenRiskFlagEntry[] {
  return flags.filter((f) => f.severity === severity);
}
