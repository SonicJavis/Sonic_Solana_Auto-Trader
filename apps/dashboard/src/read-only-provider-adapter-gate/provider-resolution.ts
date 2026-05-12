import type {
  BuildReadOnlyProviderResolutionResultInput,
  ReadOnlyProviderPolicyEvaluationResult,
  ReadOnlyProviderResolutionResult,
} from './types.js';

function evaluatePolicy(
  policyKind: string,
  candidateValue: boolean,
): ReadOnlyProviderPolicyEvaluationResult {
  return {
    policyKind: policyKind as ReadOnlyProviderPolicyEvaluationResult['policyKind'],
    passed: candidateValue,
    expected: true,
    actual: candidateValue,
    note: candidateValue ? 'Policy check passed for synthetic fixture.' : 'Policy check failed and gate remains closed.',
  };
}

export function buildReadOnlyProviderResolutionResult(
  input: BuildReadOnlyProviderResolutionResultInput,
): ReadOnlyProviderResolutionResult {
  const capability = input.candidate.requestedCapabilities;

  const policyResults = input.policies.map(policy => {
    const actual =
      policy.policyKind === 'read_only_capability_required'
        ? capability.readOnly
        : policy.policyKind === 'network_disabled_by_default'
          ? !capability.networkAccess
          : policy.policyKind === 'live_provider_disabled_by_default'
            ? !capability.liveProvider
            : policy.policyKind === 'execution_capability_forbidden'
              ? !capability.executionCapability
              : policy.policyKind === 'wallet_capability_forbidden'
                ? !capability.walletCapability
                : policy.policyKind === 'signing_capability_forbidden'
                  ? !capability.signingCapability
                  : policy.policyKind === 'transaction_sending_forbidden'
                    ? !capability.transactionSendingCapability
                    : policy.policyKind === 'runtime_request_forbidden'
                      ? !capability.runtimeRequestCapability
                      : policy.policyKind === 'unsafe_provider_rejected'
                        ? !capability.unsafeProvider
                        : policy.policyKind === 'manual_unlock_required_for_future_phase'
                          ? true
                          : false;
    return evaluatePolicy(policy.policyKind, actual && policy.enabled);
  });

  return {
    resolutionId: `${input.fixtureId}-resolution`,
    resolvedState: input.state.stateKind,
    allowed: input.state.allowed,
    failClosed: true,
    policyResults,
    rejectionReasons: input.rejectionReasons,
    manualUnlockRequired: true,
    futurePhaseOnly: true,
    safetySummary:
      'Fail-closed gate evaluation for synthetic read-only provider fixture. Not live and not executable.',
    validationSummary:
      'Resolution derived deterministically from candidate capabilities, policy checks, and fixture state.',
  };
}
