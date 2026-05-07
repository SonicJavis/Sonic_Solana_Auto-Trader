import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'packages/*/src/**/*.test.ts', 'apps/*/src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@sonic/state': resolve(__dirname, 'packages/state/src/index.ts'),
      '@sonic/shared': resolve(__dirname, 'packages/shared/src/index.ts'),
      '@sonic/config': resolve(__dirname, 'packages/config/src/index.ts'),
      '@sonic/db': resolve(__dirname, 'packages/db/src/index.ts'),
      '@sonic/mode-manager': resolve(__dirname, 'packages/mode-manager/src/index.ts'),
      '@sonic/observability': resolve(__dirname, 'packages/observability/src/index.ts'),
      '@sonic/risk-engine': resolve(__dirname, 'packages/risk-engine/src/index.ts'),
      '@sonic/pump-adapter': resolve(__dirname, 'packages/pump-adapter/src/index.ts'),
      '@sonic/event-engine': resolve(__dirname, 'packages/event-engine/src/index.ts'),
      '@sonic/token-intelligence': resolve(__dirname, 'packages/token-intelligence/src/index.ts'),
      '@sonic/creator-intelligence': resolve(__dirname, 'packages/creator-intelligence/src/index.ts'),
      '@sonic/wallet-intelligence': resolve(__dirname, 'packages/wallet-intelligence/src/index.ts'),
      '@sonic/manipulation-detector': resolve(__dirname, 'packages/manipulation-detector/src/index.ts'),
      '@sonic/testing': resolve(__dirname, 'packages/testing/src/index.ts'),
      '@sonic/replay-lab': resolve(__dirname, 'packages/replay-lab/src/index.ts'),
      '@sonic/replay-reporting': resolve(__dirname, 'packages/replay-reporting/src/index.ts'),
      '@sonic/strategy-intent': resolve(__dirname, 'packages/strategy-intent/src/index.ts'),
      '@sonic/strategy-evaluation': resolve(__dirname, 'packages/strategy-evaluation/src/index.ts'),
      '@sonic/evidence-ledger': resolve(__dirname, 'packages/evidence-ledger/src/index.ts'),
      '@sonic/dashboard-read-models': resolve(__dirname, 'packages/dashboard-read-models/src/index.ts'),
      '@sonic/read-only-api-contracts': resolve(__dirname, 'packages/read-only-api-contracts/src/index.ts'),
      '@sonic/read-only-api': resolve(__dirname, 'apps/read-only-api/src/index.ts'),
      '@sonic/read-only-api-client': resolve(__dirname, 'packages/read-only-api-client/src/index.ts'),
      '@sonic/dashboard-view-models': resolve(__dirname, 'packages/dashboard-view-models/src/index.ts'),
      '@sonic/dashboard': resolve(__dirname, 'apps/dashboard/src/index.ts'),
    },
  },
});
