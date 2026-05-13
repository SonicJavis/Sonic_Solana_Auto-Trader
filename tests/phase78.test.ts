import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURE_MAP,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE,
  areReadOnlyLiveSnapshotCaptureFixturesEqual,
  buildLiveSnapshotApiContract,
  buildLiveSnapshotCaptureBounds,
  buildLiveSnapshotCaptureCertification,
  buildLiveSnapshotCaptureGate,
  buildLiveSnapshotCaptureReport,
  buildLiveSnapshotCaptureRequest,
  buildLiveSnapshotCaptureScope,
  buildLiveSnapshotFixtureCandidateContract,
  buildLiveSnapshotPromotionCandidate,
  buildLiveSnapshotProviderTarget,
  buildLiveSnapshotQuarantineContract,
  buildLiveSnapshotResponseStaging,
  buildLiveSnapshotSchemaValidationContract,
  buildLiveSnapshotViewModel,
  buildReadOnlyLiveSnapshotCaptureFixture,
  getDashboardUiShellCapabilities,
  getReadOnlyLiveSnapshotCaptureCapabilities,
  getReadOnlyLiveSnapshotCaptureFixture,
  isValidReadOnlyLiveSnapshotCaptureGeneratedAt,
  isValidReadOnlyLiveSnapshotCaptureKind,
  isValidReadOnlyLiveSnapshotCaptureName,
  isValidReadOnlyLiveSnapshotCaptureSchemaVersion,
  isValidReadOnlyLiveSnapshotCaptureSource,
  listReadOnlyLiveSnapshotCaptureFixtures,
  normalizeReadOnlyLiveSnapshotCaptureFixture,
  selectReadOnlyLiveSnapshotCaptureFixture,
  serializeReadOnlyLiveSnapshotCaptureFixture,
  validateReadOnlyLiveSnapshotCaptureFixture,
  validateReadOnlyLiveSnapshotCaptureSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_78_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/read-only-live-snapshot-capture');

