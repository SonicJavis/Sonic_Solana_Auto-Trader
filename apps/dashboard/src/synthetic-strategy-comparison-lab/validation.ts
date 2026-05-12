import { PAPER_EXECUTION_QUALITY_METRIC_NAMES } from '../paper-execution-quality-metrics/index.js';
import { PAPER_SNIPER_SIMULATION_NAMES } from '../paper-sniper-simulation/index.js';
import { RISK_EXPLANATION_EVIDENCE_NAMES } from '../risk-explanation-evidence/index.js';
import { LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES } from '../launch-risk-engine/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../synthetic-event-stream-replay-harness/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../synthetic-event-stream-lifecycle/index.js';
import {
  isValidSyntheticStrategyComparisonLabGeneratedAt,
  isValidSyntheticStrategyComparisonLabKind,
  isValidSyntheticStrategyComparisonLabName,
  isValidSyntheticStrategyComparisonLabSchemaVersion,
  isValidSyntheticStrategyComparisonLabSource,
} from './normalization.js';
import {
  SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE,
  SYNTHETIC_STRATEGY_COMPARISON_QUALITY_BANDS,
  SYNTHETIC_STRATEGY_SENSITIVITY_WARNING_KINDS,
  SYNTHETIC_STRATEGY_VARIANT_IDS,
  type SyntheticStrategyComparisonLabFixture,
  type SyntheticStrategyComparisonLabSafetyResult,
  type SyntheticStrategyComparisonLabValidationIssue,
  type SyntheticStrategyComparisonLabValidationResult,
} from './types.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|socket\.)/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|setInterval\(|setTimeout\()/;
const FORBIDDEN_WALLET_PATTERN = /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair)\b/i;
const FORBIDDEN_ORDER_PATTERN = /\b(?:real order|order id|real fill|fill id|submit order|place order)\b/i;
const FORBIDDEN_TX_PATTERN = /\b(?:transaction|tx\b|signature|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_PROVIDER_PATTERN =
  /\b(?:pump\.fun|jupiter|raydium|orca|meteora|geyser|yellowstone|provider|solana\s*rpc)\b/i;
const FORBIDDEN_ADVISORY_PATTERN =
  /\b(?:buy now|sell now|enter now|exit now|ape now|snipe now|trade now|profit opportunity|pnl|recommendation|trading signals?|investment advice)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'sourceMetricFixtureName',
  'sourceSimulationFixtureName',
  'sourceEvidenceFixtureName',
  'sourceRiskFixtureName',
  'sourceReplayFixtureName',
  'sourceLifecycleFixtureName',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'contractId',
  'viewModelId',
  'labId',
  'labName',
  'labKind',
  'runId',
  'scenarioId',
  'scorecardId',
  'aggregateId',
  'source',
  'generatedAt',
  'errorCode',
]);

function pushIssue(
  issues: SyntheticStrategyComparisonLabValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: SyntheticStrategyComparisonLabValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Timer/runtime clock references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet references are forbidden.');
  if (FORBIDDEN_ORDER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_ORDER_REFERENCE', fieldPath, 'Real-order/fill references are forbidden.');
  if (FORBIDDEN_TX_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TRANSACTION_REFERENCE', fieldPath, 'Transaction references are forbidden.');
  if (FORBIDDEN_PROVIDER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_PROVIDER_REFERENCE', fieldPath, 'Live provider references are forbidden.');
  if (FORBIDDEN_ADVISORY_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_ADVISORY_LANGUAGE', fieldPath, 'Advisory/execution language is forbidden.');
}

function scanObjectRecursive(
  value: unknown,
  fieldPath: string,
  issues: SyntheticStrategyComparisonLabValidationIssue[],
  depth = 0,
): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const key = fieldPath.split('.').at(-1) ?? '';
    if (!EXCLUDED_SCAN_FIELDS.has(key)) scanTextForUnsafeContent(value, fieldPath, issues);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanObjectRecursive(entry, `${fieldPath}[${index}]`, issues, depth + 1));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (!EXCLUDED_SCAN_FIELDS.has(key)) scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
    }
  }
}

