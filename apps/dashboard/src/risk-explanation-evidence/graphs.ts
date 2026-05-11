/**
 * Phase 59 — Risk Explanation and Evidence Models v1: evidence graphs.
 */

import { stableDeterministicRiskExplanationEvidenceChecksum } from './normalization.js';
import type {
  BuildRiskEvidenceGraphInput,
  RiskEvidenceGraph,
  RiskEvidenceNode,
} from './types.js';

function collectOrphanNodeIds(
  nodes: readonly RiskEvidenceNode[],
  edges: BuildRiskEvidenceGraphInput['edges'],
): readonly string[] {
  const linkedNodeIds = new Set<string>();
  for (const edge of edges) {
    linkedNodeIds.add(edge.fromNodeId);
    linkedNodeIds.add(edge.toNodeId);
  }
  return nodes
    .filter(node => !linkedNodeIds.has(node.nodeId))
    .map(node => node.nodeId)
    .sort((left, right) => left.localeCompare(right, 'en-US'));
}

export function buildRiskEvidenceGraph(input: BuildRiskEvidenceGraphInput): RiskEvidenceGraph {
  const orphanNodeIds = collectOrphanNodeIds(input.nodes, input.edges);
  const lifecycleNodeCount = input.nodes.filter(node => node.sourceType === 'phase56_lifecycle').length;
  const replayNodeCount = input.nodes.filter(node => node.sourceType === 'phase57_replay').length;
  const riskNodeCount = input.nodes.filter(node => node.sourceType === 'phase58_risk').length;
  const explanationNodeCount = input.nodes.filter(
    node => node.sourceType === 'phase59_explanation',
  ).length;
  const linkedFactorCount = input.nodes.filter(
    node => node.nodeKind === 'risk_factor_evidence',
  ).length;

  const checksumInput = JSON.stringify(
    {
      graphName: input.fixtureId,
      sourceRiskFixtureName: input.sourceRiskFixtureName,
      sourceReplayFixtureName: input.sourceReplayFixtureName,
      sourceLifecycleFixtureName: input.sourceLifecycleFixtureName,
      nodes: input.nodes.map(node => [node.nodeId, node.nodeKind, node.sourceId]),
      edges: input.edges.map(edge => [edge.edgeId, edge.edgeKind, edge.fromNodeId, edge.toNodeId]),
    },
    null,
    2,
  );

  return {
    graphId: `phase59-graph-${input.fixtureId}`,
    graphName: `risk-evidence-graph-${input.fixtureId}`,
    graphKind: 'risk_explanation_evidence_graph',
    sourceRiskFixtureName: input.sourceRiskFixtureName,
    sourceReplayFixtureName: input.sourceReplayFixtureName,
    sourceLifecycleFixtureName: input.sourceLifecycleFixtureName,
    nodes: [...input.nodes],
    edges: [...input.edges],
    nodeCount: input.nodes.length,
    edgeCount: input.edges.length,
    sourceCoverageSummary: {
      lifecycleNodeCount,
      replayNodeCount,
      riskNodeCount,
      explanationNodeCount,
      linkedFactorCount,
    },
    orphanNodeIds,
    deterministicGraphChecksum: stableDeterministicRiskExplanationEvidenceChecksum(checksumInput),
    safetySummary:
      'Evidence graph is fixture-derived, local-only, non-actionable, and not a signal.',
  };
}
