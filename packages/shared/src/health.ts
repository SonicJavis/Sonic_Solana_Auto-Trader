export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthReport {
  readonly status: HealthStatus;
  readonly version: string;
  readonly uptimeSeconds: number;
  readonly mode: string;
  readonly telegramEnabled: boolean;
  readonly executionEnabled: boolean;
  readonly liveTradingEnabled: boolean;
  readonly checkedAt: string;
}
