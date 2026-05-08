/**
 * Phase 38 — Strategy Candidate Evaluation Fixtures v1: validation and safety.
 */

import {
  PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT,
  PHASE_38_STRATEGY_CANDIDATES_SOURCE,
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS,
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES,
  type StrategyCandidateEvaluationFixture,
  type StrategyCandidateSafetyResult,
  type StrategyCandidateValidationIssue,
  type StrategyCandidateValidationResult,
} from './types.js';
import {
  isStrategyCandidateEvaluationFixtureSerializable,
  normalizeStrategyCandidateEvaluationFixture,
} from './normalization.js';
import {
  SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS,
  SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES,
  SCORE_BAND_RANGE_CATEGORIES,
} from '../score-band-outcomes/types.js';
import { REPLAY_OUTCOME_FIXTURE_NAMES } from '../replay-outcomes/types.js';

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
  /\b(?:live data|real-time|solana rpc|provider api|jito|mev|mempool|yellowstone|geyser|helius|websocket|fetch|axios)\b/i;
const EXECUTION_PATTERN =
  /\b(?:execute|execution control|sign transaction|send transaction|sendRawTransaction|swap|buy|sell|order|fill|position)\b/i;
const ADVICE_PATTERN =
  /\b(?:investment advice|recommendation|trading signal|entry point|exit target|price target|suggested action)\b/i;
const REAL_PNL_PATTERN =
  /\b(?:real pnl|live pnl|balance|order fill|filled order|paper trade|live trade|real order|real fill)\b/i;
const REAL_SCORE_RANK_PATTERN =
  /\b(?:real scoring|real score|real ranking|asset ranking|strategy ranking|alpha proven|proven alpha)\b/i;
const SOLANA_ADDRESS_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;
const TX_HASH_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function makeIssue(
  code: string,
  message: string,
  field: string,
  severity: 'error' | 'warning' = 'error',
): StrategyCandidateValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, results: string[] = []): readonly string[] {
  if (typeof value === 'string') {
    results.push(value);
    return results;
  }
  if (Array.isArray(value)) {
    value.forEach(entry => collectStrings(entry, results));
    return results;
  }
  if (isRecord(value)) {
    Object.values(value).forEach(entry => collectStrings(entry, results));
  }
  return results;
}

function validateSortedStrings(
  values: readonly string[],
  field: string,
): readonly StrategyCandidateValidationIssue[] {
  const sorted = [...values].sort((left, right) => left.localeCompare(right));
  return JSON.stringify(values) === JSON.stringify(sorted)
    ? []
    : [makeIssue('UNSTABLE_ORDERING', `${field} must be sorted deterministically.`, field)];
}

function validateIndicatorOrdering(
  values: readonly { readonly code: string }[],
  field: string,
): readonly StrategyCandidateValidationIssue[] {
  const codes = values.map(value => value.code);
  const sorted = [...codes].sort((left, right) => left.localeCompare(right));
  return JSON.stringify(codes) === JSON.stringify(sorted)
    ? []
    : [
        makeIssue(
          'UNSTABLE_ORDERING',
          `${field} must be sorted by code deterministically.`,
          field,
        ),
      ];
}

function validateRequiredString(
  value: unknown,
  field: string,
  validValues?: readonly string[],
): readonly StrategyCandidateValidationIssue[] {
  if (typeof value !== 'string' || value.trim() === '') {
    return [
      makeIssue('MISSING_REQUIRED_FIELD', `${field} is required and must be non-empty.`, field),
    ];
  }
  if (validValues && !validValues.includes(value)) {
    return [makeIssue('INVALID_VALUE', `${field} has unsupported value: ${value}.`, field)];
  }
  return [];
}

