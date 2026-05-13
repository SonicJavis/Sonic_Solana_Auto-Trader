import type { SmokeReadinessViewModel } from './types.js';

export function buildSmokeViewModel(vm: SmokeReadinessViewModel): SmokeReadinessViewModel {
  return { ...vm };
}
