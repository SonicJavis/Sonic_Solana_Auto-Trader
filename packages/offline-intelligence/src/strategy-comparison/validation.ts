/**
 * Phase 39 — Strategy Comparison Matrix Fixtures v1: validation and safety.
 */

import {
  PHASE_39_STRATEGY_COMPARISON_GENERATED_AT,
  PHASE_39_STRATEGY_COMPARISON_SOURCE,
  STRATEGY_COMPARISON_CRITERION_CODES,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES,
  type StrategyComparisonMatrixFixture,
  type StrategyComparisonSafetyResult,
  type StrategyComparisonValidationIssue,
  type StrategyComparisonValidationResult,
} from './types.js';
import { isStrategyComparisonMatrixFixtureSerializable } from './normalization.js';
import {
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS,
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES,
} from '../strategy-candidates/types.js';

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
  /\b(?:recommend|investment advice|trading signal|invest now|buy now|sell now|alpha|guaranteed)\b/i;
const WALLET_PATTERN = /\b(?:private key|seed phrase|keypair|wallet connect|connect wallet)\b/i;
const REAL_PNL_PATTERN =
  /\b(?:real pnl|actual pnl|real profit|real loss|real balance|real fill|real order)\b/i;
const DOWNLOAD_PATTERN = /\b(?:download|export file|save file|createObjectURL|writeFile|writeFileSync)\b/i;
const WALLET_ADDRESS_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;

function checkText(text: string): readonly string[] {
  const hits: string[] = [];
  if (EMAIL_PATTERN.test(text)) hits.push('email-address');
  if (PHONE_PATTERN.test(text)) hits.push('phone-number');
  if (STREET_PATTERN.test(text)) hits.push('street-address');
  if (URL_PATTERN.test(text)) hits.push('url');
  if (STACK_TRACE_PATTERN.test(text)) hits.push('stack-trace');
  if (LOCAL_PATH_PATTERN.test(text)) hits.push('local-path');
  if (SECRET_PATTERN.test(text)) hits.push('secret');
  if (LIVE_DATA_PATTERN.test(text)) hits.push('live-data');
  if (EXECUTION_PATTERN.test(text)) hits.push('execution-pattern');
  if (ADVICE_PATTERN.test(text)) hits.push('advice-pattern');
  if (WALLET_PATTERN.test(text)) hits.push('wallet-pattern');
  if (REAL_PNL_PATTERN.test(text)) hits.push('real-pnl');
  if (DOWNLOAD_PATTERN.test(text)) hits.push('download-pattern');
  if (WALLET_ADDRESS_PATTERN.test(text)) hits.push('wallet-address');
  return hits;
}

function allStrings(fixture: StrategyComparisonMatrixFixture): readonly string[] {
  const strings: string[] = [
    fixture.name,
    fixture.kind,
    fixture.title,
    fixture.description,
    ...fixture.safeNotes,
    ...fixture.meta.notes,
    ...fixture.safetyBoundary.notes,
    ...fixture.summary.notes,
  ];
  for (const ref of fixture.candidateReferences) {
    strings.push(ref.candidateId, ref.candidateTitle, ...ref.notes);
  }
  for (const criterion of fixture.criteria) {
    strings.push(criterion.code, criterion.label, criterion.description, ...criterion.notes);
  }
  for (const row of fixture.rows) {
    strings.push(...row.rowNotes);
    for (const cell of row.cells) {
      strings.push(cell.rationale);
    }
  }
  for (const col of fixture.columns) {
    strings.push(...col.columnNotes);
  }
  return strings.filter(Boolean);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning',
): StrategyComparisonValidationIssue {
  return { code, field, message, severity };
}

