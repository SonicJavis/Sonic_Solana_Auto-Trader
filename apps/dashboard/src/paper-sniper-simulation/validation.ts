/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: validation.
 */

import { LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES } from '../launch-risk-engine/index.js';
import { RISK_EXPLANATION_EVIDENCE_NAMES } from '../risk-explanation-evidence/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../synthetic-event-stream-lifecycle/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../synthetic-event-stream-replay-harness/index.js';
import {
  isValidPaperSniperSimulationGeneratedAt,
  isValidPaperSniperSimulationKind,
  isValidPaperSniperSimulationName,
  isValidPaperSniperSimulationSchemaVersion,
  isValidPaperSniperSimulationSource,
} from './normalization.js';
import {
  PAPER_SNIPER_FAILURE_BUCKETS,
  PAPER_SNIPER_LATENCY_BUCKETS,
  PAPER_SNIPER_MARKET_LIQUIDITY_BUCKETS,
  PAPER_SNIPER_MARKET_VOLATILITY_BUCKETS,
  PAPER_SNIPER_SIMULATION_PHASE,
  PAPER_SNIPER_SLIPPAGE_BUCKETS,
  type PaperSniperSimulationFixture,
  type PaperSniperSimulationSafetyResult,
  type PaperSniperSimulationValidationIssue,
  type PaperSniperSimulationValidationResult,
} from './types.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|websocket|rpc|socket\.)/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|setInterval\(|setTimeout\()/;
const FORBIDDEN_WALLET_PATTERN = /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair)\b/i;
const FORBIDDEN_ORDER_PATTERN = /\b(?:real order|submit order|send order|orderbook|place order)\b/i;
const FORBIDDEN_TX_PATTERN = /\b(?:transaction|tx\b|signature|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_PROVIDER_PATTERN = /\b(?:pump\.fun|jupiter|raydium|orca|meteora|geyser|yellowstone|provider|solana\s*rpc)\b/i;
const FORBIDDEN_EXECUTION_ADVICE_PATTERN = /\b(?:buy now|sell now|trading signals?|investment advice|recommendation)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'simulationId',
  'simulationName',
  'simulationKind',
  'sourcePhase59FixtureName',
  'sourcePhase58FixtureName',
  'sourcePhase57FixtureName',
  'sourcePhase56FixtureName',
  'contractId',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'viewModelId',
  'summaryId',
  'source',
  'generatedAt',
  'errorCode',
  'stepId',
  'outcomeId',
]);

function pushIssue(
  issues: PaperSniperSimulationValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: PaperSniperSimulationValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  }
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  }
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem references are forbidden.');
  }
  if (FORBIDDEN_TIMER_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Timer/runtime clock references are forbidden.');
  }
  if (FORBIDDEN_WALLET_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet references are forbidden.');
  }
  if (FORBIDDEN_ORDER_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_ORDER_REFERENCE', fieldPath, 'Real-order references are forbidden.');
  }
  if (FORBIDDEN_TX_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_TRANSACTION_REFERENCE', fieldPath, 'Transaction references are forbidden.');
  }
  if (FORBIDDEN_PROVIDER_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_PROVIDER_REFERENCE', fieldPath, 'Live provider references are forbidden.');
  }
  if (FORBIDDEN_EXECUTION_ADVICE_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_ADVISORY_LANGUAGE', fieldPath, 'Execution/advice language is forbidden.');
  }
}

function scanObjectRecursive(
  value: unknown,
  fieldPath: string,
  issues: PaperSniperSimulationValidationIssue[],
  depth = 0,
): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const key = fieldPath.split('.').at(-1) ?? '';
    if (!EXCLUDED_SCAN_FIELDS.has(key)) {
      scanTextForUnsafeContent(value, fieldPath, issues);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanObjectRecursive(entry, `${fieldPath}[${index}]`, issues, depth + 1));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (!EXCLUDED_SCAN_FIELDS.has(key)) {
        scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
      }
    }
  }
}

function validateBuckets(
  fixture: PaperSniperSimulationFixture,
  issues: PaperSniperSimulationValidationIssue[],
): void {
  if (!(PAPER_SNIPER_MARKET_LIQUIDITY_BUCKETS as readonly string[]).includes(fixture.marketModel.liquidityBucket)) {
    pushIssue(issues, 'INVALID_MARKET_LIQUIDITY_BUCKET', 'marketModel.liquidityBucket', 'Invalid market liquidity bucket.');
  }
  if (!(PAPER_SNIPER_MARKET_VOLATILITY_BUCKETS as readonly string[]).includes(fixture.marketModel.volatilityBucket)) {
    pushIssue(issues, 'INVALID_MARKET_VOLATILITY_BUCKET', 'marketModel.volatilityBucket', 'Invalid market volatility bucket.');
  }
  if (!(PAPER_SNIPER_LATENCY_BUCKETS as readonly string[]).includes(fixture.latencyModel.latencyBucket)) {
    pushIssue(issues, 'INVALID_LATENCY_BUCKET', 'latencyModel.latencyBucket', 'Invalid latency bucket.');
  }
  if (!(PAPER_SNIPER_SLIPPAGE_BUCKETS as readonly string[]).includes(fixture.slippageModel.slippageBucket)) {
    pushIssue(issues, 'INVALID_SLIPPAGE_BUCKET', 'slippageModel.slippageBucket', 'Invalid slippage bucket.');
  }
  if (!(PAPER_SNIPER_FAILURE_BUCKETS as readonly string[]).includes(fixture.failureModel.failureBucket)) {
    pushIssue(issues, 'INVALID_FAILURE_BUCKET', 'failureModel.failureBucket', 'Invalid failure bucket.');
  }
}

