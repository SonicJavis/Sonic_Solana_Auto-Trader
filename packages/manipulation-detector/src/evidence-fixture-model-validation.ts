/**
 * Phase 32 — Bundle / Manipulation Evidence Fixture Models v1: validation and safety.
 */

import {
  CREATOR_INTELLIGENCE_FIXTURE_NAMES,
  type CreatorIntelligenceFixtureName,
} from '@sonic/creator-intelligence';
import {
  WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES,
  type WalletClusterIntelligenceFixtureName,
} from '@sonic/wallet-intelligence';
import {
  MANIPULATION_EVIDENCE_FIXTURE_KINDS,
  MANIPULATION_EVIDENCE_FIXTURE_NAMES,
  PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
  PHASE_32_MANIPULATION_EVIDENCE_SOURCE,
  type ManipulationEvidenceCrossReferenceSummary,
  type ManipulationEvidenceFixture,
  type ManipulationEvidenceValidationIssue,
  type ManipulationEvidenceValidationResult,
  type ManipulationEvidenceSafetyResult,
} from './evidence-fixture-model-types.js';
import {
  isManipulationEvidenceFixtureSerializable,
  normalizeManipulationEvidenceFixture,
} from './evidence-fixture-model-normalization.js';

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

function asStringArray(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function makeIssue(
  code: string,
  message: string,
  field: string,
  severity: 'error' | 'warning' = 'error',
): ManipulationEvidenceValidationIssue {
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
): readonly ManipulationEvidenceValidationIssue[] {
  const sorted = [...values].sort((left, right) => left.localeCompare(right));
  return JSON.stringify(values) === JSON.stringify(sorted)
    ? []
    : [makeIssue('UNSTABLE_ORDERING', `${field} must be sorted deterministically.`, field)];
}

function validateIndicatorOrdering(
  values: readonly { readonly code: string }[],
  field: string,
): readonly ManipulationEvidenceValidationIssue[] {
  const codes = values.map(value => value.code);
  return validateSortedStrings(codes, field);
}

function validateForbiddenContent(
  payloadStrings: readonly string[],
): readonly ManipulationEvidenceValidationIssue[] {
  const issues: ManipulationEvidenceValidationIssue[] = [];
  const patterns: ReadonlyArray<[RegExp, string, string]> = [
    [EMAIL_PATTERN, 'EMAIL_FORBIDDEN', 'email-like content is forbidden in manipulation evidence fixtures.'],
    [PHONE_PATTERN, 'PHONE_FORBIDDEN', 'phone-like content is forbidden in manipulation evidence fixtures.'],
    [STREET_PATTERN, 'ADDRESS_FORBIDDEN', 'address-like content is forbidden in manipulation evidence fixtures.'],
    [URL_PATTERN, 'URL_FORBIDDEN', 'external URLs are forbidden in manipulation evidence fixtures.'],
    [
      STACK_TRACE_PATTERN,
      'STACK_TRACE_FORBIDDEN',
      'stack-trace-like content is forbidden in manipulation evidence fixtures.',
    ],
    [
      LOCAL_PATH_PATTERN,
      'LOCAL_PATH_FORBIDDEN',
      'local filesystem paths are forbidden in manipulation evidence fixtures.',
    ],
    [SECRET_PATTERN, 'SECRET_FORBIDDEN', 'secret-like content is forbidden in manipulation evidence fixtures.'],
    [
      LIVE_DATA_PATTERN,
      'LIVE_DATA_CLAIM_FORBIDDEN',
      'live-data, provider, or network-client claims are forbidden in manipulation evidence fixtures.',
    ],
    [
      ADVICE_PATTERN,
      'ADVICE_LANGUAGE_FORBIDDEN',
      'investment-advice language is forbidden in manipulation evidence fixtures.',
    ],
    [
      EXECUTION_PATTERN,
      'EXECUTION_LANGUAGE_FORBIDDEN',
      'trading or execution language is forbidden in manipulation evidence fixtures.',
    ],
    [
      ACCUSATION_PATTERN,
      'ACCUSATION_LANGUAGE_FORBIDDEN',
      'accusatory language is forbidden in manipulation evidence fixtures.',
    ],
    [
      WALLET_OWNERSHIP_PATTERN,
      'WALLET_OWNERSHIP_FORBIDDEN',
      'wallet ownership claims are forbidden in manipulation evidence fixtures.',
    ],
    [
      SOLANA_ADDRESS_PATTERN,
      'WALLET_ADDRESS_FORBIDDEN',
      'real wallet-address-like content is forbidden in manipulation evidence fixtures.',
    ],
    [
      TX_HASH_PATTERN,
      'TRANSACTION_HASH_FORBIDDEN',
      'real transaction-hash-like content is forbidden in manipulation evidence fixtures.',
    ],
    [
      BUNDLE_ID_PATTERN,
      'BUNDLE_ID_FORBIDDEN',
      'real bundle-id-like content is forbidden in manipulation evidence fixtures.',
    ],
  ];

  patterns.forEach(([pattern, code, message]) => {
    if (payloadStrings.some(value => pattern.test(value))) {
      issues.push(makeIssue(code, message, 'payload'));
    }
  });

  return issues;
}

function expectedReferenceStatus(
  summary: Partial<ManipulationEvidenceCrossReferenceSummary>,
): ManipulationEvidenceCrossReferenceSummary['referenceStatus'] {
  const hasCreator = Boolean(summary.creatorFixtureName);
  const hasWallet = Boolean(summary.walletClusterFixtureName);
  if (hasCreator && hasWallet) return 'creator-and-wallet';
  if (hasCreator) return 'creator-only';
  if (hasWallet) return 'wallet-only';
  return 'none';
}

function isKnownCreatorFixtureName(value: unknown): value is CreatorIntelligenceFixtureName {
  return typeof value === 'string' && CREATOR_INTELLIGENCE_FIXTURE_NAMES.includes(value as CreatorIntelligenceFixtureName);
}

function isKnownWalletClusterFixtureName(
  value: unknown,
): value is WalletClusterIntelligenceFixtureName {
  return (
    typeof value === 'string' &&
    WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES.includes(value as WalletClusterIntelligenceFixtureName)
  );
}

export function validateManipulationEvidenceSafety(value: unknown): ManipulationEvidenceSafetyResult {
  if (!isRecord(value)) {
    return {
      safe: false,
      violations: ['Manipulation evidence safety validation requires a non-null object.'],
    };
  }

  const strings = collectStrings(value);
  const violations = validateForbiddenContent(strings)
    .map(issue => issue.message)
    .sort((left, right) => left.localeCompare(right));

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateManipulationEvidenceFixture(
  value: unknown,
): ManipulationEvidenceValidationResult {
  const issues: ManipulationEvidenceValidationIssue[] = [];

  if (!isRecord(value)) {
    return {
      valid: false,
      issues: [
        makeIssue(
          'INVALID_FIXTURE_OBJECT',
          'Manipulation evidence fixture must be a non-null object.',
          'fixture',
        ),
      ],
    };
  }

  const fixture = value as Partial<ManipulationEvidenceFixture>;

  if (!MANIPULATION_EVIDENCE_FIXTURE_NAMES.includes(fixture.name as never)) {
    issues.push(makeIssue('UNSUPPORTED_FIXTURE_NAME', 'Fixture name is not supported.', 'name'));
  }
  if (!MANIPULATION_EVIDENCE_FIXTURE_KINDS.includes(fixture.kind as never)) {
    issues.push(makeIssue('UNSUPPORTED_FIXTURE_KIND', 'Fixture kind is not supported.', 'kind'));
  }

  const meta = isRecord(fixture.meta) ? fixture.meta : null;
  if (!meta) {
    issues.push(makeIssue('META_REQUIRED', 'meta is required.', 'meta'));
  } else {
    if (meta.phase !== 32) {
      issues.push(makeIssue('INVALID_PHASE', 'meta.phase must be 32.', 'meta.phase'));
    }
    if (meta.generatedAt !== PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT) {
      issues.push(
        makeIssue(
          'INVALID_GENERATED_AT',
          'meta.generatedAt must use the deterministic Phase 32 timestamp.',
          'meta.generatedAt',
        ),
      );
    }
    if (meta.source !== PHASE_32_MANIPULATION_EVIDENCE_SOURCE) {
      issues.push(
        makeIssue(
          'INVALID_SOURCE',
          'meta.source must use the deterministic Phase 32 source tag.',
          'meta.source',
        ),
      );
    }
    if (meta.fixtureOnly !== true) {
      issues.push(makeIssue('FIXTURE_ONLY_REQUIRED', 'meta.fixtureOnly must be true.', 'meta.fixtureOnly'));
    }
    if (meta.syntheticOnly !== true) {
      issues.push(makeIssue('SYNTHETIC_ONLY_REQUIRED', 'meta.syntheticOnly must be true.', 'meta.syntheticOnly'));
    }
    if (meta.liveData !== false) {
      issues.push(makeIssue('LIVE_DATA_FORBIDDEN', 'meta.liveData must be false.', 'meta.liveData'));
    }
    if (meta.externalNetwork !== false) {
      issues.push(
        makeIssue('EXTERNAL_NETWORK_FORBIDDEN', 'meta.externalNetwork must be false.', 'meta.externalNetwork'),
      );
    }
    if (meta.persistence !== false) {
      issues.push(makeIssue('PERSISTENCE_FORBIDDEN', 'meta.persistence must be false.', 'meta.persistence'));
    }
    if (meta.readOnly !== true) {
      issues.push(makeIssue('READ_ONLY_REQUIRED', 'meta.readOnly must be true.', 'meta.readOnly'));
    }
    if (meta.nonAdvisory !== true) {
      issues.push(makeIssue('NON_ADVISORY_REQUIRED', 'meta.nonAdvisory must be true.', 'meta.nonAdvisory'));
    }
    if (meta.nonAccusatory !== true) {
      issues.push(makeIssue('NON_ACCUSATORY_REQUIRED', 'meta.nonAccusatory must be true.', 'meta.nonAccusatory'));
    }
    issues.push(...validateSortedStrings(asStringArray(meta.notes), 'meta.notes'));
  }

  const summary = isRecord(fixture.summary) ? fixture.summary : null;
  if (!summary) {
    issues.push(makeIssue('SUMMARY_REQUIRED', 'summary is required.', 'summary'));
  } else {
    if (summary.phase !== 32) {
      issues.push(makeIssue('INVALID_SUMMARY_PHASE', 'summary.phase must be 32.', 'summary.phase'));
    }
    if (summary.name !== fixture.name) {
      issues.push(makeIssue('SUMMARY_NAME_MISMATCH', 'summary.name must match fixture.name.', 'summary.name'));
    }
    if (summary.kind !== fixture.kind) {
      issues.push(makeIssue('SUMMARY_KIND_MISMATCH', 'summary.kind must match fixture.kind.', 'summary.kind'));
    }
    if (summary.generatedAt !== PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT) {
      issues.push(
        makeIssue(
          'INVALID_SUMMARY_GENERATED_AT',
          'summary.generatedAt must use the deterministic Phase 32 timestamp.',
          'summary.generatedAt',
        ),
      );
    }
    if (summary.fixtureOnly !== true) {
      issues.push(makeIssue('SUMMARY_FIXTURE_ONLY_REQUIRED', 'summary.fixtureOnly must be true.', 'summary.fixtureOnly'));
    }
    if (summary.liveData !== false) {
      issues.push(makeIssue('SUMMARY_LIVE_DATA_FORBIDDEN', 'summary.liveData must be false.', 'summary.liveData'));
    }
    if (summary.externalNetwork !== false) {
      issues.push(
        makeIssue(
          'SUMMARY_EXTERNAL_NETWORK_FORBIDDEN',
          'summary.externalNetwork must be false.',
          'summary.externalNetwork',
        ),
      );
    }
    if (summary.nonAdvisory !== true) {
      issues.push(
        makeIssue('SUMMARY_NON_ADVISORY_REQUIRED', 'summary.nonAdvisory must be true.', 'summary.nonAdvisory'),
      );
    }
    if (summary.safeToDisplay !== true) {
      issues.push(
        makeIssue('SUMMARY_SAFE_TO_DISPLAY_REQUIRED', 'summary.safeToDisplay must be true.', 'summary.safeToDisplay'),
      );
    }
    if (summary.riskCount !== (fixture.riskIndicators?.length ?? 0)) {
      issues.push(makeIssue('SUMMARY_RISK_COUNT_MISMATCH', 'summary.riskCount must match riskIndicators.', 'summary.riskCount'));
    }
    if (summary.qualityCount !== (fixture.qualityIndicators?.length ?? 0)) {
      issues.push(
        makeIssue(
          'SUMMARY_QUALITY_COUNT_MISMATCH',
          'summary.qualityCount must match qualityIndicators.',
          'summary.qualityCount',
        ),
      );
    }
    issues.push(...validateSortedStrings(asStringArray(summary.topQualityCodes), 'summary.topQualityCodes'));
    issues.push(...validateSortedStrings(asStringArray(summary.topRiskCodes), 'summary.topRiskCodes'));
    issues.push(...validateSortedStrings(asStringArray(summary.notes), 'summary.notes'));
    if (
      summary.referencedCreatorFixtureName !== undefined &&
      !isKnownCreatorFixtureName(summary.referencedCreatorFixtureName)
    ) {
      issues.push(
        makeIssue(
          'UNSUPPORTED_CREATOR_REFERENCE',
          'summary.referencedCreatorFixtureName must reference a known Phase 30 fixture name.',
          'summary.referencedCreatorFixtureName',
        ),
      );
    }
    if (
      summary.referencedWalletClusterFixtureName !== undefined &&
      !isKnownWalletClusterFixtureName(summary.referencedWalletClusterFixtureName)
    ) {
      issues.push(
        makeIssue(
          'UNSUPPORTED_WALLET_CLUSTER_REFERENCE',
          'summary.referencedWalletClusterFixtureName must reference a known Phase 31 fixture name.',
          'summary.referencedWalletClusterFixtureName',
        ),
      );
    }
  }

  const crossReferenceSummary = isRecord(fixture.crossReferenceSummary) ? fixture.crossReferenceSummary : null;
  if (!crossReferenceSummary) {
    issues.push(
      makeIssue('CROSS_REFERENCE_SUMMARY_REQUIRED', 'crossReferenceSummary is required.', 'crossReferenceSummary'),
    );
  } else {
    if (crossReferenceSummary.generatedAt !== PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT) {
      issues.push(
        makeIssue(
          'INVALID_CROSS_REFERENCE_GENERATED_AT',
          'crossReferenceSummary.generatedAt must use the deterministic Phase 32 timestamp.',
          'crossReferenceSummary.generatedAt',
        ),
      );
    }
    if (crossReferenceSummary.fixtureOnly !== true) {
      issues.push(
        makeIssue(
          'CROSS_REFERENCE_FIXTURE_ONLY_REQUIRED',
          'crossReferenceSummary.fixtureOnly must be true.',
          'crossReferenceSummary.fixtureOnly',
        ),
      );
    }
    if (crossReferenceSummary.syntheticOnly !== true) {
      issues.push(
        makeIssue(
          'CROSS_REFERENCE_SYNTHETIC_ONLY_REQUIRED',
          'crossReferenceSummary.syntheticOnly must be true.',
          'crossReferenceSummary.syntheticOnly',
        ),
      );
    }
    if (crossReferenceSummary.nonAdvisory !== true) {
      issues.push(
        makeIssue(
          'CROSS_REFERENCE_NON_ADVISORY_REQUIRED',
          'crossReferenceSummary.nonAdvisory must be true.',
          'crossReferenceSummary.nonAdvisory',
        ),
      );
    }
    if (
      crossReferenceSummary.creatorFixtureName !== undefined &&
      !isKnownCreatorFixtureName(crossReferenceSummary.creatorFixtureName)
    ) {
      issues.push(
        makeIssue(
          'UNSUPPORTED_CROSS_REFERENCE_CREATOR',
          'crossReferenceSummary.creatorFixtureName must reference a known Phase 30 fixture name.',
          'crossReferenceSummary.creatorFixtureName',
        ),
      );
    }
    if (
      crossReferenceSummary.walletClusterFixtureName !== undefined &&
      !isKnownWalletClusterFixtureName(crossReferenceSummary.walletClusterFixtureName)
    ) {
      issues.push(
        makeIssue(
          'UNSUPPORTED_CROSS_REFERENCE_WALLET',
          'crossReferenceSummary.walletClusterFixtureName must reference a known Phase 31 fixture name.',
          'crossReferenceSummary.walletClusterFixtureName',
        ),
      );
    }
    if (crossReferenceSummary.referenceStatus !== expectedReferenceStatus(crossReferenceSummary)) {
      issues.push(
        makeIssue(
          'CROSS_REFERENCE_STATUS_MISMATCH',
          'crossReferenceSummary.referenceStatus must match the provided synthetic references.',
          'crossReferenceSummary.referenceStatus',
        ),
      );
    }
    issues.push(
      ...validateSortedStrings(asStringArray(crossReferenceSummary.sharedSignals), 'crossReferenceSummary.sharedSignals'),
    );
    issues.push(
      ...validateSortedStrings(asStringArray(crossReferenceSummary.cautionNotes), 'crossReferenceSummary.cautionNotes'),
    );
  }

  const requiredObjects: ReadonlyArray<[unknown, string]> = [
    [fixture.bundlePattern, 'bundlePattern'],
    [fixture.launchStructure, 'launchStructure'],
    [fixture.liquidityPattern, 'liquidityPattern'],
    [fixture.coordination, 'coordination'],
    [fixture.distribution, 'distribution'],
    [fixture.fundingPattern, 'fundingPattern'],
  ];

  requiredObjects.forEach(([entry, field]) => {
    if (!isRecord(entry)) {
      issues.push(makeIssue('REQUIRED_OBJECT_MISSING', `${field} is required.`, field));
    }
  });

  issues.push(...validateSortedStrings(asStringArray(fixture.safeNotes), 'safeNotes'));
  issues.push(...validateIndicatorOrdering(fixture.riskIndicators ?? [], 'riskIndicators'));
  issues.push(...validateIndicatorOrdering(fixture.qualityIndicators ?? [], 'qualityIndicators'));
  issues.push(...validateForbiddenContent(collectStrings(fixture)));

  if (!isManipulationEvidenceFixtureSerializable(fixture)) {
    issues.push(makeIssue('NOT_SERIALIZABLE', 'Fixture must be serializable.', 'fixture'));
  }

  if (issues.length === 0) {
    const normalized = normalizeManipulationEvidenceFixture(fixture as ManipulationEvidenceFixture);
    if (JSON.stringify(normalized) !== JSON.stringify(fixture)) {
      issues.push(
        makeIssue(
          'NOT_NORMALIZED',
          'Fixture must already be normalized into deterministic ordering.',
          'fixture',
          'warning',
        ),
      );
    }
  }

  return {
    valid: issues.every(issue => issue.severity !== 'error'),
    issues,
  };
}
