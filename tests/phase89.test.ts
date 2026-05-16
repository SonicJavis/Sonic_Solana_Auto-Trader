import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT,
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION,
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SOURCE,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURE_MAP,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
  areSafetyGateManualReviewDossierFixturesEqual,
  buildApprovalDenialContract,
  buildDossierGate,
  buildDossierReevaluationLinkage,
  buildEvidencePacket,
  buildReviewDossierHeader,
  buildReviewerChecklist,
  buildSafetyGateManualReviewDossierApiContract,
  buildSafetyGateManualReviewDossierFixture,
  buildSafetyGateManualReviewDossierReport,
  buildSafetyGateManualReviewDossierViewModel,
  buildSignoffPlaceholder,
  buildUnresolvedBlockerSummary,
  getDashboardUiShellCapabilities,
  getSafetyGateManualReviewDossierCapabilities,
  getSafetyGateManualReviewDossierFixture,
  isValidSafetyGateManualReviewDossierGeneratedAt,
  isValidSafetyGateManualReviewDossierKind,
  isValidSafetyGateManualReviewDossierName,
  isValidSafetyGateManualReviewDossierSchemaVersion,
  isValidSafetyGateManualReviewDossierSource,
  listSafetyGateManualReviewDossierFixtures,
  normalizeSafetyGateManualReviewDossierFixture,
  selectSafetyGateManualReviewDossierFixture,
  serializeSafetyGateManualReviewDossierFixture,
  validateSafetyGateManualReviewDossierFixture,
  validateSafetyGateManualReviewDossierSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_89_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/safety-gate-manual-review-dossier');

