import {
  STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES,
} from '@sonic/offline-intelligence';
import type {
  StrategyReviewDashboardFixture,
  StrategyReviewSafetyResult,
  StrategyReviewValidationIssue,
  StrategyReviewValidationResult,
} from './types.js';
import {
  isStrategyReviewDashboardFixtureSerializable,
  isValidStrategyReviewDashboardFixtureKind,
  isValidStrategyReviewDashboardFixtureName,
  isValidStrategyReviewGeneratedAt,
  isValidStrategyReviewSource,
} from './normalization.js';
import { PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT } from './types.js';

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
  /\b(?:live data|real-time|solana rpc|provider api|jito|mev|mempool|yellowstone|geyser|websocket|fetch|axios)\b/i;
const EXECUTION_PATTERN =
  /\b(?:execute|execution control|sign transaction|send transaction|swap|buy|sell|order|fill|position|wallet connect)\b/i;
const ADVICE_PATTERN = /\b(?:recommend|investment advice|trading signal|alpha|price target)\b/i;
const WALLET_ADDRESS_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;
const TX_HASH_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, out: string[] = []): readonly string[] {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach(entry => collectStrings(entry, out));
  } else if (isRecord(value)) {
    Object.values(value).forEach(entry => collectStrings(entry, out));
  }
  return out;
}