export function validateStrategyComparisonMatrixFixture(
  input: unknown,
): StrategyComparisonValidationResult {
  const issues: StrategyComparisonValidationIssue[] = [];

  if (input === null || typeof input !== 'object') {
    return {
      valid: false,
      issues: [issue('INVALID_INPUT', 'fixture', 'Input must be a non-null object.', 'error')],
    };
  }

  const fixture = input as Record<string, unknown>;

  if (!fixture['name'] || typeof fixture['name'] !== 'string') {
    issues.push(issue('MISSING_NAME', 'name', 'name must be a non-empty string.', 'error'));
  } else if (!(STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES as readonly string[]).includes(fixture['name'] as string)) {
    issues.push(
      issue('INVALID_NAME', 'name', `name "${String(fixture['name'])}" is not a valid fixture name.`, 'error'),
    );
  }

  if (!fixture['kind'] || typeof fixture['kind'] !== 'string') {
    issues.push(issue('MISSING_KIND', 'kind', 'kind must be a non-empty string.', 'error'));
  } else if (!(STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS as readonly string[]).includes(fixture['kind'] as string)) {
    issues.push(
      issue('INVALID_KIND', 'kind', `kind "${String(fixture['kind'])}" is not a valid fixture kind.`, 'error'),
    );
  }

  if (!fixture['title'] || typeof fixture['title'] !== 'string') {
    issues.push(issue('MISSING_TITLE', 'title', 'title must be a non-empty string.', 'error'));
  }

  if (!fixture['description'] || typeof fixture['description'] !== 'string') {
    issues.push(issue('MISSING_DESCRIPTION', 'description', 'description must be a non-empty string.', 'error'));
  }

  if (!Array.isArray(fixture['candidateReferences'])) {
    issues.push(
      issue('MISSING_CANDIDATES', 'candidateReferences', 'candidateReferences must be an array.', 'error'),
    );
  } else if ((fixture['candidateReferences'] as unknown[]).length === 0) {
    issues.push(
      issue('EMPTY_CANDIDATES', 'candidateReferences', 'candidateReferences must not be empty.', 'error'),
    );
  } else {
    for (const ref of fixture['candidateReferences'] as unknown[]) {
      if (ref === null || typeof ref !== 'object') {
        issues.push(
          issue('INVALID_CANDIDATE_REF', 'candidateReferences', 'Each candidate reference must be a non-null object.', 'error'),
        );
        continue;
      }
      const r = ref as Record<string, unknown>;
      if (
        !r['candidateFixtureName'] ||
        !(STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES as readonly string[]).includes(
          r['candidateFixtureName'] as string,
        )
      ) {
        issues.push(
          issue(
            'INVALID_CANDIDATE_NAME',
            'candidateReferences.candidateFixtureName',
            `candidateFixtureName "${String(r['candidateFixtureName'])}" is not a valid Phase 38 fixture name.`,
            'error',
          ),
        );
      }
      if (
        !r['candidateFixtureKind'] ||
        !(STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS as readonly string[]).includes(
          r['candidateFixtureKind'] as string,
        )
      ) {
        issues.push(
          issue(
            'INVALID_CANDIDATE_KIND',
            'candidateReferences.candidateFixtureKind',
            `candidateFixtureKind "${String(r['candidateFixtureKind'])}" is not a valid Phase 38 fixture kind.`,
            'error',
          ),
        );
      }
    }
  }

  if (!Array.isArray(fixture['criteria'])) {
    issues.push(issue('MISSING_CRITERIA', 'criteria', 'criteria must be an array.', 'error'));
  } else if ((fixture['criteria'] as unknown[]).length === 0) {
    issues.push(issue('EMPTY_CRITERIA', 'criteria', 'criteria must not be empty.', 'error'));
  } else {
    for (const crit of fixture['criteria'] as unknown[]) {
      if (crit === null || typeof crit !== 'object') {
        issues.push(issue('INVALID_CRITERION', 'criteria', 'Each criterion must be a non-null object.', 'error'));
        continue;
      }
      const c = crit as Record<string, unknown>;
      if (!c['code'] || !(STRATEGY_COMPARISON_CRITERION_CODES as readonly string[]).includes(c['code'] as string)) {
        issues.push(
          issue(
            'INVALID_CRITERION_CODE',
            'criteria.code',
            `criterion code "${String(c['code'])}" is not a valid criterion code.`,
            'error',
          ),
        );
      }
    }
  }

  if (!Array.isArray(fixture['rows'])) {
    issues.push(issue('MISSING_ROWS', 'rows', 'rows must be an array.', 'error'));
  }

  if (!Array.isArray(fixture['columns'])) {
    issues.push(issue('MISSING_COLUMNS', 'columns', 'columns must be an array.', 'error'));
  }

  // Validate meta
  const meta = fixture['meta'] as Record<string, unknown> | null | undefined;
  if (!meta || typeof meta !== 'object') {
    issues.push(issue('MISSING_META', 'meta', 'meta must be a non-null object.', 'error'));
  } else {
    if (meta['phase'] !== 39) {
      issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 39.', 'error'));
    }
    if (meta['generatedAt'] !== PHASE_39_STRATEGY_COMPARISON_GENERATED_AT) {
      issues.push(
        issue(
          'INVALID_META_GENERATED_AT',
          'meta.generatedAt',
          `meta.generatedAt must be "${PHASE_39_STRATEGY_COMPARISON_GENERATED_AT}".`,
          'error',
        ),
      );
    }
    if (meta['source'] !== PHASE_39_STRATEGY_COMPARISON_SOURCE) {
      issues.push(
        issue(
          'INVALID_META_SOURCE',
          'meta.source',
          `meta.source must be "${PHASE_39_STRATEGY_COMPARISON_SOURCE}".`,
          'error',
        ),
      );
    }
    if (meta['liveData'] !== false) {
      issues.push(issue('META_LIVE_DATA', 'meta.liveData', 'meta.liveData must be false.', 'error'));
    }
    if (meta['realScoring'] !== false) {
      issues.push(issue('META_REAL_SCORING', 'meta.realScoring', 'meta.realScoring must be false.', 'error'));
    }
    if (meta['realRanking'] !== false) {
      issues.push(issue('META_REAL_RANKING', 'meta.realRanking', 'meta.realRanking must be false.', 'error'));
    }
    if (meta['execution'] !== false) {
      issues.push(issue('META_EXECUTION', 'meta.execution', 'meta.execution must be false.', 'error'));
    }
    if (meta['externalNetwork'] !== false) {
      issues.push(
        issue('META_EXTERNAL_NETWORK', 'meta.externalNetwork', 'meta.externalNetwork must be false.', 'error'),
      );
    }
    if (meta['fixtureOnly'] !== true) {
      issues.push(issue('META_FIXTURE_ONLY', 'meta.fixtureOnly', 'meta.fixtureOnly must be true.', 'error'));
    }
    if (meta['syntheticOnly'] !== true) {
      issues.push(issue('META_SYNTHETIC_ONLY', 'meta.syntheticOnly', 'meta.syntheticOnly must be true.', 'error'));
    }
    if (meta['deterministic'] !== true) {
      issues.push(issue('META_DETERMINISTIC', 'meta.deterministic', 'meta.deterministic must be true.', 'error'));
    }
  }

  if (!isStrategyComparisonMatrixFixtureSerializable(input)) {
    issues.push(issue('NOT_SERIALIZABLE', 'fixture', 'Fixture must be JSON-serializable.', 'error'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateStrategyComparisonMatrixSafety(
  input: unknown,
): StrategyComparisonSafetyResult {
  if (input === null || typeof input !== 'object') {
    return { safe: false, violations: ['Input is not a non-null object.'] };
  }

  const fixture = input as Partial<StrategyComparisonMatrixFixture>;
  const violations: string[] = [];

  let allText: readonly string[] = [];
  try {
    allText = allStrings(fixture as StrategyComparisonMatrixFixture);
  } catch {
    violations.push('Could not extract strings from fixture for safety check.');
    return { safe: false, violations };
  }

  for (const text of allText) {
    const hits = checkText(text);
    for (const hit of hits) {
      violations.push(`Safety pattern "${hit}" matched in fixture text: "${text.slice(0, 60)}"`);
    }
  }

  const meta = fixture.meta;
  if (!meta) {
    violations.push('Missing meta field.');
  } else {
    if (meta.liveData !== false) violations.push('meta.liveData must be false.');
    if (meta.realScoring !== false) violations.push('meta.realScoring must be false.');
    if (meta.realRanking !== false) violations.push('meta.realRanking must be false.');
    if (meta.execution !== false) violations.push('meta.execution must be false.');
    if (meta.externalNetwork !== false) violations.push('meta.externalNetwork must be false.');
    if (meta.persistence !== false) violations.push('meta.persistence must be false.');
    if (meta.fileExport !== false) violations.push('meta.fileExport must be false.');
    if (meta.nonAdvisory !== true) violations.push('meta.nonAdvisory must be true.');
    if (meta.nonAccusatory !== true) violations.push('meta.nonAccusatory must be true.');
  }

  const summary = fixture.summary;
  if (summary) {
    if (summary.liveData !== false) violations.push('summary.liveData must be false.');
    if (summary.realScoring !== false) violations.push('summary.realScoring must be false.');
    if (summary.realRanking !== false) violations.push('summary.realRanking must be false.');
    if (summary.execution !== false) violations.push('summary.execution must be false.');
    if (summary.nonAdvisory !== true) violations.push('summary.nonAdvisory must be true.');
    if (summary.nonAccusatory !== true) violations.push('summary.nonAccusatory must be true.');
    if (summary.safeToDisplay !== true) violations.push('summary.safeToDisplay must be true.');
  }

  const safety = fixture.safetyBoundary;
  if (!safety) {
    violations.push('Missing safetyBoundary field.');
  } else {
    if (safety.noRealScoring !== true) violations.push('safetyBoundary.noRealScoring must be true.');
    if (safety.noRealRanking !== true) violations.push('safetyBoundary.noRealRanking must be true.');
    if (safety.noLiveTrading !== true) violations.push('safetyBoundary.noLiveTrading must be true.');
    if (safety.noExecution !== true) violations.push('safetyBoundary.noExecution must be true.');
    if (safety.noInvestmentAdvice !== true) violations.push('safetyBoundary.noInvestmentAdvice must be true.');
    if (safety.noTradingSignals !== true) violations.push('safetyBoundary.noTradingSignals must be true.');
    if (safety.noRecommendations !== true) violations.push('safetyBoundary.noRecommendations must be true.');
  }

  return { safe: violations.length === 0, violations };
}
