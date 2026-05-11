/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: builders.
 */

import {
  RISK_EXPLANATION_EVIDENCE_FIXTURES,
  type RiskExplanationEvidenceFixture,
} from '../risk-explanation-evidence/index.js';
import { getPaperSniperSimulationCapabilities } from './capabilities.js';
import { buildPaperSniperSimulationApiContract } from './contracts.js';
import { buildPaperSniperFailureModel } from './failure-model.js';
import { buildPaperSniperLatencyModel } from './latency-model.js';
import { buildPaperSniperMarketModel } from './market-model.js';
import { stableDeterministicPaperSniperSimulationChecksum } from './normalization.js';
import { buildPaperSniperSimulationOutcomesSummary } from './outcomes.js';
import { runPaperSniperSimulation } from './simulator.js';
import { buildPaperSniperSlippageModel } from './slippage-model.js';
import type {
  BuildPaperSniperSimulationFixtureInput,
  PaperSniperSimulationFixture,
  PaperSniperSimulationKind,
  PaperSniperSimulationName,
} from './types.js';
import {
  PAPER_SNIPER_SIMULATION_PHASE,
  PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
  PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION,
  PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
  PHASE_60_PAPER_SNIPER_SIMULATION_VERSION,
} from './types.js';
import { buildPaperSniperSimulationViewModel } from './view-models.js';

interface ScenarioDefinition {
  readonly fixtureKind: PaperSniperSimulationKind;
  readonly sourcePhase59FixtureName: RiskExplanationEvidenceFixture['fixtureName'];
}

const SCENARIOS: Readonly<Record<PaperSniperSimulationName, ScenarioDefinition>> = {
  'clean-launch-paper-sniper-simulation': {
    fixtureKind: 'clean_launch_paper_sniper_simulation',
    sourcePhase59FixtureName: 'clean-launch-risk-explanation-evidence',
  },
  'thin-liquidity-paper-sniper-simulation': {
    fixtureKind: 'thin_liquidity_paper_sniper_simulation',
    sourcePhase59FixtureName: 'thin-liquidity-risk-explanation-evidence',
  },
  'concentrated-holders-paper-sniper-simulation': {
    fixtureKind: 'concentrated_holders_paper_sniper_simulation',
    sourcePhase59FixtureName: 'concentrated-holders-risk-explanation-evidence',
  },
  'suspicious-creator-paper-sniper-simulation': {
    fixtureKind: 'suspicious_creator_paper_sniper_simulation',
    sourcePhase59FixtureName: 'suspicious-creator-risk-explanation-evidence',
  },
  'possible-bundle-cluster-paper-sniper-simulation': {
    fixtureKind: 'possible_bundle_cluster_paper_sniper_simulation',
    sourcePhase59FixtureName: 'possible-bundle-cluster-risk-explanation-evidence',
  },
  'metadata-incomplete-paper-sniper-simulation': {
    fixtureKind: 'metadata_incomplete_paper_sniper_simulation',
    sourcePhase59FixtureName: 'metadata-incomplete-risk-explanation-evidence',
  },
  'high-early-volume-paper-sniper-simulation': {
    fixtureKind: 'high_early_volume_paper_sniper_simulation',
    sourcePhase59FixtureName: 'high-early-volume-risk-explanation-evidence',
  },
  'safety-rejected-paper-sniper-simulation': {
    fixtureKind: 'safety_rejected_paper_sniper_simulation',
    sourcePhase59FixtureName: 'safety-rejected-risk-explanation-evidence',
  },
} as const;

function getSourceFixture(name: RiskExplanationEvidenceFixture['fixtureName']): RiskExplanationEvidenceFixture {
  const fixture = RISK_EXPLANATION_EVIDENCE_FIXTURES.find(candidate => candidate.fixtureName === name);
  if (!fixture) {
    throw new Error(`Phase 60 source Phase 59 fixture not found: ${name}`);
  }
  return fixture;
}

