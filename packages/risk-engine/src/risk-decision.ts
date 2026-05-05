/**
 * Phase 12 — Risk Engine v1: RiskDecision type and helpers.
 */

export type RiskDecision =
  | 'reject'
  | 'block'
  | 'watch_only'
  | 'analysis_only'
  | 'insufficient_data'
  | 'fixture_only';

export const RISK_DECISIONS: readonly RiskDecision[] = [
  'reject',
  'block',
  'watch_only',
  'analysis_only',
  'insufficient_data',
  'fixture_only',
] as const;

const FORBIDDEN_DECISION_WORDS = ['execute', 'trade', 'enforce', 'allow', 'approve'] as const;

export function isRiskDecision(v: string): v is RiskDecision {
  return (RISK_DECISIONS as readonly string[]).includes(v);
}

export function isRiskDecisionSafe(d: RiskDecision): boolean {
  const lower = d.toLowerCase();
  return !FORBIDDEN_DECISION_WORDS.some((w) => lower.includes(w));
}
