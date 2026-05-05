/**
 * Phase 11 — Bundle / Manipulation Detector v1: Manipulation pattern model.
 *
 * Defines ManipulationPattern type and pattern type constants.
 * All models are local/fixture-only — no Solana RPC, no live data.
 */

/**
 * Pattern types for bundle/manipulation detection.
 * All are fixture-only placeholders in Phase 11.
 */
export type ManipulationPatternType =
  | 'likely_bundle'
  | 'possible_bundle'
  | 'likely_wash_trade'
  | 'possible_wash_trade'
  | 'coordinated_dump'
  | 'creator_linked_manipulation'
  | 'fresh_wallet_farm_pattern'
  | 'bot_noise_pattern'
  | 'unknown_fixture';

/** All valid manipulation pattern types */
export const MANIPULATION_PATTERN_TYPES: readonly ManipulationPatternType[] = [
  'likely_bundle',
  'possible_bundle',
  'likely_wash_trade',
  'possible_wash_trade',
  'coordinated_dump',
  'creator_linked_manipulation',
  'fresh_wallet_farm_pattern',
  'bot_noise_pattern',
  'unknown_fixture',
] as const;

/** Returns true if the given string is a valid ManipulationPatternType */
export function isManipulationPatternType(value: string): value is ManipulationPatternType {
  return (MANIPULATION_PATTERN_TYPES as readonly string[]).includes(value);
}

/**
 * Severity hint for a manipulation pattern.
 * Used only as a display/analysis hint — not for enforcement.
 */
export type ManipulationSeverityHint = 'low' | 'medium' | 'high' | 'critical';

/** All valid severity hints */
export const MANIPULATION_SEVERITY_HINTS: readonly ManipulationSeverityHint[] = [
  'low',
  'medium',
  'high',
  'critical',
] as const;

/**
 * A detected manipulation pattern in fixture data.
 *
 * All instances must have liveData: false and fixtureOnly: true in Phase 11.
 * No enforcement — analysis and display only.
 */
export interface ManipulationPattern {
  /** Unique identifier for this pattern — safe to display */
  readonly patternId: string;
  /** Type of manipulation pattern detected */
  readonly patternType: ManipulationPatternType;
  /** Severity hint for display purposes (not enforcement) */
  readonly severityHint: ManipulationSeverityHint;
  /** Signal IDs that contribute to this pattern */
  readonly signalIds: readonly string[];
  /** Confidence hint 0–1 (fixture estimation only) */
  readonly confidenceHint: number;
  /** Human-readable description — safe to display */
  readonly description: string;
  /** Always true in Phase 11 — no live data */
  readonly fixtureOnly: boolean;
  /** Always false — no live on-chain data */
  readonly liveData: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: boolean;
}
