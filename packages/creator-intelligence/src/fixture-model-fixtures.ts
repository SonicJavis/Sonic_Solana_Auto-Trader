/**
 * Phase 30 — Creator Intelligence Fixture Models v1: deterministic fixtures.
 */

import { buildCreatorIntelligenceFixture } from './fixture-model-builders.js';
import type {
  CreatorCredibilityIndicator,
  CreatorDisclosureSignalFixture,
  CreatorEngagementPatternFixture,
  CreatorIntelligenceFixture,
  CreatorIntelligenceFixtureName,
  CreatorRiskIndicator,
  CreatorSocialSignalFixture,
} from './fixture-model-types.js';

function credibility(code: string, label: string, level: CreatorCredibilityIndicator['level'], rationale: string): CreatorCredibilityIndicator {
  return { code, label, level, rationale };
}

function risk(code: string, label: string, level: CreatorRiskIndicator['level'], rationale: string): CreatorRiskIndicator {
  return { code, label, level, rationale };
}

function social(
  signalType: CreatorSocialSignalFixture['signalType'],
  pattern: CreatorSocialSignalFixture['pattern'],
  sentiment: CreatorSocialSignalFixture['sentiment'],
  confidenceBand: CreatorSocialSignalFixture['confidenceBand'],
  notes: readonly string[],
): CreatorSocialSignalFixture {
  return {
    platform: 'synthetic_social_graph',
    signalType,
    pattern,
    sentiment,
    confidenceBand,
    notes,
  };
}

function disclosure(
  disclosureType: CreatorDisclosureSignalFixture['disclosureType'],
  clarity: CreatorDisclosureSignalFixture['clarity'],
  present: boolean,
  notes: readonly string[],
): CreatorDisclosureSignalFixture {
  return { disclosureType, clarity, present, notes };
}

function engagement(
  pattern: CreatorEngagementPatternFixture['pattern'],
  cadence: CreatorEngagementPatternFixture['cadence'],
  accountDiversity: CreatorEngagementPatternFixture['accountDiversity'],
  evidenceTags: readonly string[],
): CreatorEngagementPatternFixture {
  return { pattern, cadence, accountDiversity, evidenceTags };
}

function mustBuildFixture(input: Parameters<typeof buildCreatorIntelligenceFixture>[0]): CreatorIntelligenceFixture {
  const result = buildCreatorIntelligenceFixture(input);
  if (!result.success || !result.fixture) {
    throw new Error(`Invalid Phase 30 fixture definition: ${input.name}`);
  }
  return result.fixture;
}

export const CREDIBLE_TRANSPARENT_CREATOR_FIXTURE = mustBuildFixture({
  name: 'credible-transparent-creator',
  kind: 'transparent',
  profile: {
    creatorId: 'fixture_creator_transparent_001',
    alias: 'Transparent Fixture Creator Alpha',
    presentation: 'transparent_fixture',
    accountAgeBand: 'established',
    consistencyBand: 'high',
    transparencyBand: 'high',
    syntheticPersona: 'Synthetic transparent builder with consistent disclosure habits.',
  },
  project: {
    projectId: 'fixture_project_transparent_001',
    projectLabel: 'Transparent Toolkit',
    category: 'tooling',
    lifecycle: 'active',
  },
  narrative: {
    primaryTheme: 'Practical tool updates with explicit limitations.',
    messageStyle: 'balanced',
    languageQuality: 'clear',
    evidenceTags: ['consistent-updates', 'explicit-limitations', 'transparent-roadmap'],
  },
  socialSignals: [
    social('community-feedback', 'organic', 'supportive', 'high', ['Constructive replies reference documented updates.']),
    social('disclosure-reference', 'consistent', 'supportive', 'high', ['Synthetic audience acknowledges clear attribution notes.']),
  ],
  disclosureSignals: [
    disclosure('team-affiliation', 'clear', true, ['Synthetic profile clearly labels project role.']),
    disclosure('risk-statement', 'clear', true, ['Fixture narrative includes neutral limitation notes.']),
  ],
  engagementPatterns: [engagement('organic', 'steady', 'diverse', ['broad-reply-mix', 'steady-cadence'])],
  riskIndicators: [risk('LIMITED_SCALE', 'Limited scale', 'low', 'Signals are constructive but still fixture-only and incomplete.')],
  credibilityIndicators: [
    credibility('CONSISTENT_DISCLOSURE', 'Consistent disclosure', 'high', 'Disclosure wording remains clear across synthetic posts.'),
    credibility('STEADY_ENGAGEMENT', 'Steady engagement', 'high', 'Synthetic engagement remains distributed and non-bursty.'),
    credibility('NARRATIVE_CLARITY', 'Narrative clarity', 'high', 'Narrative claims remain bounded and specific.'),
  ],
  safeNotes: ['Credible transparent creator fixture.', 'Safe for offline regression coverage.'],
});

