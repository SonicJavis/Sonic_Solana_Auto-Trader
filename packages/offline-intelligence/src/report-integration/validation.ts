/**
 * Phase 34 — Offline Intelligence Report Integration Models v1: validation and safety.
 */

import {
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES,
} from '../types.js';
import {
  OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES,
  OFFLINE_INTELLIGENCE_REPORT_KINDS,
  OFFLINE_INTELLIGENCE_REPORT_SECTION_KINDS,
  PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT,
  PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE,
  type OfflineIntelligenceReportModel,
  type OfflineIntelligenceReportSafetyResult,
  type OfflineIntelligenceReportValidationIssue,
  type OfflineIntelligenceReportValidationResult,
} from './types.js';
import {
  isOfflineIntelligenceReportModelSerializable,
} from './normalization.js';

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN = /\b(?:\+?\d{1,2}\s*)?(?:\(?\d{3}\)?[-.\s]*)\d{3}[-.\s]*\d{4}\b/;
const STREET_PATTERN =
  /\b\d{1,5}\s+[A-Za-z0-9.'-]+\s(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr)\b/i;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/i;
const DOWNLOAD_PATTERN = /\b(?:download url|createobjecturl|blob url|file export path|save to file)\b/i;
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
): OfflineIntelligenceReportValidationIssue {
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
): readonly OfflineIntelligenceReportValidationIssue[] {
  const sorted = [...values].sort((left, right) => left.localeCompare(right));
  return JSON.stringify(values) === JSON.stringify(sorted)
    ? []
    : [makeIssue('UNSTABLE_ORDERING', `${field} must be sorted deterministically.`, field)];
}

function validateRequiredString(
  value: unknown,
  field: string,
  validValues?: readonly string[],
): readonly OfflineIntelligenceReportValidationIssue[] {
  if (typeof value !== 'string' || value.trim() === '') {
    return [
      makeIssue(
        'MISSING_REQUIRED_FIELD',
        `${field} is required and must be a non-empty string.`,
        field,
      ),
    ];
  }
  if (validValues && !validValues.includes(value)) {
    return [makeIssue('INVALID_VALUE', `${field} has an unsupported value: ${value}.`, field)];
  }
  return [];
}

