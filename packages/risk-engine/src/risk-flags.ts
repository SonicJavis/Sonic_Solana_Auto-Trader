/**
 * Phase 12 — Risk Engine v1: Risk flag codes, severities, and helpers.
 */

export type RiskFlagCode =
  | 'INSUFFICIENT_RISK_DATA'
  | 'TOKEN_REJECTED'
  | 'CREATOR_REJECTED'
  | 'WALLET_CLUSTER_REJECTED'
  | 'MANIPULATION_REJECTED'
  | 'TOKEN_CRITICAL_RISK'
  | 'CREATOR_CRITICAL_RISK'
  | 'WALLET_CRITICAL_RISK'
  | 'MANIPULATION_CRITICAL_RISK'
  | 'LOW_CONFIDENCE'
  | 'MISSING_TOKEN_INTELLIGENCE'
  | 'MISSING_CREATOR_INTELLIGENCE'
  | 'MISSING_WALLET_INTELLIGENCE'
  | 'MISSING_MANIPULATION_DETECTION'
  | 'LIVE_DATA_UNAVAILABLE'
  | 'EXECUTION_FORBIDDEN'
  | 'TRADE_INTENTS_FORBIDDEN';

export type RiskFlagSeverity = 'info' | 'warn' | 'high' | 'critical';

export interface RiskFlagEntry {
  readonly code: RiskFlagCode;
  readonly severity: RiskFlagSeverity;
  readonly reason: string;
  readonly safeToDisplay: true;
}

export const RISK_FLAG_CODES: readonly RiskFlagCode[] = [
  'INSUFFICIENT_RISK_DATA',
  'TOKEN_REJECTED',
  'CREATOR_REJECTED',
  'WALLET_CLUSTER_REJECTED',
  'MANIPULATION_REJECTED',
  'TOKEN_CRITICAL_RISK',
  'CREATOR_CRITICAL_RISK',
  'WALLET_CRITICAL_RISK',
  'MANIPULATION_CRITICAL_RISK',
  'LOW_CONFIDENCE',
  'MISSING_TOKEN_INTELLIGENCE',
  'MISSING_CREATOR_INTELLIGENCE',
  'MISSING_WALLET_INTELLIGENCE',
  'MISSING_MANIPULATION_DETECTION',
  'LIVE_DATA_UNAVAILABLE',
  'EXECUTION_FORBIDDEN',
  'TRADE_INTENTS_FORBIDDEN',
] as const;

export function makeRiskFlag(
  code: RiskFlagCode,
  severity: RiskFlagSeverity,
  reason: string,
): RiskFlagEntry {
  return { code, severity, reason, safeToDisplay: true };
}

export function hasRiskCriticalFlag(flags: readonly RiskFlagEntry[]): boolean {
  return flags.some((f) => f.severity === 'critical');
}

export function hasRiskFlagCode(flags: readonly RiskFlagEntry[], code: RiskFlagCode): boolean {
  return flags.some((f) => f.code === code);
}

export function filterRiskFlagsBySeverity(
  flags: readonly RiskFlagEntry[],
  severity: RiskFlagSeverity,
): readonly RiskFlagEntry[] {
  return flags.filter((f) => f.severity === severity);
}