export const ANONYMOUS_CONSISTENT_CREATOR_FIXTURE = mustBuildFixture({
  name: 'anonymous-consistent-creator',
  kind: 'anonymous-consistent',
  profile: {
    creatorId: 'fixture_creator_anonymous_002',
    alias: 'Anonymous Fixture Creator Beta',
    presentation: 'anonymous_fixture',
    accountAgeBand: 'established',
    consistencyBand: 'high',
    transparencyBand: 'moderate',
    syntheticPersona: 'Synthetic anonymous profile with consistent style and no identity claims.',
  },
  project: {
    projectId: 'fixture_project_anonymous_002',
    projectLabel: 'Quiet Community Project',
    category: 'community',
    lifecycle: 'active',
  },
  narrative: {
    primaryTheme: 'Anonymous operator shares bounded progress updates.',
    messageStyle: 'balanced',
    languageQuality: 'clear',
    evidenceTags: ['anonymous-disclosure', 'bounded-claims', 'repeatable-tone'],
  },
  socialSignals: [social('comment-pattern', 'consistent', 'neutral', 'moderate', ['Synthetic replies stay measured and repetitive in a stable way.'])],
  disclosureSignals: [
    disclosure('anonymous-status', 'clear', true, ['Anonymous status is explicitly stated without identity claims.']),
    disclosure('risk-statement', 'partial', true, ['Risk framing exists but remains concise.']),
  ],
  engagementPatterns: [engagement('consistent-low-volume', 'steady', 'diverse', ['modest-reply-count', 'stable-cadence'])],
  riskIndicators: [risk('ANONYMITY_LIMITATION', 'Anonymity limitation', 'medium', 'Identity remains undisclosed and should stay unresolved.')],
  credibilityIndicators: [
    credibility('STYLE_CONSISTENCY', 'Style consistency', 'high', 'Tone remains stable across synthetic narratives.'),
    credibility('ANON_DISCLOSED', 'Anonymous status disclosed', 'moderate', 'Fixture explicitly labels anonymous operation.'),
  ],
  safeNotes: ['Anonymous but consistent creator fixture.'],
});

export const NEW_ACCOUNT_RISK_CREATOR_FIXTURE = mustBuildFixture({
  name: 'new-account-risk-creator',
  kind: 'new-account-risk',
  profile: {
    creatorId: 'fixture_creator_new_003',
    alias: 'New Fixture Creator Gamma',
    presentation: 'pseudonymous_fixture',
    accountAgeBand: 'new',
    consistencyBand: 'low',
    transparencyBand: 'low',
    syntheticPersona: 'Synthetic newly created profile with limited observable history.',
  },
  project: {
    projectId: 'fixture_project_new_003',
    projectLabel: 'Fresh Launch Story',
    category: 'experimental',
    lifecycle: 'launching',
  },
  narrative: {
    primaryTheme: 'Early-stage launch thread with little historical support.',
    messageStyle: 'minimal',
    languageQuality: 'vague',
    evidenceTags: ['limited-history', 'minimal-context'],
  },
  socialSignals: [social('account-age', 'low-signal', 'neutral', 'low', ['Synthetic account-age signal indicates limited history.'])],
  disclosureSignals: [disclosure('track-record', 'absent', false, ['No historical disclosure context is provided.'])],
  engagementPatterns: [engagement('consistent-low-volume', 'sporadic', 'unknown', ['thin-engagement'])],
  riskIndicators: [
    risk('NEW_ACCOUNT_LOW_HISTORY', 'New account low history', 'high', 'Synthetic profile has insufficient history for confidence.'),
    risk('DISCLOSURE_GAP', 'Disclosure gap', 'medium', 'Track-record disclosure is absent.'),
  ],
  credibilityIndicators: [credibility('LIMITED_BOUNDED_CLAIMS', 'Limited bounded claims', 'low', 'Claims stay small but evidence remains thin.')],
  safeNotes: ['Newly created account risk fixture.'],
});

