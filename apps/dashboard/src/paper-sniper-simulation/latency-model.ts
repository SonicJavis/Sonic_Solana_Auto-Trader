/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: latency model.
 */

import type {
  BuildPaperSniperLatencyModelInput,
  PaperSniperLatencyBucket,
  PaperSniperLatencyModel,
} from './types.js';

function deriveLatencyBucket(
  riskBand: BuildPaperSniperLatencyModelInput['riskBand'],
): PaperSniperLatencyBucket {
  if (riskBand === 'low') return 'fast';
  if (riskBand === 'moderate') return 'standard';
  if (riskBand === 'elevated') return 'slow';
  return 'degraded';
}

export function buildPaperSniperLatencyModel(
  input: BuildPaperSniperLatencyModelInput,
): PaperSniperLatencyModel {
  const latencyBucket = deriveLatencyBucket(input.riskBand);

  const quoteLatencyMs =
    latencyBucket === 'fast' ? 45 : latencyBucket === 'standard' ? 90 : latencyBucket === 'slow' ? 170 : 290;
  const submitLatencyMs =
    latencyBucket === 'fast' ? 30 : latencyBucket === 'standard' ? 65 : latencyBucket === 'slow' ? 120 : 220;
  const confirmationLatencyMs =
    latencyBucket === 'fast' ? 180 : latencyBucket === 'standard' ? 260 : latencyBucket === 'slow' ? 390 : 650;

  return {
    modelId: `phase60-latency-${input.fixtureId}`,
    latencyBucket,
    quoteLatencyMs,
    submitLatencyMs,
    confirmationLatencyMs,
    endToEndLatencyMs: quoteLatencyMs + submitLatencyMs + confirmationLatencyMs,
    safetyNotes: [
      'Synthetic deterministic latency projection only.',
      'No timers or runtime clock dependencies are used.',
    ],
  };
}
