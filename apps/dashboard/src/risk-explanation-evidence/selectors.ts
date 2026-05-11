/**
 * Phase 59 — Risk Explanation and Evidence Models v1: selectors.
 */

import {
  RISK_EXPLANATION_EVIDENCE_FIXTURE_MAP,
  RISK_EXPLANATION_EVIDENCE_FIXTURES,
} from './fixtures.js';
import type {
  RiskEvidenceEdge,
  RiskEvidenceGraph,
  RiskEvidenceNode,
  RiskExplanationEvidenceApiSummaryContract,
  RiskExplanationEvidenceFixture,
  RiskExplanationEvidenceSelectorQuery,
  RiskExplanationEvidenceSelectorResult,
  RiskExplanationEvidenceViewModel,
} from './types.js';

export function selectRiskExplanationEvidenceFixture(
  query: RiskExplanationEvidenceSelectorQuery = {},
): RiskExplanationEvidenceSelectorResult {
  const fromId = query.fixtureId
    ? (RISK_EXPLANATION_EVIDENCE_FIXTURE_MAP.get(query.fixtureId) ?? null)
    : null;

  const fixture =
    fromId ??
    RISK_EXPLANATION_EVIDENCE_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) return false;
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) return false;
      if (
        query.sourceRiskFixtureName &&
        candidate.sourceRiskFixtureName !== query.sourceRiskFixtureName
      ) {
        return false;
      }
      if (
        query.sourceReplayFixtureName &&
        candidate.sourceReplayFixtureName !== query.sourceReplayFixtureName
      ) {
        return false;
      }
      if (
        query.sourceLifecycleFixtureName &&
        candidate.sourceLifecycleFixtureName !== query.sourceLifecycleFixtureName
      ) {
        return false;
      }
      return true;
    }) ??
    RISK_EXPLANATION_EVIDENCE_FIXTURES[0];

  const matched =
    fixture !== undefined &&
    (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
    (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
    (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind) &&
    (!query.sourceRiskFixtureName ||
      fixture.sourceRiskFixtureName === query.sourceRiskFixtureName) &&
    (!query.sourceReplayFixtureName ||
      fixture.sourceReplayFixtureName === query.sourceReplayFixtureName) &&
    (!query.sourceLifecycleFixtureName ||
      fixture.sourceLifecycleFixtureName === query.sourceLifecycleFixtureName);

  return {
    selectorId: `phase59-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase59-none',
    selectedFixtureKind:
      fixture?.fixtureKind ??
      'clean_launch_risk_explanation_evidence',
    matched,
    source: 'synthetic_fixture_only',
  };
}

export function selectRiskExplanationEvidenceGraph(
  fixture: RiskExplanationEvidenceFixture,
): RiskEvidenceGraph {
  return fixture.evidenceGraph;
}

export function selectRiskExplanationEvidenceNodes(
  fixture: RiskExplanationEvidenceFixture,
): readonly RiskEvidenceNode[] {
  return fixture.evidenceGraph.nodes;
}

export function selectRiskExplanationEvidenceEdges(
  fixture: RiskExplanationEvidenceFixture,
): readonly RiskEvidenceEdge[] {
  return fixture.evidenceGraph.edges;
}

export function selectRiskExplanationEvidenceViewModel(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceViewModel {
  return fixture.viewModel;
}

export function selectRiskExplanationEvidenceApiSummary(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceApiSummaryContract {
  return fixture.apiContracts.summary;
}