export const OVERPROMOTIONAL_NARRATIVE_CREATOR_FIXTURE = mustBuildFixture({
  name: 'overpromotional-narrative-creator',
  kind: 'narrative-risk',
  profile: {
    creatorId: 'fixture_creator_promo_004',
    alias: 'Promotional Fixture Creator Delta',
    presentation: 'pseudonymous_fixture',
    accountAgeBand: 'recent',
    consistencyBand: 'moderate',
    transparencyBand: 'low',
    syntheticPersona: 'Synthetic promoter profile using exaggerated framing without actionable language.',
  },
  project: {
    projectId: 'fixture_project_promo_004',
    projectLabel: 'Narrative Momentum Story',
    category: 'meme',
    lifecycle: 'launching',
  },
  narrative: {
    primaryTheme: 'High-certainty storytelling with little grounding detail.',
    messageStyle: 'overpromotional',
    languageQuality: 'exaggerated',
    evidenceTags: ['certainty-framing', 'scarcity-framing', 'missing-grounding'],
  },
  socialSignals: [social('narrative-amplification', 'bursty', 'mixed', 'moderate', ['Synthetic amplification spikes around repeated certainty framing.'])],
  disclosureSignals: [disclosure('risk-statement', 'poor', true, ['Risk framing is vague and buried.'])],
  engagementPatterns: [engagement('suspicious-burst', 'bursty', 'narrow', ['rapid-amplification', 'thin-response-depth'])],
  riskIndicators: [
    risk('PROMOTIONAL_FRAMING', 'Promotional framing', 'high', 'Narrative overstates confidence without sufficient context.'),
    risk('DISCLOSURE_GAP', 'Disclosure gap', 'medium', 'Risk framing is not clear enough.'),
  ],
  credibilityIndicators: [credibility('SOME_CONTEXT_PRESENT', 'Some context present', 'low', 'A limited amount of synthetic context exists, but not enough.')],
  safeNotes: ['Overpromotional narrative risk fixture.'],
});

export const SUSPICIOUS_ENGAGEMENT_CREATOR_FIXTURE = mustBuildFixture({
  name: 'suspicious-engagement-creator',
  kind: 'engagement-risk',
  profile: {
    creatorId: 'fixture_creator_engagement_005',
    alias: 'Engagement Fixture Creator Epsilon',
    presentation: 'anonymous_fixture',
    accountAgeBand: 'recent',
    consistencyBand: 'low',
    transparencyBand: 'low',
    syntheticPersona: 'Synthetic profile with bursty attention patterns and sparse context.',
  },
  project: {
    projectId: 'fixture_project_engagement_005',
    projectLabel: 'Signal Swell',
    category: 'community',
    lifecycle: 'launching',
  },
  narrative: {
    primaryTheme: 'Sparse updates surrounded by irregular attention bursts.',
    messageStyle: 'mixed',
    languageQuality: 'vague',
    evidenceTags: ['bursty-attention', 'reply-homogeneity'],
  },
  socialSignals: [social('comment-pattern', 'coordinated', 'mixed', 'high', ['Synthetic comments repeat similar praise structures.'])],
  disclosureSignals: [disclosure('anonymous-status', 'partial', true, ['Anonymous status is implied but not clearly framed.'])],
  engagementPatterns: [engagement('suspicious-burst', 'bursty', 'narrow', ['repeat-comment-shapes', 'thin-account-diversity'])],
  riskIndicators: [
    risk('SUSPICIOUS_ENGAGEMENT_CLUSTER', 'Suspicious engagement cluster', 'high', 'Engagement shape suggests inorganic amplification in synthetic data.'),
    risk('DISCLOSURE_GAP', 'Disclosure gap', 'medium', 'Context around attention spikes is incomplete.'),
  ],
  credibilityIndicators: [],
  safeNotes: ['Suspicious engagement pattern fixture.'],
});

