import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PRE_LIVE_SAFETY_CERTIFICATION_FIXTURE_MAP,
  PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES,
  PRE_LIVE_SAFETY_CERTIFICATION_KINDS,
  PRE_LIVE_SAFETY_CERTIFICATION_NAMES,
  PRE_LIVE_SAFETY_CERTIFICATION_PHASE,
  PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT,
  arePreLiveSafetyCertificationFixturesEqual,
  buildPreLiveApiContract,
  buildPreLiveApprovalPolicy,
  buildPreLiveCapabilityAudit,
  buildPreLiveCertificationContract,
  buildPreLiveCertificationReport,
  buildPreLiveCertificationScorecard,
  buildPreLiveEvidenceBundle,
  buildPreLiveReadinessChecklist,
  buildPreLiveRejectionContract,
  buildPreLiveReplayReadinessLinkage,
  buildPreLiveReport,
  buildPreLiveRiskReadinessLinkage,
  buildPreLiveSafetyCertificationFixture,
  buildPreLiveSafetyGate,
  buildPreLiveSafetyInvariant,
  buildPreLiveScenarioReadinessLinkage,
  buildPreLiveSignoffModel,
  buildPreLiveSmokeReadinessLinkage,
  buildPreLiveViewModel,
  getDashboardUiShellCapabilities,
  getPreLiveSafetyCertificationCapabilities,
  getPreLiveSafetyCertificationFixture,
  isValidPreLiveSafetyCertificationGeneratedAt,
  isValidPreLiveSafetyCertificationKind,
  isValidPreLiveSafetyCertificationName,
  isValidPreLiveSafetyCertificationSchemaVersion,
  isValidPreLiveSafetyCertificationSource,
  listPreLiveSafetyCertificationFixtures,
  normalizePreLiveSafetyCertificationFixture,
  selectPreLiveSafetyCertificationFixture,
  serializePreLiveSafetyCertificationFixture,
  validatePreLiveSafetyCertificationFixture,
  validatePreLiveSafetyCertificationSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';
import { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES } from '../apps/dashboard/src/controlled-live-smoke-harness/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../apps/dashboard/src/cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../apps/dashboard/src/first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES } from '../apps/dashboard/src/historical-snapshot-ingestion-contracts/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../apps/dashboard/src/historical-snapshot-scenario-generator/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../apps/dashboard/src/live-smoke-safety-certification/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../apps/dashboard/src/multi-provider-read-only-foundation/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../apps/dashboard/src/provider-aware-replay-import-contracts/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../apps/dashboard/src/provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../apps/dashboard/src/provider-reliability-drift-audit/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_75_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/pre-live-safety-certification');
const PHASE_75_FILES = [
  'types.ts',
  'safety-gates.ts',
  'readiness-checklists.ts',
  'certification-contracts.ts',
  'evidence-bundles.ts',
  'signoff-models.ts',
  'approval-policies.ts',
  'rejection-contracts.ts',
  'capability-audits.ts',
  'safety-invariants.ts',
  'provider-readiness-linkage.ts',
  'replay-readiness-linkage.ts',
  'scenario-readiness-linkage.ts',
  'smoke-readiness-linkage.ts',
  'risk-readiness-linkage.ts',
  'scorecards.ts',
  'certification-reports.ts',
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
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 75 — Pre-Live Safety Review Gate and Read-Only Certification v1', () => {
  it('all expected files exist', () => {
    for (const file of PHASE_75_FILES) {
      const path = resolve(PHASE_75_SRC, file);
      expect(() => readFileSync(path, 'utf8')).not.toThrow();
    }
  });

  it('phase constants are correct', () => {
    expect(PRE_LIVE_SAFETY_CERTIFICATION_PHASE).toBe(75);
    expect(PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
    expect(PRE_LIVE_SAFETY_CERTIFICATION_NAMES).toHaveLength(8);
    expect(PRE_LIVE_SAFETY_CERTIFICATION_KINDS).toHaveLength(8);
  });

  it('contains required fixture names', () => {
    const required = [
      'complete-read-only-certification-ready',
      'missing-smoke-certification-blocked',
      'replay-import-incomplete-blocked',
      'reliability-drift-warning-review-required',
      'unsafe-capability-rejected',
      'missing-codeql-review-blocked',
      'manual-approval-required-pending',
      'documentation-gap-warning',
    ];
    for (const name of required) {
      expect(PRE_LIVE_SAFETY_CERTIFICATION_NAMES).toContain(name);
    }
  });

  it('fixtures/map/list/get are stable', () => {
    expect(PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.length).toBe(8);
    expect(PRE_LIVE_SAFETY_CERTIFICATION_FIXTURE_MAP.size).toBe(8);
    expect(listPreLiveSafetyCertificationFixtures()).toHaveLength(8);
    for (const fixture of PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES) {
      expect(getPreLiveSafetyCertificationFixture(fixture.fixtureId)?.fixtureId).toBe(fixture.fixtureId);
    }
  });

  it('fixtures are fail-closed and non-unlocking', () => {
    for (const fixture of PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES) {
      expect(fixture.safetyGate.failClosed).toBe(true);
      expect(fixture.safetyGate.unlockAuthority).toBe(false);
      expect(fixture.safetyGate.liveTradingAllowed).toBe(false);
      expect(fixture.safetyGate.manualTradingAllowed).toBe(false);
      expect(fixture.safetyGate.executionAllowed).toBe(false);
      expect(fixture.approvalPolicy.fullAutoUnlockAllowed).toBe(false);
      expect(fixture.approvalPolicy.limitedLiveUnlockAllowed).toBe(false);
      expect(fixture.certificationContract.certificationDoesNotUnlockLive).toBe(true);
      expect(fixture.capabilityAudit.noExecution).toBe(true);
      expect(fixture.safety.notExecutable).toBe(true);
      expect(fixture.safety.nonAdvisory).toBe(true);
    }
  });

  it('has blocked/rejected required behaviors', () => {
    const missingSmoke = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'missing-smoke-certification-blocked',
    )!;
    expect(missingSmoke.safetyGate.gateStatus).toBe('blocked');
    expect(missingSmoke.smokeReadinessLinkage.smokeCertified).toBe(false);

    const replayBlocked = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'replay-import-incomplete-blocked',
    )!;
    expect(replayBlocked.safetyGate.gateStatus).toBe('blocked');
    expect(replayBlocked.replayReadinessLinkage.replayImportComplete).toBe(false);

    const unsafeRejected = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'unsafe-capability-rejected',
    )!;
    expect(unsafeRejected.safetyGate.gateStatus).toBe('rejected');
    expect(unsafeRejected.rejectionContract.rejectionKind).toBe('unsafe_capability');

    const missingReview = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'missing-codeql-review-blocked',
    )!;
    expect(missingReview.evidenceBundle.reviewRefs.join('|')).toMatch(/missing/);

    const manualPending = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'manual-approval-required-pending',
    )!;
    expect(manualPending.signoffModel.signoffStatus).toBe('pending_manual_review');
  });

  it('builders are callable', () => {
    const fixture = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES[0]!;
    expect(buildPreLiveSafetyGate(fixture.safetyGate).phase).toBe(75);
    expect(buildPreLiveReadinessChecklist(fixture.readinessChecklist).failClosed).toBe(true);
    expect(buildPreLiveCertificationContract(fixture.certificationContract).certificationDoesNotUnlockLive).toBe(true);
    expect(buildPreLiveEvidenceBundle(fixture.evidenceBundle).evidenceBundleId).toBeTruthy();
    expect(buildPreLiveSignoffModel(fixture.signoffModel).requiresManualReview).toBe(true);
    expect(buildPreLiveApprovalPolicy(fixture.approvalPolicy).manualApprovalRequired).toBe(true);
    expect(buildPreLiveRejectionContract(fixture.rejectionContract).failClosed).toBe(true);
    expect(buildPreLiveCapabilityAudit(fixture.capabilityAudit).readOnlyDefault).toBe(true);
    expect(buildPreLiveSafetyInvariant(fixture.safetyInvariant).required).toBe(true);
    expect(buildPreLiveReplayReadinessLinkage(fixture.replayReadinessLinkage).linkageId).toBeTruthy();
    expect(buildPreLiveScenarioReadinessLinkage(fixture.scenarioReadinessLinkage).linkageId).toBeTruthy();
    expect(buildPreLiveSmokeReadinessLinkage(fixture.smokeReadinessLinkage).linkageId).toBeTruthy();
    expect(buildPreLiveRiskReadinessLinkage(fixture.riskReadinessLinkage).linkageId).toBeTruthy();
    expect(buildPreLiveCertificationScorecard(fixture.scorecard).failClosed).toBe(true);
    expect(buildPreLiveCertificationReport(fixture.certificationReport).reportId).toBeTruthy();
    expect(buildPreLiveReport(fixture.report).reportId).toBeTruthy();
    expect(buildPreLiveViewModel(fixture.viewModel).fixtureName).toBe(fixture.fixtureName);
    expect(
      buildPreLiveApiContract({ fixtureId: fixture.fixtureId, viewModel: fixture.viewModel, fixtureIds: [fixture.fixtureId] })
        .list.data.totalCount,
    ).toBe(1);
  });

  it('selectors/normalization/serialization/equality are deterministic', () => {
    const fixture = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES[0]!;
    const selected = selectPreLiveSafetyCertificationFixture({ fixtureId: fixture.fixtureId });
    expect(selected.matched).toBe(true);
    const miss = selectPreLiveSafetyCertificationFixture({ fixtureId: 'missing' });
    expect(miss.matched).toBe(false);

    const normalized = normalizePreLiveSafetyCertificationFixture(fixture);
    const serialized = serializePreLiveSafetyCertificationFixture(normalized);
    expect(serialized).toContain(fixture.fixtureId);
    expect(arePreLiveSafetyCertificationFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('validation passes for baseline fixtures', () => {
    for (const fixture of PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES) {
      expect(validatePreLiveSafetyCertificationFixture(fixture).valid).toBe(true);
      expect(validatePreLiveSafetyCertificationSafety(fixture).safe).toBe(true);
    }
  });

  it('validation rejects unsafe state changes', () => {
    const fixture = clone(PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES[0]!);
    fixture.safetyGate.liveTradingAllowed = true as never;
    const result = validatePreLiveSafetyCertificationFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_LIVE_TRADING')).toBe(true);
  });

  it('validation rejects advisory/profit language', () => {
    const fixture = clone(PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES[0]!);
    fixture.certificationReport.safetySummary = 'profit advice' as never;
    const result = validatePreLiveSafetyCertificationFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
  });

  it('validation rejects ready state missing smoke/replay linkage completeness', () => {
    const fixture = clone(PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES[0]!);
    fixture.smokeReadinessLinkage.smokeCertified = false as never;
    fixture.replayReadinessLinkage.replayImportComplete = false as never;
    const result = validatePreLiveSafetyCertificationFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'SMOKE_CERTIFICATION_MISSING_WHILE_READY')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'REPLAY_IMPORT_INCOMPLETE_WHILE_READY')).toBe(true);
  });

  it('source linkage names are valid where practical', () => {
    for (const fixture of PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES) {
      for (const name of fixture.sourcePhase65FixtureSnapshot) expect(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES).toContain(name);
      for (const name of fixture.sourcePhase66FixtureSnapshot) expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain(name);
      for (const name of fixture.sourcePhase67FixtureSnapshot) expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain(name);
      for (const name of fixture.sourcePhase68FixtureSnapshot) expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain(name);
      for (const name of fixture.sourcePhase69FixtureSnapshot) expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain(name);
      for (const name of fixture.sourcePhase70FixtureSnapshot) expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain(name);
      for (const name of fixture.sourcePhase71FixtureSnapshot) expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain(name);
      for (const name of fixture.sourcePhase72FixtureSnapshot) expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain(name);
      for (const name of fixture.sourcePhase73FixtureSnapshot) expect(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES).toContain(name);
      for (const name of fixture.sourcePhase74FixtureSnapshot) expect(CONTROLLED_LIVE_SMOKE_HARNESS_NAMES).toContain(name);
    }
  });

  it('determinism and source immutability hold', () => {
    for (const name of PRE_LIVE_SAFETY_CERTIFICATION_NAMES) {
      const a = buildPreLiveSafetyCertificationFixture({ fixtureName: name });
      const b = buildPreLiveSafetyCertificationFixture({ fixtureName: name });
      expect(arePreLiveSafetyCertificationFixturesEqual(a, b)).toBe(true);
    }

    const original = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.map(fixture =>
      serializePreLiveSafetyCertificationFixture(fixture),
    );
    listPreLiveSafetyCertificationFixtures();
    const after = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.map(fixture =>
      serializePreLiveSafetyCertificationFixture(fixture),
    );
    expect(after).toEqual(original);
  });

  it('capability flags are surfaced and locked safely', () => {
    const caps = getPreLiveSafetyCertificationCapabilities();
    expect(caps.preLiveSafetyCertification).toBe(true);
    expect(caps.preLiveCertificationReports).toBe(true);
    expect(caps.preLiveUnlockAuthority).toBe(false);
    expect(caps.preLiveExecution).toBe(false);
    expect(caps.preLiveLiveTrading).toBe(false);
    expect(caps.preLiveManualTrading).toBe(false);
    expect(caps.preLiveFullAutoUnlock).toBe(false);
    expect(caps.preLiveLimitedLiveUnlock).toBe(false);
  });

  it('dashboard/read-only API capability propagation includes phase75', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['preLiveSafetyCertification']).toBe(true);
    expect(dashboardCaps['preLiveExecution']).toBe(false);
    expect(apiCaps['preLiveSafetyCertification']).toBe(true);
    expect(apiCaps['preLiveExecution']).toBe(false);
  });

  it('validators for constants work', () => {
    const fixture = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES[0]!;
    expect(isValidPreLiveSafetyCertificationName(fixture.fixtureName)).toBe(true);
    expect(isValidPreLiveSafetyCertificationKind(fixture.fixtureKind)).toBe(true);
    expect(isValidPreLiveSafetyCertificationGeneratedAt(fixture.meta.generatedAt)).toBe(true);
    expect(isValidPreLiveSafetyCertificationSource(fixture.meta.source)).toBe(true);
    expect(isValidPreLiveSafetyCertificationSchemaVersion(fixture.schemaVersion)).toBe(true);
  });

  it('module source avoids non-deterministic primitives and runtime behavior', () => {
    for (const file of PHASE_75_FILES) {
      const content = readFileSync(resolve(PHASE_75_SRC, file), 'utf8');
      expect(content).not.toMatch(/Date\.now\(\)/);
      expect(content).not.toMatch(/Math\.random\(\)/);
      expect(content).not.toMatch(/randomUUID\(\)/);
      expect(content).not.toMatch(/setInterval|setTimeout/);
    }
  });

  it('Phase 76 remains preview only (not implemented)', () => {
    expect(() =>
      readFileSync(resolve(REPO_ROOT, 'apps/dashboard/src/manual-confirm-live-readiness-contracts'), 'utf8'),
    ).toThrow();
  });
});
