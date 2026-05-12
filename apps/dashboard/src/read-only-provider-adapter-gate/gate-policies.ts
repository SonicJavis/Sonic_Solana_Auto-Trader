import type {
  BuildReadOnlyProviderGatePolicyInput,
  ReadOnlyProviderGatePolicy,
  ReadOnlyProviderGatePolicyKind,
} from './types.js';
import { READ_ONLY_PROVIDER_GATE_POLICY_KINDS } from './types.js';

const DEFAULT_ENABLED_POLICIES = new Set<ReadOnlyProviderGatePolicyKind>([
  'read_only_capability_required',
  'network_disabled_by_default',
  'live_provider_disabled_by_default',
  'execution_capability_forbidden',
  'wallet_capability_forbidden',
  'signing_capability_forbidden',
  'transaction_sending_forbidden',
  'runtime_request_forbidden',
  'unsafe_provider_rejected',
  'manual_unlock_required_for_future_phase',
]);

export function buildReadOnlyProviderGatePolicy(
  input: BuildReadOnlyProviderGatePolicyInput,
): ReadOnlyProviderGatePolicy {
  return {
    policyId: `${input.fixtureId}-policy-${input.policyKind}`,
    policyKind: input.policyKind,
    required: true,
    enabled: input.enabled,
    evaluationNote: input.enabled
      ? 'Policy check enabled for fail-closed read-only gate.'
      : 'Policy check disabled and should reject fixture validation.',
  };
}

export function buildDefaultReadOnlyProviderGatePolicies(
  fixtureId: string,
): readonly ReadOnlyProviderGatePolicy[] {
  return READ_ONLY_PROVIDER_GATE_POLICY_KINDS.map(policyKind =>
    buildReadOnlyProviderGatePolicy({
      fixtureId,
      policyKind,
      enabled: DEFAULT_ENABLED_POLICIES.has(policyKind),
    }),
  );
}
