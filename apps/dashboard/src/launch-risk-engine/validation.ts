/**
 * Phase 58 — Launch Risk Engine v1: validation.
 *
 * Validates fixtures for required fields, safety, score correctness, etc.
 * Non-advisory, synthetic, local-only.
 */

import {
  LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES,
  LAUNCH_RISK_ENGINE_PHASE,
  LAUNCH_RISK_BANDS,
  LAUNCH_RISK_CONFIDENCE_LABELS,
  LAUNCH_RISK_FACTOR_KINDS,
  LAUNCH_RISK_SEVERITY_VALUES,
  type LaunchRiskEngineFixture,
  type LaunchRiskEngineSafetyResult,
  type LaunchRiskEngineValidationIssue,
  type LaunchRiskEngineValidationResult,
} from './types.js';
import {
  isValidLaunchRiskEngineAssessmentKind,
  isValidLaunchRiskEngineAssessmentName,
  isValidLaunchRiskEngineGeneratedAt,
  isValidLaunchRiskEngineSchemaVersion,
  isValidLaunchRiskEngineSource,
} from './normalization.js';
import { calculateLaunchRiskScore } from './scoring.js';
import { classifyLaunchRiskBand, LAUNCH_RISK_ENGINE_DEFAULT_THRESHOLDS } from './thresholds.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|RPC)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN =
  /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route\b|handler\b|server\b|listen\()\b/i;
const FORBIDDEN_WALLET_PATTERN =
  // The negative lookahead `(?![\s_-]*cluster)` excludes "wallet_cluster_risk" factor kind
  // which legitimately contains "wallet" as part of a risk factor name (not a wallet implementation).
  /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)(?![\s_-]*cluster)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|execute|buy now|sell now|enter now|exit now|ape|snipe now|trading signals?|investment advice)\b/i;
const FORBIDDEN_PROVIDER_REFERENCE_PATTERN =
  /\b(?:pump\.fun|jupiter|raydium|orca|meteora|geyser|yellowstone|solana\s*rpc)\b/i;
