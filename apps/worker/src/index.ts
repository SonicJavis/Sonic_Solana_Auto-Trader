import { loadConfig } from '@sonic/config';
import { createLogger, logAppStart, logModeLoaded, logConfigValidated, logWorkerHeartbeat } from '@sonic/observability';
import { InMemoryAuditLogger } from '@sonic/db';
import { ModeManager } from '@sonic/mode-manager';
import { APP_VERSION, HEARTBEAT_INTERVAL_MS } from '@sonic/shared';

const startTime = Date.now();

const config = loadConfig();
const logger = createLogger({ level: config.LOG_LEVEL, name: 'worker' });

logAppStart(logger, APP_VERSION, config.APP_MODE);
logConfigValidated(logger, true);

const auditLogger = new InMemoryAuditLogger();
const modeManager = new ModeManager(auditLogger, config.APP_MODE);

logModeLoaded(logger, modeManager.getMode());

logger.info({
  mode: modeManager.getMode(),
  tradingEnabled: false,
  executionEnabled: false,
  walletLoaded: false,
  liveProviderConnected: false,
  solanaRpcConnected: false,
}, 'Worker safe startup complete');

const heartbeat = setInterval(() => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  logWorkerHeartbeat(logger, uptimeSeconds, modeManager.getMode());
}, HEARTBEAT_INTERVAL_MS);

process.once('SIGINT', () => {
  clearInterval(heartbeat);
  logger.info('Worker shutting down');
  process.exit(0);
});

process.once('SIGTERM', () => {
  clearInterval(heartbeat);
  logger.info('Worker shutting down');
  process.exit(0);
});
