export function buildSnapshotScenarioGenerationRules(input: {
  stale: boolean;
  blocked: boolean;
  quarantined: boolean;
  replayReady: boolean;
  failClosed: boolean;
}): readonly string[] {
  return [
    'deterministic_fixture_only',
    'no_live_ingestion',
    'no_runtime_generation',
    'no_live_replay_import',
    input.stale ? 'stale_snapshot_warning_required' : 'stale_snapshot_not_detected',
    input.blocked ? 'critical_source_issue_generation_blocked' : 'critical_source_issue_not_detected',
    input.quarantined ? 'partial_snapshot_quarantine_required' : 'partial_snapshot_quarantine_not_required',
    input.replayReady ? 'replay_ready_descriptor_enabled' : 'replay_ready_descriptor_disabled',
    input.failClosed ? 'fail_closed_enforced' : 'fail_closed_relaxed_warning_only',
  ] as const;
}
