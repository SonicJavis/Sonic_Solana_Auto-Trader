/**
 * Phase 59 — Risk Explanation and Evidence Models v1: evidence nodes.
 */

import type { BuildRiskEvidenceNodeInput, RiskEvidenceNode } from './types.js';

export function buildRiskEvidenceNode(input: BuildRiskEvidenceNodeInput): RiskEvidenceNode {
  return {
    nodeId: input.nodeId,
    nodeKind: input.nodeKind,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    sourceFixtureName: input.sourceFixtureName,
    label: input.label,
    summary: input.summary,
    confidenceLabel: input.confidenceLabel,
    evidenceWeight: Math.min(1, Math.max(0, input.evidenceWeight)),
    safetyNotes: [...input.safetyNotes],
  };
}
