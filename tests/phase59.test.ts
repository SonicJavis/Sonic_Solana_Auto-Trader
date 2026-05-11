/**
 * Phase 59 — Risk Explanation and Evidence Models v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  RISK_EXPLANATION_EVIDENCE_PHASE,
  RISK_EXPLANATION_EVIDENCE_NAMES,
  RISK_EXPLANATION_EVIDENCE_KINDS,
  RISK_EVIDENCE_NODE_KINDS,
  RISK_EVIDENCE_EDGE_KINDS,
  RISK_EXPLANATION_TEMPLATES,
  RISK_EXPLANATION_EVIDENCE_FIXTURES,
  RISK_EXPLANATION_EVIDENCE_FIXTURE_MAP,
  listRiskExplanationEvidenceFixtures,
  getRiskExplanationEvidenceFixture,
  buildRiskExplanationEvidenceFixture,
  buildRiskEvidenceNode,
  buildRiskEvidenceEdge,
  buildRiskEvidenceGraph,
  buildRiskExplanationFromTemplate,
  buildRiskExplanationEvidenceViewModel,
  buildRiskExplanationEvidenceApiContract,
  selectRiskExplanationEvidenceFixture,
  selectRiskExplanationEvidenceGraph,
  selectRiskExplanationEvidenceNodes,
  selectRiskExplanationEvidenceEdges,
  selectRiskExplanationEvidenceViewModel,
  selectRiskExplanationEvidenceApiSummary,
  validateRiskExplanationEvidenceFixture,
  validateRiskExplanationEvidenceSafety,
  normalizeRiskExplanationEvidenceFixture,
  serializeRiskExplanationEvidenceFixture,
  areRiskExplanationEvidenceFixturesEqual,
  getRiskExplanationEvidenceCapabilities,
  stableDeterministicRiskExplanationEvidenceChecksum,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION,
} from '../apps/dashboard/src/risk-explanation-evidence/index.js';
import {
  LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES,
  LAUNCH_RISK_ENGINE_FIXTURES,
} from '../apps/dashboard/src/launch-risk-engine/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../apps/dashboard/src/synthetic-event-stream-replay-harness/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../apps/dashboard/src/synthetic-event-stream-lifecycle/index.js';
import {
  RISK_EXPLANATION_EVIDENCE_PHASE as ROOT_PHASE,
  RISK_EXPLANATION_EVIDENCE_FIXTURES as ROOT_FIXTURES,
  listRiskExplanationEvidenceFixtures as rootListFixtures,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_59_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/risk-explanation-evidence');
const PHASE_59_FILES = [
  'types.ts',
  'evidence-nodes.ts',
  'evidence-edges.ts',
  'explanation-templates.ts',
  'builders.ts',
  'fixtures.ts',
  'graphs.ts',
  'renderers.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 59 — source file existence', () => {
  for (const file of PHASE_59_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_59_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/RISK_EXPLANATION_EVIDENCE_MODELS.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/RISK_EXPLANATION_EVIDENCE_MODELS.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 59 — constants, names, kinds, count, map, list', () => {
  it('phase constants and root exports align', () => {
    expect(RISK_EXPLANATION_EVIDENCE_PHASE).toBe(59);
    expect(ROOT_PHASE).toBe(59);
    expect(ROOT_FIXTURES).toEqual(RISK_EXPLANATION_EVIDENCE_FIXTURES);
  });

  it('has 8 names and kinds and at least 8 fixtures', () => {
    expect(RISK_EXPLANATION_EVIDENCE_NAMES).toHaveLength(8);
    expect(RISK_EXPLANATION_EVIDENCE_KINDS).toHaveLength(8);
    expect(RISK_EXPLANATION_EVIDENCE_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(RISK_EVIDENCE_NODE_KINDS).toContain('risk_assessment_evidence');
    expect(RISK_EVIDENCE_EDGE_KINDS).toContain('factor_supports_assessment');
    expect(RISK_EXPLANATION_TEMPLATES.length).toBeGreaterThanOrEqual(6);
  });

  it('list/map/get helpers are deterministic', () => {
    expect(rootListFixtures()).toEqual(RISK_EXPLANATION_EVIDENCE_FIXTURES);
    expect(listRiskExplanationEvidenceFixtures()).toEqual(RISK_EXPLANATION_EVIDENCE_FIXTURES);

    for (const fixture of RISK_EXPLANATION_EVIDENCE_FIXTURES) {
      expect(RISK_EXPLANATION_EVIDENCE_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getRiskExplanationEvidenceFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getRiskExplanationEvidenceFixture('missing')).toBeNull();
  });
});

describe('Phase 59 — fixture structure and source linkage', () => {
  it('fixtures map to Phase 58, 57, and 56 fixture names', () => {
    for (const fixture of RISK_EXPLANATION_EVIDENCE_FIXTURES) {
      expect((LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES as readonly string[])).toContain(
        fixture.sourceRiskFixtureName,
      );
      expect((SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES as readonly string[])).toContain(
        fixture.sourceReplayFixtureName,
      );
      expect((SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[])).toContain(
        fixture.sourceLifecycleFixtureName,
      );
      expect(fixture.explanationIdentity.generatedAt).toBe(
        PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
      );
      expect(fixture.schemaVersion).toBe(PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION);
      expect(fixture.explanationTemplates.length).toBeGreaterThan(0);
    }
  });

  it('covers every practical Phase 58 risk fixture', () => {
    const sourceNames = RISK_EXPLANATION_EVIDENCE_FIXTURES.map(f => f.sourceRiskFixtureName);
    for (const riskFixture of LAUNCH_RISK_ENGINE_FIXTURES) {
      expect(sourceNames).toContain(riskFixture.fixtureName);
    }
  });

  it('evidence graph has no orphan nodes and valid edges for normal fixtures', () => {
    for (const fixture of RISK_EXPLANATION_EVIDENCE_FIXTURES) {
      expect(fixture.evidenceGraph.nodeCount).toBe(fixture.evidenceGraph.nodes.length);
      expect(fixture.evidenceGraph.edgeCount).toBe(fixture.evidenceGraph.edges.length);
      expect(fixture.evidenceGraph.orphanNodeIds).toHaveLength(0);

      const nodeIds = new Set(fixture.evidenceGraph.nodes.map(node => node.nodeId));
      for (const edge of fixture.evidenceGraph.edges) {
        expect(nodeIds.has(edge.fromNodeId)).toBe(true);
        expect(nodeIds.has(edge.toNodeId)).toBe(true);
      }

      for (const factor of fixture.explanationOutput.factorExplanations) {
        expect(factor.evidenceNodeIds.length).toBeGreaterThan(0);
        for (const nodeId of factor.evidenceNodeIds) {
          expect(nodeIds.has(nodeId)).toBe(true);
        }
      }
    }
  });
});

describe('Phase 59 — builders, templates, graphs, view-models, contracts, selectors', () => {
  it('fixture builder is deterministic', () => {
    const a = buildRiskExplanationEvidenceFixture({
      fixtureName: 'clean-launch-risk-explanation-evidence',
    });
    const b = buildRiskExplanationEvidenceFixture({
      fixtureName: 'clean-launch-risk-explanation-evidence',
    });
    expect(a).toEqual(b);
  });

  it('node/edge/graph builders return deterministic shapes', () => {
    const node = buildRiskEvidenceNode({
      nodeId: 'node-1',
      nodeKind: 'risk_factor_evidence',
      sourceType: 'phase58_risk',
      sourceId: 'source-1',
      sourceFixtureName: 'fixture-1',
      label: 'Node label',
      summary: 'Node summary',
      confidenceLabel: 'high_confidence',
      evidenceWeight: 0.8,
      safetyNotes: ['Not a signal.'],
    });

    const edge = buildRiskEvidenceEdge({
      edgeId: 'edge-1',
      edgeKind: 'factor_supports_assessment',
      fromNodeId: 'node-1',
      toNodeId: 'node-1',
      relationshipLabel: 'supports',
      summary: 'Edge summary',
      safetyNotes: ['Deterministic.'],
    });

    const graph = buildRiskEvidenceGraph({
      fixtureId: 'fixture-1',
      sourceRiskFixtureName: 'clean-launch-risk-assessment',
      sourceReplayFixtureName: 'clean-launch-replay',
      sourceLifecycleFixtureName: 'clean-launch-lifecycle-stream',
      nodes: [node],
      edges: [edge],
    });

    expect(graph.nodeCount).toBe(1);
    expect(graph.edgeCount).toBe(1);
    expect(graph.deterministicGraphChecksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
  });

  it('template output builder creates deterministic explanation output', () => {
    const output = buildRiskExplanationFromTemplate({
      fixtureId: 'fixture-1',
      fixtureKind: 'clean_launch_risk_explanation_evidence',
      riskBand: 'low',
      factorRows: [
        {
          factorId: 'factor-1',
          factorKind: 'thin_liquidity_risk',
          confidenceLabel: 'high_confidence',
          evidenceNodeIds: ['node-1'],
        },
      ],
      evidenceNodeIds: ['node-1'],
    });

    expect(output.summary).toContain('Observed risk classification low');
    expect(output.factorExplanations).toHaveLength(1);
    expect(output.factorExplanations[0]?.templateId).toBe('phase59-template-factor');
  });

  it('view model / contract / selector helpers are deterministic', () => {
    const fixture = RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!;
    const vmA = buildRiskExplanationEvidenceViewModel(fixture);
    const vmB = buildRiskExplanationEvidenceViewModel(fixture);
    expect(vmA).toEqual(vmB);

    const contracts = buildRiskExplanationEvidenceApiContract({ ...fixture, viewModel: vmA });
    expect(contracts.list.contractKind).toBe('list');
    expect(contracts.detail.contractKind).toBe('detail');
    expect(contracts.summary.contractKind).toBe('summary');

    const selected = selectRiskExplanationEvidenceFixture({ fixtureId: fixture.fixtureId });
    expect(selected.matched).toBe(true);
    expect(selectRiskExplanationEvidenceGraph(fixture)).toEqual(fixture.evidenceGraph);
    expect(selectRiskExplanationEvidenceNodes(fixture)).toEqual(fixture.evidenceGraph.nodes);
    expect(selectRiskExplanationEvidenceEdges(fixture)).toEqual(fixture.evidenceGraph.edges);
    expect(selectRiskExplanationEvidenceViewModel(fixture)).toEqual(fixture.viewModel);
    expect(selectRiskExplanationEvidenceApiSummary(fixture)).toEqual(fixture.apiContracts.summary);
  });
});

describe('Phase 59 — normalization, serialization, equality, validation', () => {
  it('normalization/serialization/equality are deterministic', () => {
    const base = clone(RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!);
    const scrambled = {
      ...clone(base),
      evidenceGraph: {
        ...base.evidenceGraph,
        nodes: [...base.evidenceGraph.nodes].reverse(),
        edges: [...base.evidenceGraph.edges].reverse(),
      },
      selectorExamples: [...base.selectorExamples].reverse(),
      explanationOutput: {
        ...base.explanationOutput,
        factorExplanations: [...base.explanationOutput.factorExplanations].reverse(),
      },
    };

    expect(normalizeRiskExplanationEvidenceFixture(scrambled)).toEqual(
      normalizeRiskExplanationEvidenceFixture(base),
    );
    expect(serializeRiskExplanationEvidenceFixture(scrambled)).toBe(
      serializeRiskExplanationEvidenceFixture(base),
    );
    expect(areRiskExplanationEvidenceFixturesEqual(scrambled, base)).toBe(true);
  });

  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of RISK_EXPLANATION_EVIDENCE_FIXTURES) {
      const result = validateRiskExplanationEvidenceFixture(fixture);
      if (!result.valid) {
        throw new Error(`Validation failed for: ${fixture.fixtureName}: ${JSON.stringify(result.issues)}`);
      }
      expect(result.valid).toBe(true);
      expect(validateRiskExplanationEvidenceSafety(fixture)).toEqual({
        safe: true,
        violations: [],
      });
    }
  });

  it('validation rejects orphan evidence node', () => {
    const fixture = clone(RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!);
    fixture.evidenceGraph.nodes.push({
      ...fixture.evidenceGraph.nodes[0]!,
      nodeId: 'orphan-node',
    });
    const result = validateRiskExplanationEvidenceFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'ORPHAN_EVIDENCE_NODE')).toBe(true);
  });

  it('validation rejects missing evidence edge target', () => {
    const fixture = clone(RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!);
    fixture.evidenceGraph.edges[0] = {
      ...fixture.evidenceGraph.edges[0]!,
      toNodeId: 'missing-node-id',
    };
    const result = validateRiskExplanationEvidenceFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'MISSING_EVIDENCE_EDGE_NODE')).toBe(true);
  });

  it('validation rejects missing source risk fixture reference', () => {
    const fixture = {
      ...clone(RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!),
      sourceRiskFixtureName: 'missing-risk-fixture',
    };
    const result = validateRiskExplanationEvidenceFixture(fixture as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'MISSING_SOURCE_RISK_FIXTURE')).toBe(true);
  });

  it('validation rejects missing source replay/lifecycle references', () => {
    const fixture = {
      ...clone(RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!),
      sourceReplayFixtureName: 'missing-replay-fixture',
      sourceLifecycleFixtureName: 'missing-lifecycle-fixture',
    };
    const result = validateRiskExplanationEvidenceFixture(fixture as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'MISSING_SOURCE_REPLAY_FIXTURE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'MISSING_SOURCE_LIFECYCLE_FIXTURE')).toBe(true);
  });

  it('validation rejects unsafe advisory text', () => {
    const fixture = clone(RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!);
    fixture.explanationOutput.summary = 'buy now signal';
    const result = validateRiskExplanationEvidenceFixture(fixture);
    expect(result.valid).toBe(false);
    expect(
      result.issues.some(
        issue =>
          issue.code === 'UNSAFE_EXECUTION_LANGUAGE' ||
          issue.code === 'UNSAFE_ADVISORY_LANGUAGE',
      ),
    ).toBe(true);
  });

  it('validation rejects invalid confidence label', () => {
    const fixture = clone(RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!);
    fixture.evidenceGraph.nodes[0] = {
      ...fixture.evidenceGraph.nodes[0]!,
      confidenceLabel: 'unknown' as never,
    };
    const result = validateRiskExplanationEvidenceFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_CONFIDENCE_LABEL')).toBe(true);
  });

  it('validation rejects dynamic/free-form explanation text outside templates', () => {
    const fixture = clone(RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!);
    fixture.explanationOutput.factorExplanations[0] = {
      ...fixture.explanationOutput.factorExplanations[0]!,
      explanationText: 'free form text outside template',
    };
    const result = validateRiskExplanationEvidenceFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'DYNAMIC_TEXT_OUTSIDE_TEMPLATE')).toBe(true);
  });
});

describe('Phase 59 — capability flags and propagation', () => {
  it('module capability flags are correct', () => {
    const caps = getRiskExplanationEvidenceCapabilities();
    expect(caps.riskExplanationEvidenceModels).toBe(true);
    expect(caps.riskEvidenceGraphs).toBe(true);
    expect(caps.riskExplanationNetworkAccess).toBe(false);
    expect(caps.riskExplanationExecution).toBe(false);
    expect(caps.riskExplanationStrategySelection).toBe(false);
  });

  it('dashboard and read-only-api capabilities include Phase 59 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['riskExplanationEvidenceModels']).toBe(true);
    expect(dashboardCaps['riskExplanationExecution']).toBe(false);

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps['riskExplanationEvidenceModels']).toBe(true);
    expect(apiCaps['riskExplanationWebSocketAccess']).toBe(false);
    expect(apiCaps['riskExplanationExecution']).toBe(false);
  });
});

describe('Phase 59 — determinism, immutability, and safety scan', () => {
  it('deterministic checksum helper is stable', () => {
    const checksum = stableDeterministicRiskExplanationEvidenceChecksum('phase59-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicRiskExplanationEvidenceChecksum('phase59-check')).toBe(checksum);
  });

  it('source immutability holds when mutating clone', () => {
    const source = RISK_EXPLANATION_EVIDENCE_FIXTURES[0]!;
    const copy = clone(source);
    copy.evidenceGraph.nodes[0]!.summary = 'mutated';
    expect(source.evidenceGraph.nodes[0]?.summary).not.toBe('mutated');
  });

  it('phase files avoid nondeterministic/network/runtime primitives', () => {
    for (const file of PHASE_59_FILES) {
      const content = readFileSync(resolve(PHASE_59_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/randomUUID\(/);
      expect(content).not.toMatch(/process\.env/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
      if (file !== 'validation.ts') {
        expect(content).not.toMatch(/fetch\(/);
        expect(content).not.toMatch(/writeFile\(/);
        expect(content).not.toMatch(/createWriteStream\(/);
        expect(content).not.toMatch(/document\./);
        expect(content).not.toMatch(/window\./);
        expect(content).not.toMatch(/localStorage\./);
        expect(content).not.toMatch(/indexedDB\./);
        expect(content).not.toMatch(/listen\(/);
      }
    }
  });

  it('fixtures remain synthetic local-only read-only and no paper simulation/strategy selection', () => {
    for (const fixture of RISK_EXPLANATION_EVIDENCE_FIXTURES) {
      expect(fixture.safety.noLiveData).toBe(true);
      expect(fixture.safety.noNetworkAccess).toBe(true);
      expect(fixture.safety.notASignal).toBe(true);
      expect(fixture.capabilityFlags.riskExplanationPaperSimulation).toBe(false);
      expect(fixture.capabilityFlags.riskExplanationStrategySelection).toBe(false);
      expect(fixture.capabilityFlags.riskExplanationLiveExecution).toBe(false);
    }
  });

  it('Phase 60 milestone is documented', () => {
    const doc = readFileSync(
      resolve(REPO_ROOT, 'docs/RISK_EXPLANATION_EVIDENCE_MODELS.md'),
      'utf-8',
    );
    expect(doc).toContain('Phase 60 — Paper Sniper Simulation Foundation v1');
  });

  it('module constants remain deterministic', () => {
    expect(PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT).toBe('2026-02-20T00:00:00.000Z');
    expect(PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE).toBe(
      'phase59_risk_explanation_evidence_models_v1',
    );
    expect(PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION).toBe('1.0.0');
  });
});
