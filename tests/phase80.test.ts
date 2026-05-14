import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURE_MAP,
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES,
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS,
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES,
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE,
  PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT,
  areLiveSnapshotFixturePromotionReviewFixturesEqual,
  buildFixturePromotionApiContract,
  buildFixturePromotionBlocker,
  buildFixturePromotionCandidate,
  buildFixturePromotionEvidenceBundle,
  buildFixturePromotionIntegrityReview,
  buildFixturePromotionManifest,
  buildFixturePromotionParityReviewLinkage,
  buildFixturePromotionProvenanceReview,
  buildFixturePromotionQuarantineReview,
  buildFixturePromotionReport,
  buildFixturePromotionReviewGate,
  buildFixturePromotionReviewPolicy,
  buildFixturePromotionReviewerDecision,
  buildFixturePromotionSchemaReview,
  buildFixturePromotionScorecard,
  buildFixturePromotionSnapshotCaptureLinkage,
  buildFixturePromotionViewModel,
  buildLiveSnapshotFixturePromotionReviewFixture,
  getDashboardUiShellCapabilities,
  getLiveSnapshotFixturePromotionReviewCapabilities,
  getLiveSnapshotFixturePromotionReviewFixture,
  isValidLiveSnapshotFixturePromotionReviewGeneratedAt,
  isValidLiveSnapshotFixturePromotionReviewKind,
  isValidLiveSnapshotFixturePromotionReviewName,
  isValidLiveSnapshotFixturePromotionReviewSchemaVersion,
  isValidLiveSnapshotFixturePromotionReviewSource,
  listLiveSnapshotFixturePromotionReviewFixtures,
  normalizeLiveSnapshotFixturePromotionReviewFixture,
  selectLiveSnapshotFixturePromotionReviewFixture,
  serializeLiveSnapshotFixturePromotionReviewFixture,
  validateLiveSnapshotFixturePromotionReviewFixture,
  validateLiveSnapshotFixturePromotionReviewSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_80_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/live-snapshot-fixture-promotion-review');

