import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURE_MAP,
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES,
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS,
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES,
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE,
  PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT,
  areLiveSnapshotReplayParityAuditFixturesEqual,
  buildLiveSnapshotAuditEvidence,
  buildLiveSnapshotDriftClassification,
  buildLiveSnapshotIntegrityParity,
  buildLiveSnapshotMismatchTaxonomy,
  buildLiveSnapshotParityComparison,
  buildLiveSnapshotParityReport,
  buildLiveSnapshotParityScorecard,
  buildLiveSnapshotPromotionGate,
  buildLiveSnapshotProvenanceAudit,
  buildLiveSnapshotReplayExpectationLinkage,
  buildLiveSnapshotReplayParityAuditApiContract,
  buildLiveSnapshotReplayParityAuditFixture,
  buildLiveSnapshotReplayParityAuditViewModel,
  buildLiveSnapshotReplayParityGate,
  buildLiveSnapshotReplayParityQuarantineContract,
  buildLiveSnapshotReplaySnapshotInput,
  buildLiveSnapshotScenarioExpectationLinkage,
  buildLiveSnapshotSchemaParity,
  getDashboardUiShellCapabilities,
  getLiveSnapshotReplayParityAuditCapabilities,
  getLiveSnapshotReplayParityAuditFixture,
  isValidLiveSnapshotReplayParityAuditGeneratedAt,
  isValidLiveSnapshotReplayParityAuditKind,
  isValidLiveSnapshotReplayParityAuditName,
  isValidLiveSnapshotReplayParityAuditSchemaVersion,
  isValidLiveSnapshotReplayParityAuditSource,
  listLiveSnapshotReplayParityAuditFixtures,
  normalizeLiveSnapshotReplayParityAuditFixture,
  selectLiveSnapshotReplayParityAuditFixture,
  serializeLiveSnapshotReplayParityAuditFixture,
  validateLiveSnapshotReplayParityAuditFixture,
  validateLiveSnapshotReplayParityAuditSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_79_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/live-snapshot-replay-parity-audit');

const PHASE_79_FILES = [
  'types.ts',
  'parity-gates.ts',
  'snapshot-inputs.ts',
  'replay-expectation-linkage.ts',
  'scenario-expectation-linkage.ts',
  'parity-comparisons.ts',
  'mismatch-taxonomy.ts',
  'drift-classification.ts',
  'provenance-audits.ts',
  'schema-parity.ts',
  'integrity-parity.ts',
  'promotion-gates.ts',
  'quarantine-contracts.ts',
  'audit-evidence.ts',
  'parity-scorecards.ts',
  'parity-reports.ts',
  'reports.ts',
  'builders.ts',
  'fixtures.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
];