function validateMeta(
  fixture: StrategyCandidateEvaluationFixture,
): readonly StrategyCandidateValidationIssue[] {
  const issues: StrategyCandidateValidationIssue[] = [];
  const { meta } = fixture;

  if (meta.phase !== 38)
    issues.push(makeIssue('INVALID_PHASE', 'meta.phase must be 38.', 'meta.phase'));
  if (meta.generatedAt !== PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT) {
    issues.push(
      makeIssue(
        'NON_DETERMINISTIC_GENERATED_AT',
        'meta.generatedAt must be the fixed Phase 38 constant.',
        'meta.generatedAt',
      ),
    );
  }
  if (meta.source !== PHASE_38_STRATEGY_CANDIDATES_SOURCE) {
    issues.push(
      makeIssue(
        'INVALID_SOURCE',
        'meta.source must be the Phase 38 source constant.',
        'meta.source',
      ),
    );
  }
  if (meta.fixtureOnly !== true)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.fixtureOnly must be true.', 'meta.fixtureOnly'));
  if (meta.syntheticOnly !== true)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.syntheticOnly must be true.', 'meta.syntheticOnly'));
  if (meta.deterministic !== true)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.deterministic must be true.', 'meta.deterministic'));
  if (meta.readOnly !== true)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.readOnly must be true.', 'meta.readOnly'));
  if (meta.localOnly !== true)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.localOnly must be true.', 'meta.localOnly'));
  if (meta.inMemoryOnly !== true)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.inMemoryOnly must be true.', 'meta.inMemoryOnly'));
  if (meta.liveData !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.liveData must be false.', 'meta.liveData'));
  if (meta.realScoring !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.realScoring must be false.', 'meta.realScoring'));
  if (meta.realRanking !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.realRanking must be false.', 'meta.realRanking'));
  if (meta.realBacktesting !== false)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'meta.realBacktesting must be false.', 'meta.realBacktesting'),
    );
  if (meta.paperTrading !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.paperTrading must be false.', 'meta.paperTrading'));
  if (meta.liveTrading !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.liveTrading must be false.', 'meta.liveTrading'));
  if (meta.execution !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.execution must be false.', 'meta.execution'));
  if (meta.externalNetwork !== false)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'meta.externalNetwork must be false.', 'meta.externalNetwork'),
    );
  if (meta.persistence !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.persistence must be false.', 'meta.persistence'));
  if (meta.fileExport !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.fileExport must be false.', 'meta.fileExport'));
  if (meta.nonAdvisory !== true)
    issues.push(makeIssue('SAFETY_VIOLATION', 'meta.nonAdvisory must be true.', 'meta.nonAdvisory'));
  if (meta.nonAccusatory !== true)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'meta.nonAccusatory must be true.', 'meta.nonAccusatory'),
    );
  issues.push(...validateSortedStrings(meta.notes, 'meta.notes'));

  return issues;
}

function validateSummary(
  fixture: StrategyCandidateEvaluationFixture,
): readonly StrategyCandidateValidationIssue[] {
  const issues: StrategyCandidateValidationIssue[] = [];
  const { summary } = fixture;

  if (summary.phase !== 38)
    issues.push(makeIssue('INVALID_PHASE', 'summary.phase must be 38.', 'summary.phase'));
  if (summary.name !== fixture.name)
    issues.push(makeIssue('NAME_MISMATCH', 'summary.name must match fixture.name.', 'summary.name'));
  if (summary.kind !== fixture.kind)
    issues.push(makeIssue('KIND_MISMATCH', 'summary.kind must match fixture.kind.', 'summary.kind'));
  if (summary.generatedAt !== PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT) {
    issues.push(
      makeIssue(
        'NON_DETERMINISTIC_GENERATED_AT',
        'summary.generatedAt must be fixed Phase 38 constant.',
        'summary.generatedAt',
      ),
    );
  }
  if (summary.fixtureOnly !== true)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'summary.fixtureOnly must be true.', 'summary.fixtureOnly'),
    );
  if (summary.syntheticOnly !== true)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'summary.syntheticOnly must be true.', 'summary.syntheticOnly'),
    );
  if (summary.localOnly !== true)
    issues.push(makeIssue('SAFETY_VIOLATION', 'summary.localOnly must be true.', 'summary.localOnly'));
  if (summary.liveData !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'summary.liveData must be false.', 'summary.liveData'));
  if (summary.realScoring !== false)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'summary.realScoring must be false.', 'summary.realScoring'),
    );
  if (summary.realRanking !== false)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'summary.realRanking must be false.', 'summary.realRanking'),
    );
  if (summary.realBacktesting !== false)
    issues.push(
      makeIssue(
        'SAFETY_VIOLATION',
        'summary.realBacktesting must be false.',
        'summary.realBacktesting',
      ),
    );
  if (summary.paperTrading !== false)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'summary.paperTrading must be false.', 'summary.paperTrading'),
    );
  if (summary.liveTrading !== false)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'summary.liveTrading must be false.', 'summary.liveTrading'),
    );
  if (summary.execution !== false)
    issues.push(makeIssue('SAFETY_VIOLATION', 'summary.execution must be false.', 'summary.execution'));
  if (summary.nonAdvisory !== true)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'summary.nonAdvisory must be true.', 'summary.nonAdvisory'),
    );
  if (summary.nonAccusatory !== true)
    issues.push(
      makeIssue(
        'SAFETY_VIOLATION',
        'summary.nonAccusatory must be true.',
        'summary.nonAccusatory',
      ),
    );
  if (summary.safeToDisplay !== true)
    issues.push(
      makeIssue('SAFETY_VIOLATION', 'summary.safeToDisplay must be true.', 'summary.safeToDisplay'),
    );

  if (typeof summary.criteriaCount !== 'number' || summary.criteriaCount < 0) {
    issues.push(
      makeIssue(
        'INVALID_COUNT',
        'summary.criteriaCount must be non-negative.',
        'summary.criteriaCount',
      ),
    );
  }
  if (typeof summary.riskCount !== 'number' || summary.riskCount < 0) {
    issues.push(
      makeIssue('INVALID_COUNT', 'summary.riskCount must be non-negative.', 'summary.riskCount'),
    );
  }
  if (typeof summary.qualityCount !== 'number' || summary.qualityCount < 0) {
    issues.push(
      makeIssue(
        'INVALID_COUNT',
        'summary.qualityCount must be non-negative.',
        'summary.qualityCount',
      ),
    );
  }
  if (typeof summary.confidenceCount !== 'number' || summary.confidenceCount < 0) {
    issues.push(
      makeIssue(
        'INVALID_COUNT',
        'summary.confidenceCount must be non-negative.',
        'summary.confidenceCount',
      ),
    );
  }
  if (
    !(SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES as readonly string[]).includes(
      summary.referencedScoreBandOutcomeFixtureName,
    )
  ) {
    issues.push(
      makeIssue(
        'INVALID_PHASE37_REF',
        'summary.referencedScoreBandOutcomeFixtureName must be a valid Phase 37 fixture name.',
        'summary.referencedScoreBandOutcomeFixtureName',
      ),
    );
  }
  issues.push(...validateSortedStrings(summary.topRiskCodes, 'summary.topRiskCodes'));
  issues.push(...validateSortedStrings(summary.topQualityCodes, 'summary.topQualityCodes'));
  issues.push(...validateSortedStrings(summary.notes, 'summary.notes'));

  return issues;
}