const FORBIDDEN_ADVISORY_PATTERN =
  /\b(?:recommendation|profit opportunity|invest now)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'sourceLifecycleFixtureName',
  'sourceReplayFixtureName',
  'assessmentId',
  'assessmentName',
  'assessmentKind',
  'factorId',
  'factorKind',
  'contractId',
  'contractName',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'viewModelId',
  'generatedAt',
  'source',
  'reasonCode',
  'errorCode',
]);

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: LaunchRiskEngineValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_URL_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a live URL reference which is forbidden in fixtures.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_NETWORK_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a network API reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_FILESYSTEM_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a filesystem reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_RUNTIME_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_RUNTIME_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a runtime route/server reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_WALLET_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_WALLET_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a wallet/key reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_EXECUTION_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_EXECUTION_LANGUAGE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains advisory/execution language which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_PROVIDER_REFERENCE_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_PROVIDER_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a live provider reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_ADVISORY_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_ADVISORY_LANGUAGE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains advisory language which is forbidden.`,
      severity: 'error',
    });
  }
}

function scanObjectRecursive(
  value: unknown,
  fieldPath: string,
  issues: LaunchRiskEngineValidationIssue[],
  depth = 0,
): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const lastKey = fieldPath.split('.').at(-1) ?? '';
    if (!EXCLUDED_SCAN_FIELDS.has(lastKey)) {
      scanTextForUnsafeContent(value, fieldPath, issues);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => {
      scanObjectRecursive(item, `${fieldPath}[${index}]`, issues, depth + 1);
    });
  } else if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (!EXCLUDED_SCAN_FIELDS.has(key)) {
        scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
      }
    }
  }
}

export function validateLaunchRiskEngineFixture(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineValidationResult {
  const issues: LaunchRiskEngineValidationIssue[] = [];

  // Required top-level fields
  if (!fixture.fixtureId || typeof fixture.fixtureId !== 'string') {
    issues.push({ code: 'MISSING_FIXTURE_ID', field: 'fixtureId', message: 'fixtureId is required.', severity: 'error' });
  }
  if (!isValidLaunchRiskEngineAssessmentName(fixture.fixtureName)) {
    issues.push({ code: 'INVALID_FIXTURE_NAME', field: 'fixtureName', message: `fixtureName "${String(fixture.fixtureName)}" is not a valid assessment name.`, severity: 'error' });
  }
  if (!isValidLaunchRiskEngineAssessmentKind(fixture.fixtureKind)) {
    issues.push({ code: 'INVALID_FIXTURE_KIND', field: 'fixtureKind', message: `fixtureKind "${String(fixture.fixtureKind)}" is not a valid assessment kind.`, severity: 'error' });
  }
  if (fixture.phase !== LAUNCH_RISK_ENGINE_PHASE) {
    issues.push({ code: 'INVALID_PHASE', field: 'phase', message: `phase must be ${LAUNCH_RISK_ENGINE_PHASE}.`, severity: 'error' });
  }
  if (!isValidLaunchRiskEngineSchemaVersion(fixture.schemaVersion)) {
    issues.push({ code: 'INVALID_SCHEMA_VERSION', field: 'schemaVersion', message: 'schemaVersion is invalid.', severity: 'error' });
  }

  // Source fixture references
  if (!fixture.sourceLifecycleFixtureName || typeof fixture.sourceLifecycleFixtureName !== 'string') {
    issues.push({ code: 'MISSING_LIFECYCLE_FIXTURE', field: 'sourceLifecycleFixtureName', message: 'sourceLifecycleFixtureName is required.', severity: 'error' });
  }
  if (!fixture.sourceReplayFixtureName || typeof fixture.sourceReplayFixtureName !== 'string') {
    issues.push({ code: 'MISSING_REPLAY_FIXTURE', field: 'sourceReplayFixtureName', message: 'sourceReplayFixtureName is required.', severity: 'error' });
  }

  // Risk identity
  if (!fixture.riskIdentity?.assessmentId) {
    issues.push({ code: 'MISSING_RISK_IDENTITY', field: 'riskIdentity.assessmentId', message: 'riskIdentity.assessmentId is required.', severity: 'error' });
  }
  if (!isValidLaunchRiskEngineGeneratedAt(fixture.riskIdentity?.generatedAt)) {
    issues.push({ code: 'INVALID_GENERATED_AT', field: 'riskIdentity.generatedAt', message: 'riskIdentity.generatedAt must be the deterministic constant.', severity: 'error' });
  }
  if (!fixture.riskIdentity?.deterministicSeed) {
    issues.push({ code: 'MISSING_DETERMINISTIC_SEED', field: 'riskIdentity.deterministicSeed', message: 'riskIdentity.deterministicSeed is required.', severity: 'error' });
  }

  // Factor outputs
  if (!Array.isArray(fixture.factorOutputs) || fixture.factorOutputs.length === 0) {
    issues.push({ code: 'NO_FACTOR_OUTPUTS', field: 'factorOutputs', message: 'factorOutputs must be a non-empty array.', severity: 'error' });
  } else {
    for (const [index, factor] of fixture.factorOutputs.entries()) {
      const path = `factorOutputs[${index}]`;
      if (!(LAUNCH_RISK_FACTOR_KINDS as readonly string[]).includes(factor.factorKind)) {
        issues.push({ code: 'INVALID_FACTOR_KIND', field: `${path}.factorKind`, message: `factorKind "${factor.factorKind}" is invalid.`, severity: 'error' });
      }
      if (!(LAUNCH_RISK_SEVERITY_VALUES as readonly string[]).includes(factor.severity)) {
        issues.push({ code: 'INVALID_SEVERITY', field: `${path}.severity`, message: `severity "${factor.severity}" is invalid.`, severity: 'error' });
      }
      if (!(LAUNCH_RISK_CONFIDENCE_LABELS as readonly string[]).includes(factor.confidenceLabel)) {
        issues.push({ code: 'INVALID_CONFIDENCE_LABEL', field: `${path}.confidenceLabel`, message: `confidenceLabel "${factor.confidenceLabel}" is invalid.`, severity: 'error' });
      }
      if (!factor.reasonCode || typeof factor.reasonCode !== 'string') {
        issues.push({ code: 'MISSING_REASON_CODE', field: `${path}.reasonCode`, message: 'reasonCode is required for every factor output.', severity: 'error' });
      }
      if (!Array.isArray(factor.evidenceReferenceIds) || factor.evidenceReferenceIds.length === 0) {
        issues.push({ code: 'MISSING_EVIDENCE_REFERENCES', field: `${path}.evidenceReferenceIds`, message: 'evidenceReferenceIds must be non-empty for every factor output.', severity: 'error' });
      }
      if (factor.scoreContribution < 0 || factor.scoreContribution > 1) {
        issues.push({ code: 'INVALID_SCORE_CONTRIBUTION', field: `${path}.scoreContribution`, message: `scoreContribution ${factor.scoreContribution} is out of range [0,1].`, severity: 'error' });
      }
    }
  }

  // Thresholds
  if (!fixture.thresholds || typeof fixture.thresholds.low !== 'number') {
    issues.push({ code: 'MISSING_THRESHOLDS', field: 'thresholds', message: 'thresholds are required.', severity: 'error' });
  }

  // Assessment
  const assessment = fixture.assessment;
  if (!assessment?.assessmentId) {
    issues.push({ code: 'MISSING_ASSESSMENT_ID', field: 'assessment.assessmentId', message: 'assessment.assessmentId is required.', severity: 'error' });
  }
  if (assessment?.totalRiskScore !== undefined) {
    if (assessment.totalRiskScore < 0 || assessment.totalRiskScore > 1) {
      issues.push({ code: 'INVALID_TOTAL_SCORE', field: 'assessment.totalRiskScore', message: `totalRiskScore ${assessment.totalRiskScore} is out of range [0,1].`, severity: 'error' });
    }
    const recalculated = calculateLaunchRiskScore(fixture.factorOutputs);
    const diff = Math.abs(assessment.totalRiskScore - recalculated);
    if (diff > 0.001) {
      issues.push({ code: 'SCORE_MISMATCH', field: 'assessment.totalRiskScore', message: `totalRiskScore ${assessment.totalRiskScore} does not match recalculated score ${recalculated}.`, severity: 'error' });
    }
    if (!(LAUNCH_RISK_BANDS as readonly string[]).includes(assessment.riskBand)) {
      issues.push({ code: 'INVALID_RISK_BAND', field: 'assessment.riskBand', message: `riskBand "${assessment.riskBand}" is invalid.`, severity: 'error' });
    }
    const expectedBand = classifyLaunchRiskBand(assessment.totalRiskScore, LAUNCH_RISK_ENGINE_DEFAULT_THRESHOLDS);
    if (assessment.riskBand !== expectedBand) {
      issues.push({ code: 'RISK_BAND_MISMATCH', field: 'assessment.riskBand', message: `riskBand "${assessment.riskBand}" does not match expected band "${expectedBand}" for score ${assessment.totalRiskScore}.`, severity: 'error' });
    }
  }

  // Meta
  if (!isValidLaunchRiskEngineGeneratedAt(fixture.meta?.generatedAt)) {
    issues.push({ code: 'INVALID_META_GENERATED_AT', field: 'meta.generatedAt', message: 'meta.generatedAt must be the deterministic constant.', severity: 'error' });
  }
  if (!isValidLaunchRiskEngineSource(fixture.meta?.source)) {
    issues.push({ code: 'INVALID_META_SOURCE', field: 'meta.source', message: 'meta.source must be the deterministic constant.', severity: 'error' });
  }

  // Safety fields
  if (fixture.safety?.fixtureOnly !== true) {
    issues.push({ code: 'MISSING_SAFETY_FIXTURE_ONLY', field: 'safety.fixtureOnly', message: 'safety.fixtureOnly must be true.', severity: 'error' });
  }
  if (fixture.safety?.localOnly !== true) {
    issues.push({ code: 'MISSING_SAFETY_LOCAL_ONLY', field: 'safety.localOnly', message: 'safety.localOnly must be true.', severity: 'error' });
  }
  if (fixture.safety?.nonAdvisory !== true) {
    issues.push({ code: 'MISSING_SAFETY_NON_ADVISORY', field: 'safety.nonAdvisory', message: 'safety.nonAdvisory must be true.', severity: 'error' });
  }

  // Capability flags
  if (fixture.capabilityFlags?.launchRiskEngine !== true) {
    issues.push({ code: 'INVALID_CAPABILITY_FLAG', field: 'capabilityFlags.launchRiskEngine', message: 'launchRiskEngine capability flag must be true.', severity: 'error' });
  }
  if (fixture.capabilityFlags?.launchRiskLiveData !== false) {
    issues.push({ code: 'UNSAFE_CAPABILITY_FLAG', field: 'capabilityFlags.launchRiskLiveData', message: 'launchRiskLiveData must be false.', severity: 'error' });
  }
  if (fixture.capabilityFlags?.launchRiskNetworkAccess !== false) {
    issues.push({ code: 'UNSAFE_CAPABILITY_FLAG', field: 'capabilityFlags.launchRiskNetworkAccess', message: 'launchRiskNetworkAccess must be false.', severity: 'error' });
  }
  if (fixture.capabilityFlags?.launchRiskExecution !== false) {
    issues.push({ code: 'UNSAFE_CAPABILITY_FLAG', field: 'capabilityFlags.launchRiskExecution', message: 'launchRiskExecution must be false.', severity: 'error' });
  }

  // Deep safety scan
  scanObjectRecursive(fixture, 'fixture', issues);

  return {
    valid: issues.every(issue => issue.severity !== 'error'),
    issues,
  };
}

export function validateLaunchRiskEngineSafety(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineSafetyResult {
  const violations: string[] = [];

  if (fixture.capabilityFlags?.launchRiskLiveData !== false) {
    violations.push('launchRiskLiveData must be false');
  }
  if (fixture.capabilityFlags?.launchRiskNetworkAccess !== false) {
    violations.push('launchRiskNetworkAccess must be false');
  }
  if (fixture.capabilityFlags?.launchRiskExecution !== false) {
    violations.push('launchRiskExecution must be false');
  }
  if (fixture.capabilityFlags?.launchRiskTradingSignals !== false) {
    violations.push('launchRiskTradingSignals must be false');
  }
  if (fixture.capabilityFlags?.launchRiskRecommendations !== false) {
    violations.push('launchRiskRecommendations must be false');
  }
  if (fixture.capabilityFlags?.launchRiskInvestmentAdvice !== false) {
    violations.push('launchRiskInvestmentAdvice must be false');
  }
  if (fixture.capabilityFlags?.launchRiskPaperSimulation !== false) {
    violations.push('launchRiskPaperSimulation must be false');
  }
  if (fixture.capabilityFlags?.launchRiskStrategySelection !== false) {
    violations.push('launchRiskStrategySelection must be false');
  }
  if (fixture.safety?.fixtureOnly !== true) {
    violations.push('safety.fixtureOnly must be true');
  }
  if (fixture.safety?.nonAdvisory !== true) {
    violations.push('safety.nonAdvisory must be true');
  }
  if (fixture.safety?.notASignal !== true) {
    violations.push('safety.notASignal must be true');
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateLaunchRiskEngineFixtureTable(
  fixtures: readonly LaunchRiskEngineFixture[],
): LaunchRiskEngineValidationResult {
  const issues: LaunchRiskEngineValidationIssue[] = [];

  // Check unique IDs
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  for (const fixture of fixtures) {
    if (seenIds.has(fixture.fixtureId)) {
      issues.push({ code: 'DUPLICATE_FIXTURE_ID', field: 'fixtureId', message: `Duplicate fixtureId: ${fixture.fixtureId}`, severity: 'error' });
    }
    seenIds.add(fixture.fixtureId);
    if (seenNames.has(fixture.fixtureName)) {
      issues.push({ code: 'DUPLICATE_FIXTURE_NAME', field: 'fixtureName', message: `Duplicate fixtureName: ${fixture.fixtureName}`, severity: 'error' });
    }
    seenNames.add(fixture.fixtureName);

    const result = validateLaunchRiskEngineFixture(fixture);
    issues.push(...result.issues.map(issue => ({ ...issue, field: `${fixture.fixtureId}.${issue.field}` })));
  }

  // All assessment names covered
  for (const name of LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES) {
    if (!seenNames.has(name)) {
      issues.push({ code: 'MISSING_ASSESSMENT_NAME', field: 'fixtureName', message: `Assessment name "${name}" is not covered by any fixture.`, severity: 'error' });
    }
  }

  return {
    valid: issues.every(issue => issue.severity !== 'error'),
    issues,
  };
}