export function validatePaperSniperSimulationFixture(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationValidationResult {
  const issues: PaperSniperSimulationValidationIssue[] = [];

  if (!isValidPaperSniperSimulationName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidPaperSniperSimulationKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== PAPER_SNIPER_SIMULATION_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${PAPER_SNIPER_SIMULATION_PHASE}.`);
  }
  if (!isValidPaperSniperSimulationSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }

  if (!(RISK_EXPLANATION_EVIDENCE_NAMES as readonly string[]).includes(fixture.sourcePhase59FixtureName)) {
    pushIssue(issues, 'MISSING_SOURCE_PHASE59_FIXTURE', 'sourcePhase59FixtureName', 'Must reference Phase 59 fixture name.');
  }
  if (!(LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES as readonly string[]).includes(fixture.sourcePhase58FixtureName)) {
    pushIssue(issues, 'MISSING_SOURCE_PHASE58_FIXTURE', 'sourcePhase58FixtureName', 'Must reference Phase 58 fixture name.');
  }
  if (
    !(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES as readonly string[]).includes(
      fixture.sourcePhase57FixtureName,
    )
  ) {
    pushIssue(issues, 'MISSING_SOURCE_PHASE57_FIXTURE', 'sourcePhase57FixtureName', 'Must reference Phase 57 fixture name.');
  }
  if (
    !(SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[]).includes(
      fixture.sourcePhase56FixtureName,
    )
  ) {
    pushIssue(issues, 'MISSING_SOURCE_PHASE56_FIXTURE', 'sourcePhase56FixtureName', 'Must reference Phase 56 fixture name.');
  }

  validateBuckets(fixture, issues);

  if (fixture.outcome.steps.length !== 3) {
    pushIssue(issues, 'INVALID_STEP_COUNT', 'outcome.steps', 'Simulation must include exactly 3 deterministic steps.');
  }

  if (!isValidPaperSniperSimulationGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant.');
  }
  if (!isValidPaperSniperSimulationSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant.');
  }

  if (fixture.capabilityFlags.paperSniperLiveData !== false) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.paperSniperLiveData', 'paperSniperLiveData must be false.');
  }
  if (fixture.capabilityFlags.paperSniperExecution !== false) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.paperSniperExecution', 'paperSniperExecution must be false.');
  }
  if (fixture.capabilityFlags.paperSniperTransactionSending !== false) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.paperSniperTransactionSending', 'paperSniperTransactionSending must be false.');
  }
  if (fixture.capabilityFlags.paperSniperWalletLogic !== false) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.paperSniperWalletLogic', 'paperSniperWalletLogic must be false.');
  }

  if (fixture.safety.fixtureOnly !== true || fixture.safety.nonAdvisory !== true) {
    pushIssue(issues, 'INVALID_SAFETY_FIELDS', 'safety', 'Safety fields must stay fixture-only and non-advisory.');
  }

  scanObjectRecursive(fixture, 'fixture', issues);

  return {
    valid: issues.every(issue => issue.severity !== 'error'),
    issues,
  };
}

export function validatePaperSniperSimulationSafety(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationSafetyResult {
  const violations: string[] = [];

  if (fixture.capabilityFlags.paperSniperLiveData !== false) violations.push('paperSniperLiveData must be false');
  if (fixture.capabilityFlags.paperSniperNetworkAccess !== false) violations.push('paperSniperNetworkAccess must be false');
  if (fixture.capabilityFlags.paperSniperExecution !== false) violations.push('paperSniperExecution must be false');
  if (fixture.capabilityFlags.paperSniperTransactionSending !== false) {
    violations.push('paperSniperTransactionSending must be false');
  }
  if (fixture.capabilityFlags.paperSniperRecommendations !== false) {
    violations.push('paperSniperRecommendations must be false');
  }
  if (fixture.capabilityFlags.paperSniperInvestmentAdvice !== false) {
    violations.push('paperSniperInvestmentAdvice must be false');
  }
  if (fixture.capabilityFlags.paperSniperLiveExecution !== false) {
    violations.push('paperSniperLiveExecution must be false');
  }
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.safety.nonAdvisory !== true) violations.push('safety.nonAdvisory must be true');
  if (fixture.safety.notASignal !== true) violations.push('safety.notASignal must be true');

  return {
    safe: violations.length === 0,
    violations,
  };
}