function validateMeta(
  report: OfflineIntelligenceReportModel,
): readonly OfflineIntelligenceReportValidationIssue[] {
  const issues: OfflineIntelligenceReportValidationIssue[] = [];
  const { meta } = report;

  if (meta.phase !== 34) issues.push(makeIssue('INVALID_PHASE', 'meta.phase must be 34.', 'meta.phase'));
  if (meta.generatedAt !== PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT) {
    issues.push(
      makeIssue(
        'NON_DETERMINISTIC_GENERATED_AT',
        'meta.generatedAt must be the fixed Phase 34 constant.',
        'meta.generatedAt',
      ),
    );
  }
  if (meta.source !== PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE) {
    issues.push(makeIssue('INVALID_SOURCE', 'meta.source must be the Phase 34 source constant.', 'meta.source'));
  }
  if (!(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES as readonly string[]).includes(meta.sourceCompositeFixtureName)) {
    issues.push(
      makeIssue(
        'INVALID_COMPOSITE_REF_NAME',
        'meta.sourceCompositeFixtureName must be a Phase 33 fixture name.',
        'meta.sourceCompositeFixtureName',
      ),
    );
  }
  if (!(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS as readonly string[]).includes(meta.sourceCompositeFixtureKind)) {
    issues.push(
      makeIssue(
        'INVALID_COMPOSITE_REF_KIND',
        'meta.sourceCompositeFixtureKind must be a Phase 33 fixture kind.',
        'meta.sourceCompositeFixtureKind',
      ),
    );
  }

  if (meta.fixtureOnly !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.fixtureOnly must be true.', 'meta.fixtureOnly'));
  if (meta.syntheticOnly !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.syntheticOnly must be true.', 'meta.syntheticOnly'));
  if (meta.deterministic !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.deterministic must be true.', 'meta.deterministic'));
  if (meta.readOnly !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.readOnly must be true.', 'meta.readOnly'));
  if (meta.localOnly !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.localOnly must be true.', 'meta.localOnly'));
  if (meta.liveData !== false) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.liveData must be false.', 'meta.liveData'));
  if (meta.externalNetwork !== false) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.externalNetwork must be false.', 'meta.externalNetwork'));
  if (meta.persistence !== false) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.persistence must be false.', 'meta.persistence'));
  if (meta.nonAdvisory !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.nonAdvisory must be true.', 'meta.nonAdvisory'));
  if (meta.nonAccusatory !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.nonAccusatory must be true.', 'meta.nonAccusatory'));
  if (meta.dashboardReportCompatible !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.dashboardReportCompatible must be true.', 'meta.dashboardReportCompatible'));
  if (meta.serializationPreviewCompatible !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'meta.serializationPreviewCompatible must be true.', 'meta.serializationPreviewCompatible'));
  issues.push(...validateSortedStrings(meta.notes, 'meta.notes'));
  issues.push(...validateSortedStrings(meta.sourceCompositeWeighting.notes, 'meta.sourceCompositeWeighting.notes'));

  return issues;
}

function validateSummary(
  report: OfflineIntelligenceReportModel,
): readonly OfflineIntelligenceReportValidationIssue[] {
  const issues: OfflineIntelligenceReportValidationIssue[] = [];
  const { summary } = report;

  if (summary.phase !== 34) issues.push(makeIssue('INVALID_PHASE', 'summary.phase must be 34.', 'summary.phase'));
  if (summary.reportName !== report.name) {
    issues.push(makeIssue('NAME_MISMATCH', 'summary.reportName must match report.name.', 'summary.reportName'));
  }
  if (summary.reportKind !== report.kind) {
    issues.push(makeIssue('KIND_MISMATCH', 'summary.reportKind must match report.kind.', 'summary.reportKind'));
  }
  if (summary.sourceCompositeFixtureName !== report.sourceCompositeFixture.name) {
    issues.push(makeIssue('SOURCE_MISMATCH', 'summary.sourceCompositeFixtureName must match source fixture name.', 'summary.sourceCompositeFixtureName'));
  }
  if (summary.sourceCompositeFixtureKind !== report.sourceCompositeFixture.kind) {
    issues.push(makeIssue('SOURCE_MISMATCH', 'summary.sourceCompositeFixtureKind must match source fixture kind.', 'summary.sourceCompositeFixtureKind'));
  }
  if (summary.generatedAt !== PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT) {
    issues.push(makeIssue('NON_DETERMINISTIC_GENERATED_AT', 'summary.generatedAt must be fixed.', 'summary.generatedAt'));
  }
  if (summary.sectionCount !== report.sections.length) {
    issues.push(makeIssue('INVALID_COUNT', 'summary.sectionCount must match report.sections.length.', 'summary.sectionCount'));
  }
  if (summary.riskCount !== report.sourceCompositeFixture.riskIndicators.length) {
    issues.push(makeIssue('INVALID_COUNT', 'summary.riskCount must match source riskIndicators length.', 'summary.riskCount'));
  }
  if (summary.qualityCount !== report.sourceCompositeFixture.qualityIndicators.length) {
    issues.push(makeIssue('INVALID_COUNT', 'summary.qualityCount must match source qualityIndicators length.', 'summary.qualityCount'));
  }
  if (summary.confidenceCount !== report.sourceCompositeFixture.confidenceIndicators.length) {
    issues.push(makeIssue('INVALID_COUNT', 'summary.confidenceCount must match source confidenceIndicators length.', 'summary.confidenceCount'));
  }
  if (summary.nonAdvisory !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'summary.nonAdvisory must be true.', 'summary.nonAdvisory'));
  if (summary.nonActionable !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'summary.nonActionable must be true.', 'summary.nonActionable'));
  if (summary.safeToDisplay !== true) issues.push(makeIssue('SAFETY_VIOLATION', 'summary.safeToDisplay must be true.', 'summary.safeToDisplay'));
  issues.push(...validateSortedStrings(summary.notes, 'summary.notes'));

  return issues;
}

function validateSections(
  report: OfflineIntelligenceReportModel,
): readonly OfflineIntelligenceReportValidationIssue[] {
  const issues: OfflineIntelligenceReportValidationIssue[] = [];
  const sectionIds = report.sections.map(section => section.id);
  const sortedSectionIds = [...sectionIds].sort((left, right) => left.localeCompare(right));
  if (JSON.stringify(sectionIds) !== JSON.stringify(sortedSectionIds)) {
    issues.push(makeIssue('UNSTABLE_ORDERING', 'sections must be sorted by id.', 'sections'));
  }

  report.sections.forEach((section, index) => {
    issues.push(...validateRequiredString(section.id, `sections[${index}].id`));
    issues.push(...validateRequiredString(section.title, `sections[${index}].title`));
    issues.push(...validateRequiredString(
      section.kind,
      `sections[${index}].kind`,
      OFFLINE_INTELLIGENCE_REPORT_SECTION_KINDS as readonly string[],
    ));
    issues.push(...validateRequiredString(section.summary, `sections[${index}].summary`));
    issues.push(...validateSortedStrings(section.notes, `sections[${index}].notes`));
  });

  return issues;
}

export function validateOfflineIntelligenceReportModel(
  report: unknown,
): OfflineIntelligenceReportValidationResult {
  if (!isRecord(report)) {
    return {
      valid: false,
      issues: [makeIssue('INVALID_INPUT', 'Input must be a non-null object.', 'root')],
    };
  }

  const issues: OfflineIntelligenceReportValidationIssue[] = [];

  issues.push(
    ...validateRequiredString(
      report['name'],
      'name',
      OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES as unknown as readonly string[],
    ),
  );
  issues.push(
    ...validateRequiredString(
      report['kind'],
      'kind',
      OFFLINE_INTELLIGENCE_REPORT_KINDS as unknown as readonly string[],
    ),
  );
  issues.push(...validateRequiredString(report['title'], 'title'));

  if (!isRecord(report['meta'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'meta is required and must be an object.', 'meta'));
  }
  if (!isRecord(report['summary'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'summary is required and must be an object.', 'summary'));
  }
  if (!Array.isArray(report['sections'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'sections must be an array.', 'sections'));
  }
  if (!Array.isArray(report['safeNotes'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'safeNotes must be an array.', 'safeNotes'));
  } else {
    issues.push(...validateSortedStrings(report['safeNotes'] as string[], 'safeNotes'));
  }

  if (!isRecord(report['sourceCompositeFixture'])) {
    issues.push(
      makeIssue(
        'MISSING_REQUIRED_FIELD',
        'sourceCompositeFixture is required and must be an object.',
        'sourceCompositeFixture',
      ),
    );
  }

  if (issues.length === 0) {
    const typedReport = report as unknown as OfflineIntelligenceReportModel;
    issues.push(...validateMeta(typedReport));
    issues.push(...validateSummary(typedReport));
    issues.push(...validateSections(typedReport));
  }

  if (!isOfflineIntelligenceReportModelSerializable(report)) {
    issues.push(makeIssue('NOT_SERIALIZABLE', 'Report must be JSON-serializable.', 'root'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateOfflineIntelligenceReportSafety(
  report: unknown,
): OfflineIntelligenceReportSafetyResult {
  if (report === null || report === undefined) {
    return {
      safe: false,
      violations: ['Report safety validation requires a non-null object.'],
    };
  }

  const violations: string[] = [];
  const allStrings = collectStrings(report);

  for (const str of allStrings) {
    if (SOLANA_ADDRESS_PATTERN.test(str)) violations.push(`Possible real Solana address detected: "${str.slice(0, 20)}..."`);
    if (TX_HASH_PATTERN.test(str)) violations.push(`Possible real transaction hash detected: "${str.slice(0, 20)}..."`);
    if (BUNDLE_ID_PATTERN.test(str)) violations.push(`Possible real bundle ID detected: "${str.slice(0, 20)}..."`);
    if (EMAIL_PATTERN.test(str)) violations.push(`Possible email address detected: "${str.slice(0, 20)}..."`);
    if (PHONE_PATTERN.test(str)) violations.push(`Possible phone number detected: "${str.slice(0, 20)}..."`);
    if (STREET_PATTERN.test(str)) violations.push(`Possible street address detected: "${str.slice(0, 20)}..."`);
    if (URL_PATTERN.test(str)) violations.push(`External URL detected: "${str.slice(0, 20)}..."`);
    if (DOWNLOAD_PATTERN.test(str)) violations.push(`File-export or download language detected: "${str.slice(0, 20)}..."`);
    if (STACK_TRACE_PATTERN.test(str)) violations.push(`Possible stack trace detected: "${str.slice(0, 20)}..."`);
    if (LOCAL_PATH_PATTERN.test(str)) violations.push(`Local path detected: "${str.slice(0, 20)}..."`);
    if (SECRET_PATTERN.test(str)) violations.push(`Possible secret/credential detected: "${str.slice(0, 20)}..."`);
    if (LIVE_DATA_PATTERN.test(str)) violations.push(`Live-data claim detected: "${str.slice(0, 40)}..."`);
    if (ADVICE_PATTERN.test(str)) violations.push(`Investment advice language detected: "${str.slice(0, 40)}..."`);
    if (EXECUTION_PATTERN.test(str)) violations.push(`Execution instruction detected: "${str.slice(0, 40)}..."`);
    if (ACCUSATION_PATTERN.test(str)) violations.push(`Accusation language detected: "${str.slice(0, 40)}..."`);
    if (WALLET_OWNERSHIP_PATTERN.test(str)) violations.push(`Wallet ownership claim detected: "${str.slice(0, 40)}..."`);
  }

  return { safe: violations.length === 0, violations };
}
