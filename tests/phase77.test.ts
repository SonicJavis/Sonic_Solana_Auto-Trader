import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURE_MAP,
  MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES,
  MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS,
  MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES,
  MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE,
  PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT,
  areManualConfirmDryRunControlFixturesEqual,
  buildManualConfirmAbortContract,
  buildManualConfirmCancellationContract,
  buildManualConfirmConfirmationSnapshot,
  buildManualConfirmDispatchBlock,
  buildManualConfirmDryRunApiContract,
  buildManualConfirmDryRunCapabilityAudit,
  buildManualConfirmDryRunControl,
  buildManualConfirmDryRunControlFixture,
  buildManualConfirmDryRunEvidence,
  buildManualConfirmDryRunGate,
  buildManualConfirmDryRunPreflight,
  buildManualConfirmDryRunReport,
  buildManualConfirmDryRunSafetyInvariant,
  buildManualConfirmDryRunViewModel,
  buildManualConfirmOperatorIntent,
  buildManualConfirmSimulatedDecision,
  getDashboardUiShellCapabilities,
  getManualConfirmDryRunControlCapabilities,
  getManualConfirmDryRunControlFixture,
  isValidManualConfirmDryRunControlGeneratedAt,
  isValidManualConfirmDryRunControlKind,
  isValidManualConfirmDryRunControlName,
  isValidManualConfirmDryRunControlSchemaVersion,
  isValidManualConfirmDryRunControlSource,
  listManualConfirmDryRunControlFixtures,
  normalizeManualConfirmDryRunControlFixture,
  selectManualConfirmDryRunControlFixture,
  serializeManualConfirmDryRunControlFixture,
  validateManualConfirmDryRunControlFixture,
  validateManualConfirmDryRunControlSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_77_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/manual-confirm-dry-run-control');