export function buildPaperSniperSimulationFixture(
  input: BuildPaperSniperSimulationFixtureInput,
): PaperSniperSimulationFixture {
  const scenario = SCENARIOS[input.fixtureName];
  const sourcePhase59Fixture = getSourceFixture(scenario.sourcePhase59FixtureName);
  const fixtureId = `phase60-fixture-${input.fixtureName}`;
  const simulationId = `phase60-simulation-${input.fixtureName}`;
  const deterministicSeed = stableDeterministicPaperSniperSimulationChecksum(
    `phase60-${input.fixtureName}-seed`,
  );

  const marketModel = buildPaperSniperMarketModel({
    fixtureId,
    riskBand: sourcePhase59Fixture.viewModel.riskBand,
    sourcePhase58FixtureName: sourcePhase59Fixture.sourceRiskFixtureName,
  });

  const latencyModel = buildPaperSniperLatencyModel({
    fixtureId,
    riskBand: sourcePhase59Fixture.viewModel.riskBand,
  });

  const slippageModel = buildPaperSniperSlippageModel({
    fixtureId,
    riskBand: sourcePhase59Fixture.viewModel.riskBand,
  });

  const failureModel = buildPaperSniperFailureModel({
    fixtureId,
    riskBand: sourcePhase59Fixture.viewModel.riskBand,
  });

  const outcome = runPaperSniperSimulation({
    fixtureId,
    fixtureKind: scenario.fixtureKind,
    marketModel,
    latencyModel,
    slippageModel,
    failureModel,
  });

  const outcomesSummary = buildPaperSniperSimulationOutcomesSummary({
    fixtureId,
    marketModel,
    latencyModel,
    slippageModel,
    failureModel,
    outcome,
  });

  const selectorExamples = [
    {
      selectorId: `phase60-selector-${fixtureId}`,
      selectedFixtureId: fixtureId,
      selectedFixtureKind: scenario.fixtureKind,
      matched: true,
      source: 'synthetic_fixture_only' as const,
    },
  ] as const;

  const partialFixture = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: PAPER_SNIPER_SIMULATION_PHASE,
    schemaVersion: PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION,
    sourcePhase59FixtureName: sourcePhase59Fixture.fixtureName,
    sourcePhase58FixtureName: sourcePhase59Fixture.sourceRiskFixtureName,
    sourcePhase57FixtureName: sourcePhase59Fixture.sourceReplayFixtureName,
    sourcePhase56FixtureName: sourcePhase59Fixture.sourceLifecycleFixtureName,
    sourceRiskBand: sourcePhase59Fixture.viewModel.riskBand,
    simulationIdentity: {
      simulationId,
      simulationName: input.fixtureName,
      simulationKind: scenario.fixtureKind,
      sourcePhase59FixtureName: sourcePhase59Fixture.fixtureName,
      sourcePhase58FixtureName: sourcePhase59Fixture.sourceRiskFixtureName,
      sourcePhase57FixtureName: sourcePhase59Fixture.sourceReplayFixtureName,
      sourcePhase56FixtureName: sourcePhase59Fixture.sourceLifecycleFixtureName,
      schemaVersion: PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION,
      deterministicSeed,
      generatedAt: PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
    },
    marketModel,
    latencyModel,
    slippageModel,
    failureModel,
    outcome,
    outcomesSummary,
    viewModel: undefined as unknown as PaperSniperSimulationFixture['viewModel'],
    apiContracts: undefined as unknown as PaperSniperSimulationFixture['apiContracts'],
    selectorExamples,
    capabilityFlags: getPaperSniperSimulationCapabilities(),
    meta: {
      generatedAt: PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
      source: PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
      version: PHASE_60_PAPER_SNIPER_SIMULATION_VERSION,
      phase: PAPER_SNIPER_SIMULATION_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true as const,
      localOnly: true as const,
      readOnly: true as const,
      noLiveData: true as const,
      noNetworkAccess: true as const,
      nonAdvisory: true as const,
      notASignal: true as const,
    },
  };

  const viewModel = buildPaperSniperSimulationViewModel(
    partialFixture as unknown as PaperSniperSimulationFixture,
  );

  const fixture = {
    ...partialFixture,
    viewModel,
  } as PaperSniperSimulationFixture;

  return {
    ...fixture,
    apiContracts: buildPaperSniperSimulationApiContract(fixture),
  };
}