export const CLEAR_DISCLOSURE_CREATOR_FIXTURE = mustBuildFixture({
  name: 'clear-disclosure-creator',
  kind: 'disclosure-clear',
  profile: {
    creatorId: 'fixture_creator_disclosure_clear_006',
    alias: 'Disclosure Fixture Creator Zeta',
    presentation: 'transparent_fixture',
    accountAgeBand: 'established',
    consistencyBand: 'high',
    transparencyBand: 'high',
    syntheticPersona: 'Synthetic creator that clearly labels scope and affiliation.',
  },
  project: {
    projectId: 'fixture_project_disclosure_clear_006',
    projectLabel: 'Disclosure Practice Lab',
    category: 'education',
    lifecycle: 'active',
  },
  narrative: {
    primaryTheme: 'Education-first updates with explicit relationship labels.',
    messageStyle: 'technical',
    languageQuality: 'clear',
    evidenceTags: ['scope-disclosure', 'role-disclosure', 'limitation-disclosure'],
  },
  socialSignals: [social('disclosure-reference', 'organic', 'supportive', 'moderate', ['Synthetic replies reference the explicit disclosure block.'])],
  disclosureSignals: [
    disclosure('team-affiliation', 'clear', true, ['Team relationship is clearly described.']),
    disclosure('paid-promotion', 'clear', false, ['Synthetic fixture states no paid promotion context.']),
    disclosure('risk-statement', 'clear', true, ['Explicit statement that fixture models are non-advisory.']),
  ],
  engagementPatterns: [engagement('organic', 'steady', 'diverse', ['distributed-engagement'])],
  riskIndicators: [],
  credibilityIndicators: [
    credibility('DISCLOSURE_COMPLETENESS', 'Disclosure completeness', 'high', 'Multiple disclosure dimensions are explicit and bounded.'),
    credibility('ROLE_CLARITY', 'Role clarity', 'high', 'Role is described without identity resolution.'),
  ],
  safeNotes: ['Clear disclosure pattern fixture.'],
});

export const POOR_DISCLOSURE_CREATOR_FIXTURE = mustBuildFixture({
  name: 'poor-disclosure-creator',
  kind: 'disclosure-poor',
  profile: {
    creatorId: 'fixture_creator_disclosure_poor_007',
    alias: 'Sparse Disclosure Fixture Creator Eta',
    presentation: 'pseudonymous_fixture',
    accountAgeBand: 'recent',
    consistencyBand: 'moderate',
    transparencyBand: 'low',
    syntheticPersona: 'Synthetic profile that shares updates without enough disclosure context.',
  },
  project: {
    projectId: 'fixture_project_disclosure_poor_007',
    projectLabel: 'Sparse Context Story',
    category: 'experimental',
    lifecycle: 'launching',
  },
  narrative: {
    primaryTheme: 'Narrative omits relationship and sponsorship context.',
    messageStyle: 'minimal',
    languageQuality: 'vague',
    evidenceTags: ['missing-affiliation-context', 'missing-risk-context'],
  },
  socialSignals: [social('community-feedback', 'low-signal', 'neutral', 'low', ['Synthetic responses ask for missing context.'])],
  disclosureSignals: [
    disclosure('team-affiliation', 'poor', true, ['Relationship context is vague and incomplete.']),
    disclosure('paid-promotion', 'absent', false, ['No sponsorship context is provided.']),
  ],
  engagementPatterns: [engagement('consistent-low-volume', 'sporadic', 'unknown', ['context-requests'])],
  riskIndicators: [
    risk('POOR_DISCLOSURE_QUALITY', 'Poor disclosure quality', 'high', 'Disclosure language is incomplete or absent.'),
    risk('LIMITED_CONTEXT', 'Limited context', 'medium', 'Synthetic narrative leaves major gaps unaddressed.'),
  ],
  credibilityIndicators: [],
  safeNotes: ['Poor disclosure pattern fixture.'],
});