const PHASE_89_FILES = [
  'types.ts',
  'dossier-gates.ts',
  'review-dossier-headers.ts',
  'reviewer-checklists.ts',
  'evidence-packets.ts',
  'signoff-placeholders.ts',
  'unresolved-blocker-summaries.ts',
  'escalation-review-placeholders.ts',
  'policy-review-placeholders.ts',
  'readiness-review-placeholders.ts',
  'approval-denial-contracts.ts',
  'reevaluation-linkage.ts',
  'feedback-linkage.ts',
  'risk-linkage.ts',
  'outcome-linkage.ts',
  'certification-linkage.ts',
  'audit-trail-linkage.ts',
  'abort-contracts.ts',
  'rollback-contracts.ts',
  'safety-invariants.ts',
  'capability-audits.ts',
  'dossier-scorecards.ts',
  'dossier-reports.ts',
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

describe('Phase 89 — Safety Gate Manual Review Dossier Contracts v1', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_89_FILES) {
      expect(() => readFileSync(resolve(PHASE_89_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() =>
      readFileSync(resolve(REPO_ROOT, 'docs/SAFETY_GATE_MANUAL_REVIEW_DOSSIER.md'), 'utf8'),
    ).not.toThrow();
  });

  it('exposes constants and fixture surfaces', () => {
    expect(SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE).toBe(89);
    expect(PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT).toBe('2026-05-16T00:00:00.000Z');
    expect(PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION).toBe('1.0.0');
    expect(SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES).toHaveLength(8);
    expect(SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS).toHaveLength(8);
    expect(SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURE_MAP.size).toBe(
      SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES.length,
    );
  });

  it('fixtures include required names', () => {
    const names = SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES.map(f => f.fixtureName);
    expect(names).toEqual(expect.arrayContaining(SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES));
  });

  it('list/get/select/normalize/serialize/equality work', () => {
    const fixture = SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES[0]!;
    expect(listSafetyGateManualReviewDossierFixtures()).toBe(SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES);
    expect(getSafetyGateManualReviewDossierFixture(fixture.fixtureId)).toBe(fixture);
    expect(selectSafetyGateManualReviewDossierFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectSafetyGateManualReviewDossierFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeSafetyGateManualReviewDossierFixture(fixture);
    expect(serializeSafetyGateManualReviewDossierFixture(fixture)).toContain('"fixtureId"');
    expect(areSafetyGateManualReviewDossierFixturesEqual(fixture, normalized)).toBe(true);
    expect(areSafetyGateManualReviewDossierFixturesEqual(fixture, SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES[1]!)).toBe(false);
  });

  it('all fixtures validate and pass safety checks', () => {
    for (const fixture of SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES) {
      const validation = validateSafetyGateManualReviewDossierFixture(fixture);
      const errors = validation.issues.filter(i => i.severity === 'error');
      expect(errors, `fixture=${fixture.fixtureName} errors=${JSON.stringify(errors)}`).toHaveLength(0);
      const safety = validateSafetyGateManualReviewDossierSafety(fixture);
      expect(safety.safe, `fixture=${fixture.fixtureName} safety=${JSON.stringify(safety.issues)}`).toBe(true);
    }
  });

  it('all fixtures enforce manual-only dossier controls', () => {
    for (const fixture of SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES) {
      expect(fixture.dossierGate.approvalAuthority).toBe(false);
      expect(fixture.dossierGate.unlockAuthority).toBe(false);
      expect(fixture.dossierGate.automaticApprovalAllowed).toBe(false);
      expect(fixture.dossierGate.automaticUnlockAllowed).toBe(false);
      expect(fixture.reviewDossierHeader.manualReviewRequired).toBe(true);
      expect(fixture.reviewDossierHeader.approvalAuthorizesUnlock).toBe(false);
      expect(fixture.signoffPlaceholder.placeholderOnly).toBe(true);
      expect(fixture.signoffPlaceholder.realSignoffCaptured).toBe(false);
      expect(fixture.signoffPlaceholder.signoffAuthorizesUnlock).toBe(false);
      expect(fixture.unresolvedBlockerSummary.blockersPreserved).toBe(true);
      expect(fixture.unresolvedBlockerSummary.blockerResolutionAllowed).toBe(false);
      expect(fixture.unresolvedBlockerSummary.automaticBlockerClearAllowed).toBe(false);
      expect(fixture.approvalDenialContract.approvalDeniedByDefault).toBe(true);
      expect(fixture.approvalDenialContract.automaticApprovalBlocked).toBe(true);
      expect(fixture.approvalDenialContract.unlockBlocked).toBe(true);
    }
  });

  it('all fixtures include dossier/feedback/risk/outcome/certification linkages', () => {
    for (const fixture of SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES) {
      expect(fixture.reevaluationLinkage.sourceReevaluationPhase).toBe(88);
      expect(fixture.feedbackLinkage.sourceFeedbackPhase).toBe(87);
      expect(fixture.riskLinkage.sourceRiskPhases).toEqual(expect.arrayContaining([58, 59]));
      expect(fixture.outcomeLinkage.sourceOutcomePhase).toBe(86);
      expect(fixture.certificationLinkage.sourceCertPhases).toEqual(expect.arrayContaining([75, 69]));
      expect(fixture.reevaluationLinkage.liveGateStatusFetchAllowed).toBe(false);
      expect(fixture.feedbackLinkage.liveFeedbackLookupAllowed).toBe(false);
      expect(fixture.riskLinkage.liveRiskUpdateAllowed).toBe(false);
      expect(fixture.outcomeLinkage.liveOutcomeLookupAllowed).toBe(false);
      expect(fixture.certificationLinkage.liveCertificationLookupAllowed).toBe(false);
    }
  });

  it('source snapshots are immutable and include phase 88/87/86', () => {
    const fixture = SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES[0]!;
    expect(Object.isFrozen(fixture.sourcePhase88FixtureSnapshot)).toBe(true);
    expect(Object.isFrozen(fixture.sourcePhase87FixtureSnapshot)).toBe(true);
    expect(Object.isFrozen(fixture.sourcePhase86FixtureSnapshot)).toBe(true);
    expect(fixture.sourcePhase88FixtureSnapshot.length).toBeGreaterThanOrEqual(1);
  });

  it('fixture rebuilds deterministically', () => {
    const a = buildSafetyGateManualReviewDossierFixture({ fixtureName: 'manual-review-dossier-ready' });
    const b = buildSafetyGateManualReviewDossierFixture({ fixtureName: 'manual-review-dossier-ready' });
    expect(areSafetyGateManualReviewDossierFixturesEqual(a, b)).toBe(true);
    expect(a.checksum).toBe(b.checksum);
    expect(a.meta.generatedAt).toBe(b.meta.generatedAt);
  });

  it('builders return expected contract shapes', () => {
    const gate = buildDossierGate({ id: 'g', name: 'G', gateStatus: 'ready' });
    expect(gate.approvalAuthority).toBe(false);

    const header = buildReviewDossierHeader({
      id: 'h',
      dossierName: 'd',
      sourceReevaluationFixtureRef: 'phase88-x',
      sourceFeedbackFixtureRef: 'phase87-y',
    });
    expect(header.manualReviewRequired).toBe(true);

    const checklist = buildReviewerChecklist({ id: 'c' });
    expect(checklist.makerCheckerRequired).toBe(true);

    const evidence = buildEvidencePacket({ id: 'e' });
    expect(evidence.evidenceComplete).toBe(false);

    const signoff = buildSignoffPlaceholder({ id: 's' });
    expect(signoff.separateFuturePhaseRequired).toBe(true);

    const blocker = buildUnresolvedBlockerSummary({ id: 'b' });
    expect(blocker.automaticBlockerClearAllowed).toBe(false);

    const denial = buildApprovalDenialContract({ id: 'a' });
    expect(denial.approvalDeniedByDefault).toBe(true);

    const reeval = buildDossierReevaluationLinkage({
      id: 'r',
      sourceReevaluationFixtureRefs: ['reevaluation-design-ready'],
      linkageStatus: 'linked',
    });
    expect(reeval.sourceReevaluationPhase).toBe(88);

    const report = buildSafetyGateManualReviewDossierReport({
      id: 'rep',
      gateSummary: 'g',
      headerSummary: 'h',
      checklistSummary: 'c',
      evidenceSummary: 'e',
      signoffSummary: 's',
      blockerSummary: 'b',
      approvalDenialSummary: 'a',
      linkageSummary: 'l',
      safetySummary: 'safe',
    });
    expect(report.phase).toBe(89);

    const vm = buildSafetyGateManualReviewDossierViewModel(SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES[0]!);
    expect(vm.phase).toBe(89);

    const api = buildSafetyGateManualReviewDossierApiContract({
      fixtureId: 'phase89-manual-review-dossier-ready',
      fixtureIds: ['phase89-manual-review-dossier-ready'],
    });
    expect(api.list.statusCode).toBe(200);
  });

  it('normalization validators work', () => {
    expect(isValidSafetyGateManualReviewDossierName('manual-review-dossier-ready')).toBe(true);
    expect(isValidSafetyGateManualReviewDossierName('invalid')).toBe(false);
    expect(isValidSafetyGateManualReviewDossierKind('manual_review_dossier_ready')).toBe(true);
    expect(isValidSafetyGateManualReviewDossierKind('invalid')).toBe(false);
    expect(isValidSafetyGateManualReviewDossierGeneratedAt('2026-05-16T00:00:00.000Z')).toBe(true);
    expect(isValidSafetyGateManualReviewDossierSchemaVersion(PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION)).toBe(true);
    expect(isValidSafetyGateManualReviewDossierSource(PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SOURCE)).toBe(true);
  });

  it('capabilities expose phase 89 flags', () => {
    const caps = getSafetyGateManualReviewDossierCapabilities();
    expect(caps.safetyGateManualReviewDossierContracts).toBe(true);
    expect(caps.deterministicManualReviewDossierFixtures).toBe(true);
    expect(caps.dossierApprovalAuthority).toBe(false);
    expect(caps.dossierAutomaticApproval).toBe(false);
    expect(caps.dossierAutomaticUnlock).toBe(false);
    expect(caps.dossierAutomaticGateMutation).toBe(false);
    expect(caps.dossierProviderExpansion).toBe(false);
    expect(caps.dossierBackgroundJobs).toBe(false);
  });

  it('dashboard and read-only-api capabilities propagate phase 89 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities();
    expect(dashboardCaps.safetyGateManualReviewDossierContracts).toBe(true);
    expect(dashboardCaps.dossierAutomaticApproval).toBe(false);

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps.safetyGateManualReviewDossierContracts).toBe(true);
    expect(apiCaps.dossierAutomaticApproval).toBe(false);
    expect(apiCaps.dossierAutomaticUnlock).toBe(false);
  });

  it('validation rejects wrong phase and unsafe denials', () => {
    const base = SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES[0]!;

    const wrongPhase = validateSafetyGateManualReviewDossierFixture({ ...base, phase: 1 as 89 });
    expect(wrongPhase.valid).toBe(false);
    expect(wrongPhase.issues.map(i => i.code)).toContain('WRONG_PHASE');

    const unsafeApproval = validateSafetyGateManualReviewDossierFixture({
      ...base,
      dossierGate: { ...base.dossierGate, approvalAuthority: true as false },
    });
    expect(unsafeApproval.valid).toBe(false);

    const unsafeUnlock = validateSafetyGateManualReviewDossierFixture({
      ...base,
      dossierGate: { ...base.dossierGate, unlockAuthority: true as false },
    });
    expect(unsafeUnlock.valid).toBe(false);

    const unsafeAutoApproval = validateSafetyGateManualReviewDossierFixture({
      ...base,
      dossierGate: { ...base.dossierGate, automaticApprovalAllowed: true as false },
    });
    expect(unsafeAutoApproval.valid).toBe(false);

    const unsafeChecklistLookup = validateSafetyGateManualReviewDossierFixture({
      ...base,
      reviewerChecklist: { ...base.reviewerChecklist, liveReviewerLookupAllowed: true as false },
    });
    expect(unsafeChecklistLookup.valid).toBe(false);

    const unsafeSignoff = validateSafetyGateManualReviewDossierFixture({
      ...base,
      signoffPlaceholder: { ...base.signoffPlaceholder, realSignoffCaptured: true as false },
    });
    expect(unsafeSignoff.valid).toBe(false);

    const unsafeBlocker = validateSafetyGateManualReviewDossierFixture({
      ...base,
      unresolvedBlockerSummary: { ...base.unresolvedBlockerSummary, automaticBlockerClearAllowed: true as false },
    });
    expect(unsafeBlocker.valid).toBe(false);

    const unsafeDeniedByDefault = validateSafetyGateManualReviewDossierFixture({
      ...base,
      approvalDenialContract: { ...base.approvalDenialContract, approvalDeniedByDefault: false as true },
    });
    expect(unsafeDeniedByDefault.valid).toBe(false);

    const unsafeCaps = validateSafetyGateManualReviewDossierFixture({
      ...base,
      capabilities: { ...base.capabilities, dossierNetworkRead: true as false },
    });
    expect(unsafeCaps.valid).toBe(false);

    const unsafeSafety = validateSafetyGateManualReviewDossierSafety({
      ...base,
      safetyInvariants: { ...base.safetyInvariants, signingAllowed: true as false },
    });
    expect(unsafeSafety.safe).toBe(false);
  });
});
