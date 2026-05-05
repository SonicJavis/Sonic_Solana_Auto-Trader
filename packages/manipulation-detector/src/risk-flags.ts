/**
 * Phase 11 — Bundle / Manipulation Detector v1: Risk flag definitions.
 *
 * Defines risk flag codes, severities, and entry structure.
 * All flags are safe to display.
 *
 * Placeholder flags indicate model-only detection — no runtime enforcement.
 */

/** Risk flag severity levels */
export type ManipulationRiskFlagSeverity = 'info' | 'warn' | 'high' | 'critical';

/**
 * Machine-readable manipulation risk flag codes.
 * All codes are safe to log and display.
 */
export type ManipulationRiskFlag =
  | 'INSUFFICIENT_MANIPULATION_DATA'
  | 'SAME_SLOT_PARTICIPATION_PLACEHOLDER'
  | 'SAME_FUNDING_SOURCE_PLACEHOLDER'
  | 'COORDINATED_ENTRY_PLACEHOLDER'
  | 'COORDINATED_EXIT_PLACEHOLDER'
  | 'WASH_TRADE_CYCLE_PLACEHOLDER'
  | 'CREATOR_LINKED_WALLETS_PLACEHOLDER'
  | 'FRESH_WALLET_FARM_PLACEHOLDER'
  | 'BOT_NOISE_PATTERN'
  | 'LIKELY_BUNDLE_PATTERN'
  | 'POSSIBLE_BUNDLE_PATTERN'
  | 'LIKELY_WASH_TRADE_PATTERN'
  | 'POSSIBLE_WASH_TRADE_PATTERN'
  | 'COORDINATED_DUMP_PATTERN'
  | 'LIVE_DATA_UNAVAILABLE'
  | 'WALLET_CLUSTER_CONTEXT_UNKNOWN'
  | 'CREATOR_CONTEXT_UNKNOWN';

/** All valid manipulation risk flag codes */
export const MANIPULATION_RISK_FLAGS: readonly ManipulationRiskFlag[] = [
  'INSUFFICIENT_MANIPULATION_DATA',
  'SAME_SLOT_PARTICIPATION_PLACEHOLDER',
  'SAME_FUNDING_SOURCE_PLACEHOLDER',
  'COORDINATED_ENTRY_PLACEHOLDER',
  'COORDINATED_EXIT_PLACEHOLDER',
  'WASH_TRADE_CYCLE_PLACEHOLDER',
  'CREATOR_LINKED_WALLETS_PLACEHOLDER',
  'FRESH_WALLET_FARM_PLACEHOLDER',
  'BOT_NOISE_PATTERN',
  'LIKELY_BUNDLE_PATTERN',
  'POSSIBLE_BUNDLE_PATTERN',
  'LIKELY_WASH_TRADE_PATTERN',
  'POSSIBLE_WASH_TRADE_PATTERN',
  'COORDINATED_DUMP_PATTERN',
  'LIVE_DATA_UNAVAILABLE',
  'WALLET_CLUSTER_CONTEXT_UNKNOWN',
  'CREATOR_CONTEXT_UNKNOWN',
] as const;

/**
 * A single manipulation risk flag entry with severity and safe reason text.
 * safeToDisplay is always true.
 */
export interface ManipulationRiskFlagEntry {
  /** Machine-readable flag code — safe to display */
  readonly code: ManipulationRiskFlag;
  /** Severity level of the flag */
  readonly severity: ManipulationRiskFlagSeverity;
  /** Human-readable reason — safe to display */
  readonly reason: string;
  /** Always true */
  readonly safeToDisplay: true;
}

/** Convenience factory for manipulation risk flag entries */
export function makeManipulationRiskFlag(
  code: ManipulationRiskFlag,
  severity: ManipulationRiskFlagSeverity,
  reason: string,
): ManipulationRiskFlagEntry {
  return { code, severity, reason, safeToDisplay: true };
}

/** Returns true if any of the given flags have critical severity */
export function hasManipulationCriticalFlag(
  flags: readonly ManipulationRiskFlagEntry[],
): boolean {
  return flags.some((f) => f.severity === 'critical');
}

/** Returns flags filtered by severity */
export function filterManipulationFlagsBySeverity(
  flags: readonly ManipulationRiskFlagEntry[],
  severity: ManipulationRiskFlagSeverity,
): readonly ManipulationRiskFlagEntry[] {
  return flags.filter((f) => f.severity === severity);
}

/** Returns flags filtered by code */
export function filterManipulationFlagsByCode(
  flags: readonly ManipulationRiskFlagEntry[],
  code: ManipulationRiskFlag,
): readonly ManipulationRiskFlagEntry[] {
  return flags.filter((f) => f.code === code);
}

/** Returns true if any flags match the given code */
export function hasManipulationFlagCode(
  flags: readonly ManipulationRiskFlagEntry[],
  code: ManipulationRiskFlag,
): boolean {
  return flags.some((f) => f.code === code);
}