export const RECYCLED_NARRATIVE_CREATOR_FIXTURE = mustBuildFixture({
  name: 'recycled-narrative-creator',
  kind: 'narrative-recycled',
  profile: {
    creatorId: 'fixture_creator_recycled_008',
    alias: 'Recycled Narrative Fixture Creator Theta',
    presentation: 'anonymous_fixture',
    accountAgeBand: 'established',
    consistencyBand: 'moderate',
    transparencyBand: 'low',
    syntheticPersona: 'Synthetic profile repeatedly reuses narrative framing across projects.',
  },
  project: {
    projectId: 'fixture_project_recycled_008',
    projectLabel: 'Echo Narrative Stack',
    category: 'meme',
    lifecycle: 'active',
  },
  narrative: {
    primaryTheme: 'Repeated template language appears across synthetic projects.',
    messageStyle: 'recycled',
    languageQuality: 'recycled',
    evidenceTags: ['template-reuse', 'repeat-tagline', 'low-specificity'],
  },
  socialSignals: [social('narrative-amplification', 'consistent', 'neutral', 'moderate', ['Synthetic amplification follows repeated template wording.'])],
  disclosureSignals: [disclosure('track-record', 'partial', true, ['Some history is referenced, but narrative details stay repetitive.'])],
  engagementPatterns: [engagement('consistent-low-volume', 'steady', 'narrow', ['template-engagement'])],
  riskIndicators: [risk('RECYCLED_NARRATIVE', 'Recycled narrative', 'high', 'Narrative structure appears repeatedly reused.')],
  credibilityIndicators: [credibility('RECOGNIZABLE_STYLE', 'Recognizable style', 'low', 'Consistency exists but may reflect template reuse rather than clarity.')],
  safeNotes: ['Recycled narrative pattern fixture.'],
});

export const COORDINATED_HYPE_CREATOR_FIXTURE = mustBuildFixture({
  name: 'coordinated-hype-creator',
  kind: 'coordinated-hype',
  profile: {
    creatorId: 'fixture_creator_hype_009',
    alias: 'Coordinated Hype Fixture Creator Iota',
    presentation: 'pseudonymous_fixture',
    accountAgeBand: 'recent',
    consistencyBand: 'low',
    transparencyBand: 'low',
    syntheticPersona: 'Synthetic promoter profile with concentrated amplification bursts.',
  },
  project: {
    projectId: 'fixture_project_hype_009',
    projectLabel: 'Hype Ladder',
    category: 'community',
    lifecycle: 'launching',
  },
  narrative: {
    primaryTheme: 'Amplification runs ahead of context quality.',
    messageStyle: 'overpromotional',
    languageQuality: 'exaggerated',
    evidenceTags: ['burst-amplification', 'scarcity-theme'],
  },
  socialSignals: [
    social('comment-pattern', 'coordinated', 'supportive', 'high', ['Synthetic comments arrive in dense repeated bursts.']),
    social('narrative-amplification', 'coordinated', 'supportive', 'high', ['Amplification closely mirrors launch timing.']),
  ],
  disclosureSignals: [disclosure('risk-statement', 'poor', true, ['Risk context exists only as a minimal afterthought.'])],
  engagementPatterns: [engagement('coordinated-hype', 'bursty', 'narrow', ['tight-burst-window', 'low-account-diversity'])],
  riskIndicators: [
    risk('COORDINATED_HYPE_PATTERN', 'Coordinated hype pattern', 'high', 'Synthetic pattern suggests coordinated amplification.'),
    risk('PROMOTIONAL_FRAMING', 'Promotional framing', 'high', 'Narrative emphasis outruns evidence quality.'),
  ],
  credibilityIndicators: [],
  safeNotes: ['Coordinated hype pattern fixture.'],
});