const PHASE_80_FILES = [
  'types.ts',
  'promotion-review-gates.ts',
  'fixture-candidates.ts',
  'review-policies.ts',
  'reviewer-decisions.ts',
  'promotion-evidence.ts',
  'promotion-manifests.ts',
  'blocker-taxonomy.ts',
  'quarantine-review.ts',
  'parity-review-linkage.ts',
  'snapshot-capture-linkage.ts',
  'provenance-review.ts',
  'integrity-review.ts',
  'schema-review.ts',
  'promotion-scorecards.ts',
  'review-reports.ts',
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

describe('Phase 80 — Live Snapshot Fixture Promotion Review Contracts', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_80_FILES) {
      expect(() => readFileSync(resolve(PHASE_80_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() => readFileSync(resolve(REPO_ROOT, 'docs/LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW.md'), 'utf8')).not.toThrow();
  });

  it('has constants and deterministic generated timestamp', () => {
    expect(LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE).toBe(80);
    expect(PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT).toBe('2026-05-14T00:00:00.000Z');
    expect(
      isValidLiveSnapshotFixturePromotionReviewGeneratedAt(PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT),
    ).toBe(true);
    expect(isValidLiveSnapshotFixturePromotionReviewSchemaVersion('1.0.0')).toBe(true);
    expect(isValidLiveSnapshotFixturePromotionReviewSource('phase80_live_snapshot_fixture_promotion_review_contracts_v1')).toBe(
      true,
    );
  });

  it('defines names/kinds and fixture list surfaces', () => {
    expect(LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES).toHaveLength(8);
    expect(LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS).toHaveLength(8);
    expect(LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURE_MAP.size).toBe(LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES.length);
    expect(listLiveSnapshotFixturePromotionReviewFixtures()).toBe(LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES);
  });

  it('supports get/select/normalize/serialize/equality', () => {
    const fixture = LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES[0]!;
    expect(getLiveSnapshotFixturePromotionReviewFixture(fixture.fixtureId)).toBe(fixture);
    expect(getLiveSnapshotFixturePromotionReviewFixture('unknown')).toBeNull();
    expect(selectLiveSnapshotFixturePromotionReviewFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectLiveSnapshotFixturePromotionReviewFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeLiveSnapshotFixturePromotionReviewFixture(fixture);
    expect(serializeLiveSnapshotFixturePromotionReviewFixture(fixture)).toContain('"fixtureId"');
    expect(areLiveSnapshotFixturePromotionReviewFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('validates fixtures and enforces safety', () => {
    for (const fixture of LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES) {
      expect(validateLiveSnapshotFixturePromotionReviewFixture(fixture).valid).toBe(true);
      expect(validateLiveSnapshotFixturePromotionReviewSafety(fixture).safe).toBe(true);
      expect(fixture.reviewGate.unlockAuthority).toBe(false);
      expect(fixture.reviewGate.filesystemWriteAllowed).toBe(false);
      expect(fixture.reviewGate.automaticPromotionAllowed).toBe(false);
      expect(fixture.candidate.persisted).toBe(false);
      expect(fixture.candidate.promotionAllowed).toBe(false);
      expect(fixture.manifest.fileWriteAllowed).toBe(false);
      expect(fixture.manifest.automaticCommitAllowed).toBe(false);
      expect(fixture.quarantineReview.releaseAllowed).toBe(false);
      expect(fixture.reviewerDecision.approvalDoesNotPromote).toBe(true);
    }
  });

  it('covers required blocked/review/quarantine scenarios', () => {
    expect(buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'fixture-promotion-review-ready' }).reviewGate.gateStatus).toBe(
      'ready',
    );
    expect(
      buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'parity-audit-mismatch-blocked' }).blocker.promotionBlocked,
    ).toBe(true);
    expect(
      buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'quarantined-snapshot-blocked' }).quarantineReview.quarantined,
    ).toBe(true);
    expect(
      buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'missing-reviewer-decision-pending' }).reviewerDecision
        .decisionStatus,
    ).toBe('pending');
    expect(
      buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'manifest-write-path-rejected' }).manifest.manifestStatus,
    ).toBe('rejected');
    expect(
      buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'provenance-review-warning-required' }).provenanceReview
        .reviewStatus,
    ).toBe('warning');
    expect(
      buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'schema-review-warning-required' }).schemaReview.reviewStatus,
    ).toBe('warning');
    expect(buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'unsafe-capability-rejected' }).reviewGate.gateStatus).toBe(
      'rejected',
    );
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'fixture-promotion-review-ready' });
    const unsafe = {
      ...fixture,
      reviewGate: { ...fixture.reviewGate, automaticPromotionAllowed: true as const },
      manifest: { ...fixture.manifest, fileWriteAllowed: true as const },
      report: { ...fixture.report, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(validateLiveSnapshotFixturePromotionReviewFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('AUTO_PROMOTION_FORBIDDEN')).toBe(true);
    expect(codes.has('MANIFEST_FILE_WRITE_FORBIDDEN')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('builder helpers work and capabilities propagate', () => {
    expect(buildFixturePromotionReviewGate({ reviewGateId: 'g', reviewGateName: 'n', gateStatus: 'blocked', blockingReasonCodes: ['x'] }).phase).toBe(80);
    expect(buildFixturePromotionCandidate({ candidateId: 'c', sourceParityAuditFixtureRef: 'p', sourceSnapshotCaptureFixtureRef: 's', candidateStatus: 'staged' }).stagedOnly).toBe(true);
    expect(buildFixturePromotionReviewPolicy({ policyId: 'p', multipleReviewersRequired: 2, policyStatus: 'active' }).manualReviewRequired).toBe(true);
    expect(buildFixturePromotionReviewerDecision({ decisionId: 'd', decisionKind: 'approved', reviewerSlot: 'r', decisionStatus: 'recorded', evidenceRefs: ['e'] }).approvalDoesNotPromote).toBe(true);
    expect(buildFixturePromotionEvidenceBundle({ evidenceBundleId: 'e', sourcePhaseRefs: ['p'], sourceFixtureRefs: ['f'], parityAuditRefs: ['a'], validationCommandRefs: ['v'], safetyGrepRefs: ['g'], docsRefs: ['d'], evidenceComplete: true }).evidenceComplete).toBe(true);
    expect(buildFixturePromotionManifest({ manifestId: 'm', manifestKind: 'k', proposedFixtureName: 'n', proposedFixtureVersion: '1.0.0', manifestStatus: 'proposed' }).automaticCommitAllowed).toBe(false);
    expect(buildFixturePromotionBlocker({ blockerId: 'b', blockerKind: 'k', severity: 'high', reasonCode: 'x', promotionBlocked: true }).failClosed).toBe(true);
    expect(buildFixturePromotionQuarantineReview({ quarantineReviewId: 'q', quarantined: true, quarantineReasonCodes: ['x'] }).releaseAllowed).toBe(false);
    expect(buildFixturePromotionParityReviewLinkage({ parityReviewLinkageId: 'p', sourceParityAuditFixtureRef: 'r', parityStatus: 'warning', linkageStatus: 'warning' }).linkageStatus).toBe('warning');
    expect(buildFixturePromotionSnapshotCaptureLinkage({ snapshotCaptureLinkageId: 's', sourceSnapshotCaptureFixtureRef: 'r', captureStatus: 'review_required', linkageStatus: 'blocked' }).captureStatus).toBe('review_required');
    expect(buildFixturePromotionProvenanceReview({ provenanceReviewId: 'p', reviewStatus: 'warning', sourcePhaseRefs: ['x'], sourceFixtureRefs: ['y'] }).reviewStatus).toBe('warning');
    expect(buildFixturePromotionIntegrityReview({ integrityReviewId: 'i', expectedChecksum: 'a', observedChecksum: 'b', reviewStatus: 'fail' }).checksumKind).toBe('fnv1a32');
    expect(buildFixturePromotionSchemaReview({ schemaReviewId: 's', schemaVersion: '1.0.0', reviewStatus: 'warning', warningCodes: ['x'], manualReviewRequired: true }).manualReviewRequired).toBe(true);
    expect(buildFixturePromotionScorecard({ scorecardId: 's', promotionScore: 80, classification: 'warning', reviewRequired: true }).promotionScore).toBe(80);
    expect(buildFixturePromotionReport({ reportId: 'r', gateSummary: 'g', candidateSummary: 'c', policySummary: 'p', decisionSummary: 'd', evidenceSummary: 'e', manifestSummary: 'm', blockerSummary: 'b', quarantineSummary: 'q', safetySummary: 'safe' }).reportId).toBe('r');
    expect(buildFixturePromotionViewModel({ viewModelId: 'v', fixtureId: 'f', fixtureName: 'fixture-promotion-review-ready', gateStatus: 'ready', candidateStatus: 'staged', manifestStatus: 'proposed' }).summary).toContain('fixture-promotion-review-ready');
    expect(buildFixturePromotionApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);

    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.liveSnapshotFixturePromotionReviewContracts).toBe(true);
    expect(dashboard.fixturePromotionRuntimeCapture).toBe(false);
    expect(api.liveSnapshotFixturePromotionReviewContracts).toBe(true);
    expect(api.fixturePromotionRuntimeCapture).toBe(false);
    expect(getLiveSnapshotFixturePromotionReviewCapabilities().fixturePromotionAutomaticPromotion).toBe(false);
  });

  it('is deterministic, immutable, and avoids randomness/network helpers', () => {
    const a = buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'fixture-promotion-review-ready' });
    const b = buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName: 'fixture-promotion-review-ready' });
    expect(areLiveSnapshotFixturePromotionReviewFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase79FixtureSnapshot)).toBe(true);
    for (const file of PHASE_80_FILES) {
      const source = readFileSync(resolve(PHASE_80_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\(/);
    }
  });

  it('documents phase79 clean-runner blocker evidence and phase81 preview-only guidance', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW.md'), 'utf8');
    expect(doc).toContain('better-sqlite3');
    expect(doc).toContain('Could not locate the bindings file');
    expect(doc).toContain('Phase 81');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(isValidLiveSnapshotFixturePromotionReviewName('fixture-promotion-review-ready')).toBe(true);
    expect(isValidLiveSnapshotFixturePromotionReviewName('unknown')).toBe(false);
    expect(isValidLiveSnapshotFixturePromotionReviewKind('fixture_promotion_review_ready')).toBe(true);
    expect(isValidLiveSnapshotFixturePromotionReviewKind('unknown')).toBe(false);
  });
});