describe('Phase 79 — Live Snapshot Replay Parity Audit Contracts', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_79_FILES) {
      expect(() => readFileSync(resolve(PHASE_79_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() => readFileSync(resolve(REPO_ROOT, 'docs/LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT.md'), 'utf8')).not.toThrow();
  });

  it('has constants and deterministic generated timestamp', () => {
    expect(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE).toBe(79);
    expect(PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
    expect(isValidLiveSnapshotReplayParityAuditGeneratedAt(PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT)).toBe(
      true,
    );
    expect(isValidLiveSnapshotReplayParityAuditSchemaVersion('1.0.0')).toBe(true);
    expect(isValidLiveSnapshotReplayParityAuditSource('phase79_live_snapshot_replay_parity_audit_contracts_v1')).toBe(true);
  });

  it('defines names/kinds and fixture list surfaces', () => {
    expect(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES).toHaveLength(8);
    expect(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS).toHaveLength(8);
    expect(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURE_MAP.size).toBe(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES.length);
    expect(listLiveSnapshotReplayParityAuditFixtures()).toBe(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES);
  });

  it('supports get/select/normalize/serialize/equality', () => {
    const fixture = LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES[0]!;
    expect(getLiveSnapshotReplayParityAuditFixture(fixture.fixtureId)).toBe(fixture);
    expect(getLiveSnapshotReplayParityAuditFixture('unknown')).toBeNull();
    expect(selectLiveSnapshotReplayParityAuditFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectLiveSnapshotReplayParityAuditFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeLiveSnapshotReplayParityAuditFixture(fixture);
    expect(serializeLiveSnapshotReplayParityAuditFixture(fixture)).toContain('"fixtureId"');
    expect(areLiveSnapshotReplayParityAuditFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('validates fixtures and enforces safety', () => {
    for (const fixture of LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES) {
      expect(validateLiveSnapshotReplayParityAuditFixture(fixture).valid).toBe(true);
      expect(validateLiveSnapshotReplayParityAuditSafety(fixture).safe).toBe(true);
      expect(fixture.parityGate.failClosed).toBe(true);
      expect(fixture.parityGate.unlockAuthority).toBe(false);
      expect(fixture.parityGate.runtimeReplayAllowed).toBe(false);
      expect(fixture.promotionGate.automaticPromotionAllowed).toBe(false);
      expect(fixture.promotionGate.manualReviewRequired).toBe(true);
      expect(fixture.snapshotInput.networkAccessAllowed).toBe(false);
    }
  });

  it('covers required blocked/review/quarantine scenarios', () => {
    expect(buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'snapshot-replay-parity-clean' }).parityGate.gateStatus).toBe(
      'ready',
    );
    expect(
      buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'snapshot-schema-mismatch-quarantined' }).quarantineContract
        .quarantined,
    ).toBe(true);
    expect(
      buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'snapshot-provenance-mismatch-blocked' }).provenanceAudit
        .auditStatus,
    ).toBe('fail');
    expect(
      buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'snapshot-integrity-mismatch-blocked' }).integrityParity
        .integrityStatus,
    ).toBe('fail');
    expect(
      buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'replay-expectation-missing-blocked' })
        .replayExpectationLinkage.expectationPresent,
    ).toBe(false);
    expect(
      buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'scenario-expectation-warning-review-required' }).parityGate
        .gateStatus,
    ).toBe('review_required');
    expect(
      buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'promotion-gate-manual-review-required' }).promotionGate
        .promotionStatus,
    ).toBe('review_required');
    expect(buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'unsafe-capability-rejected' }).parityGate.gateStatus).toBe(
      'rejected',
    );
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'snapshot-replay-parity-clean' });
    const unsafe = {
      ...fixture,
      promotionGate: { ...fixture.promotionGate, automaticPromotionAllowed: true as const },
      parityReport: { ...fixture.parityReport, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(validateLiveSnapshotReplayParityAuditFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('PROMOTION_AUTO_FORBIDDEN')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('builder helpers work and capabilities propagate', () => {
    expect(buildLiveSnapshotReplayParityGate({ parityGateId: 'g', parityGateName: 'n', gateStatus: 'blocked', reasonCodes: ['x'] }).phase).toBe(79);
    expect(buildLiveSnapshotReplaySnapshotInput({ snapshotInputId: 's', snapshotInputKind: 'k', sourceFixtureRef: 'f' }).readOnly).toBe(true);
    expect(buildLiveSnapshotReplayExpectationLinkage({ replayExpectationLinkageId: 'r', replayExpectationRef: 'x', expectationPresent: false, linkageStatus: 'missing' }).failClosed).toBe(true);
    expect(buildLiveSnapshotScenarioExpectationLinkage({ scenarioExpectationLinkageId: 's', scenarioExpectationRef: 'x', expectationPresent: true, linkageStatus: 'warning' }).failClosed).toBe(true);
    expect(buildLiveSnapshotParityComparison({ parityComparisonId: 'p', parityStatus: 'warning', mismatchCount: 1, comparedFields: ['x'] }).mismatchCount).toBe(1);
    expect(buildLiveSnapshotMismatchTaxonomy({ mismatchTaxonomyId: 'm', mismatchCodes: ['x'], severity: 'high', quarantined: true }).quarantined).toBe(true);
    expect(buildLiveSnapshotDriftClassification({ driftClassificationId: 'd', driftStatus: 'warning', driftClass: 'schema', reviewRequired: true }).reviewRequired).toBe(true);
    expect(buildLiveSnapshotProvenanceAudit({ provenanceAuditId: 'p', auditStatus: 'pass', sourcePhaseRefs: ['a'], sourceFixtureRefs: ['b'], missingRefs: [] }).failClosed).toBe(true);
    expect(buildLiveSnapshotSchemaParity({ schemaParityId: 's', schemaVersion: '1.0.0', schemaStatus: 'warning', mismatchFields: ['f'] }).schemaStatus).toBe('warning');
    expect(buildLiveSnapshotIntegrityParity({ integrityParityId: 'i', expectedChecksum: 'x', actualChecksum: 'y', integrityStatus: 'fail', parityMatch: false }).checksumKind).toBe('fnv1a32');
    expect(buildLiveSnapshotPromotionGate({ promotionGateId: 'p', promotionStatus: 'review_required' }).manualReviewRequired).toBe(true);
    expect(buildLiveSnapshotReplayParityQuarantineContract({ quarantineId: 'q', quarantined: true, reasonCodes: ['x'] }).releaseAllowed).toBe(false);
    expect(buildLiveSnapshotAuditEvidence({ evidenceId: 'e', evidenceBundleId: 'b', sourceRefs: ['x'], docsRefs: ['d'], validationCommandRefs: ['v'], evidenceComplete: true }).evidenceComplete).toBe(true);
    expect(buildLiveSnapshotParityScorecard({ parityScorecardId: 's', parityScore: 90, classification: 'clean', reviewRequired: false }).parityScore).toBe(90);
    expect(buildLiveSnapshotParityReport({ reportId: 'r', gateSummary: 'g', snapshotSummary: 's', replaySummary: 'r', scenarioSummary: 'sc', schemaSummary: 'sh', integritySummary: 'i', driftSummary: 'd', promotionSummary: 'p', safetySummary: 'safe' }).reportId).toBe('r');
    expect(buildLiveSnapshotReplayParityAuditViewModel({ viewModelId: 'v', fixtureId: 'f', fixtureName: 'snapshot-replay-parity-clean', gateStatus: 'ready', parityStatus: 'clean', promotionStatus: 'candidate' }).summary).toContain('snapshot-replay-parity-clean');
    expect(buildLiveSnapshotReplayParityAuditApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);

    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.liveSnapshotReplayParityAuditContracts).toBe(true);
    expect(dashboard.liveSnapshotReplayRuntime).toBe(false);
    expect(api.liveSnapshotReplayParityAuditContracts).toBe(true);
    expect(api.liveSnapshotReplayRuntime).toBe(false);
    expect(getLiveSnapshotReplayParityAuditCapabilities().liveSnapshotReplayAutomaticPromotion).toBe(false);
  });

  it('is deterministic, immutable, and avoids randomness/network helpers', () => {
    const a = buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'snapshot-replay-parity-clean' });
    const b = buildLiveSnapshotReplayParityAuditFixture({ fixtureName: 'snapshot-replay-parity-clean' });
    expect(areLiveSnapshotReplayParityAuditFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase78FixtureSnapshot)).toBe(true);
    for (const file of PHASE_79_FILES) {
      const source = readFileSync(resolve(PHASE_79_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\(/);
    }
  });

  it('docs show Phase 80 preview only and name/kind validators work', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT.md'), 'utf8');
    expect(doc).toContain('Phase 80');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(isValidLiveSnapshotReplayParityAuditName('snapshot-replay-parity-clean')).toBe(true);
    expect(isValidLiveSnapshotReplayParityAuditName('unknown')).toBe(false);
    expect(isValidLiveSnapshotReplayParityAuditKind('snapshot_replay_parity_clean')).toBe(true);
    expect(isValidLiveSnapshotReplayParityAuditKind('unknown')).toBe(false);
  });
});