export const BENIGN_LOW_SIGNAL_CREATOR_FIXTURE = mustBuildFixture({
  name: 'benign-low-signal-creator',
  kind: 'low-signal',
  profile: {
    creatorId: 'fixture_creator_low_signal_010',
    alias: 'Low Signal Fixture Creator Kappa',
    presentation: 'pseudonymous_fixture',
    accountAgeBand: 'recent',
    consistencyBand: 'moderate',
    transparencyBand: 'moderate',
    syntheticPersona: 'Synthetic quiet profile with little activity and few strong signals.',
  },
  project: {
    projectId: 'fixture_project_low_signal_010',
    projectLabel: 'Quiet Sandbox',
    category: 'experimental',
    lifecycle: 'cooling',
  },
  narrative: {
    primaryTheme: 'Sparse updates with modest context and no obvious hype.',
    messageStyle: 'minimal',
    languageQuality: 'clear',
    evidenceTags: ['quiet-updates', 'limited-reach'],
  },
  socialSignals: [social('community-feedback', 'low-signal', 'neutral', 'low', ['Synthetic activity is quiet and low volume.'])],
  disclosureSignals: [disclosure('anonymous-status', 'partial', true, ['Basic context exists, but detail is limited.'])],
  engagementPatterns: [engagement('consistent-low-volume', 'steady', 'diverse', ['quiet-engagement'])],
  riskIndicators: [risk('LOW_SIGNAL_LIMITATION', 'Low signal limitation', 'low', 'There is not enough information for strong confidence.')],
  credibilityIndicators: [credibility('NO_HYPE_PRESSURE', 'No hype pressure', 'moderate', 'Synthetic narrative stays restrained and non-urgent.')],
  safeNotes: ['Benign low-signal creator fixture.'],
});

export const HIGH_RISK_CREATOR_FIXTURE = mustBuildFixture({
  name: 'high-risk-creator',
  kind: 'high-risk',
  profile: {
    creatorId: 'fixture_creator_high_risk_011',
    alias: 'High Risk Fixture Creator Lambda',
    presentation: 'anonymous_fixture',
    accountAgeBand: 'recent',
    consistencyBand: 'low',
    transparencyBand: 'low',
    syntheticPersona: 'Synthetic profile combining multiple narrative, disclosure, and engagement concerns.',
  },
  project: {
    projectId: 'fixture_project_high_risk_011',
    projectLabel: 'Critical Risk Narrative',
    category: 'meme',
    lifecycle: 'launching',
  },
  narrative: {
    primaryTheme: 'Risk-heavy synthetic case with concentrated weak signals.',
    messageStyle: 'overpromotional',
    languageQuality: 'exaggerated',
    evidenceTags: ['unclear-context', 'reused-framing', 'thin-disclosure'],
  },
  socialSignals: [social('comment-pattern', 'coordinated', 'mixed', 'high', ['Synthetic attention appears concentrated and repetitive.'])],
  disclosureSignals: [
    disclosure('team-affiliation', 'poor', true, ['Affiliation context remains unclear.']),
    disclosure('paid-promotion', 'absent', false, ['Promotion context is missing.']),
  ],
  engagementPatterns: [engagement('coordinated-hype', 'bursty', 'narrow', ['concentrated-attention', 'repetitive-replies'])],
  riskIndicators: [
    risk('COMBINED_RISK_STACK', 'Combined risk stack', 'critical', 'Multiple synthetic risk indicators cluster together.'),
    risk('POOR_DISCLOSURE_QUALITY', 'Poor disclosure quality', 'high', 'Disclosure remains incomplete.'),
    risk('SUSPICIOUS_ENGAGEMENT_CLUSTER', 'Suspicious engagement cluster', 'high', 'Engagement remains narrow and bursty.'),
  ],
  credibilityIndicators: [],
  safeNotes: ['High-risk creator fixture.'],
});

export const MALFORMED_INPUT_SAFE_CREATOR_FIXTURE = mustBuildFixture({
  name: 'malformed-input-safe-creator',
  kind: 'malformed-safe',
  profile: {
    creatorId: 'fixture_creator_safe_012',
    alias: 'Malformed Input Safe Fixture Creator Mu',
    presentation: 'unknown_fixture',
    accountAgeBand: 'unknown',
    consistencyBand: 'unknown',
    transparencyBand: 'unknown',
    syntheticPersona: 'Synthetic sanitized fallback profile used for malformed-input-safe coverage.',
  },
  project: {
    projectId: 'fixture_project_safe_012',
    projectLabel: 'Sanitized Placeholder',
    category: 'unknown',
    lifecycle: 'unknown',
  },
  narrative: {
    primaryTheme: 'Sanitized placeholder narrative for malformed input boundaries.',
    messageStyle: 'unknown',
    languageQuality: 'unknown',
    evidenceTags: ['sanitized-placeholder'],
  },
  socialSignals: [],
  disclosureSignals: [disclosure('unknown', 'unknown', false, ['Sanitized placeholder disclosure.'])],
  engagementPatterns: [engagement('unknown', 'unknown', 'unknown', ['sanitized-placeholder'])],
  riskIndicators: [risk('INPUT_SANITIZED', 'Input sanitized', 'medium', 'Fixture demonstrates deterministic sanitized fallback output.')],
  credibilityIndicators: [],
  safeNotes: ['Malformed-input-safe creator fixture.'],
});