function validateScoreBandReference(
  fixture: StrategyCandidateEvaluationFixture,
): readonly StrategyCandidateValidationIssue[] {
  const issues: StrategyCandidateValidationIssue[] = [];
  const { scoreBandReference } = fixture;

  if (
    !(SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES as readonly string[]).includes(
      scoreBandReference.scoreBandOutcomeFixtureName,
    )
  ) {
    issues.push(
      makeIssue(
        'INVALID_PHASE37_REF',
        'scoreBandReference.scoreBandOutcomeFixtureName is invalid.',
        'scoreBandReference.scoreBandOutcomeFixtureName',
      ),
    );
  }

  if (
    !(SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS as readonly string[]).includes(
      scoreBandReference.scoreBandOutcomeFixtureKind,
    )
  ) {
    issues.push(
      makeIssue(
        'INVALID_PHASE37_KIND_REF',
        'scoreBandReference.scoreBandOutcomeFixtureKind is invalid.',
        'scoreBandReference.scoreBandOutcomeFixtureKind',
      ),
    );
  }

  if (
    !(SCORE_BAND_RANGE_CATEGORIES as readonly string[]).includes(scoreBandReference.scoreBandCategory)
  ) {
    issues.push(
      makeIssue(
        'INVALID_SCORE_BAND_CATEGORY',
        'scoreBandReference.scoreBandCategory is invalid.',
        'scoreBandReference.scoreBandCategory',
      ),
    );
  }

  if (
    !(REPLAY_OUTCOME_FIXTURE_NAMES as readonly string[]).includes(
      scoreBandReference.referencedReplayOutcomeFixtureName,
    )
  ) {
    issues.push(
      makeIssue(
        'INVALID_PHASE36_REF',
        'scoreBandReference.referencedReplayOutcomeFixtureName is invalid.',
        'scoreBandReference.referencedReplayOutcomeFixtureName',
      ),
    );
  }

  issues.push(...validateSortedStrings(scoreBandReference.notes, 'scoreBandReference.notes'));
  return issues;
}

