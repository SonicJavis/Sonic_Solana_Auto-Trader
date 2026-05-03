import { APP_VERSION, PHASE, PHASE_NAME } from '@sonic/shared';

export function formatVersion(nodeEnv: string): string {
  let gitCommit = 'unknown';
  try {
    const envCommit = process.env['GIT_COMMIT'] ?? process.env['COMMIT_SHA'];
    if (envCommit && envCommit.length > 0) {
      gitCommit = envCommit.slice(0, 8);
    }
  } catch {
    // ignore
  }

  return [
    'Sonic Solana Auto-Trader - Version',
    '',
    `App: Sonic Solana Auto-Trader`,
    `Version: ${APP_VERSION}`,
    `Phase: ${PHASE} - ${PHASE_NAME}`,
    `Git commit: ${gitCommit}`,
    `Node environment: ${nodeEnv}`,
    '',
    'Safety: trading disabled, execution disabled, wallet not implemented',
  ].join('\n');
}