const PHASE_78_FILES = [
  'types.ts',
  'capture-gates.ts',
  'capture-requests.ts',
  'provider-targets.ts',
  'capture-scope.ts',
  'capture-bounds.ts',
  'response-staging.ts',
  'quarantine-contracts.ts',
  'normalization-contracts.ts',
  'provenance-contracts.ts',
  'integrity-contracts.ts',
  'schema-validation.ts',
  'promotion-candidates.ts',
  'fixture-candidate-contracts.ts',
  'capture-certification.ts',
  'capture-reports.ts',
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

describe('Phase 78 — Read-Only Live Snapshot Capture Contracts', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_78_FILES) {
      expect(() => readFileSync(resolve(PHASE_78_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() => readFileSync(resolve(REPO_ROOT, 'docs/READ_ONLY_LIVE_SNAPSHOT_CAPTURE.md'), 'utf8')).not.toThrow();
  });

  it('has constants and deterministic generated timestamp', () => {
    expect(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE).toBe(78);
    expect(PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
    expect(isValidReadOnlyLiveSnapshotCaptureGeneratedAt(PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT)).toBe(true);
    expect(isValidReadOnlyLiveSnapshotCaptureSchemaVersion('1.0.0')).toBe(true);
    expect(isValidReadOnlyLiveSnapshotCaptureSource('phase78_read_only_live_snapshot_capture_contracts_v1')).toBe(true);
  });

  it('defines names/kinds and fixture list surfaces', () => {
    expect(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES).toHaveLength(8);
    expect(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS).toHaveLength(8);
    expect(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURE_MAP.size).toBe(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES.length);
    expect(listReadOnlyLiveSnapshotCaptureFixtures()).toBe(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES);
  });

  it('supports get/select/normalize/serialize/equality', () => {
    const fixture = READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES[0]!;
    expect(getReadOnlyLiveSnapshotCaptureFixture(fixture.fixtureId)).toBe(fixture);
    expect(getReadOnlyLiveSnapshotCaptureFixture('unknown')).toBeNull();
    expect(selectReadOnlyLiveSnapshotCaptureFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectReadOnlyLiveSnapshotCaptureFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeReadOnlyLiveSnapshotCaptureFixture(fixture);
    expect(serializeReadOnlyLiveSnapshotCaptureFixture(fixture)).toContain('"fixtureId"');
    expect(areReadOnlyLiveSnapshotCaptureFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('validates fixtures and enforces safety', () => {
    for (const fixture of READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES) {
      expect(validateReadOnlyLiveSnapshotCaptureFixture(fixture).valid).toBe(true);
      expect(validateReadOnlyLiveSnapshotCaptureSafety(fixture).safe).toBe(true);
      expect(fixture.captureGate.unlockAuthority).toBe(false);
      expect(fixture.captureGate.liveCaptureRuntimeAllowed).toBe(false);
      expect(fixture.captureRequest.writeMethodAllowed).toBe(false);
      expect(fixture.captureRequest.dispatchAllowed).toBe(false);
      expect(fixture.captureScope.transactionWriteAllowed).toBe(false);
      expect(fixture.captureBounds.scheduledCaptureAllowed).toBe(false);
      expect(fixture.responseStaging.persisted).toBe(false);
      expect(fixture.promotionCandidate.automaticPromotionAllowed).toBe(false);
      expect(fixture.promotionCandidate.manualReviewRequired).toBe(true);
    }
  });

  it('covers required blocked/review/quarantine scenarios', () => {
    expect(buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'missing-manual-dry-run-readiness-blocked' }).captureGate.gateStatus).toBe('blocked');
    expect(buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'provider-not-eligible-blocked' }).providerTarget.readOnlyEligible).toBe(false);
    expect(buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'capture-scope-too-wide-rejected' }).captureScope.scopeStatus).toBe('rejected');
    expect(buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'staged-response-quarantined' }).responseStaging.stagingStatus).toBe('quarantined');
    expect(buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'schema-validation-warning-review-required' }).schemaValidationContract.validationStatus).toBe('warning');
    expect(buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'promotion-candidate-manual-review-required' }).promotionCandidate.promotionStatus).toBe('review_required');
    expect(buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'unsafe-capability-rejected' }).captureGate.gateStatus).toBe('rejected');
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'read-only-snapshot-capture-ready' });
    const unsafe = {
      ...fixture,
      captureGate: { ...fixture.captureGate, unlockAuthority: true as const },
      captureReport: { ...fixture.captureReport, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(validateReadOnlyLiveSnapshotCaptureFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('UNSAFE_UNLOCK_AUTHORITY')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('builder helpers work and propagation is present', () => {
    expect(buildLiveSnapshotCaptureGate({ captureGateId: 'g', captureGateName: 'n', gateStatus: 'blocked', blockingReasonCodes: ['x'] }).phase).toBe(78);
    expect(buildLiveSnapshotCaptureRequest({ requestId: 'r', requestKind: 'k', targetProviderId: 'p', requestStatus: 'ready' }).readOnly).toBe(true);
    expect(buildLiveSnapshotProviderTarget({ targetId: 't', providerId: 'p', providerKind: 'k', readOnlyEligible: true, capabilityRefs: ['c'] }).providerExpansionAllowed).toBe(false);
    expect(buildLiveSnapshotCaptureScope({ scopeId: 's', scopeKind: 'k', accountSnapshotAllowed: true, mintSnapshotAllowed: true, poolSnapshotAllowed: false, scopeStatus: 'ready' }).transactionWriteAllowed).toBe(false);
    expect(buildLiveSnapshotCaptureBounds({ boundsId: 'b', maxRequestCount: 1, maxObservationCount: 1, deterministicWindowLabel: 'w' }).scheduledCaptureAllowed).toBe(false);
    expect(buildLiveSnapshotResponseStaging({ stagingId: 's', stagedResponseKind: 'k', stagingStatus: 'staged' }).persisted).toBe(false);
    expect(buildLiveSnapshotQuarantineContract({ quarantineId: 'q', quarantined: true, reasonCodes: ['x'] }).promotionAllowed).toBe(false);
    expect(buildLiveSnapshotSchemaValidationContract({ validationId: 'v', schemaVersion: '1.0.0', validationStatus: 'warning', warningCodes: ['x'], reviewRequired: true }).reviewRequired).toBe(true);
    expect(buildLiveSnapshotPromotionCandidate({ candidateId: 'c', promotionStatus: 'review_required' }).manualReviewRequired).toBe(true);
    expect(buildLiveSnapshotFixtureCandidateContract({ fixtureCandidateId: 'f', fixtureCandidatePath: 'fixtures/x.json' }).fixtureCandidateOnly).toBe(true);
    expect(buildLiveSnapshotCaptureCertification({ certificationId: 'c', certificationStatus: 'pass' }).certifiedReadOnly).toBe(true);
    expect(buildLiveSnapshotCaptureReport({ reportId: 'r', gateSummary: 'g', requestSummary: 'r', providerSummary: 'p', scopeSummary: 's', boundsSummary: 'b', stagingSummary: 'st', quarantineSummary: 'q', promotionSummary: 'pr', safetySummary: 'safe' }).reportId).toBe('r');
    expect(buildLiveSnapshotViewModel({ viewModelId: 'v', fixtureId: 'f', fixtureName: 'read-only-snapshot-capture-ready', gateStatus: 'ready', requestStatus: 'ready', promotionStatus: 'candidate' }).summary).toContain('read-only-snapshot-capture-ready');
    expect(buildLiveSnapshotApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);

    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.readOnlyLiveSnapshotCaptureContracts).toBe(true);
    expect(dashboard.liveSnapshotRuntimeCapture).toBe(false);
    expect(api.readOnlyLiveSnapshotCaptureContracts).toBe(true);
    expect(api.liveSnapshotRuntimeCapture).toBe(false);
    expect(getReadOnlyLiveSnapshotCaptureCapabilities().liveSnapshotAutomaticPromotion).toBe(false);
  });

  it('is deterministic, immutable, and avoids runtime randomness/network helpers', () => {
    const a = buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'read-only-snapshot-capture-ready' });
    const b = buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName: 'read-only-snapshot-capture-ready' });
    expect(areReadOnlyLiveSnapshotCaptureFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase77FixtureSnapshot)).toBe(true);
    for (const file of PHASE_78_FILES) {
      const source = readFileSync(resolve(PHASE_78_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\\.now\\(/);
      expect(source).not.toMatch(/Math\\.random\\(/);
      expect(source).not.toMatch(/randomUUID\\(/);
      expect(source).not.toMatch(/\\bfetch\\(/);
    }
  });

  it('documents Phase 79 as preview only and name/kind validators work', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/READ_ONLY_LIVE_SNAPSHOT_CAPTURE.md'), 'utf8');
    expect(doc).toContain('Phase 79');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(isValidReadOnlyLiveSnapshotCaptureName('read-only-snapshot-capture-ready')).toBe(true);
    expect(isValidReadOnlyLiveSnapshotCaptureName('unknown')).toBe(false);
    expect(isValidReadOnlyLiveSnapshotCaptureKind('read_only_snapshot_capture_ready')).toBe(true);
    expect(isValidReadOnlyLiveSnapshotCaptureKind('unknown')).toBe(false);
  });
});
