/**
 * Phase 33 — Offline Intelligence Composite Evidence Models v1: validation and safety.
 */

import { CREATOR_INTELLIGENCE_FIXTURE_NAMES } from '@sonic/creator-intelligence';
import { WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES } from '@sonic/wallet-intelligence';
import { MANIPULATION_EVIDENCE_FIXTURE_NAMES } from '@sonic/manipulation-detector';
import {
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES,
  PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT,
  PHASE_33_COMPOSITE_EVIDENCE_SOURCE,
  type OfflineCompositeEvidenceFixture,
  type CompositeEvidenceValidationIssue,
  type CompositeEvidenceValidationResult,
  type CompositeEvidenceSafetyResult,
} from './types.js';
import {
  isOfflineCompositeEvidenceFixtureSerializable,
  normalizeOfflineCompositeEvidenceFixture,
} from './normalization.js';

// Safety patterns
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN = /\b(?:\+?\d{1,2}\s*)?(?:\(?\d{3}\)?[-.\s]*)\d{3}[-.\s]*\d{4}\b/;
const STREET_PATTERN =
  /\b\d{1,5}\s+[A-Za-z0-9.'-]+\s(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr)\b/i;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/i;
const STACK_TRACE_PATTERN =
  /(?:TypeError:|ReferenceError:|SyntaxError:|\bat\s+\S+\s+\()|(?:\bat Object\.)/;
const LOCAL_PATH_PATTERN = /(?:\/home\/|\/Users\/|C:\\Users\\|file:\/\/)/;
const SECRET_PATTERN =
  /\b(?:private key|seed phrase|mnemonic|api key|secret token|access token|BEGIN PRIVATE KEY)\b/i;
const LIVE_DATA_PATTERN =
  /\b(?:live data|real-time|scraped|api collected|solana rpc|provider api|jito|mev|mempool|yellowstone|geyser|helius|websocket|fetch|axios)\b/i;
const ADVICE_PATTERN =
  /\b(?:investment advice|recommendation|trading signal|buy now|sell now|entry point|exit target|price target)\b/i;
const EXECUTION_PATTERN =
  /\b(?:execute trade|place order|swap now|send transaction|sign transaction|connect wallet)\b/i;
const ACCUSATION_PATTERN =
  /\b(?:criminal|fraudster|scammer|thief|real manipulator|guilty party|proven manipulation by)\b/i;
const WALLET_OWNERSHIP_PATTERN = /\b(?:wallet owner|wallet ownership|controlled by|belongs to)\b/i;
const SOLANA_ADDRESS_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;
const TX_HASH_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/;
const BUNDLE_ID_PATTERN = /\bbundle[-_ ]?(?:id|hash)?[:#-]?\s*[a-f0-9]{8,}\b/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function makeIssue(
  code: string,
  message: string,
  field: string,
  severity: 'error' | 'warning' = 'error',
): CompositeEvidenceValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, results: string[] = []): readonly string[] {
  if (typeof value === 'string') {
    results.push(value);
    return results;
  }
  if (Array.isArray(value)) {
    value.forEach(entry => {
      collectStrings(entry, results);
    });
    return results;
  }
  if (isRecord(value)) {
    Object.values(value).forEach(entry => {
      collectStrings(entry, results);
    });
  }
  return results;
}

function validateSortedStrings(
  values: readonly string[],
  field: string,
): readonly CompositeEvidenceValidationIssue[] {
  const sorted = [...values].sort((left, right) => left.localeCompare(right));
  return JSON.stringify(values) === JSON.stringify(sorted)
    ? []
    : [makeIssue('UNSTABLE_ORDERING', `${field} must be sorted deterministically.`, field)];
}

function validateIndicatorOrdering(
  values: readonly { readonly code: string }[],
  field: string,
): readonly CompositeEvidenceValidationIssue[] {
  const codes = values.map(v => v.code);
  const sorted = [...codes].sort((left, right) => left.localeCompare(right));
  return JSON.stringify(codes) === JSON.stringify(sorted)
    ? []
    : [makeIssue('UNSTABLE_ORDERING', `${field} must be sorted by code deterministically.`, field)];
}

function validateRequiredString(
  value: unknown,
  field: string,
  validValues?: readonly string[],
): readonly CompositeEvidenceValidationIssue[] {
  if (typeof value !== 'string' || value.trim() === '') {
    return [makeIssue('MISSING_REQUIRED_FIELD', `${field} is required and must be a non-empty string.`, field)];
  }
  if (validValues && !validValues.includes(value)) {
    return [makeIssue('INVALID_VALUE', `${field} has an unsupported value: ${value}.`, field)];
  }
  return [];
}

function validateMeta(fixture: OfflineCompositeEvidenceFixture): readonly CompositeEvidenceValidationIssue[] {
  const issues: CompositeEvidenceValidationIssue[] = [];
  const { meta } = fixture;
  if (meta.phase !== 33) {
    issues.push(makeIssue('INVALID_PHASE', 'meta.phase must be 33.', 'meta.phase'));
  }
  if (meta.generatedAt !== PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT) {
    issues.push(makeIssue('NON_DETERMINISTIC_GENERATED_AT', 'meta.generatedAt must be the fixed Phase 33 constant.', 'meta.generatedAt'));
  }
  if (meta.source !== PHASE_33_COMPOSITE_EVIDENCE_SOURCE) {
    issues.push(makeIssue('INVALID_SOURCE', 'meta.source must be the Phase 33 source constant.', 'meta.source'));
  }
  if (meta.fixtureOnly !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.fixtureOnly must be true.', 'meta.fixtureOnly'));
  if (meta.syntheticOnly !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.syntheticOnly must be true.', 'meta.syntheticOnly'));
  if (meta.liveData !== false) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.liveData must be false.', 'meta.liveData'));
  if (meta.externalNetwork !== false) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.externalNetwork must be false.', 'meta.externalNetwork'));
  if (meta.persistence !== false) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.persistence must be false.', 'meta.persistence'));
  if (meta.deterministic !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.deterministic must be true.', 'meta.deterministic'));
  if (meta.readOnly !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.readOnly must be true.', 'meta.readOnly'));
  if (meta.nonAdvisory !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.nonAdvisory must be true.', 'meta.nonAdvisory'));
  if (meta.nonAccusatory !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.nonAccusatory must be true.', 'meta.nonAccusatory'));
  return issues;
}

function validateSummary(fixture: OfflineCompositeEvidenceFixture): readonly CompositeEvidenceValidationIssue[] {
  const issues: CompositeEvidenceValidationIssue[] = [];
  const { summary } = fixture;
  if (summary.phase !== 33) {
    issues.push(makeIssue('INVALID_PHASE', 'summary.phase must be 33.', 'summary.phase'));
  }
  if (summary.name !== fixture.name) {
    issues.push(makeIssue('NAME_MISMATCH', 'summary.name must match fixture.name.', 'summary.name'));
  }
  if (summary.kind !== fixture.kind) {
    issues.push(makeIssue('KIND_MISMATCH', 'summary.kind must match fixture.kind.', 'summary.kind'));
  }
  if (summary.generatedAt !== PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT) {
    issues.push(makeIssue('NON_DETERMINISTIC_GENERATED_AT', 'summary.generatedAt must be fixed.', 'summary.generatedAt'));
  }
  if (summary.fixtureOnly !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'summary.fixtureOnly must be true.', 'summary.fixtureOnly'));
  if (summary.liveData !== false) issues.push(makeIssue('SAFETY_VIOLATION', 'summary.liveData must be false.', 'summary.liveData'));
  if (summary.externalNetwork !== false) issues.push(makeIssue('SAFETY_VIOLATION', 'summary.externalNetwork must be false.', 'summary.externalNetwork'));
  if (summary.nonAdvisory !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'summary.nonAdvisory must be true.', 'summary.nonAdvisory'));
  if (summary.safeToDisplay !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'summary.safeToDisplay must be true.', 'summary.safeToDisplay'));
  if (typeof summary.riskCount !== 'number' || summary.riskCount < 0) {
    issues.push(makeIssue('INVALID_COUNT', 'summary.riskCount must be a non-negative number.', 'summary.riskCount'));
  }
  if (typeof summary.qualityCount !== 'number' || summary.qualityCount < 0) {
    issues.push(makeIssue('INVALID_COUNT', 'summary.qualityCount must be a non-negative number.', 'summary.qualityCount'));
  }
  if (typeof summary.confidenceCount !== 'number' || summary.confidenceCount < 0) {
    issues.push(makeIssue('INVALID_COUNT', 'summary.confidenceCount must be a non-negative number.', 'summary.confidenceCount'));
  }
  issues.push(...validateSortedStrings(summary.topRiskCodes, 'summary.topRiskCodes'));
  issues.push(...validateSortedStrings(summary.topQualityCodes, 'summary.topQualityCodes'));
  issues.push(...validateSortedStrings(summary.notes, 'summary.notes'));
  if (
    summary.referencedCreatorFixtureName !== undefined &&
    !(CREATOR_INTELLIGENCE_FIXTURE_NAMES as readonly string[]).includes(summary.referencedCreatorFixtureName)
  ) {
    issues.push(makeIssue('INVALID_CREATOR_REF', 'summary.referencedCreatorFixtureName is not a valid Phase 30 creator fixture name.', 'summary.referencedCreatorFixtureName'));
  }
  if (
    summary.referencedWalletClusterFixtureName !== undefined &&
    !(WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES as readonly string[]).includes(summary.referencedWalletClusterFixtureName)
  ) {
    issues.push(makeIssue('INVALID_WALLET_CLUSTER_REF', 'summary.referencedWalletClusterFixtureName is not a valid Phase 31 wallet cluster fixture name.', 'summary.referencedWalletClusterFixtureName'));
  }
  if (
    summary.referencedManipulationFixtureName !== undefined &&
    !(MANIPULATION_EVIDENCE_FIXTURE_NAMES as readonly string[]).includes(summary.referencedManipulationFixtureName)
  ) {
    issues.push(makeIssue('INVALID_MANIPULATION_REF', 'summary.referencedManipulationFixtureName is not a valid Phase 32 manipulation evidence fixture name.', 'summary.referencedManipulationFixtureName'));
  }
  return issues;
}

function validateSourceReferences(fixture: OfflineCompositeEvidenceFixture): readonly CompositeEvidenceValidationIssue[] {
  const issues: CompositeEvidenceValidationIssue[] = [];
  const { sourceReferences } = fixture;
  if (typeof sourceReferences.sourceCount !== 'number' || sourceReferences.sourceCount < 0 || sourceReferences.sourceCount > 3) {
    issues.push(makeIssue('INVALID_SOURCE_COUNT', 'sourceReferences.sourceCount must be 0–3.', 'sourceReferences.sourceCount'));
  }
  if (sourceReferences.creator) {
    if (!(CREATOR_INTELLIGENCE_FIXTURE_NAMES as readonly string[]).includes(sourceReferences.creator.creatorFixtureName)) {
      issues.push(makeIssue('INVALID_CREATOR_REF', 'sourceReferences.creator.creatorFixtureName is not a valid Phase 30 fixture name.', 'sourceReferences.creator.creatorFixtureName'));
    }
    issues.push(...validateSortedStrings(sourceReferences.creator.notes, 'sourceReferences.creator.notes'));
  }
  if (sourceReferences.walletCluster) {
    if (!(WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES as readonly string[]).includes(sourceReferences.walletCluster.walletClusterFixtureName)) {
      issues.push(makeIssue('INVALID_WALLET_CLUSTER_REF', 'sourceReferences.walletCluster.walletClusterFixtureName is not a valid Phase 31 fixture name.', 'sourceReferences.walletCluster.walletClusterFixtureName'));
    }
    issues.push(...validateSortedStrings(sourceReferences.walletCluster.notes, 'sourceReferences.walletCluster.notes'));
  }
  if (sourceReferences.manipulation) {
    if (!(MANIPULATION_EVIDENCE_FIXTURE_NAMES as readonly string[]).includes(sourceReferences.manipulation.manipulationEvidenceFixtureName)) {
      issues.push(makeIssue('INVALID_MANIPULATION_REF', 'sourceReferences.manipulation.manipulationEvidenceFixtureName is not a valid Phase 32 fixture name.', 'sourceReferences.manipulation.manipulationEvidenceFixtureName'));
    }
    issues.push(...validateSortedStrings(sourceReferences.manipulation.notes, 'sourceReferences.manipulation.notes'));
  }
  issues.push(...validateSortedStrings(sourceReferences.notes, 'sourceReferences.notes'));
  return issues;
}

export function validateOfflineCompositeEvidenceFixture(
  fixture: unknown,
): CompositeEvidenceValidationResult {
  if (!isRecord(fixture)) {
    return { valid: false, issues: [makeIssue('INVALID_INPUT', 'Input must be a non-null object.', 'root')] };
  }

  const issues: CompositeEvidenceValidationIssue[] = [];

  issues.push(...validateRequiredString(fixture['name'], 'name', OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES as unknown as readonly string[]));
  issues.push(...validateRequiredString(fixture['kind'], 'kind', OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS as unknown as readonly string[]));

  if (!isRecord(fixture['meta'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'meta is required and must be an object.', 'meta'));
  } else {
    issues.push(...validateMeta(fixture as unknown as OfflineCompositeEvidenceFixture));
  }

  if (!isRecord(fixture['summary'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'summary is required and must be an object.', 'summary'));
  } else {
    issues.push(...validateSummary(fixture as unknown as OfflineCompositeEvidenceFixture));
  }

  if (!isRecord(fixture['sourceReferences'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'sourceReferences is required and must be an object.', 'sourceReferences'));
  } else {
    issues.push(...validateSourceReferences(fixture as unknown as OfflineCompositeEvidenceFixture));
  }

  if (!Array.isArray(fixture['riskIndicators'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'riskIndicators must be an array.', 'riskIndicators'));
  } else {
    issues.push(...validateIndicatorOrdering(fixture['riskIndicators'] as { code: string }[], 'riskIndicators'));
  }

  if (!Array.isArray(fixture['qualityIndicators'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'qualityIndicators must be an array.', 'qualityIndicators'));
  } else {
    issues.push(...validateIndicatorOrdering(fixture['qualityIndicators'] as { code: string }[], 'qualityIndicators'));
  }

  if (!Array.isArray(fixture['confidenceIndicators'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'confidenceIndicators must be an array.', 'confidenceIndicators'));
  } else {
    issues.push(...validateIndicatorOrdering(fixture['confidenceIndicators'] as { code: string }[], 'confidenceIndicators'));
  }

  if (!isOfflineCompositeEvidenceFixtureSerializable(fixture)) {
    issues.push(makeIssue('NOT_SERIALIZABLE', 'Fixture must be JSON-serializable.', 'root'));
  }

  const normalized = issues.length === 0
    ? normalizeOfflineCompositeEvidenceFixture(fixture as unknown as OfflineCompositeEvidenceFixture)
    : null;

  if (normalized && !isRecord(fixture['weighting'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'weighting is required and must be an object.', 'weighting'));
  }

  if (!Array.isArray(fixture['safeNotes'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'safeNotes must be an array.', 'safeNotes'));
  } else {
    issues.push(...validateSortedStrings(fixture['safeNotes'] as string[], 'safeNotes'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateOfflineCompositeEvidenceSafety(
  fixture: unknown,
): CompositeEvidenceSafetyResult {
  if (fixture === null || fixture === undefined) {
    return {
      safe: false,
      violations: ['Composite evidence safety validation requires a non-null object.'],
    };
  }
  const violations: string[] = [];
  const allStrings = collectStrings(fixture);

  for (const str of allStrings) {
    if (SOLANA_ADDRESS_PATTERN.test(str)) {
      violations.push(`Possible real Solana address detected: "${str.slice(0, 20)}..."`);
    }
    if (TX_HASH_PATTERN.test(str)) {
      violations.push(`Possible real transaction hash detected: "${str.slice(0, 20)}..."`);
    }
    if (BUNDLE_ID_PATTERN.test(str)) {
      violations.push(`Possible real bundle ID detected: "${str.slice(0, 20)}..."`);
    }
    if (EMAIL_PATTERN.test(str)) {
      violations.push(`Possible email address detected: "${str.slice(0, 20)}..."`);
    }
    if (PHONE_PATTERN.test(str)) {
      violations.push(`Possible phone number detected: "${str.slice(0, 20)}..."`);
    }
    if (STREET_PATTERN.test(str)) {
      violations.push(`Possible street address detected: "${str.slice(0, 20)}..."`);
    }
    if (URL_PATTERN.test(str)) {
      violations.push(`External URL detected: "${str.slice(0, 20)}..."`);
    }
    if (STACK_TRACE_PATTERN.test(str)) {
      violations.push(`Possible stack trace detected: "${str.slice(0, 20)}..."`);
    }
    if (LOCAL_PATH_PATTERN.test(str)) {
      violations.push(`Local path detected: "${str.slice(0, 20)}..."`);
    }
    if (SECRET_PATTERN.test(str)) {
      violations.push(`Possible secret/credential detected: "${str.slice(0, 20)}..."`);
    }
    if (LIVE_DATA_PATTERN.test(str)) {
      violations.push(`Live-data claim detected: "${str.slice(0, 40)}..."`);
    }
    if (ADVICE_PATTERN.test(str)) {
      violations.push(`Investment advice language detected: "${str.slice(0, 40)}..."`);
    }
    if (EXECUTION_PATTERN.test(str)) {
      violations.push(`Execution instruction detected: "${str.slice(0, 40)}..."`);
    }
    if (ACCUSATION_PATTERN.test(str)) {
      violations.push(`Accusation language detected: "${str.slice(0, 40)}..."`);
    }
    if (WALLET_OWNERSHIP_PATTERN.test(str)) {
      violations.push(`Wallet ownership claim detected: "${str.slice(0, 40)}..."`);
    }
  }

  return { safe: violations.length === 0, violations };
}
