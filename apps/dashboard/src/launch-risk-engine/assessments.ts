/**
 * Phase 58 — Launch Risk Engine v1: assessments.
 *
 * Deterministic assessment builder from factor outputs.
 * Non-advisory, synthetic, local-only.
 */

import {
  PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
  PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION,
  PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
  type LaunchRiskAssessment,
  type LaunchRiskEngineAssessmentName,
  type LaunchRiskFactorOutput,
} from './types.js';
import type {
  SyntheticEventStreamLifecycleStreamName,
} from '../synthetic-event-stream-lifecycle/types.js';
import type {
  SyntheticEventStreamReplayHarnessScenarioName,
} from '../synthetic-event-stream-replay-harness/types.js';
import { calculateLaunchRiskScore } from './scoring.js';
import { classifyLaunchRiskBand } from './thresholds.js';
import { LAUNCH_RISK_ENGINE_DEFAULT_THRESHOLDS } from './thresholds.js';

export function buildLaunchRiskAssessment(options: {
  readonly assessmentId: string;
  readonly assessmentName: LaunchRiskEngineAssessmentName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly factorOutputs: readonly LaunchRiskFactorOutput[];
  readonly hardRejectionReasons: readonly string[];
  readonly softWarningReasons: readonly string[];
  readonly summary: string;
  readonly validationSummary: string;
  readonly safetySummary: string;
}): LaunchRiskAssessment {
  const totalRiskScore = calculateLaunchRiskScore(options.factorOutputs);
  const riskBand = classifyLaunchRiskBand(totalRiskScore, LAUNCH_RISK_ENGINE_DEFAULT_THRESHOLDS);
  const evidenceCount = options.factorOutputs.reduce(
    (sum, factor) => sum + factor.evidenceReferenceIds.length,
    0,
  );

  const assessmentStatus =
    options.hardRejectionReasons.length > 0
      ? 'safety_rejected'
      : evidenceCount === 0
        ? 'insufficient_evidence'
        : 'assessed';

  return {
    assessmentId: options.assessmentId,
    assessmentStatus,
    sourceLifecycleFixtureName: options.sourceLifecycleFixtureName,
    sourceReplayFixtureName: options.sourceReplayFixtureName,
    totalRiskScore,
    riskBand,
    hardRejectionReasons: options.hardRejectionReasons,
    softWarningReasons: options.softWarningReasons,
    factorCount: options.factorOutputs.length,
    evidenceCount,
    summary: options.summary,
    validationSummary: options.validationSummary,
    safetySummary: options.safetySummary,
    meta: {
      generatedAt: PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
      source: PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
      schemaVersion: PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION,
      deterministic: true,
    },
  };
}