export function validateStrategyReviewDashboardFixture(
  input: unknown,
): StrategyReviewValidationResult {
  const issues: StrategyReviewValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('INVALID_INPUT', 'fixture', 'Fixture must be a non-null object.')],
    };
  }

  if (!isValidStrategyReviewDashboardFixtureName(input['name'])) {
    issues.push(issue('INVALID_NAME', 'name', `Unsupported fixture name: ${String(input['name'])}.`));
  }
  if (!isValidStrategyReviewDashboardFixtureKind(input['kind'])) {
    issues.push(issue('INVALID_KIND', 'kind', `Unsupported fixture kind: ${String(input['kind'])}.`));
  }
  if (typeof input['title'] !== 'string' || input['title'].trim() === '') {
    issues.push(issue('MISSING_TITLE', 'title', 'title must be a non-empty string.'));
  }
  if (typeof input['description'] !== 'string' || input['description'].trim() === '') {
    issues.push(issue('MISSING_DESCRIPTION', 'description', 'description must be a non-empty string.'));
  }

  if (!Array.isArray(input['matrixReferences']) || input['matrixReferences'].length === 0) {
    issues.push(
      issue('MISSING_MATRIX_REFERENCES', 'matrixReferences', 'matrixReferences must be a non-empty array.'),
    );
  } else {
    for (const reference of input['matrixReferences'] as unknown[]) {
      if (!isRecord(reference)) {
        issues.push(
          issue('INVALID_MATRIX_REFERENCE', 'matrixReferences', 'Each matrix reference must be an object.'),
        );
        continue;
      }
      if (
        !STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES.includes(
          reference['sourceMatrixFixtureName'] as never,
        )
      ) {
        issues.push(
          issue(
            'INVALID_SOURCE_MATRIX_NAME',
            'matrixReferences.sourceMatrixFixtureName',
            `Unsupported Phase 39 matrix reference: ${String(reference['sourceMatrixFixtureName'])}.`,
          ),
        );
      }
      if (
        !STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS.includes(
          reference['sourceMatrixFixtureKind'] as never,
        )
      ) {
        issues.push(
          issue(
            'INVALID_SOURCE_MATRIX_KIND',
            'matrixReferences.sourceMatrixFixtureKind',
            `Unsupported Phase 39 matrix kind: ${String(reference['sourceMatrixFixtureKind'])}.`,
          ),
        );
      }
      if (reference['sourcePhase'] !== 39) {
        issues.push(issue('INVALID_SOURCE_PHASE', 'matrixReferences.sourcePhase', 'sourcePhase must be 39.'));
      }
    }
  }

  if (!Array.isArray(input['panels']) || input['panels'].length === 0) {
    issues.push(issue('MISSING_PANELS', 'panels', 'panels must be a non-empty array.'));
  }

  if (!isRecord(input['summary'])) {
    issues.push(issue('MISSING_SUMMARY', 'summary', 'summary must be a non-null object.'));
  } else {
    const summary = input['summary'] as Record<string, unknown>;
    if (summary['phase'] !== 40) {
      issues.push(issue('INVALID_SUMMARY_PHASE', 'summary.phase', 'summary.phase must be 40.'));
    }
    if (summary['safeToDisplay'] !== true) {
      issues.push(issue('INVALID_SUMMARY_SAFE', 'summary.safeToDisplay', 'summary.safeToDisplay must be true.'));
    }
    if (summary['nonAdvisory'] !== true) {
      issues.push(issue('INVALID_SUMMARY_NON_ADVISORY', 'summary.nonAdvisory', 'summary.nonAdvisory must be true.'));
    }
    if (summary['generatedAt'] !== PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT) {
      issues.push(issue('INVALID_SUMMARY_GENERATED_AT', 'summary.generatedAt', 'summary.generatedAt is invalid.'));
    }
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('MISSING_META', 'meta', 'meta must be a non-null object.'));
  } else {
    const meta = input['meta'] as Record<string, unknown>;
    if (meta['phase'] !== 40) issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 40.'));
    if (!isValidStrategyReviewGeneratedAt(meta['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt is invalid.'));
    }
    if (!isValidStrategyReviewSource(meta['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'meta.source is invalid.'));
    }
    if (meta['liveData'] !== false) issues.push(issue('META_LIVE_DATA', 'meta.liveData', 'meta.liveData must be false.'));
    if (meta['realUiRendering'] !== false) issues.push(issue('META_REAL_UI_RENDERING', 'meta.realUiRendering', 'meta.realUiRendering must be false.'));
    if (meta['realScoring'] !== false) issues.push(issue('META_REAL_SCORING', 'meta.realScoring', 'meta.realScoring must be false.'));
    if (meta['realRanking'] !== false) issues.push(issue('META_REAL_RANKING', 'meta.realRanking', 'meta.realRanking must be false.'));
    if (meta['recommendations'] !== false) issues.push(issue('META_RECOMMENDATIONS', 'meta.recommendations', 'meta.recommendations must be false.'));
    if (meta['tradingSignals'] !== false) issues.push(issue('META_TRADING_SIGNALS', 'meta.tradingSignals', 'meta.tradingSignals must be false.'));
    if (meta['execution'] !== false) issues.push(issue('META_EXECUTION', 'meta.execution', 'meta.execution must be false.'));
    if (meta['solanaRpc'] !== false) issues.push(issue('META_SOLANA_RPC', 'meta.solanaRpc', 'meta.solanaRpc must be false.'));
    if (meta['externalNetwork'] !== false) issues.push(issue('META_EXTERNAL_NETWORK', 'meta.externalNetwork', 'meta.externalNetwork must be false.'));
    if (meta['persistence'] !== false) issues.push(issue('META_PERSISTENCE', 'meta.persistence', 'meta.persistence must be false.'));
    if (meta['fileExport'] !== false) issues.push(issue('META_FILE_EXPORT', 'meta.fileExport', 'meta.fileExport must be false.'));
    if (meta['investmentAdvice'] !== false) issues.push(issue('META_INVESTMENT_ADVICE', 'meta.investmentAdvice', 'meta.investmentAdvice must be false.'));
  }

  if (!isRecord(input['safetyBoundary'])) {
    issues.push(issue('MISSING_SAFETY_BOUNDARY', 'safetyBoundary', 'safetyBoundary must be a non-null object.'));
  }

  if (!isStrategyReviewDashboardFixtureSerializable(input)) {
    issues.push(issue('NOT_SERIALIZABLE', 'fixture', 'Fixture must be JSON serializable.'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateStrategyReviewDashboardSafety(input: unknown): StrategyReviewSafetyResult {
  if (!isRecord(input)) {
    return { safe: false, violations: ['Input must be a non-null object.'] };
  }

  const fixture = input as Partial<StrategyReviewDashboardFixture>;
  const violations: string[] = [];

  collectStrings(input).forEach(text => {
    if (EMAIL_PATTERN.test(text)) violations.push(`PII_EMAIL: ${text}`);
    if (PHONE_PATTERN.test(text)) violations.push(`PII_PHONE: ${text}`);
    if (STREET_PATTERN.test(text)) violations.push(`PII_ADDRESS: ${text}`);
    if (URL_PATTERN.test(text)) violations.push(`URL_PRESENT: ${text}`);
    if (STACK_TRACE_PATTERN.test(text)) violations.push(`STACK_TRACE: ${text}`);
    if (LOCAL_PATH_PATTERN.test(text)) violations.push(`LOCAL_PATH: ${text}`);
    if (SECRET_PATTERN.test(text)) violations.push(`SECRET_PATTERN: ${text}`);
    if (LIVE_DATA_PATTERN.test(text)) violations.push(`LIVE_DATA_PATTERN: ${text}`);
    if (EXECUTION_PATTERN.test(text)) violations.push(`EXECUTION_PATTERN: ${text}`);
    if (ADVICE_PATTERN.test(text)) violations.push(`ADVICE_PATTERN: ${text}`);
    if (WALLET_ADDRESS_PATTERN.test(text)) violations.push(`WALLET_ADDRESS_PATTERN: ${text}`);
    if (TX_HASH_PATTERN.test(text)) violations.push(`TX_HASH_PATTERN: ${text}`);
  });

  const meta = fixture.meta;
  if (!meta) {
    violations.push('Missing meta.');
  } else {
    if (meta.liveData !== false) violations.push('meta.liveData must be false.');
    if (meta.realUiRendering !== false) violations.push('meta.realUiRendering must be false.');
    if (meta.realScoring !== false) violations.push('meta.realScoring must be false.');
    if (meta.realRanking !== false) violations.push('meta.realRanking must be false.');
    if (meta.recommendations !== false) violations.push('meta.recommendations must be false.');
    if (meta.tradingSignals !== false) violations.push('meta.tradingSignals must be false.');
    if (meta.execution !== false) violations.push('meta.execution must be false.');
    if (meta.solanaRpc !== false) violations.push('meta.solanaRpc must be false.');
    if (meta.externalNetwork !== false) violations.push('meta.externalNetwork must be false.');
    if (meta.persistence !== false) violations.push('meta.persistence must be false.');
    if (meta.fileExport !== false) violations.push('meta.fileExport must be false.');
    if (meta.investmentAdvice !== false) violations.push('meta.investmentAdvice must be false.');
  }

  const safety = fixture.safetyBoundary;
  if (!safety) {
    violations.push('Missing safetyBoundary.');
  } else {
    if (safety.noRealUiRendering !== true) violations.push('safetyBoundary.noRealUiRendering must be true.');
    if (safety.noRealScoring !== true) violations.push('safetyBoundary.noRealScoring must be true.');
    if (safety.noRealRanking !== true) violations.push('safetyBoundary.noRealRanking must be true.');
    if (safety.noRecommendations !== true) violations.push('safetyBoundary.noRecommendations must be true.');
    if (safety.noTradingSignals !== true) violations.push('safetyBoundary.noTradingSignals must be true.');
    if (safety.noExecution !== true) violations.push('safetyBoundary.noExecution must be true.');
    if (safety.noExternalNetwork !== true) violations.push('safetyBoundary.noExternalNetwork must be true.');
    if (safety.noPersistence !== true) violations.push('safetyBoundary.noPersistence must be true.');
    if (safety.noFileExport !== true) violations.push('safetyBoundary.noFileExport must be true.');
    if (safety.noInvestmentAdvice !== true) violations.push('safetyBoundary.noInvestmentAdvice must be true.');
  }

  return { safe: violations.length === 0, violations: [...new Set(violations)] };
}
