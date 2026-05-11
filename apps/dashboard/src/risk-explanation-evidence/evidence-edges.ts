/**
 * Phase 59 — Risk Explanation and Evidence Models v1: evidence edges.
 */

import type { BuildRiskEvidenceEdgeInput, RiskEvidenceEdge } from './types.js';

export function buildRiskEvidenceEdge(input: BuildRiskEvidenceEdgeInput): RiskEvidenceEdge {
  return {
    edgeId: input.edgeId,
    edgeKind: input.edgeKind,
    fromNodeId: input.fromNodeId,
    toNodeId: input.toNodeId,
    relationshipLabel: input.relationshipLabel,
    summary: input.summary,
    safetyNotes: [...input.safetyNotes],
  };
}