export const SAFETY_BOUNDARY_CREATOR_FIXTURE = mustBuildFixture({
  name: 'safety-boundary-creator',
  kind: 'safety-boundary',
  profile: {
    creatorId: 'fixture_creator_boundary_013',
    alias: 'Safety Boundary Fixture Creator Nu',
    presentation: 'transparent_fixture',
    accountAgeBand: 'established',
    consistencyBand: 'high',
    transparencyBand: 'high',
    syntheticPersona: 'Synthetic profile explicitly designed to reinforce Phase 30 safety boundaries.',
  },
  project: {
    projectId: 'fixture_project_boundary_013',
    projectLabel: 'Boundary Guardrail Lab',
    category: 'education',
    lifecycle: 'active',
  },
  narrative: {
    primaryTheme: 'Boundary-first fixture demonstrating local-only synthetic scope.',
    messageStyle: 'technical',
    languageQuality: 'clear',
    evidenceTags: ['local-only', 'synthetic-only', 'non-advisory'],
  },
  socialSignals: [social('disclosure-reference', 'organic', 'supportive', 'moderate', ['Synthetic notes reinforce local-only scope.'])],
  disclosureSignals: [
    disclosure('risk-statement', 'clear', true, ['Fixture states that it is non-advisory and offline-only.']),
    disclosure('track-record', 'clear', true, ['Synthetic track-record labels stay bounded and local-only.']),
  ],
  engagementPatterns: [engagement('organic', 'steady', 'diverse', ['boundary-confirmation'])],
  riskIndicators: [],
  credibilityIndicators: [
    credibility('BOUNDARY_CLARITY', 'Boundary clarity', 'high', 'Fixture explicitly states local-only synthetic limits.'),
    credibility('READ_ONLY_SCOPE', 'Read-only scope', 'high', 'Fixture metadata remains read-only and deterministic.'),
  ],
  safeNotes: ['Safety-boundary creator fixture.'],
});

export const BALANCED_MIXED_SIGNAL_CREATOR_FIXTURE = mustBuildFixture({
  name: 'balanced-mixed-signal-creator',
  kind: 'mixed-signal',
  profile: {
    creatorId: 'fixture_creator_mixed_014',
    alias: 'Balanced Mixed Fixture Creator Xi',
    presentation: 'pseudonymous_fixture',
    accountAgeBand: 'established',
    consistencyBand: 'moderate',
    transparencyBand: 'moderate',
    syntheticPersona: 'Synthetic creator with both bounded strengths and notable concerns.',
  },
  project: {
    projectId: 'fixture_project_mixed_014',
    projectLabel: 'Mixed Signal Studio',
    category: 'tooling',
    lifecycle: 'active',
  },
  narrative: {
    primaryTheme: 'Some credible delivery signs coexist with context and disclosure gaps.',
    messageStyle: 'mixed',
    languageQuality: 'clear',
    evidenceTags: ['mixed-disclosure', 'steady-but-thin-engagement'],
  },
  socialSignals: [
    social('community-feedback', 'organic', 'supportive', 'moderate', ['Synthetic replies cite useful updates.']),
    social('comment-pattern', 'bursty', 'mixed', 'low', ['Some irregular reply bursts remain unexplained.']),
  ],
  disclosureSignals: [
    disclosure('team-affiliation', 'partial', true, ['Role context exists but lacks full detail.']),
    disclosure('risk-statement', 'clear', true, ['Limitations are disclosed clearly.']),
  ],
  engagementPatterns: [engagement('organic', 'steady', 'diverse', ['useful-discussion']), engagement('consistent-low-volume', 'steady', 'diverse', ['thin-volume'])],
  riskIndicators: [risk('PARTIAL_DISCLOSURE', 'Partial disclosure', 'medium', 'Some disclosure context remains incomplete.')],
  credibilityIndicators: [
    credibility('USEFUL_CONTEXT', 'Useful context', 'moderate', 'Narrative includes bounded and specific details.'),
    credibility('STEADY_UPDATES', 'Steady updates', 'moderate', 'Synthetic cadence is mostly consistent.'),
  ],
  safeNotes: ['Balanced mixed-signal creator fixture.'],
});