const PHASE_77_FILES = [
  'types.ts',
  'dry-run-gates.ts',
  'intent-contracts.ts',
  'operator-intents.ts',
  'dry-run-preflight.ts',
  'dry-run-controls.ts',
  'dispatch-blocks.ts',
  'abort-contracts.ts',
  'cancellation-contracts.ts',
  'confirmation-snapshots.ts',
  'simulated-decisions.ts',
  'dry-run-evidence.ts',
  'safety-invariants.ts',
  'capability-audits.ts',
  'readiness-linkage.ts',
  'certification-linkage.ts',
  'smoke-linkage.ts',
  'replay-linkage.ts',
  'scorecards.ts',
  'dry-run-reports.ts',
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

describe('Phase 77 — Manual-Confirm Live Dry-Run Control Contracts', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_77_FILES) {
      expect(() => readFileSync(resolve(PHASE_77_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() => readFileSync(resolve(REPO_ROOT, 'docs/MANUAL_CONFIRM_DRY_RUN_CONTROL.md'), 'utf8')).not.toThrow();
  });

  it('has constants and deterministic generated timestamp', () => {
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE).toBe(77);
    expect(PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
    expect(isValidManualConfirmDryRunControlGeneratedAt(PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT)).toBe(true);
    expect(isValidManualConfirmDryRunControlSchemaVersion('1.0.0')).toBe(true);
    expect(isValidManualConfirmDryRunControlSource('phase77_manual_confirm_dry_run_control_contracts_v1')).toBe(true);
  });

  it('defines 8 required names and kinds', () => {
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toHaveLength(8);
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS).toHaveLength(8);
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toContain('dry-run-control-ready');
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toContain('missing-manual-confirm-readiness-blocked');
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toContain('preflight-evidence-incomplete-blocked');
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toContain('dispatch-attempt-blocked');
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toContain('cancellation-requested-safe');
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toContain('abort-state-ready');
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toContain('unsafe-capability-rejected');
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES).toContain('documentation-review-required');
  });

  it('builds and exposes fixture list/map/get surfaces', () => {
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURE_MAP.size).toBe(MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES.length);
    expect(listManualConfirmDryRunControlFixtures()).toBe(MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES);

    const first = MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES[0]!;
    expect(getManualConfirmDryRunControlFixture(first.fixtureId)).toBe(first);
    expect(getManualConfirmDryRunControlFixture('unknown')).toBeNull();
  });

  it('supports selectors and normalization/serialization/equality', () => {
    const fixture = MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES[0]!;
    const hit = selectManualConfirmDryRunControlFixture({ fixtureName: fixture.fixtureName });
    expect(hit.matched).toBe(true);
    const miss = selectManualConfirmDryRunControlFixture({ fixtureId: 'missing' });
    expect(miss.matched).toBe(false);

    const normalized = normalizeManualConfirmDryRunControlFixture(fixture);
    const serialized = serializeManualConfirmDryRunControlFixture(fixture);
    expect(serialized).toContain('"fixtureId"');
    expect(areManualConfirmDryRunControlFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('validates fixtures and safety', () => {
    for (const fixture of MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES) {
      const valid = validateManualConfirmDryRunControlFixture(fixture);
      expect(valid.valid).toBe(true);
      const safety = validateManualConfirmDryRunControlSafety(fixture);
      expect(safety.safe).toBe(true);
    }
  });

  it('enforces fail-closed, no unlock, no dispatch/execution, no manual-live implementation', () => {
    for (const fixture of MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES) {
      expect(fixture.dryRunGate.failClosed).toBe(true);
      expect(fixture.dryRunGate.unlockAuthority).toBe(false);
      expect(fixture.dryRunControl.dispatchAllowed).toBe(false);
      expect(fixture.dryRunControl.executionAllowed).toBe(false);
      expect(fixture.operatorIntent.orderCreationAllowed).toBe(false);
      expect(fixture.operatorIntent.transactionConstructionAllowed).toBe(false);
      expect(fixture.dispatchBlock.dispatchBlocked).toBe(true);
      expect(fixture.dispatchBlock.transactionSendBlocked).toBe(true);
      expect(fixture.safety.noLiveNetwork).toBe(true);
      expect(fixture.capabilityFlags.manualConfirmDryRunManualTradingImplementation).toBe(false);
      expect(fixture.capabilityFlags.manualConfirmDryRunLimitedLiveUnlock).toBe(false);
      expect(fixture.capabilityFlags.manualConfirmDryRunFullAutoUnlock).toBe(false);
      expect(fixture.capabilityFlags.manualConfirmDryRunExecution).toBe(false);
      expect(fixture.capabilityFlags.manualConfirmDryRunDispatch).toBe(false);
    }
  });

  it('covers specific blocked/abort/cancel scenarios', () => {
    const missing = buildManualConfirmDryRunControlFixture({ fixtureName: 'missing-manual-confirm-readiness-blocked' });
    expect(missing.dryRunGate.gateStatus).toBe('blocked');

    const evidence = buildManualConfirmDryRunControlFixture({ fixtureName: 'preflight-evidence-incomplete-blocked' });
    expect(evidence.dryRunEvidence.evidenceComplete).toBe(false);

    const dispatch = buildManualConfirmDryRunControlFixture({ fixtureName: 'dispatch-attempt-blocked' });
    expect(dispatch.dispatchBlock.reasonCodes).toContain('DISPATCH_ATTEMPT_BLOCKED');

    const cancel = buildManualConfirmDryRunControlFixture({ fixtureName: 'cancellation-requested-safe' });
    expect(cancel.cancellationContract.status).toBe('cancelled');

    const abort = buildManualConfirmDryRunControlFixture({ fixtureName: 'abort-state-ready' });
    expect(abort.abortContract.status).toBe('aborted');
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildManualConfirmDryRunControlFixture({ fixtureName: 'dry-run-control-ready' });
    const unsafe = {
      ...fixture,
      dryRunGate: { ...fixture.dryRunGate, unlockAuthority: true as true },
      dryRunReport: { ...fixture.dryRunReport, decisionSummary: 'profit signal recommendation output' },
    };
    const result = validateManualConfirmDryRunControlFixture(unsafe as never);
    const codes = new Set(result.issues.map(issue => issue.code));
    expect(codes.has('UNSAFE_UNLOCK_AUTHORITY')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('builder helpers produce expected contracts', () => {
    expect(buildManualConfirmDryRunGate({
      dryRunGateId: 'g',
      dryRunGateName: 'gate',
      dryRunGateKind: 'k',
      gateStatus: 'blocked',
      blockingReasonCodes: ['X'],
    }).dryRunOnly).toBe(true);

    expect(buildManualConfirmOperatorIntent({
      intentId: 'i',
      intentKind: 'k',
      operatorIntentLabel: 'label',
      intentStatus: 'ready',
    }).dispatchAllowed).toBe(false);

    expect(buildManualConfirmDryRunPreflight({
      preflightId: 'p',
      sourceReadinessRefs: ['r'],
      sourceCertificationRefs: ['c'],
      sourceSmokeRefs: ['s'],
      preflightStatus: 'ready',
    }).failClosed).toBe(true);

    expect(buildManualConfirmDryRunControl({
      controlId: 'c',
      controlKind: 'k',
      controlStatus: 'ready',
    }).liveNetworkAllowed).toBe(false);

    expect(buildManualConfirmDispatchBlock({
      blockId: 'b',
      blockKind: 'k',
      reasonCodes: ['x'],
      safetyNotes: ['y'],
    }).dispatchBlocked).toBe(true);

    expect(buildManualConfirmAbortContract({ abortId: 'a', status: 'ready' }).abortAllowed).toBe(true);
    expect(buildManualConfirmCancellationContract({ cancellationId: 'c', status: 'ready' }).cancellationAllowed).toBe(true);

    expect(buildManualConfirmConfirmationSnapshot({
      snapshotId: 's',
      sourceManualConfirmReadinessRef: 'r',
      phraseSnapshotRef: 'p',
      roleSeparationSnapshotRef: 'rs',
      coolingOffSnapshotRef: 'co',
      snapshotStatus: 'ready',
    }).snapshotStatus).toBe('ready');

    expect(buildManualConfirmSimulatedDecision({
      decisionId: 'd',
      decisionKind: 'k',
      decisionStatus: 'ready',
    }).signalOutput).toBe(false);

    expect(buildManualConfirmDryRunEvidence({
      evidenceBundleId: 'e',
      sourcePhaseRefs: ['p'],
      sourceFixtureRefs: ['f'],
      validationCommandRefs: ['v'],
      safetyGrepRefs: ['g'],
      docsRefs: ['d'],
      evidenceComplete: true,
    }).evidenceComplete).toBe(true);

    expect(buildManualConfirmDryRunCapabilityAudit({ auditId: 'a', auditStatus: 'pass' }).noExecution).toBe(true);
    expect(buildManualConfirmDryRunSafetyInvariant({ invariantId: 'i', invariantKind: 'k', invariantHolds: true, evidenceRef: 'e' }).failClosed).toBe(true);
    expect(buildManualConfirmDryRunReport({
      reportId: 'r',
      gateSummary: 'g',
      intentSummary: 'i',
      preflightSummary: 'p',
      controlSummary: 'c',
      dispatchBlockSummary: 'd',
      abortSummary: 'a',
      decisionSummary: 'de',
      evidenceSummary: 'e',
      safetySummary: 's',
    }).reportId).toBe('r');

    expect(buildManualConfirmDryRunViewModel({
      viewModelId: 'v',
      fixtureId: 'f',
      fixtureName: 'dry-run-control-ready',
      gateStatus: 'ready',
      preflightStatus: 'ready',
      controlStatus: 'ready',
    }).summary).toContain('dry-run-control-ready');

    expect(buildManualConfirmDryRunApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);
  });

  it('propagates phase77 capabilities to dashboard and read-only-api roots', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();

    expect(dashboard.manualConfirmDryRunControlContracts).toBe(true);
    expect(dashboard.manualConfirmDryRunExecution).toBe(false);
    expect(dashboard.manualConfirmDryRunRecommendations).toBe(false);
    expect(api.manualConfirmDryRunControlContracts).toBe(true);
    expect(api.manualConfirmDryRunExecution).toBe(false);
  });

  it('module capabilities include all required positive/negative flags', () => {
    const caps = getManualConfirmDryRunControlCapabilities();
    expect(caps.manualConfirmDryRunControlContracts).toBe(true);
    expect(caps.manualConfirmDryRunSelectors).toBe(true);
    expect(caps.manualConfirmDryRunOrderCreation).toBe(false);
    expect(caps.manualConfirmDryRunTransactionSending).toBe(false);
    expect(caps.manualConfirmDryRunLiveTrading).toBe(false);
    expect(caps.manualConfirmDryRunApiKeyRequired).toBe(false);
  });

  it('deterministic repeated builds are stable and source snapshots immutable', () => {
    const a = buildManualConfirmDryRunControlFixture({ fixtureName: 'dry-run-control-ready' });
    const b = buildManualConfirmDryRunControlFixture({ fixtureName: 'dry-run-control-ready' });
    expect(areManualConfirmDryRunControlFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase76FixtureSnapshot)).toBe(true);
  });

  it('has no Date.now/Math.random/randomUUID and no live network helper code in phase77 module', () => {
    for (const file of PHASE_77_FILES) {
      const source = readFileSync(resolve(PHASE_77_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\(/);
    }
  });

  it('documents Phase 78 as preview only', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/MANUAL_CONFIRM_DRY_RUN_CONTROL.md'), 'utf8');
    expect(doc).toContain('Phase 78');
    expect(doc.toLowerCase()).toContain('preview only');
  });

  it('name/kind validators work', () => {
    expect(isValidManualConfirmDryRunControlName('dry-run-control-ready')).toBe(true);
    expect(isValidManualConfirmDryRunControlName('unknown')).toBe(false);
    expect(isValidManualConfirmDryRunControlKind('dry_run_control_ready')).toBe(true);
    expect(isValidManualConfirmDryRunControlKind('unknown')).toBe(false);
  });
});