export function validateSyntheticStrategyComparisonLabFixture(
  fixture: SyntheticStrategyComparisonLabFixture,
): SyntheticStrategyComparisonLabValidationResult {
  const issues: SyntheticStrategyComparisonLabValidationIssue[] = [];

  if (!isValidSyntheticStrategyComparisonLabName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidSyntheticStrategyComparisonLabKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE) pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE}.`);
  if (!isValidSyntheticStrategyComparisonLabSchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');

  if (!(PAPER_EXECUTION_QUALITY_METRIC_NAMES as readonly string[]).includes(fixture.sourceMetricFixtureName)) pushIssue(issues, 'MISSING_SOURCE_METRIC_FIXTURE', 'sourceMetricFixtureName', 'Must reference Phase 61 metric fixture name.');
  if (!(PAPER_SNIPER_SIMULATION_NAMES as readonly string[]).includes(fixture.sourceSimulationFixtureName)) pushIssue(issues, 'MISSING_SOURCE_SIMULATION_FIXTURE', 'sourceSimulationFixtureName', 'Must reference Phase 60 simulation fixture name.');
  if (!(RISK_EXPLANATION_EVIDENCE_NAMES as readonly string[]).includes(fixture.sourceEvidenceFixtureName)) pushIssue(issues, 'MISSING_SOURCE_EVIDENCE_FIXTURE', 'sourceEvidenceFixtureName', 'Must reference Phase 59 evidence fixture name.');
  if (!(LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES as readonly string[]).includes(fixture.sourceRiskFixtureName)) pushIssue(issues, 'MISSING_SOURCE_RISK_FIXTURE', 'sourceRiskFixtureName', 'Must reference Phase 58 risk fixture name.');
  if (!(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES as readonly string[]).includes(fixture.sourceReplayFixtureName)) pushIssue(issues, 'MISSING_SOURCE_REPLAY_FIXTURE', 'sourceReplayFixtureName', 'Must reference Phase 57 replay fixture name.');
  if (!(SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[]).includes(fixture.sourceLifecycleFixtureName)) pushIssue(issues, 'MISSING_SOURCE_LIFECYCLE_FIXTURE', 'sourceLifecycleFixtureName', 'Must reference Phase 56 lifecycle fixture name.');

  if (!isValidSyntheticStrategyComparisonLabGeneratedAt(fixture.meta.generatedAt)) pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant.');
  if (!isValidSyntheticStrategyComparisonLabSource(fixture.meta.source)) pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant.');

  const variants = new Set(fixture.strategyVariants.map(variant => variant.variantId));
  for (const expected of SYNTHETIC_STRATEGY_VARIANT_IDS) {
    if (!variants.has(expected)) pushIssue(issues, 'MISSING_STRATEGY_VARIANT', 'strategyVariants', `Missing strategy variant: ${expected}.`);
  }
  for (const variant of fixture.strategyVariants) {
    if (!(SYNTHETIC_STRATEGY_VARIANT_IDS as readonly string[]).includes(variant.variantId)) pushIssue(issues, 'INVALID_STRATEGY_VARIANT', 'strategyVariants.variantId', 'Invalid strategy variant.');
    if (
      variant.syntheticOnly !== true ||
      variant.hypotheticalOnly !== true ||
      variant.executable !== false ||
      variant.emitsSignals !== false ||
      variant.advisory !== false ||
      variant.selectionPolicy !== null
    ) {
      pushIssue(issues, 'INVALID_VARIANT_SAFETY_FLAGS', 'strategyVariants', 'All variants must be synthetic-only, hypothetical-only, non-executable, and non-advisory.');
    }
  }

  for (const scenario of fixture.scenarioMatrix.scenarioCases) {
    const snapshotValues = Object.values(scenario.variantInputSnapshots);
    if (snapshotValues.length !== fixture.strategyVariants.length) {
      pushIssue(issues, 'INCONSISTENT_SCENARIO_MATRIX', 'scenarioMatrix.variantInputSnapshots', 'Variant input snapshot count must match variant count.');
      continue;
    }
    const baseline = JSON.stringify(snapshotValues[0]);
    if (snapshotValues.some(snapshot => JSON.stringify(snapshot) !== baseline)) {
      pushIssue(issues, 'NON_IDENTICAL_SCENARIO_INPUTS', 'scenarioMatrix.variantInputSnapshots', 'All variants must receive identical scenario inputs.');
    }
  }

  const maxRankByScenario = new Map<string, number>();
  for (const row of fixture.comparisonRun.comparisonRows) {
    maxRankByScenario.set(row.scenarioId, Math.max(maxRankByScenario.get(row.scenarioId) ?? 0, row.deterministicRankWithinScenario));
  }

  for (const scorecard of fixture.scorecards) {
    if (scorecard.aggregateFixtureScore < 0 || scorecard.aggregateFixtureScore > 100) {
      pushIssue(issues, 'INVALID_SCORE_VALUE', 'scorecards.aggregateFixtureScore', 'aggregateFixtureScore must be within [0, 100].');
    }
    if (!(SYNTHETIC_STRATEGY_COMPARISON_QUALITY_BANDS as readonly string[]).includes(scorecard.qualityBand)) {
      pushIssue(issues, 'INVALID_QUALITY_BAND', 'scorecards.qualityBand', 'Invalid quality band.');
    }
    if (scorecard.relativeRank < 1 || scorecard.relativeRank > (maxRankByScenario.get(scorecard.scenarioId) ?? 0)) {
      pushIssue(issues, 'INVALID_SCORE_RANK', 'scorecards.relativeRank', 'relativeRank must match deterministic scenario ranking bounds.');
    }
    for (const warning of scorecard.sensitivityWarnings) {
      if (!(SYNTHETIC_STRATEGY_SENSITIVITY_WARNING_KINDS as readonly string[]).includes(warning)) {
        pushIssue(issues, 'INVALID_SENSITIVITY_WARNING', 'scorecards.sensitivityWarnings', 'Invalid sensitivity warning taxonomy value.');
      }
    }
  }

  if (fixture.capabilityFlags.syntheticStrategyComparisonExecution !== false) pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.syntheticStrategyComparisonExecution', 'syntheticStrategyComparisonExecution must be false.');
  if (fixture.capabilityFlags.syntheticStrategyComparisonRecommendations !== false) pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.syntheticStrategyComparisonRecommendations', 'syntheticStrategyComparisonRecommendations must be false.');
  if (fixture.capabilityFlags.syntheticStrategyComparisonRealOrders !== false) pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.syntheticStrategyComparisonRealOrders', 'syntheticStrategyComparisonRealOrders must be false.');

  if (
    fixture.safety.fixtureOnly !== true ||
    fixture.safety.hypotheticalOnly !== true ||
    fixture.safety.nonAdvisory !== true
  ) {
    pushIssue(issues, 'INVALID_SAFETY_FIELDS', 'safety', 'Safety fields must stay fixture-only, hypothetical-only, and non-advisory.');
  }

  scanObjectRecursive(fixture, 'fixture', issues);

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateSyntheticStrategyComparisonLabSafety(
  fixture: SyntheticStrategyComparisonLabFixture,
): SyntheticStrategyComparisonLabSafetyResult {
  const violations: string[] = [];
  if (fixture.capabilityFlags.syntheticStrategyComparisonLiveData !== false) violations.push('syntheticStrategyComparisonLiveData must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonNetworkAccess !== false) violations.push('syntheticStrategyComparisonNetworkAccess must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonExecution !== false) violations.push('syntheticStrategyComparisonExecution must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonTradingSignals !== false) violations.push('syntheticStrategyComparisonTradingSignals must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonRecommendations !== false) violations.push('syntheticStrategyComparisonRecommendations must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonInvestmentAdvice !== false) violations.push('syntheticStrategyComparisonInvestmentAdvice must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonStrategySelection !== false) violations.push('syntheticStrategyComparisonStrategySelection must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonRealOrders !== false) violations.push('syntheticStrategyComparisonRealOrders must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonRealFunds !== false) violations.push('syntheticStrategyComparisonRealFunds must be false');
  if (fixture.capabilityFlags.syntheticStrategyComparisonRealPnL !== false) violations.push('syntheticStrategyComparisonRealPnL must be false');
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.safety.hypotheticalOnly !== true) violations.push('safety.hypotheticalOnly must be true');
  if (fixture.safety.nonAdvisory !== true) violations.push('safety.nonAdvisory must be true');
  if (fixture.safety.notASignal !== true) violations.push('safety.notASignal must be true');
  return { safe: violations.length === 0, violations };
}