export const UNKNOWN_INSUFFICIENT_DATA_CREATOR_FIXTURE = mustBuildFixture({
  name: 'unknown-insufficient-data-creator',
  kind: 'unknown',
  profile: {
    creatorId: 'fixture_creator_unknown_015',
    alias: 'Unknown Fixture Creator Omicron',
    presentation: 'unknown_fixture',
    accountAgeBand: 'unknown',
    consistencyBand: 'unknown',
    transparencyBand: 'unknown',
    syntheticPersona: 'Synthetic insufficient-data profile with intentionally sparse bounded metadata.',
  },
  project: {
    projectId: 'fixture_project_unknown_015',
    projectLabel: 'Unknown Context Sandbox',
    category: 'unknown',
    lifecycle: 'unknown',
  },
  narrative: {
    primaryTheme: 'Insufficient bounded context for meaningful offline assessment.',
    messageStyle: 'unknown',
    languageQuality: 'unknown',
    evidenceTags: ['insufficient-data'],
  },
  socialSignals: [],
  disclosureSignals: [],
  engagementPatterns: [],
  riskIndicators: [risk('INSUFFICIENT_DATA', 'Insufficient data', 'medium', 'Synthetic fixture intentionally contains too little evidence for strong conclusions.')],
  credibilityIndicators: [],
  safeNotes: ['Unknown insufficient-data creator fixture.'],
});

export const PHASE_30_CREATOR_INTELLIGENCE_FIXTURES = new Map<CreatorIntelligenceFixtureName, CreatorIntelligenceFixture>([
  ['credible-transparent-creator', CREDIBLE_TRANSPARENT_CREATOR_FIXTURE],
  ['anonymous-consistent-creator', ANONYMOUS_CONSISTENT_CREATOR_FIXTURE],
  ['new-account-risk-creator', NEW_ACCOUNT_RISK_CREATOR_FIXTURE],
  ['overpromotional-narrative-creator', OVERPROMOTIONAL_NARRATIVE_CREATOR_FIXTURE],
  ['suspicious-engagement-creator', SUSPICIOUS_ENGAGEMENT_CREATOR_FIXTURE],
  ['clear-disclosure-creator', CLEAR_DISCLOSURE_CREATOR_FIXTURE],
  ['poor-disclosure-creator', POOR_DISCLOSURE_CREATOR_FIXTURE],
  ['recycled-narrative-creator', RECYCLED_NARRATIVE_CREATOR_FIXTURE],
  ['coordinated-hype-creator', COORDINATED_HYPE_CREATOR_FIXTURE],
  ['benign-low-signal-creator', BENIGN_LOW_SIGNAL_CREATOR_FIXTURE],
  ['high-risk-creator', HIGH_RISK_CREATOR_FIXTURE],
  ['malformed-input-safe-creator', MALFORMED_INPUT_SAFE_CREATOR_FIXTURE],
  ['safety-boundary-creator', SAFETY_BOUNDARY_CREATOR_FIXTURE],
  ['balanced-mixed-signal-creator', BALANCED_MIXED_SIGNAL_CREATOR_FIXTURE],
  ['unknown-insufficient-data-creator', UNKNOWN_INSUFFICIENT_DATA_CREATOR_FIXTURE],
]);

export function listCreatorIntelligenceFixtures(): readonly CreatorIntelligenceFixtureName[] {
  return [...PHASE_30_CREATOR_INTELLIGENCE_FIXTURES.keys()].sort((left, right) => left.localeCompare(right));
}

export function getCreatorIntelligenceFixture(name: CreatorIntelligenceFixtureName): CreatorIntelligenceFixture | undefined {
  return PHASE_30_CREATOR_INTELLIGENCE_FIXTURES.get(name);
}