export function validateStrategyCandidateEvaluationFixture(
  fixture: unknown,
): StrategyCandidateValidationResult {
  if (!isRecord(fixture)) {
    return {
      valid: false,
      issues: [makeIssue('INVALID_INPUT', 'Input must be a non-null object.', 'root')],
    };
  }

  const issues: StrategyCandidateValidationIssue[] = [];

  issues.push(
    ...validateRequiredString(
      fixture['name'],
      'name',
      STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES as unknown as readonly string[],
    ),
  );

  issues.push(
    ...validateRequiredString(
      fixture['kind'],
      'kind',
      STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS as unknown as readonly string[],
    ),
  );

  if (!isRecord(fixture['meta'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'meta is required.', 'meta'));
  } else {
    issues.push(...validateMeta(fixture as unknown as StrategyCandidateEvaluationFixture));
  }

  if (!isRecord(fixture['summary'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'summary is required.', 'summary'));
  } else {
    issues.push(...validateSummary(fixture as unknown as StrategyCandidateEvaluationFixture));
  }

  if (!isRecord(fixture['profile'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'profile is required.', 'profile'));
  }

  if (!isRecord(fixture['scoreBandReference'])) {
    issues.push(
      makeIssue('MISSING_REQUIRED_FIELD', 'scoreBandReference is required.', 'scoreBandReference'),
    );
  } else {
    issues.push(...validateScoreBandReference(fixture as unknown as StrategyCandidateEvaluationFixture));
  }

  if (!Array.isArray(fixture['evaluationCriteria'])) {
    issues.push(
      makeIssue(
        'MISSING_REQUIRED_FIELD',
        'evaluationCriteria must be an array.',
        'evaluationCriteria',
      ),
    );
  } else {
    issues.push(
      ...validateIndicatorOrdering(
        fixture['evaluationCriteria'] as { code: string }[],
        'evaluationCriteria',
      ),
    );
  }

  if (!Array.isArray(fixture['riskIndicators'])) {
    issues.push(
      makeIssue('MISSING_REQUIRED_FIELD', 'riskIndicators must be an array.', 'riskIndicators'),
    );
  } else {
    issues.push(
      ...validateIndicatorOrdering(fixture['riskIndicators'] as { code: string }[], 'riskIndicators'),
    );
  }

  if (!Array.isArray(fixture['qualityIndicators'])) {
    issues.push(
      makeIssue(
        'MISSING_REQUIRED_FIELD',
        'qualityIndicators must be an array.',
        'qualityIndicators',
      ),
    );
  } else {
    issues.push(
      ...validateIndicatorOrdering(
        fixture['qualityIndicators'] as { code: string }[],
        'qualityIndicators',
      ),
    );
  }

  if (!Array.isArray(fixture['confidenceIndicators'])) {
    issues.push(
      makeIssue(
        'MISSING_REQUIRED_FIELD',
        'confidenceIndicators must be an array.',
        'confidenceIndicators',
      ),
    );
  } else {
    issues.push(
      ...validateIndicatorOrdering(
        fixture['confidenceIndicators'] as { code: string }[],
        'confidenceIndicators',
      ),
    );
  }

  if (!Array.isArray(fixture['safeNotes'])) {
    issues.push(makeIssue('MISSING_REQUIRED_FIELD', 'safeNotes must be an array.', 'safeNotes'));
  } else {
    issues.push(...validateSortedStrings(fixture['safeNotes'] as string[], 'safeNotes'));
  }

  if (!isStrategyCandidateEvaluationFixtureSerializable(fixture)) {
    issues.push(makeIssue('NOT_SERIALIZABLE', 'Fixture must be JSON-serializable.', 'root'));
  }

  if (issues.length === 0) {
    const normalized = normalizeStrategyCandidateEvaluationFixture(
      fixture as unknown as StrategyCandidateEvaluationFixture,
    );
    if (normalized.summary.name !== normalized.name) {
      issues.push(
        makeIssue(
          'NAME_MISMATCH',
          'summary.name must match normalized fixture name.',
          'summary.name',
        ),
      );
    }
    if (normalized.summary.kind !== normalized.kind) {
      issues.push(
        makeIssue(
          'KIND_MISMATCH',
          'summary.kind must match normalized fixture kind.',
          'summary.kind',
        ),
      );
    }
  }

  return { valid: issues.length === 0, issues };
}

export function validateStrategyCandidateSafety(fixture: unknown): StrategyCandidateSafetyResult {
  if (fixture === null || fixture === undefined) {
    return {
      safe: false,
      violations: ['Strategy candidate safety validation requires a non-null object.'],
    };
  }

  const violations: string[] = [];
  const allStrings = collectStrings(fixture);

  for (const str of allStrings) {
    if (SOLANA_ADDRESS_PATTERN.test(str)) {
      violations.push(`Possible Solana address detected: "${str.slice(0, 20)}..."`);
    }
    if (TX_HASH_PATTERN.test(str)) {
      violations.push(`Possible transaction hash detected: "${str.slice(0, 20)}..."`);
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
      violations.push(`Possible secret detected: "${str.slice(0, 20)}..."`);
    }
    if (LIVE_DATA_PATTERN.test(str)) {
      violations.push(`Live-data claim detected: "${str.slice(0, 40)}..."`);
    }
    if (EXECUTION_PATTERN.test(str)) {
      violations.push(`Execution/trading wording detected: "${str.slice(0, 40)}..."`);
    }
    if (ADVICE_PATTERN.test(str)) {
      violations.push(`Advice/signal wording detected: "${str.slice(0, 40)}..."`);
    }
    if (REAL_PNL_PATTERN.test(str)) {
      violations.push(`Real PnL/balance/order wording detected: "${str.slice(0, 40)}..."`);
    }
    if (REAL_SCORE_RANK_PATTERN.test(str)) {
      violations.push(`Real scoring/ranking wording detected: "${str.slice(0, 40)}..."`);
    }
  }

  return {
    safe: violations.length === 0,
    violations: [...new Set(violations)].sort((left, right) => left.localeCompare(right)),
  };
}
