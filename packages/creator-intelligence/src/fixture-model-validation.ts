/**
 * Phase 30 — Creator Intelligence Fixture Models v1: validation and safety.
 */

import {
  CREATOR_INTELLIGENCE_FIXTURE_KINDS,
  CREATOR_INTELLIGENCE_FIXTURE_NAMES,
  PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT,
  PHASE_30_CREATOR_INTELLIGENCE_SOURCE,
  type CreatorIntelligenceFixture,
  type CreatorIntelligenceSafetyResult,
  type CreatorIntelligenceValidationIssue,
  type CreatorIntelligenceValidationResult,
} from './fixture-model-types.js';
import { isCreatorIntelligenceFixtureSerializable, normalizeCreatorIntelligenceFixture } from './fixture-model-normalization.js';

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN = /\b(?:\+?\d{1,2}\s*)?(?:\(?\d{3}\)?[-.\s]*)\d{3}[-.\s]*\d{4}\b/;
const STREET_PATTERN = /\b\d{1,5}\s+[A-Za-z0-9.'-]+\s(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr)\b/i;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/i;
const STACK_TRACE_PATTERN = /(?:TypeError:|ReferenceError:|SyntaxError:|\bat\s+\S+\s+\()|(?:\bat Object\.)/;
const LOCAL_PATH_PATTERN = /(?:\/home\/|\/Users\/|C:\\Users\\|file:\/\/)/;
const SECRET_PATTERN = /\b(?:private key|seed phrase|mnemonic|api key|secret token|access token|BEGIN PRIVATE KEY)\b/i;
const LIVE_DATA_PATTERN = /\b(?:live data|real-time|scraped|api collected|twitter api|x api|telegram api|discord api|wallet ownership|wallet owner)\b/i;
const ADVICE_PATTERN = /\b(?:investment advice|recommendation|trading signal|buy now|sell now|entry point|exit target|price target)\b/i;
const EXECUTION_PATTERN = /\b(?:execute trade|place order|swap now|send transaction|sign transaction)\b/i;

function makeIssue(
  code: string,
  message: string,
  field: string,
  severity: 'error' | 'warning' = 'error',
): CreatorIntelligenceValidationIssue {
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
  if (value && typeof value === 'object') {
    Object.values(value).forEach(entry => {
      collectStrings(entry, results);
    });
  }
  return results;
}

function validateSortedStrings(values: readonly string[], field: string): readonly CreatorIntelligenceValidationIssue[] {
  const sorted = [...values].sort((left, right) => left.localeCompare(right));
  return JSON.stringify(values) === JSON.stringify(sorted)
    ? []
    : [makeIssue('UNSTABLE_ORDERING', `${field} must be sorted deterministically.`, field)];
}

function validateForbiddenContent(payloadStrings: readonly string[]): readonly CreatorIntelligenceValidationIssue[] {
  const issues: CreatorIntelligenceValidationIssue[] = [];
  const patterns: ReadonlyArray<[RegExp, string, string]> = [
    [EMAIL_PATTERN, 'EMAIL_FORBIDDEN', 'email-like content is forbidden in fixture models.'],
    [PHONE_PATTERN, 'PHONE_FORBIDDEN', 'phone-like content is forbidden in fixture models.'],
    [STREET_PATTERN, 'ADDRESS_FORBIDDEN', 'address-like content is forbidden in fixture models.'],
    [URL_PATTERN, 'URL_FORBIDDEN', 'external URLs are forbidden in fixture models.'],
    [STACK_TRACE_PATTERN, 'STACK_TRACE_FORBIDDEN', 'stack-trace-like content is forbidden in fixture models.'],
    [LOCAL_PATH_PATTERN, 'LOCAL_PATH_FORBIDDEN', 'local filesystem paths are forbidden in fixture models.'],
    [SECRET_PATTERN, 'SECRET_FORBIDDEN', 'secret-like content is forbidden in fixture models.'],
    [LIVE_DATA_PATTERN, 'LIVE_DATA_CLAIM_FORBIDDEN', 'live-data or scraping claims are forbidden in fixture models.'],
    [ADVICE_PATTERN, 'ADVICE_LANGUAGE_FORBIDDEN', 'investment-advice language is forbidden in fixture models.'],
    [EXECUTION_PATTERN, 'EXECUTION_LANGUAGE_FORBIDDEN', 'trading or execution language is forbidden in fixture models.'],
  ];

  patterns.forEach(([pattern, code, message]) => {
    if (payloadStrings.some(value => pattern.test(value))) {
      issues.push(makeIssue(code, message, 'payload'));
    }
  });

  return issues;
}

export function validateCreatorIntelligenceSafety(value: unknown): CreatorIntelligenceSafetyResult {
  if (!value || typeof value !== 'object') {
    return { safe: false, violations: ['Creator intelligence fixture safety validation requires a non-null object.'] };
  }

  const strings = collectStrings(value);
  const violations = validateForbiddenContent(strings).map(issue => issue.message).sort((left, right) =>
    left.localeCompare(right),
  );

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateCreatorIntelligenceFixture(value: unknown): CreatorIntelligenceValidationResult {
  const issues: CreatorIntelligenceValidationIssue[] = [];

  if (!value || typeof value !== 'object') {
    return {
      valid: false,
      issues: [makeIssue('INVALID_FIXTURE_OBJECT', 'Creator intelligence fixture must be a non-null object.', 'fixture')],
    };
  }

  const fixture = value as CreatorIntelligenceFixture;

  if (!CREATOR_INTELLIGENCE_FIXTURE_NAMES.includes(fixture.name)) {
    issues.push(makeIssue('UNSUPPORTED_FIXTURE_NAME', 'Fixture name is not supported.', 'name'));
  }
  if (!CREATOR_INTELLIGENCE_FIXTURE_KINDS.includes(fixture.kind)) {
    issues.push(makeIssue('UNSUPPORTED_FIXTURE_KIND', 'Fixture kind is not supported.', 'kind'));
  }
  if (fixture.meta.phase !== 30) {
    issues.push(makeIssue('INVALID_PHASE', 'meta.phase must be 30.', 'meta.phase'));
  }
  if (fixture.meta.generatedAt !== PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT) {
    issues.push(makeIssue('INVALID_GENERATED_AT', 'meta.generatedAt must use the deterministic Phase 30 timestamp.', 'meta.generatedAt'));
  }
  if (fixture.meta.source !== PHASE_30_CREATOR_INTELLIGENCE_SOURCE) {
    issues.push(makeIssue('INVALID_SOURCE', 'meta.source must use the deterministic Phase 30 source tag.', 'meta.source'));
  }
  if (fixture.meta.fixtureOnly !== true) {
    issues.push(makeIssue('FIXTURE_ONLY_REQUIRED', 'meta.fixtureOnly must be true.', 'meta.fixtureOnly'));
  }
  if (fixture.meta.syntheticOnly !== true) {
    issues.push(makeIssue('SYNTHETIC_ONLY_REQUIRED', 'meta.syntheticOnly must be true.', 'meta.syntheticOnly'));
  }
  if (fixture.meta.liveData !== false) {
    issues.push(makeIssue('LIVE_DATA_FORBIDDEN', 'meta.liveData must be false.', 'meta.liveData'));
  }
  if (fixture.meta.externalNetwork !== false) {
    issues.push(makeIssue('EXTERNAL_NETWORK_FORBIDDEN', 'meta.externalNetwork must be false.', 'meta.externalNetwork'));
  }
  if (fixture.meta.persistence !== false) {
    issues.push(makeIssue('PERSISTENCE_FORBIDDEN', 'meta.persistence must be false.', 'meta.persistence'));
  }
  if (fixture.meta.readOnly !== true) {
    issues.push(makeIssue('READ_ONLY_REQUIRED', 'meta.readOnly must be true.', 'meta.readOnly'));
  }
  if (fixture.meta.nonAdvisory !== true) {
    issues.push(makeIssue('NON_ADVISORY_REQUIRED', 'meta.nonAdvisory must be true.', 'meta.nonAdvisory'));
  }
  if (!fixture.profile.creatorId || !fixture.project.projectId || !fixture.project.projectLabel) {
    issues.push(makeIssue('REQUIRED_FIELDS_MISSING', 'Fixture profile/project identifiers are required.', 'profile.project'));
  }
  if (!isCreatorIntelligenceFixtureSerializable(fixture)) {
    issues.push(makeIssue('NOT_SERIALIZABLE', 'Fixture must be serializable.', 'fixture'));
  }

  issues.push(...validateSortedStrings(fixture.safeNotes, 'safeNotes'));
  issues.push(...validateSortedStrings(fixture.meta.notes, 'meta.notes'));
  issues.push(...validateSortedStrings(fixture.summary.topCredibilityCodes, 'summary.topCredibilityCodes'));
  issues.push(...validateSortedStrings(fixture.summary.topRiskCodes, 'summary.topRiskCodes'));
  issues.push(...validateSortedStrings(fixture.summary.notes, 'summary.notes'));
  issues.push(...validateSortedStrings(fixture.narrative.evidenceTags, 'narrative.evidenceTags'));

  const normalized = normalizeCreatorIntelligenceFixture(fixture);
  if (JSON.stringify(fixture) !== JSON.stringify(normalized)) {
    issues.push(makeIssue('NOT_NORMALIZED', 'Fixture must already be normalized and deterministically ordered.', 'fixture'));
  }

  if (fixture.summary.phase !== 30) {
    issues.push(makeIssue('SUMMARY_PHASE_INVALID', 'summary.phase must be 30.', 'summary.phase'));
  }
  if (fixture.summary.name !== fixture.name) {
    issues.push(makeIssue('SUMMARY_NAME_MISMATCH', 'summary.name must match fixture name.', 'summary.name'));
  }
  if (fixture.summary.kind !== fixture.kind) {
    issues.push(makeIssue('SUMMARY_KIND_MISMATCH', 'summary.kind must match fixture kind.', 'summary.kind'));
  }
  if (fixture.summary.generatedAt !== fixture.meta.generatedAt) {
    issues.push(makeIssue('SUMMARY_GENERATED_AT_MISMATCH', 'summary.generatedAt must match meta.generatedAt.', 'summary.generatedAt'));
  }
  if (fixture.summary.fixtureOnly !== true || fixture.summary.liveData !== false || fixture.summary.externalNetwork !== false) {
    issues.push(makeIssue('SUMMARY_SAFETY_INVALID', 'summary safety flags must remain fixture-only, local, and offline.', 'summary'));
  }

  issues.push(...validateForbiddenContent(collectStrings(fixture)));

  return {
    valid: issues.length === 0,
    issues,
  };
}
