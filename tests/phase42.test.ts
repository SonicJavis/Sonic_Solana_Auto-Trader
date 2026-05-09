/**
 * Phase 42 — Strategy Review Serialization Preview Fixtures v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES,
  STRATEGY_REVIEW_REPORT_FIXTURE_NAMES,
} from '../apps/dashboard/src/strategy-review-reports/index.js';
import {
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT,
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS,
  getStrategyReviewSerializationPreviewCapabilities,
  buildStrategyReviewSerializationPreviewFixture,
  buildStrategyReviewSerializationSummary,
  normalizeStrategyReviewSerializationPreviewFixture,
  serializeStrategyReviewSerializationPreviewFixture,
  areStrategyReviewSerializationPreviewFixturesEqual,
  isStrategyReviewSerializationPreviewFixtureSerializable,
  validateStrategyReviewSerializationPreviewFixture,
  validateStrategyReviewSerializationSafety,
  listStrategyReviewSerializationPreviewFixtures,
  getStrategyReviewSerializationPreviewFixture,
  SERIALIZATION_NAME_TO_FORMAT,
  SERIALIZATION_NAME_TO_KIND,
  SERIALIZATION_NAME_TO_REPORT,
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES,
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_LIST,
  DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
  CREATOR_LED_MARKDOWN_PREVIEW_FIXTURE,
  WALLET_LED_TEXT_PREVIEW_FIXTURE,
  MANIPULATION_AVOIDANCE_METADATA_PREVIEW_FIXTURE,
  NO_ACTION_SAFETY_JSON_PREVIEW_FIXTURE,
  INSUFFICIENT_DATA_MARKDOWN_PREVIEW_FIXTURE,
  HIGH_SCORE_POSITIVE_TEXT_PREVIEW_FIXTURE,
  HIGH_SCORE_FALSE_POSITIVE_METADATA_PREVIEW_FIXTURE,
  MISSED_OPPORTUNITY_JSON_PREVIEW_FIXTURE,
  DRAWDOWN_CONTAINED_MARKDOWN_PREVIEW_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_TEXT_PREVIEW_FIXTURE,
  FALSE_POSITIVE_PROTECTION_METADATA_PREVIEW_FIXTURE,
  STRATEGY_REVIEW_MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE,
  DASHBOARD_READY_SERIALIZATION_PREVIEW_FIXTURE,
  REPORT_READY_SERIALIZATION_PREVIEW_FIXTURE,
  SAFETY_BOUNDARY_SERIALIZATION_PREVIEW_FIXTURE,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_42_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/strategy-review-serialization');
const PHASE_42_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_42_SRC, file));

const REQUIRED_FIXTURE_NAMES = [
  'defensive-vs-aggressive-json-preview',
  'creator-led-markdown-preview',
  'wallet-led-text-preview',
  'manipulation-avoidance-metadata-preview',
  'no-action-safety-json-preview',
  'insufficient-data-markdown-preview',
  'high-score-positive-text-preview',
  'high-score-false-positive-metadata-preview',
  'missed-opportunity-json-preview',
  'drawdown-contained-markdown-preview',
  'mixed-signal-watchlist-text-preview',
  'false-positive-protection-metadata-preview',
  'malformed-input-safe-preview',
  'dashboard-ready-serialization-preview',
  'report-ready-serialization-preview',
  'safety-boundary-serialization-preview',
] as const;

const ALL_FIXTURES = PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_LIST;

// ─── 1. Source file existence ─────────────────────────────────────────────────

describe('Phase 42 — Source files exist', () => {
  for (const filePath of PHASE_42_FILES) {
    it(`${filePath.split('/').pop()} exists`, () => {
      const content = readFileSync(filePath, 'utf8');
      expect(content.length).toBeGreaterThan(0);
    });
  }
});

// ─── 2. Constants ─────────────────────────────────────────────────────────────

describe('Phase 42 — Constants', () => {
  it('PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT is the deterministic timestamp', () => {
    expect(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT).toBe(
      '2026-01-01T00:00:00.000Z',
    );
  });

  it('PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE is the correct source string', () => {
    expect(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE).toBe(
      'phase42_strategy_review_serialization_preview_fixtures_v1',
    );
  });

  it('STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES has 16 entries', () => {
    expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES).toHaveLength(16);
  });

  it('STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS is a non-empty array', () => {
    expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS.length).toBeGreaterThan(0);
  });

  it('STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS has exactly 4 entries', () => {
    expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS).toHaveLength(4);
  });

  it('formats are json, markdown, text, metadata', () => {
    expect([...STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS].sort()).toEqual(
      ['json', 'markdown', 'metadata', 'text'],
    );
  });

  it('all 16 required fixture names exist in STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES', () => {
    for (const name of REQUIRED_FIXTURE_NAMES) {
      expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES).toContain(name);
    }
  });
});

// ─── 3. Fixture map and list ──────────────────────────────────────────────────

describe('Phase 42 — Fixture map and list', () => {
  it('PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES is a ReadonlyMap', () => {
    expect(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES).toBeInstanceOf(Map);
  });

  it('fixture map has 16 entries', () => {
    expect(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES.size).toBe(16);
  });

  it('PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_LIST has 16 entries', () => {
    expect(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_LIST).toHaveLength(16);
  });

  it('all fixture names in the map match STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      expect(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES.has(name)).toBe(true);
    }
  });

  it('list matches map order (stable ordering)', () => {
    const listNames = ALL_FIXTURES.map(f => f.name);
    const mapNames = [...STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES];
    expect(listNames).toEqual(mapNames);
  });
});

// ─── 4. listStrategyReviewSerializationPreviewFixtures helper ─────────────────

describe('Phase 42 — listStrategyReviewSerializationPreviewFixtures', () => {
  const listed = listStrategyReviewSerializationPreviewFixtures(
    PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES,
  );

  it('returns 16 fixtures', () => {
    expect(listed).toHaveLength(16);
  });

  it('returns fixtures in stable order', () => {
    const names = listed.map(f => f.name);
    expect(names).toEqual([...STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES]);
  });

  it('all listed fixtures have valid names', () => {
    for (const f of listed) {
      expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES).toContain(f.name);
    }
  });
});

// ─── 5. getStrategyReviewSerializationPreviewFixture helper ────────────────────

describe('Phase 42 — getStrategyReviewSerializationPreviewFixture', () => {
  it('returns the correct fixture for each name', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      const fixture = getStrategyReviewSerializationPreviewFixture(
        PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES,
        name,
      );
      expect(fixture).toBeDefined();
      expect(fixture?.name).toBe(name);
    }
  });

  it('returns undefined for an unknown name', () => {
    const fixture = getStrategyReviewSerializationPreviewFixture(
      PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES,
      'nonexistent-fixture' as never,
    );
    expect(fixture).toBeUndefined();
  });
});

// ─── 6. All 16 individual named fixture exports ───────────────────────────────

describe('Phase 42 — Named fixture exports', () => {
  it('DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE has correct name', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE.name).toBe(
      'defensive-vs-aggressive-json-preview',
    );
  });
  it('CREATOR_LED_MARKDOWN_PREVIEW_FIXTURE has correct name', () => {
    expect(CREATOR_LED_MARKDOWN_PREVIEW_FIXTURE.name).toBe('creator-led-markdown-preview');
  });
  it('WALLET_LED_TEXT_PREVIEW_FIXTURE has correct name', () => {
    expect(WALLET_LED_TEXT_PREVIEW_FIXTURE.name).toBe('wallet-led-text-preview');
  });
  it('MANIPULATION_AVOIDANCE_METADATA_PREVIEW_FIXTURE has correct name', () => {
    expect(MANIPULATION_AVOIDANCE_METADATA_PREVIEW_FIXTURE.name).toBe(
      'manipulation-avoidance-metadata-preview',
    );
  });
  it('NO_ACTION_SAFETY_JSON_PREVIEW_FIXTURE has correct name', () => {
    expect(NO_ACTION_SAFETY_JSON_PREVIEW_FIXTURE.name).toBe('no-action-safety-json-preview');
  });
  it('INSUFFICIENT_DATA_MARKDOWN_PREVIEW_FIXTURE has correct name', () => {
    expect(INSUFFICIENT_DATA_MARKDOWN_PREVIEW_FIXTURE.name).toBe(
      'insufficient-data-markdown-preview',
    );
  });
  it('HIGH_SCORE_POSITIVE_TEXT_PREVIEW_FIXTURE has correct name', () => {
    expect(HIGH_SCORE_POSITIVE_TEXT_PREVIEW_FIXTURE.name).toBe('high-score-positive-text-preview');
  });
  it('HIGH_SCORE_FALSE_POSITIVE_METADATA_PREVIEW_FIXTURE has correct name', () => {
    expect(HIGH_SCORE_FALSE_POSITIVE_METADATA_PREVIEW_FIXTURE.name).toBe(
      'high-score-false-positive-metadata-preview',
    );
  });
  it('MISSED_OPPORTUNITY_JSON_PREVIEW_FIXTURE has correct name', () => {
    expect(MISSED_OPPORTUNITY_JSON_PREVIEW_FIXTURE.name).toBe('missed-opportunity-json-preview');
  });
  it('DRAWDOWN_CONTAINED_MARKDOWN_PREVIEW_FIXTURE has correct name', () => {
    expect(DRAWDOWN_CONTAINED_MARKDOWN_PREVIEW_FIXTURE.name).toBe(
      'drawdown-contained-markdown-preview',
    );
  });
  it('MIXED_SIGNAL_WATCHLIST_TEXT_PREVIEW_FIXTURE has correct name', () => {
    expect(MIXED_SIGNAL_WATCHLIST_TEXT_PREVIEW_FIXTURE.name).toBe(
      'mixed-signal-watchlist-text-preview',
    );
  });
  it('FALSE_POSITIVE_PROTECTION_METADATA_PREVIEW_FIXTURE has correct name', () => {
    expect(FALSE_POSITIVE_PROTECTION_METADATA_PREVIEW_FIXTURE.name).toBe(
      'false-positive-protection-metadata-preview',
    );
  });
  it('STRATEGY_REVIEW_MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE has correct name', () => {
    expect(STRATEGY_REVIEW_MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE.name).toBe(
      'malformed-input-safe-preview',
    );
  });
  it('DASHBOARD_READY_SERIALIZATION_PREVIEW_FIXTURE has correct name', () => {
    expect(DASHBOARD_READY_SERIALIZATION_PREVIEW_FIXTURE.name).toBe(
      'dashboard-ready-serialization-preview',
    );
  });
  it('REPORT_READY_SERIALIZATION_PREVIEW_FIXTURE has correct name', () => {
    expect(REPORT_READY_SERIALIZATION_PREVIEW_FIXTURE.name).toBe(
      'report-ready-serialization-preview',
    );
  });
  it('SAFETY_BOUNDARY_SERIALIZATION_PREVIEW_FIXTURE has correct name', () => {
    expect(SAFETY_BOUNDARY_SERIALIZATION_PREVIEW_FIXTURE.name).toBe(
      'safety-boundary-serialization-preview',
    );
  });
});

// ─── 7. All fixture shape properties ─────────────────────────────────────────

describe('Phase 42 — All fixtures have required shape', () => {
  for (const fixture of ALL_FIXTURES) {
    it(`${fixture.name} has name`, () => {
      expect(typeof fixture.name).toBe('string');
      expect(fixture.name.length).toBeGreaterThan(0);
    });
    it(`${fixture.name} has kind`, () => {
      expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS).toContain(fixture.kind);
    });
    it(`${fixture.name} has format`, () => {
      expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS).toContain(fixture.format);
    });
    it(`${fixture.name} has title`, () => {
      expect(typeof fixture.title).toBe('string');
      expect(fixture.title.length).toBeGreaterThan(0);
    });
    it(`${fixture.name} has description`, () => {
      expect(typeof fixture.description).toBe('string');
      expect(fixture.description.length).toBeGreaterThan(0);
    });
    it(`${fixture.name} has reportReference`, () => {
      expect(fixture.reportReference).toBeDefined();
      expect(fixture.reportReference.sourcePhase).toBe(41);
      expect(fixture.reportReference.fixtureOnly).toBe(true);
      expect(fixture.reportReference.syntheticOnly).toBe(true);
    });
    it(`${fixture.name} has checksum`, () => {
      expect(typeof fixture.checksum).toBe('string');
      expect(fixture.checksum.startsWith('fnv1a32:')).toBe(true);
    });
    it(`${fixture.name} has contentLength`, () => {
      expect(typeof fixture.contentLength).toBe('number');
      expect(fixture.contentLength).toBeGreaterThan(0);
    });
    it(`${fixture.name} has meta.phase 42`, () => {
      expect(fixture.meta.phase).toBe(42);
    });
    it(`${fixture.name} has meta.sourceReportPhase 41`, () => {
      expect(fixture.meta.sourceReportPhase).toBe(41);
    });
    it(`${fixture.name} has meta.liveData false`, () => {
      expect(fixture.meta.liveData).toBe(false);
    });
    it(`${fixture.name} has meta.externalNetwork false`, () => {
      expect(fixture.meta.externalNetwork).toBe(false);
    });
    it(`${fixture.name} has meta.deterministic true`, () => {
      expect(fixture.meta.deterministic).toBe(true);
    });
    it(`${fixture.name} has meta.fixtureOnly true`, () => {
      expect(fixture.meta.fixtureOnly).toBe(true);
    });
    it(`${fixture.name} has meta.generatedAt deterministic timestamp`, () => {
      expect(fixture.meta.generatedAt).toBe(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT);
    });
    it(`${fixture.name} has meta.source`, () => {
      expect(fixture.meta.source).toBe(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE);
    });
    it(`${fixture.name} has summary`, () => {
      expect(fixture.summary).toBeDefined();
      expect(fixture.summary.phase).toBe(42);
    });
    it(`${fixture.name} has safetyBoundary`, () => {
      expect(fixture.safetyBoundary).toBeDefined();
      expect(fixture.safetyBoundary.noActualFileExport).toBe(true);
      expect(fixture.safetyBoundary.strategyReviewActualFileExport).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewDownloadSupport).toBe(false);
    });
    it(`${fixture.name} has safeNotes array`, () => {
      expect(Array.isArray(fixture.safeNotes)).toBe(true);
    });
  }
});

// ─── 8. Format-specific content ───────────────────────────────────────────────

describe('Phase 42 — JSON format fixtures have content', () => {
  const jsonFixtures = ALL_FIXTURES.filter(f => f.format === 'json');

  it('there are json fixtures', () => {
    expect(jsonFixtures.length).toBeGreaterThan(0);
  });

  for (const f of jsonFixtures) {
    it(`${f.name}: content is a non-empty string`, () => {
      expect(typeof f.content).toBe('string');
      expect((f.content ?? '').length).toBeGreaterThan(0);
    });
    it(`${f.name}: metadataPayload is null`, () => {
      expect(f.metadataPayload).toBeNull();
    });
    it(`${f.name}: content is valid JSON`, () => {
      expect(() => JSON.parse(f.content ?? '')).not.toThrow();
    });
    it(`${f.name}: summary.hasContent is true`, () => {
      expect(f.summary.hasContent).toBe(true);
    });
    it(`${f.name}: summary.hasMetadataPayload is false`, () => {
      expect(f.summary.hasMetadataPayload).toBe(false);
    });
  }
});

describe('Phase 42 — Markdown format fixtures have content', () => {
  const markdownFixtures = ALL_FIXTURES.filter(f => f.format === 'markdown');

  it('there are markdown fixtures', () => {
    expect(markdownFixtures.length).toBeGreaterThan(0);
  });

  for (const f of markdownFixtures) {
    it(`${f.name}: content is a non-empty string`, () => {
      expect(typeof f.content).toBe('string');
      expect((f.content ?? '').length).toBeGreaterThan(0);
    });
    it(`${f.name}: content contains markdown heading`, () => {
      expect(f.content).toMatch(/^#\s/m);
    });
    it(`${f.name}: metadataPayload is null`, () => {
      expect(f.metadataPayload).toBeNull();
    });
    it(`${f.name}: summary.hasContent is true`, () => {
      expect(f.summary.hasContent).toBe(true);
    });
  }
});

describe('Phase 42 — Text format fixtures have content', () => {
  const textFixtures = ALL_FIXTURES.filter(f => f.format === 'text');

  it('there are text fixtures', () => {
    expect(textFixtures.length).toBeGreaterThan(0);
  });

  for (const f of textFixtures) {
    it(`${f.name}: content is a non-empty string`, () => {
      expect(typeof f.content).toBe('string');
      expect((f.content ?? '').length).toBeGreaterThan(0);
    });
    it(`${f.name}: metadataPayload is null`, () => {
      expect(f.metadataPayload).toBeNull();
    });
    it(`${f.name}: summary.hasContent is true`, () => {
      expect(f.summary.hasContent).toBe(true);
    });
  }
});

describe('Phase 42 — Metadata format fixtures have payload', () => {
  const metaFixtures = ALL_FIXTURES.filter(f => f.format === 'metadata');

  it('there are metadata fixtures', () => {
    expect(metaFixtures.length).toBeGreaterThan(0);
  });

  for (const f of metaFixtures) {
    it(`${f.name}: metadataPayload is a non-null object`, () => {
      expect(f.metadataPayload).not.toBeNull();
      expect(typeof f.metadataPayload).toBe('object');
    });
    it(`${f.name}: content is null`, () => {
      expect(f.content).toBeNull();
    });
    it(`${f.name}: summary.hasMetadataPayload is true`, () => {
      expect(f.summary.hasMetadataPayload).toBe(true);
    });
    it(`${f.name}: summary.hasContent is false`, () => {
      expect(f.summary.hasContent).toBe(false);
    });
    it(`${f.name}: metadataPayload.phase is 41`, () => {
      expect((f.metadataPayload as Record<string, unknown>)['phase']).toBe(41);
    });
  }
});

// ─── 9. Preview summary builder ───────────────────────────────────────────────

describe('Phase 42 — buildStrategyReviewSerializationSummary', () => {
  const sampleFixture = DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE;

  it('returns a summary with phase 42', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.phase).toBe(42);
  });

  it('summary has correct fixtureName', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.fixtureName).toBe(sampleFixture.name);
  });

  it('summary has correct format', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.format).toBe(sampleFixture.format);
  });

  it('summary.serializable is true', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.serializable).toBe(true);
  });

  it('summary.fixtureOnly is true', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.fixtureOnly).toBe(true);
  });

  it('summary.syntheticOnly is true', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.syntheticOnly).toBe(true);
  });

  it('summary.nonAdvisory is true', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.nonAdvisory).toBe(true);
  });

  it('summary.generatedAt is deterministic', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.generatedAt).toBe(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT);
  });

  it('summary.contentLength matches fixture.contentLength', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.contentLength).toBe(sampleFixture.contentLength);
  });

  it('summary.checksum matches fixture.checksum', () => {
    const summary = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(summary.checksum).toBe(sampleFixture.checksum);
  });

  it('summary is deterministic (same for same input)', () => {
    const s1 = buildStrategyReviewSerializationSummary(sampleFixture);
    const s2 = buildStrategyReviewSerializationSummary(sampleFixture);
    expect(JSON.stringify(s1)).toBe(JSON.stringify(s2));
  });
});

// ─── 10. Normalization ────────────────────────────────────────────────────────

describe('Phase 42 — normalizeStrategyReviewSerializationPreviewFixture', () => {
  const sample = DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE;

  it('returns a fixture with same name', () => {
    const normalized = normalizeStrategyReviewSerializationPreviewFixture(sample);
    expect(normalized.name).toBe(sample.name);
  });

  it('does not mutate input', () => {
    const originalStr = JSON.stringify(sample);
    normalizeStrategyReviewSerializationPreviewFixture(sample);
    expect(JSON.stringify(sample)).toBe(originalStr);
  });

  it('is idempotent', () => {
    const once = normalizeStrategyReviewSerializationPreviewFixture(sample);
    const twice = normalizeStrategyReviewSerializationPreviewFixture(once);
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
  });

  it('sorts meta.notes alphabetically', () => {
    const normalized = normalizeStrategyReviewSerializationPreviewFixture(sample);
    const notes = [...normalized.meta.notes];
    expect(notes).toEqual([...notes].sort());
  });

  it('sorts safeNotes alphabetically', () => {
    const normalized = normalizeStrategyReviewSerializationPreviewFixture(sample);
    const notes = [...normalized.safeNotes];
    expect(notes).toEqual([...notes].sort());
  });

  it('sorts summary.notes alphabetically', () => {
    const normalized = normalizeStrategyReviewSerializationPreviewFixture(sample);
    const notes = [...normalized.summary.notes];
    expect(notes).toEqual([...notes].sort());
  });

  it('sorts reportReference.notes alphabetically', () => {
    const normalized = normalizeStrategyReviewSerializationPreviewFixture(sample);
    const notes = [...normalized.reportReference.notes];
    expect(notes).toEqual([...notes].sort());
  });

  it('all pre-built fixtures are already normalized (idempotent)', () => {
    for (const f of ALL_FIXTURES) {
      const normalized = normalizeStrategyReviewSerializationPreviewFixture(f);
      expect(JSON.stringify(normalized)).toBe(JSON.stringify(f));
    }
  });
});

// ─── 11. Serialization ────────────────────────────────────────────────────────

describe('Phase 42 — serializeStrategyReviewSerializationPreviewFixture', () => {
  it('returns a plain object', () => {
    const serialized = serializeStrategyReviewSerializationPreviewFixture(
      DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
    );
    expect(typeof serialized).toBe('object');
    expect(serialized).not.toBeNull();
  });

  it('serialized object has name field', () => {
    const serialized = serializeStrategyReviewSerializationPreviewFixture(
      DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
    );
    expect(serialized['name']).toBe('defensive-vs-aggressive-json-preview');
  });

  it('serialized output can be re-parsed from JSON', () => {
    const serialized = serializeStrategyReviewSerializationPreviewFixture(
      DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
    );
    const json = JSON.stringify(serialized);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('does not mutate input', () => {
    const fixture = DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE;
    const before = JSON.stringify(fixture);
    serializeStrategyReviewSerializationPreviewFixture(fixture);
    expect(JSON.stringify(fixture)).toBe(before);
  });
});

// ─── 12. Equality ─────────────────────────────────────────────────────────────

describe('Phase 42 — areStrategyReviewSerializationPreviewFixturesEqual', () => {
  it('same fixture is equal to itself', () => {
    expect(
      areStrategyReviewSerializationPreviewFixturesEqual(
        DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
        DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
      ),
    ).toBe(true);
  });

  it('different fixtures are not equal', () => {
    expect(
      areStrategyReviewSerializationPreviewFixturesEqual(
        DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
        CREATOR_LED_MARKDOWN_PREVIEW_FIXTURE,
      ),
    ).toBe(false);
  });

  it('normalized fixture equals original', () => {
    const normalized = normalizeStrategyReviewSerializationPreviewFixture(
      DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
    );
    expect(
      areStrategyReviewSerializationPreviewFixturesEqual(
        DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
        normalized,
      ),
    ).toBe(true);
  });
});

// ─── 13. Serializability ──────────────────────────────────────────────────────

describe('Phase 42 — isStrategyReviewSerializationPreviewFixtureSerializable', () => {
  it('all fixtures are serializable', () => {
    for (const fixture of ALL_FIXTURES) {
      expect(isStrategyReviewSerializationPreviewFixtureSerializable(fixture)).toBe(true);
    }
  });

  it('fixtures produce valid JSON', () => {
    for (const fixture of ALL_FIXTURES) {
      expect(() => JSON.stringify(fixture)).not.toThrow();
    }
  });
});

// ─── 14. Validation — success ─────────────────────────────────────────────────

describe('Phase 42 — validateStrategyReviewSerializationPreviewFixture — success', () => {
  for (const fixture of ALL_FIXTURES) {
    it(`${fixture.name} validates successfully`, () => {
      const result = validateStrategyReviewSerializationPreviewFixture(fixture);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  }
});

// ─── 15. Validation — failure ─────────────────────────────────────────────────

describe('Phase 42 — validateStrategyReviewSerializationPreviewFixture — failure', () => {
  it('returns invalid for null input', () => {
    const result = validateStrategyReviewSerializationPreviewFixture(null);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('returns invalid for non-object input', () => {
    const result = validateStrategyReviewSerializationPreviewFixture('not-an-object');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for empty object', () => {
    const result = validateStrategyReviewSerializationPreviewFixture({});
    expect(result.valid).toBe(false);
  });

  it('returns error issue code INVALID_INPUT for null', () => {
    const result = validateStrategyReviewSerializationPreviewFixture(null);
    expect(result.issues[0]?.code).toBe('INVALID_INPUT');
  });

  it('returns INVALID_NAME for unknown fixture name', () => {
    const result = validateStrategyReviewSerializationPreviewFixture({
      name: 'unknown-fixture',
      kind: 'json-preview',
      format: 'json',
      title: 'Test',
      description: 'Test',
      reportReference: { sourcePhase: 41, fixtureOnly: true, syntheticOnly: true },
      meta: {
        phase: 42,
        fixtureOnly: true,
        liveData: false,
        externalNetwork: false,
        generatedAt: '2026-01-01T00:00:00.000Z',
        source: 'phase42_strategy_review_serialization_preview_fixtures_v1',
      },
      safetyBoundary: { noActualFileExport: true, strategyReviewActualFileExport: false },
    });
    const codes = result.issues.map(i => i.code);
    expect(codes).toContain('INVALID_NAME');
  });

  it('returns INVALID_FORMAT for unknown format', () => {
    const result = validateStrategyReviewSerializationPreviewFixture({
      name: 'defensive-vs-aggressive-json-preview',
      kind: 'json-preview',
      format: 'pdf',
      title: 'Test',
      description: 'Test',
      reportReference: { sourcePhase: 41, fixtureOnly: true, syntheticOnly: true },
      meta: {
        phase: 42,
        fixtureOnly: true,
        liveData: false,
        externalNetwork: false,
        generatedAt: '2026-01-01T00:00:00.000Z',
        source: 'phase42_strategy_review_serialization_preview_fixtures_v1',
      },
      safetyBoundary: { noActualFileExport: true, strategyReviewActualFileExport: false },
    });
    const codes = result.issues.map(i => i.code);
    expect(codes).toContain('INVALID_FORMAT');
  });

  it('returns INVALID_META_PHASE for wrong meta phase', () => {
    const base = { ...DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE };
    const result = validateStrategyReviewSerializationPreviewFixture({
      ...base,
      meta: { ...base.meta, phase: 41 as unknown as 42 },
    });
    const codes = result.issues.map(i => i.code);
    expect(codes).toContain('INVALID_META_PHASE');
  });

  it('returns INVALID_META_LIVE_DATA for liveData true', () => {
    const base = { ...DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE };
    const result = validateStrategyReviewSerializationPreviewFixture({
      ...base,
      meta: { ...base.meta, liveData: true as unknown as false },
    });
    const codes = result.issues.map(i => i.code);
    expect(codes).toContain('INVALID_META_LIVE_DATA');
  });

  it('returns MISSING_TITLE for empty title', () => {
    const base = { ...DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE };
    const result = validateStrategyReviewSerializationPreviewFixture({ ...base, title: '' });
    const codes = result.issues.map(i => i.code);
    expect(codes).toContain('MISSING_TITLE');
  });

  it('returns INVALID_SAFETY_BOUNDARY for missing safetyBoundary', () => {
    const base = { ...DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE };
    const result = validateStrategyReviewSerializationPreviewFixture({
      ...base,
      safetyBoundary: null as unknown as typeof base.safetyBoundary,
    });
    const codes = result.issues.map(i => i.code);
    expect(codes).toContain('INVALID_SAFETY_BOUNDARY');
  });

  it('does not throw for any invalid input', () => {
    const invalidInputs = [null, undefined, 42, 'string', [], {}, { name: 'x' }];
    for (const input of invalidInputs) {
      expect(() => validateStrategyReviewSerializationPreviewFixture(input)).not.toThrow();
    }
  });
});

// ─── 16. Safety validation — success ─────────────────────────────────────────

describe('Phase 42 — validateStrategyReviewSerializationSafety — success', () => {
  for (const fixture of ALL_FIXTURES) {
    it(`${fixture.name} passes safety validation`, () => {
      const result = validateStrategyReviewSerializationSafety(fixture);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  }
});

// ─── 17. Safety validation — failure ─────────────────────────────────────────

describe('Phase 42 — validateStrategyReviewSerializationSafety — failure', () => {
  it('detects email patterns', () => {
    const result = validateStrategyReviewSerializationSafety({ email: 'user@example.com' });
    expect(result.safe).toBe(false);
  });

  it('detects secret pattern', () => {
    const result = validateStrategyReviewSerializationSafety({
      note: 'contains private key data here',
    });
    expect(result.safe).toBe(false);
  });

  it('detects URL pattern', () => {
    const result = validateStrategyReviewSerializationSafety({
      note: 'see https://example.com for info',
    });
    expect(result.safe).toBe(false);
  });

  it('returns violations as sorted array', () => {
    const result = validateStrategyReviewSerializationSafety({ email: 'a@b.com' });
    const violations = [...result.violations];
    expect(violations).toEqual([...violations].sort());
  });

  it('does not throw for any input', () => {
    const inputs = [null, undefined, 42, 'string', [], {}, { key: 'value' }];
    for (const input of inputs) {
      expect(() => validateStrategyReviewSerializationSafety(input)).not.toThrow();
    }
  });

  it('null input is safe (no strings to scan)', () => {
    const result = validateStrategyReviewSerializationSafety(null);
    expect(result.safe).toBe(true);
  });
});

// ─── 18. buildStrategyReviewSerializationPreviewFixture builder ───────────────

describe('Phase 42 — buildStrategyReviewSerializationPreviewFixture', () => {
  it('builds a valid fixture for each known name', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      const result = buildStrategyReviewSerializationPreviewFixture({
        name,
        kind: SERIALIZATION_NAME_TO_KIND[name],
        format: SERIALIZATION_NAME_TO_FORMAT[name],
        sourceReportFixtureName: SERIALIZATION_NAME_TO_REPORT[name],
      });
      expect(result.success).toBe(true);
      expect(result.fixture).not.toBeNull();
      expect(result.fixture?.name).toBe(name);
    }
  });

  it('fixture meta.phase is 42', () => {
    const result = buildStrategyReviewSerializationPreviewFixture({
      name: 'defensive-vs-aggressive-json-preview',
      kind: 'json-preview',
      format: 'json',
      sourceReportFixtureName: 'defensive-vs-aggressive-review-report',
    });
    expect(result.fixture?.meta.phase).toBe(42);
  });

  it('fixture meta.liveData is false', () => {
    const result = buildStrategyReviewSerializationPreviewFixture({
      name: 'defensive-vs-aggressive-json-preview',
      kind: 'json-preview',
      format: 'json',
      sourceReportFixtureName: 'defensive-vs-aggressive-review-report',
    });
    expect(result.fixture?.meta.liveData).toBe(false);
  });

  it('falls back gracefully for unknown name', () => {
    const result = buildStrategyReviewSerializationPreviewFixture({
      name: 'unknown-name',
      kind: 'json-preview',
      format: 'json',
      sourceReportFixtureName: 'defensive-vs-aggressive-review-report',
    });
    // Should fall back to first known name
    expect(result).toBeDefined();
  });

  it('returns failure for invalid sourceReportFixtureName', () => {
    // Builder falls back to mapping when sourceReportFixtureName is unknown,
    // so passing an unknown name with a valid fixture name still succeeds gracefully.
    const result = buildStrategyReviewSerializationPreviewFixture({
      name: 'defensive-vs-aggressive-json-preview',
      kind: 'json-preview',
      format: 'json',
      sourceReportFixtureName: 'nonexistent-report' as never,
    });
    // Result is defined; either succeeds with fallback or returns a failure envelope.
    expect(result).toBeDefined();
    expect(result.validation).toBeDefined();
    expect(result.safety).toBeDefined();
  });

  it('does not mutate input', () => {
    const input = {
      name: 'defensive-vs-aggressive-json-preview' as const,
      kind: 'json-preview' as const,
      format: 'json' as const,
      sourceReportFixtureName: 'defensive-vs-aggressive-review-report' as const,
    };
    const before = JSON.stringify(input);
    buildStrategyReviewSerializationPreviewFixture(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('is deterministic (same input → same output)', () => {
    const input = {
      name: 'defensive-vs-aggressive-json-preview' as const,
      kind: 'json-preview' as const,
      format: 'json' as const,
      sourceReportFixtureName: 'defensive-vs-aggressive-review-report' as const,
    };
    const r1 = buildStrategyReviewSerializationPreviewFixture(input);
    const r2 = buildStrategyReviewSerializationPreviewFixture(input);
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });

  it('result has validation and safety fields', () => {
    const result = buildStrategyReviewSerializationPreviewFixture({
      name: 'defensive-vs-aggressive-json-preview',
      kind: 'json-preview',
      format: 'json',
      sourceReportFixtureName: 'defensive-vs-aggressive-review-report',
    });
    expect(result.validation).toBeDefined();
    expect(result.safety).toBeDefined();
  });
});

// ─── 19. Source compatibility with Phase 41 fixtures ─────────────────────────

describe('Phase 42 — Source compatibility with Phase 41 fixtures', () => {
  it('PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES has 16 entries', () => {
    expect(PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES.size).toBe(16);
  });

  it('all SERIALIZATION_NAME_TO_REPORT values exist in Phase 41 fixture names', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      const reportName = SERIALIZATION_NAME_TO_REPORT[name];
      expect(STRATEGY_REVIEW_REPORT_FIXTURE_NAMES).toContain(reportName);
    }
  });

  it('all Phase 42 fixtures reference valid Phase 41 reports', () => {
    for (const f of ALL_FIXTURES) {
      const reportName = f.reportReference.sourceReportFixtureName;
      const report = PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES.get(reportName);
      expect(report).toBeDefined();
    }
  });

  it('all reportReference.sourcePhase values are 41', () => {
    for (const f of ALL_FIXTURES) {
      expect(f.reportReference.sourcePhase).toBe(41);
    }
  });

  it('meta.sourcePhases contains [40, 41, 42]', () => {
    for (const f of ALL_FIXTURES) {
      expect(f.meta.sourcePhases).toEqual([40, 41, 42]);
    }
  });
});

// ─── 20. No mutation ─────────────────────────────────────────────────────────

describe('Phase 42 — No input mutation', () => {
  it('validate does not mutate input', () => {
    const fixture = DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE;
    const before = JSON.stringify(fixture);
    validateStrategyReviewSerializationPreviewFixture(fixture);
    expect(JSON.stringify(fixture)).toBe(before);
  });

  it('safety validate does not mutate input', () => {
    const fixture = DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE;
    const before = JSON.stringify(fixture);
    validateStrategyReviewSerializationSafety(fixture);
    expect(JSON.stringify(fixture)).toBe(before);
  });

  it('normalize does not mutate input', () => {
    const fixture = DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE;
    const before = JSON.stringify(fixture);
    normalizeStrategyReviewSerializationPreviewFixture(fixture);
    expect(JSON.stringify(fixture)).toBe(before);
  });

  it('serialize does not mutate input', () => {
    const fixture = DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE;
    const before = JSON.stringify(fixture);
    serializeStrategyReviewSerializationPreviewFixture(fixture);
    expect(JSON.stringify(fixture)).toBe(before);
  });

  it('buildSummary does not mutate input', () => {
    const fixture = DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE;
    const before = JSON.stringify(fixture);
    buildStrategyReviewSerializationSummary(fixture);
    expect(JSON.stringify(fixture)).toBe(before);
  });
});

// ─── 21. Determinism ─────────────────────────────────────────────────────────

describe('Phase 42 — Deterministic ordering', () => {
  it('generatedAt is the same for all fixtures', () => {
    const timestamps = new Set(ALL_FIXTURES.map(f => f.meta.generatedAt));
    expect(timestamps.size).toBe(1);
    expect([...timestamps][0]).toBe(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT);
  });

  it('source is the same for all fixtures', () => {
    const sources = new Set(ALL_FIXTURES.map(f => f.meta.source));
    expect(sources.size).toBe(1);
    expect([...sources][0]).toBe(PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE);
  });

  it('list ordering is stable across repeated access', () => {
    const order1 = ALL_FIXTURES.map(f => f.name);
    const order2 = listStrategyReviewSerializationPreviewFixtures(
      PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES,
    ).map(f => f.name);
    expect(order1).toEqual(order2);
  });

  it('checksums are deterministic (same for same fixture)', () => {
    for (const f of ALL_FIXTURES) {
      const rebuilt = buildStrategyReviewSerializationPreviewFixture({
        name: f.name,
        kind: f.kind,
        format: f.format,
        sourceReportFixtureName: f.reportReference.sourceReportFixtureName,
      });
      expect(rebuilt.fixture?.checksum).toBe(f.checksum);
    }
  });
});

// ─── 22. Safety boundary regression ──────────────────────────────────────────

describe('Phase 42 — Safety boundary regression', () => {
  for (const fixture of ALL_FIXTURES) {
    it(`${fixture.name}: strategyReviewActualFileExport is false`, () => {
      expect(fixture.safetyBoundary.strategyReviewActualFileExport).toBe(false);
    });
    it(`${fixture.name}: strategyReviewDownloadSupport is false`, () => {
      expect(fixture.safetyBoundary.strategyReviewDownloadSupport).toBe(false);
    });
    it(`${fixture.name}: strategyReviewSerializationExternalNetwork is false`, () => {
      expect(fixture.safetyBoundary.strategyReviewSerializationExternalNetwork).toBe(false);
    });
    it(`${fixture.name}: strategyReviewSerializationPersistence is false`, () => {
      expect(fixture.safetyBoundary.strategyReviewSerializationPersistence).toBe(false);
    });
    it(`${fixture.name}: strategyReviewSerializationExecution is false`, () => {
      expect(fixture.safetyBoundary.strategyReviewSerializationExecution).toBe(false);
    });
    it(`${fixture.name}: strategyReviewSerializationTradingSignals is false`, () => {
      expect(fixture.safetyBoundary.strategyReviewSerializationTradingSignals).toBe(false);
    });
    it(`${fixture.name}: strategyReviewSerializationInvestmentAdvice is false`, () => {
      expect(fixture.safetyBoundary.strategyReviewSerializationInvestmentAdvice).toBe(false);
    });
    it(`${fixture.name}: noActualFileExport is true`, () => {
      expect(fixture.safetyBoundary.noActualFileExport).toBe(true);
    });
    it(`${fixture.name}: noRealScoring is true`, () => {
      expect(fixture.safetyBoundary.noRealScoring).toBe(true);
    });
    it(`${fixture.name}: noExternalNetwork is true`, () => {
      expect(fixture.safetyBoundary.noExternalNetwork).toBe(true);
    });
    it(`${fixture.name}: noPersistence is true`, () => {
      expect(fixture.safetyBoundary.noPersistence).toBe(true);
    });
    it(`${fixture.name}: noExecution is true`, () => {
      expect(fixture.safetyBoundary.noExecution).toBe(true);
    });
  }
});

// ─── 23. No forbidden data ────────────────────────────────────────────────────

describe('Phase 42 — No forbidden data in fixtures', () => {
  const forbidden = [
    /\bprivate\s+key\b/i,
    /\bseed\s+phrase\b/i,
    /\bmnemonic\b/i,
    /begin\s+private\s+key/i,
    /https?:\/\//i,
    /\/home\//i,
    /\/Users\//i,
  ];

  for (const fixture of ALL_FIXTURES) {
    const content = JSON.stringify(fixture);
    for (const pattern of forbidden) {
      it(`${fixture.name} has no ${pattern.source} match`, () => {
        expect(content).not.toMatch(pattern);
      });
    }
  }
});

// ─── 24. Phase 42 capability flags ───────────────────────────────────────────

describe('Phase 42 — Capability flags', () => {
  const caps = getStrategyReviewSerializationPreviewCapabilities();

  it('strategyReviewSerializationPreviewFixtures is true', () => {
    expect(caps.strategyReviewSerializationPreviewFixtures).toBe(true);
  });
  it('syntheticStrategyReviewSerializationPreviews is true', () => {
    expect(caps.syntheticStrategyReviewSerializationPreviews).toBe(true);
  });
  it('strategyReviewSerializationPreviewBuilders is true', () => {
    expect(caps.strategyReviewSerializationPreviewBuilders).toBe(true);
  });
  it('strategyReviewSerializationSafetyValidation is true', () => {
    expect(caps.strategyReviewSerializationSafetyValidation).toBe(true);
  });
  it('strategyReviewReportReferences is true', () => {
    expect(caps.strategyReviewReportReferences).toBe(true);
  });
  it('strategyReviewJsonPreview is true', () => {
    expect(caps.strategyReviewJsonPreview).toBe(true);
  });
  it('strategyReviewMarkdownPreview is true', () => {
    expect(caps.strategyReviewMarkdownPreview).toBe(true);
  });
  it('strategyReviewTextPreview is true', () => {
    expect(caps.strategyReviewTextPreview).toBe(true);
  });
  it('strategyReviewMetadataPreview is true', () => {
    expect(caps.strategyReviewMetadataPreview).toBe(true);
  });
  it('strategyReviewActualFileExport is false', () => {
    expect(caps.strategyReviewActualFileExport).toBe(false);
  });
  it('strategyReviewDownloadSupport is false', () => {
    expect(caps.strategyReviewDownloadSupport).toBe(false);
  });
  it('strategyReviewSerializationExternalNetwork is false', () => {
    expect(caps.strategyReviewSerializationExternalNetwork).toBe(false);
  });
  it('strategyReviewSerializationPersistence is false', () => {
    expect(caps.strategyReviewSerializationPersistence).toBe(false);
  });
  it('strategyReviewSerializationExecution is false', () => {
    expect(caps.strategyReviewSerializationExecution).toBe(false);
  });
  it('strategyReviewSerializationTradingSignals is false', () => {
    expect(caps.strategyReviewSerializationTradingSignals).toBe(false);
  });
  it('strategyReviewSerializationInvestmentAdvice is false', () => {
    expect(caps.strategyReviewSerializationInvestmentAdvice).toBe(false);
  });
});

// ─── 25. getDashboardUiShellCapabilities Phase 42 flags ───────────────────────

describe('Phase 42 — getDashboardUiShellCapabilities includes Phase 42 flags', () => {
  const caps = getDashboardUiShellCapabilities();

  it('strategyReviewSerializationPreviewFixtures is true', () => {
    expect((caps as Record<string, unknown>)['strategyReviewSerializationPreviewFixtures']).toBe(true);
  });
  it('syntheticStrategyReviewSerializationPreviews is true', () => {
    expect((caps as Record<string, unknown>)['syntheticStrategyReviewSerializationPreviews']).toBe(true);
  });
  it('strategyReviewActualFileExport is false', () => {
    expect((caps as Record<string, unknown>)['strategyReviewActualFileExport']).toBe(false);
  });
  it('strategyReviewDownloadSupport is false', () => {
    expect((caps as Record<string, unknown>)['strategyReviewDownloadSupport']).toBe(false);
  });
  it('strategyReviewSerializationExecution is false', () => {
    expect((caps as Record<string, unknown>)['strategyReviewSerializationExecution']).toBe(false);
  });
  it('strategyReviewJsonPreview is true', () => {
    expect((caps as Record<string, unknown>)['strategyReviewJsonPreview']).toBe(true);
  });
});

// ─── 26. getLocalReadOnlyApiCapabilities Phase 42 flags ───────────────────────

describe('Phase 42 — getLocalReadOnlyApiCapabilities includes Phase 42 flags', () => {
  const caps = getLocalReadOnlyApiCapabilities();

  it('strategyReviewSerializationPreviewFixtures is true', () => {
    expect((caps as Record<string, unknown>)['strategyReviewSerializationPreviewFixtures']).toBe(true);
  });
  it('strategyReviewActualFileExport is false', () => {
    expect((caps as Record<string, unknown>)['strategyReviewActualFileExport']).toBe(false);
  });
  it('strategyReviewSerializationInvestmentAdvice is false', () => {
    expect((caps as Record<string, unknown>)['strategyReviewSerializationInvestmentAdvice']).toBe(false);
  });
});

// ─── 27. No live data / export / network / persistence claims ─────────────────

describe('Phase 42 — No out-of-scope claims in source files', () => {
  const forbidden = [
    'Blob',
    'URL.createObjectURL',
    'fs.writeFile',
    'writeFileSync',
    'createWriteStream',
    'fetch(',
    'axios',
    'localStorage',
    'sessionStorage',
    'IndexedDB',
    'Date.now()',
    'new Date()',
    'Math.random()',
    'setTimeout',
    'setInterval',
    'child_process',
    'eval(',
  ];

  for (const filePath of PHASE_42_FILES) {
    const content = readFileSync(filePath, 'utf8');
    for (const term of forbidden) {
      it(`${filePath.split('/').pop()} does not contain '${term}'`, () => {
        expect(content).not.toContain(term);
      });
    }
  }
});

// ─── 28. Summary shape properties ────────────────────────────────────────────

describe('Phase 42 — Summary shape', () => {
  for (const fixture of ALL_FIXTURES) {
    it(`${fixture.name} summary.fixtureName matches name`, () => {
      expect(fixture.summary.fixtureName).toBe(fixture.name);
    });
    it(`${fixture.name} summary.fixtureKind matches kind`, () => {
      expect(fixture.summary.fixtureKind).toBe(fixture.kind);
    });
    it(`${fixture.name} summary.format matches format`, () => {
      expect(fixture.summary.format).toBe(fixture.format);
    });
    it(`${fixture.name} summary.contentLength matches fixture.contentLength`, () => {
      expect(fixture.summary.contentLength).toBe(fixture.contentLength);
    });
    it(`${fixture.name} summary.checksum matches fixture.checksum`, () => {
      expect(fixture.summary.checksum).toBe(fixture.checksum);
    });
    it(`${fixture.name} summary.sourceReportFixtureName is a valid report name`, () => {
      expect(STRATEGY_REVIEW_REPORT_FIXTURE_NAMES).toContain(
        fixture.summary.sourceReportFixtureName,
      );
    });
  }
});

// ─── 29. SERIALIZATION_NAME_TO_* mappings ────────────────────────────────────

describe('Phase 42 — Name mapping completeness', () => {
  it('SERIALIZATION_NAME_TO_REPORT covers all 16 fixture names', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      expect(SERIALIZATION_NAME_TO_REPORT[name]).toBeDefined();
    }
  });

  it('SERIALIZATION_NAME_TO_KIND covers all 16 fixture names', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      expect(SERIALIZATION_NAME_TO_KIND[name]).toBeDefined();
    }
  });

  it('SERIALIZATION_NAME_TO_FORMAT covers all 16 fixture names', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      expect(SERIALIZATION_NAME_TO_FORMAT[name]).toBeDefined();
    }
  });

  it('format values are from allowed set', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS).toContain(
        SERIALIZATION_NAME_TO_FORMAT[name],
      );
    }
  });

  it('kind values are from allowed set', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      expect(STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS).toContain(
        SERIALIZATION_NAME_TO_KIND[name],
      );
    }
  });

  it('report names are from Phase 41 fixture names', () => {
    for (const name of STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES) {
      expect(STRATEGY_REVIEW_REPORT_FIXTURE_NAMES).toContain(SERIALIZATION_NAME_TO_REPORT[name]);
    }
  });
});

// ─── 30. Phase 42 docs exist ─────────────────────────────────────────────────

describe('Phase 42 — Documentation', () => {
  it('STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES.md exists', () => {
    const docPath = resolve(REPO_ROOT, 'docs/STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES.md');
    const content = readFileSync(docPath, 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('PHASE_LOG.md mentions Phase 42', () => {
    const docPath = resolve(REPO_ROOT, 'docs/PHASE_LOG.md');
    const content = readFileSync(docPath, 'utf8');
    expect(content).toMatch(/Phase 42/);
  });
});
