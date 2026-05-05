/**
 * Phase 12 — Risk Engine v1: Input, policy, score, and result validation.
 */

import type { RiskAssessmentInput } from './risk-input.js';
import type { RiskPolicy } from './risk-policy.js';
import type { RiskAssessmentResult } from './types.js';
import { reOk, reErr, type ReResult } from './errors.js';
import { isRiskDecision, isRiskDecisionSafe } from './risk-decision.js';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function validateSummaryScoreAndConfidence(
  summary: Record<string, unknown>,
  label: string,
): string | null {
  const score = summary['finalScore'];
  const confidence = summary['confidence'];
  if (typeof score !== 'number' || !isFinite(score) || score < 0 || score > 100) {
    return `${label}.finalScore must be a number 0-100`;
  }
  if (typeof confidence !== 'number' || !isFinite(confidence) || confidence < 0 || confidence > 1) {
    return `${label}.confidence must be a number 0-1`;
  }
  return null;
}

export function validateRiskAssessmentInput(unknown: unknown): ReResult<RiskAssessmentInput> {
  if (!isRecord(unknown)) {
    return reErr('INVALID_RISK_INPUT', 'Risk assessment input must be a non-null object');
  }

  const input = unknown;

  if (typeof input['requestId'] !== 'string' || input['requestId'].trim() === '') {
    return reErr('INVALID_RISK_INPUT', 'requestId must be a non-empty string');
  }

  if (input['liveData'] !== false) {
    return reErr('LIVE_DATA_FORBIDDEN', 'liveData must be false — live data is forbidden');
  }

  if (input['fixtureOnly'] !== true && input['fixtureOnly'] !== false) {
    return reErr('INVALID_RISK_INPUT', 'fixtureOnly must be a boolean');
  }

  if (typeof input['source'] !== 'string' || input['source'].trim() === '') {
    return reErr('INVALID_RISK_INPUT', 'source must be a non-empty string');
  }

  if (typeof input['requestedAt'] !== 'string' || input['requestedAt'].trim() === '') {
    return reErr('INVALID_RISK_INPUT', 'requestedAt must be a non-empty string');
  }

  for (const [key, label] of [
    ['tokenIntelligence', 'tokenIntelligence'],
    ['creatorIntelligence', 'creatorIntelligence'],
    ['walletClusterIntelligence', 'walletClusterIntelligence'],
    ['manipulationDetection', 'manipulationDetection'],
  ] as const) {
    const sub = input[key];
    if (sub !== undefined) {
      if (!isRecord(sub)) {
        return reErr('INVALID_RISK_INPUT', `${label} must be an object if present`);
      }
      const err = validateSummaryScoreAndConfidence(sub, label);
      if (err) return reErr('INVALID_RISK_INPUT', err);
      if (sub['liveData'] !== false) {
        return reErr('LIVE_DATA_FORBIDDEN', `${label}.liveData must be false`);
      }
      if (sub['fixtureOnly'] !== true) {
        return reErr('INVALID_RISK_INPUT', `${label}.fixtureOnly must be true`);
      }
    }
  }

  return reOk(input as unknown as RiskAssessmentInput);
}

export function validateRiskPolicy(unknown: unknown): ReResult<RiskPolicy> {
  if (!isRecord(unknown)) {
    return reErr('INVALID_RISK_POLICY', 'Risk policy must be a non-null object');
  }

  const policy = unknown;

  if (policy['liveData'] !== false) {
    return reErr('LIVE_DATA_FORBIDDEN', 'policy.liveData must be false');
  }

  if (policy['fixtureOnly'] !== true) {
    return reErr('INVALID_RISK_POLICY', 'policy.fixtureOnly must be true');
  }

  for (const field of ['minConfidence', 'rejectBelowScore', 'watchBelowScore'] as const) {
    const v = policy[field];
    if (typeof v !== 'number' || !isFinite(v)) {
      return reErr('INVALID_RISK_POLICY', `policy.${field} must be a finite number`);
    }
  }

  const minConf = policy['minConfidence'] as number;
  if (minConf < 0 || minConf > 1) {
    return reErr('INVALID_RISK_POLICY', 'policy.minConfidence must be 0-1');
  }

  const rejectScore = policy['rejectBelowScore'] as number;
  const watchScore = policy['watchBelowScore'] as number;
  if (rejectScore < 0 || rejectScore > 100) {
    return reErr('INVALID_RISK_POLICY', 'policy.rejectBelowScore must be 0-100');
  }
  if (watchScore < 0 || watchScore > 100) {
    return reErr('INVALID_RISK_POLICY', 'policy.watchBelowScore must be 0-100');
  }

  return reOk(policy as unknown as RiskPolicy);
}

export function validateRiskScoreBounds(score: number): ReResult<number> {
  if (typeof score !== 'number' || !isFinite(score) || score < 0 || score > 100) {
    return reErr('INVALID_RISK_SCORE', `Risk score must be a number 0-100, got: ${String(score)}`);
  }
  return reOk(score);
}

export function validateRiskConfidenceBounds(confidence: number): ReResult<number> {
  if (typeof confidence !== 'number' || !isFinite(confidence) || confidence < 0 || confidence > 1) {
    return reErr(
      'INVALID_RISK_CONFIDENCE',
      `Risk confidence must be a number 0-1, got: ${String(confidence)}`,
    );
  }
  return reOk(confidence);
}

export function validateRiskAssessmentResult(unknown: unknown): ReResult<RiskAssessmentResult> {
  if (!isRecord(unknown)) {
    return reErr('UNSAFE_RISK_OUTPUT', 'Risk assessment result must be a non-null object');
  }

  const result = unknown;

  if (result['fixtureOnly'] !== true) {
    return reErr('UNSAFE_RISK_OUTPUT', 'result.fixtureOnly must be true');
  }
  if (result['liveData'] !== false) {
    return reErr('LIVE_DATA_FORBIDDEN', 'result.liveData must be false');
  }
  if (result['actionAllowed'] !== false) {
    return reErr('UNSAFE_RISK_OUTPUT', 'result.actionAllowed must be false');
  }
  if (result['tradingAllowed'] !== false) {
    return reErr('UNSAFE_RISK_OUTPUT', 'result.tradingAllowed must be false');
  }
  if (result['executionAllowed'] !== false) {
    return reErr('EXECUTION_FORBIDDEN', 'result.executionAllowed must be false');
  }
  if (result['enforcementAllowed'] !== false) {
    return reErr('ENFORCEMENT_FORBIDDEN', 'result.enforcementAllowed must be false');
  }
  if (result['tradeIntentAllowed'] !== false) {
    return reErr('TRADE_INTENTS_FORBIDDEN', 'result.tradeIntentAllowed must be false');
  }
  if (result['safeToDisplay'] !== true) {
    return reErr('UNSAFE_RISK_OUTPUT', 'result.safeToDisplay must be true');
  }

  const scoreCheck = validateRiskScoreBounds(result['finalRiskScore'] as number);
  if (!scoreCheck.ok) return scoreCheck;

  const confidenceCheck = validateRiskConfidenceBounds(result['confidence'] as number);
  if (!confidenceCheck.ok) return confidenceCheck;

  const decision = result['decision'];
  if (typeof decision !== 'string' || !isRiskDecision(decision)) {
    return reErr('UNSAFE_RISK_OUTPUT', `result.decision is not a valid RiskDecision: ${String(decision)}`);
  }
  if (!isRiskDecisionSafe(decision)) {
    return reErr('UNSAFE_RISK_OUTPUT', `result.decision contains forbidden words: ${decision}`);
  }

  return reOk(result as unknown as RiskAssessmentResult);
}
